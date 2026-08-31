import { useEffect, useRef, useState, type ButtonHTMLAttributes, type FormEvent, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { Link, Redirect, Route, Switch, useLocation, useParams, Router as WouterRouter } from 'wouter';
import { ClerkProvider, SignIn, SignUp, UserButton, useAuth, useClerk, useUser } from '@clerk/react';
import { publishableKeyFromHost } from '@clerk/react/internal';
import { shadcn } from '@clerk/themes';
import {
  Activity, ArrowLeft, ArrowUpLeft, BarChart3, Bell, Box, Check, ChevronDown, CircleHelp,
  Clock3, Copy, CreditCard, ExternalLink, Eye, Globe2, LayoutDashboard, LifeBuoy, Menu,
  Moon, MoreHorizontal, PackagePlus, Pencil, Plus, RefreshCw, Search, Settings2, ShieldCheck,
  ShoppingBag, ShoppingCart, Sparkles, Store as StoreIcon, Sun, Trash2, Truck, Users, X,
} from 'lucide-react';
import {
  getGetCurrentStoreQueryKey, getGetCustomersQueryKey, getGetDashboardSummaryQueryKey,
  getGetOrdersQueryKey, getGetPlansQueryKey, getGetProductsQueryKey, getGetStorefrontQueryKey,
  useCreateProduct, useCreateStore, useDeleteProduct, useGetAdminSummary, useGetCurrentStore,
  useGetCustomers, useGetDashboardSummary, useGetOrders, useGetPlans, useGetProducts,
  useGetStorefront, useUpdateOrder, useUpdateProduct,
} from '@workspace/api-client-react';
import type { Customer, Order, Product, ProductInput, Store } from '@workspace/api-client-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';

const queryClient = new QueryClient();
const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');
const clerkPubKey = publishableKeyFromHost(window.location.hostname, import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath) ? path.slice(basePath.length) || '/' : path;
}

const clerkAppearance = {
  theme: shadcn,
  cssLayerName: 'clerk',
  options: {
    logoPlacement: 'inside' as const,
    logoLinkUrl: basePath || '/',
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
  },
  variables: {
    colorPrimary: '#0f766e',
    colorForeground: '#18323a',
    colorMutedForeground: '#64748b',
    colorDanger: '#dc2626',
    colorBackground: '#fffdf8',
    colorInput: '#fffdf8',
    colorInputForeground: '#18323a',
    colorNeutral: '#d9d3c7',
    fontFamily: "'Noto Kufi Arabic', sans-serif",
    borderRadius: '0.85rem',
  },
  elements: {
    rootBox: 'w-full flex justify-center',
    cardBox: 'bg-[#fffdf8] rounded-[1.7rem] w-[440px] max-w-full overflow-hidden border border-[#d9d3c7]',
    card: '!shadow-none !border-0 !bg-transparent !rounded-none',
    footer: '!shadow-none !border-0 !bg-transparent !rounded-none',
    headerTitle: 'text-[#18323a] font-bold',
    headerSubtitle: 'text-[#64748b]',
    socialButtonsBlockButtonText: 'text-[#18323a] font-semibold',
    formFieldLabel: 'text-[#18323a] font-semibold',
    footerActionLink: 'text-[#0f766e] font-bold',
    footerActionText: 'text-[#64748b]',
    dividerText: 'text-[#64748b]',
    identityPreviewEditButton: 'text-[#0f766e]',
    formFieldSuccessText: 'text-[#15803d]',
    alertText: 'text-[#b91c1c]',
    logoBox: 'mb-3',
    logoImage: 'max-h-10',
    socialButtonsBlockButton: 'border-[#d9d3c7] bg-[#fffdf8] hover:bg-[#f4efe6]',
    formButtonPrimary: 'bg-[#0f766e] hover:bg-[#0b5d57] text-white',
    formFieldInput: 'border-[#d9d3c7] bg-[#fffdf8] text-[#18323a]',
    footerAction: 'border-t border-[#d9d3c7]',
    dividerLine: 'bg-[#d9d3c7]',
    alert: 'border-[#fecaca] bg-[#fef2f2]',
    otpCodeFieldInput: 'border-[#d9d3c7] bg-[#fffdf8]',
    formFieldRow: 'mb-4',
    main: 'gap-5',
  },
};

const navItems = [
  { href: '/dashboard', label: 'نظرة عامة', icon: LayoutDashboard },
  { href: '/products', label: 'المنتجات', icon: Box },
  { href: '/orders', label: 'الطلبات', icon: ShoppingCart },
  { href: '/customers', label: 'العملاء', icon: Users },
  { href: '/store', label: 'متجرك', icon: StoreIcon },
];

function Logo({ inverse = false }: { inverse?: boolean }) {
  return <Link href="/" data-testid="link-logo" className="flex items-center gap-3 group">
    <span className={`grid size-10 place-items-center rounded-xl rotate-3 transition-transform group-hover:rotate-0 ${inverse ? 'bg-[hsl(var(--sidebar-primary))] text-[hsl(var(--sidebar-primary-foreground))]' : 'bg-primary text-primary-foreground'}`}>
      <span className="text-lg font-bold -rotate-3 group-hover:rotate-0 transition-transform">ر</span>
    </span>
    <span className={`text-lg font-bold tracking-tight ${inverse ? 'text-sidebar-foreground' : 'text-foreground'}`}>Room<span className={inverse ? 'text-sidebar-primary' : 'text-primary'}>Flash</span></span>
  </Link>;
}

function Button({ children, variant = 'primary', className = '', ...props }: { children: ReactNode; variant?: 'primary'|'outline'|'ghost'|'danger'; className?: string } & ButtonHTMLAttributes<HTMLButtonElement>) {
  const variants = {
    primary: 'bg-primary text-primary-foreground shadow-sm hover:brightness-95',
    outline: 'border border-border bg-card hover:bg-muted',
    ghost: 'hover:bg-muted text-muted-foreground hover:text-foreground',
    danger: 'bg-destructive text-destructive-foreground hover:brightness-95',
  };
  return <button {...props} className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition-all active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}>{children}</button>;
}

