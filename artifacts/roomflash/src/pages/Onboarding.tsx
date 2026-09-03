import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Logo } from '../components/common/Logo';
import {
  Shirt, Smartphone, Utensils, Sparkles, Wrench, Grid, Plus, Check,
  ChevronLeft, ChevronRight, Upload, ExternalLink, ArrowLeft, ArrowRight,
  Truck, DollarSign, Store, ShieldCheck, Eye, Layers, Wand2, RefreshCw,
  FastForward, CheckCircle2, AlertCircle, Tag, Palette, Package, Gift,
  CheckCheck, Globe, Star, MapPin, Phone, HelpCircle
} from 'lucide-react';
import { formatIQD } from '../data/iraqData';

interface ThemeOption {
  id: string;
  name: string;
  badge: string;
  accent: string;
  borderActive: string;
  ringColor: string;
  previewBg: string;
  headerBg: string;
  cardBg: string;
  pillBg: string;
  priceColor: string;
  btnBg: string;
}

const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'volt',
    name: 'فولت الزمردي',
    badge: 'داكن عصري الأكثر طلباً',
    accent: 'emerald',
    borderActive: 'border-emerald-500',
    ringColor: 'ring-emerald-500/40',
    previewBg: 'bg-slate-950',
    headerBg: 'bg-slate-900 border-slate-800',
    cardBg: 'bg-slate-900/90 border-slate-800',
    pillBg: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60',
    priceColor: 'text-emerald-400',
    btnBg: 'bg-emerald-600 hover:bg-emerald-500 text-white'
  },
  {
    id: 'rose',
    name: 'روز الفاخر',
    badge: 'عطور ومستحضرات تجميل',
    accent: 'rose',
    borderActive: 'border-rose-500',
    ringColor: 'ring-rose-500/40',
    previewBg: 'bg-[#15070b]',
    headerBg: 'bg-[#220c13] border-rose-900/40',
    cardBg: 'bg-[#2a0e17] border-rose-900/40',
    pillBg: 'bg-rose-950/60 text-rose-300 border-rose-800/60',
    priceColor: 'text-rose-400',
    btnBg: 'bg-rose-600 hover:bg-rose-500 text-white'
  },
  {
    id: 'nitro',
    name: 'نيترو الرياضي',
    badge: 'أزياء وأحذية سريعة',
    accent: 'red',
    borderActive: 'border-red-500',
    ringColor: 'ring-red-500/40',
    previewBg: 'bg-[#120707]',
    headerBg: 'bg-[#200b0b] border-red-900/40',
    cardBg: 'bg-[#260d0d] border-red-900/40',
    pillBg: 'bg-red-950/60 text-red-300 border-red-800/60',
    priceColor: 'text-red-400',
    btnBg: 'bg-red-600 hover:bg-red-500 text-white'
  },
  {
    id: 'sepia',
    name: 'هاير الملكي',
    badge: 'ساعات وهدايا فخمة',
    accent: 'amber',
    borderActive: 'border-amber-500',
    ringColor: 'ring-amber-500/40',
    previewBg: 'bg-[#140f08]',
    headerBg: 'bg-[#22190e] border-amber-900/40',
    cardBg: 'bg-[#2b1f11] border-amber-900/40',
    pillBg: 'bg-amber-950/60 text-amber-300 border-amber-800/60',
    priceColor: 'text-amber-400',
    btnBg: 'bg-amber-600 hover:bg-amber-500 text-white'
  },
  {
    id: 'ocean',
    name: 'أوشن إكسبريس',
    badge: 'إلكترونيات ومتجر عام',
    accent: 'cyan',
    borderActive: 'border-cyan-500',
    ringColor: 'ring-cyan-500/40',
    previewBg: 'bg-[#061019]',
    headerBg: 'bg-[#0b1d2e] border-cyan-900/40',
    cardBg: 'bg-[#0e263c] border-cyan-900/40',
    pillBg: 'bg-cyan-950/60 text-cyan-300 border-cyan-800/60',
    priceColor: 'text-cyan-400',
    btnBg: 'bg-cyan-600 hover:bg-cyan-500 text-white'
  }
];

const SAMPLE_PRODUCTS = [
  {
    name: 'عطر تاج الفخامة الفرنسي الملكي',
    price: '45000',
    category: 'عطور وبخور',
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'ساعة لومينور بريميوم أوتوماتيك',
    price: '85000',
    category: 'ساعات وإكسسوارات',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'حذاء سنيكرز برو إير لايت',
    price: '62000',
    category: 'أحذية وأزياء',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'سماعة برو اللاسلكية عازلة للضوضاء',
    price: '55000',
    category: 'إلكترونيات',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80'
  }
];

