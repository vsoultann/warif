/**
 * Long-form content for the Project page.
 *
 * Every block carries both languages and the page renders whichever one is
 * active. v1 stacked the two translations on top of each other on the grounds
 * that two judges might be reading over one shoulder; what that produced was a
 * page of doubled paragraphs where neither reader could find their thread.
 * Headings are bilingual, in the manner of UAE road signage, and body prose is
 * single-language with a toggle one tap away.
 *
 * >>> BEFORE THE PRESENTATION: read the QUOTES block below out loud and check
 *     the wording against an official source. The attributions here are the
 *     widely published versions, but a quote on a screen in front of judges is
 *     worth thirty seconds of verification. <<<
 */

/* --------------------------------------------------------------- quotes */

export const QUOTES = {
  /** The founding father, on the environment his people inherited. */
  zayedEnvironment: {
    en: 'The environment is an integral part of our country, our history and our heritage. On land and in the sea, our forefathers lived and survived in this environment. They were able to do so only because they recognised the need to conserve it, to take from it only what they needed to live, and to preserve it for succeeding generations.',
    ar: 'إن البيئة جزء لا يتجزأ من بلادنا وتاريخنا وتراثنا. فعلى البرّ وفي البحر عاش آباؤنا وأجدادنا وتعايشوا مع بيئتهم، ولم يكن ذلك ممكناً إلا لأنهم أدركوا ضرورة الحفاظ عليها، وأن يأخذوا منها بقدر حاجتهم للعيش، وأن يصونوها للأجيال القادمة.',
    who: { en: 'H.H. Sheikh Zayed bin Sultan Al Nahyan', ar: 'الشيخ زايد بن سلطان آل نهيان' },
    title: { en: 'Founding Father of the United Arab Emirates', ar: 'مؤسس دولة الإمارات العربية المتحدة' },
  },

  /** Zayed on agriculture — the line every Emirati schoolchild knows. */
  zayedAgriculture: {
    todo: 'Check this wording against an official source before it is printed or projected.',
    en: 'Give me agriculture, and I will guarantee you civilisation.',
    ar: 'أعطوني زراعة، أضمن لكم حضارة.',
    who: { en: 'H.H. Sheikh Zayed bin Sultan Al Nahyan', ar: 'الشيخ زايد بن سلطان آل نهيان' },
    title: { en: 'Founding Father of the United Arab Emirates', ar: 'مؤسس دولة الإمارات العربية المتحدة' },
  },

  /** Technology in the service of people — our leadership today. */
  mbrFuture: {
    en: 'The future belongs to those who can imagine it, design it and execute it.',
    ar: 'المستقبل مِلكٌ لمن يستطيع تخيّله وتصميمه وتنفيذه.',
    who: { en: 'H.H. Sheikh Mohammed bin Rashid Al Maktoum', ar: 'الشيخ محمد بن راشد آل مكتوم' },
    title: {
      en: 'Vice President and Prime Minister of the UAE, Ruler of Dubai',
      ar: 'نائب رئيس الدولة رئيس مجلس الوزراء حاكم دبي',
    },
  },
};

/* ---------------------------------------------------------- the leaders */

export const LEADERS = [
  {
    id: 'zayed',
    img: './img/zayed.jpg',
    name: { en: 'Sheikh Zayed bin Sultan Al Nahyan', ar: 'الشيخ زايد بن سلطان آل نهيان' },
    title: { en: 'Founding Father of the UAE', ar: 'مؤسس دولة الإمارات' },
    credit: 'National Archives of the UAE · public domain',
  },
  {
    id: 'mbz',
    img: './img/mbz.jpg',
    name: { en: 'Sheikh Mohamed bin Zayed Al Nahyan', ar: 'الشيخ محمد بن زايد آل نهيان' },
    title: { en: 'President of the United Arab Emirates', ar: 'رئيس دولة الإمارات العربية المتحدة' },
    credit: 'Press Service of the President of Azerbaijan · CC BY 4.0',
  },
  {
    id: 'mbr',
    img: './img/mbr.jpg',
    name: { en: 'Sheikh Mohammed bin Rashid Al Maktoum', ar: 'الشيخ محمد بن راشد آل مكتوم' },
    title: { en: 'Vice President and Prime Minister, Ruler of Dubai', ar: 'نائب رئيس الدولة، حاكم دبي' },
    credit: 'International Monetary Fund · public domain',
  },
];

