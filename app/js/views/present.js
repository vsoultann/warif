/**
 * The presentation, inside the app.
 *
 * The slides live here rather than in a separate deck for one practical reason:
 * the numbers on them are the numbers the app is showing. A slide that reads
 * 81.5% because somebody typed 81.5% into a text box will be wrong the first
 * time the model is retrained, and nobody will notice until an evaluator
 * compares the slide with the screen behind it.
 *
 * The timer is built for the assessment's rules rather than for a stopwatch's:
 * it marks the four-minute floor, the seven-and-a-half-minute target and the
 * ten-minute ceiling, so the speaker can see which band they are in without
 * doing arithmetic in front of an audience.
 */
import { html, raw, $, $$, clock } from '../ui/dom.js';
import { t, lang, L, num, pct } from '../i18n.js';
import { icon } from '../icons.js';
import { SLIDES } from '../data/presentation.js';
import { TEAM, SUPERVISOR, LEADER, MEMBERS } from '../data/team.js';
import { ITERATIONS } from '../data/journey.js';
import { metadataSync, counts } from '../metadata.js';
import { SPECIES, SPECIES_BY_KEY } from '../data/species.js';
import { CONFIG } from '../config.js';
import { go } from '../router.js';

const byId = Object.fromEntries(TEAM.map((m) => [m.id, m]));

export default function presentView(ctx) {
  const start = Math.min(SLIDES.length - 1, Math.max(0, Number(ctx.query.get('slide') ?? 0)));

  return {
    html: html`<div class="deck" id="deck" data-notes="0" data-timer="0" style="--slide:${start}">
      <div class="deck-stage">
        ${raw(SLIDES.map((slide, i) => `<section class="slide" data-index="${i}"${i === start ? '' : ' hidden'}>${body(slide)}</section>`))}
      </div>

      <footer class="deck-bar">
        <button class="iconbtn" id="deck-prev" type="button" aria-label="${t('present.slide', { i: 1, n: SLIDES.length })}">
          ${raw(icon('back'))}
        </button>
        <span class="deck-count tnum" id="deck-count"></span>
        <span class="deck-speaker" id="deck-speaker"></span>
        <span class="spacer"></span>
        <span class="deck-timer tnum" id="deck-timer" data-band="under">0:00</span>
        <button class="btn btn-quiet" id="deck-toggle-timer" type="button">${t('present.timer')}</button>
        <button class="btn btn-quiet" id="deck-toggle-notes" type="button">${t('present.notes')}</button>
        <button class="iconbtn" id="deck-next" type="button" aria-label="${t('present.slide', { i: SLIDES.length, n: SLIDES.length })}">
          ${raw(icon('chevron'))}
        </button>
      </footer>

      <aside class="deck-notes" id="deck-notes" hidden></aside>
      <p class="deck-keys small">${t('present.keys')}</p>
    </div>`,

    mount: (root) => mount(root, start),
  };
}

/* ----------------------------------------------------------------- slides */

function body(slide) {
  const speaker = byId[slide.speaker];
  const title = `<h2 class="slide-title">${L(slide.title ?? { en: '', ar: '' })}</h2>`;

  switch (slide.kind) {
    case 'title': return titleSlide(slide);
    case 'problem': return `${title}${problemSlide()}`;
    case 'journey': return `${title}${journeySlide()}`;
    case 'demo': return `${title}${demoSlide()}`;
    case 'ai': return `${title}${aiSlide()}`;
    case 'impact': return `${title}${impactSlide()}`;
    default: return `${title}<p>${speaker ? L(speaker.role) : ''}</p>`;
  }
}

function titleSlide(slide) {
  return `<div class="slide-title-layout">
    <span class="lockup-stacked" role="img" aria-label="Warif وارف"></span>
    <div>
      <p class="slide-tagline">${L(slide.subtitle)}</p>
      <p class="slide-lede">${L(CONFIG.product.descriptor)}</p>
      <dl class="slide-facts">
        <dt>${t('team.leader')}</dt><dd>${L({ en: LEADER.name, ar: LEADER.ar })}</dd>
        <dt>${t('team.members')}</dt><dd>${MEMBERS.map((m) => L({ en: m.name, ar: m.ar })).join(lang() === 'ar' ? '، ' : ', ')}</dd>
        <dt>${t('team.supervisor')}</dt><dd>${L({ en: SUPERVISOR.name, ar: SUPERVISOR.ar })}</dd>
      </dl>
      <p class="small muted">${L(CONFIG.school)} — ${L(CONFIG.programme)}, ${CONFIG.programme.year}</p>
    </div>
  </div>`;
}

function problemSlide() {
  const tally = counts(SPECIES.length);
  return `<div class="slide-two">
    <ul class="slide-points">
      <li>${L(PRESSURES.salinity)}</li>
      <li>${L(PRESSURES.dieback)}</li>
      <li>${L(PRESSURES.weevil)}</li>
      <li>${L(PRESSURES.mesquite)}</li>
    </ul>
    <div class="slide-stat">
      <p class="stat-value tnum">${num(tally.library)}</p>
      <p class="small muted">${L(PRESSURES.libraryLabel)}</p>
    </div>
  </div>`;
}

