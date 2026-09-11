import type { CloudLandingPage } from "./cloudDb";

interface AiGenerateInput {
  productName: string;
  images: string[];
  price: number;
  subdomain: string;
}

// قاموس الكلمات الدلالية لإنتاج Slug إنجليزي نظيف وسريع
const SLUG_DICTIONARY: Record<string, string> = {
  عطر: "perfume",
  عطور: "perfumes",
  عود: "oud",
  بخور: "bakhoor",
  مسك: "musk",
  ساعة: "watch",
  ساعات: "watches",
  سماعة: "earbuds",
  سماعات: "headphones",
  هاتف: "phone",
  جوال: "mobile",
  حذاء: "shoes",
  حقيبة: "bag",
  شنطة: "bag",
  نظارة: "glasses",
  قميص: "shirt",
  فستان: "dress",
  سترة: "jacket",
  كريم: "cream",
  سيروم: "serum",
  زيت: "oil",
  شامبو: "shampoo",
  شاحن: "charger",
  باور: "powerbank",
  قلاية: "airfryer",
  خلاط: "blender",
  مكنسة: "vacuum",
  ماكينة: "clipper",
  جهاز: "device",
  ليزر: "laser",
  مساج: "massage",
  منظم: "organizer",
  مصباح: "lamp",
  مكواة: "steamer",
  كفر: "case",
  محفظة: "wallet"
};

/**
 * توليد وصياغة عنوان تسويقي جذاب واحترافي جديد من العنوان المكتوب
 */
export function generateCatchyMarketingTitle(rawTitle: string): string {
  if (!rawTitle || !rawTitle.trim()) return "منتج أصلي مميز - الإصدار الملكي المطور";

  const clean = rawTitle.trim();
  const lower = clean.toLowerCase();

  // فئة العطور والبخور
  if (/عطر|عود|مسك|بخور|دهن|عطور/.test(lower)) {
    if (!/ملكي|فاخر|فرنسي|أصلي|ثبات/.test(lower)) {
      return `${clean} الملكي الفاخر - ثبات ملكي فواح 48 ساعة مع تركيبة أصلية`;
    }
    return `${clean} - الإصدار الملكي الخاص بثبات وفوحان استثنائي`;
  }

  // فئة الساعات
  if (/ساعة|ساعات|سمارت|الترا|smart|watch/.test(lower)) {
    if (!/مقاوم|أصلي|تيتانيوم|amoled|شاشة/.test(lower)) {
      return `${clean} التيتانيوم الذكية - مقاومة للماء والكسر مع شاشة AMOLED وبطارية خارقة`;
    }
    return `${clean} - الإصدار المطور مع ضمان فحص كامل`;
  }

  // فئة السماعات
  if (/سماعة|سماعات|ايربودز|بلوتوث|earbuds|headphone/.test(lower)) {
    if (!/عزل|محيطي|ألعاب|برو/.test(lower)) {
      return `${clean} اللاسلكية الاحترافية - عزل ضوضاء فائق وصوت محيطي نقي 3D`;
    }
    return `${clean} - جودة صوت سينمائية مع شحن سريع`;
  }

  // فئة العناية والبشرة والشعر
  if (/كريم|سيروم|بشرة|شعر|زيت|تفتيح|صابون|ماسك|تجميل/.test(lower)) {
    if (!/طبيعي|مركز|نتائج|أصلي/.test(lower)) {
      return `${clean} المركز الأصلي - تركيبة طبيعية 100% مع نتائج ملحوظة من أول أسبوع`;
    }
    return `${clean} - العناية الفائقة المضمونة والمختبرة`;
  }

  // فئة الأجهزة المنزلية والمطبخ
  if (/قلاية|خلاط|مكنسة|مكواة|فرامة|قطاعة|طباخ|شواية|جهاز/.test(lower)) {
    if (!/ديجيتال|ذكي|قوي|سريع/.test(lower)) {
      return `${clean} الذكي متعدد الوظائف - أداء فائق وموفر للوقت مع ضمان جودة`;
    }
    return `${clean} - الإصدار الأحدث بأعلى معايير المتانة والراحة`;
  }

  // فئة الملابس والأحذية والأزياء
  if (/حذاء|قميص|فستان|سترة|بنطلون|شنطة|حقيبة|شوز/.test(lower)) {
    if (!/أصلي|طبي|مريح|أنيق/.test(lower)) {
      return `${clean} العصري الأنيق - خامات ممتازة وتصميم فخم مريح للاستخدام اليومي`;
    }
    return `${clean} - أناقة متكاملة وخامات نخب أول`;
  }

  // فئة عامة
  if (clean.length < 35 && !/أصلي|مطور|فاخر|مميز/.test(clean)) {
    return `${clean} - الإصدار الأصلي المطور بأعلى مواصفات الجودة وضمان كامل`;
  }

  return clean;
}

/**
 * توليد Slug إنجليزي ذكي ونظيف من اسم المنتج العربي
 */
