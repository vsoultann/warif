/**
 * Trains the Warif species classifier.
 *
 * Transfer learning: the vendored MobileNetV2 stays frozen and supplies a
 * 1280-d feature vector per image; only a small dense head is trained. That
 * head is a few hundred kilobytes, trains in a couple of minutes on CPU, and
 * is the only thing that has to be retrained when the team adds field photos.
 *
 * Images are read from, in order of preference:
 *   dataset/custom/<class>/        team's own kiosk photographs (weighted x3)
 *   dataset/inaturalist/<class>/   openly-licensed reference photographs
 *
 *   node tools/train.mjs [--epochs 60] [--no-cache]
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { SPECIES, CLASS_KEYS } from './species.mjs';
import os from 'node:os';
import crypto from 'node:crypto';
import { Worker } from 'node:worker_threads';
import { FEATURE_DIM, initBackend, tf } from './embed.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const CACHE = path.join(ROOT, 'dataset', 'cache');
const OUT = path.join(ROOT, 'app', 'model');

const argv = process.argv.slice(2);
const EPOCHS = Number(argv[argv.indexOf('--epochs') + 1]) || 60;
const USE_CACHE = !argv.includes('--no-cache');
const VAL_FRACTION = 0.15;
const CUSTOM_REPEATS = 3; // the team's own photos count for more than reference shots

/** Augmentation recipes applied to every training image (val gets none). */
const AUGS = [
  null,
  { flip: true },
  { crop: 0.82, dx: 0.5, dy: 0.5 },
  { crop: 0.78, dx: 0.2, dy: 0.8, flip: true },
  { brightness: 1.18, saturation: 0.85 },
  { brightness: 0.84, saturation: 1.15, flip: true },
  { rotate: 12 },
  { rotate: -12, crop: 0.88 },
  // The kiosk's own conditions: foliage alone on a plain backdrop, and the
  // white bands a 4:3 phone photo picks up when it is letterboxed to a square.
  { paper: 1 },
  { paper: 2, flip: true, crop: 0.86 },
  { paper: 3, rotate: 10 },
  { letterbox: true },
];

/** Label smoothing: stops the head being certain about field photos it half-understands. */
const SMOOTHING = 0.08;

/* deterministic shuffle so reruns are comparable */
function mulberry32(seed) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function shuffle(arr, rand) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

async function listDir(dir) {
  try {
    return (await fs.readdir(dir))
      .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
      .map((f) => path.join(dir, f));
  } catch { return []; }
}

/* ---------- 1. gather files ---------- */

console.log('Warif — training the species head\n');

const perClass = [];
for (const sp of SPECIES) {
  const custom = await listDir(path.join(ROOT, 'dataset', 'custom', sp.key));
  const inat = await listDir(path.join(ROOT, 'dataset', 'inaturalist', sp.key));
  const files = [
    ...custom.flatMap((f) => Array(CUSTOM_REPEATS).fill(f)),
    ...inat,
  ];
  if (!files.length) {
    console.error(`No images for "${sp.key}". Run: npm run fetch`);
    process.exit(1);
  }
  perClass.push({ sp, files, custom: custom.length, inat: inat.length });
  console.log(`  ${sp.en.padEnd(10)} ${String(inat.length).padStart(4)} reference` +
    (custom.length ? ` + ${custom.length} team photos (x${CUSTOM_REPEATS})` : ''));
}

/* ---------- 2. split ---------- */

// Several photos on iNaturalist often come from one observation -- the same
// tree, minutes apart. Splitting photo by photo let one land in training and its
// twin in validation, which flattered the accuracy. Split by observation, and
// keep a team photo and its close crop together for the same reason.
const observationOf = new Map();
try {
  const credits = JSON.parse(await fs.readFile(path.join(ROOT, 'dataset', 'inaturalist', 'CREDITS.json'), 'utf8'));
  for (const cls of Object.values(credits.classes || {})) {
    for (const c of cls.credits || []) observationOf.set(String(c.id), String(c.observation));
  }
} catch { /* no manifest: every photo is its own group */ }
const groupOf = (file) => {
  const id = path.basename(file).replace(/\.[^.]+$/, '').replace(/-crop$/, '');
  if (file.includes(`${path.sep}custom${path.sep}`)) return `custom:${id}`;
  return observationOf.get(id) ?? file;
};

