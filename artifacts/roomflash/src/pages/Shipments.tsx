import { useState, type FormEvent } from 'react';
import {
  Truck, Plus, Search, MapPin, Package, Phone, User, DollarSign, FileText,
  CheckCircle2, Clock, AlertTriangle, ArrowLeft, ExternalLink, RefreshCw
} from 'lucide-react';
import { IRAQ_GOVERNORATES, formatIQD, DEMO_SHIPMENTS, type DemoShipment, type Governorate } from '../data/iraqData';

export function ShipmentsPage() {
  const [activeTab, setActiveTab] = useState<'list' | 'create' | 'track'>('list');
  const [shipments, setShipments] = useState<DemoShipment[]>(DEMO_SHIPMENTS);
  const [search, setSearch] = useState('');
  const [selectedGovernorate, setSelectedGovernorate] = useState<string>('الكل');
  const [trackCode, setTrackCode] = useState('');
  const [trackedShipment, setTrackedShipment] = useState<DemoShipment | null>(null);
  const [trackError, setTrackError] = useState(false);

  // Form State
  const [form, setForm] = useState({
    recipientName: '',
    recipientPhone: '+964 ',
    governorate: 'بغداد' as Governorate,
    district: '',
    neighborhood: '',
    address: '',
    nearestLandmark: '',
    codAmount: '',
    itemsCount: '1',
    weightKg: '1',
    paymentType: 'cod' as 'cod' | 'prepaid',
    notes: '',
  });

  const handleCreateShipment = (e: FormEvent) => {
    e.preventDefault();
    const newId = `ZAEEM-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const newShipment: DemoShipment = {
      id: String(Date.now()),
      trackingNumber: newId,
      recipientName: form.recipientName,
      recipientPhone: form.recipientPhone,
      governorate: form.governorate,
      district: form.district || 'مركز المحافظة',
      address: `${form.neighborhood} ${form.address} (${form.nearestLandmark ? 'قرب ' + form.nearestLandmark : ''})`,
      codAmount: form.paymentType === 'cod' ? Number(form.codAmount) || 0 : 0,
      itemsCount: Number(form.itemsCount) || 1,
      status: 'جديدة',
      date: new Date().toISOString().split('T')[0],
    };

    setShipments([newShipment, ...shipments]);
    setActiveTab('list');
    setForm({
      recipientName: '',
      recipientPhone: '+964 ',
      governorate: 'بغداد',
      district: '',
      neighborhood: '',
      address: '',
      nearestLandmark: '',
      codAmount: '',
      itemsCount: '1',
      weightKg: '1',
      paymentType: 'cod',
      notes: '',
    });
  };

  const handleTrackSearch = (e: FormEvent) => {
    e.preventDefault();
    const found = shipments.find((s) => s.trackingNumber.toLowerCase().trim() === trackCode.toLowerCase().trim());
    if (found) {
      setTrackedShipment(found);
      setTrackError(false);
    } else {
      setTrackedShipment(null);
      setTrackError(true);
    }
  };

  const filteredShipments = shipments.filter((s) => {
    const matchSearch =
      s.recipientName.includes(search) ||
      s.trackingNumber.includes(search) ||
      s.recipientPhone.includes(search);
    const matchGov = selectedGovernorate === 'الكل' || s.governorate === selectedGovernorate;
    return matchSearch && matchGov;
  });

  return (
    <div className="space-y-6 rf-appear">
      {/* Top Bar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-teal-700 dark:text-teal-400 mb-1">
            <Truck className="size-4" /> شركة الزعيم للشحن والتوصيل
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            إدارة الشحنات والتوصيل
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            إنشاء، متابعة وتتبع الشحنات مع أسطول الزعيم عبر جميع المحافظات.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('list')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'list'
                ? 'bg-teal-700 text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            جميع الشحنات
          </button>
          <button
            onClick={() => setActiveTab('track')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'track'
                ? 'bg-teal-700 text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            تتبع شحنة
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
          >
            <Plus className="size-4" /> إضافة شحنة جديدة
          </button>
        </div>
      </div>

      {/* Tab 1: Create Shipment */}
      {activeTab === 'create' && (
        <div className="max-w-4xl mx-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Plus className="size-5 text-teal-700" /> إضافة شحنة جديدة
            </h2>
            <button
              onClick={() => setActiveTab('list')}
              className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1"
            >
              <ArrowLeft className="size-4" /> العودة للقائمة
            </button>
          </div>

          <form onSubmit={handleCreateShipment} className="space-y-6">
            {/* Recipient Details */}
            <div>
              <h3 className="text-sm font-bold text-teal-800 dark:text-teal-400 mb-4 flex items-center gap-2">
                <User className="size-4" /> بيانات المستلم
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    اسم المستلم الثلاثي <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    value={form.recipientName}
                    onChange={(e) => setForm({ ...form, recipientName: e.target.value })}
                    placeholder="مثال: حيدر علي الحسيني"
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    رقم هاتف المستلم <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    value={form.recipientPhone}
                    onChange={(e) => setForm({ ...form, recipientPhone: e.target.value })}
                    placeholder="01012345678"
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm ltr text-right outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10"
                  />
                </div>
              </div>
            </div>

            {/* Address Details */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-teal-800 dark:text-teal-400 mb-4 flex items-center gap-2">
                <MapPin className="size-4" /> عنوان التوصيل بالتفصيل
              </h3>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    المحافظة <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.governorate}
                    onChange={(e) => setForm({ ...form, governorate: e.target.value as Governorate })}
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:border-teal-600"
                  >
                    {IRAQ_GOVERNORATES.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    المدينة / القضاء <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    value={form.district}
                    onChange={(e) => setForm({ ...form, district: e.target.value })}
                    placeholder="مثال: الكرادة / المنصور / الزبير"
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:border-teal-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    المنطقة / الحي
                  </label>
                  <input
                    type="text"
                    value={form.neighborhood}
                    onChange={(e) => setForm({ ...form, neighborhood: e.target.value })}
                    placeholder="مثال: حي الجامعة"
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:border-teal-600"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 mt-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    الشارع / رقم الدار
                  </label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder="مثال: شارع 14 تموز دار 25"
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:border-teal-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    أقرب نقطة دالة <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    value={form.nearestLandmark}
                    onChange={(e) => setForm({ ...form, nearestLandmark: e.target.value })}
                    placeholder="مثال: قرب جامع الحكيم / مقابل مستشفى العلوية"
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:border-teal-600"
                  />
                </div>
              </div>
            </div>

            {/* Shipment Financials & Info */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-teal-800 dark:text-teal-400 mb-4 flex items-center gap-2">
                <DollarSign className="size-4" /> تفاصيل الطلب والمبلغ (IQD)
              </h3>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    طريقة الدفع
                  </label>
                  <select
                    value={form.paymentType}
                    onChange={(e) => setForm({ ...form, paymentType: e.target.value as 'cod' | 'prepaid' })}
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:border-teal-600"
                  >
                    <option value="cod">الدفع عند الاستلام (COD)</option>
                    <option value="prepaid">مدفوع مسبقاً</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    قيمة التحصيل (د.ع) <span className="text-red-500">*</span>
                  </label>
                  <input
                    required={form.paymentType === 'cod'}
                    disabled={form.paymentType === 'prepaid'}
                    type="number"
                    value={form.paymentType === 'prepaid' ? 0 : form.codAmount}
                    onChange={(e) => setForm({ ...form, codAmount: e.target.value })}
                    placeholder="مثال: 50000"
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:border-teal-600 disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    عدد القطع
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={form.itemsCount}
                    onChange={(e) => setForm({ ...form, itemsCount: e.target.value })}
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:border-teal-600"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  ملاحظات ومواصفات الشحنة للمندوب
                </label>
                <textarea
                  rows={2}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="مثال: يرجى الاتصال قبل التوصيل بساعة، قابلة للكسر."
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:border-teal-600"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('list')}
                className="px-5 h-11 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-6 h-11 bg-teal-700 hover:bg-teal-800 text-white text-sm font-bold rounded-xl shadow-md transition-all"
              >
                تأكيد وإنشاء الشحنة (ZAEEM)
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 2: Track Shipment */}
      {activeTab === 'track' && (
        <div className="max-w-2xl mx-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 shadow-sm text-center">
          <div className="size-14 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 grid place-items-center mx-auto mb-4 border border-teal-100 dark:border-teal-900/50">
            <Truck className="size-7" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
            تتبع الشحنات — شركة الزعيم للشحن
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-6">
            أدخل رقم تتبع الشحنة المكون من الكود (مثال: ZAEEM-2026-000101)
          </p>

          <form onSubmit={handleTrackSearch} className="flex gap-2 max-w-md mx-auto mb-8">
            <input
              required
              type="text"
              value={trackCode}
              onChange={(e) => setTrackCode(e.target.value)}
              placeholder="ZAEEM-2026-XXXXXX"
              className="flex-1 h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-mono font-bold outline-none focus:border-teal-600"
            />
            <button
              type="submit"
              className="px-6 h-12 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold shadow-sm"
            >
              بحث
            </button>
          </form>

          {trackedShipment && (
            <div className="rounded-xl border border-teal-200 dark:border-teal-900 bg-teal-50/50 dark:bg-teal-950/20 p-5 text-right space-y-3">
              <div className="flex items-center justify-between border-b border-teal-200/60 dark:border-teal-900/60 pb-3">
                <span className="font-mono text-sm font-bold text-teal-800 dark:text-teal-300">
                  {trackedShipment.trackingNumber}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-700 text-white">
                  {trackedShipment.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-300">
                <p><strong>المستلم:</strong> {trackedShipment.recipientName}</p>
                <p><strong>المحافظة:</strong> {trackedShipment.governorate}</p>
                <p><strong>العنوان:</strong> {trackedShipment.address}</p>
                <p><strong>المبلغ التحصيل:</strong> {formatIQD(trackedShipment.codAmount)}</p>
              </div>
            </div>
          )}

          {trackError && (
            <div className="p-4 rounded-xl border border-red-200 bg-red-50 text-red-700 text-xs font-bold">
              لم يتم العثور على شحنة بهذا الرقم. يرجى التثبت والبحث مجدداً.
            </div>
          )}
        </div>
      )}

      {/* Tab 3: List Shipments */}
      {activeTab === 'list' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute right-3.5 top-3.5 size-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ابحث برقم الشحنة، اسم المستلم أو رقم الهاتف..."
                className="w-full h-11 pr-10 pl-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm outline-none focus:border-teal-600"
              />
            </div>

            <select
              value={selectedGovernorate}
              onChange={(e) => setSelectedGovernorate(e.target.value)}
              className="h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold outline-none"
            >
              <option value="الكل">جميع المحافظات</option>
              {IRAQ_GOVERNORATES.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* Table */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500">
                  <tr>
                    <th className="p-4">رقم الشحنة</th>
                    <th className="p-4">المستلم والتلفون</th>
                    <th className="p-4">المحافظة والعنوان</th>
                    <th className="p-4">المبلغ التحصيل</th>
                    <th className="p-4">الحالة</th>
                    <th className="p-4">التاريخ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredShipments.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="p-4 font-mono font-bold text-teal-800 dark:text-teal-400">
                        {s.trackingNumber}
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-slate-900 dark:text-white">{s.recipientName}</p>
                        <p className="text-xs text-slate-500 ltr text-right">{s.recipientPhone}</p>
                      </td>
                      <td className="p-4 text-xs">
                        <span className="font-bold text-slate-800 dark:text-slate-200">{s.governorate}</span> - {s.district}
                        <p className="text-slate-500 truncate max-w-xs">{s.address}</p>
                      </td>
                      <td className="p-4 font-mono font-bold text-slate-900 dark:text-white">
                        {formatIQD(s.codAmount)}
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${
                            s.status === 'تم التسليم'
                              ? 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300'
                              : s.status === 'خرجت للتوصيل'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                              : s.status === 'فشل التسليم'
                              ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          }`}
                        >
                          {s.status}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-slate-500 font-mono">{s.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
