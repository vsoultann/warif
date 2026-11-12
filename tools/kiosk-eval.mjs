/**
 * Classifies photographs exactly the way the app does -- the same three views
 * (whole photo letterboxed, centre square, centre square mirrored), averaged --
 * and prints the top three for each.
 *
 *   node tools/kiosk-eval.mjs [dir-or-files...]   (default: dataset/kiosk-test)
 *
 * dataset/kiosk-test/<class>/ holds team photographs that were never trained
 * on, so this is the honest test of the kiosk itself rather than of iNaturalist.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { initBackend, loadBase, FEATURE_NODE, IMAGE_SIZE, tf } from './embed.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const MODEL = path.join(ROOT, 'app', 'model');

async function loadHead() {
  const json = JSON.parse(await fs.readFile(path.join(MODEL, 'head', 'model.json'), 'utf8'));
  const weights = await fs.readFile(path.join(MODEL, 'head', 'weights.bin'));
  return tf.loadLayersModel(tf.io.fromMemory({
    modelTopology: json.modelTopology,
    weightSpecs: json.weightsManifest.flatMap((g) => g.weights),
    weightData: weights.buffer.slice(weights.byteOffset, weights.byteOffset + weights.byteLength),
  }));
}

/** The three views model.js builds, as raw RGB. */
async function views(file) {
  const src = sharp(file, { failOn: 'none' }).rotate();
  const { width, height } = await sharp(await src.clone().toBuffer()).metadata();
  const fit = await src.clone()
    .resize(IMAGE_SIZE, IMAGE_SIZE, { fit: 'contain', background: '#ffffff' })
    .removeAlpha().raw().toBuffer();
  const side = Math.min(width, height);
  const centreImg = src.clone().extract({
    left: Math.floor((width - side) / 2), top: Math.floor((height - side) / 2), width: side, height: side,
  }).resize(IMAGE_SIZE, IMAGE_SIZE);
  const centre = await centreImg.clone().removeAlpha().raw().toBuffer();
  const mirror = await centreImg.clone().flop().removeAlpha().raw().toBuffer();
  return [fit, centre, mirror];
}

async function list(args) {
  const targets = args.length ? args : [path.join(ROOT, 'dataset', 'kiosk-test')];
  const out = [];
  for (const t of targets) {
    const st = await fs.stat(t);
    if (st.isFile()) { out.push({ file: t, truth: path.basename(path.dirname(t)) }); continue; }
    for (const e of await fs.readdir(t, { withFileTypes: true })) {
      const p = path.join(t, e.name);
      if (e.isDirectory()) {
        for (const f of await fs.readdir(p)) if (/\.(jpe?g|png|webp)$/i.test(f)) out.push({ file: path.join(p, f), truth: e.name });
      } else if (/\.(jpe?g|png|webp)$/i.test(e.name)) out.push({ file: p, truth: path.basename(t) });
    }
  }
  return out;
}

await initBackend();
const base = await loadBase();
const head = await loadHead();
const meta = JSON.parse(await fs.readFile(path.join(MODEL, 'metadata.json'), 'utf8'));
const items = await list(process.argv.slice(2));
let hits = 0;
for (const { file, truth } of items) {
  const raws = await views(file);
  const probs = tf.tidy(() => {
    const batch = tf.stack(raws.map((r) => tf.tensor3d(new Uint8Array(r), [IMAGE_SIZE, IMAGE_SIZE, 3], 'float32').div(255)));
    const feats = base.execute(batch, FEATURE_NODE).reshape([raws.length, -1]);
    return head.predict(feats).mean(0);
  });
  const p = Array.from(await probs.data());
  probs.dispose();
  const ranked = p.map((v, i) => ({ key: meta.classes[i], p: v })).sort((a, b) => b.p - a.p);
  const ok = ranked[0].key === truth;
  if (ok) hits++;
  console.log(`${ok ? 'OK ' : 'MISS'} ${truth.padEnd(9)} ${path.basename(file).padEnd(28)} ` +
    ranked.slice(0, 3).map((r) => `${r.key} ${(r.p * 100).toFixed(0)}%`).join('  '));
}
console.log(`\n${hits}/${items.length} correct`);