function StatusPill({ status }: { status: string }) {
  const labels: Record<string, string> = { active: 'نشط', draft: 'مسودة', archived: 'مؤرشف', pending: 'قيد المراجعة', confirmed: 'مؤكد', processing: 'قيد التجهيز', delivered: 'تم التوصيل', cancelled: 'ملغي', published: 'منشور', paused: 'متوقف' };
  const tones: Record<string, string> = { active: 'bg-primary/10 text-primary', published: 'bg-primary/10 text-primary', confirmed: 'bg-primary/10 text-primary', delivered: 'bg-primary/10 text-primary', processing: 'bg-accent/15 text-accent-foreground', pending: 'bg-secondary text-secondary-foreground', draft: 'bg-muted text-muted-foreground', archived: 'bg-muted text-muted-foreground', paused: 'bg-accent/15 text-accent-foreground', cancelled: 'bg-destructive/10 text-destructive' };
  return <span data-testid={`status-${status}`} className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${tones[status] ?? tones.draft}`}>{labels[status] ?? status}</span>;
}

function Skeleton({ className = '' }: { className?: string }) { return <div className={`animate-pulse rounded-lg bg-muted ${className}`} />; }
function QueryState({ loading, error, onRetry, children }: { loading: boolean; error: boolean; onRetry: () => void; children: ReactNode }) {
  if (loading) return <div className="grid gap-4 md:grid-cols-3"><Skeleton className="h-28" /><Skeleton className="h-28" /><Skeleton className="h-28" /><Skeleton className="h-72 md:col-span-3" /></div>;
  if (error) return <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center"><Activity className="mx-auto mb-3 size-8 text-destructive" /><h3 className="font-bold">تعذر تحميل البيانات</h3><p className="my-2 text-sm text-muted-foreground">تحقق من الاتصال ثم حاول مرة أخرى.</p><Button variant="outline" onClick={onRetry}><RefreshCw className="size-4" /> إعادة المحاولة</Button></div>;
  return children;
}

function PublicHome() {
  return <main className="min-h-[100dvh] overflow-hidden bg-background">
    <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 md:px-10">
      <Logo />
      <div className="flex items-center gap-2">
        <Link href="/sign-in" data-testid="link-sign-in" className="hidden rounded-xl px-4 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:block">تسجيل الدخول</Link>
        <Link href="/sign-up" data-testid="link-sign-up" className="rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5">افتح متجرك</Link>
      </div>
    </header>
    <section className="rf-grid relative mx-5 mt-4 overflow-hidden rounded-[2rem] border border-border md:mx-10 lg:mx-auto lg:max-w-7xl">
      <div className="absolute -left-24 -top-24 size-72 rounded-full bg-accent/20 blur-3xl" />
      <div className="relative grid min-h-[620px] items-center gap-12 px-7 py-16 md:px-16 lg:grid-cols-[1.05fr_.95fr] lg:gap-16">
        <div className="rf-appear max-w-2xl">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-bold text-primary"><Sparkles className="size-3.5" /> صُمم للتجارة المحلية</div>
          <h1 className="text-5xl font-extrabold leading-[1.16] tracking-[-.06em] text-foreground md:text-7xl">متجرك جاهز.<br /><span className="text-primary">وأنت مسيطر.</span></h1>
          <p className="mt-7 max-w-xl text-base leading-8 text-muted-foreground md:text-lg">RoomFlash هو مركز القيادة الذي يحوّل منتجاتك إلى متجر أنيق، ويجمع طلباتك وعملاءك في مكان واحد — ببساطة تناسب يومك.</p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link href="/sign-up" data-testid="link-hero-sign-up" className="inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/15 transition-all hover:-translate-y-1">ابدأ مجاناً <ArrowLeft className="size-4" /></Link>
            <Link href="/sign-in" data-testid="link-hero-sign-in" className="inline-flex h-12 items-center gap-2 rounded-xl border border-border bg-card px-6 text-sm font-bold transition-colors hover:bg-muted">لدي حساب بالفعل</Link>
          </div>
          <p className="mt-5 text-xs text-muted-foreground">بدون بطاقة بنكية · أول 20 طلباً مجاناً</p>
        </div>
        <div className="rf-appear rf-delay-1 relative mx-auto w-full max-w-[460px]">
          <div className="absolute -inset-5 rounded-[2.5rem] bg-primary/10 blur-2xl" />
          <div className="relative overflow-hidden rounded-[1.7rem] border border-border bg-card shadow-2xl shadow-primary/10">
            <div className="flex items-center justify-between border-b border-border px-5 py-4"><div className="flex gap-1.5"><i className="size-2 rounded-full bg-destructive/50" /><i className="size-2 rounded-full bg-accent" /><i className="size-2 rounded-full bg-primary" /></div><span className="font-mono text-[10px] text-muted-foreground">roomflash / dashboard</span></div>
            <div className="p-5">
              <div className="mb-6 flex items-center justify-between"><div><p className="text-[11px] text-muted-foreground">صباح الخير، سارة</p><h3 className="mt-1 text-lg font-bold">لمحة اليوم</h3></div><span className="grid size-9 place-items-center rounded-full bg-accent/15 text-accent-foreground"><Bell className="size-4" /></span></div>
              <div className="grid grid-cols-2 gap-3"><div className="rounded-xl bg-primary p-4 text-primary-foreground"><p className="text-[10px] opacity-70">مبيعات الشهر</p><p className="mt-2 font-mono text-2xl font-bold">١٢,٤٨٠</p><p className="mt-1 text-[10px] text-primary-foreground/70">ج.م +١٨.٢٪</p></div><div className="rounded-xl bg-secondary p-4"><p className="text-[10px] text-muted-foreground">طلبات جديدة</p><p className="mt-2 font-mono text-2xl font-bold text-secondary-foreground">٤٧</p><p className="mt-1 text-[10px] text-muted-foreground">هذا الشهر</p></div></div>
              <div className="mt-3 rounded-xl border border-border p-4"><div className="mb-5 flex justify-between"><span className="text-xs font-bold">حركة المبيعات</span><span className="text-[10px] text-primary">آخر ٧ أيام</span></div><div className="flex h-24 items-end gap-2">{[38,53,44,70,58,83,96].map((h, i) => <div key={i} className={`flex-1 rounded-t-md ${i === 6 ? 'bg-accent' : 'bg-primary/20'}`} style={{ height: `${h}%` }} />)}</div></div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section className="mx-auto max-w-7xl px-5 py-24 md:px-10"><div className="max-w-xl"><p className="text-xs font-bold uppercase tracking-[.2em] text-accent-foreground">كل ما تحتاجه، بلا زحمة</p><h2 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">ركّز على البيع.<br />نحن نرتّب الباقي.</h2></div><div className="mt-14 grid gap-4 md:grid-cols-3"><Feature icon={ShoppingBag} number="01" title="متجر يليق بمنتجك" text="صفحة متجر سريعة وواضحة، مصممة لتناسب ذوق عملائك في كل مدينة." /><Feature icon={Truck} number="02" title="كل طلب في مكانه" text="تابع الطلب من أول نقرة حتى التوصيل، بمعلومات واضحة لا تضيع وقتك." /><Feature icon={BarChart3} number="03" title="قرارات على أرض الواقع" text="اعرف ما يُباع، وما يحتاج إعادة تخزين، وما يجعل عملاءك يعودون." /></div></section>
    <footer className="border-t border-border"><div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between md:px-10"><Logo /><span>صُنع للتجار في مصر والعراق</span></div></footer>
  </main>;
}

function Feature({ icon: Icon, number, title, text }: { icon: typeof Box; number: string; title: string; text: string }) {
  return <div className="group rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"><div className="flex items-center justify-between"><span className="font-mono text-xs text-muted-foreground">{number}</span><span className="grid size-10 place-items-center rounded-xl bg-secondary text-secondary-foreground"><Icon className="size-5" /></span></div><h3 className="mt-10 text-lg font-bold">{title}</h3><p className="mt-3 text-sm leading-7 text-muted-foreground">{text}</p></div>;
}

function AuthPage({ mode }: { mode: 'in' | 'up' }) {
  return (
    <main className="rf-grid flex min-h-[100dvh] items-center justify-center bg-background p-5">
      {mode === 'in' ? (
        <SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} />
      ) : (
        <SignUp routing="path" path={`${basePath}/sign-up`} signInUrl={`${basePath}/sign-in`} />
      )}
    </main>
  );
}

function Shell({ children }: { children: ReactNode }) {
  const [location, setLocation] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(() => localStorage.getItem('roomflash-theme') === 'dark');
  const { data: store } = useGetCurrentStore();
  const { user } = useUser();
  useEffect(() => { document.documentElement.classList.toggle('dark', dark); localStorage.setItem('roomflash-theme', dark ? 'dark' : 'light'); }, [dark]);
  return <div className="min-h-[100dvh] bg-background"><aside className={`fixed inset-y-0 right-0 z-40 w-72 bg-sidebar px-4 py-6 text-sidebar-foreground transition-transform lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`}><div className="flex items-center justify-between px-3"><Logo inverse /><button data-testid="button-close-menu" onClick={() => setMobileOpen(false)} className="rounded-lg p-2 text-sidebar-foreground/60 hover:bg-sidebar-accent lg:hidden"><X className="size-5" /></button></div><div className="mt-10 rounded-2xl border border-sidebar-border bg-sidebar-accent/70 p-3"><p className="text-[10px] text-sidebar-foreground/55">متجرك الحالي</p><div className="mt-2 flex items-center gap-2"><span className="grid size-8 place-items-center rounded-lg bg-sidebar-primary/15 text-sidebar-primary"><StoreIcon className="size-4" /></span><div className="min-w-0"><p data-testid="text-store-name" className="truncate text-sm font-bold">{store?.name ?? 'مساحتك التجارية'}</p><p className="truncate font-mono text-[10px] text-sidebar-foreground/55">{store?.subdomain ? `${store.subdomain}.roomflash.co` : 'لم تنشئ متجرك بعد'}</p></div></div></div><nav className="mt-8 space-y-1">{navItems.map(({ href, label, icon: Icon }) => <Link key={href} href={href} onClick={() => setMobileOpen(false)} data-testid={`link-nav-${href.slice(1)}`} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-colors ${location === href ? 'bg-sidebar-primary text-sidebar-primary-foreground' : 'text-sidebar-foreground/65 hover:bg-sidebar-accent hover:text-sidebar-foreground'}`}><Icon className="size-[18px]" />{label}</Link>)}</nav><div className="mt-6 border-t border-sidebar-border pt-6"><Link href="/settings" data-testid="link-nav-settings" className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold ${location === '/settings' ? 'bg-sidebar-accent text-sidebar-foreground' : 'text-sidebar-foreground/65 hover:bg-sidebar-accent hover:text-sidebar-foreground'}`}><Settings2 className="size-[18px]" />الإعدادات</Link><Link href="/admin" data-testid="link-nav-admin" className="mt-1 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-sidebar-foreground/65 hover:bg-sidebar-accent hover:text-sidebar-foreground"><ShieldCheck className="size-[18px]" />إدارة المنصة</Link></div><div className="absolute bottom-6 left-4 right-4"><div className="flex items-center justify-between rounded-xl border border-sidebar-border px-3 py-2.5"><span className="text-xs text-sidebar-foreground/65">الوضع الداكن</span><button data-testid="button-toggle-theme" onClick={() => setDark(!dark)} className={`relative h-6 w-11 rounded-full transition-colors ${dark ? 'bg-sidebar-primary' : 'bg-sidebar-accent'}`}><span className={`absolute top-1 size-4 rounded-full bg-sidebar-foreground transition-transform ${dark ? 'translate-x-[-22px]' : 'translate-x-[-4px]'}`} /></button></div></div></aside><div className="lg:mr-72"><header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-border bg-background/90 px-5 backdrop-blur-md md:px-8"><button data-testid="button-open-menu" onClick={() => setMobileOpen(true)} className="rounded-xl border border-border p-2.5 lg:hidden"><Menu className="size-5" /></button><div className="hidden text-sm text-muted-foreground lg:block">{store?.name ? <span>مساحة عمل <b className="text-foreground">{store.name}</b></span> : 'أهلاً بك في RoomFlash'}</div><div className="mr-auto flex items-center gap-2 lg:mr-0"><button data-testid="button-language" className="hidden rounded-xl border border-border px-3 py-2 text-xs font-bold md:block">EN</button><button data-testid="button-notifications" className="rounded-xl border border-border p-2.5 text-muted-foreground hover:text-foreground"><Bell className="size-4" /></button><div className="mr-1 flex items-center gap-2 border-r border-border pr-3"><span className="grid size-9 place-items-center rounded-full bg-secondary text-sm font-bold text-secondary-foreground">{(user?.firstName ?? user?.emailAddresses[0]?.emailAddress ?? 'س').slice(0, 1)}</span><span className="hidden max-w-32 truncate text-sm font-bold md:block">{user?.firstName ?? user?.emailAddresses[0]?.emailAddress ?? 'حسابك'}</span><UserButton appearance={{ elements: { userButtonAvatarBox: 'size-9' } }} /></div></div></header><main className="mx-auto max-w-[1500px] p-5 md:p-8">{children}</main></div></div>;
}

function PageHeader({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: ReactNode }) { return <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><div><p className="mb-2 text-xs font-bold tracking-[.12em] text-primary">{eyebrow ?? 'ROOMFLASH'}</p><h1 data-testid="text-page-title" className="text-3xl font-extrabold tracking-tight">{title}</h1>{description && <p className="mt-2 text-sm text-muted-foreground">{description}</p>}</div>{action}</div>; }

function Dashboard() {
  const query = useGetDashboardSummary();
  const summary = query.data;
  const fmt = (v: number) => new Intl.NumberFormat('ar-EG', { maximumFractionDigits: 0 }).format(v);
  return <><PageHeader eyebrow="الثلاثاء، 12 مارس 2024" title="نظرة اليوم" description="كل ما يتحرك في متجرك، في لمحة واحدة." action={<Link href="/products/new" data-testid="link-dashboard-add-product"><Button><Plus className="size-4" /> إضافة منتج</Button></Link>} /><QueryState loading={query.isLoading} error={query.isError} onRetry={() => query.refetch()}>{summary && <div className="space-y-5 rf-appear"><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Metric title="إجمالي المبيعات" value={`${fmt(summary.revenue)} ج.م`} change={summary.revenueChange !== null ? `${summary.revenueChange > 0 ? '+' : ''}${summary.revenueChange}%` : '—'} icon={BarChart3} accent /><Metric title="الطلبات" value={fmt(summary.orders)} change={`${summary.freeOrdersRemaining} متبقية`} icon={ShoppingCart} /><Metric title="العملاء" value={fmt(summary.customers)} change="إجمالي العملاء" icon={Users} /><Metric title="متوسط الطلب" value={`${fmt(summary.averageOrderValue)} ج.م`} change="لكل طلب" icon={CreditCard} /></div><div className="grid gap-5 xl:grid-cols-[1.45fr_1fr]"><section className="rounded-2xl border border-border bg-card p-5"><div className="mb-6 flex items-start justify-between"><div><h2 className="font-bold">آخر الطلبات</h2><p className="mt-1 text-xs text-muted-foreground">آخر ما وصل إلى متجرك</p></div><Link href="/orders" data-testid="link-dashboard-orders" className="text-xs font-bold text-primary">عرض الكل</Link></div>{summary.latestOrders?.length ? <div className="space-y-1">{summary.latestOrders.slice(0, 5).map((order) => <OrderRow key={order.id} order={order} />)}</div> : <EmptyState icon={ShoppingCart} title="لا توجد طلبات بعد" text="عندما يطلب أحدهم، ستجد الطلب هنا." action="استعرض متجرك" href="/store" />}</section><section className="rounded-2xl border border-border bg-card p-5"><div className="flex items-start justify-between"><div><h2 className="font-bold">صحة المتجر</h2><p className="mt-1 text-xs text-muted-foreground">نقاط تستحق انتباهك</p></div><Activity className="size-5 text-primary" /></div><div className="mt-7 space-y-6"><HealthItem label="الطلبات المجانية" value={`${summary.freeOrdersRemaining} / ${summary.orderLimit}`} percent={Math.min(100, (summary.freeOrdersRemaining / Math.max(summary.orderLimit, 1)) * 100)} tone="primary" /><HealthItem label="منتجات مخزونها منخفض" value={String(summary.lowStockCount)} percent={Math.min(100, summary.lowStockCount * 15)} tone="accent" /></div><Link href="/products" data-testid="link-dashboard-products" className="mt-8 flex items-center justify-center gap-2 rounded-xl bg-muted py-3 text-xs font-bold hover:bg-secondary">إدارة المنتجات <ArrowLeft className="size-3" /></Link></section></div></div>}</QueryState></>;
}
function Metric({ title, value, change, icon: Icon, accent = false }: { title: string; value: string; change: string; icon: typeof Box; accent?: boolean }) { return <div className={`rounded-2xl border border-border p-5 ${accent ? 'bg-primary text-primary-foreground' : 'bg-card'}`}><div className="flex items-start justify-between"><span className={`grid size-9 place-items-center rounded-xl ${accent ? 'bg-primary-foreground/15' : 'bg-secondary text-secondary-foreground'}`}><Icon className="size-4" /></span><ArrowUpLeft className={`size-4 ${accent ? 'text-primary-foreground/60' : 'text-primary'}`} /></div><p className={`mt-5 text-xs ${accent ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{title}</p><p data-testid={`metric-${title}`} className="mt-1 text-2xl font-extrabold tracking-tight">{value}</p><p className={`mt-2 text-[11px] font-bold ${accent ? 'text-accent' : 'text-primary'}`}>{change}</p></div>; }
function HealthItem({ label, value, percent, tone }: { label: string; value: string; percent: number; tone: 'primary'|'accent' }) { return <div><div className="mb-2 flex justify-between text-xs"><span className="font-semibold">{label}</span><span className="font-mono text-muted-foreground">{value}</span></div><div className="h-2 overflow-hidden rounded-full bg-muted"><div className={`h-full rounded-full ${tone === 'primary' ? 'bg-primary' : 'bg-accent'}`} style={{ width: `${percent}%` }} /></div></div>; }
function OrderRow({ order, onStatus }: { order: Order; onStatus?: (id: number, status: string) => void }) { return <div className="flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-muted"><span className="grid size-9 shrink-0 place-items-center rounded-lg bg-secondary text-secondary-foreground"><ShoppingBag className="size-4" /></span><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><p className="font-mono text-xs font-bold">{order.number}</p><StatusPill status={order.status} /></div><p className="mt-1 truncate text-xs text-muted-foreground">{order.customerName} · {order.customerCity}</p></div><div className="text-left"><p className="font-mono text-xs font-bold">{order.total.toLocaleString('ar-EG')} ج.م</p><p className="mt-1 text-[10px] text-muted-foreground">{new Date(order.createdAt).toLocaleDateString('ar-EG')}</p></div>{onStatus && order.status === 'pending' && <button data-testid={`button-confirm-order-${order.id}`} onClick={() => onStatus(order.id, 'confirmed')} className="rounded-lg p-2 text-primary hover:bg-primary/10"><Check className="size-4" /></button>}</div>; }

