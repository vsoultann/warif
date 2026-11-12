/**
 * Reference data for the twelve plants in the Warif library.
 *
 * `key` and the ordering here must match tools/species.mjs and the class order
 * baked into the trained model's metadata -- model.js asserts this on load.
 *
 * The library is deliberately larger than the model. Ten trees are documented
 * here; the deployed model is trained on however many appear in
 * model/metadata.json, and the interface marks the difference everywhere it
 * shows a count. A tree the model was not trained on is real reference material
 * and is labelled "Reference only" rather than quietly implying a scan would
 * return it.
 *
 * `status` is native / introduced / invasive, and drives the filter on the
 * Trees page as well as the warning on Mesquite.
 */
export const SPECIES = [
  {
    key: 'ghaf',
    status: 'native',
    latin: 'Prosopis cineraria',
    en: {
      name: 'Ghaf',
      family: 'Fabaceae (legume family)',
      leaf: 'Twice-divided (bipinnate) leaves carrying 7–14 pairs of small, blue-green leaflets on each of two side branches. Feels thin and papery; the twigs bear scattered short thorns.',
      about:
        'The Ghaf is the national tree of the United Arab Emirates and the reason a great deal of the country was ever habitable. It survives on almost no rainfall by driving a taproot as deep as 30 metres to reach groundwater, and because it is a legume it fixes nitrogen through its roots, quietly fertilising the sand around it. A single mature Ghaf shelters an entire micro-ecosystem — grasses, insects, birds and grazing animals all cluster in its shade.',
      significance:
        'Declared a protected national symbol; 2019 was named the Year of Tolerance in the UAE with the Ghaf as its emblem, because generations of desert communities gathered beneath it to settle disputes.',
      health:
        'A healthy Ghaf holds an even blue-green tint. Widespread yellowing usually means salt stress from irrigation water; blackened leaflet tips point to Ghaf dieback, a fungal problem that has hit UAE plantations.',
    },
    /* The one confusion in the library worth calling out on both pages: these
       two are hard to separate at a glance and the consequence of getting it
       wrong runs in opposite directions — protect one, report the other. */
    lookalike: {
      key: 'mesquite',
      en: 'Mesquite (Prosopis juliflora) is an invasive import that looks very like a Ghaf. Check the thorns: a Ghaf carries short, scattered ones, while mesquite has long straight spines in pairs at the leaf node. Mesquite leaflets are also larger and a brighter green.',
      ar: 'المسكيت (Prosopis juliflora) نوع غازٍ دخيل يشبه الغاف كثيراً. انظر إلى الأشواك: أشواك الغاف قصيرة متفرقة، أما المسكيت فله أشواك طويلة مستقيمة مزدوجة عند عقدة الورقة، ووريقاته أكبر وأشدّ خضرة.',
    },
    ar: {
      name: 'الغاف',
      family: 'الفصيلة البقولية',
      leaf: 'أوراق مركبة ريشية مزدوجة تحمل من 7 إلى 14 زوجاً من الوريقات الصغيرة الخضراء المزرقة، مع أشواك قصيرة متفرقة على الأغصان.',
      about:
        'الغاف هو الشجرة الوطنية لدولة الإمارات العربية المتحدة. يتحمل الجفاف بجذر وتدي يصل عمقه إلى 30 متراً للوصول إلى المياه الجوفية، وهو يثبّت النيتروجين في التربة فيخصّب الرمال من حوله. الشجرة الواحدة الناضجة تؤوي نظاماً بيئياً كاملاً من الأعشاب والحشرات والطيور.',
      significance:
        'شجرة محمية ورمز وطني؛ اختيرت شعاراً لعام التسامح 2019 لأن أهل الصحراء كانوا يجتمعون تحت ظلها لحل الخلافات.',
      health:
        'الشجرة السليمة موحدة اللون الأخضر المزرق. الاصفرار الواسع يدل غالباً على إجهاد ملحي، أما اسوداد أطراف الوريقات فيشير إلى موت أطراف الغاف الفطري.',
    },
  },
  {
    key: 'sidr',
    status: 'native',
    latin: 'Ziziphus spina-christi',
    en: {
      name: 'Sidr',
      family: 'Rhamnaceae (buckthorn family)',
      leaf: 'Simple oval leaves, 2–6 cm, with three bold veins running from the base to the tip and a finely toothed edge. Glossy dark green above, pale and slightly downy underneath.',
      about:
        'Also called the Christ\'s thorn jujube, the Sidr is one of the longest-lived trees in Arabia — individuals over 500 years old are documented. Its small yellow fruit is edible, its leaves have been used as a cleanser and medicine for millennia, and Sidr honey, made by bees working its blossom, is among the most valuable honeys in the world.',
      significance:
        'Named in the Quran and deeply woven into Emirati heritage medicine. Its dense, thorny canopy makes it a critical nesting tree for desert birds.',
      health:
        'Look for the three basal veins staying crisp and green. Sidr is a common target for leaf-mining insects, which leave pale winding trails, and for sooty mould, which shows as a black film on the glossy upper surface.',
    },
    ar: {
      name: 'السدر',
      family: 'الفصيلة النبقية',
      leaf: 'أوراق بسيطة بيضاوية من 2 إلى 6 سم، لها ثلاثة عروق بارزة تمتد من القاعدة إلى القمة وحافة مسننة دقيقة، لامعة من الأعلى وشاحبة من الأسفل.',
      about:
        'السدر من أطول أشجار الجزيرة العربية عمراً، وقد وُثّقت أشجار تجاوزت خمسمائة عام. ثمره النبق صالح للأكل، وأوراقه استُخدمت للتنظيف والتداوي منذ آلاف السنين، وعسل السدر من أثمن أنواع العسل في العالم.',
      significance: 'ذُكر في القرآن الكريم وله مكانة راسخة في الطب الشعبي الإماراتي، وتُعد أشجاره ملاذاً لتعشيش طيور الصحراء.',
      health:
        'العروق الثلاثة يجب أن تبقى واضحة وخضراء. السدر عرضة لحشرات صانعة الأنفاق التي تترك خطوطاً شاحبة متعرجة، وللعفن الأسود الذي يظهر كطبقة سوداء على السطح اللامع.',
    },
    lookalike: {
      key: 'samar',
      en: 'Samar (Vachellia tortilis) grows in the same wadis and is the tree a Sidr is most often taken for from a distance. Up close they are nothing alike: a Sidr leaf is a single glossy oval with three veins running from its base, while a Samar leaf is split into dozens of leaflets a few millimetres long. Sidr thorns come in pairs, one straight and one hooked; Samar carries long straight white thorns.',
      ar: 'السمر (Vachellia tortilis) ينمو في الأودية نفسها، وهو الشجرة التي يُظن السدر أنه هي من بعيد. أما من قرب فلا شبه بينهما: ورقة السدر بيضاوية لامعة واحدة تخرج من قاعدتها ثلاثة عروق، وورقة السمر مقسّمة إلى عشرات الوريقات التي لا يتجاوز طولها بضعة مليمترات. أشواك السدر أزواج، واحد مستقيم وآخر معقوف، أما السمر فأشواكه بيضاء طويلة مستقيمة.',
    },
  },
  {
    key: 'nakhl',
    status: 'native',
    latin: 'Phoenix dactylifera',
    en: {
      name: 'Date Palm',
      family: 'Arecaceae (palm family)',
      leaf: 'A huge pinnate frond up to 5 m long, with stiff grey-green leaflets folded into a V and set along the midrib in opposing planes. The lowest leaflets harden into vicious spines.',
      about:
        'The date palm is the foundation of settled life in the Gulf. It tolerates salt and heat that would kill almost anything else, and every part of it was historically used: fruit for food, trunks for roofing, fronds for arish houses and fibre for rope. The UAE holds over 40 million date palms — one of the densest populations on earth.',
      significance:
        'Called "the mother tree" in Emirati culture. Date palm cultivation in the Al Ain oases is a UNESCO World Heritage inscription, and the UAE is a world leader in palm research.',
      health:
        'Healthy fronds are stiff and evenly grey-green. Drooping or collapsing fronds are the signature of red palm weevil, the single most destructive pest in the region, while orange-brown blotching along the leaflets suggests a fungal leaf spot.',
    },
    ar: {
      name: 'النخيل',
      family: 'الفصيلة النخيلية',
      leaf: 'سعفة ريشية ضخمة يصل طولها إلى 5 أمتار، وريقاتها صلبة رمادية خضراء مطوية على شكل حرف V، وتتحول الوريقات السفلية إلى أشواك حادة.',
      about:
        'النخلة أساس الاستقرار في الخليج. تتحمل الملوحة والحرارة التي لا يصمد أمامها غيرها، واستُخدم كل جزء منها: الثمر غذاءً والجذوع سقوفاً والسعف للعرش والليف للحبال. تضم الإمارات أكثر من 40 مليون نخلة.',
      significance: 'تُسمى «الشجرة الأم» في الثقافة الإماراتية، وواحات العين المزروعة بالنخيل مُدرجة في قائمة اليونسكو للتراث العالمي.',
      health:
        'السعف السليم صلب وموحد اللون. تدلي السعف أو انهياره علامة سوسة النخيل الحمراء، أخطر آفة في المنطقة، أما التبقع البرتقالي البني فيشير إلى تبقع الأوراق الفطري.',
    },
  },
  {
    key: 'samar',
    status: 'native',
    latin: 'Vachellia tortilis',
    en: {
      name: 'Samar',
      family: 'Fabaceae (legume family)',
      leaf: 'Very small twice-divided leaves with tiny paired leaflets only a few millimetres long, giving a feathery, almost see-through look. Twigs carry both long straight white thorns and short hooked ones.',
      about:
        'The Samar, or umbrella thorn acacia, is the tree that gives the Arabian desert its silhouette — a flat, wide crown pruned into a perfect umbrella by browsing camels and goats. Shrinking its leaves to near-nothing is how it survives: less surface area means less water lost. It fixes nitrogen and its seed pods are a staple food for desert livestock and wildlife.',
      significance:
        'A keystone species of UAE gravel plains and wadis. Its shade lowers ground temperature enough for other plants to germinate, so losing Samar trees cascades through the whole habitat.',
      health:
        'Because the leaflets are so small, health is judged by canopy density rather than individual leaves. Thinning that exposes the branch structure means drought stress or over-browsing; galls and swollen thorn bases indicate insect infestation.',
    },
    ar: {
      name: 'السمر',
      family: 'الفصيلة البقولية',
      leaf: 'أوراق مركبة ريشية مزدوجة صغيرة جداً، وريقاتها لا تتجاوز بضعة مليمترات فتبدو الورقة ريشية شبه شفافة، مع أشواك بيضاء مستقيمة طويلة وأخرى قصيرة معقوفة.',
      about:
        'السمر هو الشجرة التي ترسم ملامح الصحراء العربية بتاجها المسطح العريض الذي تشذّبه الإبل والماعز على هيئة مظلة. يصغّر أوراقه إلى أدنى حد ليقلل فقد الماء، ويثبّت النيتروجين، وقرونه غذاء أساسي لحيوانات الصحراء.',
      significance: 'نوع أساسي في السهول الحصوية والأودية الإماراتية؛ ظله يخفض حرارة الأرض بما يكفي لإنبات نباتات أخرى.',
      health:
        'لصغر الوريقات تُقاس الصحة بكثافة التاج لا بالورقة الواحدة. التخلخل الذي يكشف الأغصان يعني إجهاد جفاف أو رعياً مفرطاً، والعقد المتورمة عند قواعد الأشواك تدل على إصابة حشرية.',
    },
    lookalike: {
      key: 'sidr',
      en: 'Sidr (Ziziphus spina-christi) shares the Samar’s wadis and its thorny, spreading build. Look at a single leaf: if it is one glossy oval, 2–6 cm long with three veins from the base, it is a Sidr. If it is feathery and made of tiny paired leaflets, it is a Samar.',
      ar: 'السدر (Ziziphus spina-christi) يشارك السمر أوديته وشكله الشوكي المنتشر. انظر إلى ورقة واحدة: إن كانت بيضاوية لامعة واحدة طولها 2–6 سم تخرج من قاعدتها ثلاثة عروق فهي سدر، وإن كانت ريشية مكوّنة من وريقات صغيرة مزدوجة فهي سمر.',
    },
  },
  {
    key: 'qurm',
    status: 'native',
    latin: 'Avicennia marina',
    en: {
      name: 'Grey Mangrove',
      family: 'Acanthaceae',
      leaf: 'Thick, leathery, oval leaves 4–10 cm long, glossy dark green above and distinctly pale grey-white underneath — the underside is the giveaway. Often crusted with visible salt crystals excreted through the leaf surface.',
      about:
        'The Grey Mangrove is the only mangrove that grows naturally along most of the UAE coast, and it survives conditions no other tree here tolerates: seawater, twice-daily flooding, and mud with almost no oxygen. It breathes through pencil-like roots called pneumatophores that stand up out of the mud around it, and it sheds excess salt straight through its leaves, which is why they taste of it.',
      significance:
        'Abu Dhabi holds the largest mangrove forests in the Gulf, and they are the emirate’s most effective carbon sink per hectare as well as the nursery for most of its coastal fish. Planting them has been national policy since Sheikh Zayed ordered the first large-scale replanting in the 1970s.',
      health:
        'Healthy leaves are firm and glossy with a clean pale underside. Yellowing across whole leaves usually means the tree is being drowned by changed water flow rather than starved of nutrients; blackened patches often follow an oil or sediment spill.',
    },
    ar: {
      name: 'القرم',
      family: 'الفصيلة الشوكية',
      leaf: 'أوراق سميكة جلدية بيضاوية طولها 4–10 سم، خضراء داكنة لامعة من الأعلى وشاحبة رمادية بيضاء من الأسفل، وهذه هي العلامة المميزة. وغالباً تُرى عليها بلورات ملح تفرزها الورقة.',
      about:
        'القرم هو المانغروف الوحيد الذي ينمو طبيعياً على معظم ساحل الإمارات، ويعيش في ظروف لا تحتملها شجرة أخرى هنا: ماء البحر، والغمر مرتين يومياً، وطين شبه خالٍ من الأكسجين. يتنفس عبر جذور تنفسية تشبه الأقلام تنتصب من الطين حوله، ويطرح الملح الزائد من أوراقه مباشرة.',
      significance:
        'تضم أبوظبي أكبر غابات القرم في الخليج، وهي أكفأ مصارف الكربون في الإمارة لكل هكتار، ومحضن معظم أسماكها الساحلية. وزراعتها سياسة وطنية منذ أمر الشيخ زايد بأول حملة تشجير واسعة في السبعينيات.',
      health:
        'الورقة السليمة متماسكة لامعة وظهرها شاحب نظيف. اصفرار الورقة كاملة يعني عادةً غرق الشجرة بسبب تغيّر مجرى المياه لا نقص التغذية، أما البقع السوداء فتتبع غالباً تسرّب زيت أو ترسّبات.',
    },
  },
  {
    key: 'athl',
    status: 'native',
    latin: 'Tamarix aphylla',
    en: {
      name: 'Athel Tamarisk',
      family: 'Tamaricaceae',
      leaf: 'Not really leaves at all: minute grey-green scales that sheathe the slender green twigs, so the whole shoot looks like a jointed cord rather than a leafy branch. Often furred with excreted salt.',
      about:
        'The Athel is the UAE’s traditional windbreak. It grows fast, tolerates salt and drought that would kill almost anything else, and its dense feathery crown stops moving sand — which is why lines of Athel edge farms and roads all over the Emirates. Its wood was the standard timber for roof beams and boat frames long before imported wood was available.',
      significance:
        'Planted for centuries as shelter belts around date gardens. Because it excretes salt onto the soil beneath it, an Athel row also suppresses weeds — useful, but the same trait makes it aggressive where it escapes cultivation.',
      health:
        'Healthy shoots are firm and grey-green along their whole length. Twigs that turn straw-brown from the tip back indicate drought stress or root damage; whole-branch dieback in irrigated ground usually means waterlogging.',
    },
    ar: {
      name: 'الأثل',
      family: 'الفصيلة الأثلية',
      leaf: 'ليست أوراقاً بالمعنى المعتاد: حراشف دقيقة رمادية خضراء تغلّف الأغصان الخضراء الرفيعة، فيبدو الفرع كحبل مفصّل لا كغصن مورق. وغالباً يعلوه غبار ملحي تفرزه الشجرة.',
      about:
        'الأثل مصدّ الرياح التقليدي في الإمارات. ينمو سريعاً، ويتحمل من الملوحة والجفاف ما يقتل غيره، وتاجه الكثيف الريشي يوقف زحف الرمال، ولذلك تحفّ صفوفه المزارع والطرق في أنحاء الدولة. وكان خشبه الخشب المعتمد لجذوع السقوف وهياكل السفن قبل توفّر الخشب المستورد.',
      significance:
        'زُرع قروناً كمصدّات حول حدائق النخيل. ولأنه يفرز الملح على التربة تحته فإن صفّ الأثل يكبح الأعشاب أيضاً، وهي ميزة تنقلب عدوانية حين يخرج عن السيطرة.',
      health:
        'الأغصان السليمة متماسكة رمادية خضراء بطولها. تحوّل الأغصان إلى بني قشّي من الطرف نحو الداخل يعني إجهاد جفاف أو ضرراً في الجذور، وموت الفرع كاملاً في أرض مروية يعني عادةً غدقاً.',
    },
  },
  {
    key: 'arak',
    status: 'native',
    latin: 'Salvadora persica',
    en: {
      name: 'Arak (Toothbrush Tree)',
      family: 'Salvadoraceae',
      leaf: 'Fleshy, slightly succulent oval leaves 3–7 cm long in opposite pairs, a bright yellow-green, and noticeably soft and brittle compared with the leathery leaves of its neighbours. Crushed, they smell sharply of mustard.',
      about:
        'The Arak is a low, tangled evergreen of coastal plains and wadi beds, and its roots and twigs are the miswak — the natural toothbrush used across the Arab world for well over a thousand years. That is not folklore: the wood contains natural antibacterial compounds and silica, which is why it works.',
      significance:
        'One of the few native species that stays green through the hottest part of a UAE summer without irrigation, and an important food source for birds and desert foxes when its small pink berries ripen.',
      health:
        'Leaves should be plump and pale yellow-green; genuine chlorosis is hard to judge here because the species is naturally lighter than most. Limp or shrivelled leaves mean water stress, and blackening at the leaf base usually indicates root rot in over-irrigated ground.',
    },
    ar: {
      name: 'الأراك',
      family: 'الفصيلة الأراكية',
      leaf: 'أوراق لحمية بيضاوية طولها 3–7 سم في أزواج متقابلة، خضراء مصفرّة زاهية، وطريّة هشّة مقارنة بأوراق جاراتها الجلدية. ورائحتها عند السحق حادة تشبه الخردل.',
      about:
        'الأراك شجيرة دائمة الخضرة متشابكة تنمو في السهول الساحلية وبطون الأودية، وجذوره وأغصانه هي السواك المستخدم في العالم العربي منذ أكثر من ألف عام. وليس ذلك من الموروث فحسب: فخشبه يحتوي مركبات طبيعية مضادة للبكتيريا وسيليكا، وهذا سبب فاعليته.',
      significance:
        'من الأنواع المحلية القليلة التي تبقى خضراء في ذروة صيف الإمارات دون ريّ، ومصدر غذاء مهم للطيور وثعالب الصحراء حين تنضج ثماره الوردية الصغيرة.',
      health:
        'ينبغي أن تكون الأوراق ممتلئة خضراء مصفرّة؛ ويصعب الحكم على الاصفرار هنا لأن النوع أفتح لوناً بطبيعته. الأوراق الذابلة تعني إجهاد ماء، والاسوداد عند قاعدة الورقة يدل غالباً على تعفّن جذور في أرض مفرطة الري.',
    },
  },
  {
    key: 'neem',
    status: 'introduced',
    latin: 'Azadirachta indica',
    en: {
      name: 'Neem',
      family: 'Meliaceae (mahogany family)',
      leaf: 'Pinnate leaves 20–40 cm long carrying 8–19 leaflets, each one curved like a scimitar with a clearly toothed edge and an asymmetric base. Deep glossy green, and bitter to taste.',
      about:
        'Neem is not native to the Emirates but has been planted along more UAE streets, car parks and school yards than almost any other tree, because it grows fast, casts genuinely deep shade, and asks for very little water once established. Every part of it is bitter, which is why so few pests touch it — and why its oil is sold as an organic pesticide.',
      significance:
        'The single most common shade tree in UAE urban planting, and the source of the neem oil this app recommends for pest problems on other species.',
      health:
        'Healthy Neem is uniformly dark and glossy. Yellowing between the veins while the veins stay green is classic iron chlorosis, very common in the UAE’s alkaline soils; sudden branch-by-branch wilting can indicate a root or vascular problem rather than anything on the leaf.',
    },
    ar: {
      name: 'النيم',
      family: 'الفصيلة المهوغانية',
      leaf: 'أوراق ريشية طولها 20–40 سم تحمل 8–19 وريقة، كل واحدة منحنية كالسيف بحافة مسننة واضحة وقاعدة غير متماثلة، خضراء داكنة لامعة ومرّة المذاق.',
      about:
        'النيم ليس محلياً في الإمارات، لكنه زُرع في شوارعها ومواقفها وساحات مدارسها أكثر من أي شجرة أخرى تقريباً، لأنه سريع النمو، وظله كثيف حقاً، ولا يطلب ماءً كثيراً بعد رسوخه. وكل أجزائه مرّة، ولهذا تتجنبه الآفات، ولهذا أيضاً يُباع زيته كمبيد عضوي.',
      significance:
        'أكثر أشجار الظل شيوعاً في التشجير الحضري بالإمارات، ومصدر زيت النيم الذي يوصي به هذا التطبيق لمشكلات الآفات في الأنواع الأخرى.',
      health:
        'النيم السليم داكن لامع متجانس. أما اصفرار ما بين العروق مع بقاء العروق خضراء فهو اصفرار الحديد الكلاسيكي، وهو شائع جداً في تربة الإمارات القلوية؛ والذبول المفاجئ فرعاً بعد فرع يشير إلى مشكلة في الجذور أو الأوعية لا في الورقة.',
    },
  },
  {
    key: 'osher',
    status: 'native',
    latin: 'Calotropis procera',
    en: {
      name: 'Apple of Sodom',
      family: 'Apocynaceae',
      leaf: 'Very large, thick, oval leaves 8–20 cm long in opposite pairs, pale blue-grey-green and covered in a fine woolly down that rubs off. They clasp the stem directly with almost no stalk, and any break bleeds thick white latex.',
      about:
        'Osher is the big grey-leaved shrub growing out of waste ground, roadside gravel and dry wadi beds all over the UAE — most people have walked past a hundred of them without knowing the name. Its milky sap is toxic and irritates skin and eyes, which is exactly why nothing grazes it and why it thrives where everything else has been eaten.',
      significance:
        'A reliable indicator of disturbed or overgrazed ground. Traditionally its floss was used for stuffing and its latex, very cautiously, in folk medicine — it is genuinely poisonous and is not something to experiment with.',
      health:
        'The natural leaf colour is pale grey-green with a woolly bloom, so this species reads as low-greenness even when perfectly healthy — do not mistake that for chlorosis. Real problems show as brown-edged, collapsing leaves or as heavy infestations of the orange-and-black bugs that specialise in it.',
    },
    ar: {
      name: 'العشر',
      family: 'الفصيلة الدفلية',
      leaf: 'أوراق كبيرة سميكة بيضاوية طولها 8–20 سم في أزواج متقابلة، رمادية زرقاء شاحبة مغطاة بزغب ناعم يزول بالفرك، تلتصق بالساق بلا عنق تقريباً، وأي كسر فيها ينزّ لبناً أبيض كثيفاً.',
      about:
        'العشر هو الشجيرة الكبيرة رمادية الأوراق التي تنبت في الأراضي المهملة وحصى الطرق وبطون الأودية الجافة في أنحاء الإمارات، وقد مرّ أكثر الناس بمئة منها دون أن يعرفوا اسمها. عصارتها اللبنية سامة وتهيّج الجلد والعين، ولهذا لا ترعاها الماشية، ولهذا تزدهر حيث أُكل كل ما سواها.',
      significance:
        'دليل موثوق على أرض مضطربة أو مرعية بإفراط. وكان وبرها يُستخدم تقليدياً في الحشو، ولبنها بحذر شديد في الطب الشعبي، وهو سامّ فعلاً ولا يصح تجريبه.',
      health:
        'لون الورقة الطبيعي رمادي أخضر شاحب بزغب، ولذلك يظهر هذا النوع منخفض الخضرة حتى وهو سليم تماماً، فلا يُخلط ذلك بالاصفرار المرضي. المشكلات الحقيقية تظهر كحواف بنية وأوراق منهارة، أو كإصابة كثيفة بالحشرات البرتقالية والسوداء المتخصصة به.',
    },
  },
  {
    key: 'mesquite',
    status: 'invasive',
    latin: 'Prosopis juliflora',
    en: {
      name: 'Mesquite',
      family: 'Fabaceae (legume family)',
      leaf: 'Bipinnate like the Ghaf, but with far fewer, much larger and darker leaflets — usually 1 to 3 pairs of side branches carrying 12–25 pairs of leaflets each, and a brighter, glossier green. The thorns are long, paired and straight, where the Ghaf’s are short and scattered.',
      about:
        'Mesquite is the Ghaf’s invasive double. Introduced to the region for fuelwood and dune stabilisation, it escaped, and it now outcompetes native Ghaf across large areas: it grows faster, drinks more groundwater, and forms thickets so dense that nothing establishes underneath. Telling the two apart at a glance is genuinely difficult, which is a large part of why the invasion went unnoticed for so long.',
      significance:
        'Included in this app on purpose. A tree identifier for the UAE that cannot distinguish native Ghaf from invasive mesquite has dodged the one identification question here that actually has consequences.',
      health:
        'Mesquite is usually the healthiest-looking tree in a degraded landscape, which is the point — vigour is not a good sign here. If you have identified mesquite in an area of native Ghaf, the useful action is to report it, not to treat it.',
    },
    ar: {
      name: 'المسكيت',
      family: 'الفصيلة البقولية',
      leaf: 'ريشية مزدوجة كالغاف، لكن بوريقات أقل عدداً وأكبر حجماً وأغمق لوناً: عادةً 1 إلى 3 أزواج من الأفرع الجانبية تحمل كل منها 12–25 زوجاً من الوريقات، وخضرتها أزهى وألمع. وأشواكه طويلة مزدوجة مستقيمة، بينما أشواك الغاف قصيرة متفرقة.',
      about:
        'المسكيت هو شبيه الغاف الغازي. أُدخل إلى المنطقة للحطب وتثبيت الكثبان فانفلت، وهو اليوم يزاحم الغاف المحلي في مساحات واسعة: ينمو أسرع، ويستهلك مياهاً جوفية أكثر، ويكوّن أدغالاً كثيفة لا ينبت تحتها شيء. والتفريق بينهما بنظرة واحدة صعب فعلاً، وهذا سبب كبير لمرور الغزو دون انتباه طويلاً.',
      significance:
        'أُدرج في هذا التطبيق عن قصد. فمعرّف أشجار للإمارات لا يفرّق بين الغاف المحلي والمسكيت الغازي يكون قد تهرّب من سؤال التعريف الوحيد الذي تترتب عليه نتائج.',
      health:
        'المسكيت غالباً أصحّ ما في المشهد المتدهور مظهراً، وهذا هو بيت القصيد: قوة النمو ليست علامة جيدة هنا. وإذا تعرّفت على مسكيت في منطقة غاف محلي، فالإجراء المفيد هو الإبلاغ لا المعالجة.',
    },
    lookalike: {
      key: 'ghaf',
      en: 'The native Ghaf (Prosopis cineraria) is the tree mesquite is usually mistaken for, and the mistake matters: one is a protected national symbol and the other should be reported. The Ghaf has short scattered thorns and smaller, blue-green leaflets; mesquite has long paired spines and larger, brighter foliage.',
      ar: 'الغاف المحلي (Prosopis cineraria) هو الشجرة التي يُخلط بينها وبين المسكيت غالباً، والخلط هنا مهم: إحداهما رمز وطني محمي، والأخرى يجب الإبلاغ عنها. للغاف أشواك قصيرة متفرقة ووريقات أصغر خضراء مزرقة، وللمسكيت أشواك طويلة مزدوجة وأوراق أكبر وأشدّ خضرة.',
    },
  },
  {
    key: 'vinca',
    status: 'introduced',
    latin: 'Catharanthus roseus',
    en: {
      name: 'Vinca (Periwinkle)',
      family: 'Apocynaceae (dogbane family)',
      leaf: 'Simple, glossy, dark green oval leaves 3–9 cm long, set in opposite pairs along a soft green or reddish stem. The edge is smooth, the tip rounded, and a pale, almost white midrib runs straight down the centre.',
      about:
        'The Madagascar periwinkle is the low, glossy plant with five-petalled pink, white or purple flowers filling flower beds, roundabouts and road verges right across the UAE. Landscapers choose it because it flowers almost all year, takes the summer heat and tolerates salty irrigation water better than most bedding plants. It is also one of the most important plants in modern medicine: two of its alkaloids, vinblastine and vincristine, are chemotherapy drugs.',
      significance:
        'Probably the most-planted flower in UAE public landscaping, and a reminder that a plant on a roundabout can be in a hospital pharmacy too. Every part of it is poisonous to eat.',
      health:
        'A healthy vinca leaf is deep, even and glossy. Yellowing lower leaves with a soft, darkening stem base almost always means the roots are sitting wet — overwatering and poor drainage cause root rot here far more often than drought does. Brown spots with darker rims are a fungal leaf spot, and sticky, curled new growth points to aphids or whitefly.',
    },
    ar: {
      name: 'الونكة',
      family: 'الفصيلة الدفلية',
      leaf: 'أوراق بسيطة بيضاوية خضراء داكنة لامعة طولها 3–9 سم، في أزواج متقابلة على ساق طرية خضراء أو محمرّة. حافتها ملساء وقمتها مستديرة، ويمتد في وسطها عرق رئيسي شاحب يكاد يكون أبيض.',
      about:
        'الونكة هي النبتة القصيرة اللامعة ذات الأزهار الخماسية الوردية أو البيضاء أو البنفسجية التي تملأ أحواض الزهور والدوّارات وجوانب الطرق في أنحاء الإمارات. يختارها منسّقو الحدائق لأنها تزهر طوال العام تقريباً، وتتحمل حر الصيف وملوحة مياه الري أكثر من معظم نباتات الزينة. وهي أيضاً من أهم النباتات في الطب الحديث، إذ يُستخرج منها مركّبان يُستخدمان في علاج السرطان.',
      significance:
        'من أكثر الأزهار زراعةً في التشجير العام بالإمارات، وتذكير بأن نبتة على دوّار قد تكون في صيدلية مستشفى أيضاً. وكل أجزائها سامة إن أُكلت.',
      health:
        'ورقة الونكة السليمة داكنة متجانسة لامعة. اصفرار الأوراق السفلية مع ليونة قاعدة الساق واسودادها يعني غالباً أن الجذور غارقة في الماء، فالإفراط في الري وسوء الصرف يسببان تعفن الجذور أكثر بكثير مما يسببه العطش. البقع البنية ذات الحواف الداكنة تبقّع فطري، والنموات الجديدة الملتفة اللزجة تدل على المنّ أو الذبابة البيضاء.',
    },
  },
  {
    key: 'papaya',
    status: 'introduced',
    latin: 'Carica papaya',
    en: {
      name: 'Papaya',
      family: 'Caricaceae (papaya family)',
      leaf: 'Huge, hand-shaped leaves 40–70 cm across, deeply cut into 7–11 lobes that are themselves lobed again. Each sits on a long, hollow stalk springing from the top of a single unbranched trunk. Mid green above, paler below, with pale veins fanning out from the centre.',
      about:
        'Papaya is a fast-growing fruit plant — botanically a giant herb rather than a true tree — grown in back gardens and farms across the UAE, where it can fruit within a year of planting. Its trunk is soft and hollow, and it carries all of its leaves in one crown at the top, which makes it easy to recognise from across a garden.',
      significance:
        'A common sight in Emirati home gardens and on farms in Al Ain and the northern emirates. The latex in its leaves and unripe fruit contains papain, the enzyme used to tenderise meat.',
      health:
        'Papaya shows its problems loudly, which makes it a good plant to scan. Yellow-green mosaic and mottling, with puckered or narrowed young leaves, is the classic sign of papaya ringspot virus. White powdery patches are powdery mildew; fine yellow speckling with webbing underneath means spider mites. Older leaves yellowing between the veins usually point to magnesium deficiency.',
    },
    ar: {
      name: 'البابايا',
      family: 'الفصيلة البابايية',
      leaf: 'أوراق ضخمة على شكل كف عرضها 40–70 سم، مفصّصة بعمق إلى 7–11 فصاً مفصّصة بدورها. تحملها أعناق طويلة مجوّفة تخرج من قمة ساق واحدة غير متفرعة. خضراء متوسطة من الأعلى وأفتح من الأسفل، وعروقها شاحبة تنتشر من المركز.',
      about:
        'البابايا نبات مثمر سريع النمو، وهو نباتياً عشبة عملاقة لا شجرة حقيقية، يُزرع في الحدائق المنزلية والمزارع في أنحاء الإمارات وقد يثمر خلال عام من زراعته. ساقه طرية مجوّفة، ويحمل كل أوراقه في تاج واحد في القمة، ما يجعله سهل التمييز من طرف الحديقة.',
      significance:
        'مشهد مألوف في الحدائق المنزلية الإماراتية وفي مزارع العين والإمارات الشمالية. وتحتوي عصارة أوراقه وثماره غير الناضجة على إنزيم الباباين الذي يُستخدم لتطرية اللحم.',
      health:
        'البابايا تُظهر مشكلاتها بوضوح، ولهذا فهي نبتة جيدة للفحص. التبرقش والتبقّع الأصفر المخضر مع تجعّد الأوراق الصغيرة أو ضيقها هو العلامة الكلاسيكية لفيروس تبقّع البابايا الحلقي. البقع البيضاء الدقيقية بياض دقيقي، والتنقيط الأصفر الناعم مع خيوط على الوجه السفلي يعني العنكبوت الأحمر. واصفرار ما بين العروق في الأوراق الأقدم يشير غالباً إلى نقص المغنيسيوم.',
    },
  },
];

export const SPECIES_BY_KEY = Object.fromEntries(SPECIES.map((s) => [s.key, s]));
export const CLASS_ORDER = SPECIES.map((s) => s.key);
