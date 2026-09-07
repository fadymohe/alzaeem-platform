import React, { useState } from 'react';
import {
  ShoppingBag, Search, Heart, User, ArrowLeft, ArrowRight,
  Truck, ShieldCheck, Sparkles, Star, ChevronDown, CheckCircle2,
  PhoneCall, Baby, Leaf, Sun, Flower2, HeartHandshake
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
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onQuickBuy,
  logoUrl
}: ThemeComponentProps) {
  const [activeTab, setActiveTab] = useState('الرئيسية');

  // Categories
  const categories = ['الكل', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];

  const kidsCategories = [
    { name: 'ملابس الرضع', count: '12 منتج', icon: '🍼', color: 'bg-[#e8efe9]' },
    { name: 'ألعاب ودمى لينة', count: '18 منتج', icon: '🧸', color: 'bg-[#f4efe6]' },
    { name: 'أزياء أولاد', count: '15 منتج', icon: '👕', color: 'bg-[#e7eef4]' },
    { name: 'فساتين بنات', count: '22 منتج', icon: '👗', color: 'bg-[#faebee]' },
    { name: 'أحذية ومستلزمات', count: '9 منتجات', icon: '👟', color: 'bg-[#f5f1e8]' },
    { name: 'غرف ومفروشات أطفال', count: '7 منتجات', icon: '🛏️', color: 'bg-[#edf3ee]' },
  ];

  return (
    <div className="min-h-screen bg-[#f7f6f2] text-[#333d29] font-sans antialiased selection:bg-[#588157] selection:text-white" dir="rtl">
      
      {/* 1. Top Olive Announcement Bar */}
      <div className="bg-[#435135] text-[#e9edc9] text-xs py-2 px-4 md:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 font-bold">
              <Leaf className="size-3.5 text-[#ccd5ae]" />
              <span>أزياء ومستلزمات أطفال طبيعية 100% بروح الطبيعة والحديقة</span>
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-semibold text-[#fefae0]">
            <span>🌿 قطن عضوي آمن لبشرة طفلك</span>
            <span className="hidden sm:inline">|</span>
            <span className="hidden sm:inline">🚚 توصيل سريع لكافة محافظات العراق</span>
          </div>
        </div>
      </div>

      {/* 2. Main Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-[#e0ddcf] sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          
          {/* Logo & Store Info */}
          <div className="flex items-center gap-3">
            {logoUrl ? (
              <img src={logoUrl} alt={storeName} className="h-10 w-auto max-w-[140px] object-contain rounded-xl border border-[#ccd5ae]" />
            ) : (
              <div className="flex items-center gap-2.5">
                <div className="size-11 rounded-2xl bg-gradient-to-tr from-[#588157] to-[#a3b18a] text-white font-black grid place-items-center text-xl shadow-md shadow-[#588157]/20">
                  <Baby className="size-6" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-xl text-[#344e41] tracking-tight">{storeName}</span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-[#588157] text-white">SPROUT</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#588157] dir-ltr block mt-0.5">
                    {fullDomain}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-black text-[#3a5a40]">
            {['الرئيسية', 'حديثي الولادة', 'أزياء الأطفال', 'ألعاب تعليمية', 'عروض الموسم'].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setActiveTab(item)}
                className={`py-1 transition-all hover:text-[#588157] relative ${
                  activeTab === item ? 'text-[#588157] font-black' : ''
                }`}
              >
                {item}
                {activeTab === item && (
                  <span className="absolute -bottom-2 right-0 left-0 h-0.5 bg-[#588157] rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Search Bar & Cart Actions */}
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block w-64">
              <Search className="absolute right-3.5 top-2.5 size-4 text-[#8b9b77]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="ابحث عن ملابس، ألعاب..."
                className="w-full h-9 pr-10 pl-4 rounded-full border border-[#ccd5ae] bg-[#f7f6f2] text-xs text-[#344e41] placeholder:text-[#99a888] focus:outline-none focus:border-[#588157] focus:bg-white transition-all"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('sprout-grid');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#588157] hover:bg-[#435135] text-white font-extrabold text-xs shadow-md shadow-[#588157]/20 transition-all hover:scale-105"
            >
              <ShoppingBag className="size-4" />
              <span>السلة ({cartCount})</span>
            </button>
          </div>
        </div>
      </header>

      {/* 3. Hero Section (Floating Collage with Olive & Ivory Palette matching Baseet Sprout) */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mt-6">
        <div className="rounded-3xl overflow-hidden bg-gradient-to-r from-[#e9ece3] via-[#f1f3ec] to-[#e4e8dc] border border-[#ccd5ae] p-8 md:p-14 relative shadow-sm">
          <div className="max-w-xl space-y-4 text-right relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black bg-[#435135] text-[#fefae0] shadow-sm">
              <Flower2 className="size-3.5 text-[#ccd5ae]" />
              تشكيلة سبراوت الطبيعية للأطفال
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-[#344e41] leading-tight tracking-tight">
              أناقة ناعمة وراحة تدوم لطفلك الصغير
            </h1>
            <p className="text-xs md:text-sm text-[#588157] leading-relaxed font-medium">
              خامات قطنية فائقة النعومة وتصاميم بروح البهجة، نوفرها لك مع ميزة فحص الشحنة قبل الاستلام والدفع عند الباب.
            </p>
            <div className="pt-3 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('sprout-grid');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3 rounded-full bg-[#435135] hover:bg-[#344e41] text-[#fefae0] font-black text-xs shadow-lg flex items-center gap-2 transition-transform hover:scale-105"
              >
                <span>تسوق تشكيلة الأطفال</span>
                <ArrowLeft className="size-4" />
              </button>
              <span className="text-xs font-bold text-[#588157] flex items-center gap-1.5 bg-white/80 px-3.5 py-2.5 rounded-full border border-[#ccd5ae]">
                <Truck className="size-4 text-[#588157]" /> توصيل سريع لكافة المحافظات
              </span>
            </div>
          </div>

          <div className="hidden lg:block absolute left-10 top-1/2 -translate-y-1/2 size-72 rounded-3xl bg-[#d8dfcf] border-2 border-white/60 shadow-xl overflow-hidden rotate-3">
            <img
              src="/templates/store-classic.jpg"
              alt="Sprout Collection"
              className="size-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 4. Popular Circular Categories */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mt-10">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-extrabold text-[#344e41]">أقسام المتجر المبهجة</h2>
            <p className="text-xs text-[#588157] mt-0.5">اختاري ما يناسب عمر واحتياج طفلك</p>
          </div>
          <span className="text-xs font-bold text-[#588157] hover:underline cursor-pointer">
            تصفح الكل ←
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {kidsCategories.map((c, i) => (
            <div
              key={i}
              onClick={() => onSelectCategory(c.name)}
              className={`p-4 rounded-3xl ${c.color} border border-[#e0ddcf] text-center space-y-2 cursor-pointer transition-all hover:scale-105 hover:shadow-md group`}
            >
              <div className="size-14 rounded-2xl bg-white shadow-sm mx-auto grid place-items-center text-2xl group-hover:scale-110 transition-transform">
                {c.icon}
              </div>
              <h4 className="font-extrabold text-xs text-[#344e41]">{c.name}</h4>
              <span className="text-[10px] text-[#588157] font-bold block">{c.count}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Trust Features */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mt-10">
        <div className="bg-white rounded-3xl border border-[#ccd5ae] p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="size-11 rounded-2xl bg-[#e9ece3] text-[#588157] grid place-items-center shrink-0">
              <Leaf className="size-5" />
            </div>
            <div>
              <h5 className="font-bold text-xs text-[#344e41]">أقمشة طبيعية آمنة</h5>
              <p className="text-[11px] text-[#718260]">قطن صحي 100% مناسب للأطفال</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="size-11 rounded-2xl bg-[#e9ece3] text-[#588157] grid place-items-center shrink-0">
              <Truck className="size-5" />
            </div>
            <div>
              <h5 className="font-bold text-xs text-[#344e41]">شحن سريع للباب</h5>
              <p className="text-[11px] text-[#718260]">تغطية شاملة لكل محافظات العراق</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="size-11 rounded-2xl bg-[#e9ece3] text-[#588157] grid place-items-center shrink-0">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <h5 className="font-bold text-xs text-[#344e41]">معاينة قبل الدفع</h5>
              <p className="text-[11px] text-[#718260]">افحص قياس وجودة القطعة براحتك</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="size-11 rounded-2xl bg-[#e9ece3] text-[#588157] grid place-items-center shrink-0">
              <HeartHandshake className="size-5" />
            </div>
            <div>
              <h5 className="font-bold text-xs text-[#344e41]">ضمان الاستبدال</h5>
              <p className="text-[11px] text-[#718260]">إمكانية تبديل المقاسات بكل سهولة</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Products Catalog Grid */}
      <section id="sprout-grid" className="max-w-7xl mx-auto px-4 md:px-8 mt-12 mb-16">
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#ccd5ae]">
          <div>
            <h3 className="font-extrabold text-2xl text-[#344e41]">أحدث التشكيلات المعروضة</h3>
            <p className="text-xs text-[#588157] mt-0.5">منتجات عالية الجودة متوفرة للتوصيل الفوري</p>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-md scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => onSelectCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 border ${
                  selectedCategory === cat
                    ? 'bg-[#588157] text-white border-[#588157] shadow-sm'
                    : 'bg-white text-[#344e41] border-[#ccd5ae] hover:border-[#588157]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-3xl border border-[#ccd5ae] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
            >
              <div>
                <div className="h-60 bg-[#f4efe6] relative overflow-hidden">
                  <img
                    src={p.imageUrl || '/templates/store-classic.jpg'}
                    alt={p.name}
                    className="size-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 right-3 text-[10px] font-black bg-white/95 text-[#435135] px-3 py-1 rounded-full border border-[#ccd5ae] shadow-sm">
                    {p.category}
                  </span>
                  <span className="absolute top-3 left-3 text-[10px] font-black bg-[#588157] text-white px-2.5 py-0.5 rounded-full">
                    شحن سريع
                  </span>
                </div>

                <div className="p-4 text-right space-y-1.5">
                  <h4 className="font-extrabold text-sm text-[#344e41] line-clamp-1 group-hover:text-[#588157] transition-colors">
                    {p.name}
                  </h4>
                  <p className="text-xs text-[#718260] line-clamp-2 leading-relaxed">
                    {p.description || 'قطعة أطفال راقية ومريحة مع خدمة الفحص عند الباب والدفع عند الاستلام.'}
                  </p>
                </div>
              </div>

              <div className="p-4 border-t border-[#e0ddcf] bg-[#fbfbf8] flex items-center justify-between">
                <div>
                  <span className="text-sm font-black font-mono text-[#435135] block">
                    {formatIQD(p.price)}
                  </span>
                  {p.compareAtPrice && (
                    <span className="text-[11px] text-[#99a888] line-through font-mono">
                      {formatIQD(p.compareAtPrice)}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => onQuickBuy(p)}
                  className="px-4 py-2 rounded-full text-xs font-black bg-[#588157] hover:bg-[#435135] text-white shadow-md shadow-[#588157]/20 flex items-center gap-1.5 transition-all hover:scale-105"
                >
                  <span>شراء فوري</span>
                  <ArrowLeft className="size-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="bg-[#435135] text-[#fefae0] text-xs py-12 px-4 border-t border-[#344e41]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-right">
          <div>
            <h5 className="font-extrabold text-base text-white">{storeName}</h5>
            <p className="text-xs text-[#ccd5ae] mt-1">المتجر المتخصص في مستلزمات وملابس الأطفال الآمنة في العراق.</p>
          </div>
          <div className="flex items-center gap-6 text-xs text-[#e9edc9]">
            <span className="flex items-center gap-1.5"><Truck className="size-4 text-[#ccd5ae]" /> شحن 18 محافظة</span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="size-4 text-[#ccd5ae]" /> معاينة قبل الاستلام</span>
            <span className="flex items-center gap-1.5"><PhoneCall className="size-4 text-[#ccd5ae]" /> دعم متواصل</span>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-[#588157]/40 text-center text-[11px] text-[#ccd5ae]">
          © {new Date().getFullYear()} {storeName}. جميع الحقوق محفوظة • مدعوم بواسطة منصة الزعيم
        </div>
      </footer>

    </div>
  );
}

export default StoreSproutTheme;
