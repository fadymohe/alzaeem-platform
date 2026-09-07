import React, { useState } from 'react';
import {
  ShoppingBag, Search, Heart, User, ArrowLeft, ArrowRight,
  Truck, ShieldCheck, Sparkles, Star, ChevronDown, CheckCircle2,
  PhoneCall, Shirt, SlidersHorizontal, ArrowUpDown, RotateCcw,
  MessageCircle, Lock, Check
} from 'lucide-react';
import { formatIQD } from '../../../data/iraqData';
import type { StoreProduct } from '../../../data/storeState';
import type { ThemeComponentProps } from '../store-classic';

export function StoreWardrobeTheme({
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
  const [activeGender, setActiveGender] = useState('الكل');

  const categories = ['الكل', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];

  const brandColor = customization?.brandColor || '#111111';
  const isEn = customization?.defaultLanguage === 'en';
  const isSticky = customization?.isHeaderSticky !== false;
  const showTrust = customization?.showTrustFeatures !== false;
  const showBanner = customization?.showHeroBanner !== false;
  const announcement = customization?.announcementText || 'WARDROBE COLLECTION — تسوق أحدث خطوط الموضة مع الشحن السريع';
  const heroTitle = customization?.heroTitle || (isEn ? 'Daily Signature Collection' : 'يومي بطابع خاص');
  const heroSubtitle = customization?.heroSubtitle || (isEn ? 'The pieces you wear on repeat' : 'القطع التي ترتديها فقط');
  const heroBtnText = customization?.heroButtonText || (isEn ? 'Shop Now' : 'تسوق الآن');
  const gridCols = customization?.productGridCols || 4;
  const showDiscount = customization?.showDiscountBadge !== false;
  const showStock = customization?.showStockStatus !== false;
  const enableQuick = customization?.enableQuickBuy !== false;
  const urgencyTicker = customization?.showUrgencyTicker !== false;
  const copyright = customization?.footerCopyright || `© ${new Date().getFullYear()} ${storeName}. جميع الحقوق محفوظة • منصة الزعيم`;
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
      className="min-h-screen bg-[#fafafa] text-[#111] font-sans antialiased selection:bg-black selection:text-white"
      dir={isEn ? 'ltr' : 'rtl'}
    >
      
      {/* 1. Top Minimal Black Announcement Bar */}
      {customization?.showAnnouncement !== false && (
        <div className="bg-[#111] text-white text-[11px] py-2 px-4 md:px-8 transition-colors">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <span className="font-bold tracking-wider">
              {announcement}
            </span>
            <div className="flex items-center gap-4 text-slate-300 font-semibold text-[10px]">
              <span>{isEn ? 'COD with Fitting Inspection' : 'الدفع عند الاستلام مع فحص القياس'}</span>
              <span className="hidden sm:inline">|</span>
              <span className="hidden sm:inline">{isEn ? 'Free Size Exchange' : 'تبديل مجاني للمقاسات'}</span>
              {customization?.hotlinePhone && (
                <span className="hidden md:inline font-mono">{customization.hotlinePhone}</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. Monochromatic Clean Header (Matching Screenshot 1 Wardrobe) */}
      <header className={`bg-white border-b border-slate-200 ${isSticky ? 'sticky top-0' : 'relative'} z-40 shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            {logoUrl ? (
              <img src={logoUrl} alt={storeName} className="h-9 w-auto max-w-[130px] object-contain" />
            ) : (
              <div className="flex items-center gap-2">
                <div
                  className="size-9 text-white font-black grid place-items-center text-base rounded-lg shadow-sm"
                  style={{ backgroundColor: brandColor }}
                >
                  W
                </div>
                <div>
                  <h1 className="font-black text-lg text-black tracking-tight leading-none uppercase">{storeName}</h1>
                  <span className="text-[10px] font-mono text-slate-500 dir-ltr block mt-0.5">{fullDomain}</span>
                </div>
              </div>
            )}
          </div>

          {/* Center Direct Category Tabs */}
          <div className="hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-slate-700">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => onSelectCategory(c)}
                className={`py-1 transition-colors hover:text-black ${
                  selectedCategory === c ? 'text-black font-black border-b-2 border-black' : ''
                }`}
              >
                {c === 'الكل' && isEn ? 'All' : c}
              </button>
            ))}
          </div>

          {/* Right Search & Cart */}
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block w-56">
              <Search className={`absolute ${isEn ? 'left-3' : 'right-3'} top-2.5 size-3.5 text-slate-400`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={isEn ? 'Search wardrobe...' : 'بحث في المنتجات...'}
                className={`w-full h-8 ${isEn ? 'pl-9 pr-3' : 'pr-9 pl-3'} border border-slate-300 rounded-lg text-xs bg-slate-50 focus:outline-none focus:border-black focus:bg-white`}
              />
            </div>

            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('wardrobe-products');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-2 px-3.5 py-2 text-white font-black text-xs rounded-lg transition-all shadow-sm hover:opacity-90"
              style={{ backgroundColor: brandColor }}
            >
              <ShoppingBag className="size-3.5" />
              <span>{isEn ? 'Cart' : 'السلة'} ({cartCount})</span>
            </button>
          </div>
        </div>
      </header>

      {/* 3. Authentic Wardrobe Hero Banner (Matching Screenshot 1 left side) */}
      {showBanner && (
        <section className="max-w-7xl mx-auto px-4 md:px-8 mt-6">
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm flex flex-col md:flex-row items-center justify-between">
            {/* Left Model Photo (Striped Long Sleeve Knit Shirt matching Screenshot) */}
            <div className="w-full md:w-1/2 h-72 md:h-96 relative overflow-hidden bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&auto=format&fit=crop&q=80"
                alt="Wardrobe Hero Model"
                className="size-full object-cover object-top hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-transparent via-transparent to-white/40" />
            </div>

            {/* Right Hero Content Text */}
            <div className="w-full md:w-1/2 p-8 md:p-12 text-right space-y-4">
              <span className="px-3 py-1 rounded-full text-[10px] font-black bg-black text-white uppercase tracking-wider inline-block">
                {isEn ? 'Wardrobe Exclusive' : 'يومي بطابع خاص'}
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-black leading-tight tracking-tight">
                {heroTitle}
              </h2>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                {heroSubtitle}
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('wardrobe-products');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-8 py-3.5 text-white font-black text-xs rounded-xl shadow-md transition-all hover:scale-105 flex items-center gap-2"
                  style={{ backgroundColor: brandColor }}
                >
                  <span>{heroBtnText}</span>
                  <ArrowLeft className={`size-3.5 ${isEn ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. 4 Benefit Cards (Matching Screenshot 1 Wardrobe: دفع آمن، شحن مجاني، إرجاع سهل، دعم متواصل) */}
      {showTrust && (
        <section className="max-w-7xl mx-auto px-4 md:px-8 mt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                icon: ShieldCheck,
                title: isEn ? 'Secure Checkout' : 'دفع آمن',
                desc: isEn ? '100% Guaranteed Safe' : 'دفع آمن 100%'
              },
              {
                icon: Truck,
                title: isEn ? 'Free Shipping' : 'شحن مجاني',
                desc: isEn ? 'On orders over $50' : 'للطلبات فوق 50$'
              },
              {
                icon: RotateCcw,
                title: isEn ? 'Easy Returns' : 'إرجاع سهل',
                desc: isEn ? 'Within 14 days' : 'في غضون 14 يوماً'
              },
              {
                icon: PhoneCall,
                title: isEn ? '24/7 Support' : 'دعم متواصل',
                desc: isEn ? 'Style consultation team' : 'دعم من فريق الاستشارات'
              }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3.5 shadow-sm hover:border-black transition-colors"
                >
                  <div className="size-10 rounded-xl bg-slate-100 text-black grid place-items-center shrink-0">
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-black">{item.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 5. Products Grid (الأكثر مبيعاً matching Screenshot 1 exactly) */}
      <section id="wardrobe-products" className="max-w-7xl mx-auto px-4 md:px-8 mt-8 mb-16">
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-200">
          <div>
            <h2 className="font-black text-xl text-black">
              {isEn ? 'Best Sellers' : 'الأكثر مبيعاً'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEn ? 'Premium daily casual essentials' : 'تشكيلة ملابس راقية تناسب إطلالتك اليومية'}
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
            {filteredProducts.length} {isEn ? 'Items' : 'قطعة'}
          </span>
        </div>

        <div className={`grid ${getColsClass()} gap-6`}>
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:border-black"
            >
              <div>
                <div className="h-72 bg-slate-100 relative overflow-hidden">
                  <img
                    src={p.imageUrl || '/templates/store-classic.jpg'}
                    alt={p.name}
                    className="size-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {showDiscount && p.compareAtPrice && (
                    <span className="absolute top-2.5 right-2.5 text-[10px] font-black bg-[#e63946] text-white px-2 py-0.5 rounded shadow-sm">
                      {isEn ? 'SALE' : 'تخفيض'}
                    </span>
                  )}
                  {showStock && (
                    <span className="absolute bottom-2.5 left-2.5 text-[9px] font-black bg-white/90 text-slate-800 px-2 py-0.5 rounded backdrop-blur-sm shadow-sm flex items-center gap-1">
                      <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {isEn ? 'In Stock' : 'متوفر بالمخزن'}
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
                    <div className="pt-1 text-[10px] font-bold text-amber-600 flex items-center gap-1">
                      <Sparkles className="size-3" />
                      <span>{isEn ? 'High Demand • Limited pieces left' : 'طلب مرتفع • متبقي قطع محدودة'}</span>
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

      {/* 6. Minimal Footer */}
      <footer className="bg-white border-t border-slate-200 py-10 px-4 text-xs text-slate-600">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>{copyright}</p>
          {showBadges && (
            <div className="flex items-center gap-3 font-bold text-black text-[11px]">
              <span className="px-2 py-1 rounded bg-slate-100 border border-slate-200">الدفع عند الاستلام (COD)</span>
              <span className="px-2 py-1 rounded bg-slate-100 border border-slate-200">شركة الزعيم إكسبريس</span>
              <span className="px-2 py-1 rounded bg-slate-100 border border-slate-200">معاينة قبل الدفع</span>
            </div>
          )}
        </div>
      </footer>

      {/* 7. Floating WhatsApp Button */}
      {enableWa && (
        <a
          href={`https://wa.me/${waNumber.replace(/[^0-9]/g, '')}`}
          target="_blank"
          rel="noreferrer"
          className="fixed bottom-6 left-6 z-40 size-12 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl grid place-items-center transition-transform hover:scale-110"
          title="تواصل عبر واتساب للطلب الفوري"
        >
          <MessageCircle className="size-6 fill-white" />
        </a>
      )}

      {/* 8. Sticky Bottom Cart Bar */}
      {enableStickyCart && cartCount > 0 && (
        <div className="fixed bottom-0 inset-x-0 bg-black text-white px-4 py-3 z-30 shadow-2xl flex items-center justify-between border-t border-slate-800">
          <div className="flex items-center gap-3">
            <ShoppingBag className="size-4" />
            <span className="text-xs font-bold">
              {isEn ? `You have ${cartCount} items ready` : `لديك ${cartCount} منتجات في السلة`}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('wardrobe-products');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-4 py-1.5 rounded-lg bg-white text-black font-black text-xs hover:bg-slate-200 transition-colors"
          >
            {isEn ? 'Checkout' : 'إتمام الطلب'}
          </button>
        </div>
      )}

    </div>
  );
}

export default StoreWardrobeTheme;
