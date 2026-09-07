import React, { useState } from 'react';
import {
  ShoppingBag, Search, Heart, User, ArrowLeft, ArrowRight,
  Truck, ShieldCheck, Sparkles, Star, ChevronDown, CheckCircle2,
  PhoneCall, Crown, Eye, Sparkle, MessageCircle
} from 'lucide-react';
import { formatIQD } from '../../../data/iraqData';
import type { StoreProduct } from '../../../data/storeState';
import type { ThemeComponentProps } from '../store-classic';

export function StoreChicTheme({
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

  const brandColor = customization?.brandColor || '#540b0e';
  const isEn = customization?.defaultLanguage === 'en';
  const isSticky = customization?.isHeaderSticky !== false;
  const showTrust = customization?.showTrustFeatures !== false;
  const showBanner = customization?.showHeroBanner !== false;
  const announcement = customization?.announcementText || 'CHIC BOUTIQUE — إطلالات صيفية راقية • شحن مجاني للطلبات فوق 50,000 د.ع';
  const heroTitle = customization?.heroTitle || (isEn ? 'Everyday Luxury & Refined Style' : 'فخامة كل يوم');
  const heroSubtitle = customization?.heroSubtitle || (isEn ? 'Curated magazine-style boutique collections crafted in delicate silks and tailored cottons' : 'واجهة بوتيك مستوحاة من كبريات مجلات الموضة مع أقمشة قطنية وحريرية منتقاة بعناية.');
  const heroBtnText = customization?.heroButtonText || (isEn ? 'Shop Collection' : 'تسوقي الآن');
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
      className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-[#540b0e] selection:text-white"
      dir={isEn ? 'ltr' : 'rtl'}
    >
      
      {/* 1. Top Chic Announcement Bar */}
      {customization?.showAnnouncement !== false && (
        <div className="bg-[#540b0e] text-white text-[11px] font-bold py-2 px-4 md:px-8 text-center shadow-sm">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <span className="mx-auto sm:mx-0 tracking-wider">
              {announcement}
            </span>
            <div className="hidden sm:flex items-center gap-4 text-xs font-semibold text-pink-200">
              <span>{isEn ? 'COD Available' : 'دفع عند الاستلام مع فحص القياس'}</span>
              <span>|</span>
              <span>{isEn ? 'Boutique Guarantee' : 'ضمان جودة الأقمشة'}</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. Header (Matching Screenshot 3 Chic: Elegant Minimalist Serif Logo) */}
      <header className={`bg-white border-b border-slate-200 ${isSticky ? 'sticky top-0' : 'relative'} z-40 shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            {logoUrl ? (
              <img src={logoUrl} alt={storeName} className="h-10 w-auto max-w-[140px] object-contain" />
            ) : (
              <div className="flex items-center gap-2">
                <h1 className="font-serif font-black text-2xl tracking-tight text-black italic">
                  {storeName === 'متجر الزعيم' ? 'Chic' : storeName}
                </h1>
                <span className="text-[10px] font-mono text-slate-400 dir-ltr block mt-0.5">{fullDomain}</span>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-bold uppercase tracking-wider text-slate-700">
            {['الرئيسية', 'تسوقي', 'Celeste Charm', 'Top', 'activewear', 'croptop', 'التخفيضات'].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setActiveTab(item)}
                className={`py-1 transition-colors hover:text-black ${
                  activeTab === item ? 'text-black font-black border-b-2 border-black' : ''
                }`}
              >
                {item}
              </button>
            ))}
          </nav>

          {/* Search & Actions */}
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block w-56">
              <Search className={`absolute ${isEn ? 'left-3' : 'right-3'} top-2.5 size-3.5 text-slate-400`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={isEn ? 'Search fashion...' : 'ابحثي عن قطعة...'}
                className={`w-full h-8 ${isEn ? 'pl-9 pr-3' : 'pr-9 pl-3'} border border-slate-300 rounded-lg text-xs bg-slate-50 focus:outline-none focus:border-black focus:bg-white`}
              />
            </div>

            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('chic-grid');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-black text-xs shadow-sm transition-all hover:scale-105"
              style={{ backgroundColor: brandColor }}
            >
              <ShoppingBag className="size-3.5" />
              <span>{isEn ? 'Cart' : 'السلة'} ({cartCount})</span>
            </button>
          </div>
        </div>
      </header>

      {/* 3. Editorial Split Hero Banner (Matching Screenshot 3 Chic: Woman in Sunhat by the sea + Linen Top Model) */}
      {showBanner && (
        <section className="max-w-7xl mx-auto px-4 md:px-8 mt-6">
          <div className="rounded-3xl overflow-hidden bg-black text-white relative shadow-xl min-h-[380px] flex flex-col md:flex-row items-center justify-between">
            
            {/* Left Image: Woman with Straw Sunhat by the Sea */}
            <div className="w-full md:w-1/2 h-80 md:h-[420px] relative overflow-hidden order-2 md:order-1">
              <img
                src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&auto=format&fit=crop&q=80"
                alt="Chic Luxury Boutique Model"
                className="size-full object-cover object-top hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-black/80 via-transparent to-transparent" />
            </div>

            {/* Right Text Content */}
            <div className="w-full md:w-1/2 p-8 md:p-14 text-right space-y-4 relative z-10 order-1 md:order-2">
              <span className="px-3.5 py-1.5 rounded-full text-xs font-black bg-white/20 text-white backdrop-blur-sm inline-block">
                MIAMI BEACH EST. 1994
              </span>
              <h1 className="text-3xl md:text-5xl font-serif font-black text-white leading-tight italic">
                {heroTitle}
              </h1>
              <p className="text-xs md:text-sm text-slate-300 font-medium leading-relaxed">
                {heroSubtitle}
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('chic-grid');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-8 py-3.5 rounded-xl bg-white text-black font-black text-xs shadow-lg transition-transform hover:scale-105 flex items-center gap-2"
                >
                  <span>{heroBtnText}</span>
                  <ArrowLeft className={`size-4 ${isEn ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>

          </div>
        </section>
      )}

      {/* 4. Section Title (الأكثر مبيعاً matching Screenshot 3 Chic) */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mt-10">
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-200">
          <div>
            <h2 className="font-serif font-black text-2xl text-black">
              {isEn ? 'Best Sellers' : 'الأكثر مبيعاً'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEn ? 'Exclusive high-fashion boutique pieces' : 'إطلالات نسائية راقية ومختارة بعناية'}
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
            {filteredProducts.length} {isEn ? 'Items' : 'قطعة'}
          </span>
        </div>
      </section>

      {/* 5. Products Grid */}
      <section id="chic-grid" className="max-w-7xl mx-auto px-4 md:px-8 mb-16">
        <div className={`grid ${getColsClass()} gap-6`}>
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:border-black"
            >
              <div>
                <div className="h-72 bg-slate-100 relative overflow-hidden">
                  <img
                    src={p.imageUrl || '/templates/store-nova.jpg'}
                    alt={p.name}
                    className="size-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {showDiscount && p.compareAtPrice && (
                    <span className="absolute top-2.5 right-2.5 text-[10px] font-black bg-[#540b0e] text-white px-2 py-0.5 rounded shadow-sm">
                      {isEn ? 'SALE' : 'تخفيض'}
                    </span>
                  )}
                  {showStock && (
                    <span className="absolute bottom-2.5 left-2.5 text-[9px] font-black bg-white/95 text-slate-800 px-2 py-0.5 rounded shadow-sm">
                      {isEn ? 'In Stock' : 'متوفر'}
                    </span>
                  )}
                  <span className="absolute bottom-2.5 right-2.5 text-[10px] font-bold bg-black/80 text-white px-2 py-0.5 rounded backdrop-blur-sm">
                    {p.category}
                  </span>
                </div>

                <div className="p-4 text-right space-y-1">
                  <h4 className="font-black text-sm text-black line-clamp-1 group-hover:underline">
                    {p.name}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {p.description || 'قطعة ملابس كلاسيكية راقية مع شحن سريع ومعاينة قبل الاستلام.'}
                  </p>

                  {urgencyTicker && (
                    <div className="pt-1 text-[10px] font-bold text-[#540b0e] flex items-center gap-1">
                      <Sparkles className="size-3" />
                      <span>{isEn ? 'Boutique favorite' : 'القطعة الأكثر طلباً هذا الموسم'}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                <div>
                  <span className="text-sm font-black font-mono text-black block">
                    {formatIQD(p.price)}
                  </span>
                  {p.compareAtPrice && (
                    <span className="text-[11px] text-slate-400 line-through font-mono">
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
                    <span>{isEn ? 'Quick Buy' : 'شراء فوري'}</span>
                    <ArrowLeft className={`size-3 ${isEn ? 'rotate-180' : ''}`} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Footer */}
      <footer className="bg-slate-900 text-slate-400 py-10 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>{copyright}</p>
          {showBadges && (
            <div className="flex items-center gap-3 font-bold text-white text-xs">
              <span className="px-2.5 py-1 rounded bg-white/10">الدفع عند الاستلام</span>
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
              {isEn ? `${cartCount} pieces in cart` : `لديك ${cartCount} قطع بوتيك في السلة`}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('chic-grid');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-4 py-1.5 rounded-lg bg-white text-black font-black text-xs hover:bg-pink-50 transition-colors"
          >
            {isEn ? 'Checkout' : 'إتمام الطلب'}
          </button>
        </div>
      )}

    </div>
  );
}

export default StoreChicTheme;
