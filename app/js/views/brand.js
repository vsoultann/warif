/**
 * The brand, documented inside the thing it describes.
 *
 * A brand sheet that lives in a PDF goes stale the week after it is written. This
 * one reads the same CSS custom properties the interface does, so a swatch here
 * is literally the colour the app paints with — change a token and this page
 * changes with it.
 */
import { html, raw, $$ } from '../ui/dom.js';
import { bilingual } from '../ui/bilingual.js';
import { t, L } from '../i18n.js';
import { icon, iconNames } from '../icons.js';
import { CONFIG } from '../config.js';

/** The eight core colours, by token name. Theme tokens are built from these. */
const CORE = [
  { token: '--ghaf', name: 'Ghaf', hex: '#2E6147', use: { en: 'Primary', ar: 'اللون الأساسي' } },
  { token: '--ghaf-light', name: 'Ghaf Light', hex: '#7FA88A', use: { en: 'Woven rows, secondary', ar: 'صفوف النسيج، اللون الثانوي' } },
  { token: '--sadu-red', name: 'Sadu Red', hex: '#B23A2C', use: { en: 'Accent, used sparingly', ar: 'لون مميّز يُستخدم باعتدال' } },
  { token: '--dune', name: 'Dune', hex: '#D9C6A0', use: { en: 'Sand', ar: 'الرمل' } },
  { token: '--wool', name: 'Wool', hex: '#F6F3EA', use: { en: 'Sadu white', ar: 'أبيض السدو' } },
  { token: '--ink-core', name: 'Ink', hex: '#14231C', use: { en: 'Text', ar: 'النص' } },
  { token: '--mist', name: 'Mist', hex: '#EEF1EA', use: { en: 'Light background', ar: 'خلفية فاتحة' } },
  { token: '--night', name: 'Night', hex: '#0F1712', use: { en: 'Dark background', ar: 'خلفية داكنة' } },
];

const USAGE = {
  en: [
    'Minimum size: 16 px for the mark, 96 px for the horizontal lockup. Keep clear space of at least one node width on every side.',
    'Never recolour outside the four variants below, never rotate the mark, and never add a shadow, glow or outline to it.',
    'The colour mark does not go on a photograph. On anything busy, use the mono variant in a single flat colour.',
    'Spaced capitals belong to the stacked lockup and nowhere else. Interface labels are sentence case.',
    'The flag of the United Arab Emirates is not decoration. It appears once, on the Project page, where it means something.',
  ],
  ar: [
    'أصغر مقاس: 16 بكسل للعلامة، و96 بكسل للشعار الأفقي، مع مساحة فارغة حولها لا تقل عن عرض المعيّن.',
    'لا يُعاد تلوين العلامة خارج المتغيرات الأربعة أدناه، ولا تُدار، ولا يُضاف إليها ظل أو توهج أو إطار.',
    'لا تُوضع العلامة الملوّنة على صورة فوتوغرافية؛ وعلى أي خلفية مزدحمة تُستخدم النسخة أحادية اللون بلون واحد مسطّح.',
    'الحروف الكبيرة المتباعدة خاصة بالشعار المركَّب وحده، وعناوين الواجهة تُكتب بحالة الجملة.',
    'علم دولة الإمارات ليس زخرفة. يظهر مرة واحدة في صفحة المشروع، حيث يكون له معنى.',
  ],
};

