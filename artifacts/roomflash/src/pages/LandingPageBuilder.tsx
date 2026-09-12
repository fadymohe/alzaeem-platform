import { useState, useEffect, useRef, type FormEvent } from 'react';
import {
  Sparkles, Plus, Eye, Copy, Check, ExternalLink, Globe,
  Trash2, CheckCircle2, Image as ImageIcon, Upload, DollarSign,
  Percent, RefreshCw, AlertTriangle, Edit3, X, Wand2, Zap, Layers
} from 'lucide-react';
import { formatIQD } from '../data/iraqData';
import {
  saveCloudLandingPage, fetchCloudLandingPages, deleteCloudLandingPage,
  type CloudLandingPage
} from '../utils/cloudDb';
import {
  generateAiLandingPage,
  generateAiSlug,
  calculateAiCompareAtPrice,
  generateCatchyMarketingTitle
} from '../utils/aiLandingGenerator';

// قائمة قوالب صفحات الهبوط المتنوعة بتصاميم وأشكال مختلفة
export interface LandingTemplateOption {
  id: string;
  name: string;
  badge: string;
  niche: string;
  description: string;
  accentColor: string;
}

export const LANDING_PAGE_TEMPLATES: LandingTemplateOption[] = [
  {
    id: 'easyorders-flash',
    name: 'قالب فلاش كود السريع (EasyOrders Flash)',
    badge: 'معدل تحويل فائق ⚡',
    niche: 'شراء مباشر سريع',
    description: 'واجهة بيعية فائقة الفعالية مع باقات خصم 1/2/3 قطع، عداد تنازلي، وزر طلب مباشر للدفع عند الاستلام.',
    accentColor: '#0d9488',
  },
  {
    id: 'minimal-luxury',
    name: 'قالب المينيمال العصري الفاخر (Minimal Luxury)',
    badge: 'فاخر ومينيمال 💎',
    niche: 'منتجات راقية وحصرية',
    description: 'تصميم هادئ بخلفية ليلية ولمسات ذهبية أنيقة مع عرض صور واسع وتفاصيل مقتضبة عالية الجاذبية.',
    accentColor: '#d97706',
  },
  {
    id: 'store-classic',
    name: 'قالب بوتيجا كلاسيك (Botiga Classic)',
    badge: 'عطور ومجوهرات 👑',
    niche: 'عطور وساعات فاخرة',
    description: 'طابع كلاسيكي أندلسي ناصع البياض بلمسات عاجية وذهبية فاخرة، وتفاصيل دقيقة لضمان الأصالة.',
    accentColor: '#b45309',
  },
  {
    id: 'store-nova',
    name: 'قالب نوفا الملكي الحديث (Nova Royal)',
    badge: 'تريند وتأثيرات نيون 🚀',
    niche: 'تريندات عصرية وسلع حديثة',
    description: 'تصميم ملكي غامق بتدرجات كحلية وبنفسجية حيوية، شارات ديناميكية، وزر شراء نابض بالحياة.',
    accentColor: '#6366f1',
  },
  {
    id: 'store-aurit',
    name: 'قالب شوب ويل الموثوق (ShopWell Mega Trust)',
    badge: 'أعلى نسبة ثقة 🛡️',
    niche: 'شامل وموثوق لجميع السلع',
    description: 'واجهة متوازنة تعرض مؤشرات الأمان العالية، شحن المحافظات السريع، وتفاصيل فنية تفصيلية.',
    accentColor: '#2563eb',
  },
  {
    id: 'store-brick',
    name: 'قالب بريك التجاري المباشر (Brick Commerce)',
    badge: 'إلكترونيات وتقنية ⚙️',
    niche: 'أجهزة وتقنية وأدوات منزلية',
    description: 'تباين كحلي وبرتقالي قوي ومباشر، بطاقات مقارنة للمواصفات، وشريط حسم عالي الوضوح.',
    accentColor: '#ea580c',
  },
  {
    id: 'store-chic',
    name: 'قالب شيك بوتيك للجمال (Chic Boutique)',
    badge: 'جمال وموضة 🌸',
    niche: 'عناية وتجميل وأزياء نسائية',
    description: 'ألوان باستيل وزهرية ناعمة، بطاقات مستديرة أنيقة، وتنسيق يعكس الرقة والعناية الفائقة.',
    accentColor: '#ec4899',
  },
  {
    id: 'store-stride',
    name: 'قالب سترايد الرياضي الديناميكي (Stride Athletic)',
    badge: 'رياضة وسنيكرز 👟',
    niche: 'أحذية وملابس رياضية وكاجوال',
    description: 'واجهة داكنة عالية الحيوية بخطوط رياضية جريئة وزوايا حادة مخصصة للنشاط والحركة.',
    accentColor: '#10b981',
  },
];

