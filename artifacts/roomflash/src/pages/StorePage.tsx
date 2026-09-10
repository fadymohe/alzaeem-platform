import React, { useState, useEffect, type FormEvent } from 'react';
import { useLocation } from 'wouter';
import {
  Store as StoreIcon, ExternalLink, Copy, Check, Sparkles, Globe,
  Layers, Eye, RefreshCw, Zap, CheckCircle2, Palette, Save, ArrowLeft,
  ArrowUpRight, ShieldCheck, Box, Truck, Package, Plus, Trash2, Edit2,
  Smartphone, Monitor, CreditCard, DollarSign, Wallet, CheckSquare,
  Type, Lock, Crown, Tag, X, Search, Sliders, Play, Settings, Flame
} from 'lucide-react';
import { formatIQD } from '../data/iraqData';
import {
  StoreTemplates, type TemplateId, TEMPLATES_MAP, isMerchantPro, isPaidMerchantPro,
  isFreeTrialActive, getTrialTimeRemaining, checkAndEnforceThemeTrialExpiration,
  normalizeTemplateId, type TemplateConfig
} from '../components/storefront/StoreTemplates';
import { getStoredOrders, getStoredProducts } from '../data/storeState';
import { getRegisteredStore, type RegisteredStoreData, updateStoreActiveStatus, unregisterStore, registerStore } from '../utils/storeRegistry';
import { updateCloudStoreFullSettings, fetchCloudStore, releaseCloudSubdomain } from '../utils/cloudDb';
import { LandingPageBuilderPage } from './LandingPageBuilder';