function EmptyState({ icon: Icon, title, text, action, href }: { icon: typeof Box; title: string; text: string; action?: string; href?: string }) { return <div className="flex flex-col items-center justify-center py-14 text-center"><span className="grid size-14 place-items-center rounded-2xl bg-secondary text-secondary-foreground"><Icon className="size-6" /></span><h3 className="mt-5 font-bold">{title}</h3><p className="mt-2 max-w-xs text-sm leading-6 text-muted-foreground">{text}</p>{action && href && <Link href={href} data-testid={`link-empty-${href.slice(1)}`} className="mt-5 text-sm font-bold text-primary">{action} <ArrowLeft className="mr-1 inline size-3" /></Link>}</div>; }

function ProductEditor() {
  const params = useParams<{ id?: string }>();
  const [, setLocation] = useLocation();
  const products = useGetProducts();
  const create = useCreateProduct();
  const update = useUpdateProduct();
  const item = products.data?.find((p) => p.id === Number(params.id));
  const [form, setForm] = useState({ name: '', sku: '', description: '', price: '', compareAtPrice: '', stock: '', lowStockThreshold: '5', category: 'عام', status: 'active', imageUrl: '', weightGrams: '0' });
  useEffect(() => { if (item) setForm({ name: item.name, sku: item.sku, description: item.description, price: String(item.price), compareAtPrice: item.compareAtPrice ? String(item.compareAtPrice) : '', stock: String(item.stock), lowStockThreshold: String(item.lowStockThreshold), category: item.category, status: item.status === 'archived' ? 'draft' : item.status, imageUrl: item.imageUrl ?? '', weightGrams: String(item.weightGrams) }); }, [item]);
  const change = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));
  const submit = (e: FormEvent) => { e.preventDefault(); const data: ProductInput = { name: form.name, sku: form.sku, description: form.description, price: Number(form.price), compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : null, stock: Number(form.stock), lowStockThreshold: Number(form.lowStockThreshold), category: form.category, status: form.status as 'active'|'draft', imageUrl: form.imageUrl || null, weightGrams: Number(form.weightGrams) }; const done = () => { queryClient.invalidateQueries({ queryKey: getGetProductsQueryKey() }); setLocation('/products'); }; if (item) update.mutate({ id: item.id, data }, { onSuccess: done }); else create.mutate({ data }, { onSuccess: done }); };
  return <div className="mx-auto max-w-3xl rf-appear"><PageHeader eyebrow="المنتجات" title={item ? 'تعديل المنتج' : 'إضافة منتج جديد'} description="أضف التفاصيل التي يحتاجها العميل لاتخاذ قرار الشراء." action={<Link href="/products" data-testid="link-product-editor-back"><Button variant="ghost"><ArrowLeft className="size-4" /> العودة</Button></Link>} /><form onSubmit={submit} className="rounded-2xl border border-border bg-card p-5 md:p-8"><div className="grid gap-5 md:grid-cols-2"><Field label="اسم المنتج" value={form.name} onChange={(v) => change('name', v)} required testId="input-product-name" /><Field label="رمز المنتج SKU" value={form.sku} onChange={(v) => change('sku', v)} required testId="input-product-sku" disabled={!!item} /><Field label="السعر (ج.م)" type="number" value={form.price} onChange={(v) => change('price', v)} required testId="input-product-price" /><Field label="السعر قبل الخصم" type="number" value={form.compareAtPrice} onChange={(v) => change('compareAtPrice', v)} testId="input-product-compare-price" /><Field label="المخزون" type="number" value={form.stock} onChange={(v) => change('stock', v)} required testId="input-product-stock" /><Field label="حد التنبيه بالمخزون" type="number" value={form.lowStockThreshold} onChange={(v) => change('lowStockThreshold', v)} required testId="input-product-threshold" /><Field label="التصنيف" value={form.category} onChange={(v) => change('category', v)} required testId="input-product-category" /><Field label="رابط الصورة (اختياري)" value={form.imageUrl} onChange={(v) => change('imageUrl', v)} testId="input-product-image" /></div><label className="mt-5 block text-sm font-semibold">الوصف<textarea value={form.description} onChange={(e) => change('description', e.target.value)} data-testid="input-product-description" className="mt-2 min-h-28 w-full rounded-xl border border-input bg-background p-3 text-sm outline-none focus:border-primary" placeholder="صف المنتج بلغة واضحة..." /></label><div className="mt-5 flex flex-col gap-4 border-t border-border pt-5 md:flex-row md:items-center md:justify-between"><label className="flex items-center gap-3 text-sm font-semibold">حالة المنتج<select value={form.status} onChange={(e) => change('status', e.target.value)} data-testid="select-product-status" className="h-10 rounded-xl border border-input bg-background px-3 text-sm"><option value="active">نشط</option><option value="draft">مسودة</option></select></label><Button data-testid="button-save-product" disabled={create.isPending || update.isPending}>{create.isPending || update.isPending ? 'جارٍ الحفظ...' : 'حفظ المنتج'}</Button></div></form></div>;
}
function Field({ label, value, onChange, type = 'text', required = false, testId, disabled = false }: { label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean; testId: string; disabled?: boolean }) { return <label className="block text-sm font-semibold">{label}<input required={required} disabled={disabled} type={type} value={value} onChange={(e) => onChange(e.target.value)} data-testid={testId} className="mt-2 h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:opacity-60" /></label>; }

