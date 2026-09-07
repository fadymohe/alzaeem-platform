import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import {
  Palette, Home, LayoutGrid, Package, PanelTop, PanelBottom,
  Sparkles, Monitor, Tablet, Smartphone, ExternalLink, RotateCcw,
  Save, Check, AlertCircle, ArrowLeft, Eye, Clock, Zap, Crown,
  Sliders, Globe, Moon, Sun, Laptop, ChevronRight, Phone, MessageSquare
} from 'lucide-react';
import { StoreTemplates, type TemplateId, TEMPLATES_MAP } from '../components/storefront/StoreTemplates';
import { updateCloudStoreFullSettings, fetchCloudStore } from '../utils/cloudDb';
import { getStoredProducts } from '../data/storeState';

export function ThemeCustomizerPage() {
  const [, setLocation] = useLocation();

  // Active customizer section tab
  const [activeSection, setActiveSection] = useState<'identity' | 'home' | 'products' | 'product' | 'header' | 'footer' | 'toolbar'>('identity');

  // Preview viewport: desktop (1280px), tablet (768px), mobile (375px)
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [previewKey, setPreviewKey] = useState(0);

  // Store & Theme basic settings
  const [subdomain, setSubdomain] = useState('alzaeem');
  const [storeName, setStoreName] = useState('متجر الزعيم');
  const [selectedTheme, setSelectedTheme] = useState<TemplateId>('store-sprout');
  const [logoUrl, setLogoUrl] = useState('');

  // Brand Identity States
  const [brandColor, setBrandColor] = useState('#435135');
  const [appearanceMode, setAppearanceMode] = useState<'system' | 'dark' | 'light'>('system');
  const [defaultLanguage, setDefaultLanguage] = useState<'ar' | 'en'>('ar');

  // Homepage Section States
  const [heroTitle, setHeroTitle] = useState('أناقة ناعمة وراحة تدوم لطفلك الصغير');
  const [heroSubtitle, setHeroSubtitle] = useState('خامات قطنية فائقة النعومة وتصاميم بروح البهجة مع ميزة المعاينة قبل الاستلام');
  const [heroButtonText, setHeroButtonText] = useState('تسوق التشكيلة الآن');
  const [showTrustFeatures, setShowTrustFeatures] = useState(true);

  // Header Section States
  const [announcementText, setAnnouncementText] = useState('شحن مجاني لكافة طلبات المحافظات فوق 50,000 د.ع');
  const [isHeaderSticky, setIsHeaderSticky] = useState(true);
  const [hotlinePhone, setHotlinePhone] = useState('+964 770 000 0000');

  // Footer Section States
  const [footerCopyright, setFooterCopyright] = useState('جميع الحقوق محفوظة • مدعوم بواسطة منصة الزعيم');
  const [showPaymentBadges, setShowPaymentBadges] = useState(true);

  // Toolbar Section States
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
        if (c.announcementText) setAnnouncementText(c.announcementText);
        if (c.hotlinePhone) setHotlinePhone(c.hotlinePhone);
        if (c.whatsAppNumber) setWhatsAppNumber(c.whatsAppNumber);
      }
    } catch {}
  }, []);

  const fullDomain = `${subdomain}.za3em.shop`;
  const fullUrl = `https://${fullDomain}`;

  const currentThemeConfig = TEMPLATES_MAP[selectedTheme] || TEMPLATES_MAP['store-sprout'] || TEMPLATES_MAP['store-classic'];

  const handleSaveAndPublish = async () => {
    setIsSaving(true);
    try {
      const customizationData = {
        brandColor,
        appearanceMode,
        defaultLanguage,
        heroTitle,
        heroSubtitle,
        heroButtonText,
        showTrustFeatures,
        announcementText,
        isHeaderSticky,
        hotlinePhone,
        footerCopyright,
        showPaymentBadges,
        enableWhatsAppFloating,
        whatsAppNumber,
        enableStickyCartBar
      };

      localStorage.setItem('zaeem_theme_customization', JSON.stringify(customizationData));

      // Update store state
      const rawStore = localStorage.getItem('zaeem_store_data') || '{}';
      const parsedStore = JSON.parse(rawStore);
      parsedStore.customization = customizationData;
      parsedStore.selectedTheme = selectedTheme;
      localStorage.setItem('zaeem_store_data', JSON.stringify(parsedStore));

      // Sync to cloud DB
      await updateCloudStoreFullSettings({
        subdomain,
        name: storeName,
        templateId: selectedTheme
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

  const getViewportWidthClass = () => {
    switch (viewport) {
      case 'mobile':
        return 'w-[375px] max-w-full';
      case 'tablet':
        return 'w-[768px] max-w-full';
      case 'desktop':
      default:
        return 'w-full max-w-[1280px]';
    }
  };

  return (
    <div className="min-h-screen bg-[#0d131f] text-slate-100 font-sans antialiased flex flex-col" dir="rtl">
      
      {/* 1. Customizer Navigation Tabs Header */}
      <header className="bg-[#121c2e] border-b border-slate-800 px-4 md:px-6 py-2.5 flex items-center justify-between gap-4 sticky top-0 z-40 shadow-lg">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setLocation('/store')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all"
          >
            <ArrowLeft className="size-3.5" />
            <span>العودة للمتجر</span>
          </button>

          {/* Section Tabs (الهوية، الصفحة الرئيسية، صفحة المنتجات، صفحة المنتج، الهيدر، الفوتر، شريط الأدوات) */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-900/90 p-1 rounded-2xl border border-slate-800">
            {[
              { id: 'identity', label: 'الهوية', icon: Palette },
              { id: 'home', label: 'الصفحة الرئيسية', icon: Home },
              { id: 'products', label: 'صفحة المنتجات', icon: LayoutGrid },
              { id: 'product', label: 'صفحة المنتج', icon: Package },
              { id: 'header', label: 'الهيدر', icon: PanelTop },
              { id: 'footer', label: 'الفوتر', icon: PanelBottom },
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

        {/* Right Actions: Save & Publish */}
        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 animate-pulse">
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

      {/* 3. Main Workspace: Left Controls Sidebar + Right Responsive Preview Canvas */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left Customizer Controls Panel */}
        <aside className="w-full lg:w-[380px] bg-[#101826] border-l border-slate-800 p-5 overflow-y-auto space-y-6 shrink-0 max-h-[calc(100vh-100px)]">
          
          {/* Active Theme Info Card */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-blue-400 flex items-center gap-1">
                <Sparkles className="size-3.5" />
                ثيم «{currentThemeConfig.name}»
              </span>
              <span className="text-[10px] font-mono text-slate-400 font-bold">{currentThemeConfig.nameEn}</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              يتحكم في تخطيط متجرك بالكامل. عدّل المحتوى والهوية هنا — خيارات «التخطيط» يحددها الثيم.
            </p>
          </div>

          {/* TAB 1: الهوية (Brand Identity) */}
          {activeSection === 'identity' && (
            <div className="space-y-5 animate-fadeIn">
              {/* لون الهوية الأساسي */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-300 block">لون الهوية الأساسي (Brand Color)</label>
                <div className="flex items-center gap-3">
                  <div
                    className="size-10 rounded-xl border border-white/20 shadow-md shrink-0 cursor-pointer"
                    style={{ backgroundColor: brandColor }}
                  />
                  <input
                    type="text"
                    value={brandColor}
                    onChange={(e) => setBrandColor(e.target.value)}
                    className="flex-1 h-10 px-3 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono font-bold text-white focus:border-blue-500 focus:outline-none dir-ltr text-right"
                  />
                  <input
                    type="color"
                    value={brandColor}
                    onChange={(e) => setBrandColor(e.target.value)}
                    className="size-10 opacity-0 absolute cursor-pointer"
                  />
                </div>
              </div>

              {/* وضع المظهر (النظام / داكن / فاتح) */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-300 block">وضع المظهر (Theme Mode)</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'system', label: 'النظام', icon: Laptop },
                    { id: 'dark', label: 'داكن', icon: Moon },
                    { id: 'light', label: 'فاتح', icon: Sun },
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
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <Icon className="size-4" />
                        <span>{mode.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* اللغة الافتراضية */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-300 block">اللغة الافتراضية (Default Language)</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDefaultLanguage('ar')}
                    className={`py-2.5 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 ${
                      defaultLanguage === 'ar'
                        ? 'bg-blue-600 text-white border-blue-500 shadow-md'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    <Globe className="size-3.5" />
                    <span>العربية (RTL)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDefaultLanguage('en')}
                    className={`py-2.5 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 ${
                      defaultLanguage === 'en'
                        ? 'bg-blue-600 text-white border-blue-500 shadow-md'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    <Globe className="size-3.5" />
                    <span>English (LTR)</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: الصفحة الرئيسية (Homepage) */}
          {activeSection === 'home' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">عنوان البانر الرئيسي (Headline)</label>
                <input
                  type="text"
                  value={heroTitle}
                  onChange={(e) => setHeroTitle(e.target.value)}
                  className="w-full h-10 px-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">النص الفرعي للبانر (Subtitle)</label>
                <textarea
                  rows={3}
                  value={heroSubtitle}
                  onChange={(e) => setHeroSubtitle(e.target.value)}
                  className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">نص زر الشراء الرئيسي</label>
                <input
                  type="text"
                  value={heroButtonText}
                  onChange={(e) => setHeroButtonText(e.target.value)}
                  className="w-full h-10 px-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showTrustFeatures}
                    onChange={(e) => setShowTrustFeatures(e.target.checked)}
                    className="size-4 rounded accent-blue-600"
                  />
                  <span className="text-xs font-bold text-slate-300">إظهار شريط مزايا الشحن والدفع والأمان</span>
                </label>
              </div>
            </div>
          )}

          {/* TAB 5: الهيدر (Header) */}
          {activeSection === 'header' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">نص الشريط الإعلاني العلوي</label>
                <input
                  type="text"
                  value={announcementText}
                  onChange={(e) => setAnnouncementText(e.target.value)}
                  className="w-full h-10 px-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">رقم هاتف خدمة الزبائن (Hotline)</label>
                <input
                  type="text"
                  value={hotlinePhone}
                  onChange={(e) => setHotlinePhone(e.target.value)}
                  dir="ltr"
                  className="w-full h-10 px-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white font-mono focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isHeaderSticky}
                    onChange={(e) => setIsHeaderSticky(e.target.checked)}
                    className="size-4 rounded accent-blue-600"
                  />
                  <span className="text-xs font-bold text-slate-300">تثبيت الهيدر أثناء التمرير (Sticky Header)</span>
                </label>
              </div>
            </div>
          )}

          {/* TAB 6: الفوتر (Footer) */}
          {activeSection === 'footer' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">نص حقوق النشر (Copyright)</label>
                <input
                  type="text"
                  value={footerCopyright}
                  onChange={(e) => setFooterCopyright(e.target.value)}
                  className="w-full h-10 px-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showPaymentBadges}
                    onChange={(e) => setShowPaymentBadges(e.target.checked)}
                    className="size-4 rounded accent-blue-600"
                  />
                  <span className="text-xs font-bold text-slate-300">إظهار شارات الدفع عند الاستلام والشحن السريع</span>
                </label>
              </div>
            </div>
          )}

          {/* TAB 7: شريط الأدوات (Toolbar) */}
          {activeSection === 'toolbar' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="space-y-2 p-3 rounded-xl bg-slate-900 border border-slate-800">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enableWhatsAppFloating}
                    onChange={(e) => setEnableWhatsAppFloating(e.target.checked)}
                    className="size-4 rounded accent-emerald-500"
                  />
                  <span className="text-xs font-bold text-emerald-400">تفعيل زر واتساب العائم للطلب السريع</span>
                </label>

                {enableWhatsAppFloating && (
                  <div className="pt-2">
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">رقم واتساب المعتمد</label>
                    <input
                      type="text"
                      value={whatsAppNumber}
                      onChange={(e) => setWhatsAppNumber(e.target.value)}
                      dir="ltr"
                      placeholder="+964 770 000 0000"
                      className="w-full h-9 px-3 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                )}
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enableStickyCartBar}
                    onChange={(e) => setEnableStickyCartBar(e.target.checked)}
                    className="size-4 rounded accent-blue-600"
                  />
                  <span className="text-xs font-bold text-slate-300">تفعيل شريط السلة العائم أسفل الشاشة</span>
                </label>
              </div>
            </div>
          )}

          {/* Default fallback info */}
          {(activeSection === 'products' || activeSection === 'product') && (
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-400 space-y-2">
              <span className="font-bold text-white block">إعدادات العرض والشراء الفوري:</span>
              <p>تم تفعيل نظام الدفع عند الاستلام العراقي المباشر (COD) التلقائي في جميع بطاقات المنتجات مع الحساب الفوري لتكاليف الشحن.</p>
            </div>
          )}

        </aside>

        {/* Right Responsive Preview Canvas */}
        <main className="flex-1 bg-[#090d15] p-4 md:p-6 flex flex-col items-center overflow-y-auto">
          
          {/* Top Canvas Viewport Switcher Bar (Desktop / Tablet / Mobile) */}
          <div className="w-full max-w-[1280px] mb-4 flex items-center justify-between gap-3 bg-[#121a28] border border-slate-800 px-4 py-2 rounded-2xl shadow-md">
            
            {/* Viewport Width Indicator */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold text-slate-400">
                {viewport === 'desktop' ? '1280px' : viewport === 'tablet' ? '768px' : '375px'}
              </span>
              <span className="text-xs font-bold text-slate-300 hidden sm:inline">
                {storeName} — ({fullDomain})
              </span>
            </div>

            {/* Viewport Switcher Buttons */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setViewport('desktop')}
                title="كمبيوتر (Desktop)"
                className={`p-1.5 rounded-lg transition-all ${
                  viewport === 'desktop' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Monitor className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewport('tablet')}
                title="لوحي (Tablet)"
                className={`p-1.5 rounded-lg transition-all ${
                  viewport === 'tablet' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Tablet className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewport('mobile')}
                title="هاتف (Mobile)"
                className={`p-1.5 rounded-lg transition-all ${
                  viewport === 'mobile' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="size-4" />
              </button>
            </div>

            {/* Reload & Popout */}
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
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold border border-slate-800 transition-colors"
              >
                <ExternalLink className="size-3.5" />
                <span className="hidden sm:inline">معاينة خارجية</span>
              </a>
            </div>
          </div>

          {/* Live Component Preview Container */}
          <div
            key={previewKey}
            className={`${getViewportWidthClass()} transition-all duration-300 rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-800 bg-white`}
          >
            <StoreTemplates
              storeName={storeName}
              subdomain={subdomain}
              activeTemplateId={selectedTheme}
              standalone={true}
              onTemplateChange={(newId) => setSelectedTheme(newId)}
              logoUrl={logoUrl}
            />
          </div>

        </main>
      </div>

    </div>
  );
}

export default ThemeCustomizerPage;
