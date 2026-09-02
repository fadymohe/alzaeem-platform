import { useEffect, useRef, useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { Link, Redirect, Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import { useHashLocation } from 'wouter/use-hash-location';
import { ClerkProvider, useAuth, useClerk, useUser } from '@clerk/react';
import { shadcn } from '@clerk/themes';

import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';

import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';

import { PublicHomePage } from './pages/PublicHome';
import { SignInPage } from './pages/SignIn';
import { SignUpPage } from './pages/SignUp';
import { OnboardingPage } from './pages/Onboarding';
import { DashboardPage } from './pages/Dashboard';
import { ProductsPage } from './pages/Products';
import { ProductEditorPage } from './pages/ProductEditor';
import { OrdersPage } from './pages/Orders';
import { CustomersPage } from './pages/Customers';
import { ShipmentsPage } from './pages/Shipments';
import { ZaeemLogisticsPage } from './pages/ZaeemLogistics';
import { LandingPageBuilderPage } from './pages/LandingPageBuilder';
import { ApplicationsPage } from './pages/Applications';
import { AnalyticsPage } from './pages/Analytics';
import { SubscriptionsPage } from './pages/Subscriptions';
import { MarketingPage } from './pages/Marketing';
import { StorePage } from './pages/StorePage';
import { StandaloneStorePage } from './pages/StandaloneStore';
import { DynamicStoreLanding } from './pages/DynamicStoreLanding';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { SettingsPage } from './pages/Settings';
import { SupportPage } from './pages/Support';

const queryClient = new QueryClient();
const basePath = import.meta.env.BASE_URL ? import.meta.env.BASE_URL.replace(/\/$/, '') : '';
const rawClerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
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
  },
  variables: {
    colorPrimary: '#0f766e',
    colorForeground: '#0f172a',
    colorMutedForeground: '#64748b',
    colorDanger: '#dc2626',
    colorBackground: '#ffffff',
    colorInput: '#ffffff',
    colorInputForeground: '#0f172a',
    colorNeutral: '#e2e8f0',
    fontFamily: "'IBM Plex Sans Arabic', 'Tajawal', sans-serif",
    borderRadius: '1rem',
  },
  elements: {
    rootBox: 'w-full flex justify-center',
    cardBox: 'bg-white rounded-3xl w-[440px] max-w-full overflow-hidden border border-slate-200 shadow-xl',
    card: '!shadow-none !border-0 !bg-transparent !rounded-none',
    footer: '!shadow-none !border-0 !bg-transparent !rounded-none',
    headerTitle: 'text-slate-900 font-extrabold text-xl',
    headerSubtitle: 'text-slate-500 text-xs',
    socialButtonsBlockButtonText: 'text-slate-800 font-bold',
    formFieldLabel: 'text-slate-800 font-bold text-xs',
    footerActionLink: 'text-teal-700 font-extrabold',
    footerActionText: 'text-slate-500 text-xs',
    dividerText: 'text-slate-400 text-xs',
    formButtonPrimary: 'bg-teal-700 hover:bg-teal-800 text-white font-bold',
    formFieldInput: 'border-slate-200 text-slate-900',
    footerAction: 'border-t border-slate-100',
    dividerLine: 'bg-slate-200',
    formFieldRow: 'mb-4',
    main: 'gap-4',
  },
};