function Products() {
  const [search, setSearch] = useState(''); const [status, setStatus] = useState('all');
  const query = useGetProducts({ search: search || undefined, status: status as 'all'|'active'|'draft'|'archived' });
  const remove = useDeleteProduct();
  const products = query.data ?? [];
  const deleteItem = (id: number) => { if (window.confirm('هل تريد أرشفة هذا المنتج؟')) remove.mutate({ id }, { onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetProductsQueryKey() }) }); };
  return <><PageHeader eyebrow="كتالوج المتجر" title="المنتجات" description="رتّب ما تبيعه، وتابع مخزونك من مكان واحد." action={<Link href="/products/new" data-testid="link-add-product"><Button><Plus className="size-4" /> إضافة منتج</Button></Link>} /><div className="mb-5 flex flex-col gap-3 md:flex-row"><label className="relative flex-1"><Search className="absolute right-3 top-3 size-4 text-muted-foreground" /><input value={search} onChange={(e) => setSearch(e.target.value)} data-testid="input-search-products" className="h-11 w-full rounded-xl border border-input bg-card pr-10 pl-4 text-sm outline-none focus:border-primary" placeholder="ابحث بالاسم أو رمز المنتج..." /></label><select value={status} onChange={(e) => setStatus(e.target.value)} data-testid="select-products-status" className="h-11 rounded-xl border border-input bg-card px-4 text-sm"><option value="all">كل الحالات</option><option value="active">نشطة</option><option value="draft">مسودة</option><option value="archived">مؤرشفة</option></select></div><QueryState loading={query.isLoading} error={query.isError} onRetry={() => query.refetch()}><div className="overflow-hidden rounded-2xl border border-border bg-card">{products.length ? <div className="overflow-x-auto"><table className="w-full min-w-[720px] text-right text-sm"><thead className="border-b border-border bg-muted/50 text-xs text-muted-foreground"><tr><th className="px-5 py-4 font-semibold">المنتج</th><th className="px-5 py-4 font-semibold">التصنيف</th><th className="px-5 py-4 font-semibold">السعر</th><th className="px-5 py-4 font-semibold">المخزون</th><th className="px-5 py-4 font-semibold">الحالة</th><th className="px-5 py-4" /></tr></thead><tbody>{products.map((p) => <tr key={p.id} data-testid={`row-product-${p.id}`} className="border-b border-border last:border-0 hover:bg-muted/30"><td className="px-5 py-4"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-lg bg-secondary text-secondary-foreground"><Box className="size-4" /></span><div><p className="font-bold">{p.name}</p><p className="font-mono text-[10px] text-muted-foreground">{p.sku}</p></div></div></td><td className="px-5 py-4 text-muted-foreground">{p.category}</td><td className="px-5 py-4 font-mono font-bold">{p.price.toLocaleString('ar-EG')} ج.م</td><td className={`px-5 py-4 font-mono ${p.stock <= p.lowStockThreshold ? 'font-bold text-accent-foreground' : ''}`}>{p.stock}{p.stock <= p.lowStockThreshold && <span className="mr-2 text-[10px]">منخفض</span>}</td><td className="px-5 py-4"><StatusPill status={p.status} /></td><td className="px-5 py-4"><div className="flex justify-end gap-1"><Link href={`/products/${p.id}`} data-testid={`link-edit-product-${p.id}`} className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"><Pencil className="size-4" /></Link><button data-testid={`button-delete-product-${p.id}`} onClick={() => deleteItem(p.id)} className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><Trash2 className="size-4" /></button></div></td></tr>)}</tbody></table></div> : <EmptyState icon={Box} title="كتالوجك فارغ" text="أضف أول منتج ليظهر في متجرك ويبدأ عملاؤك بالتسوق." action="إضافة أول منتج" href="/products/new" />}</div></QueryState></>;
}