function journeySlide() {
  const shown = ITERATIONS.slice(0, 2);
  return `<div class="slide-two">
    <div>
      <p class="slide-lede">${L(CONFIG.product.meaning)}</p>
      <p class="slide-tagline">${L(CONFIG.product.tagline)}</p>
    </div>
    <ul class="slide-points">
      ${shown.map((it) => `<li><b>${L(it.problem).split('.')[0]}.</b> ${L(it.result)}</li>`).join('')}
    </ul>
  </div>`;
}

function demoSlide() {
  return `<div class="slide-demo">
    <p class="slide-lede">${L(DEMO_SCRIPT)}</p>
    <p><a class="btn btn-primary btn-lg" href="#/?from=present">${icon('camera')}${t('present.demo')}</a></p>
    <p class="small muted">${t('present.back')}</p>
  </div>`;
}

function aiSlide() {
  const meta = metadataSync();
  if (!meta) return `<p>${t('lab.noData')}</p>`;

  const worst = meta.classes
    .map((key) => ({ key, value: meta.perClassAccuracy?.[key] ?? 1 }))
    .sort((a, b) => a.value - b.value)[0];

  return `<div class="slide-two">
    <dl class="slide-kv">
      <dt>${t('how.classes')}</dt><dd class="tnum">${num(meta.classes.length)}</dd>
      <dt>${t('how.validation')}</dt><dd class="tnum">${pct(meta.validationAccuracy, 1)}</dd>
      <dt>${t('how.samples')}</dt><dd class="tnum">${num(meta.trainingSamples)}</dd>
      <dt>${t('how.oodTitle')}</dt><dd class="tnum">${num(meta.oodThreshold, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</dd>
    </dl>
    <ul class="slide-points">
      <li>${L(AI_POINTS.twoSystems)}</li>
      <li>${L(AI_POINTS.explainable)}</li>
      <li>${L(AI_POINTS.weakest).replace('{tree}', SPECIES_BY_KEY[worst.key] ? L(SPECIES_BY_KEY[worst.key]).name : worst.key)
        .replace('{value}', pct(worst.value, 1))}</li>
      <li>${L(AI_POINTS.offline)}</li>
    </ul>
  </div>`;
}

function impactSlide() {
  return `<div class="slide-two">
    <ul class="slide-points">
      ${L(IMPACT).map((p) => `<li>${p}</li>`).join('')}
    </ul>
    <div class="slide-qr">
      <div class="qr"><img src="./assets/qr.svg" alt="" width="160" height="160"></div>
      <p class="small">${t('showcase.qr')}</p>
    </div>
  </div>`;
}

/* ------------------------------------------------------------------ mount */

function mount(root, start) {
  const deck = $('#deck', root);
  const slides = $$('.slide', root);
  const count = $('#deck-count', root);
  const speaker = $('#deck-speaker', root);
  const notes = $('#deck-notes', root);
  const timerEl = $('#deck-timer', root);

  let index = start;
  let elapsed = 0;
  let ticking = null;

  const show = (next) => {
    index = Math.max(0, Math.min(slides.length - 1, next));
    slides.forEach((s, i) => { s.hidden = i !== index; });
    count.textContent = t('present.slide', { i: index + 1, n: slides.length });

    const who = byId[SLIDES[index].speaker];
    speaker.textContent = who ? `${t('present.speaker')}: ${L({ en: who.name, ar: who.ar })}` : '';
    notes.innerHTML = `<h3>${t('present.notes')}</h3><p>${L(SLIDES[index].notes)}</p>
      <p class="small muted tnum">${clock(SLIDES[index].seconds)} — ${t('present.slide', { i: index + 1, n: slides.length })}</p>`;

    history.replaceState(null, '', `#/present?slide=${index}`);
  };

  /* ---------------------------------------------------------------- timer */

  const paint = () => {
    timerEl.textContent = clock(elapsed);
    // Three bands rather than a countdown: under the floor, inside the window,
    // and over the ceiling. The speaker needs to know which, not how many
    // seconds are left.
    timerEl.dataset.band = elapsed < CONFIG.presentation.minSeconds ? 'under'
      : elapsed > CONFIG.presentation.maxSeconds ? 'over' : 'in';
    timerEl.setAttribute('aria-label', `${clock(elapsed)} / ${clock(CONFIG.presentation.targetSeconds)}`);
  };

  const toggleTimer = () => {
    if (ticking) { clearInterval(ticking); ticking = null; deck.dataset.timer = '0'; return; }
    deck.dataset.timer = '1';
    ticking = setInterval(() => { elapsed += 1; paint(); }, 1000);
  };

  /* --------------------------------------------------------------- wiring */

  const onKey = (e) => {
    if (e.target.closest('input, textarea')) return;
    // Arrow keys follow the reading direction: in Arabic, Left is forward.
    const forward = lang() === 'ar' ? 'ArrowLeft' : 'ArrowRight';
    const back = lang() === 'ar' ? 'ArrowRight' : 'ArrowLeft';

    if (e.key === forward || e.key === 'PageDown' || e.key === ' ') { e.preventDefault(); show(index + 1); }
    else if (e.key === back || e.key === 'PageUp') { e.preventDefault(); show(index - 1); }
    else if (e.key === 'Home') show(0);
    else if (e.key === 'End') show(slides.length - 1);
    else if (e.key.toLowerCase() === 'n') { deck.dataset.notes = deck.dataset.notes === '1' ? '0' : '1'; notes.hidden = deck.dataset.notes !== '1'; }
    else if (e.key.toLowerCase() === 't') toggleTimer();
    else if (e.key === 'Escape') go('/project');
  };

  root.addEventListener('click', (e) => {
    if (e.target.closest('#deck-next')) show(index + 1);
    else if (e.target.closest('#deck-prev')) show(index - 1);
    else if (e.target.closest('#deck-toggle-timer')) toggleTimer();
    else if (e.target.closest('#deck-toggle-notes')) {
      deck.dataset.notes = deck.dataset.notes === '1' ? '0' : '1';
      notes.hidden = deck.dataset.notes !== '1';
    }
  });

  window.addEventListener('keydown', onKey);
  show(index);
  paint();

  return () => {
    window.removeEventListener('keydown', onKey);
    if (ticking) clearInterval(ticking);
  };
}

