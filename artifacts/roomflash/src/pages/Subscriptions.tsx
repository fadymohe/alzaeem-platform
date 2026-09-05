import React, { useState, useEffect } from 'react';
import {
  CreditCard, CheckCircle2, ShieldCheck, Sparkles, Clock, FileText,
  Building, ArrowLeft, RefreshCw, AlertCircle, MessageCircle, ExternalLink,
  Gift, Check
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
    name: 'المجانية',
    priceMonthly: 0,
    description: 'الخطة الافتراضية المجانية لبدء وتجربة المتجر والشحنات الأولى.',
    orderLimitText: '10 طلبات شهرياً مجاناً',
    features: [
      'متجر إلكتروني متكامل مجاناً',
      '10 طلبات شهرياً بدون رسوم',
      'ربط أسطول الزعيم للشحن السريع',
      'صفحة هبوط واحدة نشطة',
      'دعم فني عبر المنصة',
    ],
  },
  {
    id: 'basic',
    name: 'أساسي',
    priceMonthly: 6600,
    description: 'للمتاجر الناشئة التي تريد الاستقرار ورفع المبيعات.',
    orderLimitText: '100 طلب شهرياً',
    features: [
      'منتجات متجر غير محدودة',
      '100 طلب شهرياً',
      'ربط واتساب وإشعار الزبائن',
      '5 صفحات هبوط احترافية',
      'تحليلات المبيعات والطلبات',
      'تصفية أسبوعية للتحصيل النقدي',
    ],
  },
  {
    id: 'pro',
    name: 'الاحترافية',
    priceMonthly: 13200,
    description: 'للأعمال المتنامية بكثافة شحنات يومية عالية.',
    popular: true,
    orderLimitText: 'طلبات غير محدودة',
    features: [
      'طلبات وشحنات غير محدودة',
      'ربط نطاق مخصص (.iq / .com)',
      'صفحات هبوط غير محدودة',
      'تكامل جميع تطبيقات الزعيم (Meta/Google)',
      'تصفية يومية لمبالغ الدفع عند الاستلام (COD)',
      'مدير حساب خاص لخدمة المتجر',
    ],
  },
  {
    id: 'enterprise',
    name: 'الأعمال',
    priceMonthly: 26400,
    description: 'للشركات الكبيرة والمستودعات والتجارة السريعة.',
    orderLimitText: 'حلول مخصصة للشركات',
    features: [
      'جميع ميزات الخطة الاحترافية',
      'ربط REST API و Webhooks مخصص',
      'مستودع تخزين مخصص لدى شركة الزعيم',
      'خصومات خاصة على أجور الشحن للمحافظات',
      'دعم فني 24/7 عبر الهاتف والواتساب',
    ],
  },
];

