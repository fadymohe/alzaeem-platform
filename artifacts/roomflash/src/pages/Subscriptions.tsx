import React, { useState, useEffect } from 'react';
import {
  CreditCard, CheckCircle2, ShieldCheck, Sparkles, Clock, FileText,
  Building, ArrowLeft, RefreshCw, AlertCircle, MessageCircle, ExternalLink,
  Gift, Check, Zap, Crown, Layers, ShoppingBag, Globe, Rocket
} from 'lucide-react';
import { formatIQD } from '../data/iraqData';

interface Plan {
  id: string;
  name: string;
  priceUSD: number;
  priceMonthlyIQD: number;
  commission: string;
  badge?: string;
  description: string;
  features: string[];
  popular?: boolean;
  orderLimitText: string;
  storesLimit: string;
  landingPagesLimit: string;
}

const PLANS: Plan[] = [
  {
    id: 'trial',
    name: 'اشتراك مؤقت مجاني (3 أيام)',
    priceUSD: 0,
    priceMonthlyIQD: 0,
    commission: '0 عمولة خلال فترة التجربة',
    badge: 'تجربة مجانية 3 أيام',
    description: 'اشتراك تجريبي مجاني لمدة 3 أيام للبدء واستكشاف المنصة وتجهيز المتجر والشحنات.',
    orderLimitText: 'فترة تجريبية مجانية لمدة 3 أيام',
    storesLimit: 'متجر تجريبي واحد',
    landingPagesLimit: 'صفحة هبوط تجريبية',
    features: [
      'فترة تجريبية مجانية بالكامل لمدة 3 أيام',
      'تجهيز وتجربة متجر إلكتروني متكامل',
      'تجربة إنشاء شحنات وربط أسطول الزعيم',
      'معاينة وتجربة كافة أقسام لوحة التحكم',
      'دعم فني وتدريب سريع عبر المنصة',
    ],
  },
  {
    id: 'basic',
    name: 'الاشتراك الأساسي',
    priceUSD: 2,
    priceMonthlyIQD: 2600,
    commission: 'عمولة 5 سنت ($0.05) على كل شحنة جديدة',
    badge: '2$ شهرياً فقط ⚡',
    description: 'الخيار الاقتصادي الأمثل للتجار وأصحاب المتاجر الناشئة مع عمولة 5 سنت فقط على كل شحنة.',
    orderLimitText: 'متجر احترافي 1 + 10 صفحات هبوط',
    storesLimit: '1 متجر احترافي متكامل',
    landingPagesLimit: '10 صفحات هبوط تسويقية',
    features: [
      'اشتراك شهري رمزي بـ 2 دولار فقط (2,600 د.ع)',
      'عمولة 5 سنت ($0.05) على كل شحنة جديدة',
      '1 متجر احترافي متكامل مع دومين فرعي مجاني',
      '10 صفحات هبوط تسويقية سريعة ومربوطة',
      'ربط أوتوماتيكي مع أسطول الزعيم للشحن السريع',
      'إدارة المنتجات والمخزون وتحصيل المبالغ (COD)',
      'لوحة تحليلات المبيعات وتتبع الشحنات للزبائن',
    ],
  },
  {
    id: 'pro',
    name: 'الاشتراك الاحترافي (Pro)',
    priceUSD: 15,
    priceMonthlyIQD: 19500,
    commission: 'نسبة العمولة 5 سنت ($0.05) على كل شحنة',
    popular: true,
    badge: 'الأقوى للشركات والتجار الكبار 👑',
    description: 'طلبات لا نهائية مع 20 متجراً احترافياً، وإتاحة كافة الثيمات وصفحات هبوط لا نهائية.',
    orderLimitText: 'عدد لا نهائي من الطلبات + 20 متجر احترافي',
    storesLimit: '20 متجر احترافي مستقل',
    landingPagesLimit: 'عدد لا نهائي من صفحات الهبوط',
    features: [
      'عدد لا نهائي من الطلبات والشحنات شهرياً',
      '20 متجر احترافي مستقل لإدارة عدة براندات',
      'كافة الثيمات والقوالب متاحة ومفتوحة بالكامل',
      'عدد لا نهائي من صفحات الهبوط التسويقية',
      'نسبة عمولة 5 سنت ($0.05) فقط على كل شحنة',
      'ربط دومينات ونطاقات مخصصة (.com / .iq)',
      'تكامل متقدم مع بيكسل Meta و TikTok و Google Ads',
      'مدير حساب خاص وأولوية معالجة الشحنات 24/7',
    ],
  },
];

