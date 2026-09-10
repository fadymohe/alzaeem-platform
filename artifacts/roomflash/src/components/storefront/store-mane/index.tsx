import React, { useState } from 'react';
import {
  ShoppingBag, Search, Heart, User, ArrowLeft, ArrowRight,
  Truck, ShieldCheck, Sparkles, Star, ChevronDown, CheckCircle2,
  PhoneCall, Sparkle, Wand2, Eye, MessageCircle, Check, Loader2
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

export function StoreManeTheme({
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

  const brandColor = customization?.brandColor || '#6b0f24';
  const isSticky = customization?.isHeaderSticky !== false;
  const showBanner = customization?.showHeroBanner !== false;
  const announcement = customization?.announcementText || 'مستحضرات صالون وعناية متقدمة — توصيل سريع لجميع محافظات العراق والدفع عند الاستلام';
  const heroTitle = customization?.heroTitle || 'أبرز المجموعات والعناية المتكاملة';
  const heroSubtitle = customization?.heroSubtitle || 'تركيبات علاجية ومستخلصات نقية تمنح بشرتك وشعرك النضارة والإشراقة الدائمة مع ضمان الفحص قبل الاستلام.';
  const heroBtnText = customization?.heroButtonText || 'تسوق التشكيلة';
  const copyright = customization?.footerCopyright || `© ${new Date().getFullYear()} ${storeName}. جميع الحقوق محفوظة`;

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
      className="min-h-screen bg-[#faf5f6] text-slate-900 font-sans antialiased selection:bg-[#6b0f24] selection:text-white flex flex-col"
      dir="rtl"
    >
      {/* Toast Feedback */}
      {toastMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#240010] text-pink-100 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-pink-500/30 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="size-6 rounded-full bg-[#6b0f24] grid place-items-center text-white shrink-0">
            <Check className="size-3.5" />
          </div>
          <span className="text-xs font-bold">{toastMsg}</span>
        </div>
      )}

      {/* 1. Top Announcement Bar */}
      <div className="bg-[#540b0e] text-pink-100 text-[11px] font-bold py-2 px-4 md:px-8 text-center shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <span className="flex items-center gap-1.5 mx-auto sm:mx-0">
            <Sparkles className="size-3.5 text-pink-300 animate-pulse" />
            <span>{announcement}</span>
          </span>
          <div className="hidden sm:flex items-center gap-4 text-xs font-bold text-pink-200">
            <span>دفع عند الاستلام</span>
            <span>|</span>
            <span>ضمان الأصالة والجودة 100%</span>
          </div>
        </div>
      </div>

      {/* 2. Deep Burgundy Header */}
      <header
        className={`${isSticky ? 'sticky top-0' : 'relative'} z-40 shadow-md text-white`}
        style={{ backgroundColor: brandColor }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => setCurrentPage('home')}
          >
            {logoUrl ? (
              <img src={logoUrl} alt={storeName} className="h-10 w-auto max-w-[140px] object-contain rounded-xl border border-white/20 bg-white/10" />
            ) : (
              <div className="flex items-center gap-2.5">
                <div className="size-10 rounded-2xl bg-white/20 text-white font-black grid place-items-center text-lg backdrop-blur-sm shadow-inner">
                  <Wand2 className="size-5" />
                </div>
                <div>
                  <h1 className="font-black text-2xl text-white tracking-tight leading-none">
                    {storeName}
                  </h1>
                  <span className="text-[10px] font-mono text-pink-200 dir-ltr block mt-0.5">{fullDomain}</span>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-2 text-xs font-bold text-pink-100">
            <button
              type="button"
              onClick={() => setCurrentPage('home')}
              className={`py-1.5 px-3.5 rounded-full transition-all ${
                currentPage === 'home' ? 'bg-white text-[#6b0f24] font-black shadow-sm' : 'hover:bg-white/15'
              }`}
            >
              الرئيسية
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage('shop')}
              className={`py-1.5 px-3.5 rounded-full transition-all ${
                currentPage === 'shop' ? 'bg-white text-[#6b0f24] font-black shadow-sm' : 'hover:bg-white/15'
              }`}
            >
              المتجر
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage('categories')}
              className={`py-1.5 px-3.5 rounded-full transition-all ${
                currentPage === 'categories' ? 'bg-white text-[#6b0f24] font-black shadow-sm' : 'hover:bg-white/15'
              }`}
            >
              التصنيفات
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage('contact')}
              className={`py-1.5 px-3.5 rounded-full transition-all ${
                currentPage === 'contact' ? 'bg-white text-[#6b0f24] font-black shadow-sm' : 'hover:bg-white/15'
              }`}
            >
              تواصل معنا
            </button>
          </nav>

          {/* Search & Actions */}
          <div className="flex items-center gap-2.5">
            <div className="relative hidden sm:block w-48">
              <Search className="absolute right-3 top-2.5 size-3.5 text-pink-200" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="ابحث عن منتج..."
                className="w-full h-8 pr-9 pl-3 rounded-full border border-white/20 bg-white/10 text-xs text-white placeholder:text-pink-200/60 focus:outline-none focus:bg-white/20"
              />
            </div>

            <button
              type="button"
              onClick={() => setCurrentPage('account')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/30 text-white font-bold text-xs hover:bg-white/15 transition-all"
            >
              <User className="size-3.5" />
              <span className="hidden md:inline">حسابي</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentPage('cart')}
              className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-[#6b0f24] font-black text-xs shadow-md transition-all hover:scale-105"
            >
              <ShoppingBag className="size-3.5" />
              <span>السلة ({cartCount})</span>
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
            {/* 3. Hero Section */}
            {showBanner && (
              <section className="max-w-7xl mx-auto px-4 md:px-8 mt-8 mb-6">
                <div className="bg-gradient-to-r from-[#540b0e] to-[#6b0f24] text-white rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden text-center md:text-right flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="space-y-4 max-w-xl z-10">
                    <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-pink-200">
                      <Sparkles className="size-3.5" />
                      <span>مجموعة الصالون والعناية الفائقة</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
                      {heroTitle}
                    </h2>
                    <p className="text-xs md:text-sm text-pink-100/90 leading-relaxed font-medium">
                      {heroSubtitle}
                    </p>
                    <div className="pt-2 flex flex-wrap gap-3 justify-center md:justify-start">
                      <button
                        type="button"
                        onClick={() => setCurrentPage('shop')}
                        className="px-6 py-3 rounded-full bg-white text-[#6b0f24] font-black text-xs md:text-sm shadow-lg hover:bg-pink-50 transition-all flex items-center gap-2"
                      >
                        <span>{heroBtnText}</span>
                        <ArrowLeft className="size-4" />
                      </button>
                    </div>
                  </div>

                  <div className="relative z-10 shrink-0 w-full max-w-[280px] aspect-square rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl bg-white/10 flex items-center justify-center p-3">
                    <img
                      src={getProductImage(products[0])}
                      onError={(e) => { e.currentTarget.src = STORE_PLACEHOLDER_IMAGE; }}
                      alt={storeName}
                      className="w-full h-full object-contain mix-blend-multiply"
                    />
                  </div>
                </div>
              </section>
            )}

            {/* 4. Products Grid */}
            <section className="max-w-7xl mx-auto px-4 md:px-8 mb-16">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-black text-[#540b0e] flex items-center gap-2">
                    <Sparkles className="size-5 text-[#6b0f24]" />
                    <span>أبرز المنتجات والمستحضرات</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">منتجات أصلية معتمدة مع التوصيل السريع لجميع المحافظات</p>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentPage('shop')}
                  className="text-xs font-black text-[#6b0f24] hover:underline flex items-center gap-1"
                >
                  <span>عرض الكل ({products.length})</span>
                  <ArrowLeft className="size-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.slice(0, 8).map((p) => {
                  const isAdding = addingId === p.id;
                  const hasDiscount = !!p.originalPrice && p.originalPrice > p.price;
                  return (
                    <div
                      key={p.id}
                      className="bg-white border border-pink-100 rounded-3xl overflow-hidden hover:shadow-xl hover:border-[#6b0f24]/40 transition-all duration-300 flex flex-col justify-between group"
                    >
                      <div
                        className="cursor-pointer"
                        onClick={() => handleOpenProduct(p)}
                      >
                        <div className="h-64 bg-gradient-to-b from-[#faf0f2] to-white relative overflow-hidden flex items-center justify-center p-4">
                          <img
                            src={getProductImage(p)}
                            onError={(e) => { e.currentTarget.src = STORE_PLACEHOLDER_IMAGE; }}
                            alt={p.name}
                            className="size-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                          />
                          {hasDiscount && (
                            <span className="absolute top-3 right-3 text-[10px] font-black bg-[#6b0f24] text-white px-2.5 py-1 rounded-full shadow-sm">
                              خصم
                            </span>
                          )}
                          <span className="absolute bottom-3 left-3 text-[9px] font-black bg-white/90 text-slate-700 px-2.5 py-0.5 rounded-full shadow-sm">
                            أصلي 100%
                          </span>
                          <span className="absolute bottom-3 right-3 text-[10px] font-bold bg-pink-100 text-[#6b0f24] px-2.5 py-0.5 rounded-full">
                            {p.category || 'عناية'}
                          </span>
                        </div>

                        <div className="p-5 text-right space-y-1.5">
                          <h4 className="font-black text-sm text-slate-900 line-clamp-1 group-hover:text-[#6b0f24] transition-colors">
                            {p.name}
                          </h4>
                          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                            {p.description || 'مستحضر فاخر للعناية الفائقة مع ضمان الأصالة والتسليم السريع.'}
                          </p>

                          <div className="pt-1 text-[10px] font-bold text-pink-700 flex items-center gap-1">
                            <Sparkle className="size-3 text-pink-600" />
                            <span>الأكثر طلباً • تم اختباره سريرياً</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-5 border-t border-pink-50 bg-[#fdfafb] flex items-center justify-between gap-2">
                        <div>
                          <span className="text-base font-black font-mono text-[#6b0f24] block">
                            {formatPriceInteger(p.price)}
                          </span>
                          {hasDiscount && p.originalPrice && (
                            <span className="text-xs text-slate-400 line-through font-mono">
                              {formatPriceInteger(p.originalPrice)}
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          disabled={isAdding}
                          onClick={(e) => handleAddToCartWithFeedback(p, e)}
                          className="px-4 py-2 rounded-2xl text-xs font-black text-white shadow-md flex items-center gap-1.5 transition-all hover:scale-105 disabled:opacity-50"
                          style={{ backgroundColor: brandColor }}
                        >
                          {isAdding ? (
                            <>
                              <Loader2 className="size-3.5 animate-spin" />
                              <span>جاري الإضافة...</span>
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
                  );
                })}
              </div>
            </section>
          </div>
        )}
      </main>

      {/* 5. Footer */}
      <footer className="bg-[#240010] text-pink-100/70 py-10 px-4 text-xs mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>{copyright}</p>
          <div className="flex items-center gap-3 font-bold text-pink-200 text-xs">
            <span className="px-2.5 py-1 rounded bg-white/10 border border-white/20">الدفع عند الاستلام</span>
            <span className="px-2.5 py-1 rounded bg-white/10 border border-white/20">ضمان النقاء 100%</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default StoreManeTheme;