/* ------------------------------------------------------------- slide copy */

const PRESSURES = {
  salinity: { en: 'Irrigation water carries more salt than the tree can excrete, and the leaf yellows months before the tree shows it.', ar: 'تحمل مياه الري ملحاً أكثر مما تستطيع الشجرة طرحه، فتصفرّ الورقة قبل أشهر من ظهور الأثر على الشجرة.' },
  dieback: { en: 'Ghaf dieback has hit UAE plantations, and its first sign is a blackened leaflet tip.', ar: 'أصاب موت الأطراف مزارع الغاف في الإمارات، وأول علاماته اسوداد طرف الوريقة.' },
  weevil: { en: 'Red palm weevil kills a palm from the inside; the fronds are the first outward sign.', ar: 'تقتل سوسة النخيل الحمراء النخلة من الداخل، والسعف أول علامة ظاهرة.' },
  mesquite: { en: 'Invasive mesquite is displacing the native Ghaf it closely resembles, which is exactly why telling them apart matters.', ar: 'يزيح المسكيت الغازي الغافَ المحلي الذي يشبهه كثيراً، ولهذا بالذات يهمّ التمييز بينهما.' },
  libraryLabel: { en: 'trees documented, with the signs to look for on each', ar: 'شجرة موثّقة، ومعها العلامات التي تُفحص في كل منها' },
};

const DEMO_SCRIPT = {
  en: 'Scan a leaf, talk through the three stages as the band weaves, show the health map, then point the camera at something that is not a UAE tree and let it say so.',
  ar: 'امسح ورقة، واشرح المراحل الثلاث بينما ينسج الشريط، واعرض خريطة الصحة، ثم وجّه الكاميرا إلى شيء ليس شجرة إماراتية ودعه يقول ذلك.',
};

const AI_POINTS = {
  twoSystems: { en: 'Two separate systems: a neural network names the tree, classical computer vision grades the leaf.', ar: 'نظامان منفصلان: شبكة عصبية تسمّي الشجرة، ورؤية حاسوبية كلاسيكية تقيّم الورقة.' },
  explainable: { en: 'The health half uses no neural network at all, so every number can be explained and shown on the photograph.', ar: 'لا يستخدم نصف الصحة أي شبكة عصبية، فكل رقم فيه قابل للشرح وللعرض على الصورة نفسها.' },
  weakest: { en: 'The weakest class is {tree} at {value} — we say so rather than quoting only the average.', ar: 'أضعف صنف هو {tree} بنسبة {value}، ونقولها بدل الاكتفاء بذكر المتوسط.' },
  offline: { en: 'It all runs on the device, with no upload and no account, and it works offline.', ar: 'يعمل كل ذلك على الجهاز، بلا رفع للصور ولا حساب، ويعمل دون إنترنت.' },
};

const IMPACT = {
  en: [
    'A school, a municipality gardener, a farm with no reliable connection, a family with a Ghaf in the yard.',
    'Next: finish training all ten trees, add field photographs from Al Ain, and test with a municipality nursery.',
    'Thank you to our supervisor and our school. Questions welcome.',
  ],
  ar: [
    'مدرسة، وعامل حدائق في بلدية، ومزرعة بلا اتصال موثوق، وأسرة في فنائها شجرة غاف.',
    'القادم: إكمال تدريب الأشجار العشر، وإضافة صور ميدانية من العين، والاختبار مع مشتل تابع لبلدية.',
    'شكراً لمشرفنا ولمدرستنا، وأهلاً بأسئلتكم.',
  ],
};
