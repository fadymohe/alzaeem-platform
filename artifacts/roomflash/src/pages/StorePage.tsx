import { useState, useEffect, type FormEvent } from 'react';
import {
  Store as StoreIcon, ExternalLink, Copy, Check, Sparkles, Globe,
  Layers, Eye, RefreshCw, Zap, CheckCircle2, Palette, Save, ArrowLeft,
  ArrowUpRight, ShieldCheck, Box, Truck, Package, Plus, Trash2, Edit2,
  Smartphone, Monitor, CreditCard, DollarSign, Wallet, CheckSquare,
  Type, Lock, Crown, Tag
} from 'lucide-react';
import { formatIQD } from '../data/iraqData';
import { StoreTemplates, type TemplateId, TEMPLATES_MAP } from '../components/storefront/StoreTemplates';
import { getStoredOrders, getStoredProducts } from '../data/storeState';
import { getRegisteredStore, type RegisteredStoreData, updateStoreActiveStatus } from '../utils/storeRegistry';
import { updateCloudStoreFullSettings, fetchCloudStore } from '../utils/cloudDb';
import { LandingPageBuilderPage } from './LandingPageBuilder';

export interface ExtendedTemplateConfig {
  id: TemplateId;
  name: string;
  nameEn: string;
  niche: string;
  badge: string;
  isPro: boolean;
  colorDot: string;
}

export const ALL_STORE_TEMPLATES: Record<string, ExtendedTemplateConfig> = {
  'shoppingcart.1.2.7': {
    id: 'shoppingcart.1.2.7' as TemplateId,
    name: 'سلة التسوق الشاملة',
    nameEn: 'Shopping Cart v1.2.7',
    niche: 'الافتراضي الشامل • سلة تسوق مرنة لكافة المنتجات',
    badge: 'القالب الافتراضي',
    isPro: false,
    colorDot: 'bg-teal-400'
  },
  'volt': {
    id: 'volt' as TemplateId,
    name: 'فولت إكسبريس',
    nameEn: 'Volt Tech',
    niche: 'إلكترونيات وتقنية وأجهزة ذكية',
    badge: 'داكن عصري • نيون',
    isPro: false,
    colorDot: 'bg-emerald-400'
  },
  'rose': {
    id: 'rose' as TemplateId,
    name: 'روز أتيليه',
    nameEn: 'Rose Atelier',
    niche: 'أزياء، عبايات، تجميل ومكياج',
    badge: 'كلاسيك راقي • بيج ووردي',
    isPro: false,
    colorDot: 'bg-rose-400'
  },
  'nitro': {
    id: 'nitro' as TemplateId,
    name: 'نيترو سبورت',
    nameEn: 'Nitro Sports',
    niche: 'رياضة ولياقة وملابس شارع شبابية',
    badge: 'رياضي داكن • أحمر نيون',
    isPro: false,
    colorDot: 'bg-red-500'
  },
  'sepia': {
    id: 'sepia' as TemplateId,
    name: 'هاير الملكي',
    nameEn: 'Royal Sepia',
    niche: 'ساعات، عطور ملكية وجلديات فاخرة',
    badge: 'فخامة مطلقة • ذهبي داكن',
    isPro: true,
    colorDot: 'bg-amber-400'
  },
  'oret': {
    id: 'oret' as TemplateId,
    name: 'أوريت إكسبريس',
    nameEn: 'Oret Express',
    niche: 'متجر عصري للشراء السريع ومستلزمات المنزل',
    badge: 'أزرق عصري • عروض',
    isPro: true,
    colorDot: 'bg-cyan-400'
  },
  'easyorders-flash': {
    id: 'shoppingcart.1.2.7' as TemplateId,
    name: 'فلاش لاندينج',
    nameEn: 'EasyOrders Flash',
    niche: 'صفحة شراء فورية عالية التحويل بنموذج واحد',
    badge: 'الأعلى تحويلاً للمبيعات',
    isPro: true,
    colorDot: 'bg-amber-500'
  },
  'nova': {
    id: 'rose' as TemplateId,
    name: 'نوفا الملكي',
    nameEn: 'Nova Royal',
    niche: 'أزياء راقية ومجوهرات وإكسسوارات',
    badge: 'تصميم أوروبي فاخر',
    isPro: true,
    colorDot: 'bg-purple-400'
  },
  'classic': {
    id: 'sepia' as TemplateId,
    name: 'كلاسيك الفاخر',
    nameEn: 'Classic Luxury',
    niche: 'عطور شرقية وبخور ومقتنيات قيمة',
    badge: 'طابع كلاسيكي عربي',
    isPro: true,
    colorDot: 'bg-yellow-500'
  }
};

