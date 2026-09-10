import React, { useState } from 'react';
import {
  ShoppingBag, Search, Star, ArrowLeft, Truck, ShieldCheck,
  Sparkles, Heart, Clock, Check, Phone, Zap, ArrowRight, Grid,
  ChevronDown, Headphones, Smartphone, Watch, Tv, Flame, Tag, ShoppingCart,
  Award, PhoneCall, Plus, RefreshCw, User, Loader2
} from 'lucide-react';
import { formatIQD } from '../../../data/iraqData';
import type { StoreProduct } from '../../../data/storeState';
import type { ThemeComponentProps } from '../store-classic';
import {
  ThemeShopView,
  ThemeCategoriesView,
  ThemeCartCheckoutView,
  ThemeAccountView,
  ThemeContactView,
  ThemeProductDetailView,
  getProductImage,
  STORE_PLACEHOLDER_IMAGE,
  formatPriceInteger
} from '../theme-common/ThemePages';

/**
 * StoreNovaTheme - Inspired by eShopkit Tech & Lifestyle Marketplace
 * Purple Brand Accent, Alexandria / Outfit typography, Hotline Badge, Flash Sale Pill, and full multi-page navigation
 */
export function StoreNovaTheme({
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
  const [currentPage, setCurrentPage] = useState<'home' | 'shop' | 'categories' | 'cart' | 'checkout' | 'account' | 'contact' | 'product'>('home');
  const [selectedProduct, setSelectedProduct] = useState<StoreProduct | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const categories = ['الكل', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];

  const brandColor = customization?.brandColor || '#5e17eb';
  const fontFamily = "'Alexandria', 'Outfit', sans-serif";
  const isEn = customization?.defaultLanguage === 'en';
  const announcement = customization?.announcementText || 'أحدث الأجهزة والإلكترونيات الذكية • توصيل سريع لكافة المحافظات مع ميزة فحص وتشغيل الجهاز قبل الدفع';
  const heroTitle = customization?.heroTitle || (isEn ? 'Next-Gen Gadgets & Smart Tech' : 'أجهزة ذكية وإلكترونيات الجيل القادم بأسعار مميزة');
  const heroSubtitle = customization?.heroSubtitle || (isEn ? 'Genuine wireless audio, wearables, and accessories.' : 'سماعات بلوتوث، ساعات ذكية، ملحقات أصلية وأحدث التقنيات، نوفرها لك مع ميزة فحص الجهاز وتجربته باليد قبل إتمام الدفع.');
  const heroBtnText = customization?.heroButtonText || (isEn ? 'Explore Gadgets' : 'استكشف التخفيضات الآن');

  const popularAvatars = [
    { name: 'الكل', badge: 'عروض كبرى', icon: '⚡', cat: 'الكل' },
    { name: 'سماعات وايرلس', badge: 'خصم 25%', icon: '🎧', cat: 'إلكترونيات' },
    { name: 'ساعات ذكية', badge: 'الأكثر طلباً', icon: '⌚', cat: 'ساعات' },
    { name: 'شواحن وكيابل', badge: 'أصلي 100%', icon: '🔌', cat: 'ملحقات' },
    { name: 'إكسسوارات هواتف', badge: 'جديد 2026', icon: '📱', cat: 'هواتف' },
    { name: 'أجهزة منزلية', badge: 'توفير', icon: '📺', cat: 'منزل' }
  ];

  const handleOpenProduct = (product: StoreProduct) => {
    setSelectedProduct(product);
    setCurrentPage('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCartWithFeedback = (product: StoreProduct, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setAddingId(product.id);
    onAddToCart?.(product);
    setToastMsg(`تمت إضافة "${product.name}" إلى السلة`);
    setTimeout(() => setAddingId(null), 600);
    setTimeout(() => setToastMsg(null), 3000);
  };

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
    onOpenProductDetail: handleOpenProduct,
    onNavigatePage: (page: any) => {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div
      className="min-h-screen bg-[#f8f9fc] text-slate-900 antialiased selection:bg-[#5e17eb] selection:text-white flex flex-col"
      style={{ fontFamily }}
      dir="rtl"
    >
      {/* Toast Feedback */}
      {toastMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#1e1035] text-purple-100 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-purple-500/30 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="size-6 rounded-full bg-[#5e17eb] grid place-items-center text-white shrink-0">
            <Check className="size-3.5" />
          </div>
          <span className="text-xs font-bold">{toastMsg}</span>
        </div>
      )}

      {/* 1. Top Purple Strip */}
      <div className="bg-[#5e17eb] text-white text-xs py-2 px-4 select-none shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-hidden truncate">
            <Zap className="size-3.5 shrink-0 text-amber-300 animate-bounce" />
            <span className="text-[11px] font-bold truncate">{announcement}</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-[11px] font-mono shrink-0">
            <span className="bg-white/20 px-2 py-0.5 rounded font-bold">فحص وتشغيل قبل الاستلام</span>
            <span>|</span>
            <span className="font-bold text-white">https://{fullDomain}</span>
          </div>
        </div>
      </div>

      {/* 2. Modern Tech Header */}
      <header className="bg-white sticky top-0 z-40 shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3.5 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => setCurrentPage('home')}
          >
            {logoUrl ? (
              <img src={logoUrl} alt={storeName} className="h-10 w-auto max-w-[140px] object-contain" />
            ) : (
              <div className="flex items-center gap-2.5">
                <div className="size-10 rounded-xl bg-[#5e17eb] text-white grid place-items-center shadow-md shadow-purple-600/30 font-black">
                  <Zap className="size-5" />
                </div>
                <div>
                  <h1 className="font-black text-xl text-slate-900 tracking-tight leading-none">{storeName}</h1>
                  <span className="text-[10px] font-bold text-[#5e17eb] block mt-0.5 tracking-wider uppercase">
                    SMART TECH & STORE
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg hidden md:block">
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="ابحث عن أحدث الأجهزة الذكية، السماعات، الإكسسوارات..."
                className="w-full bg-slate-100 border border-slate-200 focus:border-[#5e17eb] focus:bg-white rounded-2xl py-2 px-4 pr-10 text-xs text-slate-800 transition-all outline-none"
              />
              <Search className="size-4 text-slate-400 absolute right-3.5 pointer-events-none" />
            </div>
          </div>

          {/* Action Navigation */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage('account')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 text-xs font-bold transition-colors"
            >
              <User className="size-4 text-slate-600" />
              <span className="hidden sm:inline">حسابي</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentPage('cart')}
              className="flex items-center gap-2 bg-[#5e17eb] hover:bg-[#4d0fd1] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md shadow-purple-600/25"
            >
              <ShoppingCart className="size-4" />
              <span className="hidden sm:inline">السلة</span>
              {cartCount > 0 && (
                <span className="bg-amber-400 text-slate-900 text-[10px] font-black size-5 rounded-full grid place-items-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="bg-slate-50 border-t border-slate-200 px-4 md:px-8 py-2">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 text-xs font-bold text-slate-700">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                type="button"
                onClick={() => setCurrentPage('home')}
                className={`px-3 py-1 rounded-lg transition-colors shrink-0 ${
                  currentPage === 'home' ? 'bg-[#5e17eb] text-white' : 'hover:bg-slate-200'
                }`}
              >
                الرئيسية
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage('shop')}
                className={`px-3 py-1 rounded-lg transition-colors shrink-0 ${
                  currentPage === 'shop' ? 'bg-[#5e17eb] text-white' : 'hover:bg-slate-200'
                }`}
              >
                المتجر
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage('categories')}
                className={`px-3 py-1 rounded-lg transition-colors shrink-0 ${
                  currentPage === 'categories' ? 'bg-[#5e17eb] text-white' : 'hover:bg-slate-200'
                }`}
              >
                التصنيفات
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage('contact')}
                className={`px-3 py-1 rounded-lg transition-colors shrink-0 ${
                  currentPage === 'contact' ? 'bg-[#5e17eb] text-white' : 'hover:bg-slate-200'
                }`}
              >
                تواصل معنا
              </button>
            </div>

            <div className="hidden lg:flex items-center gap-4 text-[11px] text-slate-500 font-semibold shrink-0">
              <span className="flex items-center gap-1 text-emerald-600">
                <ShieldCheck className="size-3.5" />
                <span>ضمان التشغيل والفحص</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-purple-600">
                <Truck className="size-3.5" />
                <span>شحن سريع لـ 18 محافظة</span>
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Pages Content */}
      <main className="flex-1">
        {currentPage === 'shop' && (
          <ThemeShopView
            {...sharedPageProps}
            selectedCategory={selectedCategory}
            onSelectCategory={onSelectCategory}
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
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

        {(currentPage === 'cart' || currentPage === 'checkout') && (
          <ThemeCartCheckoutView {...sharedPageProps} />
        )}

        {currentPage === 'account' && (
          <ThemeAccountView {...sharedPageProps} />
        )}

        {currentPage === 'contact' && (
          <ThemeContactView {...sharedPageProps} />
        )}

        {currentPage === 'product' && selectedProduct && (
          <ThemeProductDetailView
            {...sharedPageProps}
            product={selectedProduct}
            onAddToCart={(prod, qty) => {
              for (let i = 0; i < qty; i++) onAddToCart?.(prod);
            }}
          />
        )}

        {currentPage === 'home' && (
          <div>
            {/* 3. Hero Tech Banner */}
            <section className="bg-gradient-to-br from-[#1e0847] via-[#3a0ca3] to-[#5e17eb] text-white py-12 md:py-16 relative overflow-hidden">
              <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                <div className="lg:col-span-7 space-y-5 text-center lg:text-right">
                  <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-amber-300">
                    <Zap className="size-4 animate-pulse" />
                    <span>أجهزة أصلية بضمان استبدال</span>
                  </div>

                  <h2 className="text-3xl sm:text-5xl font-black leading-tight tracking-tight">
                    {heroTitle}
                  </h2>

                  <p className="text-xs sm:text-sm text-purple-100 max-w-xl leading-relaxed">
                    {heroSubtitle}
                  </p>

                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setCurrentPage('shop')}
                      className="px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs sm:text-sm font-black shadow-xl shadow-amber-400/25 transition-all flex items-center gap-2 transform hover:-translate-y-0.5"
                    >
                      <span>{heroBtnText}</span>
                      <ArrowLeft className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentPage('categories')}
                      className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold border border-white/20 transition-colors"
                    >
                      استكشف الأقسام
                    </button>
                  </div>
                </div>

                {/* Hero Showcase Display */}
                <div className="lg:col-span-5 relative">
                  <div className="bg-white/10 backdrop-blur-md rounded-3xl p-4 border border-white/20 shadow-2xl">
                    <div className="aspect-[4/3] rounded-2xl overflow-hidden relative bg-white/5 mb-3 flex items-center justify-center">
                      <img
                        src={getProductImage(products[0])}
                        onError={(e) => { e.currentTarget.src = STORE_PLACEHOLDER_IMAGE; }}
                        alt="Tech Showcase"
                        className="w-full h-full object-contain p-4"
                      />
                      <div className="absolute top-3 right-3 bg-amber-400 text-slate-950 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                        الأكثر مبيعاً
                      </div>
                    </div>

                    <div className="flex items-center justify-between px-2">
                      <div>
                        <span className="text-xs text-amber-300 font-bold block">عرض محدود</span>
                        <h4 className="font-bold text-white text-sm mt-0.5">{products[0]?.name || 'سماعة ذكية متطورة'}</h4>
                      </div>
                      <div className="text-left">
                        <div className="text-lg font-black text-amber-300">
                          {products[0]?.price ? formatPriceInteger(products[0].price) : '35,000 د.ع'}
                        </div>
                        <span className="text-[10px] text-purple-200">الدفع عند الاستلام</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 4. Popular Category Icons */}
            <section className="py-8 bg-white border-b border-slate-200">
              <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {popularAvatars.map((cat, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        onSelectCategory(cat.cat);
                        setCurrentPage('shop');
                      }}
                      className="group cursor-pointer p-3 rounded-2xl bg-slate-50 hover:bg-purple-50 border border-slate-200 hover:border-purple-300 transition-all text-center flex flex-col items-center justify-between relative"
                    >
                      <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">{cat.icon}</span>
                      <span className="text-xs font-bold text-slate-800 group-hover:text-purple-600 transition-colors">{cat.name}</span>
                      <span className="text-[9px] font-black bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full mt-1.5">
                        {cat.badge}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 5. Featured Tech Products Grid */}
            <section className="py-12 max-w-7xl mx-auto px-4 md:px-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                    <Sparkles className="size-6 text-[#5e17eb]" />
                    <span>أفضل الأجهزة والإكسسوارات</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">منتجات أصلية معتمدة مع ضمان الفحص والتشغيل</p>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentPage('shop')}
                  className="text-xs font-bold text-[#5e17eb] hover:text-[#4d0fd1] flex items-center gap-1"
                >
                  <span>عرض الكل ({products.length})</span>
                  <ArrowLeft className="size-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.slice(0, 8).map((product) => {
                  const hasDiscount = !!product.originalPrice && product.originalPrice > product.price;
                  const isAdding = addingId === product.id;
                  return (
                    <div
                      key={product.id}
                      className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-purple-500 hover:shadow-xl transition-all duration-300 flex flex-col"
                    >
                      <div
                        className="relative aspect-square overflow-hidden bg-slate-50 p-4 cursor-pointer flex items-center justify-center"
                        onClick={() => handleOpenProduct(product)}
                      >
                        <img
                          src={getProductImage(product)}
                          onError={(e) => { e.currentTarget.src = STORE_PLACEHOLDER_IMAGE; }}
                          alt={product.name}
                          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                        />
                        {hasDiscount && (
                          <div className="absolute top-2.5 right-2.5 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-md">
                            تخفيض
                          </div>
                        )}
                        <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm text-[10px] font-bold text-purple-700 px-2 py-0.5 rounded-md border border-slate-200">
                          {product.category || 'إلكترونيات'}
                        </div>
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-1 text-amber-500 mb-1.5">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="size-3 fill-amber-500" />
                            ))}
                            <span className="text-[10px] text-slate-400 mr-1">(4.9)</span>
                          </div>

                          <h4
                            className="font-bold text-sm text-slate-900 line-clamp-1 cursor-pointer hover:text-purple-600 transition-colors"
                            onClick={() => handleOpenProduct(product)}
                          >
                            {product.name}
                          </h4>

                          <p className="text-[11px] text-slate-500 line-clamp-1 mt-1">
                            {product.description || 'منتج أصلي عالي الجودة مع ضمان الفحص والتشغيل'}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <span className="text-[10px] text-slate-400 block">السعر</span>
                              <div className="text-base font-black text-[#5e17eb]">
                                {formatPriceInteger(product.price)}
                              </div>
                            </div>
                            {hasDiscount && product.originalPrice && (
                              <div className="text-left">
                                <span className="text-[10px] text-slate-400 line-through block">
                                  {formatPriceInteger(product.originalPrice)}
                                </span>
                              </div>
                            )}
                          </div>

                          <button
                            type="button"
                            disabled={isAdding}
                            onClick={(e) => handleAddToCartWithFeedback(product, e)}
                            className="w-full py-2.5 rounded-xl bg-[#5e17eb] hover:bg-[#4d0fd1] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md shadow-purple-600/20 disabled:opacity-50"
                          >
                            {isAdding ? (
                              <>
                                <Loader2 className="size-4 animate-spin" />
                                <span>جاري الإضافة...</span>
                              </>
                            ) : (
                              <>
                                <ShoppingCart className="size-4" />
                                <span>أضف إلى السلة</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* 6. Trust Badges */}
            <section className="py-12 bg-white border-y border-slate-200">
              <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="size-12 rounded-xl bg-purple-100 text-[#5e17eb] grid place-items-center shrink-0">
                      <Truck className="size-6" />
                    </div>
                    <div>
                      <h5 className="font-bold text-sm text-slate-900">توصيل سريع لكل المدن</h5>
                      <p className="text-[11px] text-slate-500 mt-0.5">توصيل آمن وباب المنزل</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="size-12 rounded-xl bg-purple-100 text-[#5e17eb] grid place-items-center shrink-0">
                      <ShieldCheck className="size-6" />
                    </div>
                    <div>
                      <h5 className="font-bold text-sm text-slate-900">فحص وتشغيل الجهاز</h5>
                      <p className="text-[11px] text-slate-500 mt-0.5">جرب الجهاز باليد قبل الدفع</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="size-12 rounded-xl bg-purple-100 text-[#5e17eb] grid place-items-center shrink-0">
                      <Award className="size-6" />
                    </div>
                    <div>
                      <h5 className="font-bold text-sm text-slate-900">أصالة وجودة مضمونة</h5>
                      <p className="text-[11px] text-slate-500 mt-0.5">ضمان على جميع الأجهزة</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="size-12 rounded-xl bg-purple-100 text-[#5e17eb] grid place-items-center shrink-0">
                      <PhoneCall className="size-6" />
                    </div>
                    <div>
                      <h5 className="font-bold text-sm text-slate-900">دعم فني واستشارة</h5>
                      <p className="text-[11px] text-slate-500 mt-0.5">خدمة عملاء طوال الأسبوع</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* 7. Footer */}
      <footer className="bg-slate-950 text-slate-300 text-xs mt-auto">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-xl bg-[#5e17eb] text-white grid place-items-center">
                  <Zap className="size-4" />
                </div>
                <h4 className="font-black text-white text-base">{storeName}</h4>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-400">
                وجهتكم المعتمدة للإلكترونيات والأجهزة الذكية الأصلية مع ضمان الفحص والتوصيل السريع لجميع المحافظات.
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
                      className="hover:text-purple-400 transition-colors"
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
                  <button type="button" onClick={() => setCurrentPage('shop')} className="hover:text-purple-400 transition-colors">
                    جميع المنتجات
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => setCurrentPage('cart')} className="hover:text-purple-400 transition-colors">
                    سلة المشتريات
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => setCurrentPage('account')} className="hover:text-purple-400 transition-colors">
                    حسابي والطلبات
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => setCurrentPage('contact')} className="hover:text-purple-400 transition-colors">
                    تواصل معنا
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h5 className="font-bold text-white text-sm">التوصيل وخدمة الشحن</h5>
              <p className="text-[11px] text-slate-400">
                شحن لجميع المحافظات مع ميزة فحص وتشغيل الجهاز باليد قبل الدفع.
              </p>
              <div className="font-mono text-purple-400 font-bold text-xs">
                📞 0770 000 0000
              </div>
              <div className="text-[10px] text-slate-500">
                الدفع: نقد عند الاستلام (COD) • دفع إلكتروني آمن
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-500">
            <div>
              © {new Date().getFullYear()} {storeName}. جميع الحقوق محفوظة
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

export default StoreNovaTheme;
