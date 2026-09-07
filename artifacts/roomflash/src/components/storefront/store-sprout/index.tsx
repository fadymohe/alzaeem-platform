import React, { useState } from 'react';
import {
  ShoppingBag, Search, Heart, User, ArrowLeft, ArrowRight,
  Truck, ShieldCheck, Sparkles, Star, ChevronDown, CheckCircle2,
  PhoneCall, Baby, Leaf, Sun, Flower2, HeartHandshake, MessageCircle
} from 'lucide-react';
import { formatIQD } from '../../../data/iraqData';
import type { StoreProduct } from '../../../data/storeState';
import type { ThemeComponentProps } from '../store-classic';

export function StoreSproutTheme({
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

  const brandColor = customization?.brandColor || '#588157';
  const isEn = customization?.defaultLanguage === 'en';
  const isSticky = customization?.isHeaderSticky !== false;
  const showTrust = customization?.showTrustFeatures !== false;
  const showBanner = customization?.showHeroBanner !== false;
  const announcement = customization?.announcementText || 'أزياء ومستلزمات أطفال طبيعية 100% • قطن عضوي آمن وتوصيل لكافة محافظات العراق';
  const heroTitle = customization?.heroTitle || (isEn ? 'Pure Softness for Little Ones' : 'أناقة ناعمة وراحة تدوم لطفلك الصغير');
  const heroSubtitle = customization?.heroSubtitle || (isEn ? 'Organic fabrics and playful designs with safe inspection before payment' : 'خامات قطنية فائقة النعومة وتصاميم بروح البهجة، نوفرها لك مع ميزة فحص الشحنة قبل الاستلام.');
  const heroBtnText = customization?.heroButtonText || (isEn ? 'Shop Collection' : 'تسوق التشكيلة الآن');
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
      className="min-h-screen bg-[#f7f6f2] text-[#333d29] font-sans antialiased selection:bg-[#588157] selection:text-white"
      dir={isEn ? 'ltr' : 'rtl'}
    >
      
      {/* 1. Top Olive Announcement Bar */}
      {customization?.showAnnouncement !== false && (
        <div className="bg-[#435135] text-[#e9edc9] text-xs py-2 px-4 md:px-8 shadow-sm">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 font-bold">
                <Leaf className="size-3.5 text-[#ccd5ae]" />
                <span>{announcement}</span>
              </span>
            </div>
            <div className="flex items-center gap-4 text-[11px] font-semibold text-[#fefae0]">
              <span>{isEn ? '🌿 100% Organic Quality' : '🌿 خامات طبيعية آمنة للبشرة'}</span>
              <span className="hidden sm:inline">|</span>
              <a href="tel:+9647700000000" className="hover:underline flex items-center gap-1">
                <PhoneCall className="size-3 text-[#ccd5ae]" />
                <span>+964 770 000 0000</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 2. Main Header */}
      <header className={`bg-white/95 backdrop-blur-md border-b border-[#e0ddcf] ${isSticky ? 'sticky top-0' : 'relative'} z-40 shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            {logoUrl ? (
              <img src={logoUrl} alt={storeName} className="h-10 w-auto max-w-[150px] object-contain rounded-xl border border-[#ccd5ae]" />
            ) : (
              <div className="flex items-center gap-2.5">
                <div
                  className="size-11 rounded-2xl text-white font-black grid place-items-center text-xl shadow-md"
                  style={{ backgroundColor: brandColor }}
                >
                  <Baby className="size-6" />
                </div>
                <div>
                  <span className="font-extrabold text-xl text-[#344e41] tracking-tight">{storeName}</span>
                  <span className="text-[10px] font-mono text-[#588157] dir-ltr block mt-0.5">
                    {fullDomain}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Dynamic Navigation Links strictly from real categories */}
          <nav className="hidden lg:flex items-center gap-4 text-xs font-black text-[#3a5a40]">
            {categories.slice(0, 6).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  onSelectCategory(cat);
                  setActiveTab(cat);
                }}
                className={`py-1 transition-all hover:text-[#588157] relative ${
                  selectedCategory === cat ? 'text-[#588157] font-black' : ''
                }`}
              >
                {cat}
                {selectedCategory === cat && (
                  <span className="absolute -bottom-2 right-0 left-0 h-0.5 bg-[#588157] rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Search & Actions */}
          <div className="flex items-center gap-2.5">
            <div className="relative hidden sm:block w-48 lg:w-56">
              <Search className={`absolute ${isEn ? 'left-3.5' : 'right-3.5'} top-2.5 size-4 text-[#8b9b77]`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={isEn ? 'Search products...' : 'ابحث في المتجر...'}
                className={`w-full h-9 ${isEn ? 'pl-10 pr-4' : 'pr-10 pl-4'} rounded-full border border-[#ccd5ae] bg-[#f7f6f2] text-xs text-[#344e41] placeholder:text-[#99a888] focus:outline-none focus:border-[#588157] focus:bg-white`}
              />
            </div>

            {/* Customer Auth / Account Button */}
            <button
              type="button"
              onClick={() => onOpenCustomerAuth?.()}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-[#ccd5ae] bg-white text-[#344e41] font-bold text-xs shadow-sm hover:bg-[#f1f3ec] transition-all"
              title="حسابي / تسجيل الدخول"
            >
              <User className="size-4" />
              <span className="hidden sm:inline">
                {currentCustomer ? currentCustomer.name : (isEn ? 'Sign In' : 'دخول')}
              </span>
            </button>

            {/* Cart Button */}
            <button
              type="button"
              onClick={() => onOpenCart?.()}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-white font-extrabold text-xs shadow-md transition-all hover:scale-105"
              style={{ backgroundColor: brandColor }}
            >
              <ShoppingBag className="size-4" />
              <span>{isEn ? 'Cart' : 'السلة'} ({cartCount})</span>
            </button>
          </div>
        </div>
      </header>

      {/* 3. Hero Collage Section (Matching Screenshot 3 Sprout: Cuddle Plush Toy + Velvet Dress) */}
      {showBanner && (
        <section className="max-w-7xl mx-auto px-4 md:px-8 mt-6">
          <div className="rounded-3xl overflow-hidden bg-gradient-to-r from-[#e9ece3] via-[#f1f3ec] to-[#e4e8dc] border border-[#ccd5ae] relative shadow-sm min-h-[360px] flex flex-col md:flex-row items-center justify-between">
            
            {/* Left Image Collage: Adorable Deer Plush Toy on Cream Rug */}
            <div className="w-full md:w-1/2 h-72 md:h-[380px] relative overflow-hidden order-2 md:order-1 flex items-center justify-center p-6">
              <img
                src="https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=800&auto=format&fit=crop&q=80"
                alt="Sprout Plush Cuddle Deer"
                className="max-h-[320px] w-auto object-contain rounded-2xl drop-shadow-xl hover:scale-105 transition-transform duration-700"
              />
            </div>

            {/* Right Text Content */}
            <div className="w-full md:w-1/2 p-8 md:p-12 text-right space-y-4 relative z-10 order-1 md:order-2">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black bg-[#435135] text-[#fefae0] shadow-sm">
                <Flower2 className="size-3.5 text-[#ccd5ae]" />
                {isEn ? 'Sprout Organic Kids Collection' : 'تشكيلة سبراوت الطبيعية للأطفال'}
              </span>
              <h1 className="text-3xl md:text-5xl font-extrabold text-[#344e41] leading-tight tracking-tight">
                {heroTitle}
              </h1>
              <p className="text-xs md:text-sm text-[#588157] leading-relaxed font-medium">
                {heroSubtitle}
              </p>
              <div className="pt-3 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('sprout-grid');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-7 py-3.5 rounded-full text-white font-black text-xs shadow-md transition-transform hover:scale-105 flex items-center gap-2"
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

      {/* 4. Category Title */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mt-10">
        <div className="text-center space-y-1 mb-8">
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#344e41]">
            {isEn ? 'Featured Baby & Kids Products' : 'أبرز المنتجات ومستلزمات الأطفال'}
          </h2>
          <p className="text-xs text-[#588157] font-medium">
            {isEn ? 'Natural organic outfits, soft cuddle plushies and delicate dresses' : 'ملابس أطفال بروح الحديقة — زيتوني وعاجي وقطع مميزة'}
          </p>
        </div>
      </section>

      {/* 5. Products Grid */}
      <section id="sprout-grid" className="max-w-7xl mx-auto px-4 md:px-8 mb-16">
        <div className={`grid ${getColsClass()} gap-6`}>
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className="bg-white border border-[#e0ddcf] rounded-3xl overflow-hidden hover:shadow-xl hover:border-[#588157] transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div
                  onClick={() => onOpenProductDetail?.(p)}
                  className="h-64 bg-[#f8f9f6] relative overflow-hidden flex items-center justify-center p-4 cursor-pointer"
                >
                  <img
                    src={p.imageUrl || 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=700&auto=format&fit=crop&q=80'}
                    alt={p.name}
                    className="size-full object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                  {showDiscount && p.compareAtPrice && (
                    <span className="absolute top-3 right-3 text-[10px] font-black bg-[#588157] text-white px-2.5 py-1 rounded-full shadow-sm">
                      {isEn ? 'OFFER' : 'تخفيض'}
                    </span>
                  )}
                  {showStock && (
                    <span className="absolute bottom-3 left-3 text-[9px] font-black bg-white/90 text-[#344e41] px-2.5 py-0.5 rounded-full shadow-sm">
                      {isEn ? 'Organic Quality' : 'جودة مضمونة'}
                    </span>
                  )}
                  <span className="absolute bottom-3 right-3 text-[10px] font-bold bg-[#344e41]/80 text-white px-2.5 py-0.5 rounded-full">
                    {p.category}
                  </span>
                </div>

                <div className="p-5 text-right space-y-1.5">
                  <h4
                    onClick={() => onOpenProductDetail?.(p)}
                    className="font-extrabold text-sm text-[#344e41] line-clamp-1 group-hover:text-[#588157] transition-colors cursor-pointer"
                  >
                    {p.name}
                  </h4>
                  <p className="text-xs text-[#606c38] line-clamp-2 leading-relaxed">
                    {p.description || 'قطعة أطفال فائقة النعومة من القطن الطبيعي مع فحص قبل الاستلام.'}
                  </p>

                  {urgencyTicker && (
                    <div className="pt-1 text-[10px] font-bold text-[#588157] flex items-center gap-1">
                      <Sparkles className="size-3" />
                      <span>{isEn ? 'Loved by parents • High comfort' : 'محبوب من الأمهات • راحة قصوى'}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-5 border-t border-[#f0eee6] bg-[#faf9f6] flex items-center justify-between gap-2">
                <div>
                  <span className="text-base font-black font-mono text-[#344e41] block">
                    {formatIQD(p.price)}
                  </span>
                  {p.compareAtPrice && (
                    <span className="text-xs text-[#a3b18a] line-through font-mono">
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
                    className="p-2 rounded-full border border-[#ccd5ae] text-[#344e41] hover:bg-[#f1f3ec] transition-colors"
                    title="أضف إلى السلة"
                  >
                    <ShoppingBag className="size-3.5" />
                  </button>

                  {enableQuick && (
                    <button
                      type="button"
                      onClick={() => onQuickBuy(p)}
                      className="px-3.5 py-2 rounded-full text-xs font-black text-white shadow-sm flex items-center gap-1 transition-all hover:scale-105"
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
      <footer className="bg-[#283618] text-[#dda15e] py-10 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>{copyright}</p>
          {showBadges && (
            <div className="flex items-center gap-3 font-bold text-[#fefae0] text-xs">
              <span className="px-2.5 py-1 rounded bg-white/10">دفع عند الاستلام</span>
              <span className="px-2.5 py-1 rounded bg-white/10">شحن آمن مع شركة الزعيم</span>
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
              {isEn ? `${cartCount} items in cart` : `لديك ${cartCount} قطع للأطفال في السلة`}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('sprout-grid');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-4 py-1.5 rounded-full bg-white text-[#344e41] font-black text-xs hover:bg-[#f7f6f2] transition-colors"
          >
            {isEn ? 'Checkout' : 'إتمام الطلب'}
          </button>
        </div>
      )}

    </div>
  );
}

export default StoreSproutTheme;
