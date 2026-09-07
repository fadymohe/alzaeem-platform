import React, { useState } from 'react';
import {
  ShoppingBag, Search, Heart, User, ArrowLeft, ArrowRight,
  Truck, ShieldCheck, Sparkles, Star, ChevronDown, CheckCircle2,
  PhoneCall, Shirt, SlidersHorizontal, ArrowUpDown
} from 'lucide-react';
import { formatIQD } from '../../../data/iraqData';
import type { StoreProduct } from '../../../data/storeState';
import type { ThemeComponentProps } from '../store-classic';

export function StoreWardrobeTheme({
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
  const [activeGender, setActiveGender] = useState('الكل');

  const categories = ['الكل', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#111] font-sans antialiased selection:bg-[#e63946] selection:text-white" dir="rtl">
      
      {/* 1. Top Minimal Black Bar */}
      <div className="bg-[#111] text-white text-[11px] py-2 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <span className="font-bold tracking-wider">
            WARDROBE COLLECTION — تسوق أحدث خطوط الموضة مع الشحن السريع
          </span>
          <div className="flex items-center gap-4 text-slate-300 font-semibold text-[10px]">
            <span>الدفع عند الاستلام مع فحص القياس</span>
            <span className="hidden sm:inline">|</span>
            <span className="hidden sm:inline">تبديل مجاني للمقاسات</span>
          </div>
        </div>
      </div>

      {/* 2. Monochromatic Clean Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            {logoUrl ? (
              <img src={logoUrl} alt={storeName} className="h-9 w-auto max-w-[130px] object-contain" />
            ) : (
              <div className="flex items-center gap-2">
                <div className="size-9 bg-black text-white font-black grid place-items-center text-base rounded-lg">
                  W
                </div>
                <div>
                  <h1 className="font-black text-lg text-black tracking-tight leading-none uppercase">{storeName}</h1>
                  <span className="text-[10px] font-mono text-slate-500 dir-ltr block mt-0.5">{fullDomain}</span>
                </div>
              </div>
            )}
          </div>

          {/* Center Direct Category Tabs */}
          <div className="hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-slate-700">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => onSelectCategory(c)}
                className={`py-1 transition-colors hover:text-black ${
                  selectedCategory === c ? 'text-black font-black border-b-2 border-black' : ''
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Right Search & Cart */}
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block w-56">
              <Search className="absolute right-3 top-2.5 size-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="بحث في المنتجات..."
                className="w-full h-8 pr-9 pl-3 border border-slate-300 rounded-lg text-xs bg-slate-50 focus:outline-none focus:border-black focus:bg-white"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('wardrobe-products');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-2 px-3.5 py-2 bg-black hover:bg-slate-800 text-white font-black text-xs rounded-lg transition-all"
            >
              <ShoppingBag className="size-3.5" />
              <span>السلة ({cartCount})</span>
            </button>
          </div>
        </div>
      </header>

      {/* 3. Direct Start with Products Banner Strip (As described in Screenshot 3: No big generic hero, starts directly with products) */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mt-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded bg-[#e63946] text-white font-black text-[10px] uppercase tracking-wider">
              تخفيضات حصرية
            </span>
            <span className="font-extrabold text-sm text-slate-900">
              يومي بطابع خاص — القطع الأكثر طلباً لهذا الأسبوع
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-600 font-bold">
            <span className="flex items-center gap-1"><Truck className="size-3.5 text-black" /> شحن مجاني للطلبات فوق 50,000 د.ع</span>
            <span className="flex items-center gap-1"><ShieldCheck className="size-3.5 text-black" /> فحص قبل الاستلام</span>
          </div>
        </div>
      </section>

      {/* 4. Products Grid */}
      <section id="wardrobe-products" className="max-w-7xl mx-auto px-4 md:px-8 mt-6 mb-16">
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-200">
          <div>
            <h2 className="font-black text-xl text-black">الأكثر مبيعاً</h2>
            <p className="text-xs text-slate-500 mt-0.5">تشكيلة ملابس راقية تناسب إطلالتك اليومية</p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
            {filteredProducts.length} قطعة
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:border-black"
            >
              <div>
                <div className="h-72 bg-slate-100 relative overflow-hidden">
                  <img
                    src={p.imageUrl || '/templates/store-classic.jpg'}
                    alt={p.name}
                    className="size-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {p.compareAtPrice && (
                    <span className="absolute top-2.5 right-2.5 text-[10px] font-black bg-[#e63946] text-white px-2 py-0.5 rounded shadow-sm">
                      تخفيض
                    </span>
                  )}
                  <span className="absolute bottom-2.5 right-2.5 text-[10px] font-bold bg-black/80 text-white px-2 py-0.5 rounded backdrop-blur-sm">
                    {p.category}
                  </span>
                </div>

                <div className="p-4 text-right space-y-1">
                  <h4 className="font-black text-sm text-black line-clamp-1 group-hover:underline">
                    {p.name}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {p.description || 'قطعة ملابس كلاسيكية راقية مع شحن سريع ومعاينة قبل الاستلام.'}
                  </p>
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                <div>
                  <span className="text-sm font-black font-mono text-black block">
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
                  className="px-3.5 py-2 rounded-lg text-xs font-black bg-black hover:bg-slate-800 text-white shadow-sm flex items-center gap-1 transition-all hover:scale-105"
                >
                  <span>شراء</span>
                  <ArrowLeft className="size-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Minimal Footer */}
      <footer className="bg-white border-t border-slate-200 py-10 px-4 text-xs text-slate-600">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} {storeName}. جميع الحقوق محفوظة • مدعوم بواسطة منصة الزعيم</p>
          <div className="flex items-center gap-4 font-bold text-black text-xs">
            <span>توصيل سريع</span>
            <span>دفع عند الاستلام</span>
            <span>معاينة القياس</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default StoreWardrobeTheme;
