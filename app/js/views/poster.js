/**
 * The A1 poster, as a web page.
 *
 * Printed from Chrome with "Save as PDF" and background graphics on. Everything
 * is in millimetres and `@page { size: A1 }`, so what the browser lays out is
 * what the print shop receives — there is no separate artwork file to fall out
 * of step with the app, and every figure on it is read from the same data the
 * app reads.
 *
 *   #/poster            A1 portrait, 594 x 841 mm
 *   #/poster?size=A0    for a larger stand
 *   #/poster?size=A2    for a desk copy
 *
 * The screenshots are the real ones from docs/evidence, so the poster cannot
 * show a version of the app that no longer exists.
 */
import { html, raw } from '../ui/dom.js';
import { t, lang, L, num, pct, date } from '../i18n.js';
import { CONFIG } from '../config.js';
import { SPECIES } from '../data/species.js';
import { metadataSync, counts, recognisedKeys } from '../metadata.js';
import { leafShape } from '../ui/leaf-shapes.js';
import { LEADER, MEMBERS, SUPERVISOR } from '../data/team.js';
import { STAGES } from '../data/journey.js';

const SIZES = {
  A0: { w: 841, h: 1189, scale: 1.414 },
  A1: { w: 594, h: 841, scale: 1 },
  A2: { w: 420, h: 594, scale: 0.707 },
};

