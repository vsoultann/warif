/**
 * Interface strings, English and Modern Standard Arabic.
 *
 * Rules this dictionary is written to:
 *
 *   - Sentence case. No all-caps labels: an eyebrow shouting LEAF SCANNER at a
 *     visitor is not a warmer greeting than a heading that says what it is.
 *   - No arrow glyphs and no middle-dot meta strings. A link says where it goes.
 *   - Plant-health copy is never alarmist and always ends in something to do.
 *   - Arabic is فصحى throughout, and is written to be read, not to be a
 *     translation sitting next to English.
 *
 * Long-form prose does not live here. Species text is in data/species.js beside
 * the species, findings live in health.js beside the analyser that produces
 * them, and the project narrative is in data/about.js.
 */

const STRINGS = {
  en: {
    /* ---------------------------------------------------------- navigation */
    'nav.scan': 'Scan',
    'nav.trees': 'Trees',
    'nav.help': 'Help',
    'nav.project': 'Project',
    'nav.team': 'Team',
    'nav.home': 'Warif, home',
    'nav.main': 'Main',
    'nav.skip': 'Skip to content',
    'nav.settings': 'Settings',
    'nav.language': 'Switch to Arabic',

    /* ---------------------------------------------------------- home/scan */
    'scan.title': 'Know a UAE tree from one leaf.',
    'scan.sub': 'Point your camera at one leaf on plain paper. Warif names the tree, checks the leaf’s health and tells you what to do — on this device, even offline.',
    'scan.privacy': 'Runs on this device. No upload, no account, works offline.',
    'scan.start': 'Scan a leaf',
    'scan.upload': 'Upload a photo',
    'scan.sample': 'Try a sample leaf',
    'scan.capture': 'Capture',
    'scan.cancel': 'Cancel',
    'scan.again': 'Scan another leaf',
    'scan.viewfinder': 'Camera viewfinder',
    'scan.placeholder': 'The camera preview appears here',
    'scan.starting': 'Starting the camera…',
    'scan.denied': 'The camera is not available',
    'scan.deniedBody': 'Warif needs camera permission to scan a leaf. You can allow it in your browser’s site settings, or upload a photo instead — the result is identical.',
    'scan.loading': 'Loading the model',
    'scan.loadingHint': 'About 14 MB, once. After this it works offline.',
    'scan.ready': 'Model ready',
    'scan.knows': 'The trees Warif knows',
    'scan.knowsSub': '{n} trees in the library, {m} recognised by the current model.',
    'scan.analysing': 'Reading the leaf',

    /* ------------------------------------------------------------- weave */
    'weave.1': 'Finding the leaf',
    'weave.2': 'Reading its shape',
    'weave.3': 'Checking its colour',

    /* ------------------------------------------------------------ result */
    'result.title': 'Result',
    'result.photo': 'Photo',
    'result.healthMap': 'Health map',
    'result.confidence': 'Confidence',
    'result.confidenceHelp': 'How sure the model is of this species, out of ten.',
    'result.lowConfidence': 'Confidence is low. This may still be the right tree — check that the leaf fills the frame and the light is even, then scan again.',
    'result.uncertain': 'Treat this identification with caution.',
    'result.uncertainAdvice': 'It may still be the right tree. Lay the leaf on plain paper, fill the frame with it, and scan again.',
    'result.alternatives': 'Also considered',
    'result.health': 'Leaf health',
    'result.healthOf': 'out of 100',
    'result.findings': 'What the analysis found',
    'result.todo': 'What to do',
    'result.where': 'Where to get it',
    'result.whereAll': 'See all suppliers and helplines',
    'result.readMore': 'Read about this tree',
    'result.share': 'Share',
    'result.shared': 'Result copied',
    'result.method': 'How this was measured',
    'result.methodBody': 'The species comes from a MobileNetV2 network with a head trained on field photographs. The health score is measured separately by classical computer vision: the photo is white-balanced against its own background, the leaf is cut out from it, and every pixel inside the blade is graded healthy, chlorotic or necrotic.',
    'result.none': 'No leaf has been scanned yet.',

    /* ----------------------------------------------------------- unknown */
    'unknown.title': 'Warif doesn’t recognise this leaf.',
    'unknown.body': 'This does not match any tree the model was trained on. Rather than force it into the nearest one, Warif is telling you it does not know.',
    'unknown.why': 'Why',
    'unknown.noFoliage': 'There is little or no plant tissue in the photo.',
    'unknown.unfamiliar': 'The image sits far from every tree the model was trained on.',
    'unknown.lowProbability': 'No tree scored anywhere near high enough.',
    'unknown.spreadEvenly': 'The scores are spread almost evenly, which means guessing.',
    'unknown.tips': 'Three things that help',
    'unknown.tip1': 'Lay one leaf on plain white paper.',
    'unknown.tip2': 'Fill most of the frame with it.',
    'unknown.tip3': 'Use even daylight, and avoid a hard shadow across the blade.',
    'unknown.seeTrees': 'See the trees Warif knows',
    'unknown.retry': 'Try again',

    /* ------------------------------------------------------------ health */
    'health.excellent': 'Healthy',
    'health.good': 'Mostly healthy',
    'health.fair': 'Mild stress',
    'health.poor': 'Stressed',
    'health.bad': 'Badly damaged',
    'health.invalid': 'No leaf found',
    'health.legend': 'Green is healthy tissue, yellow is chlorotic, brown is dead.',

    /* ------------------------------------------------------------- trees */
    'trees.title': 'Trees',
    'trees.sub': '{n} trees in the library, {m} recognised by the current model.',
    'trees.all': 'All',
    'trees.native': 'Native',
    'trees.introduced': 'Introduced',
    'trees.invasive': 'Invasive',
    'trees.recognised': 'Recognised',
    'trees.reference': 'Reference only',
    'trees.referenceWhy': 'In the library for reference. The current model was not trained on it, so a scan will not return it.',
    'trees.accuracy': 'Model accuracy for this tree',
    'trees.leaf': 'How to recognise the leaf',
    'trees.about': 'About',
    'trees.why': 'Why it matters here',
    'trees.lookalike': 'Easily confused',
    'trees.notFound': 'That tree is not in the library.',
    'trees.back': 'Back to all trees',
    'trees.scanThis': 'Scan a leaf',

    /* -------------------------------------------------------------- help */
    'help.title': 'Help',
    'help.sub': 'Official helplines first, then the nearest places to buy what a treatment needs.',
    'help.official': 'Official helplines',
    'help.suppliers': 'Suppliers',
    'help.locate': 'Use my location',
    'help.locateWhy': 'Your location is used on this device to sort the list by distance. It is never sent anywhere.',
    'help.located': 'Sorted by distance from you',
    'help.denied': 'Location unavailable, so the list is in its normal order.',
    'help.emirate': 'Emirate',
    'help.allEmirates': 'All emirates',
    'help.call': 'Call',
    'help.directions': 'Directions',
    'help.noHours': 'Opening hours not recorded',
    'help.sells': 'Sells',
    'help.searchOnline': 'Search online for more',

    /* ----------------------------------------------------------- project */
    'project.title': 'The project',
    'project.name': 'The name',
    'project.problem': 'The problem',
    'project.approach': 'Our approach',
    'project.more': 'Read further',
    'project.how': 'How the AI works',
    'project.howSub': 'The pipeline, the model card and what it cannot do.',
    'project.lab': 'Test Lab',
    'project.labSub': 'Speed, accuracy and reliability, measured.',
    'project.journey': 'Journey',
    'project.journeySub': 'How the project was made, and what changed between versions.',
    'project.team': 'Team',
    'project.teamSub': 'Who built it and who speaks to what.',

    /* --------------------------------------------------------------- how */
    'how.title': 'How the AI works',
    'how.pipeline': 'The pipeline',
    'how.modelCard': 'Model card',
    'how.classes': 'Trees recognised',
    'how.validation': 'Validation accuracy',
    'how.perClass': 'Accuracy per tree',
    'how.matrix': 'Confusion matrix',
    'how.matrixHelp': 'Rows are the true tree, columns are what the model answered. A perfect model fills only the diagonal.',
    'how.trained': 'Trained on',
    'how.samples': 'training images',
    'how.valSamples': 'held-out validation images',
    'how.oodTitle': 'The “I don’t know” threshold',
    'how.oodBody': 'Every photo is compared with the centre of each tree the model knows. Below a cosine similarity of {t} the photo is treated as something else entirely, and Warif refuses to name it.',
    'how.limits': 'What it cannot do',
    'how.trainedAt': 'Model trained',

    /* --------------------------------------------------------------- lab */
    'lab.title': 'Test Lab',
    'lab.sub': 'Everything on this page was measured, not estimated. Each block says on what and when.',
    'lab.performance': 'Performance',
    'lab.accuracy': 'Accuracy',
    'lab.reliability': 'Reliability',
    'lab.loadCold': 'Model load, cold',
    'lab.loadWarm': 'Model load, cached',
    'lab.inferMedian': 'Inference, median',
    'lab.inferP95': 'Inference, 95th percentile',
    'lab.timeToResult': 'Photo to result',
    'lab.calibration': 'Health calibration, v1 to v2',
    'lab.before': 'Before',
    'lab.after': 'After',
    'lab.healthyReported': 'Healthy leaves reported healthy',
    'lab.medianScore': 'Median score on healthy leaves',
    'lab.syntheticNecrosis': 'Synthetic necrosis detected',
    'lab.syntheticChlorosis': 'Synthetic chlorosis detected',
    'lab.runs': 'Repeated scans',
    'lab.tensors': 'Tensor count after the run',
    'lab.crashes': 'Crashes',
    'lab.offline': 'Offline reload',
    'lab.pass': 'Pass',
    'lab.stable': 'Stable',
    'lab.bench': 'Run the benchmark on this device',
    'lab.benchRunning': 'Running {i} of {n}…',
    'lab.benchDone': 'Median {ms} ms over {n} inferences on this device.',
    'lab.measuredOn': 'Measured on {device}, {date}.',
    'lab.noData': 'No benchmark file yet. Run npm run bench to generate app/data/lab.json.',
    'lab.measure': 'Measure',
    'lab.payload': 'What gets downloaded',
    'lab.shell': 'The interface, over the wire',
    'lab.offlineTotal': 'Held for offline use',
    'lab.files': 'Files cached',
    'lab.shellNote': 'The interface figure is the page, every stylesheet, every screen and both typefaces, compressed as the server sends them. It excludes the model and the TensorFlow.js runtime, which arrive after the first screen is drawn and are then kept. A first visit draws the home screen from roughly two thirds of it.',
    'lab.oodTitle': 'What the refusal actually catches',
    'lab.oodTree': 'Tree the model was never trained on',
    'lab.oodRejected': 'Refused as unfamiliar',
    'lab.oodNote': 'The check was built to stop the app naming a species for a photograph of something that is not a leaf, and it does that. Measured against other trees’ leaves it mostly does not — so a leaf from outside the four can still be given one of their names.',
    'lab.benchWhy': 'The figures above were measured on one machine. This runs the same inference on yours, now.',

    /* ----------------------------------------------------------- journey */
    'journey.title': 'Journey',
    'journey.stages': 'Production stages',
    'journey.log': 'Iteration log',
    'journey.problem': 'Problem',
    'journey.change': 'Change',
    'journey.evidence': 'Evidence',
    'journey.result': 'Result',
    'journey.compare': 'Version 1 and version 2',
    'journey.compareHelp': 'Drag the handle to compare the same screen before and after.',
    'journey.v1': 'v1 Green-Trace',
    'journey.v2': 'v2 Warif',
    'journey.screen': 'Screen',
    'journey.openV1': 'Open version 1',
    'journey.openV1Help': 'Green-Trace is still deployed, from its own address, so you can open both and compare them yourself rather than take our screenshots for it.',

    /* -------------------------------------------------------------- team */
    'team.title': 'Team',
    'team.supervisor': 'Supervisor',
    'team.leader': 'Team leader',
    'team.members': 'Members',
    'team.responsibilities': 'Responsibilities',
    'team.speaks': 'Speaking part',
    'team.equal': 'Every member carried an equal share of the project. This page lists what each person was responsible for and the part they present.',

    /* ---------------------------------------------------------- feedback */
    'feedback.title': 'Your feedback',
    'feedback.sub': 'Four quick ratings and anything you want to tell us. It stays on this device.',
    'feedback.clarity': 'Clarity',
    'feedback.usefulness': 'Usefulness',
    'feedback.design': 'Design',
    'feedback.innovation': 'Innovation',
    'feedback.comment': 'Comments',
    'feedback.commentPlaceholder': 'What worked, and what would you change?',
    'feedback.role': 'You are',
    'feedback.roleEvaluator': 'Evaluator',
    'feedback.roleTeacher': 'Teacher',
    'feedback.roleParent': 'Parent',
    'feedback.roleStudent': 'Student',
    'feedback.roleGuest': 'Guest',
    'feedback.name': 'Your name (optional)',
    'feedback.submit': 'Send feedback',
    'feedback.thanks': 'Thank you — your feedback was saved.',
    'feedback.another': 'Leave more feedback',
    'feedback.stars': '{n} of 5',
    'feedback.onPhone': 'Prefer your own phone?',
    'feedback.onPhoneBody': 'Scan this to open the same form on your phone.',
    'feedback.admin': 'Collected feedback',
    'feedback.export': 'Export as CSV',
    'feedback.clear': 'Clear all responses',
    'feedback.count': '{n} responses on this device',
    'feedback.confirmClear': 'Delete every stored response on this device?',

    /* ---------------------------------------------------------- showcase */
    'showcase.tap': 'Tap to scan a leaf',
    'showcase.qr': 'Open Warif on your phone',
    'showcase.exit': 'Press Escape, or hold the logo, to leave kiosk mode',
    'showcase.did': 'Did you know',

    /* ----------------------------------------------------------- present */
    'present.notes': 'Notes',
    'present.timer': 'Timer',
    'present.speaker': 'Speaker',
    'present.slide': 'Slide {i} of {n}',
    'present.start': 'Start',
    'present.pause': 'Pause',
    'present.reset': 'Reset',
    'present.keys': 'Arrow keys move, N shows notes, T shows the timer.',
    'present.demo': 'Open the live app',
    'present.back': 'Back to the slides',

    /* ------------------------------------------------------------- brand */
    'brand.title': 'Brand',
    'brand.sub': 'The identity, and the rules that keep it consistent.',
    'brand.mark': 'The mark',
    'brand.lockups': 'Lockups',
    'brand.palette': 'Palette',
    'brand.type': 'Type',
    'brand.usage': 'Usage',
    'brand.icons': 'Icons',
    'brand.download': 'Download the SVG',

    /* ---------------------------------------------------------- settings */
    'settings.title': 'Settings',
    'settings.language': 'Language',
    'settings.theme': 'Theme',
    'settings.themeAuto': 'Auto',
    'settings.themeDay': 'Day',
    'settings.themeNight': 'Night',
    'settings.themeContrast': 'High contrast',
    'settings.themeAutoHint': 'Auto follows your device’s appearance setting.',
    'settings.motion': 'Motion',
    'settings.motionAuto': 'Auto',
    'settings.motionOn': 'Full',
    'settings.motionOff': 'Reduced',
    'settings.motionHint': 'Auto follows your device’s reduced-motion setting.',
    'settings.textsize': 'Text size',
    'settings.textStandard': 'Standard',
    'settings.textLarge': 'Large',
    'settings.close': 'Done',

    /* -------------------------------------------------------------- misc */
    'misc.loading': 'Loading…',
    'misc.error': 'Something went wrong',
    'misc.retry': 'Try again',
    'misc.print': 'Print this page',
    'misc.of': 'of',
    'misc.todo': 'To confirm',
  },

  ar: {
    'nav.scan': 'المسح',
    'nav.trees': 'الأشجار',
    'nav.help': 'المساعدة',
    'nav.project': 'المشروع',
    'nav.team': 'الفريق',
    'nav.home': 'وارف، الصفحة الرئيسية',
    'nav.main': 'الرئيسية',
    'nav.skip': 'تخطَّ إلى المحتوى',
    'nav.settings': 'الإعدادات',
    'nav.language': 'التبديل إلى الإنجليزية',

    'scan.title': 'اعرف شجرتك من ورقة واحدة.',
    'scan.sub': 'وجّه الكاميرا إلى ورقة واحدة على ورقٍ أبيض، وسيخبرك «وارف» باسم الشجرة وصحة الورقة وما ينبغي فعله، على جهازك مباشرةً ولو دون إنترنت.',
    'scan.privacy': 'يعمل على جهازك. بلا رفعٍ للصور ولا حساب، ويعمل دون إنترنت.',
    'scan.start': 'امسح ورقة',
    'scan.upload': 'ارفع صورة',
    'scan.sample': 'جرّب ورقة نموذجية',
    'scan.capture': 'التقاط',
    'scan.cancel': 'إلغاء',
    'scan.again': 'امسح ورقة أخرى',
    'scan.viewfinder': 'عدسة الكاميرا',
    'scan.placeholder': 'تظهر معاينة الكاميرا هنا',
    'scan.starting': 'جارٍ تشغيل الكاميرا…',
    'scan.denied': 'الكاميرا غير متاحة',
    'scan.deniedBody': 'يحتاج «وارف» إذن الكاميرا لمسح الورقة. يمكنك السماح به من إعدادات الموقع في متصفحك، أو رفع صورة بدلاً من ذلك، والنتيجة واحدة.',
    'scan.loading': 'جارٍ تحميل النموذج',
    'scan.loadingHint': 'نحو 14 ميغابايت مرة واحدة، ثم يعمل دون إنترنت.',
    'scan.ready': 'النموذج جاهز',
    'scan.knows': 'الأشجار التي يعرفها «وارف»',
    'scan.knowsSub': '{n} أشجار في المكتبة، يتعرّف النموذج الحالي على {m} منها.',
    'scan.analysing': 'جارٍ قراءة الورقة',

    'weave.1': 'نبحث عن الورقة',
    'weave.2': 'نقرأ شكلها',
    'weave.3': 'نفحص لونها',

    'result.title': 'النتيجة',
    'result.photo': 'الصورة',
    'result.healthMap': 'خريطة الصحة',
    'result.confidence': 'درجة الثقة',
    'result.confidenceHelp': 'مدى ثقة النموذج بهذا النوع، من عشرة.',
    'result.lowConfidence': 'الثقة منخفضة. قد تكون الشجرة صحيحة رغم ذلك؛ تأكد أن الورقة تملأ الإطار وأن الإضاءة متساوية، ثم أعد المسح.',
    'result.uncertain': 'تعامل مع هذا التعرّف بحذر.',
    'result.uncertainAdvice': 'قد تكون الشجرة صحيحة رغم ذلك. ضع الورقة على ورق أبيض سادة، واملأ بها الإطار، ثم أعد المسح.',
    'result.alternatives': 'احتمالات أخرى',
    'result.health': 'صحة الورقة',
    'result.healthOf': 'من 100',
    'result.findings': 'ما رصده التحليل',
    'result.todo': 'ما ينبغي فعله',
    'result.where': 'أين تجد ما تحتاجه',
    'result.whereAll': 'اطّلع على كل المورّدين وأرقام الجهات',
    'result.readMore': 'اقرأ عن هذه الشجرة',
    'result.share': 'مشاركة',
    'result.shared': 'نُسخت النتيجة',
    'result.method': 'كيف قِيس ذلك',
    'result.methodBody': 'يأتي تحديد النوع من شبكة MobileNetV2 مع طبقة مدرَّبة على صور ميدانية. أما درجة الصحة فتُقاس بالرؤية الحاسوبية الكلاسيكية: تُضبط إضاءة الصورة على خلفيتها، ثم تُفصل الورقة عنها، ويُصنَّف كل بكسل داخل النصل سليماً أو مصفرّاً أو متنخّراً.',
    'result.none': 'لم تُمسح أي ورقة بعد.',

    'unknown.title': 'لم يتعرّف «وارف» على هذه الورقة.',
    'unknown.body': 'لا تطابق هذه الصورة أي شجرة دُرّب عليها النموذج. وبدل إقحامها في أقرب نوع، يخبرك «وارف» بصراحة أنه لا يعرف.',
    'unknown.why': 'لماذا',
    'unknown.noFoliage': 'لا يكاد يوجد نسيج نباتي في الصورة.',
    'unknown.unfamiliar': 'الصورة بعيدة عن كل شجرة دُرّب عليها النموذج.',
    'unknown.lowProbability': 'لم تحصل أي شجرة على درجة قريبة من الكافية.',
    'unknown.spreadEvenly': 'الدرجات موزَّعة بالتساوي تقريباً، وهذا تخمين.',
    'unknown.tips': 'ثلاثة أمور تساعد',
    'unknown.tip1': 'ضع ورقة واحدة على ورقٍ أبيض سادة.',
    'unknown.tip2': 'اجعلها تملأ معظم الإطار.',
    'unknown.tip3': 'استخدم ضوء نهار متساوياً، وتجنّب ظلاً حاداً على النصل.',
    'unknown.seeTrees': 'اطّلع على الأشجار التي يعرفها «وارف»',
    'unknown.retry': 'أعد المحاولة',

    'health.excellent': 'سليمة',
    'health.good': 'سليمة في الغالب',
    'health.fair': 'إجهاد خفيف',
    'health.poor': 'مُجهَدة',
    'health.bad': 'متضررة بشدة',
    'health.invalid': 'لم تُعثر على ورقة',
    'health.legend': 'الأخضر نسيج سليم، والأصفر مصفرّ، والبني ميت.',

    'trees.title': 'الأشجار',
    'trees.sub': '{n} أشجار في المكتبة، يتعرّف النموذج الحالي على {m} منها.',
    'trees.all': 'الكل',
    'trees.native': 'محلية',
    'trees.introduced': 'مُدخَلة',
    'trees.invasive': 'غازية',
    'trees.recognised': 'يتعرّف عليها',
    'trees.reference': 'للاطّلاع فقط',
    'trees.referenceWhy': 'موجودة في المكتبة للاطّلاع. لم يُدرَّب النموذج الحالي عليها، فلن تظهر في نتيجة مسح.',
    'trees.accuracy': 'دقة النموذج لهذه الشجرة',
    'trees.leaf': 'كيف تميّز الورقة',
    'trees.about': 'نبذة',
    'trees.why': 'لماذا تهمّنا هنا',
    'trees.lookalike': 'يسهل الخلط بينها',
    'trees.notFound': 'هذه الشجرة ليست في المكتبة.',
    'trees.back': 'العودة إلى كل الأشجار',
    'trees.scanThis': 'امسح ورقة',

    'help.title': 'المساعدة',
    'help.sub': 'أرقام الجهات الرسمية أولاً، ثم أقرب الأماكن لشراء ما تحتاجه المعالجة.',
    'help.official': 'أرقام الجهات الرسمية',
    'help.suppliers': 'المورّدون',
    'help.locate': 'استخدم موقعي',
    'help.locateWhy': 'يُستخدم موقعك على جهازك لترتيب القائمة حسب المسافة، ولا يُرسل إلى أي جهة.',
    'help.located': 'مرتَّبة حسب المسافة عنك',
    'help.denied': 'الموقع غير متاح، فالقائمة بترتيبها المعتاد.',
    'help.emirate': 'الإمارة',
    'help.allEmirates': 'كل الإمارات',
    'help.call': 'اتصال',
    'help.directions': 'الاتجاهات',
    'help.noHours': 'ساعات العمل غير مسجّلة',
    'help.sells': 'يبيع',
    'help.searchOnline': 'ابحث على الإنترنت عن المزيد',

    'project.title': 'المشروع',
    'project.name': 'الاسم',
    'project.problem': 'المشكلة',
    'project.approach': 'منهجنا',
    'project.more': 'اقرأ المزيد',
    'project.how': 'كيف يعمل الذكاء الاصطناعي',
    'project.howSub': 'مسار المعالجة، وبطاقة النموذج، وحدوده.',
    'project.lab': 'مختبر الاختبار',
    'project.labSub': 'السرعة والدقة والموثوقية، مقيسة.',
    'project.journey': 'المسيرة',
    'project.journeySub': 'كيف بُني المشروع، وما الذي تغيّر بين النسختين.',
    'project.team': 'الفريق',
    'project.teamSub': 'من بناه، ومن يتحدث عن كل جزء.',

    'how.title': 'كيف يعمل الذكاء الاصطناعي',
    'how.pipeline': 'مسار المعالجة',
    'how.modelCard': 'بطاقة النموذج',
    'how.classes': 'الأشجار التي يتعرّف عليها',
    'how.validation': 'دقة التحقق',
    'how.perClass': 'الدقة لكل شجرة',
    'how.matrix': 'مصفوفة الالتباس',
    'how.matrixHelp': 'الصفوف هي الشجرة الحقيقية، والأعمدة ما أجاب به النموذج. النموذج المثالي يملأ القطر وحده.',
    'how.trained': 'دُرِّب على',
    'how.samples': 'صورة تدريب',
    'how.valSamples': 'صورة تحقق محجوزة',
    'how.oodTitle': 'عتبة «لا أعرف»',
    'how.oodBody': 'تُقارن كل صورة بمركز كل شجرة يعرفها النموذج. وتحت تشابه جيبي قدره {t} تُعامل الصورة على أنها شيء آخر تماماً، فيمتنع «وارف» عن تسميتها.',
    'how.limits': 'ما لا يستطيع فعله',
    'how.trainedAt': 'تاريخ تدريب النموذج',

    'lab.title': 'مختبر الاختبار',
    'lab.sub': 'كل رقم في هذه الصفحة مقيس لا مقدَّر، وكل قسم يذكر على أي جهاز ومتى.',
    'lab.performance': 'الأداء',
    'lab.accuracy': 'الدقة',
    'lab.reliability': 'الموثوقية',
    'lab.loadCold': 'تحميل النموذج، أول مرة',
    'lab.loadWarm': 'تحميل النموذج، من الذاكرة',
    'lab.inferMedian': 'زمن الاستدلال، الوسيط',
    'lab.inferP95': 'زمن الاستدلال، المئين 95',
    'lab.timeToResult': 'من الصورة إلى النتيجة',
    'lab.calibration': 'معايرة تحليل الصحة، من النسخة الأولى إلى الثانية',
    'lab.before': 'قبل',
    'lab.after': 'بعد',
    'lab.healthyReported': 'أوراق سليمة صُنّفت سليمة',
    'lab.medianScore': 'وسيط الدرجة للأوراق السليمة',
    'lab.syntheticNecrosis': 'تنخّر مُصطنع تم رصده',
    'lab.syntheticChlorosis': 'اصفرار مُصطنع تم رصده',
    'lab.runs': 'عمليات مسح متكررة',
    'lab.tensors': 'عدد المصفوفات بعد التشغيل',
    'lab.crashes': 'الأعطال',
    'lab.offline': 'إعادة التحميل دون إنترنت',
    'lab.pass': 'ناجح',
    'lab.stable': 'مستقر',
    'lab.bench': 'شغّل الاختبار على هذا الجهاز',
    'lab.benchRunning': 'جارٍ التشغيل {i} من {n}…',
    'lab.benchDone': 'الوسيط {ms} ملّي ثانية عبر {n} عملية استدلال على هذا الجهاز.',
    'lab.measuredOn': 'قيس على {device} بتاريخ {date}.',
    'lab.noData': 'لا يوجد ملف قياس بعد. شغّل npm run bench لإنشاء app/data/lab.json.',
    'lab.measure': 'القياس',
    'lab.payload': 'ما الذي يُحمَّل',
    'lab.shell': 'الواجهة عبر الشبكة',
    'lab.offlineTotal': 'المحفوظ للعمل دون إنترنت',
    'lab.files': 'الملفات المحفوظة',
    'lab.shellNote': 'رقم الواجهة يشمل الصفحة وكل ملفات التنسيق وكل الشاشات والخطّين، مضغوطةً كما يرسلها الخادم. ولا يشمل النموذج ولا منظومة TensorFlow.js، فهما يصلان بعد رسم الشاشة الأولى ثم يُحفظان. وتُرسم الشاشة الرئيسية في أول زيارة من نحو ثلثيه.',
    'lab.oodTitle': 'ما الذي يلتقطه الرفض فعلاً',
    'lab.oodTree': 'شجرة لم يُدرَّب عليها النموذج',
    'lab.oodRejected': 'رُفضت بوصفها غير مألوفة',
    'lab.oodNote': 'بُني هذا الفحص ليمنع التطبيق من تسمية نوعٍ لصورةٍ ليست ورقة شجر، وهو يفعل ذلك. أما مع أوراق الأشجار الأخرى فلا يفعل غالباً، فقد تُمنح ورقةٌ من خارج الأنواع الأربعة اسم أحدها.',
    'lab.benchWhy': 'قِيست الأرقام أعلاه على جهاز واحد. وهذا الزر يشغّل القياس نفسه على جهازك الآن.',

    'journey.title': 'المسيرة',
    'journey.stages': 'مراحل الإنتاج',
    'journey.log': 'سجل التحسين',
    'journey.problem': 'المشكلة',
    'journey.change': 'التغيير',
    'journey.evidence': 'الدليل',
    'journey.result': 'النتيجة',
    'journey.compare': 'النسخة الأولى والثانية',
    'journey.compareHelp': 'اسحب المقبض لمقارنة الشاشة نفسها قبل وبعد.',
    'journey.v1': 'النسخة الأولى، الأثر الأخضر',
    'journey.v2': 'النسخة الثانية، وارف',
    'journey.screen': 'الشاشة',
    'journey.openV1': 'افتح النسخة الأولى',
    'journey.openV1Help': 'ما زال «الأثر الأخضر» منشوراً على عنوانه الخاص، فيمكنك فتح النسختين والمقارنة بنفسك بدل الاكتفاء بلقطاتنا.',

    'team.title': 'الفريق',
    'team.supervisor': 'المشرف',
    'team.leader': 'قائد الفريق',
    'team.members': 'الأعضاء',
    'team.responsibilities': 'المسؤوليات',
    'team.speaks': 'جزء العرض',
    'team.equal': 'حمل كل عضو نصيباً متساوياً من المشروع. تعرض هذه الصفحة ما كان كل فرد مسؤولاً عنه، والجزء الذي يقدّمه.',

    'feedback.title': 'رأيك',
    'feedback.sub': 'أربع تقييمات سريعة وما تودّ قوله لنا. يبقى كل ذلك على هذا الجهاز.',
    'feedback.clarity': 'الوضوح',
    'feedback.usefulness': 'الفائدة',
    'feedback.design': 'التصميم',
    'feedback.innovation': 'الابتكار',
    'feedback.comment': 'ملاحظات',
    'feedback.commentPlaceholder': 'ما الذي نجح، وما الذي تودّ تغييره؟',
    'feedback.role': 'أنت',
    'feedback.roleEvaluator': 'مُقيِّم',
    'feedback.roleTeacher': 'معلّم',
    'feedback.roleParent': 'ولي أمر',
    'feedback.roleStudent': 'طالب',
    'feedback.roleGuest': 'زائر',
    'feedback.name': 'اسمك (اختياري)',
    'feedback.submit': 'أرسل رأيك',
    'feedback.thanks': 'شكراً لك، حُفظ رأيك.',
    'feedback.another': 'أضف رأياً آخر',
    'feedback.stars': '{n} من 5',
    'feedback.onPhone': 'تفضّل هاتفك؟',
    'feedback.onPhoneBody': 'امسح هذا الرمز لفتح النموذج نفسه على هاتفك.',
    'feedback.admin': 'الردود المجمّعة',
    'feedback.export': 'تصدير CSV',
    'feedback.clear': 'حذف كل الردود',
    'feedback.count': '{n} رداً على هذا الجهاز',
    'feedback.confirmClear': 'هل تريد حذف كل الردود المخزّنة على هذا الجهاز؟',

    'showcase.tap': 'المس الشاشة لمسح ورقة',
    'showcase.qr': 'افتح «وارف» على هاتفك',
    'showcase.exit': 'اضغط Escape أو أطل الضغط على الشعار للخروج من وضع الكشك',
    'showcase.did': 'هل تعلم',

    'present.notes': 'ملاحظات',
    'present.timer': 'المؤقّت',
    'present.speaker': 'المتحدث',
    'present.slide': 'الشريحة {i} من {n}',
    'present.start': 'ابدأ',
    'present.pause': 'إيقاف مؤقت',
    'present.reset': 'تصفير',
    'present.keys': 'أسهم لوحة المفاتيح للتنقل، وN للملاحظات، وT للمؤقّت.',
    'present.demo': 'افتح التطبيق الحيّ',
    'present.back': 'العودة إلى الشرائح',

    'brand.title': 'الهوية',
    'brand.sub': 'الهوية البصرية، والقواعد التي تحفظ اتساقها.',
    'brand.mark': 'الشعار',
    'brand.lockups': 'التركيبات',
    'brand.palette': 'الألوان',
    'brand.type': 'الخطوط',
    'brand.usage': 'الاستخدام',
    'brand.icons': 'الأيقونات',
    'brand.download': 'نزّل ملف SVG',

    'settings.title': 'الإعدادات',
    'settings.language': 'اللغة',
    'settings.theme': 'المظهر',
    'settings.themeAuto': 'تلقائي',
    'settings.themeDay': 'نهار',
    'settings.themeNight': 'ليل',
    'settings.themeContrast': 'تباين عالٍ',
    'settings.themeAutoHint': 'التلقائي يتبع إعداد المظهر في جهازك.',
    'settings.motion': 'الحركة',
    'settings.motionAuto': 'تلقائي',
    'settings.motionOn': 'كاملة',
    'settings.motionOff': 'مخفّفة',
    'settings.motionHint': 'التلقائي يتبع إعداد تقليل الحركة في جهازك.',
    'settings.textsize': 'حجم النص',
    'settings.textStandard': 'قياسي',
    'settings.textLarge': 'كبير',
    'settings.close': 'تم',

    'misc.loading': 'جارٍ التحميل…',
    'misc.error': 'حدث خطأ ما',
    'misc.retry': 'أعد المحاولة',
    'misc.print': 'اطبع هذه الصفحة',
    'misc.of': 'من',
    'misc.todo': 'بحاجة إلى تأكيد',
  },
};

