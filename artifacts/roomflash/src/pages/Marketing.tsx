import { useState, useEffect, type FormEvent } from 'react';
import {
  Tag, Plus, CheckCircle2, Clock, Trash2, Sparkles, Filter, Link as LinkIcon,
  Megaphone, ArrowLeft, Percent, DollarSign, Calendar, AlertCircle, RefreshCw
} from 'lucide-react';
import { formatIQD } from '../data/iraqData';
import {
  fetchCloudCoupons,
  saveCloudCoupon,
  toggleCloudCouponStatus,
  deleteCloudCoupon,
  type CloudCoupon
} from '../utils/cloudDb';

export function MarketingPage() {
  const [activeTab, setActiveTab] = useState<'coupons' | 'campaigns' | 'links'>('coupons');
  const [coupons, setCoupons] = useState<CloudCoupon[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

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

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadCoupons = async () => {
    setIsLoading(true);
    try {
      const data = await fetchCloudCoupons();
      setCoupons(data);
    } catch (e) {
      console.warn('Error loading coupons:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
    const handleUpdate = () => loadCoupons();
    window.addEventListener('zaeem_coupons_updated', handleUpdate);
    return () => {
      window.removeEventListener('zaeem_coupons_updated', handleUpdate);
    };
  }, []);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // 1. Coupon Name
    if (!form.name.trim()) {
      errors.name = 'يرجى إدخال اسم الكوبون أو الحملة';
    }

    // 2. Coupon Code (No symbols, max 20 chars, alphanumeric only)
    const cleanCode = form.code.trim();
    if (!cleanCode) {
      errors.code = 'يرجى إدخال كود الكوبون';
    } else if (cleanCode.length > 20) {
      errors.code = 'كود الكوبون يجب ألا يتجاوز 20 حرفاً ورقم';
    } else if (!/^[A-Za-z0-9\u0600-\u06FF]+$/.test(cleanCode)) {
      errors.code = 'كود الكوبون يجب أن يحتوي على حروف وأرقام فقط وبدون أي رموز خاصة أو مسافات';
    }

    // 3. Discount Value
    const numVal = Number(form.discountValue);
    if (!form.discountValue || isNaN(numVal) || numVal <= 0) {
      errors.discountValue = 'يرجى إدخال قيمة خصم صالحة أكبر من الصفر';
    } else if (form.discountType === 'percentage' && numVal > 99) {
      errors.discountValue = 'الحد الأقصى لنسبة الخصم هو 99%';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateCoupon = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      const cleanCode = form.code.trim().toUpperCase().replace(/[^A-Za-z0-9\u0600-\u06FF]/g, '').slice(0, 20);
      let discVal = Number(form.discountValue);
      if (form.discountType === 'percentage' && discVal > 99) discVal = 99;

      const saved = await saveCloudCoupon({
        name: form.name.trim(),
        code: cleanCode,
        discountType: form.discountType,
        discountValue: discVal,
        minOrderValue: Number(form.minOrderValue) || 0,
        startDate: form.startDate,
        endDate: form.endDate,
        status: form.status,
      });

      if (saved) {
        showToast(`تم رفع الكوبون (${saved.code}) على السيرفر وتفعيله فوراً في المتجر ✅`);
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
        setFormErrors({});
        await loadCoupons();
      }
    } catch (err: any) {
      alert(err.message || 'حدث خطأ أثناء حفظ الكوبون على السيرفر');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleStatus = async (coupon: CloudCoupon) => {
    const success = await toggleCloudCouponStatus(coupon.id, coupon.status);
    if (success) {
      showToast(coupon.status === 'نشط' ? 'تم تعطيل الكوبون بنجاح' : 'تم تفعيل الكوبون بنجاح ✅');
      await loadCoupons();
    }
  };

  const handleDelete = async (id: string, code: string) => {
    if (window.confirm(`هل أنت متأكد من حذف الكوبون (${code}) نهائياً من السيرفر؟`)) {
      const success = await deleteCloudCoupon(id);
      if (success) {
        showToast('تم حذف الكوبون من السيرفر بنجاح 🗑️');
        await loadCoupons();
      }
    }
  };

  return (
    <div className="space-y-6 rf-appear">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-teal-500/30 flex items-center gap-2 animate-in fade-in text-xs font-bold">
          <CheckCircle2 className="size-4 text-teal-400" />
          <span>{toastMessage}</span>
        </div>
      )}

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
            أنشئ أكواد الخصم المربوطة بالسيرفر مباشرة لتطبيقها تلقائياً وفورياً لزبائن متجرك وصفحات الهبوط.
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
            الكوبونات ({coupons.length})
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
              onClick={() => {
                setIsCreating(true);
                setFormErrors({});
              }}
              className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="size-4" /> إنشاء كوبون جديد
            </button>
          )}
        </div>
      </div>

      {/* Create Coupon Modal/Form */}
      {isCreating && (
        <div className="max-w-2xl mx-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xl space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Tag className="size-5 text-teal-700" /> إضافة كوبون خصم جديد للسيرفر
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">سيتم رفع الكود مباشرة وتفعيله في متجرك وصفحة الشراء</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsCreating(false);
                setFormErrors({});
              }}
              className="text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white p-1 cursor-pointer"
            >
              إلغاء
            </button>
          </div>

          <form onSubmit={handleCreateCoupon} className="space-y-4">
            {/* اسم الكوبون */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                اسم الكوبون / الحملة <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                value={form.name}
                onChange={(e) => {
                  setForm({ ...form, name: e.target.value });
                  if (formErrors.name) setFormErrors({ ...formErrors, name: '' });
                }}
                placeholder="مثال: خصم عيد الفطر المبارك"
                className={`w-full h-11 px-3.5 rounded-xl border ${
                  formErrors.name ? 'border-red-500 bg-red-50/20' : 'border-slate-200 dark:border-slate-700'
                } bg-slate-50 dark:bg-slate-950 text-sm outline-none focus:border-teal-600 dark:text-white`}
              />
              {formErrors.name && <p className="text-[11px] font-bold text-red-500 mt-1">{formErrors.name}</p>}
            </div>

            {/* الكود ونوع الخصم */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  كود الخصم (الكود) <span className="text-red-500">*</span>
                  <span className="text-[10px] text-slate-400 font-normal mr-1">(بدون رموز، أقصى حد 20 حرفاً)</span>
                </label>
                <input
                  required
                  type="text"
                  maxLength={20}
                  value={form.code}
                  onChange={(e) => {
                    // Remove symbols on typing & max 20 chars
                    const sanitized = e.target.value.replace(/[^A-Za-z0-9\u0600-\u06FF]/g, '').slice(0, 20);
                    setForm({ ...form, code: sanitized.toUpperCase() });
                    if (formErrors.code) setFormErrors({ ...formErrors, code: '' });
                  }}
                  placeholder="EID2026"
                  className={`w-full h-11 px-3.5 rounded-xl border ${
                    formErrors.code ? 'border-red-500 bg-red-50/20' : 'border-slate-200 dark:border-slate-700'
                  } bg-slate-50 dark:bg-slate-950 text-sm ltr font-mono font-bold uppercase outline-none focus:border-teal-600 dark:text-white`}
                />
                {formErrors.code && <p className="text-[11px] font-bold text-red-500 mt-1">{formErrors.code}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  نوع الخصم <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.discountType}
                  onChange={(e) => {
                    const newType = e.target.value as 'percentage' | 'fixed';
                    setForm({ ...form, discountType: newType });
                    if (formErrors.discountValue) setFormErrors({ ...formErrors, discountValue: '' });
                  }}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm outline-none focus:border-teal-600 dark:text-white"
                >
                  <option value="percentage">نسبة مئوية (%) — بحد أقصى 99%</option>
                  <option value="fixed">مبلغ ثابت بالدينار العراقي (د.ع)</option>
                </select>
              </div>
            </div>

            {/* قيمة الخصم والحد الأدنى */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  قيمة الخصم <span className="text-red-500">*</span>
                  {form.discountType === 'percentage' && (
                    <span className="text-[10px] text-teal-600 font-bold mr-1">(1% إلى 99% كحد أقصى)</span>
                  )}
                </label>
                <input
                  required
                  type="number"
                  min="1"
                  max={form.discountType === 'percentage' ? 99 : undefined}
                  value={form.discountValue}
                  onChange={(e) => {
                    setForm({ ...form, discountValue: e.target.value });
                    if (formErrors.discountValue) setFormErrors({ ...formErrors, discountValue: '' });
                  }}
                  placeholder={form.discountType === 'percentage' ? 'مثال: 20' : 'مثال: 5000'}
                  className={`w-full h-11 px-3.5 rounded-xl border ${
                    formErrors.discountValue ? 'border-red-500 bg-red-50/20' : 'border-slate-200 dark:border-slate-700'
                  } bg-slate-50 dark:bg-slate-950 text-sm outline-none focus:border-teal-600 dark:text-white font-mono`}
                />
                {formErrors.discountValue && (
                  <p className="text-[11px] font-bold text-red-500 mt-1">{formErrors.discountValue}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  الحد الأدنى للطلب بالدينار العراقي (د.ع)
                </label>
                <input
                  type="number"
                  value={form.minOrderValue}
                  onChange={(e) => setForm({ ...form, minOrderValue: e.target.value })}
                  placeholder="25000"
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm outline-none focus:border-teal-600 dark:text-white font-mono"
                />
              </div>
            </div>

            {/* تاريخ البداية والانتهاء */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  تاريخ بداية الصلاحية
                </label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm outline-none focus:border-teal-600 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  تاريخ انتهاء الصلاحية
                </label>
                <input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm outline-none focus:border-teal-600 dark:text-white font-mono"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  setFormErrors({});
                }}
                className="px-5 h-11 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-7 h-11 bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white rounded-xl text-xs font-extrabold shadow-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                {isSaving ? <RefreshCw className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
                <span>{isSaving ? 'جارِ الرفع على السيرفر...' : 'تأكيد ورفع الكوبون للسيرفر'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Coupons List Table */}
      {activeTab === 'coupons' && !isCreating && (
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
          {isLoading ? (
            <div className="p-12 text-center space-y-3">
              <RefreshCw className="size-8 text-teal-600 animate-spin mx-auto" />
              <p className="text-xs font-bold text-slate-500">جارِ مزامنة الكوبونات مع السيرفر...</p>
            </div>
          ) : coupons.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-right text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500">
                  <tr>
                    <th className="p-4">اسم الكوبون</th>
                    <th className="p-4">الكود المعتمد</th>
                    <th className="p-4">قيمة الخصم</th>
                    <th className="p-4">الحد الأدنى للطلب</th>
                    <th className="p-4">فترة الصلاحية</th>
                    <th className="p-4">الحالة</th>
                    <th className="p-4 text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {coupons.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="p-4 font-extrabold text-slate-900 dark:text-white">
                        <div className="flex items-center gap-2">
                          <Tag className="size-4 text-teal-600 shrink-0" />
                          <span>{c.name}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="font-mono font-black text-xs px-2.5 py-1 bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 rounded-lg border border-teal-200 dark:border-teal-800">
                          {c.code}
                        </span>
                      </td>
                      <td className="p-4 font-mono font-black text-slate-900 dark:text-white">
                        {c.discountType === 'percentage' ? (
                          <span className="text-teal-600 font-extrabold">{c.discountValue}% خصم</span>
                        ) : (
                          <span>{formatIQD(c.discountValue)}</span>
                        )}
                      </td>
                      <td className="p-4 font-mono text-xs text-slate-600 dark:text-slate-400">
                        {c.minOrderValue > 0 ? formatIQD(c.minOrderValue) : 'بدون حد أدنى'}
                      </td>
                      <td className="p-4 font-mono text-[11px] text-slate-500">
                        {c.startDate ? `${c.startDate} إلى ${c.endDate || 'غير محدد'}` : 'دائم'}
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-extrabold ${
                            c.status === 'نشط'
                              ? 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300'
                              : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(c)}
                            className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-teal-700 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-xl hover:bg-teal-50 dark:hover:bg-teal-950/40 transition-all cursor-pointer"
                          >
                            {c.status === 'نشط' ? 'تعطيل' : 'تفعيل'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(c.id, c.code)}
                            className="text-rose-500 hover:text-rose-700 p-1.5 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all cursor-pointer"
                            title="حذف الكوبون"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-14 text-center space-y-3">
              <Tag className="size-12 text-slate-300 mx-auto" />
              <h3 className="font-extrabold text-slate-800 dark:text-slate-200 text-base">
                لا توجد كوبونات خصم مسجلة حالياً
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                تمت إزالة الكوبونات الافتراضية. يمكنك إنشاء أول كوبون حقيقي لمتجرك وسيرفع على السيرفر فوراً.
              </p>
              <button
                type="button"
                onClick={() => setIsCreating(true)}
                className="mt-2 px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-extrabold shadow-md inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="size-4" />
                <span>إضافة أول كوبون خصم</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Campaigns tab */}
      {activeTab === 'campaigns' && (
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-10 text-center space-y-3 shadow-sm">
          <Megaphone className="size-12 text-teal-700 mx-auto" />
          <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
            الحملات الإعلانية وروابط التتبع الذكية
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            ربط مباشر مع حملات فيسبوك، إنستغرام وتيك توك لتتبع المبيعات ونسب التحويل من الكوبونات تلقائياً.
          </p>
        </div>
      )}
    </div>
  );
}
