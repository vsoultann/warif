/**
 * Leaf health analysis by classical computer vision.
 *
 * Deliberately *not* a neural network: every number below can be explained to a
 * judge in one sentence, and none of it needs training data. The pipeline is
 *
 *   1. estimate the illuminant from the backdrop and white-balance the photo,
 *   2. segment the leaf away from that backdrop,
 *   3. clean the mask up and throw away the speckle,
 *   4. classify each leaf pixel as healthy / chlorotic / necrotic,
 *   5. measure colour uniformity and surface texture *inside* the leaf,
 *   6. fold those into a single 0-100 score with named findings.
 *
 * ## Why v2 exists
 *
 * The first version reported a problem on almost every leaf, including obviously
 * healthy ones. Four bugs caused that, and each is fixed here:
 *
 *   - **Brightness leaked into every measurement.** Excess Green (`2g-r-b`) grows
 *     with exposure, so a healthy leaf photographed in shade scored as pale and
 *     chlorotic while the same leaf in sun scored fine. Everything now runs on
 *     the *normalised* index `(2g-r-b)/(r+g+b)`, which is invariant to how much
 *     light hit the leaf.
 *   - **Warm light was read as disease.** Indoor bulbs push a green leaf's hue
 *     towards yellow, straight into the chlorosis band. The illuminant is now
 *     estimated from the near-neutral pixels of the backdrop and divided out.
 *   - **The leaf's own outline was counted as damage.** Texture was measured
 *     across the whole mask, so the high-contrast boundary between leaf and
 *     background dominated it, and every well-lit photo looked pitted. Texture
 *     and uniformity are now measured on an *eroded* mask that excludes the rim.
 *   - **Thresholds had no dead zone.** Any trace of yellow raised a finding. Each
 *     threshold now has a margin below which a leaf is simply called healthy.
 *
 * Every constant in TUNING was chosen by running tools/health-calibrate.mjs over
 * the reference dataset — see that file for the measured false-positive rate.
 *
 * Everything runs on a downscaled copy, so a 12-megapixel phone photo costs the
 * same as a thumbnail.
 */

const WORK = 384; // analysis resolution, long edge

/**
 * Every tunable number in one place, so the calibration tool can report against
 * them and the team can defend each one.
 */
export const TUNING = {
  /* --- segmentation --- */
  minValue: 0.07,          // below this a pixel is crushed shadow
  maxValue: 0.985,         // above this it is blown highlight
  minSat: 0.13,            // below this it is paper, a grey card or metal
  hueMin: 12,              // brown ...
  hueMax: 185,             // ... through yellow and green to cyan
  glareValue: 0.90,        // a bright, washed-out pixel is a specular highlight,
  glareSat: 0.24,          //   not tissue -- and never evidence of disease
  minComponentFrac: 0.04,  // drop blobs smaller than this share of the biggest
  minComponentPx: 24,      //   (compound leaves are many small blobs, so this
                           //    keeps leaflets while dropping sensor speckle)

  /* --- pixel classes --- */
  chlorHueMin: 38,         // yellow band
  chlorHueMax: 78,
  chlorGreenRatio: 0.99,   // in that band, chlorotic once green stops out-ranking red
  chlorValueMin: 0.34,     // living chlorotic tissue is bright; straw and dry
  chlorSatMax: 0.88,       //   ground are dark, and sand is more saturated
  necroHueMax: 38,         // brown / red band
  necroGreenRatio: 0.85,   // and red clearly out-ranking green
  necroValue: 0.50,
  necroSat: 0.42,

  /* --- scalar measures --- */
  greennessLo: -0.02,      // maps mean normalised ExG onto 0..1
  greennessHi: 0.22,
  uniformitySd: 0.95,      // circular SD (radians) that maps to uniformity 0
  textureNorm: 0.34,       // mean contrast-normalised Laplacian that maps to 1

  /* --- score penalties, each with a dead zone --- */
  necrosisFree: 0.05, necrosisWeight: 130,
  chlorosisFree: 0.10, chlorosisWeight: 70,
  uniformityFloor: 0.62, uniformityWeight: 30,
  greennessFloor: 0.30, greennessWeight: 45,
  textureFree: 0.70, textureWeight: 35,

  /* --- finding thresholds --- */
  // A finding tells somebody their tree is in trouble, so the bar is "a
  // meaningful part of the blade", not "a trace". Roughly a sixth of the leaf
  // dead, or a quarter of it yellowed, before anything is reported.
  necrosisHigh: 0.30, necrosisSome: 0.16,
  chlorosisHigh: 0.45, chlorosisSome: 0.28,
  mottledBelow: 0.42,
  textureAbove: 0.88,
  paleBelow: 0.26,
  smallLeafBelow: 0.10,

  /* --- "is this even a leaf" --- */
  minCoverage: 0.025,      // below this there is nothing to measure
  confidentCoverage: 0.16, // at or above this, framing is not a concern
  solidityFloor: 0.30,     // share of the mask surviving erosion: below this the
  solidityGood: 0.65,      //   "leaf" is scattered speckle, not a solid object

  /* --- v3: brown and yellow only count when attached to green leaf --- */
  attachMinGreenShare: 0.30, // below this share of green the subject is one dead
                             //   leaf, and everything brown in it is the leaf
  attachMinGreenFrame: 0.015,// ... unless there is plainly a living plant in shot
  attachGreenHue: 55,        // what counts as unmistakably green leaf
  attachGreenExg: 0.03,
  attachTouch: 0.18,         // share of a blob's edge that must touch green
  attachTouchDark: 0.30,     //   ... and for a dark blob (soil, shadow, pot rim)
  attachDarkValue: 0.30,
  attachTouchYellow: 0.06,   // a bright yellow patch joined to green
  attachYellowValue: 0.45,
  attachTouchVeryDark: 0.60, // soil and shadow glimpsed between leaves: only a
  attachVeryDarkValue: 0.22, //   spot ringed by leaf all round is a lesion
};

