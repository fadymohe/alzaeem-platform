import React, { useState } from 'react';
import {
  ShoppingBag, Search, Star, ArrowLeft, Truck, ShieldCheck,
  Sparkles, Heart, Clock, Check, User, ChevronDown, Flame, Tag,
  Headphones, RefreshCw, Smartphone, Shirt, Layers, Grid, Home,
  Tv, Dumbbell, Package, ShoppingCart
} from 'lucide-react';
import { formatIQD } from '../../../data/iraqData';
import type { StoreProduct } from '../../../data/storeState';
import type { ThemeComponentProps } from '../store-classic';

/**
 * StoreAuritTheme - Inspired by ShopWell Mega Store Design (Screenshot 2)
 * Clean modern e-commerce with Left Category Sidebar, Blue Accent, Popular Category Circular avatars, and Top Deals
 */
export function StoreAuritTheme({
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
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(true);
  const categories = ['الكل', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];

  const popularCatAvatars = [
    { name: 'تخفيضات كبرى', badge: '30% OFF', icon: '🔥', cat: 'الكل', color: 'bg-blue-600 text-white' },
    { name: 'أحذية وسنيكرز', badge: '5 منتجات', icon: '👟', cat: 'أحذية' },
    { name: 'هواتف وأجهزة', badge: '9 منتجات', icon: '📱', cat: 'إلكترونيات' },
    { name: 'مستلزمات منزلية', badge: '7 منتجات', icon: '🛋️', cat: 'منزل' },
    { name: 'أزياء وملابس', badge: '8 منتجات', icon: '👖', cat: 'أزياء' },
    { name: 'ألعاب وهدايا', badge: '4 منتجات', icon: '🧸', cat: 'ألعاب' },
    { name: 'إكسسوارات وساعات', badge: '14 منتج', icon: '🎧', cat: 'إكسسوارات' },
    { name: 'مستلزمات ومطبخ', badge: '12 منتج', icon: '🍳', cat: 'مطبخ' },
  ];

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-slate-900 font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* Top Blue Announcement Bar */}
      <div className="bg-gradient-to-r from-blue-600 to-sky-600 text-white text-xs py-2 px-4 text-center flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between text-[11px] font-bold">
          <span className="flex items-center gap-1.5">
            🎁 وفر حتى 20% عند الشراء اليوم مع كود الخصم <span className="bg-white/20 px-2 py-0.5 rounded font-mono">FLAT20</span>
          </span>
          <div className="hidden md:flex items-center gap-4 text-white/90">
            <span>شحن سريع لكافة المحافظات العراقية</span>
            <span>•</span>
            <span>الدفع عند الاستلام (IQD)</span>
          </div>
        </div>
      </div>

      {/* Main Header (Logo, Centered Search with Category Dropdown, Cart) */}
      <header className="bg-white border-b border-slate-200 px-4 md:px-8 py-3.5 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            {logoUrl ? (
              <img src={logoUrl} alt={storeName} className="h-10 max-w-[140px] object-contain" />
            ) : (
              <div className="flex items-center gap-2">
                <div className="size-10 rounded-xl bg-blue-600 text-white grid place-items-center font-black text-xl shadow-md">
                  <ShoppingBag className="size-5" />
                </div>
                <div>
                  <h1 className="text-xl font-extrabold text-slate-950 leading-none tracking-tight">
                    {storeName}
                  </h1>
                  <span className="text-[10px] text-blue-600 font-mono font-bold block mt-0.5">
                    {subdomain}.za3em.shop
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Centered Search Bar with Category Selector */}
          <div className="flex-1 max-w-2xl hidden md:flex items-center rounded-xl border-2 border-blue-600 bg-white overflow-hidden shadow-sm">
            <select
              value={selectedCategory}
              onChange={(e) => onSelectCategory(e.target.value)}
              className="h-10 px-3 bg-slate-50 text-xs font-bold text-slate-700 border-l border-slate-200 outline-none cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="ابحث عن أي منتج في المتجر..."
              className="flex-1 h-10 px-4 text-xs text-slate-900 outline-none"
            />
            <button
              type="button"
              className="h-10 px-5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black flex items-center gap-1.5 transition-colors"
            >
              <Search className="size-4" />
              <span>بحث</span>
            </button>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('shopwell-products');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-md transition-all active:scale-95"
            >
              <ShoppingCart className="size-4" />
              <span>السلة ({cartCount})</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Body Layout: Left Sidebar + Hero Banner */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Vertical Categories Menu (Shop by Category) */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <button
                type="button"
                onClick={() => setCategoryMenuOpen(!categoryMenuOpen)}
                className="w-full bg-blue-600 text-white p-3.5 font-extrabold text-xs flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Grid className="size-4" />
                  <span>تصفح الأقسام (Shop by Category)</span>
                </div>
                <ChevronDown className={`size-4 transition-transform ${categoryMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {categoryMenuOpen && (
                <div className="divide-y divide-slate-100 text-xs font-bold text-slate-700">
                  {categories.map((cat, idx) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => onSelectCategory(cat)}
                      className={`w-full text-right p-3 hover:bg-blue-50 hover:text-blue-700 transition-colors flex items-center justify-between ${
                        selectedCategory === cat ? 'bg-blue-50/80 text-blue-700 font-black' : ''
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <span className="size-2 rounded-full bg-blue-500" />
                        {cat}
                      </span>
                      <ArrowLeft className="size-3 text-slate-300" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Center & Right: Hero Banner (ShopWell style) */}
          <div className="lg:col-span-3">
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#eef2f6] via-[#f8fafc] to-[#e2e8f0] border border-slate-200 p-8 md:p-12 min-h-[360px] flex items-center shadow-sm">
              <div className="relative z-10 max-w-lg space-y-4 text-right">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-black bg-blue-600 text-white shadow-sm">
                  🔥 خصم نهاية الأسبوع • Weekend Discount
                </span>
                <h2 className="text-3xl md:text-5xl font-black text-slate-950 leading-tight">
                  تشكيلة جديدة كلياً لأجلك
                </h2>
                <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-medium">
                  شحن مجاني وسريع لكافة المحافظات مع ضمان استبدال وفحص قبل الاستلام.
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      const el = document.getElementById('shopwell-products');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-md transition-all hover:scale-105"
                  >
                    تسوق الآن (Shop Now)
                  </button>
                  <span className="text-xs font-bold text-blue-800 bg-blue-100 px-3 py-2 rounded-xl">
                    الدفع عند الاستلام في العراق 🇮🇶
                  </span>
                </div>
              </div>

              {/* Background Product Image */}
              <div className="hidden sm:block absolute left-4 bottom-0 top-0 w-1/2 overflow-hidden pointer-events-none">
                <img
                  src="/templates/store-aurit.jpg"
                  alt="ShopWell Showcase"
                  className="size-full object-cover object-center mix-blend-multiply opacity-85"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories Circular Avatars (Screenshot 2) */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mt-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-extrabold text-base md:text-lg text-slate-900">الأقسام الأكثر طلباً • Popular Categories</h3>
          <span className="text-xs font-bold text-blue-600">عرض كافة العروض ←</span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
          {popularCatAvatars.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectCategory(item.cat)}
              className="bg-white p-3 rounded-2xl border border-slate-200 flex flex-col items-center justify-center text-center group hover:border-blue-500 hover:shadow-md transition-all"
            >
              <div className={`size-14 rounded-full ${item.color || 'bg-slate-100'} grid place-items-center text-2xl mb-2 shadow-inner group-hover:scale-110 transition-transform`}>
                {item.icon}
              </div>
              <span className="font-extrabold text-xs text-slate-900 line-clamp-1">{item.name}</span>
              <span className="text-[10px] text-slate-400 font-medium mt-0.5">{item.badge}</span>
            </button>
          ))}
        </div>
      </section>

      {/* 4 Feature Trust Bar */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-right">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-blue-50 text-blue-600 grid place-items-center shrink-0">
              <Truck className="size-5" />
            </div>
            <div>
              <h4 className="font-black text-xs text-slate-900">شحن وتوصيل سريع</h4>
              <p className="text-[10px] text-slate-500">لكافة محافظات العراق</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-blue-50 text-blue-600 grid place-items-center shrink-0">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <h4 className="font-black text-xs text-slate-900">دفع آمن عند الاستلام</h4>
              <p className="text-[10px] text-slate-500">ضمان وفحص قبل الدفع</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-blue-50 text-blue-600 grid place-items-center shrink-0">
              <Sparkles className="size-5" />
            </div>
            <div>
              <h4 className="font-black text-xs text-slate-900">ضمان استرجاع</h4>
              <p className="text-[10px] text-slate-500">استبدال فوري للمنتجات</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-blue-50 text-blue-600 grid place-items-center shrink-0">
              <Clock className="size-5" />
            </div>
            <div>
              <h4 className="font-black text-xs text-slate-900">دعم متواصل 24/7</h4>
              <p className="text-[10px] text-slate-500">خدمة عملاء دائماً معك</p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section id="shopwell-products" className="max-w-7xl mx-auto px-4 md:px-8 mt-10 mb-20">
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-200">
          <div>
            <h3 className="font-black text-xl text-slate-950">منتجات المتجر المتاحة</h3>
            <p className="text-xs text-slate-500 mt-0.5">تسوق أحدث المنتجات بأسعار منافسة</p>
          </div>
          <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            {filteredProducts.length} منتج متوفر
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between group hover:border-blue-500 hover:shadow-lg transition-all"
            >
              <div>
                <div className="h-60 bg-slate-100 relative overflow-hidden flex items-center justify-center p-3">
                  <img
                    src={p.imageUrl || '/templates/store-aurit.jpg'}
                    alt={p.name}
                    className="size-full object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2.5 right-2.5 text-[10px] font-bold bg-blue-600 text-white px-2.5 py-0.5 rounded-full">
                    {p.category}
                  </span>
                </div>

                <div className="p-4 text-right space-y-1.5">
                  <h4 className="font-bold text-sm text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {p.name}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {p.description || 'منتج أصلي عالي الجودة مع شحن سريع لجميع محافظات العراق والدفع عند الاستلام.'}
                  </p>
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-sm font-black font-mono text-blue-700 block">
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
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black transition-transform hover:scale-105 shadow-sm"
                >
                  شراء فوري
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-10 px-4 md:px-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} {storeName}. جميع الحقوق محفوظة • منصة الزعيم</p>
          <div className="flex items-center gap-4 text-slate-600 text-xs">
            <span className="flex items-center gap-1"><Truck className="size-3.5 text-blue-600" /> توصيل سريع</span>
            <span className="flex items-center gap-1"><ShieldCheck className="size-3.5 text-blue-600" /> دفع عند الاستلام</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default StoreAuritTheme;
