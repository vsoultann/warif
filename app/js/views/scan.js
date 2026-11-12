/**
 * Home, which is the product: point the camera at a leaf.
 *
 * v1 opened on a headline, a dashed empty rectangle and a card of tips — three
 * stacked boxes spending a screenful to say very little, and on a laptop it was
 * a phone-width column with two thirds of the window empty. Here the viewfinder
 * is on screen from the first frame at every width: on a laptop beside the
 * headline, on a phone above it. Nothing has to be pressed to find out what the
 * app is.
 */
import { html, raw, $, $$, toast, announce } from '../ui/dom.js';
import { bilingual } from '../ui/bilingual.js';
import { t, lang, L, num, pct } from '../i18n.js';
import { icon } from '../icons.js';
import { leafShape } from '../ui/leaf-shapes.js';
import { SPECIES } from '../data/species.js';
import { weaveMarkup, Weave, runStages, pixelGridOn } from '../ui/weave.js';
import { ensureModel, onModelProgress } from '../ui/model-gate.js';
import { classify, recognitionState } from '../model.js';
import { recognisedKeys, counts } from '../metadata.js';
import { analyseLeaf, refineForSpecies } from '../health.js';
import { setScan } from '../state.js';
import { go } from '../router.js';
import { CONFIG } from '../config.js';

/** The six leaves that ship with the app, in the order they are offered. */
const SAMPLES = [
  { file: 'ghaf.jpg', key: 'ghaf' },
  { file: 'sidr.jpg', key: 'sidr' },
  { file: 'nakhl.jpg', key: 'nakhl' },
  { file: 'samar.jpg', key: 'samar' },
  { file: 'ghaf-stressed.jpg', key: 'ghaf' },
  { file: 'nakhl-stressed.jpg', key: 'nakhl' },
];

export default function scanView(ctx) {
  const trained = recognisedKeys();
  const tally = counts(SPECIES.length);

  const strip = SPECIES.map((sp) => html`<a class="known" href="#/trees/${sp.key}">
      <span class="known-shape" aria-hidden="true">${raw(leafShape(sp.key, { size: 40 }))}</span>
      <span class="known-name">
        <b>${L(sp).name}</b>
        <small ${raw(lang() === 'ar' ? 'lang="en" dir="ltr"' : 'lang="ar" dir="rtl"')}>${lang() === 'ar' ? sp.en.name : sp.ar.name}</small>
      </span>
      ${raw(trained.has(sp.key)
        ? `<span class="badge badge-on">${t('trees.recognised')}</span>`
        : `<span class="badge badge-ref">${t('trees.reference')}</span>`)}
    </a>`);

  return {
    html: html`<div class="shell scan-layout">

      <section class="scan-hero">
        ${raw(bilingual({ en: 'Know a UAE tree from one leaf.', ar: 'اعرف شجرتك من ورقة واحدة.' }, { size: 'l', tag: 'h1' }))}
        <p class="lede">${t('scan.sub')}</p>

        <div class="scan-actions">
          <button class="btn btn-primary btn-lg" id="act-camera" type="button">
            ${raw(icon('camera'))}<span>${t('scan.start')}</span>
          </button>
          <button class="btn btn-outline btn-lg" id="act-upload" type="button">
            ${raw(icon('upload'))}<span>${t('scan.upload')}</span>
          </button>
          <input type="file" id="file-input" accept="image/*" class="sr" tabindex="-1">
        </div>

        <button class="btn btn-quiet" id="act-sample" type="button">
          ${raw(icon('sample', { size: 'sm' }))}<span>${t('scan.sample')}</span>
        </button>

        <p class="small muted privacy">${raw(icon('offline', { size: 'sm', cls: 'inline-ico' }))} ${t('scan.privacy')}</p>
      </section>

      <section class="scan-stage" aria-labelledby="stage-label">
        <h2 class="sr" id="stage-label">${t('scan.viewfinder')}</h2>

        <div class="stage" id="stage" data-mode="idle">
          <video id="preview" playsinline muted autoplay></video>
          <canvas id="frame" hidden></canvas>

          <!-- Corner ticks and a leaf outline: where to put the leaf, without a
               word of instruction and without covering it up. -->
          <svg class="stage-guide" viewBox="0 0 80 100" preserveAspectRatio="none" aria-hidden="true">
            <path d="M4 14V6a2 2 0 0 1 2-2h8M66 4h8a2 2 0 0 1 2 2v8M76 86v8a2 2 0 0 1-2 2h-8M14 96H6a2 2 0 0 1-2-2v-8"
                  vector-effect="non-scaling-stroke"/>
          </svg>
          <svg class="stage-leaf" viewBox="0 0 48 48" aria-hidden="true">
            <path d="M24 44V26M24 28c0-11 7.5-19 18-20 .8 12.5-6.4 20-18 20ZM24 30c0-8.5-5.6-14.4-13.6-15.2C9.8 25 15.2 30 24 30Z"
                  fill="none" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/>
          </svg>

          <p class="stage-note" id="stage-note">${t('scan.placeholder')}</p>
        </div>

        <div class="stage-bar">
          <div class="model-state" id="model-state" hidden>
            <div class="weave" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"
                 aria-label="${t('scan.loading')}">
              <div class="weave-fill" id="model-fill"></div>
            </div>
            <p class="small muted" id="model-label">${t('scan.loading')}</p>
          </div>

          <div class="stage-controls" id="stage-controls" hidden>
            <button class="btn btn-primary btn-lg" id="act-capture" type="button">
              ${raw(icon('camera'))}<span>${t('scan.capture')}</span>
            </button>
            <button class="btn btn-quiet" id="act-cancel" type="button">${t('scan.cancel')}</button>
          </div>

          <div id="analysis" hidden>${raw(weaveMarkup())}</div>
        </div>
      </section>

      <section class="known-strip" aria-labelledby="known-title">
        <div class="section-head">
          <h2 id="known-title">${t('scan.knows')}</h2>
          <p class="small muted">${t('scan.knowsSub', { n: tally.library, m: tally.recognised ?? '—' })}</p>
        </div>
        <div class="known-list">${raw(strip)}</div>
      </section>

      <p class="small muted disclaimer">${L(CONFIG.disclaimer)}</p>
    </div>`,

    mount: (root) => mount(root, ctx),
  };
}

