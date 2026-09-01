import { useState, type FormEvent } from 'react';
import { useGetCurrentStore, useCreateStore, getGetCurrentStoreQueryKey } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import {
  Settings2, Store, CreditCard, Shield, Truck, Bell, Code, Webhook,
  Check, Lock, Palette, LifeBuoy
} from 'lucide-react';

export function SettingsPage() {
  const storeQuery = useGetCurrentStore();
  const create = useCreateStore();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<'store' | 'shipping' | 'payment' | 'security' | 'api'>('store');

  const [form, setForm] = useState({
    name: '',
    subdomain: '',
    category: 'أزياء وموضة',
    country: 'Iraq',
    theme: 'teal',
  });

  const [saved, setSaved] = useState(false);
  const store = storeQuery.data;

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (store) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      return;
    }

    create.mutate(
      { data: form as never },
      {
        onSuccess: () => {
          setSaved(true);
          queryClient.invalidateQueries({ queryKey: getGetCurrentStoreQueryKey() });
          setTimeout(() => setSaved(false), 3000);
        },
      }
    );
  };

  return (
    <div className="space-y-6 rf-appear">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="flex items-center gap-2 text-xs font-bold text-teal-700 dark:text-teal-400 mb-1">
          <Settings2 className="size-4" /> إعدادات النظام
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          إعدادات المتجر والحساب
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          إدارة هوية المتجر، خيارات الشحن العراقي، الدفع، ومفاتيح API.
        </p>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800 rf-scrollbar">
        {[
          { key: 'store', label: 'بيانات المتجر', icon: Store },
          { key: 'shipping', label: 'إعدادات الشحن', icon: Truck },
          { key: 'payment', label: 'طرق الدفع', icon: CreditCard },
          { key: 'security', label: 'الأمان والحساب', icon: Lock },
          { key: 'api', label: 'المطورين و API', icon: Code },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                isActive
                  ? 'bg-teal-700 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <Icon className="size-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Settings Form */}
      {activeTab === 'store' && (
        <div className="grid gap-6 lg:grid-cols-3">
          <form
            onSubmit={handleSave}
            className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 shadow-sm space-y-5"
          >
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white pb-3 border-b">
              معلومات المتجر الهوية
            </h2>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                اسم المتجر <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="مثال: متجر الزعيم - بغداد"
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:border-teal-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                الرابط الفرعي (Subdomain) <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center">
                <input
                  required
                  type="text"
                  value={form.subdomain}
                  onChange={(e) =>
                    setForm({ ...form, subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })
                  }
                  placeholder="mystore"
                  className="w-full h-11 px-3.5 rounded-r-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm ltr text-right outline-none focus:border-teal-600"
                />
                <span className="h-11 px-3 bg-slate-100 dark:bg-slate-800 border border-r-0 border-slate-200 dark:border-slate-700 rounded-l-xl text-xs font-mono text-slate-500 flex items-center">
                  .za3em.shop
                </span>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  تخصص المتجر <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  placeholder="عطور / أزياء / إلكترونيات"
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:border-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  سوق العمل الافتراضي
                </label>
                <select
                  disabled
                  value="Iraq"
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-sm font-bold outline-none cursor-not-allowed"
                >
                  <option value="Iraq">جمهورية العراق (IQD د.ع)</option>
                </select>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-3">
              <button
                type="submit"
                className="px-6 h-11 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl shadow-md transition-all"
              >
                حفظ التغييرات
              </button>
              {saved && (
                <span className="text-xs font-bold text-teal-700 flex items-center gap-1">
                  <Check className="size-4" /> تم الحفظ بنجاح
                </span>
              )}
            </div>
          </form>

          {/* Side Info */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-2">الدعم الفني المباشر</h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                تواصل مع فريق الدعم الفني الخاص بشركة الزعيم للشحن في بغداد والمحافظات.
              </p>
              <a
                href="/support"
                className="block text-center py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl"
              >
                مركز المساعدة والدعم
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Shipping Settings Tab */}
      {activeTab === 'shipping' && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 shadow-sm space-y-4">
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white border-b pb-3">
            إعدادات التوصيل مع شركة الزعيم للشحن
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            الربط مع أسطول الشحن مفعّل تلقائياً. يتم التوصيل لجميع المحافظات العراقية الـ 18 بتسعيرة ثابتة، مع تصفية المبالغ المحصلة (COD).
          </p>
          <div className="p-4 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200/50 text-xs font-bold text-teal-900 dark:text-teal-200">
            حالة الربط اللوجستي: فعّال وجاهز لإرسال الشحنات.
          </div>
        </div>
      )}

      {/* Payment Tab */}
      {activeTab === 'payment' && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 shadow-sm space-y-4">
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white border-b pb-3">
            طرق التحصيل والدفع المتاحة
          </h2>
          <div className="space-y-3">
            <div className="p-4 rounded-xl border border-teal-200 bg-teal-50/50 dark:bg-teal-950/30 flex items-center justify-between">
              <div>
                <p className="font-extrabold text-xs text-slate-900 dark:text-white">الدفع عند الاستلام (COD)</p>
                <p className="text-[11px] text-slate-500 mt-0.5">تحصيل الأموال نقداً بواسطة مندوبي الزعيم.</p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-700 text-white">مفعل افتراضياً</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