export function SubscriptionsPage() {
  const [currentPlanId, setCurrentPlanId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('zaeem_current_plan');
      if (saved) return saved;
    } catch (e) {}
    return 'trial'; // الخطة الافتراضية
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
    const billingType = isAnnual ? 'الفوترة السنوية (مع خصم 10%)' : 'الفوترة الشهرية';
    const effectiveUSD = isAnnual && plan.priceUSD > 0 ? (plan.priceUSD * 0.9).toFixed(1) : plan.priceUSD;
    const effectiveIQD = isAnnual && plan.priceMonthlyIQD > 0 ? Math.round(plan.priceMonthlyIQD * 0.9) : plan.priceMonthlyIQD;

    const waMessage = `انا مالك متجر (${storeInfo.storeName}) اريد ترقية الخطة الي خطة (${plan.name})
رمز المتجر: (${storeInfo.storeCode})
نوع الاشتراك: ${billingType}
السعر: ${effectiveUSD}$ شهرياً (${formatIQD(effectiveIQD)})
المميزات: ${plan.orderLimitText} | ${plan.commission}`;

    const whatsappUrl = `https://wa.me/9647700000000?text=${encodeURIComponent(waMessage)}`;
    window.open(whatsappUrl, '_blank');

    setCurrentPlanId(plan.id);
    try {
      localStorage.setItem('zaeem_current_plan', plan.id);
      localStorage.setItem('zaeem_plan', plan.id);
    } catch (e) {}

    setNotification(`تم فتح واتساب لإرسال طلب تفعيل "${plan.name}" وتجهيز الحساب بنجاح 🚀`);
    setTimeout(() => setNotification(null), 5000);
  };

  const currentPlan = PLANS.find((p) => p.id === currentPlanId) || PLANS[0];

  return (
    <div className="space-y-8 rf-appear" dir="rtl">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-teal-700 dark:text-teal-400 mb-1">
            <CreditCard className="size-4" /> باقات واشتراكات منصة الزعيم
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            خطط الأسعار والاشتراكات الشهرية
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            اختر الخطة المناسبة لتجارتك: تجربة مجانية 3 أيام، أو خطة أساسية بـ 2$، أو خطة احترافية شاملة.
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
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                {currentPlan.name}
              </h2>
              <span className="px-3 py-1 rounded-full text-[11px] font-black bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                نشطة
              </span>
              <span className="text-xs font-mono font-bold text-slate-500 mr-2">
                كود المتجر: {storeInfo.storeCode}
              </span>
            </div>
            <p className="text-xs text-teal-600 dark:text-teal-400 font-bold mt-1">
              {currentPlan.commission}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-left bg-slate-50 dark:bg-slate-950 px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-800">
            <p className="text-[11px] font-bold text-slate-500">تاريخ التجديد القادم:</p>
            <p className="text-xs font-mono font-black text-teal-700 dark:text-teal-400 mt-0.5">{renewalDate}</p>
          </div>
        </div>
      </div>

      {/* Pricing Cards Grid (3 prominent cards) */}
      <div className="grid gap-6 md:grid-cols-3 items-stretch">
        {PLANS.map((plan) => {
          const effectiveUSD = isAnnual && plan.priceUSD > 0 ? (plan.priceUSD * 0.9).toFixed(1) : plan.priceUSD;
          const effectiveIQD = isAnnual && plan.priceMonthlyIQD > 0 ? Math.round(plan.priceMonthlyIQD * 0.9) : plan.priceMonthlyIQD;
          const isCurrent = plan.id === currentPlanId;

          return (
            <div
              key={plan.id}
              className={`rounded-3xl border p-6 flex flex-col justify-between transition-all relative ${
                plan.popular
                  ? 'border-teal-500 dark:border-teal-400 bg-gradient-to-b from-teal-500/5 via-white to-white dark:from-teal-950/20 dark:via-slate-900 dark:to-slate-900 shadow-2xl ring-2 ring-teal-500/30'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md'
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3.5 right-6 px-3.5 py-1 rounded-full text-[10px] font-black bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-950 shadow-md">
                  {plan.badge || 'الأكثر طلباً للتجار ⭐'}
                </span>
              )}

              <div>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">{plan.name}</h3>
                  {!plan.popular && plan.badge && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {plan.badge}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 min-h-[36px]">
                  {plan.description}
                </p>

                {/* Price Display */}
                <div className="my-5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-100 dark:border-slate-800/80 space-y-2">
                  {plan.priceUSD === 0 ? (
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">مجاناً</span>
                      <span className="text-xs text-slate-400">/ 3 أيام تجريبية</span>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl font-black text-teal-600 dark:text-teal-400 font-mono">
                          ${effectiveUSD}
                        </span>
                        <span className="text-xs font-bold text-slate-400">/ شهرياً</span>
                        <span className="text-xs font-mono font-bold text-slate-500 mr-auto">
                          (≈ {formatIQD(effectiveIQD)})
                        </span>
                      </div>
                      {isAnnual && (
                        <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400">
                          (تم تطبيق خصم 10% مع الفوترة السنوية)
                        </p>
                      )}
                    </div>
                  )}

                  {/* Commission Highlight Pill */}
                  <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-[11px] font-extrabold text-teal-700 dark:text-teal-300">
                    <span>نسبة العمولة:</span>
                    <span className="bg-teal-500/10 px-2 py-0.5 rounded-md font-mono">{plan.commission}</span>
                  </div>
                </div>

                {/* Limits Summary Badges */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="p-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/50 text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <ShoppingBag className="size-3.5 text-teal-600 shrink-0" />
                    <span className="truncate">{plan.storesLimit}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/50 text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Layers className="size-3.5 text-teal-600 shrink-0" />
                    <span className="truncate">{plan.landingPagesLimit}</span>
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-2.5 border-t border-slate-100 dark:border-slate-800 pt-4">
                  {plan.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="size-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleUpgrade(plan)}
                disabled={isCurrent}
                className={`w-full mt-6 h-12 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                  isCurrent
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-200 dark:border-slate-700'
                    : plan.popular
                    ? 'bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-600 hover:to-emerald-500 text-slate-950 active:scale-95'
                    : 'bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 text-white dark:text-slate-900 active:scale-95'
                }`}
              >
                {isCurrent ? (
                  <span>الخطة الحالية للمتجر</span>
                ) : (
                  <>
                    <MessageCircle className="size-4" />
                    <span>تفعيل الخطة عبر واتساب</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Invoice History */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
            <FileText className="size-5 text-teal-700" />
            <span>سجل الفواتير والاشتراكات الرسمية</span>
          </h3>
          <span className="text-xs text-slate-500 font-bold">تحديث دوري شهري</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold">
              <tr>
                <th className="p-3.5">رقم الفاتورة</th>
                <th className="p-3.5">تفاصيل الاشتراك</th>
                <th className="p-3.5">الرسوم والعمولة</th>
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
                  {currentPlan.name}
                </td>
                <td className="p-3.5 font-mono font-bold text-teal-700 dark:text-teal-400">
                  {currentPlan.priceUSD === 0 ? 'مجاناً' : `$${currentPlan.priceUSD} (${formatIQD(currentPlan.priceMonthlyIQD)}) + ${currentPlan.commission}`}
                </td>
                <td className="p-3.5">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                    <Check className="size-3" /> نشطة ومفعلة
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
          💡 يتم تجديد الاشتراك وتصفية عمولات الشحن بمرونة عبر لوحة التحكم وتحويلات زين كاش / الحساب المصرفي.
        </p>
      </div>
    </div>
  );
}

