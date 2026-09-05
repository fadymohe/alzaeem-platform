import { useState, useEffect } from 'react';
import {
  Store as StoreIcon, ExternalLink, Copy, Check, Sparkles, Globe,
  Layers, Eye, RefreshCw, Zap, CheckCircle2, Palette, Save, ArrowLeft,
  ArrowUpRight, ShieldCheck, Box, Truck, Package, Store
} from 'lucide-react';
import { formatIQD } from '../data/iraqData';
import { StoreTemplates, type TemplateId, TEMPLATES_MAP } from '../components/storefront/StoreTemplates';
import { getStoredOrders, getStoredProducts } from '../data/storeState';
import { getRegisteredStore, type RegisteredStoreData, updateStoreActiveStatus } from '../utils/storeRegistry';

const TEMPLATE_NAMES: Record<string, string> = {
  'shoppingcart.1.2.7': 'سلة التسوق الشاملة (shoppingcart.1.2.7)',
  'volt': 'فولت إكسبريس للتقنية (Volt Tech)',
  'rose': 'روز أتيليه للأزياء والجمال (Rose Atelier)',
  'nitro': 'نيترو سبورت الرياضي (Nitro Sports)',
  'sepia': 'هاير الملكي للساعات والعطور (Royal Sepia)',
  'oret': 'أوريت إكسبريس (Oret Express)',
  'easyorders-flash': 'فلاش لاندينج للشراء الفوري (EasyOrders Flash)',
  'nova': 'نوفا الملكي للأزياء (Nova Royal)',
  'classic': 'كلاسيك الفاخر للعطور (Classic Luxury)',
  'aurit': 'أوريت التقني للإلكترونيات (Aurit Tech)',
  'brick': 'بريك التجاري المتقدم (Brick Commerce)',
};

