import { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Phone,
  MapPin,
  Plus,
  RefreshCw,
  X,
  ShieldCheck,
  Award,
  CheckCircle2,
  AlertCircle,
  PackageCheck,
  Coins,
  Mail,
  Home,
  Trash2,
} from 'lucide-react';
import { formatIQD, IRAQ_GOVERNORATES } from '../data/iraqData';
import {
  getStoredCustomers,
  saveStoredCustomers,
  addStoredCustomer,
  type StoreCustomer,
} from '../data/storeState';
import { saveCloudCustomer, fetchCloudCustomers } from '../utils/cloudDb';

export function CustomersPage() {
  const [customers, setCustomers] = useState<StoreCustomer[]>([]);
  const [search, setSearch] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Add Customer Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('964');
  const [email, setEmail] = useState('');
  const [governorate, setGovernorate] = useState('بغداد');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [ordersCount, setOrdersCount] = useState('1');
  const [totalSpent, setTotalSpent] = useState('45000');

  // Form Validation Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const reloadCustomers = async (showNotification = false) => {
    setIsRefreshing(true);
    try {
      // 1. Load from local storage
      const localCustomers = getStoredCustomers();

      // 2. Fetch from Neon Cloud DB in background and merge if any server records exist
      let serverCustomers: StoreCustomer[] = [];
      try {
        const rawStore = localStorage.getItem('zaeem_store_data') || localStorage.getItem('zaeem_onboarded_store');
        let sub = '';
        if (rawStore) {
          try {
            sub = JSON.parse(rawStore).subdomain?.replace('.za3em.shop', '');
          } catch {}
        }
        serverCustomers = await fetchCloudCustomers(sub);
      } catch (err) {
        console.warn('Error fetching cloud customers:', err);
      }

      // Merge by phone
      const combinedMap = new Map<string, StoreCustomer>();
      localCustomers.forEach((c) => combinedMap.set(c.phone, c));
      serverCustomers.forEach((c) => {
        if (!combinedMap.has(c.phone)) {
          combinedMap.set(c.phone, c);
        }
      });

      const merged = Array.from(combinedMap.values());
      saveStoredCustomers(merged);
      setCustomers(merged);

      if (showNotification) {
        showToast('تم تحديث قائمة الزبائن وسجل المبيعات بنجاح ✅');
      }
    } finally {
      setTimeout(() => {
        setIsRefreshing(false);
      }, 400);
    }
  };

  useEffect(() => {
    reloadCustomers(false);
  }, []);

  const openModal = () => {
    setName('');
    setPhone('964');
    setEmail('');
    setGovernorate('بغداد');
    setCity('');
    setAddress('');
    setOrdersCount('1');
    setTotalSpent('45000');
    setErrors({});
    setShowAddModal(true);
  };

  const validateForm = (): boolean => {
    const errs: Record<string, string> = {};

    // 1. الاسم: يجب ألا يحتوي على رموز وأرقام ويجب أن يتكون من اسمين
    const trimmedName = name.trim();
    if (!trimmedName) {
      errs.name = 'اسم الزبون إجباري ومطلوب';
    } else {
      // Regex: only letters (Arabic / English) and spaces
      const hasNoSymbolsOrDigits = /^[\u0600-\u06FFa-zA-Z\s]+$/.test(trimmedName);
      const nameParts = trimmedName.split(/\s+/).filter(Boolean);
      if (!hasNoSymbolsOrDigits || nameParts.length < 2) {
        errs.name = 'اسم الزبون يجب ألا يحتوي على رموز أو أرقام، ويجب أن يتكون من اسمين على الأقل (مثال: علي حسن)';
      }
    }

    // 2. رقم الهاتف: يبدأ بـ 964 ويتكون من 10 أرقام دون كود الدولة (إجمالي 13 رقماً)
    const cleanPhone = phone.trim().replace(/[\s\-\(\)\+]/g, '');
    if (!cleanPhone) {
      errs.phone = 'رقم الهاتف إجباري ومطلوب';
    } else if (!/^964\d{10}$/.test(cleanPhone)) {
      errs.phone = 'رقم الهاتف يجب أن يبدأ بـ 964 ويتكون من 10 أرقام (مثال: 9647701234567)';
    }

    // 3. المحافظة والمنطقة
    if (!governorate.trim()) {
      errs.governorate = 'يرجى اختيار المحافظة';
    }
    if (!city.trim()) {
      errs.city = 'المنطقة أو القضاء إجباري ومطلوب (مثال: الكرادة أو المنصور)';
    }

    // 4. عنوان التوصيل: لا يقل عن 20 حرفاً ولا يزيد عن 200 حرف
    const trimmedAddress = address.trim();
    if (!trimmedAddress) {
      errs.address = 'عنوان التوصيل التفصيلي إجباري ومطلوب';
    } else if (trimmedAddress.length < 20 || trimmedAddress.length > 200) {
      errs.address = `عنوان التوصيل يجب ألا يقل عن 20 حرفاً ولا يزيد عن 200 حرف تفصيلياً (حالياً: ${trimmedAddress.length} حرف)`;
    }

    // 5. عدد الطلبات
    const parsedOrders = parseInt(ordersCount, 10);
    if (isNaN(parsedOrders) || parsedOrders < 1) {
      errs.ordersCount = 'عدد الطلبات يجب أن يكون رقماً صحيحاً 1 على الأقل';
    }

    // 6. مبلغ الشراء
    const parsedSpent = parseFloat(totalSpent);
    if (isNaN(parsedSpent) || parsedSpent <= 0) {
      errs.totalSpent = 'مبلغ الشراء يجب أن يكون رقماً أكبر من 0 د.ع';
    }

    // 7. البريد الإلكتروني إجباري ومطلوب
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      errs.email = 'البريد الإلكتروني إجباري ومطلوب (مثال: customer@gmail.com)';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      errs.email = 'يرجى إدخال بريد إلكتروني صحيح';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    const cleanPhone = phone.trim().replace(/[\s\-\(\)\+]/g, '');
    const trimmedName = name.trim();
    const trimmedAddress = address.trim();
    const trimmedCity = city.trim();
    const parsedOrders = parseInt(ordersCount, 10) || 1;
    const parsedSpent = parseFloat(totalSpent) || 45000;

    try {
      // 1. الحفظ في التخزين المحلي فوراً
      addStoredCustomer({
        name: trimmedName,
        phone: cleanPhone,
        email: email.trim(),
        governorate,
        city: trimmedCity,
        address: trimmedAddress,
        ordersCount: parsedOrders,
        totalSpent: parsedSpent,
      });

      // 2. الرفع المباشر والفوري على سيرفر وقاعدة بيانات Neon السحابية
      let currentSubdomain = '';
      try {
        const rawStore = localStorage.getItem('zaeem_store_data') || localStorage.getItem('zaeem_onboarded_store');
        if (rawStore) {
          currentSubdomain = JSON.parse(rawStore).subdomain?.replace('.za3em.shop', '');
        }
      } catch {}

      await saveCloudCustomer({
        subdomain: currentSubdomain,
        name: trimmedName,
        phone: cleanPhone,
        email: email.trim(),
        governorate,
        city: trimmedCity,
        address: trimmedAddress,
        ordersCount: parsedOrders,
        totalSpent: parsedSpent,
      });

      // 3. تحديث القائمة وإغلاق النافذة
      setCustomers(getStoredCustomers());
      setShowAddModal(false);
      showToast('تمت إضافة الزبون ورفع بياناته وعنوانه على السيرفر فوراً! ✅');
    } catch (err) {
      console.error('Error adding customer:', err);
      alert('حدث خطأ أثناء حفظ الزبون، يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCustomer = (id: number) => {
    if (window.confirm('هل تريد بالتأكيد حذف هذا الزبون من القائمة؟')) {
      const updated = customers.filter((c) => c.id !== id);
      saveStoredCustomers(updated);
      setCustomers(updated);
      showToast('تم حذف الزبون من السجل بنجاح ✅');
    }
  };

  const filteredCustomers = customers.filter((c) => {
    return (
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.city.toLowerCase().includes(search.toLowerCase()) ||
      c.governorate.toLowerCase().includes(search.toLowerCase()) ||
      (c.address && c.address.toLowerCase().includes(search.toLowerCase())) ||
      (c.email && c.email.toLowerCase().includes(search.toLowerCase()))
    );
  });

  const getCustomerBadge = (ordersCount: number) => {
    if (ordersCount >= 4) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-xs font-bold">
          <Award className="size-3" /> زبون VIP
        </span>
      );
    }
    if (ordersCount >= 2) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 text-xs font-bold">
          <ShieldCheck className="size-3" /> زبون مميز
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold">
        زبون جديد
      </span>
    );
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
            <Users className="size-4" /> قاعدة بيانات زبائنك
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            الزبائن وعلاقات المبيعات
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            سجل وتفاصيل مشتريات عملائك مع تحليلات إنفاقهم ومعدل تكرار الشراء وعناوينهم التفصيلية.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => reloadCustomers(true)}
            disabled={isRefreshing}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-60"
            title="تحديث قائمة الزبائن"
          >
            <RefreshCw className={`size-3.5 ${isRefreshing ? 'animate-spin text-teal-600' : ''}`} />
            <span>{isRefreshing ? 'جاري التحديث...' : 'تحديث'}</span>
          </button>
          <button
            type="button"
            onClick={openModal}
            className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-extrabold rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="size-4" /> إضافة زبون جديد
          </button>
        </div>
      </div>

      {/* Filter */}
      <div className="relative max-w-xl">
        <Search className="absolute right-3.5 top-3.5 size-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ابحث بالاسم، رقم الهاتف، العنوان أو المحافظة..."
          className="w-full h-11 pr-10 pl-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm outline-none focus:border-teal-600"
        />
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
        {filteredCustomers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500">
                <tr>
                  <th className="p-4">الزبون</th>
                  <th className="p-4">المحافظة / المنطقة / عنوان العميل التفصيلي</th>
                  <th className="p-4">عدد الطلبات</th>
                  <th className="p-4">مبلغ الشراء / إجمالي الإنفاق (IQD)</th>
                  <th className="p-4">الشريحة والتقييم</th>
                  <th className="p-4 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <span className="grid size-10 place-items-center rounded-full bg-teal-50 dark:bg-teal-950 font-bold text-teal-700 dark:text-teal-300 shrink-0">
                          {c.name.slice(0, 1)}
                        </span>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{c.name}</p>
                          <p className="text-xs text-slate-500 dir-ltr text-right flex items-center gap-1 mt-0.5 font-mono">
                            <Phone className="size-3 text-teal-600" /> {c.phone}
                          </p>
                          {c.email && (
                            <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                              <Mail className="size-2.5" /> {c.email}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* المحافظة والمنطقة وأسفلها عنوان العميل التفصيلي */}
                    <td className="p-4 max-w-xs">
                      <div className="space-y-1 text-right">
                        <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white text-xs">
                          <MapPin className="size-3.5 text-teal-600 shrink-0" />
                          <span>{c.governorate} — {c.city}</span>
                        </div>
                        {c.address ? (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed pr-5">
                            {c.address}
                          </p>
                        ) : (
                          <p className="text-[10px] text-slate-400 italic pr-5">
                            لا يوجد عنوان إضافي
                          </p>
                        )}
                      </div>
                    </td>

                    {/* عدد الطلبات */}
                    <td className="p-4">
                      <div className="font-mono font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <PackageCheck className="size-3.5 text-teal-600" />
                        <span>{c.ordersCount} {c.ordersCount === 1 ? 'طلب' : 'طلبات'}</span>
                      </div>
                    </td>

                    {/* مبلغ الشراء / إجمالي الإنفاق */}
                    <td className="p-4">
                      <div className="font-mono font-black text-slate-900 dark:text-teal-400 flex items-center gap-1">
                        <Coins className="size-3.5 text-amber-500" />
                        <span>{formatIQD(c.totalSpent)}</span>
                      </div>
                    </td>

                    {/* الشريحة والتقييم */}
                    <td className="p-4">
                      {getCustomerBadge(c.ordersCount)}
                    </td>

                    {/* إجراءات */}
                    <td className="p-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleDeleteCustomer(c.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="حذف هذا الزبون"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-16 text-center space-y-4">
            <div className="size-16 rounded-3xl bg-slate-100 dark:bg-slate-800 grid place-items-center mx-auto text-slate-400">
              <Users className="size-8" />
            </div>
            <div className="space-y-1 max-w-md mx-auto">
              <h3 className="font-black text-base text-slate-800 dark:text-slate-200">
                {customers.length === 0 ? 'قائمة الزبائن فارغة حالياً' : 'لا يوجد زبائن مطابقين للبحث'}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {customers.length === 0
                  ? 'لم يتم تسجيل أي زبائن حقيقيين بعد. يمكنك إضافة زبائن يدوياً بالضغط على زر "إضافة زبون جديد" أعلاه، أو سيتم تسجيلهم تلقائياً فور قيام العملاء بالشراء من متجرك.'
                  : 'يرجى تجربة البحث باسم أو رقم هاتف أو عنوان آخر.'}
              </p>
            </div>
            {customers.length === 0 && (
              <button
                type="button"
                onClick={openModal}
                className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-black rounded-xl shadow-md inline-flex items-center gap-1.5 transition-all"
              >
                <Plus className="size-4" /> أضف أول زبون الآن
              </button>
            )}
          </div>
        )}
      </div>

      {/* ADD CUSTOMER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-lg w-full rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-7 space-y-5 shadow-2xl text-right animate-fadeIn max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3.5">
              <div>
                <h3 className="font-black text-lg text-slate-900 dark:text-white flex items-center gap-2">
                  <Users className="size-5 text-teal-600" />
                  <span>إضافة زبون جديد للقاعدة</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  جميع الحقول إجبارية وسيتم رفع البيانات على السيرفر المركزي فوراً.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="size-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 grid place-items-center transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleAddCustomer} className="space-y-4 text-right">
              {/* 1. اسم الزبون (يتكون من اسمين ولا يحتوي رموز أو أرقام) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>اسم الزبون الكامل (اسمان على الأقل بدون أرقام أو رموز) <span className="text-rose-500">*</span></span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                  }}
                  placeholder="مثال: علي حسن أو مينا نادر"
                  className={`w-full rounded-xl border ${
                    errors.name ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950'
                  } p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teal-600`}
                />
                {errors.name && (
                  <p className="text-[11px] font-bold text-rose-500 flex items-center gap-1">
                    <AlertCircle className="size-3" /> {errors.name}
                  </p>
                )}
              </div>

              {/* 2. رقم الهاتف (يبدأ بـ 964 ويتكون من 10 أرقام) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>رقم الهاتف (يبدأ بـ 964 متبوعاً بـ 10 أرقام) <span className="text-rose-500">*</span></span>
                  <span className="text-[10px] text-slate-400 font-mono">13 رقماً</span>
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => {
                    // Only allow numbers
                    const val = e.target.value.replace(/[^\d]/g, '');
                    setPhone(val);
                    if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
                  }}
                  placeholder="9647701234567"
                  dir="ltr"
                  className={`w-full rounded-xl border font-mono ${
                    errors.phone ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950'
                  } p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teal-600 text-right`}
                />
                {errors.phone ? (
                  <p className="text-[11px] font-bold text-rose-500 flex items-center gap-1">
                    <AlertCircle className="size-3" /> {errors.phone}
                  </p>
                ) : (
                  <p className="text-[10px] text-slate-400">
                    يبدأ بـ 964 ثم 10 أرقام من رقم العميل (مثال: 9647701234567 أو 9647809876543)
                  </p>
                )}
              </div>

              {/* 3. المحافظة والمنطقة / القضاء */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    المحافظة <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={governorate}
                    onChange={(e) => {
                      setGovernorate(e.target.value);
                      if (errors.governorate) setErrors((prev) => ({ ...prev, governorate: '' }));
                    }}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-600"
                  >
                    {IRAQ_GOVERNORATES.map((g) => (
                      <option key={g} value={g}>
                        🇮🇶 {g}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    المنطقة أو القضاء <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => {
                      setCity(e.target.value);
                      if (errors.city) setErrors((prev) => ({ ...prev, city: '' }));
                    }}
                    placeholder="مثال: الكرادة أو المنصور"
                    className={`w-full rounded-xl border ${
                      errors.city ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950'
                    } p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teal-600`}
                  />
                  {errors.city && (
                    <p className="text-[11px] font-bold text-rose-500 flex items-center gap-1">
                      <AlertCircle className="size-3" /> {errors.city}
                    </p>
                  )}
                </div>
              </div>

              {/* 4. عنوان التوصيل التفصيلي (بين 20 و 200 حرف إجباري) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span>عنوان التوصيل التفصيلي (من 20 إلى 200 حرف) <span className="text-rose-500">*</span></span>
                  <span className={`text-[11px] font-mono ${
                    address.trim().length < 20 || address.trim().length > 200 ? 'text-amber-500 font-bold' : 'text-emerald-500 font-bold'
                  }`}>
                    {address.trim().length} / 200 حرف
                  </span>
                </div>
                <textarea
                  required
                  rows={3}
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    if (errors.address) setErrors((prev) => ({ ...prev, address: '' }));
                  }}
                  placeholder="مثال: بغداد — الكرادة، شارع العرصات قرب مرطبات الفردوس، زقاق 14 دار 2"
                  className={`w-full rounded-xl border ${
                    errors.address ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950'
                  } p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teal-600 leading-relaxed`}
                />
                {errors.address && (
                  <p className="text-[11px] font-bold text-rose-500 flex items-center gap-1">
                    <AlertCircle className="size-3" /> {errors.address}
                  </p>
                )}
              </div>

              {/* 5. عدد الطلبات ومبلغ الشراء الإجمالي */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    عدد الطلبات <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={ordersCount}
                    onChange={(e) => {
                      setOrdersCount(e.target.value);
                      if (errors.ordersCount) setErrors((prev) => ({ ...prev, ordersCount: '' }));
                    }}
                    className={`w-full rounded-xl border font-mono ${
                      errors.ordersCount ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950'
                    } p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teal-600`}
                  />
                  {errors.ordersCount && (
                    <p className="text-[11px] font-bold text-rose-500 flex items-center gap-1">
                      <AlertCircle className="size-3" /> {errors.ordersCount}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    مبلغ الشراء الإجمالي (د.ع) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1000"
                    step="500"
                    required
                    value={totalSpent}
                    onChange={(e) => {
                      setTotalSpent(e.target.value);
                      if (errors.totalSpent) setErrors((prev) => ({ ...prev, totalSpent: '' }));
                    }}
                    placeholder="45000"
                    className={`w-full rounded-xl border font-mono ${
                      errors.totalSpent ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950'
                    } p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teal-600`}
                  />
                  {errors.totalSpent && (
                    <p className="text-[11px] font-bold text-rose-500 flex items-center gap-1">
                      <AlertCircle className="size-3" /> {errors.totalSpent}
                    </p>
                  )}
                </div>
              </div>

              {/* 6. البريد الإلكتروني إجباري ومطلوب */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  البريد الإلكتروني للعميل <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                  }}
                  placeholder="customer@example.com"
                  dir="ltr"
                  className={`w-full rounded-xl border ${
                    errors.email ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950'
                  } p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teal-600`}
                />
                {errors.email && (
                  <p className="text-[11px] font-bold text-rose-500 flex items-center gap-1">
                    <AlertCircle className="size-3" /> {errors.email}
                  </p>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="size-4 animate-spin" />
                      <span>جاري الرفع على السيرفر المركزي...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="size-4" />
                      <span>إضافة الزبون ورفع البيانات على السيرفر فوراً</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
