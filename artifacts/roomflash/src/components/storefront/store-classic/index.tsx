import React from 'react';
import {
  ShoppingBag, Search, Star, ArrowLeft, Truck, ShieldCheck,
  Sparkles, CheckCircle2, Phone, MapPin, Heart, Clock
} from 'lucide-react';
import { formatIQD } from '../../../data/iraqData';
import type { StoreProduct } from '../../../data/storeState';

export interface ThemeComponentProps {
  storeName: string;
  subdomain: string;
  fullDomain: string;
  products: StoreProduct[];
  filteredProducts: StoreProduct[];
  cartCount: number;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onQuickBuy: (product: StoreProduct) => void;
  onAddToCart?: (product: StoreProduct) => void;
  logoUrl?: string;
  storeCode?: string;
}

export function StoreClassicTheme({
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
  const categories = ['الكل', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];

  return (
    <div className="min-h-screen bg-[#0d1117] text-slate-100 font-sans antialiased selection:bg-amber-500 selection:text-slate-950">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-amber-700 via-amber-600 to-amber-800 text-white text-[11px] font-bold py-1.5 px-4 text-center tracking-wide flex items-center justify-center gap-2 shadow-sm">
        <Sparkles className="size-3.5 animate-spin" style={{ animationDuration: '4s' }} />
        <span>قالب كلاسيك الفاخر • شحن سريع لكافة محافظات العراق والدفع عند الاستلام</span>
        <span className="hidden sm:inline bg-black/20 px-2 py-0.5 rounded-full text-[10px]">ضمان 100%</span>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#161b22]/95 backdrop-blur-md border-b border-amber-900/30 px-4 md:px-8 py-3.5 transition-all shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            {logoUrl ? (
              <img src={logoUrl} alt={storeName} className="size-11 rounded-2xl object-cover border border-amber-500/30 shadow-md" />
            ) : (
              <div className="size-11 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-slate-950 font-black grid place-items-center text-xl shadow-md border border-amber-400/40">
                {storeName.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h1 className="font-black text-base text-amber-100 leading-none tracking-tight">{storeName}</h1>
              <span className="text-[11px] font-mono font-bold text-amber-400/80 dir-ltr block mt-1">
                https://{fullDomain}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative hidden md:block w-72">
              <Search className="absolute right-3.5 top-2.5 size-4 text-amber-400/60" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="ابحث في التشكيلة الكلاسيكية..."
                className="w-full h-9 pr-10 pl-4 rounded-full border border-amber-900/40 bg-[#0d1117]/80 text-xs text-amber-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-md transition-transform hover:scale-105"
            >
              <ShoppingBag className="size-4" />
              <span>السلة ({cartCount})</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mt-6">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#1c1917] via-[#161b22] to-[#0f141c] border border-amber-900/40 p-8 md:p-12 min-h-[320px] flex items-center shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-xl space-y-4 text-right">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black bg-amber-950/80 border border-amber-700/60 text-amber-300">
              <Star className="size-3.5 fill-amber-400 text-amber-400" />
              أصالة التراث وفخامة المنتجات الكلاسيكية
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-amber-50 leading-tight">
              أفضل المقتنيات والعطور والمنتجات المختارة
            </h2>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              تسوق الآن بكل ثقة مع ضمان الاستبدال والشحن السريع والدفع عند الاستلام في كافة المحافظات العراقية.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('classic-products');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3 rounded-2xl text-xs font-black bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-lg flex items-center gap-2 transition-all hover:scale-105"
              >
                <span>استكشف المنتجات الآن</span>
                <ArrowLeft className="size-4" />
              </button>
              <span className="text-xs font-bold text-amber-300/80 flex items-center gap-1.5 bg-black/40 px-3 py-2 rounded-xl border border-amber-900/30">
                <Truck className="size-4 text-amber-400" /> شحن وتوصيل لجميع المحافظات (IQD)
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Bar */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mt-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => onSelectCategory(cat)}
              className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all border shrink-0 ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md scale-105'
                  : 'bg-[#161b22] text-slate-300 border-amber-950 hover:border-amber-800/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Products Grid */}
      <section id="classic-products" className="max-w-7xl mx-auto px-4 md:px-8 mt-8">
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-amber-900/20">
          <div>
            <h3 className="font-black text-xl text-amber-100">تشكيلة المتجر الكلاسيكي</h3>
            <p className="text-xs text-slate-400 mt-0.5">منتجات مضمونة بأعلى معايير الجودة</p>
          </div>
          <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/60 px-3 py-1 rounded-full border border-amber-800/40">
            {filteredProducts.length} منتج متاح
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className="rounded-3xl border border-amber-900/30 bg-[#161b22] overflow-hidden shadow-xl flex flex-col justify-between group transition-all duration-300 hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-500/5 hover:-translate-y-1"
            >
              <div>
                <div className="h-64 bg-[#0d1117] relative overflow-hidden">
                  <img
                    src={p.imageUrl || '/templates/store-classic.jpg'}
                    alt={p.name}
                    className="size-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 right-3 text-[10px] font-black bg-black/80 backdrop-blur-md text-amber-300 px-3 py-1 rounded-full border border-amber-500/30">
                    {p.category}
                  </span>
                  <span className="absolute top-3 left-3 text-[10px] font-black bg-amber-600 text-slate-950 px-2.5 py-1 rounded-full">
                    شحن لجميع المحافظات
                  </span>
                </div>

                <div className="p-5 text-right space-y-2">
                  <h4 className="font-black text-base text-amber-50 line-clamp-1 group-hover:text-amber-300 transition-colors">
                    {p.name}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {p.description || 'منتج أصلي عالي الجودة مع شحن سريع لجميع محافظات العراق والدفع عند الاستلام.'}
                  </p>
                </div>
              </div>

              <div className="p-5 border-t border-amber-900/20 bg-[#12161d] flex items-center justify-between">
                <div>
                  <span className="text-base font-black font-mono text-amber-300 block">{formatIQD(p.price)}</span>
                  {p.compareAtPrice && (
                    <span className="text-xs text-slate-500 line-through font-mono">{formatIQD(p.compareAtPrice)}</span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => onQuickBuy(p)}
                  className="px-4 py-2.5 rounded-2xl text-xs font-black bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md flex items-center gap-1.5 transition-all hover:scale-105"
                >
                  <span>شراء فوري</span>
                  <ArrowLeft className="size-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-20 border-t border-amber-900/30 bg-[#0a0e14] py-10 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} {storeName}. جميع الحقوق محفوظة • مدعوم بواسطة منصة الزعيم</p>
          <div className="flex items-center gap-4 text-slate-400 text-xs">
            <span className="flex items-center gap-1"><Truck className="size-3.5 text-amber-400" /> توصيل سريع</span>
            <span className="flex items-center gap-1"><ShieldCheck className="size-3.5 text-amber-400" /> دفع عند الاستلام</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default StoreClassicTheme;