const STORE_KEY = 'warif.lang';
let current = 'en';
const listeners = new Set();

/** The device's language, unless the visitor has chosen one before. */
function initial() {
  try {
    const saved = localStorage.getItem(STORE_KEY);
    if (saved === 'en' || saved === 'ar') return saved;
  } catch { /* private mode; fall through to the device */ }
  return (navigator.languages || [navigator.language || 'en'])
    .some((l) => String(l).toLowerCase().startsWith('ar')) ? 'ar' : 'en';
}

/**
 * Every English key with no Arabic counterpart.
 *
 * A missing Arabic string does not throw — `t()` falls back to English — so an
 * untranslated label would ship quietly and only be noticed by whoever is
 * reading the screen in Arabic, which at this showcase is the evaluator.
 * `npm test` calls this and fails on a gap.
 */
export function keyParity() {
  const en = Object.keys(STRINGS.en);
  const ar = new Set(Object.keys(STRINGS.ar));
  return { count: en.length, missing: en.filter((k) => !ar.has(k)) };
}

export function lang() { return current; }
export function dir() { return current === 'ar' ? 'rtl' : 'ltr'; }

/** Subscribe to language changes; returns an unsubscribe function. */
export function onLangChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function setLang(next, { silent = false } = {}) {
  if (next !== 'en' && next !== 'ar') return;
  current = next;
  try { localStorage.setItem(STORE_KEY, next); } catch { /* not fatal */ }
  applyToDocument();
  if (!silent) for (const fn of listeners) fn(current);
}

