import React, { useState } from 'react';
import {
  ShoppingBag, Search, Heart, User, ArrowLeft, ArrowRight,
  Truck, ShieldCheck, Sparkles, Star, ChevronDown, CheckCircle2,
  PhoneCall, Home, Armchair, Lamp, Flower, MessageCircle
} from 'lucide-react';
import { formatIQD } from '../../../data/iraqData';
import type { StoreProduct } from '../../../data/storeState';
import type { ThemeComponentProps } from '../store-classic';

export function StoreLoftoraTheme({
  storeName,
  subdomain,
  fullDomain,
  products,
  filteredProducts,
  cartCount,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onQuickBuy,
  logoUrl,
  customization
}: ThemeComponentProps) {
  const [activeTab, setActiveTab] = useState('الرئيسية');

  const categories = ['الكل', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];

  const brandColor = customization?.brandColor || '#8b5a2b';
  const isEn = customization?.defaultLanguage === 'en';
  const isSticky = customization?.isHeaderSticky !== false;
  const showTrust = customization?.showTrustFeatures !== false;
  const showBanner = customization?.showHeroBanner !== false;
  const announcement = customization?.announcementText || 'لوفتورا — تشكيلة الديكور الإسكندنافي المعاصر • شحن آمن مع شركة الزعيم لكافة المحافظات';
  const heroTitle = customization?.heroTitle || (isEn ? 'Nordic Living & Warm Oak' : 'دفء الخشب وأناقة الديكور الإسكندنافي');
  const heroSubtitle = customization?.heroSubtitle || (isEn ? 'Crafted furniture and ceramic decor designed to create tranquil, inspiring living spaces' : 'قطع ديكور وأثاث من خشب البلوط الطبيعي والألوان الطينية الهادئة تمنح منزلك سكينة استثنائية.');
  const heroBtnText = customization?.heroButtonText || (isEn ? 'Explore Pieces' : 'تصفح التشكيلة');
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
      className="min-h-screen bg-[#faf8f5] text-[#2b2927] font-sans antialiased selection:bg-[#8b5a2b] selection:text-white"
      dir={isEn ? 'ltr' : 'rtl'}
    >
      
      {/* 1. Top Announcement Bar */}
      {customization?.showAnnouncement !== false && (
        <div className="bg-[#2b2927] text-[#e8dfd5] text-[11px] font-bold py-2 px-4 md:px-8 text-center">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <span className="mx-auto sm:mx-0">{announcement}</span>
            <div className="hidden sm:flex items-center gap-4 text-xs font-semibold text-[#d4b996]">
              <span>{isEn ? 'Secure Freight Packaging' : 'تغليف آمن ضد الكسر'}</span>
              <span>|</span>
              <span>{isEn ? 'Pay on Delivery' : 'معاينة الأثاث عند الاستلام'}</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. Header (Matching Screenshot 2 Loftora) */}
      <header className={`bg-white/95 backdrop-blur-md border-b border-[#ebdcd0] ${isSticky ? 'sticky top-0' : 'relative'} z-40 shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            {logoUrl ? (
              <img src={logoUrl} alt={storeName} className="h-10 w-auto max-w-[140px] object-contain" />
            ) : (
              <div className="flex items-center gap-2.5">
                <div
                  className="size-10 rounded-xl text-white font-black grid place-items-center text-lg shadow-sm"
                  style={{ backgroundColor: brandColor }}
                >
                  <Home className="size-5" />
                </div>
                <div>
                  <h1 className="font-extrabold text-xl text-[#2b2927] tracking-tight">{storeName}</h1>
                  <span className="text-[10px] font-mono text-[#8b5a2b] dir-ltr block mt-0.5">{fullDomain}</span>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-[#5c544d]">
            {['الرئيسية', 'كراسي وطاولات', 'إضاءة خشبية', 'أحواض ونباتات', 'مرايا وجداريات', 'تخفيضات'].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setActiveTab(item)}
                className={`py-1 transition-all hover:text-[#8b5a2b] relative ${
                  activeTab === item ? 'text-[#8b5a2b] font-black' : ''
                }`}
              >
                {item}
                {activeTab === item && (
                  <span className="absolute -bottom-2 right-0 left-0 h-0.5 bg-[#8b5a2b] rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Search & Actions */}
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block w-56">
              <Search className={`absolute ${isEn ? 'left-3.5' : 'right-3.5'} top-2.5 size-4 text-[#a39485]`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={isEn ? 'Search decor...' : 'ابحث عن قطعة أثاث...'}
                className={`w-full h-9 ${isEn ? 'pl-10 pr-4' : 'pr-10 pl-4'} rounded-xl border border-[#ebdcd0] bg-[#faf8f5] text-xs text-[#2b2927] placeholder:text-[#a39485] focus:outline-none focus:border-[#8b5a2b]`}
              />
            </div>

            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('loftora-grid');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-white font-black text-xs shadow-sm transition-all hover:scale-105"
              style={{ backgroundColor: brandColor }}
            >
              <ShoppingBag className="size-4" />
              <span>{isEn ? 'Cart' : 'السلة'} ({cartCount})</span>
            </button>
          </div>
        </div>
      </header>

      {/* 3. Hero Section (Matching Screenshot 2 Loftora: Warm Oak Living Room Scene) */}
      {showBanner && (
        <section className="max-w-7xl mx-auto px-4 md:px-8 mt-6">
          <div className="rounded-3xl overflow-hidden bg-[#f0eae1] border border-[#ebdcd0] relative shadow-sm flex flex-col md:flex-row items-center justify-between min-h-[340px]">
            
            {/* Left Image: Scandinavian Living Room */}
            <div className="w-full md:w-1/2 h-72 md:h-[360px] relative overflow-hidden order-2 md:order-1">
              <img
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900&auto=format&fit=crop&q=80"
                alt="Loftora Oak Living Room"
                className="size-full object-cover object-center hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-[#f0eae1] via-transparent to-transparent" />
            </div>

            {/* Right Text Content */}
            <div className="w-full md:w-1/2 p-8 md:p-12 text-right space-y-4 relative z-10 order-1 md:order-2">
              <span className="px-3 py-1 rounded-lg text-xs font-black bg-[#8b5a2b] text-white inline-block">
                {isEn ? 'Scandinavian Oak Decor' : 'ديكور منزلي مختار — طين وبلوط'}
              </span>
              <h1 className="text-3xl md:text-5xl font-black text-[#2b2927] leading-tight">
                {heroTitle}
              </h1>
              <p className="text-xs md:text-sm text-[#5c544d] leading-relaxed font-medium">
                {heroSubtitle}
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('loftora-grid');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-3 rounded-xl text-white font-black text-xs shadow-md transition-all hover:scale-105 flex items-center gap-2"
                  style={{ backgroundColor: brandColor }}
                >
                  <span>{heroBtnText}</span>
                  <ArrowLeft className={`size-4 ${isEn ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>

          </div>
        </section>
      )}

      {/* 4. Section Title (أبرز المجموعات matching Screenshot 2) */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mt-10">
        <div className="text-center space-y-1 mb-8">
          <h2 className="text-2xl md:text-3xl font-black text-[#2b2927]">
            {isEn ? 'Featured Collections' : 'أبرز المجموعات'}
          </h2>
          <p className="text-xs text-[#8b5a2b] font-medium">
            {isEn ? 'Nordic craftsmanship and timeless home aesthetics' : 'لمسة البلوط، الخزف، والألوان الترابية الهادئة'}
          </p>
        </div>
      </section>

      {/* 5. Products Grid */}
      <section id="loftora-grid" className="max-w-7xl mx-auto px-4 md:px-8 mb-16">
        <div className={`grid ${getColsClass()} gap-6`}>
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className="bg-white border border-[#ebdcd0] rounded-3xl overflow-hidden hover:shadow-xl hover:border-[#8b5a2b] transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="h-64 bg-[#f8f5f0] relative overflow-hidden flex items-center justify-center p-4">
                  <img
                    src={p.imageUrl || '/templates/store-classic.jpg'}
                    alt={p.name}
                    className="size-full object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                  {showDiscount && p.compareAtPrice && (
                    <span className="absolute top-3 right-3 text-[10px] font-black bg-[#8b5a2b] text-white px-2.5 py-1 rounded-lg shadow-sm">
                      {isEn ? 'SALE' : 'تخفيض'}
                    </span>
                  )}
                  {showStock && (
                    <span className="absolute bottom-3 left-3 text-[9px] font-black bg-white/95 text-[#2b2927] px-2 py-0.5 rounded-md shadow-sm">
                      {isEn ? 'Natural Oak' : 'خشب طبيعي'}
                    </span>
                  )}
                  <span className="absolute bottom-3 right-3 text-[10px] font-bold bg-[#2b2927]/80 text-white px-2.5 py-0.5 rounded-md">
                    {p.category}
                  </span>
                </div>

                <div className="p-5 text-right space-y-1.5">
                  <h4 className="font-black text-sm text-[#2b2927] line-clamp-1 group-hover:text-[#8b5a2b] transition-colors">
                    {p.name}
                  </h4>
                  <p className="text-xs text-[#70675e] line-clamp-2 leading-relaxed">
                    {p.description || 'قطعة أثاث راقية مصممة بعناية مع توصيل آمن وفحص قبل الاستلام.'}
                  </p>

                  {urgencyTicker && (
                    <div className="pt-1 text-[10px] font-bold text-[#8b5a2b] flex items-center gap-1">
                      <Sparkles className="size-3" />
                      <span>{isEn ? 'Limited stock edition' : 'إصدار محدود • مصنوع يدوياً'}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-5 border-t border-[#f2ede6] bg-[#fcfbfa] flex items-center justify-between">
                <div>
                  <span className="text-base font-black font-mono text-[#2b2927] block">
                    {formatIQD(p.price)}
                  </span>
                  {p.compareAtPrice && (
                    <span className="text-xs text-[#a39485] line-through font-mono">
                      {formatIQD(p.compareAtPrice)}
                    </span>
                  )}
                </div>

                {enableQuick && (
                  <button
                    type="button"
                    onClick={() => onQuickBuy(p)}
                    className="px-4 py-2 rounded-xl text-xs font-black text-white shadow-sm flex items-center gap-1 transition-all hover:scale-105"
                    style={{ backgroundColor: brandColor }}
                  >
                    <span>{isEn ? 'Order' : 'طلب'}</span>
                    <ArrowLeft className={`size-3 ${isEn ? 'rotate-180' : ''}`} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Footer */}
      <footer className="bg-[#1f1d1b] text-[#d4b996] py-10 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>{copyright}</p>
          {showBadges && (
            <div className="flex items-center gap-3 font-bold text-white text-xs">
              <span className="px-2.5 py-1 rounded bg-white/10">شحن آمن للأثاث</span>
              <span className="px-2.5 py-1 rounded bg-white/10">معاينة قبل الدفع</span>
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
        <div
          className="fixed bottom-0 inset-x-0 text-white px-4 py-3 z-30 shadow-2xl flex items-center justify-between"
          style={{ backgroundColor: brandColor }}
        >
          <div className="flex items-center gap-3">
            <ShoppingBag className="size-4" />
            <span className="text-xs font-bold">
              {isEn ? `${cartCount} items in cart` : `لديك ${cartCount} قطع ديكور في السلة`}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('loftora-grid');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-4 py-1.5 rounded-lg bg-white text-[#2b2927] font-black text-xs hover:bg-[#faf8f5] transition-colors"
          >
            {isEn ? 'Checkout' : 'إتمام الطلب'}
          </button>
        </div>
      )}

    </div>
  );
}

export default StoreLoftoraTheme;