/* ------------------------------------------------------- the long read */

/**
 * Sections of the About Us page, in order. `body` is an array of paragraphs.
 * Both languages are rendered for every section.
 */
export const SECTIONS = [
  {
    id: 'tribute',
    heading: { en: 'In the footsteps of Zayed', ar: 'على خطى زايد' },
    body: {
      en: [
        'Before the towers, before the highways, before the airports, there was a man who looked at a desert and saw a garden. Sheikh Zayed bin Sultan Al Nahyan did not inherit a green country. He planted one. In a land where rain is a rumour and the summer sun is an adversary, he ordered trees where engineers said trees could not live, and he was proved right tens of millions of times over.',
        'He understood something that took the rest of the world another generation to learn: that a country is not only its buildings and its wealth, but its soil, its water and the living things that hold both in place. The ghaf tree that shades a desert road today stands there because he insisted it should. He called the environment part of our heritage, and he meant it literally — as inheritance, a thing held in trust and handed on.',
        'That is the promise this project was built to keep. We are five students. We cannot plant a forest. But we can build a tool that helps somebody else keep one alive — a tool that lets anyone holding a leaf find out what tree it belongs to and whether that tree is in trouble, in the time it takes to take a photograph.',
        'Sheikh Zayed sent agricultural engineers into the desert with seedlings. We are sending a neural network into a pocket. The instrument has changed. The instruction has not.',
      ],
      ar: [
        'قبل الأبراج، وقبل الطرق السريعة، وقبل المطارات، كان هناك رجل نظر إلى صحراء فرأى فيها حديقة. لم يرث الشيخ زايد بن سلطان آل نهيان بلداً أخضر، بل زرعه بيديه. في أرضٍ المطر فيها إشاعة والشمس في صيفها خصم، أمر بغرس الأشجار حيث قال المهندسون إن الشجر لا يعيش، فأثبتت عشرات الملايين من الأشجار أنه كان على حق.',
        'لقد أدرك ما احتاج العالم جيلاً كاملاً ليتعلمه: أن الوطن ليس مبانيه وثروته فحسب، بل تربته ومياهه والكائنات الحية التي تمسك بهما. شجرة الغاف التي تظلّل اليوم طريقاً صحراوياً قائمةٌ هناك لأنه أصرّ على ذلك. وحين قال إن البيئة جزء من تراثنا، فقد عناها حرفياً: أمانةٌ تُحفظ وتُسلَّم.',
        'وهذا هو العهد الذي بُني هذا المشروع للوفاء به. نحن خمسة طلاب، لا نستطيع أن نزرع غابة، لكننا نستطيع أن نبني أداةً تساعد غيرنا على إبقاء غابةٍ حيّة: أداةً تتيح لأي شخص يحمل ورقة شجر أن يعرف إلى أي شجرة تنتمي، وما إذا كانت تلك الشجرة في خطر، في الوقت الذي تستغرقه صورة واحدة.',
        'أرسل الشيخ زايد المهندسين الزراعيين إلى الصحراء ومعهم الشتلات. ونحن نرسل شبكةً عصبية إلى الجيب. تغيّرت الأداة، ولم تتغيّر الوصية.',
      ],
    },
  },

  {
    id: 'today',
    heading: { en: 'Technology in the service of people', ar: 'التقنية في خدمة الإنسان' },
    body: {
      en: [
        'The UAE our generation grew up in made a deliberate bet: that artificial intelligence should be built here, not merely bought here, and that it should be pointed at real problems — water, food, health, climate — rather than at novelty.',
        'Warif is our small answer to that call. It uses the same family of neural network that powers commercial vision systems, but it runs entirely inside the phone of whoever is holding it. No account. No upload. No server. The photograph you take of a leaf never leaves your hand.',
        'That matters beyond privacy. A farm in Al Dhafra or a school in Fujairah does not always have a reliable connection, and a tool that stops working when the signal drops is a tool that fails exactly when it is needed. Ours does not stop.',
      ],
      ar: [
        'راهنت الإمارات التي نشأ فيها جيلنا رهاناً واعياً: أن يُبنى الذكاء الاصطناعي هنا لا أن يُشترى فحسب، وأن يُوجَّه إلى مشكلات حقيقية — الماء والغذاء والصحة والمناخ — لا إلى الطرافة.',
        '«وارف» هو جوابنا الصغير على هذا النداء. يستخدم العائلة نفسها من الشبكات العصبية التي تشغّل أنظمة الرؤية التجارية، لكنه يعمل بالكامل داخل هاتف من يحمله: بلا حساب، وبلا رفع، وبلا خادم. الصورة التي تلتقطها لورقة الشجر لا تغادر يدك أبداً.',
        'وهذا أمرٌ يتجاوز الخصوصية. فمزرعة في الظفرة أو مدرسة في الفجيرة قد لا يتوفّر فيها اتصال موثوق، والأداة التي تتوقف عند انقطاع الشبكة أداةٌ تخذل صاحبها في اللحظة التي يحتاجها فيها. أداتنا لا تتوقف.',
      ],
    },
  },

  {
    id: 'what',
    heading: { en: 'What Warif does', ar: 'ماذا يفعل «وارف»' },
    body: {
      en: [
        'Photograph one leaf. The app answers two separate questions about it.',
        'First: which tree is this? A convolutional neural network compares the leaf against twelve plants that between them cover most of what grows in the Emirates — from the Ghaf and the date palm to the grey mangroves of the coast, the vinca in every flower bed and the papaya in the back garden, and including the invasive mesquite that is steadily replacing the Ghaf. If the leaf is none of them, the app is built to say so plainly instead of guessing, which is the single hardest thing to get an image classifier to do.',
        'Second: is this leaf healthy? A separate analysis measures yellowing, dead tissue, colour evenness, greenness and surface texture, and folds them into one score out of a hundred. Deliberately, no neural network is involved in this half — every number can be explained in one sentence, and shown on the photograph itself, so that a judge can point at a brown patch and see the app agree with them.',
        'When the analysis finds a problem, the app names the likely cause, recommends the treatment that addresses it, and then helps you find that treatment: nearby nurseries and agricultural suppliers, with phone numbers, opening hours and directions.',
      ],
      ar: [
        'صوّر ورقة واحدة، فيجيب التطبيق عن سؤالين منفصلين.',
        'الأول: ما هذه الشجرة؟ تقارن شبكة عصبية التفافية الورقة باثنتي عشرة نبتة تغطي بينها معظم ما ينمو في الإمارات، من الغاف والنخيل إلى أشجار القرم على الساحل، والونكة في أحواض الزهور والبابايا في الحدائق المنزلية، ومنها المسكيت الغازي الذي يزاحم الغاف تدريجياً. وإذا لم تكن الورقة من بينها، فالتطبيق مصمَّم ليقول ذلك صراحةً بدل التخمين، وهو أصعب سلوك يمكن تعليمه لمصنِّف صور.',
        'والثاني: هل هذه الورقة سليمة؟ يقيس تحليل منفصل الاصفرار والنسيج الميت وتجانس اللون ودرجة الخضرة وتباين الملمس، ثم يجمعها في درجة واحدة من مئة. وعن قصد، لا تتدخل أي شبكة عصبية في هذا النصف: كل رقم يمكن شرحه في جملة واحدة وإظهاره على الصورة نفسها، حتى يستطيع المحكّم أن يشير إلى بقعة بنية ويرى التطبيق يوافقه.',
        'وحين يرصد التحليل مشكلة، يسمّي التطبيق السبب المرجّح، ويوصي بالعلاج المناسب، ثم يساعدك على إيجاده: مشاتل وموردون زراعيون قريبون منك، مع أرقام الهاتف وساعات العمل والاتجاهات.',
      ],
    },
  },

  {
    id: 'why',
    heading: { en: 'Why these trees', ar: 'لماذا هذه الأشجار' },
    body: {
      en: [
        'The Ghaf is the national tree of the United Arab Emirates. It survives where almost nothing else does, its roots reaching thirty metres down for water, and for centuries it was the meeting point where Bedouin communities gathered and made decisions. The Sidr fed and healed people long before there were pharmacies. The date palm has been the backbone of Emirati food, shelter and trade for five thousand years. The Samar holds the desert soil together and shades the animals that graze on it.',
        'These are not decorative species. They are infrastructure — the original infrastructure of this country — and they are under pressure from salinity, from falling groundwater, from pests and from construction. A tree that is dying tells you so through its leaves, months before it is obvious to anyone walking past.',
        'That is the gap this project aims at: making the earliest signal readable by anybody, not just by an agricultural engineer.',
      ],
      ar: [
        'الغاف هو الشجرة الوطنية لدولة الإمارات. يعيش حيث لا يعيش غيره تقريباً، وتمتد جذوره ثلاثين متراً بحثاً عن الماء، وكان لقرون مجلساً تجتمع تحته القبائل وتُتَّخذ عنده القرارات. أما السدر فقد أطعم الناس وداواهم قبل أن توجد الصيدليات بزمن طويل. والنخلة عمود الغذاء والمأوى والتجارة في الإمارات منذ خمسة آلاف عام. والسمر يُمسك تربة الصحراء ويظلّل ما يرعى فيها.',
        'ليست هذه أنواعاً للزينة، بل بنيةٌ تحتية — البنية التحتية الأولى لهذا البلد — وهي تحت ضغط الملوحة وانخفاض المياه الجوفية والآفات والعمران. والشجرة التي تموت تُخبرك بذلك عبر أوراقها، قبل أشهر من أن يلاحظ ذلك أي عابر سبيل.',
        'وهذه هي الفجوة التي يستهدفها المشروع: أن تصبح أولى العلامات مقروءةً لأي شخص، لا للمهندس الزراعي وحده.',
      ],
    },
  },

  {
    id: 'how',
    heading: { en: 'How we built it', ar: 'كيف بنيناه' },
    body: {
      en: [
        'We started with MobileNetV2, a network Google trained on millions of general photographs. It already knows what edges, textures and shapes look like; it simply has never been told about the Ghaf. So we froze it and trained only a small classifier on top, using openly licensed field photographs of each species gathered from iNaturalist contributors — every photograph we used is credited in the repository.',
        'That approach is why this runs on a phone at all. The trained part of our model is a few hundred kilobytes, and the whole system fits in a browser cache. It also means the team can improve it: photographing real leaves and retraining takes minutes, not days.',
        'Everything here is open. The source code, the training script, the dataset credits and this text are all in a public repository, and the entire application is the folder that GitHub serves — there is no hidden build step and nothing you cannot inspect.',
      ],
      ar: [
        'بدأنا من MobileNetV2، وهي شبكة درّبتها جوجل على ملايين الصور العامة. تعرف الشبكة أصلاً ما هي الحواف والملامس والأشكال، لكن أحداً لم يخبرها قط عن الغاف. لذلك جمّدناها ودرّبنا فوقها مصنِّفاً صغيراً فقط، باستخدام صور ميدانية مفتوحة الترخيص لكل نوع من مساهمي iNaturalist، وكل صورة استخدمناها موثّقة في المستودع.',
        'هذا الأسلوب هو سبب عمل التطبيق على الهاتف أساساً. فالجزء الذي درّبناه لا يتجاوز بضع مئات من الكيلوبايت، والنظام كله يتّسع في ذاكرة المتصفح. كما يعني ذلك أن بإمكان الفريق تحسينه: تصوير أوراق حقيقية وإعادة التدريب تستغرق دقائق لا أياماً.',
        'كل شيء هنا مفتوح: الشيفرة المصدرية، وبرنامج التدريب، ومصادر البيانات، وهذا النص نفسه، كلها في مستودع عام، والتطبيق بأكمله هو المجلد الذي يقدّمه GitHub — لا خطوة بناء خفية ولا شيء لا يمكنك تفحّصه.',
      ],
    },
  },
];

