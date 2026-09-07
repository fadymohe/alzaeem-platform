import React, { useState } from 'react';
import {
  ShoppingBag, Search, Heart, User, ArrowLeft, ArrowRight,
  Truck, ShieldCheck, Sparkles, Star, ChevronDown, CheckCircle2,
  Footprints, Flame, Zap, Award, Layers, MessageCircle
} from 'lucide-react';
import { formatIQD } from '../../../data/iraqData';
import type { StoreProduct } from '../../../data/storeState';
import type { ThemeComponentProps } from '../store-classic';

export function StoreStrideTheme({
  storeName,
  subdomain,
  fullDomain,
  products,
  filteredProducts,
  cartCount,
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
  const [activeTab, setActiveTab] = useState('الرئيسية');

  const categories = ['الكل', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];

  const brandColor = customization?.brandColor || '#0052cc';
  const isEn = customization?.defaultLanguage === 'en';
  const isSticky = customization?.isHeaderSticky !== false;
  const showTrust = customization?.showTrustFeatures !== false;
  const showBanner = customization?.showHeroBanner !== false;
  const announcement = customization?.announcementText || 'توصيل سريع لكافة محافظات العراق • الدفع عند الاستلام مع إمكانية المعاينة والفحص باليد';
  const heroTitle = customization?.heroTitle || (isEn ? 'Cobalt Power. Stride Bold.' : 'أحذية وسنيكرز حصرية بأعلى جودة');
  const heroSubtitle = customization?.heroSubtitle || (isEn ? 'From pure suede Italian loafers to high-performance track runners, inspected before payment.' : 'من أحذية اللوفر الجلدية الكلاسيكية إلى السنيكرز الرياضي الخفيف، مع ميزة الفحص قبل الاستلام.');
  const heroBtnText = customization?.heroButtonText || (isEn ? 'Shop Shoes' : 'تسوق التشكيلة الآن');
  const gridCols = customization?.productGridCols || 4;
  const showDiscount = customization?.showDiscountBadge !== false;
  const showStock = customization?.showStockStatus !== false;
  const enableQuick = customization?.enableQuickBuy !== false;
  const urgencyTicker = customization?.showUrgencyTicker !== false;
  const copyright = customization?.footerCopyright || `© ${new Date().getFullYear()} ${storeName}. جميع الحقوق محفوظة • مدعوم بواسطة الزعيم`;
  const showBadges = customization?.showPaymentBadges !== false;
  const enableWa = customization?.enableWhatsAppFloating !== false;
  const waNumber = customization?.whatsAppNumber || '+9647700000000';
  const enableStickyCart = customization?.enableStickyCartBar !== false;

  const getColsClass = () => {
    switch (gridCols) {
      case 2: return 'grid-cols-1 sm:grid-cols-2';
      case 3: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
      case 4:
      default: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
    }
  };

  return (
    <div
      className="min-h-screen bg-[#071322] text-slate-100 font-sans antialiased selection:bg-[#00c8ff] selection:text-slate-950"
      dir={isEn ? 'ltr' : 'rtl'}
    >
      
      {/* 1. Top Striped Ticker Bar */}
      {customization?.showAnnouncement !== false && (
        <div className="bg-[#0052cc] text-white text-xs font-black py-2 px-4 md:px-8 shadow-md">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="size-3.5 text-[#00c8ff]" />
              <span>{announcement}</span>
            </div>
            <div className="flex items-center gap-4 text-[11px] font-bold">
              <a href="tel:+9647700000000" className="hover:text-cyan-200">
                📞 +964 770 000 0000
              </a>
              <span className="hidden sm:inline">|</span>
              <span className="font-mono text-cyan-200">https://{fullDomain}</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. Deep Cobalt Header */}
      <header className={`bg-[#0a1c33]/95 backdrop-blur-md border-b border-blue-900/50 ${isSticky ? 'sticky top-0' : 'relative'} z-40 shadow-xl`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          
          {/* Logo & Store */}
          <div className="flex items-center gap-3">
            {logoUrl ? (
              <img src={logoUrl} alt={storeName} className="h-10 w-auto max-w-[150px] object-contain rounded-xl border border-blue-500/40" />
            ) : (
              <div className="flex items-center gap-2.5">
                <div
                  className="size-11 rounded-2xl text-white font-black grid place-items-center text-xl shadow-lg"
                  style={{ backgroundColor: brandColor }}
                >
                  <Footprints className="size-6" />
                </div>
                <div>
                  <span className="font-black text-xl text-white tracking-tight">{storeName}</span>
                  <span className="text-[10px] font-mono text-blue-400 dir-ltr block mt-0.5">{fullDomain}</span>
                </div>
              </div>
            )}
          </div>

          {/* Dynamic Navigation Links */}
          <nav className="hidden lg:flex items-center gap-4 text-xs font-black text-blue-200">
            {categories.slice(0, 6).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  onSelectCategory(cat);
                  setActiveTab(cat);
                }}
                className={`py-1 transition-all hover:text-white relative ${
                  selectedCategory === cat ? 'text-white font-black' : ''
                }`}
              >
                {cat}
                {selectedCategory === cat && (
                  <span className="absolute -bottom-2 right-0 left-0 h-0.5 bg-[#00c8ff] rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Search & Actions */}
          <div className="flex items-center gap-2.5">
            <div className="relative hidden sm:block w-48 lg:w-56">
              <Search className={`absolute ${isEn ? 'left-3.5' : 'right-3.5'} top-2.5 size-4 text-blue-400/60`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={isEn ? 'Search shoes...' : 'ابحث عن موديل، مقاس...'}
                className={`w-full h-9 ${isEn ? 'pl-10 pr-4' : 'pr-10 pl-4'} rounded-xl border border-blue-900/60 bg-[#071322] text-xs text-white placeholder:text-blue-300/40 focus:outline-none focus:border-[#00c8ff]`}
              />
            </div>

            {/* Customer Account Button */}
            <button
              type="button"
              onClick={() => onOpenCustomerAuth?.()}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-blue-800 bg-[#0b1c33] text-blue-100 font-bold text-xs hover:bg-[#102747] transition-all"
              title="حسابي / تسجيل الدخول"
            >
              <User className="size-4" />
              <span className="hidden sm:inline">
                {currentCustomer ? currentCustomer.name : 'دخول'}
              </span>
            </button>

            {/* Cart Button */}
            <button
              type="button"
              onClick={() => onOpenCart?.()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-white font-black text-xs shadow-lg transition-all hover:scale-105"
              style={{ backgroundColor: brandColor }}
            >
              <ShoppingBag className="size-4" />
              <span>{isEn ? 'Cart' : 'السلة'} ({cartCount})</span>
            </button>
          </div>
        </div>
      </header>

      {/* 3. Hero Section with Suede Loafers on Sheepskin Rug (Matching Screenshot 1 Stride) */}
      {showBanner && (
        <section className="max-w-7xl mx-auto px-4 md:px-8 mt-5">
          <div className="rounded-3xl overflow-hidden bg-gradient-to-r from-[#0c2340] via-[#103159] to-[#0a1d36] border border-blue-800/40 relative shadow-2xl min-h-[360px] flex flex-col md:flex-row items-center justify-between">
            
            {/* Left Hero Image: Suede Loafers resting on fur rug */}
            <div className="w-full md:w-1/2 h-72 md:h-[380px] relative overflow-hidden order-2 md:order-1">
              <img
                src="https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=900&auto=format&fit=crop&q=80"
                alt="Stride Loafers"
                className="size-full object-cover object-center hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-[#0c2340] via-transparent to-transparent" />
            </div>

            {/* Right Hero Text */}
            <div className="w-full md:w-1/2 p-8 md:p-12 text-right space-y-4 relative z-10 order-1 md:order-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-black bg-[#0052cc] text-white">
                <Award className="size-3.5" />
                {isEn ? 'Official Footwear Catalog' : 'موسم الرقبة العالية — إصدارات حصرية'}
              </span>
              <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">
                {heroTitle}
              </h1>
              <p className="text-xs md:text-sm text-blue-200/80 leading-relaxed font-medium">
                {heroSubtitle}
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('stride-grid');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-3 rounded-xl text-white font-black text-xs shadow-xl flex items-center gap-2 transition-transform hover:scale-105"
                  style={{ backgroundColor: brandColor }}
                >
                  <span>{heroBtnText}</span>
                  <ArrowLeft className={`size-4 ${isEn ? 'rotate-180' : ''}`} />
                </button>
                <span className="text-xs font-bold text-blue-300 flex items-center gap-1.5 bg-blue-950/80 px-3.5 py-2.5 rounded-xl border border-blue-800/60">
                  <Truck className="size-4 text-[#00c8ff]" /> {isEn ? 'Iraq Express Delivery' : 'شحن 18 محافظة خلال 24-48 ساعة'}
                </span>
              </div>
            </div>

          </div>
        </section>
      )}

      {/* 4. Collections Header */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mt-10">
        <div className="text-center space-y-1 mb-8">
          <h2 className="text-2xl md:text-3xl font-black text-white">
            {isEn ? 'Featured Collections' : 'أبرز المجموعات'}
          </h2>
          <p className="text-xs text-blue-300/70">
            {isEn ? 'Handcrafted leather, athletic running & modern court silhouettes' : 'أحذية عالية، جري، وألوان وتصاميم مميزة'}
          </p>
        </div>
      </section>

      {/* 5. Products Grid */}
      <section id="stride-grid" className="max-w-7xl mx-auto px-4 md:px-8 mb-16">
        <div className={`grid ${getColsClass()} gap-6`}>
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className="bg-[#0b1c33] border border-blue-900/60 rounded-3xl overflow-hidden hover:border-[#00c8ff] hover:shadow-2xl hover:shadow-blue-900/40 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div
                  onClick={() => onOpenProductDetail?.(p)}
                  className="h-64 bg-[#071322] relative overflow-hidden cursor-pointer"
                >
                  <img
                    src={p.imageUrl || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700&auto=format&fit=crop&q=80'}
                    alt={p.name}
                    className="size-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {showDiscount && p.compareAtPrice && (
                    <span className="absolute top-3 right-3 text-[10px] font-black bg-[#0052cc] text-white px-2.5 py-1 rounded-lg shadow-md">
                      {isEn ? 'OFFER' : 'عرض خاص'}
                    </span>
                  )}
                  {showStock && (
                    <span className="absolute bottom-3 left-3 text-[9px] font-black bg-blue-950/90 text-blue-200 border border-blue-700/60 px-2 py-0.5 rounded-md backdrop-blur-sm">
                      {isEn ? 'Available' : 'متوفر بالمقاسات'}
                    </span>
                  )}
                  <span className="absolute bottom-3 right-3 text-[10px] font-bold bg-[#071322]/90 text-white px-2.5 py-0.5 rounded-md backdrop-blur-sm">
                    {p.category}
                  </span>
                </div>

                <div className="p-5 text-right space-y-2">
                  <h4
                    onClick={() => onOpenProductDetail?.(p)}
                    className="font-black text-sm text-white line-clamp-1 group-hover:text-[#00c8ff] transition-colors cursor-pointer"
                  >
                    {p.name}
                  </h4>
                  <p className="text-xs text-blue-200/60 line-clamp-2 leading-relaxed">
                    {p.description || 'حذاء رياضي متين بخامات مريحة وفحص قبل الاستلام.'}
                  </p>

                  {urgencyTicker && (
                    <div className="pt-1 text-[10px] font-bold text-amber-400 flex items-center gap-1">
                      <Flame className="size-3 fill-amber-400" />
                      <span>{isEn ? 'Popular Choice • Fast dispatch' : 'الأكثر طلباً • شحن فوري'}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-5 border-t border-blue-900/50 bg-[#09172a] flex items-center justify-between gap-2">
                <div>
                  <span className="text-base font-black font-mono text-white block">
                    {formatIQD(p.price)}
                  </span>
                  {p.compareAtPrice && (
                    <span className="text-xs text-blue-300/40 line-through font-mono">
                      {formatIQD(p.compareAtPrice)}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      if (onAddToCart) onAddToCart(p);
                      else onQuickBuy(p);
                    }}
                    className="p-2 rounded-xl border border-blue-800 bg-[#071322] text-blue-200 hover:bg-[#0c2340] transition-colors"
                    title="أضف إلى السلة"
                  >
                    <ShoppingBag className="size-3.5" />
                  </button>

                  {enableQuick && (
                    <button
                      type="button"
                      onClick={() => onQuickBuy(p)}
                      className="px-3.5 py-2 rounded-xl text-xs font-black text-white shadow-md flex items-center gap-1.5 transition-all hover:scale-105"
                      style={{ backgroundColor: brandColor }}
                    >
                      <span>{isEn ? 'Buy' : 'طلب'}</span>
                      <ArrowLeft className={`size-3 ${isEn ? 'rotate-180' : ''}`} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Footer */}
      <footer className="bg-[#050e1a] border-t border-blue-950 py-10 px-4 text-xs text-blue-300/60">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>{copyright}</p>
          {showBadges && (
            <div className="flex items-center gap-3 font-bold text-blue-200 text-xs">
              <span className="px-2.5 py-1 rounded bg-blue-950/80 border border-blue-800/60">الدفع عند الاستلام (COD)</span>
              <span className="px-2.5 py-1 rounded bg-blue-950/80 border border-blue-800/60">فحص القياس قبل الاستلام</span>
            </div>
          )}
        </div>
      </footer>

      {/* 7. WhatsApp Floating */}
      {enableWa && (
        <a
          href={`https://wa.me/${waNumber.replace(/[^0-9]/g, '')}`}
          target="_blank"
          rel="noreferrer"
          className="fixed bottom-6 left-6 z-40 size-12 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl grid place-items-center transition-transform hover:scale-110"
        >
          <MessageCircle className="size-6 fill-white" />
        </a>
      )}

      {/* 8. Sticky Cart Bar */}
      {enableStickyCart && cartCount > 0 && (
        <div className="fixed bottom-0 inset-x-0 bg-[#0052cc] text-white px-4 py-3 z-30 shadow-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShoppingBag className="size-4" />
            <span className="text-xs font-bold">
              {isEn ? `${cartCount} items in cart` : `لديك ${cartCount} أحذية في السلة`}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('stride-grid');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-4 py-1.5 rounded-lg bg-white text-[#0052cc] font-black text-xs hover:bg-blue-50 transition-colors"
          >
            {isEn ? 'Checkout' : 'إتمام الطلب'}
          </button>
        </div>
      )}

    </div>
  );
}

export default StoreStrideTheme;
