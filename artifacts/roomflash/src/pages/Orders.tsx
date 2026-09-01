import { useState, useEffect } from 'react';
import { ShoppingCart, Search, RefreshCw, CheckCircle2, Clock, Plus, Phone, MapPin, Truck, AlertCircle, X, ChevronRight } from 'lucide-react';
import { formatIQD, IRAQ_GOVERNORATES } from '../data/iraqData';
import { getStoredOrders, updateStoredOrderStatus, addStoredOrder, type StoreOrder } from '../data/storeState';

export function OrdersPage() {
  const [orders, setOrders] = useState<StoreOrder[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New order form state
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerCity, setCustomerCity] = useState('بغداد');
  const [address, setAddress] = useState('');
  const [productName, setProductName] = useState('قميص قطن فاخر أبيض');
  const [totalPrice, setTotalPrice] = useState('45000');

  const reloadOrders = () => {
    setOrders(getStoredOrders());
  };

  useEffect(() => {
    reloadOrders();
  }, []);

  const handleAdvanceStatus = (id: number, currentStatus: StoreOrder['status']) => {
    const statusFlow: Record<StoreOrder['status'], StoreOrder['status']> = {
      pending: 'confirmed',
      confirmed: 'processing',
      processing: 'delivered',
      delivered: 'delivered',
      cancelled: 'pending'
    };

    const nextStatus = statusFlow[currentStatus];
    updateStoredOrderStatus(id, nextStatus);
    reloadOrders();
  };

  const handleAddOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) return;

    addStoredOrder({
      customerName,
      customerPhone,
      customerCity,
      address: address || `العراق — ${customerCity}`,
      total: Number(totalPrice) || 45000,
      itemsCount: 1,
      status: 'pending',
      paymentMethod: 'cod',
      items: [{ productName, quantity: 1, unitPrice: Number(totalPrice) || 45000 }]
    });

    setCustomerName('');
    setCustomerPhone('');
    setAddress('');
    setShowAddModal(false);
    reloadOrders();
  };

  const filteredOrders = orders.filter((ord) => {
    const matchesSearch =
      ord.number.toLowerCase().includes(search.toLowerCase()) ||
      ord.customerName.toLowerCase().includes(search.toLowerCase()) ||
      ord.customerPhone.includes(search) ||
      ord.customerCity.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'all' || ord.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: StoreOrder['status']) => {
    switch (status) {
      case 'pending':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-xs font-bold"><Clock className="size-3" /> قيد الانتظار</span>;
      case 'confirmed':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold"><CheckCircle2 className="size-3" /> مؤكد</span>;
      case 'processing':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-bold"><Truck className="size-3" /> جاري التجهيز</span>;
      case 'delivered':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold"><CheckCircle2 className="size-3" /> تم التسليم</span>;
      case 'cancelled':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-bold"><AlertCircle className="size-3" /> ملغى</span>;
    }
  };

  return (
    <div className="space-y-6 rf-appear">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-teal-700 dark:text-teal-400 mb-1">
            <ShoppingCart className="size-4" /> مبيعات المنصة
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            إدارة الطلبات والشراء
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            متابعة وتحديث حالة طلبات الزبائن والدفع عند الاستلام داخل العراق.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={reloadOrders}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5"
          >
            <RefreshCw className="size-3.5" /> تحديث
          </button>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-extrabold rounded-xl shadow-md flex items-center gap-1.5"
          >
            <Plus className="size-4" /> إضافة طلب جديد
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute right-3.5 top-3.5 size-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث برقم الطلب، اسم الزبون، المدينة أو رقم الهاتف..."
            className="w-full h-11 pr-10 pl-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm outline-none focus:border-teal-600"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold outline-none"
        >
          <option value="all">جميع الحالات ({orders.length})</option>
          <option value="pending">قيد الانتظار</option>
          <option value="confirmed">مؤكد</option>
          <option value="processing">جاري التجهيز</option>
          <option value="delivered">تم التسليم</option>
          <option value="cancelled">ملغى</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
        {filteredOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500">
                <tr>
                  <th className="p-4">رقم الطلب</th>
                  <th className="p-4">الزبون والهاتف</th>
                  <th className="p-4">المحافظة والعنوان</th>
                  <th className="p-4">الإجمالي (IQD)</th>
                  <th className="p-4">الحالة الحالية</th>
                  <th className="p-4 text-center">تحديث الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="p-4 font-mono font-extrabold text-teal-700 dark:text-teal-400">
                      {ord.number}
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">{ord.customerName}</p>
                        <p className="text-xs text-slate-500 dir-ltr text-right flex items-center gap-1 mt-0.5">
                          <Phone className="size-3" /> {ord.customerPhone}
                        </p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-200 text-xs flex items-center gap-1">
                          <MapPin className="size-3 text-teal-600" /> {ord.customerCity}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate max-w-xs">{ord.address}</p>
                      </div>
                    </td>
                    <td className="p-4 font-mono font-black text-slate-900 dark:text-white">
                      {formatIQD(ord.total)}
                    </td>
                    <td className="p-4">
                      {getStatusBadge(ord.status)}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleAdvanceStatus(ord.id, ord.status)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-teal-50 dark:bg-slate-800 dark:hover:bg-teal-950/60 text-slate-700 dark:text-slate-300 hover:text-teal-700 text-xs font-bold border border-slate-200 dark:border-slate-700 transition-all"
                      >
                        <span>تحديث لـ {ord.status === 'pending' ? 'مؤكد' : ord.status === 'confirmed' ? 'تجهيز' : ord.status === 'processing' ? 'تسليم' : 'إعادة'}</span>
                        <ChevronRight className="size-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center space-y-3">
            <ShoppingCart className="size-10 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-700 dark:text-slate-300">لا توجد طلبات مطابقة</h3>
            <p className="text-xs text-slate-500">جرب البحث بكلمة أخرى أو إضافة طلب جديد.</p>
          </div>
        )}
      </div>

      {/* ADD ORDER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xl text-right">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">إضافة طلب شراء جديد</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleAddOrder} className="space-y-3 text-right">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">اسم الزبون *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="أحمد علي"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">رقم الهاتف *</label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+964 770 000 0000"
                    dir="ltr"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">المحافظة *</label>
                  <select
                    value={customerCity}
                    onChange={(e) => setCustomerCity(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-2.5 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
                  >
                    {IRAQ_GOVERNORATES.map((g) => (
                      <option key={g} value={g}>🇮🇶 {g}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">المنتج *</label>
                <input
                  type="text"
                  required
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="قميص قطن فاخر"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">المبلغ الإجمالي (د.ع) *</label>
                <input
                  type="number"
                  required
                  value={totalPrice}
                  onChange={(e) => setTotalPrice(e.target.value)}
                  placeholder="45000"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-2.5 text-xs font-mono text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs shadow-md mt-2"
              >
                إنشاء الطلب وحفظه
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