export default async function posterView(ctx) {
  const size = SIZES[String(ctx.query.get('size') ?? 'A1').toUpperCase()] ?? SIZES.A1;
  const meta = metadataSync();
  const tally = counts(SPECIES.length);
  const recognised = recognisedKeys();

  /* Every figure on the sheet is read at render time — the model card from
     metadata.json, the measurements from lab.json. A poster that goes to a print
     shop with a number typed into it is a poster that will disagree with the app
     the moment anything is re-measured, and it will do it in A1. */
  const lab = await fetch('./data/lab.json').then((r) => (r.ok ? r.json() : null)).catch(() => null);
  const cal = lab?.accuracy?.calibration ?? null;

  return {
    html: html`<div class="poster" style="--pw:${size.w}mm; --ph:${size.h}mm; --pscale:${size.scale}">
      <style>@page { size: ${raw(size.w)}mm ${raw(size.h)}mm; margin: 0 }</style>

      <header class="poster-head">
        <span class="lockup" role="img" aria-label="Warif وارف"></span>
        <div class="poster-title">
          <h1>${L(POSTER.title)}</h1>
          <p class="poster-tagline">${L(CONFIG.product.tagline)}</p>
          <p class="poster-descriptor">${L(CONFIG.product.descriptor)}</p>
        </div>
        <div class="poster-credits">
          ${raw(CONFIG.school.hasLogo ? `<img class="poster-school-logo" src="${CONFIG.school.logo}" alt="${L(CONFIG.school)}">` : '')}
          <p><b>${L(CONFIG.school)}</b></p>
          <p>${L(CONFIG.programme)} — ${CONFIG.programme.year}</p>
          <p>${t('team.leader')}: ${L({ en: LEADER.name, ar: LEADER.ar })}</p>
          <p>${MEMBERS.map((m) => L({ en: m.name, ar: m.ar })).join(lang() === 'ar' ? '، ' : ', ')}</p>
          <p>${t('team.supervisor')}: ${L({ en: SUPERVISOR.name, ar: SUPERVISOR.ar })}</p>
        </div>
      </header>

      <div class="poster-grid">
        <section class="poster-block">
          <h2>${L(POSTER.problemTitle)}</h2>
          ${raw(L(POSTER.problem).map((p) => `<p>${p}</p>`))}
        </section>

        <section class="poster-block">
          <h2>${L(POSTER.researchTitle)}</h2>
          ${raw(L(POSTER.research).map((p) => `<p>${p}</p>`))}
        </section>

        <section class="poster-block poster-wide">
          <h2>${t('journey.stages')}</h2>
          <ol class="poster-stages">
            ${raw(STAGES.map((s) => `<li>
              <b>${L(s.title)}</b>
              <span>${L(s.date)}</span>
            </li>`))}
          </ol>
        </section>

        <section class="poster-block poster-wide">
          <h2>${t('how.pipeline')}</h2>
          <ol class="poster-pipeline">
            ${raw(L(POSTER.pipeline).map((step) => `<li>${step}</li>`))}
          </ol>
        </section>

        <section class="poster-block">
          <h2>${t('lab.accuracy')}</h2>
          ${raw(meta ? `<dl class="poster-kv">
            <div><dt>${t('how.classes')}</dt><dd>${num(meta.classes.length)} / ${num(tally.library)}</dd></div>
            <div><dt>${t('how.validation')}</dt><dd>${pct(meta.validationAccuracy, 1)}</dd></div>
            <div><dt>${t('how.samples')}</dt><dd>${num(meta.trainingSamples)}</dd></div>
            <div><dt>${t('how.valSamples')}</dt><dd>${num(meta.validationSamples)}</dd></div>
          </dl>` : '')}
          <p class="poster-note">${L(POSTER.accuracyNote)}</p>
        </section>

        <section class="poster-block">
          <h2>${t('lab.calibration')}</h2>
          ${raw(cal ? `<dl class="poster-kv">
            <div><dt>${t('lab.healthyReported')}</dt><dd>${pct(cal.healthyReportedBefore, 1)} → ${pct(cal.healthyReportedAfter, 1)}</dd></div>
            <div><dt>${t('lab.medianScore')}</dt><dd>${num(cal.medianScoreBefore)} → ${num(cal.medianScoreAfter)}</dd></div>
            <div><dt>${t('lab.syntheticNecrosis')}</dt><dd>${pct(cal.syntheticNecrosis, 1)}</dd></div>
            <div><dt>${t('lab.syntheticChlorosis')}</dt><dd>${pct(cal.syntheticChlorosisLow, 1)}–${pct(cal.syntheticChlorosisHigh, 1)}</dd></div>
          </dl>` : `<p class="poster-note">${t('lab.noData')}</p>`)}
          <p class="poster-note">${L(POSTER.calibrationNote)}</p>
          ${raw(lab ? `<p class="poster-note">${t('lab.measuredOn', { device: lab.device, date: date(lab.measuredAt) })}</p>` : '')}
        </section>

        <section class="poster-block poster-wide">
          <h2>${t('scan.knows')}</h2>
          <ul class="poster-trees">
            ${raw(SPECIES.map((sp) => `<li${recognised.has(sp.key) ? '' : ' data-reference="1"'}>
              ${leafShape(sp.key, { size: 92 })}
              <b>${L(sp).name}</b>
              <span>${lang() === 'ar' ? sp.en.name : sp.ar.name}</span>
              <em>${recognised.has(sp.key) ? t('trees.recognised') : t('trees.reference')}</em>
            </li>`))}
          </ul>
        </section>

        <section class="poster-block poster-shots">
          <h2>${L(POSTER.screensTitle)}</h2>
          <div class="poster-shot-row">
            <img src="./evidence/v2/home-en-phone.jpg" alt="">
            <img src="./evidence/v2/result-en-phone.jpg" alt="">
            <img src="./evidence/v2/project-how-en-phone.jpg" alt="">
          </div>
        </section>

        <section class="poster-block">
          <h2>${L(POSTER.impactTitle)}</h2>
          ${raw(L(POSTER.impact).map((p) => `<p>${p}</p>`))}
        </section>

        <section class="poster-block poster-qr-block">
          <div class="poster-qr">
            <img src="./assets/qr.svg" alt="" width="150" height="150">
            <p>${L(POSTER.qrApp)}</p>
          </div>
          ${raw(CONFIG.links.feedbackFormUrl ? `<div class="poster-qr">
            <img src="./assets/qr-feedback.svg" alt="" width="150" height="150">
            <p>${L(POSTER.qrFeedback)}</p>
          </div>` : '')}
        </section>
      </div>

      <footer class="poster-foot">
        <p>${L(CONFIG.disclaimer)}</p>
        <p>${L(POSTER.credits)}</p>
      </footer>
    </div>`,

    mount(root) {
      /* On screen the sheet is drawn at true size — 2,245 px across for an A1 —
         so it is zoomed to fit the window. Zoom is measured from the unzoomed
         width, hence the reset on each pass. Printing sets its own page box and
         ignores every line of this. */
      const sheet = root.querySelector('.poster');
      if (!sheet) return undefined;

      const fit = () => {
        sheet.style.zoom = '1';
        const natural = sheet.offsetWidth;
        const available = root.clientWidth - 32;
        if (!natural || !available) return;
        sheet.style.zoom = String(Math.min(1, available / natural));
      };

      fit();
      const observer = new ResizeObserver(fit);
      observer.observe(root);
      return () => observer.disconnect();
    },
  };
}

