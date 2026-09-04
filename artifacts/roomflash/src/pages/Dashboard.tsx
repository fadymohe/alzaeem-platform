import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { useUser } from '@clerk/react';
import {
  BarChart3, ShoppingBag, Users, CreditCard, Plus, Truck, ArrowUpRight,
  TrendingUp, Clock, AlertTriangle, ArrowLeft, CheckCircle2, Store,
  Sparkles, ExternalLink, Calendar, Package, RefreshCw, Box, Phone, MapPin,
  Copy, Check, ShieldCheck, Globe, Layers, Zap
} from 'lucide-react';
import { formatIQD } from '../data/iraqData';
import {
  getStoredOrders, getStoredProducts, getStoredCustomers, updateStoredOrderStatus,
  type StoreOrder, type StoreProduct, type StoreCustomer
} from '../data/storeState';

const TEMPLATE_NAMES: Record<string, string> = {
  'shoppingcart.1.2.7': 'سلة التسوق الشاملة (shoppingcart.1.2.7)',
  'volt': 'فولت إكسبريس للتقنية (Volt Tech)',
  'rose': 'روز أتيليه للأزياء والجمال (Rose Atelier)',
  'nitro': 'نيترو سبورت الرياضي (Nitro Sports)',
  'sepia': 'هاير الملكي للساعات والعطور (Royal Sepia)',
  'oret': 'أوريت إكسبريس (Oret Express)',
  'easyorders-flash': 'فلاش لاندينج للشراء الفوري (EasyOrders Flash)',
  'nova': 'نوفا الملكي للأزياء (Nova Royal)',
  'classic': 'كلاسيك الفاخر للعطور (Classic Luxury)',
  'aurit': 'أوريت التقني للإلكترونيات (Aurit Tech)',
  'brick': 'بريك التجاري المتقدم (Brick Commerce)',
};

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

  // Real Store Information Loaded from Onboarding
  const [storeInfo, setStoreInfo] = useState<{
    storeName: string;
    subdomain: string;
    storeCode: string;
    templateId: string;
    logoUrl?: string;
    bannerUrl?: string;
    product?: any;
    freeShipmentsRemaining: number;
  }>({
    storeName: 'متجر الزعيم الذهبي',
    subdomain: 'alzaeem',
    storeCode: 'ZAEEM-882194',
    templateId: 'shoppingcart.1.2.7',
    freeShipmentsRemaining: 5
  });
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const loadStoreInfo = () => {
    try {
      const rawOnb = localStorage.getItem('zaeem_onboarded_store') || localStorage.getItem('zaeem_store_data');
      if (rawOnb) {
        const parsed = JSON.parse(rawOnb);
        const cleanSub = (parsed.subdomain || 'alzaeem')
          .replace('.za3em.shop', '')
          .toLowerCase()
          .trim();
        const code = parsed.storeCode || `ZAEEM-${cleanSub.toUpperCase().slice(0, 4)}-${Math.floor(1000 + Math.random() * 9000)}`;
        setStoreInfo({
          storeName: parsed.storeName || `متجر ${cleanSub}`,
          subdomain: cleanSub,
          storeCode: code,
          templateId: parsed.templateId || parsed.selectedTheme || 'shoppingcart.1.2.7',
          logoUrl: parsed.logoUrl,
          bannerUrl: parsed.bannerUrl,
          product: parsed.product,
          freeShipmentsRemaining: parsed.freeShipmentsRemaining ?? 5
        });
        return;
      }
    } catch {}
  };

  const loadData = () => {
    setOrders(getStoredOrders());
    setProducts(getStoredProducts());
    setCustomers(getStoredCustomers());
  };

  useEffect(() => {
    loadData();
    loadStoreInfo();
  }, []);

  const handleCopyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard?.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

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

  const templateLabel = TEMPLATE_NAMES[storeInfo.templateId] || storeInfo.templateId;
  const liveStoreUrl = `https://${storeInfo.subdomain}.za3em.shop`;
  const internalStorePath = `/#/store/${storeInfo.subdomain}`;

  return (
    <div className="space-y-6 rf-appear">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-900 via-teal-950 to-slate-900 text-white p-6 md:p-8 shadow-md border border-teal-800/50">
        <div className="absolute -left-12 -bottom-12 size-48 rounded-full bg-teal-500/10 blur-2xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold mb-2 border border-teal-500/30">
              <Sparkles className="size-3.5" /> منصة الزعيم — العراق
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              أهلاً بك في الزعيم 👋
            </h1>
            <p className="text-sm text-teal-100/80 mt-1">
              أهلاً بعودتك، <span className="font-bold text-white">{merchantName}</span>. إليك حركة مبيعاتك وشحناتك ومتجرك الإلكتروني المباشر.
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

      {/* 🌟 كارت المتجر الإلكتروني المباشر والرمز التعريفي الفريد */}
      <div className="rounded-3xl border border-teal-500/30 bg-gradient-to-br from-[#0c1322] via-[#0d1628] to-[#0a1a24] text-white p-6 md:p-7 shadow-xl relative overflow-hidden">
        <div className="absolute -top-16 -right-16 size-48 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 size-48 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-5">
          {/* Top Bar: Store Name & Status Badges */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-3">
              <div className="size-12 rounded-2xl bg-teal-500/20 border border-teal-500/40 text-teal-300 grid place-items-center shrink-0 shadow-md shadow-teal-500/20">
                <Store className="size-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl md:text-2xl font-black text-white">
                    {storeInfo.storeName}
                  </h2>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[11px] font-black">
                    <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                    متجرك نشط ومطلق أونلاين
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-1 font-mono dir-ltr">
                  <Globe className="size-3.5 text-teal-400 shrink-0" />
                  <span className="text-teal-300 font-bold">{liveStoreUrl}</span>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleCopyLink(liveStoreUrl)}
                className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedLink ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
                <span>{copiedLink ? 'تم نسخ الرابط' : 'نسخ الرابط'}</span>
              </button>

              <a
                href={internalStorePath}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>معاينة داخلية</span>
                <ExternalLink className="size-3.5" />
              </a>

              <a
                href={liveStoreUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-md shadow-teal-500/20 transition-all cursor-pointer"
              >
                <span>فتح المتجر الحي أونلاين</span>
                <ArrowUpRight className="size-4" />
              </a>
            </div>
          </div>

          {/* Core Info Grid: Store Code & Template & Product */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. Monospace Store Identifier Box */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-teal-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                  <ShieldCheck className="size-3.5 text-teal-400" />
                  الرمز التعريفي الفريد لمتجرك
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyCode(storeInfo.storeCode)}
                  className="text-[11px] font-bold text-teal-400 hover:text-teal-300 flex items-center gap-1 cursor-pointer bg-teal-950/60 px-2 py-0.5 rounded-lg border border-teal-800/60"
                >
                  {copiedCode ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
                  <span>{copiedCode ? 'تم النسخ' : 'نسخ'}</span>
                </button>
              </div>
              <div className="font-mono text-lg md:text-xl font-black text-teal-300 tracking-wider">
                {storeInfo.storeCode}
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                يُستخدم لربط المتجر مع بوابات الدفع وزين كاش وعقود الشحن مع شركة الزعيم.
              </p>
            </div>

            {/* 2. Bound Website Template Box */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                <Layers className="size-3.5 text-blue-400" />
                قالب المتجر المربوط
              </span>
              <div className="text-sm font-extrabold text-white line-clamp-1">
                {templateLabel}
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                تصميم متجاوب بالكامل وسريع التحميل مع سلة شراء مدمجة ودفع عند الاستلام.
              </p>
              <div className="pt-1">
                <Link
                  href="/store"
                  className="text-[11px] font-bold text-blue-400 hover:underline inline-flex items-center gap-1"
                >
                  <span>تغيير أو تخصيص القالب ←</span>
                </Link>
              </div>
            </div>

            {/* 3. Manually Added Product / Catalog Hook */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                <Package className="size-3.5 text-amber-400" />
                المنتج الأساسي في المتجر
              </span>
              <div className="flex items-center gap-2">
                {storeInfo.product?.image || storeInfo.product?.imageUrl ? (
                  <img
                    src={storeInfo.product.image || storeInfo.product.imageUrl}
                    alt={storeInfo.product.name || storeInfo.product.title}
                    className="size-10 rounded-xl object-cover border border-slate-700 shrink-0"
                  />
                ) : (
                  <div className="size-10 rounded-xl bg-slate-800 grid place-items-center text-slate-400 shrink-0">
                    <Box className="size-5" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-white truncate">
                    {storeInfo.product?.name || storeInfo.product?.title || (products[0]?.name || 'منتج المتجر')}
                  </p>
                  <p className="text-xs font-mono font-black text-amber-400">
                    {formatIQD(storeInfo.product?.price || products[0]?.price || 45000)}
                  </p>
                </div>
              </div>
              <div className="pt-1">
                <Link
                  href="/products"
                  className="text-[11px] font-bold text-amber-400 hover:underline inline-flex items-center gap-1"
                >
                  <span>إدارة الكتالوج ({products.length} منتجات) ←</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Logistics Strip */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80 text-xs text-slate-300">
            <div className="flex items-center gap-2 font-bold text-teal-300">
              <Truck className="size-4 text-teal-400 shrink-0" />
              <span>رصيد 5 شحنات مجانية مفعل لمتجرك مع أسطول الزعيم لتوصيل كافة محافظات العراق!</span>
            </div>
            <Link
              href="/shipments/new"
              className="text-xs font-bold text-teal-400 hover:text-teal-300 underline"
            >
              شحن أول طلب الآن ←
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
