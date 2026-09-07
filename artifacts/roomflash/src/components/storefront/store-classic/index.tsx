import React, { useState } from 'react';
import {
  ShoppingBag, Search, Star, ArrowLeft, Truck, ShieldCheck,
  Sparkles, Heart, Clock, Check, User, ArrowRight, X, Phone, MapPin,
  Flame, Award, Shield, PhoneCall, Plus, Tag
} from 'lucide-react';
import { formatIQD } from '../../../data/iraqData';
import type { StoreProduct } from '../../../data/storeState';
import {
  ThemeShopView,
  ThemeCategoriesView,
  ThemeCartCheckoutView,
  ThemeAccountView,
  ThemeContactView
} from '../theme-common/ThemePages';

export interface ThemeComponentProps {
  storeName: string;
  subdomain: string;
  fullDomain: string;
  products: StoreProduct[];
  filteredProducts: StoreProduct[];
  cartCount: number;
  cartItems?: Array<{ product: StoreProduct; quantity: number }>;
  onOpenCart?: () => void;
  onOpenProductDetail?: (product: StoreProduct) => void;
  onOpenCustomerAuth?: () => void;
  currentCustomer?: { name: string; phone: string; city: string; address?: string } | null;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onQuickBuy: (product: StoreProduct) => void;
  onAddToCart?: (product: StoreProduct) => void;
  logoUrl?: string;
  storeCode?: string;
  customization?: any;
}

/**
 * StoreClassicTheme - Botiga Minimalist Luxury & Perfumes
 * Clean, elegant slate & champagne gold aesthetic, Amiri / Cairo typography, luxury fragrance & beauty
 */
