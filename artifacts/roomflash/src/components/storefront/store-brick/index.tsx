import React, { useState } from 'react';
import {
  ShoppingBag, Search, Heart, User, ArrowLeft, ArrowRight,
  Truck, ShieldCheck, Headphones, CreditCard, ChevronDown,
  Flame, Zap, RefreshCw, Star, Tag, ChevronRight, PhoneCall, Sparkles, Crown,
  Check, Loader2
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

export function StoreBrickTheme({
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

  const brandColor = customization?.brandColor || '#f97316';
  const announcement = customization?.announcementText || 'شحن سريع لكافة المحافظات • فحص ومعاينة المنتج باليد قبل الدفع عند الاستلام';
  const heroTitle = customization?.heroTitle || 'تسوق أحدث المنتجات بأسعار الجملة التنافسية';
  const heroSubtitle = customization?.heroSubtitle || 'تشكيلة متكاملة من المنتجات المختارة بعناية، مع ميزة التوصيل السريع والدفع عند الاستلام بعد الفحص.';
  const heroBtnText = customization?.heroButtonText || 'تصفح العروض الآن';

  const categoryMenu = [
    { id: 'all', label: 'الكل', icon: '🛍️', badge: '' },
    { id: 'bestseller', label: 'الأكثر مبيعاً', icon: '🔥', badge: 'مميز', badgeColor: 'bg-orange-500 text-white' },
    { id: 'deal', label: 'عروض اليوم', icon: '⏰', badge: 'جديد', badgeColor: 'bg-amber-500 text-white' },
    { id: 'electronics', label: 'إلكترونيات', icon: '📱', badge: '' },
    { id: 'fashion', label: 'أزياء', icon: '👕', badge: '' },
    { id: 'home', label: 'المنزل', icon: '🛋️', badge: '' },
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
    <div className="min-h-screen bg-[#f3f4f8] text-slate-800 font-sans antialiased selection:bg-orange-500 selection:text-white flex flex-col" dir="rtl">
      {/* Toast Feedback */}
      {toastMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-orange-500/30 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="size-6 rounded-full bg-orange-500 grid place-items-center text-white shrink-0">
            <Check className="size-3.5" />
          </div>
          <span className="text-xs font-bold">{toastMsg}</span>
        </div>
      )}

      {/* 1. Top Announcement Bar */}
      <div className="bg-[#172030] text-slate-300 text-[11px] py-1.5 px-4 md:px-8 border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-bold text-amber-400">
              <Flame className="size-3.5 fill-amber-400" />
              <span>{announcement}</span>
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-1 bg-slate-800/80 px-2 py-0.5 rounded text-[11px] text-amber-300 border border-slate-700">
              🇮🇶 (IQD) د.ع
            </span>
            <span>https://{fullDomain}</span>
          </div>
        </div>
      </div>

      {/* 2. Main Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          {/* Logo & Store Info */}
          <div
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => setCurrentPage('home')}
          >
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
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-orange-500 text-white">STORE</span>
                  </div>
                  <span className="text-[10px] font-mono text-orange-600 dir-ltr block -mt-0.5">
                    {fullDomain}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Center Nav */}
          <nav className="hidden md:flex items-center gap-2 text-xs font-bold">
            <button
              type="button"
              onClick={() => setCurrentPage('home')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                currentPage === 'home' ? 'bg-orange-500 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              الرئيسية
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage('shop')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                currentPage === 'shop' ? 'bg-orange-500 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              المتجر
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage('categories')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                currentPage === 'categories' ? 'bg-orange-500 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              التصنيفات
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage('contact')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                currentPage === 'contact' ? 'bg-orange-500 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              تواصل معنا
            </button>
          </nav>

          {/* Search & Actions */}
          <div className="flex items-center gap-2.5">
            <div className="relative hidden sm:block w-48">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="ابحث عن منتج..."
                className="w-full h-9 pr-9 pl-3 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-orange-500"
              />
              <Search className="size-4 text-slate-400 absolute right-3 top-2.5" />
            </div>

            <button
              type="button"
              onClick={() => setCurrentPage('account')}
              className="size-9 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 grid place-items-center text-slate-700 transition-colors"
            >
              <User className="size-4" />
            </button>

            <button
              type="button"
              onClick={() => setCurrentPage('cart')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-black text-xs shadow-md shadow-orange-500/25 transition-all"
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
            {/* 3. Hero Section */}
            <section className="max-w-7xl mx-auto px-4 md:px-8 mt-6">
              <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-orange-950 rounded-3xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-4 max-w-xl z-10 text-center md:text-right">
                  <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-400/30 px-3 py-1.5 rounded-full text-xs font-bold text-orange-300">
                    <Sparkles className="size-3.5" />
                    <span>عروض وتخفيضات موسمية حصرية</span>
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black leading-tight tracking-tight">
                    {heroTitle}
                  </h2>
                  <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-medium">
                    {heroSubtitle}
                  </p>
                  <div className="pt-2 flex flex-wrap gap-3 justify-center md:justify-start">
                    <button
                      type="button"
                      onClick={() => setCurrentPage('shop')}
                      className="px-6 py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black text-xs md:text-sm shadow-lg shadow-orange-500/30 transition-all flex items-center gap-2"
                    >
                      <span>{heroBtnText}</span>
                      <ArrowLeft className="size-4" />
                    </button>
                  </div>
                </div>

                <div className="relative z-10 shrink-0 w-full max-w-[280px] aspect-square rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-white/5 flex items-center justify-center p-4">
                  <img
                    src={getProductImage(products[0])}
                    onError={(e) => { e.currentTarget.src = STORE_PLACEHOLDER_IMAGE; }}
                    alt={storeName}
                    className="w-full h-full object-contain mix-blend-multiply"
                  />
                </div>
              </div>
            </section>

            {/* 4. Product Catalog Grid */}
            <section className="max-w-7xl mx-auto px-4 md:px-8 mt-12 mb-16">
              <div className="flex items-center justify-between mb-8 pb-2 border-b border-slate-200">
                <div>
                  <h3 className="font-black text-2xl text-slate-900 flex items-center gap-2">
                    <Flame className="size-6 text-orange-500" />
                    <span>تشكيلة المتجر المختارة</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">منتجات أصلية معتمدة مع ضمان الفحص قبل الدفع</p>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentPage('shop')}
                  className="text-xs font-black text-orange-600 hover:underline flex items-center gap-1"
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
                      className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:border-orange-400 hover:-translate-y-1"
                    >
                      <div
                        className="cursor-pointer"
                        onClick={() => handleOpenProduct(p)}
                      >
                        <div className="h-60 bg-slate-50 relative overflow-hidden flex items-center justify-center p-4">
                          <img
                            src={getProductImage(p)}
                            onError={(e) => { e.currentTarget.src = STORE_PLACEHOLDER_IMAGE; }}
                            alt={p.name}
                            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                          />
                          <span className="absolute top-2.5 right-2.5 text-[10px] font-black bg-white/95 backdrop-blur-md text-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 shadow-sm">
                            {p.category || 'عام'}
                          </span>
                          <span className="absolute top-2.5 left-2.5 text-[10px] font-black bg-orange-500 text-white px-2 py-0.5 rounded-md shadow-sm">
                            شحن لكل المحافظات
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

                      <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-2">
                        <div>
                          <span className="text-sm font-black font-mono text-orange-600 block">
                            {formatPriceInteger(p.price)}
                          </span>
                          {hasDiscount && p.originalPrice && (
                            <span className="text-[11px] text-slate-400 line-through font-mono">
                              {formatPriceInteger(p.originalPrice)}
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          disabled={isAdding}
                          onClick={(e) => handleAddToCartWithFeedback(p, e)}
                          className="px-3.5 py-2 rounded-xl text-xs font-black bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/20 flex items-center gap-1.5 transition-all hover:scale-105 disabled:opacity-50"
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
      <footer className="bg-[#111a28] text-slate-400 text-xs py-12 px-4 border-t border-slate-800 mt-auto">
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
          © {new Date().getFullYear()} {storeName}. جميع الحقوق محفوظة
        </div>
      </footer>
    </div>
  );
}

export default StoreBrickTheme;
