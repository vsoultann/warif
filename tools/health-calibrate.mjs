/**
 * Measures the leaf-health analyser against the reference dataset.
 *
 * The complaint that produced this tool was that the app "always finds problems,
 * even in healthy leaves". That is a testable claim, so this makes it a number.
 *
 * The reference photographs in dataset/inaturalist are overwhelmingly pictures
 * of ordinary, living trees in the field. A minority genuinely show stressed or
 * damaged foliage, so the true healthy rate is not 100% — but it is high, and an
 * analyser that flags a problem on nearly every one of them is miscalibrated
 * rather than observant. This tool reports what share of that set the analyser
 * calls healthy, alongside the distribution of every underlying metric, so the
 * constants in TUNING can be set from evidence.
 *
 *   node tools/health-calibrate.mjs [--n 80] [--kiosk] [--impl path/to/health.js] [--json]
 *
 * `--kiosk` re-runs each photo as the app will actually meet it. The reference
 * set is mostly whole trees in a landscape — sky, sand, bark and neighbouring
 * plants all inside the frame — whereas the app is pointed at one leaf on plain
 * paper. In kiosk mode the foliage is segmented out of the photo and composited
 * onto a sheet of paper before being measured, which is a much closer stand-in
 * for the real input than the raw photograph is.
 *
 * `--impl` exists so the current analyser can be compared against an older one
 * pulled out of git history:
 *
 *   git show HEAD:app/js/health.js > /tmp/health-v1.mjs
 *   node tools/health-calibrate.mjs --impl /tmp/health-v1.mjs
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import sharp from 'sharp';
import { SPECIES } from './species.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const WORK = 384;

const argv = process.argv.slice(2);
const arg = (name, fallback) => {
  const i = argv.indexOf(name);
  return i === -1 ? fallback : argv[i + 1];
};
const PER_CLASS = Number(arg('--n', 80));
const IMPL = path.resolve(arg('--impl', path.join(ROOT, 'app', 'js', 'health.js')));
const AS_JSON = argv.includes('--json');
const KIOSK = argv.includes('--kiosk');

/* ------------------------------------------------------------------ shim */

/**
 * Enough of a <canvas> for an older, DOM-coupled analyser to run under Node.
 *
 * Only the legacy implementation needs this — the current health.js exposes
 * `analysePixels`, a pure function, precisely so that this measurement can run
 * the exact code the browser runs instead of a reimplementation of it.
 */
function installCanvasShim() {
  if (globalThis.document) return;
  let pending = null;
  globalThis.__setPixels = (data, w, h) => { pending = { data, w, h }; };
  globalThis.document = {
    createElement() {
      const cv = { width: 0, height: 0 };
      cv.getContext = () => ({
        drawImage() {},
        getImageData: () => ({
          data: pending.data, width: pending.w, height: pending.h,
        }),
        putImageData() {},
      });
      cv.toDataURL = () => '';
      return cv;
    },
  };
}
installCanvasShim();

const mod = await import(pathToFileURL(IMPL).href);
const analyse = mod.analysePixels
  ? (data, w, h) => mod.analysePixels(data, w, h, { paint: false })
  : (data, w, h) => {
      globalThis.__setPixels(data, w, h);
      return mod.analyseLeaf({ naturalWidth: w, naturalHeight: h });
    };

/* ------------------------------------------------------------------ data */

async function listDir(dir) {
  try {
    return (await fs.readdir(dir))
      .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
      .map((f) => path.join(dir, f))
      .sort();
  } catch { return []; }
}

/** Deterministic pick so two runs compare like with like. */
function sample(files, n) {
  if (files.length <= n) return files;
  const step = files.length / n;
  return Array.from({ length: n }, (_, i) => files[Math.floor(i * step)]);
}

async function decodeRGBA(file) {
  const img = sharp(file, { failOn: 'none' }).rotate();
  const meta = await img.metadata();
  const scale = WORK / Math.max(meta.width, meta.height);
  const w = Math.max(1, Math.round(meta.width * scale));
  const h = Math.max(1, Math.round(meta.height * scale));
  const { data } = await img.resize(w, h, { fit: 'fill' }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data: new Uint8ClampedArray(data.buffer, data.byteOffset, data.byteLength), w, h };
}

/**
 * Rebuilds a field photograph as a kiosk photograph.
 *
 * One pass segments the plant tissue; every pixel outside that mask is replaced
 * with the off-white of a sheet of paper, and the result is measured normally.
 * What survives is the foliage alone against a plain backdrop — the condition
 * the tips on the scan screen ask the user for.
 */
function analyseAsKiosk(data, w, h) {
  if (!mod.analysePixels) return null;   // legacy implementation cannot do this
  const probe = mod.analysePixels(new Uint8ClampedArray(data), w, h,
    { paint: false, returnMask: true });
  if (!probe.valid || !probe.mask) return null;

  const px = new Uint8ClampedArray(data);
  for (let i = 0, p = 0; i < w * h; i++, p += 4) {
    if (probe.mask[i]) continue;
    px[p] = 246; px[p + 1] = 244; px[p + 2] = 238;   // plain paper
  }
  return mod.analysePixels(px, w, h, { paint: false });
}

/* ------------------------------------------------------------------ run */

function quantiles(values) {
  if (!values.length) return { p10: 0, p50: 0, p90: 0, mean: 0 };
  const s = [...values].sort((a, b) => a - b);
  const at = (q) => s[Math.min(s.length - 1, Math.floor(q * s.length))];
  return {
    p10: at(0.10), p50: at(0.50), p90: at(0.90),
    mean: s.reduce((a, b) => a + b, 0) / s.length,
  };
}

