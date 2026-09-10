import React, { useState } from 'react';
import {
  ShoppingBag, Search, Heart, User, ArrowLeft, ArrowRight,
  Truck, ShieldCheck, Sparkles, Star, ChevronDown, CheckCircle2,
  PhoneCall, Home, Armchair, Lamp, Flower, MessageCircle,
  PackageCheck, Award, RefreshCw, Check, Plus, Tag, Loader2
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

export function StoreLoftoraTheme({
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

  const brandColor = customization?.brandColor || '#8b5a2b';
  const fontFamily = "'Marcellus', 'Tajawal', serif";
  const isEn = customization?.defaultLanguage === 'en';
  const announcement = customization?.announcementText || 'أثاث وديكور إسكندنافي معاصر • شحن آمن معزز ضد الكسر لكافة المحافظات مع ميزة فحص القطعة باليد';
  const heroTitle = customization?.heroTitle || (isEn ? 'Nordic Living & Warm Oak' : 'دفء الخشب وسكينة الديكور الإسكندنافي');
  const heroSubtitle = customization?.heroSubtitle || (isEn ? 'Crafted furniture and ceramic decor designed to create tranquil, inspiring living spaces' : 'قطع أثاث مختارة من خشب البلوط الطبيعي، وإضاءات سيراميكية هادئة صُممت لتضفي الراحة والأناقة على أركان منزلك، مع فحص القطعة قبل الدفع.');
  const heroBtnText = customization?.heroButtonText || (isEn ? 'Explore Pieces' : 'تصفح التشكيلة الآن');

  const handleOpenProduct = (product: StoreProduct) => {
    setSelectedProduct(product);
    setCurrentPage('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCartWithFeedback = (product: StoreProduct, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setAddingId(product.id);
    onAddToCart?.(product);
    setToastMsg(`تمت إضافة "${product.name}" إلى السلة بنجاح`);
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
      className="min-h-screen bg-[#faf8f5] text-[#2b2927] antialiased selection:bg-[#8b5a2b] selection:text-white flex flex-col"
      style={{ fontFamily }}
      dir="rtl"
    >
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#2b2927] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-[#8b5a2b]/30 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="size-6 rounded-full bg-[#8b5a2b] grid place-items-center text-white shrink-0">
            <Check className="size-3.5" />
          </div>
          <span className="text-xs font-bold font-sans">{toastMsg}</span>
        </div>
      )}

      {/* 1. Top Announcement Strip */}
      <div className="bg-[#2b2927] text-[#e8dfd5] text-xs py-2 px-4 select-none shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-hidden truncate">
            <Sparkles className="size-3.5 shrink-0 text-[#d4b996] animate-pulse" />
            <span className="text-[11px] font-medium truncate">{announcement}</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-[11px] font-mono shrink-0">
            <span className="flex items-center gap-1 text-[#d4b996]">
              <Truck className="size-3" />
              <span>تغليف آمن ضد الكسر لكافة المدن</span>
            </span>
            <span>|</span>
            <span className="font-bold text-white">https://{fullDomain}</span>
          </div>
        </div>
      </div>

      {/* 2. Scandinavian Modern Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-[#ebdcd0] sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3.5 flex items-center justify-between gap-4">
          {/* Logo & Slogan */}
          <div
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => setCurrentPage('home')}
          >
            {logoUrl ? (
              <img src={logoUrl} alt={storeName} className="h-10 w-auto max-w-[140px] object-contain" />
            ) : (
              <div className="flex items-center gap-2.5">
                <div className="size-10 rounded-xl bg-[#8b5a2b] text-[#faf8f5] grid place-items-center shadow-md shadow-[#8b5a2b]/20">
                  <Armchair className="size-5" />
                </div>
                <div>
                  <h1 className="font-extrabold text-xl text-[#2b2927] tracking-tight leading-none font-serif">{storeName}</h1>
                  <span className="text-[10px] font-sans font-bold text-[#8b5a2b] block mt-0.5 tracking-wider uppercase">
                    NORDIC LIVING & HOME
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Center Navigation */}
          <nav className="hidden md:flex items-center gap-1.5 bg-[#f3ede6] p-1.5 rounded-2xl border border-[#ebdcd0] text-xs font-bold font-sans">
            <button
              type="button"
              onClick={() => setCurrentPage('home')}
              className={`px-4 py-1.5 rounded-xl transition-all ${
                currentPage === 'home'
                  ? 'bg-[#8b5a2b] text-white shadow-sm'
                  : 'text-[#5c534b] hover:text-[#2b2927]'
              }`}
            >
              الرئيسية
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage('shop')}
              className={`px-4 py-1.5 rounded-xl transition-all ${
                currentPage === 'shop'
                  ? 'bg-[#8b5a2b] text-white shadow-sm'
                  : 'text-[#5c534b] hover:text-[#2b2927]'
              }`}
            >
              المتجر والأثاث
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage('categories')}
              className={`px-4 py-1.5 rounded-xl transition-all ${
                currentPage === 'categories'
                  ? 'bg-[#8b5a2b] text-white shadow-sm'
                  : 'text-[#5c534b] hover:text-[#2b2927]'
              }`}
            >
              التصنيفات
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage('contact')}
              className={`px-4 py-1.5 rounded-xl transition-all ${
                currentPage === 'contact'
                  ? 'bg-[#8b5a2b] text-white shadow-sm'
                  : 'text-[#5c534b] hover:text-[#2b2927]'
              }`}
            >
              تواصل معنا
            </button>
          </nav>

          {/* Search and Cart Controls */}
          <div className="flex items-center gap-2">
            <div className="relative">
              {searchOpen ? (
                <div className="flex items-center bg-[#f3ede6] rounded-xl px-3 py-1.5 border border-[#ebdcd0]">
                  <Search className="size-3.5 text-stone-400 ml-2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="ابحث عن أريكة، طاولة، إضاءة..."
                    className="bg-transparent border-none text-xs text-[#2b2927] focus:outline-none w-36 md:w-52"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="text-[10px] text-stone-500 hover:text-stone-800 mr-2"
                  >
                    إلغاء
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setSearchOpen(true)}
                  className="size-9 rounded-xl bg-[#f3ede6] hover:bg-[#ebdcd0] text-[#2b2927] grid place-items-center transition-colors border border-[#ebdcd0]"
                >
                  <Search className="size-4" />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => setCurrentPage('account')}
              className="size-9 rounded-xl bg-[#f3ede6] hover:bg-[#ebdcd0] text-[#2b2927] grid place-items-center transition-colors border border-[#ebdcd0]"
            >
              <User className="size-4" />
            </button>

            <button
              type="button"
              onClick={() => setCurrentPage('cart')}
              className="relative flex items-center gap-2 bg-[#8b5a2b] hover:bg-[#704822] text-white px-3.5 py-2 rounded-xl text-xs font-bold font-sans transition-colors shadow-md shadow-[#8b5a2b]/20"
            >
              <ShoppingBag className="size-4" />
              <span className="hidden sm:inline">السلة</span>
              {cartCount > 0 && (
                <span className="bg-white text-[#8b5a2b] text-[10px] font-black size-5 rounded-full grid place-items-center">
                  {cartCount}
                </span>
              )}
            </button>
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
            {/* 3. Editorial Nordic Hero */}
            <section className="relative overflow-hidden bg-gradient-to-b from-[#f3ede6] to-[#faf8f5] py-12 md:py-20 border-b border-[#ebdcd0]">
              <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-6 text-center lg:text-right">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#ebdcd0] text-[11px] font-bold text-[#8b5a2b] font-sans shadow-sm">
                    <Sparkles className="size-3 text-[#8b5a2b]" />
                    <span>مجموعة الديكور الإسكندنافي المعاصر</span>
                  </div>

                  <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#2b2927] leading-[1.15] font-serif">
                    {heroTitle}
                  </h2>

                  <p className="text-sm md:text-base text-stone-600 max-w-xl font-sans leading-relaxed">
                    {heroSubtitle}
                  </p>

                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2 font-sans">
                    <button
                      type="button"
                      onClick={() => setCurrentPage('shop')}
                      className="px-6 py-3.5 rounded-2xl bg-[#8b5a2b] hover:bg-[#704822] text-white text-xs md:text-sm font-bold shadow-xl shadow-[#8b5a2b]/25 transition-all flex items-center gap-2 transform hover:-translate-y-0.5"
                    >
                      <span>{heroBtnText}</span>
                      <ArrowLeft className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentPage('categories')}
                      className="px-6 py-3.5 rounded-2xl bg-white hover:bg-[#f3ede6] text-[#2b2927] text-xs md:text-sm font-bold border border-[#ebdcd0] transition-colors"
                    >
                      تصفح حسب الغرفة
                    </button>
                  </div>
                </div>

                {/* Hero Showcase Frame */}
                <div className="lg:col-span-5 relative">
                  <div className="relative rounded-3xl overflow-hidden border border-[#ebdcd0] shadow-2xl bg-white p-4">
                    <div className="aspect-[4/3] rounded-2xl overflow-hidden relative mb-4 bg-[#ece5de]">
                      <img
                        src={getProductImage(products[0])}
                        onError={(e) => { e.currentTarget.src = STORE_PLACEHOLDER_IMAGE; }}
                        alt="Home Furniture Showcase"
                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute top-3 right-3 bg-[#8b5a2b] text-white text-[10px] font-sans font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                        الأكثر تميزاً
                      </div>
                    </div>

                    <div className="flex items-center justify-between px-2 font-sans">
                      <div>
                        <span className="text-xs text-[#8b5a2b] font-bold">أريكة إسكندنافية مريحة</span>
                        <h4 className="font-bold text-[#2b2927] text-sm mt-0.5">قماش كتان مع أرجل خشبية صلبة</h4>
                      </div>
                      <div className="text-left">
                        <div className="text-base font-black text-[#8b5a2b]">
                          {products[0]?.price ? formatPriceInteger(products[0].price) : '125,000 د.ع'}
                        </div>
                        <span className="text-[10px] text-stone-500">الدفع عند الاستلام</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 4. Category Badges */}
            <section className="py-6 border-b border-[#ebdcd0] bg-white">
              <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none font-sans">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        onSelectCategory(cat);
                        setCurrentPage('shop');
                      }}
                      className={`px-5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                        selectedCategory === cat
                          ? 'bg-[#8b5a2b] text-white shadow-md'
                          : 'bg-[#f3ede6] text-[#5c534b] hover:bg-[#ebdcd0] border border-[#ebdcd0]'
                      }`}
                    >
                      <Armchair className="size-3.5" />
                      <span>{cat}</span>
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* 5. Featured Products */}
            <section className="py-12 md:py-16 max-w-7xl mx-auto px-4 md:px-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl md:text-3xl font-black text-[#2b2927] font-serif flex items-center gap-2">
                    <Sparkles className="size-6 text-[#8b5a2b]" />
                    <span>مجموعة الديكور والأثاث المختارة</span>
                  </h3>
                  <p className="text-xs text-stone-500 font-sans mt-1">
                    قطع فريدة تجمع بين الوظيفة والجمال لتكتمل تفاصيل منزلك
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentPage('shop')}
                  className="text-xs font-bold text-[#8b5a2b] hover:text-[#704822] font-sans flex items-center gap-1"
                >
                  <span>عرض الكل ({products.length})</span>
                  <ArrowLeft className="size-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-sans">
                {products.slice(0, 8).map((product) => {
                  const hasDiscount = !!product.originalPrice && product.originalPrice > product.price;
                  const isAdding = addingId === product.id;
                  return (
                    <div
                      key={product.id}
                      className="group bg-white rounded-2xl overflow-hidden border border-[#ebdcd0] hover:border-[#8b5a2b]/50 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
                    >
                      <div
                        className="relative aspect-square overflow-hidden bg-[#faf8f5] p-3 cursor-pointer flex items-center justify-center"
                        onClick={() => handleOpenProduct(product)}
                      >
                        <img
                          src={getProductImage(product)}
                          onError={(e) => { e.currentTarget.src = STORE_PLACEHOLDER_IMAGE; }}
                          alt={product.name}
                          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                        />
                        {hasDiscount && (
                          <div className="absolute top-2.5 right-2.5 bg-[#b85d39] text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-md">
                            تخفيض
                          </div>
                        )}
                        <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm text-[10px] font-bold text-[#8b5a2b] px-2 py-0.5 rounded-md border border-[#ebdcd0]">
                          {product.category || 'أثاث'}
                        </div>
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-1 text-amber-500 mb-1.5">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="size-3 fill-amber-500" />
                            ))}
                            <span className="text-[10px] text-stone-400 mr-1">(4.9)</span>
                          </div>

                          <h4
                            className="font-bold text-sm text-[#2b2927] line-clamp-1 cursor-pointer hover:text-[#8b5a2b] transition-colors font-serif"
                            onClick={() => handleOpenProduct(product)}
                          >
                            {product.name}
                          </h4>

                          <p className="text-[11px] text-stone-500 line-clamp-1 mt-1">
                            {product.description || 'قطعة أثاث راقية مصنعة بأعلى درجات الدقة'}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-[#ebdcd0]">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <span className="text-[10px] text-stone-500 block">السعر</span>
                              <div className="text-base font-black text-[#8b5a2b]">
                                {formatPriceInteger(product.price)}
                              </div>
                            </div>
                            {hasDiscount && product.originalPrice && (
                              <div className="text-left">
                                <span className="text-[10px] text-stone-400 line-through block">
                                  {formatPriceInteger(product.originalPrice)}
                                </span>
                              </div>
                            )}
                          </div>

                          <button
                            type="button"
                            disabled={isAdding}
                            onClick={(e) => handleAddToCartWithFeedback(product, e)}
                            className="w-full py-2.5 rounded-xl bg-[#8b5a2b] hover:bg-[#704822] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md shadow-[#8b5a2b]/20 disabled:opacity-50"
                          >
                            {isAdding ? (
                              <>
                                <Loader2 className="size-4 animate-spin" />
                                <span>جاري الإضافة...</span>
                              </>
                            ) : (
                              <>
                                <ShoppingBag className="size-4" />
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

            {/* 6. Loftora Features Strip */}
            <section className="py-12 bg-[#f3ede6] border-y border-[#ebdcd0] font-sans">
              <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-[#ebdcd0] shadow-sm">
                    <div className="size-12 rounded-xl bg-[#8b5a2b] text-white grid place-items-center shrink-0">
                      <Truck className="size-6 text-[#faf8f5]" />
                    </div>
                    <div>
                      <h5 className="font-bold text-sm text-[#2b2927]">شحن آمن للأثاث بالعراق</h5>
                      <p className="text-[11px] text-stone-500 mt-0.5">توصيل سليم لباب المنزل</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-[#ebdcd0] shadow-sm">
                    <div className="size-12 rounded-xl bg-[#8b5a2b] text-white grid place-items-center shrink-0">
                      <PackageCheck className="size-6 text-[#faf8f5]" />
                    </div>
                    <div>
                      <h5 className="font-bold text-sm text-[#2b2927]">معاينة قبل الدفع</h5>
                      <p className="text-[11px] text-stone-500 mt-0.5">افحص القطعة باليد براحة تامة</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-[#ebdcd0] shadow-sm">
                    <div className="size-12 rounded-xl bg-[#8b5a2b] text-white grid place-items-center shrink-0">
                      <Award className="size-6 text-[#faf8f5]" />
                    </div>
                    <div>
                      <h5 className="font-bold text-sm text-[#2b2927]">ضمان الجودة 100%</h5>
                      <p className="text-[11px] text-stone-500 mt-0.5">خشب طبيعي ومواد عالية التحمل</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-[#ebdcd0] shadow-sm">
                    <div className="size-12 rounded-xl bg-[#8b5a2b] text-white grid place-items-center shrink-0">
                      <PhoneCall className="size-6 text-[#faf8f5]" />
                    </div>
                    <div>
                      <h5 className="font-bold text-sm text-[#2b2927]">فريق الدعم والاستفسار</h5>
                      <p className="text-[11px] text-stone-500 mt-0.5">استشارة ومقاسات عبر الواتساب</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* 7. Scandinavian Modern Footer */}
      <footer className="bg-[#2b2927] text-[#e8dfd5] text-xs mt-auto font-sans">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-xl bg-[#8b5a2b] text-white grid place-items-center">
                  <Armchair className="size-4" />
                </div>
                <h4 className="font-black text-white text-base font-serif">{storeName}</h4>
              </div>
              <p className="text-[11px] leading-relaxed text-stone-400">
                علامتكم الموثوقة للأثاث والديكور الإسكندنافي المصنوع بعناية، مع خدمة الفحص عند الباب والدفع عند الاستلام.
              </p>
            </div>

            <div>
              <h5 className="font-bold text-white text-sm mb-3">أقسام المنزل</h5>
              <ul className="space-y-2 text-[11px]">
                {categories.slice(0, 5).map(cat => (
                  <li key={cat}>
                    <button
                      type="button"
                      onClick={() => {
                        onSelectCategory(cat);
                        setCurrentPage('shop');
                      }}
                      className="hover:text-[#d4b996] transition-colors"
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
                  <button type="button" onClick={() => setCurrentPage('shop')} className="hover:text-[#d4b996] transition-colors">
                    جميع المعروضات
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => setCurrentPage('cart')} className="hover:text-[#d4b996] transition-colors">
                    سلة المشتريات
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => setCurrentPage('account')} className="hover:text-[#d4b996] transition-colors">
                    حسابي والطلبات
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => setCurrentPage('contact')} className="hover:text-[#d4b996] transition-colors">
                    تواصل معنا
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h5 className="font-bold text-white text-sm">التوصيل وخدمة الشحن</h5>
              <p className="text-[11px] text-stone-400">
                شحن لجميع المحافظات مع ميزة فحص ومعاينة المنتج قبل الدفع.
              </p>
              <div className="font-mono text-[#d4b996] font-bold text-xs">
                📞 0770 000 0000
              </div>
              <div className="text-[10px] text-stone-500">
                الدفع: نقد عند الاستلام (COD) • دفع إلكتروني آمن
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-stone-700 flex flex-wrap items-center justify-between gap-4 text-[11px] text-stone-500">
            <div>
              © {new Date().getFullYear()} {storeName}. جميع الحقوق محفوظة
            </div>
            <div className="flex items-center gap-3">
              <span>سياسة الخصوصية والشحن</span>
              <span>•</span>
              <span>الشروط والأحكام</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
