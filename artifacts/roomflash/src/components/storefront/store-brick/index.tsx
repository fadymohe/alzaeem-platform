import React, { useState } from 'react';
import {
  ShoppingBag, Search, Heart, User, ArrowLeft, ArrowRight,
  Truck, ShieldCheck, Headphones, CreditCard, ChevronDown,
  Flame, Zap, RefreshCw, Star, Tag, ChevronRight, PhoneCall, Sparkles, Crown
} from 'lucide-react';
import { formatIQD } from '../../../data/iraqData';
import type { StoreProduct } from '../../../data/storeState';
import type { ThemeComponentProps } from '../store-classic';

export function StoreBrickTheme({
  storeName,
  subdomain,
  fullDomain,
  products,
  filteredProducts,
  cartCount,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onQuickBuy,
  logoUrl
}: ThemeComponentProps) {
  const [activeTab, setActiveTab] = useState('Home');
  const [activeNavCategory, setActiveNavCategory] = useState<string>('all');
  const [browseOpen, setBrowseOpen] = useState(false);

  // Derive unique categories
  const categories = ['الكل', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];

  const categoryMenu = [
    { id: 'all', label: 'الكل (All)', icon: '🛍️', badge: '' },
    { id: 'bestseller', label: 'الأكثر مبيعاً', icon: '🔥', badge: 'Hot', badgeColor: 'bg-orange-500 text-white' },
    { id: 'deal', label: 'عروض اليوم', icon: '⏰', badge: 'New', badgeColor: 'bg-amber-500 text-white' },
    { id: 'featured', label: 'منتجات مميزة', icon: '✨', badge: '' },
    { id: 'electronics', label: 'إلكترونيات وأجهزة', icon: '📱', badge: '' },
    { id: 'fashion', label: 'أزياء وملابس', icon: '👕', badge: '' },
    { id: 'offers', label: 'تخفيضات خاصة', icon: '🎁', badge: '60%', badgeColor: 'bg-rose-500 text-white', hasArrow: true },
    { id: 'home', label: 'المنزل والديكور', icon: '🛋️', badge: '' },
    { id: 'kids', label: 'مستلزمات الأطفال', icon: '🧸', badge: '' },
  ];

  return (
    <div className="min-h-screen bg-[#f3f4f8] text-slate-800 font-sans antialiased selection:bg-orange-500 selection:text-white" dir="rtl">
      
      {/* 1. Top Announcement Bar */}
      <div className="bg-[#172030] text-slate-300 text-[11px] py-1.5 px-4 md:px-8 border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-bold text-amber-400">
              <Flame className="size-3.5 fill-amber-400" />
              <span>شحن مجاني لكافة طلبات المحافظات فوق 50,000 د.ع</span>
            </span>
            <span className="text-slate-600 hidden md:inline">|</span>
            <div className="hidden md:flex items-center gap-2 text-slate-400">
              <span className="hover:text-white cursor-pointer">فيسبوك</span>
              <span className="hover:text-white cursor-pointer">انستغرام</span>
              <span className="hover:text-white cursor-pointer">تيك توك</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-1 bg-slate-800/80 px-2 py-0.5 rounded text-[11px] text-amber-300 border border-slate-700">
              🇮🇶 (IQD) د.ع
            </span>
            <span className="hover:text-white cursor-pointer">سياسة الإرجاع</span>
            <span className="hover:text-white cursor-pointer">الخصوصية</span>
          </div>
        </div>
      </div>

      {/* 2. Main Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          
          {/* Logo & Store Info */}
          <div className="flex items-center gap-3">
            {logoUrl ? (
              <img src={logoUrl} alt={storeName} className="h-10 w-auto max-w-[140px] object-contain rounded-lg" />
            ) : (
              <div className="flex items-center gap-2">
                <div className="size-10 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white font-black grid place-items-center text-lg shadow-md shadow-orange-500/20">
                  <ShoppingBag className="size-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-xl text-slate-900 tracking-tight">{storeName}</span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-orange-500 text-white">PRO</span>
                  </div>
                  <span className="text-[10px] font-mono text-orange-600 dir-ltr block -mt-0.5">
                    {fullDomain}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Search Bar with Category Dropdown */}
          <div className="flex-1 max-w-xl hidden md:flex items-center">
            <div className="w-full flex items-center border-2 border-orange-500 rounded-full overflow-hidden bg-white shadow-sm focus-within:ring-2 focus-within:ring-orange-400/30">
              <div className="px-3 py-1.5 bg-slate-50 border-l border-slate-200 text-xs font-bold text-slate-600 flex items-center gap-1 cursor-pointer">
                <span>كل الأقسام</span>
                <ChevronDown className="size-3 text-slate-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="ابحث عن أي منتج..."
                className="flex-1 h-9 px-4 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none bg-transparent"
              />
              <button
                type="button"
                className="h-9 px-5 bg-orange-500 hover:bg-orange-600 text-white font-bold transition-colors flex items-center justify-center"
              >
                <Search className="size-4" />
              </button>
            </div>
          </div>

          {/* Right Actions: Hotline & Flash Sale & Icons */}
          <div className="flex items-center gap-3 md:gap-4">
            <div className="hidden lg:flex items-center gap-2 text-right">
              <div className="size-9 rounded-full bg-slate-100 text-orange-600 grid place-items-center">
                <PhoneCall className="size-4" />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold block">خدمة الزبائن 24/7</span>
                <span className="text-xs font-black font-mono text-slate-800 dir-ltr block">+964 770 000 0000</span>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-xs shadow-md shadow-orange-500/20 animate-pulse">
              <Zap className="size-3.5 fill-white" />
              <span>عروض فلاش</span>
            </div>

            <div className="flex items-center gap-2">
              <button type="button" className="size-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 grid place-items-center transition-colors">
                <User className="size-4" />
              </button>
              <button type="button" className="size-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 grid place-items-center transition-colors relative">
                <Heart className="size-4" />
                <span className="absolute -top-1 -right-1 size-4 bg-orange-500 text-white text-[9px] font-black rounded-full grid place-items-center">0</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('shopway-grid');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-black text-xs shadow-md transition-all relative"
              >
                <ShoppingBag className="size-4 text-orange-400" />
                <span>السلة</span>
                <span className="size-4 bg-orange-500 text-white text-[10px] font-black rounded-full grid place-items-center">
                  {cartCount}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* 3. Navigation Bar */}
        <div className="bg-white border-t border-slate-100 px-4 md:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-6">
              {/* Browse Categories Button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setBrowseOpen(!browseOpen)}
                  className="flex items-center gap-2 px-5 py-3 bg-orange-500 hover:bg-orange-600 text-white font-black text-xs transition-colors rounded-t-lg"
                >
                  <span>☰ تصفح الأقسام</span>
                  <ChevronDown className="size-3.5" />
                </button>
              </div>

              {/* Nav Menu */}
              <nav className="hidden md:flex items-center gap-6 text-xs font-black text-slate-700">
                {['الرئيسية', 'المتجر', 'العروض المميزة', 'من نحن', 'تواصل معنا'].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setActiveTab(item)}
                    className={`py-3 transition-colors hover:text-orange-600 relative ${
                      activeTab === item ? 'text-orange-600 font-black' : ''
                    }`}
                  >
                    {item}
                    {activeTab === item && (
                      <span className="absolute bottom-0 right-0 left-0 h-0.5 bg-orange-500 rounded-full" />
                    )}
                  </button>
                ))}
              </nav>
            </div>

            <div className="text-xs font-black text-orange-600 flex items-center gap-1.5 py-3">
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-rose-500 text-white font-black">HOT</span>
              <span>عروض اليوم الحصرية</span>
            </div>
          </div>
        </div>
      </header>

      {/* 4. Main Hero Section (3-Column Layout matching Screenshot 3) */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mt-5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* Left: Category Menu Box */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-3">
            <div className="space-y-1">
              {categoryMenu.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveNavCategory(cat.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeNavCategory === cat.id
                      ? 'bg-orange-50 text-orange-600 font-black'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{cat.icon}</span>
                    <span>{cat.label}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {cat.badge && (
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-black ${cat.badgeColor}`}>
                        {cat.badge}
                      </span>
                    )}
                    {cat.hasArrow && <ChevronRight className="size-3.5 text-slate-400 rotate-180" />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Center: Big Hero Banner */}
          <div className="lg:col-span-6 relative rounded-2xl overflow-hidden bg-gradient-to-r from-slate-900 via-[#1a2538] to-[#25334c] text-white p-8 md:p-10 flex flex-col justify-between shadow-md min-h-[340px]">
            <div className="relative z-10 space-y-3 max-w-md">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black bg-orange-500/20 text-orange-400 border border-orange-500/30">
                <Sparkles className="size-3.5 text-orange-400" />
                عروض نهاية الأسبوع الحصرية!
              </span>
              <h2 className="text-2xl md:text-4xl font-black leading-tight text-white">
                كل ما تحتاجه، في مكان واحد وبأفضل جودة
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                أحدث التشكيلات العصرية والإلكترونيات الأصلية مع فحص المنتج قبل الاستلام والدفع عند الباب.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('shopway-grid');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-2.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-black text-xs shadow-lg shadow-orange-500/30 transition-all hover:scale-105 flex items-center gap-2"
                >
                  <span>تسوق الآن</span>
                  <ArrowLeft className="size-4" />
                </button>
              </div>
            </div>

            <div className="relative z-10 flex items-center justify-between pt-4 border-t border-slate-700/50 text-slate-400 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-orange-500" />
                <span className="size-2 rounded-full bg-slate-600" />
                <span className="size-2 rounded-full bg-slate-600" />
              </div>
              <span className="text-[11px] font-bold text-amber-400">شحن سريع 18 محافظة</span>
            </div>
          </div>

          {/* Right: Side Promo Card */}
          <div className="lg:col-span-3 rounded-2xl overflow-hidden bg-gradient-to-br from-[#1b263b] to-[#0d1b2a] text-white p-6 flex flex-col justify-between shadow-sm border border-slate-700/40 min-h-[340px]">
            <div className="space-y-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-orange-500 text-white inline-block">
                خصم 60%
              </span>
              <h3 className="text-xl font-black text-white leading-snug">
                تسوق بذكاء، وعش برفاهية
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                مجموعة مختارة بعناية لأفضل المنتجات المعتمدة.
              </p>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-700/60">
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('shopway-grid');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-black text-xs shadow transition-all flex items-center justify-center gap-1.5"
              >
                <span>شاهد العروض</span>
                <ArrowLeft className="size-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Dark Navy Trust Badges Bar */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mt-5">
        <div className="rounded-2xl bg-[#111a28] text-white p-6 md:p-8 shadow-md grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-4 text-right">
            <div className="size-12 rounded-2xl bg-orange-500/10 text-orange-400 grid place-items-center shrink-0 border border-orange-500/20">
              <Truck className="size-6 text-orange-400" />
            </div>
            <div>
              <h4 className="font-black text-sm text-white">توصيل فوري وسريع</h4>
              <p className="text-xs text-slate-400">تغطية كاملة لجميع محافظات العراق</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-right">
            <div className="size-12 rounded-2xl bg-orange-500/10 text-orange-400 grid place-items-center shrink-0 border border-orange-500/20">
              <CreditCard className="size-6 text-orange-400" />
            </div>
            <div>
              <h4 className="font-black text-sm text-white">دفع عند الاستلام</h4>
              <p className="text-xs text-slate-400">معاينة وفحص المنتج قبل الدفع</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-right">
            <div className="size-12 rounded-2xl bg-orange-500/10 text-orange-400 grid place-items-center shrink-0 border border-orange-500/20">
              <ShieldCheck className="size-6 text-orange-400" />
            </div>
            <div>
              <h4 className="font-black text-sm text-white">ضمان استرجاع حقيقي</h4>
              <p className="text-xs text-slate-400">حق الاستبدال والإرجاع بكل سهولة</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-right">
            <div className="size-12 rounded-2xl bg-orange-500/10 text-orange-400 grid place-items-center shrink-0 border border-orange-500/20">
              <Headphones className="size-6 text-orange-400" />
            </div>
            <div>
              <h4 className="font-black text-sm text-white">دعم متواصل 24/7</h4>
              <p className="text-xs text-slate-400">فريق خدمة عملاء جاهز لمساعدتك</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Popular Categories Pills */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-black text-lg text-slate-900">الأقسام الأكثر طلباً</h3>
          <span className="text-xs font-bold text-orange-600 hover:underline cursor-pointer">
            عرض كل الأقسام ←
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => onSelectCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-black transition-all shrink-0 border ${
                selectedCategory === cat
                  ? 'bg-orange-500 text-white border-orange-500 shadow-md scale-105'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-orange-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* 7. Product Catalog Grid */}
      <section id="shopway-grid" className="max-w-7xl mx-auto px-4 md:px-8 mt-8 mb-16">
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-200">
          <div>
            <h3 className="font-black text-xl text-slate-900">تشكيلة المتجر الرسمية</h3>
            <p className="text-xs text-slate-500 mt-0.5">منتجات مختارة بأعلى مواصفات الجودة</p>
          </div>
          <span className="text-xs font-black text-slate-600 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
            {filteredProducts.length} منتج متاح
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:border-orange-400 hover:-translate-y-1"
            >
              <div>
                <div className="h-56 bg-slate-100 relative overflow-hidden">
                  <img
                    src={p.imageUrl || '/templates/store-brick.jpg'}
                    alt={p.name}
                    className="size-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2.5 right-2.5 text-[10px] font-black bg-white/95 backdrop-blur-md text-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 shadow-sm">
                    {p.category}
                  </span>
                  <span className="absolute top-2.5 left-2.5 text-[10px] font-black bg-orange-500 text-white px-2 py-0.5 rounded-md shadow-sm">
                    شحن لجميع المحافظات
                  </span>
                </div>

                <div className="p-4 text-right space-y-1.5">
                  <h4 className="font-black text-sm text-slate-900 line-clamp-1 group-hover:text-orange-600 transition-colors">
                    {p.name}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {p.description || 'منتج أصلي عالي الجودة مع شحن سريع لجميع محافظات العراق والدفع عند الاستلام.'}
                  </p>
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div>
                  <span className="text-sm font-black font-mono text-orange-600 block">
                    {formatIQD(p.price)}
                  </span>
                  {p.compareAtPrice && (
                    <span className="text-[11px] text-slate-400 line-through font-mono">
                      {formatIQD(p.compareAtPrice)}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => onQuickBuy(p)}
                  className="px-3.5 py-2 rounded-xl text-xs font-black bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/20 flex items-center gap-1 transition-all hover:scale-105"
                >
                  <span>شراء فوري</span>
                  <ArrowLeft className="size-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Footer */}
      <footer className="bg-[#111a28] text-slate-400 text-xs py-12 px-4 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-right">
            <h5 className="font-black text-base text-white">{storeName}</h5>
            <p className="text-xs text-slate-400 mt-1">المتجر الإلكتروني المعتمد لخدمة التسوق السريع في العراق والدفع عند الاستلام.</p>
          </div>
          <div className="flex items-center gap-6 text-slate-300">
            <span className="flex items-center gap-1.5"><Truck className="size-4 text-orange-400" /> شحن 18 محافظة</span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="size-4 text-orange-400" /> فحص قبل الاستلام</span>
            <span className="flex items-center gap-1.5"><Headphones className="size-4 text-orange-400" /> خدمة زبائن فورية</span>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-slate-800 text-center text-[11px] text-slate-500">
          © {new Date().getFullYear()} {storeName}. جميع الحقوق محفوظة • مدعوم بواسطة منصة الزعيم
        </div>
      </footer>

    </div>
  );
}

export default StoreBrickTheme;