/* ---------- colour helpers ---------- */

/** sRGB (0-255) to HSV with h in degrees, s and v in 0..1. */
function rgbToHsv(r, g, b) {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === rn) h = ((gn - bn) / d) % 6;
    else if (max === gn) h = (bn - rn) / d + 2;
    else h = (rn - gn) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return [h, max === 0 ? 0 : d / max, max];
}

/**
 * Normalised Excess Green.
 *
 * The plain index `2g - r - b` scales with exposure, which made the old version
 * call every shaded leaf sick. Dividing by total intensity removes that: the
 * result describes the *colour* of the pixel and ignores how bright it was.
 */
function exgNorm(r, g, b) {
  const sum = r + g + b;
  return sum < 12 ? 0 : (2 * g - r - b) / sum;
}

/**
 * Estimates the illuminant from the near-neutral, reasonably bright pixels —
 * in practice the sheet of paper or tabletop the leaf is lying on.
 *
 * Grey-world over the *whole* frame would be wrong here: the leaf is genuinely
 * green, and neutralising the average would drain the very signal we measure.
 * Restricting the estimate to low-saturation pixels avoids that.
 *
 * @returns {[number, number, number]} per-channel gains, or 1,1,1 when the shot
 *   has no neutral reference to work from.
 */
function estimateIlluminant(px, n) {
  let rs = 0, gs = 0, bs = 0, count = 0;

  for (let i = 0, p = 0; i < n; i++, p += 4) {
    const r = px[p], g = px[p + 1], b = px[p + 2];
    const max = Math.max(r, g, b);
    if (max < 90 || max > 250) continue;             // too dark, or clipped
    const min = Math.min(r, g, b);
    if ((max - min) / max > 0.20) continue;          // too colourful to be neutral
    rs += r; gs += g; bs += b; count++;
  }

  // Fewer than 2% neutral pixels means no trustworthy reference — a leaf shot
  // against grass, say. Leave the photo alone rather than guess.
  if (count < n * 0.02) return [1, 1, 1];

  const rm = rs / count, gm = gs / count, bm = bs / count;
  const grey = (rm + gm + bm) / 3;

  // Clamp the correction. A strong cast is worth removing; a 3x gain on one
  // channel is far more likely to be a coloured backdrop than a real illuminant.
  const clamp = (x) => Math.min(1.6, Math.max(0.625, x));
  return [clamp(grey / rm), clamp(grey / gm), clamp(grey / bm)];
}

/* ---------- mask morphology ---------- */

/** 3x3 majority vote: removes lone pixels and fills lone holes in one pass. */
function majorityFilter(mask, w, h) {
  const out = new Uint8Array(mask.length);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      let on = 0, total = 0;
      for (let dy = -1; dy <= 1; dy++) {
        const yy = y + dy;
        if (yy < 0 || yy >= h) continue;
        for (let dx = -1; dx <= 1; dx++) {
          const xx = x + dx;
          if (xx < 0 || xx >= w) continue;
          total++;
          on += mask[yy * w + xx];
        }
      }
      out[i] = on * 2 > total ? 1 : 0;
    }
  }
  return out;
}

