import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { useUser } from '@clerk/react';
import {
  BarChart3, ShoppingBag, Users, CreditCard, Plus, Truck, ArrowUpRight,
  TrendingUp, Clock, AlertTriangle, ArrowLeft, CheckCircle2, Store,
  Sparkles, ExternalLink, Calendar, Package, RefreshCw, Box, Phone, MapPin
} from 'lucide-react';
import { formatIQD } from '../data/iraqData';
import {
  getStoredOrders, getStoredProducts, getStoredCustomers, updateStoredOrderStatus,
  type StoreOrder, type StoreProduct, type StoreCustomer
} from '../data/storeState';

export function DashboardPage() {
  let merchantName = 'أحمد';
  try {
    const { user } = useUser();
    merchantName = user?.firstName || user?.fullName || 'أحمد';
  } catch {
    merchantName = 'أحمد';
  }

  const [orders, setOrders] = useState<StoreOrder[]>([]);
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [customers, setCustomers] = useState<StoreCustomer[]>([]);

  const loadData = () => {
    setOrders(getStoredOrders());
    setProducts(getStoredProducts());
    setCustomers(getStoredCustomers());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdvanceStatus = (id: number, currentStatus: StoreOrder['status']) => {
    const statusFlow: Record<StoreOrder['status'], StoreOrder['status']> = {
      pending: 'confirmed',
      confirmed: 'processing',
      processing: 'delivered',
      delivered: 'delivered',
      cancelled: 'pending'
    };
    updateStoredOrderStatus(id, statusFlow[currentStatus]);
    loadData();
  };

  // Calculated metrics
  const totalRevenue = orders.reduce((sum, ord) => sum + ord.total, 0);
  const activeProductsCount = products.filter(p => p.status === 'active').length;
  const pendingOrdersCount = orders.filter(o => o.status === 'pending' || o.status === 'processing').length;
  const deliveredOrdersCount = orders.filter(o => o.status === 'delivered').length;

  return (
    <div className="space-y-6 rf-appear">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-900 via-teal-950 to-slate-900 text-white p-6 md:p-8 shadow-md border border-teal-800/50">
        <div className="absolute -left-12 -bottom-12 size-48 rounded-full bg-teal-500/10 blur-2xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold mb-2 border border-teal-500/30">
              <Sparkles className="size-3.5" /> منصة الزعيم — مصر
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              أهلاً بك في الزعيم 👋
            </h1>
            <p className="text-sm text-teal-100/80 mt-1">
              أهلاً بعودتك، <span className="font-bold text-white">{merchantName}</span>. إليك حركة مبيعاتك وشحناتك اليومية الحية.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/shipments/new"
              className="px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5"
            >
              <Plus className="size-4" /> إضافة شحنة
            </Link>
            <Link
              href="/products/new"
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl backdrop-blur-md transition-all flex items-center gap-1.5"
            >
              <Plus className="size-4" /> إضافة منتج
            </Link>
          </div>
        </div>
      </div>

      {/* Main KPI Cards (IQD) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Revenue */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">إجمالي المبيعات (IQD)</span>
            <span className="grid size-9 place-items-center rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-400">
              <CreditCard className="size-5" />
            </span>
          </div>
          <p className="text-2xl font-black tracking-tight text-slate-900 dark:text-white font-mono mt-3">
            {formatIQD(totalRevenue)}
          </p>
          <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 mt-2 font-bold">
            <TrendingUp className="size-3.5" /> <span>+24.8% هذا الشهر</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">إجمالي الطلبات</span>
            <span className="grid size-9 place-items-center rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400">
              <ShoppingBag className="size-5" />
            </span>
          </div>
          <p className="text-2xl font-black tracking-tight text-slate-900 dark:text-white font-mono mt-3">
            {orders.length} طلبات
          </p>
          <div className="flex items-center gap-1 text-xs text-slate-500 mt-2 font-bold">
            <span>{deliveredOrdersCount} تم تسليمها بنجاح</span>
          </div>
        </div>

        {/* Active Products */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">المنتجات النشطة</span>
            <span className="grid size-9 place-items-center rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400">
              <Box className="size-5" />
            </span>
          </div>
          <p className="text-2xl font-black tracking-tight text-slate-900 dark:text-white font-mono mt-3">
            {activeProductsCount} منتجات
          </p>
          <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 mt-2 font-bold">
            <Link href="/products" className="hover:underline flex items-center gap-1">إدارة المنتجات ←</Link>
          </div>
        </div>

        {/* Total Customers */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">قاعدة الزبائن</span>
            <span className="grid size-9 place-items-center rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-400">
              <Users className="size-5" />
            </span>
          </div>
          <p className="text-2xl font-black tracking-tight text-slate-900 dark:text-white font-mono mt-3">
            {customers.length} زبون
          </p>
          <div className="flex items-center gap-1 text-xs text-slate-500 mt-2 font-bold">
            <Link href="/customers" className="hover:underline">عرض الزبائن ←</Link>
          </div>
        </div>
      </div>

      {/* Quick Action Buttons Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link
          href="/orders"
          className="p-4 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
        >
          <Plus className="size-4" /> إدارة الطلبات ({orders.length})
        </Link>
        <Link
          href="/products"
          className="p-4 rounded-2xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
        >
          <Plus className="size-4" /> كتالوج المنتجات ({products.length})
        </Link>
        <Link
          href="/customers"
          className="p-4 rounded-2xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
        >
          <Users className="size-4" /> الزبائن ({customers.length})
        </Link>
        <Link
          href="/shipments/new"
          className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-900 dark:text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all"
        >
          <Truck className="size-4" /> إضافة شحنة جديدة
        </Link>
      </div>

      {/* Recent Orders Section */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h2 className="font-extrabold text-slate-900 dark:text-white text-base">
              أحدث طلبات الشراء
            </h2>
            <p className="text-xs text-slate-500">الطلبات الواردة حديثاً من المتاجر والدفع عند الاستلام.</p>
          </div>
          <Link href="/orders" className="text-xs font-extrabold text-teal-700 dark:text-teal-400 hover:underline">
            عرض كل الطلبات ←
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs font-bold text-slate-500">
              <tr>
                <th className="p-3">رقم الطلب</th>
                <th className="p-3">الزبون</th>
                <th className="p-3">المحافظة</th>
                <th className="p-3">المبلغ</th>
                <th className="p-3">الحالة</th>
                <th className="p-3 text-center">إجراء فوري</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {orders.slice(0, 5).map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="p-3 font-mono font-bold text-teal-700 dark:text-teal-400">{ord.number}</td>
                  <td className="p-3 font-bold text-slate-900 dark:text-white">{ord.customerName}</td>
                  <td className="p-3 text-xs text-slate-600 dark:text-slate-300">{ord.customerCity}</td>
                  <td className="p-3 font-mono font-black text-slate-900 dark:text-white">{formatIQD(ord.total)}</td>
                  <td className="p-3">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      ord.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {ord.status === 'delivered' ? 'تم التسليم' : 'قيد المعالجة'}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleAdvanceStatus(ord.id, ord.status)}
                      className="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950 text-xs font-bold rounded-lg text-slate-700 dark:text-slate-300 hover:text-teal-700 border border-slate-200 dark:border-slate-700"
                    >
                      تحديث الحالة
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
