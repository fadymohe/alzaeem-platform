import React, { useState } from 'react';
import {
  ShoppingBag, Search, Heart, User, ArrowLeft, ArrowRight,
  Truck, ShieldCheck, Sparkles, Star, ChevronDown, CheckCircle2,
  PhoneCall, Baby, Leaf, Sun, Flower2, HeartHandshake, MessageCircle,
  Clock, Shield, Tag, Plus, Check
} from 'lucide-react';
import { formatIQD } from '../../../data/iraqData';
import type { StoreProduct } from '../../../data/storeState';
import type { ThemeComponentProps } from '../store-classic';
import {
  ThemeShopView,
  ThemeCategoriesView,
  ThemeCartCheckoutView,
  ThemeAccountView,
  ThemeContactView
} from '../theme-common/ThemePages';

export function StoreSproutTheme({
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

  const brandColor = customization?.brandColor || '#4a6b47';
  const fontFamily = "'Readex Pro', 'Tajawal', sans-serif";
  const isEn = customization?.defaultLanguage === 'en';
  const announcement = customization?.announcementText || 'أزياء ومستلزمات أطفال طبيعية 100% • قطن عضوي آمن وتوصيل لكافة محافظات العراق مع فحص الشحنة';
  const heroTitle = customization?.heroTitle || (isEn ? 'Pure Softness for Little Ones' : 'أناقة ناعمة وراحة تدوم لطفلك الصغير');
  const heroSubtitle = customization?.heroSubtitle || (isEn ? 'Organic fabrics and playful designs with safe inspection before payment' : 'خامات قطنية فائقة النعومة وتصاميم بروح البهجة، نوفرها لك مع ميزة فحص الشحنة قبل الاستلام والدفع عند الاستلام.');
  const heroBtnText = customization?.heroButtonText || (isEn ? 'Shop Collection' : 'تسوق التشكيلة الآن');

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
      className="min-h-screen bg-[#fbfaf8] text-[#283618] antialiased selection:bg-[#4a6b47] selection:text-white flex flex-col"
      style={{ fontFamily }}
      dir={isEn ? 'ltr' : 'rtl'}
    >
      {/* 1. Top Announcement Bar */}
      <div className="bg-[#4a6b47] text-[#fefae0] text-xs py-2 px-4 select-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-hidden truncate">
            <Leaf className="size-3.5 shrink-0 text-[#a3b18a] animate-bounce" />
            <span className="font-bold text-[11px] truncate">{announcement}</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-[11px] font-mono shrink-0">
            <span className="flex items-center gap-1 text-[#dad7cd]">
              <Truck className="size-3" />
              <span>توصيل سريع لكافة المحافظات</span>
            </span>
            <span>|</span>
            <span className="font-bold text-white">https://{fullDomain}</span>
          </div>
        </div>
      </div>

      {/* 2. Nature Playful Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-[#e9edc9] sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between gap-4">
          {/* Logo & Slogan */}
          <div
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => setCurrentPage('home')}
          >
            {logoUrl ? (
              <img src={logoUrl} alt={storeName} className="h-10 w-auto max-w-[140px] object-contain rounded-lg" />
            ) : (
              <div className="flex items-center gap-2">
                <div className="size-10 rounded-2xl bg-[#4a6b47] text-white grid place-items-center shadow-md shadow-[#4a6b47]/20">
                  <Baby className="size-6 text-[#fefae0]" />
                </div>
                <div>
                  <h1 className="font-black text-lg text-[#283618] tracking-tight leading-none">{storeName}</h1>
                  <span className="text-[10px] font-bold text-[#606c38] block mt-0.5">عالم طفلك الطبيعي</span>
                </div>
              </div>
            )}
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 bg-[#f4f3ee] p-1 rounded-2xl border border-[#e9edc9] text-xs font-bold">
            <button
              type="button"
              onClick={() => setCurrentPage('home')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                currentPage === 'home'
                  ? 'bg-[#4a6b47] text-white shadow-sm'
                  : 'text-[#606c38] hover:text-[#283618]'
              }`}
            >
              الرئيسية
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage('shop')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                currentPage === 'shop'
                  ? 'bg-[#4a6b47] text-white shadow-sm'
                  : 'text-[#606c38] hover:text-[#283618]'
              }`}
            >
              المتجر والمنتجات
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage('categories')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                currentPage === 'categories'
                  ? 'bg-[#4a6b47] text-white shadow-sm'
                  : 'text-[#606c38] hover:text-[#283618]'
              }`}
            >
              الأقسام
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage('contact')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                currentPage === 'contact'
                  ? 'bg-[#4a6b47] text-white shadow-sm'
                  : 'text-[#606c38] hover:text-[#283618]'
              }`}
            >
              تواصل معنا
            </button>
          </nav>

          {/* Right Action Icons: Search, Account, Cart */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (currentPage !== 'shop') setCurrentPage('shop');
                setSearchOpen(!searchOpen);
              }}
              className="size-9 rounded-xl bg-[#f4f3ee] hover:bg-[#e9edc9] text-[#283618] grid place-items-center transition-colors"
              title="بحث سريع"
            >
              <Search className="size-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                if (onOpenCustomerAuth) onOpenCustomerAuth();
                else setCurrentPage('account');
              }}
              className="size-9 rounded-xl bg-[#f4f3ee] hover:bg-[#e9edc9] text-[#283618] grid place-items-center transition-colors"
              title="حسابي"
            >
              <User className="size-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                if (onOpenCart) onOpenCart();
                else setCurrentPage('cart');
              }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#4a6b47] hover:bg-[#385336] text-white font-black text-xs transition-all shadow-md shadow-[#4a6b47]/20 active:scale-95"
            >
              <ShoppingBag className="size-4" />
              <span>السلة</span>
              <span className="size-4 rounded-full bg-[#fefae0] text-[#283618] text-[10px] grid place-items-center font-bold">
                {cartCount}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* 3. Main Body Routing */}
      <main className="flex-1">
        {currentPage === 'shop' && <ThemeShopView {...sharedPageProps} />}
        {currentPage === 'categories' && <ThemeCategoriesView {...sharedPageProps} />}
        {currentPage === 'cart' && <ThemeCartCheckoutView {...sharedPageProps} />}
        {currentPage === 'checkout' && <ThemeCartCheckoutView {...sharedPageProps} />}
        {currentPage === 'account' && <ThemeAccountView {...sharedPageProps} />}
        {currentPage === 'contact' && <ThemeContactView {...sharedPageProps} />}

        {currentPage === 'home' && (
          <div className="space-y-12 animate-fadeIn pb-16">
            {/* Playful Hero Banner with Soft Collage */}
            <section className="relative overflow-hidden bg-gradient-to-b from-[#e9edc9]/40 via-[#fefae0]/30 to-transparent py-12 md:py-20 px-4 md:px-8">
              <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Text Content */}
                <div className="lg:col-span-7 space-y-5 text-right">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ccd5ae]/50 text-[#283618] text-xs font-black border border-[#d4a373]/30">
                    <Flower2 className="size-4 text-[#bc6c25]" />
                    <span>أزياء ومستلزمات طبيعية 100% للأطفال</span>
                  </div>

                  <h1 className="text-3xl md:text-5xl font-black text-[#283618] leading-tight">
                    {heroTitle}
                  </h1>

                  <p className="text-sm md:text-base text-[#606c38] max-w-xl leading-relaxed">
                    {heroSubtitle}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setCurrentPage('shop')}
                      className="px-7 py-3.5 rounded-2xl bg-[#4a6b47] hover:bg-[#385336] text-white font-black text-sm shadow-xl shadow-[#4a6b47]/25 transition-all flex items-center gap-2 hover:scale-[1.02]"
                    >
                      <span>{heroBtnText}</span>
                      <ArrowLeft className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentPage('categories')}
                      className="px-6 py-3.5 rounded-2xl bg-white border border-[#ccd5ae] text-[#283618] hover:bg-[#f4f3ee] font-black text-sm transition-all"
                    >
                      تصفح الأقسام
                    </button>
                  </div>

                  {/* Trust Highlights */}
                  <div className="grid grid-cols-3 gap-3 pt-6 border-t border-[#e9edc9] text-xs">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="size-5 text-[#4a6b47] shrink-0" />
                      <div>
                        <span className="font-black block text-[#283618]">قطن عضوي</span>
                        <span className="text-[10px] text-[#606c38]">آمن لبشرة طفلك</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Truck className="size-5 text-[#4a6b47] shrink-0" />
                      <div>
                        <span className="font-black block text-[#283618]">شحن سريع</span>
                        <span className="text-[10px] text-[#606c38]">لكافة محافظات العراق</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <HeartHandshake className="size-5 text-[#4a6b47] shrink-0" />
                      <div>
                        <span className="font-black block text-[#283618]">فحص قبل الدفع</span>
                        <span className="text-[10px] text-[#606c38]">دفع عند الاستلام</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hero Showcase Images */}
                <div className="lg:col-span-5 relative">
                  <div className="relative aspect-[4/5] rounded-[36px] overflow-hidden border-4 border-white shadow-2xl bg-white">
                    <img
                      src="https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&auto=format&fit=crop&q=80"
                      alt="Sprout Kids"
                      className="size-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-5 right-5 left-5 text-white text-right space-y-1">
                      <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-[#4a6b47] inline-block">
                        الأكثر طلباً للأمهات
                      </span>
                      <h3 className="text-xl font-black">أطقم رضع ناعمة وأنيقة</h3>
                      <p className="text-xs text-[#fefae0]">توصيل مباشر مع شركة الزعيم للشحن</p>
                    </div>
                  </div>

                  {/* Floating Circular Badge */}
                  <div className="absolute -top-4 -right-4 size-20 rounded-full bg-[#d4a373] text-white p-2 flex flex-col items-center justify-center text-center font-black shadow-xl animate-pulse">
                    <span className="text-[10px]">خصم</span>
                    <span className="text-base leading-none">25%</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Circular Category Explorer */}
            <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-[#283618] flex items-center gap-2">
                  <Sun className="size-5 text-[#bc6c25]" />
                  <span>تصفح حسب فئة الطفل</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setCurrentPage('categories')}
                  className="text-xs font-black text-[#4a6b47] hover:underline flex items-center gap-1"
                >
                  <span>عرض كل الأقسام</span>
                  <ArrowLeft className="size-3" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                {categories.slice(0, 6).map((cat, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      onSelectCategory(cat);
                      setCurrentPage('shop');
                    }}
                    className="p-3 rounded-2xl bg-white border border-[#e9edc9] text-center space-y-2 cursor-pointer transition-all hover:shadow-lg hover:border-[#4a6b47] group"
                  >
                    <div className="size-14 mx-auto rounded-full bg-[#f4f3ee] group-hover:bg-[#e9edc9] transition-colors grid place-items-center text-[#4a6b47]">
                      <Baby className="size-7" />
                    </div>
                    <span className="text-xs font-black text-[#283618] block">{cat}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Featured Products Grid */}
            <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#e9edc9]">
                <div>
                  <h3 className="text-xl font-black text-[#283618]">مختارات سبراوت المميزة للأطفال</h3>
                  <p className="text-xs text-[#606c38] mt-0.5">قطع قطنية طبيعية أصلية مختارة لتناسب يوميات طفلك</p>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentPage('shop')}
                  className="px-4 py-2 rounded-xl bg-[#4a6b47] text-white font-black text-xs hover:bg-[#385336] transition-colors"
                >
                  عرض الكتالوج الكامل
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {products.slice(0, 8).map((prod) => (
                  <div
                    key={prod.id}
                    className="rounded-3xl border border-[#e9edc9] bg-white overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div
                      className="relative aspect-square overflow-hidden bg-[#f4f3ee] cursor-pointer"
                      onClick={() => onOpenProductDetail?.(prod)}
                    >
                      <img
                        src={prod.imageUrl}
                        alt={prod.name}
                        className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#4a6b47] text-white">
                        {prod.category || 'أطفال'}
                      </span>
                    </div>

                    <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                      <div>
                        <h4
                          className="font-black text-xs md:text-sm text-[#283618] line-clamp-2 cursor-pointer hover:text-[#4a6b47]"
                          onClick={() => onOpenProductDetail?.(prod)}
                        >
                          {prod.name}
                        </h4>
                        <p className="text-[10px] text-[#606c38] mt-1 line-clamp-1">{prod.description}</p>
                      </div>

                      <div className="pt-2 border-t border-[#e9edc9] space-y-2">
                        <div className="flex items-baseline justify-between">
                          <span className="font-mono font-black text-sm md:text-base text-[#283618]">
                            {formatIQD(prod.price)}
                          </span>
                          {prod.compareAtPrice && prod.compareAtPrice > prod.price && (
                            <span className="font-mono text-[10px] text-slate-400 line-through">
                              {formatIQD(prod.compareAtPrice)}
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => onQuickBuy(prod)}
                            className="py-2 rounded-xl text-xs font-black bg-[#4a6b47] hover:bg-[#385336] text-white shadow-sm transition-all"
                          >
                            شراء سريع
                          </button>
                          <button
                            type="button"
                            onClick={() => onAddToCart?.(prod)}
                            className="py-2 rounded-xl text-xs font-bold bg-[#f4f3ee] hover:bg-[#e9edc9] text-[#283618] transition-all"
                          >
                            + السلة
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </main>

      {/* 4. Rich Sprout Nature Footer */}
      <footer className="bg-[#283618] text-[#fefae0] pt-12 pb-6 px-4 md:px-8 border-t border-[#385336]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-8 border-b border-[#385336] text-right">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Baby className="size-6 text-[#a3b18a]" />
              <h4 className="font-black text-lg text-white">{storeName}</h4>
            </div>
            <p className="text-xs text-[#dad7cd] leading-relaxed">
              واجهة ملابس أطفال بروح الطبيعة، نوفر خامات قطنية آمنة تدوم مع شحن فوري لكافة محافظات العراق.
            </p>
          </div>

          <div className="space-y-2 text-xs">
            <h5 className="font-black text-white text-sm">روابط المتجر</h5>
            <div className="flex flex-col gap-1.5 text-[#dad7cd]">
              <button type="button" onClick={() => setCurrentPage('home')} className="hover:text-white text-right">الرئيسية</button>
              <button type="button" onClick={() => setCurrentPage('shop')} className="hover:text-white text-right">جميع المنتجات</button>
              <button type="button" onClick={() => setCurrentPage('categories')} className="hover:text-white text-right">التصنيفات</button>
              <button type="button" onClick={() => setCurrentPage('contact')} className="hover:text-white text-right">تواصل معنا</button>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <h5 className="font-black text-white text-sm">ضمانات التسوق</h5>
            <div className="flex flex-col gap-1.5 text-[#dad7cd]">
              <span>✓ فحص الشحنة قبل الاستلام</span>
              <span>✓ قطن عضوي آمن بنسبة 100%</span>
              <span>✓ توصيل لكافة محافظات العراق مع شركة الزعيم</span>
              <span>✓ دفع آمن عند الاستلام</span>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <h5 className="font-black text-white text-sm">الدعم والمساعدة</h5>
            <p className="text-[#dad7cd]">اتصل بنا مباشرة لأي استفسار أو طلب خاص:</p>
            <a href="tel:+9647700000000" className="font-mono font-bold text-[#a3b18a] block text-sm">
              📞 +964 770 000 0000
            </a>
            <span className="text-[10px] text-[#dad7cd] block">نطاق المتجر: https://{fullDomain}</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 flex flex-wrap items-center justify-between gap-3 text-xs text-[#dad7cd]">
          <span>© {new Date().getFullYear()} {storeName}. جميع الحقوق محفوظة • مدعوم بواسطة الزعيم</span>
          <span className="font-mono text-[11px] text-[#a3b18a]">قالب سبراوت المعتمد — Sprout Organic</span>
        </div>
      </footer>
    </div>
  );
}
export default StoreSproutTheme;