/**
 * Keeps the leaf and drops the litter.
 *
 * Not "largest component wins": a ghaf twig or a palm frond is dozens of small
 * leaflets, and keeping only the biggest would throw most of the leaf away. So
 * every blob that is a meaningful fraction of the biggest one survives, and
 * only genuine speckle is discarded.
 */
function keepLeafComponents(mask, w, h) {
  const n = w * h;
  const label = new Int32Array(n).fill(-1);
  const sizes = [];
  const queue = new Int32Array(n);

  for (let start = 0; start < n; start++) {
    if (!mask[start] || label[start] !== -1) continue;
    const id = sizes.length;
    let head = 0, tail = 0, size = 0;
    queue[tail++] = start;
    label[start] = id;

    while (head < tail) {
      const i = queue[head++];
      size++;
      const x = i % w, y = (i / w) | 0;
      if (x > 0)     { const j = i - 1; if (mask[j] && label[j] === -1) { label[j] = id; queue[tail++] = j; } }
      if (x < w - 1) { const j = i + 1; if (mask[j] && label[j] === -1) { label[j] = id; queue[tail++] = j; } }
      if (y > 0)     { const j = i - w; if (mask[j] && label[j] === -1) { label[j] = id; queue[tail++] = j; } }
      if (y < h - 1) { const j = i + w; if (mask[j] && label[j] === -1) { label[j] = id; queue[tail++] = j; } }
    }
    sizes.push(size);
  }

  if (!sizes.length) return mask;

  const biggest = Math.max(...sizes);
  const floor = Math.max(TUNING.minComponentPx, biggest * TUNING.minComponentFrac);
  const keep = sizes.map((s) => (s >= floor ? 1 : 0));

  const out = new Uint8Array(n);
  for (let i = 0; i < n; i++) if (mask[i] && keep[label[i]]) out[i] = 1;
  return out;
}

/**
 * Erodes the mask by one pixel, repeated `times`.
 *
 * This is what stops the leaf's own silhouette being reported as damage. The
 * boundary between a dark leaf and a bright backdrop is the highest-contrast
 * edge in the photo; measuring texture across it guarantees a "pitted surface"
 * finding on a perfectly smooth leaf.
 */
function erode(mask, w, h, times = 2) {
  let cur = mask;
  for (let t = 0; t < times; t++) {
    const out = new Uint8Array(cur.length);
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const i = y * w + x;
        if (cur[i] && cur[i - 1] && cur[i + 1] && cur[i - w] && cur[i + w]) out[i] = 1;
      }
    }
    cur = out;
  }
  return cur;
}

/**
 * Removes brown and yellow blobs that are not attached to green leaf.
 *
 * Every 4-connected run of non-green tissue is measured along its edge: what
 * share of the pixels it borders are healthy green? A blob that is mostly ringed
 * by green is damage on a leaf and stays. One that mostly borders the floor, the
 * pot or nothing at all is the scene, and is taken out of the mask entirely.
 * Dark blobs need more green around them than pale ones, because the false
 * positives are dark (soil, shadow, a pot rim) and real dead tissue rarely is.
 *
 * "Green" here is strict -- a real leaf hue with real Excess Green -- because
 * the pixel classes above call anything in the mask that is neither yellow nor
 * brown "healthy", and a wooden wall panel or a tan sleeve lands there too.
 * Those muddy in-between pixels are judged with the brown and yellow ones, so a
 * wooden panel goes out whole rather than leaving its greenish half behind.
 *
 * Mutates `mask` and `cls`; returns how many pixels of each class it removed.
 */