function Orders() {
  const [search, setSearch] = useState(''); const [status, setStatus] = useState('all');
  const query = useGetOrders({ search: search || undefined, status: status as 'all'|'pending'|'confirmed'|'processing'|'delivered'|'cancelled' });
  const update = useUpdateOrder();
  const advance = (id: number, next: string) => update.mutate({ id, data: { status: next as 'pending'|'confirmed'|'processing'|'delivered'|'cancelled' } }, { onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetOrdersQueryKey() }) });
  return <><PageHeader eyebrow="عمليات المتجر" title="الطلبات" description="تابع كل طلب حتى يصل إلى صاحبه." action={<Button variant="outline" onClick={() => query.refetch()}><RefreshCw className="size-4" /> تحديث</Button>} /><div className="mb-5 flex flex-col gap-3 md:flex-row"><label className="relative flex-1"><Search className="absolute right-3 top-3 size-4 text-muted-foreground" /><input value={search} onChange={(e) => setSearch(e.target.value)} data-testid="input-search-orders" className="h-11 w-full rounded-xl border border-input bg-card pr-10 pl-4 text-sm outline-none focus:border-primary" placeholder="ابحث برقم الطلب أو اسم العميل..." /></label><select value={status} onChange={(e) => setStatus(e.target.value)} data-testid="select-orders-status" className="h-11 rounded-xl border border-input bg-card px-4 text-sm"><option value="all">كل الطلبات</option><option value="pending">قيد المراجعة</option><option value="confirmed">مؤكدة</option><option value="processing">قيد التجهيز</option><option value="delivered">تم التوصيل</option><option value="cancelled">ملغاة</option></select></div><QueryState loading={query.isLoading} error={query.isError} onRetry={() => query.refetch()}><div className="overflow-hidden rounded-2xl border border-border bg-card">{query.data?.length ? <div className="divide-y divide-border">{query.data.map((o) => <div key={o.id} className="flex flex-col gap-4 p-5 transition-colors hover:bg-muted/30 md:flex-row md:items-center"><div className="flex flex-1 items-center gap-3"><span className="grid size-11 place-items-center rounded-xl bg-secondary text-secondary-foreground"><ShoppingCart className="size-5" /></span><div><p className="font-mono text-sm font-bold">{o.number}</p><p className="mt-1 text-xs text-muted-foreground">{o.customerName} · {o.customerPhone}</p></div></div><div className="flex flex-1 items-center justify-between gap-5 md:justify-end"><div><p className="font-bold">{o.total.toLocaleString('ar-EG')} ج.م</p><p className="mt-1 text-[11px] text-muted-foreground">{o.itemsCount} منتجات · {o.customerCity}</p></div><StatusPill status={o.status} /><select value={o.status} onChange={(e) => advance(o.id, e.target.value)} data-testid={`select-order-status-${o.id}`} className="h-9 rounded-lg border border-input bg-background px-2 text-xs"><option value="pending">قيد المراجعة</option><option value="confirmed">مؤكد</option><option value="processing">قيد التجهيز</option><option value="delivered">تم التوصيل</option><option value="cancelled">ملغي</option></select></div></div>)}</div> : <EmptyState icon={ShoppingCart} title="لا توجد طلبات" text="ستظهر هنا طلبات عملائك فور وصولها إلى متجرك." action="عرض المتجر" href="/store" />}</div></QueryState></>;
}

