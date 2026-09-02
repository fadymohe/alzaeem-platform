import { useState, type FormEvent } from 'react';
import {
  Tag, Plus, CheckCircle2, Clock, Trash2, Sparkles, Filter, Link as LinkIcon,
  Megaphone, ArrowLeft, Percent, DollarSign, Calendar
} from 'lucide-react';
import { formatIQD } from '../data/iraqData';

interface Coupon {
  id: string;
  name: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  startDate: string;
  endDate: string;
  status: 'نشط' | 'متوقف';
  usesCount: number;
}

const INITIAL_COUPONS: Coupon[] = [
  {
    id: '1',
    name: 'خصم الافتتاح الذهبي',
    code: 'ZAEEM10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValue: 250,
    startDate: '2026-08-01',
    endDate: '2026-09-30',
    status: 'نشط',
    usesCount: 142,
  },
  {
    id: '2',
    name: 'خصم الشحن المباشر',
    code: 'BAGHDAD5K',
    discountType: 'fixed',
    discountValue: 5000,
    minOrderValue: 50000,
    startDate: '2026-08-15',
    endDate: '2026-10-15',
    status: 'نشط',
    usesCount: 89,
  },
];

export function MarketingPage() {
  const [activeTab, setActiveTab] = useState<'coupons' | 'campaigns' | 'links'>('coupons');
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [isCreating, setIsCreating] = useState(false);

  // Form State
  const [form, setForm] = useState({
    name: '',
    code: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: '',
    minOrderValue: '25000',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '2026-12-31',
    status: 'نشط' as 'نشط' | 'متوقف',
  });

  const handleCreateCoupon = (e: FormEvent) => {
    e.preventDefault();
    const newCoupon: Coupon = {
      id: String(Date.now()),
      name: form.name,
      code: form.code.toUpperCase().replace(/\s+/g, ''),
      discountType: form.discountType,
      discountValue: Number(form.discountValue) || 0,
      minOrderValue: Number(form.minOrderValue) || 0,
      startDate: form.startDate,
      endDate: form.endDate,
      status: form.status,
      usesCount: 0,
    };

    setCoupons([newCoupon, ...coupons]);
    setIsCreating(false);
    setForm({
      name: '',
      code: '',
      discountType: 'percentage',
      discountValue: '',
      minOrderValue: '25000',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '2026-12-31',
      status: 'نشط',
    });
  };

  const toggleCouponStatus = (id: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: c.status === 'نشط' ? 'متوقف' : 'نشط' } : c))
    );
  };

  return (
    <div className="space-y-6 rf-appear">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-teal-700 dark:text-teal-400 mb-1">
            <Megaphone className="size-4" /> التسويق والخصومات
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            الحملات والكوبونات والعروض
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            أنشئ أكواد الخصم وروابط التتبع لجذب المزيد من الزبائن وزيادة المبيعات في متجرك.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('coupons')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'coupons'
                ? 'bg-teal-700 text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            الكوبونات
          </button>
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'campaigns'
                ? 'bg-teal-700 text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            الحملات والعروض
          </button>
          {activeTab === 'coupons' && !isCreating && (
            <button
              onClick={() => setIsCreating(true)}
              className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
            >
              <Plus className="size-4" /> إنشاء كوبون جديد
            </button>
          )}
        </div>
      </div>

      {/* Create Coupon Modal/Form */}
      {isCreating && (
        <div className="max-w-2xl mx-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Tag className="size-5 text-teal-700" /> إضافة كوبون خصم جديد
            </h2>
            <button
              onClick={() => setIsCreating(false)}
              className="text-xs font-bold text-slate-500 hover:text-slate-900"
            >
              إلغاء
            </button>
          </div>

          <form onSubmit={handleCreateCoupon} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                اسم الكوبون / الحملة <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="مثال: خصم عيد الفطر"
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-teal-600"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  كود الخصم (الكود) <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                  placeholder="EID2026"
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm ltr font-mono font-bold uppercase outline-none focus:border-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  نوع الخصم
                </label>
                <select
                  value={form.discountType}
                  onChange={(e) => setForm({ ...form, discountType: e.target.value as 'percentage' | 'fixed' })}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-teal-600"
                >
                  <option value="percentage">نسبة مئوية (%)</option>
                  <option value="fixed">مبلغ ثابت (د.ع)</option>
                </select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  قيمة الخصم <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="number"
                  value={form.discountValue}
                  onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
                  placeholder={form.discountType === 'percentage' ? '15' : '5000'}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  الحد الأدنى للطلب (د.ع)
                </label>
                <input
                  type="number"
                  value={form.minOrderValue}
                  onChange={(e) => setForm({ ...form, minOrderValue: e.target.value })}
                  placeholder="25000"
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-teal-600"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  تاريخ البداية
                </label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  تاريخ الانتهاء
                </label>
                <input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-teal-600"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 h-10 rounded-xl border text-xs font-bold"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-6 h-10 bg-teal-700 text-white rounded-xl text-xs font-bold shadow-sm"
              >
                تأكيد وحفظ الكوبون
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Coupons List */}
      {activeTab === 'coupons' && !isCreating && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500">
                <tr>
                  <th className="p-4">اسم الكوبون</th>
                  <th className="p-4">الكود</th>
                  <th className="p-4">قيمة الخصم</th>
                  <th className="p-4">الحد الأدنى</th>
                  <th className="p-4">عدد الاستخدامات</th>
                  <th className="p-4">الحالة</th>
                  <th className="p-4">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {coupons.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="p-4 font-bold text-slate-900 dark:text-white">{c.name}</td>
                    <td className="p-4 font-mono font-bold text-teal-700 dark:text-teal-400">{c.code}</td>
                    <td className="p-4 font-mono font-bold">
                      {c.discountType === 'percentage' ? `${c.discountValue}%` : formatIQD(c.discountValue)}
                    </td>
                    <td className="p-4 font-mono text-xs text-slate-500">{formatIQD(c.minOrderValue)}</td>
                    <td className="p-4 font-mono text-xs font-bold">{c.usesCount} مرات</td>
                    <td className="p-4">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          c.status === 'نشط'
                            ? 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => toggleCouponStatus(c.id)}
                        className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-teal-700 border px-2.5 py-1 rounded-lg"
                      >
                        {c.status === 'نشط' ? 'تعطيل' : 'تفعيل'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Campaigns placeholder */}
      {activeTab === 'campaigns' && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center space-y-3">
          <Megaphone className="size-10 text-teal-700 mx-auto" />
          <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
            الحملات الإعلانية وروابط التتبع
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            ربط مباشر مع حملات فيسبوك، إنستغرام وتيك توك لتتبع المبيعات تلقائياً.
          </p>
        </div>
      )}
    </div>
  );
}
