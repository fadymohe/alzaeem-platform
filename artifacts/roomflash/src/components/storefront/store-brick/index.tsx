import React from 'react';
import {
  ShoppingBag, Search, Star, ArrowLeft, Truck, ShieldCheck,
  Sparkles, Crown, Wrench, Shield
} from 'lucide-react';
import { formatIQD } from '../../../data/iraqData';
import type { StoreProduct } from '../../../data/storeState';
import type { ThemeComponentProps } from '../store-classic';

export function StoreBrickTheme({
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
    <div className="min-h-screen bg-[#121110] text-slate-100 font-sans antialiased selection:bg-orange-500 selection:text-slate-950">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-orange-600 to-amber-700 text-slate-950 font-black text-xs py-2 px-4 text-center flex items-center justify-center gap-2 shadow-md">
        <Crown className="size-4" />
        <span>ثيم بريك الاحترافي (PRO) • قوة الأداء والتحمل مع شحن سريع لجميع محافظات العراق</span>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#1a1816]/95 backdrop-blur-lg border-b border-orange-500/30 px-4 md:px-8 py-4 shadow-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {logoUrl ? (
              <img src={logoUrl} alt={storeName} className="size-11 rounded-xl object-cover border-2 border-orange-500/50" />
            ) : (
              <div className="size-11 rounded-xl bg-orange-500 text-slate-950 font-black grid place-items-center text-xl shadow-lg border border-orange-400">
                {storeName.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-base text-orange-50 leading-none">{storeName}</h1>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-orange-500 text-slate-950">PRO</span>
              </div>
              <span className="text-[11px] font-mono font-bold text-orange-400 dir-ltr block mt-1">
                https://{fullDomain}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative hidden md:block w-72">
              <Search className="absolute right-3.5 top-2.5 size-4 text-orange-400/60" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="ابحث في المتجر..."
                className="w-full h-9 pr-10 pl-4 rounded-xl border border-orange-900/50 bg-[#121110] text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500"
              />
            </div>

            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-black text-xs shadow-lg transition-transform hover:scale-105"
            >
              <ShoppingBag className="size-4" />
              <span>السلة ({cartCount})</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mt-6">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#211d1a] via-[#2a241f] to-[#1a1715] border-2 border-orange-500/30 p-8 md:p-12 min-h-[300px] flex items-center shadow-2xl">
          <div className="absolute top-0 right-0 size-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-xl space-y-4 text-right">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-xl text-xs font-black bg-orange-950 border border-orange-600 text-orange-300">
              <Shield className="size-3.5 text-orange-400" />
              متانة واحترافية • جودة عالية لا تقبل المساومة
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
              أقوى المعدات والمنتجات الأصلية
            </h2>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              تسوق الآن مع أفضل تجربة شراء فورية ودفع عند الاستلام مع فحص المنتج قبل الاستلام.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('brick-products');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3 rounded-xl text-xs font-black bg-orange-500 hover:bg-orange-400 text-slate-950 shadow-lg flex items-center gap-2 transition-transform hover:scale-105"
              >
                <span>ابدأ التسوق الآن</span>
                <ArrowLeft className="size-4" />
              </button>
              <span className="text-xs font-bold text-orange-300 flex items-center gap-1.5 bg-orange-950/60 px-3 py-2 rounded-xl border border-orange-800/40">
                <Truck className="size-4 text-orange-400" /> توصيل سريع لجميع المحافظات
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Category Pills */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mt-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => onSelectCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all border shrink-0 ${
                selectedCategory === cat
                  ? 'bg-orange-500 text-slate-950 border-orange-400 shadow-md scale-105'
                  : 'bg-[#1a1816] text-slate-300 border-orange-950 hover:border-orange-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Products Grid */}
      <section id="brick-products" className="max-w-7xl mx-auto px-4 md:px-8 mt-8">
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-orange-900/30">
          <div>
            <h3 className="font-black text-xl text-white">المنتجات المتوفرة</h3>
            <p className="text-xs text-slate-400 mt-0.5">معدات ومقتنيات مضمونة</p>
          </div>
          <span className="text-xs font-mono font-bold text-orange-400 bg-orange-950/80 px-3 py-1 rounded-xl border border-orange-800/40">
            {filteredProducts.length} منتج
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className="rounded-2xl border border-orange-900/40 bg-[#1a1816] overflow-hidden shadow-xl flex flex-col justify-between group transition-all duration-300 hover:border-orange-500/50 hover:shadow-2xl hover:shadow-orange-500/5 hover:-translate-y-1"
            >
              <div>
                <div className="h-64 bg-[#121110] relative overflow-hidden">
                  <img
                    src={p.imageUrl || '/templates/store-brick.jpg'}
                    alt={p.name}
                    className="size-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 right-3 text-[10px] font-black bg-slate-950/80 backdrop-blur-md text-orange-300 px-3 py-1 rounded-lg border border-orange-500/30">
                    {p.category}
                  </span>
                  <span className="absolute top-3 left-3 text-[10px] font-black bg-orange-500 text-slate-950 px-2.5 py-1 rounded-lg">
                    شحن لجميع المحافظات
                  </span>
                </div>

                <div className="p-5 text-right space-y-2">
                  <h4 className="font-black text-base text-white line-clamp-1 group-hover:text-orange-400 transition-colors">
                    {p.name}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {p.description || 'منتج أصلي عالي الجودة مع شحن سريع لجميع محافظات العراق والدفع عند الاستلام.'}
                  </p>
                </div>
              </div>

              <div className="p-5 border-t border-orange-900/30 bg-[#151312] flex items-center justify-between">
                <div>
                  <span className="text-base font-black font-mono text-orange-400 block">{formatIQD(p.price)}</span>
                  {p.compareAtPrice && (
                    <span className="text-xs text-slate-500 line-through font-mono">{formatIQD(p.compareAtPrice)}</span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => onQuickBuy(p)}
                  className="px-4 py-2.5 rounded-xl text-xs font-black bg-orange-500 hover:bg-orange-400 text-slate-950 shadow-md flex items-center gap-1.5 transition-all hover:scale-105"
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
      <footer className="mt-20 border-t border-orange-900/40 bg-[#0d0c0b] py-10 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} {storeName}. جميع الحقوق محفوظة • مدعوم بواسطة منصة الزعيم</p>
          <div className="flex items-center gap-4 text-orange-400 text-xs">
            <span className="flex items-center gap-1"><Truck className="size-3.5" /> توصيل سريع</span>
            <span className="flex items-center gap-1"><ShieldCheck className="size-3.5" /> دفع عند الاستلام</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default StoreBrickTheme;