const rand = mulberry32(20260902);
const train = [];
const val = [];
for (let c = 0; c < perClass.length; c++) {
  const unique = [...new Set(perClass[c].files)];
  const groups = new Map();
  for (const f of unique) {
    const g = groupOf(f);
    if (!groups.has(g)) groups.set(g, []);
    groups.get(g).push(f);
  }
  // Team photos are too few to spare: they always train. The held-out kiosk
  // photos in dataset/kiosk-test are the test of them.
  const order = shuffle([...groups.keys()].filter((g) => !g.startsWith('custom:')).sort(), rand);
  const target = Math.max(4, Math.round(unique.length * VAL_FRACTION));
  const valFiles = new Set();
  for (const g of order) {
    if (valFiles.size >= target) break;
    for (const f of groups.get(g)) valFiles.add(f);
  }
  const trainFiles = perClass[c].files.filter((f) => !valFiles.has(f));
  for (const f of valFiles) val.push({ file: f, label: c, aug: null });
  for (const f of trainFiles) for (const aug of AUGS) train.push({ file: f, label: c, aug });
}
// The kiosk test: the same validation leaves, cut out and laid on paper.
const valKiosk = val.map((v) => ({ ...v, aug: { paper: 1 } }));
shuffle(train, rand);
console.log(`\n  ${train.length} training samples (after ${AUGS.length}x augmentation), ${val.length} validation\n`);

/* ---------- 3. embed ---------- */

const LANES = Math.max(1, Math.min(14, os.cpus().length - 4));
console.log(`  Embedding with ${LANES} parallel MobileNetV2 workers...`);

const pool = await Promise.all(Array.from({ length: LANES }, () => new Promise((resolve, reject) => {
  const w = new Worker(new URL('./embed-worker.mjs', import.meta.url));
  w.once('message', () => resolve(w));
  w.once('error', reject);
})));

async function embedAll(items, label) {
  const digest = crypto.createHash('sha1')
    .update(JSON.stringify(items.map((it) => [path.relative(ROOT, it.file), it.aug])))
    .digest('hex').slice(0, 16);
  const cacheFile = path.join(CACHE, `${label}-${digest}.bin`);
  if (USE_CACHE) {
    try {
      const buf = await fs.readFile(cacheFile);
      console.log(`  ${label}: reusing cached embeddings`);
      return new Float32Array(buf.buffer, buf.byteOffset, buf.byteLength / 4);
    } catch { /* no cache yet */ }
  }

  const out = new Float32Array(items.length * FEATURE_DIM);
  const CHUNK = 48;
  const t0 = Date.now();
  let next = 0, done = 0, seq = 0;
  await Promise.all(pool.map((w) => new Promise((resolve) => {
    const pump = () => {
      if (next >= items.length) { resolve(); return; }
      const start = next;
      const slice = items.slice(start, start + CHUNK);
      next += slice.length;
      const id = seq++;
      const onMsg = (msg) => {
        if (msg.id !== id) return;
        w.off('message', onMsg);
        out.set(msg.out, start * FEATURE_DIM);
        done += slice.length;
        const rate = done / ((Date.now() - t0) / 1000);
        process.stdout.write(`\r  ${label}: ${done}/${items.length}  (${rate.toFixed(0)}/s, eta ${Math.round((items.length - done) / rate)}s)   `);
        pump();
      };
      w.on('message', onMsg);
      w.postMessage({ id, items: slice });
    };
    pump();
  })));
  process.stdout.write('\n');
  await fs.mkdir(CACHE, { recursive: true });
  await fs.writeFile(cacheFile, Buffer.from(out.buffer));
  return out;
}

const xTrainData = await embedAll(train, 'train');
const xValData = await embedAll(val, 'val');
const xKioskData = await embedAll(valKiosk, 'val-kiosk');
await Promise.all(pool.map((w) => w.terminate()));

await initBackend();
const xTrain = tf.tensor2d(xTrainData, [train.length, FEATURE_DIM]);
const yTrain = tf.tidy(() => tf.oneHot(tf.tensor1d(train.map((t) => t.label), 'int32'), CLASS_KEYS.length)
  .toFloat().mul(1 - SMOOTHING).add(SMOOTHING / CLASS_KEYS.length));
