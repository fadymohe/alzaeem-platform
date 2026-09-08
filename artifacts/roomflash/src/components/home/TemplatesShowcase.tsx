import React, { useState } from 'react';
import { Link } from 'wouter';
import { ArrowLeft, ArrowRight, Play, Pause, ExternalLink, Sparkles, CheckCircle2, Eye, Store } from 'lucide-react';

interface TemplatesShowcaseProps {
  isAr?: boolean;
}

export function TemplatesShowcase({ isAr = true }: TemplatesShowcaseProps) {
  const [selectedTab, setSelectedTab] = useState<string>('stride');
  const [isPaused, setIsPaused] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  const tabs = [
    {
      id: 'stride',
      label: isAr ? 'سترايد' : 'Stride',
      tag: isAr ? 'سنيكرز وأحذية رياضية' : 'Athletic Sneakers',
      domain: 'stride.za3em.shop',
      image: '/templates/store-sneak.png',
      badge: isAr ? 'سنيكرز وأحذية رياضية عصرية' : 'Performance Sneakers & Shoes',
      color: '#0052cc',
    },
    {
      id: 'chic',
      label: isAr ? 'شيك' : 'Chic',
      tag: isAr ? 'فساتين وبوتيك راقٍ' : 'Haute Couture & Dresses',
      domain: 'chic.za3em.shop',
      image: '/templates/store-nova.jpg',
      badge: isAr ? 'أزياء راقية وهوية هوت كوتور' : 'Luxury Fashion & Evening Dresses',
      color: '#540b0e',
    },
    {
      id: 'classic',
      label: isAr ? 'بوتيجا' : 'Botiga',
      tag: isAr ? 'عطور شرقية وفاخرة' : 'Luxury Perfumes & Oud',
      domain: 'classic.za3em.shop',
      image: '/templates/store-classic.jpg',
      badge: isAr ? 'عطور شرقية وزيوت نقية' : 'Niche Fragrance & Beauty',
      color: '#0f172a',
    },
    {
      id: 'sprout',
      label: isAr ? 'سبراوت' : 'Sprout',
      tag: isAr ? 'ملابس وأزياء أطفال' : 'Kids & Organic Wear',
      domain: 'sprout.za3em.shop',
      image: '/templates/store-classic.jpg',
      badge: isAr ? 'أزياء أطفال وعائلة بروح طبيعية' : 'Soft Organic Family Boutique',
      color: '#4a6b47',
    },
    {
      id: 'wardrobe',
      label: isAr ? 'واردروب' : 'Wardrobe',
      tag: isAr ? 'ستريت وير وكاجوال' : 'Minimal Streetwear',
      domain: 'wardrobe.za3em.shop',
      image: '/templates/store-aurit.jpg',
      badge: isAr ? 'تصميم مينيمال أحادي أسود/أبيض' : 'Monochrome Casual Apparel',
      color: '#000000',
    },
    {
      id: 'loftora',
      label: isAr ? 'لوفتورا' : 'Loftora',
      tag: isAr ? 'أثاث وديكور إسكندنافي' : 'Nordic Furniture & Decor',
      domain: 'loftora.za3em.shop',
      image: '/templates/store-classic.jpg',
      badge: isAr ? 'خشب البلوط وسكينة الديكور' : 'Warm Oak Craftsmanship',
      color: '#8b5a2b',
    },
    {
      id: 'aurit',
      label: isAr ? 'شوب ويل' : 'ShopWell',
      tag: isAr ? 'ميجا ستور شامل' : 'Blue Mega Store',
      domain: 'shopwell.za3em.shop',
      image: '/templates/store-aurit.jpg',
      badge: isAr ? 'عروض ضخمة وتخفيضات أسبوعية' : 'Mega Deals & Circular Categories',
      color: '#2563eb',
    },
    {
      id: 'nova',
      label: isAr ? 'إيشوب كيت' : 'eShopkit',
      tag: isAr ? 'إلكترونيات وأجهزة ذكية' : 'Tech & Gadgets',
      domain: 'nova.za3em.shop',
      image: '/templates/store-brick.jpg',
      badge: isAr ? 'أجهزة ذكية وفلاش سيل عراقي' : 'Next-Gen Smart Electronics',
      color: '#5e17eb',
    },
  ];

  const currentTab = tabs.find((t) => t.id === selectedTab) || tabs[0];

  const handleTabChange = (tabId: string) => {
    setSelectedTab(tabId);
    setAnimKey((prev) => prev + 1);
  };

  return (
    <section id="templates" className="py-24 px-4 mx-auto max-w-6xl text-center">
      {/* Section Header */}
      <div className="max-w-2xl mx-auto mb-10">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 border border-teal-200/80 px-4 py-1.5 text-xs font-black text-teal-800 mb-4 shadow-xs">
          <Sparkles className="size-3.5 text-teal-600 animate-pulse" />
          <span>{isAr ? '● قوالب وثيمات المتاجر' : '● Store Themes'}</span>
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
          {isAr ? 'تصاميم احترافية تليق بنشاطك التجاري' : 'Professional Designs Built for Your Niche'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 font-medium mt-3 leading-relaxed">
          {isAr
            ? '8 ثيمات عصرية متكاملة بهوية وخطوط عربية وألوان مستقلة — مجهزة بسلة شراء تفاعلية، شحن للمحافظات، والدفع عند الاستلام.'
            : '8 modern storefront themes with distinct Arabic Google typography, interactive cart, and Iraq COD checkout.'}
        </p>
      </div>

      {/* Template Selector Pills (8 Themes) */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 mb-8">
        {tabs.map((tab) => {
          const isActive = selectedTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-extrabold transition-all duration-200 cursor-pointer border ${
                isActive
                  ? 'border-teal-400 bg-teal-50 text-teal-900 shadow-md ring-2 ring-teal-200/80 scale-105'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              <span
                className="size-2 rounded-full shrink-0"
                style={{ backgroundColor: tab.color }}
              />
              <span className="font-black text-xs">{tab.label}</span>
              <span className="text-[10px] font-normal text-slate-500">({tab.tag})</span>
            </button>
          );
        })}
      </div>

      {/* Browser Window Frame Mockup */}
      <div className="relative mx-auto max-w-4xl rounded-[2rem] sm:rounded-[2.5rem] border border-slate-200/90 bg-white p-3 sm:p-5 shadow-2xl shadow-slate-200/90 transition-all duration-300">
        {/* Browser Top Chrome Bar */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 select-none px-2 flex-wrap gap-2">
          {/* Window Action Dots */}
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 sm:size-3 rounded-full bg-[#f87171]" />
            <span className="size-2.5 sm:size-3 rounded-full bg-[#fbbf24]" />
            <span className="size-2.5 sm:size-3 rounded-full bg-[#34d399]" />
          </div>

          {/* Browser Address Bar with Official .za3em.shop Domain */}
          <div className="flex items-center gap-2 rounded-full bg-slate-100 border border-slate-200 px-4 sm:px-6 py-1.5 text-xs font-mono font-bold text-slate-700 shadow-xs">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span dir="ltr">https://{currentTab.domain}</span>
          </div>

          {/* Live Interactive Store Button in Header */}
          <div className="flex items-center gap-2">
            <Link
              href={`/view-store/${currentTab.id}`}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-teal-700 hover:bg-teal-800 text-white font-black text-xs shadow-md shadow-teal-700/20 transition-all hover:scale-105"
            >
              <Eye className="size-3.5" />
              <span>{isAr ? 'معاينة حية للمتجر' : 'Live Store'}</span>
            </Link>

            <button
              onClick={() => setIsPaused(!isPaused)}
              className="hidden sm:flex p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              title={isPaused ? 'استئناف التمرير' : 'إيقاف التمرير مؤقتاً'}
            >
              {isPaused ? <Play className="size-3.5" /> : <Pause className="size-3.5" />}
            </button>
          </div>
        </div>

        {/* Scrollable Viewport Container */}
        <div
          className="relative h-[340px] sm:h-[420px] md:h-[480px] overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-100 bg-slate-50 cursor-pointer"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onClick={() => {
            window.location.hash = `#/view-store/${currentTab.id}`;
          }}
        >
          {/* Image with Downward CSS Keyframe Animation */}
          <div
            key={animKey}
            className="w-full relative"
            style={{
              animation: isPaused ? 'none' : 'storeScroll 24s ease-in-out infinite alternate',
              willChange: 'transform',
            }}
          >
            <img
              src={currentTab.image}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/templates/store-classic.jpg';
              }}
              alt={`معاينة متجر ${currentTab.label}`}
              className="w-full h-auto object-cover object-top select-none pointer-events-none"
            />
          </div>

          {/* Floating Live Badge Indicator */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none z-20">
            <div className="flex items-center gap-2 rounded-full bg-slate-900/90 backdrop-blur-md px-4 py-1.5 text-[11px] font-extrabold text-white shadow-lg">
              <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
              <span>
                {isAr ? 'انقر في أي مكان لمعاينة وتجربة المتجر المباشر مع السلة' : 'Click to inspect live store with cart & checkout'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Text & Action Buttons */}
      <p className="text-xs sm:text-sm font-bold text-slate-500 mt-8">
        {isAr
          ? 'اختر أي قالب وانطلق خلال 60 ثانية — مع تخصيص الألوان والخطوط والشعار بدون كود.'
          : 'Launch in 60 seconds with your favorite design — customize colors, fonts, and logo easily.'}
      </p>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        <Link
          href={`/view-store/${currentTab.id}`}
          className="inline-flex items-center gap-2 rounded-full bg-teal-700 hover:bg-teal-800 px-7 py-3 text-xs sm:text-sm font-black text-white shadow-lg shadow-teal-700/25 transition-all hover:scale-105"
        >
          <Store className="size-4" />
          <span>{isAr ? `تصفح متجر ${currentTab.label} التفاعلي` : `Explore ${currentTab.label} Live`}</span>
        </Link>

        <Link
          href={`/onboarding?theme=store-${currentTab.id}`}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-7 py-3 text-xs sm:text-sm font-black text-slate-800 hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all hover:scale-105"
        >
          <span>{isAr ? 'إنشاء متجري بهذا القالب مجاناً' : 'Build Store with This Theme'}</span>
          {isAr ? (
            <ArrowLeft className="size-4 text-slate-500" />
          ) : (
            <ArrowRight className="size-4 text-slate-500" />
          )}
        </Link>
      </div>
    </section>
  );
}