export function toggleLang() { setLang(current === 'en' ? 'ar' : 'en'); }

export function applyToDocument() {
  const root = document.documentElement;
  root.lang = current;
  root.dir = dir();
}

/**
 * Look up a string. `{name}` placeholders are filled from `vars`, and numbers
 * passed through go via the Western-digit formatter below.
 */
export function t(key, vars) {
  let s = STRINGS[current][key] ?? STRINGS.en[key] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      s = s.replaceAll(`{${k}}`, typeof v === 'number' ? num(v) : String(v));
    }
  }
  return s;
}

/** Picks the active language out of a `{en, ar}` pair. */
export const L = (pair) => (pair ? (pair[current] ?? pair.en ?? '') : '');

/* ------------------------------------------------------------------ numbers */

/**
 * Western digits in both languages.
 *
 * The UAE writes 800 3050 on the side of a ministry van in Western digits, and
 * a phone number a visitor has to dial is not the place to be purist about
 * Eastern Arabic numerals. `ar-AE-u-nu-latn` is the locale that says exactly
 * that: Arabic conventions, Western digits.
 */
const FORMATTERS = new Map();
function formatter(opts) {
  const locale = current === 'ar' ? 'ar-AE-u-nu-latn' : 'en-AE';
  const id = locale + JSON.stringify(opts ?? {});
  if (!FORMATTERS.has(id)) FORMATTERS.set(id, new Intl.NumberFormat(locale, opts));
  return FORMATTERS.get(id);
}

export function num(value, opts) {
  if (value == null || Number.isNaN(value)) return '—';
  return formatter(opts).format(value);
}

/** A 0..1 fraction as a whole percentage, e.g. 0.8147 -> "81%". */
export function pct(fraction, digits = 0) {
  if (fraction == null || Number.isNaN(fraction)) return '—';
  return formatter({ minimumFractionDigits: digits, maximumFractionDigits: digits }).format(fraction * 100) + '%';
}

export function date(value) {
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  const locale = current === 'ar' ? 'ar-AE-u-nu-latn' : 'en-GB';
  return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', day: 'numeric' }).format(d);
}

current = initial();
applyToDocument();
