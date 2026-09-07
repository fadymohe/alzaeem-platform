import React, { useState } from 'react';
import {
  ShoppingBag, Search, Heart, User, ArrowLeft, ArrowRight,
  Truck, ShieldCheck, Sparkles, Star, ChevronDown, CheckCircle2,
  Footprints, Flame, Zap, Award, Layers, MessageCircle, Clock, Shield,
  Tag, Plus, Check, PhoneCall, RefreshCw
} from 'lucide-react';
import { formatIQD } from '../../../data/iraqData';
import type { StoreProduct } from '../../../data/storeState';
import type { ThemeComponentProps } from '../store-classic';
import {
  ThemeShopView,
  ThemeCategoriesView,
  ThemeCartCheckoutView,
  ThemeAccountView,
  ThemeContactView
} from '../theme-common/ThemePages';

export function StoreStrideTheme({
  storeName,
  subdomain,
  fullDomain,
  products,
  filteredProducts,
  cartCount,
  cartItems = [],
  onOpenCart,
  onOpenProductDetail,
  onOpenCustomerAuth,
  currentCustomer,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onQuickBuy,
  onAddToCart,
  logoUrl,
  customization
}: ThemeComponentProps) {
  const [currentPage, setCurrentPage] = useState<'home' | 'shop' | 'categories' | 'cart' | 'checkout' | 'account' | 'contact'>('home');
  const [searchOpen, setSearchOpen] = useState(false);

  const categories = ['الكل', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];

  const brandColor = customization?.brandColor || '#0052cc';
  const fontFamily = "'Alexandria', 'Montserrat', sans-serif";
  const isEn = customization?.defaultLanguage === 'en';
  const announcement = customization?.announcementText || 'أحذية وسنيكرز حصرية بأعلى جودة • شحن سريع لكافة محافظات العراق مع إمكانية فحص المقاس باليد قبل الدفع';
  const heroTitle = customization?.heroTitle || (isEn ? 'Cobalt Power. Stride Bold.' : 'سنيكرز وأحذية رياضية حصرية بجودة أصلية');
  const heroSubtitle = customization?.heroSubtitle || (isEn ? 'From pure suede Italian loafers to high-performance track runners, inspected before payment.' : 'من السنيكرز الرياضي عالي الأداء إلى أحذية اللوفر الجلدية، نمنحك تجربة تسوق رياضية مع فحص الحذاء ومقاسه قبل الاستلام والدفع عند الباب.');
  const heroBtnText = customization?.heroButtonText || (isEn ? 'Shop Shoes' : 'تسوق التشكيلة الآن');

  const sharedPageProps = {
    storeName,
    subdomain,
    fullDomain,
    brandColor,
    fontFamily,
    products,
    cartItems,
    onAddToCart,
    onQuickBuy,
    onOpenProductDetail,
    onNavigatePage: (page: any) => setCurrentPage(page)
  };

  return (
    <div
      className="min-h-screen bg-[#071322] text-slate-100 antialiased selection:bg-[#00c8ff] selection:text-slate-950 flex flex-col"
      style={{ fontFamily }}
      dir={isEn ? 'ltr' : 'rtl'}
    >
      {/* 1. Top Striped Ticker Bar */}
      <div className="bg-[#0052cc] text-white text-xs font-bold py-2 px-4 select-none shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-hidden truncate">
            <Zap className="size-3.5 shrink-0 text-[#00c8ff] animate-pulse" />
            <span className="text-[11px] truncate">{announcement}</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-[11px] font-mono shrink-0">
            <span className="flex items-center gap-1 text-cyan-200">
              <Truck className="size-3" />
              <span>توصيل سريع 24-48 ساعة</span>
            </span>
            <span>|</span>
            <span className="font-bold text-white">https://{fullDomain}</span>
          </div>
        </div>
      </div>

      {/* 2. Deep Cobalt Athletic Header */}
      <header className="bg-[#0a1c33]/95 backdrop-blur-md border-b border-blue-900/50 sticky top-0 z-40 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3.5 flex items-center justify-between gap-4">
          {/* Logo & Slogan */}
          <div
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => setCurrentPage('home')}
          >
            {logoUrl ? (
              <img src={logoUrl} alt={storeName} className="h-10 w-auto max-w-[150px] object-contain rounded-xl border border-blue-500/40" />
            ) : (
              <div className="flex items-center gap-2.5">
                <div className="size-11 rounded-2xl bg-gradient-to-tr from-[#0052cc] to-[#00c8ff] text-white font-black grid place-items-center text-xl shadow-lg shadow-blue-600/30">
                  <Footprints className="size-6 text-white" />
                </div>
                <div>
                  <h1 className="font-black text-lg text-white tracking-wider uppercase leading-none">{storeName}</h1>
                  <span className="text-[10px] font-bold text-cyan-400 block mt-1 tracking-widest">STRIDE & PERFORMANCE</span>
                </div>
              </div>
            )}
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 bg-[#071322]/80 p-1.5 rounded-2xl border border-blue-900/50 text-xs font-bold">
            <button
              type="button"
              onClick={() => setCurrentPage('home')}
              className={`px-4 py-1.5 rounded-xl transition-all ${
                currentPage === 'home'
                  ? 'bg-[#0052cc] text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              الرئيسية
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage('shop')}
              className={`px-4 py-1.5 rounded-xl transition-all ${
                currentPage === 'shop'
                  ? 'bg-[#0052cc] text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              المتجر والأحذية
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage('categories')}
              className={`px-4 py-1.5 rounded-xl transition-all ${
                currentPage === 'categories'
                  ? 'bg-[#0052cc] text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              التصنيفات
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage('cart')}
              className={`px-4 py-1.5 rounded-xl transition-all ${
                currentPage === 'cart' || currentPage === 'checkout'
                  ? 'bg-[#0052cc] text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              السلة والطلب
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage('account')}
              className={`px-4 py-1.5 rounded-xl transition-all ${
                currentPage === 'account'
                  ? 'bg-[#0052cc] text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              حسابي
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage('contact')}
              className={`px-4 py-1.5 rounded-xl transition-all ${
                currentPage === 'contact'
                  ? 'bg-[#0052cc] text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              اتصل بنا
            </button>
          </nav>

          {/* Actions: Search, Account, Cart */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2.5 rounded-xl bg-[#0d2038] hover:bg-[#122b4d] text-slate-300 hover:text-white border border-blue-900/40 transition-colors"
              title="بحث"
            >
              <Search className="size-4" />
            </button>

            <button
              type="button"
              onClick={() => setCurrentPage('account')}
              className="p-2.5 rounded-xl bg-[#0d2038] hover:bg-[#122b4d] text-slate-300 hover:text-white border border-blue-900/40 transition-colors"
              title="حسابي"
            >
              <User className="size-4" />
            </button>

            <button
              type="button"
              onClick={() => setCurrentPage('cart')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#0052cc] to-[#0070f3] hover:from-[#0047b3] hover:to-[#0052cc] text-white font-bold text-xs shadow-lg shadow-blue-600/25 transition-all"
            >
              <ShoppingBag className="size-4" />
              <span>السلة</span>
              {cartCount > 0 && (
                <span className="bg-[#00c8ff] text-slate-950 px-1.5 py-0.5 rounded-full text-[10px] font-black">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search Bar Flyout */}
        {searchOpen && (
          <div className="bg-[#071322] border-t border-blue-900/40 p-3 px-4 md:px-8">
            <div className="max-w-3xl mx-auto flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="size-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="ابحث عن موديل الحذاء، القياس، أو الماركة..."
                  value={searchQuery}
                  onChange={(e) => {
                    onSearchChange(e.target.value);
                    if (currentPage !== 'shop') setCurrentPage('shop');
                  }}
                  className="w-full bg-[#0d2038] border border-blue-800/60 rounded-xl pr-10 pl-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#00c8ff]"
                  autoFocus
                />
              </div>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="text-xs text-slate-400 hover:text-white px-2 py-1"
              >
                إغلاق
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Multi-Page Switcher */}
      <main className="flex-1">
        {currentPage === 'shop' && (
          <ThemeShopView
            {...sharedPageProps}
            themeStyle="athletic"
            initialCategory={selectedCategory}
            initialSearch={searchQuery}
          />
        )}

        {currentPage === 'categories' && (
          <ThemeCategoriesView
            {...sharedPageProps}
            onSelectCategory={(cat) => {
              onSelectCategory(cat);
              setCurrentPage('shop');
            }}
          />
        )}

        {currentPage === 'cart' && (
          <ThemeCartCheckoutView
            {...sharedPageProps}
            initialStep="cart"
          />
        )}

        {currentPage === 'checkout' && (
          <ThemeCartCheckoutView
            {...sharedPageProps}
            initialStep="checkout"
          />
        )}

        {currentPage === 'account' && (
          <ThemeAccountView
            {...sharedPageProps}
            currentCustomer={currentCustomer}
          />
        )}

        {currentPage === 'contact' && (
          <ThemeContactView
            {...sharedPageProps}
          />
        )}

        {currentPage === 'home' && (
          <div>
            {/* 3. Athletic Hero Banner */}
            <section className="relative overflow-hidden bg-gradient-to-b from-[#0a1c33] via-[#09182b] to-[#071322] border-b border-blue-900/40 py-16 md:py-24 px-4 md:px-8">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,82,204,0.18),transparent_50%)] pointer-events-none" />
              <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-[#00c8ff]/10 rounded-full blur-3xl pointer-events-none" />

              <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                <div className="lg:col-span-7 space-y-6 text-right">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/80 border border-blue-500/30 text-[#00c8ff] text-xs font-black tracking-wider uppercase">
                    <Flame className="size-3.5 text-orange-400" />
                    <span>تشكيلة الموسم الرياضية الجديدة 2026</span>
                  </div>

                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
                    {heroTitle}
                  </h1>

                  <p className="text-sm md:text-base text-slate-300 max-w-xl leading-relaxed font-normal">
                    {heroSubtitle}
                  </p>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-3 gap-3 py-2 max-w-lg">
                    <div className="p-3 rounded-2xl bg-[#0d2038]/80 border border-blue-900/60">
                      <div className="text-xs font-black text-[#00c8ff] mb-1">100% أصلي</div>
                      <div className="text-[11px] text-slate-400">خامات طبية ومريحة</div>
                    </div>
                    <div className="p-3 rounded-2xl bg-[#0d2038]/80 border border-blue-900/60">
                      <div className="text-xs font-black text-[#00c8ff] mb-1">معاينة باليد</div>
                      <div className="text-[11px] text-slate-400">فحص المقاس قبل الدفع</div>
                    </div>
                    <div className="p-3 rounded-2xl bg-[#0d2038]/80 border border-blue-900/60">
                      <div className="text-xs font-black text-[#00c8ff] mb-1">استبدال مجاني</div>
                      <div className="text-[11px] text-slate-400">تغيير القياس بكل سهولة</div>
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <button
                      type="button"
                      onClick={() => setCurrentPage('shop')}
                      className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#0052cc] to-[#0070f3] hover:from-[#0047b3] hover:to-[#0052cc] text-white font-black text-sm shadow-xl shadow-blue-600/30 flex items-center gap-2 group transition-all"
                    >
                      <span>{heroBtnText}</span>
                      <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentPage('categories')}
                      className="px-6 py-3.5 rounded-2xl bg-[#0d2038] hover:bg-[#142e50] text-slate-200 border border-blue-800/60 font-bold text-sm transition-all"
                    >
                      تصفح حسب النوع
                    </button>
                  </div>
                </div>

                {/* Hero Showcase Card */}
                <div className="lg:col-span-5 relative">
                  <div className="relative rounded-3xl overflow-hidden border border-blue-800/50 shadow-2xl bg-[#0d2038] p-6">
                    <div className="aspect-[4/3] rounded-2xl overflow-hidden relative mb-4 bg-gradient-to-tr from-slate-900 to-blue-950">
                      <img
                        src={products[0]?.image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80'}
                        alt="Sneaker Showcase"
                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3 bg-red-600 text-white text-[11px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md">
                        الأكثر طلباً
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-cyan-400">سنيكرز إير فلو الترا</span>
                        <h4 className="font-black text-white text-base mt-0.5">تصميم رياضي خفيف لراحة القدم</h4>
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-black text-[#00c8ff]">
                          {products[0]?.price ? formatIQD(products[0].price) : '48,000 د.ع'}
                        </div>
                        <span className="text-[10px] text-slate-400">الدفع عند الاستلام</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 4. Category Badges Bar */}
            <section className="py-6 border-b border-blue-900/30 bg-[#071322]">
              <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        onSelectCategory(cat);
                        setCurrentPage('shop');
                      }}
                      className={`px-5 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all flex items-center gap-2 ${
                        selectedCategory === cat
                          ? 'bg-[#0052cc] text-white shadow-md shadow-blue-600/30'
                          : 'bg-[#0d2038] text-slate-300 hover:bg-[#122b4d] border border-blue-900/40'
                      }`}
                    >
                      <Layers className="size-3.5 text-cyan-400" />
                      <span>{cat}</span>
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* 5. Featured Products Grid */}
            <section className="py-12 md:py-16 max-w-7xl mx-auto px-4 md:px-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-black text-white flex items-center gap-2">
                    <Flame className="size-6 text-[#00c8ff]" />
                    <span>أحدث الأحذية والمنتجات الحصرية</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    أحذية مختارة بعناية مطابقة لمعايير الراحة والأناقة
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentPage('shop')}
                  className="text-xs font-black text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  <span>عرض الكل ({products.length})</span>
                  <ArrowLeft className="size-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.slice(0, 8).map((product) => {
                  const hasDiscount = !!product.originalPrice && product.originalPrice > product.price;
                  return (
                    <div
                      key={product.id}
                      className="group bg-[#0d2038] rounded-2xl overflow-hidden border border-blue-900/50 hover:border-blue-500/50 shadow-xl transition-all duration-300 flex flex-col"
                    >
                      {/* Product Image */}
                      <div
                        className="relative aspect-square overflow-hidden bg-slate-900 cursor-pointer"
                        onClick={() => onOpenProductDetail?.(product)}
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {hasDiscount && (
                          <div className="absolute top-2.5 right-2.5 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-md">
                            خصم خاص
                          </div>
                        )}
                        <div className="absolute bottom-2 left-2 bg-[#071322]/80 backdrop-blur-sm text-[10px] font-bold text-cyan-300 px-2 py-0.5 rounded border border-blue-800/40">
                          {product.category || 'أحذية'}
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-1 text-amber-400 mb-1.5">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="size-3 fill-amber-400" />
                            ))}
                            <span className="text-[10px] text-slate-400 mr-1">(4.9)</span>
                          </div>

                          <h4
                            className="font-bold text-sm text-white line-clamp-1 cursor-pointer hover:text-cyan-400 transition-colors"
                            onClick={() => onOpenProductDetail?.(product)}
                          >
                            {product.name}
                          </h4>

                          <p className="text-[11px] text-slate-400 line-clamp-1 mt-1">
                            {product.description || 'حذاء مريح مع بطانة مانعة للانزلاق'}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-blue-900/40">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <span className="text-xs text-slate-400 block text-[10px]">السعر</span>
                              <div className="text-base font-black text-[#00c8ff]">
                                {formatIQD(product.price)}
                              </div>
                            </div>
                            {hasDiscount && product.originalPrice && (
                              <div className="text-left">
                                <span className="text-[10px] text-slate-500 line-through block">
                                  {formatIQD(product.originalPrice)}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => onAddToCart?.(product)}
                              className="w-full py-2 rounded-xl bg-[#122b4d] hover:bg-[#1a3d6d] text-slate-200 text-xs font-bold transition-colors flex items-center justify-center gap-1 border border-blue-800/50"
                            >
                              <ShoppingBag className="size-3.5" />
                              <span>للسلة</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => onQuickBuy?.(product)}
                              className="w-full py-2 rounded-xl bg-[#0052cc] hover:bg-[#0047b3] text-white text-xs font-black transition-colors shadow-md shadow-blue-600/30"
                            >
                              شراء سريع
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* 6. Trust Features Strip */}
            <section className="py-12 bg-[#0a1c33] border-y border-blue-900/50">
              <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#0d2038] border border-blue-900/50">
                    <div className="size-12 rounded-xl bg-blue-600/20 text-[#00c8ff] grid place-items-center shrink-0">
                      <Truck className="size-6" />
                    </div>
                    <div>
                      <h5 className="font-bold text-sm text-white">توصيل سريع للعراق</h5>
                      <p className="text-[11px] text-slate-400 mt-0.5">بغداد 24 س • المحافظات 48 س</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#0d2038] border border-blue-900/50">
                    <div className="size-12 rounded-xl bg-blue-600/20 text-[#00c8ff] grid place-items-center shrink-0">
                      <ShieldCheck className="size-6" />
                    </div>
                    <div>
                      <h5 className="font-bold text-sm text-white">معاينة قبل الدفع</h5>
                      <p className="text-[11px] text-slate-400 mt-0.5">افحص الحذاء والمقاس باليد</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#0d2038] border border-blue-900/50">
                    <div className="size-12 rounded-xl bg-blue-600/20 text-[#00c8ff] grid place-items-center shrink-0">
                      <RefreshCw className="size-6" />
                    </div>
                    <div>
                      <h5 className="font-bold text-sm text-white">استبدال المقاس</h5>
                      <p className="text-[11px] text-slate-400 mt-0.5">تغيير القياس مجاناً وسريعاً</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#0d2038] border border-blue-900/50">
                    <div className="size-12 rounded-xl bg-blue-600/20 text-[#00c8ff] grid place-items-center shrink-0">
                      <PhoneCall className="size-6" />
                    </div>
                    <div>
                      <h5 className="font-bold text-sm text-white">دعم عملاء الزعيم</h5>
                      <p className="text-[11px] text-slate-400 mt-0.5">متابعة شحنتك لحظة بلحظة</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* 7. Cobalt Athletic Footer */}
      <footer className="bg-[#050e1a] border-t border-blue-900/60 text-slate-400 text-xs mt-auto">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-xl bg-[#0052cc] text-white grid place-items-center">
                  <Footprints className="size-4" />
                </div>
                <h4 className="font-black text-white text-base tracking-wider uppercase">{storeName}</h4>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-400">
                وجهتك العراقية الأولى للأحذية الرياضية الأصلية والأناقة المعاصرة مع الفحص قبل الدفع.
              </p>
            </div>

            <div>
              <h5 className="font-black text-white text-sm mb-3">أقسام المتجر</h5>
              <ul className="space-y-2 text-[11px]">
                {categories.slice(0, 5).map(cat => (
                  <li key={cat}>
                    <button
                      type="button"
                      onClick={() => {
                        onSelectCategory(cat);
                        setCurrentPage('shop');
                      }}
                      className="hover:text-cyan-400 transition-colors"
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="font-black text-white text-sm mb-3">روابط هامة</h5>
              <ul className="space-y-2 text-[11px]">
                <li>
                  <button type="button" onClick={() => setCurrentPage('shop')} className="hover:text-cyan-400 transition-colors">
                    جميع المنتجات
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => setCurrentPage('cart')} className="hover:text-cyan-400 transition-colors">
                    سلة المشتريات
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => setCurrentPage('account')} className="hover:text-cyan-400 transition-colors">
                    حسابي والطلبات
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => setCurrentPage('contact')} className="hover:text-cyan-400 transition-colors">
                    تواصل معنا
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h5 className="font-black text-white text-sm">خدمة العملاء والتوصيل</h5>
              <p className="text-[11px] text-slate-400">
                شحن لجميع المحافظات: بغداد، البصرة، أربيل، النجف، كربلاء وكافة المدن.
              </p>
              <div className="font-mono text-cyan-400 font-bold text-xs">
                📞 0770 000 0000
              </div>
              <div className="text-[10px] text-slate-500">
                الدفع: نقد عند الاستلام (COD) • زين كاش • ماستركارد
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-blue-900/40 flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-500">
            <div>
              © {new Date().getFullYear()} {storeName}. جميع الحقوق محفوظة • منصة الزعيم Al-Zaeem
            </div>
            <div className="flex items-center gap-3">
              <span>سياسة الخصوصية</span>
              <span>•</span>
              <span>شروط الاستخدام</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
