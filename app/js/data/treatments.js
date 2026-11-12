/**
 * Findings -> likely cause -> what to actually buy.
 *
 * Each health finding produced by health.js can map to one or more treatments.
 * A treatment carries `search`, the phrase used to look for it on Google Maps
 * around the user's location — that phrase is what turns "your leaf is short of
 * iron" into "here is a shop 4 km away that sells iron chelate, and its phone
 * number".
 *
 * `priority` orders the list when several findings fire at once: 1 is the most
 * urgent thing to do first.
 */

export const TREATMENTS = {
  chlorosis: {
    priority: 2,
    cause: {
      en: 'Yellowing between the veins is almost always iron or nitrogen that the roots cannot reach — often because irrigation water is salty or the soil is too alkaline, which locks the iron up even when it is present.',
      ar: 'الاصفرار بين العروق يعني غالباً حديداً أو نيتروجيناً لا تصل إليه الجذور، وعادةً بسبب ملوحة مياه الري أو ارتفاع قلوية التربة، ما يحبس الحديد حتى لو كان موجوداً.',
    },
    products: [
      {
        en: 'Chelated iron (EDDHA form)', ar: 'حديد مخلبي (نوع EDDHA)',
        note: {
          en: 'EDDHA stays available in the alkaline soils common across the UAE; cheaper EDTA iron does not.',
          ar: 'يبقى EDDHA متاحاً في التربة القلوية الشائعة في الإمارات، بخلاف حديد EDTA الأرخص.',
        },
        search: 'chelated iron fertilizer garden centre',
      },
      {
        en: 'Balanced NPK fertiliser', ar: 'سماد متوازن NPK',
        note: {
          en: 'Feeds the nitrogen side of the problem. Apply to damp soil, never to dry roots.',
          ar: 'يعالج جانب النيتروجين. يُضاف على تربة رطبة، لا على جذور جافة أبداً.',
        },
        search: 'NPK fertilizer plant nursery',
      },
      {
        en: 'Soil and water salinity test', ar: 'فحص ملوحة التربة والماء',
        note: {
          en: 'If salinity is the cause, feeding the tree more will not help. Test before you spend.',
          ar: 'إذا كانت الملوحة هي السبب فلن تفيد زيادة التسميد. افحص قبل أن تنفق.',
        },
        search: 'agricultural soil testing laboratory',
      },
    ],
  },

  necrosis: {
    priority: 1,
    cause: {
      en: 'Dead brown tissue means cells have already been killed — by a fungal leaf-spot or blight, by sun scorch, or by an advanced pest infestation. Unlike yellowing, this damage does not reverse; the aim is to stop it spreading.',
      ar: 'النسيج البني الميت يعني أن خلايا ماتت فعلاً، بفعل تبقّع أو لفحة فطرية، أو احتراق شمسي، أو إصابة حشرية متقدمة. وخلافاً للاصفرار، لا يمكن عكس هذا الضرر، والهدف هو إيقاف انتشاره.',
    },
    products: [
      {
        en: 'Copper-based fungicide', ar: 'مبيد فطري نحاسي',
        note: {
          en: 'The standard first response to fungal leaf-spot. Spray in the early morning, never in midday heat.',
          ar: 'الاستجابة الأولى المعتادة لتبقّع الأوراق الفطري. يُرش في الصباح الباكر، لا في حرّ الظهيرة أبداً.',
        },
        search: 'copper fungicide agricultural supplies',
      },
      {
        en: 'Pruning shears and wound sealant', ar: 'مقصّ تقليم ومعجون جروح',
        note: {
          en: 'Cut affected leaves well below the damage and bin them — do not compost them.',
          ar: 'اقطع الأوراق المصابة أسفل الضرر بمسافة كافية وتخلّص منها في النفايات، ولا تضعها في السماد.',
        },
        search: 'garden pruning tools shop',
      },
    ],
  },

  pest: {
    priority: 1,
    cause: {
      en: 'Pitting, tunnels, sticky residue or a mottled surface texture usually means something is feeding on the leaf — scale insects, spider mites, whitefly or a borer.',
      ar: 'التنقّر أو الأنفاق أو الإفرازات اللزجة أو تبقّع الملمس تعني عادةً أن كائناً يتغذى على الورقة: حشرات قشرية أو عناكب حمراء أو ذبابة بيضاء أو حفّار.',
    },
    products: [
      {
        en: 'Neem oil concentrate', ar: 'زيت النيم المركّز',
        note: {
          en: 'Safe around food crops and children, and effective against mites and soft-bodied insects.',
          ar: 'آمن قرب المحاصيل الغذائية والأطفال، وفعّال ضد العناكب والحشرات الرخوة.',
        },
        search: 'neem oil pesticide garden shop',
      },
      {
        en: 'Horticultural insecticidal soap', ar: 'صابون زراعي مبيد للحشرات',
        note: {
          en: 'Contact spray for scale and whitefly. Repeat after seven days to catch the next hatch.',
          ar: 'رذاذ ملامس للحشرات القشرية والذبابة البيضاء. يُكرر بعد سبعة أيام للقضاء على الجيل التالي.',
        },
        search: 'insecticidal soap plant nursery',
      },
      {
        en: 'Yellow sticky traps', ar: 'مصائد صفراء لاصقة',
        note: {
          en: 'Cheap way to confirm what you are dealing with before buying a chemical.',
          ar: 'وسيلة رخيصة لتأكيد نوع الآفة قبل شراء أي مبيد.',
        },
        search: 'yellow sticky traps garden supplies',
      },
    ],
  },

  pale: {
    priority: 3,
    cause: {
      en: 'Low overall greenness with no yellow patches usually points at underfeeding, too little light, or roots sitting in water that has nowhere to drain.',
      ar: 'انخفاض الخضرة العام دون بقع صفراء يشير عادةً إلى نقص التغذية، أو قلة الضوء، أو جذور غارقة في ماء لا يجد مصرفاً.',
    },
    products: [
      {
        en: 'Slow-release nitrogen feed', ar: 'سماد نيتروجيني بطيء التحرر',
        note: {
          en: 'Steadier than a liquid feed and far harder to overdose in summer heat.',
          ar: 'أثبت من السماد السائل وأصعب بكثير في الإفراط به خلال حرّ الصيف.',
        },
        search: 'slow release fertilizer garden centre',
      },
      {
        en: 'Compost or organic soil conditioner', ar: 'سماد عضوي أو محسّن تربة',
        note: {
          en: 'Improves how sandy UAE soil holds both water and nutrients.',
          ar: 'يحسّن قدرة التربة الرملية في الإمارات على حفظ الماء والمغذيات معاً.',
        },
        search: 'organic compost soil conditioner supplier',
      },
    ],
  },

  salinity: {
    priority: 2,
    cause: {
      en: 'Scorched leaf tips and margins with a healthy green centre is the signature of salt stress — the most common tree problem in the Emirates, caused by irrigation water carrying more salt than the tree can excrete.',
      ar: 'احتراق أطراف الورقة وحوافها مع بقاء الوسط أخضر هو بصمة الإجهاد الملحي، وهو أكثر مشكلات الأشجار شيوعاً في الإمارات، وسببه مياه ريّ تحمل ملحاً أكثر مما تستطيع الشجرة طرحه.',
    },
    products: [
      {
        en: 'Gypsum (calcium sulphate) soil treatment', ar: 'جبس زراعي (كبريتات الكالسيوم)',
        note: {
          en: 'Helps displace sodium from the soil so a deep flush can wash it below the roots.',
          ar: 'يساعد على إزاحة الصوديوم من التربة ليتمكن الغسيل العميق من دفعه أسفل الجذور.',
        },
        search: 'agricultural gypsum soil treatment supplier',
      },
      {
        en: 'Water quality (TDS/EC) meter', ar: 'جهاز قياس جودة الماء TDS/EC',
        note: {
          en: 'Tells you in seconds whether the irrigation water itself is the problem.',
          ar: 'يخبرك خلال ثوانٍ إن كانت مياه الري نفسها هي المشكلة.',
        },
        search: 'TDS EC water quality meter shop',
      },
    ],
  },
};