export default function brandView() {
  return {
    html: html`<div class="shell brand-page">
      <header class="page-head">
        ${raw(bilingual({ en: 'Brand', ar: 'الهوية' }, { size: 'l', tag: 'h1' }))}
        <p class="lede">${t('brand.sub')}</p>
      </header>

      <section class="panel brand-mark-panel">
        <div class="section-head"><h2>${t('brand.mark')}</h2></div>
        <div class="brand-mark-row">
          <img class="brand-mark-big" src="./assets/brand/warif-mark.svg" alt="" width="180" height="180">
          <div class="measure">
            <p>${L(MARK_STORY)}</p>
            <p><a class="btn btn-outline" href="./assets/brand/warif-mark.svg" download>
              ${raw(icon('download', { size: 'sm' }))}${t('brand.download')}</a></p>
          </div>
        </div>
        <div class="variant-row">
          ${raw(VARIANTS.map((v) => `<figure class="variant" data-on="${v.on}">
            <img src="${v.src}" alt="" width="72" height="72">
            <figcaption class="small">${L(v.label)}</figcaption>
          </figure>`))}
        </div>
      </section>

      <section class="panel">
        <div class="section-head"><h2>${t('brand.lockups')}</h2></div>
        <div class="lockup-row">
          <figure><img src="./assets/brand/warif-lockup.svg" alt="Warif وارف" height="56"><figcaption class="small muted">Horizontal</figcaption></figure>
          <figure><img src="./assets/brand/warif-lockup-rtl.svg" alt="وارف Warif" height="56"><figcaption class="small muted">Horizontal, RTL</figcaption></figure>
          <figure><img src="./assets/brand/warif-lockup-stacked.svg" alt="وارف WARIF" height="150"><figcaption class="small muted">Stacked</figcaption></figure>
        </div>
      </section>

      <section class="panel">
        <div class="section-head"><h2>${t('brand.palette')}</h2></div>
        <div class="swatches">
          ${raw(CORE.map((c) => `<figure class="swatch">
            <span class="swatch-chip" style="background:${c.hex}"></span>
            <figcaption>
              <b>${c.name}</b>
              <span class="small muted tnum">${c.hex}</span>
              <span class="small muted">${L(c.use)}</span>
            </figcaption>
          </figure>`))}
        </div>
      </section>

      <section class="panel">
        <div class="section-head"><h2>${t('brand.type')}</h2></div>
        <div class="type-specimen">
          <p class="specimen-display">Warif <span lang="ar" dir="rtl">وارف</span></p>
          <p class="small muted">Reem Kufi 600–700 — display</p>
          <p class="specimen-text">Read the leaf. Keep the shade.</p>
          <p class="specimen-text" lang="ar" dir="rtl">اقرأ الورقة، ليبقى الظلُّ وارفاً</p>
          <p class="small muted">Readex Pro 300–600 — text and interface</p>
        </div>
      </section>

      <section class="panel">
        <div class="section-head"><h2>${t('brand.icons')}</h2></div>
        <div class="icon-sheet">
          ${raw(iconNames.map((n) => `<figure class="icon-cell">
            ${icon(n)}<figcaption class="small muted">${n}</figcaption>
          </figure>`))}
        </div>
      </section>

      <section class="panel">
        <div class="section-head"><h2>${t('brand.usage')}</h2></div>
        <ul class="limits">${raw(L(USAGE).map((u) => `<li>${u}</li>`))}</ul>
      </section>
    </div>`,
  };
}

const MARK_STORY = {
  en: 'A leaf split along its midrib. The left half is smooth — nature as it grows. The right half is woven in rows, the way Al Sadu is built on a grid of warp and weft, which is the same grid logic as the pixels a camera sees. At the centre is a concentric diamond, a classic Sadu motif: the point where the model looks, and a nod to Al Ain, the spring and the eye, where it was built.',
  ar: 'ورقةٌ مشقوقة على عرقها الأوسط: نصفها الأيسر أملس كما تنبت في الطبيعة، ونصفها الأيمن منسوجٌ صفّاً صفّاً كما يُبنى السدو على شبكة السدى واللحمة، وهي شبكة البكسل نفسها التي تراها الكاميرا. وفي قلبها معيّنٌ متحد المركز، وهو من رموز السدو الأصيلة: النقطة التي ينظر إليها النموذج، وإشارةٌ إلى العين حيث صُنع.',
};

const VARIANTS = [
  { src: './assets/brand/warif-mark.svg', on: 'light', label: { en: 'On light', ar: 'على فاتح' } },
  { src: './assets/brand/warif-mark-dark.svg', on: 'dark', label: { en: 'On dark', ar: 'على داكن' } },
  { src: './assets/brand/warif-mark-mono.svg', on: 'mono', label: { en: 'Mono', ar: 'أحادي اللون' } },
  { src: './assets/icons/icon.svg', on: 'app', label: { en: 'App icon', ar: 'أيقونة التطبيق' } },
];
