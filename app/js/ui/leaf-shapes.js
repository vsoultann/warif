/**
 * A line drawing of each tree's leaf.
 *
 * v1 used emoji — 🌳 for the Ghaf, 🌴 for the date palm, 🌾 for the Samar. They
 * are not drawings of those leaves, they are not drawings of anything in the
 * UAE, and three of the ten species ended up sharing one glyph. An app whose
 * entire argument is "you can tell these trees apart by their leaves" cannot
 * illustrate them with a picture of a different plant.
 *
 * So each is drawn to its actual structure: bipinnate for the Ghaf and the
 * Mesquite, the three basal veins of the Sidr, a pinnate frond for the date
 * palm, jointed scale-leaves for the Athel. They are schematic, not botanical
 * illustration, but they are schematics of the right thing — and side by side
 * the Ghaf and the Mesquite differ in exactly the way the real leaves do.
 *
 * Drawn on a 48-unit grid with the same 1.75 stroke as the icon set, so they
 * sit in the same family.
 */

const round = (n) => Number(n.toFixed(1));

/** A rachis with leaflet pairs along it — the shape of a compound leaf. */
function pinnate(x1, y1, x2, y2, { pairs, length, tip = 0.14, curve = 0 }) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const nx = -uy;
  const ny = ux;

  const parts = [`M${round(x1)} ${round(y1)}L${round(x2)} ${round(y2)}`];
  for (let i = 0; i < pairs; i++) {
    const at = tip + ((1 - tip * 2) * i) / Math.max(1, pairs - 1);
    const px = x1 + dx * at;
    const py = y1 + dy * at;
    // Leaflets shorten towards the tip, as they do on a real rachis.
    const l = length * (0.6 + 0.4 * Math.sin(Math.PI * at));
    const back = curve * l;
    for (const side of [1, -1]) {
      const ex = px + nx * l * side - ux * back;
      const ey = py + ny * l * side - uy * back;
      parts.push(`M${round(px)} ${round(py)}L${round(ex)} ${round(ey)}`);
    }
  }
  return parts.join('');
}

