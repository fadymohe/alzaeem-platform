import { useState, useEffect } from 'react';
import { ShoppingCart, Search, RefreshCw, CheckCircle2, Clock, Plus, Phone, MapPin, Truck, AlertCircle, X, ChevronRight, Printer } from 'lucide-react';
import { formatIQD, IRAQ_GOVERNORATES } from '../data/iraqData';
import { getStoredOrders, updateStoredOrderStatus, addStoredOrder, type StoreOrder } from '../data/storeState';
import { ShippingLabelModal } from '../components/shipping/ShippingLabelModal';

export function OrdersPage() {
  const [orders, setOrders] = useState<StoreOrder[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [printShipment, setPrintShipment] = useState<any>(null);

  // New order form state
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerCity, setCustomerCity] = useState('بغداد');
  const [address, setAddress] = useState('');
  const [productName, setProductName] = useState('قميص قطن فاخر أبيض');
  const [quantity, setQuantity] = useState('1');
  const [totalPrice, setTotalPrice] = useState('45000');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const reloadOrders = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setOrders(getStoredOrders());
      setIsRefreshing(false);
      showToast('تم تحديث قائمة الطلبات بنجاح ✅');
    }, 450);
  };

  useEffect(() => {
    setOrders(getStoredOrders());
    const handleUpdate = () => setOrders(getStoredOrders());
    window.addEventListener('zaeem_store_updated', handleUpdate);
    window.addEventListener('zaeem_shipments_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('zaeem_store_updated', handleUpdate);
      window.removeEventListener('zaeem_shipments_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
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
    setOrders(getStoredOrders());
    showToast('تم تحديث حالة الطلب بنجاح ✅');
  };

  const validateOrderForm = (): boolean => {
    const errors: Record<string, string> = {};

    // 1. Customer Name: Letters and spaces only, no symbols or numbers
    const trimmedName = customerName.trim();
    if (!trimmedName) {
      errors.customerName = 'يرجى إدخال اسم العميل';
    } else if (!/^[\p{L}\s]+$/u.test(trimmedName)) {
      errors.customerName = 'اسم العميل يجب أن يحتوي على حروف ومسافات فقط بدون أرقام أو رموز خاصة';
    }

    // 2. Customer Phone: Must start with 964 or be 10 digits in other cases
    const trimmedPhone = customerPhone.trim();
    const digits = trimmedPhone.replace(/\D/g, '');
    if (!trimmedPhone) {
      errors.customerPhone = 'يرجى إدخال رقم الهاتف';
    } else {
      const startsWith964 = trimmedPhone.startsWith('+964') || digits.startsWith('964');
      if (startsWith964) {
        // Must have 964 followed by proper phone digits (12-13 digits total)
        if (digits.length < 12 || digits.length > 13) {
          errors.customerPhone = 'رقم الهاتف يبدأ بـ 964 ويجب أن يكون رقماً عراقياً صحيحاً (مثال: 9647701234567)';
        }
      } else {
        // في خلاف ذلك: مكون من 10 أرقام
        if (digits.length !== 10) {
          errors.customerPhone = 'في حال عدم كتابة رمز الدولة (964)، يجب أن يتكون رقم الهاتف من 10 أرقام تماماً (مثال: 0770123456)';
        }
      }
    }

    // 3. Address
    if (!address.trim()) {
      errors.address = 'يرجى إدخال العنوان التفصيلي للزبون';
    }

    // 4. Product Name
    if (!productName.trim()) {
      errors.productName = 'يرجى تحديد اسم المنتج المطلوب';
    }

    // 5. Quantity
    const qtyNum = parseInt(quantity, 10);
    if (isNaN(qtyNum) || qtyNum < 1) {
      errors.quantity = 'الكمية يجب أن تكون قطعة واحدة على الأقل';
    }

    // 6. Total Price
    const priceNum = Number(totalPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      errors.totalPrice = 'يرجى إدخال مبلغ إجمالي صحيح بالدينار العراقي';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateOrderForm()) return;

    const qty = parseInt(quantity, 10) || 1;
    const total = Number(totalPrice) || 45000;

    addStoredOrder({
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerCity,
      address: address.trim(),
      total,
      itemsCount: qty,
      status: 'pending',
      paymentMethod: 'cod',
      items: [{ productName: productName.trim(), quantity: qty, unitPrice: Math.round(total / qty) }]
    });

    setCustomerName('');
    setCustomerPhone('');
    setAddress('');
    setQuantity('1');
    setFormErrors({});
    setShowAddModal(false);
    setOrders(getStoredOrders());
    showToast('تمت إضافة الطلب الجديد بنجاح وحفظه في السيرفر ✅');
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
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 border border-teal-500/50 text-white px-5 py-2.5 rounded-2xl shadow-2xl text-xs font-bold flex items-center gap-2 backdrop-blur-md transition-all">
          <CheckCircle2 className="size-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

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
            متابعة وتحديث حالة طلبات الزبائن والدفع عند الاستلام والتوصيل.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={isRefreshing}
            onClick={reloadOrders}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-60"
          >
            <RefreshCw className={`size-3.5 ${isRefreshing ? 'animate-spin text-teal-600' : ''}`} />
            <span>{isRefreshing ? 'جارٍ التحديث...' : 'تحديث'}</span>
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

      {/* Logistics Active Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-950/40 via-slate-900 to-emerald-950/40 border border-teal-500/30 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-teal-500/20 border border-teal-500/40 text-teal-400 grid place-items-center shrink-0">
            <Truck className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              <h4 className="text-xs font-black text-white">الربط الآلي مع شركة الزعيم للشحن السريع مفعل</h4>
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5">
              أي طلب يرد من صفحات الهبوط أو المتجر الإلكتروني يُسجل هنا وتُرفع بوليصة شحنه تلقائياً لأسطول الشحن في كافة محافظات العراق.
            </p>
          </div>
        </div>

        <a
          href="#/shipments"
          className="px-3.5 py-1.5 rounded-xl bg-teal-600/30 hover:bg-teal-600/50 border border-teal-500/40 text-teal-200 text-xs font-bold transition-all flex items-center gap-1.5"
        >
          <span>لوحة الشحنات والتتبع</span>
          <ChevronRight className="size-3.5" />
        </a>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute right-3.5 top-3.5 size-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث برقم الطلب، رقم البوليصة ZAEEM، اسم الزبون، المدينة أو الهاتف..."
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
                  <th className="p-4">بوليصة الشحن والتتبع</th>
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
                      <div className="space-y-1">
                        <a
                          href={`#/shipments?track=${ord.trackingNumber || ''}`}
                          className="font-mono font-bold text-xs text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1.5"
                          title="تتبع هذه الشحنة"
                        >
                          <Truck className="size-3.5 text-teal-500 shrink-0" />
                          <span>{ord.trackingNumber || `ZAEEM-2026-${String(ord.id).slice(-6)}`}</span>
                        </a>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 px-1.5 py-0.5 rounded">
                            {ord.shippingCompany || 'شركة الزعيم للشحن'}
                          </span>
                          <span className="text-[10px] text-teal-600 dark:text-teal-400 font-bold">
                            مرفوعة للشحن 🚀
                          </span>
                        </div>
                      </div>
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
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setPrintShipment({
                            trackingNumber: ord.trackingNumber || `ZAEEM-2026-${String(ord.id).slice(-6)}`,
                            recipientName: ord.customerName,
                            recipientPhone: ord.customerPhone,
                            governorate: ord.customerCity,
                            district: ord.customerCity,
                            address: ord.address,
                            codAmount: ord.total,
                            shippingCost: 5000,
                            shippingCompany: ord.shippingCompany || 'شركة الزعيم للشحن السريع',
                            date: ord.createdAt ? ord.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
                          })}
                          className="px-2 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-700 hover:text-white text-teal-700 dark:text-teal-300 text-xs font-bold border border-teal-200 dark:border-teal-800 transition-all flex items-center gap-1 cursor-pointer"
                          title="طباعة بوليصة الشحن الحرارية"
                        >
                          <Printer className="size-3.5" />
                          <span>بوليصة PDF</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAdvanceStatus(ord.id, ord.status)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-teal-50 dark:bg-slate-800 dark:hover:bg-teal-950/60 text-slate-700 dark:text-slate-300 hover:text-teal-700 text-xs font-bold border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
                        >
                          <span>{ord.status === 'pending' ? 'تأكيد' : ord.status === 'confirmed' ? 'تجهيز' : ord.status === 'processing' ? 'تسليم' : 'إعادة'}</span>
                          <ChevronRight className="size-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center space-y-3">
            <ShoppingCart className="size-10 text-slate-300 mx-auto" />
            <h3 className="font-extrabold text-slate-800 dark:text-slate-200">
              {orders.length === 0 ? 'لا توجد طلبات بعد' : 'لا توجد طلبات مطابقة'}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {orders.length === 0
                ? 'لم يتم تسجيل أي طلبات شراء في المتجر بعد. بمجرد قيام الزبائن بالشراء ستظهر هنا تلقائياً بتسلسل order0001.'
                : 'جرب البحث بكلمة أخرى أو تغيير تصفية الحالة.'}
            </p>
          </div>
        )}
      </div>

      {/* ADD ORDER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xl text-right animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">إضافة طلب شراء جديد</h3>
                <p className="text-xs text-slate-500">أدخل بيانات الطلب والعميل بدقة للمتابعة والشحن</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleAddOrder} className="space-y-3.5 text-right">
              {/* اسم الزبون */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  اسم العميل <span className="text-rose-500">*</span>
                  <span className="text-[10px] font-normal text-slate-400 mr-2">(حروف ومسافات فقط بدون أرقام أو رموز)</span>
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => {
                    setCustomerName(e.target.value);
                    if (formErrors.customerName) setFormErrors((prev) => ({ ...prev, customerName: '' }));
                  }}
                  placeholder="مثال: حيدر كريم العراقي"
                  className={`w-full rounded-xl border ${
                    formErrors.customerName ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200 dark:border-slate-800'
                  } bg-slate-50 dark:bg-slate-950 p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teal-600`}
                />
                {formErrors.customerName && (
                  <p className="text-[11px] font-bold text-rose-500 flex items-center gap-1">
                    <AlertCircle className="size-3 shrink-0" /> {formErrors.customerName}
                  </p>
                )}
              </div>

              {/* الهاتف والمحافظة */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    رقم الهاتف <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => {
                      setCustomerPhone(e.target.value);
                      if (formErrors.customerPhone) setFormErrors((prev) => ({ ...prev, customerPhone: '' }));
                    }}
                    placeholder="9647701234567 أو 0770123456"
                    dir="ltr"
                    className={`w-full rounded-xl border ${
                      formErrors.customerPhone ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200 dark:border-slate-800'
                    } bg-slate-50 dark:bg-slate-950 p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teal-600`}
                  />
                  {formErrors.customerPhone && (
                    <p className="text-[10px] font-bold text-rose-500 leading-tight">
                      {formErrors.customerPhone}
                    </p>
                  )}
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

              {/* العنوان التفصيلي */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  العنوان التفصيلي <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    if (formErrors.address) setFormErrors((prev) => ({ ...prev, address: '' }));
                  }}
                  placeholder="المنطقة، الشارع، أقرب نقطة دالة"
                  className={`w-full rounded-xl border ${
                    formErrors.address ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200 dark:border-slate-800'
                  } bg-slate-50 dark:bg-slate-950 p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teal-600`}
                />
                {formErrors.address && (
                  <p className="text-[11px] font-bold text-rose-500">{formErrors.address}</p>
                )}
              </div>

              {/* المنتج والكمية */}
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">المنتج *</label>
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => {
                      setProductName(e.target.value);
                      if (formErrors.productName) setFormErrors((prev) => ({ ...prev, productName: '' }));
                    }}
                    placeholder="اسم المنتج المطلوب"
                    className={`w-full rounded-xl border ${
                      formErrors.productName ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200 dark:border-slate-800'
                    } bg-slate-50 dark:bg-slate-950 p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teal-600`}
                  />
                  {formErrors.productName && (
                    <p className="text-[11px] font-bold text-rose-500">{formErrors.productName}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">الكمية *</label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => {
                      setQuantity(e.target.value);
                      if (formErrors.quantity) setFormErrors((prev) => ({ ...prev, quantity: '' }));
                    }}
                    className={`w-full rounded-xl border ${
                      formErrors.quantity ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200 dark:border-slate-800'
                    } bg-slate-50 dark:bg-slate-950 p-2.5 text-xs font-mono text-center text-slate-900 dark:text-white focus:outline-none focus:border-teal-600`}
                  />
                </div>
              </div>

              {/* المبلغ الإجمالي */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  المبلغ الإجمالي بالدينار العراقي (د.ع) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  value={totalPrice}
                  onChange={(e) => {
                    setTotalPrice(e.target.value);
                    if (formErrors.totalPrice) setFormErrors((prev) => ({ ...prev, totalPrice: '' }));
                  }}
                  placeholder="45000"
                  className={`w-full rounded-xl border ${
                    formErrors.totalPrice ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200 dark:border-slate-800'
                  } bg-slate-50 dark:bg-slate-950 p-2.5 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-teal-600`}
                />
                {formErrors.totalPrice && (
                  <p className="text-[11px] font-bold text-rose-500">{formErrors.totalPrice}</p>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="size-4" />
                  <span>تأكيد إنشاء الطلب وحفظه</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* THERMAL SHIPPING LABEL MODAL */}
      <ShippingLabelModal shipment={printShipment} onClose={() => setPrintShipment(null)} />
    </div>
  );
}


