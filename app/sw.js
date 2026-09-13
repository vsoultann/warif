/**
 * Offline cache for the kiosk.
 *
 * The whole point of this app is that it keeps working when the venue's wifi
 * does not, so the install step precaches the whole shell *and* the ~14 MB
 * model. The activate step deletes every older cache, so a stale model can
 * never linger.
 *
 * CACHE and SHELL below are generated — run `npm run sw` after changing
 * anything in app/, and the cache name changes with the contents. Editing
 * either by hand will work until the next time somebody runs the tool.
 */
const CACHE = 'warif-v1-39bc75ef';

const SHELL = [
  './',
  './assets/brand/sadu-band-contrast.svg',
  './assets/brand/sadu-band.svg',
  './assets/brand/warif-lockup-dark.png',
  './assets/brand/warif-lockup-dark.svg',
  './assets/brand/warif-lockup-rtl.svg',
  './assets/brand/warif-lockup-stacked-dark.svg',
  './assets/brand/warif-lockup-stacked.png',
  './assets/brand/warif-lockup-stacked.svg',
  './assets/brand/warif-lockup.png',
  './assets/brand/warif-lockup.svg',
  './assets/brand/warif-mark-dark.svg',
  './assets/brand/warif-mark-mono.svg',
  './assets/brand/warif-mark.svg',
  './assets/fonts/OFL-Readex-Pro.txt',
  './assets/fonts/OFL-Reem-Kufi.txt',
  './assets/fonts/readex-pro-arabic-wght-normal.woff2',
  './assets/fonts/readex-pro-latin-wght-normal.woff2',
  './assets/fonts/reem-kufi-arabic-wght-normal.woff2',
  './assets/fonts/reem-kufi-latin-wght-normal.woff2',
  './assets/icons/icon-180.png',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/icon-maskable.png',
  './assets/icons/icon-maskable.svg',
  './assets/icons/icon.svg',
  './assets/og.png',
  './assets/qr.svg',
  './css/base.css',
  './css/components.css',
  './css/print.css',
  './css/tokens.css',
  './css/views.css',
  './data/lab.json',
  './evidence/v1/library-en-desktop.jpg',
  './evidence/v1/scan-en-desktop.jpg',
  './evidence/v1/team-en-desktop.jpg',
  './evidence/v2/home-en-desktop.jpg',
  './evidence/v2/home-en-phone.jpg',
  './evidence/v2/project-how-en-phone.jpg',
  './evidence/v2/result-en-phone.jpg',
  './evidence/v2/team-en-desktop.jpg',
  './evidence/v2/trees-en-desktop.jpg',
  './img/CREDITS.md',
  './img/ats-logo.png',
  './img/mbr.jpg',
  './img/mbz.jpg',
  './img/zayed.jpg',
  './index.html',
  './js/app.js',
  './js/config.js',
  './js/data/about.js',
  './js/data/journey.js',
  './js/data/presentation.js',
  './js/data/species.js',
  './js/data/suppliers.js',
  './js/data/team.js',
  './js/data/treatments.js',
  './js/health.js',
  './js/i18n.js',
  './js/icons.js',
  './js/metadata.js',
  './js/model.js',
  './js/nearby.js',
  './js/router.js',
  './js/state.js',
  './js/themes.js',
  './js/ui/bilingual.js',
  './js/ui/dom.js',
  './js/ui/leaf-shapes.js',
  './js/ui/meters.js',
  './js/ui/model-gate.js',
  './js/ui/supplier.js',
  './js/ui/weave.js',
  './js/views/brand.js',
  './js/views/feedback.js',
  './js/views/help.js',
  './js/views/how.js',
  './js/views/journey.js',
  './js/views/lab.js',
  './js/views/poster.js',
  './js/views/present.js',
  './js/views/project.js',
  './js/views/result.js',
  './js/views/scan.js',
  './js/views/showcase.js',
  './js/views/team.js',
  './js/views/tree.js',
  './js/views/trees.js',
  './manifest.webmanifest',
  './model/head/model.json',
  './model/head/weights.bin',
  './model/metadata.json',
  './model/mobilenet/group1-shard1of4',
  './model/mobilenet/group1-shard2of4',
  './model/mobilenet/group1-shard3of4',
  './model/mobilenet/group1-shard4of4',
  './model/mobilenet/model.json',
  './model/ood.json',
  './samples/credits.json',
  './samples/ghaf-stressed.jpg',
  './samples/ghaf.jpg',
  './samples/nakhl-stressed.jpg',
  './samples/nakhl.jpg',
  './samples/samar.jpg',
  './samples/sidr.jpg',
  './vendor/tf.min.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    // addAll() is all-or-nothing; one 404 would leave the kiosk with no cache
    // at all, so each entry is allowed to fail on its own.
    await Promise.all(SHELL.map((url) =>
      cache.add(new Request(url, { cache: 'reload' })).catch(() => {})
    ));
    self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter((n) => n !== CACHE).map((n) => caches.delete(n)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // let fonts go straight to the network

  // Navigations: network first so a redeploy is picked up, cache as the safety net.
  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(request);
        const cache = await caches.open(CACHE);
        cache.put('./index.html', fresh.clone());
        return fresh;
      } catch {
        return (await caches.match('./index.html')) || Response.error();
      }
    })());
    return;
  }

  // Everything else: cache first. Model weights never change without a version
  // bump, and this is what makes an offline scan possible.
  event.respondWith((async () => {
    const hit = await caches.match(request);
    if (hit) return hit;
    try {
      const fresh = await fetch(request);
      if (fresh.ok) {
        const cache = await caches.open(CACHE);
        cache.put(request, fresh.clone());
      }
      return fresh;
    } catch {
      return Response.error();
    }
  })());
});
