/**
 * One embedding lane for tools/train.mjs.
 *
 * The WASM backend runs a single thread, so a 22-core machine embedded the
 * training set at the speed of one core. Each worker loads its own copy of the
 * frozen MobileNetV2 and takes a slice of the work.
 */
import { parentPort } from 'node:worker_threads';
import { initBackend, loadBase, decode, embedBatch, FEATURE_DIM } from './embed.mjs';

await initBackend();
const base = await loadBase();
parentPort.postMessage({ ready: true });

parentPort.on('message', async ({ id, items }) => {
  const out = new Float32Array(items.length * FEATURE_DIM);
  const BATCH = 16;
  for (let i = 0; i < items.length; i += BATCH) {
    const raws = [];
    for (const it of items.slice(i, i + BATCH)) {
      try { raws.push(await decode(it.file, it.aug)); }
      catch { raws.push(new Uint8Array(224 * 224 * 3)); }
    }
    const feats = embedBatch(base, raws);
    out.set(await feats.data(), i * FEATURE_DIM);
    feats.dispose();
  }
  parentPort.postMessage({ id, out }, [out.buffer]);
});