const POSTER = {
  title: {
    en: 'Warif — reading a tree from one leaf',
    ar: 'وارف — قراءة الشجرة من ورقة واحدة',
  },
  problemTitle: { en: 'The problem', ar: 'المشكلة' },
  problem: {
    en: [
      'A tree signals through its leaves months before anyone walking past would notice. In the UAE the pressures are specific: salinity from irrigation water, falling groundwater, Ghaf dieback, red palm weevil, and invasive mesquite displacing the native Ghaf it closely resembles.',
      'Reading those signs is expert work, and there are far more trees than experts.',
    ],
    ar: [
      'ترسل الشجرة إشاراتها عبر أوراقها قبل أشهر من أن يلاحظها عابر سبيل. والضغوط في الإمارات محدّدة: ملوحة مياه الري، وانخفاض المياه الجوفية، وموت أطراف الغاف، وسوسة النخيل الحمراء، والمسكيت الغازي الذي يزيح الغاف المحلي الشبيه به.',
      'وقراءة هذه العلامات عملُ خبير، والأشجار أكثر بكثير من الخبراء.',
    ],
  },
  researchTitle: { en: 'Our research', ar: 'بحثنا' },
  research: {
    en: [
      'We chose ten trees that between them cover most of what grows here, documented the leaf signs for each, and photographed real leaves across Al Ain.',
      'Training images come from openly licensed field photographs, every one credited in the repository. The app was then tested against real leaves rather than only against reference images.',
    ],
    ar: [
      'اخترنا عشر أشجار تغطي بينها معظم ما ينمو هنا، ووثّقنا علامات الأوراق في كل منها، وصوّرنا أوراقاً حقيقية في أنحاء العين.',
      'وتأتي صور التدريب من صور ميدانية مفتوحة الترخيص، وكل صورة موثّقة في المستودع. ثم اختُبر التطبيق على أوراق حقيقية لا على الصور المرجعية وحدها.',
    ],
  },
  pipeline: {
    en: [
      'Photograph one leaf on plain paper.',
      'Check that there is plant tissue in the frame at all.',
      'MobileNetV2 turns the photograph into 1,280 features.',
      'Our trained classifier answers with a species and a confidence.',
      'An unfamiliarity check can refuse to name it.',
      'Separately, classical computer vision grades colour and texture inside the blade.',
      'Findings become a likely cause, a treatment, and the nearest shop that sells it.',
    ],
    ar: [
      'صوّر ورقة واحدة على ورق أبيض سادة.',
      'تحقّق من وجود نسيج نباتي في الإطار أصلاً.',
      'تحوّل MobileNetV2 الصورة إلى 1280 سمة.',
      'يجيب مصنِّفنا المدرَّب باسم النوع ودرجة الثقة.',
      'وقد يمتنع فحص عدم الألفة عن تسميتها.',
      'وبشكل منفصل، تقيّم الرؤية الحاسوبية الكلاسيكية اللون والملمس داخل النصل.',
      'وتتحوّل النتائج إلى سبب مرجّح وعلاج وأقرب متجر يبيعه.',
    ],
  },
  accuracyNote: {
    en: 'Read live from the model’s own metadata. The library documents ten trees; the deployed model recognises the number shown, and the rest are marked "Reference only" throughout the app.',
    ar: 'تُقرأ مباشرةً من بيانات النموذج نفسه. توثّق المكتبة عشر أشجار، ويتعرّف النموذج المنشور على العدد المعروض، وتحمل البقية شارة «للاطّلاع فقط» في كل مكان من التطبيق.',
  },
  calibrationNote: {
    en: 'The first health analyser called healthy leaves sick — it was reading the dark background as dead tissue. Measured before and after on the same reference photographs.',
    ar: 'كان محلّل الصحة الأول يصنّف الأوراق السليمة مريضة، إذ يقرأ الخلفية الداكنة على أنها نسيج ميت. قِيست النتائج قبل وبعد على الصور المرجعية نفسها.',
  },
  screensTitle: { en: 'The app', ar: 'التطبيق' },
  impactTitle: { en: 'Impact', ar: 'الأثر' },
  impact: {
    en: [
      'It runs entirely on the device: no account, no upload, no server, and it works with the connection switched off — which is the condition a farm in Al Dhafra or a school in Fujairah is actually in.',
      'Next: finish training all ten trees, add field photographs from Al Ain, and test with a municipality nursery.',
    ],
    ar: [
      'يعمل بالكامل على الجهاز: بلا حساب ولا رفع ولا خادم، ويعمل والاتصال مقطوع، وهي حال مزرعة في الظفرة أو مدرسة في الفجيرة فعلاً.',
      'القادم: إكمال تدريب الأشجار العشر، وإضافة صور ميدانية من العين، والاختبار مع مشتل تابع لبلدية.',
    ],
  },
  qrApp: { en: 'Open Warif', ar: 'افتح «وارف»' },
  qrFeedback: { en: 'Leave feedback', ar: 'شاركنا رأيك' },
  credits: {
    en: 'Training photographs from iNaturalist contributors under CC-BY and CC0. Shop data © OpenStreetMap contributors (ODbL). Built with TensorFlow.js.',
    ar: 'صور التدريب من مساهمي iNaturalist بتراخيص CC-BY وCC0. بيانات المحال © مساهمو OpenStreetMap برخصة ODbL. بُني باستخدام TensorFlow.js.',
  },
};