function dropDetachedDamage(mask, cls, val, hue, exgn, w, h, T) {
  const n = w * h;
  const green = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    green[i] = cls[i] === 1 && hue[i] >= T.attachGreenHue && exgn[i] > T.attachGreenExg ? 1 : 0;
  }
  const seen = new Uint8Array(n);
  const stack = new Int32Array(n);
  const members = new Int32Array(n);
  let droppedOk = 0, droppedChl = 0, droppedNec = 0;

  for (let start = 0; start < n; start++) {
    if (seen[start] || !mask[start] || green[start]) continue;
    let sp = 0, count = 0, edge = 0, edgeGreen = 0, vSum = 0, yellow = 0;
    stack[sp++] = start;
    seen[start] = 1;
    while (sp) {
      const i = stack[--sp];
      members[count++] = i;
      vSum += val[i];
      if (cls[i] === 2) yellow++;
      const x = i % w;
      const y = (i / w) | 0;
      const around = [x > 0 ? i - 1 : -1, x < w - 1 ? i + 1 : -1, y > 0 ? i - w : -1, y < h - 1 ? i + w : -1];
      for (const j of around) {
        if (j < 0) { edge++; continue; }
        if (mask[j] && !green[j]) {
          if (!seen[j]) { seen[j] = 1; stack[sp++] = j; }
        } else {
          edge++;
          if (green[j]) edgeGreen++;
        }
      }
    }
    const touch = edge ? edgeGreen / edge : 0;
    const meanV = vSum / count;
    // A bright, mostly yellow patch is the shape chlorosis takes: a whole
    // half of a blade gone yellow meets the green part along one short line.
    // Nothing in the kiosk scenes looked like that, so it needs less contact.
    const brightYellow = yellow >= count * 0.6 && meanV >= T.attachYellowValue;
    const need = meanV < T.attachVeryDarkValue ? T.attachTouchVeryDark
      : meanV < T.attachDarkValue ? T.attachTouchDark
      : brightYellow ? T.attachTouchYellow : T.attachTouch;
    if (touch >= need) continue;   // on a leaf
    for (let k = 0; k < count; k++) {
      const i = members[k];
      if (cls[i] === 1) droppedOk++;
      else if (cls[i] === 2) droppedChl++;
      else droppedNec++;
      cls[i] = 0;
      mask[i] = 0;
    }
  }
  return { healthy: droppedOk, chlorotic: droppedChl, necrotic: droppedNec };
}

/* ---------- the analysis itself ---------- */

/**
 * The whole measurement, as a pure function over pixels.
 *
 * Kept free of the DOM so that tools/health-calibrate.mjs can run the identical
 * code over the reference dataset in Node. The browser wrapper below supplies
 * the canvas; nothing about the maths differs between the two.
 *
 * @param {Uint8ClampedArray|Uint8Array} px  RGBA, length w*h*4. Mutated in place
 *   to become the diagnostic overlay when `paint` is true.
 * @param {number} w
 * @param {number} h
 * @param {{paint?: boolean}} [opts]
 */
