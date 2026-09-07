import React, { useState } from 'react';
import {
  ShoppingBag, Search, Star, ArrowLeft, Truck, ShieldCheck,
  Sparkles, Heart, Clock, Check, User, ChevronDown, Flame, Tag,
  Headphones, RefreshCw, Smartphone, Shirt, Layers, Grid, Home,
  Tv, Dumbbell, Package, ShoppingCart, Award, PhoneCall, Plus
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

/**
 * StoreAuritTheme - ShopWell Mega Store Design
 * Clean modern royal blue mega-store layout, Cairo & Outfit typography, multi-category navigation & quick deals
 */
export function StoreAuritTheme({
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

  const brandColor = customization?.brandColor || '#2563eb';
  const fontFamily = "'Cairo', 'Outfit', sans-serif";
  const isEn = customization?.defaultLanguage === 'en';
  const announcement = customization?.announcementText || 'ميجا ستور عراقي متكامل • وفر حتى 20% بكود ZAEEM20 مع توصيل سريع لكافة المحافظات والدفع عند الاستلام';
  const heroTitle = customization?.heroTitle || (isEn ? 'Mega Deals & Everyday Essentials' : 'عروض وتخفيضات كبرى على آلاف المنتجات');
  const heroSubtitle = customization?.heroSubtitle || (isEn ? 'Everything you need from trendy fashion, electronics, and home items with Iraqi COD.' : 'تسوق أفضل السلع الاستهلاكية، الإلكترونيات، والأزياء بأسعار الجملة، مع التوصيل السريع لجميع محافظات العراق وإمكانية فحص طلبك قبل الدفع.');
  const heroBtnText = customization?.heroButtonText || (isEn ? 'Explore Mega Deals' : 'استكشف عروض الميجا ستور');

  const popularCatAvatars = [
    { name: 'عروض اليوم', badge: 'خصم 30%', icon: '🔥', cat: 'الكل' },
    { name: 'أجهزة وإلكترونيات', badge: 'جديد', icon: '📱', cat: 'إلكترونيات' },
    { name: 'أزياء وملابس', badge: 'الأكثر مبيعاً', icon: '👕', cat: 'أزياء' },
    { name: 'أحذية وسنيكرز', badge: 'أصلي', icon: '👟', cat: 'أحذية' },
    { name: 'منزل وديكور', badge: 'تخفيضات', icon: '🛋️', cat: 'منزل' },
    { name: 'إكسسوارات وساعات', badge: 'VIP', icon: '⌚', cat: 'إكسسوارات' }
  ];

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
      className="min-h-screen bg-[#f8fafc] text-slate-900 antialiased selection:bg-blue-600 selection:text-white flex flex-col"
      style={{ fontFamily }}
      dir={isEn ? 'ltr' : 'rtl'}
    >
      {/* 1. Top Coupon Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-sky-600 text-white text-xs py-2 px-4 select-none shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-hidden truncate">
            <Flame className="size-3.5 shrink-0 text-amber-300 animate-pulse" />
            <span className="text-[11px] font-bold truncate">{announcement}</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-[11px] font-mono shrink-0">
            <span className="bg-white/20 px-2 py-0.5 rounded font-bold">كوبون: ZAEEM</span>
            <span>|</span>
            <span className="font-bold text-white">https://{fullDomain}</span>
          </div>
        </div>
      </div>

      {/* 2. Mega Store Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3.5 flex items-center justify-between gap-4">
          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => setCurrentPage('home')}
          >
            {logoUrl ? (
              <img src={logoUrl} alt={storeName} className="h-10 w-auto max-w-[140px] object-contain" />
            ) : (
              <div className="flex items-center gap-2.5">
                <div className="size-10 rounded-xl bg-blue-600 text-white grid place-items-center shadow-md shadow-blue-600/25">
                  <ShoppingBag className="size-5" />
                </div>
                <div>
                  <h1 className="font-black text-xl text-slate-950 tracking-tight leading-none">{storeName}</h1>
                  <span className="text-[10px] font-bold text-blue-600 block mt-0.5 tracking-wider uppercase">
                    SHOPWELL MEGA STORE
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Search Bar with Category Select (Mega Style) */}
          <div className="hidden lg:flex items-center flex-1 max-w-xl mx-4 border-2 border-blue-600 rounded-xl overflow-hidden bg-white shadow-sm">
            <select
              value={selectedCategory}
              onChange={(e) => {
                onSelectCategory(e.target.value);
                if (currentPage !== 'shop') setCurrentPage('shop');
              }}
              className="h-10 px-3 bg-slate-50 text-xs font-bold text-slate-700 border-l border-slate-200 outline-none cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="ابحث عن أي منتج، ماركة، أو فئة..."
                value={searchQuery}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  if (currentPage !== 'shop') setCurrentPage('shop');
                }}
                className="w-full h-10 px-3 text-xs text-slate-900 outline-none"
              />
            </div>
            <button
              type="button"
              onClick={() => setCurrentPage('shop')}
              className="h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1 transition-colors"
            >
              <Search className="size-4" />
              <span>بحث</span>
            </button>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => setCurrentPage('home')}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                currentPage === 'home'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              الرئيسية
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage('shop')}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                currentPage === 'shop'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              كل العروض
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage('categories')}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                currentPage === 'categories'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              الأقسام
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage('cart')}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                currentPage === 'cart' || currentPage === 'checkout'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              السلة
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage('account')}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                currentPage === 'account'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              حسابي
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage('contact')}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                currentPage === 'contact'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              اتصل بنا
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(!searchOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
              title="بحث"
            >
              <Search className="size-4" />
            </button>

            <button
              type="button"
              onClick={() => setCurrentPage('account')}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
              title="حسابي"
            >
              <User className="size-4" />
            </button>

            <button
              type="button"
              onClick={() => setCurrentPage('cart')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/25 transition-all"
            >
              <ShoppingCart className="size-4" />
              <span>السلة</span>
              {cartCount > 0 && (
                <span className="bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded-full text-[10px] font-black">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Flyout */}
        {searchOpen && (
          <div className="lg:hidden bg-slate-50 border-t border-slate-200 p-3 px-4">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="size-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="ابحث عن منتج..."
                  value={searchQuery}
                  onChange={(e) => {
                    onSearchChange(e.target.value);
                    if (currentPage !== 'shop') setCurrentPage('shop');
                  }}
                  className="w-full bg-white border border-slate-300 rounded-xl pr-10 pl-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600"
                  autoFocus
                />
              </div>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="text-xs text-slate-600 hover:text-slate-950 px-2 py-1"
              >
                إغلاق
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Pages Switcher */}
      <main className="flex-1">
        {currentPage === 'shop' && (
          <ThemeShopView
            {...sharedPageProps}
            themeStyle="modern"
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
            {/* 3. Mega Store Hero Banner */}
            <section className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white py-14 md:py-20 px-4 md:px-8">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.25),transparent_50%)] pointer-events-none" />

              <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                <div className="lg:col-span-7 space-y-5 text-right">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-sky-200 text-xs font-bold">
                    <Sparkles className="size-3.5 text-amber-300" />
                    <span>مهرجان التخفيضات الأسبوعي • حتى 40% خصم</span>
                  </div>

                  <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">
                    {heroTitle}
                  </h1>

                  <p className="text-sm md:text-base text-blue-100 max-w-xl leading-relaxed">
                    {heroSubtitle}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setCurrentPage('shop')}
                      className="px-8 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-sm shadow-xl shadow-black/20 flex items-center gap-2 group transition-all"
                    >
                      <span>{heroBtnText}</span>
                      <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentPage('categories')}
                      className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-sm transition-all"
                    >
                      تصفح الأقسام
                    </button>
                  </div>
                </div>

                {/* Hero Feature Box */}
                <div className="lg:col-span-5 relative">
                  <div className="bg-white rounded-3xl p-5 text-slate-900 shadow-2xl border border-slate-100">
                    <div className="aspect-[4/3] rounded-2xl overflow-hidden relative mb-4 bg-slate-100">
                      <img
                        src={products[0]?.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'}
                        alt="ShopWell Featured Deal"
                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3 bg-red-600 text-white text-[11px] font-black px-2.5 py-1 rounded-md shadow-md">
                        صفقة اليوم 🔥
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs text-blue-600 font-bold">عرض خاص حصري</span>
                        <h4 className="font-bold text-slate-900 text-base mt-0.5">{products[0]?.name || 'ساعة ذكية مقاومة للماء'}</h4>
                      </div>
                      <div className="text-left">
                        <div className="text-base font-black text-blue-600">
                          {products[0]?.price ? formatIQD(products[0].price) : '35,000 د.ع'}
                        </div>
                        <span className="text-[10px] text-slate-500">الدفع عند الاستلام</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 4. Popular Category Circle Avatars */}
            <section className="py-8 bg-white border-b border-slate-200">
              <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
                    <Grid className="size-4 text-blue-600" />
                    <span>تسوق حسب الأقسام الشائعة</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setCurrentPage('categories')}
                    className="text-xs font-bold text-blue-600 hover:underline"
                  >
                    عرض كل الأقسام
                  </button>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {popularCatAvatars.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        onSelectCategory(item.cat);
                        setCurrentPage('shop');
                      }}
                      className="flex flex-col items-center p-3 rounded-2xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 cursor-pointer transition-all group text-center"
                    >
                      <div className="size-12 rounded-full bg-blue-100 text-xl grid place-items-center mb-2 group-hover:scale-110 transition-transform">
                        <span>{item.icon}</span>
                      </div>
                      <span className="text-xs font-bold text-slate-800 line-clamp-1">{item.name}</span>
                      <span className="text-[10px] font-bold text-blue-600 mt-0.5 bg-blue-100/60 px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 5. Featured Products Grid */}
            <section className="py-12 md:py-16 max-w-7xl mx-auto px-4 md:px-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                    <Flame className="size-6 text-orange-500" />
                    <span>المنتجات الأكثر مبيعاً في العراق</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    أفضل الصفقات بضمان الجودة وميزة الدفع عند الاستلام بعد الفحص
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentPage('shop')}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
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
                      className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-blue-500 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
                    >
                      <div
                        className="relative aspect-square overflow-hidden bg-slate-100 cursor-pointer"
                        onClick={() => onOpenProductDetail?.(product)}
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {hasDiscount && (
                          <div className="absolute top-2.5 right-2.5 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-md">
                            تخفيض
                          </div>
                        )}
                        <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm text-[10px] font-bold text-blue-600 px-2 py-0.5 rounded-md border border-slate-200">
                          {product.category || 'عام'}
                        </div>
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-1 text-amber-500 mb-1.5">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="size-3 fill-amber-500" />
                            ))}
                            <span className="text-[10px] text-slate-400 mr-1">(4.8)</span>
                          </div>

                          <h4
                            className="font-bold text-sm text-slate-900 line-clamp-1 cursor-pointer hover:text-blue-600 transition-colors"
                            onClick={() => onOpenProductDetail?.(product)}
                          >
                            {product.name}
                          </h4>

                          <p className="text-[11px] text-slate-500 line-clamp-1 mt-1">
                            {product.description || 'منتج أصلي عالي الجودة مضمون'}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <span className="text-[10px] text-slate-500 block">السعر</span>
                              <div className="text-base font-black text-blue-600">
                                {formatIQD(product.price)}
                              </div>
                            </div>
                            {hasDiscount && product.originalPrice && (
                              <div className="text-left">
                                <span className="text-[10px] text-slate-400 line-through block">
                                  {formatIQD(product.originalPrice)}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => onAddToCart?.(product)}
                              className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center justify-center gap-1 border border-slate-200"
                            >
                              <ShoppingCart className="size-3.5" />
                              <span>للسلة</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => onQuickBuy?.(product)}
                              className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-md shadow-blue-600/20"
                            >
                              طلب فوري
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* 6. Mega Store Trust Badges */}
            <section className="py-12 bg-white border-y border-slate-200">
              <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="size-12 rounded-xl bg-blue-100 text-blue-600 grid place-items-center shrink-0">
                      <Truck className="size-6" />
                    </div>
                    <div>
                      <h5 className="font-bold text-sm text-slate-900">توصيل سريع لكل المحافظات</h5>
                      <p className="text-[11px] text-slate-500 mt-0.5">بغداد 24 س • المحافظات 48 س</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="size-12 rounded-xl bg-blue-100 text-blue-600 grid place-items-center shrink-0">
                      <ShieldCheck className="size-6" />
                    </div>
                    <div>
                      <h5 className="font-bold text-sm text-slate-900">معاينة وفحص قبل الدفع</h5>
                      <p className="text-[11px] text-slate-500 mt-0.5">افحص شحنتك باليد عند الباب</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="size-12 rounded-xl bg-blue-100 text-blue-600 grid place-items-center shrink-0">
                      <Award className="size-6" />
                    </div>
                    <div>
                      <h5 className="font-bold text-sm text-slate-900">أفضل سعر مضمون</h5>
                      <p className="text-[11px] text-slate-500 mt-0.5">أسعار تنافسية وعروض يومية</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="size-12 rounded-xl bg-blue-100 text-blue-600 grid place-items-center shrink-0">
                      <PhoneCall className="size-6" />
                    </div>
                    <div>
                      <h5 className="font-bold text-sm text-slate-900">خدمة عملاء مباشرة</h5>
                      <p className="text-[11px] text-slate-500 mt-0.5">متابعة طلباتك خطوة بخطوة</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* 7. Mega Store Footer */}
      <footer className="bg-slate-900 text-slate-300 text-xs mt-auto">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-xl bg-blue-600 text-white grid place-items-center">
                  <ShoppingBag className="size-4" />
                </div>
                <h4 className="font-black text-white text-base">{storeName}</h4>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-400">
                منصتك العراقية المتكاملة للتسوق الإلكتروني، نوفر لك آلاف المنتجات مع الشحن السريع والفحص قبل الدفع.
              </p>
            </div>

            <div>
              <h5 className="font-bold text-white text-sm mb-3">أقسام المتجر</h5>
              <ul className="space-y-2 text-[11px]">
                {categories.slice(0, 5).map(cat => (
                  <li key={cat}>
                    <button
                      type="button"
                      onClick={() => {
                        onSelectCategory(cat);
                        setCurrentPage('shop');
                      }}
                      className="hover:text-blue-400 transition-colors"
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-white text-sm mb-3">روابط وتصفح</h5>
              <ul className="space-y-2 text-[11px]">
                <li>
                  <button type="button" onClick={() => setCurrentPage('shop')} className="hover:text-blue-400 transition-colors">
                    جميع المنتجات
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => setCurrentPage('cart')} className="hover:text-blue-400 transition-colors">
                    سلة المشتريات
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => setCurrentPage('account')} className="hover:text-blue-400 transition-colors">
                    حسابي والطلبات
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => setCurrentPage('contact')} className="hover:text-blue-400 transition-colors">
                    تواصل معنا
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h5 className="font-bold text-white text-sm">التوصيل وخدمة العراق</h5>
              <p className="text-[11px] text-slate-400">
                شحن لجميع المحافظات: بغداد، البصرة، أربيل، النجف، كربلاء وكافة المدن.
              </p>
              <div className="font-mono text-blue-400 font-bold text-xs">
                📞 0770 000 0000
              </div>
              <div className="text-[10px] text-slate-500">
                الدفع: نقد عند الاستلام (COD) • زين كاش • ماستركارد
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-500">
            <div>
              © {new Date().getFullYear()} {storeName}. جميع الحقوق محفوظة • مدعوم بواسطة الزعيم Al-Zaeem
            </div>
            <div className="flex items-center gap-3">
              <span>سياسة الخصوصية</span>
              <span>•</span>
              <span>الشروط والأحكام</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default StoreAuritTheme;
