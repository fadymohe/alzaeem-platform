import React, { useState } from 'react';
import {
  ShoppingBag, Search, Star, ArrowLeft, Truck, ShieldCheck,
  Sparkles, Heart, Clock, Check, Phone, Zap, ArrowRight, Grid,
  ChevronDown, Headphones, Smartphone, Watch, Tv, Flame, Tag, ShoppingCart
} from 'lucide-react';
import { formatIQD } from '../../../data/iraqData';
import type { StoreProduct } from '../../../data/storeState';
import type { ThemeComponentProps } from '../store-classic';

/**
 * StoreNovaTheme - Inspired by eShopkit Tech & Lifestyle Marketplace (Screenshot 1)
 * Purple Brand Accent, Hotline Badge, Flash Sale Pill, Split Hero with Side Promos, 4 Feature Cards, Popular Categories
 */
export function StoreNovaTheme({
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

  const popularAvatars = [
    { name: 'الكل', badge: '10 منتجات', icon: '🟣', cat: 'الكل', color: 'bg-purple-600 text-white' },
    { name: 'الأكثر مبيعاً', badge: '3 منتجات', icon: '🐼', cat: 'عام' },
    { name: 'أحدث الواصلات', badge: '4 منتجات', icon: '🎧', cat: 'إلكترونيات' },
    { name: 'أفضل العروض', badge: '10 منتجات', icon: '👚', cat: 'أزياء' },
    { name: 'منتجات مميزة', badge: '8 منتجات', icon: '👒', cat: 'إكسسوارات' },
    { name: 'عروض اليوم', badge: '7 منتجات', icon: '⌚', cat: 'ساعات' },
    { name: 'عروض الصيف', badge: '9 منتجات', icon: '🕶️', cat: 'صيف' },
    { name: 'عروض حصرية', badge: '5 منتجات', icon: '📱', cat: 'هواتف' },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fc] text-slate-900 font-sans antialiased selection:bg-purple-600 selection:text-white">
      {/* Top Purple Announcement Bar */}
      <div className="bg-[#5e17eb] text-white text-xs py-2 px-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px] font-bold">
          <span className="flex items-center gap-2">
            🔥 شحن مجاني لكافة محافظات العراق عند الطلب المباشر والدفع عند الاستلام
          </span>
          <div className="hidden md:flex items-center gap-5 text-white/90">
            <span>(IQD) د.ع</span>
            <span>•</span>
            <span>سياسة الاستبدال المضمونة</span>
            <span>•</span>
            <span>ضمان الفحص قبل الاستلام</span>
          </div>
        </div>
      </div>

      {/* Main Bar: Logo, Search with Category Select, Hotline, Flash Sale */}
      <header className="bg-white border-b border-slate-200/80 px-4 md:px-8 py-4 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            {logoUrl ? (
              <img src={logoUrl} alt={storeName} className="h-10 max-w-[140px] object-contain" />
            ) : (
              <div className="flex items-center gap-2">
                <div className="size-11 rounded-2xl bg-gradient-to-tr from-[#5e17eb] to-indigo-600 text-white grid place-items-center font-black text-xl shadow-md">
                  <ShoppingBag className="size-6" />
                </div>
                <div>
                  <h1 className="text-xl font-black text-slate-950 leading-none tracking-tight">
                    {storeName}
                  </h1>
                  <span className="text-[11px] text-[#5e17eb] font-mono font-bold block mt-0.5">
                    https://{fullDomain}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Search Bar with Category Dropdown */}
          <div className="flex-1 max-w-xl hidden md:flex items-center rounded-full border border-slate-300 bg-slate-50 focus-within:border-[#5e17eb] overflow-hidden transition-colors">
            <select
              value={selectedCategory}
              onChange={(e) => onSelectCategory(e.target.value)}
              className="h-10 px-4 bg-transparent text-xs font-bold text-slate-700 border-l border-slate-300 outline-none cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="ابحث عن منتجك المفضل..."
              className="flex-1 h-10 px-4 text-xs bg-transparent outline-none text-slate-900"
            />
            <button
              type="button"
              className="size-10 bg-[#5e17eb] hover:bg-[#4c13c7] text-white grid place-items-center transition-colors shrink-0"
            >
              <Search className="size-4" />
            </button>
          </div>

          {/* Hotline & Flash Sale */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 text-right">
              <div className="size-9 rounded-full bg-purple-50 text-[#5e17eb] grid place-items-center">
                <Phone className="size-4" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block leading-tight">اتصل في أي وقت</span>
                <span className="text-xs font-mono font-black text-slate-900 dir-ltr">+964 770 000 0000</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('eshop-products');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-4 py-2 rounded-full bg-[#5e17eb] hover:bg-[#4c13c7] text-white text-xs font-black flex items-center gap-1.5 shadow-md transition-all active:scale-95"
            >
              <Zap className="size-3.5 fill-amber-300 text-amber-300" />
              <span>عروض خاطفة (Flash Sale)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('eshop-products');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="p-2 rounded-full bg-slate-100 text-slate-800 hover:bg-slate-200 relative transition-colors"
            >
              <ShoppingCart className="size-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 size-5 rounded-full bg-[#5e17eb] text-white text-[10px] font-bold grid place-items-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* 4 Feature Trust Cards (Screenshot 1) */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3.5 text-right">
            <div className="size-12 rounded-2xl bg-purple-50 text-[#5e17eb] grid place-items-center shrink-0">
              <Truck className="size-6" />
            </div>
            <div>
              <h4 className="font-black text-xs md:text-sm text-slate-900">توصيل سريع (Fast Delivery)</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">شحن مباشر لكافة المحافظات</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3.5 text-right">
            <div className="size-12 rounded-2xl bg-purple-50 text-[#5e17eb] grid place-items-center shrink-0">
              <ShieldCheck className="size-6" />
            </div>
            <div>
              <h4 className="font-black text-xs md:text-sm text-slate-900">دفع آمن عند الاستلام</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">معاينة وفحص قبل الدفع</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3.5 text-right">
            <div className="size-12 rounded-2xl bg-purple-50 text-[#5e17eb] grid place-items-center shrink-0">
              <Sparkles className="size-6" />
            </div>
            <div>
              <h4 className="font-black text-xs md:text-sm text-slate-900">ضمان استرجاع</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">استبدال فوري عند الحاجة</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3.5 text-right">
            <div className="size-12 rounded-2xl bg-purple-50 text-[#5e17eb] grid place-items-center shrink-0">
              <Clock className="size-6" />
            </div>
            <div>
              <h4 className="font-black text-xs md:text-sm text-slate-900">دعم متواصل 24/7</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">فريق خدمة الزبائن معك</p>
            </div>
          </div>
        </div>
      </section>

      {/* Split Hero Section: Main Banner + 2 Side Promos (Screenshot 1) */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Dark Tech Banner (2 Cols) */}
          <div className="lg:col-span-2 relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#172033] via-[#1e293b] to-[#0f172a] text-white p-8 md:p-12 min-h-[360px] flex items-center shadow-md">
            <div className="relative z-10 max-w-md space-y-4 text-right">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-[#5e17eb] text-white shadow-sm">
                ⚡ عروض نهاية الأسبوع التي لا تفوتك!
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
                اكتشف أحدث صيحات الموضة والتقنية
              </h2>
              <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-medium">
                تصاميم عصرية وأحدث الواصلات بأسعار استثنائية مع التوصيل إلى باب بيتك.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('eshop-products');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-black text-xs shadow-md transition-all hover:scale-105"
                >
                  تسوق الآن (Shop Now)
                </button>
              </div>
            </div>

            {/* Banner Background Image */}
            <div className="hidden sm:block absolute left-4 bottom-0 top-0 w-1/2 overflow-hidden pointer-events-none">
              <img
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80"
                alt="Showcase"
                className="size-full object-cover object-center opacity-85"
              />
            </div>
          </div>

          {/* 2 Side Promo Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            {/* Promo 1: Speaker */}
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#38bdf8]/30 via-[#7dd3fc]/20 to-white p-5 border border-sky-200 flex items-center justify-between shadow-sm">
              <div className="space-y-1.5 text-right z-10">
                <span className="text-[11px] font-bold text-slate-600 block">سماعات ذكية فاخرة</span>
                <h4 className="font-black text-base text-slate-900">تبدأ من 45,000 د.ع</h4>
                <span className="text-[10px] text-sky-700 font-bold block">عرض لفترة محدودة</span>
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('eshop-products');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-3.5 py-1 rounded-lg bg-slate-950 text-white text-[10px] font-bold mt-1"
                >
                  تسوق الآن
                </button>
              </div>
              <div className="size-24 rounded-xl overflow-hidden bg-white/60 p-1 shrink-0">
                <img src="https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&auto=format&fit=crop&q=80" className="size-full object-cover rounded-lg" alt="Headphones" />
              </div>
            </div>

            {/* Promo 2: Mobiles */}
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#818cf8]/30 via-[#c7d2fe]/20 to-white p-5 border border-indigo-200 flex items-center justify-between shadow-sm">
              <div className="space-y-1.5 text-right z-10">
                <span className="text-[11px] font-bold text-slate-600 block">أفضل عروض الأجهزة</span>
                <h4 className="font-black text-base text-slate-900">أجهزة ومواصفات عالية</h4>
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('eshop-products');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-3.5 py-1 rounded-lg bg-[#5e17eb] text-white text-[10px] font-bold mt-1"
                >
                  تسوق الآن
                </button>
              </div>
              <div className="size-24 rounded-xl overflow-hidden bg-white/60 p-1 shrink-0">
                <img src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&auto=format&fit=crop&q=80" className="size-full object-cover rounded-lg" alt="Smartphone" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories Circular Avatars (Screenshot 1) */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mt-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-extrabold text-base md:text-lg text-slate-900">الأقسام الشائعة • Popular Categories</h3>
          <span className="text-xs font-bold text-[#5e17eb]">مشاهدة كافة العروض ←</span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
          {popularAvatars.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectCategory(item.cat)}
              className="bg-white p-3 rounded-2xl border border-slate-200 flex flex-col items-center justify-center text-center group hover:border-[#5e17eb] hover:shadow-md transition-all"
            >
              <div className={`size-14 rounded-full ${item.color || 'bg-purple-50'} grid place-items-center text-2xl mb-2 shadow-inner group-hover:scale-110 transition-transform`}>
                {item.icon}
              </div>
              <span className="font-extrabold text-xs text-slate-900 line-clamp-1">{item.name}</span>
              <span className="text-[10px] text-slate-400 font-medium mt-0.5">{item.badge}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Products Grid */}
      <section id="eshop-products" className="max-w-7xl mx-auto px-4 md:px-8 mt-10 mb-20">
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-200">
          <div>
            <h3 className="font-black text-xl text-slate-950">تشكيلة المتجر الحصرية</h3>
            <p className="text-xs text-slate-500 mt-0.5">منتجات مختارة بعناية فائقة</p>
          </div>
          <span className="text-xs font-mono font-bold text-[#5e17eb] bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
            {filteredProducts.length} منتج متاح
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between group hover:border-[#5e17eb] hover:shadow-xl transition-all"
            >
              <div>
                <div className="h-60 bg-slate-50 relative overflow-hidden flex items-center justify-center p-3">
                  <img
                    src={p.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700&auto=format&fit=crop&q=80'}
                    alt={p.name}
                    className="size-full object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2.5 right-2.5 text-[10px] font-bold bg-[#5e17eb] text-white px-2.5 py-0.5 rounded-full">
                    {p.category}
                  </span>
                </div>

                <div className="p-4 text-right space-y-1.5">
                  <h4 className="font-bold text-sm text-slate-900 line-clamp-1 group-hover:text-[#5e17eb] transition-colors">
                    {p.name}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {p.description || 'منتج أصلي عالي الجودة مع شحن سريع لجميع محافظات العراق والدفع عند الاستلام.'}
                  </p>
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-sm font-black font-mono text-[#5e17eb] block">
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
                  className="px-3.5 py-1.5 rounded-xl bg-[#5e17eb] hover:bg-[#4c13c7] text-white text-xs font-black transition-transform hover:scale-105 shadow-sm"
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
            <span className="flex items-center gap-1"><Truck className="size-3.5 text-[#5e17eb]" /> توصيل سريع</span>
            <span className="flex items-center gap-1"><ShieldCheck className="size-3.5 text-[#5e17eb]" /> دفع عند الاستلام</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default StoreNovaTheme;