export function analysePixels(px, w, h, opts = {}) {
  const paint = opts.paint !== false;
  const n = w * h;
  const T = TUNING;

  /* ---------- 1. white balance ---------- */

  const [gainR, gainG, gainB] = estimateIlluminant(px, n);
  const balanced = new Uint8Array(n * 3);
  for (let i = 0, p = 0, q = 0; i < n; i++, p += 4, q += 3) {
    balanced[q]     = Math.min(255, px[p] * gainR);
    balanced[q + 1] = Math.min(255, px[p + 1] * gainG);
    balanced[q + 2] = Math.min(255, px[p + 2] * gainB);
  }

  /* ---------- 2. provisional mask ---------- */

  const hue = new Float32Array(n);
  const sat = new Float32Array(n);
  const val = new Float32Array(n);
  const exgn = new Float32Array(n);
  const grey = new Float32Array(n);
  let raw = new Uint8Array(n);

  for (let i = 0, q = 0; i < n; i++, q += 3) {
    const r = balanced[q], g = balanced[q + 1], b = balanced[q + 2];
    grey[i] = 0.299 * r + 0.587 * g + 0.114 * b;
    const [hu, sa, va] = rgbToHsv(r, g, b);
    hue[i] = hu; sat[i] = sa; val[i] = va;
    exgn[i] = exgNorm(r, g, b);

    if (va < T.minValue || va > T.maxValue) continue;
    if (va > T.glareValue && sa < T.glareSat) continue;   // specular highlight
    if (sa < T.minSat) continue;
    if (hu < T.hueMin || hu > T.hueMax) continue;
    // A vivid non-green (a red tablecloth, a blue cloth) still passes the hue
    // gate on its own, so require either real greenness or a muted leaf-like tone.
    if (exgn[i] <= -0.10 && sa >= 0.72) continue;
    raw[i] = 1;
  }

  /* ---------- 3. clean the mask ---------- */

  let mask = majorityFilter(raw, w, h);
  mask = majorityFilter(mask, w, h);
  mask = keepLeafComponents(mask, w, h);

  let tissue = 0;
  for (let i = 0; i < n; i++) tissue += mask[i];
  let coverage = tissue / n;

  /* ---------- 4. classify each leaf pixel ---------- */

  const cls = new Uint8Array(n);   // 0 none, 1 healthy, 2 chlorotic, 3 necrotic
  let healthy = 0, chlorotic = 0, necrotic = 0;

  // Order matters here, and getting it wrong is what broke the first attempt at
  // this rewrite. Yellow has a *high* normalised Excess Green -- the index only
  // measures how little blue there is, and chlorotic tissue has very little --
  // so testing "is it green?" first classified every yellowed pixel as healthy
  // and the analyser stopped seeing chlorosis at all. The yellow band is
  // therefore tested before the green one.
  for (let i = 0; i < n; i++) {
    if (!mask[i]) continue;
    const q = i * 3;
    const r = balanced[q], g = balanced[q + 1];
    const hu = hue[i], sa = sat[i], va = val[i];

    if (hu < T.necroHueMax && g <= r * T.necroGreenRatio && (va < T.necroValue || sa > T.necroSat)) {
      // Same channel-dominance idea as below. Testing normalised Excess Green
      // here instead left a gap: brown blended over bright green tissue landed
      // just under the hue cut *and* just over the greenness cut, so genuinely
      // dead pixels were scored as healthy.
      cls[i] = 3; necrotic++;                                 // dead brown tissue
    } else if (
      hu >= T.chlorHueMin && hu <= T.chlorHueMax &&
      g <= r * T.chlorGreenRatio &&
      va >= T.chlorValueMin && sa <= T.chlorSatMax
    ) {
      // Yellow and yellow-green occupy the same hue band. What separates them is
      // which channel leads: in living tissue green out-ranks red, and in
      // chlorotic tissue it no longer does.
      //
      // The brightness and saturation limits keep dry grass, straw and bare sand
      // out. A yellowing leaf is still a lit, living surface -- dark or intensely
      // saturated yellow is the ground, not the plant.
      cls[i] = 2; chlorotic++;
    } else {
      cls[i] = 1; healthy++;
    }
  }

  /* ---------- 4b. damage has to be *on* a leaf ---------- */

  // v3. The kiosk does not photograph a leaf on paper; it photographs a potted
  // plant on the floor. The brown in that frame is mostly the soil in the pot,
  // the hand holding the phone, a table leg and the grout between tiles, and v2
  // scored every one of them as dead leaf tissue -- a healthy vinca came back
  // "Stressed, 49% necrotic". Real damage is not like that: a lesion sits inside
  // a green blade, a scorched tip is still joined to the green part of its leaf.
  // So a brown or yellow blob only counts as leaf when a real share of its edge
  // touches healthy green tissue. Measured on the team's kiosk photographs, the
  // soil, skin and grout blobs touch green along 0-12% of their edge; a lesion
  // ringed by leaf touches it along most of its edge.
  //
  // A frame with little green in it -- one dead leaf on its own -- skips this
  // test, so a leaf that really is brown all over is still read as necrotic.
  let leafGreen = 0;
  for (let i = 0; i < n; i++) {
    if (cls[i] === 1 && hue[i] >= T.attachGreenHue && exgn[i] > T.attachGreenExg) leafGreen++;
  }
  if (leafGreen >= tissue * T.attachMinGreenShare || leafGreen >= n * T.attachMinGreenFrame) {
    const dropped = dropDetachedDamage(mask, cls, val, hue, exgn, w, h, T);
    healthy -= dropped.healthy;
    chlorotic -= dropped.chlorotic;
    necrotic -= dropped.necrotic;
    tissue -= dropped.healthy + dropped.chlorotic + dropped.necrotic;
    coverage = tissue / n;
  }

  /* ---------- 5. bail out if there is no leaf ---------- */

  if (coverage < T.minCoverage || tissue < 200) {
    if (paint) paintOverlay(px, cls, grey, n);
    return {
      valid: false,
      coverage,
      leafConfidence: 0,
      metrics: { chlorosis: 0, necrosis: 0, greenness: 0, uniformity: 0, texture: 0, coverage },
      score: null,
      band: null,
      findings: [{ level: 'warn', key: 'noLeaf' }],
      whiteBalanced: gainR !== 1 || gainG !== 1 || gainB !== 1,
    };
  }

  const chlorosis = chlorotic / tissue;
  const necrosis = necrotic / tissue;

  /* ---------- 6. greenness ---------- */

  let exgnSum = 0;
  for (let i = 0; i < n; i++) if (mask[i]) exgnSum += exgn[i];
  const meanExgn = exgnSum / tissue;
  const greenness = clamp01((meanExgn - T.greennessLo) / (T.greennessHi - T.greennessLo));

  /* ---------- 7. uniformity and texture, inside the rim ---------- */

  // Both of these are measured on the eroded mask. The rim of the leaf blends
  // into the backdrop over two or three pixels, and those blended pixels have
  // neither the leaf's hue nor its texture -- including them is what produced
  // spurious "mottled" and "pitted" findings on clean leaves.
  const inner = erode(mask, w, h, 2);
  let innerCount = 0;
  for (let i = 0; i < n; i++) innerCount += inner[i];
  const measureMask = innerCount > tissue * 0.15 ? inner : mask;

  let sx = 0, sy = 0, hueCount = 0;
  for (let i = 0; i < n; i++) {
    if (!measureMask[i]) continue;
    const rad = (hue[i] * Math.PI) / 180;
    sx += Math.cos(rad); sy += Math.sin(rad); hueCount++;
  }
  const R = hueCount ? Math.sqrt(sx * sx + sy * sy) / hueCount : 1;
  const circSd = Math.sqrt(Math.max(0, -2 * Math.log(Math.max(R, 1e-6))));
  const uniformity = clamp01(1 - circSd / T.uniformitySd);

  // Texture as a *contrast ratio* rather than an absolute difference: dividing
  // the Laplacian by local brightness means a dark leaf and a bright one with
  // the same surface score the same.
  let lapSum = 0, lapCount = 0;
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const i = y * w + x;
      if (!measureMask[i]) continue;
      const lap = Math.abs(4 * grey[i] - grey[i - 1] - grey[i + 1] - grey[i - w] - grey[i + w]);
      lapSum += lap / (grey[i] + 16);
      lapCount++;
    }
  }
  const texture = lapCount ? clamp01(lapSum / lapCount / T.textureNorm) : 0;

  /* ---------- 8. score ---------- */

  // Penalties are asymmetric and each has a dead zone. Dead tissue is far worse
  // than the same area of yellowing; and a leaf that is 5% yellow is a leaf, not
  // a patient.
  let score = 100;
  score -= Math.max(0, necrosis - T.necrosisFree) * T.necrosisWeight;
  score -= Math.max(0, chlorosis - T.chlorosisFree) * T.chlorosisWeight;
  score -= Math.max(0, T.uniformityFloor - uniformity) * T.uniformityWeight;
  score -= Math.max(0, T.greennessFloor - greenness) * T.greennessWeight;
  score -= Math.max(0, texture - T.textureFree) * T.textureWeight;
  score = Math.round(Math.min(100, Math.max(0, score)));

  const band =
    score >= 85 ? 'excellent' :
    score >= 70 ? 'good' :
    score >= 52 ? 'fair' :
    score >= 32 ? 'poor' : 'critical';

  /* ---------- 9. findings ---------- */

  const findings = [];
  const pct = (x) => Math.round(x * 100);

  if (necrosis >= T.necrosisHigh) findings.push({ level: 'bad', key: 'necrosisHigh', v: pct(necrosis) });
  else if (necrosis >= T.necrosisSome) findings.push({ level: 'warn', key: 'necrosisSome', v: pct(necrosis) });

  if (chlorosis >= T.chlorosisHigh) findings.push({ level: 'bad', key: 'chlorosisHigh', v: pct(chlorosis) });
  else if (chlorosis >= T.chlorosisSome) findings.push({ level: 'warn', key: 'chlorosisSome', v: pct(chlorosis) });

  if (uniformity < T.mottledBelow) findings.push({ level: 'warn', key: 'mottled' });
  if (texture > T.textureAbove) findings.push({ level: 'warn', key: 'texture' });
  if (greenness < T.paleBelow) findings.push({ level: 'warn', key: 'pale' });
  if (coverage < T.smallLeafBelow) findings.push({ level: 'info', key: 'smallLeaf', v: pct(coverage) });

  // Framing advice is not a symptom: a small leaf in the frame says nothing about
  // the plant, so it never turns a clean reading into a problem.
  const problems = findings.filter((f) => f.level === 'warn' || f.level === 'bad').length;
  if (!problems) findings.push({ level: 'ok', key: 'clean' });
  if (necrosis < T.necrosisFree && chlorosis < T.chlorosisFree) {
    findings.unshift({ level: 'ok', key: 'evenColour' });
  }

  /* ---------- 10. how sure are we that this is a leaf at all ---------- */

  // Combines "enough of the frame is plant tissue" with "that tissue actually
  // looks like foliage". app.js uses this alongside the classifier's own
  // uncertainty to decide whether to name a species or admit it does not know.
  const coverageScore = clamp01((coverage - T.minCoverage) / (T.confidentCoverage - T.minCoverage));
  const foliageScore = clamp01((meanExgn + 0.05) / 0.18);

  // Colour alone is not enough, because the mask selected these pixels *for*
  // being leaf-coloured -- asking how green they are is circular, and random
  // colour noise sails through it. Structure is the independent check: a leaf is
  // made of solid regions that survive being eroded, while noise and speckle are
  // scattered and mostly disappear.
  const solidity = tissue ? innerCount / tissue : 0;
  const structureScore = clamp01((solidity - T.solidityFloor) / (T.solidityGood - T.solidityFloor));

  // The weaker of the two wins rather than the average of them. Averaging let
  // strong colour evidence outvote absent structure, which is exactly the case
  // that matters: random colour noise scores full marks on greenness. Measured
  // over the reference set, the least solid real leaf sits at 0.64 and noise at
  // 0.08, so requiring both to agree costs nothing on genuine photographs.
  const colourScore = 0.35 * coverageScore + 0.65 * foliageScore;
  const leafConfidence = clamp01(Math.min(colourScore, structureScore));

  if (paint) paintOverlay(px, cls, grey, n);

  return {
    valid: true,
    score,
    band,
    coverage,
    leafConfidence,
    // Handed out only when asked for. tools/health-calibrate.mjs uses it to
    // rebuild each reference photo as a leaf on plain paper, which is the
    // condition the app is actually used in.
    mask: opts.returnMask ? mask : undefined,
    metrics: { chlorosis, necrosis, greenness, uniformity, texture, coverage },
    solidity,
    findings,
    whiteBalanced: gainR !== 1 || gainG !== 1 || gainB !== 1,
  };
}