const xKiosk = tf.tensor2d(xKioskData, [valKiosk.length, FEATURE_DIM]);

// Sidr and Samar now carry twice the photographs of the other classes; weight
// every class equally so the head does not simply learn to favour the big two.
const trainCounts = new Array(CLASS_KEYS.length).fill(0);
for (const t of train) trainCounts[t.label]++;
const classWeight = Object.fromEntries(trainCounts.map((n, c) =>
  [c, train.length / (CLASS_KEYS.length * Math.max(1, n))]));
const xVal = tf.tensor2d(xValData, [val.length, FEATURE_DIM]);
const yVal = tf.oneHot(tf.tensor1d(val.map((t) => t.label), 'int32'), CLASS_KEYS.length);

/* ---------- 4. train the head ---------- */

// --head linear: normalise the feature vector and read the species straight off
// it. Fewer weights than the two-layer head, so less room to memorise the
// scenery around a few hundred photos per class.
const LINEAR = argv.includes('--head') && argv[argv.indexOf('--head') + 1] === 'linear';
const head = tf.sequential({
  layers: LINEAR ? [
    tf.layers.layerNormalization({ inputShape: [FEATURE_DIM] }),
    tf.layers.dropout({ rate: 0.3 }),
    tf.layers.dense({
      units: CLASS_KEYS.length, activation: 'softmax',
      kernelRegularizer: tf.regularizers.l2({ l2: 1e-3 }),
    }),
  ] : [
    tf.layers.dense({
      inputShape: [FEATURE_DIM], units: 256, activation: 'relu',
      kernelRegularizer: tf.regularizers.l2({ l2: 1e-4 }),
    }),
    tf.layers.dropout({ rate: 0.45 }),
    tf.layers.dense({ units: 128, activation: 'relu' }),
    tf.layers.dropout({ rate: 0.2 }),
    tf.layers.dense({ units: CLASS_KEYS.length, activation: 'softmax' }),
  ],
});
head.compile({ optimizer: tf.train.adam(1.5e-3), loss: 'categoricalCrossentropy', metrics: ['accuracy'] });

console.log('\n  Training head...');
let best = { acc: 0, weights: null, epoch: 0 };

await head.fit(xTrain, yTrain, {
  epochs: EPOCHS,
  batchSize: 256,
  validationData: [xVal, yVal],
  shuffle: true,
  classWeight,
  verbose: 0,
  callbacks: {
    onEpochEnd: async (epoch, logs) => {
      // Pick the epoch on field photos *and* leaves-on-paper together: the
      // kiosk is the job, the field photos keep it honest.
      const kp = head.predict(xKiosk);
      const kioskPred = await kp.argMax(-1).data();
      kp.dispose();
      let hit = 0;
      valKiosk.forEach((v, i) => { if (kioskPred[i] === v.label) hit++; });
      logs.kiosk_acc = hit / valKiosk.length;
      const score = (logs.val_acc + logs.kiosk_acc) / 2;
      if (score > (best.score ?? 0)) {
        best = {
          score,
          kiosk: logs.kiosk_acc,
          acc: logs.val_acc,
          epoch: epoch + 1,
          weights: head.getWeights().map((w) => w.clone()),
        };
      }
      if (true) {
        console.log(
          `    epoch ${String(epoch + 1).padStart(3)}  loss ${logs.loss.toFixed(4)}` +
          `  acc ${(logs.acc * 100).toFixed(1)}%  val_acc ${(logs.val_acc * 100).toFixed(1)}%  kiosk ${(logs.kiosk_acc * 100).toFixed(1)}%`
        );
      }
    },
  },
});

// Roll back to the best epoch rather than shipping whatever the last one gave.
if (best.weights) {
  head.setWeights(best.weights);
  best.weights.forEach((w) => w.dispose());
}
console.log(`\n  Best epoch ${best.epoch}: field photos ${(best.acc * 100).toFixed(1)}%, leaves on paper ${(best.kiosk * 100).toFixed(1)}%`);

/* ---------- 5. confusion matrix ---------- */

const predT = head.predict(xVal);
const preds = Array.from(await predT.argMax(-1).data());
predT.dispose();

const K = CLASS_KEYS.length;
const cm = Array.from({ length: K }, () => new Array(K).fill(0));
val.forEach((v, i) => { cm[v.label][preds[i]]++; });