export function StorePage() {
  const [copied, setCopied] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [storeName, setStoreName] = useState('متجر الزعيم الذهبي');
  const [subdomainInput, setSubdomainInput] = useState('alzaeem');
  const [subdomain, setSubdomain] = useState('alzaeem');
  const [activeTemplate, setActiveTemplate] = useState<TemplateId>('shoppingcart.1.2.7');
  const [saveSuccessAlert, setSaveSuccessAlert] = useState(false);
  const [storeData, setStoreData] = useState<RegisteredStoreData | null>(null);
  const [isStoreActive, setIsStoreActive] = useState<boolean>(() => {
    try {
      return localStorage.getItem('zaeem_store_active') !== 'false';
    } catch {
      return true;
    }
  });

  useEffect(() => {
    try {
      const hash = window.location.hash;
      const searchParams = new URLSearchParams(window.location.search);
      const queryStore = searchParams.get('store') || searchParams.get('subdomain');
      const hashStoreMatch = hash.match(/#\/store\/([a-zA-Z0-9-]+)/);
      const hostSubdomainMatch = window.location.hostname.match(/^([a-zA-Z0-9-]+)\.za3em\.shop$/);

      const targetSub = hostSubdomainMatch?.[1] || queryStore || hashStoreMatch?.[1];

      if (targetSub && targetSub !== 'www' && targetSub !== 'za3em') {
        const cleanSub = targetSub.toLowerCase().replace(/[^a-z0-9-]/g, '');
        setSubdomain(cleanSub);
        setSubdomainInput(cleanSub);

        const registered = getRegisteredStore(cleanSub);
        if (registered) {
          if (registered.storeName) setStoreName(registered.storeName);
          if (registered.templateId && TEMPLATES_MAP[registered.templateId as TemplateId]) {
            setActiveTemplate(registered.templateId as TemplateId);
          }
          setStoreData(registered);
          return;
        }
      }

      const stored = localStorage.getItem('zaeem_store_data') || localStorage.getItem('zaeem_onboarded_store');
      const rawUser = localStorage.getItem('zaeem_user');
      let userObj: any = null;
      if (rawUser) {
        try { userObj = JSON.parse(rawUser); } catch {}
      }

      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.storeName) setStoreName(parsed.storeName);
        else if (userObj?.storeName) setStoreName(userObj.storeName);

        if (parsed.subdomain && !targetSub) {
          const cleanSub = parsed.subdomain.replace(/\.alzaeem\.iq|\.zaeem\.iq|\.za3em\.shop/g, '').replace(/^https?:\/\//, '');
          setSubdomain(cleanSub);
          setSubdomainInput(cleanSub);
        } else if (userObj?.subdomain && !targetSub) {
          const cleanSub = userObj.subdomain.replace(/\.za3em\.shop/g, '').replace(/^https?:\/\//, '');
          setSubdomain(cleanSub);
          setSubdomainInput(cleanSub);
        }

        if (parsed.selectedTheme && TEMPLATES_MAP[parsed.selectedTheme as TemplateId]) {
          setActiveTemplate(parsed.selectedTheme as TemplateId);
        }
        setStoreData(parsed);
      } else if (userObj) {
        if (userObj.storeName) setStoreName(userObj.storeName);
        if (userObj.subdomain) {
          const cleanSub = userObj.subdomain.replace(/\.za3em\.shop/g, '').replace(/^https?:\/\//, '');
          setSubdomain(cleanSub);
          setSubdomainInput(cleanSub);
        }
      }

      const activeVal = localStorage.getItem('zaeem_store_active');
      if (activeVal !== null) setIsStoreActive(activeVal !== 'false');
    } catch (e) {}

    const handleUpdate = () => {
      const active = localStorage.getItem('zaeem_store_active');
      if (active !== null) setIsStoreActive(active !== 'false');
    };
    window.addEventListener('zaeem_store_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('zaeem_store_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const fullDomain = `${subdomain}.za3em.shop`;
  const fullUrl = `https://${fullDomain}`;
  const directHashUrl = `/#/store/${subdomain}`;

  const handleToggleStoreActive = async () => {
    const nextState = !isStoreActive;
    setIsStoreActive(nextState);
    await updateStoreActiveStatus(subdomain, nextState);
  };

  // Apply and save changes to Name, Subdomain, and Theme
  const handleSaveAllChanges = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanSub = (subdomainInput || subdomain || 'shop').toLowerCase().replace(/[^a-z0-9-]/g, '');
    const cleanName = storeName.trim() || `متجر ${cleanSub}`;

    setSubdomain(cleanSub);
    setStoreName(cleanName);

    try {
      const stored = localStorage.getItem('zaeem_store_data') || localStorage.getItem('zaeem_onboarded_store') || '{}';
      const parsed = JSON.parse(stored);
      parsed.selectedTheme = activeTemplate;
      parsed.templateId = activeTemplate;
      parsed.subdomain = `${cleanSub}.za3em.shop`;
      parsed.storeName = cleanName;
      parsed.isActive = isStoreActive;

      localStorage.setItem('zaeem_store_data', JSON.stringify(parsed));
      localStorage.setItem('zaeem_onboarded_store', JSON.stringify(parsed));

      const rawUser = localStorage.getItem('zaeem_user');
      if (rawUser) {
        const u = JSON.parse(rawUser);
        u.storeName = cleanName;
        u.subdomain = `${cleanSub}.za3em.shop`;
        localStorage.setItem('zaeem_user', JSON.stringify(u));
      }

      await updateStoreActiveStatus(cleanSub, isStoreActive);

      // Sync with DB API if available
      fetch('/api/stores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: cleanName,
          subdomain: `${cleanSub}.za3em.shop`,
          theme: activeTemplate,
          country: 'Iraq',
          category: 'Retail'
        })
      }).catch(() => {});

      // Dispatch global sync event for Sidebar and Dashboard
      window.dispatchEvent(new CustomEvent('zaeem_store_updated'));
    } catch (e) {}

    setSaveSuccessAlert(true);
    setTimeout(() => setSaveSuccessAlert(false), 4000);
  };

  const handleSelectTemplate = (id: TemplateId) => {
    setActiveTemplate(id);
    try {
      const stored = localStorage.getItem('zaeem_store_data') || localStorage.getItem('zaeem_onboarded_store') || '{}';
      const parsed = JSON.parse(stored);
      parsed.selectedTheme = id;
      parsed.templateId = id;
      localStorage.setItem('zaeem_store_data', JSON.stringify(parsed));
      localStorage.setItem('zaeem_onboarded_store', JSON.stringify(parsed));
      window.dispatchEvent(new CustomEvent('zaeem_store_updated'));
    } catch {}
  };

  const copyStoreLink = () => {
    navigator.clipboard?.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard?.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const storeProducts = getStoredProducts();
  const storeCode = storeData?.storeCode || (typeof window !== 'undefined' ? (JSON.parse(localStorage.getItem('zaeem_onboarded_store') || '{}')?.storeCode || `ZAEEM-${subdomain.toUpperCase().slice(0, 4)}-${Math.floor(1000 + Math.random() * 9000)}`) : 'ZAEEM-882194');
  const templateLabel = TEMPLATE_NAMES[activeTemplate] || TEMPLATES_MAP[activeTemplate]?.name || activeTemplate;

  return (
    <div className="space-y-7 rf-appear">
      {/* Top Title Bar */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-teal-700 dark:text-teal-400 mb-1">
            <StoreIcon className="size-4" /> المتجر الإلكتروني
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5 flex-wrap">
            <span>تعديل المتجر، الثيمات، والدومين الفرعي</span>
            <span className="text-xs font-mono font-bold bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 px-3.5 py-1 rounded-full border border-teal-300/50 flex items-center gap-1.5 dir-ltr">
              <span className="size-2 rounded-full bg-emerald-500 animate-ping" />
              {fullDomain}
            </span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            خصص هوية متجرك، اختر الثيم الأنسب لمنتجاتك، وحدد اسم المتجر والدومين الفرعي المحجوز مع حفظ فوري.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* شارة ومفتاح تنشيط الموقع الفرعي */}
          <div className="flex items-center gap-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3.5 py-1.5 rounded-xl shadow-sm">
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-black flex items-center gap-1.5 ${
              isStoreActive
                ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30'
                : 'bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-500/30'
            }`}>
              <span className={`size-1.5 rounded-full ${isStoreActive ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
              {isStoreActive ? 'الموقع نشط' : 'الموقع معطل'}
            </span>

            <div dir="ltr" className="inline-flex items-center">
              <button
                type="button"
                onClick={handleToggleStoreActive}
                className={`relative inline-flex h-6 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none shadow-inner ${
                  isStoreActive ? 'bg-emerald-500 hover:bg-emerald-400' : 'bg-slate-400 dark:bg-slate-700'
                }`}
                role="switch"
                aria-checked={isStoreActive}
                title={isStoreActive ? 'اضغط لإلغاء تنشيط المتجر' : 'اضغط لتنشيط المتجر'}
              >
                <span
                  className={`pointer-events-none flex items-center justify-center size-5 transform rounded-full bg-white shadow-md ring-0 transition-transform duration-300 ease-in-out ${
                    isStoreActive ? 'translate-x-6' : 'translate-x-0'
                  }`}
                >
                  <span className={`size-1 rounded-full ${isStoreActive ? 'bg-emerald-600' : 'bg-slate-400'}`} />
                </span>
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={copyStoreLink}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-950 flex items-center gap-1.5 shadow-sm transition-colors"
          >
            {copied ? <Check className="size-4 text-emerald-600" /> : <Copy className="size-4" />}
            <span>{copied ? 'تم نسخ الرابط' : 'نسخ الرابط'}</span>
          </button>
          <a
            href={directHashUrl}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all"
          >
            <span>معاينة المتجر أونلاين</span>
            <ExternalLink className="size-3.5" />
          </a>
        </div>
      </div>

      {/* 🌟 كارت المتجر الإلكتروني المباشر والرمز التعريفي الفريد */}
      <div className="rounded-3xl border border-teal-500/30 bg-gradient-to-br from-[#0c1322] via-[#0d1628] to-[#0a1a24] text-white p-6 md:p-7 shadow-xl relative overflow-hidden">
        <div className="absolute -top-16 -right-16 size-48 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 size-48 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-5">
          {/* Top Bar: Store Name & Status Badges */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-3">
              <div className="size-12 rounded-2xl bg-teal-500/20 border border-teal-500/40 text-teal-300 grid place-items-center shrink-0 shadow-md shadow-teal-500/20">
                <Store className="size-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl md:text-2xl font-black text-white">
                    {storeName}
                  </h2>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black transition-colors ${
                    isStoreActive
                      ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-300'
                      : 'bg-rose-950/80 border border-rose-500/40 text-rose-300'
                  }`}>
                    <span className={`size-2 rounded-full ${isStoreActive ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                    {isStoreActive ? 'متجرك نشط ومطلق أونلاين' : 'المتجر موقوف مؤقتاً (معطل)'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-1 font-mono dir-ltr">
                  <Globe className="size-3.5 text-teal-400 shrink-0" />
                  <span className="text-teal-300 font-bold">{fullUrl}</span>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleCopyLink(fullUrl)}
                className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedLink ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
                <span>{copiedLink ? 'تم نسخ الرابط' : 'نسخ الرابط'}</span>
              </button>

              <a
                href={`/#/store/${subdomain}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>معاينة داخلية</span>
                <ExternalLink className="size-3.5" />
              </a>

              <a
                href={fullUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-md shadow-teal-500/20 transition-all cursor-pointer"
              >
                <span>فتح المتجر الحي أونلاين</span>
                <ArrowUpRight className="size-4" />
              </a>
            </div>
          </div>

          {/* Core Info Grid: Store Code & Template & Product */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. Monospace Store Identifier Box */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-teal-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                  <ShieldCheck className="size-3.5 text-teal-400" />
                  الرمز التعريفي الفريد لمتجرك
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyCode(storeCode)}
                  className="text-[11px] font-bold text-teal-400 hover:text-teal-300 flex items-center gap-1 cursor-pointer bg-teal-950/60 px-2 py-0.5 rounded-lg border border-teal-800/60"
                >
                  {copiedCode ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
                  <span>{copiedCode ? 'تم النسخ' : 'نسخ'}</span>
                </button>
              </div>
              <div className="font-mono text-lg md:text-xl font-black text-teal-300 tracking-wider">
                {storeCode}
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                يُستخدم لربط المتجر مع بوابات الدفع وزين كاش وعقود الشحن مع شركة الزعيم.
              </p>
            </div>

            {/* 2. Bound Website Template Box */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                <Layers className="size-3.5 text-blue-400" />
                قالب المتجر المربوط
              </span>
              <div className="text-sm font-extrabold text-white line-clamp-1">
                {templateLabel}
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                تصميم متجاوب بالكامل وسريع التحميل مع سلة شراء مدمجة ودفع عند الاستلام.
              </p>
              <div className="pt-1">
                <a
                  href="#themes-section"
                  className="text-[11px] font-bold text-blue-400 hover:underline inline-flex items-center gap-1"
                >
                  <span>تغيير أو تخصيص القالب ↓</span>
                </a>
              </div>
            </div>

            {/* 3. Manually Added Product / Catalog Hook */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                <Package className="size-3.5 text-amber-400" />
                المنتج الأساسي في المتجر
              </span>
              <div className="flex items-center gap-2">
                {storeData?.product?.image || storeData?.product?.imageUrl ? (
                  <img
                    src={storeData.product.image || storeData.product.imageUrl}
                    alt={storeData.product.name || storeData.product.title}
                    className="size-10 rounded-xl object-cover border border-slate-700 shrink-0"
                  />
                ) : (
                  <div className="size-10 rounded-xl bg-slate-800 grid place-items-center text-slate-400 shrink-0">
                    <Box className="size-5" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-white truncate">
                    {storeProducts.length > 0 ? (storeData?.product?.name || storeData?.product?.title || storeProducts[0]?.name) : 'لم يتم إضافة منتجات بعد'}
                  </p>
                  <p className="text-xs font-mono font-black text-amber-400">
                    {storeProducts.length > 0 ? formatIQD(storeData?.product?.price || storeProducts[0]?.price || 0) : '0 د.ع'}
                  </p>
                </div>
              </div>
              <div className="pt-1">
                <a
                  href="/products"
                  className="text-[11px] font-bold text-amber-400 hover:underline inline-flex items-center gap-1"
                >
                  <span>إدارة الكتالوج ({storeProducts.length} منتجات) ←</span>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Logistics Strip */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80 text-xs text-slate-300">
            <div className="flex items-center gap-2 font-bold text-teal-300">
              <Truck className="size-4 text-teal-400 shrink-0" />
              <span>رصيد 5 شحنات مجانية مفعل لمتجرك مع أسطول الزعيم لتوصيل كافة محافظات العراق!</span>
            </div>
            <a
              href="/shipments/new"
              className="text-xs font-bold text-teal-400 hover:text-teal-300 underline"
            >
              شحن أول طلب الآن ←
            </a>
          </div>
        </div>
      </div>

      {/* 🛠️ محرك تعديل الثيمات واسم الموقع والدومين الفرعي */}
      <div id="themes-section" className="rounded-3xl border border-teal-500/30 bg-gradient-to-br from-slate-900 via-[#0d1628] to-slate-950 p-6 md:p-8 shadow-xl space-y-6 text-white">
        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-teal-500/20 border border-teal-500/40 text-teal-300 grid place-items-center">
              <Palette className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white">إعدادات هوية المتجر والثيم المختار</h2>
              <p className="text-xs text-slate-400">أي تعديل هنا يطبّق فورياً على متجرك وعلى رابط الزبائن المباشر.</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleSaveAllChanges()}
            className="px-6 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs rounded-xl shadow-lg flex items-center gap-2 transition-transform hover:scale-105 cursor-pointer"
          >
            <Save className="size-4" />
            <span>حفظ وتطبيق التعديلات</span>
          </button>
        </div>

        {saveSuccessAlert && (
          <div className="p-4 rounded-2xl bg-emerald-950/90 border border-emerald-500/60 text-xs font-bold text-emerald-200 flex items-center gap-2.5 animate-bounce">
            <CheckCircle2 className="size-5 text-emerald-400 shrink-0" />
            <span>تم حفظ اسم المتجر ({storeName}) والدومين الفرعي ({subdomain}.za3em.shop) والثيم بنجاح وتحديث الداش بورد!</span>
          </div>
        )}

        {/* Form: Store Name & Subdomain */}
        <form onSubmit={handleSaveAllChanges} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* 1. اسم الموقع / المتجر */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300">
              اسم الموقع / المتجر المختار <span className="text-teal-400">*</span>
            </label>
            <div className="flex items-center bg-slate-950 rounded-2xl border border-slate-700/80 focus-within:border-teal-500 px-4 transition-colors">
              <StoreIcon className="size-4 text-slate-400 pl-1 shrink-0" />
              <input
                type="text"
                required
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="مثال: متجر الزعيم للإلكترونيات"
                className="flex-1 h-12 bg-transparent text-sm font-bold text-white outline-none px-2"
              />
            </div>
            <p className="text-[11px] text-slate-400">
              يظهر في ترويسة المتجر، الفواتير، ورسائل تأكيد الطلب للزبائن.
            </p>
          </div>

          {/* 2. الدومين الفرعي المحجوز */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300">
              الدومين الفرعي المحجوز (Subdomain) <span className="text-teal-400">*</span>
            </label>
            <div className="flex items-center bg-slate-950 rounded-2xl border border-slate-700/80 focus-within:border-teal-500 overflow-hidden px-4 transition-colors">
              <span className="text-xs font-mono text-slate-400 pl-1 select-none">https://</span>
              <input
                type="text"
                required
                value={subdomainInput}
                onChange={(e) => setSubdomainInput(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                placeholder="mystore"
                dir="ltr"
                className="flex-1 h-12 bg-transparent text-sm font-mono font-bold text-teal-300 outline-none px-2"
              />
              <span className="text-xs font-mono font-bold text-teal-400 bg-slate-900 px-3 py-1 rounded-xl select-none">
                .za3em.shop
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              الرابط الدائم لمتجرك لمشاركته على إنستغرام، تيك توك وفيسبوك.
            </p>
          </div>
        </form>

        {/* 3. اختيار وتعديل الثيمات (Themes Selector) */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Layers className="size-4 text-teal-400" />
              <span>اختر ثيم وقالب المتجر (اضغط على أي ثيم للتفعيل الفوري)</span>
            </label>
            <span className="text-xs font-mono text-teal-400">
              الثيم المفعل حالياً: <b>{TEMPLATES_MAP[activeTemplate]?.name || activeTemplate}</b>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(Object.keys(TEMPLATES_MAP) as TemplateId[]).map((tplId) => {
              const tpl = TEMPLATES_MAP[tplId];
              const isSelected = activeTemplate === tplId;

              return (
                <div
                  key={tplId}
                  onClick={() => handleSelectTemplate(tplId)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                    isSelected
                      ? 'bg-teal-950/60 border-teal-500 shadow-lg shadow-teal-500/20 ring-2 ring-teal-500/40'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                  }`}
                >
                  {/* Selected Pill */}
                  {isSelected && (
                    <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-teal-500 text-slate-950 flex items-center gap-1">
                      <Check className="size-3" /> مفعّل حالياً
                    </span>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className={`size-3 rounded-full ${
                        tplId === 'volt' ? 'bg-emerald-400' :
                        tplId === 'rose' ? 'bg-rose-400' :
                        tplId === 'nitro' ? 'bg-red-500' :
                        tplId === 'sepia' ? 'bg-amber-400' :
                        tplId === 'oret' ? 'bg-cyan-400' : 'bg-teal-400'
                      }`} />
                      <h4 className="font-extrabold text-sm text-white">{tpl.name}</h4>
                    </div>
                    <p className="text-xs font-bold text-slate-400">{tpl.nameEn}</p>
                    <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-2">
                      {tpl.niche}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-slate-400">{tpl.badge}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectTemplate(tplId);
                        handleSaveAllChanges();
                      }}
                      className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
                        isSelected
                          ? 'bg-teal-500 text-slate-950 font-black'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                      }`}
                    >
                      {isSelected ? 'القالب المختار ✓' : 'اختيار هذا الثيم'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 🌟 المعاينة الحية للمتجر بالقالب المختار */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="size-5 text-teal-700 dark:text-teal-400" />
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              معاينة حية للمتجر بالقالب المختار ({TEMPLATES_MAP[activeTemplate]?.name})
            </h3>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            تحديث فوري مع أي تعديل في الاسم أو الثيم
          </span>
        </div>

        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xl space-y-3">
          {!isStoreActive && (
            <div className="p-4 bg-rose-500/10 border-b border-rose-500/30 text-rose-300 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <span className="size-3 rounded-full bg-rose-500 animate-pulse shrink-0" />
                <div>
                  <p className="text-xs font-black text-rose-400">حالة المتجر الحالية: معطل مؤقتاً (تحت الصيانة)</p>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    الموقع متوقف عن استقبال الطلبات خارجياً، وأي زائر للدومين يرى شاشة الصيانة. يمكنك إعادة تفعيله في أي وقت.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleToggleStoreActive}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition-colors cursor-pointer shadow"
              >
                تنشيط الموقع الآن أونلاين
              </button>
            </div>
          )}
          <StoreTemplates
            storeName={storeName}
            subdomain={subdomain}
            activeTemplateId={activeTemplate}
            onTemplateChange={handleSelectTemplate}
            customProduct={storeData?.product}
            storeCode={storeData?.storeCode}
            logoUrl={storeData?.logoUrl}
          />
        </div>
      </div>
    </div>
  );
}