export function generateAiSlug(name: string): string {
  if (!name) return "prod-" + Math.floor(1000 + Math.random() * 9000);

  const clean = name.toLowerCase().trim();
  const words = clean.split(/\s+/);
  const matchedTokens: string[] = [];

  for (const w of words) {
    for (const [ar, en] of Object.entries(SLUG_DICTIONARY)) {
      if (w.includes(ar) && !matchedTokens.includes(en)) {
        matchedTokens.push(en);
        break;
      }
    }
  }

  // إذا كانت هناك كلمات إنجليزية في الاسم نلتقطها
  const englishMatches = clean.match(/[a-z0-9]+/g);
  if (englishMatches && englishMatches.length > 0) {
    matchedTokens.push(...englishMatches.slice(0, 2));
  }

  let baseSlug = matchedTokens.slice(0, 3).join("-");
  if (!baseSlug) {
    baseSlug = "offer";
  }

  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `${baseSlug}-${randomSuffix}`;
}

/**
 * احتساب السعر قبل الخصم بذكاء تسويقي (Compare-at price)
 * إضافة هامش 25% إلى 35% وتقريبه لأقرب 1,000 أو 500 دينار عراقي
 */
export function calculateAiCompareAtPrice(sellingPrice: number): number {
  if (!sellingPrice || sellingPrice <= 0) return 0;
  // هامش ترويجي 30%
  const markedUp = sellingPrice * 1.30;
  // التقريب لأقرب 1,000 دينار
  return Math.max(sellingPrice + 5000, Math.ceil(markedUp / 1000) * 1000);
}

/**
 * توليد نصوص تسويقية عالية التحويل (High-Converting Copywriting)
 * مبنية على تحليل الكلمات المفتاحية وسيكولوجية المتسوق العراقي
 */
