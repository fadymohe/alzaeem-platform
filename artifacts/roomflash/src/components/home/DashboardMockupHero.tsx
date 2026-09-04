import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';

interface DashboardMockupHeroProps {
  isAr?: boolean;
}

export function DashboardMockupHero({ isAr = true }: DashboardMockupHeroProps) {
  const [activeOrderIndex, setActiveOrderIndex] = useState(0);
  const [isChartHovered, setIsChartHovered] = useState(false);

  // Live order ticker animation to simulate real-time incoming orders
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveOrderIndex((prev) => (prev + 1) % 4);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  const orders = [
    {
      id: '1004',
      name: isAr ? 'تيشيرت أوفرسايز · جدة' : 'Oversized T-Shirt · Jeddah',
      price: '+390 EGP',
      time: isAr ? 'منذ ثوانٍ' : 'Just now'
    },
    {
      id: '1003',
      name: isAr ? 'حقيبة جلد · الجيزة' : 'Leather Bag · Giza',
      price: '+600 EGP',
      time: isAr ? 'منذ 3 دقائق' : '3m ago'
    },
    {
      id: '1001',
      name: isAr ? 'ساعة ذكية · القاهرة' : 'Smart Watch · Cairo',
      price: '+640 EGP',
      time: isAr ? 'منذ 8 دقائق' : '8m ago'
    },
    {
      id: '1002',
      name: isAr ? 'تيشيرت أوفرسايز · الجيزة' : 'Oversized T-Shirt · Giza',
      price: '+450 EGP',
      time: isAr ? 'منذ 14 دقيقة' : '14m ago'
    }
  ];

  return (
    <div className="relative mx-auto max-w-5xl px-2 sm:px-4 pb-16 pt-4">
      {/* Background vertical column grid effect */}
      <div className="absolute inset-0 -top-10 -bottom-10 pointer-events-none flex justify-around opacity-30 z-0">
        <div className="w-px bg-gradient-to-b from-transparent via-slate-300 to-transparent" />
        <div className="w-px bg-gradient-to-b from-transparent via-slate-300 to-transparent" />
        <div className="w-px bg-gradient-to-b from-transparent via-slate-300 to-transparent" />
        <div className="w-px bg-gradient-to-b from-transparent via-slate-300 to-transparent" />
        <div className="w-px bg-gradient-to-b from-transparent via-slate-300 to-transparent" />
      </div>

      {/* Main Dashboard Window Container */}
      <div
        dir="ltr"
        className="relative rounded-[2rem] sm:rounded-[2.5rem] border border-slate-200/90 bg-white p-4 sm:p-7 md:p-8 shadow-2xl shadow-slate-200/80 transition-all duration-300 z-10"
      >
        {/* ======================================================== */}
        {/* Top Header Bar */}
        {/* ======================================================== */}
        <div className="flex items-center justify-between border-b border-slate-100/90 pb-4 mb-6 select-none">
          {/* Live Badge (Left side) */}
          <div className="flex items-center gap-2 rounded-full bg-[#edfbf4] border border-[#c7f2da] px-3.5 py-1 text-xs font-bold text-[#059669] shadow-xs transition-transform hover:scale-105">
            <span className="relative flex size-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full size-2.5 bg-emerald-500 shadow-sm shadow-emerald-400"></span>
            </span>
            <span className="tracking-wide">{isAr ? 'مباشر' : 'LIVE'}</span>
          </div>

          {/* Title & 3 Colored Window Dots (Right side) */}
          <div className="flex items-center gap-3 text-slate-700">
            <span className="font-extrabold text-xs sm:text-sm md:text-base text-slate-700">
              {isAr ? 'لوحة تحكم متجرك' : 'Your Store Dashboard'}
            </span>
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 sm:size-3 rounded-full bg-[#8ce098] shadow-xs transition-transform hover:scale-125" />
              <span className="size-2.5 sm:size-3 rounded-full bg-[#fcd34d] shadow-xs transition-transform hover:scale-125" />
              <span className="size-2.5 sm:size-3 rounded-full bg-[#f87171] shadow-xs transition-transform hover:scale-125" />
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* Main Grid: Left Column Orders, Right Column Stats & Chart */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch relative">
          
          {/* ---------------------------------------------------- */}
          {/* Left Column: Orders Stream List (5 cols on LG) */}
          {/* ---------------------------------------------------- */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-3 relative">
            {orders.map((order, idx) => {
              const isActive = activeOrderIndex === idx;
              return (
                <div
                  key={order.id}
                  onMouseEnter={() => setActiveOrderIndex(idx)}
                  className={`rounded-2xl border p-3.5 sm:p-4 flex items-center justify-between transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'border-emerald-400/80 bg-emerald-50/50 shadow-md shadow-emerald-500/10 -translate-y-0.5'
                      : 'border-slate-100 bg-[#f8fafc]/90 hover:border-slate-200 hover:bg-white'
                  }`}
                >
                  {/* Price Tag (Left side of card) */}
                  <div className="text-left font-black text-xs sm:text-sm text-[#b45309] font-mono tracking-tight shrink-0 transition-transform duration-200">
                    <span className={isActive ? 'inline-block scale-105 transition-transform' : ''}>
                      {order.price}
                    </span>
                  </div>

                  {/* Order Title & Details (Right side of card) */}
                  <div className="flex flex-col text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className="font-extrabold text-slate-900 text-xs sm:text-sm">
                        {isAr ? `طلب جديد #${order.id}` : `New Order #${order.id}`}
                      </span>
                      <span
                        className={`size-2.5 rounded-full shrink-0 transition-all duration-300 ${
                          isActive
                            ? 'bg-emerald-600 scale-125 ring-4 ring-emerald-100 shadow-xs shadow-emerald-500'
                            : 'bg-emerald-600'
                        }`}
                      />
                    </div>
                    <span className="text-[11px] sm:text-xs text-slate-400 font-medium mt-1">
                      {order.name}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Overlaid Floating Shipment Badge (Bottom-Left edge) */}
            <div className="relative lg:absolute -bottom-3 -left-2 sm:-bottom-4 sm:-left-3 z-20 mt-2 lg:mt-0">
              <div className="rounded-2xl border border-slate-200/90 bg-white px-4 py-3 shadow-xl shadow-slate-300/60 flex items-center gap-3 transition-all duration-300 hover:scale-105 animate-float-slow">
                <div className="flex flex-col text-right">
                  <span className="text-[11px] font-bold text-slate-400">
                    {isAr ? 'شحنة اتحجزت' : 'Shipment Booked'}
                  </span>
                  <div className="flex items-center gap-1.5 text-teal-700 font-black text-xs sm:text-sm font-mono mt-0.5">
                    <span>TRK-29841</span>
                    <span className="text-base leading-none animate-arrow-slide">→</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ---------------------------------------------------- */}
          {/* Right Column: Stats, Wave Chart & Courier Status (7 cols) */}
          {/* ---------------------------------------------------- */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4 relative">
            
            {/* Top Row: 3 Metric Cards */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3 relative">
              
              {/* Card 1 (Left of top row): Customers */}
              <div className="rounded-2xl border border-slate-100 bg-white p-3 sm:p-4 flex flex-col justify-center text-right shadow-xs transition-all duration-200 hover:scale-[1.02] hover:border-slate-200">
                <span className="text-[11px] sm:text-xs font-bold text-slate-400 block mb-1">
                  {isAr ? 'العملاء' : 'Customers'}
                </span>
                <span className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
                  33
                </span>
              </div>

              {/* Card 2 (Middle of top row): Orders */}
              <div className="rounded-2xl border border-slate-100 bg-white p-3 sm:p-4 flex flex-col justify-center text-right shadow-xs transition-all duration-200 hover:scale-[1.02] hover:border-slate-200">
                <span className="text-[11px] sm:text-xs font-bold text-slate-400 block mb-1">
                  {isAr ? 'الطلبات' : 'Orders'}
                </span>
                <span className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
                  49
                </span>
              </div>

              {/* Card 3 (Right of top row): Revenue in soft emerald/teal tint */}
              <div className="rounded-2xl border border-teal-100 bg-[#ecfdf5] p-3 sm:p-4 flex flex-col justify-center text-right transition-all duration-200 hover:scale-[1.02] relative overflow-hidden">
                <span className="text-lg sm:text-2xl font-black text-teal-700 font-mono tracking-tight">
                  19,410 <span className="text-xs sm:text-sm font-bold">{isAr ? 'ج.م' : 'EGP'}</span>
                </span>
                {/* Subtle light shimmer line */}
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none animate-shimmer" />
              </div>

              {/* Overlaid Floating WhatsApp Notification (Top-Right over Revenue) */}
              <div className="absolute -top-7 -right-2 sm:-top-8 sm:-right-3 z-20">
                <div className="rounded-2xl border border-slate-200/90 bg-white px-3.5 sm:px-4 py-2 sm:py-2.5 shadow-xl shadow-slate-300/60 flex flex-col text-right transition-all duration-300 hover:scale-105 animate-float-delayed">
                  <span className="text-[10px] sm:text-[11px] font-bold text-slate-400">
                    {isAr ? 'رسالة واتساب تلقائية' : 'Automated WhatsApp'}
                  </span>
                  <span className="text-emerald-600 font-black text-xs sm:text-sm mt-0.5 flex items-center justify-end gap-1">
                    <span>{isAr ? '«طلبك اتأكد' : '«Order Confirmed'}</span>
                    <span className="text-emerald-600 font-black">✓»</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Middle: Smooth Wavy Area Line Chart in Emerald Green */}
            <div
              className="rounded-2xl border border-slate-100 bg-[#f8fafc]/90 p-3 sm:p-4 relative overflow-hidden h-36 sm:h-44 flex flex-col justify-end group cursor-pointer"
              onMouseEnter={() => setIsChartHovered(true)}
              onMouseLeave={() => setIsChartHovered(false)}
            >
              {/* Background gradient subtle glow */}
              <div className="absolute inset-0 bg-gradient-to-b from-teal-50/20 to-transparent pointer-events-none" />

              {/* Interactive Tooltip on Hover */}
              {isChartHovered && (
                <div className="absolute top-3 right-4 z-20 rounded-xl bg-slate-900/90 text-white text-[11px] font-bold px-3 py-1.5 shadow-lg backdrop-blur-xs flex items-center gap-2 animate-fadeIn pointer-events-none">
                  <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>{isAr ? 'أعلى ذروة مبيعات اليوم: +4,250 ج.م' : 'Peak Sales Today: +4,250 EGP'}</span>
                </div>
              )}

              {/* Smooth Spline SVG Area Chart with Live Waves */}
              <div className="relative w-full h-full flex items-end">
                <svg
                  viewBox="0 0 500 160"
                  preserveAspectRatio="none"
                  className="w-full h-32 sm:h-36 overflow-visible"
                >
                  <defs>
                    <linearGradient id="dashboardAreaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0d9488" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#0d9488" stopOpacity="0.01" />
                    </linearGradient>

                    {/* Animated moving wave shimmer along curve */}
                    <linearGradient id="curveWaveShimmer" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#0f766e" />
                      <stop offset="50%" stopColor="#14b8a6" />
                      <stop offset="100%" stopColor="#0f766e" />
                    </linearGradient>
                  </defs>

                  {/* Area Fill beneath curve */}
                  <path
                    d="M 0,110 
                       C 35,108 65,116 95,106 
                       C 125,96 155,108 185,100 
                       C 215,92 245,98 275,88 
                       C 305,78 335,85 365,72 
                       C 400,58 440,68 500,60 
                       L 500,160 L 0,160 Z"
                    fill="url(#dashboardAreaGrad)"
                  />

                  {/* Top Curve Line with smooth bezier wiggles */}
                  <path
                    d="M 0,110 
                       C 35,108 65,116 95,106 
                       C 125,96 155,108 185,100 
                       C 215,92 245,98 275,88 
                       C 305,78 335,85 365,72 
                       C 400,58 440,68 500,60"
                    fill="none"
                    stroke="#0f766e"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-all duration-300"
                  />

                  {/* Interactive Glowing Pulse Dot on the latest peak (cx=500, cy=60) */}
                  <circle
                    cx="500"
                    cy="60"
                    r={isChartHovered ? '6' : '4.5'}
                    fill="#0f766e"
                    className="transition-all duration-300"
                  />
                  <circle
                    cx="500"
                    cy="60"
                    r={isChartHovered ? '14' : '9'}
                    fill="#14b8a6"
                    opacity="0.4"
                    className="animate-ping"
                  />
                </svg>
              </div>
            </div>

            {/* Bottom Status Banner: Booked with Courier */}
            <div className="rounded-2xl border border-emerald-100/90 bg-[#f0fdf4]/90 py-3 px-4 text-center flex items-center justify-center gap-2 shadow-xs transition-transform hover:scale-[1.01]">
              <span className="text-emerald-700 font-bold text-xs sm:text-sm flex items-center gap-1.5">
                <span className="text-emerald-600 font-black">✓</span>
                <span>{isAr ? 'تم حجز الشحنة مع شركة الشحن' : 'Shipment Booked with Courier'}</span>
              </span>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* Floating Bottom Bar: Ready to start? (Overlapping bottom edge) */}
        {/* ======================================================== */}
        <div className="absolute -bottom-6 sm:-bottom-7 left-1/2 -translate-x-1/2 z-30">
          <div className="rounded-full border border-slate-200/90 bg-white py-2 px-4 sm:px-6 shadow-2xl shadow-slate-300/80 flex items-center gap-3 sm:gap-6 backdrop-blur-md">
            {/* Button (Left side of pill, branded Emerald / Teal) */}
            <Link
              href="/sign-up"
              className="relative overflow-hidden inline-flex items-center justify-center rounded-full bg-teal-700 hover:bg-teal-800 text-white font-black text-xs sm:text-sm px-5 sm:px-7 py-2.5 shadow-lg shadow-teal-700/30 transition-all hover:scale-105 active:scale-95 whitespace-nowrap group"
            >
              <span className="relative z-10">{isAr ? 'ابدأ متجرك مجانًا' : 'Start Free Store'}</span>
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent group-hover:animate-shimmer" />
            </Link>

            {/* Ready to start text (Right side of pill) */}
            <span className="text-xs sm:text-sm font-extrabold text-slate-800 whitespace-nowrap">
              {isAr ? 'جاهز للبدء؟' : 'Ready to start?'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
