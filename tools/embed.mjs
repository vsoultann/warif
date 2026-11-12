/**
 * Shared image -> MobileNetV2 feature-vector plumbing, used by the trainer.
 *
 * The browser and the trainer must agree bit-for-bit on preprocessing, so the
 * contract lives here: 224x224, RGB, scaled to [0,1]. This is a TF-Hub module
 * (note the `module_apply_default` node prefix) and TF-Hub image modules take
 * [0,1] input by convention.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-wasm';
import { setWasmPaths } from '@tensorflow/tfjs-backend-wasm';
import { analysePixels } from '../app/js/health.js';

export const IMAGE_SIZE = 224;
export const FEATURE_NODE = 'module_apply_default/MobilenetV2/Logits/AvgPool';
export const FEATURE_DIM = 1280;

const ROOT = path.resolve(import.meta.dirname, '..');

export async function initBackend() {
  setWasmPaths(
    path.join(ROOT, 'node_modules', '@tensorflow', 'tfjs-backend-wasm', 'dist') + path.sep
  );
  await tf.setBackend('wasm');
  await tf.ready();
  return tf;
}

/** Loads the vendored MobileNetV2 graph model straight off the filesystem. */
export async function loadBase() {
  const dir = path.join(ROOT, 'app', 'model', 'mobilenet');
  const modelJson = JSON.parse(await fs.readFile(path.join(dir, 'model.json'), 'utf8'));

  const handler = {
    load: async () => {
      const specs = [];
      const buffers = [];
      for (const group of modelJson.weightsManifest) {
        specs.push(...group.weights);
        for (const p of group.paths) {
          const buf = await fs.readFile(path.join(dir, p));
          buffers.push(new Uint8Array(buf).buffer);
        }
      }
      // Concatenate shards into the single ArrayBuffer the loader expects.
      const total = buffers.reduce((a, b) => a + b.byteLength, 0);
      const merged = new Uint8Array(total);
      let off = 0;
      for (const b of buffers) { merged.set(new Uint8Array(b), off); off += b.byteLength; }
      return {
        modelTopology: modelJson.modelTopology,
        weightSpecs: specs,
        weightData: merged.buffer,
        format: modelJson.format,
        generatedBy: modelJson.generatedBy,
        convertedBy: modelJson.convertedBy,
      };
    },
  };

  return tf.loadGraphModel(handler);
}

/**
 * Decodes one image file into raw RGB at IMAGE_SIZE, applying an optional
 * augmentation recipe. Augmentation happens in sharp (fast, native) rather
 * than in tensor-land, which the WASM backend would make painful.
 */
export async function decode(file, aug = null) {
  let pipeline = sharp(file, { failOn: 'none' }).rotate();

  if (aug?.crop) {
    const meta = await pipeline.metadata();
    const side = Math.round(Math.min(meta.width, meta.height) * aug.crop);
    const left = Math.round((meta.width - side) * (aug.dx ?? 0.5));
    const top = Math.round((meta.height - side) * (aug.dy ?? 0.5));
    pipeline = pipeline.extract({ left, top, width: side, height: side });
  }

  pipeline = pipeline.resize(IMAGE_SIZE, IMAGE_SIZE, { fit: 'cover' });

  if (aug?.flip) pipeline = pipeline.flop();
  if (aug?.rotate) pipeline = pipeline.rotate(aug.rotate, { background: '#ffffff' })
    .resize(IMAGE_SIZE, IMAGE_SIZE, { fit: 'cover' });
  if (aug?.brightness || aug?.saturation) {
    pipeline = pipeline.modulate({
      brightness: aug.brightness ?? 1,
      saturation: aug.saturation ?? 1,
    });
  }

  const { data } = await pipeline.removeAlpha().raw().toBuffer({ resolveWithObject: true });
  let rgb = new Uint8Array(data);
  if (aug?.paper) rgb = onPaper(rgb, aug.paper);
  if (aug?.letterbox) rgb = letterbox(rgb);
  return rgb;
}

/**
 * Backdrops a kiosk leaf is actually photographed on: printer paper, a pale
 * grey counter, a light wooden tray. All three are deliberately unremarkable.
 */
const PAPERS = [
  [246, 244, 238],
  [222, 224, 227],
  [226, 208, 182],
];

/**
 * The same photo, rebuilt as the kiosk sees it.
 *
 * The reference set is iNaturalist field photography: whole branches against
 * sky, sand and other trees. The kiosk sees one leaf or sprig on a plain sheet.
 * Training only on the first and testing on the second is what let near
 * neighbours like Sidr and Samar blur together -- the model had learnt the
 * scenery they grow in as much as the leaves. So a share of every class is
 * shown to it again with the scenery removed: the foliage is cut out with the
 * health analyser's own segmentation and laid on a backdrop, with a soft light
 * fall-off so the sheet is not unnaturally flat.
 */
function onPaper(rgb, variant) {
  const S = IMAGE_SIZE;
  const n = S * S;
  const rgba = new Uint8ClampedArray(n * 4);
  for (let i = 0; i < n; i++) {
    rgba[i * 4] = rgb[i * 3];
    rgba[i * 4 + 1] = rgb[i * 3 + 1];
    rgba[i * 4 + 2] = rgb[i * 3 + 2];
    rgba[i * 4 + 3] = 255;
  }
  const probe = analysePixels(rgba, S, S, { paint: false, returnMask: true });
  // Nothing separable, or the "leaf" is the whole frame: leave the photo as it
  // is rather than invent a composite the app would never see.
  if (!probe.valid || !probe.mask || probe.coverage < 0.06 || probe.coverage > 0.92) return rgb;

  const [pr, pg, pb] = PAPERS[(variant - 1) % PAPERS.length];
  const out = new Uint8Array(rgb);
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const i = y * S + x;
      if (probe.mask[i]) continue;
      const dx = x / S - 0.5, dy = y / S - 0.42;
      const light = 1 - 0.16 * (dx * dx + dy * dy) * 2;
      out[i * 3] = pr * light;
      out[i * 3 + 1] = pg * light;
      out[i * 3 + 2] = pb * light;
    }
  }
  return out;
}

/**
 * A 4:3 phone photo as the browser hands it over: model.js letterboxes the
 * whole frame onto white, so a band at the top and bottom is blank.
 */
function letterbox(rgb) {
  const S = IMAGE_SIZE;
  const band = Math.round(S / 8);
  const out = new Uint8Array(rgb);
  out.fill(255, 0, band * S * 3);
  out.fill(255, (S - band) * S * 3);
  return out;
}

/** Runs a batch of decoded images through the base model. Returns Float32Array. */
export function embedBatch(base, rawImages) {
  return tf.tidy(() => {
    const batch = tf.stack(
      rawImages.map((raw) =>
        tf.tensor3d(raw, [IMAGE_SIZE, IMAGE_SIZE, 3], 'float32').div(255)
      )
    );
    const feats = base.execute(batch, FEATURE_NODE);
    return feats.reshape([rawImages.length, FEATURE_DIM]);
  });
}

export { tf };
