import React, { useState } from 'react';
import {
  ShoppingBag, Search, Heart, User, ArrowLeft, ArrowRight,
  Truck, ShieldCheck, Sparkles, Star, ChevronDown, CheckCircle2,
  PhoneCall, Home, Sofa, Lamp
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
  logoUrl
}: ThemeComponentProps) {
  const [activeTab, setActiveTab] = useState('الرئيسية');

  const categories = ['الكل', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];

  return (
    <div className="min-h-screen bg-[#f7f5f0] text-[#2b2927] font-sans antialiased selection:bg-[#8b5a2b] selection:text-white" dir="rtl">
      
      {/* 1. Top Earthy Banner */}
      <div className="bg-[#3e3835] text-[#e8e2d8] text-[11px] font-bold py-2 px-4 md:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <span className="flex items-center gap-1.5">
            <Home className="size-3.5 text-[#d4b996]" />
            <span>لوفتورا — ديكور منزلي راقي، قطع أثاث وتحف خشبية وفخارية متميزة</span>
          </span>
          <div className="flex items-center gap-4 text-xs text-[#d4b996]">
            <span>شحن آمن مع تغليف مضاد للكسر</span>
            <span className="hidden sm:inline">|</span>
            <span className="hidden sm:inline">معاينة قبل الاستلام</span>
          </div>
        </div>
      </div>

      {/* 2. Natural Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-[#e2dcd2] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            {logoUrl ? (
              <img src={logoUrl} alt={storeName} className="h-10 w-auto max-w-[140px] object-contain rounded-xl border border-[#d4b996]" />
            ) : (
              <div className="flex items-center gap-2.5">
                <div className="size-10 rounded-2xl bg-gradient-to-tr from-[#8b5a2b] to-[#c19a6b] text-white font-black grid place-items-center text-lg shadow-md shadow-[#8b5a2b]/20">
                  <Sofa className="size-5" />
                </div>
                <div>
                  <h1 className="font-serif font-black text-xl text-[#3e3835] tracking-tight">{storeName}</h1>
                  <span className="text-[10px] font-mono text-[#8b5a2b] dir-ltr block mt-0.5">{fullDomain}</span>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-[#5c534e]">
            {['الرئيسية', 'الأثاث العصري', 'إضاءة وديكور', 'أواني وتحف', 'المجموعات الحجرية'].map((item) => (
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

          {/* Search & Cart */}
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block w-56">
              <Search className="absolute right-3.5 top-2.5 size-4 text-[#a89f91]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="ابحث عن أثاث، ديكور..."
                className="w-full h-9 pr-10 pl-4 rounded-xl border border-[#d8d0c5] bg-[#f7f5f0] text-xs text-[#3e3835] placeholder:text-[#a89f91] focus:outline-none focus:border-[#8b5a2b]"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('loftora-grid');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#8b5a2b] hover:bg-[#6e4620] text-white font-black text-xs shadow-md shadow-[#8b5a2b]/20 transition-all hover:scale-105"
            >
              <ShoppingBag className="size-4" />
              <span>السلة ({cartCount})</span>
            </button>
          </div>
        </div>
      </header>

      {/* 3. Room Scene Mosaic Banner (Matching Screenshot 5 Loftora) */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mt-5">
        <div className="rounded-3xl overflow-hidden bg-gradient-to-r from-[#ded6c7] via-[#eae3d5] to-[#d8cfbe] border border-[#d4b996] p-8 md:p-12 relative shadow-sm">
          <div className="max-w-xl space-y-4 text-right relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-[#3e3835] text-[#e8e2d8]">
              <Lamp className="size-3.5 text-[#d4b996]" />
              واجهة ديكور منزلي مختارة بلمسة البلوط والطين
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-black text-[#2b2927] leading-tight">
              تفاصيل تصنع دفء بيتك وأناقة مساحتك
            </h2>
            <p className="text-xs md:text-sm text-[#6b625b] leading-relaxed font-medium">
              مجموعات أثاث وتحف حجرية تضفي سحراً فريداً على كل زاوية في منزلك، مع شحن آمن ومعاينة قبل الاستلام.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('loftora-grid');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3 rounded-xl bg-[#8b5a2b] hover:bg-[#6e4620] text-white font-black text-xs shadow-lg flex items-center gap-2 transition-transform hover:scale-105"
              >
                <span>استكشف الديكورات</span>
                <ArrowLeft className="size-4" />
              </button>
              <span className="text-xs font-bold text-[#6b625b] flex items-center gap-1.5 bg-white/80 px-3.5 py-2.5 rounded-xl border border-[#d8d0c5]">
                <Truck className="size-4 text-[#8b5a2b]" /> تغليف خاص مضاد للكسر لكافة المحافظات
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Products Grid */}
      <section id="loftora-grid" className="max-w-7xl mx-auto px-4 md:px-8 mt-10 mb-16">
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#e2dcd2]">
          <div>
            <h3 className="font-serif font-black text-2xl text-[#2b2927]">أبرز المجموعات والقطع</h3>
            <p className="text-xs text-[#8b5a2b] mt-0.5">خامات طبيعية وتصاميم عصرية مريحة</p>
          </div>
          <span className="text-xs font-mono font-bold text-[#3e3835] bg-[#e8e2d8] px-3 py-1 rounded-xl">
            {filteredProducts.length} قطعة
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl border border-[#e2dcd2] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:border-[#8b5a2b] hover:-translate-y-1"
            >
              <div>
                <div className="h-64 bg-[#f3efe8] relative overflow-hidden">
                  <img
                    src={p.imageUrl || '/templates/store-classic.jpg'}
                    alt={p.name}
                    className="size-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 right-3 text-[10px] font-black bg-white/95 text-[#3e3835] px-3 py-1 rounded-lg border border-[#e2dcd2] shadow-sm">
                    {p.category}
                  </span>
                </div>

                <div className="p-4 text-right space-y-1.5">
                  <h4 className="font-serif font-black text-sm text-[#2b2927] line-clamp-1 group-hover:text-[#8b5a2b] transition-colors">
                    {p.name}
                  </h4>
                  <p className="text-xs text-[#7d746d] line-clamp-2 leading-relaxed">
                    {p.description || 'قطعة ديكور وأثاث فاخرة مصنوعة بعناية مع شحن سريع ومعاينة قبل الاستلام.'}
                  </p>
                </div>
              </div>

              <div className="p-4 border-t border-[#f0ebe1] bg-[#fbf9f5] flex items-center justify-between">
                <div>
                  <span className="text-sm font-black font-mono text-[#8b5a2b] block">
                    {formatIQD(p.price)}
                  </span>
                  {p.compareAtPrice && (
                    <span className="text-[11px] text-[#a89f91] line-through font-mono">
                      {formatIQD(p.compareAtPrice)}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => onQuickBuy(p)}
                  className="px-4 py-2 rounded-xl text-xs font-black bg-[#8b5a2b] hover:bg-[#6e4620] text-white shadow-md shadow-[#8b5a2b]/20 flex items-center gap-1.5 transition-all hover:scale-105"
                >
                  <span>شراء فوري</span>
                  <ArrowLeft className="size-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Footer */}
      <footer className="bg-[#24201e] text-[#e8e2d8] text-xs py-10 px-4 border-t border-[#3e3835]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-right">
          <div>
            <h5 className="font-serif font-black text-base text-white">{storeName}</h5>
            <p className="text-xs text-[#a89f91] mt-1">المتجر المتخصص في الديكور المنزلي والتحف والأثاث الفاخر في العراق.</p>
          </div>
          <div className="flex items-center gap-6 text-xs text-[#d4b996]">
            <span>شحن 18 محافظة</span>
            <span>تغليف مضاد للكسر</span>
            <span>معاينة قبل الدفع</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default StoreLoftoraTheme;
