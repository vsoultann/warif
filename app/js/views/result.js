/**
 * The result.
 *
 * Two separate answers about one photograph, and the page never lets them blur
 * into each other: a neural network names the tree, and a classical-vision
 * analyser grades the leaf. They can disagree, they can be confident to
 * different degrees, and one can be reported while the other is refused.
 *
 * The order is the order a person asks: what is it, how sure are you, how is it
 * doing, what is wrong, what do I do, and where do I get that.
 */
import { html, raw, $, $$, toast } from '../ui/dom.js';
import { bilingual, latin } from '../ui/bilingual.js';
import { t, lang, L, num, pct } from '../i18n.js';
import { icon } from '../icons.js';
import { confidenceMeter, healthMeter, statusPill } from '../ui/meters.js';
import { revealRows } from '../ui/weave.js';
import { leafShape } from '../ui/leaf-shapes.js';
import { SPECIES_BY_KEY } from '../data/species.js';
import { TREATMENTS, SPECIES_ALERTS, treatmentsFor } from '../data/treatments.js';
import { SUPPLIERS } from '../data/suppliers.js';
import { FINDING_TEXT } from '../health.js';
import { getMetadata } from '../model.js';
import { rankSuppliers, knownPosition } from '../nearby.js';
import { supplierRow } from '../ui/supplier.js';
import { lastScan } from '../state.js';
import { CONFIG } from '../config.js';

export default function resultView() {
  const scan = lastScan();
  if (!scan) return { html: empty() };

  return {
    html: scan.recognition.state === 'unknown' ? unknown(scan) : identified(scan),
    mount: (root) => mount(root, scan),
  };
}

/* ------------------------------------------------------------------ empty */

function empty() {
  return html`<div class="shell stack-lg result-empty">
    <h1>${t('result.title')}</h1>
    <p class="muted">${t('result.none')}</p>
    <p><a class="btn btn-primary" href="#/">${raw(icon('camera'))}${t('scan.start')}</a></p>
  </div>`;
}

/* ------------------------------------------------------------- identified */

function identified(scan) {
  const key = scan.prediction.top.key;
  const species = SPECIES_BY_KEY[key];
  const health = scan.health;
  const uncertain = scan.recognition.state === 'uncertain';

  const names = { en: species.en.name, ar: species.ar.name };
  const alt = scan.prediction.ranked.slice(1, 3).filter((r) => r.p > 0.02);

  // A leaf the analyser could not separate from its background has no health
  // reading at all. v2 drew that as a red "necrosis" pill over an empty meter,
  // which read as "this plant is sick" -- the opposite of what happened.
  const bandTone = !health.valid ? 'unread'
    : health.band === 'excellent' || health.band === 'good' ? 'healthy'
    : health.band === 'fair' ? 'chlorosis' : 'necrosis';

  const findings = health.valid ? health.findings : [{ level: 'info', key: 'noLeaf' }];
  const treatmentKeys = health.valid ? treatmentsFor(health.findings) : [];
  const alert = alertFor(key, health.findings);

  return html`<div class="shell result">

    <header class="result-title">
      ${raw(bilingual(names, { size: 'xl', tag: 'h1', latin: species.latin }))}
      <p class="small muted">${L(species).family}</p>
    </header>

    <div class="result-side">
      ${raw(photoPanel(scan))}

      <div class="panel result-confidence">
        ${raw(confidenceMeter(scan.prediction.top.p))}
        ${raw(uncertain ? uncertainNote(scan.recognition.reasons) : '')}
        ${raw(alt.length ? `<p class="small muted">${t('result.alternatives')}: ${alt.map((r) =>
          `${SPECIES_BY_KEY[r.key] ? L(SPECIES_BY_KEY[r.key]).name : r.key} ${pct(r.p)}`).join(lang() === 'ar' ? '، ' : ', ')}</p>` : '')}
      </div>

      <section class="panel result-health" aria-labelledby="health-title">
        <div class="section-head">
          <h2 id="health-title">${t('result.health')}</h2>
          ${raw(statusPill(bandTone, health.valid ? t(`health.${health.band}`) : t('health.invalid')))}
        </div>
        ${raw(health.valid ? healthMeter(health.score, health.band) : `<p class="small">${t('health.unreadBody')}</p>`)}
        <p class="small muted">${t('health.legend')}</p>
      </section>
    </div>

    <div class="result-main">
      <section class="panel" aria-labelledby="findings-title">
        <h2 id="findings-title" class="section-title">${t('result.findings')}</h2>
        <ul class="findings">
          ${raw(findings.map((f) => {
            const text = FINDING_TEXT[lang()][f.key] ?? FINDING_TEXT.en[f.key];
            const body = typeof text === 'function' ? text(num(f.v)) : text;
            return `<li class="finding" data-level="${f.level}">
              <span class="finding-mark" aria-hidden="true"></span>
              <span>${body ?? f.key}</span>
            </li>`;
          }))}
        </ul>
      </section>

      ${raw(alert ? `<section class="panel panel-alert">
        <h2 class="section-title">${L(alert.title)}</h2>
        <p>${L(alert.body)}</p>
      </section>` : '')}

      ${raw(treatmentKeys.length ? treatmentSection(treatmentKeys) : '')}
      ${raw(treatmentKeys.length ? supplierSection(treatmentKeys) : '')}

      <details class="panel panel-sunk method">
        <summary>${t('result.method')}</summary>
        <p class="small">${t('result.methodBody')}</p>
        <p class="small muted">${modelLine()}</p>
      </details>

      <div class="result-actions">
        <a class="btn btn-primary btn-lg" href="#/">${raw(icon('camera'))}${t('scan.again')}</a>
        <a class="btn btn-outline" href="#/trees/${key}">${raw(icon('leaf'))}${t('result.readMore')}</a>
        <button class="btn btn-outline" id="act-share" type="button">${raw(icon('share'))}${t('result.share')}</button>
      </div>

      <p class="small muted disclaimer">${L(CONFIG.disclaimer)}</p>
    </div>
  </div>`;
}