/* ------------------------------------------------------ honest limitations */

/**
 * What the app cannot do, in its own words.
 *
 * Kept here rather than only in the README because a judge reads the screen, not
 * the repository. Every entry is either measured or structural — nothing on this
 * list is hedging for its own sake, and the numbers in it come from the tools in
 * tools/ rather than from an estimate.
 *
 * Keep in step with the "Honest limitations" section of README.md.
 */
export const LIMITS = [
  {
    id: 'four-classes',
    en: 'Two pairs in the library are genuinely hard to tell apart from one photograph: Ghaf and Mesquite, and Sidr and Samar. When the top two scores are close the app says it is a close call and shows the runner-up, rather than naming one as if it were settled. The model is trained mostly on field photographs; the team\'s own kiosk photographs of vinca and papaya are in the set, but there are only a handful of them so far.',
    ar: 'في المكتبة زوجان يصعب التفريق بينهما فعلاً من صورة واحدة: الغاف والمسكيت، والسدر والسمر. وعندما تتقارب أعلى درجتين يقول التطبيق إن النتيجة متقاربة ويعرض الاحتمال الثاني، بدل تسمية أحدهما كأنه محسوم. دُرّب النموذج في معظمه على صور ميدانية، وصور الفريق للونكة والبابايا من الكشك ضمن المجموعة، لكنها قليلة حتى الآن.',
  },
  {
    id: 'ood-scope',
    en: 'The "I don’t know" check refuses photographs that are nothing like a leaf — no plant tissue, or a feature vector far outside every tree it knows. It does not reliably refuse another tree’s leaf: measured over the reference set it rejected 0 of 40 Mesquite and 2 of 40 Mangrove photographs. A leaf from a tree outside the four can still be given one of their names.',
    ar: 'يرفض فحص «لا أعرف» الصور التي لا تشبه الورقة إطلاقاً: إمّا لخلوّها من النسيج النباتي، وإمّا لوقوع سماتها بعيداً عن كل شجرة يعرفها. لكنه لا يرفض بالضرورة ورقة شجرة أخرى: فقياساً على المجموعة المرجعية رفض صفراً من أربعين صورة مسكيت، واثنتين من أربعين صورة قرم. وقد تُمنح ورقةٌ من خارج الأنواع الأربعة اسم أحدها.',
  },
  {
    id: 'appearance',
    en: 'Health analysis measures appearance. A leaf can be discoloured by dust, sunburn, natural senescence or simply its variety, and a seriously diseased tree can carry a leaf that looks fine. The score describes one leaf in one photograph, not the tree it came from.',
    ar: 'يقيس تحليل الصحة المظهر. فقد يتغيّر لون الورقة بفعل الغبار أو حروق الشمس أو الشيخوخة الطبيعية أو صنف الشجرة نفسه، وقد تحمل شجرةٌ مريضة بشدّة ورقةً تبدو سليمة. الدرجة تصف ورقة واحدة في صورة واحدة، لا الشجرة التي جاءت منها.',
  },
  {
    id: 'calibration-set',
    en: 'The calibration figures were measured against reference photographs, not against photographs of leaves taken at the kiosk. Shooting forty of those and re-running the calibration is the honest way to confirm the numbers hold.',
    ar: 'قِيست أرقام المعايرة على صور مرجعية، لا على صور أوراق ملتقطة عند الكشك. وتصوير أربعين ورقة من هذه ثم إعادة المعايرة هو الطريق الأمين للتأكد من ثبات الأرقام.',
  },
  {
    id: 'supplier-data',
    en: 'Shop phone numbers and opening hours come from OpenStreetMap volunteers and can be out of date. Every entry also carries a live map link for that reason, and a shop with no recorded hours says so rather than inventing them.',
    ar: 'تأتي أرقام المحال وأوقات عملها من متطوّعي OpenStreetMap وقد تكون قديمة. ولهذا يحمل كل مدخل رابطاً حياً للخريطة، ويقول المحل الذي لا تُعرف ساعاته ذلك بدل اختلاقها.',
  },
  {
    id: 'classroom',
    en: 'It is a classroom demonstration, not an agricultural inspection tool. Anything that matters should be confirmed by the Ministry of Climate Change and Environment or a municipality agronomist.',
    ar: 'هذا عرضٌ مدرسي لا أداة فحص زراعي. وما يهمّ فعلاً ينبغي تأكيده من وزارة التغير المناخي والبيئة أو من مهندس زراعي في البلدية.',
  },
];