console.log('\n  Confusion matrix (rows = truth, cols = predicted)');
console.log('              ' + SPECIES.map((s) => s.en.slice(0, 8).padStart(9)).join(''));
const perClassAcc = {};
SPECIES.forEach((s, i) => {
  const total = cm[i].reduce((a, b) => a + b, 0);
  perClassAcc[s.key] = total ? cm[i][i] / total : 0;
  console.log(
    '  ' + s.en.padEnd(11) + cm[i].map((n) => String(n).padStart(9)).join('') +
    `   ${(perClassAcc[s.key] * 100).toFixed(0)}%`
  );
});

const kpT = head.predict(xKiosk);
const kioskPreds = Array.from(await kpT.argMax(-1).data());
kpT.dispose();
const cmKiosk = Array.from({ length: K }, () => new Array(K).fill(0));
valKiosk.forEach((v, i) => { cmKiosk[v.label][kioskPreds[i]]++; });
const perClassKiosk = {};
console.log('\n  Leaves on paper (rows = truth, cols = predicted)');
SPECIES.forEach((s, i) => {
  const total = cmKiosk[i].reduce((a, b) => a + b, 0);
  perClassKiosk[s.key] = total ? cmKiosk[i][i] / total : 0;
  console.log('  ' + s.en.slice(0, 10).padEnd(11) + cmKiosk[i].map((n) => String(n).padStart(9)).join('') +
    `   ${(perClassKiosk[s.key] * 100).toFixed(0)}%`);
});

/* ---------- 6. out-of-distribution reference ---------- */

/**
 * Teaching the app to say "I don't know".
 *
 * A softmax always sums to one, so a classifier handed a photograph of a rose --
 * or of a judge's hand -- still returns four confident-looking numbers. Top-1
 * probability and entropy catch some of that, but a network can be crisply,
 * loudly wrong about an input unlike anything it trained on.
 *
 * The extra signal here is distance in *feature* space. We store the mean
 * L2-normalised MobileNet feature vector of each class, and at inference time
 * measure the cosine similarity between the photo and the nearest of those
 * centroids. A real ghaf leaf lands near the ghaf centroid; a rose lands near
 * nothing. That is a property of the 1280-d representation itself and does not
 * care what the softmax claims.
 *
 * The threshold is the 5th percentile of the *validation* set's own
 * similarities: by construction it accepts 95% of genuine leaves of the four
 * species, and anything further out than the most unusual real leaf we have ever
 * seen is reported as unrecognised.
 */

const FEAT = FEATURE_DIM;

/** Copies row `i` out of a flat embedding buffer and L2-normalises it. */
function unitVector(buf, i) {
  const v = new Float64Array(FEAT);
  let norm = 0;
  for (let d = 0; d < FEAT; d++) {
    const x = buf[i * FEAT + d];
    v[d] = x;
    norm += x * x;
  }
  norm = Math.sqrt(norm) || 1;
  for (let d = 0; d < FEAT; d++) v[d] /= norm;
  return v;
}

const centroids = Array.from({ length: CLASS_KEYS.length }, () => new Float64Array(FEAT));
const classCounts = new Array(CLASS_KEYS.length).fill(0);

// Built from the un-augmented training rows only. Rotated and colour-shifted
// copies would drag each centroid towards the augmentation recipe rather than
// towards the species.
for (let i = 0; i < train.length; i++) {
  if (train[i].aug !== null) continue;
  const v = unitVector(xTrainData, i);
  const c = train[i].label;
  const centroid = centroids[c];
  for (let d = 0; d < FEAT; d++) centroid[d] += v[d];
  classCounts[c]++;
}

for (let c = 0; c < centroids.length; c++) {
  let norm = 0;
  for (let d = 0; d < FEAT; d++) {
    centroids[c][d] /= classCounts[c] || 1;
    norm += centroids[c][d] ** 2;
  }
  norm = Math.sqrt(norm) || 1;
  for (let d = 0; d < FEAT; d++) centroids[c][d] /= norm;
}

/** Cosine similarity to the closest centroid — both vectors are already unit. */
function nearestSimilarity(v) {
  let best = -1;
  for (const centroid of centroids) {
    let dot = 0;
    for (let d = 0; d < FEAT; d++) dot += v[d] * centroid[d];
    if (dot > best) best = dot;
  }
  return best;
}