function Customers() { const [search, setSearch] = useState(''); const query = useGetCustomers({ search: search || undefined }); const customers = query.data ?? []; return <><PageHeader eyebrow="علاقات العملاء" title="العملاء" description="قائمة واضحة بمن يختارون متجرك." /><label className="relative mb-5 block max-w-xl"><Search className="absolute right-3 top-3 size-4 text-muted-foreground" /><input value={search} onChange={(e) => setSearch(e.target.value)} data-testid="input-search-customers" className="h-11 w-full rounded-xl border border-input bg-card pr-10 pl-4 text-sm outline-none focus:border-primary" placeholder="ابحث بالاسم أو الهاتف..." /></label><QueryState loading={query.isLoading} error={query.isError} onRetry={() => query.refetch()}><div className="overflow-hidden rounded-2xl border border-border bg-card">{customers.length ? <div className="overflow-x-auto"><table className="w-full min-w-[650px] text-right text-sm"><thead className="border-b border-border bg-muted/50 text-xs text-muted-foreground"><tr><th className="px-5 py-4">العميل</th><th className="px-5 py-4">المدينة</th><th className="px-5 py-4">الطلبات</th><th className="px-5 py-4">إجمالي الإنفاق</th><th className="px-5 py-4">الشريحة</th><th className="px-5 py-4">آخر طلب</th></tr></thead><tbody>{customers.map((c) => <CustomerRow key={c.id} customer={c} />)}</tbody></table></div> : <EmptyState icon={Users} title="لا يوجد عملاء بعد" text="عملاؤك الأوائل سيظهرون هنا بعد أول طلب." />}</div></QueryState></>; }
function CustomerRow({ customer: c }: { customer: Customer }) { return <tr data-testid={`row-customer-${c.id}`} className="border-b border-border last:border-0 hover:bg-muted/30"><td className="px-5 py-4"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-full bg-primary/10 text-sm font-bold text-primary">{c.name.slice(0, 1)}</span><div><p className="font-bold">{c.name}</p><p className="mt-1 text-xs text-muted-foreground">{c.phone}</p></div></div></td><td className="px-5 py-4 text-muted-foreground">{c.city}</td><td className="px-5 py-4 font-mono">{c.ordersCount}</td><td className="px-5 py-4 font-mono font-bold">{c.totalSpent.toLocaleString('ar-EG')} ج.م</td><td className="px-5 py-4"><StatusPill status={c.segment === 'vip' ? 'active' : c.segment === 'returning' ? 'confirmed' : c.segment === 'inactive' ? 'paused' : 'draft'} /></td><td className="px-5 py-4 text-xs text-muted-foreground">{c.lastOrderAt ? new Date(c.lastOrderAt).toLocaleDateString('ar-EG') : '—'}</td></tr>; }

function StorePage() {
  const storeQuery = useGetCurrentStore();
  const store = storeQuery.data;
  const storefront = useGetStorefront(store?.subdomain ?? '', { query: { enabled: !!store?.subdomain, queryKey: getGetStorefrontQueryKey(store?.subdomain ?? '') } });
  return (
    <>
      <PageHeader
        eyebrow="واجهة متجرك"
        title="المتجر"
        description="شاهد ما يراه عملاؤك وشارك رابطك."
        action={store?.subdomain ? (
          <Button variant="outline" onClick={() => navigator.clipboard?.writeText(`${store.subdomain}.roomflash.co`)}>
            <Copy className="size-4" /> نسخ الرابط
          </Button>
        ) : undefined}
      />
      <QueryState
        loading={storeQuery.isLoading || storefront.isLoading}
        error={storeQuery.isError || storefront.isError}
        onRetry={() => { storeQuery.refetch(); storefront.refetch(); }}
      >
        {store && storefront.data ? (
          <div className="grid gap-5 lg:grid-cols-[1fr_1.1fr]">
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">الرابط العام</p>
                  <p className="mt-2 font-mono text-sm font-bold text-primary">{store.subdomain}.roomflash.co</p>
                </div>
                <StatusPill status={store.status} />
              </div>
              <div className="mt-8 rounded-2xl bg-secondary p-6">
                <StoreIcon className="size-8 text-secondary-foreground" />
                <h2 className="mt-5 text-2xl font-bold">{store.name}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{store.category} · {store.country === 'Egypt' ? 'مصر' : 'العراق'}</p>
              </div>
              <div className="mt-6 flex gap-3">
                <Button className="flex-1" onClick={() => window.open(`https://${store.subdomain}.roomflash.co`, '_blank')}>
                  <ExternalLink className="size-4" /> فتح المتجر
                </Button>
                <Button variant="outline" className="flex-1"><Pencil className="size-4" /> تخصيص</Button>
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="font-bold">منتجات ظاهرة للعملاء</h2>
                <span className="font-mono text-xs text-muted-foreground">{storefront.data.products.length}</span>
              </div>
              {storefront.data.products.length ? (
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                  {storefront.data.products.slice(0, 6).map((p) => (
                    <div key={p.id} data-testid={`card-store-product-${p.id}`} className="rounded-xl border border-border p-3">
                      <div className="grid aspect-square place-items-center rounded-lg bg-muted text-muted-foreground"><ShoppingBag className="size-6" /></div>
                      <p className="mt-3 truncate text-xs font-bold">{p.name}</p>
                      <p className="mt-1 font-mono text-xs text-primary">{p.price.toLocaleString('ar-EG')} ج.م</p>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState icon={ShoppingBag} title="متجرك ينتظر أول منتج" text="أضف منتجات نشطة لتظهر هنا." action="إضافة منتج" href="/products/new" />
              )}
            </div>
          </div>
        ) : (
          <EmptyState icon={StoreIcon} title="لم تنشئ متجرك بعد" text="ابدأ من الإعدادات لتجهيز مساحة البيع الخاصة بك." action="تجهيز المتجر" href="/settings" />
        )}
      </QueryState>
    </>
  );
}

function Settings() {
  const storeQuery = useGetCurrentStore(); const create = useCreateStore();
  const [form, setForm] = useState({ name: '', subdomain: '', category: 'أزياء', country: 'Egypt', theme: 'sand' });
  const [saved, setSaved] = useState(false); const store = storeQuery.data;
  useEffect(() => { if (store) setForm({ name: store.name, subdomain: store.subdomain, category: store.category, country: store.country, theme: store.theme }); }, [store]);
  const save = (e: FormEvent) => { e.preventDefault(); if (store) { setSaved(true); return; } create.mutate({ data: form as never }, { onSuccess: () => { setSaved(true); queryClient.invalidateQueries({ queryKey: getGetCurrentStoreQueryKey() }); } }); };
  return <><PageHeader eyebrow="مساحة العمل" title="الإعدادات" description="هوية متجرك ومعلومات الحساب." /><div className="grid gap-5 lg:grid-cols-[1.2fr_.8fr]"><form onSubmit={save} className="rounded-2xl border border-border bg-card p-6"><div className="mb-6 flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-secondary"><Settings2 className="size-5" /></span><div><h2 className="font-bold">بيانات المتجر</h2><p className="text-xs text-muted-foreground">تظهر بعض هذه البيانات لعملائك.</p></div></div><div className="space-y-5"><Field label="اسم المتجر" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required testId="input-store-name" /><Field label="الرابط المختصر" value={form.subdomain} onChange={(v) => setForm({ ...form, subdomain: v.toLowerCase().replace(/[^a-z0-9-]/g, '') })} required testId="input-store-subdomain" /><div className="grid gap-5 sm:grid-cols-2"><Field label="التصنيف" value={form.category} onChange={(v) => setForm({ ...form, category: v })} required testId="input-store-category" /><label className="block text-sm font-semibold">الدولة<select value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} data-testid="select-store-country" className="mt-2 h-11 w-full rounded-xl border border-input bg-background px-3 text-sm"><option value="Egypt">مصر</option><option value="Iraq">العراق</option></select></label></div></div><Button data-testid="button-save-settings" className="mt-7" disabled={create.isPending || !!store}>{store ? 'بيانات المتجر محفوظة' : create.isPending ? 'جارٍ الحفظ...' : 'إنشاء المتجر'}</Button>{saved && <p data-testid="status-settings-saved" className="mt-3 text-xs font-semibold text-primary"><Check className="ml-1 inline size-3" /> تم الحفظ بنجاح</p>}</form><div className="space-y-5"><div className="rounded-2xl border border-border bg-card p-6"><div className="flex items-center gap-3"><CreditCard className="size-5 text-primary" /><h2 className="font-bold">خطتك الحالية</h2></div><div className="mt-5 flex items-end justify-between"><div><p className="text-2xl font-extrabold">{store?.plan ?? 'مجاني'}</p><p className="mt-1 text-xs text-muted-foreground">خطة البداية</p></div><a href="#plans" data-testid="link-view-plans" className="text-xs font-bold text-primary">استعرض الخطط</a></div></div><div className="rounded-2xl border border-accent/25 bg-accent/10 p-6"><LifeBuoy className="size-5 text-accent-foreground" /><h2 className="mt-4 font-bold">هل تحتاج مساعدة؟</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">الدعم المباشر قادم قريباً. اترك لنا رسالة وسنعود إليك.</p><Button variant="outline" className="mt-5 w-full" onClick={() => setSaved(true)}>تواصل مع الدعم</Button></div></div></div></>; }

function Admin() { const query = useGetAdminSummary(); return <><PageHeader eyebrow="مساحة المالك" title="ملخص المنصة" description="مؤشرات RoomFlash عبر جميع المتاجر." action={<Button variant="outline" onClick={() => query.refetch()}><RefreshCw className="size-4" /> تحديث</Button>} /><QueryState loading={query.isLoading} error={query.isError} onRetry={() => query.refetch()}>{query.data && <div className="space-y-5"><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Metric title="إجمالي التجار" value={query.data.totalMerchants.toLocaleString('ar-EG')} change={`${query.data.activeMerchants} نشط`} icon={Users} accent /><Metric title="الطلبات" value={query.data.orders.toLocaleString('ar-EG')} change="كل المنصة" icon={ShoppingCart} /><Metric title="الإيرادات" value={`${query.data.revenue.toLocaleString('ar-EG')} ج.م`} change="إجمالي" icon={BarChart3} /><Metric title="الدخل الشهري" value={`${query.data.mrr.toLocaleString('ar-EG')} ج.م`} change={`${query.data.pendingPayments} دفعة معلقة`} icon={CreditCard} /></div><div className="grid gap-5 lg:grid-cols-2"><div className="rounded-2xl border border-border bg-card p-6"><h2 className="font-bold">توزيع التجار</h2><div className="mt-7 space-y-5"><HealthItem label="تجار نشطون" value={String(query.data.activeMerchants)} percent={query.data.totalMerchants ? query.data.activeMerchants / query.data.totalMerchants * 100 : 0} tone="primary" /><HealthItem label="الخطة المجانية" value={String(query.data.freeMerchants)} percent={query.data.totalMerchants ? query.data.freeMerchants / query.data.totalMerchants * 100 : 0} tone="accent" /><HealthItem label="الخطط المدفوعة" value={String(query.data.paidMerchants)} percent={query.data.totalMerchants ? query.data.paidMerchants / query.data.totalMerchants * 100 : 0} tone="primary" /></div></div><div className="rounded-2xl border border-border bg-card p-6"><div className="flex items-center gap-3"><ShieldCheck className="size-5 text-primary" /><h2 className="font-bold">صحة التشغيل</h2></div><p className="mt-3 text-sm leading-7 text-muted-foreground">البيانات المعروضة من مصدر المنصة مباشرة. راقب الدفعات المعلقة قبل نهاية اليوم.</p><div className="mt-7 flex items-center justify-between rounded-xl bg-secondary p-4"><span className="text-sm font-semibold">دفعات تحتاج متابعة</span><span className="font-mono text-lg font-bold">{query.data.pendingPayments}</span></div></div></div></div>}</QueryState></>; }

function HomeRedirect() {
  const { isLoaded, isSignedIn } = useAuth();
  if (!isLoaded) return <div className="min-h-[100dvh] bg-background" />;
  return isSignedIn ? <Redirect to="/dashboard" /> : <PublicHome />;
}

function ProtectedRoutes() {
  const { isLoaded, isSignedIn } = useAuth();
  if (!isLoaded) return <div className="min-h-[100dvh] bg-background" />;
  if (!isSignedIn) return <Redirect to="/" />;
  return <Shell><Switch><Route path="/dashboard" component={Dashboard} /><Route path="/products/new" component={ProductEditor} /><Route path="/products/:id" component={ProductEditor} /><Route path="/products" component={Products} /><Route path="/orders" component={Orders} /><Route path="/customers" component={Customers} /><Route path="/store" component={StorePage} /><Route path="/settings" component={Settings} /><Route path="/admin" component={Admin} /><Route><Redirect to="/dashboard" /></Route></Switch></Shell>;
}

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const queryClient = useQueryClient();
  const previousUserId = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (previousUserId.current !== undefined && previousUserId.current !== userId) {
        queryClient.clear();
      }
      previousUserId.current = userId;
    });
    return unsubscribe;
  }, [addListener, queryClient]);

  return null;
}