function clamp01(x) { return Math.min(1, Math.max(0, x)); }

/**
 * Species whose healthy foliage is naturally pale, grey or blue-green.
 *
 * Apple of Sodom is woolly grey-green, Ghaf and Samar blue-green, Athel and
 * the mangrove grey with salt. Scored against a generic "how green is it"
 * bar, every one of them reads as low-chlorophyll while perfectly healthy. Once
 * the classifier has named the plant, the greenness test is judged against the
 * species instead of against a lettuce.
 */
const NATURALLY_PALE = new Set(['osher', 'ghaf', 'samar', 'athl', 'qurm', 'arak', 'mesquite']);

/**
 * Re-reads a health result in the light of which species it is.
 *
 * Only ever removes a finding the species explains; it never adds one. Called
 * once the classifier has answered and is confident or uncertain (not when it
 * refused to name the plant, because then there is no species to judge by).
 */
export function refineForSpecies(result, speciesKey) {
  if (!result?.valid || !NATURALLY_PALE.has(speciesKey)) return result;
  if (!result.findings.some((f) => f.key === 'pale')) return result;
  const T = TUNING;
  const m = result.metrics;
  const penalty = Math.max(0, T.greennessFloor - m.greenness) * T.greennessWeight;
  const score = Math.round(Math.min(100, result.score + penalty));
  const band =
    score >= 85 ? 'excellent' :
    score >= 70 ? 'good' :
    score >= 52 ? 'fair' :
    score >= 32 ? 'poor' : 'critical';
  let findings = result.findings.filter((f) => f.key !== 'pale');
  findings.push({ level: 'info', key: 'speciesNormal' });
  if (!findings.some((f) => f.level === 'warn' || f.level === 'bad') && !findings.some((f) => f.key === 'clean')) {
    findings = [...findings, { level: 'ok', key: 'clean' }];
  }
  return { ...result, score, band, findings };
}