const SHAPES = {
  /* Bipinnate: one stalk, two side rachises, small paired leaflets on each. */
  ghaf: () =>
    `M24 45V26` +
    pinnate(24, 26, 11, 7, { pairs: 7, length: 3.4 }) +
    pinnate(24, 26, 37, 7, { pairs: 7, length: 3.4 }) +
    `M21 33l-2.6-2M27 33l2.6-2`,

  /* Simple oval with the three bold basal veins and a finely toothed edge. */
  sidr: () =>
    `M24 44C13 36 12 18 24 5c12 13 11 31 0 39Z` +
    `M24 41V9M24 38C19 31 17 22 18.6 13M24 38c5-7 7-16 5.4-25`,

  /* A pinnate frond: stiff leaflets set in a V along a long midrib. */
  nakhl: () =>
    `M24 46C24 34 24 18 24 4` +
    pinnate(24, 42, 24, 8, { pairs: 9, length: 8.5, tip: 0.06, curve: 0.35 }),

  /* Bipinnate like the Ghaf but finer, with the paired straight thorns. */
  samar: () =>
    `M24 45V28` +
    pinnate(24, 28, 13, 10, { pairs: 8, length: 2.6 }) +
    pinnate(24, 28, 35, 10, { pairs: 8, length: 2.6 }) +
    `M24 33l-5.5-3.5M24 33l5.5-3.5`,

  /* A thick, entire-margined ellipse — a mangrove leaf, salt glands and all. */
  qurm: () =>
    `M24 45C14 37 13 17 24 4c11 13 10 33 0 41Z` +
    `M24 42V8` +
    `M24 30l-6-4M24 30l6-4M24 21l-5.5-4M24 21l5.5-4`,

  /* Athel tamarisk: no blade at all, just jointed scale-leaves on a green twig. */
  athl: () => {
    const parts = [`M24 46V4`];
    for (let i = 0; i < 6; i++) {
      const y = 40 - i * 6.4;
      parts.push(`M24 ${round(y)}q-7 -1.5 -9 -6`);
      parts.push(`M24 ${round(y - 3)}q7 -1.5 9 -6`);
    }
    return parts.join('');
  },

  /* Arak: small fleshy opposite leaves on a straight stem. */
  arak: () => {
    const parts = [`M24 46V6`];
    for (let i = 0; i < 4; i++) {
      const y = 39 - i * 8.5;
      parts.push(`M24 ${round(y)}c-6 0-9-3.5-9-6 4.5-1 9 1.5 9 6Z`);
      parts.push(`M24 ${round(y - 3)}c6 0 9-3.5 9-6-4.5-1-9 1.5-9 6Z`);
    }
    return parts.join('');
  },

  /* Neem: pinnate, with sickle-shaped toothed leaflets. */
  neem: () =>
    `M24 45V7` +
    pinnate(24, 42, 24, 10, { pairs: 6, length: 9, tip: 0.08, curve: 0.55 }),

  /* Apple of Sodom: one very large, broad, soft leaf with a heavy midrib. */
  osher: () =>
    `M24 45C9 35 8 15 24 4c16 11 15 31 0 41Z` +
    `M24 43V7` +
    `M24 33l-9-6M24 33l9-6M24 24l-8.5-6M24 24l8.5-6M24 15l-6.5-4.5M24 15l6.5-4.5`,

  /* Mesquite: the Ghaf's structure with longer leaflets and long paired spines
     at the node — the difference you are meant to be able to see. */
  mesquite: () =>
    `M24 45V27` +
    pinnate(24, 27, 12, 8, { pairs: 9, length: 4.6 }) +
    pinnate(24, 27, 36, 8, { pairs: 9, length: 4.6 }) +
    `M24 34l-8-4.5M24 34l8-4.5M24 39l-6.5-3M24 39l6.5-3`,
  /* Vinca: a pair of glossy opposite ovals on a soft stem, pale midribs. */
  vinca: () =>
    `M24 46V6` +
    `M24 30C14 31 6 26 4 20c7-3 16-1 20 10Z` +
    `M24 30C34 31 42 26 44 20c-7-3-16-1-20 10Z` +
    `M24 30L9 22M24 30l15-8` +
    `M24 14c-6 .5-11-2-12-6 5-1.5 10 0 12 6Zm0 0c6 .5 11-2 12-6-5-1.5-10 0-12 6Z`,

  /* Papaya: one huge hand-shaped blade, deeply cut into lobes, on a long stalk. */
  papaya: () => {
    // Seven broad, round-shouldered lobes fanned over the top of a long stalk,
    // with a vein running out to every tip.
    const cx = 24, cy = 27, lobes = 7, from = -200, to = 20;
    const at = (deg, r) => {
      const a = (deg * Math.PI) / 180;
      return `${round(cx + r * Math.cos(a))} ${round(cy + r * Math.sin(a))}`;
    };
    const step = (to - from) / lobes;
    let d = `M24 46V${cy}M${at(from, 9)}`;
    let veins = '';
    for (let i = 0; i < lobes; i++) {
      const s0 = from + i * step;
      const tip = s0 + step / 2;
      const s1 = s0 + step;
      d += `C${at(s0 + step * 0.12, 16)} ${at(tip - step * 0.32, 20)} ${at(tip, 22)}`;
      d += `C${at(tip + step * 0.32, 20)} ${at(s1 - step * 0.12, 16)} ${at(s1, 9)}`;
      veins += `M${cx} ${cy}L${at(tip, 14)}`;
    }
    return d + `L${cx} ${cy}Z` + veins;
  },
};

/**
 * @param {string} key  a species key
 * @param {{size?:number, cls?:string}} [opts]
 */
export function leafShape(key, opts = {}) {
  const build = SHAPES[key];
  if (!build) return '';
  const size = opts.size ?? 48;
  // One <path> holding every subpath: the builders above return SVG path data,
  // not markup, so it has to be the `d` attribute rather than the element's
  // content — which renders nothing at all and does it silently.
  return `<svg class="leaf-shape${opts.cls ? ` ${opts.cls}` : ''}" viewBox="0 0 48 48" width="${size}" height="${size}"`
    + ` fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"`
    + ` aria-hidden="true"><path d="${build()}"/></svg>`;
}

export const shapeKeys = Object.keys(SHAPES);