export function StoreClassicTheme({
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
  const [currentPage, setCurrentPage] = useState<'home' | 'shop' | 'categories' | 'cart' | 'checkout' | 'account' | 'contact'>('home');
  const [searchOpen, setSearchOpen] = useState(false);

  const categories = ['الكل', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];

  const brandColor = customization?.brandColor || '#0f172a';
  const fontFamily = "'Amiri', 'Cairo', serif";
  const isEn = customization?.defaultLanguage === 'en';
  const announcement = customization?.announcementText || 'عطور شرقية وفاخرة أصلية 100% • توصيل لكافة محافظات العراق والدفع عند الاستلام مع تجربة العطر باليد';
  const heroTitle = customization?.heroTitle || (isEn ? 'Timeless Botiga Luxury' : 'نفحات عطرية ملكية وأصالة شرقية خالدة');
  const heroSubtitle = customization?.heroSubtitle || (isEn ? 'Handcrafted essences and purest blends delivered with Iraqi Cash On Delivery and hand inspection.' : 'مجموعات حصرية من العود الملكي، والمسك الصافي، والعطور الفرنسية المنتقاة بعناية فائقة، مع إمكانية تجربة الرائحة قبل إتمام الدفع.');
  const heroBtnText = customization?.heroButtonText || (isEn ? 'Explore Fragrances' : 'استكشف التشكيلة العطرية');

  const sharedPageProps = {
    storeName,
    subdomain,
    fullDomain,
    brandColor,
    fontFamily,
    products,
    cartItems,
    onAddToCart,
    onQuickBuy,
    onOpenProductDetail,
    onNavigatePage: (page: any) => setCurrentPage(page)
  };

  return (
    <div
      className="min-h-screen bg-[#faf9f6] text-slate-900 antialiased selection:bg-slate-900 selection:text-white flex flex-col"
      style={{ fontFamily }}
      dir={isEn ? 'ltr' : 'rtl'}
    >
      {/* 1. Top Announcement Bar */}
      <div className="bg-[#0f172a] text-slate-200 text-xs py-2 px-4 select-none shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-hidden truncate">
            <Sparkles className="size-3.5 shrink-0 text-[#d4af37] animate-pulse" />
            <span className="text-[11px] truncate font-sans font-medium">{announcement}</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-[11px] font-mono shrink-0">
            <span className="flex items-center gap-1 text-[#d4af37]">
              <Truck className="size-3" />
              <span>توصيل لكافة محافظات العراق</span>
            </span>
            <span>|</span>
            <span className="font-bold text-white">https://{fullDomain}</span>
          </div>
        </div>
      </div>

      {/* 2. Botiga Classic Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 shadow-sm">
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
                <div className="size-10 rounded-full bg-[#0f172a] text-[#d4af37] grid place-items-center shadow-md border border-[#d4af37]/30">
                  <Sparkles className="size-5" />
                </div>
                <div>
                  <h1 className="font-black text-2xl text-[#0f172a] tracking-tight leading-none italic font-serif">
                    {storeName}
                  </h1>
                  <span className="text-[10px] tracking-widest text-[#d4af37] block mt-0.5 uppercase font-sans font-bold">
                    BOTIGA HAUTE PARFUMERIE
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-2 bg-slate-100/80 p-1.5 rounded-full border border-slate-200 text-xs font-bold font-sans">
            <button
              type="button"
              onClick={() => setCurrentPage('home')}
              className={`px-4 py-1.5 rounded-full transition-all ${
                currentPage === 'home'
                  ? 'bg-[#0f172a] text-white shadow-sm'
                  : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              الرئيسية
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage('shop')}
              className={`px-4 py-1.5 rounded-full transition-all ${
                currentPage === 'shop'
                  ? 'bg-[#0f172a] text-white shadow-sm'
                  : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              المتجر والعطور
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage('categories')}
              className={`px-4 py-1.5 rounded-full transition-all ${
                currentPage === 'categories'
                  ? 'bg-[#0f172a] text-white shadow-sm'
                  : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              التصنيفات
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage('cart')}
              className={`px-4 py-1.5 rounded-full transition-all ${
                currentPage === 'cart' || currentPage === 'checkout'
                  ? 'bg-[#0f172a] text-white shadow-sm'
                  : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              حقيبة التسوق
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage('account')}
              className={`px-4 py-1.5 rounded-full transition-all ${
                currentPage === 'account'
                  ? 'bg-[#0f172a] text-white shadow-sm'
                  : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              حسابي
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage('contact')}
              className={`px-4 py-1.5 rounded-full transition-all ${
                currentPage === 'contact'
                  ? 'bg-[#0f172a] text-white shadow-sm'
                  : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              تواصل معنا
            </button>
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
              title="بحث"
            >
              <Search className="size-4" />
            </button>

            <button
              type="button"
              onClick={() => setCurrentPage('account')}
              className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
              title="حسابي"
            >
              <User className="size-4" />
            </button>

            <button
              type="button"
              onClick={() => setCurrentPage('cart')}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#0f172a] hover:bg-slate-800 text-white font-sans font-bold text-xs shadow-md shadow-slate-900/20 transition-all"
            >
              <ShoppingBag className="size-4" />
              <span>الحقيبة</span>
              {cartCount > 0 && (
                <span className="bg-[#d4af37] text-slate-950 px-1.5 py-0.5 rounded-full text-[10px] font-black">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search Flyout */}
        {searchOpen && (
          <div className="bg-slate-50 border-t border-slate-200 p-3 px-4 md:px-8">
            <div className="max-w-2xl mx-auto flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="size-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="ابحث عن عطر، عود، بخور، أو لوشن..."
                  value={searchQuery}
                  onChange={(e) => {
                    onSearchChange(e.target.value);
                    if (currentPage !== 'shop') setCurrentPage('shop');
                  }}
                  className="w-full bg-white border border-slate-300 rounded-full pr-10 pl-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0f172a]"
                  autoFocus
                />
              </div>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="text-xs text-slate-600 hover:text-slate-950 px-2 py-1 font-sans"
              >
                إغلاق
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Pages Switcher */}
      <main className="flex-1">
        {currentPage === 'shop' && (
          <ThemeShopView
            {...sharedPageProps}
            themeStyle="luxury"
            initialCategory={selectedCategory}
            initialSearch={searchQuery}
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

        {currentPage === 'cart' && (
          <ThemeCartCheckoutView
            {...sharedPageProps}
            initialStep="cart"
          />
        )}

        {currentPage === 'checkout' && (
          <ThemeCartCheckoutView
            {...sharedPageProps}
            initialStep="checkout"
          />
        )}

        {currentPage === 'account' && (
          <ThemeAccountView
            {...sharedPageProps}
            currentCustomer={currentCustomer}
          />
        )}

        {currentPage === 'contact' && (
          <ThemeContactView
            {...sharedPageProps}
          />
        )}

        {currentPage === 'home' && (
          <div>
            {/* 3. Luxury Botiga Hero */}
            <section className="relative overflow-hidden bg-gradient-to-b from-[#f5f3ef] via-[#faf9f6] to-[#faf9f6] py-16 md:py-24 px-4 md:px-8 border-b border-slate-200">
              <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-7 space-y-6 text-right">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#d4af37]/40 text-[#0f172a] text-xs font-sans font-bold shadow-sm">
                    <Sparkles className="size-3.5 text-[#d4af37]" />
                    <span>مجموعة العطور الشرقية والنيش لعام 2026</span>
                  </div>

                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-[#0f172a] leading-tight font-serif italic">
                    {heroTitle}
                  </h1>

                  <p className="text-sm md:text-base text-slate-600 max-w-xl leading-relaxed font-sans">
                    {heroSubtitle}
                  </p>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-3 gap-3 py-2 max-w-lg font-sans">
                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                      <div className="text-xs font-bold text-[#0f172a] mb-1">زيوت نقية 100%</div>
                      <div className="text-[11px] text-slate-500">ثبات وفوحان يدوم 48 ساعة</div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                      <div className="text-xs font-bold text-[#0f172a] mb-1">تجربة باليد</div>
                      <div className="text-[11px] text-slate-500">فحص الرائحة قبل الدفع</div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                      <div className="text-xs font-bold text-[#0f172a] mb-1">ضمان استرجاع</div>
                      <div className="text-[11px] text-slate-500">استبدال فوري بدون تعقيد</div>
                    </div>
                  </div>

                  {/* CTAs */}
                  <div className="flex flex-wrap items-center gap-4 pt-2 font-sans">
                    <button
                      type="button"
                      onClick={() => setCurrentPage('shop')}
                      className="px-8 py-3.5 rounded-full bg-[#0f172a] hover:bg-slate-800 text-white font-bold text-sm shadow-xl shadow-slate-900/20 flex items-center gap-2 group transition-all"
                    >
                      <span>{heroBtnText}</span>
                      <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentPage('categories')}
                      className="px-6 py-3.5 rounded-full bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 font-bold text-sm shadow-sm transition-all"
                    >
                      استكشف الروائح
                    </button>
                  </div>
                </div>

                {/* Hero Feature Showcase */}
                <div className="lg:col-span-5 relative">
                  <div className="relative rounded-3xl overflow-hidden border border-[#d4af37]/30 shadow-2xl bg-white p-4">
                    <div className="aspect-[4/5] rounded-2xl overflow-hidden relative mb-4 bg-slate-900">
                      <img
                        src={products[0]?.image || 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80'}
                        alt="Botiga Luxury Fragrance"
                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute top-3 right-3 bg-[#0f172a] text-[#d4af37] text-[10px] font-sans font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-[#d4af37]/40 shadow-md">
                        الأكثر طلباً
                      </div>
                    </div>

                    <div className="flex items-center justify-between px-2 font-sans">
                      <div>
                        <span className="text-xs text-[#d4af37] font-bold">عطر العود والكهرمان الملكي</span>
                        <h4 className="font-bold text-slate-900 text-sm mt-0.5">تركيز بارفيوم نقي بفوحان استثنائي</h4>
                      </div>
                      <div className="text-left">
                        <div className="text-base font-black text-[#0f172a]">
                          {products[0]?.price ? formatIQD(products[0].price) : '55,000 د.ع'}
                        </div>
                        <span className="text-[10px] text-slate-500">معاينة قبل الدفع</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 4. Category Badges */}
            <section className="py-6 border-b border-slate-200 bg-white">
              <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none font-sans">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        onSelectCategory(cat);
                        setCurrentPage('shop');
                      }}
                      className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                        selectedCategory === cat
                          ? 'bg-[#0f172a] text-white shadow-md'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                      }`}
                    >
                      <Sparkles className="size-3.5 text-[#d4af37]" />
                      <span>{cat}</span>
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* 5. Featured Products */}
            <section className="py-12 md:py-16 max-w-7xl mx-auto px-4 md:px-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl md:text-3xl font-black text-[#0f172a] font-serif italic flex items-center gap-2">
                    <Sparkles className="size-6 text-[#d4af37]" />
                    <span>مختارات العطور ومستحضرات الجمال</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-sans mt-1">
                    أفضل التوليفات والزيوت العطرية النقية المختارة لك
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentPage('shop')}
                  className="text-xs font-bold text-[#0f172a] hover:text-[#d4af37] font-sans flex items-center gap-1"
                >
                  <span>عرض الكل ({products.length})</span>
                  <ArrowLeft className="size-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-sans">
                {products.slice(0, 8).map((product) => {
                  const hasDiscount = !!product.originalPrice && product.originalPrice > product.price;
                  return (
                    <div
                      key={product.id}
                      className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-[#d4af37]/60 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
                    >
                      <div
                        className="relative aspect-square overflow-hidden bg-slate-100 cursor-pointer"
                        onClick={() => onOpenProductDetail?.(product)}
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        {hasDiscount && (
                          <div className="absolute top-2.5 right-2.5 bg-[#0f172a] text-[#d4af37] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#d4af37]/40 shadow-md">
                            تخفيض حصري
                          </div>
                        )}
                        <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm text-[10px] font-bold text-slate-900 px-2 py-0.5 rounded-full border border-slate-200">
                          {product.category || 'عطور'}
                        </div>
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-1 text-amber-500 mb-1.5">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="size-3 fill-amber-500" />
                            ))}
                            <span className="text-[10px] text-slate-400 mr-1">(5.0)</span>
                          </div>

                          <h4
                            className="font-bold text-sm text-[#0f172a] line-clamp-1 cursor-pointer hover:text-[#d4af37] transition-colors font-serif"
                            onClick={() => onOpenProductDetail?.(product)}
                          >
                            {product.name}
                          </h4>

                          <p className="text-[11px] text-slate-500 line-clamp-1 mt-1">
                            {product.description || 'عطر فاخر بزيت نقي وثبات ممتد'}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-200">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <span className="text-[10px] text-slate-500 block">السعر</span>
                              <div className="text-base font-black text-[#0f172a]">
                                {formatIQD(product.price)}
                              </div>
                            </div>
                            {hasDiscount && product.originalPrice && (
                              <div className="text-left">
                                <span className="text-[10px] text-slate-400 line-through block">
                                  {formatIQD(product.originalPrice)}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => onAddToCart?.(product)}
                              className="w-full py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-bold transition-colors flex items-center justify-center gap-1 border border-slate-200"
                            >
                              <ShoppingBag className="size-3.5" />
                              <span>للحقيبة</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => onQuickBuy?.(product)}
                              className="w-full py-2 rounded-full bg-[#0f172a] hover:bg-slate-800 text-white text-xs font-bold transition-colors shadow-md shadow-slate-900/20"
                            >
                              طلب فوري
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* 6. Botiga Features Strip */}
            <section className="py-12 bg-slate-100/70 border-y border-slate-200 font-sans">
              <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                    <div className="size-12 rounded-full bg-[#0f172a] text-[#d4af37] grid place-items-center shrink-0">
                      <Truck className="size-6" />
                    </div>
                    <div>
                      <h5 className="font-bold text-sm text-slate-900">توصيل سريع لكافة المحافظات</h5>
                      <p className="text-[11px] text-slate-500 mt-0.5">شحن آمن بعلب مبطنة</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                    <div className="size-12 rounded-full bg-[#0f172a] text-[#d4af37] grid place-items-center shrink-0">
                      <ShieldCheck className="size-6" />
                    </div>
                    <div>
                      <h5 className="font-bold text-sm text-slate-900">معاينة وتجربة قبل الدفع</h5>
                      <p className="text-[11px] text-slate-500 mt-0.5">افحص العبوة والرائحة عند الباب</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                    <div className="size-12 rounded-full bg-[#0f172a] text-[#d4af37] grid place-items-center shrink-0">
                      <Award className="size-6" />
                    </div>
                    <div>
                      <h5 className="font-bold text-sm text-slate-900">أصلي ومضمون 100%</h5>
                      <p className="text-[11px] text-slate-500 mt-0.5">زيوت فرنسية وشرقية نقية</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                    <div className="size-12 rounded-full bg-[#0f172a] text-[#d4af37] grid place-items-center shrink-0">
                      <PhoneCall className="size-6" />
                    </div>
                    <div>
                      <h5 className="font-bold text-sm text-slate-900">خدمة عملاء مباشرة</h5>
                      <p className="text-[11px] text-slate-500 mt-0.5">استشارات روائح وواتساب سريع</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* 7. Classic Luxury Footer */}
      <footer className="bg-[#0f172a] text-slate-300 text-xs mt-auto font-sans">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-full bg-[#d4af37] text-slate-950 grid place-items-center">
                  <Sparkles className="size-4" />
                </div>
                <h4 className="font-black text-white text-base font-serif italic">{storeName}</h4>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-400">
                دار العطور والجمال الراقية في العراق، نقدم لك تجربة عطرية أصيلة وثابتة مع ميزة المعاينة قبل الدفع.
              </p>
            </div>

            <div>
              <h5 className="font-bold text-white text-sm mb-3">عائلات العطور</h5>
              <ul className="space-y-2 text-[11px]">
                {categories.slice(0, 5).map(cat => (
                  <li key={cat}>
                    <button
                      type="button"
                      onClick={() => {
                        onSelectCategory(cat);
                        setCurrentPage('shop');
                      }}
                      className="hover:text-[#d4af37] transition-colors"
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-white text-sm mb-3">روابط وتصفح</h5>
              <ul className="space-y-2 text-[11px]">
                <li>
                  <button type="button" onClick={() => setCurrentPage('shop')} className="hover:text-[#d4af37] transition-colors">
                    جميع العطور
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => setCurrentPage('cart')} className="hover:text-[#d4af37] transition-colors">
                    حقيبة التسوق
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => setCurrentPage('account')} className="hover:text-[#d4af37] transition-colors">
                    حسابي وسجل الطلبات
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => setCurrentPage('contact')} className="hover:text-[#d4af37] transition-colors">
                    تواصل معنا
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h5 className="font-bold text-white text-sm">التوصيل وخدمة العراق</h5>
              <p className="text-[11px] text-slate-400">
                شحن لجميع المحافظات: بغداد، النجف، كربلاء، البصرة، أربيل، السليمانية وغيرها.
              </p>
              <div className="font-mono text-[#d4af37] font-bold text-xs">
                📞 0770 000 0000
              </div>
              <div className="text-[10px] text-slate-500">
                الدفع: نقد عند الاستلام (COD) • زين كاش • ماستركارد
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-500">
            <div>
              © {new Date().getFullYear()} {storeName}. جميع الحقوق محفوظة • مدعوم بواسطة الزعيم Al-Zaeem
            </div>
            <div className="flex items-center gap-3">
              <span>سياسة الخصوصية والاسترجاع</span>
              <span>•</span>
              <span>الشروط والأحكام</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
