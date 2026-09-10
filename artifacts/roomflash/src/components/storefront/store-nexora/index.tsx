import React, { useState } from 'react';
import {
  ShoppingBag, Search, Star, ArrowLeft, Truck, ShieldCheck,
  Sparkles, Crown, Gem, Check, Loader2, User
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

export function StoreNexoraTheme({
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
  const [addingId, setAddingId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const categories = ['الكل', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];

  const brandColor = customization?.brandColor || '#6366f1';
  const announcement = customization?.announcementText || 'فخامة حصرية وتوصيل مباشر لكافة المحافظات مع ميزة فحص ومعاينة الطلب قبل الدفع عند الاستلام';
  const heroTitle = customization?.heroTitle || 'تشكيلة نيكسورا الملكية المصممة لك خصيصاً';
  const heroSubtitle = customization?.heroSubtitle || 'منتجات راقية بأعلى معايير الفخامة والتميز، تسوق الآن مع خدمة الشحن المباشر والدفع عند الاستلام بعد الفحص.';
  const heroBtnText = customization?.heroButtonText || 'استكشف التشكيلة الملكية';

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
    <div className="min-h-screen bg-[#080816] text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white flex flex-col" dir="rtl">
      {/* Toast Feedback */}
      {toastMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#0d0d24] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-indigo-500/30 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="size-6 rounded-full bg-indigo-600 grid place-items-center text-white shrink-0">
            <Check className="size-3.5" />
          </div>
          <span className="text-xs font-bold">{toastMsg}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-950 border-b border-indigo-700/40 text-indigo-200 font-black text-xs py-2 px-4 text-center flex items-center justify-center gap-2 shadow-md">
        <Sparkles className="size-4 text-amber-400 animate-pulse" />
        <span>{announcement}</span>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0d0d24]/90 backdrop-blur-lg border-b border-indigo-500/20 px-4 md:px-8 py-3.5 shadow-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => setCurrentPage('home')}
          >
            {logoUrl ? (
              <img src={logoUrl} alt={storeName} className="size-11 rounded-2xl object-cover border border-indigo-500/40 shadow-md" />
            ) : (
              <div className="size-11 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-amber-400 text-slate-950 font-black grid place-items-center text-xl shadow-lg">
                <Gem className="size-6 text-slate-950" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-base text-white leading-none">{storeName}</h1>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 flex items-center gap-1 shadow-sm">
                  <Gem className="size-2.5" /> VIP
                </span>
              </div>
              <span className="text-[11px] font-mono text-indigo-400 dir-ltr block mt-1">
                https://{fullDomain}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-2 text-xs font-bold">
            <button
              type="button"
              onClick={() => setCurrentPage('home')}
              className={`px-3.5 py-1.5 rounded-full transition-all ${
                currentPage === 'home' ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md' : 'text-indigo-200 hover:text-white'
              }`}
            >
              الرئيسية
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage('shop')}
              className={`px-3.5 py-1.5 rounded-full transition-all ${
                currentPage === 'shop' ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md' : 'text-indigo-200 hover:text-white'
              }`}
            >
              المتجر
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage('categories')}
              className={`px-3.5 py-1.5 rounded-full transition-all ${
                currentPage === 'categories' ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md' : 'text-indigo-200 hover:text-white'
              }`}
            >
              التصنيفات
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage('contact')}
              className={`px-3.5 py-1.5 rounded-full transition-all ${
                currentPage === 'contact' ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md' : 'text-indigo-200 hover:text-white'
              }`}
            >
              تواصل معنا
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <div className="relative hidden md:block w-52">
              <Search className="absolute right-3.5 top-2.5 size-4 text-indigo-400/60" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="ابحث في التشكيلة..."
                className="w-full h-9 pr-10 pl-4 rounded-full border border-indigo-900/50 bg-[#080816] text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="button"
              onClick={() => setCurrentPage('account')}
              className="size-9 rounded-full bg-indigo-950 border border-indigo-800/50 grid place-items-center text-indigo-200 hover:text-white transition-colors"
            >
              <User className="size-4" />
            </button>

            <button
              type="button"
              onClick={() => setCurrentPage('cart')}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 hover:opacity-90 text-white font-black text-xs shadow-lg transition-transform hover:scale-105"
            >
              <ShoppingBag className="size-4" />
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
            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-4 md:px-8 mt-6">
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#121233] via-[#1a1947] to-[#0c0c24] border border-indigo-500/30 p-8 md:p-12 min-h-[320px] flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
                <div className="absolute top-0 right-10 size-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 max-w-xl space-y-4 text-center md:text-right">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black bg-indigo-950 border border-indigo-600 text-indigo-300">
                    <Gem className="size-3.5 text-amber-400" />
                    قمة الرفاهية والتميز في كل قطعة
                  </span>
                  <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
                    {heroTitle}
                  </h2>
                  <p className="text-xs md:text-sm text-indigo-200/80 leading-relaxed">
                    {heroSubtitle}
                  </p>
                  <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
                    <button
                      type="button"
                      onClick={() => setCurrentPage('shop')}
                      className="px-6 py-3 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-400 text-slate-950 font-black text-xs md:text-sm shadow-xl hover:opacity-95 transition-all flex items-center gap-2"
                    >
                      <span>{heroBtnText}</span>
                      <ArrowLeft className="size-4" />
                    </button>
                  </div>
                </div>

                <div className="relative z-10 shrink-0 w-full max-w-[260px] aspect-square rounded-2xl overflow-hidden border border-indigo-500/40 shadow-2xl bg-white/5 flex items-center justify-center p-4">
                  <img
                    src={getProductImage(products[0])}
                    onError={(e) => { e.currentTarget.src = STORE_PLACEHOLDER_IMAGE; }}
                    alt={storeName}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </section>

            {/* Products Grid */}
            <section className="max-w-7xl mx-auto px-4 md:px-8 mt-12 mb-16">
              <div className="flex items-center justify-between mb-8 pb-3 border-b border-indigo-900/30">
                <div>
                  <h3 className="text-2xl font-black text-white flex items-center gap-2">
                    <Gem className="size-6 text-amber-400" />
                    <span>المقتنيات والمنتجات الفاخرة</span>
                  </h3>
                  <p className="text-xs text-indigo-300/60 mt-1">قطع استثنائية مع خدمة الفحص الراقي قبل الدفع</p>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentPage('shop')}
                  className="text-xs font-black text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
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
                      className="bg-[#0e0e26] border border-indigo-900/40 hover:border-indigo-500 rounded-3xl overflow-hidden shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col justify-between group"
                    >
                      <div
                        className="cursor-pointer"
                        onClick={() => handleOpenProduct(p)}
                      >
                        <div className="h-60 bg-[#141438] relative overflow-hidden flex items-center justify-center p-4">
                          <img
                            src={getProductImage(p)}
                            onError={(e) => { e.currentTarget.src = STORE_PLACEHOLDER_IMAGE; }}
                            alt={p.name}
                            className="size-full object-contain group-hover:scale-105 transition-transform duration-500"
                          />
                          <span className="absolute top-3 right-3 text-[10px] font-black bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 px-2.5 py-1 rounded-full shadow-md">
                            {p.category || 'VIP'}
                          </span>
                        </div>

                        <div className="p-5 text-right space-y-1.5">
                          <h4 className="font-black text-sm text-white line-clamp-1 group-hover:text-indigo-400 transition-colors">
                            {p.name}
                          </h4>
                          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                            {p.description || 'منتج فاخر مصمم بأعلى مستويات الإتقان مع خدمة الفحص عند الباب.'}
                          </p>
                        </div>
                      </div>

                      <div className="p-5 border-t border-indigo-900/30 bg-[#0a0a1f] flex items-center justify-between gap-2">
                        <div>
                          <span className="text-base font-black font-mono text-amber-400 block">
                            {formatPriceInteger(p.price)}
                          </span>
                          {hasDiscount && p.originalPrice && (
                            <span className="text-xs text-slate-500 line-through font-mono">
                              {formatPriceInteger(p.originalPrice)}
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          disabled={isAdding}
                          onClick={(e) => handleAddToCartWithFeedback(p, e)}
                          className="px-4 py-2 rounded-full text-xs font-black bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 text-white shadow-md flex items-center gap-1.5 transition-all hover:scale-105 disabled:opacity-50"
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

      {/* Footer */}
      <footer className="bg-[#050510] text-slate-400 text-xs py-10 px-4 border-t border-indigo-950 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} {storeName}. جميع الحقوق محفوظة</p>
          <div className="flex items-center gap-4 text-indigo-400">
            <span>توصيل VIP لكافة المحافظات</span>
            <span>•</span>
            <span>فحص ومعاينة قبل الدفع</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default StoreNexoraTheme;
