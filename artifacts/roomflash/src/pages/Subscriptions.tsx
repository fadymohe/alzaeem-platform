import { useState } from 'react';
import {
  CreditCard, CheckCircle2, ShieldCheck, Sparkles, Clock, FileText,
  Building, ArrowLeft, RefreshCw, AlertCircle
} from 'lucide-react';
import { formatIQD } from '../data/iraqData';

interface Plan {
  id: string;
  name: string;
  priceMonthly: number;
  description: string;
  features: string[];
  popular?: boolean;
  orderLimitText: string;
}

const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'مجاني',
    priceMonthly: 0,
    description: 'للبدء وتجربة المنصة بطلب الشحنات الأولى.',
    orderLimitText: '10 طلبات شهرياً',
    features: [
      'متجر إلكتروني بسيط',
      '10 طلبات شهرياً مجاناً',
      'ربط أسطول الزعيم للشحن',
      'صفحة هبوط واحدة',
      'دعم عبر البريد الإلكتروني',
    ],
  },
  {
    id: 'basic',
    name: 'أساسي',
    priceMonthly: 45000,
    description: 'للمتاجر الناشئة التي تريد الاستقرار والتوسع.',
    orderLimitText: '100 طلب شهرياً',
    features: [
      'منتجات متجر غير محدودة',
      '100 طلب شهرياً',
      'ربط واتساب وإشعار الزبائن',
      '5 صفحات هبوط',
      'تحليلات المبيعات والطلبات',
      'تصفية أسبوعية للتحصيل النظير',
    ],
  },
  {
    id: 'pro',
    name: 'احترافي',
    priceMonthly: 95000,
    description: 'للأعمال المتنامية بكثافة شحنات يومية عالي.',
    popular: true,
    orderLimitText: 'طلبات غير محدودة',
    features: [
      'طلبات وشحنات غير محدودة',
      'ربط نطاق مخصص (.iq / .com)',
      'صفحات هبوط غير محدودة',
      'تكامل جميع تطبيقات الزعيم (Meta/Google)',
      'تصفية يومية لمبالغ COD',
      'مدير حساب خاص لخدمة المتاجر',
    ],
  },
  {
    id: 'enterprise',
    name: 'أعمال',
    priceMonthly: 195000,
    description: 'للشركات الكبيرة والمستودعات والتجارة السريعة.',
    orderLimitText: 'حلول مخصصة للشركات',
    features: [
      'جميع ميزات الخطة الاحترافية',
      'ربط REST API و Webhooks مخصص',
      'مستودع تخزين مخصص لدى شركة الزعيم',
      'خصومات خاصة على أسعار الشحن للمحافظات',
      'دعم فني 24/7 عبر الهاتف والتغرام',
    ],
  },
];

export function SubscriptionsPage() {
  const [currentPlanId, setCurrentPlanId] = useState<string>('free');
  const [isAnnual, setIsAnnual] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const handleUpgrade = (planName: string, id: string) => {
    setCurrentPlanId(id);
    setNotification(`تم تقديم طلب ترقية الخطة إلى "${planName}". سيتم تفعيل الميزات مباشرة.`);
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="space-y-8 rf-appear">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-teal-700 dark:text-teal-400 mb-1">
            <CreditCard className="size-4" /> الاشتراكات والفوترة
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            خطط الأسعار والفوترة بالجنيه المصري
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            اختر الخطة المناسبة لحجم تجارتك وشحناتك اليومية مع شركة الزعيم.
          </p>
        </div>

        <div className="inline-flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setIsAnnual(false)}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
              !isAnnual ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'
            }`}
          >
            فوترة شهرية
          </button>
          <button
            onClick={() => setIsAnnual(true)}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
              isAnnual ? 'bg-teal-700 text-white shadow-sm' : 'text-slate-500'
            }`}
          >
            سنوية <span className="text-[10px] font-extrabold bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded">خصم 20%</span>
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-4 rounded-xl border border-teal-200 bg-teal-50 dark:bg-teal-950/40 text-teal-900 dark:text-teal-200 text-xs font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-teal-600" /> {notification}
          </div>
        </div>
      )}

      {/* Current Subscription Card */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="grid size-12 place-items-center rounded-2xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-100 dark:border-teal-900/50">
            <ShieldCheck className="size-6" />
          </span>
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400">الخطة الحالية للمتجر</span>
            <div className="flex items-center gap-2 mt-0.5">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                خطة {PLANS.find((p) => p.id === currentPlanId)?.name}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                نشطة
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-left hidden sm:block">
            <p className="text-xs font-bold text-slate-500">تاريخ التجديد القادم</p>
            <p className="text-xs font-mono font-bold text-slate-900 dark:text-white">01 أكتوبر 2026</p>
          </div>
          <button className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50">
            إدارة الاشتراك الحالي
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {PLANS.map((plan) => {
          const rawPrice = isAnnual ? plan.priceMonthly * 0.8 : plan.priceMonthly;
          const isCurrent = plan.id === currentPlanId;

          return (
            <div
              key={plan.id}
              className={`rounded-3xl border p-6 flex flex-col justify-between transition-all relative ${
                plan.popular
                  ? 'border-teal-600 dark:border-teal-500 bg-white dark:bg-slate-900 shadow-xl ring-2 ring-teal-600/20'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md'
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3.5 right-6 px-3 py-1 rounded-full text-[10px] font-extrabold bg-teal-700 text-white shadow-sm">
                  الأكثر اختياراً للتجار
                </span>
              )}

              <div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">{plan.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 min-h-[32px]">
                  {plan.description}
                </p>

                <div className="my-6">
                  {rawPrice === 0 ? (
                    <span className="text-3xl font-extrabold text-slate-900 dark:text-white">مجاناً</span>
                  ) : (
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
                        {formatIQD(rawPrice)}
                      </span>
                      <span className="text-xs text-slate-400">/ شهرياً</span>
                    </div>
                  )}
                  <p className="text-[11px] font-bold text-teal-700 dark:text-teal-400 mt-1">
                    {plan.orderLimitText}
                  </p>
                </div>

                <div className="space-y-2.5 border-t border-slate-100 dark:border-slate-800 pt-4">
                  {plan.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="size-4 text-teal-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleUpgrade(plan.name, plan.id)}
                disabled={isCurrent}
                className={`w-full mt-6 h-11 rounded-xl text-xs font-bold transition-all ${
                  isCurrent
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                    : plan.popular
                    ? 'bg-teal-700 hover:bg-teal-800 text-white shadow-md'
                    : 'bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 text-white dark:text-slate-900'
                }`}
              >
                {isCurrent ? 'الخطة الحالية' : 'ترقية الخطة الآن'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Invoice History */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <h3 className="font-extrabold text-slate-900 dark:text-white text-base mb-4 flex items-center gap-2">
          <FileText className="size-5 text-teal-700" /> سجل الفواتير السابقة (IQD)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold">
              <tr>
                <th className="p-3">رقم الفاتورة</th>
                <th className="p-3">الخطة</th>
                <th className="p-3">المبلغ</th>
                <th className="p-3">الحالة</th>
                <th className="p-3">التاريخ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              <tr>
                <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">INV-2026-0812</td>
                <td className="p-3">خطة مجانية</td>
                <td className="p-3 font-mono">0 د.ع</td>
                <td className="p-3"><span className="text-teal-700 font-bold">مدفوعة</span></td>
                <td className="p-3 font-mono text-slate-500">2026-08-01</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
