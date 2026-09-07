import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'wouter';
import {
  Palette, Home, LayoutGrid, Package, PanelTop, PanelBottom,
  Sparkles, Monitor, Tablet, Smartphone, ExternalLink, RotateCcw,
  Save, Check, AlertCircle, ArrowLeft, Eye, Clock, Zap, Crown,
  Sliders, Globe, Moon, Sun, Laptop, ChevronRight, Phone, MessageSquare,
  Lock, Copy, ShieldCheck, Flame, CheckCircle2
} from 'lucide-react';
import {
  StoreTemplates,
  type TemplateId,
  TEMPLATES_MAP,
  type ThemeCustomizationProps
} from '../components/storefront/StoreTemplates';
import { updateCloudStoreFullSettings } from '../utils/cloudDb';
import { getStoredProducts } from '../data/storeState';

const LUXURY_PALETTES = [
  { name: 'كوبالت سترايد', hex: '#0052cc', class: 'bg-[#0052cc]' },
  { name: 'عنابي مين الفاخر', hex: '#6b0f24', class: 'bg-[#6b0f24]' },
  { name: 'زيتوني سبراوت', hex: '#4a6b47', class: 'bg-[#4a6b47]' },
  { name: 'بلوط لوفتورا', hex: '#8b5a2b', class: 'bg-[#8b5a2b]' },
  { name: 'وردي شيك شيري', hex: '#540b0e', class: 'bg-[#540b0e]' },
  { name: 'أحمر واردروب', hex: '#e63946', class: 'bg-[#e63946]' },
  { name: 'إنديجو ملكي', hex: '#4338ca', class: 'bg-[#4338ca]' },
  { name: 'أسود كلاسيك', hex: '#111827', class: 'bg-[#111827]' },
];

