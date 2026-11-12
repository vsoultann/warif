/**
 * The presentation, as data.
 *
 * The slides live inside the app rather than in a separate deck for one
 * practical reason: the numbers on them are the numbers the app is showing. A
 * slide that says 81.5% because somebody typed 81.5% into a text box will be
 * wrong the first time the model is retrained, and nobody will notice until an
 * evaluator compares the slide with the screen.
 *
 * Durations add up to 7:15 of content against a 7:30 target, inside the
 * assessment's 4:00 floor and 10:00 ceiling, and leaving a little room for the
 * demonstration to take longer than planned — which it will. Every member has
 * exactly one part; `npm test` has the team data and the slide data in front of
 * it, so an unassigned member cannot go unnoticed.
 */

export const SLIDES = [
  {
    id: 'welcome',
    kind: 'title',
    speaker: 'sultan',
    seconds: 45,
    title: { en: 'Warif', ar: 'وارف' },
    subtitle: {
      en: 'Read the leaf. Keep the shade.',
      ar: 'اقرأ الورقة، ليبقى الظلُّ وارفاً',
    },
    notes: {
      en: 'Greet the evaluators. Name the team and the supervisor, then say in one sentence what Warif does: it identifies a UAE tree from one leaf, checks that leaf\'s health, and tells you what to do — offline, on the device in your hand. Say what the goals were for this term: enhance the prototype, and present it.',
      ar: 'رحّب بالمقيّمين. اذكر أسماء الفريق والمشرف، ثم قل في جملة واحدة ما يفعله «وارف»: يتعرّف على شجرة إماراتية من ورقة واحدة، ويفحص صحة تلك الورقة، ويخبرك بما ينبغي فعله، دون إنترنت وعلى الجهاز الذي بيدك. ثم اذكر أهداف هذا الفصل: تطوير النموذج الأولي وعرضه.',
    },
  },
  {
    id: 'problem',
    kind: 'problem',
    speaker: 'saif',
    seconds: 75,
    title: { en: 'The problem', ar: 'المشكلة' },
    notes: {
      en: 'A dying tree signals through its leaves months before anyone walking past would notice. In the UAE the pressures are specific: salinity from irrigation water, falling groundwater, Ghaf dieback, red palm weevil, and mesquite spreading into native Ghaf stands. Identifying the tree and reading the leaf is expert work, and there are far more trees than experts. Mention the field research: photographing real leaves across Al Ain.',
      ar: 'الشجرة التي تموت تُرسل إشاراتها عبر أوراقها قبل أشهر من أن يلاحظها عابر سبيل. والضغوط في الإمارات محدّدة: ملوحة مياه الري، وانخفاض المياه الجوفية، وموت أطراف الغاف، وسوسة النخيل الحمراء، وزحف المسكيت على تجمّعات الغاف المحلية. وتمييز الشجرة وقراءة ورقتها عملُ خبير، والأشجار أكثر بكثير من الخبراء. اذكر البحث الميداني: تصوير أوراق حقيقية في أنحاء العين.',
    },
  },
  {
    id: 'journey',
    kind: 'journey',
    speaker: 'mohammed-abdulla',
    seconds: 75,
    title: { en: 'From Green-Trace to Warif', ar: 'من «الأثر الأخضر» إلى «وارف»' },
    notes: {
      en: 'Version 1 worked and looked like a template. Explain the name: wārif is the Arabic word for shade that spreads wide and greenery that is lush. Then the identity: Al Sadu weaving is built row by row on a grid of warp and weft — the same grid a camera sees — so the mark is a leaf that is smooth on one side and woven on the other. Show one or two iteration-log entries: the species count, and the health calibration.',
      ar: 'النسخة الأولى كانت تعمل وتبدو قالباً جاهزاً. اشرح الاسم: «وارف» وصفٌ عربي للظلّ الممتدّ والخضرة النضرة. ثم الهوية: نسيج السدو يُبنى صفاً صفاً على شبكة من السدى واللحمة، وهي الشبكة نفسها التي تراها الكاميرا، فجاء الشعار ورقةً ناعمةً من جهة ومنسوجةً من الأخرى. اعرض واحدة أو اثنتين من سجل التحسين: عدد الأنواع، ومعايرة تحليل الصحة.',
    },
  },
  {
    id: 'demo',
    kind: 'demo',
    speaker: 'mohammed-rashed',
    seconds: 90,
    title: { en: 'Live demonstration', ar: 'العرض الحيّ' },
    notes: {
      en: 'Scan a real leaf. Talk through the three stages as the band weaves: finding the leaf, reading its shape, checking its colour. Show the health map toggle. Then do the thing that matters most: point the camera at something that is not a UAE tree and let it say it does not recognise it. If the camera fails, use the sample leaf — it always works.',
      ar: 'امسح ورقة حقيقية. اشرح المراحل الثلاث بينما ينسج الشريط: نبحث عن الورقة، ونقرأ شكلها، ونفحص لونها. اعرض مبدّل خريطة الصحة. ثم افعل الأهم: وجّه الكاميرا إلى شيء ليس شجرة إماراتية، ودعه يقول إنه لا يتعرّف عليه. وإذا تعطّلت الكاميرا فاستخدم الورقة النموذجية، فهي تعمل دائماً.',
    },
  },
  {
    id: 'ai',
    kind: 'ai',
    speaker: 'hamdan',
    seconds: 105,
    title: { en: 'How it works, and how we tested it', ar: 'كيف يعمل، وكيف اختبرناه' },
    notes: {
      en: 'Walk the pipeline: photo, leaf check, MobileNetV2 features, our trained classifier, the unknown-leaf check, then the separate health analysis. Stress that the health half uses no neural network at all, so every number can be explained and shown on the photo. Give the real accuracy from the model card, name the weakest class honestly, and explain the "I don\'t know" threshold. Finish on the test lab: speed, repeat runs, no tensor leak, offline pass.',
      ar: 'اشرح مسار المعالجة: الصورة، ثم فحص وجود ورقة، ثم سمات MobileNetV2، ثم مصنِّفنا المدرَّب، ثم فحص الورقة غير المعروفة، ثم تحليل الصحة المنفصل. وأكّد أن نصف الصحة لا يستخدم أي شبكة عصبية، فكل رقم فيه قابل للشرح وللعرض على الصورة. اذكر الدقة الحقيقية من بطاقة النموذج، وسمِّ أضعف صنف بصراحة، واشرح عتبة «لا أعرف». واختم بمختبر الاختبار: السرعة، وتكرار التشغيل، وعدم تسرّب الذاكرة، والنجاح دون إنترنت.',
    },
  },
  {
    id: 'impact',
    kind: 'impact',
    speaker: 'sultan',
    seconds: 45,
    title: { en: 'Impact and next steps', ar: 'الأثر والخطوات القادمة' },
    notes: {
      en: 'Who it helps: a school, a municipality gardener, a farm without a reliable connection, a family with a Ghaf in the yard. Next: add many more kiosk and field photographs from Al Ain, and test with a municipality nursery. Thank the supervisor and the school, invite questions, and point at the feedback QR.',
      ar: 'من ينتفع به: مدرسة، وعامل حدائق في بلدية، ومزرعة بلا اتصال موثوق، وأسرة في فنائها شجرة غاف. والقادم: إكمال تدريب الأشجار العشر، وإضافة صور ميدانية أكثر من العين، والاختبار مع مشتل تابع لبلدية. اشكر المشرف والمدرسة، وافتح باب الأسئلة، وأشِر إلى رمز الاستبيان.',
    },
  },
];

export const totalSeconds = SLIDES.reduce((sum, s) => sum + s.seconds, 0);