export function SubscriptionsPage() {
  const [currentPlanId, setCurrentPlanId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('zaeem_current_plan');
      if (saved) return saved;
    } catch (e) {}
    return 'free'; // الخطة الافتراضية عند إنشاء الحساب هي المجانية
  });

  const [isAnnual, setIsAnnual] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // استخراج بيانات المتجر الفعلية وتاريخ الإنشاء
  const [storeInfo, setStoreInfo] = useState({
    storeName: 'متجر الفخامة العراقي',
    storeCode: 'ZAEEM-STORE-01',
    createdAt: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem('zaeem_store_data') || localStorage.getItem('zaeem_onboarded_store');
      if (raw) {
        const parsed = JSON.parse(raw);
        setStoreInfo({
          storeName: parsed.storeName || parsed.name || 'متجر الفخامة العراقي',
          storeCode: parsed.storeCode || 'ZAEEM-STORE-01',
          createdAt: parsed.createdAt ? parsed.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
        });
      }
    } catch (e) {}
  }, []);

  // حساب تاريخ تجديد الخطة: 30 يوماً من تاريخ إنشاء الحساب
  const calculateRenewalDate = (createdStr: string) => {
    const cDate = new Date(createdStr || new Date());
    const renewalTime = new Date(cDate.getTime() + 30 * 24 * 60 * 60 * 1000);
    return renewalTime.toISOString().split('T')[0];
  };

  const renewalDate = calculateRenewalDate(storeInfo.createdAt);

  const handleUpgrade = (plan: Plan) => {
    // 1. صياغة رسالة الواتساب المجهزة المطلوبة بدقة
    const billingType = isAnnual ? 'الفوترة السنوية (مع خصم 10%)' : 'الفوترة الشهرية';
    const waMessage = `انا مالك متجر (${storeInfo.storeName}) اريد ترقية الخطة الي خطة (${plan.name})
رمز المتجر: (${storeInfo.storeCode})
نوع الاشتراك: ${billingType}
السعر: ${formatIQD(isAnnual ? plan.priceMonthly * 0.9 : plan.priceMonthly)} / شهرياً`;

    const whatsappUrl = `https://wa.me/9647700000000?text=${encodeURIComponent(waMessage)}`;

    // فتح واتساب في نافذة جديدة
    window.open(whatsappUrl, '_blank');

    // تحديث الخطة محلياً وإظهار إشعار
    setCurrentPlanId(plan.id);
    try {
      localStorage.setItem('zaeem_current_plan', plan.id);
    } catch (e) {}

    setNotification(`تم فتح واتساب لإرسال طلب ترقية الخطة إلى "${plan.name}" وتجهيز الحساب بنجاح 🚀`);
    setTimeout(() => setNotification(null), 5000);
  };

  return (
    <div className="space-y-8 rf-appear">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-teal-700 dark:text-teal-400 mb-1">
            <CreditCard className="size-4" /> الاشتراكات والفوترة
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            خطط الأسعار والفوترة بالدينار العراقي
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            اختر الخطة المناسبة لحجم تجارتك وشحناتك اليومية مع شركة الزعيم للشحن.
          </p>
        </div>

        {/* Annual / Monthly Toggle with 10% Discount */}
        <div className="inline-flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setIsAnnual(false)}
            className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
              !isAnnual ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'
            }`}
          >
            فوترة شهرية
          </button>
          <button
            onClick={() => setIsAnnual(true)}
            className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              isAnnual ? 'bg-teal-700 text-white shadow-sm' : 'text-slate-500'
            }`}
          >
            <span>فوترة سنوية</span>
            <span className="text-[10px] font-black bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full shadow-sm">
              خصم 10%
            </span>
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-4 rounded-2xl border border-teal-200 bg-teal-50 dark:bg-teal-950/40 text-teal-900 dark:text-teal-200 text-xs font-bold flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-teal-600" /> {notification}
          </div>
        </div>
      )}

      {/* Current Subscription Card */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="grid size-14 place-items-center rounded-2xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-100 dark:border-teal-900/50 shadow-inner">
            <ShieldCheck className="size-7" />
          </span>
          <div>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">الخطة الحالية للمتجر ({storeInfo.storeName})</span>
            <div className="flex items-center gap-2 mt-0.5">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                خطة {PLANS.find((p) => p.id === currentPlanId)?.name || 'المجانية'}
              </h2>
              <span className="px-3 py-1 rounded-full text-[11px] font-black bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                نشطة
              </span>
              <span className="text-xs font-mono font-bold text-slate-500 mr-2">
                كود المتجر: {storeInfo.storeCode}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-left bg-slate-50 dark:bg-slate-950 px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-800">
            <p className="text-[11px] font-bold text-slate-500">تاريخ التجديد القادم (30 يوم من الإنشاء):</p>
            <p className="text-xs font-mono font-black text-teal-700 dark:text-teal-400 mt-0.5">{renewalDate}</p>
          </div>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {PLANS.map((plan) => {
          // الخصم السنوي 10%
          const rawPrice = isAnnual && plan.priceMonthly > 0 ? Math.round(plan.priceMonthly * 0.9) : plan.priceMonthly;
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
                <span className="absolute -top-3.5 right-6 px-3.5 py-1 rounded-full text-[10px] font-black bg-teal-700 text-white shadow-md">
                  الأكثر طلباً للتجار ⭐
                </span>
              )}

              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">{plan.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 min-h-[32px]">
                  {plan.description}
                </p>

                <div className="my-5">
                  {rawPrice === 0 ? (
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-slate-900 dark:text-white">مجاناً</span>
                      <span className="text-xs text-slate-400">/ الخطة الافتراضية</span>
                    </div>
                  ) : (
                    <div className="space-y-0.5">
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white font-mono">
                          {formatIQD(rawPrice)}
                        </span>
                        <span className="text-xs text-slate-400">/ شهرياً</span>
                      </div>
                      {isAnnual && (
                        <p className="text-[10px] font-bold text-amber-600">
                          (وفرت 10% مع الفوترة السنوية)
                        </p>
                      )}
                    </div>
                  )}
                  <p className="text-[11px] font-bold text-teal-700 dark:text-teal-400 mt-1.5">
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
                type="button"
                onClick={() => handleUpgrade(plan)}
                disabled={isCurrent}
                className={`w-full mt-6 h-11 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  isCurrent
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                    : plan.popular
                    ? 'bg-teal-700 hover:bg-teal-800 text-white shadow-lg active:scale-95'
                    : 'bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 text-white dark:text-slate-900 active:scale-95'
                }`}
              >
                {isCurrent ? (
                  <span>الخطة الحالية للمتجر</span>
                ) : (
                  <>
                    <MessageCircle className="size-4" />
                    <span>ترقية الخطة عبر واتساب</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Invoice History: First month invoice on account creation date */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
            <FileText className="size-5 text-teal-700" />
            <span>سجل الفواتير والاشتراكات بالدينار العراقي (IQD)</span>
          </h3>
          <span className="text-xs text-slate-500 font-bold">تحديث دوري شهري</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold">
              <tr>
                <th className="p-3.5">رقم الفاتورة</th>
                <th className="p-3.5">تفاصيل الاشتراك</th>
                <th className="p-3.5">المبلغ بالدينار العراقي</th>
                <th className="p-3.5">حالة الفاتورة</th>
                <th className="p-3.5">تاريخ الإصدار</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              <tr>
                <td className="p-3.5 font-mono font-bold text-slate-900 dark:text-white">
                  INV-{storeInfo.createdAt.replace(/-/g, '')}-001
                </td>
                <td className="p-3.5 font-bold">
                  فاتورة الشهر الأول (الخطة المجانية التأسيسية)
                </td>
                <td className="p-3.5 font-mono font-bold text-teal-700 dark:text-teal-400">
                  {formatIQD(0)}
                </td>
                <td className="p-3.5">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                    <Check className="size-3" /> مدفوعة ومفعلة
                  </span>
                </td>
                <td className="p-3.5 font-mono text-slate-600 dark:text-slate-400 font-bold">
                  {storeInfo.createdAt}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-[11px] text-slate-500 text-center pt-2">
          💡 يتم إصدار الفاتورة الشهرية تلقائياً عند موعد التجديد الدوري كل 30 يوماً من تاريخ إنشاء الحساب.
        </p>
      </div>
    </div>
  );
}
