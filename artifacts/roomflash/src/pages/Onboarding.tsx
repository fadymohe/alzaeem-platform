import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Logo } from '../components/common/Logo';
import {
  Shirt, Smartphone, Utensils, Sparkles, Wrench, Grid, Plus, Check,
  ChevronDown, ChevronUp, Upload, ExternalLink, ArrowLeft, ArrowRight,
  Truck, DollarSign, Store, ShieldCheck, Eye, Layers, Wand2, RefreshCw,
  FastForward, CheckCircle2, AlertCircle
} from 'lucide-react';
import { formatIQD } from '../data/iraqData';

interface ThemeOption {
  id: string;
  name: string;
  badge: string;
  color: string;
  previewBg: string;
}

const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'volt',
    name: 'فولت',
    badge: 'داكن عصري',
    color: 'bg-emerald-600 text-white',
    previewBg: 'bg-slate-900 text-white border-slate-800'
  },
  {
    id: 'rose',
    name: 'روز أتيليه',
    badge: 'تجميل وعطور',
    color: 'bg-rose-500 text-white',
    previewBg: 'bg-[#1f0e13] text-rose-100 border-rose-900/40'
  },
  {
    id: 'nitro',
    name: 'نيترو',
    badge: 'أزياء رياضية',
    color: 'bg-red-600 text-white',
    previewBg: 'bg-[#180a0a] text-white border-red-900/40'
  },
  {
    id: 'sepia',
    name: 'هاير سيبيا',
    badge: 'كلاسيك راقي',
    color: 'bg-amber-600 text-white',
    previewBg: 'bg-[#1a140e] text-amber-100 border-amber-900/40'
  },
  {
    id: 'oret',
    name: 'أوريت إكسبريس',
    badge: 'سوبر ستور عام',
    color: 'bg-cyan-600 text-white',
    previewBg: 'bg-[#0f172a] text-cyan-100 border-cyan-900/40'
  }
];

