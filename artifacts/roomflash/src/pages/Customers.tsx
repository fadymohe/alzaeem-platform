import { useState, useEffect } from 'react';
import { Users, Search, Phone, MapPin, Plus, RefreshCw, X, ShieldCheck, Award } from 'lucide-react';
import { formatIQD, IRAQ_GOVERNORATES } from '../data/iraqData';
import { getStoredCustomers, addStoredCustomer, type StoreCustomer } from '../data/storeState';

export function CustomersPage() {
  const [customers, setCustomers] = useState<StoreCustomer[]>([]);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New customer form
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [governorate, setGovernorate] = useState('بغداد');
  const [city, setCity] = useState('بغداد — الكرادة');

  const reloadCustomers = () => {
    setCustomers(getStoredCustomers());
  };

  useEffect(() => {
    reloadCustomers();
  }, []);

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    addStoredCustomer({
      name,
      phone,
      email: email || undefined,
      governorate,
      city: city || `${governorate}`
    });

    setName('');
    setPhone('');
    setEmail('');
    setShowAddModal(false);
    reloadCustomers();
  };

  const filteredCustomers = customers.filter((c) => {
    return (
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.city.toLowerCase().includes(search.toLowerCase()) ||
      (c.email && c.email.toLowerCase().includes(search.toLowerCase()))
    );
  });

  const getCustomerBadge = (ordersCount: number) => {
    if (ordersCount >= 4) {
      return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-xs font-bold"><Award className="size-3" /> زبون VIP</span>;
    }
    if (ordersCount >= 2) {
      return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 text-xs font-bold"><ShieldCheck className="size-3" /> زبون مميز</span>;
    }
    return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold">زبون جديد</span>;
  };

  return (
    <div className="space-y-6 rf-appear">
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
            سجل وتفاصيل مشتريات زبائنك في العراق مع تحليلات إنفاقهم.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={reloadCustomers}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5"
          >
            <RefreshCw className="size-3.5" /> تحديث
          </button>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-extrabold rounded-xl shadow-md flex items-center gap-1.5"
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
          placeholder="ابحث بالاسم، رقم الهاتف، البريد أو المحافظة..."
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
                  <th className="p-4">المحافظة / المنطقة</th>
                  <th className="p-4">عدد الطلبات</th>
                  <th className="p-4">إجمالي الإنفاق (IQD)</th>
                  <th className="p-4">الشريحة والتقييم</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <span className="grid size-10 place-items-center rounded-full bg-teal-50 dark:bg-teal-950 font-bold text-teal-700 dark:text-teal-300">
                          {c.name.slice(0, 1)}
                        </span>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{c.name}</p>
                          <p className="text-xs text-slate-500 dir-ltr text-right flex items-center gap-1 mt-0.5">
                            <Phone className="size-3" /> {c.phone}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-xs font-medium text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-1 font-bold">
                        <MapPin className="size-3 text-teal-600" /> {c.city}
                      </div>
                    </td>
                    <td className="p-4 font-mono font-bold text-slate-900 dark:text-white">
                      {c.ordersCount} طلبات
                    </td>
                    <td className="p-4 font-mono font-black text-slate-900 dark:text-white">
                      {formatIQD(c.totalSpent)}
                    </td>
                    <td className="p-4">
                      {getCustomerBadge(c.ordersCount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center space-y-3">
            <Users className="size-10 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-700 dark:text-slate-300">لا يوجد زبائن مطاردين</h3>
            <p className="text-xs text-slate-500">جرب البحث بكلمة أخرى أو إضافة زبون جديد.</p>
          </div>
        )}
      </div>

      {/* ADD CUSTOMER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xl text-right">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">إضافة زبون جديد</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleAddCustomer} className="space-y-3 text-right">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">اسم الزبون *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="علي حسن"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">رقم الهاتف *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+964 770 000 0000"
                    dir="ltr"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">المحافظة *</label>
                  <select
                    value={governorate}
                    onChange={(e) => {
                      setGovernorate(e.target.value);
                      setCity(`${e.target.value}`);
                    }}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-2.5 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
                  >
                    {IRAQ_GOVERNORATES.map((g) => (
                      <option key={g} value={g}>🇮🇶 {g}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">المنطقة / التفاصيل</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="بغداد — المنصور"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">البريد الإلكتروني (اختياري)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="customer@example.com"
                  dir="ltr"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs shadow-md mt-2"
              >
                إضافة الزبون للقاعدة
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
