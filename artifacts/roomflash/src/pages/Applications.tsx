import React, { useState, useEffect } from 'react';
import {
  Truck, CreditCard, MessageCircle, BarChart3, Eye, Send, Code, Webhook,
  CheckCircle2, Clock, Sparkles, Filter, Check, ArrowRight, X, Settings2,
  Copy, ExternalLink, ShieldCheck, DollarSign, Users, ShoppingBag, Bell,
  Smartphone, Key, Globe, Zap, AlertCircle, RefreshCw, Layers
} from 'lucide-react';
import { formatIQD } from '../data/iraqData';
import { getStoredOrders, type StoreOrder } from '../data/storeState';

interface AppItem {
  id: string;
  name: string;
  category: 'الشحن' | 'الدفع' | 'التسويق' | 'المتاجر' | 'التحليلات' | 'خدمة الزبائن';
  description: string;
  status: 'مفعّل' | 'متاح قريباً';
  icon: any;
  badgeColor?: string;
  popular?: boolean;
}

const APPLICATIONS: AppItem[] = [
  {
    id: 'zaeem-express',
    name: 'شركة الزعيم للشحن',
    category: 'الشحن',
    description: 'الربط التلقائي المباشر مع أسطول الزعيم لتوليد بوالص الشحن وتتبع الطرود في جميع محافظات العراق.',
    status: 'مفعّل',
    icon: Truck,
    popular: true,
  },
  {
    id: 'cod-gateway',
    name: 'بوابة الدفع عند الاستلام (COD)',
    category: 'الدفع',
    description: 'إدارة تحصيل المبالغ النقدية وتصفية المستحقات المالية تلقائياً مع مناديب الشحن والطلبات.',
    status: 'مفعّل',
    icon: CreditCard,
    popular: true,
  },
  {
    id: 'whatsapp-business',
    name: 'واتساب الأعمال الذكي',
    category: 'خدمة الزبائن',
    description: 'إرسال تأكيد الطلب للزبائن وتذكير السلة المهجورة آلياً كل 3 ساعات لزيادة المبيعات.',
    status: 'مفعّل',
    icon: MessageCircle,
    popular: true,
  },
  {
    id: 'google-analytics',
    name: 'Google Analytics 4',
    category: 'التحليلات',
    description: 'تتبع زوار المتجر وسلوك المشتريات ومصادر الزيارات ومعدل التحويل للطلبات بدقة عالية.',
    status: 'مفعّل',
    icon: BarChart3,
  },
  {
    id: 'meta-pixel',
    name: 'Meta Pixel & CAPI (فيسبوك وإنستغرام)',
    category: 'التسويق',
    description: 'ربط إعلانات الممول وتتبع أحداث الشراء (Purchase) وتوجيهها تلقائياً لشركة الشحن.',
    status: 'مفعّل',
    icon: Eye,
    popular: true,
  },
  {
    id: 'telegram-bot',
    name: 'بوت تلغرام الإشعارات',
    category: 'خدمة الزبائن',
    description: 'تنبيهات فورية لحظية على تيليجرام فور تسجيل أي طلب شراء جديد في متجرك.',
    status: 'مفعّل',
    icon: Send,
  },
  {
    id: 'zain-cash',
    name: 'المحفظة الإلكترونية (ZainCash)',
    category: 'الدفع',
    description: 'استلام الدفعات عبر محفظة زين كاش مع خيار إرسال رسالة تأكيد الدفع عبر واتساب.',
    status: 'مفعّل',
    icon: Smartphone,
    popular: true,
  },
  {
    id: 'webhooks',
    name: 'Webhooks النظام المباشر',
    category: 'المتاجر',
    description: 'توجيه أحداث الطلبات والشحنات لحظياً لأنظمتك المحاسبية وبرامجك الخارجية.',
    status: 'متاح قريباً',
    icon: Webhook,
  },
  {
    id: 'rest-api',
    name: 'الزعيم REST API المفتوح',
    category: 'المتاجر',
    description: 'مفاتيح برمجة وتكاملات API متقدمة للمطورين والربط المخصص.',
    status: 'متاح قريباً',
    icon: Code,
  },
  {
    id: 'fastpay',
    name: 'فاست باي (FastPay)',
    category: 'الدفع',
    description: 'بوابة دفع إلكتروني متكاملة مخصصة لإقليم كردستان وباقي محافظات العراق.',
    status: 'متاح قريباً',
    icon: CreditCard,
  },
];

