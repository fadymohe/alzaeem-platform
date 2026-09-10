import React, { useState } from 'react';
import {
  ShoppingBag, Search, Heart, User, ArrowLeft, ArrowRight,
  Truck, ShieldCheck, Sparkles, Star, ChevronDown, CheckCircle2,
  PhoneCall, Crown, Eye, Sparkle, MessageCircle, Gift, Scissors,
  RefreshCw, Check, Plus, Tag
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

export function StoreChicTheme({
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
  const [searchOpen, setSearchOpen] = useState(false);
  const [addingId, setAddingId] = useState<number | null>(null);

  const categories = ['الكل', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];

  const brandColor = customization?.brandColor || '#540b0e';
  const fontFamily = "'Playfair Display', 'Amiri', serif";
  const isEn = customization?.defaultLanguage === 'en';
  const announcement = customization?.announcementText || 'أرقى الأزياء والفساتين الحصرية • شحن لكافة المحافظات مع ميزة فحص ومعاينة الفستان قبل الدفع';
  const heroTitle = customization?.heroTitle || (isEn ? 'Effortless Haute Couture' : 'أناقة ملكية تفيض بالأنوثة والجمال');
  const heroSubtitle = customization?.heroSubtitle || (isEn ? 'Clean lines, flowy breathable fabrics and timeless boutique curation with Iraqi COD' : 'فساتين سهرة وإطلالات يومية راقية منسوجة بأجود خامات الحرير والدانتيل، تصلك بعناية مع إمكانية الفحص والتأكد من المقاس قبل الدفع.');
  const heroBtnText = customization?.heroButtonText || (isEn ? 'Explore Collection' : 'استكشفي المجموعة الآن');

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
    brandColor,
    fontFamily,
    products,
    cartItems,
    onAddToCart,
    onOpenProductDetail: handleOpenProduct,
    onNavigatePage: (page: any) => setCurrentPage(page)
  };

  return (
    <div
      className="min-h-screen bg-[#fffafa] text-[#2c1810] antialiased selection:bg-[#540b0e] selection:text-white flex flex-col"
      style={{ fontFamily }}
      dir={isEn ? 'ltr' : 'rtl'}
    >
      {/* 1. Top Announcement Ribbon */}
      <div className="bg-[#540b0e] text-[#fde2e4] text-xs py-2 px-4 select-none shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-hidden truncate">
            <Sparkles className="size-3.5 shrink-0 text-[#ffccd5] animate-pulse" />
            <span className="text-[11px] font-medium truncate">{announcement}</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-[11px] font-mono shrink-0">
            <span className="flex items-center gap-1 text-[#ffccd5]">
              <Truck className="size-3" />
              <span>توصيل VIP سريع لكافة المحافظات</span>
            </span>
            <span>|</span>
            <span className="font-bold text-white">https://{fullDomain}</span>
          </div>
        </div>
      </div>

      {/* 2. Haute Couture Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-[#fae1dd] sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3.5 flex items-center justify-between gap-4">
          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => setCurrentPage('home')}
          >
            {logoUrl ? (
              <img src={logoUrl} alt={storeName} className="h-10 w-auto max-w-[140px] object-contain" />
            ) : (
              <div className="flex items-center gap-2.5">
                <div className="size-10 rounded-full bg-[#540b0e] text-[#fde2e4] grid place-items-center shadow-md border border-[#ffccd5]/30">
                  <Crown className="size-5" />
                </div>
                <div>
                  <h1 className="font-black text-2xl text-[#540b0e] tracking-tight leading-none italic font-serif">
                    {storeName}
                  </h1>
                  <span className="text-[10px] tracking-widest text-[#8d6e63] block mt-0.5 uppercase font-sans font-bold">
                    HAUTE COUTURE BOUTIQUE
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Center Navigation */}
          <nav className="hidden md:flex items-center gap-2 bg-[#fff0f3] p-1.5 rounded-full border border-[#fcd5ce] text-xs font-bold font-sans">
            <button
              type="button"
              onClick={() => setCurrentPage('home')}
              className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                currentPage === 'home'
                  ? 'bg-[#540b0e] text-white shadow-sm'
                  : 'text-[#540b0e] hover:bg-white/60'
              }`}
            >
              الرئيسية
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage('shop')}
              className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                currentPage === 'shop'
                  ? 'bg-[#540b0e] text-white shadow-sm'
                  : 'text-[#540b0e] hover:bg-white/60'
              }`}
            >
              المتجر والفساتين
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage('categories')}
              className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                currentPage === 'categories'
                  ? 'bg-[#540b0e] text-white shadow-sm'
                  : 'text-[#540b0e] hover:bg-white/60'
              }`}
            >
              المجموعات
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage('cart')}
              className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                currentPage === 'cart' || currentPage === 'checkout'
                  ? 'bg-[#540b0e] text-white shadow-sm'
                  : 'text-[#540b0e] hover:bg-white/60'
              }`}
            >
              حقيبة التسوق
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage('contact')}
              className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                currentPage === 'contact'
                  ? 'bg-[#540b0e] text-white shadow-sm'
                  : 'text-[#540b0e] hover:bg-white/60'
              }`}
            >
              تواصل مع البوتيك
            </button>
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2.5 rounded-full bg-[#fff0f3] hover:bg-[#ffccd5] text-[#540b0e] transition-colors cursor-pointer"
              title="بحث"
            >
              <Search className="size-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                if (onOpenCustomerAuth) onOpenCustomerAuth();
                else setCurrentPage('account');
              }}
              className="p-2.5 rounded-full bg-[#fff0f3] hover:bg-[#ffccd5] text-[#540b0e] transition-colors cursor-pointer"
              title="حسابي"
            >
              <User className="size-4" />
            </button>

            <button
              type="button"
              onClick={() => setCurrentPage('cart')}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#540b0e] hover:bg-[#3f070a] text-white font-sans font-bold text-xs shadow-md shadow-[#540b0e]/20 transition-all cursor-pointer"
            >
              <ShoppingBag className="size-4" />
              <span>الحقيبة</span>
              {cartCount > 0 && (
                <span className="bg-[#ffccd5] text-[#540b0e] px-1.5 py-0.5 rounded-full text-[10px] font-black">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search Flyout */}
        {searchOpen && (
          <div className="bg-[#fff0f3] border-t border-[#fcd5ce] p-3 px-4 md:px-8">
            <div className="max-w-2xl mx-auto flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="size-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8d6e63]" />
                <input
                  type="text"
                  placeholder="ابحثي عن فستان، عباية، قميص، أو إكسسوار..."
                  value={searchQuery}
                  onChange={(e) => {
                    onSearchChange(e.target.value);
                    if (currentPage !== 'shop') setCurrentPage('shop');
                  }}
                  className="w-full bg-white border border-[#fcd5ce] rounded-full pr-10 pl-4 py-2 text-xs text-[#2c1810] placeholder-[#8d6e63] focus:outline-none focus:border-[#540b0e]"
                  autoFocus
                />
              </div>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="text-xs text-[#540b0e] hover:underline px-2 py-1 font-sans cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        )}
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
          <div>
            {/* Chic Haute Hero */}
            <section className="relative overflow-hidden bg-gradient-to-b from-[#fff0f3]/80 via-[#fffafa] to-[#fffafa] py-16 md:py-24 px-4 md:px-8 border-b border-[#fae1dd]">
              <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-7 space-y-6 text-right">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#fcd5ce] text-[#540b0e] text-xs font-sans font-bold shadow-sm">
                    <Sparkles className="size-3.5 text-[#540b0e]" />
                    <span>مجموعة الأزياء الراقية الحصرية لعام 2026</span>
                  </div>

                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-[#540b0e] leading-tight font-serif italic">
                    {heroTitle}
                  </h1>

                  <p className="text-sm md:text-base text-[#5c3d2e] max-w-xl leading-relaxed font-sans">
                    {heroSubtitle}
                  </p>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-3 gap-3 py-2 max-w-lg font-sans">
                    <div className="p-3.5 rounded-2xl bg-white border border-[#fcd5ce] shadow-sm">
                      <div className="text-xs font-bold text-[#540b0e] mb-1">حرير ودانتيل نقي</div>
                      <div className="text-[11px] text-[#8d6e63]">خامات مستوردة أصلية 100%</div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-white border border-[#fcd5ce] shadow-sm">
                      <div className="text-xs font-bold text-[#540b0e] mb-1">فحص المقاس باليد</div>
                      <div className="text-[11px] text-[#8d6e63]">معاينة وتجربة قبل الدفع</div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-white border border-[#fcd5ce] shadow-sm">
                      <div className="text-xs font-bold text-[#540b0e] mb-1">استبدال سهل</div>
                      <div className="text-[11px] text-[#8d6e63]">تغيير القياس مجاناً</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 pt-2 font-sans">
                    <button
                      type="button"
                      onClick={() => setCurrentPage('shop')}
                      className="px-8 py-3.5 rounded-full bg-[#540b0e] hover:bg-[#3f070a] text-white font-bold text-sm shadow-xl shadow-[#540b0e]/20 flex items-center gap-2 group transition-all cursor-pointer"
                    >
                      <span>{heroBtnText}</span>
                      <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentPage('categories')}
                      className="px-6 py-3.5 rounded-full bg-white hover:bg-[#fff0f3] text-[#540b0e] border border-[#fcd5ce] font-bold text-sm shadow-sm transition-all cursor-pointer"
                    >
                      استكشفي المجموعات
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-5 relative">
                  <div className="relative rounded-3xl overflow-hidden border border-[#fcd5ce] shadow-2xl bg-white p-4">
                    <div
                      className="aspect-[4/5] rounded-2xl overflow-hidden relative mb-4 bg-[#fff0f3] cursor-pointer p-4 flex items-center justify-center"
                      onClick={() => products[0] && handleOpenProduct(products[0])}
                    >
                      <img
                        src={getProductImage(products[0])}
                        alt="Chic Haute Showcase"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).onerror = null;
                          (e.currentTarget as HTMLImageElement).src = STORE_PLACEHOLDER_IMAGE;
                        }}
                        className="w-full h-full object-contain transform hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute top-3 right-3 bg-[#540b0e] text-[#fde2e4] text-[10px] font-sans font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                        الأكثر طلباً
                      </div>
                    </div>

                    <div className="flex items-center justify-between px-2 font-sans">
                      <div>
                        <span className="text-xs text-[#8d6e63] font-bold">توب صيفي قصير بقصة كروس</span>
                        <h4 className="font-bold text-[#540b0e] text-sm mt-0.5">خامة قطنية مريحة وناعمة</h4>
                      </div>
                      <div className="text-left">
                        <div className="text-base font-black text-[#540b0e]">
                          {products[0]?.price ? formatPriceInteger(products[0].price) : '68,000 د.ع'}
                        </div>
                        <span className="text-[10px] text-[#8d6e63]">فحص قبل الدفع</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Featured Boutique Items */}
            <section className="py-12 md:py-16 max-w-7xl mx-auto px-4 md:px-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl md:text-3xl font-black text-[#540b0e] font-serif italic flex items-center gap-2">
                    <Sparkles className="size-6 text-[#540b0e]" />
                    <span>مختارات البوتيك الحصرية</span>
                  </h3>
                  <p className="text-xs text-[#8d6e63] font-sans mt-1">
                    أرقى القطع والفساتين المنتقاة لتمنحكِ إطلالة استثنائية
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentPage('shop')}
                  className="text-xs font-bold text-[#540b0e] hover:underline font-sans flex items-center gap-1 cursor-pointer"
                >
                  <span>عرض الكل ({products.length})</span>
                  <ArrowLeft className="size-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-sans">
                {products.slice(0, 8).map((product) => {
                  const hasDiscount = !!product.compareAtPrice && product.compareAtPrice > product.price;
                  return (
                    <div
                      key={product.id}
                      className="group bg-white rounded-2xl overflow-hidden border border-[#fae1dd] hover:border-[#540b0e]/60 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                    >
                      <div
                        className="relative aspect-square overflow-hidden bg-[#fff0f3] p-3 flex items-center justify-center cursor-pointer"
                        onClick={() => handleOpenProduct(product)}
                      >
                        <img
                          src={getProductImage(product)}
                          alt={product.name}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).onerror = null;
                            (e.currentTarget as HTMLImageElement).src = STORE_PLACEHOLDER_IMAGE;
                          }}
                          className="size-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-700"
                        />
                        {hasDiscount && (
                          <div className="absolute top-2.5 right-2.5 bg-[#540b0e] text-[#fde2e4] text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
                            خصم خاص
                          </div>
                        )}
                        <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm text-[10px] font-bold text-[#540b0e] px-2 py-0.5 rounded-full border border-[#fcd5ce]">
                          {product.category || 'أزياء'}
                        </div>
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          <div className="flex items-center gap-1 text-amber-500 mb-1.5">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="size-3 fill-amber-500" />
                            ))}
                            <span className="text-[10px] text-slate-400 mr-1">(5.0)</span>
                          </div>

                          <h4
                            className="font-bold text-sm text-[#540b0e] line-clamp-1 cursor-pointer hover:underline transition-colors font-serif"
                            onClick={() => handleOpenProduct(product)}
                          >
                            {product.name}
                          </h4>

                          <p className="text-[11px] text-[#8d6e63] line-clamp-1 mt-1">
                            {product.description || 'قطعة حصرية بتفاصيل راقية'}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-[#fae1dd] space-y-2">
                          <div className="flex items-baseline justify-between">
                            <div>
                              <span className="text-[10px] text-[#8d6e63] block">السعر</span>
                              <div className="text-base font-black text-[#540b0e] font-mono">
                                {formatPriceInteger(product.price)}
                              </div>
                            </div>
                            {hasDiscount && product.compareAtPrice && (
                              <div className="text-left font-mono">
                                <span className="text-[10px] text-slate-400 line-through block">
                                  {formatPriceInteger(product.compareAtPrice)}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Single Add to Cart Action */}
                          <button
                            type="button"
                            onClick={() => handleAddToCartWithFeedback(product)}
                            disabled={addingId === product.id}
                            className="w-full py-2 rounded-full bg-[#540b0e] hover:bg-[#3f070a] text-white text-xs font-bold transition-all shadow-md shadow-[#540b0e]/20 flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer disabled:opacity-75"
                          >
                            {addingId === product.id ? (
                              <>
                                <RefreshCw className="size-3.5 animate-spin text-[#ffccd5]" />
                                <span>تمت الإضافة للحقيبة...</span>
                              </>
                            ) : (
                              <>
                                <ShoppingBag className="size-3.5" />
                                <span>أضف للحقيبة</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Features Strip */}
            <section className="py-12 bg-[#fff0f3] border-y border-[#fae1dd] font-sans">
              <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-[#fcd5ce] shadow-sm">
                    <div className="size-12 rounded-full bg-[#540b0e] text-white grid place-items-center shrink-0">
                      <Truck className="size-6 text-[#fde2e4]" />
                    </div>
                    <div>
                      <h5 className="font-bold text-sm text-[#540b0e]">توصيل VIP لكافة المحافظات</h5>
                      <p className="text-[11px] text-[#8d6e63] mt-0.5">بغداد وجميع مدن العراق</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-[#fcd5ce] shadow-sm">
                    <div className="size-12 rounded-full bg-[#540b0e] text-white grid place-items-center shrink-0">
                      <ShieldCheck className="size-6 text-[#fde2e4]" />
                    </div>
                    <div>
                      <h5 className="font-bold text-sm text-[#540b0e]">معاينة قبل الدفع</h5>
                      <p className="text-[11px] text-[#8d6e63] mt-0.5">افحصي الفستان وتأكدي من المقاس</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-[#fcd5ce] shadow-sm">
                    <div className="size-12 rounded-full bg-[#540b0e] text-white grid place-items-center shrink-0">
                      <Gift className="size-6 text-[#fde2e4]" />
                    </div>
                    <div>
                      <h5 className="font-bold text-sm text-[#540b0e]">تغليف هدايا مجاني</h5>
                      <p className="text-[11px] text-[#8d6e63] mt-0.5">علب فاخرة وشريطة حريرية</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-[#fcd5ce] shadow-sm">
                    <div className="size-12 rounded-full bg-[#540b0e] text-white grid place-items-center shrink-0">
                      <PhoneCall className="size-6 text-[#fde2e4]" />
                    </div>
                    <div>
                      <h5 className="font-bold text-sm text-[#540b0e]">استشارات مقاس وأناقة</h5>
                      <p className="text-[11px] text-[#8d6e63] mt-0.5">مساعدة فورية عبر الواتساب</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* 4. Haute Couture Footer (White-Labeled) */}
      <footer className="bg-[#2c1810] text-[#fde2e4] text-xs mt-auto font-sans">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-full bg-[#540b0e] text-[#fde2e4] grid place-items-center">
                  <Crown className="size-4" />
                </div>
                <h4 className="font-black text-white text-base italic font-serif">{storeName}</h4>
              </div>
              <p className="text-[11px] leading-relaxed text-[#d7ccc8]">
                ملاذكِ للأزياء الراقية والفساتين الحصرية في العراق، نمنحكِ تجربة تسوق أنثوية متكاملة مع المعاينة قبل الدفع.
              </p>
            </div>

            <div>
              <h5 className="font-bold text-white text-sm mb-3">تشكيلات البوتيك</h5>
              <ul className="space-y-2 text-[11px]">
                {categories.slice(0, 5).map(cat => (
                  <li key={cat}>
                    <button
                      type="button"
                      onClick={() => {
                        onSelectCategory(cat);
                        setCurrentPage('shop');
                      }}
                      className="hover:text-[#ffccd5] transition-colors cursor-pointer"
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-white text-sm mb-3">خدمة الزبائن</h5>
              <ul className="space-y-2 text-[11px]">
                <li>
                  <button type="button" onClick={() => setCurrentPage('shop')} className="hover:text-[#ffccd5] transition-colors cursor-pointer">
                    جميع الأزياء
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => setCurrentPage('cart')} className="hover:text-[#ffccd5] transition-colors cursor-pointer">
                    حقيبة التسوق
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => setCurrentPage('account')} className="hover:text-[#ffccd5] transition-colors cursor-pointer">
                    حسابي والطلبات السابقة
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => setCurrentPage('contact')} className="hover:text-[#ffccd5] transition-colors cursor-pointer">
                    تواصل مع البوتيك
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h5 className="font-bold text-white text-sm">التوصيل وخدمة العراق</h5>
              <p className="text-[11px] text-[#d7ccc8]">
                شحن لجميع المحافظات: بغداد، النجف، كربلاء، البصرة، أربيل، السليمانية وغيرها.
              </p>
              <div className="font-mono text-[#ffccd5] font-bold text-xs">
                📞 0770 000 0000
              </div>
              <div className="text-[10px] text-[#bcaaa4]">
                الدفع: نقد عند الاستلام (COD) • زين كاش • ماستركارد
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[#4e342e] flex flex-wrap items-center justify-between gap-4 text-[11px] text-[#a1887f]">
            <div>
              © {new Date().getFullYear()} {storeName}. جميع الحقوق محفوظة.
            </div>
            <div className="flex items-center gap-3">
              <span>سياسة الخصوصية والاستبدال</span>
              <span>•</span>
              <span>الشروط والأحكام</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
export default StoreChicTheme;