/** Tints the classified pixels so the user can see *where* the damage is. */
function paintOverlay(px, cls, grey, n) {
  for (let i = 0, p = 0; i < n; i++, p += 4) {
    if (cls[i] === 2) {            // chlorotic -> amber wash
      px[p] = Math.min(255, px[p] * 0.55 + 232 * 0.45);
      px[p + 1] = Math.min(255, px[p + 1] * 0.55 + 176 * 0.45);
      px[p + 2] = px[p + 2] * 0.45;
    } else if (cls[i] === 3) {     // necrotic -> red wash
      px[p] = Math.min(255, px[p] * 0.45 + 226 * 0.55);
      px[p + 1] = px[p + 1] * 0.4;
      px[p + 2] = px[p + 2] * 0.4;
    } else if (cls[i] === 0) {     // background -> desaturate and dim
      const gl = grey[i] * 0.55;
      px[p] = gl; px[p + 1] = gl; px[p + 2] = gl;
    }
  }
}

/* ---------- browser entry point ---------- */

/**
 * @param {CanvasImageSource} source  an <img>, <canvas> or <video> frame
 * @returns {object} metrics, findings and an overlay canvas
 */
export function analyseLeaf(source) {
  const sw = source.naturalWidth || source.videoWidth || source.width;
  const sh = source.naturalHeight || source.videoHeight || source.height;
  const scale = WORK / Math.max(sw, sh);
  const w = Math.max(1, Math.round(sw * scale));
  const h = Math.max(1, Math.round(sh * scale));

  const cv = document.createElement('canvas');
  cv.width = w; cv.height = h;
  const ctx = cv.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(source, 0, 0, w, h);
  const img = ctx.getImageData(0, 0, w, h);

  const result = analysePixels(img.data, w, h, { paint: true });
  ctx.putImageData(img, 0, 0);

  return { ...result, overlay: cv };
}