export const STORE_FONTS = [
  { id: 'Tajawal', name: 'تجوال (Tajawal)', fontClass: 'font-tajawal', desc: 'خط عصري متوازن، ممتاز للعناوين والأرقام' },
  { id: 'Cairo', name: 'كايرو (Cairo)', fontClass: 'font-cairo', desc: 'خط جريء وشائع جداً في المتاجر العراقية' },
  { id: 'IBM Plex Sans Arabic', name: 'آي بي إم (IBM Plex Arabic)', fontClass: 'font-ibm', desc: 'خط رسمي عالي الوضوح والاحترافية' },
  { id: 'Almarai', name: 'المراعي (Almarai)', fontClass: 'font-almarai', desc: 'خط ناعم ومريح لعين الزبون في التصفح' },
  { id: 'Alexandria', name: 'الإسكندرية (Alexandria)', fontClass: 'font-alexandria', desc: 'خط هندسي فائق الأناقة والحداثة' },
  { id: 'Amiri', name: 'الأميري (Amiri)', fontClass: 'font-amiri', desc: 'خط عربي كلاسيكي فاخر للعطور والذهب' },
];

export function StorePage() {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [saveSuccessAlert, setSaveSuccessAlert] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Main section tabs: إعدادات المتجر vs صفحات الهبوط
  const [activeMainTab, setActiveMainTab] = useState<'store' | 'landing'>(() => {
    const hash = typeof window !== 'undefined' ? window.location.hash || '' : '';
    return hash.includes('tab=landing') || hash.includes('/landing-page') ? 'landing' : 'store';
  });

  // 1. Basic Store Info & Subdomain
  const [storeName, setStoreName] = useState('متجر الزعيم الذهبي');
  const [subdomainInput, setSubdomainInput] = useState('alzaeem');
  const [subdomain, setSubdomain] = useState('alzaeem');
  const [isStoreActive, setIsStoreActive] = useState<boolean>(true);
  const [activeTemplate, setActiveTemplate] = useState<TemplateId>('shoppingcart.1.2.7');
  const [templateFilter, setTemplateFilter] = useState<'all' | 'free' | 'pro'>('all');

  // 2. Store Font & Typography
  const [storeFont, setStoreFont] = useState<string>('Tajawal');

  // 3. Store Categories / Sections
  const [categories, setCategories] = useState<string[]>(['عام', 'عطور فاخرة', 'إلكترونيات', 'ساعات']);
  const [newCategoryInput, setNewCategoryInput] = useState('');
  const [editingCategoryIdx, setEditingCategoryIdx] = useState<number | null>(null);
  const [editingCategoryVal, setEditingCategoryVal] = useState('');

  // 4. Payment Options
  const [paymentMethods, setPaymentMethods] = useState({
    cod: true,
    zainCash: true,
    zainCashPhone: '07801234567',
    qiCard: true,
    asiaHawala: false,
    asiaHawalaPhone: '07701234567',
  });

  // 5. Live Preview States
  const [showLivePreview, setShowLivePreview] = useState(true);
  const [previewViewport, setPreviewViewport] = useState<'desktop' | 'mobile'>('desktop');
  const [storeData, setStoreData] = useState<RegisteredStoreData | null>(null);

  // Load from local storage & database
  useEffect(() => {
    try {
      const stored = localStorage.getItem('zaeem_store_data') || localStorage.getItem('zaeem_onboarded_store');
      const rawUser = localStorage.getItem('zaeem_user');
      let parsedUser: any = null;
      if (rawUser) {
        try { parsedUser = JSON.parse(rawUser); } catch {}
      }

      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.storeName) setStoreName(parsed.storeName);
        else if (parsedUser?.storeName) setStoreName(parsedUser.storeName);

        const cleanSub = (parsed.subdomain || parsedUser?.subdomain || 'alzaeem')
          .replace(/\.za3em\.shop|\.alzaeem\.iq/g, '')
          .replace(/^https?:\/\//, '')
          .toLowerCase()
          .trim();
        setSubdomain(cleanSub);
        setSubdomainInput(cleanSub);

        if (parsed.selectedTheme) setActiveTemplate(parsed.selectedTheme as TemplateId);
        else if (parsed.templateId) setActiveTemplate(parsed.templateId as TemplateId);

        if (parsed.font) setStoreFont(parsed.font);
        if (Array.isArray(parsed.categories) && parsed.categories.length > 0) setCategories(parsed.categories);
        if (parsed.paymentMethods) setPaymentMethods(prev => ({ ...prev, ...parsed.paymentMethods }));
        if (typeof parsed.isActive === 'boolean') setIsStoreActive(parsed.isActive);

        setStoreData(parsed);
      } else if (parsedUser) {
        if (parsedUser.storeName) setStoreName(parsedUser.storeName);
        if (parsedUser.subdomain) {
          const cleanSub = parsedUser.subdomain.replace(/\.za3em\.shop/g, '').replace(/^https?:\/\//, '').trim();
          setSubdomain(cleanSub);
          setSubdomainInput(cleanSub);
        }
      }

      const activeVal = localStorage.getItem('zaeem_store_active');
      if (activeVal !== null) setIsStoreActive(activeVal !== 'false');
    } catch (e) {}

    // Also attempt to fetch latest server data
    fetchCloudStore(subdomain).then(record => {
      if (record) {
        if (record.name) setStoreName(record.name);
        if (record.template_id) setActiveTemplate(record.template_id as TemplateId);
        if (Array.isArray(record.categories) && record.categories.length > 0) setCategories(record.categories);
        if (typeof record.is_active === 'boolean') setIsStoreActive(record.is_active);
      }
    }).catch(() => {});
  }, []);

  const fullDomain = `${subdomain}.za3em.shop`;
  const fullUrl = `https://${fullDomain}`;
  const directHashUrl = `/#/store/${subdomain}`;

  // Toggle store active state
  const handleToggleStoreActive = async () => {
    const nextState = !isStoreActive;
    setIsStoreActive(nextState);
    try {
      localStorage.setItem('zaeem_store_active', String(nextState));
      const raw = localStorage.getItem('zaeem_store_data') || '{}';
      const parsed = JSON.parse(raw);
      parsed.isActive = nextState;
      localStorage.setItem('zaeem_store_data', JSON.stringify(parsed));
      window.dispatchEvent(new CustomEvent('zaeem_store_updated'));
      await updateStoreActiveStatus(subdomain, nextState);
    } catch {}
  };

  // Add Category
  const handleAddCategory = () => {
    const cat = newCategoryInput.trim();
    if (!cat) return;
    if (categories.includes(cat)) {
      alert('هذا القسم موجود بالفعل في متجرك.');
      return;
    }
    setCategories([...categories, cat]);
    setNewCategoryInput('');
  };

  // Edit Category
  const handleSaveEditCategory = (index: number) => {
    if (!editingCategoryVal.trim()) return;
    const updated = [...categories];
    updated[index] = editingCategoryVal.trim();
    setCategories(updated);
    setEditingCategoryIdx(null);
    setEditingCategoryVal('');
  };

  // Delete Category
  const handleDeleteCategory = (index: number) => {
    if (categories.length <= 1) {
      alert('يجب الإبقاء على قسم واحد على الأقل في متجرك.');
      return;
    }
    setCategories(categories.filter((_, i) => i !== index));
  };

  // Save All Changes (Subdomain, Name, Theme, Font, Categories, Payments)
  const handleSaveAllChanges = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);

    const cleanSub = (subdomainInput || subdomain || 'alzaeem').toLowerCase().replace(/[^a-z0-9-]/g, '');
    const cleanName = storeName.trim() || `متجر ${cleanSub}`;

    setSubdomain(cleanSub);
    setStoreName(cleanName);

    try {
      // 1. Local Storage update
      const stored = localStorage.getItem('zaeem_store_data') || localStorage.getItem('zaeem_onboarded_store') || '{}';
      const parsed = JSON.parse(stored);
      parsed.selectedTheme = activeTemplate;
      parsed.templateId = activeTemplate;
      parsed.subdomain = `${cleanSub}.za3em.shop`;
      parsed.storeName = cleanName;
      parsed.isActive = isStoreActive;
      parsed.font = storeFont;
      parsed.categories = categories;
      parsed.paymentMethods = paymentMethods;

      localStorage.setItem('zaeem_store_data', JSON.stringify(parsed));
      localStorage.setItem('zaeem_onboarded_store', JSON.stringify(parsed));
      localStorage.setItem('zaeem_store_active', String(isStoreActive));

      const rawUser = localStorage.getItem('zaeem_user');
      if (rawUser) {
        const u = JSON.parse(rawUser);
        u.storeName = cleanName;
        u.subdomain = `${cleanSub}.za3em.shop`;
        localStorage.setItem('zaeem_user', JSON.stringify(u));
      }

      // 2. Neon PostgreSQL update
      await updateCloudStoreFullSettings({
        subdomain: cleanSub,
        name: cleanName,
        templateId: activeTemplate,
        font: storeFont,
        categories: categories,
        paymentMethods: paymentMethods,
        isActive: isStoreActive
      });

      // 3. Dispatch global sync event
      window.dispatchEvent(new CustomEvent('zaeem_store_updated'));
      setSaveSuccessAlert(true);
      setTimeout(() => setSaveSuccessAlert(false), 4000);
    } catch (err) {
      console.warn('Error saving store changes:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const copyStoreLink = () => {
    navigator.clipboard?.writeText(fullUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const storeProducts = getStoredProducts();
  const storeCode = storeData?.storeCode || `ZAEEM-${subdomain.toUpperCase().slice(0, 4)}-${Math.floor(1000 + Math.random() * 9000)}`;

  // Filtered Templates
  const templateEntries = Object.entries(ALL_STORE_TEMPLATES).filter(([_, tpl]) => {
    if (templateFilter === 'free') return !tpl.isPro;
    if (templateFilter === 'pro') return tpl.isPro;
    return true;
  });

  return (
    <div className="space-y-7 rf-appear">
      {/* Top Title Bar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-teal-700 dark:text-teal-400 mb-1">
            <StoreIcon className="size-4" /> المتجر الإلكتروني
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5 flex-wrap">
            <span>إدارة وتخصيص المتجر الإلكتروني</span>
            <span className="text-xs font-mono font-bold bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 px-3.5 py-1 rounded-full border border-teal-300/50 flex items-center gap-1.5 dir-ltr">
              <span className={`size-2 rounded-full ${isStoreActive ? 'bg-emerald-500 animate-ping' : 'bg-rose-500'}`} />
              {fullDomain}
            </span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            خصص الدومين الفرعي، الثيمات المجانية والمدفوعة، خط المتجر، حالة النشاط، الأقسام وخيارات الدفع مع حفظ فوري.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* حالة المتجر (نشط / معطل) */}
          <div className="flex items-center gap-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3.5 py-2 rounded-xl shadow-sm">
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-black flex items-center gap-1.5 ${
              isStoreActive
                ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30'
                : 'bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-500/30'
            }`}>
              <span className={`size-1.5 rounded-full ${isStoreActive ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
              {isStoreActive ? 'الموقع نشط' : 'الموقع معطل'}
            </span>

            <button
              type="button"
              onClick={handleToggleStoreActive}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none ${
                isStoreActive ? 'bg-emerald-500' : 'bg-slate-400 dark:bg-slate-600'
              }`}
              role="switch"
              aria-checked={isStoreActive}
              title={isStoreActive ? 'اضغط لتعطيل المتجر مؤقتاً' : 'اضغط لتنشيط المتجر'}
            >
              <span
                className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-md ring-0 transition-transform duration-300 ease-in-out ${
                  isStoreActive ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <button
            type="button"
            onClick={copyStoreLink}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-teal-700 dark:text-teal-300 hover:bg-teal-50 flex items-center gap-1.5 shadow-sm transition-colors"
          >
            {copiedLink ? <Check className="size-4 text-emerald-600" /> : <Copy className="size-4" />}
            <span>{copiedLink ? 'تم نسخ الرابط' : 'نسخ الرابط'}</span>
          </button>

          <a
            href={fullUrl}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all"
          >
            <span>زيارة المتجر الحي</span>
            <ExternalLink className="size-3.5" />
          </a>
        </div>
      </div>

      {/* Alert Banner */}
      {saveSuccessAlert && (
        <div className="p-4 rounded-2xl bg-emerald-950/90 border border-emerald-500/60 text-xs font-bold text-emerald-200 flex items-center gap-2.5 animate-bounce shadow-lg">
          <CheckCircle2 className="size-5 text-emerald-400 shrink-0" />
          <span>تم حفظ كافة تعديلات المتجر، الدومين الفرعي، الثيم المختار، الخط والأقسام وطرق الدفع بنجاح في السيرفر! ✅</span>
        </div>
      )}

      {/* 🌟 تبويبات قسم المتجر وصفحات الهبوط */}
      <div className="flex items-center gap-2.5 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700/80 w-full sm:w-auto">
        <button
          type="button"
          onClick={() => setActiveMainTab('store')}
          className={`px-6 py-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer flex-1 sm:flex-none ${
            activeMainTab === 'store'
              ? 'bg-teal-700 text-white shadow-md shadow-teal-700/25 scale-102'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-700/60'
          }`}
        >
          <StoreIcon className="size-4" />
          <span>أولاً: إعدادات المتجر الإلكتروني والثيمات</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMainTab('landing')}
          className={`px-6 py-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer flex-1 sm:flex-none ${
            activeMainTab === 'landing'
              ? 'bg-teal-700 text-white shadow-md shadow-teal-700/25 scale-102'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-700/60'
          }`}
        >
          <Sparkles className="size-4 text-amber-400" />
          <span>ثانياً: قسم صفحة الهبوط (Landing Pages)</span>
        </button>
      </div>

      {activeMainTab === 'landing' ? (
        <LandingPageBuilderPage />
      ) : (
        <>
          {/* Main Form & Configuration Panel */}
          <form onSubmit={handleSaveAllChanges} className="space-y-6">
        {/* ========================================================================= */}
        {/* 1. اسم المتجر والدومين الفرعي                                           */}
        {/* ========================================================================= */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-2xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
                <Globe className="size-5" />
              </span>
              <div>
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                  الدومين الفرعي واسم المتجر
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  رابط متجرك الحصري المباشر على منصة الزعيم.
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all"
            >
              {isSaving ? <RefreshCw className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
              <span>حفظ التعديلات</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* اسم المتجر */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                اسم المتجر المختار <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 px-3.5 focus-within:border-teal-600 transition-colors">
                <StoreIcon className="size-4 text-slate-400 shrink-0 ml-1.5" />
                <input
                  type="text"
                  required
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="مثال: متجر الزعيم للإلكترونيات"
                  className="flex-1 h-11 bg-transparent text-sm font-bold text-slate-900 dark:text-white outline-none"
                />
              </div>
            </div>

            {/* الدومين الفرعي */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                الدومين الفرعي المحجوز (Subdomain) <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 px-3.5 focus-within:border-teal-600 overflow-hidden transition-colors">
                <span className="text-xs font-mono text-slate-400 select-none ml-1">https://</span>
                <input
                  type="text"
                  required
                  value={subdomainInput}
                  onChange={(e) => setSubdomainInput(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  placeholder="alzaeem"
                  dir="ltr"
                  className="flex-1 h-11 bg-transparent text-sm font-mono font-bold text-teal-700 dark:text-teal-400 outline-none text-right"
                />
                <span className="text-xs font-mono font-bold text-teal-800 dark:text-teal-300 bg-teal-100 dark:bg-teal-950 px-2.5 py-1 rounded-lg select-none mr-1.5">
                  .za3em.shop
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. الثيمات المجانية والمدفوعة الخاصة باشتراك برو                          */}
        {/* ========================================================================= */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-2xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
                <Palette className="size-5" />
              </span>
              <div>
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>ثيمات المتجر (المجانية والمدفوعة الخاصة باشتراك برو)</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  اختر المظهر الأنسب لنوع منتجاتك مع سلة شراء مدمجة وسرعة فائقة.
                </p>
              </div>
            </div>

            {/* Filter: All / Free / Pro */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setTemplateFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  templateFilter === 'all'
                    ? 'bg-white dark:bg-slate-900 text-teal-800 dark:text-teal-300 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                جميع الثيمات ({Object.keys(ALL_STORE_TEMPLATES).length})
              </button>
              <button
                type="button"
                onClick={() => setTemplateFilter('free')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  templateFilter === 'free'
                    ? 'bg-white dark:bg-slate-900 text-teal-800 dark:text-teal-300 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                المجانية فقط
              </button>
              <button
                type="button"
                onClick={() => setTemplateFilter('pro')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                  templateFilter === 'pro'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                    : 'text-amber-600 dark:text-amber-400'
                }`}
              >
                <Crown className="size-3" />
                <span>اشتراك برو (PRO)</span>
              </button>
            </div>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {templateEntries.map(([key, tpl]) => {
              const isSelected = activeTemplate === tpl.id;

              return (
                <div
                  key={key}
                  onClick={() => setActiveTemplate(tpl.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                    isSelected
                      ? 'bg-teal-50/70 dark:bg-teal-950/50 border-teal-500 shadow-md ring-2 ring-teal-500/30'
                      : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  {/* Pro / Free Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`size-3 rounded-full ${tpl.colorDot}`} />
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                        {tpl.name}
                      </h4>
                    </div>

                    {tpl.isPro ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 flex items-center gap-1 shadow-sm">
                        <Crown className="size-3" /> مدفوع (PRO)
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                        ثيم مجاني
                      </span>
                    )}
                  </div>

                  <p className="text-xs font-bold text-slate-400 font-mono">{tpl.nameEn}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed line-clamp-2">
                    {tpl.niche}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-slate-400">{tpl.badge}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTemplate(tpl.id);
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        isSelected
                          ? 'bg-teal-700 text-white font-black'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {isSelected ? 'المفعل حالياً ✓' : 'تفعيل هذا الثيم'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. خط المتجر (Store Typography)                                          */}
        {/* ========================================================================= */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <span className="p-2.5 rounded-2xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
              <Type className="size-5" />
            </span>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                خط المتجر والخطوط العربية (Typography)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                اختر الخط المعتمد لعناوين ونصوص متجرك الإلكتروني.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {STORE_FONTS.map((f) => {
              const isSelected = storeFont === f.id;

              return (
                <div
                  key={f.id}
                  onClick={() => setStoreFont(f.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-teal-50/70 dark:bg-teal-950/50 border-teal-500 ring-2 ring-teal-500/20 shadow-sm'
                      : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                      {f.name}
                    </span>
                    {isSelected && (
                      <span className="size-5 rounded-full bg-teal-700 text-white grid place-items-center">
                        <Check className="size-3" />
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500">{f.desc}</p>
                  <div
                    style={{ fontFamily: f.id }}
                    className="mt-3 p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 text-center"
                  >
                    تجربة الخط: تسوق أرقى المنتجات مع الشحن السريع
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. أقسام المتجر والتصنيفات (Categories Management)                       */}
        {/* ========================================================================= */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-2xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
                <Tag className="size-5" />
              </span>
              <div>
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                  أقسام وتصنيفات المتجر (Categories)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  أضف وعدل الأقسام التي تظهر في شريط التنقل لتصنيف المنتجات.
                </p>
              </div>
            </div>
          </div>

          {/* Add Category Input */}
          <div className="flex gap-2 max-w-md">
            <input
              type="text"
              value={newCategoryInput}
              onChange={(e) => setNewCategoryInput(e.target.value)}
              placeholder="اكتب اسم القسم الجديد (مثال: أزياء نسائية)"
              className="flex-1 h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs outline-none focus:border-teal-600"
            />
            <button
              type="button"
              onClick={handleAddCategory}
              className="px-4 h-11 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow-sm transition-all"
            >
              <Plus className="size-4" />
              <span>إضافة قسم</span>
            </button>
          </div>

          {/* Categories List */}
          <div className="flex flex-wrap gap-2 pt-2">
            {categories.map((cat, idx) => (
              <div
                key={idx}
                className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200"
              >
                {editingCategoryIdx === idx ? (
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={editingCategoryVal}
                      onChange={(e) => setEditingCategoryVal(e.target.value)}
                      className="h-7 px-2 rounded border border-teal-500 bg-white dark:bg-slate-900 text-xs outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleSaveEditCategory(idx)}
                      className="p-1 rounded text-emerald-600 hover:bg-emerald-50"
                    >
                      <Check className="size-3.5" />
                    </button>
                  </div>
                ) : (
                  <>
                    <span>{cat}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingCategoryIdx(idx);
                        setEditingCategoryVal(cat);
                      }}
                      className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                      title="تعديل اسم القسم"
                    >
                      <Edit2 className="size-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(idx)}
                      className="p-1 text-slate-400 hover:text-red-500"
                      title="حذف القسم"
                    >
                      <Trash2 className="size-3" />
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 5. خيارات وطرق الدفع في المتجر                                           */}
        {/* ========================================================================= */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <span className="p-2.5 rounded-2xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
              <Wallet className="size-5" />
            </span>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                خيارات وطرق الدفع المتاحة لزبائنك
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                فعل وسائل الدفع التي ترغب باستقبال أموال الطلبات من خلالها.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. COD */}
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <DollarSign className="size-4 text-emerald-600" />
                  <span className="font-extrabold text-xs text-slate-900 dark:text-white">
                    الدفع عند الاستلام نقداً (Cash on Delivery)
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  الخيار الأوسع انتشاراً في العراق، تحصيل المبالغ وتصفيتها أسبوعياً.
                </p>
              </div>

              <input
                type="checkbox"
                checked={paymentMethods.cod}
                onChange={(e) => setPaymentMethods({ ...paymentMethods, cod: e.target.checked })}
                className="size-5 accent-teal-600 cursor-pointer rounded"
              />
            </div>

            {/* 2. Zain Cash */}
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Smartphone className="size-4 text-purple-600" />
                    <span className="font-extrabold text-xs text-slate-900 dark:text-white">
                      محفظة زين كاش العراق (Zain Cash)
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    استلام الدفع الإلكتروني المباشر من الزبائن على رقم محفظتك.
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={paymentMethods.zainCash}
                  onChange={(e) => setPaymentMethods({ ...paymentMethods, zainCash: e.target.checked })}
                  className="size-5 accent-teal-600 cursor-pointer rounded"
                />
              </div>

              {paymentMethods.zainCash && (
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">
                    رقم هاتف محفظة زين كاش لاستلام التحويلات:
                  </label>
                  <input
                    type="text"
                    value={paymentMethods.zainCashPhone}
                    onChange={(e) => setPaymentMethods({ ...paymentMethods, zainCashPhone: e.target.value })}
                    placeholder="07801234567"
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono outline-none focus:border-teal-600"
                  />
                </div>
              )}
            </div>

            {/* 3. Qi Card & Mastercard */}
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <CreditCard className="size-4 text-blue-600" />
                  <span className="font-extrabold text-xs text-slate-900 dark:text-white">
                    بطاقات ماستركارد وكي كارد (Qi Card / Visa)
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  بوابة الدفع الإلكتروني المصرفية للبطاقات المحلية والدولية.
                </p>
              </div>

              <input
                type="checkbox"
                checked={paymentMethods.qiCard}
                onChange={(e) => setPaymentMethods({ ...paymentMethods, qiCard: e.target.checked })}
                className="size-5 accent-teal-600 cursor-pointer rounded"
              />
            </div>

            {/* 4. AsiaHawala */}
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Smartphone className="size-4 text-amber-600" />
                    <span className="font-extrabold text-xs text-slate-900 dark:text-white">
                      آسيابوالة / تحويل رصيد مباشر (AsiaHawala)
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    تحويل مباشر إلى رقم آسياسيل أو محفظة آسيابوالة.
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={paymentMethods.asiaHawala}
                  onChange={(e) => setPaymentMethods({ ...paymentMethods, asiaHawala: e.target.checked })}
                  className="size-5 accent-teal-600 cursor-pointer rounded"
                />
              </div>

              {paymentMethods.asiaHawala && (
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">
                    رقم هاتف التحويل لـ آسيابوالة:
                  </label>
                  <input
                    type="text"
                    value={paymentMethods.asiaHawalaPhone}
                    onChange={(e) => setPaymentMethods({ ...paymentMethods, asiaHawalaPhone: e.target.value })}
                    placeholder="07701234567"
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono outline-none focus:border-teal-600"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Global Save Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="px-8 h-12 bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white font-extrabold text-sm rounded-xl shadow-lg flex items-center gap-2 transition-all hover:scale-105 cursor-pointer"
          >
            {isSaving ? <RefreshCw className="size-4 animate-spin" /> : <Save className="size-4" />}
            <span>حفظ وتطبيق التعديلات على المتجر والسيرفر</span>
          </button>
        </div>
      </form>

      {/* ========================================================================= */}
      {/* 6. المعاينة الحية للمتجر بالقالب والخط المختار                          */}
      {/* ========================================================================= */}
      <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Eye className="size-5 text-teal-700 dark:text-teal-400" />
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              المعاينة الحية للمتجر ({ALL_STORE_TEMPLATES[activeTemplate]?.name || activeTemplate}) — بخط {storeFont}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {/* Viewport switcher: Desktop vs Mobile */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setPreviewViewport('desktop')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                  previewViewport === 'desktop'
                    ? 'bg-white dark:bg-slate-900 text-teal-800 dark:text-teal-300 shadow-sm'
                    : 'text-slate-500'
                }`}
              >
                <Monitor className="size-3.5" />
                <span>حاسوب</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewViewport('mobile')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                  previewViewport === 'mobile'
                    ? 'bg-white dark:bg-slate-900 text-teal-800 dark:text-teal-300 shadow-sm'
                    : 'text-slate-500'
                }`}
              >
                <Smartphone className="size-3.5" />
                <span>موبايل</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowLivePreview(!showLivePreview)}
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50"
            >
              {showLivePreview ? 'إخفاء المعاينة' : 'إظهار المعاينة'}
            </button>
          </div>
        </div>

        {showLivePreview && (
          <div
            style={{ fontFamily: storeFont }}
            className={`mx-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-2xl transition-all duration-300 ${
              previewViewport === 'mobile' ? 'max-w-sm' : 'w-full'
            }`}
          >
            {/* If Inactive Notice */}
            {!isStoreActive && (
              <div className="p-3 bg-rose-500 text-white text-xs font-bold text-center flex items-center justify-center gap-2">
                <span className="size-2 rounded-full bg-white animate-pulse" />
                <span>المتجر معطل حالياً (تحت الصيانة) ولن يظهر للزبائن إلا بعد تفعيله</span>
              </div>
            )}

            <StoreTemplates
              storeName={storeName}
              subdomain={subdomain}
              activeTemplateId={activeTemplate}
              onTemplateChange={(tpl) => setActiveTemplate(tpl)}
              customProduct={storeData?.product}
              storeCode={storeCode}
              logoUrl={storeData?.logoUrl}
            />
          </div>
        )}
      </div>
    </>
  )}
</div>
);
}
