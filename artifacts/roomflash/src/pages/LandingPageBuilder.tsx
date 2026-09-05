import { useState, useEffect, useRef, type FormEvent } from 'react';
import {
  Sparkles, Plus, Eye, Copy, Check, ExternalLink, Globe,
  ArrowLeft, Trash2, CheckCircle2, Image, Upload, DollarSign,
  Percent, Tag, RefreshCw, AlertTriangle, Layers, Edit3, X,
  ShoppingBag, ShieldCheck, ChevronRight
} from 'lucide-react';
import { formatIQD } from '../data/iraqData';
import {
  saveCloudLandingPage, fetchCloudLandingPages, deleteCloudLandingPage,
  type CloudLandingPage
} from '../utils/cloudDb';

export function LandingPageBuilderPage() {
  // Store Subdomain
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

  // Landing Pages List from Server
  const [pages, setPages] = useState<CloudLandingPage[]>([]);
  const [isLoadingPages, setIsLoadingPages] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form / Builder States
  const [isCreating, setIsCreating] = useState(false);
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdSuccessPage, setCreatedSuccessPage] = useState<CloudLandingPage | null>(null);

  // Form Fields
  const [productName, setProductName] = useState('');
  const [slug, setSlug] = useState('landbidg1');
  const [price, setPrice] = useState('');
  const [compareAtPrice, setCompareAtPrice] = useState('');
  const [discountTwoItems, setDiscountTwoItems] = useState('15');
  const [discountThreeItems, setDiscountThreeItems] = useState('25');
  const [description, setDescription] = useState('');

  // 3 Images (Image 1 is mandatory)
  const [image1, setImage1] = useState('');
  const [image2, setImage2] = useState('');
  const [image3, setImage3] = useState('');

  const [imageErrors, setImageErrors] = useState<{ image1?: string }>({});

  // File Inputs Refs
  const fileRef1 = useRef<HTMLInputElement>(null);
  const fileRef2 = useRef<HTMLInputElement>(null);
  const fileRef3 = useRef<HTMLInputElement>(null);

  // Preview Modal
  const [previewPage, setPreviewPage] = useState<CloudLandingPage | null>(null);

  // Load Landing Pages from Server & Local Storage
  const loadPages = async () => {
    setIsLoadingPages(true);
    try {
      const serverPages = await fetchCloudLandingPages(subdomain);

      // Also merge with local storage
      let localPages: CloudLandingPage[] = [];
      try {
        const raw = localStorage.getItem('zaeem_local_landing_pages');
        if (raw) localPages = JSON.parse(raw);
      } catch {}

      const map = new Map<string, CloudLandingPage>();
      (serverPages || []).forEach(p => map.set(p.slug, p));
      (localPages || []).forEach(p => {
        if (!map.has(p.slug)) map.set(p.slug, p);
      });

      const merged = Array.from(map.values());
      setPages(merged);
    } catch (err) {
      console.warn('Error loading landing pages:', err);
    } finally {
      setIsLoadingPages(false);
    }
  };

  useEffect(() => {
    loadPages();
  }, [subdomain]);

  // Image Upload Handlers (converts to base64 DataURL or handles url)
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setImage: (val: string) => void,
    isMandatory = false
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('حجم الصورة كبير جداً، يرجى اختيار صورة أقل من 5 ميجابايت.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setImage(dataUrl);
        if (isMandatory) {
          setImageErrors(prev => ({ ...prev, image1: undefined }));
        }
      }
    };
    reader.readAsDataURL(file);
  };

  // Open Form to Create New Page
  const handleOpenCreateNew = () => {
    setEditingPageId(null);
    setProductName('');
    // Auto-generate a clean slug like landbidg1, landbidg2...
    const count = pages.length + 1;
    setSlug(`landbidg${count}`);
    setPrice('35000');
    setCompareAtPrice('50000');
    setDiscountTwoItems('15');
    setDiscountThreeItems('25');
    setDescription('عرض خاص ومحدود مع شحن سريع وضمان الاستبدال والدفع عند الاستلام.');
    setImage1('https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&auto=format&fit=crop&q=80');
    setImage2('');
    setImage3('');
    setImageErrors({});
    setIsCreating(true);
  };

  // Open Form to Edit Existing Page
  const handleOpenEdit = (p: CloudLandingPage) => {
    setEditingPageId(String(p.id || p.slug));
    setProductName(p.productName);
    setSlug(p.slug);
    setPrice(String(p.price || ''));
    setCompareAtPrice(String(p.compareAtPrice || ''));
    setDiscountTwoItems(String(p.discountTwoItems || 15));
    setDiscountThreeItems(String(p.discountThreeItems || 25));
    setDescription(p.description || '');

    const imgs = p.images || [];
    setImage1(imgs[0] || '');
    setImage2(imgs[1] || '');
    setImage3(imgs[2] || '');

    setImageErrors({});
    setIsCreating(true);
  };

  // Delete Landing Page
  const handleDeletePage = async (page: CloudLandingPage) => {
    const confirmDelete = window.confirm(`هل أنت متأكد من رغبتك في إزالة صفحة الهبوط "${page.productName}"؟`);
    if (!confirmDelete) return;

    try {
      await deleteCloudLandingPage(page.id || page.slug, subdomain);
      const updated = pages.filter(p => p.slug !== page.slug && p.id !== page.id);
      setPages(updated);
      try {
        localStorage.setItem('zaeem_local_landing_pages', JSON.stringify(updated));
      } catch {}
      alert(`تم حذف صفحة الهبوط "${page.productName}" بنجاح.`);
    } catch (err) {
      console.warn('Error deleting landing page:', err);
      alert('حدث خطأ أثناء محاولة إزالة الصفحة من السيرفر.');
    }
  };

  // Submit Landing Page (Create or Update)
  const handleSubmitPage = async (e: FormEvent) => {
    e.preventDefault();

    // Validate Product Name
    if (!productName.trim()) {
      alert('يرجى إدخال اسم المنتج.');
      return;
    }

    // Validate Mandatory Image 1
    if (!image1.trim()) {
      setImageErrors({ image1: 'صورة المنتج الأولى إجبارية لإطلاق صفحة الهبوط' });
      alert('الصورة الأولى للمنتج إجبارية، يرجى رفع صورة أو وضع رابط للصورة.');
      return;
    }

    const priceNum = Number(price) || 0;
    const compareNum = Number(compareAtPrice) || priceNum;
    const disc2 = Number(discountTwoItems) || 15;
    const disc3 = Number(discountThreeItems) || 25;

    // Clean Slug
    const cleanSlug = (slug || 'landbidg1').toLowerCase().trim().replace(/[^a-z0-9-]/g, '');

    // Collect all valid images (image1 is required, image2 and image3 are optional)
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
      description: description.trim(),
      template: 'easyorders-flash',
      isPublished: true,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setIsSubmitting(true);

    try {
      // 1. Save to Neon PostgreSQL Database
      await saveCloudLandingPage(pageData);

      // 2. Save locally
      const existingIdx = pages.findIndex(p => p.slug === cleanSlug);
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

      // 3. Show Success Card & Reset
      setCreatedSuccessPage(pageData);
      setIsCreating(false);
    } catch (err) {
      console.warn('Error saving landing page:', err);
      alert('حدث خطأ أثناء حفظ الصفحة في السيرفر.');
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

  // Live calculation of 2-item & 3-item bundles for display
  const priceVal = Number(price) || 0;
  const d2Val = Number(discountTwoItems) || 0;
  const d3Val = Number(discountThreeItems) || 0;
  const totalTwoPieces = Math.round((priceVal * 2) * (1 - d2Val / 100));
  const totalThreePieces = Math.round((priceVal * 3) * (1 - d3Val / 100));

  return (
    <div className="space-y-6 rf-appear">
      {/* Success Modal */}
      {createdSuccessPage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-2xl border border-teal-200 dark:border-teal-900 text-center space-y-4">
            <div className="size-16 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-400 grid place-items-center mx-auto border border-teal-200 dark:border-teal-800">
              <Check className="size-8 stroke-[3]" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              تم إطلاق ونشر صفحة الهبوط فورياً! 🚀
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              تم حفظ الصفحة على قاعدة بيانات السيرفر وربطها بامتداد حصري على دومينك الفرعي.
            </p>

            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl font-mono text-xs font-bold text-teal-800 dark:text-teal-300 border border-slate-200 dark:border-slate-700 break-all dir-ltr text-center">
              {getDirectLandingUrl(createdSuccessPage.slug)}
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(getDirectLandingUrl(createdSuccessPage.slug));
                  alert('تم نسخ رابط صفحة الهبوط بنجاح!');
                }}
                className="h-11 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl shadow flex items-center justify-center gap-1.5 transition-all"
              >
                <Copy className="size-4" />
                <span>نسخ الرابط المباشر</span>
              </button>
              <button
                type="button"
                onClick={() => setCreatedSuccessPage(null)}
                className="h-11 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 font-bold text-xs rounded-xl transition-all"
              >
                العودة للصفحات
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-teal-700 dark:text-teal-400 mb-1">
            <Globe className="size-4" /> صفحات الهبوط والتسويق السريع (Landing Pages)
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <span>صفحات الهبوط المباشرة للمنتجات</span>
            <span className="text-xs font-mono font-bold bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 px-3 py-1 rounded-full border border-teal-300/50 dir-ltr">
              {subdomain}.za3em.shop/*
            </span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            صمم صفحات هبوط أحادية سريعة التحويل لحملاتك الإعلانية على تيك توك وإنستغرام وفيسبوك مع خصومات القطع الإضافية.
          </p>
        </div>

        {/* Top Button: خيار إضافة صفحة هبوط جديدة */}
        <div className="flex items-center gap-2">
          {!isCreating && (
            <button
              onClick={handleOpenCreateNew}
              className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer hover:scale-105"
            >
              <Plus className="size-4" />
              <span>إضافة صفحة هبوط جديدة</span>
            </button>
          )}

          <button
            type="button"
            onClick={loadPages}
            disabled={isLoadingPages}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50"
            title="تحديث الصفحات من السيرفر"
          >
            <RefreshCw className={`size-4 ${isLoadingPages ? 'animate-spin text-teal-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 🌟 1. نموذج إضافة وتعديل صفحة الهبوط                                      */}
      {/* ========================================================================= */}
      {isCreating ? (
        <div className="max-w-4xl mx-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="size-5 text-teal-700" />
                {editingPageId ? 'تعديل بيانات صفحة الهبوط' : 'إنشاء وإطلاق صفحة هبوط جديدة'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                تطلق الصفحة فورياً على امتداد دومينك الفرعي وتُحفظ بقاعدة البيانات السحابية
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1"
            >
              <ArrowLeft className="size-4" />
              <span>إلغاء والعودة</span>
            </button>
          </div>

          <form onSubmit={handleSubmitPage} className="space-y-6">
            {/* Section A: Product Name & Extension Slug */}
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  اسم المنتج المعروض في صفحة الهبوط <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  value={productName}
                  onChange={(e) => {
                    setProductName(e.target.value);
                    if (!editingPageId && !slug) {
                      setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
                    }
                  }}
                  placeholder="مثال: عطر تاج الفخامة الفرنسي الملكي"
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:border-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  امتداد الصفحة من الدومين الفرعي (URL Extension) <span className="text-red-500">*</span>
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
                    placeholder="landbidg1"
                    dir="ltr"
                    className="flex-1 h-11 bg-transparent text-sm font-mono font-bold text-teal-700 dark:text-teal-400 outline-none text-right"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  مثال: landbidg1 — الرابط النهائي: https://{subdomain}.za3em.shop/{slug || 'landbidg1'}
                </p>
              </div>
            </div>

            {/* Section B: 3 Images (Image 1 is MANDATORY) */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Image className="size-4 text-teal-700" />
                  صور المنتج الثلاثة (صورة منهم إجبارية)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  الصورة الأولى أساسية ورئيسية (إجبارية)، والصورتان الثانية والثالثة اختياريتان لعرض تفاصيل إضافية للمنتج.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                {/* Image 1: Mandatory */}
                <div className={`p-4 rounded-2xl border space-y-3 bg-slate-50/70 dark:bg-slate-800/40 ${
                  imageErrors.image1 ? 'border-rose-500' : 'border-teal-500/40'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-teal-800 dark:text-teal-300">
                      الصورة 1 (إجبارية *)
                    </span>
                    <span className="text-[10px] font-bold bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 px-2 py-0.5 rounded-full">
                      الصورة الرئيسية
                    </span>
                  </div>

                  {image1 ? (
                    <div className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white">
                      <img src={image1} alt="صورة 1" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setImage1('')}
                        className="absolute top-2 right-2 p-1 bg-rose-600 text-white rounded-lg shadow-sm"
                        title="إزالة الصورة"
                      >
                        <X className="size-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileRef1.current?.click()}
                      className="aspect-square rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-teal-500 flex flex-col items-center justify-center p-3 text-center cursor-pointer transition-colors"
                    >
                      <Upload className="size-6 text-slate-400 mb-1" />
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        اضغط لرفع الصورة 1
                      </span>
                      <span className="text-[10px] text-slate-400 mt-1">PNG أو JPG حتى 5MB</span>
                    </div>
                  )}

                  <input
                    type="file"
                    ref={fileRef1}
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, setImage1, true)}
                    className="hidden"
                  />

                  <div>
                    <input
                      type="url"
                      value={image1}
                      onChange={(e) => {
                        setImage1(e.target.value);
                        if (e.target.value) setImageErrors(prev => ({ ...prev, image1: undefined }));
                      }}
                      placeholder="أو الصق رابط الصورة الأولى..."
                      className="w-full h-9 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[11px] outline-none"
                    />
                  </div>

                  {imageErrors.image1 && (
                    <p className="text-[11px] font-bold text-rose-500 flex items-center gap-1">
                      <AlertTriangle className="size-3" />
                      {imageErrors.image1}
                    </p>
                  )}
                </div>

                {/* Image 2: Optional */}
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      الصورة 2 (اختيارية)
                    </span>
                    <span className="text-[10px] text-slate-400">إضافية</span>
                  </div>

                  {image2 ? (
                    <div className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white">
                      <img src={image2} alt="صورة 2" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setImage2('')}
                        className="absolute top-2 right-2 p-1 bg-rose-600 text-white rounded-lg shadow-sm"
                        title="إزالة الصورة"
                      >
                        <X className="size-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileRef2.current?.click()}
                      className="aspect-square rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-teal-500 flex flex-col items-center justify-center p-3 text-center cursor-pointer transition-colors"
                    >
                      <Upload className="size-6 text-slate-400 mb-1" />
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        اضغط لرفع الصورة 2
                      </span>
                    </div>
                  )}

                  <input
                    type="file"
                    ref={fileRef2}
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, setImage2, false)}
                    className="hidden"
                  />

                  <div>
                    <input
                      type="url"
                      value={image2}
                      onChange={(e) => setImage2(e.target.value)}
                      placeholder="أو الصق رابط الصورة الثانية..."
                      className="w-full h-9 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[11px] outline-none"
                    />
                  </div>
                </div>

                {/* Image 3: Optional */}
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      الصورة 3 (اختيارية)
                    </span>
                    <span className="text-[10px] text-slate-400">إضافية</span>
                  </div>

                  {image3 ? (
                    <div className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white">
                      <img src={image3} alt="صورة 3" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setImage3('')}
                        className="absolute top-2 right-2 p-1 bg-rose-600 text-white rounded-lg shadow-sm"
                        title="إزالة الصورة"
                      >
                        <X className="size-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileRef3.current?.click()}
                      className="aspect-square rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-teal-500 flex flex-col items-center justify-center p-3 text-center cursor-pointer transition-colors"
                    >
                      <Upload className="size-6 text-slate-400 mb-1" />
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        اضغط لرفع الصورة 3
                      </span>
                    </div>
                  )}

                  <input
                    type="file"
                    ref={fileRef3}
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, setImage3, false)}
                    className="hidden"
                  />

                  <div>
                    <input
                      type="url"
                      value={image3}
                      onChange={(e) => setImage3(e.target.value)}
                      placeholder="أو الصق رابط الصورة الثالثة..."
                      className="w-full h-9 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[11px] outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section C: Pricing & Bundle Discounts (% on 2 & 3 items) */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <DollarSign className="size-4 text-teal-700" />
                  أسعار المنتج ونسب الخصم على الكميات (باقات العروض)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  حدد سعر القطعة الفردية، ثم حدد نسبة الخصم المشجعة عند طلب قطعتين أو 3 قطع لرفع معدل السلة.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                {/* 1. السعر قبل الخصم */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    السعر قبل الخصم (الأصلي) <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="number"
                    value={compareAtPrice}
                    onChange={(e) => setCompareAtPrice(e.target.value)}
                    placeholder="50000"
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-mono outline-none focus:border-teal-600"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">يظهر مشطوباً لإبراز التوفير</span>
                </div>

                {/* 2. السعر بعد الخصم (قطعة واحدة) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    السعر بعد الخصم (قطعة واحدة) <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="35000"
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-mono font-bold text-teal-800 dark:text-teal-400 outline-none focus:border-teal-600"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">سعر شراء القطعة الفردية</span>
                </div>

                {/* 3. نسبة الخصم على القطعتين */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    نسبة الخصم على القطعتين (%) <span className="text-red-500">*</span>
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
                      className="flex-1 h-11 bg-transparent text-sm font-mono font-bold outline-none"
                    />
                    <Percent className="size-4 text-slate-400" />
                  </div>
                  <span className="text-[10px] text-emerald-600 font-bold mt-1 block font-mono">
                    الإجمالي: {formatIQD(totalTwoPieces)} (وفر {formatIQD((priceVal * 2) - totalTwoPieces)})
                  </span>
                </div>

                {/* 4. نسبة الخصم على الثلاثة */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    نسبة الخصم على الثلاث قطع (%) <span className="text-red-500">*</span>
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
                      className="flex-1 h-11 bg-transparent text-sm font-mono font-bold outline-none"
                    />
                    <Percent className="size-4 text-slate-400" />
                  </div>
                  <span className="text-[10px] text-emerald-600 font-bold mt-1 block font-mono">
                    الإجمالي: {formatIQD(totalThreePieces)} (وفر {formatIQD((priceVal * 3) - totalThreePieces)})
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                وصف المنتج التسويقي في صفحة الهبوط
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="اكتب وصفاً جذاباً يشرح مزايا المنتج، الضمان، وسرعة التوصيل..."
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:border-teal-600"
              />
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-5 h-11 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-7 h-11 bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 transition-all hover:scale-105 cursor-pointer"
              >
                {isSubmitting ? <RefreshCw className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
                <span>إطلاق ونشر صفحة الهبوط فورياً</span>
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* ========================================================================= */
        /* 🌟 2. عرض صفحات الهبوط الموجودة حالياً بجوارها تعديل وإزالة                */
        /* ========================================================================= */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
              صفحات الهبوط النشطة والمطلقة ({pages.length})
            </h2>
            <span className="text-xs text-slate-500">
              مربوطة مباشرة بالسيرفر السحابي والدومين الفرعي
            </span>
          </div>

          {isLoadingPages ? (
            <div className="py-20 text-center space-y-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
              <RefreshCw className="size-8 animate-spin text-teal-700 mx-auto" />
              <p className="text-xs font-bold text-slate-500">جاري جلب صفحات الهبوط من السيرفر...</p>
            </div>
          ) : pages.length === 0 ? (
            <div className="py-16 px-4 text-center space-y-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
              <div className="size-14 rounded-2xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-400 grid place-items-center mx-auto">
                <Globe className="size-7" />
              </div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">
                لا توجد صفحات هبوط منشأة بعد
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                أنشئ صفحتك الأولى المخصصة لمنتج معين مع خصومات الكميات ونموذج الشراء الفوري لتوليد أقصى معدل مبيعات.
              </p>
              <button
                type="button"
                onClick={handleOpenCreateNew}
                className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 mx-auto"
              >
                <Plus className="size-4" />
                <span>إضافة صفحة هبوط جديدة الآن</span>
              </button>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {pages.map((p) => {
                const primaryImg = p.images?.[0] || 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&auto=format&fit=crop&q=80';
                const directUrl = getDirectLandingUrl(p.slug);

                return (
                  <div
                    key={p.id || p.slug}
                    className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-all space-y-4"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 mb-1.5">
                            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            صفحة هبوط منشورة
                          </span>
                          <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                            {p.productName}
                          </h3>
                        </div>

                        <span className="font-mono text-xs text-slate-400">{p.createdAt}</span>
                      </div>

                      {/* Product Preview Card */}
                      <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
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
                              {formatIQD(p.price)}
                            </span>
                            {p.compareAtPrice > p.price && (
                              <span className="line-through text-slate-400 text-[11px]">
                                {formatIQD(p.compareAtPrice)}
                              </span>
                            )}
                          </div>
                          {/* Images Count Indicator */}
                          <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-slate-500">
                            <Image className="size-3 text-slate-400" />
                            <span>{p.images?.length || 1} صور مرفوعة</span>
                          </div>
                        </div>
                      </div>

                      {/* Discounts Strip */}
                      <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                        <div className="p-2 rounded-xl bg-teal-50/50 dark:bg-teal-950/20 border border-teal-100 dark:border-teal-900/40">
                          <span className="text-slate-500 block text-[10px]">خصم القطعتين:</span>
                          <span className="font-black text-teal-800 dark:text-teal-300 font-mono">
                            {p.discountTwoItems}% خصم
                          </span>
                        </div>
                        <div className="p-2 rounded-xl bg-teal-50/50 dark:bg-teal-950/20 border border-teal-100 dark:border-teal-900/40">
                          <span className="text-slate-500 block text-[10px]">خصم الـ 3 قطع:</span>
                          <span className="font-black text-teal-800 dark:text-teal-300 font-mono">
                            {p.discountThreeItems}% خصم
                          </span>
                        </div>
                      </div>

                      {/* Link Preview */}
                      <div className="mt-3 p-2 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-[11px] font-mono text-slate-600 dark:text-slate-300 truncate dir-ltr text-center">
                        {directUrl}
                      </div>
                    </div>

                    {/* Actions: تعديل + إزالة + نسخ الرابط + معاينة */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        {/* زر تعديل */}
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(p)}
                          className="px-3 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Edit3 className="size-3.5 text-teal-600" />
                          <span>تعديل</span>
                        </button>

                        {/* زر إزالة */}
                        <button
                          type="button"
                          onClick={() => handleDeletePage(p)}
                          className="px-3 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-xs font-bold text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Trash2 className="size-3.5" />
                          <span>إزالة</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {/* نسخ الرابط */}
                        <button
                          type="button"
                          onClick={() => copyLandingUrl(p.slug, String(p.id || p.slug))}
                          className="px-3 h-9 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-teal-700 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950 flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          {copiedId === String(p.id || p.slug) ? <Check className="size-3.5 text-teal-600" /> : <Copy className="size-3.5" />}
                          <span>{copiedId === String(p.id || p.slug) ? 'تم النسخ' : 'نسخ الرابط'}</span>
                        </button>

                        {/* معاينة */}
                        <button
                          type="button"
                          onClick={() => setPreviewPage(p)}
                          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="معاينة سريعة"
                        >
                          <Eye className="size-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Quick Preview Modal */}
      {previewPage && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-xs font-bold text-teal-700">معاينة صفحة الهبوط المباشرة</span>
              <button
                type="button"
                onClick={() => setPreviewPage(null)}
                className="text-xs font-bold text-slate-500 hover:text-slate-900"
              >
                إغلاق
              </button>
            </div>

            <div className="text-center space-y-4">
              <img
                src={previewPage.images?.[0] || 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&auto=format&fit=crop&q=80'}
                alt={previewPage.productName}
                className="w-full h-64 object-cover rounded-2xl bg-slate-100"
              />

              {previewPage.images && previewPage.images.length > 1 && (
                <div className="flex justify-center gap-2">
                  {previewPage.images.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`مصغرة ${i + 1}`}
                      className="size-14 rounded-xl object-cover border-2 border-slate-200"
                    />
                  ))}
                </div>
              )}

              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                {previewPage.productName}
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {previewPage.description || 'عرض خاص ومحدود مع سلة شراء سريعة وشحن لجميع محافظات العراق.'}
              </p>

              {/* Price & Bundle Cards */}
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                  <span className="text-[10px] text-slate-400 block">قطعة واحدة</span>
                  <span className="font-mono font-black text-slate-900 dark:text-white text-sm">
                    {formatIQD(previewPage.price)}
                  </span>
                </div>
                <div className="p-3 rounded-xl border-2 border-teal-500 bg-teal-50 dark:bg-teal-950/40">
                  <span className="text-[10px] text-teal-800 dark:text-teal-300 font-bold block">
                    قطعتين (خصم {previewPage.discountTwoItems}%)
                  </span>
                  <span className="font-mono font-black text-teal-800 dark:text-teal-300 text-sm">
                    {formatIQD(Math.round((previewPage.price * 2) * (1 - previewPage.discountTwoItems / 100)))}
                  </span>
                </div>
                <div className="p-3 rounded-xl border border-amber-500 bg-amber-50 dark:bg-amber-950/30">
                  <span className="text-[10px] text-amber-700 dark:text-amber-300 font-bold block">
                    3 قطع (خصم {previewPage.discountThreeItems}%)
                  </span>
                  <span className="font-mono font-black text-amber-700 dark:text-amber-300 text-sm">
                    {formatIQD(Math.round((previewPage.price * 3) * (1 - previewPage.discountThreeItems / 100)))}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