function RoutedApp() {
  const [location] = useLocation();
  if (location === '/') return <HomeRedirect />;
  if (location.startsWith('/sign-in')) return <AuthPage mode="in" />;
  if (location.startsWith('/sign-up')) return <AuthPage mode="up" />;
  return <ProtectedRoutes />;
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();
  return <ClerkProvider
    publishableKey={clerkPubKey}
    proxyUrl={clerkProxyUrl}
    appearance={clerkAppearance}
    signInUrl={`${basePath}/sign-in`}
    signUpUrl={`${basePath}/sign-up`}
    localization={{
      signIn: { start: { title: 'مرحباً بعودتك', subtitle: 'سجّل الدخول للوصول إلى متجرك' } },
      signUp: { start: { title: 'أنشئ حسابك', subtitle: 'ابدأ البيع اليوم مع RoomFlash' } },
    }}
    routerPush={(to) => setLocation(stripBase(to))}
    routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
  >
    <ClerkQueryClientCacheInvalidator />
    <ErrorBoundary resetKey={window.location.pathname}><div className="rf-noise"><RoutedApp /></div></ErrorBoundary>
  </ClerkProvider>;
}

function App() {
  if (!clerkPubKey) throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY in .env file');
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={basePath}><ClerkProviderWithRoutes /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}
export default App;