const valSimilarity = [];
for (let i = 0; i < val.length; i++) {
  valSimilarity.push(nearestSimilarity(unitVector(xValData, i)));
  valSimilarity.push(nearestSimilarity(unitVector(xKioskData, i)));
}
valSimilarity.sort((a, b) => a - b);
const pct = (q) => valSimilarity[Math.min(valSimilarity.length - 1, Math.floor(q * valSimilarity.length))];
const oodThreshold = pct(0.05);

console.log('\n  Out-of-distribution reference');
console.log(`    validation similarity to nearest centroid:` +
  ` p05 ${pct(0.05).toFixed(3)}  p50 ${pct(0.50).toFixed(3)}  p95 ${pct(0.95).toFixed(3)}`);
console.log(`    threshold (accepts 95% of genuine leaves): ${oodThreshold.toFixed(3)}`);

await fs.writeFile(path.join(OUT, 'ood.json'), JSON.stringify({
  note: 'Class centroids in MobileNetV2 feature space, used to reject inputs that are not one of the trained species. Generated by tools/train.mjs.',
  featureDim: FEAT,
  classes: CLASS_KEYS,
  threshold: Number(oodThreshold.toFixed(4)),
  similarityPercentiles: {
    p05: Number(pct(0.05).toFixed(4)),
    p50: Number(pct(0.50).toFixed(4)),
    p95: Number(pct(0.95).toFixed(4)),
  },
  // 4 decimals is well inside the noise of a unit vector this long and keeps the
  // file small enough to sit in the offline cache without complaint.
  centroids: centroids.map((c) => Array.from(c, (x) => Number(x.toFixed(4)))),
}));

/* ---------- 7. save ---------- */

await fs.mkdir(path.join(OUT, 'head'), { recursive: true });
const saved = await head.save(tf.io.withSaveHandler(async (artifacts) => {
  await fs.writeFile(path.join(OUT, 'head', 'weights.bin'), Buffer.from(artifacts.weightData));
  await fs.writeFile(path.join(OUT, 'head', 'model.json'), JSON.stringify({
    format: 'layers-model',
    generatedBy: 'green-trace-uae/tools/train.mjs',
    convertedBy: null,
    modelTopology: artifacts.modelTopology,
    weightsManifest: [{ paths: ['weights.bin'], weights: artifacts.weightSpecs }],
  }));
  return { modelArtifactsInfo: { dateSaved: new Date(), modelTopologyType: 'JSON' } };
}));
void saved;

await fs.writeFile(path.join(OUT, 'metadata.json'), JSON.stringify({
  name: 'Warif species classifier',
  trainedAt: new Date().toISOString(),
  architecture: LINEAR ? `MobileNetV2 (frozen, ImageNet) + normalised linear head (${CLASS_KEYS.length} classes)` : `MobileNetV2 (frozen, ImageNet) + 256-128-${CLASS_KEYS.length} dense head`,
  inputSize: 224,
  featureNode: 'module_apply_default/MobilenetV2/Logits/AvgPool',
  classes: CLASS_KEYS,
  classNames: Object.fromEntries(SPECIES.map((s) => [s.key, s.en])),
  validationAccuracy: Number(best.acc.toFixed(4)),
  kioskAccuracy: Number(best.kiosk.toFixed(4)),
  validationSplit: 'by iNaturalist observation',
  perClassAccuracy: Object.fromEntries(
    Object.entries(perClassAcc).map(([k, v]) => [k, Number(v.toFixed(4))])
  ),
  confusionMatrix: cm,
  kioskPerClassAccuracy: Object.fromEntries(
    Object.entries(perClassKiosk).map(([k, v]) => [k, Number(v.toFixed(4))])
  ),
  kioskConfusionMatrix: cmKiosk,
  trainingSamples: train.length,
  validationSamples: val.length,
  oodThreshold: Number(oodThreshold.toFixed(4)),
  sourceCounts: Object.fromEntries(perClass.map((p) => [p.sp.key, { reference: p.inat, team: p.custom }])),
}, null, 2));

console.log(`\n  Saved head to app/model/head/, OOD reference to app/model/ood.json,\n  and metadata to app/model/metadata.json`);
[xTrain, yTrain, xVal, yVal, xKiosk].forEach((t) => t.dispose());