export function generateAiMarketingCopy(productName: string, price: number): {
  headline: string;
  description: string;
  features: string[];
} {
  const pName = productName.trim();
  const lower = pName.toLowerCase();

  // 1. فئة العطور والبخور
  if (/عطر|عود|مسك|بخور|دهن|عطور|فرنسا|ملكي/.test(lower)) {
    return {
      headline: "✨ ثبات فواح يدوم لأكثر من 48 ساعة مع تركيبة زيتية أصلية فاخرة",
      description: `استمتع بتجربة عطرية ملكية لا تُنسى مع ${pName}. تركيبة عطرية أصلية تمنحك حضوراً ساحراً وثباتاً عالياً طوال اليوم. يأتي في زجاجة فاخرة مناسبة للاقتناء أو كأجمل هدية لمن تحب.\n\n🚚 العرض لفترة محدودة: احصل على خصم إضافي عند طلب قطعتين، أو اطلب 3 قطع واستفد من الشحن المجاني بالكامل لجميع محافظات العراق مع حق المعاينة والفحص قبل الدفع.`,
      features: [
        "ثبات وفوحان استثنائي يدوم لأكثر من 48 ساعة على الملابس",
        "زيوت عطرية أصلية ونقية وآمنة 100% على البشرة",
        "تغليف ملكي فاخر يحمي العطر ويزيد من فخامته",
        "الدفع عند الاستلام مع إمكانية فتح الصندوق وتجربة الرائحة قبل الدفع"
      ]
    };
  }

  // 2. فئة الإلكترونيات، الساعات، والسماعات
  if (/ساعة|سماعة|بلوتوث|شاحن|هاتف|كاميرا|باور|مايك|ايربودز|ألعاب|جيمنج|شاشة|برو|الترا/.test(lower)) {
    return {
      headline: "⚡ جيل جديد من الأداء القوي والمتانة العالية مع ضمان شامل",
      description: `ارتقِ بتجربتك اليومية مع ${pName}. أحدث التقنيات وأفضل الخامات لضمان عمر تشغيلي طويل واستجابة سريعة وتصميم عصري يلفت الأنظار.\n\n💎 ضمان استبدال فوري ودفع عند الاستلام مع إمكانية الفحص الكامل للشحنة قبل تسليم المبلغ للمندوب.`,
      features: [
        "بطارية طويلة الأمد تدعم الاستخدام المكثف طوال اليوم",
        "تصميم عصري متين ومقاوم للصدمات والاستخدام اليومي",
        "أداء فائق وسرعة استجابة عالية مع أحدث شريحة ذكية",
        "ضمان فحص المنتج والتجربة قبل الدفع لجميع محافظات العراق"
      ]
    };
  }

  // 3. فئة العناية، البشرة، والشعر
  if (/كريم|سيروم|بشرة|شعر|زيت|تفتيح|صابون|ماسك|تجميل|تنعيم|ليزر|مكياج/.test(lower)) {
    return {
      headline: "🌿 عناية فائقة ونتائج ملحوظة من أول أسبوع مع تركيبة طبيعية آمنة",
      description: `امنحي نفسك العناية التي تستحقينها مع ${pName}. تركيبة غنية ومفحوصة صُممت خصيصاً لتمنحك نتائج سريعة ومثالية بدون أي آثار جانبية.\n\n✨ منتج أصلي 100% مستورد ومضمون، يمنحك الثقة الكاملة في كل استخدام.`,
      features: [
        "مستخلصات طبيعية 100% غنية بالعناصر المغذية الفعالة",
        "نتائج مرئية وملموسة تمنحك إشراقة ونضارة طبيعية",
        "آمن ومناسب لجميع أنواع البشرة والاستخدام اليومي",
        "دفع عند الاستلام وشحن سريع لباب البيت مع حق المعاينة"
      ]
    };
  }

  // 4. فئة المطبخ والأدوات المنزلية
  if (/قلاية|خلاط|مكنسة|مكواة|طباخ|قطاعة|فرامة|أدوات|منزل|مطبخ|شواية|منظم/.test(lower)) {
    return {
      headline: "🍳 الراحة والسرعة وجودة الصنع الفائقة لتسهيل حياتك اليومية",
      description: `وفّر وقتك وجهدك في المنزل مع ${pName}. تم تصميمه بأعلى معايير المتانة والعملية ليكون مساعدك الأساسي يومياً.\n\n📦 مصنوع من مواد صحية متينة وسهل التنظيف والاستخدام ليدوم معك لسنوات.`,
      features: [
        "محرك قوي وهيكل متين عالي الجودة يدوم طويلاً",
        "توفير كبير في الوقت والجهد مع أداء عالي الكفاءة",
        "سهل الفك والتنظيف ومصنوع من مواد آمنة صحياً",
        "توصيل سريع لباب منزلك والدفع فقط بعد فحص الجهاز"
      ]
    };
  }

  // 5. فئة الأزياء والملابس والأحذية
  if (/حذاء|قميص|فستان|سترة|بنطلون|شنطة|حقيبة|نظارة|محفظة|جاكيت|شوز/.test(lower)) {
    return {
      headline: "👔 أناقة عصرية وخامات ممتازة تمنحك الراحة والتميز في كل إطلالة",
      description: `تألق بأجمل إطلالة مع ${pName}. دقة في التفاصيل، خياطة متينة، ومقاسات مريحة تم اختيارها بعناية لتناسب أرقى الأذواق.\n\n✨ اطلب الآن واستفد من عروض الخصومات الخاصة على الكميات مع الشحن السريع.`,
      features: [
        "أقمشة وخامات نخب أول مقاومة للاستهلاك والغسيل المتكرر",
        "قصّة عصرية أنيقة توفر الراحة التامة طوال اليوم",
        "ألوان راقية وثابتة لا تتغير مع الاستخدام",
        "معاينة المقاس والخامة عند الاستلام مع إمكانية التبديل الفوري"
      ]
    };
  }

  // 6. الفئة العامة الفائقة الإقناع
  return {
    headline: "🌟 جودة أصلية استثنائية وأفضل قيمة مقابل السعر في السوق",
    description: `احصل على ${pName} الأصلي المصمم بعناية فائقة ليلبي كافة تطلعاتك بأعلى مستوى من الجودة والاعتمادية.\n\n🔥 عرض خاص لفترة محدودة: وفر 15% عند طلب قطعتين، أو احصل على خصم 25% مع شحن مجاني تماماً عند طلب 3 قطع.`,
    features: [
      "جودة أصلية ومضمونة 100% مختبرة بعناية",
      "أفضل قيمة في السوق مع خامات تدوم طويلاً",
      "الدفع عند الاستلام بعد المعاينة والفحص المباشر",
      "شحن سريع وموثوق لجميع محافظات العراق"
    ]
  };
}

/**
 * محرك الذكاء الاصطناعي الرئيسي: يولد كائن صفحة الهبوط بالكامل
 * بناءً على اسم المنتج + صوره + سعره!
 */
export function generateAiLandingPage(input: AiGenerateInput): CloudLandingPage {
  const { productName, images, price, subdomain } = input;

  // توليد عنوان تسويقي جديد ومقنع من العنوان المكتوب
  const marketingTitle = generateCatchyMarketingTitle(productName);
  const cleanSlug = generateAiSlug(marketingTitle || productName);
  const compareAtPrice = calculateAiCompareAtPrice(price);
  const marketing = generateAiMarketingCopy(marketingTitle || productName, price);

  // تنسيق الوصف الكامل
  const fullDescription = `${marketing.headline}\n\n${marketing.description}\n\nأبرز المميزات:\n• ${marketing.features.join("\n• ")}`;

  // تصفية الصور الصالحة
  const validImages = (images || []).map(i => (i || '').trim()).filter(Boolean);
  const finalImages = validImages.length > 0 
    ? validImages 
    : ['https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&auto=format&fit=crop&q=80'];

  return {
    subdomain: subdomain || "alzaeem",
    slug: cleanSlug,
    productName: marketingTitle,
    images: finalImages,
    price: Number(price) || 0,
    compareAtPrice,
    discountTwoItems: 15,
    discountThreeItems: 25,
    description: fullDescription,
    template: "easyorders-flash",
    isPublished: true,
    createdAt: new Date().toISOString().split("T")[0],
  };
}