function ShellLayout({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-[100dvh] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
      <Sidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />
      <div className="lg:mr-72 min-h-[100dvh] flex flex-col">
        <Header onOpenMobile={() => setMobileOpen(true)} />
        <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

function ProtectedRoutes() {
  const [, setLocation] = useLocation();
  const [isAuth, setIsAuth] = useState<boolean>(() => {
    try {
      const u = localStorage.getItem('zaeem_user');
      if (u) {
        const parsed = JSON.parse(u);
        return Boolean(parsed && parsed.loggedIn);
      }
    } catch (e) {}
    return false;
  });

  useEffect(() => {
    try {
      const u = localStorage.getItem('zaeem_user');
      if (!u || !JSON.parse(u).loggedIn) {
        setIsAuth(false);
        setLocation('/sign-in');
      }
    } catch (e) {
      setIsAuth(false);
      setLocation('/sign-in');
    }
  }, [setLocation]);

  if (!isAuth) {
    return <Redirect to="/sign-in" />;
  }

  return (
    <ShellLayout>
      <Switch>
        <Route path="/dashboard" component={DashboardPage} />
        <Route path="/products/new" component={ProductEditorPage} />
        <Route path="/products/:id" component={ProductEditorPage} />
        <Route path="/products" component={ProductsPage} />
        <Route path="/orders" component={OrdersPage} />
        <Route path="/customers" component={CustomersPage} />
        <Route path="/shipments" component={ShipmentsPage} />
        <Route path="/shipments/new" component={ShipmentsPage} />
        <Route path="/shipments/track" component={ShipmentsPage} />
        <Route path="/zaeem-logistics" component={ZaeemLogisticsPage} />
        <Route path="/landing-pages" component={LandingPageBuilderPage} />
        <Route path="/landing-pages/new" component={LandingPageBuilderPage} />
        <Route path="/applications" component={ApplicationsPage} />
        <Route path="/analytics" component={AnalyticsPage} />
        <Route path="/subscriptions" component={SubscriptionsPage} />
        <Route path="/marketing" component={MarketingPage} />
        <Route path="/store" component={StorePage} />
        <Route path="/settings" component={SettingsPage} />
        <Route path="/support" component={SupportPage} />
        <Route><Redirect to="/dashboard" /></Route>
      </Switch>
    </ShellLayout>
  );
}

const RESERVED_SUBDOMAINS = ['api', 'admin', 'www', 'app', 'static', 'assets', 'za3em', 'home', 'login', 'register', 'dashboard', 'stores', 'store', 'track'];

function RoutedApp() {
  const [location] = useLocation();

  // Automatic Subdomain Detection (e.g. zero.za3em.shop)
  const hostMatch = window.location.hostname.match(/^([a-zA-Z0-9-]+)\.za3em\.shop$/i);
  const hostSub = hostMatch?.[1]?.toLowerCase();
  if (hostSub && !RESERVED_SUBDOMAINS.includes(hostSub)) {
    return <DynamicStoreLanding />;
  }

  // صفحة التتبع الحي للعملاء
  if (location.startsWith('/track')) return <OrderTrackingPage />;

  // صفحات المتاجر والهبوط بالنطاقات المباشرة
  if (location.startsWith('/landing') || location.startsWith('/view-store') || location.startsWith('/store')) {
    return <DynamicStoreLanding />;
  }

  if (location === '/') return <PublicHomePage />;
  if (location.startsWith('/sign-in')) return <SignInPage />;
  if (location.startsWith('/sign-up')) return <SignUpPage />;
  if (location.startsWith('/onboarding')) return <OnboardingPage />;
  return <ProtectedRoutes />;
}

function AppWithClerk() {
  const [, setLocation] = useLocation();

  if (!rawClerkKey) {
    return (
      <ErrorBoundary resetKey={window.location.pathname}>
        <div className="rf-noise">
          <RoutedApp />
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ClerkProvider
      publishableKey={rawClerkKey}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      localization={{
        signIn: { start: { title: 'مرحباً بعودتك في الزعيم', subtitle: 'سجّل الدخول للوصول إلى لوحة الشحن والمتجر' } },
        signUp: { start: { title: 'افتح حسابك مع الزعيم', subtitle: 'ابدأ إدارة شحناتك ومتجرك اليوم' } },
      }}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <ErrorBoundary resetKey={window.location.pathname}>
        <div className="rf-noise">
          <RoutedApp />
        </div>
      </ErrorBoundary>
    </ClerkProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter hook={useHashLocation}>
          <AppWithClerk />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
