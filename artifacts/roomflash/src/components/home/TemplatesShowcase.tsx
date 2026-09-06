import React, { useState } from 'react';
import { Link } from 'wouter';
import { ArrowLeft, ArrowRight, Play, Pause, ExternalLink, Sparkles, CheckCircle2 } from 'lucide-react';

interface TemplatesShowcaseProps {
  isAr?: boolean;
}

export function TemplatesShowcase({ isAr = true }: TemplatesShowcaseProps) {
  const [selectedTab, setSelectedTab] = useState<'nexora' | 'sneak' | 'gizmo' | 'novatrend'>('nexora');
  const [isPaused, setIsPaused] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  const tabs = [
    {
      id: 'nexora' as const,
      label: isAr ? 'نيكسورا' : 'Nexora',
      tag: isAr ? 'أحذية وسنيكرز رياضية' : 'Next-Gen Footwear',
      domain: 'nexora.zaeem.iq',
      image: '/templates/store-nexora.png',
      badge: isAr ? 'سنيكرز وأحذية رياضية عصرية' : 'Next-Gen Footwear & Sneakers',
      highlightColor: 'from-lime-500 to-emerald-600',
    },
    {
      id: 'sneak' as const,
      label: isAr ? 'سنيك كونكت' : 'Sneak Connect',
      tag: isAr ? 'أزياء وستريت وير رياضي' : 'Sports & Streetwear',
      domain: 'sneak.zaeem.iq',
      image: '/templates/store-sneak.png',
      badge: isAr ? 'أحذية وأزياء رياضية احترافية' : 'Pro Athletic Footwear & Apparel',
      highlightColor: 'from-slate-700 to-slate-900',
    },
    {
      id: 'gizmo' as const,
      label: isAr ? 'جيزموهاب' : 'GizmoHub',
      tag: isAr ? 'إلكترونيات وأجهزة ذكية' : 'Smart Tech & Gadgets',
      domain: 'gizmohub.zaeem.iq',
      image: '/templates/store-gizmo.png',
      badge: isAr ? 'سماعات، ساعات، وتقنيات حديثة' : 'Smart Tech, Gadgets & Audio',
      highlightColor: 'from-blue-600 to-indigo-600',
    },
    {
      id: 'novatrend' as const,
      label: isAr ? 'نوفا تريند' : 'NovaTrend',
      tag: isAr ? 'تريند وموضة عصرية' : 'Trending Lifestyle',
      domain: 'novatrend.zaeem.iq',
      image: '/templates/store-novatrend.png',
      badge: isAr ? 'متجر تريند شامل ولايف ستايل' : 'Curated Modern Lifestyle Store',
      highlightColor: 'from-orange-500 to-rose-500',
    },
  ];

  const currentTab = tabs.find((t) => t.id === selectedTab) || tabs[0];

  const handleTabChange = (tabId: 'nexora' | 'sneak' | 'gizmo' | 'novatrend') => {
    setSelectedTab(tabId);
    // Trigger reset animation
    setAnimKey((prev) => prev + 1);
  };

  return (
    <section id="templates" className="py-24 px-4 mx-auto max-w-6xl text-center">
      {/* Section Header */}
      <div className="max-w-2xl mx-auto mb-10">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200/80 px-4 py-1.5 text-xs font-black text-blue-700 mb-4 shadow-xs">
          <span className="size-1.5 rounded-full bg-blue-600 animate-pulse" />
          <span>{isAr ? 'التصاميم والقوالب' : 'Templates'}</span>
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
          {isAr ? 'تصميم يليق بمجالك' : 'A Design Built for Your Niche'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-3 leading-relaxed">
          {isAr
            ? 'قوالب حقيقية مصممة خصيصاً للتجارة بالعراق — متوافقة بالكامل مع الدينار العراقي، بوليصات الزعيم، وزين كاش.'
            : 'Real templates tailored for Iraqi e-commerce — fully compatible with IQD, Al-Zaeem Fleet, and Zain Cash.'}
        </p>
      </div>

      {/* Template Category Selector Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mb-10">
        {tabs.map((tab) => {
          const isActive = selectedTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-extrabold transition-all duration-200 cursor-pointer border ${
                isActive
                  ? 'border-rose-300 bg-[#fff1f2] text-rose-700 shadow-md ring-2 ring-rose-200/70 scale-105'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              <span className="font-black text-sm">{tab.label}</span>
              <span className="text-[11px] font-normal opacity-85">({tab.tag})</span>
            </button>
          );
        })}
      </div>

      {/* Browser Window Frame Mockup */}
      <div className="relative mx-auto max-w-4xl rounded-[2rem] sm:rounded-[2.5rem] border border-slate-200/90 bg-white p-3 sm:p-5 shadow-2xl shadow-slate-200/90 transition-all duration-300">
        {/* Browser Top Chrome Bar */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 select-none px-2">
          {/* Browser Window Action Dots (Left in LTR, Right in RTL) */}
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 sm:size-3 rounded-full bg-[#f87171]" />
            <span className="size-2.5 sm:size-3 rounded-full bg-[#fbbf24]" />
            <span className="size-2.5 sm:size-3 rounded-full bg-[#34d399]" />
          </div>

          {/* Browser Address Bar */}
          <div className="flex items-center gap-2 rounded-full bg-slate-100/90 border border-slate-200/80 px-4 sm:px-6 py-1.5 text-xs font-mono font-bold text-slate-600 shadow-xs">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span dir="ltr">{currentTab.domain}</span>
          </div>

          {/* Action toggle / Indicator */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="flex items-center gap-1.5 rounded-full bg-slate-100 hover:bg-slate-200 px-3 py-1 text-[11px] font-bold text-slate-600 transition-colors"
              title={isPaused ? 'استئناف التمرير' : 'إيقاف مؤقت'}
            >
              {isPaused ? (
                <>
                  <Play className="size-3 fill-slate-600" />
                  <span className="hidden sm:inline">تشغيل</span>
                </>
              ) : (
                <>
                  <Pause className="size-3 fill-slate-600" />
                  <span className="hidden sm:inline">إيقاف</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Viewport Container: Auto-Scrolling Downwards through the Store */}
        <div
          className="relative h-[480px] sm:h-[580px] md:h-[640px] overflow-hidden rounded-2xl bg-slate-50 border border-slate-100 shadow-inner group"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Active store screenshot scrolling downwards smoothly */}
          <div
            key={animKey}
            className={`w-full ${isPaused ? '' : 'animate-store-scroll'}`}
            style={{
              willChange: 'transform',
            }}
          >
            <img
              src={currentTab.image}
              onError={(e) => {
                // Fallback to absolute or store-preview-full if needed
                (e.currentTarget as HTMLImageElement).src = `/${currentTab.image}`;
              }}
              alt={`معاينة متجر ${currentTab.label}`}
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
                    ? 'تم إيقاف الحركة مؤقتاً — حرّك الفأرة بعيداً للاستئناف'
                    : 'Paused — Move cursor away to resume scroll'
                  : isAr
                  ? 'جاري التمرير التلقائي لأسفل المتجر... (مرر الفأرة للإيقاف والتمعن)'
                  : 'Auto-scrolling store preview... (hover to inspect)'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Text & Action Button */}
      <p className="text-xs sm:text-sm font-bold text-slate-500 mt-8">
        {isAr
          ? 'غير الألوان والخطوط والأقسام في أي وقت — دون سطر برمجي واحد.'
          : 'Customize colors, fonts, and sections anytime — without a single line of code.'}
      </p>

      <div className="mt-5">
        <Link
          href="/sign-up"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-7 py-3 text-xs sm:text-sm font-black text-slate-800 hover:bg-slate-50 hover:border-slate-300 shadow-sm hover:shadow-md transition-all group"
        >
          <span>{isAr ? 'جرب التصاميم مجاناً' : 'Try Templates Free'}</span>
          {isAr ? (
            <ArrowLeft className="size-4 text-slate-500 group-hover:-translate-x-1 transition-transform" />
          ) : (
            <ArrowRight className="size-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
          )}
        </Link>
      </div>
    </section>
  );
}