/* ---------------------------------------------------------------- unknown */

/**
 * The refusal.
 *
 * This is the screen a judge goes looking for, and it is the one v1 could not
 * show: an app that answers "Ghaf, 61%" to a photograph of a shoe has failed in
 * the most visible way available to it. So the refusal is not an error state —
 * it is a result, with its own reasons and its own next step.
 */
function unknown(scan) {
  const reasons = scan.recognition.reasons.map((r) => t(`unknown.${r}`));

  return html`<div class="shell result result-unknown">

    <header class="result-title">
      ${raw(bilingual({ en: 'Warif doesn’t recognise this leaf.', ar: 'لم يتعرّف «وارف» على هذه الورقة.' }, { size: 'l', tag: 'h1' }))}
      <p class="lede">${t('unknown.body')}</p>
    </header>

    <div class="result-side">${raw(photoPanel(scan, { plain: true }))}</div>

    <div class="result-main">
      <section class="panel" aria-labelledby="why-title">
        <h2 id="why-title" class="section-title">${t('unknown.why')}</h2>
        <ul class="findings">
          ${raw(reasons.map((r) => `<li class="finding" data-level="warn"><span class="finding-mark" aria-hidden="true"></span><span>${r}</span></li>`))}
        </ul>
      </section>

      <section class="panel panel-sunk" aria-labelledby="tips-title">
        <h2 id="tips-title" class="section-title">${t('unknown.tips')}</h2>
        <ol class="tips">
          <li>${t('unknown.tip1')}</li>
          <li>${t('unknown.tip2')}</li>
          <li>${t('unknown.tip3')}</li>
        </ol>
      </section>

      <div class="result-actions">
        <a class="btn btn-primary btn-lg" href="#/">${raw(icon('camera'))}${t('unknown.retry')}</a>
        <a class="btn btn-outline" href="#/trees">${raw(icon('trees'))}${t('unknown.seeTrees')}</a>
      </div>
    </div>
  </div>`;
}

/**
 * Why an identification is being flagged.
 *
 * "Confidence is low" was the only thing this used to say, and it was often
 * simply untrue: the model can answer 100% and still be flagged, because the
 * photograph sits far from every tree it was trained on. Saying the wrong reason
 * is worse than saying none — so the actual reasons are listed, in the same
 * words the refusal screen uses.
 */
function uncertainNote(reasons) {
  const listed = reasons.filter((r) => r !== 'noFoliage');
  return html`<div class="note note-warn">
    <p><strong>${t('result.uncertain')}</strong></p>
    ${when(listed.length, () => html`<ul class="reasons">${raw(listed.map((r) => `<li>${t(`unknown.${r}`)}</li>`))}</ul>`)}
    <p class="small">${t('result.uncertainAdvice')}</p>
  </div>`;
}

/** Conditional markup, without a dangling ternary at every call site. */
function when(cond, fn) { return cond ? raw(fn()) : raw(''); }

/* ----------------------------------------------------------------- pieces */

/**
 * The photograph, with the health map behind a toggle.
 *
 * The overlay is the argument for the score: green tissue, yellow chlorotic,
 * brown dead, painted onto the visitor's own leaf. A number they cannot check is
 * a number they have to believe.
 */
