import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'wouter';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Store,
  MessageSquare,
  Truck,
  Wallet,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Smartphone,
  MapPin,
  Clock,
  ShieldCheck,
  Zap,
  TrendingUp
} from 'lucide-react';

interface PlatformVideoShowcaseProps {
  isAr?: boolean;
}

export function PlatformVideoShowcase({ isAr = true }: PlatformVideoShowcaseProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const STEP_DURATION = 6000; // 6 seconds per step

  const steps = [
    {
      id: 0,
      icon: Store,
      tabTitle: isAr ? '1. إطلاق المتجر' : '1. Store Launch',
      title: isAr ? 'أنشئ متجرك وارفع منتجاتك في أقل من 60 ثانية' : 'Launch your store & add products in 60s',
      subtitle: isAr
        ? 'اختر القالب المناسب لمجالك، خصص الألوان والشعار، وابدأ البيع فوراً برابط متجر رسمي.'
        : 'Pick your niche template, customize colors, and start selling with an official store URL.',
      badge: isAr ? 'إطلاق فوري بدون برمجة' : 'Instant Zero-Code Setup'
    },
    {
      id: 1,
      icon: MessageSquare,
      tabTitle: isAr ? '2. تأكيد واتساب' : '2. WhatsApp Auto-Confirm',
      title: isAr ? 'تأكيد ذكي تلقائي لكل طلب عبر واتساب بنقرة زر' : 'Smart 1-Click WhatsApp Order Confirmation',
      subtitle: isAr
        ? 'بمجرد أن يطلب العميل، تصله رسالة تلقائية مخصصة لتأكيد العنوان وتفاصيل الطلب بدون أي مجهود يدوي.'
        : 'Automated instant WhatsApp messaging validating addresses & order details without manual calls.',
      badge: isAr ? 'تقليل المرتجعات بنسبة 40%' : 'Reduces Returns by 40%'
    },
    {
      id: 2,
      icon: Truck,
      tabTitle: isAr ? '3. حجز الشحن وبوليصة ZAEEM' : '3. Waybill & Dispatch',
      title: isAr ? 'إصدار بوليصة الشحن ZAEEM وربط مباشر مع أسطول الشحن' : 'Generate ZAEEM Waybills & Dispatch with Courier Fleet',
      subtitle: isAr
        ? 'توليد باركود الشحنة بنقرة واحدة، طباعة البولايص دفعة واحدة، وإرسال إشعار تتبع مباشر للعميل.'
        : '1-click barcode generation, bulk waybill printing, and live customer GPS parcel tracking.',
      badge: isAr ? 'شحن لجميع المحافظات' : 'All Governorates Covered'
    },
    {
      id: 3,
      icon: Wallet,
      tabTitle: isAr ? '4. تحصيل الكاش في محفظتك' : '4. Cash Collection & Payout',
      title: isAr ? 'تحصيل المبالغ عند الاستلام (COD) وإيداع فوري للأرباح' : 'Instant COD Collection & Direct Wallet Payouts',
      subtitle: isAr
        ? 'يستلم المندوب المبلغ نقداً من العميل، وتتم تسوية الحسابات وإيداع أرباحك في محفظتك تلقائياً.'
        : 'Couriers collect cash safely, financial reconciliation runs automatically, and profits hit your wallet.',
      badge: isAr ? 'تسويات مالية يومية ومضمونة' : 'Guaranteed Regular Payouts'
    }
  ];

  // Automatic progression when playing
  useEffect(() => {
    if (!isPlaying) return;

    const interval = 50; // update progress every 50ms
    const stepIncrement = (interval / STEP_DURATION) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentStep((s) => (s + 1) % steps.length);
          return 0;
        }
        return prev + stepIncrement;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [isPlaying, currentStep]);

  const handleStepClick = (index: number) => {
    setCurrentStep(index);
    setProgress(0);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setProgress(0);
    setIsPlaying(true);
  };

  return (
    <section id="how-it-works" className="py-20 px-4 mx-auto max-w-6xl scroll-mt-28 md:scroll-mt-32">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 rounded-full border border-teal-200/80 bg-teal-50/80 px-4 py-1.5 text-xs font-black text-teal-800 shadow-xs mb-4">
          <Sparkles className="size-4 text-teal-600 animate-pulse" />
          <span>{isAr ? 'فيديو توضيحي تفاعلي · 60 ثانية' : 'Interactive Video Demo · 60s'}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          {isAr ? (
            <>
              شاهد كيف تعمل المنصة{' '}
              <span className="bg-gradient-to-r from-teal-700 via-emerald-600 to-teal-500 bg-clip-text text-transparent">
                من أول نقرة حتى استلام الكاش
              </span>
            </>
          ) : (
            'See How the Platform Works from Click to Cash Collection'
          )}
        </h2>
        <p className="text-xs sm:text-sm md:text-base text-slate-500 mt-3 max-w-2xl mx-auto leading-relaxed">
          {isAr
            ? 'محاكاة حية توضح السلاسة والسرعة التي يدير بها مئات التجار طلبياتهم وشحناتهم تلقائياً دون أي تشتت.'
            : 'A live interactive walkthrough demonstrating how merchants automate orders, confirmations, and shipping in minutes.'}
        </p>
      </div>

      {/* Interactive Step Navigator Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 max-w-4xl mx-auto mb-6">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isActive = currentStep === idx;
          return (
            <button
              key={step.id}
              onClick={() => handleStepClick(idx)}
              className={`rounded-2xl p-3 sm:p-4 text-right transition-all duration-300 border flex flex-col justify-between cursor-pointer ${
                isActive
                  ? 'border-teal-500 bg-teal-50/70 shadow-md ring-2 ring-teal-200 text-teal-950 scale-[1.02]'
                  : 'border-slate-200/80 bg-white hover:bg-slate-50 text-slate-600'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <div
                  className={`size-8 rounded-xl grid place-items-center transition-colors ${
                    isActive ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  <Icon className="size-4" />
                </div>
                {isActive && (
                  <span className="text-[10px] font-black uppercase tracking-wider bg-teal-200/60 text-teal-900 px-2 py-0.5 rounded-full">
                    {isAr ? 'يعمل الآن' : 'Playing'}
                  </span>
                )}
              </div>
              <span className="font-extrabold text-xs sm:text-sm block">
                {step.tabTitle}
              </span>
            </button>
          );
        })}
      </div>

      {/* Video Player Mockup Container */}
      <div className="relative mx-auto max-w-4xl rounded-3xl border border-slate-300/80 bg-slate-950 text-white shadow-2xl shadow-slate-900/40 overflow-hidden">
        {/* Player Top Window Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/90 px-4 py-3 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-red-500/90" />
            <span className="size-3 rounded-full bg-amber-500/90" />
            <span className="size-3 rounded-full bg-emerald-500/90" />
            <span className="mx-3 text-[11px] font-mono text-slate-400 hidden sm:inline">
              alzaeem-platform-demo.mp4 · 1080p 60fps
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800/80 px-2.5 py-0.5 rounded-full">
              {isAr ? 'محاكاة حية تفاعلية' : 'Live Simulation'}
            </span>
            <button
              onClick={() => setIsMuted(!isMuted)}
              title={isMuted ? 'Unmute' : 'Mute'}
              className="text-slate-400 hover:text-white transition-colors"
            >
              {isMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
            </button>
          </div>
        </div>

        {/* Video Viewport: Stage Display */}
        <div className="relative min-h-[360px] sm:min-h-[420px] md:min-h-[460px] p-6 sm:p-10 flex flex-col justify-between bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
          
          {/* Subtle Ambient Background Animation */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-1/4 -right-1/4 size-96 rounded-full bg-teal-500/10 blur-[100px] animate-pulse" />
            <div className="absolute -bottom-1/4 -left-1/4 size-96 rounded-full bg-blue-500/10 blur-[100px] animate-pulse" />
          </div>

          {/* Current Step Description Overlay */}
          <div className="relative z-10 flex items-start justify-between gap-4 flex-wrap">
            <div className="space-y-1.5 max-w-xl text-right">
              <div className="inline-flex items-center gap-2 rounded-full bg-teal-500/20 border border-teal-500/40 px-3 py-1 text-[11px] font-extrabold text-teal-300 mb-1">
                <span>{steps[currentStep].badge}</span>
              </div>
              <h3 className="text-lg sm:text-2xl font-black text-white">
                {steps[currentStep].title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {steps[currentStep].subtitle}
              </p>
            </div>
          </div>

          {/* Interactive Animated Visual Scene Content based on currentStep */}
          <div className="relative z-10 my-6 flex items-center justify-center">
            {/* SCENE 0: Store Setup */}
            {currentStep === 0 && (
              <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-2xl backdrop-blur-sm animate-fadeIn">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-teal-400">
                    <Store className="size-4" />
                    <span>store.zaeem.shop/my-brand</span>
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                    ✓ متجر مفعل
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 flex flex-col justify-between">
                    <div className="size-16 rounded-lg bg-teal-500/10 grid place-items-center text-teal-300 mx-auto mb-2">
                      <Store className="size-8" />
                    </div>
                    <span className="text-xs font-bold text-slate-200 text-center">تيشيرت براند الزعيم</span>
                    <span className="text-[11px] font-black text-teal-400 font-mono text-center mt-1">+390 EGP</span>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 flex flex-col justify-between">
                    <div className="size-16 rounded-lg bg-blue-500/10 grid place-items-center text-blue-300 mx-auto mb-2">
                      <Sparkles className="size-8" />
                    </div>
                    <span className="text-xs font-bold text-slate-200 text-center">حقيبة جلد كلاسيك</span>
                    <span className="text-[11px] font-black text-blue-400 font-mono text-center mt-1">+600 EGP</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>⚡ سرعة تحميل 0.4 ثانية</span>
                  <span className="text-teal-300 font-bold">بدون أي عمولة على المبيعات (0%)</span>
                </div>
              </div>
            )}

            {/* SCENE 1: WhatsApp Confirmation */}
            {currentStep === 1 && (
              <div className="w-full max-w-md rounded-2xl border border-emerald-900/60 bg-[#0b141a] p-4 shadow-2xl backdrop-blur-sm animate-fadeIn">
                <div className="flex items-center justify-between border-b border-emerald-900/40 pb-2 mb-3 text-right">
                  <div className="flex items-center gap-2">
                    <div className="size-8 rounded-full bg-emerald-600 text-white grid place-items-center font-bold text-xs">
                      WA
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">بوت واتساب الزعيم التلقائي</span>
                      <span className="text-[10px] text-emerald-400">متصل الآن · تأكيد فوري</span>
                    </div>
                  </div>
                  <CheckCircle2 className="size-4 text-emerald-400" />
                </div>

                <div className="space-y-3">
                  <div className="rounded-xl bg-[#202c33] p-3 text-right text-xs text-slate-200 max-w-[85%] ml-auto border border-emerald-900/30">
                    <p className="leading-relaxed">
                      أهلاً أحمد! 👋 تم استلام طلبك رقم <span className="text-emerald-400 font-mono font-bold">#1004</span> (تيشيرت أوفرسايز - جدة / الجيزة).
                    </p>
                    <p className="mt-1 text-[11px] text-slate-400">
                      هل تود تأكيد شحن الطلب فوراً لعنوانك؟
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#005c4b] p-3 text-center text-xs font-black text-white shadow-md border border-emerald-400/40 cursor-pointer animate-pulse">
                    «نعم، أكد الطلب والشحن الآن ✓»
                  </div>

                  <div className="rounded-xl bg-[#202c33] p-2.5 text-right text-[11px] text-emerald-300 max-w-[80%] ml-auto border border-emerald-700/30">
                    ✓ تم تأكيد الطلب وتجهيز بوليصة الشحن بنجاح!
                  </div>
                </div>
              </div>
            )}

            {/* SCENE 2: Waybill & Fleet Dispatch */}
            {currentStep === 2 && (
              <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-2xl backdrop-blur-sm animate-fadeIn">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Truck className="size-5 text-teal-400" />
                    <span className="text-xs font-bold text-white">أسطول شركة الزعيم للشحن</span>
                  </div>
                  <span className="text-xs font-mono font-black text-teal-400 bg-teal-950 border border-teal-800 px-2.5 py-0.5 rounded-full">
                    TRK-29841
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">خط سير الشحنة</span>
                      <span className="text-xs font-bold text-slate-200">من مستودع التاجر ➔ إلى باب العميل</span>
                    </div>
                    <div className="size-9 rounded-full bg-teal-600/20 text-teal-300 grid place-items-center">
                      <MapPin className="size-4 animate-bounce" />
                    </div>
                  </div>

                  {/* Waybill Mock Barcode */}
                  <div className="p-3 rounded-xl bg-white text-slate-900 flex flex-col items-center justify-center">
                    <span className="text-[10px] font-bold text-slate-500 mb-1">بوليصة شحن معتمدة ZAEEM</span>
                    <div className="h-8 w-48 bg-[repeating-linear-gradient(to_right,#000_0px,#000_2px,transparent_2px,transparent_4px)]" />
                    <span className="text-[10px] font-mono font-black mt-1">#1004 · TRK-29841 · COD: +390 EGP</span>
                  </div>
                </div>
              </div>
            )}

            {/* SCENE 3: Cash Collection & Payouts */}
            {currentStep === 3 && (
              <div className="w-full max-w-md rounded-2xl border border-teal-900/60 bg-slate-900/95 p-5 shadow-2xl backdrop-blur-sm animate-fadeIn">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-teal-400">
                    <Wallet className="size-5" />
                    <span>محفظة التاجر الإلكترونية</span>
                  </div>
                  <span className="text-[10px] bg-teal-500/20 text-teal-300 border border-teal-500/30 px-2.5 py-0.5 rounded-full font-bold">
                    إيداع فوري
                  </span>
                </div>

                <div className="text-center py-4 bg-gradient-to-b from-teal-950/40 to-transparent rounded-2xl border border-teal-800/40 mb-3">
                  <span className="text-xs text-slate-400 block mb-1">إجمالي الأرباح الصافية المحصلة</span>
                  <div className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono tracking-tight animate-pulse">
                    19,410 <span className="text-sm font-bold text-white">{isAr ? 'ج.م' : 'EGP'}</span>
                  </div>
                  <span className="text-[11px] text-emerald-400 font-bold mt-1 inline-flex items-center gap-1">
                    <CheckCircle2 className="size-3" />
                    {isAr ? 'تم تحصيل مبالغ الدفع عند الاستلام بنجاح' : 'All COD Cash Collected'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
                  <span>طلب سحب للأرباح بنقرة واحدة</span>
                  <span className="text-teal-400 font-bold">تحويل بنكي / محفظة فودافون / كاش</span>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Player Controls Bar */}
          <div className="relative z-10 pt-4 border-t border-slate-800/90 flex flex-col gap-3">
            {/* Timeline Scrubber Progress */}
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full rounded-full transition-all duration-75"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlay}
                  className="size-8 rounded-full bg-teal-600 hover:bg-teal-500 text-white grid place-items-center transition-transform hover:scale-110"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="size-4 fill-white" /> : <Play className="size-4 fill-white ml-0.5" />}
                </button>

                <button
                  onClick={handleReset}
                  className="size-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 grid place-items-center transition-colors"
                  title="Replay"
                >
                  <RotateCcw className="size-3.5" />
                </button>

                <span className="font-mono text-[11px] text-slate-300">
                  {`0${currentStep + 1}:0${Math.floor((progress / 100) * 6)} / 04:00`}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="hidden sm:inline text-[11px]">
                  {isAr ? 'المرحلة' : 'Step'} {currentStep + 1} {isAr ? 'من' : 'of'} 4
                </span>
                <button
                  onClick={() => setCurrentStep((s) => (s + 1) % steps.length)}
                  className="flex items-center gap-1 text-slate-300 hover:text-white font-bold text-xs"
                >
                  <span>{isAr ? 'المرحلة التالية' : 'Next Step'}</span>
                  {isAr ? <ArrowLeft className="size-3.5" /> : <ArrowRight className="size-3.5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Conversion Prompt */}
      <div className="mt-8 text-center">
        <Link
          href="/sign-up"
          className="inline-flex items-center gap-2.5 rounded-full bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-sm px-8 py-4 shadow-xl shadow-teal-700/25 transition-all hover:scale-105"
        >
          <span>{isAr ? 'ابدأ تجربتك المجانية الآن — أول 5 طلبات مجاناً' : 'Start Free Trial Now — First 5 Orders Free'}</span>
          {isAr ? <ArrowLeft className="size-4" /> : <ArrowRight className="size-4" />}
        </Link>
        <p className="text-xs text-slate-400 font-bold mt-2.5">
          {isAr
            ? 'بدون بطاقة ائتمان — بدون عمولة على المبيعات — متجرك جاهز في دقيقة'
            : 'No credit card required — 0% sales commission — Ready in 1 minute'}
        </p>
      </div>
    </section>
  );
}
