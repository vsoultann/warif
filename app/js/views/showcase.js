/**
 * Kiosk mode.
 *
 * The screen on the table at the showcase. It has to survive a whole day of
 * strangers, which sets every decision here:
 *
 *   - it never sleeps (Screen Wake Lock), because a black screen reads as a
 *     broken project from three metres away;
 *   - it resets itself after 90 seconds of nobody touching it, and clearing the
 *     last scan is part of that — the next visitor must not be greeted by a
 *     stranger's leaf;
 *   - there is no settings button, no navigation and no way to wander off into
 *     the poster by accident;
 *   - leaving takes a deliberate act: Escape, or holding the logo for three
 *     seconds. A stray tap cannot drop a visitor out of kiosk mode.
 */
import { html, raw, $, $$ } from '../ui/dom.js';
import { t, lang, L } from '../i18n.js';
import { icon } from '../icons.js';
import { SPECIES } from '../data/species.js';
import { CONFIG } from '../config.js';
import { clearScan } from '../state.js';
import { go } from '../router.js';
import { reducedMotion } from '../themes.js';

export default function showcaseView() {
  /* One fact per tree, in both languages, taken from the library rather than
     written twice — a fact on the attract screen that disagrees with the tree's
     own page is the kind of thing a judge notices. */
  const facts = SPECIES.map((sp) => ({
    name: { en: sp.en.name, ar: sp.ar.name },
    text: { en: sp.en.significance, ar: sp.ar.significance },
  }));

  return {
    html: html`<div class="kiosk" id="kiosk">
      <main class="kiosk-body">
        <button class="kiosk-logo" id="kiosk-logo" type="button" aria-label="${t('showcase.exit')}">
          <span class="lockup-stacked" role="img" aria-label="Warif وارف"></span>
        </button>

        <p class="kiosk-tagline">${L(CONFIG.product.tagline)}</p>

        <div class="kiosk-fact" id="kiosk-fact" aria-live="off">
          ${raw(factMarkup(facts[0]))}
        </div>

        <a class="kiosk-cta" href="#/">
          ${raw(icon('scan', { size: 44 }))}
          <span>${t('showcase.tap')}</span>
        </a>

        <div class="kiosk-qr">
          <div class="qr"><img src="./assets/qr.svg" alt="" width="150" height="150"></div>
          <p class="small">${t('showcase.qr')}</p>
        </div>
      </main>

      <p class="kiosk-exit small">${t('showcase.exit')}</p>
    </div>`,

    mount: (root) => mount(root, facts),
  };
}

function factMarkup(fact) {
  const active = lang();
  const other = active === 'ar' ? 'en' : 'ar';
  return `<p class="fact-label small">${t('showcase.did')}</p>
    <p class="fact-name">${fact.name[active]}</p>
    <p class="fact-text" lang="${active}" dir="${active === 'ar' ? 'rtl' : 'ltr'}">${fact.text[active]}</p>
    <p class="fact-text fact-alt" lang="${other}" dir="${other === 'ar' ? 'rtl' : 'ltr'}">${fact.text[other]}</p>`;
}

function mount(root, facts) {
  document.body.dataset.kiosk = '1';

  /* The kiosk *session* outlives this view: a visitor who walks away has
     usually walked away from a result, two taps deeper in. The idle watcher is
     installed once and keeps running until somebody deliberately leaves. */
  document.body.dataset.kioskSession = '1';
  watchKioskIdle();

  const factEl = $('#kiosk-fact', root);
  const timers = [];
  let wakeLock = null;

  /* ------------------------------------------------------------- rotation */

  let index = 0;
  const rotate = () => {
    index = (index + 1) % facts.length;
    factEl.dataset.swap = '1';
    // Under reduced motion the fact still changes; it simply does not fade.
    const delay = reducedMotion() ? 0 : 220;
    timers.push(setTimeout(() => {
      factEl.innerHTML = factMarkup(facts[index]);
      factEl.dataset.swap = '0';
    }, delay));
  };
  const rotation = setInterval(rotate, CONFIG.kiosk.factMs);

  /* ------------------------------------------------------------ wake lock */

  const requestWake = async () => {
    try { wakeLock = await navigator.wakeLock?.request('screen'); } catch { /* unsupported or denied */ }
  };
  requestWake();
  // A wake lock is dropped whenever the tab is hidden, so it has to be retaken.
  const onVisible = () => { if (document.visibilityState === 'visible') requestWake(); };
  document.addEventListener('visibilitychange', onVisible);

  /* ----------------------------------------------------------------- exit */

  const logo = $('#kiosk-logo', root);
  let held = null;

  const startHold = () => {
    held = setTimeout(() => { leave(); }, 3000);
  };
  const cancelHold = () => { clearTimeout(held); held = null; };

  const onKey = (e) => { if (e.key === 'Escape') leave(); };

  function leave() {
    cancelHold();
    document.body.dataset.kioskSession = '0';
    go('/');
  }

  logo.addEventListener('pointerdown', startHold);
  logo.addEventListener('pointerup', cancelHold);
  logo.addEventListener('pointerleave', cancelHold);
  logo.addEventListener('pointercancel', cancelHold);
  window.addEventListener('keydown', onKey);

  return () => {
    clearInterval(rotation);
    for (const id of timers) clearTimeout(id);
    cancelHold();
    window.removeEventListener('keydown', onKey);
    document.removeEventListener('visibilitychange', onVisible);
    wakeLock?.release().catch(() => {});
    delete document.body.dataset.kiosk;
  };
}

/**
 * The idle reset, installed once for the whole session.
 *
 * It lives outside the view because the visitor who needs resetting is not on
 * this screen — they are two taps into a result, holding the leaf they scanned,
 * and they have walked away. After the idle window the app returns here and
 * forgets what they scanned.
 */
let watching = false;

export function watchKioskIdle() {
  if (watching) return;
  watching = true;

  let timer = null;
  const arm = () => {
    clearTimeout(timer);
    if (document.body.dataset.kioskSession !== '1') return;
    timer = setTimeout(() => {
      clearScan();
      go('/showcase');
    }, CONFIG.kiosk.idleMs);
  };

  for (const event of ['pointerdown', 'keydown', 'hashchange']) {
    window.addEventListener(event, arm, { passive: true });
  }
  arm();
}
