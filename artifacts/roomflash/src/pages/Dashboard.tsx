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
  let zaeemUser: any = null;
  try {
    const raw = localStorage.getItem('zaeem_user');
    if (raw) zaeemUser = JSON.parse(raw);
  } catch {}

  let clerkUser: any = null;
  try {
    const { user } = useUser();
    clerkUser = user;
  } catch {}

  const merchantName = zaeemUser?.name || clerkUser?.firstName || clerkUser?.fullName || 'التاجر';

  const [orders, setOrders] = useState<StoreOrder[]>([]);
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [customers, setCustomers] = useState<StoreCustomer[]>([]);
  const [isStoreActive, setIsStoreActive] = useState(true);

  // Real Store Information Loaded from Onboarding / Settings
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
    storeName: 'متجر الزعيم',
    subdomain: 'shop',
    storeCode: 'ZAEEM-882194',
    templateId: 'shoppingcart.1.2.7',
    freeShipmentsRemaining: 5
  });
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const loadStoreInfo = () => {
    try {
      const activeVal = localStorage.getItem('zaeem_store_active');
      setIsStoreActive(activeVal !== 'false');

      const rawOnb = localStorage.getItem('zaeem_onboarded_store') || localStorage.getItem('zaeem_store_data');
      const rawUser = localStorage.getItem('zaeem_user');
      let parsedOnb: any = null;
      let parsedUser: any = null;
      if (rawOnb) {
        try { parsedOnb = JSON.parse(rawOnb); } catch {}
      }
      if (rawUser) {
        try { parsedUser = JSON.parse(rawUser); } catch {}
      }

      const cleanSub = (parsedOnb?.subdomain || parsedUser?.subdomain || 'shop')
        .replace('.za3em.shop', '')
        .replace(/^https?:\/\//, '')
        .toLowerCase()
        .trim();
      const code = parsedOnb?.storeCode || `ZAEEM-${cleanSub.toUpperCase().slice(0, 4)}-${Math.floor(1000 + Math.random() * 9000)}`;

      setStoreInfo({
        storeName: parsedOnb?.storeName || parsedUser?.storeName || `متجر ${cleanSub}`,
        subdomain: cleanSub,
        storeCode: code,
        templateId: parsedOnb?.templateId || parsedOnb?.selectedTheme || 'shoppingcart.1.2.7',
        logoUrl: parsedOnb?.logoUrl,
        bannerUrl: parsedOnb?.bannerUrl,
        product: parsedOnb?.product,
        freeShipmentsRemaining: parsedOnb?.freeShipmentsRemaining ?? 5
      });
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

    const handleUpdate = () => {
      loadStoreInfo();
      loadData();
    };
    window.addEventListener('zaeem_store_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('zaeem_store_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
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
              className="px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5"
            >
              <Plus className="size-4" /> إضافة شحنة جديدة
            </Link>
            <Link
              href="/shipments/new?type=baghdad"
              className="px-3.5 py-2.5 bg-teal-950/70 hover:bg-teal-900 text-teal-200 font-bold text-xs rounded-xl border border-teal-500/40 transition-all flex items-center gap-1.5"
            >
              <span>🚀</span> شحن سريع بغداد (24h)
            </Link>
            <Link
              href="/shipments/new?type=governorates"
              className="px-3.5 py-2.5 bg-teal-950/70 hover:bg-teal-900 text-teal-200 font-bold text-xs rounded-xl border border-teal-500/40 transition-all flex items-center gap-1.5"
            >
              <span>🚚</span> شحن المحافظات
            </Link>
            <Link
              href="/products/new"
              className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl backdrop-blur-md transition-all flex items-center gap-1.5"
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
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black transition-colors ${
                    isStoreActive
                      ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-300'
                      : 'bg-rose-950/80 border border-rose-500/40 text-rose-300'
                  }`}>
                    <span className={`size-2 rounded-full ${isStoreActive ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                    {isStoreActive ? 'متجرك نشط ومطلق أونلاين' : 'المتجر موقوف مؤقتاً (معطل)'}
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
                    {products.length > 0 ? (storeInfo.product?.name || storeInfo.product?.title || products[0]?.name) : 'لم يتم إضافة منتجات بعد'}
                  </p>
                  <p className="text-xs font-mono font-black text-amber-400">
                    {products.length > 0 ? formatIQD(storeInfo.product?.price || products[0]?.price || 0) : '0 د.ع'}
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
          <div className="flex items-center gap-1 text-xs mt-2 font-bold">
            {orders.length === 0 ? (
              <span className="text-slate-400 font-medium">0 د.ع مبيعات فعلية</span>
            ) : (
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <TrendingUp className="size-3.5" />
                <span>{orders.length} طلبات مسجلة</span>
              </span>
            )}
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
            {orders.length}
          </p>
          <div className="flex items-center gap-1 text-xs text-slate-500 mt-2 font-bold">
            {orders.length === 0 ? (
              <span>0 طلبات واردة</span>
            ) : (
              <span>{deliveredOrdersCount} تم تسليمها بنجاح</span>
            )}
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
            {activeProductsCount}
          </p>
          <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 mt-2 font-bold">
            <Link href="/products" className="hover:underline flex items-center gap-1">
              {activeProductsCount === 0 ? 'إضافة منتجات (0) ←' : `إدارة المنتجات (${activeProductsCount}) ←`}
            </Link>
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
            {customers.length}
          </p>
          <div className="flex items-center gap-1 text-xs text-slate-500 mt-2 font-bold">
            <Link href="/customers" className="hover:underline">
              {customers.length === 0 ? '0 زبائن مسجلين' : `عرض الزبائن (${customers.length}) ←`}
            </Link>
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
          className="p-4 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
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
            <p className="text-xs text-slate-500">الطلبات الواردة حديثاً من المتجر الإلكتروني والدفع عند الاستلام.</p>
          </div>
          <Link href="/orders" className="text-xs font-extrabold text-teal-700 dark:text-teal-400 hover:underline">
            عرض كل الطلبات ({orders.length}) ←
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="py-12 px-4 text-center space-y-3 bg-slate-50/50 dark:bg-slate-800/20 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
            <div className="size-12 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 grid place-items-center mx-auto">
              <ShoppingBag className="size-6" />
            </div>
            <h3 className="font-extrabold text-slate-800 dark:text-slate-200 text-base">
              لا توجد طلبات بعد
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              لم تصل أي طلبات شراء بعد إلى متجرك الإلكتروني. شارك رابط متجرك مع الزبائن لبدء استقبال الطلبات وتوليد بوالص الشحن التلقائية.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
              <a
                href={liveStoreUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
              >
                <span>زيارة المتجر وإجراء طلب تجريبي</span>
                <ExternalLink className="size-3.5" />
              </a>
              <Link
                href="/orders"
                className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all"
              >
                إضافة طلب يدوي
              </Link>
            </div>
          </div>
        ) : (
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
                        ord.status === 'delivered' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                      }`}>
                        {ord.status === 'delivered' ? 'تم التسليم' : ord.status === 'confirmed' ? 'مؤكد' : ord.status === 'processing' ? 'جاري التجهيز' : 'قيد الانتظار'}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleAdvanceStatus(ord.id, ord.status)}
                        className="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950 text-xs font-bold rounded-lg text-slate-700 dark:text-slate-300 hover:text-teal-700 border border-slate-200 dark:border-slate-700 cursor-pointer"
                      >
                        تحديث الحالة
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