export function ThemeCustomizerPage() {
  const [, setLocation] = useLocation();

  // Active customizer section tab
  const [activeSection, setActiveSection] = useState<'identity' | 'home' | 'products' | 'product' | 'header' | 'footer' | 'toolbar'>('identity');

  // Preview viewport: desktop (1280px), tablet (768px), mobile (375px)
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [previewKey, setPreviewKey] = useState(0);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Store & Theme basic settings
  const [subdomain, setSubdomain] = useState('alzaeem');
  const [storeName, setStoreName] = useState('متجر الزعيم');
  const [selectedTheme, setSelectedTheme] = useState<TemplateId>('store-wardrobe');
  const [logoUrl, setLogoUrl] = useState('');

  // 1. Identity & Style Settings
  const [brandColor, setBrandColor] = useState('#0052cc');
  const [appearanceMode, setAppearanceMode] = useState<'system' | 'dark' | 'light'>('light');
  const [defaultLanguage, setDefaultLanguage] = useState<'ar' | 'en'>('ar');
  const [typographyFont, setTypographyFont] = useState('Cairo');

  // 2. Homepage Settings
  const [showHeroBanner, setShowHeroBanner] = useState(true);
  const [heroTitle, setHeroTitle] = useState('يومي بطابع خاص');
  const [heroSubtitle, setHeroSubtitle] = useState('القطع التي ترتديها فقط — تسوق أحدث خطوط الموضة');
  const [heroButtonText, setHeroButtonText] = useState('تسوق الآن');
  const [showTrustFeatures, setShowTrustFeatures] = useState(true);
  const [showCategoryCircles, setShowCategoryCircles] = useState(true);

  // 3. Products Grid Settings
  const [productGridCols, setProductGridCols] = useState<number>(4);
  const [showDiscountBadge, setShowDiscountBadge] = useState(true);
  const [showStockStatus, setShowStockStatus] = useState(true);

  // 4. Product Detail Settings
  const [enableQuickBuy, setEnableQuickBuy] = useState(true);
  const [showUrgencyTicker, setShowUrgencyTicker] = useState(true);

  // 5. Header Settings
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [announcementText, setAnnouncementText] = useState('شحن مجاني فوق $50 • إرجاع خلال 30 يوماً • معاينة قبل الاستلام');
  const [isHeaderSticky, setIsHeaderSticky] = useState(true);
  const [hotlinePhone, setHotlinePhone] = useState('+964 770 000 0000');

  // 6. Footer Settings
  const [footerCopyright, setFooterCopyright] = useState('جميع الحقوق محفوظة • مدعوم بواسطة منصة الزعيم');
  const [showPaymentBadges, setShowPaymentBadges] = useState(true);

  // 7. Toolbar Settings
  const [enableWhatsAppFloating, setEnableWhatsAppFloating] = useState(true);
  const [whatsAppNumber, setWhatsAppNumber] = useState('+964 770 000 0000');
  const [enableStickyCartBar, setEnableStickyCartBar] = useState(true);

  // Status
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load existing settings
  useEffect(() => {
    try {
      const rawStore = localStorage.getItem('zaeem_store_data') || localStorage.getItem('zaeem_onboarded_store');
      const rawUser = localStorage.getItem('zaeem_user');
      let storeObj: any = null;
      let userObj: any = null;

      if (rawStore) try { storeObj = JSON.parse(rawStore); } catch {}
      if (rawUser) try { userObj = JSON.parse(rawUser); } catch {}

      const cleanSub = (storeObj?.subdomain || userObj?.subdomain || 'alzaeem')
        .replace('.za3em.shop', '')
        .replace(/^https?:\/\//, '')
        .trim();

      setSubdomain(cleanSub);
      setStoreName(storeObj?.storeName || userObj?.storeName || `متجر ${cleanSub}`);
      if (storeObj?.selectedTheme) setSelectedTheme(storeObj.selectedTheme);
      else if (storeObj?.templateId) setSelectedTheme(storeObj.templateId);

      // Load customizer settings if saved
      const customRaw = localStorage.getItem('zaeem_theme_customization');
      if (customRaw) {
        const c = JSON.parse(customRaw);
        if (c.brandColor) setBrandColor(c.brandColor);
        if (c.appearanceMode) setAppearanceMode(c.appearanceMode);
        if (c.defaultLanguage) setDefaultLanguage(c.defaultLanguage);
        if (c.heroTitle) setHeroTitle(c.heroTitle);
        if (c.heroSubtitle) setHeroSubtitle(c.heroSubtitle);
        if (c.heroButtonText) setHeroButtonText(c.heroButtonText);
        if (c.showHeroBanner !== undefined) setShowHeroBanner(c.showHeroBanner);
        if (c.showTrustFeatures !== undefined) setShowTrustFeatures(c.showTrustFeatures);
        if (c.showCategoryCircles !== undefined) setShowCategoryCircles(c.showCategoryCircles);
        if (c.productGridCols !== undefined) setProductGridCols(c.productGridCols);
        if (c.showDiscountBadge !== undefined) setShowDiscountBadge(c.showDiscountBadge);
        if (c.showStockStatus !== undefined) setShowStockStatus(c.showStockStatus);
        if (c.enableQuickBuy !== undefined) setEnableQuickBuy(c.enableQuickBuy);
        if (c.showUrgencyTicker !== undefined) setShowUrgencyTicker(c.showUrgencyTicker);
        if (c.showAnnouncement !== undefined) setShowAnnouncement(c.showAnnouncement);
        if (c.announcementText) setAnnouncementText(c.announcementText);
        if (c.isHeaderSticky !== undefined) setIsHeaderSticky(c.isHeaderSticky);
        if (c.hotlinePhone) setHotlinePhone(c.hotlinePhone);
        if (c.footerCopyright) setFooterCopyright(c.footerCopyright);
        if (c.showPaymentBadges !== undefined) setShowPaymentBadges(c.showPaymentBadges);
        if (c.enableWhatsAppFloating !== undefined) setEnableWhatsAppFloating(c.enableWhatsAppFloating);
        if (c.whatsAppNumber) setWhatsAppNumber(c.whatsAppNumber);
        if (c.enableStickyCartBar !== undefined) setEnableStickyCartBar(c.enableStickyCartBar);
        if (c.typographyFont) setTypographyFont(c.typographyFont);
      }
    } catch {}
  }, []);

  const fullDomain = `${subdomain}.za3em.shop`;
  const fullUrl = `https://${fullDomain}`;

  const currentThemeConfig = TEMPLATES_MAP[selectedTheme] || TEMPLATES_MAP['store-wardrobe'] || TEMPLATES_MAP['store-sprout'];

  // LIVE CUSTOMIZATION OBJECT (Updates immediately before saving!)
  const liveCustomization: ThemeCustomizationProps = useMemo(() => ({
    brandColor,
    appearanceMode,
    defaultLanguage,
    heroTitle,
    heroSubtitle,
    heroButtonText,
    showHeroBanner,
    showCategoryCircles,
    showTrustFeatures,
    announcementText,
    showAnnouncement,
    isHeaderSticky,
    hotlinePhone,
    footerCopyright,
    showPaymentBadges,
    enableWhatsAppFloating,
    whatsAppNumber,
    enableStickyCartBar,
    productGridCols,
    showDiscountBadge,
    showStockStatus,
    enableQuickBuy,
    showUrgencyTicker,
    typographyFont
  }), [
    brandColor,
    appearanceMode,
    defaultLanguage,
    heroTitle,
    heroSubtitle,
    heroButtonText,
    showHeroBanner,
    showCategoryCircles,
    showTrustFeatures,
    announcementText,
    showAnnouncement,
    isHeaderSticky,
    hotlinePhone,
    footerCopyright,
    showPaymentBadges,
    enableWhatsAppFloating,
    whatsAppNumber,
    enableStickyCartBar,
    productGridCols,
    showDiscountBadge,
    showStockStatus,
    enableQuickBuy,
    showUrgencyTicker,
    typographyFont
  ]);

  const handleSaveAndPublish = async () => {
    setIsSaving(true);
    try {
      localStorage.setItem('zaeem_theme_customization', JSON.stringify(liveCustomization));

      // Update store state in localStorage
      const rawStore = localStorage.getItem('zaeem_store_data') || '{}';
      const parsedStore = JSON.parse(rawStore);
      parsedStore.customization = liveCustomization;
      parsedStore.selectedTheme = selectedTheme;
      parsedStore.templateId = selectedTheme;
      parsedStore.storeName = storeName;
      if (logoUrl) parsedStore.logoUrl = logoUrl;
      localStorage.setItem('zaeem_store_data', JSON.stringify(parsedStore));

      // Sync to cloud DB
      await updateCloudStoreFullSettings({
        subdomain,
        name: storeName,
        templateId: selectedTheme,
        logoUrl: logoUrl || undefined
      });

      window.dispatchEvent(new CustomEvent('zaeem_store_updated'));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) {
      console.warn('Error saving customizer data:', e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard?.writeText(fullUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const getViewportWidthClass = () => {
    switch (viewport) {
      case 'mobile':
        return 'w-[375px] max-w-full';
      case 'tablet':
        return 'w-[768px] max-w-full';
      case 'desktop':
      default:
        return 'w-full max-w-[1240px]';
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-slate-100 font-sans antialiased flex flex-col" dir="rtl">
      
      {/* 1. Customizer Navigation Header */}
      <header className="bg-[#0f172a] border-b border-slate-800 px-4 md:px-6 py-2.5 flex items-center justify-between gap-4 sticky top-0 z-40 shadow-xl">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setLocation('/store')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all"
          >
            <ArrowLeft className="size-3.5" />
            <span>العودة للمتجر</span>
          </button>

          {/* Section Tabs */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-900/90 p-1 rounded-2xl border border-slate-800">
            {[
              { id: 'identity', label: 'الهوية والتصميم', icon: Palette },
              { id: 'home', label: 'الصفحة الرئيسية', icon: Home },
              { id: 'products', label: 'شبكة المنتجات', icon: LayoutGrid },
              { id: 'product', label: 'صفحة المنتج', icon: Package },
              { id: 'header', label: 'الهيدر والشريط', icon: PanelTop },
              { id: 'footer', label: 'الفوتر والحقوق', icon: PanelBottom },
              { id: 'toolbar', label: 'شريط الأدوات', icon: Sliders },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSection === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveSection(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="size-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Language + Theme Mode in Top Bar */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Quick Language Switcher */}
          <button
            type="button"
            onClick={() => setDefaultLanguage(l => l === 'ar' ? 'en' : 'ar')}
            title="زر ترجمة الموقع الفوري"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold transition-colors"
          >
            <Globe className="size-3.5 text-blue-400" />
            <span>{defaultLanguage === 'ar' ? 'العربية (RTL)' : 'English (LTR)'}</span>
          </button>

          {/* Quick Dark/Light Switcher */}
          <div className="flex items-center bg-slate-900 border border-slate-800 p-0.5 rounded-xl">
            <button
              type="button"
              onClick={() => setAppearanceMode('light')}
              title="المظهر الفاتح"
              className={`p-1.5 rounded-lg transition-colors ${
                appearanceMode === 'light' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sun className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setAppearanceMode('dark')}
              title="المظهر الداكن"
              className={`p-1.5 rounded-lg transition-colors ${
                appearanceMode === 'dark' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Moon className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setAppearanceMode('system')}
              title="مظهر النظام"
              className={`p-1.5 rounded-lg transition-colors ${
                appearanceMode === 'system' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Laptop className="size-3.5" />
            </button>
          </div>

          {/* Save & Publish */}
          {saveSuccess && (
            <span className="hidden md:flex text-xs font-bold text-emerald-400 items-center gap-1 animate-pulse">
              <Check className="size-4" /> تم الحفظ والنشر
            </span>
          )}

          <button
            type="button"
            onClick={handleSaveAndPublish}
            disabled={isSaving}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-black text-xs shadow-lg flex items-center gap-1.5 transition-transform hover:scale-105"
          >
            <Save className="size-3.5" />
            <span>{isSaving ? 'جاري الحفظ...' : 'حفظ ونشر التعديلات'}</span>
          </button>
        </div>
      </header>

      {/* 2. Main Workspace */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left Controls Sidebar */}
        <aside className="w-full lg:w-[410px] bg-[#0c1322] border-l border-slate-800/80 p-5 overflow-y-auto space-y-6 shrink-0 max-h-[calc(100vh-60px)] shadow-2xl">
          
          {/* Active Theme Badge & Selector */}
          <div className="p-4 rounded-2xl bg-gradient-to-tr from-slate-900 to-[#141e33] border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-blue-400 flex items-center gap-1.5">
                <Sparkles className="size-3.5 text-blue-400" />
                ثيم «{currentThemeConfig.name}»
              </span>
              <span className="text-[10px] font-mono text-slate-400 font-bold bg-slate-800/80 px-2 py-0.5 rounded-md">
                {currentThemeConfig.nameEn}
              </span>
            </div>

            {/* Quick Theme Switcher Pill Selector */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 block">تبديل الثيم النشط للمتجر:</label>
              <select
                value={selectedTheme}
                onChange={(e) => setSelectedTheme(e.target.value as TemplateId)}
                className="w-full h-9 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-white focus:border-blue-500 focus:outline-none"
              >
                {Object.keys(TEMPLATES_MAP).map((tKey) => {
                  const item = TEMPLATES_MAP[tKey];
                  return (
                    <option key={tKey} value={tKey}>
                      {item.name} — {item.categoryTag} {item.isPro ? '⭐ PRO' : '(مجاني)'}
                    </option>
                  );
                })}
              </select>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
              المعاينة الحية على اليسار تتحدث تلقائياً مع كل تعديل تجريه قبل الحفظ.
            </p>
          </div>

          {/* TAB 1: الهوية والتصميم (Identity & Brand Color & Language) */}
          {activeSection === 'identity' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* اسم وشعار المتجر */}
              <div className="space-y-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-300 block">اسم المتجر (Store Name)</label>
                  <input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="w-full h-10 px-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 block">رابط الشعار المخصص (Logo URL)</label>
                  <input
                    type="text"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    placeholder="https://.../logo.png"
                    dir="ltr"
                    className="w-full h-9 px-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-600 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* زر وخيارات تغيير اللون الأساسي */}
              <div className="space-y-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-slate-200 block">
                    لون الهوية الرئيسي (Brand Accent Color)
                  </label>
                  <span className="text-[10px] font-mono text-slate-400 dir-ltr">{brandColor}</span>
                </div>

                {/* Preset Luxury Swatches */}
                <div className="grid grid-cols-4 gap-2">
                  {LUXURY_PALETTES.map((pal) => {
                    const isSel = brandColor.toLowerCase() === pal.hex.toLowerCase();
                    return (
                      <button
                        key={pal.hex}
                        type="button"
                        onClick={() => setBrandColor(pal.hex)}
                        title={pal.name}
                        className={`h-9 rounded-xl border flex items-center justify-center transition-all ${
                          isSel ? 'border-white scale-105 shadow-lg ring-2 ring-blue-400' : 'border-slate-800 hover:border-slate-600'
                        }`}
                        style={{ backgroundColor: pal.hex }}
                      >
                        {isSel && <Check className="size-4 text-white drop-shadow-md" />}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Color Input */}
                <div className="flex items-center gap-3 pt-1">
                  <div className="relative size-10 rounded-xl overflow-hidden border border-slate-700 shadow-md shrink-0">
                    <input
                      type="color"
                      value={brandColor}
                      onChange={(e) => setBrandColor(e.target.value)}
                      className="absolute inset-0 size-full cursor-pointer opacity-0"
                    />
                    <div className="size-full" style={{ backgroundColor: brandColor }} />
                  </div>
                  <input
                    type="text"
                    value={brandColor}
                    onChange={(e) => setBrandColor(e.target.value)}
                    dir="ltr"
                    className="flex-1 h-10 px-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono font-bold text-white focus:border-blue-500 focus:outline-none text-right"
                  />
                </div>
              </div>

              {/* زر ترجمة الموقع (Language RTL / LTR) */}
              <div className="space-y-2 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <label className="text-xs font-extrabold text-slate-200 block">لغة واجهة المتجر (Site Language)</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDefaultLanguage('ar')}
                    className={`py-2.5 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-2 ${
                      defaultLanguage === 'ar'
                        ? 'bg-blue-600 text-white border-blue-500 shadow-md'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    <Globe className="size-4 text-emerald-400" />
                    <span>العربية (RTL)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDefaultLanguage('en')}
                    className={`py-2.5 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-2 ${
                      defaultLanguage === 'en'
                        ? 'bg-blue-600 text-white border-blue-500 shadow-md'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    <Globe className="size-4 text-cyan-400" />
                    <span>English (LTR)</span>
                  </button>
                </div>
              </div>

              {/* خيار داكن أو فاتح (Appearance Theme Mode) */}
              <div className="space-y-2 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <label className="text-xs font-extrabold text-slate-200 block">وضع المظهر (Light / Dark Mode)</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'light', label: 'فاتح', icon: Sun, color: 'text-amber-400' },
                    { id: 'dark', label: 'داكن', icon: Moon, color: 'text-blue-400' },
                    { id: 'system', label: 'تلقائي', icon: Laptop, color: 'text-slate-400' },
                  ].map((mode) => {
                    const Icon = mode.icon;
                    const isSel = appearanceMode === mode.id;
                    return (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => setAppearanceMode(mode.id as any)}
                        className={`py-2.5 rounded-xl text-xs font-bold flex flex-col items-center gap-1.5 transition-all border ${
                          isSel
                            ? 'bg-blue-600 text-white border-blue-500 shadow-md'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <Icon className={`size-4 ${isSel ? 'text-white' : mode.color}`} />
                        <span>{mode.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* نوع الخط الرئيسي */}
              <div className="space-y-2 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <label className="text-xs font-extrabold text-slate-200 block">نوع الخط الطباعي (Typography)</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Cairo', 'Alexandria', 'Inter', 'Tajawal'].map((font) => (
                    <button
                      key={font}
                      type="button"
                      onClick={() => setTypographyFont(font)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        typographyFont === font
                          ? 'bg-blue-600 text-white border-blue-500'
                          : 'bg-slate-950 text-slate-400 border-slate-800'
                      }`}
                    >
                      {font}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: الصفحة الرئيسية (Homepage) */}
          {activeSection === 'home' && (
            <div className="space-y-4 animate-fadeIn">
              
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-xs font-extrabold text-slate-200">إظهار البانر الترويجي الرئيسي (Hero Banner)</span>
                  <input
                    type="checkbox"
                    checked={showHeroBanner}
                    onChange={(e) => setShowHeroBanner(e.target.checked)}
                    className="size-4 rounded accent-blue-600"
                  />
                </label>

                {showHeroBanner && (
                  <div className="space-y-3 pt-2 border-t border-slate-800">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400 block">العنوان الرئيسي (Headline)</label>
                      <input
                        type="text"
                        value={heroTitle}
                        onChange={(e) => setHeroTitle(e.target.value)}
                        className="w-full h-10 px-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-blue-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400 block">النص التوضيحي للبانر (Subtitle)</label>
                      <textarea
                        rows={3}
                        value={heroSubtitle}
                        onChange={(e) => setHeroSubtitle(e.target.value)}
                        className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-blue-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400 block">نص زر الشراء الرئيسي</label>
                      <input
                        type="text"
                        value={heroButtonText}
                        onChange={(e) => setHeroButtonText(e.target.value)}
                        className="w-full h-10 px-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Trust & Shipping Bar */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="text-xs font-extrabold text-slate-200 block">شريط مزايا الدفع والشحن</span>
                    <span className="text-[11px] text-slate-400">يعرض بطاقات الدفع الآمن، الشحن السريع، والإرجاع</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={showTrustFeatures}
                    onChange={(e) => setShowTrustFeatures(e.target.checked)}
                    className="size-4 rounded accent-blue-600"
                  />
                </label>
              </div>

              {/* Category Circles */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="text-xs font-extrabold text-slate-200 block">دوائر الأقسام العائمة</span>
                    <span className="text-[11px] text-slate-400">تصفح الأقسام السريع في أعلى المتجر</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={showCategoryCircles}
                    onChange={(e) => setShowCategoryCircles(e.target.checked)}
                    className="size-4 rounded accent-blue-600"
                  />
                </label>
              </div>

            </div>
          )}

          {/* TAB 3: شبكة المنتجات (Products Grid) */}
          {activeSection === 'products' && (
            <div className="space-y-4 animate-fadeIn">
              
              {/* Number of columns */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <label className="text-xs font-extrabold text-slate-200 block">عدد الأعمدة في شبكة المنتجات</label>
                <div className="grid grid-cols-3 gap-2">
                  {[2, 3, 4].map((cols) => (
                    <button
                      key={cols}
                      type="button"
                      onClick={() => setProductGridCols(cols)}
                      className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                        productGridCols === cols
                          ? 'bg-blue-600 text-white border-blue-500 shadow-md'
                          : 'bg-slate-950 text-slate-400 border-slate-800'
                      }`}
                    >
                      {cols} أعمدة
                    </button>
                  ))}
                </div>
              </div>

              {/* Discount Badges */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="text-xs font-extrabold text-slate-200 block">شارة التخفيض (Discount Badge)</span>
                    <span className="text-[11px] text-slate-400">إظهار شارة نسبة الخصم على بطاقات المنتجات</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={showDiscountBadge}
                    onChange={(e) => setShowDiscountBadge(e.target.checked)}
                    className="size-4 rounded accent-blue-600"
                  />
                </label>
              </div>

              {/* Stock Status Indicator */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="text-xs font-extrabold text-slate-200 block">مؤشر توفر المخزون</span>
                    <span className="text-[11px] text-slate-400">إظهار بادج متوفر بالمخزن لزيادة ثقة الزبون</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={showStockStatus}
                    onChange={(e) => setShowStockStatus(e.target.checked)}
                    className="size-4 rounded accent-blue-600"
                  />
                </label>
              </div>

            </div>
          )}

          {/* TAB 4: صفحة المنتج (Product Detail) */}
          {activeSection === 'product' && (
            <div className="space-y-4 animate-fadeIn">
              
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="text-xs font-extrabold text-slate-200 block">زر الشراء السريع المباشر (Quick Buy)</span>
                    <span className="text-[11px] text-slate-400">فتح نافذة الدفع عند الاستلام الفورية دون مغادرة الصفحة</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={enableQuickBuy}
                    onChange={(e) => setEnableQuickBuy(e.target.checked)}
                    className="size-4 rounded accent-blue-600"
                  />
                </label>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="text-xs font-extrabold text-slate-200 block">شريط الاستعجال والطلب المرتفع</span>
                    <span className="text-[11px] text-slate-400">إظهار عبارة (طلب مرتفع • متبقي قطع محدودة)</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={showUrgencyTicker}
                    onChange={(e) => setShowUrgencyTicker(e.target.checked)}
                    className="size-4 rounded accent-blue-600"
                  />
                </label>
              </div>

            </div>
          )}

          {/* TAB 5: الهيدر (Header) */}
          {activeSection === 'header' && (
            <div className="space-y-4 animate-fadeIn">
              
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-xs font-extrabold text-slate-200">إظهار الشريط الإعلاني العلوي (Announcement Bar)</span>
                  <input
                    type="checkbox"
                    checked={showAnnouncement}
                    onChange={(e) => setShowAnnouncement(e.target.checked)}
                    className="size-4 rounded accent-blue-600"
                  />
                </label>

                {showAnnouncement && (
                  <div className="space-y-1.5 pt-2 border-t border-slate-800">
                    <label className="text-xs font-bold text-slate-400 block">نص الشريط الإعلاني</label>
                    <input
                      type="text"
                      value={announcementText}
                      onChange={(e) => setAnnouncementText(e.target.value)}
                      className="w-full h-10 px-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <label className="text-xs font-bold text-slate-300 block">هاتف خدمة الزبائن في الهيدر (Hotline Phone)</label>
                <input
                  type="text"
                  value={hotlinePhone}
                  onChange={(e) => setHotlinePhone(e.target.value)}
                  dir="ltr"
                  className="w-full h-10 px-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-xs font-extrabold text-slate-200">تثبيت الهيدر أثناء التمرير (Sticky Header)</span>
                  <input
                    type="checkbox"
                    checked={isHeaderSticky}
                    onChange={(e) => setIsHeaderSticky(e.target.checked)}
                    className="size-4 rounded accent-blue-600"
                  />
                </label>
              </div>

            </div>
          )}

          {/* TAB 6: الفوتر (Footer) */}
          {activeSection === 'footer' && (
            <div className="space-y-4 animate-fadeIn">
              
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <label className="text-xs font-bold text-slate-300 block">نص حقوق الملكية (Copyright Notice)</label>
                <input
                  type="text"
                  value={footerCopyright}
                  onChange={(e) => setFooterCopyright(e.target.value)}
                  className="w-full h-10 px-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="text-xs font-extrabold text-slate-200 block">شارات الدفع والشحن</span>
                    <span className="text-[11px] text-slate-400">إظهار شارات الدفع عند الاستلام، شركة الزعيم إكسبريس، وفحص القياس</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={showPaymentBadges}
                    onChange={(e) => setShowPaymentBadges(e.target.checked)}
                    className="size-4 rounded accent-blue-600"
                  />
                </label>
              </div>

            </div>
          )}

          {/* TAB 7: شريط الأدوات (Toolbar) */}
          {activeSection === 'toolbar' && (
            <div className="space-y-4 animate-fadeIn">
              
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-xs font-extrabold text-emerald-400">تفعيل زر واتساب العائم للطلب السريع</span>
                  <input
                    type="checkbox"
                    checked={enableWhatsAppFloating}
                    onChange={(e) => setEnableWhatsAppFloating(e.target.checked)}
                    className="size-4 rounded accent-emerald-500"
                  />
                </label>

                {enableWhatsAppFloating && (
                  <div className="space-y-1.5 pt-2 border-t border-slate-800">
                    <label className="text-[11px] font-bold text-slate-400 block">رقم هاتف واتساب التجاري المعتمد</label>
                    <input
                      type="text"
                      value={whatsAppNumber}
                      onChange={(e) => setWhatsAppNumber(e.target.value)}
                      dir="ltr"
                      placeholder="+964 770 000 0000"
                      className="w-full h-9 px-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="text-xs font-extrabold text-slate-200 block">شريط السلة العائم أسفل الشاشة (Sticky Cart)</span>
                    <span className="text-[11px] text-slate-400">إظهار شريط إنهاء الطلب المباشر عند إضافة منتج</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={enableStickyCartBar}
                    onChange={(e) => setEnableStickyCartBar(e.target.checked)}
                    className="size-4 rounded accent-blue-600"
                  />
                </label>
              </div>

            </div>
          )}

        </aside>

        {/* Right Preview Canvas (Realistic Browser Window Frame) */}
        <main className="flex-1 bg-[#060a13] p-3 md:p-6 flex flex-col items-center overflow-y-auto">
          
          {/* Top Canvas Viewport Switcher Bar */}
          <div className="w-full max-w-[1240px] mb-3 flex items-center justify-between gap-3 bg-[#111927] border border-slate-800 px-4 py-2 rounded-2xl shadow-lg">
            
            {/* Viewport Info & Device Buttons */}
            <div className="flex items-center gap-2 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setViewport('desktop')}
                title="كمبيوتر (Desktop - 1280px)"
                className={`p-1.5 rounded-lg transition-all flex items-center gap-1 text-xs font-bold ${
                  viewport === 'desktop' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Monitor className="size-4" />
                <span className="hidden sm:inline">كمبيوتر</span>
              </button>

              <button
                type="button"
                onClick={() => setViewport('tablet')}
                title="لوحي (Tablet - 768px)"
                className={`p-1.5 rounded-lg transition-all flex items-center gap-1 text-xs font-bold ${
                  viewport === 'tablet' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Tablet className="size-4" />
                <span className="hidden sm:inline">لوحي</span>
              </button>

              <button
                type="button"
                onClick={() => setViewport('mobile')}
                title="هاتف (Mobile - 375px)"
                className={`p-1.5 rounded-lg transition-all flex items-center gap-1 text-xs font-bold ${
                  viewport === 'mobile' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="size-4" />
                <span className="hidden sm:inline">هاتف</span>
              </button>
            </div>

            {/* Middle: Live Indicator Banner */}
            <div className="hidden md:flex items-center gap-2 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 px-3 py-1 rounded-full text-xs font-bold">
              <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
              <span>معاينة حية فورية وتطبيق متزامن</span>
            </div>

            {/* Actions: Reload & External */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPreviewKey(k => k + 1)}
                title="إعادة تحميل المعاينة"
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
              >
                <RotateCcw className="size-3.5" />
              </button>

              <a
                href={fullUrl}
                target="_blank"
                rel="noreferrer"
                title="فتح في تبويب مستقل"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold border border-slate-800 transition-colors"
              >
                <ExternalLink className="size-3.5" />
                <span className="hidden sm:inline">معاينة خارجية</span>
              </a>
            </div>
          </div>

          {/* REALISTIC BROWSER WINDOW FRAME (Matching reference screenshot styling) */}
          <div className={`${getViewportWidthClass()} transition-all duration-300 flex flex-col shadow-2xl rounded-3xl overflow-hidden border-2 border-slate-800 bg-slate-900`}>
            
            {/* macOS Browser Bar Chrome */}
            <div className="bg-[#1e293b] border-b border-slate-700/80 px-4 py-2.5 flex items-center justify-between gap-3 select-none">
              
              {/* Window Controls: 3 macOS dots */}
              <div className="flex items-center gap-1.5">
                <span className="size-3 rounded-full bg-[#ef4444]" />
                <span className="size-3 rounded-full bg-[#f59e0b]" />
                <span className="size-3 rounded-full bg-[#10b981]" />
              </div>

              {/* Realistic Address Bar */}
              <div className="flex-1 max-w-md mx-auto flex items-center justify-center gap-2 bg-[#0f172a] border border-slate-700 px-3 py-1 rounded-full text-xs font-mono text-slate-300 shadow-inner">
                <Lock className="size-3 text-emerald-400 shrink-0" />
                <span className="truncate text-[11px]">{fullDomain}</span>
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  title="نسخ الرابط"
                  className="text-slate-500 hover:text-white"
                >
                  {copiedUrl ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
                </button>
              </div>

              {/* Live Preview Pill */}
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-600/60 text-emerald-300 text-[10px] font-black">
                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>عرض مباشر</span>
              </div>
            </div>

            {/* Mobile Device Bezels (If Mobile selected) */}
            {viewport === 'mobile' ? (
              <div className="bg-slate-950 p-2 sm:p-3 flex justify-center">
                <div className="w-[375px] max-w-full rounded-[42px] border-[6px] border-slate-800 bg-white overflow-hidden shadow-2xl relative">
                  
                  {/* Dynamic Island / Notch */}
                  <div className="bg-slate-950 h-5 w-28 mx-auto rounded-b-2xl flex items-center justify-center mb-1">
                    <span className="size-2 rounded-full bg-slate-800" />
                  </div>

                  <div className="overflow-y-auto max-h-[750px]">
                    <StoreTemplates
                      key={previewKey}
                      storeName={storeName}
                      subdomain={subdomain}
                      activeTemplateId={selectedTheme}
                      standalone={true}
                      onTemplateChange={(newId) => setSelectedTheme(newId)}
                      logoUrl={logoUrl}
                      customization={liveCustomization}
                    />
                  </div>

                  {/* Home Indicator Bar */}
                  <div className="bg-white py-1.5 flex justify-center border-t border-slate-100">
                    <div className="w-28 h-1 bg-slate-400 rounded-full" />
                  </div>
                </div>
              </div>
            ) : (
              /* Desktop / Tablet Container */
              <div className="overflow-y-auto max-h-[800px] bg-white">
                <StoreTemplates
                  key={previewKey}
                  storeName={storeName}
                  subdomain={subdomain}
                  activeTemplateId={selectedTheme}
                  standalone={true}
                  onTemplateChange={(newId) => setSelectedTheme(newId)}
                  logoUrl={logoUrl}
                  customization={liveCustomization}
                />
              </div>
            )}

          </div>

        </main>
      </div>

    </div>
  );
}

export default ThemeCustomizerPage;
