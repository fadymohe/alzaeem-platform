import React, { useState } from 'react';
import { Link } from 'wouter';
import { ArrowLeft, ArrowRight, Play, Pause, ExternalLink, Sparkles, Smartphone, Monitor } from 'lucide-react';

interface TemplatesShowcaseProps {
  isAr?: boolean;
}

export function TemplatesShowcase({ isAr = true }: TemplatesShowcaseProps) {
  const [selectedTab, setSelectedTab] = useState<'brick' | 'nova' | 'classic' | 'aurit'>('brick');
  const [isPaused, setIsPaused] = useState(false);

  const tabs = [
    {
      id: 'brick',
      label: isAr ? 'بريك' : 'Brick',
      tag: isAr ? 'أزياء وإكسسوارات' : 'Fashion & Accessories',
      domain: 'brick.zaeem.iq',
    },
    {
      id: 'nova',
      label: isAr ? 'نوفا' : 'Nova',
      tag: isAr ? 'عبايات وأقمشة' : 'Abayas & Fabrics',
      domain: 'nova.zaeem.iq',
    },
    {
      id: 'classic',
      label: isAr ? 'كلاسيك' : 'Classic',
      tag: isAr ? 'ريتيل ومتاجر عامة' : 'Retail & General',
      domain: 'classic.zaeem.iq',
    },
    {
      id: 'aurit',
      label: isAr ? 'أوريت' : 'Aurit',
      tag: isAr ? 'إلكترونيات وتقنية' : 'Electronics & Tech',
      domain: 'aurit.zaeem.iq',
    },
  ];

  const currentTab = tabs.find((t) => t.id === selectedTab) || tabs[0];

  return (
    <section id="templates" className="py-20 px-4 mx-auto max-w-6xl text-center">
      {/* Section Header (matching Image 2) */}
      <div className="max-w-2xl mx-auto mb-10">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200/80 px-4 py-1.5 text-xs font-black text-blue-700 mb-4 shadow-xs">
          <span className="size-1.5 rounded-full bg-blue-600" />
          <span>{isAr ? 'التصاميم' : 'Templates'}</span>
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
          {isAr ? 'تصميم يليق بمجالك' : 'A Design Built for Your Niche'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-3">
          {isAr
            ? 'قوالب حقيقية من متاجر فعلية — وليست تصاميم وهمية.'
            : 'Real templates from active merchant stores — not fictional concepts.'}
        </p>
      </div>

      {/* Template Category Selector Pills (matching Image 2) */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mb-10">
        {tabs.map((tab) => {
          const isActive = selectedTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as any)}
              className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-extrabold transition-all duration-200 cursor-pointer border ${
                isActive
                  ? 'border-rose-300 bg-[#fff1f2] text-rose-700 shadow-sm ring-2 ring-rose-200/70 scale-105'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              <span className="font-black text-sm">{tab.label}</span>
              <span className="text-[11px] font-normal opacity-85">({tab.tag})</span>
            </button>
          );
        })}
      </div>

      {/* Browser Window Frame Mockup (matching Image 2 & 3) */}
      <div className="relative mx-auto max-w-4xl rounded-[2rem] sm:rounded-[2.5rem] border border-slate-200/90 bg-white p-3 sm:p-5 shadow-2xl shadow-slate-200/90">
        {/* Browser Top Chrome Bar */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 select-none px-2">
          {/* Browser Window Action Dots (Left side in LTR, Right side in RTL) */}
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 sm:size-3 rounded-full bg-[#f87171]" />
            <span className="size-2.5 sm:size-3 rounded-full bg-[#fbbf24]" />
            <span className="size-2.5 sm:size-3 rounded-full bg-[#34d399]" />
          </div>

          {/* Browser Address Bar */}
          <div className="flex items-center gap-2 rounded-full bg-slate-100/90 border border-slate-200/80 px-4 sm:px-6 py-1 text-xs font-mono font-bold text-slate-600 shadow-xs">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span dir="ltr">{currentTab.domain}</span>
          </div>

          {/* Action toggle / Indicator */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="size-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 grid place-items-center transition-colors"
              title={isPaused ? 'Resume Auto Scroll' : 'Pause'}
            >
              {isPaused ? <Play className="size-3 fill-slate-600" /> : <Pause className="size-3 fill-slate-600" />}
            </button>
          </div>
        </div>

        {/* Viewport Container: Auto-Scrolling Downwards through the Store */}
        <div
          className="relative h-[480px] sm:h-[560px] md:h-[620px] overflow-hidden rounded-2xl bg-slate-50 border border-slate-100 shadow-inner group"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Long full-page store screenshot that smoothly scrolls downwards */}
          <div
            className={`w-full ${isPaused ? '' : 'animate-store-scroll'}`}
            style={{
              willChange: 'transform',
            }}
          >
            <img
              src="store-preview-full.png"
              onError={(e) => {
                // Fallback to absolute path or original if needed
                (e.currentTarget as HTMLImageElement).src = '/store-preview-full.png';
              }}
              alt="معاينة المتجر الإلكتروني الكامل"
              className="w-full h-auto object-cover object-top select-none pointer-events-none"
            />
          </div>

          {/* Floating Subtle Micro-Banner Indicator */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none z-20">
            <div className="flex items-center gap-2 rounded-full bg-slate-900/85 backdrop-blur-md px-4 py-1.5 text-[11px] font-extrabold text-white shadow-lg">
              <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
              <span>
                {isPaused
                  ? isAr
                    ? 'المعاينة متوقفة مؤقتاً (حرّك المؤشر للمتابعة)'
                    : 'Paused (Move cursor to resume)'
                  : isAr
                  ? '⚡ يتحرك نحو الأسفل تلقائياً — قف بالماوس للتثبيت'
                  : '⚡ Auto-scrolling downwards — hover to pause'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Note and CTA (matching Image 2) */}
      <p className="text-xs sm:text-sm font-bold text-slate-400 mt-8">
        {isAr
          ? 'غيّر الألوان والخطوط والأقسام في أي وقت — دون سطر برمجي واحد.'
          : 'Customize colors, typography, and sections anytime — with zero code.'}
      </p>

      <div className="mt-5">
        <Link
          href="/sign-up"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200/90 bg-white hover:bg-slate-50 px-8 py-3.5 text-xs sm:text-sm font-black text-slate-800 shadow-sm transition-all hover:scale-105 active:scale-95"
        >
          <span>{isAr ? 'جرّب التصاميم' : 'Try Templates'}</span>
          {isAr ? <ArrowLeft className="size-4 text-slate-700" /> : <ArrowRight className="size-4 text-slate-700" />}
        </Link>
      </div>
    </section>
  );
}
