import React, { useState } from 'react';
import {
  ShoppingBag, Search, Heart, User, ArrowLeft, ArrowRight,
  Truck, ShieldCheck, Sparkles, Star, ChevronDown, CheckCircle2,
  PhoneCall, Crown, Gem
} from 'lucide-react';
import { formatIQD } from '../../../data/iraqData';
import type { StoreProduct } from '../../../data/storeState';
import type { ThemeComponentProps } from '../store-classic';

export function StoreChicTheme({
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
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-[#9e2a2b] selection:text-white" dir="rtl">
      
      {/* 1. Top Moving/Announcement Banner */}
      <div className="bg-[#540b0e] text-[#fff0f3] text-[11px] font-black py-2 px-4 text-center tracking-widest uppercase">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="mx-auto">CHIC BOUTIQUE — فخامة كل يوم • عروض حصرية وتوصيل مباشر لجميع المحافظات</span>
        </div>
      </div>

      {/* 2. Magazine Editorial Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-5 flex flex-wrap items-center justify-between gap-4">
          
          <div className="hidden md:flex items-center gap-6 text-xs font-black uppercase tracking-wider text-slate-800">
            {['الرئيسية', 'المجموعات', 'البوتيك', 'فساتين سهرة', 'تواصل معنا'].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setActiveTab(item)}
                className={`py-1 transition-colors hover:text-[#9e2a2b] ${
                  activeTab === item ? 'text-[#9e2a2b] font-black' : ''
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {/* Centered Chic Logo */}
          <div className="text-center">
            {logoUrl ? (
              <img src={logoUrl} alt={storeName} className="h-10 w-auto max-w-[140px] object-contain mx-auto" />
            ) : (
              <div>
                <h1 className="font-serif font-black text-2xl md:text-3xl text-[#540b0e] tracking-tight uppercase">
                  {storeName}
                </h1>
                <span className="text-[10px] font-mono text-slate-400 dir-ltr block -mt-1">{fullDomain}</span>
              </div>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block w-48">
              <Search className="absolute right-3 top-2 size-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="بحث..."
                className="w-full h-8 pr-8 pl-3 border-b border-slate-300 text-xs focus:outline-none focus:border-[#9e2a2b]"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('chic-grid');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#540b0e] hover:bg-[#330406] text-white font-black text-xs transition-all shadow-sm"
            >
              <ShoppingBag className="size-3.5" />
              <span>السلة ({cartCount})</span>
            </button>
          </div>
        </div>
      </header>

      {/* 3. Magazine Split Editorial Hero (Matching Screenshot 4 Chic) */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative rounded-3xl overflow-hidden bg-slate-100 min-h-[360px] flex items-end p-8">
            <img
              src="/templates/store-classic.jpg"
              alt="Editorial Chic"
              className="absolute inset-0 size-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="relative z-10 text-white space-y-2 text-right">
              <span className="text-xs font-black uppercase tracking-widest text-[#fff0f3]">تشكيلة الصيف</span>
              <h2 className="text-2xl md:text-4xl font-serif font-black">فخامة كل يوم</h2>
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('chic-grid');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-5 py-2 rounded-full bg-white text-black font-black text-xs hover:bg-[#fff0f3] transition-colors"
              >
                تسوقي الآن ←
              </button>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden bg-slate-100 min-h-[360px] flex items-end p-8">
            <img
              src="/templates/store-nova.jpg"
              alt="Editorial Chic"
              className="absolute inset-0 size-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="relative z-10 text-white space-y-2 text-right">
              <span className="text-xs font-black uppercase tracking-widest text-[#fff0f3]">إطلالة البوتيك</span>
              <h2 className="text-2xl md:text-4xl font-serif font-black">مجموعتان مميزتان</h2>
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('chic-grid');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-5 py-2 rounded-full bg-white text-black font-black text-xs hover:bg-[#fff0f3] transition-colors"
              >
                استكشفي المجموعة ←
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Products Grid */}
      <section id="chic-grid" className="max-w-7xl mx-auto px-4 md:px-8 mt-12 mb-16">
        <div className="text-center max-w-xl mx-auto mb-8 space-y-1">
          <span className="text-xs font-black text-[#9e2a2b] tracking-widest uppercase">القطع الأكثر مبيعاً</span>
          <h3 className="font-serif font-black text-2xl md:text-3xl text-slate-900">الأكثر مبيعاً هذا الأسبوع</h3>
          <p className="text-xs text-slate-500">تصاميم بوتيك حصرية مختارة بعناية لأناقة لا مثيل لها</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="h-72 bg-slate-50 relative overflow-hidden">
                  <img
                    src={p.imageUrl || '/templates/store-nova.jpg'}
                    alt={p.name}
                    className="size-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 right-3 text-[10px] font-black bg-white/90 text-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    {p.category}
                  </span>
                </div>

                <div className="p-4 text-right space-y-1">
                  <h4 className="font-black text-sm text-slate-900 line-clamp-1 group-hover:text-[#9e2a2b] transition-colors">
                    {p.name}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {p.description || 'قطعة أزياء وبوتيك راقية مع خدمة فحص المنتج قبل الاستلام والدفع عند الباب.'}
                  </p>
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 bg-[#fffbfc] flex items-center justify-between">
                <div>
                  <span className="text-sm font-black font-mono text-[#540b0e] block">
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
                  className="px-4 py-2 rounded-full text-xs font-black bg-[#540b0e] hover:bg-[#330406] text-white shadow-sm flex items-center gap-1.5 transition-all hover:scale-105"
                >
                  <span>طلب فوري</span>
                  <ArrowLeft className="size-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Footer */}
      <footer className="bg-[#1a0405] text-[#fff0f3] text-xs py-12 px-4 border-t border-slate-900">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-right">
          <div>
            <h5 className="font-serif font-black text-base text-white">{storeName}</h5>
            <p className="text-xs text-[#ffccd5] mt-1">بوتيك الأزياء الراقية والموضة العصرية في العراق.</p>
          </div>
          <div className="flex items-center gap-6 text-xs text-[#ffccd5]">
            <span>شحن 18 محافظة</span>
            <span>فحص قبل الاستلام</span>
            <span>استبدال مجاني للمقاسات</span>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-white/10 text-center text-[11px] text-[#ffccd5]/60">
          © {new Date().getFullYear()} {storeName}. جميع الحقوق محفوظة • مدعوم بواسطة منصة الزعيم
        </div>
      </footer>

    </div>
  );
}

export default StoreChicTheme;