/** Human-readable finding text, kept next to the analyser that produces it. */
export const FINDING_TEXT = {
  en: {
    clean: 'No significant discolouration or damage detected.',
    evenColour: 'Colour is even across the blade — a good sign.',
    necrosisHigh: (v) => `${v}% of the leaf is dead brown tissue. This is advanced damage — likely fungal blight, scorch or late-stage pest attack.`,
    necrosisSome: (v) => `${v}% necrotic tissue: small dead patches, often the first sign of leaf-spot disease or sun scorch.`,
    chlorosisHigh: (v) => `${v}% of the leaf has yellowed. Widespread chlorosis usually means nutrient deficiency (iron or nitrogen) or salt stress from irrigation water.`,
    chlorosisSome: (v) => `${v}% yellowing detected — early nutrient or watering stress.`,
    mottled: 'Colour is mottled rather than even, which is typical of viral infection or uneven nutrient uptake.',
    texture: 'High surface texture variance: pitting, lesions or insect feeding damage.',
    pale: 'Overall greenness is low — the leaf is pale, suggesting reduced chlorophyll.',
    smallLeaf: (v) => `The leaf fills only ${v}% of the frame; move closer for a more reliable reading.`,
    noLeaf: 'No leaf could be separated from the background. Use a plain, contrasting backdrop and fill more of the frame.',
    speciesNormal: 'Pale, grey-green foliage is normal for this species, so it is not counted as a problem.',
  },
  ar: {
    clean: 'لم يُرصد تغيّر لوني أو ضرر ملحوظ.',
    evenColour: 'اللون متجانس على كامل النصل، وهذه علامة جيدة.',
    necrosisHigh: (v) => `${v}٪ من الورقة نسيج بني ميت. ضرر متقدم، غالباً لفحة فطرية أو احتراق شمسي أو إصابة حشرية متأخرة.`,
    necrosisSome: (v) => `${v}٪ نسيج متنخر: بقع ميتة صغيرة، وهي غالباً أول علامات تبقع الأوراق أو الاحتراق الشمسي.`,
    chlorosisHigh: (v) => `${v}٪ من الورقة اصفرّت. الاصفرار الواسع يعني عادةً نقص المغذيات (الحديد أو النيتروجين) أو إجهاداً ملحياً من مياه الري.`,
    chlorosisSome: (v) => `رُصد اصفرار بنسبة ${v}٪ — إجهاد مبكر في التغذية أو الري.`,
    mottled: 'اللون مبقّع وغير متجانس، وهو نمط شائع في الإصابات الفيروسية أو عدم انتظام امتصاص المغذيات.',
    texture: 'تباين عالٍ في ملمس السطح: تنقّر أو تقرحات أو أثر تغذية حشرات.',
    pale: 'درجة الخضرة منخفضة والورقة شاحبة، ما يشير إلى نقص الكلوروفيل.',
    smallLeaf: (v) => `الورقة تملأ ${v}٪ فقط من الإطار؛ اقترب أكثر للحصول على قراءة أدق.`,
    noLeaf: 'تعذّر فصل الورقة عن الخلفية. استخدم خلفية سادة مغايرة واملأ الإطار بالورقة.',
    speciesNormal: 'الأوراق الشاحبة الرمادية المخضرة طبيعية في هذا النوع، ولذلك لا تُحسب مشكلة.',
  },
};