const NICHE_OPTIONS = [
  {
    id: 'fashion',
    label: 'أزياء وملابس',
    desc: 'رجالي، نسائي، أطفال، أحذية',
    icon: Shirt,
    defaultCats: ['أزياء رجالي', 'فساتين وعبايات', 'أحذية رياضية', 'إكسسوارات']
  },
  {
    id: 'perfumes',
    label: 'عطور وتجميل',
    desc: 'عطور فرنسية، عود وبخور، عناية',
    icon: Sparkles,
    defaultCats: ['عطور فرنسية', 'دهن عود وبخور', 'عناية بالبشرة', 'مستحضرات تجميل']
  },
  {
    id: 'electronics',
    label: 'هواتف وإلكترونيات',
    desc: 'موبايلات، كفرات، ساعات ذكية، ملحقات',
    icon: Smartphone,
    defaultCats: ['كفرات وشواحن', 'ساعات ذكية', 'سماعات صوتية', 'أجهزة ذكية']
  },
  {
    id: 'watches',
    label: 'ساعات وهدايا',
    desc: 'ساعات فاخرة، نظارات، هدايا تذكارية',
    icon: Star,
    defaultCats: ['ساعات كلاسيك', 'ساعات رياضية', 'نظارات شمسية', 'أطقم هدايا']
  },
  {
    id: 'home',
    label: 'أدوات منزلية وديكور',
    desc: 'مستلزمات البيت، ديكورات، إضاءة',
    icon: Store,
    defaultCats: ['إضاءة عصرية', 'مستلزمات مطبخ', 'ديكور منزلي', 'منظمات']
  },
  {
    id: 'general',
    label: 'متجر عام وتريند',
    desc: 'منتجات متنوعة وأحدث صيحات السوق',
    icon: Grid,
    defaultCats: ['الأكثر مبيعاً', 'وصل حديثاً', 'عروض التوفير', 'منتجات حصرية']
  }
];