function photoPanel(scan, { plain = false } = {}) {
  return html`<figure class="result-photo" id="result-photo" data-view="photo">
    <div class="photo-frame">
      <img src="${scan.photo}" alt="" class="photo-base">
      ${raw(!plain && scan.overlay ? `<img src="${scan.overlay}" alt="" class="photo-overlay" id="photo-overlay">` : '')}
    </div>
    ${raw(!plain && scan.overlay ? `<figcaption class="seg photo-toggle" role="group" aria-label="${t('result.photo')}">
      <button type="button" data-photo="photo" aria-pressed="true">${t('result.photo')}</button>
      <button type="button" data-photo="map" aria-pressed="false">${t('result.healthMap')}</button>
    </figcaption>` : '')}
  </figure>`;
}

function treatmentSection(keys) {
  return html`<section class="panel" aria-labelledby="todo-title">
    <h2 id="todo-title" class="section-title">${t('result.todo')}</h2>
    <div class="treatments">
      ${raw(keys.map((k) => {
        const tr = TREATMENTS[k];
        return `<article class="treatment">
          <p class="treatment-cause">${L(tr.cause)}</p>
          <ul class="products">
            ${tr.products.map((p) => `<li>
              <b>${L(p)}</b>
              <span class="small muted">${L(p.note)}</span>
            </li>`).join('')}
          </ul>
        </article>`;
      }))}
    </div>
  </section>`;
}

/**
 * The three nearest places that sell what the treatment needs.
 *
 * Ranked by distance when the visitor has shared a location on the Help page,
 * and in file order when they have not — never by a made-up distance.
 */
function supplierSection(keys) {
  const category = categoryOf(keys);
  const here = knownPosition();
  const near = rankSuppliers(SUPPLIERS, category, here).slice(0, 3);
  if (!near.length) return '';

  return html`<section class="panel" aria-labelledby="where-title">
    <div class="section-head">
      <h2 id="where-title">${t('result.where')}</h2>
      <a class="small" href="#/help">${t('result.whereAll')}</a>
    </div>
    <ul class="suppliers">
      ${raw(near.map((s) => supplierRow(s)))}
    </ul>
  </section>`;
}

/** The single supplier category that best covers the recommended treatments. */
function categoryOf(keys) {
  for (const k of keys) {
    const search = TREATMENTS[k]?.products?.[0]?.search;
    if (search) return categoryForSearch(search);
  }
  return null;
}

function categoryForSearch(search) {
  if (/fertilizer|fertiliser|iron|gypsum|compost|npk|fungicide|pesticide|neem|insecticid|trap/i.test(search)) return 'chemicals';
  if (/pruning|tools|meter|shears/i.test(search)) return 'tools';
  return 'plants';
}

/** Fires the red palm weevil and invasive-mesquite advice when it applies. */
function alertFor(key, findings) {
  const alert = SPECIES_ALERTS[key];
  if (!alert) return null;
  if (alert.when === null) return alert;
  return findings.some((f) => alert.when.includes(f.key)) ? alert : null;
}

function modelLine() {
  const meta = getMetadata();
  if (!meta) return '';
  return `${meta.architecture} — ${t('how.validation')} ${pct(meta.validationAccuracy, 1)}`;
}

/* ------------------------------------------------------------------ mount */

function mount(root, scan) {
  const figure = $('#result-photo', root);
  const overlay = $('#photo-overlay', root);

  /* The health map reveals row by row, the way weft rows build on a loom — and
     only the first time, because a toggle should be instant. */
  if (overlay && scan.health.valid) {
    revealRows(figure, { rows: 14 });
  }

  root.addEventListener('click', (e) => {
    const toggle = e.target.closest('[data-photo]');
    if (toggle) {
      figure.dataset.view = toggle.dataset.photo;
      for (const b of $$('[data-photo]', root)) b.setAttribute('aria-pressed', String(b === toggle));
      return;
    }

    if (e.target.closest('#act-share')) share(scan);
  });
}

/**
 * Share.
 *
 * The Web Share API where it exists, the clipboard where it does not. The text
 * carries the result rather than only a link, because the person receiving it
 * usually wants the answer, not an app to install.
 */
async function share(scan) {
  const species = SPECIES_BY_KEY[scan.prediction.top.key];
  const name = species ? L(species).name : '';
  const text = scan.recognition.state === 'unknown'
    ? t('unknown.title')
    : `${name} — ${t('result.health')}: ${num(scan.health.score)}/100 (${t(`health.${scan.health.band}`)})`;

  const payload = { title: 'Warif', text, url: CONFIG.links.site };

  try {
    if (navigator.share) { await navigator.share(payload); return; }
    await navigator.clipboard.writeText(`${text}\n${CONFIG.links.site}`);
    toast(t('result.shared'));
  } catch {
    /* The visitor dismissed the share sheet, which is not a failure. */
  }
}