/**
 * Species-specific warnings that outrank any generic advice.
 *
 * Red palm weevil is a notifiable pest in the UAE: a suspected case is reported
 * to the authorities, not treated quietly in a back garden, because one missed
 * infestation can take out a whole plantation.
 */
export const SPECIES_ALERTS = {
  mesquite: {
    // Fires on any identification, healthy or not: with an invasive species the
    // finding *is* the problem, and treating the individual tree is beside the
    // point. This is the one case where the app's advice is "tell someone".
    when: null,
    level: 'warn',
    title: { en: 'This is an invasive species', ar: 'هذا نوع غازٍ' },
    body: {
      en: 'Mesquite is not native to the UAE. It spreads aggressively, draws down groundwater and displaces the native Ghaf it closely resembles — which is why it is worth being sure which of the two you are looking at. Check the thorns: mesquite carries long, straight, paired spines where the Ghaf has short scattered ones. If this is growing in an area of native Ghaf, report it to the Ministry of Climate Change and Environment rather than treating it.',
      ar: 'المسكيت ليس محلياً في الإمارات. ينتشر بعدوانية، ويستنزف المياه الجوفية، ويزيح الغاف المحلي الذي يشبهه كثيراً، ولهذا يجدر التأكد أيّ الشجرتين أمامك. انظر إلى الأشواك: للمسكيت أشواك طويلة مستقيمة مزدوجة، بينما أشواك الغاف قصيرة متفرقة. وإذا كان ينمو في منطقة غاف محلي، فأبلغ وزارة التغير المناخي والبيئة بدل معالجته.',
    },
  },
  papaya: {
    // Mottling on a papaya is the one finding with a specific, spreading cause
    // worth naming: papaya ringspot virus, carried between plants by aphids.
    when: ['mottled', 'chlorosisSome', 'chlorosisHigh'],
    level: 'warn',
    title: { en: 'Check for papaya ringspot virus', ar: 'افحص وجود فيروس تبقّع البابايا الحلقي' },
    body: {
      en: 'On papaya, a yellow-green mosaic or mottling — especially with young leaves that are puckered, narrowed or curled — is the classic sign of papaya ringspot virus. It cannot be cured and aphids carry it to neighbouring papaya, so an infected plant is usually removed early. If the mottling is only on older leaves and the veins stay green, magnesium deficiency is the likelier cause.',
      ar: 'في البابايا، التبرقش أو الفسيفساء الصفراء المخضرة، خصوصاً مع تجعّد الأوراق الصغيرة أو ضيقها أو التفافها، هو العلامة الكلاسيكية لفيروس تبقّع البابايا الحلقي. لا علاج له، وينقله المنّ إلى نباتات البابايا المجاورة، ولذلك تُزال النبتة المصابة عادةً مبكراً. أما إذا اقتصر التبرقش على الأوراق الأقدم وبقيت العروق خضراء، فالأرجح أنه نقص المغنيسيوم.',
    },
  },
  nakhl: {
    when: ['necrosisHigh', 'necrosisSome', 'texture'],
    level: 'bad',
    title: { en: 'Check for red palm weevil', ar: 'افحص وجود سوسة النخيل الحمراء' },
    body: {
      en: 'On a date palm, dead tissue combined with surface damage is worth taking seriously: the red palm weevil kills palms from the inside and the leaves are often the first outward sign. Look for chewed fibre at the crown, a fermenting smell, or holes weeping brown fluid. Suspected infestations should be reported to the Ministry of Climate Change and Environment rather than treated privately.',
      ar: 'في النخيل، اجتماع النسيج الميت مع تلف السطح أمر يستحق الجدية: سوسة النخيل الحمراء تقتل النخلة من الداخل، والأوراق غالباً أول علامة ظاهرة. ابحث عن ألياف مقضومة عند القمة، أو رائحة تخمّر، أو ثقوب يسيل منها سائل بني. تُبلَّغ الإصابات المشتبه بها إلى وزارة التغير المناخي والبيئة بدل معالجتها بشكل فردي.',
    },
  },
};

/**
 * Maps a set of health findings onto an ordered list of treatment keys.
 * @param {Array<{key:string, level:string}>} findings
 * @returns {string[]} treatment keys, most urgent first
 */
export function treatmentsFor(findings) {
  const keys = new Set();

  for (const f of findings) {
    switch (f.key) {
      case 'necrosisHigh':
      case 'necrosisSome':
        keys.add('necrosis');
        keys.add('salinity'); // tip burn and fungal spotting look alike at a glance
        break;
      case 'chlorosisHigh':
      case 'chlorosisSome':
        keys.add('chlorosis');
        break;
      case 'texture':
        keys.add('pest');
        break;
      case 'mottled':
        keys.add('pest');
        keys.add('chlorosis');
        break;
      case 'pale':
        keys.add('pale');
        break;
      default:
        break;
    }
  }

  return [...keys].sort((a, b) => TREATMENTS[a].priority - TREATMENTS[b].priority);
}
