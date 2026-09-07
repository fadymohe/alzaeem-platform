import React, { useState } from 'react';
import {
  ShoppingBag, Search, Heart, User, ArrowLeft, ArrowRight,
  Truck, ShieldCheck, Sparkles, Star, ChevronDown, CheckCircle2,
  PhoneCall, Sparkle, Wand2, Eye
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
    <div className="min-h-screen bg-[#fdfafc] text-slate-900 font-sans antialiased selection:bg-[#7209b7] selection:text-white" dir="rtl">
      
      {/* 1. Top Deep Magenta Bar */}
      <div className="bg-[#7209b7] text-white text-[11px] font-black py-2 px-4 md:px-8 text-center shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <span className="flex items-center gap-1.5 mx-auto sm:mx-0">
            <Sparkles className="size-3.5 text-pink-300" />
            <span>صالون وعناية MANE — مستحضرات تجميل أصلية 100% مع شحن سريع لجميع محافظات العراق</span>
          </span>
          <div className="hidden sm:flex items-center gap-4 text-xs font-bold text-pink-100">
            <span>دفع عند الاستلام</span>
            <span>ضمان الأصالة والجودة</span>
          </div>
        </div>
      </div>

      {/* 2. Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-pink-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            {logoUrl ? (
              <img src={logoUrl} alt={storeName} className="h-10 w-auto max-w-[140px] object-contain rounded-xl border border-pink-200" />
            ) : (
              <div className="flex items-center gap-2.5">
                <div className="size-10 rounded-2xl bg-gradient-to-tr from-[#7209b7] to-[#f72585] text-white font-black grid place-items-center text-lg shadow-md shadow-purple-500/20">
                  <Wand2 className="size-5" />
                </div>
                <div>
                  <h1 className="font-extrabold text-xl text-[#7209b7] tracking-tight">{storeName}</h1>
                  <span className="text-[10px] font-mono text-pink-600 dir-ltr block mt-0.5">{fullDomain}</span>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-black text-[#5c1d6f]">
            {['الرئيسية', 'العناية بالبشرة', 'مستحضرات الشعر', 'عطور حصرية', 'عروض التوفير'].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setActiveTab(item)}
                className={`py-1 transition-all hover:text-[#7209b7] relative ${
                  activeTab === item ? 'text-[#7209b7] font-black' : ''
                }`}
              >
                {item}
                {activeTab === item && (
                  <span className="absolute -bottom-2 right-0 left-0 h-0.5 bg-[#7209b7] rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Search & Actions */}
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block w-56">
              <Search className="absolute right-3.5 top-2.5 size-4 text-purple-300" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="ابحثي عن مستحضر..."
                className="w-full h-9 pr-10 pl-4 rounded-full border border-pink-200 bg-pink-50/50 text-xs text-slate-800 placeholder:text-pink-300 focus:outline-none focus:border-[#7209b7]"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('mane-grid');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#7209b7] hover:bg-[#5c1d6f] text-white font-black text-xs shadow-md shadow-purple-600/20 transition-all hover:scale-105"
            >
              <ShoppingBag className="size-4" />
              <span>السلة ({cartCount})</span>
            </button>
          </div>
        </div>
      </header>

      {/* 3. Hero Transformation Banner (Matching Screenshot 5 Mane) */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mt-5">
        <div className="rounded-3xl overflow-hidden bg-gradient-to-r from-[#3c096c] via-[#5c1d6f] to-[#7209b7] text-white p-8 md:p-12 relative shadow-xl">
          <div className="max-w-xl space-y-4 text-right relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-white/20 text-pink-200 border border-white/30 backdrop-blur-sm">
              <Sparkles className="size-3.5 text-pink-300" />
              تحول كامل وإشراقة طبيعية مع أفضل التركيبات
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold leading-tight text-white">
              سر الجمال والتألق بلمسة احترافية
            </h2>
            <p className="text-xs md:text-sm text-pink-100/90 leading-relaxed font-medium">
              مجموعات عناية متكاملة مختبرة معتمدة، تسوقي الآن واستفيدي من خدمة الشحن الفوري والدفع عند الاستلام.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('mane-grid');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3 rounded-full bg-white text-[#7209b7] font-black text-xs shadow-xl hover:bg-pink-50 transition-all hover:scale-105 flex items-center gap-2"
              >
                <span>تسوقي المنتجات الآن</span>
                <ArrowLeft className="size-4" />
              </button>
              <span className="text-xs font-bold text-pink-200 flex items-center gap-1.5 bg-black/20 px-3.5 py-2.5 rounded-full border border-white/10">
                <Truck className="size-4 text-pink-300" /> توصيل لجميع المحافظات
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Products Grid */}
      <section id="mane-grid" className="max-w-7xl mx-auto px-4 md:px-8 mt-10 mb-16">
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-pink-100">
          <div>
            <h3 className="font-extrabold text-2xl text-[#3c096c]">أبرز المجموعات والعناية</h3>
            <p className="text-xs text-pink-700/70 mt-0.5">مستحضرات أصلية 100% بضمان الجودة</p>
          </div>
          <span className="text-xs font-mono font-bold text-[#7209b7] bg-pink-100 px-3 py-1 rounded-full">
            {filteredProducts.length} منتج
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-3xl border border-pink-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:border-[#7209b7] hover:-translate-y-1"
            >
              <div>
                <div className="h-64 bg-pink-50/50 relative overflow-hidden">
                  <img
                    src={p.imageUrl || '/templates/store-nova.jpg'}
                    alt={p.name}
                    className="size-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 right-3 text-[10px] font-black bg-white/95 text-[#7209b7] px-3 py-1 rounded-full border border-pink-200 shadow-sm">
                    {p.category}
                  </span>
                </div>

                <div className="p-4 text-right space-y-1.5">
                  <h4 className="font-extrabold text-sm text-[#3c096c] line-clamp-1 group-hover:text-[#7209b7] transition-colors">
                    {p.name}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {p.description || 'مستحضر أصلي عالي الفعالية مع شحن سريع لجميع محافظات العراق والدفع عند الاستلام.'}
                  </p>
                </div>
              </div>

              <div className="p-4 border-t border-pink-50 bg-[#fdf7fa] flex items-center justify-between">
                <div>
                  <span className="text-sm font-black font-mono text-[#7209b7] block">
                    {formatIQD(p.price)}
                  </span>
                  {p.compareAtPrice && (
                    <span className="text-[11px] text-slate-400 line-through font-mono">
                      {formatIQD(p.compareAtPrice)}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => onQuickBuy(p)}
                  className="px-4 py-2 rounded-full text-xs font-black bg-[#7209b7] hover:bg-[#5c1d6f] text-white shadow-md shadow-purple-600/20 flex items-center gap-1.5 transition-all hover:scale-105"
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
      <footer className="bg-[#240046] text-pink-200 text-xs py-10 px-4 border-t border-purple-950">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-right">
          <div>
            <h5 className="font-extrabold text-base text-white">{storeName}</h5>
            <p className="text-xs text-pink-300/70 mt-1">المتجر المتخصص في مستحضرات التجميل والعناية بالبشرة والشعر في العراق.</p>
          </div>
          <div className="flex items-center gap-6 text-xs text-pink-300">
            <span>توصيل 18 محافظة</span>
            <span>دفع عند الاستلام</span>
            <span>ضمان الأصالة 100%</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default StoreManeTheme;
