import React, { useState } from 'react';
import {
  ShoppingBag, Search, Star, ArrowLeft, Truck, ShieldCheck,
  Sparkles, Crown, Flame, TrendingUp, Check, Loader2, User
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

export function StoreNovatrendTheme({
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

  const brandColor = customization?.brandColor || '#ec4899';
  const announcement = customization?.announcementText || 'صيحات الموضة والترندات الأكثر طلباً • شحن مباشر لجميع المحافظات والدفع عند الاستلام بعد الفحص';
  const heroTitle = customization?.heroTitle || 'ستايل لا يتكرر مع أفضل صيحات الموضة والتريند';
  const heroSubtitle = customization?.heroSubtitle || 'منتجات مميزة بإطلالة جريئة وعصرية، احصل عليها فوراً مع ميزة الفحص قبل الدفع عند الاستلام.';
  const heroBtnText = customization?.heroButtonText || 'تسوق التشكيلة';

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
    <div className="min-h-screen bg-[#0f0c1b] text-slate-100 font-sans antialiased selection:bg-pink-500 selection:text-white flex flex-col" dir="rtl">
      {/* Toast Feedback */}
      {toastMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#161226] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-pink-500/30 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="size-6 rounded-full bg-pink-500 grid place-items-center text-white shrink-0">
            <Check className="size-3.5" />
          </div>
          <span className="text-xs font-bold">{toastMsg}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 text-white font-black text-xs py-2 px-4 text-center flex items-center justify-center gap-2 shadow-md">
        <Sparkles className="size-4 animate-pulse" />
        <span>{announcement}</span>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#161226]/90 backdrop-blur-lg border-b border-pink-500/20 px-4 md:px-8 py-3.5 shadow-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => setCurrentPage('home')}
          >
            {logoUrl ? (
              <img src={logoUrl} alt={storeName} className="size-11 rounded-2xl object-cover border border-pink-500/40" />
            ) : (
              <div className="size-11 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-400 text-white font-black grid place-items-center text-xl shadow-lg">
                <Crown className="size-6" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-base text-white leading-none">{storeName}</h1>
                <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black bg-gradient-to-r from-pink-500 to-rose-500 text-white">TREND</span>
              </div>
              <span className="text-[11px] font-mono text-pink-400 dir-ltr block mt-1">
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
                currentPage === 'home' ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md' : 'text-pink-200 hover:text-white'
              }`}
            >
              الرئيسية
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage('shop')}
              className={`px-3.5 py-1.5 rounded-full transition-all ${
                currentPage === 'shop' ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md' : 'text-pink-200 hover:text-white'
              }`}
            >
              المتجر
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage('categories')}
              className={`px-3.5 py-1.5 rounded-full transition-all ${
                currentPage === 'categories' ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md' : 'text-pink-200 hover:text-white'
              }`}
            >
              التصنيفات
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage('contact')}
              className={`px-3.5 py-1.5 rounded-full transition-all ${
                currentPage === 'contact' ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md' : 'text-pink-200 hover:text-white'
              }`}
            >
              تواصل معنا
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <div className="relative hidden md:block w-52">
              <Search className="absolute right-3.5 top-2.5 size-4 text-pink-400/60" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="ابحث عن الترندات..."
                className="w-full h-9 pr-10 pl-4 rounded-full border border-pink-900/50 bg-[#0f0c1b] text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-pink-500"
              />
            </div>

            <button
              type="button"
              onClick={() => setCurrentPage('account')}
              className="size-9 rounded-full bg-pink-950 border border-pink-800/50 grid place-items-center text-pink-200 hover:text-white transition-colors"
            >
              <User className="size-4" />
            </button>

            <button
              type="button"
              onClick={() => setCurrentPage('cart')}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white font-black text-xs shadow-lg transition-transform hover:scale-105"
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
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#1e1533] via-[#291b45] to-[#17102b] border border-pink-500/30 p-8 md:p-12 min-h-[300px] flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
                <div className="absolute top-0 right-10 size-80 bg-pink-500/15 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 max-w-xl space-y-4 text-center md:text-right">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black bg-pink-950 border border-pink-700 text-pink-300">
                    <Flame className="size-3.5 text-pink-400 fill-pink-400" />
                    أحدث تشكيلة تريند شبابية هذا الموسم
                  </span>
                  <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
                    {heroTitle}
                  </h2>
                  <p className="text-xs md:text-sm text-pink-200/80 leading-relaxed">
                    {heroSubtitle}
                  </p>
                  <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
                    <button
                      type="button"
                      onClick={() => setCurrentPage('shop')}
                      className="px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black text-xs md:text-sm shadow-xl hover:brightness-110 transition-all flex items-center gap-2"
                    >
                      <span>{heroBtnText}</span>
                      <ArrowLeft className="size-4" />
                    </button>
                  </div>
                </div>

                <div className="relative z-10 shrink-0 w-full max-w-[260px] aspect-square rounded-2xl overflow-hidden border border-pink-500/40 shadow-2xl bg-white/5 flex items-center justify-center p-4">
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
              <div className="flex items-center justify-between mb-8 pb-3 border-b border-pink-900/30">
                <div>
                  <h3 className="text-2xl font-black text-white flex items-center gap-2">
                    <TrendingUp className="size-6 text-pink-500" />
                    <span>أبرز منتجات التريند</span>
                  </h3>
                  <p className="text-xs text-pink-300/60 mt-1">قطع أصلية ومميزة مع التوصيل السريع لجميع المدن</p>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentPage('shop')}
                  className="text-xs font-black text-pink-400 hover:text-pink-300 flex items-center gap-1"
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
                      className="bg-[#161226] border border-pink-900/40 hover:border-pink-500 rounded-3xl overflow-hidden shadow-lg hover:shadow-pink-500/10 transition-all duration-300 flex flex-col justify-between group"
                    >
                      <div
                        className="cursor-pointer"
                        onClick={() => handleOpenProduct(p)}
                      >
                        <div className="h-60 bg-[#1d1633] relative overflow-hidden flex items-center justify-center p-4">
                          <img
                            src={getProductImage(p)}
                            onError={(e) => { e.currentTarget.src = STORE_PLACEHOLDER_IMAGE; }}
                            alt={p.name}
                            className="size-full object-contain group-hover:scale-105 transition-transform duration-500"
                          />
                          <span className="absolute top-3 right-3 text-[10px] font-black bg-pink-500 text-white px-2.5 py-1 rounded-full shadow-md">
                            {p.category || 'تريند'}
                          </span>
                        </div>

                        <div className="p-5 text-right space-y-1.5">
                          <h4 className="font-black text-sm text-white line-clamp-1 group-hover:text-pink-400 transition-colors">
                            {p.name}
                          </h4>
                          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                            {p.description || 'منتج تريند فاخر ومميز مع شحن سريع ومعاينة قبل الدفع.'}
                          </p>
                        </div>
                      </div>

                      <div className="p-5 border-t border-pink-900/30 bg-[#120e20] flex items-center justify-between gap-2">
                        <div>
                          <span className="text-base font-black font-mono text-pink-400 block">
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
                          className="px-4 py-2 rounded-full text-xs font-black bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white shadow-md flex items-center gap-1.5 transition-all hover:scale-105 disabled:opacity-50"
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
      <footer className="bg-[#0b0814] text-slate-400 text-xs py-10 px-4 border-t border-pink-950 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} {storeName}. جميع الحقوق محفوظة</p>
          <div className="flex items-center gap-4 text-pink-300">
            <span>توصيل سريع لجميع المحافظات</span>
            <span>•</span>
            <span>دفع عند الاستلام بعد المعاينة</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default StoreNovatrendTheme;
