import React from 'react';
import {
  ShoppingBag, Search, Star, ArrowLeft, Truck, ShieldCheck,
  Sparkles, Crown, Cpu, Zap
} from 'lucide-react';
import { formatIQD } from '../../../data/iraqData';
import type { StoreProduct } from '../../../data/storeState';
import type { ThemeComponentProps } from '../store-classic';

export function StoreGizmoTheme({
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
    <div className="min-h-screen bg-[#070d18] text-slate-100 font-sans antialiased selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-emerald-600 text-slate-950 font-black text-xs py-2 px-4 text-center flex items-center justify-center gap-2 shadow-md">
        <Crown className="size-4" />
        <span>ثيم جيزمو سايبر تك (PRO) • أحدث الأجهزة الذكية والإلكترونيات مع شحن لكافة المحافظات</span>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0c1626]/90 backdrop-blur-lg border-b border-cyan-500/20 px-4 md:px-8 py-4 shadow-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {logoUrl ? (
              <img src={logoUrl} alt={storeName} className="size-11 rounded-2xl object-cover border border-cyan-500/40" />
            ) : (
              <div className="size-11 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-slate-950 font-black grid place-items-center text-xl shadow-lg">
                {storeName.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-base text-white leading-none">{storeName}</h1>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">PRO TECH</span>
              </div>
              <span className="text-[11px] font-mono text-cyan-400 dir-ltr block mt-1">
                https://{fullDomain}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative hidden md:block w-72">
              <Search className="absolute right-3.5 top-2.5 size-4 text-cyan-400/60" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="ابحث عن أجهزة وإلكترونيات..."
                className="w-full h-9 pr-10 pl-4 rounded-full border border-cyan-900/50 bg-[#070d18] text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs shadow-lg transition-transform hover:scale-105"
            >
              <ShoppingBag className="size-4" />
              <span>السلة ({cartCount})</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mt-6">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#0c182c] via-[#10223d] to-[#0a1424] border border-cyan-500/30 p-8 md:p-12 min-h-[300px] flex items-center shadow-2xl">
          <div className="absolute top-0 right-10 size-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-xl space-y-4 text-right">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black bg-cyan-950 border border-cyan-700 text-cyan-300">
              <Cpu className="size-3.5 text-cyan-400" />
              جيل المستقبل من التقنية بين يديك
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
              إلكترونيات ذكية بأقوى كفاءة وضمان حقيقي
            </h2>
            <p className="text-xs md:text-sm text-cyan-200/80 leading-relaxed">
              سماعات، ساعات ذكية، أجهزة لوحية وإكسسوارات عالية الأداء مع خدمة الدفع عند الاستلام.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('gizmo-products');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3 rounded-2xl text-xs font-black bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg flex items-center gap-2 transition-transform hover:scale-105"
              >
                <span>استكشف المنتجات</span>
                <ArrowLeft className="size-4" />
              </button>
              <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5 bg-cyan-950/60 px-3 py-2 rounded-xl border border-cyan-800/40">
                <Truck className="size-4 text-cyan-400" /> توصيل سريع لجميع المحافظات
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
              className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all border shrink-0 ${
                selectedCategory === cat
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md scale-105'
                  : 'bg-[#0c1626] text-cyan-200 border-cyan-950 hover:border-cyan-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Products Grid */}
      <section id="gizmo-products" className="max-w-7xl mx-auto px-4 md:px-8 mt-8">
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-cyan-900/30">
          <div>
            <h3 className="font-black text-xl text-white">الأجهزة والإلكترونيات</h3>
            <p className="text-xs text-cyan-300/60 mt-0.5">أفضل المواصفات وأحدث الإصدارات</p>
          </div>
          <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/80 px-3 py-1 rounded-full border border-cyan-800/40">
            {filteredProducts.length} منتج
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className="rounded-3xl border border-cyan-900/40 bg-[#0c1626] overflow-hidden shadow-xl flex flex-col justify-between group transition-all duration-300 hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-500/5 hover:-translate-y-1"
            >
              <div>
                <div className="h-64 bg-[#070d18] relative overflow-hidden">
                  <img
                    src={p.imageUrl || 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=700&auto=format&fit=crop&q=80'}
                    alt={p.name}
                    className="size-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 right-3 text-[10px] font-black bg-slate-950/80 backdrop-blur-md text-cyan-300 px-3 py-1 rounded-full border border-cyan-500/30">
                    {p.category}
                  </span>
                  <span className="absolute top-3 left-3 text-[10px] font-black bg-cyan-500 text-slate-950 px-2.5 py-1 rounded-full">
                    شحن لجميع المحافظات
                  </span>
                </div>

                <div className="p-5 text-right space-y-2">
                  <h4 className="font-black text-base text-white line-clamp-1 group-hover:text-cyan-300 transition-colors">
                    {p.name}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {p.description || 'منتج أصلي عالي الجودة مع شحن سريع لجميع محافظات العراق والدفع عند الاستلام.'}
                  </p>
                </div>
              </div>

              <div className="p-5 border-t border-cyan-900/30 bg-[#09111e] flex items-center justify-between">
                <div>
                  <span className="text-base font-black font-mono text-cyan-400 block">{formatIQD(p.price)}</span>
                  {p.compareAtPrice && (
                    <span className="text-xs text-slate-500 line-through font-mono">{formatIQD(p.compareAtPrice)}</span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => onQuickBuy(p)}
                  className="px-4 py-2.5 rounded-2xl text-xs font-black bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md flex items-center gap-1.5 transition-all hover:scale-105"
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
      <footer className="mt-20 border-t border-cyan-900/40 bg-[#040810] py-10 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} {storeName}. جميع الحقوق محفوظة • مدعوم بواسطة منصة الزعيم</p>
          <div className="flex items-center gap-4 text-cyan-400 text-xs">
            <span className="flex items-center gap-1"><Truck className="size-3.5" /> توصيل سريع</span>
            <span className="flex items-center gap-1"><ShieldCheck className="size-3.5" /> دفع عند الاستلام</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default StoreGizmoTheme;
