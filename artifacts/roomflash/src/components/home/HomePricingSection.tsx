import React from 'react';
import { Link } from 'wouter';
import {
  CheckCircle2, Globe, Tag, CreditCard, ArrowLeft, ArrowRight,
  Sparkles, Zap, ShieldCheck
} from 'lucide-react';

interface HomePricingSectionProps {
  isAr?: boolean;
}

export function HomePricingSection({ isAr = true }: HomePricingSectionProps) {
  return (
    <section id="pricing" className="py-20 px-4 mx-auto max-w-6xl relative overflow-hidden">
      {/* Header Container */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        {/* Top Pill Badge */}
        <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50/80 px-4 py-1.5 text-xs font-black text-emerald-800 shadow-xs backdrop-blur-sm">
          <Globe className="size-3.5 text-emerald-600" />
          <span>{isAr ? 'الأسعار' : 'Pricing'}</span>
        </div>

        {/* Main Heading */}
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-[1.25] tracking-tight">
          {isAr ? (
            <>
              هل تعتقد أن إنشاء متجر إلكتروني أمر معقد؟
              <br />
              صدقنا... <span className="text-[#00b050]">الأمر أسهل</span> مما تتوقع وعكس كل تجاربك السابقة
            </>
          ) : (
            <>
              Think Building an Online Store is Complex?
              <br />
              Trust us... <span className="text-[#00b050]">It is Way Easier</span> than you ever thought
            </>
          )}
        </h2>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto leading-relaxed font-medium">
          {isAr ? (
            <>
              بدون اشتراكات باهظة أو أنظمة صعبة أو مطورين ومبرمجين
              <br />
              الحل الآن مع الزعيم أسرع، أسهل، وأقل سعراً
            </>
          ) : (
            <>
              No high upfront fees, complex setups, or costly developers.
              <br />
              With Al-Zaeem, launching your store is faster, simpler, and more affordable.
            </>
          )}
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
        
        {/* 1. الباقة العادية (Green Card) */}
        <div className="rounded-[2.5rem] bg-[#00b050] text-white p-8 sm:p-10 shadow-2xl shadow-emerald-600/25 flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:translate-y-[-4px]">
          {/* Subtle glow circle in background */}
          <div className="absolute top-0 right-0 size-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />

          <div>
            {/* Top Badge & Header */}
            <div className="flex items-center justify-between gap-4 mb-4">
              <span className="bg-black/90 text-white text-[11px] font-bold px-3 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
                <Tag className="size-3" />
                <span>{isAr ? 'أقل سعر (مجاني)' : 'Lowest Cost (Free Start)'}</span>
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-white">
              {isAr ? 'الباقة العادية' : 'Standard Plan'}
            </h3>

            <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-medium mt-2.5">
              {isAr
                ? 'ادفع مبلغ رمزي فقط 4 سنتات لكل طلب، وابدأ ببيع منتجاتك فورًا'
                : 'Pay a tiny fee of only $0.04 per order, and start selling your products right away.'}
            </p>

            {/* Price block */}
            <div className="flex items-baseline gap-2 mt-6">
              <span className="text-4xl sm:text-5xl font-black font-mono text-white tracking-tight">
                $0.04
              </span>
              <span className="text-xs sm:text-sm font-bold text-white/90">
                {isAr ? '/ 4 سنت لكل طلب' : '/ 4 cents per order'}
              </span>
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-white/25 my-8" />

            {/* Features List */}
            <ul className="space-y-4 text-xs sm:text-sm font-bold text-white mb-10">
              {[
                isAr ? 'عدد غير محدود من المنتجات' : 'Unlimited products',
                isAr ? 'عدد غير محدود من الطلبات' : 'Unlimited orders',
                isAr ? 'زيارات غير محدودة' : 'Unlimited store visits',
                isAr ? 'رابط مباشر للدفع الإلكتروني' : 'Direct checkout & payment links',
                isAr ? 'متجرك يظل مفتوحًا حتى لو لم تجدّد الاشتراك' : 'Your store remains active anytime',
                isAr ? 'دعم سريع على مدار الساعة' : '24/7 dedicated support',
              ].map((feat, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <div className="size-5 rounded-full bg-white text-[#00b050] grid place-items-center shrink-0 shadow-xs">
                    <CheckCircle2 className="size-5 fill-white text-[#00b050]" />
                  </div>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Button */}
          <Link
            href="/sign-up"
            className="w-full py-4 rounded-2xl bg-white hover:bg-slate-50 text-[#00b050] text-sm font-black flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
          >
            <span>{isAr ? 'اشترك الآن' : 'Subscribe Now'}</span>
            {isAr ? <ArrowLeft className="size-4" /> : <ArrowRight className="size-4" />}
          </Link>
        </div>

        {/* 2. الباقة الاحترافية (White Card) */}
        <div className="rounded-[2.5rem] bg-white border border-slate-200/90 p-8 sm:p-10 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between relative hover:translate-y-[-4px]">
          <div>
            {/* Top Badge & Header */}
            <div className="flex items-center justify-between gap-4 mb-4">
              <span className="bg-black text-white text-[11px] font-bold px-3 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
                <CreditCard className="size-3" />
                <span>{isAr ? 'للطلبات الكبيرة' : 'For High Volume'}</span>
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
              {isAr ? 'الباقة الاحترافية' : 'Pro Plan'}
            </h3>

            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium mt-2.5">
              {isAr
                ? 'هل تحقق عدد طلبات كبير؟ ادفع اشتراك شهري بدون أي عمولة علي الطلبات'
                : 'Processing high order volumes? Pay a flat monthly fee with 0% order commission.'}
            </p>

            {/* Price block */}
            <div className="flex items-baseline gap-2 mt-6">
              <span className="text-4xl sm:text-5xl font-black font-mono text-slate-900 tracking-tight">
                $100
              </span>
              <span className="text-xs sm:text-sm font-bold text-[#00b050]">
                {isAr ? '/ شهرياً' : '/ monthly'}
              </span>
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-slate-100 my-8" />

            {/* Features List */}
            <ul className="space-y-4 text-xs sm:text-sm font-bold text-slate-700 mb-10">
              {[
                isAr ? 'عدد غير محدود من الطلبات بدون عمولة' : 'Unlimited 0% commission orders',
                isAr ? 'عدد غير محدود من المنتجات' : 'Unlimited products',
                isAr ? 'عدد غير محدود من الطلبات' : 'Unlimited orders',
                isAr ? 'زيارات غير محدودة' : 'Unlimited visits & bandwidth',
                isAr ? 'رابط مباشر للدفع الإلكتروني' : 'Direct payment gateway',
                isAr ? 'متجرك يظل مفتوحًا حتى لو لم تجدّد الاشتراك' : 'Store stays always active',
                isAr ? 'دعم سريع على مدار الساعة' : 'Priority 24/7 dedicated support',
              ].map((feat, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <div className="size-5 rounded-full bg-emerald-50 text-[#00b050] grid place-items-center shrink-0">
                    <CheckCircle2 className="size-5 fill-emerald-100 text-[#00b050]" />
                  </div>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Button */}
          <Link
            href="/sign-up"
            className="w-full py-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-900 text-sm font-black flex items-center justify-center gap-2 border border-slate-200/80 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
          >
            <span>{isAr ? 'اشترك الآن' : 'Subscribe Now'}</span>
            {isAr ? <ArrowLeft className="size-4" /> : <ArrowRight className="size-4" />}
          </Link>
        </div>

      </div>
    </section>
  );
}