const report = { impl: path.relative(ROOT, IMPL), perClass: {}, all: null };
const every = { scores: [], flagged: 0, invalid: 0, total: 0, findings: {}, metrics: {},
                closeUp: { total: 0, flagged: 0 } };
const METRIC_KEYS = ['chlorosis', 'necrosis', 'greenness', 'uniformity', 'texture', 'coverage'];
for (const k of METRIC_KEYS) every.metrics[k] = [];

if (!AS_JSON) {
  console.log(`Warif — health analyser calibration`);
  console.log(`  implementation: ${report.impl}`);
  if (KIOSK) console.log('  mode: kiosk — foliage composited onto plain paper');
  console.log(`  sample: up to ${PER_CLASS} reference photos per species\n`);
}

for (const sp of SPECIES) {
  const files = sample(await listDir(path.join(ROOT, 'dataset', 'inaturalist', sp.key)), PER_CLASS);
  if (!files.length) {
    console.error(`No reference images for "${sp.key}". Run: npm run fetch`);
    process.exit(1);
  }

  const scores = [];
  let flagged = 0, invalid = 0;

  for (const file of files) {
    let r;
    try {
      const { data, w, h } = await decodeRGBA(file);
      r = KIOSK ? analyseAsKiosk(data, w, h) : analyse(data, w, h);
      if (!r) continue;
    } catch {
      continue;
    }

    every.total++;
    if (!r.valid) { invalid++; every.invalid++; continue; }

    scores.push(r.score);
    every.scores.push(r.score);
    for (const k of METRIC_KEYS) every.metrics[k].push(r.metrics[k]);

    const problems = r.findings.filter((f) => f.level !== 'ok');
    if (problems.length) { flagged++; every.flagged++; }
    for (const f of problems) every.findings[f.key] = (every.findings[f.key] || 0) + 1;

    // The close-up subset is the only fair test of the app's actual job.
    //
    // These reference photographs are mostly whole trees in a landscape: sky,
    // sand, bark, dry ground and neighbouring plants all sit inside the frame,
    // and a good deal of the yellow and brown in them is genuinely there. The
    // app is used on one leaf against a plain background. Photos where the frame
    // is mostly foliage are the closest thing in this dataset to that, so they
    // are scored separately.
    if (r.metrics.coverage >= 0.55) {
      every.closeUp.total++;
      if (problems.length) every.closeUp.flagged++;
    }
  }

  const counted = scores.length;
  const q = quantiles(scores);
  report.perClass[sp.key] = {
    n: files.length, analysed: counted, noLeaf: invalid,
    flaggedPct: counted ? (flagged / counted) * 100 : 0,
    score: q,
  };

  if (!AS_JSON) {
    console.log(
      `  ${sp.en.padEnd(10)} ${String(counted).padStart(3)} analysed` +
      `  ${String(invalid).padStart(3)} no-leaf` +
      `   flagged ${(counted ? (flagged / counted) * 100 : 0).toFixed(0).padStart(3)}%` +
      `   score p10/p50/p90 ${String(q.p10).padStart(3)}/${String(q.p50).padStart(3)}/${String(q.p90).padStart(3)}`
    );
  }
}

const analysed = every.scores.length;
const flaggedPct = analysed ? (every.flagged / analysed) * 100 : 0;
const healthyPct = 100 - flaggedPct;

report.all = {
  total: every.total,
  analysed,
  noLeaf: every.invalid,
  flaggedPct,
  healthyPct,
  closeUp: every.closeUp.total
    ? { n: every.closeUp.total, healthyPct: 100 - (every.closeUp.flagged / every.closeUp.total) * 100 }
    : null,
  score: quantiles(every.scores),
  metrics: Object.fromEntries(METRIC_KEYS.map((k) => [k, quantiles(every.metrics[k])])),
  findings: Object.fromEntries(
    Object.entries(every.findings).sort((a, b) => b[1] - a[1])
      .map(([k, v]) => [k, { count: v, pct: (v / analysed) * 100 }])
  ),
};

if (AS_JSON) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log(`\n  ${'-'.repeat(64)}`);
  console.log(`  Analysed ${analysed} reference photographs (${every.invalid} had no separable leaf)\n`);
  console.log(`  Reported as healthy (no problem findings):  ${healthyPct.toFixed(1)}%`);
  console.log(`  Reported with at least one problem:         ${flaggedPct.toFixed(1)}%\n`);

  const cu = every.closeUp;
  if (cu.total) {
    const cuHealthy = 100 - (cu.flagged / cu.total) * 100;
    console.log(`  Close-up subset (frame >=55% foliage, n=${cu.total}) — the app's real domain`);
    console.log(`    Reported as healthy:                     ${cuHealthy.toFixed(1)}%\n`);
  }

  const s = report.all.score;
  console.log(`  Health score   p10 ${s.p10}   median ${s.p50}   p90 ${s.p90}   mean ${s.mean.toFixed(1)}\n`);

  console.log('  Metric distribution (p10 / median / p90)');
  for (const k of METRIC_KEYS) {
    const m = report.all.metrics[k];
    console.log(`    ${k.padEnd(12)} ${m.p10.toFixed(3)}  ${m.p50.toFixed(3)}  ${m.p90.toFixed(3)}`);
  }

  console.log('\n  How often each problem fired');
  const rows = Object.entries(report.all.findings);
  if (!rows.length) console.log('    (none)');
  for (const [k, v] of rows) {
    console.log(`    ${k.padEnd(14)} ${v.pct.toFixed(1).padStart(5)}%  (${v.count})`);
  }
  console.log('');
}