export function OnboardingPage() {
  const [, setLocation] = useLocation();

  // Saved or initial store state
  const [storeName, setStoreName] = useState("متجر الزعيم الذهبي");
  const [subdomain, setSubdomain] = useState('fady.za3em.shop');
  const [selectedNiche, setSelectedNiche] = useState('fashion');
  const [selectedTheme, setSelectedTheme] = useState('volt');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categories, setCategories] = useState<string[]>(['أزياء رجالي', 'إكسسوارات', 'عطور']);

  // Product addition state
  const [productName, setProductName] = useState('عطر الفخامة الملكي');
  const [productPrice, setProductPrice] = useState('45000');
  const [productImage, setProductImage] = useState(
    'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=500&auto=format&fit=crop&q=80'
  );
  const [productAdded, setProductAdded] = useState(true);

  // Accordion open/close state (Step 1, 2, 3, or 4 Review)
  const [activeStepNum, setActiveStepNum] = useState<number>(1);
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Load any previously stored signup data
  useEffect(() => {
    try {
      const stored = localStorage.getItem('zaeem_store_data');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.storeName) {
          setStoreName(parsed.storeName);
          const cleanSub = (parsed.subdomain || parsed.storeName).replace(/\.alzaeem\.iq|\.zaeem\.iq|\.za3em\.shop/g, '');
          setSubdomain(`${cleanSub}.za3em.shop`);
        }
      }
    } catch (e) {
      // fallback
    }
  }, []);

  // Quick default sample filler
  const handleUseDefaultSample = () => {
    setStoreName('متجر الفخامة');
    setSubdomain('fady.za3em.shop');
    setSelectedNiche('fashion');
    setSelectedTheme('volt');
    setCategories(['أزياء وساعات', 'عطور ملكية', 'عناية بالبشرة']);
    setProductName('ساعة لومينور أوتوماتيك');
    setProductPrice('85000');
    setProductImage('https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80');
    setProductAdded(true);
    setActiveStepNum(4); // Jump directly to Review & Confirm!
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      setCategories([...categories, newCategoryName.trim()]);
      setNewCategoryName('');
    }
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    setProductAdded(true);
    setActiveStepNum(3);
  };

  const handleImageUploadSim = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setProductImage(url);
      setProductAdded(true);
    }
  };

  const handleCompleteAndLaunch = () => {
    // Persist final onboarding data
    const finalData = {
      storeName,
      subdomain,
      selectedNiche,
      selectedTheme,
      categories,
      product: { name: productName, price: productPrice, image: productImage },
      onboardingComplete: true
    };
    localStorage.setItem('zaeem_onboarded_store', JSON.stringify(finalData));
    setLocation('/dashboard');
  };

  return (
    <main dir="rtl" className="min-h-[100dvh] bg-[#090d16] text-white font-sans select-none flex flex-col relative">
      {/* ========================================================================= */}
      {/* 1️⃣ TOP HEADER & PROGRESS BAR */}
      {/* ========================================================================= */}
      <header className="border-b border-slate-800 bg-[#0d1322] px-4 md:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <Logo showSubtitle={false} inverse />
          <div className="h-4 w-px bg-slate-800 hidden sm:block" />
          <div className="hidden sm:block">
            <h1 className="text-sm font-extrabold text-white">جهّز متجرك (كل خطوة بنجاح تُحفظ تلقائياً)</h1>
            <p className="text-[11px] text-slate-400">منصة الزعيم — مركز الإعداد الفوري السريع</p>
          </div>
        </div>

        {/* Quick Sample Button & Navigation */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleUseDefaultSample}
            className="flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-950/40 hover:bg-amber-900/50 px-4 py-1.5 text-xs font-black text-amber-300 transition-all shadow-md shadow-amber-950"
          >
            <Wand2 className="size-3.5 text-amber-400 animate-spin" />
            <span>استخدام نموذج افتراضي جاهز بنقرة واحدة</span>
          </button>

          <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-full px-4 py-1">
            <div className="relative size-7 grid place-items-center text-[10px] font-black text-emerald-400 font-mono">
              {activeStepNum === 4 ? '100%' : `${activeStepNum * 25}%`}
            </div>
            <div className="text-right hidden md:block">
              <span className="text-xs font-bold text-white block">الخطوة {activeStepNum} من 4</span>
              <span className="text-[10px] text-slate-400">حفظ تلقائي</span>
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* MAIN CONTAINER: Split Grid Layout */}
      {/* ========================================================================= */}
      <div className="flex-1 max-w-[1600px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 md:p-8">
        {/* ========================================================================= */}
        {/* LEFT COLUMN (5 cols): Live Interactive Mobile & Store Mockup */}
        {/* ========================================================================= */}
        <div className="lg:col-span-5 order-2 lg:order-1 flex flex-col">
          <div className="sticky top-6 rounded-3xl border border-slate-800 bg-[#0d1322] p-4 flex flex-col space-y-4 shadow-2xl">
            <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
              <span className="font-extrabold text-slate-200">شكل متجرك دلوقتى (معاينة حية)</span>
              <span className="text-[10px] text-emerald-400 font-mono font-bold">● متزامن فورياً</span>
            </div>

            {/* Mobile / Screen Frame */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-3 space-y-3 min-h-[460px] flex flex-col justify-between">
              {/* Domain Header */}
              <div className="flex items-center justify-between rounded-xl bg-slate-900 border border-slate-800 px-3 py-1.5 text-xs text-slate-300">
                <span className="font-mono text-[11px] text-emerald-400 truncate">{subdomain}</span>
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              {/* Live Store Content */}
              <div className="space-y-4 flex-1">
                {/* Store Header */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="size-7 rounded-lg bg-emerald-600 text-white font-black grid place-items-center text-xs">
                      {storeName.charAt(0).toUpperCase()}
                    </span>
                    <span className="font-extrabold text-xs text-white">{storeName}</span>
                  </div>
                  <span className="text-[10px] font-bold text-teal-400 bg-teal-950 border border-teal-800/60 px-2 py-0.5 rounded">
                    مصر (EGP)
                  </span>
                </div>

                {/* Categories Pills */}
                {categories.length > 0 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {categories.map((cat, idx) => (
                      <span key={idx} className="shrink-0 text-[10px] font-bold bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full border border-slate-700">
                        {cat}
                      </span>
                    ))}
                  </div>
                )}

                {/* Added Product Card */}
                {productAdded ? (
                  <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden space-y-2">
                    <div className="h-44 bg-slate-800 relative">
                      <img src={productImage} alt="Product" className="size-full object-cover" />
                      <span className="absolute top-2 right-2 text-[10px] font-black bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                        جديد
                      </span>
                    </div>
                    <div className="p-3 text-right">
                      <h4 className="font-extrabold text-xs text-white">{productName}</h4>
                      <p className="text-sm font-black text-emerald-400 font-mono mt-1">
                        {formatIQD(Number(productPrice) || 45000)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="h-48 rounded-xl border border-dashed border-slate-800 bg-slate-900/50 grid place-items-center text-xs text-slate-500">
                    أضف أول منتج حقيقي لمتجرك
                  </div>
                )}
              </div>

              {/* Bottom Action inside Mockup */}
              <button
                type="button"
                onClick={() => setShowReviewModal(true)}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 py-3 text-xs font-black text-white shadow-lg shadow-emerald-950 transition-all hover:scale-[1.01]"
              >
                <span>مراجعة البيانات وافتتح متجرك</span>
                <ExternalLink className="size-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN (7 cols): Configuration Steps Accordion */}
        {/* ========================================================================= */}
        <div className="lg:col-span-7 order-1 lg:order-2 space-y-4">
          {/* STEP 1: Store Name, Niche & Themes */}
          <div className="rounded-3xl border border-slate-800 bg-[#0d1322] p-5 space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="size-6 rounded-full bg-emerald-600/20 text-emerald-400 font-black text-xs grid place-items-center">
                  1
                </span>
                <h3 className="font-extrabold text-sm text-white">متجرك يشتغل (اسم وشكل وأول قسم)</h3>
              </div>

              {/* Skip Step Button */}
              <button
                type="button"
                onClick={() => setActiveStepNum(2)}
                className="flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-white underline"
              >
                <span>تخطي هذه الخطوة ↷</span>
              </button>
            </div>

            {/* Field A: Store Name */}
            <div className="space-y-2 text-right">
              <label className="text-xs font-bold text-slate-300 block">اسم متجرك (يمكن تغييره لاحقاً)</label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs text-white focus:border-emerald-500 focus:outline-none transition-colors"
              />
            </div>

            {/* Field B: What do you sell? (Niche Selector Grid) */}
            <div className="space-y-3 text-right">
              <label className="text-xs font-bold text-slate-300 block">إيه اللي بتبيعه؟ (اختر نشاط متجرك)</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { id: 'fashion', label: 'أزياء وملابس', icon: Shirt },
                  { id: 'electronics', label: 'إلكترونيات', icon: Smartphone },
                  { id: 'food', label: 'مطعم / طعام', icon: Utensils },
                  { id: 'beauty', label: 'تجميل وعناية', icon: Sparkles },
                  { id: 'services', label: 'خدمات', icon: Wrench },
                  { id: 'other', label: 'أخرى', icon: Grid }
                ].map((niche) => {
                  const Icon = niche.icon;
                  const isSelected = selectedNiche === niche.id;
                  return (
                    <button
                      key={niche.id}
                      type="button"
                      onClick={() => setSelectedNiche(niche.id)}
                      className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border transition-all text-center space-y-1.5 ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300 shadow-md ring-1 ring-emerald-500/40'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700 hover:text-white'
                      }`}
                    >
                      <Icon className="size-5" />
                      <span className="text-xs font-bold">{niche.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Field C: Theme Visual Selector Cards */}
            <div className="space-y-3 text-right">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 block">شكل المتجر (اضغط على أي قالب لتعيينه فوراً)</label>
                <span className="text-[10px] font-bold text-emerald-400">✓ القالب النشط: {selectedTheme}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {THEME_OPTIONS.map((theme) => (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => setSelectedTheme(theme.id)}
                    className={`relative p-3 rounded-2xl border transition-all flex flex-col justify-between h-28 text-right ${
                      selectedTheme === theme.id
                        ? 'border-emerald-500 bg-emerald-950/50 ring-2 ring-emerald-500/40 scale-105'
                        : `${theme.previewBg} opacity-80 hover:opacity-100`
                    }`}
                  >
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-white inline-block">
                        {theme.badge}
                      </span>
                      <h4 className="font-extrabold text-xs text-white mt-2">{theme.name}</h4>
                    </div>
                    {selectedTheme === theme.id && (
                      <span className="self-end text-[10px] font-black text-emerald-400 flex items-center gap-1">
                        <Check className="size-3" /> مفعّل
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Field D: Categories Manager */}
            <div className="space-y-2 text-right pt-2 border-t border-slate-800">
              <label className="text-xs font-bold text-slate-300 block">أقسام المتجر (أضف أو عدل الأقسام)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="اسم قسم جديد"
                  className="flex-1 rounded-2xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddCategory}
                  className="rounded-2xl bg-emerald-600 hover:bg-emerald-500 px-5 text-xs font-extrabold text-white"
                >
                  حفظ
                </button>
              </div>
            </div>
          </div>

          {/* STEP 2: Add First Product */}
          <div className="rounded-3xl border border-slate-800 bg-[#0d1322] p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="size-6 rounded-full bg-emerald-600/20 text-emerald-400 font-black text-xs grid place-items-center">
                  2
                </span>
                <h3 className="font-extrabold text-sm text-white">أول منتج حقيقي (من غير منتج المتجر مش هيبيع)</h3>
              </div>

              {/* Skip Step Button */}
              <button
                type="button"
                onClick={() => setActiveStepNum(3)}
                className="flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-white underline"
              >
                <span>تخطي هذه الخطوة ↷</span>
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-4 text-right">
              {/* Drag & Drop Image Simulation */}
              <div className="relative rounded-2xl border-2 border-dashed border-slate-800 bg-slate-950 p-5 text-center hover:border-emerald-500/50 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUploadSim}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <Upload className="size-7 text-emerald-400 mx-auto mb-2" />
                <p className="text-xs font-bold text-white">اضغط أو اسحب صورة المنتج هنا</p>
                <p className="text-[10px] text-slate-500 mt-1">JPG, PNG, WEBP (Max 10MB) - Auto-optimized</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 block">اسم المنتج *</label>
                  <input
                    type="text"
                    required
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="مثال: عطر الفخامة الملكي"
                    className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 block">السعر بالجنيه المصري (ج.م) *</label>
                  <input
                    type="number"
                    required
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                    placeholder="450"
                    className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs text-white font-mono focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-2xl bg-emerald-600 hover:bg-emerald-500 py-3 text-xs font-black text-white shadow-md shadow-emerald-950 transition-all"
              >
                أضف المنتج فوراً لمتجرك
              </button>
            </form>
          </div>

          {/* STEP 3: Shipping & Logistics Confirmation */}
          <div className="rounded-3xl border border-slate-800 bg-[#0d1322] p-5 space-y-4 shadow-xl text-right">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="size-6 rounded-full bg-emerald-600/20 text-emerald-400 font-black text-xs grid place-items-center">
                  3
                </span>
                <h3 className="font-extrabold text-sm text-white">تفعيل الشحن وتأكيد الدفع عند الاستلام</h3>
              </div>
              <span className="text-[10px] font-bold text-emerald-400">جميع المحافظات</span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 text-xs text-emerald-200 space-y-2">
              <div className="flex items-center gap-2 font-black text-emerald-300">
                <CheckCircle2 className="size-4" />
                <span>تم الربط التلقائي مع أسطول شركة الزعيم للشحن</span>
              </div>
              <p className="text-[11px] leading-relaxed text-emerald-200/80">
                جميع طلباتك ستُحجز فورياً برقم تتبع ZAEEM مع دعم كامل للدفع عند الاستلام والتوصيل لجميع المحافظات الـ 18.
              </p>
            </div>
          </div>

          {/* STEP 4: Review Data & Final Confirmation */}
          <div className="rounded-3xl border border-emerald-500/40 bg-gradient-to-br from-[#0d1322] to-slate-900 p-6 space-y-4 shadow-2xl text-right">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="size-6 rounded-full bg-emerald-500 text-white font-black text-xs grid place-items-center">
                  4
                </span>
                <h3 className="font-extrabold text-sm text-white">مراجعة بيانات المتجر والافتتاح الحقيقي</h3>
              </div>
              <span className="text-[10px] font-bold text-emerald-400">جاهز للافتتاح</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">اسم المتجر</span>
                <span className="font-extrabold text-white">{storeName}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">رابط المتجر</span>
                <span className="font-mono font-bold text-emerald-400">{subdomain}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">القالب والتصميم</span>
                <span className="font-bold text-white">{selectedTheme}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">أول منتج</span>
                <span className="font-bold text-white">{productName} ({formatIQD(Number(productPrice) || 45000)})</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCompleteAndLaunch}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 py-4 text-xs font-black text-white shadow-xl shadow-emerald-950 transition-all hover:scale-[1.01]"
            >
              <span>تأكيد المراجعة وافتتاح المتجر فوراً 🚀</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* REVIEW DATA MODAL (Optional Popup) */}
      {/* ========================================================================= */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-3xl border border-slate-800 bg-[#0d1322] p-6 text-right space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-black text-base text-white">مراجعة بيانات متجرك قبل الفتح</h3>
              <button onClick={() => setShowReviewModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between">
                <span className="text-slate-400">اسم المتجر:</span>
                <span className="font-extrabold text-white">{storeName}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between">
                <span className="text-slate-400">النطاق:</span>
                <span className="font-mono font-bold text-emerald-400">{subdomain}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between">
                <span className="text-slate-400">المنتج الأول:</span>
                <span className="font-bold text-white">{productName} - {formatIQD(Number(productPrice) || 45000)}</span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-800 text-emerald-300 text-center font-bold">
                ✓ التغطية مفعلة لجميع المحافظات مع خدمات الشحن
              </div>
            </div>

            <button
              onClick={handleCompleteAndLaunch}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-2xl shadow-lg"
            >
              افتح متجرك الآن
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
