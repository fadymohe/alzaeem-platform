import React, { useState, useEffect } from 'react';
import { ArrowLeft, Check } from 'lucide-react';

interface TransformationDiagramProps {
  isAr?: boolean;
}

export function TransformationDiagram({ isAr = true }: TransformationDiagramProps) {
  const [activeRow, setActiveRow] = useState<number | null>(null);
  const [autoActiveIndex, setAutoActiveIndex] = useState(0);

  // Auto-cycle through the rows to give a live breathing dynamic feeling
  useEffect(() => {
    const timer = setInterval(() => {
      setAutoActiveIndex((prev) => (prev + 1) % 4);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const currentHighlighted = activeRow !== null ? activeRow : autoActiveIndex;

  const rows = [
    {
      id: 0,
      problem: isAr ? 'رسائل واتساب متناثرة' : 'Scattered WhatsApp DMs',
      solution: isAr ? 'طلبات منظّمة بحالة واضحة' : 'Organized Orders with Clear Status',
    },
    {
      id: 1,
      problem: isAr ? 'ملفات إكسل مبعثرة' : 'Messy Spreadsheets & Sheets',
      solution: isAr ? 'مخزون يُحدّث تلقائيًا' : 'Auto-Synchronized Inventory',
    },
    {
      id: 2,
      problem: isAr ? 'متابعة يدوية لكل عميل' : 'Manual Follow-up per Customer',
      solution: isAr ? 'رسائل تلقائية في اللحظة المناسبة' : 'Timely Automated Messaging',
    },
    {
      id: 3,
      problem: isAr ? 'أرباح تُحسب بالتخمين' : 'Guessing Revenue & Margins',
      solution: isAr ? 'تحليلات لحظية بالأرقام' : 'Real-Time Numeric Analytics',
    },
  ];

  return (
    <section className="relative py-20 px-4 bg-[#fcfdfe] overflow-hidden border-y border-slate-150/70">
      {/* Delicate Grid Background Pattern (matching Image 1) */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(to right, #e2e8f0 1px, transparent 1px),
              linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
            maskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, black 50%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, black 50%, transparent 100%)',
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl">
        {/* Section Header (matching Image 2) */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-block rounded-full bg-teal-50 border border-teal-200 px-4 py-1.5 text-xs font-black text-teal-800 mb-3 shadow-xs">
            {isAr ? 'نقطة التحول مع الزعيم' : 'The Turning Point with Al-Zaeem'}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-snug">
            {isAr ? (
              <>
                هنا يأتي دور الزعيم —{' '}
                <span className="bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 bg-clip-text text-transparent">
                  الجهدُ نفسه ونتيجة مختلفة تماماً
                </span>
              </>
            ) : (
              'Here Comes Al-Zaeem — Same Effort, Entirely Better Results'
            )}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-3 font-medium">
            {isAr
              ? 'كيف تحول المنصة الفوضى اليومية في إدارة متجرك إلى تجربة مؤتمتة وسلسة بالكامل'
              : 'How Al-Zaeem transforms day-to-day retail chaos into a seamless automated machine'}
          </p>
        </div>

        {/* Diagram Main Stage */}
        <div className="relative pt-4 pb-8 select-none">
          {/* Top Logo Container (replacing 'b' logo with official Al-Zaeem logo) */}
          <div className="flex flex-col items-center justify-center relative z-20 mb-2">
            <div className="group relative">
              {/* Pulsing ambient halo behind logo card */}
              <div className="absolute -inset-2 bg-gradient-to-r from-teal-500/20 via-emerald-500/20 to-teal-600/20 rounded-3xl blur-xl -z-10 animate-pulse" />

              {/* White Logo Card */}
              <div className="size-20 sm:size-24 rounded-3xl bg-white border border-slate-200/90 shadow-2xl shadow-slate-200/80 flex items-center justify-center p-3 transition-all duration-300 group-hover:scale-105 group-hover:shadow-teal-500/10">
                <div className="size-full rounded-2xl overflow-hidden bg-white flex items-center justify-center p-1">
                  <img
                    src="logo.png"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = 'logo.svg';
                    }}
                    alt="لوجو شركة الزعيم للشحن والتجارة"
                    className="size-full object-contain filter drop-shadow-xs"
                  />
                </div>
              </div>

              {/* Floating micro-badge indicator */}
              <div className="absolute -bottom-1 -right-1 size-5 rounded-full bg-teal-600 border-2 border-white shadow-xs grid place-items-center">
                <span className="size-2 rounded-full bg-emerald-300 animate-ping" />
              </div>
            </div>

            {/* Vertical Connector Line from Logo to Center Spine */}
            <div className="relative flex flex-col items-center w-full h-14">
              {/* Connector Node bead right below card */}
              <div className="size-2.5 rounded-full bg-teal-600 ring-4 ring-teal-100 shadow-xs z-20 mt-2" />
              {/* Vertical trunk line */}
              <div className="w-[2px] h-full bg-gradient-to-b from-teal-600 via-teal-500/70 to-slate-300 relative">
                {/* Animated light pulse traveling down */}
                <div className="absolute left-[-2px] size-1.5 rounded-full bg-teal-400 shadow-sm shadow-teal-400 animate-pulse" />
              </div>
            </div>
          </div>

          {/* 4 Connected Rows */}
          <div className="relative space-y-4 sm:space-y-5">
            {/* Background Continuous Center Spine Line */}
            <div className="absolute top-0 bottom-6 left-1/2 -translate-x-1/2 w-[2px] bg-gradient-to-b from-slate-300 via-teal-400/40 to-slate-200 pointer-events-none z-0 overflow-hidden">
              {/* Continuous flowing light beam */}
              <div className="absolute left-[-2px] size-2 rounded-full bg-teal-500 shadow-md shadow-teal-400 animate-flow-down" />
            </div>

            {rows.map((row, idx) => {
              const isCurrent = currentHighlighted === idx;

              return (
                <div
                  key={row.id}
                  onMouseEnter={() => setActiveRow(idx)}
                  onMouseLeave={() => setActiveRow(null)}
                  className={`group relative grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4 md:gap-6 transition-all duration-300 cursor-pointer ${
                    isCurrent ? 'scale-[1.015]' : 'opacity-95'
                  }`}
                >
                  {/* Column 1 (RIGHT in RTL): The Problem / العيوب (Light Red / Pink card with red dot) */}
                  <div
                    className={`relative rounded-2xl sm:rounded-3xl py-3.5 sm:py-4 px-4 sm:px-6 transition-all duration-300 flex items-center gap-3 text-right shadow-xs ${
                      isCurrent
                        ? 'bg-[#fff0f2] border-2 border-rose-300/90 shadow-md shadow-rose-100/60 translate-x-1'
                        : 'bg-[#fff5f6] border border-rose-200/60 hover:bg-[#ffeff1] hover:border-rose-300'
                    }`}
                  >
                    {/* Red Dot Bullet on the outer edge */}
                    <span
                      className={`size-2 sm:size-2.5 rounded-full bg-rose-500 shrink-0 transition-transform duration-300 ${
                        isCurrent ? 'scale-125 ring-4 ring-rose-200' : ''
                      }`}
                    />

                    {/* Problem Text */}
                    <span className="font-bold text-xs sm:text-sm md:text-base text-slate-700 tracking-tight flex-1 text-right">
                      {row.problem}
                    </span>
                  </div>

                  {/* Column 2 (CENTER): Circular Arrow Button pointing from Right (Problems) to Left (Solutions) */}
                  <div className="relative z-10 shrink-0">
                    <div
                      className={`size-8 sm:size-9 rounded-full bg-white border flex items-center justify-center transition-all duration-300 shadow-sm ${
                        isCurrent
                          ? 'border-teal-500 bg-teal-50 text-teal-700 shadow-md scale-115 -translate-x-1'
                          : 'border-slate-200 text-teal-600 group-hover:border-teal-400 group-hover:text-teal-700 group-hover:scale-105'
                      }`}
                    >
                      <ArrowLeft
                        className={`size-3.5 sm:size-4 transition-transform duration-300 ${
                          isCurrent ? '-translate-x-0.5' : 'group-hover:-translate-x-0.5'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Column 3 (LEFT in RTL): The Solution / المميزات (Light Blue / Indigo card with checkmark) */}
                  <div
                    className={`relative rounded-2xl sm:rounded-3xl py-3.5 sm:py-4 px-4 sm:px-6 transition-all duration-300 flex items-center gap-3 text-right shadow-xs ${
                      isCurrent
                        ? 'bg-[#ebf2ff] border-2 border-indigo-300/90 shadow-md shadow-indigo-100/60 -translate-x-1'
                        : 'bg-[#f0f4ff] border border-indigo-200/60 hover:bg-[#eaf1ff] hover:border-indigo-300'
                    }`}
                  >
                    {/* Circular Checkmark Badge on the inner edge near the arrow */}
                    <div
                      className={`size-5 sm:size-6 rounded-full border flex items-center justify-center shrink-0 transition-transform duration-300 ${
                        isCurrent
                          ? 'border-amber-400 bg-amber-100 text-amber-700 scale-110 shadow-xs'
                          : 'border-amber-300/80 bg-amber-50/90 text-amber-600'
                      }`}
                    >
                      <Check className="size-3 sm:size-3.5 stroke-[3]" />
                    </div>

                    {/* Solution Text */}
                    <span className="font-black text-xs sm:text-sm md:text-base text-slate-800 tracking-tight flex-1 text-right">
                      {row.solution}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
