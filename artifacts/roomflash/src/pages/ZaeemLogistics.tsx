import { useState } from 'react';
import {
  Truck, ShieldCheck, MapPin, PhoneCall, CheckCircle2, HelpCircle,
  FileText, Search, ArrowLeft, Clock, RefreshCw, Sparkles, Building
} from 'lucide-react';
import { IRAQ_GOVERNORATES, SHIPPING_RATES, formatIQD } from '../data/iraqData';

export function ZaeemLogisticsPage() {
  const [trackNumber, setTrackNumber] = useState('');
  const [trackResult, setTrackResult] = useState<string | null>(null);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackNumber.trim()) return;
    setTrackResult(`الشحنة رقم (${trackNumber.trim()}) قيد التجهيز مع مندوب الزعيم في محافظة بغداد.`);
  };

  return (
    <div className="space-y-8 rf-appear">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white p-8 md:p-12 shadow-xl border border-teal-900/50">
        <div className="absolute -right-20 -top-20 size-72 rounded-full bg-teal-500/10 blur-3xl" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold mb-4 border border-teal-500/30">
            <Building className="size-3.5" /> الناقل الرسمي للتجارة الإلكترونية والشحن السريع
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
            شركة الزعيم للشحن
          </h1>
          <p className="mt-3 text-base md:text-lg text-slate-300 leading-relaxed font-medium">
            حلول شحن وتوصيل متكاملة للتجار والمتاجر الإلكترونية داخل جميع المحافظات، بنسب تسليم قياسية وتحصيل مالي موثوق.
          </p>

          <div className="mt-8 flex flex-wrap gap-4 items-center">
            <a
              href="#coverage"
              className="px-6 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition-all"
            >
              استعرض التغطية والأسعار
            </a>
            <a
              href="#tracking"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl backdrop-blur-md transition-all"
            >
              تتبع شحنة مباشرة
            </a>
          </div>
        </div>
      </div>

      {/* Quick KPI stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <p className="text-xs font-bold text-slate-500">التغطية المحلية</p>
          <p className="text-2xl font-extrabold text-teal-800 dark:text-teal-400 mt-1">18 محافظة</p>
          <p className="text-[11px] text-slate-400 mt-1">من دهوك إلى البصرة</p>
        </div>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <p className="text-xs font-bold text-slate-500">سرعة التوصيل بـ بغداد</p>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">24 ساعة</p>
          <p className="text-[11px] text-slate-400 mt-1">توصيل بنفس اليوم أو التالي</p>
        </div>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <p className="text-xs font-bold text-slate-500">تصفية المستحقات (COD)</p>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">يومياً / أسبوعياً</p>
          <p className="text-[11px] text-slate-400 mt-1">تحويل مباشر للتاجر</p>
        </div>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <p className="text-xs font-bold text-slate-500">نسبة التوصيل الناجح</p>
          <p className="text-2xl font-extrabold text-teal-800 dark:text-teal-400 mt-1">98.4%</p>
          <p className="text-[11px] text-slate-400 mt-1">مع متابعة دقيقة لكل طلب</p>
        </div>
      </div>

      {/* Tracking Box Section */}
      <div id="tracking" className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <span className="grid size-10 place-items-center rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
            <Search className="size-5" />
          </span>
          <div>
            <h2 className="font-extrabold text-slate-900 dark:text-white text-lg">
              نظام تتبع شحنات الزعيم
            </h2>
            <p className="text-xs text-slate-500">تتبع مسار طردك لحظة بلحظة مع مندوب الشحن.</p>
          </div>
        </div>

        <form onSubmit={handleTrack} className="flex gap-2 max-w-xl">
          <input
            required
            type="text"
            value={trackNumber}
            onChange={(e) => setTrackNumber(e.target.value)}
            placeholder="أدخل رقم الشحنة ZAEEM-2026-XXXXXX"
            className="flex-1 h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-sm outline-none focus:border-teal-600"
          />
          <button
            type="submit"
            className="px-6 h-11 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold shadow-sm"
          >
            تتبع الشحنة
          </button>
        </form>

        {trackResult && (
          <div className="mt-4 p-4 rounded-xl border border-teal-200 bg-teal-50 dark:bg-teal-950/40 text-xs font-bold text-teal-900 dark:text-teal-200">
            {trackResult}
          </div>
        )}
      </div>

      {/* Coverage & Rates Section */}
      <div id="coverage" className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <MapPin className="size-5 text-teal-700" /> التغطية الجغرافية وأسعار الشحن والتوصيل
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              أسعار ثابتة وواضحة بدون تكاليف خفية، تشمل التوصيل والتحصيل والتسليم للزبون.
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {IRAQ_GOVERNORATES.map((gov) => (
            <div
              key={gov}
              className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-extrabold text-slate-900 dark:text-white block">{gov}</span>
                <span className="text-[11px] text-slate-500 font-medium">توصيل سريع</span>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
                <span className="font-mono font-bold text-xs text-teal-700 dark:text-teal-400">
                  {formatIQD(SHIPPING_RATES[gov])}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Policies */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <h3 className="font-extrabold text-slate-900 dark:text-white text-base mb-3 flex items-center gap-2">
            <Clock className="size-5 text-teal-700" /> سياسة التسليم والوقت
          </h3>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed list-disc list-inside">
            <li>التوصيل داخل بغداد خلال 24 ساعة من استلام الطرد من التاجر.</li>
            <li>التوصيل للمحافظات الأخرى خلال 48 إلى 72 ساعة كحد أقصى.</li>
            <li>مقر المحاولة الأولى للتوصيل مجاني، ومحاولتان إضافيتان في حال عدم رد الزبون.</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <h3 className="font-extrabold text-slate-900 dark:text-white text-base mb-3 flex items-center gap-2">
            <RefreshCw className="size-5 text-teal-700" /> سياسة المرتجعات وتصفية الأموال
          </h3>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed list-disc list-inside">
            <li>في حال رفض الزبون للطلب، يُعاد الطرد لمتجر التاجر مجاناً وبدون رسوم إرجاع إضافية.</li>
            <li>تصفية المبالغ المحصلة تكون عبر الحساب البنكي أو المحفظة الإلكترونية أو نقداً.</li>
            <li>كشوفات حساب تفصيلية لكل وجبة شحنات دورية.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
