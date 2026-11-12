/**
 * Pulls openly-licensed leaf photographs from iNaturalist for each species.
 *
 * Only research-grade observations with a reusable licence are kept, and each
 * candidate photo has to survive a cheap "is this actually foliage?" screen
 * before it lands on disk -- iNaturalist observations are full of bark, trunk
 * and habitat shots that would otherwise poison the training set.
 *
 *   node tools/fetch-dataset.mjs [--per-class 400] [--force]
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { SPECIES } from './species.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT = path.join(ROOT, 'dataset', 'inaturalist');

const args = process.argv.slice(2);
const defaultPerClass = Number(args[args.indexOf('--per-class') + 1]) || 400;
const force = args.includes('--force');

const OPEN_LICENCES = ['cc0', 'cc-by', 'cc-by-sa', 'cc-by-nc', 'cc-by-nc-sa'];
const UA = 'Warif/2.0 (graduation project; contact via github.com/vsoultann)';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function api(url, attempt = 0) {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': UA } });
    if (res.status === 429 || res.status >= 500) throw new Error(`http ${res.status}`);
    if (!res.ok) throw new Error(`http ${res.status}`);
    return await res.json();
  } catch (err) {
    if (attempt >= 4) throw err;
    await sleep(1500 * 2 ** attempt);
    return api(url, attempt + 1);
  }
}

/** Collect observation photo URLs for one taxon, newest-first across pages. */
async function listPhotos(taxonId, want) {
  const found = [];
  const seen = new Set();
  for (let page = 1; page <= 20 && found.length < want * 3; page++) {
    const url =
      `https://api.inaturalist.org/v1/observations?taxon_id=${taxonId}` +
      `&quality_grade=research&photos=true&photo_license=${OPEN_LICENCES.join(',')}` +
      `&order_by=votes&per_page=200&page=${page}`;
    const json = await api(url);
    if (!json.results?.length) break;
    for (const obs of json.results) {
      for (const photo of obs.photos || []) {
        // iNaturalist serves "square" by default; ask for the 500px edition.
        const medium = photo.url.replace('/square.', '/medium.');
        if (seen.has(medium)) continue;
        seen.add(medium);
        found.push({
          url: medium,
          id: photo.id,
          attribution: photo.attribution || '',
          licence: photo.license_code || 'unknown',
          observation: obs.id,
        });
      }
    }
    await sleep(1100); // iNaturalist asks for <= 1 request/second.
  }
  return found;
}

/**
 * Rejects photos that are unlikely to show foliage.
 *
 * Uses the Excess Green index (2G - R - B), the standard cheap vegetation
 * discriminator: bark, sand, sky and signage all score far below live leaves.
 * Also throws out anything too small or too lopsided to be a useful crop.
 */
async function looksLikeFoliage(buffer) {
  const img = sharp(buffer, { failOn: 'none' });
  const meta = await img.metadata();
  if (!meta.width || !meta.height) return false;
  if (Math.min(meta.width, meta.height) < 180) return false;
  const ratio = meta.width / meta.height;
  if (ratio > 2.4 || ratio < 1 / 2.4) return false;

  const { data, info } = await img
    .resize(64, 64, { fit: 'cover' })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  let greenPixels = 0;
  const total = info.width * info.height;
  for (let i = 0; i < data.length; i += 3) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const exg = 2 * g - r - b;
    if (exg > 22 && g > 45) greenPixels++;
  }
  return greenPixels / total >= 0.16;
}

