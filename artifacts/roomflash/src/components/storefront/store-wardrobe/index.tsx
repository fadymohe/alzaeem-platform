import React, { useState } from 'react';
import {
  ShoppingBag, Search, Heart, User, ArrowLeft, ArrowRight,
  Truck, ShieldCheck, Sparkles, Star, ChevronDown, CheckCircle2,
  PhoneCall, Shirt, SlidersHorizontal, ArrowUpDown, RotateCcw,
  MessageCircle, Lock, Check, Flame, Zap, RefreshCw
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

export function StoreWardrobeTheme({
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
  const [addingId, setAddingId] = useState<number | null>(null);

  const categories = ['الكل', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];

  const brandColor = customization?.brandColor || '#111111';
  const fontFamily = "'IBM Plex Sans Arabic', 'Syne', sans-serif";
  const isEn = customization?.defaultLanguage === 'en';
  const announcement = customization?.announcementText || 'أحدث خطوط الموضة والأزياء الراقية • توصيل سريع لجميع محافظات العراق والدفع عند الاستلام';
  const heroTitle = customization?.heroTitle || (isEn ? 'Daily Signature Collection' : 'يومي بطابع خاص — أزياء معاصرة');
  const heroSubtitle = customization?.heroSubtitle || (isEn ? 'The pieces you wear on repeat' : 'القطع التي ترتديها فقط — تسوق أحدث خطوط الكاجوال اليومية والستريت وير.');
  const heroBtnText = customization?.heroButtonText || (isEn ? 'Shop Now' : 'تسوق التشكيلة');

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
    brandColor: '#111111',
    fontFamily,
    products,
    cartItems,
    onAddToCart,
    onOpenProductDetail: handleOpenProduct,
    onNavigatePage: (page: any) => setCurrentPage(page)
  };

  return (
    <div
      className="min-h-screen bg-white text-black antialiased selection:bg-black selection:text-white flex flex-col"
      style={{ fontFamily }}
      dir={isEn ? 'ltr' : 'rtl'}
    >
      {/* 1. Minimal Monochromatic Announcement Bar */}
      <div className="bg-black text-white text-xs py-2 px-4 select-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-hidden truncate">
            <span className="size-1.5 rounded-full bg-[#e63946] animate-pulse shrink-0" />
            <span className="font-bold text-[11px] truncate tracking-wide">{announcement}</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-[11px] font-mono shrink-0 text-slate-300">
            <span>توصيل لجميع المحافظات مع ضمان الفحص باليد</span>
            <span>|</span>
            <span className="font-bold text-[#e63946]">{fullDomain}</span>
          </div>
        </div>
      </div>

      {/* 2. Bold Monochromatic Clean Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3.5 flex items-center justify-between gap-4">
          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => setCurrentPage('home')}
          >
            {logoUrl ? (
              <img src={logoUrl} alt={storeName} className="h-9 w-auto max-w-[140px] object-contain" />
            ) : (
              <div className="flex items-center gap-2.5">
                <div className="size-9 bg-black text-white font-black grid place-items-center rounded-lg shadow-sm">
                  <Shirt className="size-5 text-[#e63946]" />
                </div>
                <div>
                  <h1 className="font-black text-xl text-black tracking-tight uppercase leading-none font-mono">
                    {storeName}
                  </h1>
                  <span className="text-[9px] font-mono text-slate-500 block uppercase tracking-widest mt-0.5">
                    STREETWEAR & ESSENTIALS
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Center Navigation */}
          <nav className="hidden md:flex items-center gap-1.5 text-xs font-black uppercase tracking-wider">
            <button
              type="button"
              onClick={() => setCurrentPage('home')}
              className={`px-3.5 py-2 rounded-lg transition-colors cursor-pointer ${
                currentPage === 'home' ? 'bg-black text-white' : 'text-slate-600 hover:text-black hover:bg-slate-100'
              }`}
            >
              الرئيسية
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage('shop')}
              className={`px-3.5 py-2 rounded-lg transition-colors cursor-pointer ${
                currentPage === 'shop' ? 'bg-black text-white' : 'text-slate-600 hover:text-black hover:bg-slate-100'
              }`}
            >
              المتجر
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage('categories')}
              className={`px-3.5 py-2 rounded-lg transition-colors cursor-pointer ${
                currentPage === 'categories' ? 'bg-black text-white' : 'text-slate-600 hover:text-black hover:bg-slate-100'
              }`}
            >
              الأقسام
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage('contact')}
              className={`px-3.5 py-2 rounded-lg transition-colors cursor-pointer ${
                currentPage === 'contact' ? 'bg-black text-white' : 'text-slate-600 hover:text-black hover:bg-slate-100'
              }`}
            >
              تواصل معنا
            </button>
          </nav>

          {/* Actions: Search, Account, Cart */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setCurrentPage('shop')}
              className="size-9 rounded-lg border border-slate-200 hover:bg-slate-100 grid place-items-center transition-colors cursor-pointer"
              title="بحث في المتجر"
            >
              <Search className="size-4 text-slate-700" />
            </button>

            <button
              type="button"
              onClick={() => {
                if (onOpenCustomerAuth) onOpenCustomerAuth();
                else setCurrentPage('account');
              }}
              className="size-9 rounded-lg border border-slate-200 hover:bg-slate-100 grid place-items-center transition-colors cursor-pointer"
              title="حساب العميل"
            >
              <User className="size-4 text-slate-700" />
            </button>

            <button
              type="button"
              onClick={() => setCurrentPage('cart')}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-black hover:bg-slate-800 text-white font-black text-xs transition-all active:scale-95 cursor-pointer"
            >
              <ShoppingBag className="size-4" />
              <span>السلة</span>
              <span className="size-4 rounded-full bg-[#e63946] text-white text-[10px] grid place-items-center font-mono">
                {cartCount}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* 3. Main Body Routing */}
      <main className="flex-1">
        {currentPage === 'product' && selectedProduct && (
          <ThemeProductDetailView
            {...sharedPageProps}
            product={selectedProduct}
          />
        )}
        {currentPage === 'shop' && <ThemeShopView {...sharedPageProps} />}
        {currentPage === 'categories' && <ThemeCategoriesView {...sharedPageProps} />}
        {currentPage === 'cart' && <ThemeCartCheckoutView {...sharedPageProps} />}
        {currentPage === 'checkout' && <ThemeCartCheckoutView {...sharedPageProps} />}
        {currentPage === 'account' && <ThemeAccountView {...sharedPageProps} />}
        {currentPage === 'contact' && <ThemeContactView {...sharedPageProps} />}

        {currentPage === 'home' && (
          <div className="space-y-12 animate-fadeIn pb-16">
            {/* Minimal Editorial Streetwear Hero */}
            <section className="relative bg-slate-950 text-white py-16 md:py-24 px-4 md:px-8 overflow-hidden">
              <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-6 text-right">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-white text-xs font-mono font-bold">
                    <Flame className="size-4 text-[#e63946]" />
                    <span>تشكيلة الموسم الجديد — NEW ARRIVALS</span>
                  </div>

                  <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight uppercase">
                    {heroTitle}
                  </h1>

                  <p className="text-sm md:text-base text-slate-300 max-w-xl leading-relaxed">
                    {heroSubtitle}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setCurrentPage('shop')}
                      className="px-8 py-4 rounded-xl bg-[#e63946] hover:bg-rose-700 text-white font-black text-sm tracking-wider uppercase transition-all shadow-xl shadow-rose-900/30 flex items-center gap-2 hover:scale-[1.02] cursor-pointer"
                    >
                      <span>{heroBtnText}</span>
                      <ArrowLeft className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentPage('categories')}
                      className="px-6 py-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-black text-sm transition-all cursor-pointer"
                    >
                      تصفح الأقسام
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-5 relative">
                  <div
                    className="aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-slate-900 cursor-pointer"
                    onClick={() => products[0] && handleOpenProduct(products[0])}
                  >
                    <img
                      src={getProductImage(products[0])}
                      alt="Wardrobe Fashion"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).onerror = null;
                        (e.currentTarget as HTMLImageElement).src = STORE_PLACEHOLDER_IMAGE;
                      }}
                      className="size-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-6 right-6 left-6 text-right space-y-1">
                      <span className="text-[10px] font-mono font-black uppercase px-2.5 py-0.5 rounded bg-[#e63946] text-white inline-block">
                        LIMITED RELEASE
                      </span>
                      <h3 className="text-xl font-black text-white">إطلالة مونوكروم حصرية</h3>
                      <p className="text-xs text-slate-300">خامات قطن ثقيل عالي الجودة مع شحن لكافة المحافظات</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Direct Benefits Bar */}
            <section className="max-w-7xl mx-auto px-4 md:px-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                <div className="flex items-center gap-3">
                  <Truck className="size-6 text-[#e63946] shrink-0" />
                  <div>
                    <h4 className="font-black text-black">توصيل سريع وموثوق</h4>
                    <p className="text-slate-500 mt-0.5">تغطية شاملة لجميع محافظات العراق الـ 18</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <ShieldCheck className="size-6 text-[#e63946] shrink-0" />
                  <div>
                    <h4 className="font-black text-black">معاينة قبل الدفع</h4>
                    <p className="text-slate-500 mt-0.5">افحص قطعتك براحتك عند الاستلام COD</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Sparkles className="size-6 text-[#e63946] shrink-0" />
                  <div>
                    <h4 className="font-black text-black">خامات معتمدة 100%</h4>
                    <p className="text-slate-500 mt-0.5">أقمشة مختارة بعناية تعيش طويلاً</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Product Mosaic / Catalog Grid */}
            <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b-2 border-black">
                <div>
                  <h3 className="text-2xl font-black text-black uppercase tracking-tight">التشكيلة المختارة</h3>
                  <p className="text-xs text-slate-500 mt-0.5">قطع يومية أساسية مصممة للبساطة والراحة المطلقة</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentPage('shop')}
                    className="text-xs font-black text-black hover:text-[#e63946] flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>عرض الكتالوج الكامل</span>
                    <ArrowLeft className="size-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {products.slice(0, 8).map((prod) => (
                  <div
                    key={prod.id}
                    className="border border-slate-200 rounded-xl overflow-hidden hover:border-black transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div
                      className="relative aspect-[3/4] overflow-hidden bg-slate-100 cursor-pointer p-2 flex items-center justify-center"
                      onClick={() => handleOpenProduct(prod)}
                    >
                      <img
                        src={getProductImage(prod)}
                        alt={prod.name}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).onerror = null;
                          (e.currentTarget as HTMLImageElement).src = STORE_PLACEHOLDER_IMAGE;
                        }}
                        className="size-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      {prod.compareAtPrice && prod.compareAtPrice > prod.price && (
                        <span className="absolute top-2.5 right-2.5 px-2 py-0.5 text-[10px] font-mono font-black bg-[#e63946] text-white">
                          SALE
                        </span>
                      )}
                    </div>

                    <div className="p-3.5 space-y-2.5 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-slate-500 block uppercase">{prod.category || 'CASUAL'}</span>
                        <h4
                          className="font-bold text-xs md:text-sm text-black line-clamp-1 cursor-pointer hover:underline mt-0.5"
                          onClick={() => handleOpenProduct(prod)}
                        >
                          {prod.name}
                        </h4>
                      </div>

                      <div className="pt-2 border-t border-slate-100 space-y-2">
                        <div className="flex items-baseline justify-between font-mono">
                          <span className="font-black text-sm md:text-base text-black">
                            {formatPriceInteger(prod.price)}
                          </span>
                          {prod.compareAtPrice && prod.compareAtPrice > prod.price && (
                            <span className="text-[10px] text-slate-400 line-through">
                              {formatPriceInteger(prod.compareAtPrice)}
                            </span>
                          )}
                        </div>

                        {/* Single Add to Cart Action */}
                        <button
                          type="button"
                          onClick={() => handleAddToCartWithFeedback(prod)}
                          disabled={addingId === prod.id}
                          className="w-full py-2.5 rounded-lg text-xs font-black bg-black hover:bg-slate-800 text-white transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer disabled:opacity-75"
                        >
                          {addingId === prod.id ? (
                            <>
                              <RefreshCw className="size-3.5 animate-spin" />
                              <span>تمت الإضافة...</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="size-3.5" />
                              <span>أضف إلى السلة</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </main>

      {/* 4. Minimal Streetwear Footer (White-Labeled) */}
      <footer className="bg-black text-white pt-14 pb-8 px-4 md:px-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-slate-800 text-right">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Shirt className="size-6 text-[#e63946]" />
              <h4 className="font-black text-lg text-white uppercase">{storeName}</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              أزياء يومية وستريت وير بمفهوم مينيمال معاصر. شحن لكافة محافظات العراق ودفع عند الاستلام.
            </p>
          </div>

          <div className="space-y-2 text-xs">
            <h5 className="font-black text-white text-sm uppercase tracking-wider">روابط سريعة</h5>
            <div className="flex flex-col gap-1.5 text-slate-400">
              <button type="button" onClick={() => setCurrentPage('home')} className="hover:text-white text-right cursor-pointer">الرئيسية</button>
              <button type="button" onClick={() => setCurrentPage('shop')} className="hover:text-white text-right cursor-pointer">المتجر والكتالوج</button>
              <button type="button" onClick={() => setCurrentPage('categories')} className="hover:text-white text-right cursor-pointer">أقسام الأزياء</button>
              <button type="button" onClick={() => setCurrentPage('contact')} className="hover:text-white text-right cursor-pointer">تواصل مع الإدارة</button>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <h5 className="font-black text-white text-sm uppercase tracking-wider">خدمات الشحن</h5>
            <div className="flex flex-col gap-1.5 text-slate-400">
              <span>✓ شحن لجميع المحافظات</span>
              <span>✓ فحص ومعاينة الشحنة قبل الاستلام</span>
              <span>✓ استبدال فوري للمقاسات</span>
              <span>✓ دفع نقدي أو إلكتروني عند الاستلام</span>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <h5 className="font-black text-white text-sm uppercase tracking-wider">خدمة العملاء</h5>
            <p className="text-slate-400">الخط الساخن لطلبات الموضة السريعة:</p>
            <a href="tel:+9647700000000" className="font-mono font-bold text-[#e63946] block text-sm">
              +964 770 000 0000
            </a>
            <span className="text-[10px] text-slate-500 font-mono block">STORE DOMAIN: https://{fullDomain}</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 font-mono">
          <span>© {new Date().getFullYear()} {storeName}. ALL RIGHTS RESERVED.</span>
        </div>
      </footer>
    </div>
  );
}
export default StoreWardrobeTheme;