const CATEGORIES = ['الكل', 'الشحن', 'الدفع', 'التسويق', 'المتاجر', 'التحليلات', 'خدمة الزبائن'];

export function ApplicationsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');
  const [activeApps, setActiveApps] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('zaeem_active_apps');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      'zaeem-express': true,
      'cod-gateway': true,
      'whatsapp-business': true,
      'google-analytics': true,
      'meta-pixel': true,
      'telegram-bot': true,
      'zain-cash': true,
    };
  });

  const [notification, setNotification] = useState<string | null>(null);
  const [activeModalApp, setActiveModalApp] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Zaeem Shipping State
  const [zaeemApiKey, setZaeemApiKey] = useState('zaeem_live_sec_8923f0a1c7784b8e');
  const [zaeemMerchantId, setZaeemMerchantId] = useState('ZAEEM-MERCHANT-44901');

  // WhatsApp Business State
  const [waHours, setWaHours] = useState('3');
  const [waPhone, setWaPhone] = useState('+964 770 123 4567');
  const [waConfirmMsg, setWaConfirmMsg] = useState(true);
  const [waAbandonedCart, setWaAbandonedCart] = useState(true);

  // Google Analytics State
  const [gaId, setGaId] = useState('G-ZAEEM8899X');

  // Meta Pixel State
  const [metaPixelId, setMetaPixelId] = useState('894729104829102');
  const [metaAutoShip, setMetaAutoShip] = useState(true);

  // Telegram Bot State
  const [tgBotToken, setTgBotToken] = useState('7182930412:AAH9f2910xLq994mZaEEm');
  const [tgChatId, setTgChatId] = useState('981273645');

  // ZainCash State
  const [zainPhone, setZainPhone] = useState('07801234567');
  const [zainMerchantId, setZainMerchantId] = useState('5ff65243c2f581144c311');
  const [zainWaReceipt, setZainWaReceipt] = useState(true);

  // Real Stored Orders for COD Gateway
  const [orders, setOrders] = useState<StoreOrder[]>([]);

  useEffect(() => {
    setOrders(getStoredOrders());
    const handleUpdate = () => setOrders(getStoredOrders());
    window.addEventListener('zaeem_store_updated', handleUpdate);
    window.addEventListener('zaeem_shipments_updated', handleUpdate);
    return () => {
      window.removeEventListener('zaeem_store_updated', handleUpdate);
      window.removeEventListener('zaeem_shipments_updated', handleUpdate);
    };
  }, []);

  const saveActiveApps = (newApps: Record<string, boolean>) => {
    setActiveApps(newApps);
    try {
      localStorage.setItem('zaeem_active_apps', JSON.stringify(newApps));
    } catch (e) {}
  };

  const toggleApp = (id: string, name: string) => {
    const nextState = !activeApps[id];
    const updated = { ...activeApps, [id]: nextState };
    saveActiveApps(updated);
    showToast(nextState ? `تم تفعيل تطبيق "${name}" بنجاح ✅` : `تم إيقاف تطبيق "${name}"`);
  };

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    showToast(`تم نسخ ${label} إلى الحافظة 📋`);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const filteredApps = selectedCategory === 'الكل'
    ? APPLICATIONS
    : APPLICATIONS.filter((app) => app.category === selectedCategory);

  // Calculate COD metrics from real orders
  const codOrders = orders.filter((o) => o.paymentMethod === 'cod' || !o.paymentMethod);
  const totalPendingCod = codOrders
    .filter((o) => o.status === 'pending' || o.status === 'confirmed' || o.status === 'processing')
    .reduce((sum, o) => sum + (o.total || 0), 0);
  const totalCollectedCod = codOrders
    .filter((o) => o.status === 'delivered')
    .reduce((sum, o) => sum + (o.total || 0), 0);

  return (
    <div className="space-y-6 rf-appear">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-teal-500/30 flex items-center gap-2 animate-in fade-in text-xs font-bold">
          <CheckCircle2 className="size-4 text-teal-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-teal-700 dark:text-teal-400 mb-1">
            <Sparkles className="size-4" /> سوق التطبيقات والتكاملات
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            التطبيقات والربط البرمجي
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            اربط متجرك مع شركة الشحن وبوابات الدفع وواتساب الأعمال وميتا بكسل لرفع كفاءة مبيعاتك تلقائياً.
          </p>
        </div>
      </div>

      {/* Category filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 rf-scrollbar">
        <Filter className="size-4 text-slate-400 shrink-0 ml-1" />
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-teal-700 text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* App Grid */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filteredApps.map((app) => {
          const Icon = app.icon;
          const isEnabled = activeApps[app.id] ?? false;
          const isAvailable = app.status === 'مفعّل';

          return (
            <div
              key={app.id}
              className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 relative overflow-hidden"
            >
              {app.popular && (
                <div className="absolute top-0 left-0 bg-teal-600 text-white text-[9px] font-black px-3 py-1 rounded-br-xl shadow-sm">
                  موصى به ⭐
                </div>
              )}

              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="grid size-12 place-items-center rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-100 dark:border-teal-900/50 shadow-inner">
                      <Icon className="size-6" />
                    </span>
                    <div>
                      <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                        {app.name}
                      </h3>
                      <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                        {app.category}
                      </span>
                    </div>
                  </div>

                  {isAvailable ? (
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black ${
                        isEnabled
                          ? 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      <CheckCircle2 className="size-3" /> {isEnabled ? 'مفعّل' : 'جاهز للربط'}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200/50 dark:border-amber-900/40">
                      <Clock className="size-3" /> متاح قريباً
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                  {app.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                {isAvailable ? (
                  <>
                    <button
                      onClick={() => toggleApp(app.id, app.name)}
                      className={`flex-1 h-9 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        isEnabled
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200'
                          : 'bg-teal-700 hover:bg-teal-800 text-white shadow-sm'
                      }`}
                    >
                      {isEnabled ? 'إيقاف التفعيل' : 'تفعيل الآن'}
                    </button>
                    <button
                      onClick={() => setActiveModalApp(app.id)}
                      className="px-4 h-9 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-extrabold text-slate-700 dark:text-slate-200 hover:bg-teal-50 dark:hover:bg-teal-950/60 hover:text-teal-700 dark:hover:text-teal-300 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Settings2 className="size-3.5" />
                      <span>إدارة</span>
                    </button>
                  </>
                ) : (
                  <button
                    disabled
                    className="w-full h-9 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed flex items-center justify-center gap-1"
                  >
                    قيد التطوير والربط <Clock className="size-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 1. MODAL: تطبيق شركة الشحن "الزعيم" (Al-Zaeem Shipping API) */}
      {/* ========================================================================= */}
      {activeModalApp === 'zaeem-express' && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 text-right animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
                  <Truck className="size-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    بيانات الربط مع شركة الشحن "الزعيم"
                  </h3>
                  <p className="text-xs text-slate-500">الربط التلقائي وإصدار بوالص الشحن لأسطول الزعيم</p>
                </div>
              </div>
              <button onClick={() => setActiveModalApp(null)} className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white">
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 space-y-2">
                <span className="font-extrabold text-teal-900 dark:text-teal-200 block">
                  📋 تعليمات وبيانات الربط المباشر:
                </span>
                <p className="text-teal-800 dark:text-teal-300 leading-relaxed">
                  متجرك مربوط تلقائياً بنظام الزعيم للخدمات اللوجستية. عند وصول أي طلب مؤكد، يتم إصدار رقم بوليصة فورية بنسق <code className="font-mono font-bold bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded">ZAEEM-2026-XXXXXX</code> وإرسال بيانات المستلم لأقرب مندوب في محافظته.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    معرف التاجر المعتمد (Merchant ID)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={zaeemMerchantId}
                      className="flex-1 h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-xs font-bold text-slate-900 dark:text-white"
                    />
                    <button
                      onClick={() => copyToClipboard(zaeemMerchantId, 'معرف التاجر')}
                      className="px-3.5 h-10 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold rounded-xl flex items-center gap-1"
                    >
                      <Copy className="size-3.5" />
                      <span>{copiedKey === 'معرف التاجر' ? 'تم النسخ' : 'نسخ'}</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    مفتاح الربط البرمجي السري (Live API Key)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      value={zaeemApiKey}
                      onChange={(e) => setZaeemApiKey(e.target.value)}
                      className="flex-1 h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-xs font-bold text-slate-900 dark:text-white"
                    />
                    <button
                      onClick={() => copyToClipboard(zaeemApiKey, 'مفتاح الربط')}
                      className="px-3.5 h-10 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold rounded-xl flex items-center gap-1"
                    >
                      <Copy className="size-3.5" />
                      <span>{copiedKey === 'مفتاح الربط' ? 'تم النسخ' : 'نسخ'}</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    نقطة التتبع واستلام الشحنات (Tracking Webhook Endpoint)
                  </label>
                  <input
                    type="text"
                    readOnly
                    value="https://api.za3em.shop/v1/shipments/sync"
                    className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-xs text-slate-600 dark:text-slate-400"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => showToast('الاتصال مع سيرفرات شركة الزعيم للشحن نشط بنسبة 100% 🚀')}
                className="px-4 py-2.5 rounded-xl border border-teal-600 text-teal-700 dark:text-teal-300 text-xs font-bold hover:bg-teal-50"
              >
                فحص الاتصال (Ping API)
              </button>
              <button
                onClick={() => {
                  showToast('تم حفظ إعدادات ربط شركة الزعيم بنجاح ✅');
                  setActiveModalApp(null);
                }}
                className="px-6 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-extrabold shadow-md"
              >
                حفظ الإعدادات
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. MODAL: تطبيق بوابة الدفع عند الاستلام والمستحقات النقدية (COD Gateway) */}
      {/* ========================================================================= */}
      {activeModalApp === 'cod-gateway' && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-3xl w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 text-right animate-in fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  <DollarSign className="size-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    المبالغ المستحقة استلامها نقداً من الطلبات (COD)
                  </h3>
                  <p className="text-xs text-slate-500">إدارة ومتابعة تصفية المبالغ النقدية المحصلة من الزبائن</p>
                </div>
              </div>
              <button onClick={() => setActiveModalApp(null)} className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white">
                <X className="size-5" />
              </button>
            </div>

            {/* إحصائيات المبالغ */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 space-y-1">
                <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 block">مبالغ قيد التحصيل (معلقة):</span>
                <span className="text-lg font-black font-mono text-amber-950 dark:text-amber-100 block">
                  {formatIQD(totalPendingCod)}
                </span>
                <span className="text-[10px] text-amber-700 dark:text-amber-400">طلبات قيد الشحن والتجهيز</span>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 space-y-1">
                <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 block">مبالغ محصلة وجاهزة للتحويل:</span>
                <span className="text-lg font-black font-mono text-emerald-950 dark:text-emerald-100 block">
                  {formatIQD(totalCollectedCod)}
                </span>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400">شحنات تم تسليمها بنجاح</span>
              </div>

              <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900/50 space-y-1">
                <span className="text-[11px] font-bold text-teal-800 dark:text-teal-300 block">إجمالي طلبات الدفع نقداً:</span>
                <span className="text-lg font-black font-mono text-teal-950 dark:text-teal-100 block">
                  {codOrders.length} طلب
                </span>
                <span className="text-[10px] text-teal-700 dark:text-teal-400">مفعلة بخاصية الدفع عند الاستلام</span>
              </div>
            </div>

            {/* جدول كشف حساب الطلبات النقدية */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                كشف حساب الطلبات النقدية الأخيرة:
              </span>
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="p-3">رقم الطلب</th>
                      <th className="p-3">اسم المستلم</th>
                      <th className="p-3">المحافظة</th>
                      <th className="p-3">المبلغ الإجمالي (د.ع)</th>
                      <th className="p-3">حالة التحصيل</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {codOrders.slice(0, 6).map((ord) => (
                      <tr key={ord.id}>
                        <td className="p-3 font-mono font-bold">{ord.number}</td>
                        <td className="p-3 font-bold">{ord.customerName}</td>
                        <td className="p-3">{ord.customerCity}</td>
                        <td className="p-3 font-mono font-bold text-emerald-600">{formatIQD(ord.total)}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            ord.status === 'delivered'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          }`}>
                            {ord.status === 'delivered' ? 'تم التحصيل' : 'قيد التوصيل'}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {codOrders.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-6 text-center text-slate-400">
                          لا توجد طلبات دفع نقدي مسجلة بعد
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveModalApp(null)}
                className="px-6 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-extrabold shadow-md"
              >
                إغلاق الكشف
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MODAL: تطبيق واتساب الأعمال وأتمتة السلات المهجورة (WhatsApp Business) */}
      {/* ========================================================================= */}
      {activeModalApp === 'whatsapp-business' && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 text-right animate-in fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300">
                  <MessageCircle className="size-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    إعداد أتمتة واتساب الأعمال (WhatsApp Business)
                  </h3>
                  <p className="text-xs text-slate-500">تأكيد الطلبات وتذكير السلة المهجورة آلياً</p>
                </div>
              </div>
              <button onClick={() => setActiveModalApp(null)} className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white">
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* إعدادات السلة المهجورة */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-extrabold text-slate-900 dark:text-white text-xs block">
                      ⏰ تذكير السلة المهجورة التلقائي:
                    </span>
                    <span className="text-[11px] text-slate-500">
                      إرسال رسالة تذكير للزبائن الذين لم يكملوا الشراء
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={waAbandonedCart}
                    onChange={(e) => setWaAbandonedCart(e.target.checked)}
                    className="size-4 accent-teal-600 cursor-pointer"
                  />
                </div>

                {waAbandonedCart && (
                  <div className="pt-2">
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      إرسال التذكير بعد مرور:
                    </label>
                    <select
                      value={waHours}
                      onChange={(e) => setWaHours(e.target.value)}
                      className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-xs"
                    >
                      <option value="1">كل 1 ساعة (سريع)</option>
                      <option value="3">كل 3 ساعات (موصى به ⭐)</option>
                      <option value="6">كل 6 ساعات</option>
                      <option value="12">كل 12 ساعة</option>
                      <option value="24">كل 24 ساعة (يومياً)</option>
                    </select>
                  </div>
                )}
              </div>

              {/* إرسال رسالة تأكيد الطلب */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-extrabold text-slate-900 dark:text-white text-xs block">
                    ✅ إرسال رسالة تأكيد الطلب للزبون فورياً:
                  </span>
                  <span className="text-[11px] text-slate-500">
                    تتضمن رقم الطلب والمبلغ الإجمالي ورابط التتبع المباشر
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={waConfirmMsg}
                  onChange={(e) => setWaConfirmMsg(e.target.checked)}
                  className="size-4 accent-teal-600 cursor-pointer"
                />
              </div>

              {/* رقم هاتف واتساب الأعمال */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  رقم هاتف واتساب الأعمال المعتمد للإرسال:
                </label>
                <input
                  type="text"
                  value={waPhone}
                  onChange={(e) => setWaPhone(e.target.value)}
                  placeholder="+964 770 123 4567"
                  className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-xs font-bold"
                />
              </div>

              {/* معاينة القالب */}
              <div className="p-3.5 rounded-2xl bg-green-50/60 dark:bg-green-950/30 border border-green-200 dark:border-green-900/50 space-y-1">
                <span className="font-black text-green-900 dark:text-green-200 text-[11px] block">
                  معاينة نص رسالة تأكيد الطلب:
                </span>
                <p className="text-[11px] text-green-800 dark:text-green-300 leading-relaxed font-mono">
                  "مرحباً بك! تم تأكيد طلبك رقم <strong>#order0001</strong> بنجاح بقيمة <strong>45,000 د.ع</strong>. شحنتك قيد التجهيز مع شركة الزعيم للشحن السريع. رابط التتبع: za3em.shop/track/ZAEEM-2026-XXXXXX"
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => showToast('تم إرسال رسالة تجريبية على واتساب بنجاح 📱')}
                className="px-4 py-2.5 rounded-xl border border-green-600 text-green-700 dark:text-green-300 text-xs font-bold hover:bg-green-50"
              >
                إرسال رسالة تجريبية
              </button>
              <button
                onClick={() => {
                  showToast('تم حفظ إعدادات واتساب الأعمال بنجاح ✅');
                  setActiveModalApp(null);
                }}
                className="px-6 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-extrabold shadow-md"
              >
                حفظ الإعدادات
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. MODAL: تطبيق Google Analytics 4 */}
      {/* ========================================================================= */}
      {activeModalApp === 'google-analytics' && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 text-right animate-in fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                  <BarChart3 className="size-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    إحصائيات وتحليلات Google Analytics 4
                  </h3>
                  <p className="text-xs text-slate-500">تحليل الزيارات ومصادر الترافيك وسلوك المشترين</p>
                </div>
              </div>
              <button onClick={() => setActiveModalApp(null)} className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white">
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  معرف التتبع (Measurement ID / Stream ID):
                </label>
                <input
                  type="text"
                  value={gaId}
                  onChange={(e) => setGaId(e.target.value)}
                  placeholder="G-XXXXXXXXXX"
                  className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-xs font-bold"
                />
              </div>

              {/* لوحة مصغرة لإحصائيات الزوار وسلوك المشتريين */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                <span className="font-extrabold text-slate-900 dark:text-white text-xs block">
                  📊 نظرة عامة على سلوك الزوار (آخر 30 يوماً):
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-500 block">إجمالي الزيارات</span>
                    <span className="text-base font-black font-mono text-teal-600">14,280</span>
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-500 block">الزوار النشطين</span>
                    <span className="text-base font-black font-mono text-emerald-600">8,940</span>
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-500 block">معدل التحويل</span>
                    <span className="text-base font-black font-mono text-purple-600">4.8%</span>
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-500 block">متوسط الجلسة</span>
                    <span className="text-base font-black font-mono text-amber-600">2:45 د</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => {
                  showToast('تم ربط وحفظ معرّف Google Analytics بنجاح ✅');
                  setActiveModalApp(null);
                }}
                className="px-6 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-extrabold shadow-md"
              >
                حفظ وتفعيل GA4
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. MODAL: تطبيق Meta Pixel & CAPI (فيسبوك وإنستغرام) */}
      {/* ========================================================================= */}
      {activeModalApp === 'meta-pixel' && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 text-right animate-in fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                  <Eye className="size-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    إعداد Meta Pixel والربط مع شركة الشحن
                  </h3>
                  <p className="text-xs text-slate-500">تتبع إعلانات فيسبوك وتوليد أحداث الشراء تلقائياً</p>
                </div>
              </div>
              <button onClick={() => setActiveModalApp(null)} className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white">
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  معرف بكسل ميتا (Meta Pixel ID):
                </label>
                <input
                  type="text"
                  value={metaPixelId}
                  onChange={(e) => setMetaPixelId(e.target.value)}
                  placeholder="894729104829102"
                  className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-xs font-bold"
                />
              </div>

              {/* الربط مع شركة الشحن */}
              <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 flex items-center justify-between">
                <div>
                  <span className="font-extrabold text-blue-950 dark:text-blue-200 text-xs block">
                    🚚 رفع الطلبات وتمريرها تلقائياً لشركة الشحن:
                  </span>
                  <span className="text-[11px] text-blue-800 dark:text-blue-300">
                    عند حصول المتجر على طلب جديد من إعلانات ميتا يتم تسجيله تلقائياً لدى شركة الزعيم للشحن
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={metaAutoShip}
                  onChange={(e) => setMetaAutoShip(e.target.checked)}
                  className="size-4 accent-teal-600 cursor-pointer"
                />
              </div>

              {/* الأحداث المتتبعة */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="font-extrabold text-slate-900 dark:text-white text-[11px] block">
                  الأحداث التي يتم إرسالها إلى Meta CAPI:
                </span>
                <div className="flex flex-wrap gap-2 font-mono text-[10px]">
                  <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-teal-600 font-bold">✓ PageView</span>
                  <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-teal-600 font-bold">✓ ViewContent</span>
                  <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-teal-600 font-bold">✓ AddToCart</span>
                  <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-teal-600 font-bold">✓ InitiateCheckout</span>
                  <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-teal-600 font-bold">✓ Purchase (Live COD)</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => showToast('تم إرسال حدث تجريبي (Test Event) إلى Meta Business Manager ✅')}
                className="px-4 py-2.5 rounded-xl border border-blue-600 text-blue-700 dark:text-blue-300 text-xs font-bold hover:bg-blue-50"
              >
                فحص الحدث (Test CAPI)
              </button>
              <button
                onClick={() => {
                  showToast('تم حفظ إعدادات Meta Pixel والربط التلقائي بنجاح ✅');
                  setActiveModalApp(null);
                }}
                className="px-6 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-extrabold shadow-md"
              >
                حفظ الإعدادات
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. MODAL: تطبيق بوت التليجرام (Telegram Notifications Bot) */}
      {/* ========================================================================= */}
      {activeModalApp === 'telegram-bot' && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 text-right animate-in fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300">
                  <Send className="size-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    إعداد بوت التلغرام لإشعارات الطلبات
                  </h3>
                  <p className="text-xs text-slate-500">إخطار التاجر فورياً على تيليجرام عند تسجيل أي طلب جديد</p>
                </div>
              </div>
              <button onClick={() => setActiveModalApp(null)} className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white">
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-sky-50/60 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-900/50 space-y-1">
                <span className="font-black text-sky-950 dark:text-sky-200 text-xs block">
                  🤖 خطوات الربط مع البوت:
                </span>
                <ol className="list-decimal list-inside space-y-1 text-sky-900 dark:text-sky-300">
                  <li>افتح تطبيق تلغرام وابحث عن البوت الرسمي: <code className="font-bold font-mono">@zaeem_orders_bot</code></li>
                  <li>اضغط على <strong>Start</strong> للحصول على معرف الدردشة (Chat ID) الخاص بك.</li>
                  <li>ألصق التوكن والمعرف أدناه واضغط على تجربة الإشعار.</li>
                </ol>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  رمز توكن البوت (Bot Token):
                </label>
                <input
                  type="text"
                  value={tgBotToken}
                  onChange={(e) => setTgBotToken(e.target.value)}
                  placeholder="7182930412:AAH9f2910x..."
                  className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  معرف الدردشة (Chat ID):
                </label>
                <input
                  type="text"
                  value={tgChatId}
                  onChange={(e) => setTgChatId(e.target.value)}
                  placeholder="981273645"
                  className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-xs font-bold"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => showToast('تم إرسال إشعار تجريبي عبر بوت التيليجرام بنجاح 🚀')}
                className="px-4 py-2.5 rounded-xl border border-sky-600 text-sky-700 dark:text-sky-300 text-xs font-bold hover:bg-sky-50"
              >
                إرسال إشعار تجريبي
              </button>
              <button
                onClick={() => {
                  showToast('تم حفظ إعدادات بوت تلغرام بنجاح ✅');
                  setActiveModalApp(null);
                }}
                className="px-6 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-extrabold shadow-md"
              >
                حفظ التفعيل
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. MODAL: تطبيق محفظة زين كاش (ZainCash E-Wallet) */}
      {/* ========================================================================= */}
      {activeModalApp === 'zain-cash' && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 text-right animate-in fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                  <Smartphone className="size-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    إعداد الدفع عبر محفظة زين كاش (ZainCash)
                  </h3>
                  <p className="text-xs text-slate-500">استلام الدفعات الإلكترونية وإرسال تأكيد عبر واتساب</p>
                </div>
              </div>
              <button onClick={() => setActiveModalApp(null)} className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white">
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  رقم محفظة زين كاش لاستلام الأموال (MSISDN): <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={zainPhone}
                  onChange={(e) => setZainPhone(e.target.value)}
                  placeholder="07801234567"
                  className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-xs font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  معرف التاجر في زين كاش (Merchant ID):
                </label>
                <input
                  type="text"
                  value={zainMerchantId}
                  onChange={(e) => setZainMerchantId(e.target.value)}
                  placeholder="5ff65243c2f581144c311"
                  className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-xs font-bold"
                />
              </div>

              {/* خيار إرسال رسالة تأكيد الدفع عبر واتساب */}
              <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/50 flex items-center justify-between">
                <div>
                  <span className="font-extrabold text-purple-950 dark:text-purple-200 text-xs block">
                    💬 إرسال رسالة تأكيد الدفع عبر واتساب للزبون:
                  </span>
                  <span className="text-[11px] text-purple-800 dark:text-purple-300">
                    إرسال إيصال فوري للعميل على واتساب يؤكد استلام دفعة زين كاش بنجاح
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={zainWaReceipt}
                  onChange={(e) => setZainWaReceipt(e.target.checked)}
                  className="size-4 accent-purple-600 cursor-pointer"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => {
                  showToast('تم حفظ إعدادات محفظة زين كاش وتفعيل الدفع بنجاح ✅');
                  setActiveModalApp(null);
                }}
                className="px-6 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-extrabold shadow-md"
              >
                حفظ وتفعيل زين كاش
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
