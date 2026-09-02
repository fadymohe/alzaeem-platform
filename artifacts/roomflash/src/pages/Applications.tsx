import { useState } from 'react';
import {
  Truck, CreditCard, MessageCircle, BarChart, Eye, Send, Code, Webhook,
  CheckCircle2, Clock, Sparkles, Filter, Check, ArrowRight
} from 'lucide-react';

interface AppItem {
  id: string;
  name: string;
  category: 'الشحن' | 'الدفع' | 'التسويق' | 'المتاجر' | 'التحليلات' | 'خدمة الزبائن';
  description: string;
  status: 'مفعّل' | 'متاح قريباً';
  icon: typeof Truck;
  badgeColor?: string;
  popular?: boolean;
}

const APPLICATIONS: AppItem[] = [
  {
    id: 'zaeem-express',
    name: 'شركة الزعيم للشحن',
    category: 'الشحن',
    description: 'الربط التلقائي المباشر مع أسطول الزعيم لتوفير وتتبع الشحنات في جميع المحافظات.',
    status: 'مفعّل',
    icon: Truck,
    badgeColor: 'bg-teal-500/10 text-teal-700 dark:text-teal-400',
    popular: true,
  },
  {
    id: 'cod-gateway',
    name: 'بوابة الدفع عند الاستلام',
    category: 'الدفع',
    description: 'إدارة تحصيل المبالغ النقدية وتصفية المستحقات اليومية مع مندوبي التوصيل.',
    status: 'مفعّل',
    icon: CreditCard,
    badgeColor: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
  },
  {
    id: 'whatsapp-business',
    name: 'واتساب الأعمال',
    category: 'خدمة الزبائن',
    description: 'إرسال إشعارات وتأكيد الطلبات للزبائن وتحديثات التتبع تلقائياً عبر واتساب.',
    status: 'مفعّل',
    icon: MessageCircle,
    badgeColor: 'bg-green-500/10 text-green-700 dark:text-green-400',
    popular: true,
  },
  {
    id: 'google-analytics',
    name: 'Google Analytics 4',
    category: 'التحليلات',
    description: 'تتبع زوار المتجر وسلوك المشتريات ومصادر الزيارات بدقة عالية.',
    status: 'مفعّل',
    icon: BarChart,
    badgeColor: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
  },
  {
    id: 'meta-pixel',
    name: 'Meta Pixel (فيسبوك وإنستغرام)',
    category: 'التسويق',
    description: 'ربط إعلانات الممول وتحسين حملات الاستهداف لتكبير المبيعات.',
    status: 'مفعّل',
    icon: Eye,
    badgeColor: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
    popular: true,
  },
  {
    id: 'telegram-bot',
    name: 'بوت تلغرام الإشعارات',
    category: 'خدمة الزبائن',
    description: 'تنبيهات لحظية لفريق عملك فور تسجيل أي طلب أو تغيير حالة شحنة.',
    status: 'مفعّل',
    icon: Send,
    badgeColor: 'bg-sky-500/10 text-sky-700 dark:text-sky-400',
  },
  {
    id: 'webhooks',
    name: 'Webhooks النظام',
    category: 'المتاجر',
    description: 'إرسال الأحداث والطلبات إلى أنظمتك الخاصة أو برنامج المحاسبة بمرونة.',
    status: 'مفعّل',
    icon: Webhook,
    badgeColor: 'bg-purple-500/10 text-purple-700 dark:text-purple-400',
  },
  {
    id: 'rest-api',
    name: 'الزعيم REST API',
    category: 'المتاجر',
    description: 'مفاتيح برمجة الربط المباشر لاستخراج المنتجات والطلبات وإدخال الشحنات.',
    status: 'مفعّل',
    icon: Code,
    badgeColor: 'bg-slate-500/10 text-slate-700 dark:text-slate-400',
  },
  {
    id: 'vodafone-cash',
    name: 'المحافظ الإلكترونية (Vodafone Cash & InstaPay)',
    category: 'الدفع',
    description: 'تحصيل الأموال مباشرة عبر المحافظ الإلكترونية وإنستاباي والدفع عند الاستلام.',
    status: 'متاح قريباً',
    icon: CreditCard,
  },
  {
    id: 'fastpay',
    name: 'فاست باي (FastPay)',
    category: 'الدفع',
    description: 'بوابة دفع إلكتروني مخصصة لإقليم كردستان وباقي المحافظات.',
    status: 'متاح قريباً',
    icon: CreditCard,
  },
  {
    id: 'tiktok-pixel',
    name: 'TikTok Pixel',
    category: 'التسويق',
    description: 'تتبع نتائج إعلانات تيك توك وتوليد المبيعات المباشرة.',
    status: 'متاح قريباً',
    icon: Eye,
  },
];

const CATEGORIES = ['الكل', 'الشحن', 'الدفع', 'التسويق', 'المتاجر', 'التحليلات', 'خدمة الزبائن'];

export function ApplicationsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');
  const [activeApps, setActiveApps] = useState<Record<string, boolean>>({
    'zaeem-express': true,
    'cod-gateway': true,
    'whatsapp-business': true,
  });
  const [notification, setNotification] = useState<string | null>(null);

  const filteredApps = selectedCategory === 'الكل'
    ? APPLICATIONS
    : APPLICATIONS.filter((app) => app.category === selectedCategory);

  const toggleApp = (id: string, name: string) => {
    setActiveApps((prev) => {
      const nextState = !prev[id];
      setNotification(nextState ? `تم تفعيل تطبيق "${name}" بنجاح` : `تم إيقاف تطبيق "${name}"`);
      setTimeout(() => setNotification(null), 3000);
      return { ...prev, [id]: nextState };
    });
  };

  return (
    <div className="space-y-6 rf-appear">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-teal-700 dark:text-teal-400 mb-1">
            <Sparkles className="size-4" /> سوق التكاملات والتطبيقات
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            التطبيقات والربط البرمجي
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            اكتشف وادمج أدوات الشحن والدفع والتسويق لرفع كفاءة متجرك الإلكتروني.
          </p>
        </div>
      </div>

      {notification && (
        <div className="rounded-xl border border-teal-200 bg-teal-50 dark:bg-teal-950/40 dark:border-teal-800 p-4 text-sm font-semibold text-teal-800 dark:text-teal-200 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <Check className="size-4 text-teal-600" />
            {notification}
          </div>
        </div>
      )}

      {/* Category filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 rf-scrollbar">
        <Filter className="size-4 text-slate-400 shrink-0 ml-1" />
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-teal-700 text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
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
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="grid size-12 place-items-center rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-100 dark:border-teal-900/50">
                      <Icon className="size-6" />
                    </span>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-base">
                        {app.name}
                      </h3>
                      <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                        {app.category}
                      </span>
                    </div>
                  </div>

                  {isAvailable ? (
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
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
                      className={`flex-1 h-9 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        isEnabled
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200'
                          : 'bg-teal-700 hover:bg-teal-800 text-white shadow-sm'
                      }`}
                    >
                      {isEnabled ? 'إيقاف التفعيل' : 'تفعيل الآن'}
                    </button>
                    <button
                      onClick={() => alert(`إدارة إعدادات تطبيق ${app.name}`)}
                      className="px-3 h-9 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      إدارة
                    </button>
                  </>
                ) : (
                  <button
                    disabled
                    className="w-full h-9 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed flex items-center justify-center gap-1"
                  >
                    قيد التطوير <ArrowRight className="size-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