export function StorePage() {
  const [, setLocation] = useLocation();

  const [copiedLink, setCopiedLink] = useState(false);
  const [saveSuccessAlert, setSaveSuccessAlert] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Main section tabs: ثيمات المتجر vs إعدادات الدومين والخط vs صفحات الهبوط
  const [activeMainTab, setActiveMainTab] = useState<'themes' | 'settings' | 'landing'>('themes');

  // 1. Basic Store Info & Subdomain
  const [storeName, setStoreName] = useState('متجر الزعيم');
  const [subdomainInput, setSubdomainInput] = useState('alzaeem');
  const [subdomain, setSubdomain] = useState('alzaeem');
  const [isStoreActive, setIsStoreActive] = useState<boolean>(true);
  const [activeTemplate, setActiveTemplate] = useState<TemplateId>('store-sprout');
  const [themeSearch, setThemeSearch] = useState('');
  const [selectedCategoryTab, setSelectedCategoryTab] = useState('الكل');

  // Pro Upgrade Warning Modal
  const [showProUpgradeModal, setShowProUpgradeModal] = useState(false);
  const [attemptedProTheme, setAttemptedProTheme] = useState<TemplateConfig | null>(null);

  // Live Preview Modal for themes
  const [previewThemeModal, setPreviewThemeModal] = useState<TemplateConfig | null>(null);

  // 2. Store Font & Typography
  const [storeFont, setStoreFont] = useState<string>('Tajawal');

  // 3. Store Categories / Sections
  const [categories, setCategories] = useState<string[]>(['عام', 'عطور فاخرة', 'إلكترونيات', 'أزياء']);
  const [newCategoryInput, setNewCategoryInput] = useState('');

  // 4. Payment Options
  const [paymentMethods, setPaymentMethods] = useState({
    cod: true,
    zainCash: true,
    zainCashPhone: '07801234567',
    qiCard: true,
    asiaHawala: false,
    asiaHawalaPhone: '07701234567',
  });

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

        if (parsed.selectedTheme) setActiveTemplate(normalizeTemplateId(parsed.selectedTheme));
        else if (parsed.templateId) setActiveTemplate(normalizeTemplateId(parsed.templateId));

        if (parsed.font) setStoreFont(parsed.font);
        if (Array.isArray(parsed.categories) && parsed.categories.length > 0) setCategories(parsed.categories);
        if (parsed.paymentMethods) setPaymentMethods(prev => ({ ...prev, ...parsed.paymentMethods }));
        if (typeof parsed.isActive === 'boolean') setIsStoreActive(parsed.isActive);
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

    fetchCloudStore(subdomain).then(record => {
      if (record) {
        if (record.name) setStoreName(record.name);
        if (record.template_id) setActiveTemplate(normalizeTemplateId(record.template_id));
        if (Array.isArray(record.categories) && record.categories.length > 0) setCategories(record.categories);
        if (typeof record.is_active === 'boolean') setIsStoreActive(record.is_active);
      }
    }).catch(() => {});

    // Enforce 3-day trial expiration: revert to free theme if 3 days have passed on free plan
    checkAndEnforceThemeTrialExpiration(subdomain).then(reverted => {
      if (reverted) {
        setActiveTemplate('store-sprout');
      }
    }).catch(() => {});
  }, []);

  const fullDomain = `${subdomain}.za3em.shop`;
  const fullUrl = `https://${fullDomain}`;

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

  // Switch Active Theme
  const handleApplyTheme = async (themeConfig: TemplateConfig) => {
    if (themeConfig.isPro && !isMerchantPro()) {
      setAttemptedProTheme(themeConfig);
      setShowProUpgradeModal(true);
      return;
    }

    setActiveTemplate(themeConfig.id);
    try {
      const raw = localStorage.getItem('zaeem_store_data') || '{}';
      const parsed = JSON.parse(raw);
      parsed.selectedTheme = themeConfig.id;
      parsed.templateId = themeConfig.id;
      localStorage.setItem('zaeem_store_data', JSON.stringify(parsed));
      window.dispatchEvent(new CustomEvent('zaeem_store_updated'));

      await updateCloudStoreFullSettings({
        subdomain,
        templateId: themeConfig.id
      });

      setSaveSuccessAlert(true);
      setTimeout(() => setSaveSuccessAlert(false), 3500);
    } catch {}
  };

  // Save Settings
  const handleSaveSettings = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);

    const cleanSub = (subdomainInput || subdomain || 'alzaeem').toLowerCase().replace(/[^a-z0-9-]/g, '');
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

      const products = getStoredProducts();

      // If subdomain was changed, release old and register new
      if (subdomain && cleanSub !== subdomain) {
        unregisterStore(subdomain);
        await releaseCloudSubdomain(subdomain);
        registerStore({
          subdomain: cleanSub,
          storeName: cleanName,
          templateId: activeTemplate,
          isActive: isStoreActive,
          logoUrl: parsed.logoUrl,
          bannerUrl: parsed.bannerUrl,
          slogan: parsed.slogan,
          products: products
        });
      }

      // Update cloud DB first with full store details and safe rename
      await updateCloudStoreFullSettings({
        subdomain: cleanSub,
        previousSubdomain: (subdomain && cleanSub !== subdomain) ? subdomain : undefined,
        name: cleanName,
        templateId: activeTemplate,
        font: storeFont,
        categories: categories,
        paymentMethods: paymentMethods,
        isActive: isStoreActive,
        logoUrl: parsed.logoUrl,
        bannerUrl: parsed.bannerUrl,
        slogan: parsed.slogan,
        products: products
      });

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

  const currentActiveThemeConfig = TEMPLATES_MAP[activeTemplate] || TEMPLATES_MAP['store-sprout'] || TEMPLATES_MAP['store-classic'];

  // Categories list for theme filtering
  const categoryFilters = ['الكل', 'أزياء', 'تجميل', 'أطعمة', 'إلكترونيات', 'منزل', 'أطفال'];

  const themeList = Object.values(TEMPLATES_MAP).filter(t => {
    const matchSearch = t.name.toLowerCase().includes(themeSearch.toLowerCase()) ||
      t.nameEn.toLowerCase().includes(themeSearch.toLowerCase()) ||
      t.niche.toLowerCase().includes(themeSearch.toLowerCase());

    const matchCategory = selectedCategoryTab === 'الكل' ||
      t.categoryTag.includes(selectedCategoryTab) ||
      (selectedCategoryTab === 'أزياء' && t.categoryTag.includes('أزياء')) ||
      (selectedCategoryTab === 'تجميل' && t.categoryTag.includes('تجميل')) ||
      (selectedCategoryTab === 'إلكترونيات' && t.categoryTag.includes('إلكترونيات')) ||
      (selectedCategoryTab === 'منزل' && t.categoryTag.includes('منزل')) ||
      (selectedCategoryTab === 'أطفال' && t.categoryTag.includes('أطفال'));

    return matchSearch && matchCategory;
  });

  return (
    <div className="space-y-7 rf-appear" dir="rtl">
      
      {/* 1. Header Bar */}
      <div className="flex flex-col gap-2 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-teal-700 dark:text-teal-400 mb-1">
            <StoreIcon className="size-4" /> قنوات البيع • المتجر الإلكتروني
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5 flex-wrap">
            <span>تصاميم وقوالب المتجر الإلكتروني</span>
            <span className="text-xs font-mono font-bold bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 px-3.5 py-1 rounded-full border border-teal-300/50 flex items-center gap-1.5 dir-ltr">
              <span className={`size-2 rounded-full ${isStoreActive ? 'bg-emerald-500 animate-ping' : 'bg-rose-500'}`} />
              {fullDomain}
            </span>
          </h1>
        </div>
      </div>

      {/* Alert Banner */}
      {saveSuccessAlert && (
        <div className="p-4 rounded-2xl bg-emerald-950/90 border border-emerald-500/60 text-xs font-bold text-emerald-200 flex items-center gap-2.5 animate-bounce shadow-lg">
          <CheckCircle2 className="size-5 text-emerald-400 shrink-0" />
          <span>تم تطبيق القالب وحفظ إعدادات المتجر بنجاح على الدومين ({fullDomain})! ✅</span>
        </div>
      )}

      {/* 2. Top Navigation Tabs (معرض الثيمات / إعدادات الدومين / صفحات الهبوط) */}
      <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700/80 w-full sm:w-auto overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveMainTab('themes')}
          className={`px-5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeMainTab === 'themes'
              ? 'bg-teal-700 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:text-white'
          }`}
        >
          <Palette className="size-4" />
          <span>معرض الثيمات الجاهزة</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMainTab('settings')}
          className={`px-5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeMainTab === 'settings'
              ? 'bg-teal-700 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:text-white'
          }`}
        >
          <Settings className="size-4" />
          <span>إعدادات الدومين والخط والدفع</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMainTab('landing')}
          className={`px-5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeMainTab === 'landing'
              ? 'bg-teal-700 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:text-white'
          }`}
        >
          <Sparkles className="size-4 text-amber-400" />
          <span>صفحات الهبوط (Landing Pages)</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: معرض الثيمات (Matching Baseet Screenshots 2, 3, 4, 5)             */}
      {/* ========================================================================= */}
      {activeMainTab === 'themes' && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* Active Applied Theme Card (Matching Screenshot 2) */}
          <div className="rounded-3xl border border-teal-500/40 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white p-6 md:p-8 shadow-xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
              <div className="space-y-3 text-right">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                    <CheckCircle2 className="size-3.5 text-emerald-400" />
                    الثيم الحالي المفعل
                  </span>
                  <span className="text-xs font-mono text-slate-400">{currentActiveThemeConfig.nameEn}</span>
                </div>

                <h2 className="text-2xl md:text-3xl font-black text-white">
                  ثيم {currentActiveThemeConfig.name}
                </h2>

                <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
                  {currentActiveThemeConfig.description}
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setLocation('/theme-customizer')}
                    className="px-6 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-black text-xs shadow-lg flex items-center gap-2 transition-transform hover:scale-105"
                  >
                    <Sliders className="size-4 text-teal-700" />
                    <span>خصص هذا الثيم</span>
                  </button>

                  <a
                    href={fullUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 flex items-center gap-1.5 transition-colors"
                  >
                    <span>معاينة على ({fullDomain})</span>
                    <ExternalLink className="size-3.5" />
                  </a>
                </div>
              </div>

              {/* Thumbnail of active theme */}
              <div className="w-56 h-36 rounded-2xl overflow-hidden border-2 border-teal-500/50 shadow-2xl shrink-0 hidden sm:block">
                <img
                  src={currentActiveThemeConfig.image}
                  alt={currentActiveThemeConfig.name}
                  className="size-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Category Filter Pills & Search Input (Matching Screenshot 2) */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full w-full sm:w-auto">
              {categoryFilters.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategoryTab(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-black transition-all border shrink-0 ${
                    selectedCategoryTab === cat
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-sm'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute right-3.5 top-2.5 size-4 text-slate-400" />
              <input
                type="text"
                value={themeSearch}
                onChange={(e) => setThemeSearch(e.target.value)}
                placeholder="ابحث عن ثيم بالاسم أو النشاط..."
                className="w-full h-10 pr-10 pl-4 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-teal-500 shadow-sm"
              />
            </div>
          </div>

          {/* Themes Showcase Grid (Dual Desktop+Mobile Mockup Frames matching Screenshots 3, 4, 5) */}
          {/* 3-Day Free Trial Notice Banner */}
          {isFreeTrialActive() && !isPaidMerchantPro() && (
            <div className="p-4.5 rounded-3xl bg-gradient-to-r from-teal-950/90 via-slate-900 to-teal-950/90 border border-teal-500/40 text-xs text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
              <div className="flex items-center gap-3.5">
                <span className="size-11 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0 border border-teal-500/30">
                  <Sparkles className="size-5 text-amber-400 animate-pulse" />
                </span>
                <div className="space-y-1">
                  <div className="font-extrabold text-sm text-teal-300 flex items-center gap-2 flex-wrap">
                    <span>كافة القوالب متاحة لك مجاناً لفترة تجريبية! 🎉</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 shadow-sm">
                      متبقي {getTrialTimeRemaining().days} أيام و {getTrialTimeRemaining().hours} ساعة
                    </span>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    جميع ثيمات وقوالب الـ PRO مفتوحة ومجانية تماماً لمدة 3 أيام من تاريخ تسجيل حسابك لتجربتها على متجرك بحرية قبل التحويل التلقائي للقالب المجاني.
                  </p>
                </div>
              </div>
              <a
                href="#/subscriptions"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs shrink-0 shadow-lg transition-transform hover:scale-105 flex items-center gap-1.5"
              >
                <Crown className="size-4" />
                <span>ترقية الاشتراك</span>
              </a>
            </div>
          )}

          {/* Themes Showcase Grid (Dual Desktop+Mobile Mockup Frames matching Screenshots 3, 4, 5) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {themeList.map((t) => {
              const isCurrent = activeTemplate === t.id;
              const cleanThemeSub = t.id.replace('store-', '');
              const demoUrl = typeof window !== 'undefined' && (window.location.hostname.includes('localhost') || window.location.hostname.includes('127.0.0.1'))
                ? `/#/store/${cleanThemeSub}`
                : `https://${cleanThemeSub}.za3em.shop`;

              return (
                <div
                  key={t.id}
                  className={`rounded-3xl border bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group ${
                    isCurrent
                      ? 'border-teal-500 ring-2 ring-teal-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700'
                  }`}
                >
                  <div>
                    {/* Dual Mockup Frame (Desktop + Mobile in frame matching Screenshots 3, 4, 5) */}
                    <div className="rounded-2xl overflow-hidden bg-slate-950 p-4 border border-slate-800 relative shadow-inner min-h-[260px] flex items-center justify-center">
                      
                      {/* Live Preview / Applied Badge (Left) */}
                      <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
                        {isCurrent && (
                          <span className="px-3 py-1 rounded-full text-[10px] font-black bg-emerald-500 text-slate-950 shadow-md flex items-center gap-1">
                            <CheckCircle2 className="size-3" /> مُطبّق
                          </span>
                        )}
                      </div>

                      {/* Free vs Pro Badge + Most Used Badge (Right) */}
                      <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 flex-wrap justify-end">
                        {t.isPro ? (
                          <>
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-md flex items-center gap-1">
                              <Crown className="size-3" /> بريميوم
                            </span>
                            {t.isMostPopular && (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-gradient-to-r from-orange-600 to-rose-600 text-white shadow-md flex items-center gap-1 animate-pulse">
                                <Flame className="size-3" /> الأكثر استخداماً
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-500 text-slate-950 shadow-md flex items-center gap-1">
                            <Check className="size-3" /> مجاني
                          </span>
                        )}
                      </div>

                      {/* Desktop Preview Frame */}
                      <div className="w-full h-48 rounded-xl overflow-hidden relative shadow-2xl border border-slate-700">
                        <img
                          src={t.image}
                          alt={t.name}
                          className="size-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                        
                        {/* Domain Tag overlay */}
                        <a
                          href={demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="absolute bottom-2 left-3 text-[10px] font-mono font-bold text-teal-300 hover:text-white bg-slate-950/80 hover:bg-slate-900 px-2.5 py-0.5 rounded border border-teal-500/30 transition-colors flex items-center gap-1 shadow"
                          title="معاينة حية للقالب في نافذة خارجية"
                        >
                          <span>{cleanThemeSub}.za3em.shop</span>
                          <ExternalLink className="size-2.5 text-teal-400" />
                        </a>
                      </div>

                      {/* Mobile floating mockup thumbnail */}
                      <div className="absolute -bottom-2 right-4 w-24 h-40 rounded-2xl overflow-hidden border-2 border-slate-750 shadow-2xl bg-black hidden sm:block rotate-[-3deg] group-hover:rotate-0 transition-transform">
                        <img
                          src={t.image}
                          alt={t.name}
                          className="size-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Palette Dots & Badges */}
                    <div className="mt-5 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        {t.palette.map((c, i) => (
                          <span
                            key={i}
                            className="size-3 rounded-full border border-black/10 shadow-sm"
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>

                      <div className="flex items-center gap-1.5">
                        {t.isPro ? (
                          <>
                            <span className="text-[11px] font-black text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Crown className="size-3" /> ثيم مدفوع
                            </span>
                            {t.isMostPopular && (
                              <span className="text-[11px] font-black text-orange-500 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Flame className="size-3" /> الأكثر استخداماً
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="text-[11px] font-black text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                            ثيم مجاني
                          </span>
                        )}
                        <span className="text-[11px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full">
                          {t.categoryTag}
                        </span>
                      </div>
                    </div>

                    {/* Theme Names & Description */}
                    <div className="mt-3 space-y-1.5 text-right">
                      <div className="flex items-center justify-between">
                        <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                          {t.name}
                        </h3>
                        <span className="text-xs font-mono font-bold text-slate-400">{t.nameEn}</span>
                      </div>

                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        {t.description}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons (استخدم الثيم / معاينة الثيم) */}
                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => handleApplyTheme(t)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-sm ${
                        isCurrent
                          ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                          : 'bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900'
                      }`}
                    >
                      {isCurrent ? (
                        <>
                          <Check className="size-3.5" />
                          <span>المفعل على متجرك</span>
                        </>
                      ) : (
                        <>
                          <span>استخدم {t.name}</span>
                          <ArrowLeft className="size-3.5" />
                        </>
                      )}
                    </button>

                    <a
                      href={demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-teal-700 hover:text-white dark:hover:bg-teal-600 text-slate-700 dark:text-slate-200 font-extrabold text-xs transition-all flex items-center gap-1.5 shadow-sm border border-slate-200/80 dark:border-slate-700/80 cursor-pointer whitespace-nowrap"
                      title={`معاينة مباشرة لقالب ${t.name} على رابط ${cleanThemeSub}.za3em.shop`}
                    >
                      <ExternalLink className="size-3.5 text-teal-600 dark:text-teal-400 group-hover:text-white" />
                      <span>معاينة الثيم</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: إعدادات الدومين والخط والدفع (Settings Panel)                     */}
      {/* ========================================================================= */}
      {activeMainTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="space-y-6 animate-fadeIn">
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
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  اسم المتجر <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full h-11 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 px-4 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  الدومين الفرعي (Subdomain) <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 px-3.5 overflow-hidden">
                  <span className="text-xs font-mono text-slate-400 select-none ml-1">https://</span>
                  <input
                    type="text"
                    required
                    value={subdomainInput}
                    onChange={(e) => setSubdomainInput(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
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
        </form>
      )}

      {/* ========================================================================= */}
      {/* VIEW 3: صفحات الهبوط                                                      */}
      {/* ========================================================================= */}
      {activeMainTab === 'landing' && (
        <LandingPageBuilderPage />
      )}

      {/* ========================================================================= */}
      {/* LIVE THEME PREVIEW MODAL                                                  */}
      {/* ========================================================================= */}
      {previewThemeModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
          <div className="w-full max-w-5xl h-[90vh] rounded-3xl border border-slate-800 bg-slate-900 flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95">
            
            {/* Modal Header */}
            <div className="bg-[#121c2e] border-b border-slate-800 px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="size-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-extrabold text-sm text-white">
                  معاينة حية لقالب «{previewThemeModal.name}» على متجرك ({fullDomain})
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleApplyTheme(previewThemeModal);
                    setPreviewThemeModal(null);
                  }}
                  className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow transition-all"
                >
                  تطبيق هذا الثيم الآن
                </button>

                <button
                  type="button"
                  onClick={() => setPreviewThemeModal(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>

            {/* Modal Frame Body */}
            <div className="flex-1 overflow-y-auto bg-white">
              <StoreTemplates
                storeName={storeName}
                subdomain={subdomain}
                activeTemplateId={previewThemeModal.id}
                standalone={true}
              />
            </div>
          </div>
        </div>
      )}

      {/* PRO UPGRADE MODAL */}
      {showProUpgradeModal && attemptedProTheme && (
        <div className="fixed inset-0 z-[99999] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-md w-full rounded-3xl border border-amber-500/50 bg-slate-900 p-6 sm:p-7 text-center space-y-4 shadow-2xl animate-in zoom-in-95 relative my-auto">
            <button
              onClick={() => setShowProUpgradeModal(false)}
              className="absolute top-4 left-4 text-slate-400 hover:text-white"
            >
              <X className="size-5" />
            </button>

            <div className="size-16 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 grid place-items-center mx-auto shadow-lg">
              <Crown className="size-8" />
            </div>

            <div className="space-y-1">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-950 border border-amber-700 text-amber-300 inline-block">
                ثيم مدفوع باشتراك PRO
              </span>
              <h3 className="font-extrabold text-xl text-white pt-2">
                قالب {attemptedProTheme.name}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                هذا الثيم متاح حصرياً للمتاجر المشتركة في باقة PRO. قم بترقية اشتراكك للاستفادة من التصاميم المتقدمة ونسب التحويل العالية.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <a
                href="#/subscriptions"
                onClick={() => setShowProUpgradeModal(false)}
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-105"
              >
                <Crown className="size-4" />
                <span>ترقية الباقة إلى PRO الآن</span>
              </a>

              <button
                onClick={() => setShowProUpgradeModal(false)}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default StorePage;