export function OnboardingPage() {
  const [, setLocation] = useLocation();

  // Wizard Navigation: Step 1 to 5
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Store Configuration State
  const [storeName, setStoreName] = useState('متجر الزعيم الذهبي');
  const [subdomain, setSubdomain] = useState('alzaeem.za3em.shop');
  const [slogan, setSlogan] = useState('أفضل المنتجات المختارة بعناية والتوصيل لباب بيتك');
  const [selectedNiche, setSelectedNiche] = useState('perfumes');
  const [selectedTheme, setSelectedTheme] = useState('volt');
  const [categories, setCategories] = useState<string[]>(['عطور فرنسية', 'دهن عود وبخور', 'عناية بالبشرة']);
  const [newCatInput, setNewCatInput] = useState('');

  // Product State
  const [productName, setProductName] = useState('عطر تاج الفخامة الملكي');
  const [productPrice, setProductPrice] = useState('45000');
  const [productCategory, setProductCategory] = useState('عطور فرنسية');
  const [productImage, setProductImage] = useState(
    'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&auto=format&fit=crop&q=80'
  );
  const [productAdded, setProductAdded] = useState(true);

  // Auto-fill from localStorage on initial load
  useEffect(() => {
    try {
      const stored = localStorage.getItem('zaeem_store_data');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.storeName) {
          setStoreName(parsed.storeName);
          const cleanSub = (parsed.subdomain || parsed.storeName)
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '') || 'store';
          setSubdomain(`${cleanSub}.za3em.shop`);
        }
      }
    } catch {}
  }, []);

  // Quick 1-Click Auto Pilot Filler
  const handleUseDefaultSample = () => {
    setStoreName('متجر الفخامة العراقي');
    setSubdomain('fakhama.za3em.shop');
    setSlogan('وجهتك الأولى للتسوق الراقي والشحن السريع لجميع محافظات العراق');
    setSelectedNiche('perfumes');
    setSelectedTheme('volt');
    setCategories(['عطور رجالي', 'عطور نسائي', 'بخور ومباخر ملكية']);
    setProductName('عطر تاج الفخامة الفرنسي الملكي');
    setProductPrice('45000');
    setProductCategory('عطور رجالي');
    setProductImage(SAMPLE_PRODUCTS[0].image);
    setProductAdded(true);
    setCurrentStep(5); // Jump directly to Review & Launch!
  };

  // Step 2 Niche Switch Helper
  const handleSelectNiche = (nicheId: string) => {
    setSelectedNiche(nicheId);
    const found = NICHE_OPTIONS.find(n => n.id === nicheId);
    if (found) {
      setCategories(found.defaultCats);
      setProductCategory(found.defaultCats[0] || 'عام');
    }
  };

  const handleAddCategory = () => {
    if (newCatInput.trim() && !categories.includes(newCatInput.trim())) {
      setCategories([...categories, newCatInput.trim()]);
      setNewCatInput('');
    }
  };

  const handleRemoveCategory = (catToRemove: string) => {
    setCategories(categories.filter(c => c !== catToRemove));
  };

  const handlePickSampleProduct = (sample: typeof SAMPLE_PRODUCTS[0]) => {
    setProductName(sample.name);
    setProductPrice(sample.price);
    setProductCategory(sample.category);
    setProductImage(sample.image);
    setProductAdded(true);
  };

  const handleImageUploadSim = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setProductImage(url);
      setProductAdded(true);
    }
  };

  // Final Complete & Launch Store
  const handleCompleteAndLaunch = () => {
    const finalData = {
      storeName,
      subdomain,
      slogan,
      selectedNiche,
      selectedTheme,
      categories,
      product: {
        name: productName,
        price: productPrice,
        category: productCategory,
        image: productImage
      },
      freeShipmentsRemaining: 5,
      governorate: 'بغداد',
      shippingPartner: 'شركة الزعيم للشحن',
      onboardingComplete: true,
      completedAt: new Date().toISOString()
    };

    // Save in persistent stores
    localStorage.setItem('zaeem_onboarded_store', JSON.stringify(finalData));

    const existingStoreData = JSON.parse(localStorage.getItem('zaeem_store_data') || '{}');
    localStorage.setItem('zaeem_store_data', JSON.stringify({
      ...existingStoreData,
      storeName,
      subdomain,
      plan: 'free',
      orderLimit: 5
    }));

    // Redirect to Dashboard
    window.location.hash = '#/dashboard';
    setLocation('/dashboard');
  };

  const activeTheme = THEME_OPTIONS.find(t => t.id === selectedTheme) || THEME_OPTIONS[0];

  return (
    <main dir="rtl" className="min-h-[100dvh] bg-[#070b14] text-slate-100 font-sans select-none flex flex-col relative overflow-x-hidden">
      {/* Dynamic Background Glows */}
      <div className="fixed top-0 right-1/4 -z-10 size-96 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-1/4 -z-10 size-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* ========================================================================= */}
      {/* 1️⃣ TOP HEADER & WIZARD PROGRESS BAR */}
      {/* ========================================================================= */}
      <header className="border-b border-slate-800/80 bg-[#0a101d]/90 backdrop-blur-md sticky top-0 z-40 px-4 md:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Logo showSubtitle={false} inverse />
          <div className="h-5 w-px bg-slate-800 hidden sm:block" />
          <div className="hidden sm:block text-right">
            <h1 className="text-xs font-black text-white flex items-center gap-1.5">
              <Sparkles className="size-3.5 text-teal-400" />
              مركز إعداد المتجر العراقي المعتمد
            </h1>
            <p className="text-[10px] text-slate-400">منصة الزعيم — جهّز متجرك بالكامل في دقائق</p>
          </div>
        </div>

        {/* 1-Click Fast Track Button */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleUseDefaultSample}
            className="flex items-center gap-2 rounded-full border border-amber-500/40 bg-gradient-to-r from-amber-950/60 to-amber-900/40 hover:from-amber-900/70 hover:to-amber-800/60 px-4 py-1.5 text-xs font-black text-amber-300 transition-all shadow-lg shadow-amber-950/50 hover:scale-[1.02] cursor-pointer"
          >
            <Wand2 className="size-3.5 text-amber-400 animate-pulse" />
            <span>نموذج جاهز بنقرة واحدة 🪄</span>
          </button>

          {/* Step Counter Pill */}
          <div className="flex items-center gap-2.5 bg-slate-900/90 border border-slate-800 rounded-full px-3.5 py-1 text-xs">
            <span className="font-mono font-black text-teal-400 text-[11px]">
              {currentStep * 20}%
            </span>
            <span className="text-[10px] font-bold text-slate-400 hidden sm:inline">
              الخطوة {currentStep} من 5
            </span>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2️⃣ SEQUENTIAL STEP TRACKER TABS */}
      {/* ========================================================================= */}
      <div className="border-b border-slate-800/60 bg-[#090e1a]/60 backdrop-blur-sm px-4 md:px-8 py-2.5 overflow-x-auto rf-scrollbar">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-2 min-w-[650px]">
          {[
            { step: 1, title: 'هوية المتجر', subtitle: 'الاسم والرابط', icon: Globe },
            { step: 2, title: 'مجال التجارة', subtitle: 'التخصص والأقسام', icon: Tag },
            { step: 3, title: 'المظهر والقالب', subtitle: 'الألوان والتصميم', icon: Palette },
            { step: 4, title: 'المنتج الأول', subtitle: 'مع رصيد الشحن', icon: Package },
            { step: 5, title: 'المراجعة والإطلاق', subtitle: 'افتتاح المتجر', icon: CheckCheck }
          ].map((item) => {
            const Icon = item.icon;
            const isCompleted = currentStep > item.step;
            const isCurrent = currentStep === item.step;

            return (
              <button
                key={item.step}
                type="button"
                onClick={() => setCurrentStep(item.step)}
                className={`flex-1 flex items-center gap-2.5 p-2 rounded-2xl transition-all cursor-pointer text-right ${
                  isCurrent
                    ? 'bg-teal-950/60 border border-teal-500/40 text-white shadow-md shadow-teal-950/40 ring-1 ring-teal-500/30'
                    : isCompleted
                    ? 'bg-slate-900/50 text-slate-300 hover:bg-slate-900 border border-slate-800/60'
                    : 'text-slate-500 hover:text-slate-400 opacity-60'
                }`}
              >
                <span className={`size-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                  isCurrent
                    ? 'bg-teal-500 text-slate-950'
                    : isCompleted
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {isCompleted ? <Check className="size-3.5 stroke-[3]" /> : item.step}
                </span>

                <div className="overflow-hidden">
                  <p className={`text-xs font-black truncate leading-tight ${isCurrent ? 'text-teal-300' : 'text-slate-200'}`}>
                    {item.title}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">
                    {item.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3️⃣ MAIN SPLIT LAYOUT: Config wizard (7 cols) + Live simulator (5 cols) */}
      {/* ========================================================================= */}
      <div className="flex-1 max-w-[1500px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 p-4 md:p-8">

        {/* ========================================================================= */}
        {/* LEFT / TOP: Wizard Steps (7 cols) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6 order-1">

          {/* ----------------------------------------------------------------------- */}
          {/* STEP 1: Store Identity & Subdomain */}
          {/* ----------------------------------------------------------------------- */}
          {currentStep === 1 && (
            <div className="rounded-3xl border border-slate-800/90 bg-[#0d1424]/90 backdrop-blur-xl p-6 md:p-8 space-y-6 shadow-2xl animate-fadeIn text-right">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] font-black text-teal-400 bg-teal-950/60 px-2.5 py-1 rounded-full border border-teal-800/40">
                    الخطوة 1 من 5 • هوية المتجر
                  </span>
                  <h2 className="text-xl font-black text-white mt-2">
                    اختر اسم متجرك ورابط الموقع الفرعي
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    هذا الاسم والرابط هما ما سيراه عملاؤك وزبائنك في العراق عند الشراء.
                  </p>
                </div>
                <div className="size-12 rounded-2xl bg-teal-500/10 text-teal-400 grid place-items-center border border-teal-500/20">
                  <Globe className="size-6" />
                </div>
              </div>

              {/* Store Name Input */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-200 block">
                  اسم المتجر التجاري *
                </label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => {
                    setStoreName(e.target.value);
                    const clean = e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '') || 'store';
                    setSubdomain(`${clean}.za3em.shop`);
                  }}
                  placeholder="مثال: متجر الفخامة العراقي"
                  className="w-full rounded-2xl border border-slate-700/80 bg-slate-950/90 px-4 py-3.5 text-sm text-white focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all"
                />

                {/* Quick Name Suggestions */}
                <div className="flex items-center gap-2 pt-1 flex-wrap">
                  <span className="text-[10px] text-slate-400 font-bold">اقتراحات سريعة:</span>
                  {['متجر الفخامة', 'بوتيك الزعيم', 'أوريت إكسبريس', 'ركن الأناقة'].map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => {
                        setStoreName(suggestion);
                        const clean = suggestion.toLowerCase().replace(/[^a-z0-9]/g, '') || 'store';
                        setSubdomain(`${clean}.za3em.shop`);
                      }}
                      className="text-[10px] font-bold text-slate-300 bg-slate-800/80 hover:bg-slate-700 px-2.5 py-1 rounded-lg border border-slate-700 transition-colors cursor-pointer"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subdomain URL Generator */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-200 block">
                  رابط موقعك الفرعي المباشر (Subdomain)
                </label>
                <div className="flex items-center rounded-2xl border border-slate-700/80 bg-slate-950/90 px-4 py-3 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/20 transition-all">
                  <input
                    type="text"
                    value={subdomain.replace('.za3em.shop', '')}
                    onChange={(e) => {
                      const clean = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
                      setSubdomain(`${clean}.za3em.shop`);
                    }}
                    placeholder="my-store"
                    dir="ltr"
                    className="flex-1 bg-transparent text-sm font-mono text-teal-400 focus:outline-none text-right"
                  />
                  <span className="text-slate-500 text-xs font-mono font-bold select-none pr-1">
                    .za3em.shop
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="size-3.5" /> هذا الرابط محجوز لحسابك ومتاح فوراً
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">HTTPS / SSL مجاني معتمد</span>
                </div>
              </div>

              {/* Slogan */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-200 block">
                  شعار المتجر أو النبذة الترحيبية (Slogan)
                </label>
                <input
                  type="text"
                  value={slogan}
                  onChange={(e) => setSlogan(e.target.value)}
                  placeholder="مثال: أفضل المنتجات بأسعار منافسة والتوصيل السريع لجميع محافظات العراق"
                  className="w-full rounded-2xl border border-slate-700/80 bg-slate-950/90 px-4 py-3 text-xs text-white focus:border-teal-500 focus:outline-none transition-all"
                />
              </div>
            </div>
          )}

          {/* ----------------------------------------------------------------------- */}
          {/* STEP 2: Niche & Categories */}
          {/* ----------------------------------------------------------------------- */}
          {currentStep === 2 && (
            <div className="rounded-3xl border border-slate-800/90 bg-[#0d1424]/90 backdrop-blur-xl p-6 md:p-8 space-y-6 shadow-2xl animate-fadeIn text-right">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] font-black text-teal-400 bg-teal-950/60 px-2.5 py-1 rounded-full border border-teal-800/40">
                    الخطوة 2 من 5 • تخصص المتجر
                  </span>
                  <h2 className="text-xl font-black text-white mt-2">
                    ما هو مجال تجارتك والأقسام الرئيسية؟
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    اختر نشاطك التجاري ليتم تخصيص الأقسام المناسبة لمتجرك تلقائياً.
                  </p>
                </div>
                <div className="size-12 rounded-2xl bg-teal-500/10 text-teal-400 grid place-items-center border border-teal-500/20">
                  <Tag className="size-6" />
                </div>
              </div>

              {/* Niche Selector Grid */}
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-200 block">
                  اختر تخصص متجرك:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {NICHE_OPTIONS.map((niche) => {
                    const Icon = niche.icon;
                    const isSelected = selectedNiche === niche.id;

                    return (
                      <button
                        key={niche.id}
                        type="button"
                        onClick={() => handleSelectNiche(niche.id)}
                        className={`flex flex-col items-start justify-between p-4 rounded-2xl border text-right transition-all cursor-pointer h-28 ${
                          isSelected
                            ? 'border-teal-500 bg-teal-950/50 text-white shadow-lg shadow-teal-950/50 ring-2 ring-teal-500/40 scale-[1.02]'
                            : 'border-slate-800 bg-slate-950/80 text-slate-400 hover:border-slate-700 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <Icon className={`size-5 ${isSelected ? 'text-teal-400' : 'text-slate-400'}`} />
                          {isSelected && (
                            <span className="size-4 rounded-full bg-teal-500 text-slate-950 grid place-items-center text-[9px] font-black">
                              ✓
                            </span>
                          )}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-xs text-white">{niche.label}</h4>
                          <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{niche.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Categories Pills Manager */}
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-slate-200 block">
                    أقسام وتصنيفات المتجر (يمكنك الحذف والإضافة):
                  </label>
                  <span className="text-[10px] text-teal-400 font-bold">{categories.length} أقسام محددة</span>
                </div>

                {/* Pills List */}
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-slate-200"
                    >
                      <span>{cat}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveCategory(cat)}
                        className="text-slate-400 hover:text-red-400 font-black cursor-pointer"
                        title="حذف هذا القسم"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                {/* Add New Category Tag */}
                <div className="flex gap-2 pt-2">
                  <input
                    type="text"
                    value={newCatInput}
                    onChange={(e) => setNewCatInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCategory(); } }}
                    placeholder="اكتب اسم قسم جديد واضغط إضافة..."
                    className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-xs text-white focus:border-teal-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddCategory}
                    className="rounded-xl bg-teal-600 hover:bg-teal-500 px-5 text-xs font-bold text-white transition-colors cursor-pointer"
                  >
                    + إضافة
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ----------------------------------------------------------------------- */}
          {/* STEP 3: Theme & Visual Style */}
          {/* ----------------------------------------------------------------------- */}
          {currentStep === 3 && (
            <div className="rounded-3xl border border-slate-800/90 bg-[#0d1424]/90 backdrop-blur-xl p-6 md:p-8 space-y-6 shadow-2xl animate-fadeIn text-right">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] font-black text-teal-400 bg-teal-950/60 px-2.5 py-1 rounded-full border border-teal-800/40">
                    الخطوة 3 من 5 • مظهر المتجر
                  </span>
                  <h2 className="text-xl font-black text-white mt-2">
                    اختر القالب والألوان التي تعجبك
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    القالب ينعكس فورياً في شاشة المعاينة على اليسار، ويمكنك تغييره لاحقاً في أي وقت.
                  </p>
                </div>
                <div className="size-12 rounded-2xl bg-teal-500/10 text-teal-400 grid place-items-center border border-teal-500/20">
                  <Palette className="size-6" />
                </div>
              </div>

              {/* Theme Options Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {THEME_OPTIONS.map((theme) => {
                  const isSelected = selectedTheme === theme.id;
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => setSelectedTheme(theme.id)}
                      className={`relative p-4 rounded-2xl border text-right transition-all flex flex-col justify-between h-36 cursor-pointer ${
                        isSelected
                          ? `${theme.borderActive} ${theme.previewBg} ring-2 ${theme.ringColor} shadow-xl scale-[1.02]`
                          : `${theme.previewBg} border-slate-800/80 opacity-75 hover:opacity-100 hover:border-slate-700`
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-white">
                            {theme.badge}
                          </span>
                          {isSelected && (
                            <span className="size-4 rounded-full bg-emerald-500 text-slate-950 grid place-items-center text-[9px] font-black">
                              ✓
                            </span>
                          )}
                        </div>
                        <h4 className="font-extrabold text-sm text-white mt-2.5">{theme.name}</h4>
                      </div>

                      {/* Color Palette Indicator Dot Strip */}
                      <div className="flex items-center justify-between pt-2 border-t border-white/10">
                        <span className={`text-[10px] font-bold ${theme.priceColor}`}>
                          {isSelected ? '✓ مفعّل الآن للمعاينة' : 'اضغط للتفعيل'}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className={`size-2.5 rounded-full ${theme.btnBg.split(' ')[0]}`} />
                          <span className="size-2 rounded-full bg-white/40" />
                          <span className="size-2 rounded-full bg-black/60" />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Theme Note */}
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3 text-xs text-slate-300">
                <Palette className="size-4 text-teal-400 shrink-0" />
                <span>
                  جميع القوالب مصممة هندسياً ومتوافقة مع الهواتف الذكية وسريعة التحميل لعملائك داخل العراق.
                </span>
              </div>
            </div>
          )}

          {/* ----------------------------------------------------------------------- */}
          {/* STEP 4: First Product & Free Shipping Activation */}
          {/* ----------------------------------------------------------------------- */}
          {currentStep === 4 && (
            <div className="rounded-3xl border border-slate-800/90 bg-[#0d1424]/90 backdrop-blur-xl p-6 md:p-8 space-y-6 shadow-2xl animate-fadeIn text-right">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] font-black text-teal-400 bg-teal-950/60 px-2.5 py-1 rounded-full border border-teal-800/40">
                    الخطوة 4 من 5 • أول منتج حقيقي
                  </span>
                  <h2 className="text-xl font-black text-white mt-2">
                    أضف أول منتج لمتجرك لتبدأ بالبيع
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    يمكنك اختيار منتج جاهز بنقرة واحدة أو كتابة بيانات منتجك الخاص.
                  </p>
                </div>
                <div className="size-12 rounded-2xl bg-teal-500/10 text-teal-400 grid place-items-center border border-teal-500/20">
                  <Package className="size-6" />
                </div>
              </div>

              {/* Quick Sample Products Picker */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-300 block">
                  أو اختر نموذجاً جاهزاً سريعاً:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {SAMPLE_PRODUCTS.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handlePickSampleProduct(item)}
                      className={`p-2 rounded-xl border text-right transition-all flex items-center gap-2 cursor-pointer ${
                        productName === item.name
                          ? 'border-teal-500 bg-teal-950/60 text-white ring-1 ring-teal-500/40'
                          : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-white'
                      }`}
                    >
                      <img src={item.image} alt={item.name} className="size-10 rounded-lg object-cover shrink-0" />
                      <div className="overflow-hidden">
                        <p className="text-[11px] font-bold truncate leading-tight">{item.name}</p>
                        <p className="text-[10px] text-teal-400 font-mono mt-0.5">{formatIQD(Number(item.price))}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Form */}
              <div className="space-y-4 pt-2 border-t border-slate-800">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1 text-right">
                    <label className="text-xs font-bold text-slate-300 block">اسم المنتج *</label>
                    <input
                      type="text"
                      value={productName}
                      onChange={(e) => { setProductName(e.target.value); setProductAdded(true); }}
                      placeholder="مثال: عطر تاج الفخامة الملكي"
                      className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-xs text-white focus:border-teal-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1 text-right">
                    <label className="text-xs font-bold text-slate-300 block">السعر بالدينار العراقي (د.ع) *</label>
                    <input
                      type="number"
                      value={productPrice}
                      onChange={(e) => { setProductPrice(e.target.value); setProductAdded(true); }}
                      placeholder="45000"
                      className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-xs text-white font-mono focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Category selector for this product */}
                <div className="space-y-1 text-right">
                  <label className="text-xs font-bold text-slate-300 block">قسم المنتج</label>
                  <select
                    value={productCategory}
                    onChange={(e) => setProductCategory(e.target.value)}
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-xs text-white focus:border-teal-500 focus:outline-none"
                  >
                    {categories.map((c, i) => (
                      <option key={i} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Image Upload simulation */}
                <div className="relative rounded-2xl border-2 border-dashed border-slate-700 bg-slate-950 p-4 text-center hover:border-teal-500/50 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUploadSim}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div className="flex items-center justify-center gap-3">
                    <img src={productImage} alt="Preview" className="size-12 rounded-xl object-cover border border-slate-700" />
                    <div className="text-right">
                      <p className="text-xs font-bold text-white">اضغط لتغيير صورة المنتج أو ارفع صورتك الخاصة</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">JPG, PNG, WEBP — التحسين والضغط فوري</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Free 5 Shipments Celebration Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/30 border border-amber-500/30 text-right flex items-start gap-3.5">
                <div className="size-10 rounded-xl bg-amber-500/20 text-amber-400 grid place-items-center shrink-0 border border-amber-500/30">
                  <Gift className="size-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-amber-300">
                    هدية مجانية لمتجرك: 5 شحنات مجانية بالكامل
                  </h4>
                  <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                    تم تفعيل رصيد 5 شحنات مجانية مع أسطول شركة الزعيم للشحن في العراق (توصيل لكافة المحافظات مع تحصيل الدفع عند الاستلام).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ----------------------------------------------------------------------- */}
          {/* STEP 5: Final Review & Launch */}
          {/* ----------------------------------------------------------------------- */}
          {currentStep === 5 && (
            <div className="rounded-3xl border border-teal-500/40 bg-gradient-to-br from-[#0c1424] via-[#09101d] to-slate-950 p-6 md:p-8 space-y-6 shadow-2xl animate-fadeIn text-right">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] font-black text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-800/40">
                    الخطوة الأخيرة • تأكيد الافتتاح
                  </span>
                  <h2 className="text-xl font-black text-white mt-2">
                    متجرك جاهز للانطلاق والبيع في العراق! 🎉
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    راجع البيانات النهائية ثم اضغط على زر الافتتاح للدخول فوراً للوحة التحكم.
                  </p>
                </div>
                <div className="size-12 rounded-2xl bg-emerald-500/10 text-emerald-400 grid place-items-center border border-emerald-500/20">
                  <Sparkles className="size-6 animate-pulse" />
                </div>
              </div>

              {/* Summary Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold block">اسم المتجر التجاري</span>
                  <span className="font-black text-sm text-white">{storeName}</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold block">رابط المتجر المباشر</span>
                  <span className="font-mono font-bold text-sm text-teal-400 truncate block">{subdomain}</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold block">القالب والمظهر</span>
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <span className={`size-2.5 rounded-full ${activeTheme.btnBg.split(' ')[0]}`} />
                    {activeTheme.name}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold block">المنتج الأول المعروض</span>
                  <span className="font-bold text-white truncate block">
                    {productName} ({formatIQD(Number(productPrice))})
                  </span>
                </div>
              </div>

              {/* Logistics & Free Shipments Badge */}
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 flex items-center justify-between text-xs text-emerald-200">
                <div className="flex items-center gap-3">
                  <Truck className="size-5 text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-black block text-emerald-300">أسطول الزعيم للشحن مفعل تلقائياً</span>
                    <span className="text-[11px] text-emerald-400/80">رصيدك: 5 شحنات مجانية + توصيل لجميع المحافظات الـ 18</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black shrink-0">
                  مؤكد ✅
                </span>
              </div>

              {/* Big Launch Button */}
              <button
                type="button"
                onClick={handleCompleteAndLaunch}
                className="w-full flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 py-4 text-sm font-black text-slate-950 shadow-2xl shadow-emerald-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                <span>🚀 افتتح متجرك الآن وادخل لوحة التحكم</span>
              </button>
            </div>
          )}

          {/* ----------------------------------------------------------------------- */}
          {/* BOTTOM STEP NAVIGATION CONTROLS */}
          {/* ----------------------------------------------------------------------- */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-xs font-bold text-slate-300 transition-all cursor-pointer"
              >
                <ChevronRight className="size-4" />
                <span>الخطوة السابقة</span>
              </button>
            ) : (
              <div />
            )}

            {currentStep < 5 && (
              <button
                type="button"
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-xs font-black text-slate-950 shadow-lg shadow-teal-500/20 transition-all cursor-pointer hover:scale-[1.02]"
              >
                <span>متابعة للخطوة التالية</span>
                <ChevronLeft className="size-4" />
              </button>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT: Live Interactive Mobile Mockup (5 cols) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-5 order-2">
          <div className="sticky top-20 rounded-3xl border border-slate-800/90 bg-[#0c1220]/90 backdrop-blur-xl p-5 flex flex-col space-y-4 shadow-2xl">
            {/* Header Simulator Title */}
            <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Smartphone className="size-4 text-teal-400" />
                <span className="font-extrabold text-slate-200">معاينة مباشرة على الموبايل</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono font-bold flex items-center gap-1">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                تحديث فوري
              </span>
            </div>

            {/* Mobile Device Frame */}
            <div className={`rounded-3xl border-4 border-slate-800 ${activeTheme.previewBg} p-3.5 space-y-3 min-h-[500px] flex flex-col justify-between shadow-inner transition-colors duration-300`}>

              {/* Dynamic Island / Device Top Bar */}
              <div className="flex items-center justify-between px-2 pt-1 text-[10px] text-slate-400 font-mono">
                <span>9:41</span>
                <div className="h-3 w-16 bg-black rounded-full mx-auto" />
                <div className="flex items-center gap-1">
                  <span>5G</span>
                  <span>100%</span>
                </div>
              </div>

              {/* URL Bar */}
              <div className="flex items-center justify-between rounded-xl bg-slate-900/90 border border-slate-800 px-3 py-1.5 text-xs">
                <span className="font-mono text-[10px] text-teal-400 truncate dir-ltr">
                  https://{subdomain}
                </span>
                <span className="size-2 rounded-full bg-emerald-500 shrink-0" />
              </div>

              {/* Store View Content */}
              <div className="space-y-3.5 flex-1">
                {/* Store Header Inside Mobile */}
                <div className={`p-3.5 rounded-2xl ${activeTheme.headerBg} flex items-center justify-between transition-colors duration-300`}>
                  <div className="flex items-center gap-2.5">
                    <span className={`size-8 rounded-xl ${activeTheme.btnBg.split(' ')[0]} text-white font-black grid place-items-center text-xs shadow-md`}>
                      {storeName.charAt(0).toUpperCase()}
                    </span>
                    <div className="text-right">
                      <h4 className="font-black text-xs text-white leading-tight truncate max-w-[140px]">{storeName}</h4>
                      <p className="text-[9px] text-slate-400 truncate max-w-[140px] mt-0.5">{slogan}</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-black text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-2 py-0.5 rounded-full shrink-0">
                    🇮🇶 العراق
                  </span>
                </div>

                {/* Categories Scroll Pills */}
                {categories.length > 0 && (
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 rf-scrollbar">
                    {categories.map((cat, idx) => (
                      <span key={idx} className={`shrink-0 text-[9px] font-bold px-2.5 py-1 rounded-full border ${activeTheme.pillBg} transition-colors duration-300`}>
                        {cat}
                      </span>
                    ))}
                  </div>
                )}

                {/* Live Product Card */}
                {productAdded ? (
                  <div className={`rounded-2xl border ${activeTheme.cardBg} overflow-hidden space-y-2 transition-colors duration-300`}>
                    <div className="h-40 bg-slate-900 relative">
                      <img src={productImage} alt="Product" className="size-full object-cover" />
                      <span className={`absolute top-2.5 right-2.5 text-[9px] font-black ${activeTheme.btnBg.split(' ')[0]} text-white px-2 py-0.5 rounded-full shadow-md`}>
                        مميز
                      </span>
                    </div>
                    <div className="p-3 text-right">
                      <h4 className="font-extrabold text-xs text-white leading-snug">{productName}</h4>
                      <div className="flex items-center justify-between mt-2">
                        <p className={`text-sm font-black ${activeTheme.priceColor} font-mono`}>
                          {formatIQD(Number(productPrice) || 45000)}
                        </p>
                        <span className="text-[9px] font-bold text-slate-400 bg-white/5 px-2 py-0.5 rounded-md">
                          {productCategory}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-40 rounded-2xl border-2 border-dashed border-slate-800 grid place-items-center text-xs text-slate-500">
                    أضف منتجك لتراه هنا
                  </div>
                )}

                {/* Shipping Badge in Mobile */}
                <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-2 text-[10px] text-slate-300">
                  <Truck className="size-3.5 text-teal-400 shrink-0" />
                  <span>شحن سريع لجميع محافظات العراق • الدفع عند الاستلام</span>
                </div>
              </div>

              {/* Bottom Mobile Action Button */}
              <button
                type="button"
                onClick={() => setCurrentStep(5)}
                className={`w-full py-3 rounded-xl ${activeTheme.btnBg} text-xs font-black shadow-lg transition-all text-center cursor-pointer`}
              >
                طلب المنتج الآن (الدفع عند الاستلام)
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
