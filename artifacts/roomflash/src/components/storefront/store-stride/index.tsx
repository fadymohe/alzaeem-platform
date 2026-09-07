import React, { useState } from 'react';
import {
  ShoppingBag, Search, Heart, User, ArrowLeft, ArrowRight,
  Truck, ShieldCheck, Sparkles, Star, ChevronDown, CheckCircle2,
  Footprints, Flame, Zap, Award, Layers
} from 'lucide-react';
import { formatIQD } from '../../../data/iraqData';
import type { StoreProduct } from '../../../data/storeState';
import type { ThemeComponentProps } from '../store-classic';

export function StoreStrideTheme({
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

  const brandPills = ['NIKE', 'ADIDAS', 'PUMA', 'NEW BALANCE', 'ASICS', 'JORDAN', 'ON RUNNING'];

  return (
    <div className="min-h-screen bg-[#071322] text-slate-100 font-sans antialiased selection:bg-[#0066ff] selection:text-white" dir="rtl">
      
      {/* 1. Top Cobalt Bar */}
      <div className="bg-[#0052cc] text-white text-[11px] font-black py-2 px-4 md:px-8 text-center shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <span className="flex items-center gap-1.5">
            <Zap className="size-3.5 fill-amber-300 text-amber-300" />
            <span>موسم الرقبة العالية والأحذية الرياضية الأصلية • شحن مجاني لكافة محافظات العراق فوق 50,000 د.ع</span>
          </span>
          <div className="flex items-center gap-4 text-xs font-bold text-blue-100">
            <span>إرجاع خلال 14 يوماً</span>
            <span className="hidden sm:inline">|</span>
            <span className="hidden sm:inline">فحص الحذاء قبل الدفع</span>
          </div>
        </div>
      </div>

      {/* 2. Deep Cobalt Header */}
      <header className="bg-[#0a1c33]/95 backdrop-blur-md border-b border-blue-900/50 sticky top-0 z-40 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          
          {/* Logo & Store */}
          <div className="flex items-center gap-3">
            {logoUrl ? (
              <img src={logoUrl} alt={storeName} className="h-10 w-auto max-w-[140px] object-contain rounded-xl border border-blue-500/40" />
            ) : (
              <div className="flex items-center gap-2.5">
                <div className="size-11 rounded-2xl bg-gradient-to-tr from-[#0066ff] to-[#00c8ff] text-white font-black grid place-items-center text-xl shadow-lg shadow-blue-500/30">
                  <Footprints className="size-6" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-xl text-white tracking-tight">{storeName}</span>
                    <span className="px-2 py-0.5 rounded text-[9px] font-black bg-[#0066ff] text-white">STRIDE</span>
                  </div>
                  <span className="text-[10px] font-mono text-blue-400 dir-ltr block mt-0.5">{fullDomain}</span>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-black text-blue-200">
            {['الرئيسية', 'أحذية رياضية', 'سنيكرز كاجوال', 'أحذية كلاسيكية', 'عروض التصفية'].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setActiveTab(item)}
                className={`py-1 transition-all hover:text-white relative ${
                  activeTab === item ? 'text-white font-black' : ''
                }`}
              >
                {item}
                {activeTab === item && (
                  <span className="absolute -bottom-2 right-0 left-0 h-0.5 bg-[#0066ff] rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Search & Actions */}
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block w-60">
              <Search className="absolute right-3.5 top-2.5 size-4 text-blue-400/60" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="ابحث عن موديل، مقاس..."
                className="w-full h-9 pr-10 pl-4 rounded-xl border border-blue-900/60 bg-[#071322] text-xs text-white placeholder:text-blue-300/40 focus:outline-none focus:border-[#0066ff]"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('stride-grid');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0066ff] hover:bg-[#0052cc] text-white font-black text-xs shadow-lg shadow-blue-600/30 transition-all hover:scale-105"
            >
              <ShoppingBag className="size-4" />
              <span>السلة ({cartCount})</span>
            </button>
          </div>
        </div>
      </header>

      {/* 3. Angled Hero Section (Matching Screenshot 3 Stride) */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mt-5">
        <div className="rounded-3xl overflow-hidden bg-gradient-to-r from-[#0c2340] via-[#103159] to-[#0a1d36] border border-blue-800/40 p-8 md:p-12 relative shadow-2xl">
          <div className="max-w-xl space-y-4 text-right relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-black bg-[#0052cc] text-white">
              <Award className="size-3.5" />
              المتجر الأكثر كثافة وتنوعاً في الأحذية الأصلية
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">
              موسم الرقبة العالية وأحدث إصدارات السنيكرز
            </h1>
            <p className="text-xs md:text-sm text-blue-200/80 leading-relaxed font-medium">
              أفضل الخامات الطبية والرياضية لراحة قدميك طوال اليوم، مع فحص القياس وتجربة الحذاء قبل الاستلام.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('stride-grid');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3 rounded-xl bg-[#0066ff] hover:bg-[#0052cc] text-white font-black text-xs shadow-xl shadow-blue-600/30 flex items-center gap-2 transition-transform hover:scale-105"
              >
                <span>تسوق الأحذية الآن</span>
                <ArrowLeft className="size-4" />
              </button>
              <span className="text-xs font-bold text-blue-300 flex items-center gap-1.5 bg-blue-950/80 px-3.5 py-2.5 rounded-xl border border-blue-800/60">
                <Truck className="size-4 text-[#00c8ff]" /> شحن 18 محافظة خلال 24-48 ساعة
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Brand Wall Bar (Matching Baseet Stride) */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mt-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {brandPills.map((b) => (
            <button
              key={b}
              type="button"
              className="px-5 py-2.5 rounded-xl bg-[#0a1c33] border border-blue-900/50 hover:border-blue-500 text-blue-300 hover:text-white font-black text-xs tracking-wider transition-all shrink-0 shadow-sm"
            >
              {b}
            </button>
          ))}
        </div>
      </section>

      {/* 5. Products Catalog */}
      <section id="stride-grid" className="max-w-7xl mx-auto px-4 md:px-8 mt-10 mb-16">
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-blue-900/40">
          <div>
            <h3 className="font-black text-2xl text-white">أبرز المجموعات</h3>
            <p className="text-xs text-blue-300/60 mt-0.5">رسمية، عالية، سنيكرز وأحذية يومية</p>
          </div>
          <span className="text-xs font-mono font-bold text-blue-400 bg-[#0a1c33] px-3 py-1 rounded-xl border border-blue-900/60">
            {filteredProducts.length} موديل متاح
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className="bg-[#0a1c33] rounded-2xl border border-blue-900/40 overflow-hidden shadow-xl flex flex-col justify-between group transition-all duration-300 hover:border-[#0066ff] hover:-translate-y-1"
            >
              <div>
                <div className="h-64 bg-[#071322] relative overflow-hidden">
                  <img
                    src={p.imageUrl || '/templates/store-sneak.png'}
                    alt={p.name}
                    className="size-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 right-3 text-[10px] font-black bg-[#071322]/80 backdrop-blur-md text-blue-300 px-2.5 py-1 rounded-lg border border-blue-500/30">
                    {p.category}
                  </span>
                  <span className="absolute top-3 left-3 text-[10px] font-black bg-[#0066ff] text-white px-2 py-0.5 rounded-lg">
                    أصلي 100%
                  </span>
                </div>

                <div className="p-4 text-right space-y-1.5">
                  <h4 className="font-black text-sm text-white line-clamp-1 group-hover:text-blue-400 transition-colors">
                    {p.name}
                  </h4>
                  <p className="text-xs text-blue-200/60 line-clamp-2 leading-relaxed">
                    {p.description || 'حذاء مريح عالي الجودة مع دعامة طبية وشحن سريع وفحص قبل الاستلام.'}
                  </p>
                </div>
              </div>

              <div className="p-4 border-t border-blue-900/40 bg-[#08172b] flex items-center justify-between">
                <div>
                  <span className="text-sm font-black font-mono text-[#00c8ff] block">
                    {formatIQD(p.price)}
                  </span>
                  {p.compareAtPrice && (
                    <span className="text-[11px] text-slate-500 line-through font-mono">
                      {formatIQD(p.compareAtPrice)}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => onQuickBuy(p)}
                  className="px-4 py-2 rounded-xl text-xs font-black bg-[#0066ff] hover:bg-[#0052cc] text-white shadow-md shadow-blue-600/30 flex items-center gap-1.5 transition-all hover:scale-105"
                >
                  <span>شراء فوري</span>
                  <ArrowLeft className="size-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Footer */}
      <footer className="bg-[#050e1a] text-blue-300 text-xs py-10 px-4 border-t border-blue-900/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} {storeName}. جميع الحقوق محفوظة • مدعوم بواسطة منصة الزعيم</p>
          <div className="flex items-center gap-6 text-xs text-blue-400">
            <span>توصيل 18 محافظة</span>
            <span>دفع عند الاستلام</span>
            <span>معاينة القياس قبل الدفع</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default StoreStrideTheme;