/* ------------------------------------------------------------------ mount */

function mount(root, ctx) {
  const stage = $('#stage', root);
  const video = $('#preview', root);
  const frame = $('#frame', root);
  const note = $('#stage-note', root);
  const controls = $('#stage-controls', root);
  const analysis = $('#analysis', root);
  const modelState = $('#model-state', root);
  const fileInput = $('#file-input', root);

  let stream = null;
  let busy = false;
  let sampleIndex = 0;
  let disposed = false;

  /* ---------------------------------------------------------- model state */

  const offProgress = onModelProgress(({ phase, fraction }) => {
    if (disposed) return;
    if (phase === 'ready' || phase === 'idle') { modelState.hidden = true; return; }

    modelState.hidden = false;
    const bar = $('.weave', modelState);
    const fill = $('#model-fill', modelState);
    const label = $('#model-label', modelState);

    if (phase === 'error') {
      fill.style.width = '100%';
      label.textContent = t('misc.error');
      bar.setAttribute('aria-valuenow', '0');
      return;
    }
    fill.style.width = `${Math.round(fraction * 100)}%`;
    bar.setAttribute('aria-valuenow', String(Math.round(fraction * 100)));
    label.textContent = `${t('scan.loading')} — ${pct(fraction)}. ${t('scan.loadingHint')}`;
  });

  /* -------------------------------------------------------------- camera */

  async function startCamera() {
    if (busy) return;
    setMode('starting');
    note.textContent = t('scan.starting');
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1920 } },
        audio: false,
      });
      if (disposed) { stopCamera(); return; }
      video.srcObject = stream;
      await video.play();
      setMode('live');
      controls.hidden = false;
      $('#act-capture', root).focus();
      announce(t('scan.viewfinder'));
    } catch {
      // Denied, already in use, or no camera at all. All three land here and all
      // three have the same answer: say so plainly and offer the upload, which
      // produces an identical result.
      setMode('denied');
      note.innerHTML = html`<strong>${t('scan.denied')}</strong><span>${t('scan.deniedBody')}</span>`;
      controls.hidden = true;
    }
  }

  function stopCamera() {
    stream?.getTracks().forEach((track) => track.stop());
    stream = null;
    video.srcObject = null;
  }

  function cancelCamera() {
    stopCamera();
    controls.hidden = true;
    setMode('idle');
    note.textContent = t('scan.placeholder');
    $('#act-camera', root).focus();
  }

  function setMode(mode) { stage.dataset.mode = mode; }

  /* -------------------------------------------------------------- capture */

  /** Draws whatever is on screen into the working canvas at a sane size. */
  function freeze(source, w, h) {
    const long = Math.max(w, h);
    const scale = Math.min(1, 1280 / long);
    frame.width = Math.round(w * scale);
    frame.height = Math.round(h * scale);
    frame.getContext('2d').drawImage(source, 0, 0, frame.width, frame.height);
    return frame;
  }

  async function fromCamera() {
    if (!stream || busy) return;
    const shot = freeze(video, video.videoWidth, video.videoHeight);
    stopCamera();
    controls.hidden = true;
    await analyse(shot, 'camera');
  }

  async function fromFile(file) {
    if (!file || busy) return;
    const url = URL.createObjectURL(file);
    try {
      const img = await loadImage(url);
      await analyse(freeze(img, img.naturalWidth, img.naturalHeight), 'upload');
    } catch {
      toast(t('misc.error'));
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  async function fromSample() {
    if (busy) return;
    const sample = SAMPLES[sampleIndex % SAMPLES.length];
    sampleIndex += 1;
    try {
      const img = await loadImage(`./samples/${sample.file}`);
      await analyse(freeze(img, img.naturalWidth, img.naturalHeight), 'sample');
    } catch {
      toast(t('misc.error'));
    }
  }

  /* ------------------------------------------------------------- analysis */

  /**
   * The one orchestrated moment in the app.
   *
   * The three stages are the three things that actually happen, awaited in
   * order, so the band stops moving when the work stops rather than when a
   * timer says so:
   *
   *   1. the leaf is separated from its background (health.js segmentation),
   *      which is also the step that can fail with "no leaf here";
   *   2. the network reads its shape and answers with a species;
   *   3. the colour verdict is assembled — score, findings, and the pixel map
   *      that shows where the damage is.
   */
  async function analyse(canvas, source) {
    busy = true;
    setMode('frozen');
    frame.hidden = false;
    note.textContent = '';
    pixelGridOn(stage, true);

    analysis.hidden = false;
    const weave = new Weave($('.weave-group', analysis));
    announce(t('scan.analysing'));

    try {
      const [leaf, prediction, verdict] = await runStages(weave, [
        () => analyseLeaf(canvas),
        async () => { await ensureModel(); return classify(canvas); },
        ([leaf, species]) => ({
          recognition: recognitionState(species, leaf.leafConfidence),
          photo: canvas.toDataURL('image/jpeg', 0.85),
          overlay: leaf.overlay ? leaf.overlay.toDataURL('image/jpeg', 0.85) : null,
        }),
      ]);

      const health = verdict.recognition.state === 'unknown'
        ? leaf
        : refineForSpecies(leaf, prediction.top.key);

      setScan({
        at: Date.now(),
        source,
        photo: verdict.photo,
        overlay: verdict.overlay,
        prediction,
        recognition: verdict.recognition,
        health: {
          valid: health.valid,
          score: health.score,
          band: health.band,
          findings: health.findings,
          metrics: health.metrics,
          coverage: health.coverage,
          leafConfidence: health.leafConfidence,
        },
      });

      go('/result');
    } catch (err) {
      console.error(err);
      pixelGridOn(stage, false);
      frame.hidden = true;
      analysis.hidden = true;
      setMode('idle');
      note.textContent = t('misc.error');
      toast(t('misc.error'));
    } finally {
      busy = false;
    }
  }

  /* --------------------------------------------------------------- wiring */

  const onClick = (e) => {
    const el = e.target.closest('button');
    if (!el) return;
    if (el.id === 'act-camera') startCamera();
    else if (el.id === 'act-capture') fromCamera();
    else if (el.id === 'act-cancel') cancelCamera();
    else if (el.id === 'act-upload') fileInput.click();
    else if (el.id === 'act-sample') fromSample();
  };

  const onKey = (e) => {
    // Space and Enter already work on the buttons; this is for the person who
    // has the viewfinder open and reaches for the most obvious key there is.
    if (e.key === ' ' && stage.dataset.mode === 'live' && !e.target.closest('button, input, textarea')) {
      e.preventDefault();
      fromCamera();
    }
  };

  root.addEventListener('click', onClick);
  fileInput.addEventListener('change', () => fromFile(fileInput.files?.[0]));
  window.addEventListener('keydown', onKey);

  /* `#/?sample=ghaf-stressed.jpg` runs one named sample straight away.
     It is how the presentation reaches a damaged leaf without three taps in
     front of an audience, and how the smoke test reaches a result it can make
     assertions about. An unknown name is ignored rather than guessed at. */
  const wanted = ctx?.query?.get('sample');
  if (wanted && SAMPLES.some((s) => s.file === wanted)) {
    sampleIndex = SAMPLES.findIndex((s) => s.file === wanted);
    requestAnimationFrame(() => fromSample());
  }

  return () => {
    disposed = true;
    offProgress();
    stopCamera();
    window.removeEventListener('keydown', onKey);
  };
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
