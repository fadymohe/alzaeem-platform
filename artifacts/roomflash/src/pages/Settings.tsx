import { useState, useEffect, type FormEvent } from 'react';
import { useGetCurrentStore, useCreateStore, getGetCurrentStoreQueryKey } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import {
  Settings2, Store, CreditCard, Shield, Truck, Bell, Code, Webhook,
  Check, Lock, Palette, LifeBuoy, Save, Globe, Power
} from 'lucide-react';

export function SettingsPage() {
  const storeQuery = useGetCurrentStore();
  const create = useCreateStore();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<'store' | 'shipping' | 'payment' | 'security' | 'api'>('store');

  const [isSubdomainActive, setIsSubdomainActive] = useState(() => {
    try {
      return localStorage.getItem('zaeem_store_active') !== 'false';
    } catch {
      return true;
    }
  });

  const [form, setForm] = useState({
    name: '',
    subdomain: '',
    category: 'أزياء وموضة',
    country: 'Iraq',
    theme: 'teal',
  });

  // Pre-populate with saved store info
  useEffect(() => {
    try {
      const rawStore = localStorage.getItem('zaeem_onboarded_store') || localStorage.getItem('zaeem_store_data');
      const rawUser = localStorage.getItem('zaeem_user');
      let storeObj: any = null;
      let userObj: any = null;
      if (rawStore) storeObj = JSON.parse(rawStore);
      if (rawUser) userObj = JSON.parse(rawUser);

      const initialName = storeObj?.storeName || userObj?.storeName || 'متجر الزعيم الذهبي';
      const initialSub = (storeObj?.subdomain || userObj?.subdomain || 'alzaeem')
        .replace('.za3em.shop', '')
        .replace(/^https?:\/\//, '')
        .trim();
      const initialCat = storeObj?.category || userObj?.category || 'أزياء وموضة';

      setForm({
        name: initialName,
        subdomain: initialSub,
        category: initialCat,
        country: 'Iraq',
        theme: 'teal'
      });
    } catch {}
  }, []);

  const [saved, setSaved] = useState(false);
  const saving = create.isPending;
  const store = storeQuery.data;

  const handleToggleSubdomainActive = () => {
    const nextState = !isSubdomainActive;
    setIsSubdomainActive(nextState);
    try {
      localStorage.setItem('zaeem_store_active', String(nextState));
      const updateObj = (key: string) => {
        const raw = localStorage.getItem(key);
        if (raw) {
          const parsed = JSON.parse(raw);
          parsed.isActive = nextState;
          localStorage.setItem(key, JSON.stringify(parsed));
        }
      };
      updateObj('zaeem_store_data');
      updateObj('zaeem_onboarded_store');

      window.dispatchEvent(new CustomEvent('zaeem_store_updated', { detail: { isActive: nextState } }));
    } catch {}
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    try {
      const rawStore = localStorage.getItem('zaeem_store_data') || localStorage.getItem('zaeem_onboarded_store') || '{}';
      const parsed = JSON.parse(rawStore);
      parsed.storeName = form.name;
      parsed.subdomain = `${form.subdomain}.za3em.shop`;
      parsed.category = form.category;
      parsed.isActive = isSubdomainActive;

      localStorage.setItem('zaeem_store_data', JSON.stringify(parsed));
      localStorage.setItem('zaeem_onboarded_store', JSON.stringify(parsed));

      const rawUser = localStorage.getItem('zaeem_user');
      if (rawUser) {
        const u = JSON.parse(rawUser);
        u.storeName = form.name;
        u.subdomain = `${form.subdomain}.za3em.shop`;
        localStorage.setItem('zaeem_user', JSON.stringify(u));
      }

      window.dispatchEvent(new CustomEvent('zaeem_store_updated'));
    } catch {}

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
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
          إدارة هوية المتجر، خيارات الشحن والتوصيل، الدفع، ومفاتيح API.
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
            className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 shadow-sm space-y-6"
          >
            {/* 🌟 كارت تنشيط وإلغاء تنشيط الموقع الفرعي */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950 border border-teal-500/30 text-white shadow-md space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className={`size-11 rounded-xl grid place-items-center transition-colors shrink-0 ${
                    isSubdomainActive
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}>
                    <Globe className="size-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-extrabold text-white">حالة الموقع الفرعي أونلاين</h3>
                      {/* شارة كلمة نشط / معطل تتغير تلقائياً بتغيير حالة الخيار */}
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-black flex items-center gap-1.5 transition-all ${
                        isSubdomainActive
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      }`}>
                        <span className={`size-2 rounded-full ${isSubdomainActive ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                        {isSubdomainActive ? 'نشط' : 'معطل'}
                      </span>
                    </div>
                    <p className="text-xs text-teal-400/90 font-mono mt-0.5 dir-ltr text-right">
                      https://{form.subdomain || 'mystore'}.za3em.shop
                    </p>
                  </div>
                </div>

                {/* مفتاح التبديل التفاعلي لتنشيط أو إلغاء تنشيط الموقع */}
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-300">
                    {isSubdomainActive ? 'إلغاء التنشيط' : 'تنشيط الموقع'}
                  </span>
                  <button
                    type="button"
                    onClick={handleToggleSubdomainActive}
                    className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      isSubdomainActive ? 'bg-emerald-500' : 'bg-slate-700'
                    }`}
                    role="switch"
                    aria-checked={isSubdomainActive}
                    title={isSubdomainActive ? 'اضغط لإلغاء تنشيط الموقع الفرعي' : 'اضغط لتنشيط الموقع الفرعي'}
                  >
                    <span
                      className={`pointer-events-none inline-block size-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                        isSubdomainActive ? 'translate-x-7' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 leading-relaxed border-t border-slate-800/80 pt-2.5 flex items-center justify-between">
                <span>
                  {isSubdomainActive
                    ? '✅ الموقع الفرعي نشط ومفتوح للزبائن لاستقبال الطلبات والدفع عند الاستلام.'
                    : '⏸️ تم إيقاف الموقع الفرعي مؤقتاً؛ الزوار سيشاهدون رسالة الصيانة لحين إعادة التنشيط.'}
                </span>
                <span className="font-bold text-teal-400">
                  الحالة الحالية: {isSubdomainActive ? 'نشط' : 'معطل'}
                </span>
              </div>
            </div>

            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white pb-3 border-b">
              معلومات المتجر والهوية
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
                disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-sm font-bold shadow-md shadow-teal-700/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Save className="size-4" />
                <span>{saving ? 'جاري الحفظ...' : 'حفظ التعديلات'}</span>
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
            الربط مع أسطول الشحن مفعّل تلقائياً. يتم التوصيل لجميع المحافظات بتسعيرة محددة، مع تصفية المبالغ المحصلة (COD).
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
