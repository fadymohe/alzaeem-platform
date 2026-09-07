import React, { useState } from 'react';
import {
  ShoppingBag, Search, Star, ArrowLeft, Truck, ShieldCheck,
  Sparkles, Heart, Clock, Check, User, ArrowRight, X, Phone, MapPin
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
  customization?: any;
}

/**
 * StoreClassicTheme - Inspired by Botiga Minimalist Luxury E-Commerce (Screenshot 4)
 * Clean, elegant, high-end white/cream aesthetic, centered typography, luxury skincare & cosmetics layout
 */
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
  const [activeNavTab, setActiveNavTab] = useState<'home' | 'shop' | 'about' | 'contact'>('home');

  return (
    <div className="min-h-screen bg-[#faf9f6] text-slate-900 font-sans antialiased selection:bg-slate-900 selection:text-white">
      {/* Top Announcement Bar */}
      <div className="bg-slate-900 text-white text-xs py-2 px-4 text-center tracking-wide flex items-center justify-center gap-3">
        <span className="text-[11px] font-medium opacity-90">
          ✨ توصيل مجاني لجميع محافظات العراق والدفع عند الاستلام • ضمان أصلي 100%
        </span>
        <span className="hidden sm:inline text-slate-400">|</span>
        <span className="hidden sm:inline text-[11px] font-mono text-amber-300">
          https://{fullDomain}
        </span>
      </div>

      {/* Main Luxury Header (Centered Brand, Clean Minimal Nav) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 md:px-12 py-5 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
          {/* Left: Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-wider text-slate-700">
            <button
              type="button"
              onClick={() => setActiveNavTab('home')}
              className={`hover:text-slate-950 transition-colors pb-0.5 ${activeNavTab === 'home' ? 'border-b-2 border-slate-900 text-slate-950 font-black' : ''}`}
            >
              الرئيسية
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveNavTab('shop');
                document.getElementById('classic-collection')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`hover:text-slate-950 transition-colors pb-0.5 ${activeNavTab === 'shop' ? 'border-b-2 border-slate-900 text-slate-950 font-black' : ''}`}
            >
              المتجر
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveNavTab('about');
                document.getElementById('classic-features')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-slate-950 transition-colors"
            >
              عن المتجر
            </button>
            <button
              type="button"
              onClick={() => setActiveNavTab('contact')}
              className="hover:text-slate-950 transition-colors"
            >
              تواصل معنا
            </button>
          </nav>

          {/* Center: Brand Logo */}
          <div className="text-center">
            {logoUrl ? (
              <img src={logoUrl} alt={storeName} className="h-10 max-w-[160px] object-contain mx-auto" />
            ) : (
              <h1 className="text-2xl md:text-3xl font-serif font-black tracking-[0.2em] uppercase text-slate-950">
                {storeName}
              </h1>
            )}
            <span className="text-[10px] uppercase tracking-widest text-slate-400 block -mt-1 font-mono">
              LUXURY COLLECTION
            </span>
          </div>

          {/* Right: Search & Actions */}
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block w-52 lg:w-64">
              <Search className="absolute right-3 top-2.5 size-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="ابحث في التشكيلة..."
                className="w-full h-9 pr-9 pl-3 rounded-full border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:border-slate-900 transition-colors placeholder:text-slate-400"
              />
            </div>

            <button
              type="button"
              onClick={() => document.getElementById('classic-collection')?.scrollIntoView({ behavior: 'smooth' })}
              className="relative p-2 text-slate-800 hover:text-slate-950 transition-colors"
              title="سلة التسوق"
            >
              <ShoppingBag className="size-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 size-5 rounded-full bg-slate-950 text-white text-[10px] font-bold grid place-items-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Luxury Hero Banner (Botiga Headline with minimal aesthetic) */}
      <section className="max-w-7xl mx-auto px-4 md:px-12 mt-6">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#ece8e1] via-[#f4f1ea] to-[#e8e3d9] border border-slate-200/80 p-8 md:p-16 min-h-[440px] flex items-center shadow-sm">
          <div className="relative z-10 max-w-xl space-y-6 text-right">
            <span className="inline-block text-[11px] font-extrabold uppercase tracking-[0.25em] text-slate-600 bg-white/80 backdrop-blur-sm px-4 py-1.5 rounded-full border border-slate-200">
              ORIGINAL • PREMIUM • VERIFIED
            </span>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif font-black text-slate-950 leading-[1.15] tracking-tight">
              أناقة استثنائية تلفت الأنظار
            </h2>
            <p className="text-sm md:text-base text-slate-600 leading-relaxed max-w-md font-normal">
              تشكيلة فاخرة تم انتقاؤها بعناية لتمنحك تميزاً يدوم طويلاً، مع ضمان الاستبدال والشحن لكافة محافظات العراق.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => document.getElementById('classic-collection')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-3.5 rounded-full bg-slate-950 hover:bg-slate-800 text-white text-xs font-black uppercase tracking-wider transition-all shadow-md active:scale-95"
              >
                تسوق التشكيلة الآن
              </button>
              <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5 bg-white/60 px-3.5 py-2.5 rounded-full border border-slate-200">
                <Truck className="size-4 text-emerald-600" /> الدفع عند الاستلام في العراق
              </span>
            </div>
          </div>

          {/* Hero Image Showcase */}
          <div className="hidden md:block absolute left-8 lg:left-16 bottom-0 top-0 w-1/2 overflow-hidden pointer-events-none">
            <img
              src="/templates/store-classic.jpg"
              alt="Botiga Luxury Showcase"
              className="size-full object-cover object-center opacity-90 mix-blend-multiply"
            />
          </div>
        </div>
      </section>

      {/* 4 Trust & Features Row */}
      <section id="classic-features" className="max-w-7xl mx-auto px-4 md:px-12 mt-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-3.5 text-right">
            <div className="size-12 rounded-2xl bg-slate-100 grid place-items-center text-slate-900 shrink-0">
              <Truck className="size-6" />
            </div>
            <div>
              <h4 className="font-black text-xs md:text-sm text-slate-900">توصيل سريع</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">لكل محافظات العراق</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 text-right">
            <div className="size-12 rounded-2xl bg-slate-100 grid place-items-center text-slate-900 shrink-0">
              <ShieldCheck className="size-6" />
            </div>
            <div>
              <h4 className="font-black text-xs md:text-sm text-slate-900">دفع آمن</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">الدفع عند الاستلام COD</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 text-right">
            <div className="size-12 rounded-2xl bg-slate-100 grid place-items-center text-slate-900 shrink-0">
              <Sparkles className="size-6" />
            </div>
            <div>
              <h4 className="font-black text-xs md:text-sm text-slate-900">ضمان الجودة</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">منتجات أصلية معتمدة</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 text-right">
            <div className="size-12 rounded-2xl bg-slate-100 grid place-items-center text-slate-900 shrink-0">
              <Clock className="size-6" />
            </div>
            <div>
              <h4 className="font-black text-xs md:text-sm text-slate-900">دعم متواصل</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">خدمة عملاء 24/7</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collection Heading */}
      <section id="classic-collection" className="max-w-7xl mx-auto px-4 md:px-12 mt-16 text-center">
        <h3 className="text-2xl md:text-4xl font-serif font-black text-slate-950">
          التشكيلة المختارة • Featured Collection
        </h3>
        <p className="text-xs md:text-sm text-slate-500 mt-2 max-w-xl mx-auto">
          أحدث المنتجات الحصرية المتاحة للشراء الفوري مع ضمان المعاينة قبل الاستلام
        </p>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto mt-6 pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => onSelectCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
                selectedCategory === cat
                  ? 'bg-slate-950 text-white shadow-sm font-black'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Products Grid (Botiga Minimalist Cards with SALE Badge) */}
      <section className="max-w-7xl mx-auto px-4 md:px-12 mt-8 mb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm flex flex-col justify-between group transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div>
                {/* Product Image Container */}
                <div className="h-64 bg-slate-50 relative overflow-hidden flex items-center justify-center p-4">
                  <img
                    src={p.imageUrl || '/templates/store-classic.jpg'}
                    alt={p.name}
                    className="size-full object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* SALE! Badge */}
                  <span className="absolute top-3 left-3 text-[10px] font-black uppercase tracking-wider bg-slate-950 text-white px-2.5 py-1 rounded">
                    SALE!
                  </span>
                  <span className="absolute top-3 right-3 text-[10px] font-bold bg-white/90 backdrop-blur-sm text-slate-800 px-2.5 py-1 rounded-full border border-slate-200">
                    {p.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 text-right space-y-2">
                  <h4 className="font-bold text-sm text-slate-900 line-clamp-1 group-hover:text-slate-950 transition-colors">
                    {p.name}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {p.description || 'منتج أصلي عالي الجودة مع شحن سريع لجميع محافظات العراق والدفع عند الاستلام.'}
                  </p>
                </div>
              </div>

              {/* Price & Action */}
              <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-100 mt-2">
                <div>
                  <span className="text-base font-black font-mono text-slate-950 block">
                    {formatIQD(p.price)}
                  </span>
                  {p.compareAtPrice && (
                    <span className="text-xs text-slate-400 line-through font-mono">
                      {formatIQD(p.compareAtPrice)}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => onQuickBuy(p)}
                  className="px-4 py-2 rounded-full bg-slate-950 hover:bg-slate-800 text-white text-xs font-black transition-transform hover:scale-105 shadow-sm"
                >
                  شراء فوري
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Luxury Footer */}
      <footer className="border-t border-slate-200 bg-white py-12 px-4 md:px-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-right">
            <p className="font-serif font-black text-slate-900 text-sm">{storeName}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">https://{fullDomain}</p>
          </div>
          <p>© {new Date().getFullYear()} {storeName}. جميع الحقوق محفوظة • منصة الزعيم</p>
          <div className="flex items-center gap-4 text-slate-600 text-xs">
            <span className="flex items-center gap-1"><Truck className="size-3.5 text-slate-900" /> توصيل سريع</span>
            <span className="flex items-center gap-1"><ShieldCheck className="size-3.5 text-slate-900" /> دفع عند الاستلام</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default StoreClassicTheme;