export function LandingPageBuilderPage() {
  // Store Subdomain & Name
  const [subdomain, setSubdomain] = useState<string>('alzaeem');
  const [storeName, setStoreName] = useState<string>('متجر الزعيم');

  useEffect(() => {
    try {
      const rawStore = localStorage.getItem('zaeem_onboarded_store') || localStorage.getItem('zaeem_store_data');
      const rawUser = localStorage.getItem('zaeem_user');
      let storeObj: any = null;
      let userObj: any = null;
      if (rawStore) storeObj = JSON.parse(rawStore);
      if (rawUser) userObj = JSON.parse(rawUser);

      const sub = (storeObj?.subdomain || userObj?.subdomain || 'alzaeem')
        .replace('.za3em.shop', '')
        .replace(/^https?:\/\//, '')
        .trim();
      setSubdomain(sub);
      setStoreName(storeObj?.storeName || userObj?.storeName || 'متجر الزعيم');
    } catch {}
  }, []);

  // قائمة صفحات الهبوط المعروضة (تبدأ فارغة ولا تضيف صفحات افتراضية)
  const [pages, setPages] = useState<CloudLandingPage[]>([]);
  const [isLoadingPages, setIsLoadingPages] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // حالة فتح نافذة النموذج (إضافة أو تعديل)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdSuccessPage, setCreatedSuccessPage] = useState<CloudLandingPage | null>(null);

  // الحقول المطلوبة لصفحة الهبوط
  const [productName, setProductName] = useState('');
  const [slug, setSlug] = useState('');
  const [price, setPrice] = useState('45000');
  const [compareAtPrice, setCompareAtPrice] = useState('58000');
  const [discountTwoItems, setDiscountTwoItems] = useState('15');
  const [discountThreeItems, setDiscountThreeItems] = useState('25');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('easyorders-flash');

  // صور المنتج الثلاثة (الصورة 1 إجبارية)
  const [image1, setImage1] = useState('');
  const [image2, setImage2] = useState('');
  const [image3, setImage3] = useState('');
  const [imageErrors, setImageErrors] = useState<{ image1?: string }>({});

  // مراجع ملفات الرفع
  const fileRef1 = useRef<HTMLInputElement>(null);
  const fileRef2 = useRef<HTMLInputElement>(null);
  const fileRef3 = useRef<HTMLInputElement>(null);

  // حالة نافذة التوليد بالذكاء الاصطناعي (AI Generator)
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiProductName, setAiProductName] = useState('');
  const [aiImage1, setAiImage1] = useState('');
  const [aiImage2, setAiImage2] = useState('');
  const [aiImage3, setAiImage3] = useState('');
  const [aiImageErrors, setAiImageErrors] = useState<{ image1?: string }>({});
  const [aiPrice, setAiPrice] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiGenerationProgress, setAiGenerationProgress] = useState('');
  const [hasGeneratedTitle, setHasGeneratedTitle] = useState(false);
  const aiFileRef1 = useRef<HTMLInputElement>(null);
  const aiFileRef2 = useRef<HTMLInputElement>(null);
  const aiFileRef3 = useRef<HTMLInputElement>(null);

  // فتح نافذة التوليد بالذكاء الاصطناعي
  const handleOpenAiGenerator = () => {
    setAiProductName('');
    setAiImage1('');
    setAiImage2('');
    setAiImage3('');
    setAiImageErrors({});
    setAiPrice('');
    setAiGenerationProgress('');
    setHasGeneratedTitle(false);
    setIsAiModalOpen(true);
  };

  // صياغة عنوان تسويقي جديد ومقنع من العنوان المكتوب
  const handleGenerateTitleFromInput = () => {
    if (!aiProductName.trim()) {
      alert('يرجى كتابة اسم أو نوع المنتج أولاً.');
      return;
    }
    const newCatchyTitle = generateCatchyMarketingTitle(aiProductName);
    setAiProductName(newCatchyTitle);
    setHasGeneratedTitle(true);
  };

  // توليد وإطلاق صفحة الهبوط بالذكاء الاصطناعي
  const handleGenerateAiLandingPage = async (e: FormEvent) => {
    e.preventDefault();

    if (!aiProductName.trim()) {
      alert('يرجى كتابة اسم المنتج للبدء بالتوليد الذكي.');
      return;
    }
    if (!aiImage1.trim()) {
      setAiImageErrors({ image1: 'الصورة 1 الرئيسية إجبارية لإطلاق صفحة الهبوط' });
      alert('الصورة 1 الرئيسية إجبارية (*)، يرجى رفع صورة أو وضع رابط للصورة.');
      return;
    }
    const priceNum = Number(aiPrice);
    if (!priceNum || priceNum <= 0) {
      alert('يرجى إدخال سعر بيع صحيح للمنتج بالدينار العراقي.');
      return;
    }

    setIsAiGenerating(true);
    setAiGenerationProgress('جاري صياغة عنوان ترويجي جذاب وقراءة مواصفات المنتج...');

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setAiGenerationProgress('جاري صياغة نصوص بيعية مقنعة واحتساب عروض التوفير...');
      await new Promise((resolve) => setTimeout(resolve, 500));
      setAiGenerationProgress('جاري إنشاء الرابط النظيف وحفظ صفحة الهبوط سحابياً...');
      await new Promise((resolve) => setTimeout(resolve, 400));

      // تجميع الصور (الأولى إجبارية، 2 و 3 اختياريتان)
      const imagesList = [aiImage1.trim()];
      if (aiImage2.trim()) imagesList.push(aiImage2.trim());
      if (aiImage3.trim()) imagesList.push(aiImage3.trim());

      const pageData = generateAiLandingPage({
        productName: aiProductName.trim(),
        images: imagesList,
        price: priceNum,
        subdomain,
      });

      // حفظ ونشر فوري على قاعدة بيانات Neon السحابية
      await saveCloudLandingPage(pageData);

      // التحديث في القائمة والتخزين المحلي
      const updatedList = [pageData, ...pages.filter((p) => p.slug !== pageData.slug)];
      setPages(updatedList);
      try {
        localStorage.setItem('zaeem_local_landing_pages', JSON.stringify(updatedList));
      } catch {}

      // إغلاق النافذة وتصفير الحقول وإظهار نجاح النشر
      setIsAiModalOpen(false);
      setCreatedSuccessPage(pageData);
      setAiProductName('');
      setAiImage1('');
      setAiImage2('');
      setAiImage3('');
      setAiImageErrors({});
      setAiPrice('');
    } catch (err) {
      console.warn('Error generating AI landing page:', err);
      alert('حدث خطأ أثناء توليد الصفحة، يرجى المحاولة ثانية.');
    } finally {
      setIsAiGenerating(false);
      setAiGenerationProgress('');
    }
  };

  // إكمال الحقول تلقائياً بالذكاء الاصطناعي داخل النموذج اليدوي
  const handleAutoFillWithAi = () => {
    if (!productName.trim()) {
      alert('يرجى كتابة اسم المنتج أولاً لتوليد باقي البيانات تلقائياً.');
      return;
    }
    const currentPrice = Number(price) || 45000;
    const generatedSlug = generateAiSlug(productName);
    const generatedCompareAt = calculateAiCompareAtPrice(currentPrice);

    setSlug(generatedSlug);
    setCompareAtPrice(String(generatedCompareAt));
    setDiscountTwoItems('15');
    setDiscountThreeItems('25');
    alert('تم توليد الرابط والسعر المقترح وعروض الخصومات بالذكاء الاصطناعي بنجاح!');
  };

  // تحميل صفحات الهبوط من السيرفر السحابي ودمجها مع التخزين المحلي
  const loadPages = async () => {
    setIsLoadingPages(true);
    try {
      const serverPages = await fetchCloudLandingPages(subdomain);

      let localPages: CloudLandingPage[] = [];
      try {
        const raw = localStorage.getItem('zaeem_local_landing_pages');
        if (raw) localPages = JSON.parse(raw);
      } catch {}

      const map = new Map<string, CloudLandingPage>();

      // 1. دمج التخزين المحلي (مع استبعاد الصفحة الافتراضية landbidg1 أو عطر الفخامة)
      (localPages || []).forEach((p) => {
        if (p && p.slug !== 'landbidg1' && String(p.id) !== '1' && p.productName !== 'عطر تاج الفخامة الفرنسي الملكي') {
          map.set(p.slug, p);
        }
      });

      // 2. دمج قاعدة بيانات السيرفر (Neon DB) بأعلى أولوية
      (serverPages || []).forEach((p) => {
        if (p && p.slug !== 'landbidg1' && String(p.id) !== '1' && p.productName !== 'عطر تاج الفخامة الفرنسي الملكي') {
          map.set(p.slug, p);
        }
      });

      const merged = Array.from(map.values());
      setPages(merged);
      try {
        localStorage.setItem('zaeem_local_landing_pages', JSON.stringify(merged));
      } catch {}
    } catch (err) {
      console.warn('Error loading landing pages:', err);
    } finally {
      setIsLoadingPages(false);
    }
  };

  useEffect(() => {
    loadPages();
  }, [subdomain]);

  // رفع الصور محلياً وتحويلها إلى Data URL
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setImage: (val: string) => void,
    isMandatory = false
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('حجم الصورة كبير جداً، الحد الأقصى المسموح 5 ميجابايت.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
      if (isMandatory) {
        setImageErrors((prev) => ({ ...prev, image1: undefined }));
      }
    };
    reader.readAsDataURL(file);
  };

  // فتح نموذج إضافة صفحة هبوط جديدة
  const handleOpenCreateNew = () => {
    setEditingPageId(null);
    setProductName('');
    const nextNum = pages.length + 1;
    setSlug(`landbidg${nextNum}`);
    setPrice('45000');
    setCompareAtPrice('58000');
    setDiscountTwoItems('15');
    setDiscountThreeItems('25');
    setSelectedTemplate('easyorders-flash');
    setImage1('');
    setImage2('');
    setImage3('');
    setImageErrors({});
    setIsModalOpen(true);
  };

  // فتح نموذج تعديل صفحة هبوط موجودة
  const handleOpenEdit = (p: CloudLandingPage) => {
    setEditingPageId(p.slug || String(p.id));
    setProductName(p.productName || '');
    setSlug(p.slug || '');
    setPrice(String(p.price || ''));
    setCompareAtPrice(String(p.compareAtPrice || ''));
    setDiscountTwoItems(String(p.discountTwoItems ?? 15));
    setDiscountThreeItems(String(p.discountThreeItems ?? 25));
    setSelectedTemplate(p.template || 'easyorders-flash');

    const imgs = p.images || [];
    setImage1(imgs[0] || '');
    setImage2(imgs[1] || '');
    setImage3(imgs[2] || '');
    setImageErrors({});
    setIsModalOpen(true);
  };

  // إزالة صفحة هبوط موجودة
  const handleDeletePage = async (p: CloudLandingPage) => {
    const confirmDelete = window.confirm(
      `هل أنت متأكد من إزالة صفحة الهبوط للمنتج: "${p.productName}"؟\nسيتم حذف الصفحة ورابطها نهائياً.`
    );
    if (!confirmDelete) return;

    // 1. تحديث الحالة فوراً للسرعة والاستجابة
    const updated = pages.filter((item) => item.slug !== p.slug && String(item.id) !== String(p.id));
    setPages(updated);
    try {
      localStorage.setItem('zaeem_local_landing_pages', JSON.stringify(updated));
    } catch {}

    // 2. الحذف من قاعدة بيانات Neon PostgreSQL السحابية
    try {
      await deleteCloudLandingPage(p.slug, subdomain);
    } catch (err) {
      console.warn('Error deleting cloud landing page:', err);
    }
  };

  // حفظ وإطلاق صفحة الهبوط فورياً
  const handleSubmitPage = async (e: FormEvent) => {
    e.preventDefault();

    // 1. التحقق من اسم المنتج
    if (!productName.trim()) {
      alert('يرجى إدخال اسم المنتج.');
      return;
    }

    // 2. التحقق من الصورة الأولى الإجبارية
    if (!image1.trim()) {
      setImageErrors({ image1: 'الصورة الأولى للمنتج إجبارية لإطلاق صفحة الهبوط' });
      alert('الصورة الأولى للمنتج إجبارية (*)، يرجى رفع صورة أو وضع رابط للصورة.');
      return;
    }

    const priceNum = Number(price) || 0;
    const compareNum = Number(compareAtPrice) || priceNum;
    const disc2 = Number(discountTwoItems) || 15;
    const disc3 = Number(discountThreeItems) || 25;

    // تنظيف السلاج
    let cleanSlug = (slug || '').toLowerCase().trim().replace(/[^a-z0-9-]/g, '');
    if (!cleanSlug) cleanSlug = `page-${Date.now().toString(36)}`;

    // تجميع الصور (الأولى إجبارية، 2 و 3 اختياريتان)
    const imagesList = [image1.trim()];
    if (image2.trim()) imagesList.push(image2.trim());
    if (image3.trim()) imagesList.push(image3.trim());

    const pageData: CloudLandingPage = {
      subdomain: subdomain,
      slug: cleanSlug,
      productName: productName.trim(),
      images: imagesList,
      price: priceNum,
      compareAtPrice: compareNum,
      discountTwoItems: disc2,
      discountThreeItems: disc3,
      description: `منتج أصلي عالي الجودة مع شحن سريع لجميع المحافظات وضمان الدفع عند الاستلام بعد المعاينة.`,
      template: selectedTemplate || 'easyorders-flash',
      isPublished: true,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setIsSubmitting(true);

    try {
      // 1. إطلاق وحفظ الصفحة فورياً على قاعدة بيانات Neon السحابية المركزية
      await saveCloudLandingPage(pageData);

      // 2. التحديث في القائمة والتخزين المحلي
      const existingIdx = pages.findIndex((p) => p.slug === cleanSlug || (editingPageId && p.slug === editingPageId));
      let updatedList: CloudLandingPage[] = [];
      if (existingIdx >= 0) {
        updatedList = [...pages];
        updatedList[existingIdx] = pageData;
      } else {
        updatedList = [pageData, ...pages];
      }

      setPages(updatedList);
      try {
        localStorage.setItem('zaeem_local_landing_pages', JSON.stringify(updatedList));
      } catch {}

      // 3. إغلاق النموذج وإظهار بطاقة النجاح
      setIsModalOpen(false);
      setCreatedSuccessPage(pageData);
    } catch (err) {
      console.warn('Error saving landing page:', err);
      alert('حدث خطأ أثناء إطلاق الصفحة في السيرفر، يرجى المحاولة ثانية.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDirectLandingUrl = (pageSlug: string) => {
    return `https://${subdomain}.za3em.shop/${pageSlug}`;
  };

  const copyLandingUrl = (pageSlug: string, id: string) => {
    const url = getDirectLandingUrl(pageSlug);
    navigator.clipboard?.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // حساب باقات العروض حياً أثناء الإدخال
  const priceVal = Number(price) || 0;
  const d2Val = Number(discountTwoItems) || 0;
  const d3Val = Number(discountThreeItems) || 0;
  const totalTwoPieces = Math.round(priceVal * 2 * (1 - d2Val / 100));
  const totalThreePieces = Math.round(priceVal * 3 * (1 - d3Val / 100));

  return (
    <div className="space-y-6 rf-appear">
      {/* ========================================================================= */}
      {/* 🌟 1. شريط العنوان وأعلى الصفحة مع زر "إضافة صفحة هبوط جديدة"             */}
      {/* ========================================================================= */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-teal-700 dark:text-teal-400 mb-1">
            <Globe className="size-4" /> صفحات الهبوط والتسويق السريع (Landing Pages)
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <span>صفحات الهبوط</span>
            <span className="text-xs font-mono font-bold bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 px-3 py-1 rounded-full border border-teal-300/50 dir-ltr">
              {subdomain}.za3em.shop/*
            </span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            أنشئ وأدر صفحات الهبوط المباشرة لمنتجاتك مع عروض الخصومات على القطعتين والثلاث قطع ونموذج الشراء الفوري (COD).
          </p>
        </div>

        {/* زر أعلى الصفحة لإضافة صفحة هبوط جديدة */}
        <div className="flex items-center gap-2.5">
          {/* زر التوليد الذكي بالـ AI (لون وشكل متناسق مع هوية المنصة) */}
          <button
            type="button"
            onClick={handleOpenAiGenerator}
            className="px-5 py-3 bg-teal-800 hover:bg-teal-900 text-white text-xs font-black rounded-2xl shadow-lg shadow-teal-900/20 border border-teal-600/30 transition-all flex items-center gap-2.5 cursor-pointer hover:scale-105 active:scale-95"
          >
            <Sparkles className="size-4 text-amber-300 animate-pulse" />
            <span>توليد صفحة هبوط بالذكاء الاصطناعي</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-teal-950/80 text-teal-200 border border-teal-500/30 font-bold font-mono">AI</span>
          </button>

          <button
            type="button"
            onClick={handleOpenCreateNew}
            className="px-5 py-3 bg-teal-700 hover:bg-teal-800 text-white text-xs font-black rounded-2xl shadow-lg shadow-teal-700/20 transition-all flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
          >
            <Plus className="size-4 stroke-[3]" />
            <span>إضافة صفحة هبوط جديدة</span>
          </button>

          <button
            type="button"
            onClick={loadPages}
            disabled={isLoadingPages}
            className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-colors"
            title="تحديث من السيرفر"
          >
            <RefreshCw className={`size-4 ${isLoadingPages ? 'animate-spin text-teal-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* بطاقة نجاح الإطلاق والنشر الفوري */}
      {createdSuccessPage && (
        <div className="rounded-3xl border border-teal-200 dark:border-teal-900 bg-teal-50/70 dark:bg-teal-950/40 p-5 flex flex-col md:flex-row items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-2xl bg-teal-600 text-white grid place-items-center shrink-0">
              <Check className="size-6 stroke-[3]" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-teal-950 dark:text-teal-200">
                تم إطلاق صفحة الهبوط فورياً بنجاح على قاعدة البيانات! 🚀
              </h3>
              <p className="text-xs text-teal-800 dark:text-teal-300 mt-0.5">
                الرابط المباشر:{' '}
                <a
                  href={getDirectLandingUrl(createdSuccessPage.slug)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono font-bold underline dir-ltr"
                >
                  {getDirectLandingUrl(createdSuccessPage.slug)}
                </a>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(getDirectLandingUrl(createdSuccessPage.slug));
                alert('تم نسخ الرابط بنجاح!');
              }}
              className="flex-1 md:flex-none px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
            >
              <Copy className="size-3.5" />
              <span>نسخ الرابط</span>
            </button>
            <a
              href={getDirectLandingUrl(createdSuccessPage.slug)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 md:flex-none px-4 py-2 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1.5"
            >
              <ExternalLink className="size-3.5" />
              <span>معاينة الرابط المباشر</span>
            </a>
            <button
              type="button"
              onClick={() => setCreatedSuccessPage(null)}
              className="p-2 text-slate-400 hover:text-slate-600"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🌟 2. عرض صفحات الهبوط الموجودة حالياً بجوارها خياري تعديل وإزالة         */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
              صفحات الهبوط الموجودة حالياً
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-mono">
              {pages.length}
            </span>
          </div>
          <span className="text-xs text-slate-500">
            مربوطة بالدومين الفرعي وقاعدة البيانات
          </span>
        </div>

        {isLoadingPages ? (
          <div className="py-20 text-center space-y-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <RefreshCw className="size-8 animate-spin text-teal-700 mx-auto" />
            <p className="text-xs font-bold text-slate-500">جاري تحميل صفحات الهبوط من السيرفر...</p>
          </div>
        ) : pages.length === 0 ? (
          <div className="py-16 px-6 text-center space-y-4 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 shadow-sm max-w-2xl mx-auto">
            <div className="size-16 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 grid place-items-center mx-auto border border-teal-200 dark:border-teal-800">
              <Globe className="size-8" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                لا توجد صفحات هبوط مضافة بعد
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                لم تقم بإنشاء أي صفحة هبوط بعد. يمكنك إضافة صفحة هبوط مخصصة لمنتجك واختيار القالب المناسب، أو استخدام التوليد السريع بالذكاء الاصطناعي لإنشاء صفحة احترافية بثوانٍ.
              </p>
            </div>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleOpenCreateNew}
                className="px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-black flex items-center gap-2 shadow-lg shadow-teal-700/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Plus className="size-4 stroke-[3]" />
                <span>إضافة صفحة هبوط جديدة</span>
              </button>
              <button
                type="button"
                onClick={handleOpenAiGenerator}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 hover:from-teal-800 hover:to-emerald-700 text-white text-xs font-black flex items-center gap-2 shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Sparkles className="size-4 text-amber-300" />
                <span>توليد سريع بالذكاء الاصطناعي</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {pages.map((p) => {
              const directUrl = getDirectLandingUrl(p.slug);
              const primaryImg = p.images?.[0] || 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&auto=format&fit=crop&q=80';
              const pPrice = Number(p.price) || 0;
              const d2 = Number(p.discountTwoItems) || 15;
              const d3 = Number(p.discountThreeItems) || 25;
              const twoTotal = Math.round(pPrice * 2 * (1 - d2 / 100));
              const threeTotal = Math.round(pPrice * 3 * (1 - d3 / 100));
              const currentTmpl = LANDING_PAGE_TEMPLATES.find(t => t.id === p.template) || LANDING_PAGE_TEMPLATES[0];

              return (
                <div
                  key={p.id || p.slug}
                  className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div>
                    {/* Top Status & Badge */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 mb-1.5 border border-emerald-200/50">
                          <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          صفحة هبوط نشطة ومنشورة
                        </span>
                        <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                          {p.productName}
                        </h3>
                      </div>

                      <span className="text-[11px] font-mono text-slate-400">
                        {p.createdAt || '2026-09-05'}
                      </span>
                    </div>

                    {/* Product Preview Card with 3 Images thumbnails */}
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={primaryImg}
                          alt={p.productName}
                          className="size-16 rounded-xl object-cover border border-slate-200 dark:border-slate-700 bg-slate-200 shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-xs text-slate-900 dark:text-white truncate">
                            {p.productName}
                          </p>
                          <div className="flex items-center gap-2 mt-1 font-mono text-xs">
                            <span className="font-extrabold text-teal-700 dark:text-teal-400">
                              {formatIQD(pPrice)}
                            </span>
                            {p.compareAtPrice > pPrice && (
                              <span className="line-through text-slate-400 text-[11px]">
                                {formatIQD(p.compareAtPrice)}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-teal-700 dark:text-teal-400 font-extrabold mt-1 flex items-center gap-1">
                            <Layers className="size-3" />
                            <span>القالب: {currentTmpl.name}</span>
                          </span>
                        </div>
                      </div>

                      {/* صور المنتج الثلاثة */}
                      {p.images && p.images.length > 0 && (
                        <div className="flex items-center gap-2 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                          <span className="text-[10px] text-slate-400 font-bold ml-1">صور المنتج:</span>
                          {p.images.map((img, i) => (
                            <div
                              key={i}
                              className="size-9 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-white shrink-0"
                            >
                              <img src={img} alt={`صورة ${i + 1}`} className="size-full object-cover" />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Discounts Display */}
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-2xl bg-teal-50/70 dark:bg-teal-950/20 border border-teal-100 dark:border-teal-900/40">
                        <span className="text-[10px] text-slate-500 block">خصم القطعتين:</span>
                        <div className="flex items-baseline justify-between mt-0.5">
                          <span className="font-black text-teal-800 dark:text-teal-300 font-mono">
                            {d2}% خصم
                          </span>
                          <span className="font-mono text-[11px] text-slate-600 dark:text-slate-400">
                            {formatIQD(twoTotal)}
                          </span>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-2xl bg-teal-50/70 dark:bg-teal-950/20 border border-teal-100 dark:border-teal-900/40">
                        <span className="text-[10px] text-slate-500 block">خصم الـ 3 قطع:</span>
                        <div className="flex items-baseline justify-between mt-0.5">
                          <span className="font-black text-teal-800 dark:text-teal-300 font-mono">
                            {d3}% + شحن مجاني
                          </span>
                          <span className="font-mono text-[11px] text-slate-600 dark:text-slate-400">
                            {formatIQD(threeTotal)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* رابط الدومين الفرعي المباشر */}
                    <div className="mt-3 p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-mono text-slate-700 dark:text-slate-300 truncate dir-ltr text-center border border-slate-200/80 dark:border-slate-700">
                      {directUrl}
                    </div>
                  </div>

                  {/* خيارين رئيسيين بجوارها: تعديل وإزالة + نسخ ومعاينة */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 flex-wrap">
                    {/* خيارين رئيسيين: تعديل وإزالة */}
                    <div className="flex items-center gap-2">
                      {/* 1. خيار تعديل */}
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(p)}
                        className="px-3.5 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Edit3 className="size-3.5 text-teal-600" />
                        <span>تعديل</span>
                      </button>

                      {/* 2. خيار إزالة */}
                      <button
                        type="button"
                        onClick={() => handleDeletePage(p)}
                        className="px-3.5 h-9 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Trash2 className="size-3.5 text-rose-600" />
                        <span>إزالة</span>
                      </button>
                    </div>

                    {/* أزرار نسخ الرابط والمعاينة */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => copyLandingUrl(p.slug, String(p.id || p.slug))}
                        className="px-3 h-9 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-teal-50 dark:hover:bg-teal-950 text-xs font-bold text-teal-700 dark:text-teal-400 flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        {copiedId === String(p.id || p.slug) ? (
                          <Check className="size-3.5 text-teal-600" />
                        ) : (
                          <Copy className="size-3.5" />
                        )}
                        <span>{copiedId === String(p.id || p.slug) ? 'تم النسخ' : 'نسخ الرابط'}</span>
                      </button>

                      <a
                        href={directUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 h-9 w-9 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-teal-600 hover:bg-slate-50 dark:hover:bg-slate-800 grid place-items-center transition-colors cursor-pointer"
                        title="فتح صفحة الهبوط المباشرة"
                      >
                        <ExternalLink className="size-4" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 🌟 3. نموذج إنشاء / تعديل صفحة هبوط (Modal Dialog) بالمواصفات المطلوبة     */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm overflow-y-auto animate-fadeIn">
          <div className="max-w-2xl w-full bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6 max-h-[92vh] overflow-y-auto my-auto text-right">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="size-5 text-teal-700" />
                  {editingPageId ? 'تعديل صفحة الهبوط' : 'إنشاء صفحة هبوط جديدة'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  تطلق الصفحة فورياً على الدومين الفرعي وقاعدة البيانات السحابية
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="size-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 grid place-items-center transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitPage} className="space-y-5">
                {/* شريط الإكمال الذكي السريع بالـ AI */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-950/40 dark:to-indigo-950/40 border border-violet-200 dark:border-violet-800/60 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Wand2 className="size-4 text-violet-600 dark:text-violet-400" />
                    <span className="text-xs font-bold text-violet-950 dark:text-violet-200">
                      هل تريد ملء باقي البيانات تلقائياً؟
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAutoFillWithAi}
                    className="px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-black rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="size-3 text-amber-300" />
                    <span>توليد تلقائي بالـ AI</span>
                  </button>
                </div>

                {/* اختيار وتصميم قالب صفحة الهبوط */}
                <div className="space-y-2.5 p-4 rounded-2xl bg-teal-50/50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-800/40">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-extrabold text-slate-800 dark:text-slate-200">
                      قالب وتصميم صفحة الهبوط <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-900/80 text-teal-800 dark:text-teal-300">
                      {LANDING_PAGE_TEMPLATES.find(t => t.id === selectedTemplate)?.badge || 'قالب مميز'}
                    </span>
                  </div>
                  <div className="relative">
                    <select
                      value={selectedTemplate}
                      onChange={(e) => setSelectedTemplate(e.target.value)}
                      className="w-full h-11 pr-4 pl-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 appearance-none cursor-pointer shadow-sm"
                    >
                      {LANDING_PAGE_TEMPLATES.map((tmpl) => (
                        <option key={tmpl.id} value={tmpl.id}>
                          {tmpl.name} — [{tmpl.niche}]
                        </option>
                      ))}
                    </select>
                    <div className="absolute left-3 top-3.5 pointer-events-none text-slate-400">
                      <Layers className="size-4 text-teal-600" />
                    </div>
                  </div>

                  {/* بطاقة تفاصيل القالب المختار */}
                  {(() => {
                    const currentTmpl = LANDING_PAGE_TEMPLATES.find(t => t.id === selectedTemplate) || LANDING_PAGE_TEMPLATES[0];
                    return (
                      <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 space-y-1 shadow-sm">
                        <div className="flex items-center justify-between text-[11px] font-extrabold">
                          <span className="text-slate-900 dark:text-white flex items-center gap-1.5">
                            <span className="size-2 rounded-full" style={{ backgroundColor: currentTmpl.accentColor }} />
                            {currentTmpl.name}
                          </span>
                          <span className="text-teal-700 dark:text-teal-400 text-[10px] font-mono">
                            {currentTmpl.niche}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                          {currentTmpl.description}
                        </p>
                      </div>
                    );
                  })()}
                </div>

              {/* 1. اسم المنتج */}
              <div>
                <label className="block text-xs font-extrabold text-slate-800 dark:text-slate-200 mb-1.5">
                  اسم المنتج <span className="text-rose-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  value={productName}
                  onChange={(e) => {
                    setProductName(e.target.value);
                  }}
                  placeholder="مثال: ساعة لومينور الفاخرة أو حذاء سنيكرز الرياضي"
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                />
              </div>

              {/* 2. رفع 3 صور للمنتج (صورة منهم إجبارية) */}
              <div className="space-y-2">
                <label className="block text-xs font-extrabold text-slate-800 dark:text-slate-200">
                  رفع 3 صور للمنتج <span className="text-rose-500">(صورة منهم إجبارية *)</span>
                </label>
                <p className="text-[11px] text-slate-500">
                  الصورة 1 رئيسية وإجبارية، بينما الصورة 2 و 3 اختياريتان لعرض تفاصيل وزوايا المنتج.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  {/* الصورة 1: إجبارية */}
                  <div
                    className={`p-3 rounded-2xl border ${
                      imageErrors.image1
                        ? 'border-rose-500 bg-rose-50/30 dark:bg-rose-950/20'
                        : 'border-teal-500/50 bg-teal-50/20 dark:bg-teal-950/10'
                    } space-y-2 text-center`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className="text-teal-800 dark:text-teal-300">الصورة 1 (إجبارية *)</span>
                      <span className="text-[10px] bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 px-1.5 py-0.5 rounded">
                        الرئيسية
                      </span>
                    </div>

                    {image1 ? (
                      <div className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white">
                        <img src={image1} alt="صورة 1" className="size-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setImage1('')}
                          className="absolute top-1.5 right-1.5 p-1 bg-rose-600 text-white rounded-lg shadow-sm"
                          title="إزالة"
                        >
                          <X className="size-3" />
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => fileRef1.current?.click()}
                        className="aspect-square rounded-xl border-2 border-dashed border-teal-300 dark:border-teal-800 hover:border-teal-500 flex flex-col items-center justify-center p-2 text-center cursor-pointer transition-colors bg-white dark:bg-slate-800"
                      >
                        <Upload className="size-5 text-teal-600 mb-1" />
                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                          اضغط لرفع الصورة 1
                        </span>
                        <span className="text-[9px] text-slate-400 mt-0.5">ملف صورة محلي</span>
                      </div>
                    )}

                    <input
                      type="file"
                      ref={fileRef1}
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, setImage1, true)}
                      className="hidden"
                    />

                    <input
                      type="url"
                      value={image1}
                      onChange={(e) => {
                        setImage1(e.target.value);
                        if (e.target.value) setImageErrors({});
                      }}
                      placeholder="أو ضع رابط مباشر..."
                      className="w-full h-8 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[10px] outline-none"
                    />

                    {imageErrors.image1 && (
                      <span className="text-[10px] font-bold text-rose-600 block">
                        {imageErrors.image1}
                      </span>
                    )}
                  </div>

                  {/* الصورة 2: اختيارية */}
                  <div className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2 text-center">
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className="text-slate-700 dark:text-slate-300">الصورة 2 (اختيارية)</span>
                      <span className="text-[10px] text-slate-400">إضافية</span>
                    </div>

                    {image2 ? (
                      <div className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white">
                        <img src={image2} alt="صورة 2" className="size-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setImage2('')}
                          className="absolute top-1.5 right-1.5 p-1 bg-rose-600 text-white rounded-lg shadow-sm"
                          title="إزالة"
                        >
                          <X className="size-3" />
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => fileRef2.current?.click()}
                        className="aspect-square rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-slate-400 flex flex-col items-center justify-center p-2 text-center cursor-pointer transition-colors bg-white dark:bg-slate-800"
                      >
                        <Upload className="size-5 text-slate-400 mb-1" />
                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                          اضغط لرفع الصورة 2
                        </span>
                        <span className="text-[9px] text-slate-400 mt-0.5">اختياري</span>
                      </div>
                    )}

                    <input
                      type="file"
                      ref={fileRef2}
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, setImage2, false)}
                      className="hidden"
                    />

                    <input
                      type="url"
                      value={image2}
                      onChange={(e) => setImage2(e.target.value)}
                      placeholder="أو ضع رابط مباشر..."
                      className="w-full h-8 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[10px] outline-none"
                    />
                  </div>

                  {/* الصورة 3: اختيارية */}
                  <div className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2 text-center">
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className="text-slate-700 dark:text-slate-300">الصورة 3 (اختيارية)</span>
                      <span className="text-[10px] text-slate-400">إضافية</span>
                    </div>

                    {image3 ? (
                      <div className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white">
                        <img src={image3} alt="صورة 3" className="size-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setImage3('')}
                          className="absolute top-1.5 right-1.5 p-1 bg-rose-600 text-white rounded-lg shadow-sm"
                          title="إزالة"
                        >
                          <X className="size-3" />
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => fileRef3.current?.click()}
                        className="aspect-square rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-slate-400 flex flex-col items-center justify-center p-2 text-center cursor-pointer transition-colors bg-white dark:bg-slate-800"
                      >
                        <Upload className="size-5 text-slate-400 mb-1" />
                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                          اضغط لرفع الصورة 3
                        </span>
                        <span className="text-[9px] text-slate-400 mt-0.5">اختياري</span>
                      </div>
                    )}

                    <input
                      type="file"
                      ref={fileRef3}
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, setImage3, false)}
                      className="hidden"
                    />

                    <input
                      type="url"
                      value={image3}
                      onChange={(e) => setImage3(e.target.value)}
                      placeholder="أو ضع رابط مباشر..."
                      className="w-full h-8 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[10px] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* 3 & 4. سعر المنتج وسعره بعد الخصم */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-extrabold text-slate-800 dark:text-slate-200 mb-1.5">
                    سعر المنتج (قبل الخصم) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      required
                      type="number"
                      value={compareAtPrice}
                      onChange={(e) => setCompareAtPrice(e.target.value)}
                      placeholder="58000"
                      className="w-full h-11 pr-4 pl-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-mono outline-none focus:border-teal-600"
                    />
                    <span className="absolute left-3 top-3 text-xs text-slate-400 font-bold">د.ع</span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">يظهر مشطوباً لإبراز التوفير</span>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-800 dark:text-slate-200 mb-1.5">
                    سعره بعد الخصم (قطعة واحدة) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      required
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="45000"
                      className="w-full h-11 pr-4 pl-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-mono font-bold text-teal-800 dark:text-teal-400 outline-none focus:border-teal-600"
                    />
                    <span className="absolute left-3 top-3 text-xs text-slate-400 font-bold">د.ع</span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">سعر شراء القطعة الواحدة الفعلي</span>
                </div>
              </div>

              {/* 5 & 6. نسبة الخصم على القطعتين ونسبة الخصم على الثلاثة */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 space-y-2">
                  <label className="block text-xs font-extrabold text-slate-800 dark:text-slate-200">
                    نسبة الخصم على القطعتين (%) <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex items-center bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 px-3">
                    <input
                      required
                      type="number"
                      min="0"
                      max="90"
                      value={discountTwoItems}
                      onChange={(e) => setDiscountTwoItems(e.target.value)}
                      placeholder="15"
                      className="flex-1 h-10 bg-transparent text-sm font-mono font-bold outline-none"
                    />
                    <Percent className="size-4 text-slate-400" />
                  </div>
                  <div className="text-[11px] text-teal-800 dark:text-teal-300 font-bold font-mono pt-1 flex items-center justify-between">
                    <span>إجمالي القطعتين:</span>
                    <span>{formatIQD(totalTwoPieces)}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 space-y-2">
                  <label className="block text-xs font-extrabold text-slate-800 dark:text-slate-200">
                    نسبة الخصم على الثلاثة (%) <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex items-center bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 px-3">
                    <input
                      required
                      type="number"
                      min="0"
                      max="90"
                      value={discountThreeItems}
                      onChange={(e) => setDiscountThreeItems(e.target.value)}
                      placeholder="25"
                      className="flex-1 h-10 bg-transparent text-sm font-mono font-bold outline-none"
                    />
                    <Percent className="size-4 text-slate-400" />
                  </div>
                  <div className="text-[11px] text-teal-800 dark:text-teal-300 font-bold font-mono pt-1 flex items-center justify-between">
                    <span>إجمالي 3 قطع (شحن مجاني):</span>
                    <span>{formatIQD(totalThreePieces)}</span>
                  </div>
                </div>
              </div>

              {/* 7. امتداد الرابط على الدومين الفرعي */}
              <div className="pt-2">
                <label className="block text-xs font-extrabold text-slate-800 dark:text-slate-200 mb-1.5">
                  امتداد الصفحة من الدومين الفرعي (URL Extension)
                </label>
                <div className="flex items-center bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden px-3">
                  <span className="text-xs font-mono text-slate-500 dir-ltr select-none ml-1">
                    https://{subdomain}.za3em.shop/
                  </span>
                  <input
                    required
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    placeholder="offer-special"
                    dir="ltr"
                    className="flex-1 h-11 bg-transparent text-sm font-mono font-bold text-teal-700 dark:text-teal-400 outline-none text-right"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  الرابط الناتج: https://{subdomain}.za3em.shop/{slug || 'offer-special'}
                </p>
              </div>

              {/* أزرار الإجراءات: زر "إضافة" الصريح والبارز */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 h-11 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                >
                  إلغاء
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 h-11 bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white text-xs font-black rounded-xl shadow-lg shadow-teal-700/20 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  {isSubmitting ? (
                    <RefreshCw className="size-4 animate-spin" />
                  ) : (
                    <Plus className="size-4 stroke-[3]" />
                  )}
                  <span>{editingPageId ? 'حفظ التعديلات' : 'إضافة'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🌟 4. نافذة التوليد السريع بالذكاء الاصطناعي (بتصميم متناسق وهوية تيلي) */}
      {/* ========================================================================= */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-md overflow-y-auto animate-fadeIn">
          <div className="max-w-2xl w-full bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-2xl border border-teal-200 dark:border-teal-900/50 space-y-6 max-h-[92vh] overflow-y-auto my-auto text-right relative">
            {/* الشريط العلوي المتناسق */}
            <div className="absolute top-0 right-0 left-0 h-2 bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 rounded-t-3xl" />

            {/* رأس النافذة */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 pt-1">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 flex items-center gap-1 border border-teal-200 dark:border-teal-800">
                    <Sparkles className="size-3 text-amber-500" /> AI Landing Generator
                  </span>
                  <span className="text-[11px] font-bold text-teal-800 dark:text-teal-400">توليد فوري ذكي ⚡</span>
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                  توليد صفحة هبوط بالذكاء الاصطناعي
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  أدخل اسم المنتج، صوره، وسعره، وسيقوم الـ AI بصياغة عنوان إعلاني، كتابة المحتوى، وبناء الصفحة فوراً!
                </p>
              </div>

              <button
                type="button"
                disabled={isAiGenerating}
                onClick={() => setIsAiModalOpen(false)}
                className="size-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white grid place-items-center transition-colors cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleGenerateAiLandingPage} className="space-y-5">
              {/* 1. اسم المنتج مع زر توليد عنوان تسويقي جديد */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <span>1. اسم المنتج</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  {aiProductName.trim() && (
                    <button
                      type="button"
                      onClick={handleGenerateTitleFromInput}
                      className="text-[11px] font-bold text-teal-800 dark:text-teal-300 hover:text-teal-900 dark:hover:text-teal-200 flex items-center gap-1.5 bg-teal-50 dark:bg-teal-950/60 px-2.5 py-1 rounded-lg border border-teal-200 dark:border-teal-800 transition-all cursor-pointer hover:bg-teal-100 dark:hover:bg-teal-900/60 active:scale-95"
                      title="صياغة عنوان تسويقي جذاب ومقنع من هذا العنوان"
                    >
                      <Sparkles className="size-3 text-amber-500 animate-pulse" />
                      <span>صياغة عنوان ترويجي جديد بالـ AI ✨</span>
                    </button>
                  )}
                </div>

                <input
                  required
                  type="text"
                  value={aiProductName}
                  onChange={(e) => {
                    setAiProductName(e.target.value);
                    setHasGeneratedTitle(false);
                  }}
                  placeholder="مثال: ساعة الترا الذكية أو عطر تاج الفخامة الفرنسي"
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20"
                />

                <div className="flex items-center justify-between mt-1 text-[10px]">
                  <span className="text-slate-400">
                    💡 سيقوم الـ AI تلقائياً بتحليل الاسم وصياغة عنوان جذاب وعرض بيعي مقنع.
                  </span>
                  {hasGeneratedTitle && (
                    <span className="text-teal-800 dark:text-teal-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="size-3 text-teal-800" /> تم صياغة عنوان ترويجي جديد!
                    </span>
                  )}
                </div>
              </div>

              {/* 2. صور المنتج (3 صور مطابقة تماماً للصفحة اليدوية) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <span>2. صور المنتج</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[11px] text-slate-400">
                    الصورة 1 رئيسية وإجبارية، بينما 2 و 3 اختياريتان
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  {/* الصورة 1: إجبارية */}
                  <div
                    className={`p-3 rounded-2xl border ${
                      aiImageErrors.image1
                        ? 'border-rose-500 bg-rose-50/30 dark:bg-rose-950/20'
                        : 'border-teal-500/50 bg-teal-50/20 dark:bg-teal-950/10'
                    } space-y-2 text-center`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className="text-teal-800 dark:text-teal-300">الصورة 1 (إجبارية *)</span>
                      <span className="text-[10px] bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 px-1.5 py-0.5 rounded">
                        الرئيسية
                      </span>
                    </div>

                    {aiImage1 ? (
                      <div className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white">
                        <img src={aiImage1} alt="صورة 1" className="size-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setAiImage1('')}
                          className="absolute top-1.5 right-1.5 p-1 bg-rose-600 text-white rounded-lg shadow-sm cursor-pointer"
                          title="إزالة"
                        >
                          <X className="size-3" />
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => aiFileRef1.current?.click()}
                        className="aspect-square rounded-xl border-2 border-dashed border-teal-300 dark:border-teal-800 hover:border-teal-500 flex flex-col items-center justify-center p-2 text-center cursor-pointer transition-colors bg-white dark:bg-slate-800"
                      >
                        <Upload className="size-5 text-teal-600 mb-1" />
                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                          اضغط لرفع الصورة 1
                        </span>
                        <span className="text-[9px] text-slate-400 mt-0.5">ملف صورة محلي</span>
                      </div>
                    )}

                    <input
                      type="file"
                      ref={aiFileRef1}
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, setAiImage1, true)}
                      className="hidden"
                    />

                    <input
                      type="url"
                      value={aiImage1.startsWith('data:') ? '' : aiImage1}
                      onChange={(e) => {
                        setAiImage1(e.target.value);
                        if (e.target.value) setAiImageErrors({});
                      }}
                      placeholder="أو ضع رابط مباشر..."
                      className="w-full h-8 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[10px] outline-none"
                    />

                    {aiImageErrors.image1 && (
                      <span className="text-[10px] font-bold text-rose-600 block">
                        {aiImageErrors.image1}
                      </span>
                    )}
                  </div>

                  {/* الصورة 2: اختيارية */}
                  <div className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2 text-center">
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className="text-slate-700 dark:text-slate-300">الصورة 2 (اختيارية)</span>
                      <span className="text-[10px] text-slate-400">إضافية</span>
                    </div>

                    {aiImage2 ? (
                      <div className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white">
                        <img src={aiImage2} alt="صورة 2" className="size-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setAiImage2('')}
                          className="absolute top-1.5 right-1.5 p-1 bg-rose-600 text-white rounded-lg shadow-sm cursor-pointer"
                          title="إزالة"
                        >
                          <X className="size-3" />
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => aiFileRef2.current?.click()}
                        className="aspect-square rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-slate-400 flex flex-col items-center justify-center p-2 text-center cursor-pointer transition-colors bg-white dark:bg-slate-800"
                      >
                        <Upload className="size-5 text-slate-400 mb-1" />
                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                          اضغط لرفع الصورة 2
                        </span>
                        <span className="text-[9px] text-slate-400 mt-0.5">اختياري</span>
                      </div>
                    )}

                    <input
                      type="file"
                      ref={aiFileRef2}
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, setAiImage2, false)}
                      className="hidden"
                    />

                    <input
                      type="url"
                      value={aiImage2.startsWith('data:') ? '' : aiImage2}
                      onChange={(e) => setAiImage2(e.target.value)}
                      placeholder="أو ضع رابط مباشر..."
                      className="w-full h-8 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[10px] outline-none"
                    />
                  </div>

                  {/* الصورة 3: اختيارية */}
                  <div className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2 text-center">
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className="text-slate-700 dark:text-slate-300">الصورة 3 (اختيارية)</span>
                      <span className="text-[10px] text-slate-400">إضافية</span>
                    </div>

                    {aiImage3 ? (
                      <div className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white">
                        <img src={aiImage3} alt="صورة 3" className="size-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setAiImage3('')}
                          className="absolute top-1.5 right-1.5 p-1 bg-rose-600 text-white rounded-lg shadow-sm cursor-pointer"
                          title="إزالة"
                        >
                          <X className="size-3" />
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => aiFileRef3.current?.click()}
                        className="aspect-square rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-slate-400 flex flex-col items-center justify-center p-2 text-center cursor-pointer transition-colors bg-white dark:bg-slate-800"
                      >
                        <Upload className="size-5 text-slate-400 mb-1" />
                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                          اضغط لرفع الصورة 3
                        </span>
                        <span className="text-[9px] text-slate-400 mt-0.5">اختياري</span>
                      </div>
                    )}

                    <input
                      type="file"
                      ref={aiFileRef3}
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, setAiImage3, false)}
                      className="hidden"
                    />

                    <input
                      type="url"
                      value={aiImage3.startsWith('data:') ? '' : aiImage3}
                      onChange={(e) => setAiImage3(e.target.value)}
                      placeholder="أو ضع رابط مباشر..."
                      className="w-full h-8 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[10px] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* 3. سعر البيع */}
              <div>
                <label className="block text-xs font-extrabold text-slate-800 dark:text-slate-200 mb-1.5">
                  3. سعر بيع المنتج (د.ع) <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden px-3">
                  <input
                    required
                    type="number"
                    value={aiPrice}
                    onChange={(e) => setAiPrice(e.target.value)}
                    placeholder="مثال: 35000"
                    dir="ltr"
                    className="flex-1 h-12 bg-transparent text-base font-black font-mono text-slate-900 dark:text-white outline-none text-right"
                  />
                  <span className="text-xs font-bold text-slate-500 mr-2">د.ع</span>
                </div>
                {aiPrice && Number(aiPrice) > 0 && (
                  <p className="text-[11px] text-teal-800 dark:text-teal-400 font-bold mt-1.5 flex items-center gap-1">
                    <Zap className="size-3" /> السعر الذي سيدفعه العميل: {formatIQD(Number(aiPrice))}
                  </p>
                )}
              </div>

              {/* بطاقة معلومات ما سيتكفل به الـ AI تلقائياً */}
              <div className="p-4 rounded-2xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-100 dark:border-teal-900/40 space-y-2">
                <p className="text-xs font-extrabold text-teal-950 dark:text-teal-200 flex items-center gap-1.5">
                  <Wand2 className="size-4 text-teal-800 dark:text-teal-400" />
                  ما سيتكفل به الذكاء الاصطناعي تلقائياً:
                </p>
                <ul className="text-[11px] text-teal-900 dark:text-teal-300 space-y-1 pr-4 list-disc">
                  <li>صياغة عنوان إعلاني احترافي ومقنع مبني على اسم المنتج.</li>
                  <li>كتابة نصوص ترويجية كاملة بالعناوين والمميزات التسويقية الفعالة.</li>
                  <li>توليد رابط إنجليزي مختصر ونظيف (Clean URL Slug).</li>
                  <li>احتساب السعر المشطوب التنافسي (~30% خصم وهمي محفز).</li>
                  <li>تجهيز باقات الكميات (خصم القطعتين 15%، و 3 قطع 25% مع شحن مجاني).</li>
                  <li>إطلاق ونشر الصفحة فورياً على الدومين <span className="font-mono dir-ltr">{subdomain}.za3em.shop</span>.</li>
                </ul>
              </div>

              {/* أزرار الإجراءات والتوليد */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  disabled={isAiGenerating}
                  onClick={() => setIsAiModalOpen(false)}
                  className="px-5 h-12 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 cursor-pointer"
                >
                  إلغاء
                </button>

                {/* زر توليد ونشر باللون وشكل متناسق مع المنصة (Screenshot 2) */}
                <button
                  type="submit"
                  disabled={isAiGenerating}
                  className="px-8 h-12 bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white text-xs font-black rounded-xl shadow-lg shadow-teal-700/25 flex items-center justify-center gap-2.5 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  {isAiGenerating ? (
                    <>
                      <RefreshCw className="size-4 animate-spin" />
                      <span>{aiGenerationProgress || 'جاري التوليد بالذكاء الاصطناعي...'}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="size-4 text-amber-300" />
                      <span>توليد ونشر صفحة الهبوط فوراً</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
