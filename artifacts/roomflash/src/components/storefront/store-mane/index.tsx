import React, { useState } from 'react';
import {
  ShoppingBag, Search, Heart, User, ArrowLeft, ArrowRight,
  Truck, ShieldCheck, Sparkles, Star, ChevronDown, CheckCircle2,
  PhoneCall, Sparkle, Wand2, Eye, MessageCircle
} from 'lucide-react';
import { formatIQD } from '../../../data/iraqData';
import type { StoreProduct } from '../../../data/storeState';
import type { ThemeComponentProps } from '../store-classic';

export function StoreManeTheme({
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

  const brandColor = customization?.brandColor || '#6b0f24';
  const isEn = customization?.defaultLanguage === 'en';
  const isSticky = customization?.isHeaderSticky !== false;
  const showTrust = customization?.showTrustFeatures !== false;
  const showBanner = customization?.showHeroBanner !== false;
  const announcement = customization?.announcementText || (isEn ? 'Signature Salon & Clinical Skincare — Fast delivery across all Iraqi governorates' : 'مستحضرات صالون وعناية متقدمة — توصيل سريع لجميع محافظات العراق والدفع عند الاستلام');
  const heroTitle = customization?.heroTitle || (isEn ? 'Signature Beauty & Salon Care' : 'أبرز المجموعات والعناية المتكاملة');
  const heroSubtitle = customization?.heroSubtitle || (isEn ? 'Clinical formulas & natural essences crafted for radiant skin & revitalized hair' : 'تركيبات علاجية ومستخلصات نقية تمنح بشرتك وشعرك النضارة والإشراقة الدائمة.');
  const heroBtnText = customization?.heroButtonText || (isEn ? 'Explore Collection' : 'تسوق التشكيلة');
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
      className="min-h-screen bg-[#faf5f6] text-slate-900 font-sans antialiased selection:bg-[#6b0f24] selection:text-white"
      dir={isEn ? 'ltr' : 'rtl'}
    >
      
      {/* 1. Top Announcement Bar */}
      {customization?.showAnnouncement !== false && (
        <div className="bg-[#540b0e] text-pink-100 text-[11px] font-bold py-2 px-4 md:px-8 text-center shadow-sm">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 mx-auto sm:mx-0">
              <Sparkles className="size-3.5 text-pink-300" />
              <span>{announcement}</span>
            </span>
            <div className="hidden sm:flex items-center gap-4 text-xs font-bold text-pink-200">
              <span>{isEn ? 'COD Available' : 'دفع عند الاستلام'}</span>
              <span>|</span>
              <span>{isEn ? '100% Authentic' : 'ضمان الأصالة والجودة'}</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. Deep Burgundy Header */}
      <header
        className={`${isSticky ? 'sticky top-0' : 'relative'} z-40 shadow-md text-white`}
        style={{ backgroundColor: brandColor }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            {logoUrl ? (
              <img src={logoUrl} alt={storeName} className="h-10 w-auto max-w-[140px] object-contain rounded-xl border border-white/20 bg-white/10" />
            ) : (
              <div className="flex items-center gap-2.5">
                <div className="size-10 rounded-2xl bg-white/20 text-white font-black grid place-items-center text-lg backdrop-blur-sm">
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

          {/* Navigation Categories */}
          <nav className="hidden lg:flex items-center gap-4 text-xs font-bold text-pink-100">
            {categories.slice(0, 6).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => onSelectCategory(cat === 'الكل' ? 'all' : cat)}
                className={`py-1 px-3 rounded-full transition-all hover:bg-white/15 relative ${
                  (selectedCategory === cat || (cat === 'الكل' && (!selectedCategory || selectedCategory === 'all'))) ? 'bg-white text-[#6b0f24] font-black' : ''
                }`}
              >
                {cat}
              </button>
            ))}
          </nav>

          {/* Search & Actions */}
          <div className="flex items-center gap-2.5">
            <div className="relative hidden sm:block w-48">
              <Search className={`absolute ${isEn ? 'left-3' : 'right-3'} top-2.5 size-3.5 text-pink-200`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={isEn ? 'Search...' : 'ابحث عن منتج...'}
                className={`w-full h-8 ${isEn ? 'pl-9 pr-3' : 'pr-9 pl-3'} rounded-full border border-white/20 bg-white/10 text-xs text-white placeholder:text-pink-200/60 focus:outline-none focus:bg-white/20`}
              />
            </div>

            {/* Customer Account Button */}
            {onOpenCustomerAuth && (
              <button
                type="button"
                onClick={onOpenCustomerAuth}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/30 text-white font-bold text-xs hover:bg-white/15 transition-all"
                title={isEn ? 'Account' : 'حسابي / طلباتي'}
              >
                <User className="size-3.5" />
                <span className="hidden md:inline">{isEn ? 'Account' : 'حسابي'}</span>
              </button>
            )}

            {/* Cart Button */}
            <button
              type="button"
              onClick={() => {
                if (onOpenCart) {
                  onOpenCart();
                } else {
                  const el = document.getElementById('mane-grid');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-[#6b0f24] font-black text-xs shadow-md transition-all hover:scale-105"
            >
              <ShoppingBag className="size-3.5" />
              <span>{isEn ? 'Cart' : 'السلة'} ({cartCount})</span>
            </button>
          </div>
        </div>
      </header>

      {/* 3. Hero Section (Matching Screenshot 2 Mane) */}
      {showBanner && (
        <section className="max-w-7xl mx-auto px-4 md:px-8 mt-5">
          <div className="text-center space-y-2 py-4">
            <h2 className="text-2xl md:text-4xl font-black text-[#540b0e]">
              {isEn ? 'Featured Collections' : 'أبرز المجموعات'}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              {isEn ? 'Radiance and clinical nourishment for your skin' : 'مستحضرات صالون وعناية متقدمة بأعلى معايير النقاء'}
            </p>
          </div>
        </section>
      )}

      {/* 4. Products Grid */}
      <section id="mane-grid" className="max-w-7xl mx-auto px-4 md:px-8 mb-16">
        <div className={`grid ${getColsClass()} gap-6`}>
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className="bg-white border border-pink-100 rounded-3xl overflow-hidden hover:shadow-xl hover:border-[#6b0f24]/40 transition-all duration-300 flex flex-col justify-between group"
            >
              <div
                className="cursor-pointer"
                onClick={() => onOpenProductDetail ? onOpenProductDetail(p) : onQuickBuy(p)}
              >
                <div className="h-72 bg-gradient-to-b from-[#f9f2f4] to-white relative overflow-hidden flex items-center justify-center p-4">
                  <img
                    src={p.imageUrl || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=700&auto=format&fit=crop&q=80'}
                    alt={p.name}
                    className="size-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
                  />
                  {showDiscount && p.compareAtPrice && (
                    <span className="absolute top-3 right-3 text-[10px] font-black bg-[#6b0f24] text-white px-2.5 py-1 rounded-full shadow-sm">
                      {isEn ? 'PROMO' : 'خصم'}
                    </span>
                  )}
                  {showStock && (
                    <span className="absolute bottom-3 left-3 text-[9px] font-black bg-white/90 text-slate-700 px-2.5 py-0.5 rounded-full shadow-sm">
                      {isEn ? 'Genuine Stock' : 'أصلي 100%'}
                    </span>
                  )}
                  <span className="absolute bottom-3 right-3 text-[10px] font-bold bg-pink-100 text-[#6b0f24] px-2.5 py-0.5 rounded-full">
                    {p.category}
                  </span>
                </div>

                <div className="p-5 text-right space-y-1.5">
                  <h4 className="font-black text-sm text-slate-900 line-clamp-1 group-hover:text-[#6b0f24] transition-colors">
                    {p.name}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {p.description || 'مستحضر فاخر للعناية الفائقة مع ضمان الأصالة والتسليم السريع.'}
                  </p>

                  {urgencyTicker && (
                    <div className="pt-1 text-[10px] font-bold text-pink-700 flex items-center gap-1">
                      <Sparkle className="size-3 text-pink-600" />
                      <span>{isEn ? 'Trending item • Dermatologist tested' : 'الأكثر طلباً • تم اختباره سريرياً'}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-5 border-t border-pink-50 bg-[#fdfafb] flex items-center justify-between gap-2">
                <div>
                  <span className="text-base font-black font-mono text-[#6b0f24] block">
                    {formatIQD(p.price)}
                  </span>
                  {p.compareAtPrice && (
                    <span className="text-xs text-slate-400 line-through font-mono">
                      {formatIQD(p.compareAtPrice)}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {onAddToCart && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(p);
                      }}
                      className="p-2.5 rounded-2xl border border-pink-200 bg-white text-[#6b0f24] hover:bg-pink-50 transition-colors shadow-sm"
                      title={isEn ? 'Add to cart' : 'أضف للسلة'}
                    >
                      <ShoppingBag className="size-4" />
                    </button>
                  )}
                  {enableQuick && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onOpenProductDetail) {
                          onOpenProductDetail(p);
                        } else {
                          onQuickBuy(p);
                        }
                      }}
                      className="px-4 py-2.5 rounded-2xl text-xs font-black text-white shadow-md flex items-center gap-1 transition-all hover:scale-105"
                      style={{ backgroundColor: brandColor }}
                    >
                      <span>{isEn ? 'Order' : 'اطلب الآن'}</span>
                      <ArrowLeft className={`size-3 ${isEn ? 'rotate-180' : ''}`} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Footer */}
      <footer className="bg-[#240010] text-pink-100/70 py-10 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>{copyright}</p>
          {showBadges && (
            <div className="flex items-center gap-3 font-bold text-pink-200 text-xs">
              <span className="px-2.5 py-1 rounded bg-white/10 border border-white/20">الدفع عند الاستلام</span>
              <span className="px-2.5 py-1 rounded bg-white/10 border border-white/20">ضمان النقاء 100%</span>
            </div>
          )}
        </div>
      </footer>

      {/* 6. WhatsApp Floating */}
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

      {/* 7. Sticky Cart */}
      {enableStickyCart && cartCount > 0 && (
        <div
          className="fixed bottom-0 inset-x-0 text-white px-4 py-3 z-30 shadow-2xl flex items-center justify-between"
          style={{ backgroundColor: brandColor }}
        >
          <div className="flex items-center gap-3">
            <ShoppingBag className="size-4" />
            <span className="text-xs font-bold">
              {isEn ? `${cartCount} items in cart` : `لديك ${cartCount} مستحضرات في السلة`}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('mane-grid');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-4 py-1.5 rounded-lg bg-white text-[#6b0f24] font-black text-xs hover:bg-pink-50 transition-colors"
          >
            {isEn ? 'Checkout' : 'إتمام الطلب'}
          </button>
        </div>
      )}

    </div>
  );
}

export default StoreManeTheme;