async function fetchSpecies(species) {
  const perClass = Math.max(defaultPerClass, species.fetch || 0);
  const dir = path.join(OUT, species.key);
  await fs.mkdir(dir, { recursive: true });

  const existing = (await fs.readdir(dir)).filter((f) => f.endsWith('.jpg'));
  if (existing.length >= perClass && !force) {
    console.log(`  ${species.en.padEnd(10)} already has ${existing.length} images, skipping`);
    return { kept: existing.length, credits: [] };
  }

  console.log(`  ${species.en.padEnd(10)} querying iNaturalist (taxon ${species.taxonId})...`);
  const candidates = await listPhotos(species.taxonId, perClass);
  console.log(`  ${species.en.padEnd(10)} ${candidates.length} candidate photos, screening...`);

  const credits = [];
  let kept = 0;
  let rejected = 0;

  // Photos come off a static CDN rather than the API, so a few run at once; the
  // API listing above is what the one-request-per-second guidance is about.
  async function one(photo) {
    const dest = path.join(dir, `${photo.id}.jpg`);
    // Already on disk from an interrupted run: still owed its credit line.
    try { await fs.access(dest); credits.push(photo); return 'kept'; } catch { /* not cached, carry on */ }
    try {
      const res = await fetch(photo.url, { headers: { 'User-Agent': UA } });
      if (!res.ok) return 'dead';
      const buf = Buffer.from(await res.arrayBuffer());
      if (!(await looksLikeFoliage(buf))) return 'rejected';
      // Normalise to a square 256px JPEG so training loads are uniform.
      await sharp(buf, { failOn: 'none' })
        .resize(256, 256, { fit: 'cover', position: 'attention' })
        .jpeg({ quality: 88 })
        .toFile(dest);
      credits.push(photo);
      return 'kept';
    } catch { return 'dead'; } // a dead photo URL is not worth aborting the run for
  }

  // A rolling pool: each lane takes the next photo as soon as its last one is
  // done, so one slow download never holds the others up.
  const LANES = 32;
  let next = 0;
  let reported = 0;
  await Promise.all(Array.from({ length: LANES }, async () => {
    while (next < candidates.length && kept < perClass) {
      const r = await one(candidates[next++]);
      if (r === 'kept') kept++;
      else if (r === 'rejected') rejected++;
      if (kept - reported >= 50) { reported = kept; process.stdout.write(`    ...${kept}\n`); }
    }
  }));
  // Lanes still in flight when the target was reached may overshoot slightly;
  // trim the extras so every class lands on its intended count.
  const onDisk = (await fs.readdir(dir)).filter((n) => n.endsWith('.jpg')).sort();
  for (const extra of onDisk.slice(perClass)) await fs.rm(path.join(dir, extra));
  kept = Math.min(kept, perClass);

  console.log(`  ${species.en.padEnd(10)} kept ${kept}, rejected ${rejected} as non-foliage`);
  return { kept, credits };
}

/**
 * Credits already on disk.
 *
 * A class that is already complete is skipped, and a skipped class returns no
 * credits -- so rebuilding the manifest from scratch would silently erase the
 * attribution for every species fetched on an earlier run. These photographs are
 * used under Creative Commons licences that require credit, so the old entries
 * are carried forward rather than overwritten.
 */
async function existingCredits() {
  try {
    const prev = JSON.parse(await fs.readFile(path.join(OUT, 'CREDITS.json'), 'utf8'));
    return prev.classes || {};
  } catch { return {}; }
}

const carried = await existingCredits();
const manifest = { generated: new Date().toISOString(), source: 'iNaturalist', classes: {} };
console.log(`Fetching up to ${defaultPerClass} images per species into dataset/inaturalist/\n`);

for (const species of SPECIES) {
  const { kept, credits } = await fetchSpecies(species);
  const previous = carried[species.key]?.credits || [];
  // Merge by photo id: a resumed run reports only the photos it downloaded this
  // time, and both sets belong in the manifest.
  const byId = new Map(previous.map((c) => [c.id, c]));
  for (const c of credits) byId.set(c.id, c);
  const onDisk = new Set((await fs.readdir(path.join(OUT, species.key))).map((n) => n.replace(/\.jpg$/, '')));
  manifest.classes[species.key] = {
    latin: species.latin, count: kept,
    credits: [...byId.values()].filter((c) => onDisk.has(String(c.id))),
  };
}

await fs.mkdir(OUT, { recursive: true });
await fs.writeFile(path.join(OUT, 'CREDITS.json'), JSON.stringify(manifest, null, 2));
console.log('\nDone. Photo credits written to dataset/inaturalist/CREDITS.json');
