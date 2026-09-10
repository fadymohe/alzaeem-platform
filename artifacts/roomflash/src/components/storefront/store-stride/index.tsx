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
  ThemeContactView,
  ThemeProductDetailView,
  getProductImage,
  formatPriceInteger,
  STORE_PLACEHOLDER_IMAGE
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
  onAddToCart,
  logoUrl,
  customization
}: ThemeComponentProps) {
  const [currentPage, setCurrentPage] = useState<'home' | 'shop' | 'categories' | 'cart' | 'checkout' | 'account' | 'contact' | 'product'>('home');
  const [selectedProduct, setSelectedProduct] = useState<StoreProduct>(products[0] || {} as StoreProduct);
  const [searchOpen, setSearchOpen] = useState(false);
  const [addingId, setAddingId] = useState<number | null>(null);

  const categories = ['الكل', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];

  const brandColor = customization?.brandColor || '#0052cc';
  const fontFamily = "'Alexandria', 'Montserrat', sans-serif";
  const isEn = customization?.defaultLanguage === 'en';
  const announcement = customization?.announcementText || 'أحذية وسنيكرز حصرية بأعلى جودة • شحن سريع لكافة محافظات العراق مع إمكانية فحص المقاس باليد قبل الدفع';
  const heroTitle = customization?.heroTitle || (isEn ? 'Cobalt Power. Stride Bold.' : 'سنيكرز وأحذية رياضية حصرية بجودة أصلية');
  const heroSubtitle = customization?.heroSubtitle || (isEn ? 'From pure suede Italian loafers to high-performance track runners, inspected before payment.' : 'من السنيكرز الرياضي عالي الأداء إلى أحذية اللوفر الجلدية، نمنحك تجربة تسوق رياضية مع فحص الحذاء ومقاسه قبل الاستلام والدفع عند الباب.');
  const heroBtnText = customization?.heroButtonText || (isEn ? 'Shop Shoes' : 'تسوق التشكيلة الآن');

  const handleOpenProduct = (prod: StoreProduct) => {
    setSelectedProduct(prod);
    setCurrentPage('product');
    if (onOpenProductDetail) onOpenProductDetail(prod);
  };

  const handleAddToCartWithFeedback = (prod: StoreProduct) => {
    if (addingId !== null) return;
    setAddingId(prod.id);
    if (onAddToCart) onAddToCart(prod);
    setTimeout(() => setAddingId(null), 500);
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
    onOpenProductDetail: handleOpenProduct,
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
                <div className="size-10 rounded-2xl bg-gradient-to-br from-[#0052cc] to-[#00c8ff] text-slate-950 font-black grid place-items-center shadow-lg shadow-blue-500/30">
                  <Footprints className="size-6 text-slate-950" />
                </div>
                <div>
                  <h1 className="font-black text-xl text-white tracking-wider uppercase leading-none font-sans">
                    {storeName}
                  </h1>
                  <span className="text-[9px] font-mono text-[#00c8ff] block uppercase tracking-widest mt-0.5 font-bold">
                    STRIDE ATHLETIC CO.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 bg-[#071322]/80 p-1.5 rounded-2xl border border-blue-900/50 text-xs font-bold">
            <button
              type="button"
              onClick={() => setCurrentPage('home')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                currentPage === 'home'
                  ? 'bg-[#0052cc] text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-blue-900/30'
              }`}
            >
              الرئيسية
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage('shop')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                currentPage === 'shop'
                  ? 'bg-[#0052cc] text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-blue-900/30'
              }`}
            >
              الأحذية والكتالوج
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage('categories')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                currentPage === 'categories'
                  ? 'bg-[#0052cc] text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-blue-900/30'
              }`}
            >
              التصنيفات
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage('contact')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                currentPage === 'contact'
                  ? 'bg-[#0052cc] text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-blue-900/30'
              }`}
            >
              تواصل معنا
            </button>
          </nav>

          {/* Action Icons: Search, Account, Cart */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(!searchOpen)}
              className="size-9 rounded-xl bg-[#0d2038] hover:bg-blue-900/50 border border-blue-800/40 text-[#00c8ff] grid place-items-center transition-colors cursor-pointer"
              title="بحث"
            >
              <Search className="size-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                if (onOpenCustomerAuth) onOpenCustomerAuth();
                else setCurrentPage('account');
              }}
              className="size-9 rounded-xl bg-[#0d2038] hover:bg-blue-900/50 border border-blue-800/40 text-[#00c8ff] grid place-items-center transition-colors cursor-pointer"
              title="حسابي"
            >
              <User className="size-4" />
            </button>

            <button
              type="button"
              onClick={() => setCurrentPage('cart')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#0052cc] to-[#0099ff] hover:from-blue-700 hover:to-cyan-500 text-white font-black text-xs transition-all shadow-lg shadow-blue-600/30 active:scale-95 cursor-pointer"
            >
              <ShoppingBag className="size-4" />
              <span>السلة</span>
              <span className="size-4 rounded-full bg-white text-slate-950 text-[10px] grid place-items-center font-bold">
                {cartCount}
              </span>
            </button>
          </div>
        </div>

        {/* Search Bar Flyout */}
        {searchOpen && (
          <div className="bg-[#071322] border-t border-blue-900/50 p-3 px-4 md:px-8">
            <div className="max-w-2xl mx-auto flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="size-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="ابحث عن موديل، سنيكرز، حذاء رياضي، أو لون..."
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
                className="text-xs text-slate-400 hover:text-white px-2 py-1 cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        )}
      </header>

      {/* 3. Main Body Routing */}
      <main className="flex-1">
        {currentPage === 'product' && selectedProduct && (
          <ThemeProductDetailView
            {...sharedPageProps}
            product={selectedProduct}
            isDark={true}
          />
        )}
        {currentPage === 'shop' && <ThemeShopView {...sharedPageProps} isDark={true} />}
        {currentPage === 'categories' && <ThemeCategoriesView {...sharedPageProps} isDark={true} />}
        {currentPage === 'cart' && <ThemeCartCheckoutView {...sharedPageProps} isDark={true} />}
        {currentPage === 'checkout' && <ThemeCartCheckoutView {...sharedPageProps} isDark={true} />}
        {currentPage === 'account' && <ThemeAccountView {...sharedPageProps} isDark={true} />}
        {currentPage === 'contact' && <ThemeContactView {...sharedPageProps} isDark={true} />}

        {currentPage === 'home' && (
          <div className="space-y-12 animate-fadeIn pb-16">
            {/* Split Angled Dynamic Athletic Hero */}
            <section className="relative bg-gradient-to-br from-[#0a1c33] via-[#071322] to-[#040a12] py-16 md:py-24 px-4 md:px-8 overflow-hidden border-b border-blue-900/40">
              <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-7 space-y-6 text-right">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-[#00c8ff] text-xs font-mono font-bold">
                    <Flame className="size-3.5 text-orange-400" />
                    <span>تشكيلة السنيكرز الأكثر طلباً لعام 2026</span>
                  </div>

                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
                    {heroTitle}
                  </h1>

                  <p className="text-sm md:text-base text-slate-300 max-w-xl leading-relaxed">
                    {heroSubtitle}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <button
                      type="button"
                      onClick={() => setCurrentPage('shop')}
                      className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#0052cc] to-[#0099ff] hover:from-blue-700 hover:to-cyan-500 text-white font-black text-sm shadow-xl shadow-blue-600/30 transition-all flex items-center gap-2 hover:scale-[1.02] cursor-pointer"
                    >
                      <span>{heroBtnText}</span>
                      <ArrowLeft className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentPage('categories')}
                      className="px-6 py-4 rounded-2xl bg-[#0d2038] hover:bg-blue-900/40 border border-blue-800/60 text-white font-black text-sm transition-all cursor-pointer"
                    >
                      استكشف الأقسام
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-5 relative">
                  <div
                    className="relative rounded-3xl overflow-hidden border border-blue-500/30 shadow-2xl bg-[#0d2038] p-4 cursor-pointer"
                    onClick={() => products[0] && handleOpenProduct(products[0])}
                  >
                    <div className="aspect-square rounded-2xl overflow-hidden relative mb-3 bg-[#071322] p-4 flex items-center justify-center">
                      <img
                        src={getProductImage(products[0])}
                        alt="Stride Showcase"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).onerror = null;
                          (e.currentTarget as HTMLImageElement).src = STORE_PLACEHOLDER_IMAGE;
                        }}
                        className="size-full object-contain transform hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute top-3 right-3 bg-[#0052cc] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                        الأعلى مبيعاً
                      </div>
                    </div>

                    <div className="flex items-center justify-between px-2 text-right">
                      <div>
                        <span className="text-xs text-[#00c8ff] font-bold block">سنيكرز إير فليكس الرياضي</span>
                        <h4 className="font-bold text-white text-sm mt-0.5">مقاوم للصدمات وخفيف الوزن</h4>
                      </div>
                      <div className="text-left font-mono">
                        <div className="text-base font-black text-cyan-400">
                          {products[0]?.price ? formatPriceInteger(products[0].price) : '58,000 د.ع'}
                        </div>
                        <span className="text-[10px] text-slate-400">معاينة قبل الدفع</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Featured Shoes Grid */}
            <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-blue-900/40">
                <div>
                  <h3 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
                    <Footprints className="size-6 text-[#00c8ff]" />
                    <span>مختارات الأحذية والسنيكرز</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">أفضل الموديلات المصممة للأداء الرياضي والراحة اليومية</p>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentPage('shop')}
                  className="px-4 py-2 rounded-xl bg-[#0052cc] hover:bg-blue-600 text-white font-black text-xs transition-colors cursor-pointer"
                >
                  عرض الكتالوج الكامل
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {products.slice(0, 8).map((product) => {
                  const hasDiscount = !!product.compareAtPrice && product.compareAtPrice > product.price;
                  return (
                    <div
                      key={product.id}
                      className="group bg-[#0a1c33] rounded-2xl overflow-hidden border border-blue-900/40 hover:border-blue-500/60 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
                    >
                      <div
                        className="relative aspect-square overflow-hidden bg-[#071322] p-3 flex items-center justify-center cursor-pointer"
                        onClick={() => handleOpenProduct(product)}
                      >
                        <img
                          src={getProductImage(product)}
                          alt={product.name}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).onerror = null;
                            (e.currentTarget as HTMLImageElement).src = STORE_PLACEHOLDER_IMAGE;
                          }}
                          className="size-full object-contain group-hover:scale-105 transition-transform duration-700"
                        />
                        {hasDiscount && (
                          <div className="absolute top-2.5 right-2.5 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
                            تخفيض
                          </div>
                        )}
                        <div className="absolute bottom-2 left-2 bg-[#071322]/90 backdrop-blur-sm text-[10px] font-bold text-cyan-300 px-2 py-0.5 rounded-md border border-blue-800/40">
                          {product.category || 'أحذية'}
                        </div>
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          <div className="flex items-center gap-1 text-amber-400 mb-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="size-3 fill-amber-400" />
                            ))}
                            <span className="text-[10px] text-slate-400 mr-1">(4.9)</span>
                          </div>

                          <h4
                            className="font-bold text-xs md:text-sm text-white line-clamp-1 cursor-pointer hover:text-cyan-400 transition-colors"
                            onClick={() => handleOpenProduct(product)}
                          >
                            {product.name}
                          </h4>
                          <p className="text-[10px] text-slate-400 line-clamp-1 mt-1">
                            {product.description || 'حذاء رياضي متين ومريح للقدمين'}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-blue-900/40 space-y-2">
                          <div className="flex items-baseline justify-between font-mono">
                            <span className="font-black text-sm md:text-base text-cyan-400">
                              {formatPriceInteger(product.price)}
                            </span>
                            {hasDiscount && product.compareAtPrice && (
                              <span className="text-[10px] text-slate-500 line-through">
                                {formatPriceInteger(product.compareAtPrice)}
                              </span>
                            )}
                          </div>

                          {/* Single Add to Cart Action */}
                          <button
                            type="button"
                            onClick={() => handleAddToCartWithFeedback(product)}
                            disabled={addingId === product.id}
                            className="w-full py-2.5 rounded-xl bg-[#0052cc] hover:bg-[#0047b3] text-white text-xs font-black transition-all shadow-md shadow-blue-600/30 flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer disabled:opacity-75"
                          >
                            {addingId === product.id ? (
                              <>
                                <RefreshCw className="size-3.5 animate-spin" />
                                <span>تمت الإضافة...</span>
                              </>
                            ) : (
                              <>
                                <ShoppingBag className="size-3.5" />
                                <span>أضف للسلة</span>
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

            {/* Trust Strip */}
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
                      <h5 className="font-bold text-sm text-white">دعم العملاء</h5>
                      <p className="text-[11px] text-slate-400 mt-0.5">متابعة شحنتك لحظة بلحظة</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* 4. Cobalt Athletic Footer (White-Labeled) */}
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
                      className="hover:text-cyan-400 transition-colors cursor-pointer"
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
                  <button type="button" onClick={() => setCurrentPage('shop')} className="hover:text-cyan-400 transition-colors cursor-pointer">
                    جميع المنتجات
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => setCurrentPage('cart')} className="hover:text-cyan-400 transition-colors cursor-pointer">
                    سلة المشتريات
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => setCurrentPage('account')} className="hover:text-cyan-400 transition-colors cursor-pointer">
                    حسابي والطلبات
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => setCurrentPage('contact')} className="hover:text-cyan-400 transition-colors cursor-pointer">
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
              © {new Date().getFullYear()} {storeName}. جميع الحقوق محفوظة.
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
export default StoreStrideTheme;
