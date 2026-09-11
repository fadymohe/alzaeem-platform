import { useEffect, useRef, useState, lazy, Suspense, type ReactNode } from 'react';
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

// Critical direct imports for instant homepage & authentication load
import { PublicHomePage } from './pages/PublicHome';
import { SignInPage } from './pages/SignIn';
import { SignUpPage } from './pages/SignUp';
import { OnboardingPage } from './pages/Onboarding';
import { StandaloneStorePage } from './pages/StandaloneStore';
import { DynamicStoreLanding } from './pages/DynamicStoreLanding';
import { isTemplatePreview } from './components/storefront/StoreTemplates';
import { supabase } from './utils/supabase';
import { setStoreDocumentIdentity } from './utils/storeIdentityHelper';
import { getRegisteredStore } from './utils/storeRegistry';

// Lazy-loaded heavy admin dashboard pages for optimal initial bundle performance
const DashboardPage = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.DashboardPage })));
const ProductsPage = lazy(() => import('./pages/Products').then(m => ({ default: m.ProductsPage })));
const ProductEditorPage = lazy(() => import('./pages/ProductEditor').then(m => ({ default: m.ProductEditorPage })));
const OrdersPage = lazy(() => import('./pages/Orders').then(m => ({ default: m.OrdersPage })));
const CustomersPage = lazy(() => import('./pages/Customers').then(m => ({ default: m.CustomersPage })));
const ShipmentsPage = lazy(() => import('./pages/Shipments').then(m => ({ default: m.ShipmentsPage })));
const LandingPageBuilderPage = lazy(() => import('./pages/LandingPageBuilder').then(m => ({ default: m.LandingPageBuilderPage })));
const ApplicationsPage = lazy(() => import('./pages/Applications').then(m => ({ default: m.ApplicationsPage })));
const AnalyticsPage = lazy(() => import('./pages/Analytics').then(m => ({ default: m.AnalyticsPage })));
const SubscriptionsPage = lazy(() => import('./pages/Subscriptions').then(m => ({ default: m.SubscriptionsPage })));
const MarketingPage = lazy(() => import('./pages/Marketing').then(m => ({ default: m.MarketingPage })));
const StorePage = lazy(() => import('./pages/StorePage').then(m => ({ default: m.StorePage })));
const ThemeCustomizerPage = lazy(() => import('./pages/ThemeCustomizer').then(m => ({ default: m.ThemeCustomizerPage })));
const SettingsPage = lazy(() => import('./pages/Settings').then(m => ({ default: m.SettingsPage })));
const SupportPage = lazy(() => import('./pages/Support').then(m => ({ default: m.SupportPage })));
const OrderTrackingPage = lazy(() => import('./pages/OrderTrackingPage').then(m => ({ default: m.OrderTrackingPage })));

function PageLoadingFallback() {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center p-8 text-center" dir="rtl">
      <div className="size-10 rounded-full border-3 border-teal-600 border-t-transparent animate-spin mb-3" />
      <p className="text-xs font-bold text-slate-500">جاري تحميل الصفحة...</p>
    </div>
  );
}



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
      const hash = window.location.hash || '';
      if (hash.includes('access_token=')) {
        return true; // Hold router while OAuth token is processed
      }
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
      const hash = window.location.hash || '';
      if (hash.includes('access_token=')) {
        return; // Do not redirect while token is being exchanged
      }
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
      <Suspense fallback={<PageLoadingFallback />}>
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
          <Route path="/shipments/rates" component={ShipmentsPage} />
          <Route path="/zaeem-logistics"><Redirect to="/shipments/rates" /></Route>
          <Route path="/landing-pages" component={LandingPageBuilderPage} />
          <Route path="/landing-page" component={LandingPageBuilderPage} />
          <Route path="/landing-pages/new" component={LandingPageBuilderPage} />
          <Route path="/landing-page/new" component={LandingPageBuilderPage} />
          <Route path="/applications" component={ApplicationsPage} />
          <Route path="/analytics" component={AnalyticsPage} />
          <Route path="/subscriptions" component={SubscriptionsPage} />
          <Route path="/marketing" component={MarketingPage} />
          <Route path="/store" component={StorePage} />
          <Route path="/theme-customizer" component={ThemeCustomizerPage} />
          <Route path="/settings" component={SettingsPage} />
          <Route path="/support" component={SupportPage} />
          <Route><Redirect to="/dashboard" /></Route>
        </Switch>
      </Suspense>
    </ShellLayout>
  );
}

const RESERVED_SUBDOMAINS = ['api', 'admin', 'www', 'app', 'static', 'assets', 'za3em', 'home', 'login', 'register', 'dashboard', 'stores', 'store', 'track'];

function RoutedApp() {
  const [location, setLocation] = useLocation();

  // Auto-sync direct pathname into hash for universal SPA compatibility
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const path = window.location.pathname.replace(/^\/+/, '/');
    if (path !== '/' && path !== '/index.html' && (!window.location.hash || window.location.hash === '#' || window.location.hash === '#/')) {
      const search = window.location.search || '';
      window.location.hash = '#' + path + search;
      setLocation(path);
    }
  }, [setLocation]);

  // Compute effective route combining hash routing and pathname fallback
  const effectiveRoute = (() => {
    if (typeof window === 'undefined') return location;
    const hash = window.location.hash || '';
    if (hash.startsWith('#/')) {
      return hash.slice(1).split('?')[0];
    }
    const cleanPath = window.location.pathname.replace(/^\/+/, '/');
    if (cleanPath !== '/' && cleanPath !== '/index.html') {
      return cleanPath;
    }
    return location;
  })();

  const [oauthProcessing, setOauthProcessing] = useState<boolean>(() => {
    const hash = window.location.hash || '';
    const search = window.location.search || '';
    return hash.includes('access_token=') || search.includes('access_token=') || search.includes('code=') || hash.includes('code=');
  });

  // Early Subdomain Identity Sync for immediate tab title & favicon update
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hostMatch = window.location.hostname.match(/^([a-zA-Z0-9-]+)\.za3em\.shop$/i);
    const hostSub = hostMatch?.[1]?.toLowerCase();
    if (hostSub && !RESERVED_SUBDOMAINS.includes(hostSub)) {
      const reg = getRegisteredStore(hostSub);
      if (reg?.storeName) {
        setStoreDocumentIdentity(reg.storeName, reg.logoUrl);
      } else {
        setStoreDocumentIdentity(`متجر ${hostSub}`);
      }
    }
  }, []);

  // Automatic OAuth Token & PKCE Code Listener via Supabase SDK
  useEffect(() => {
    // 1. Check if OAuth error was returned in query params or hash
    const searchParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.includes('?') ? window.location.hash.split('?')[1] : '');
    const oauthError = searchParams.get('error_description') || searchParams.get('error') || hashParams.get('error_description') || hashParams.get('error');

    if (oauthError) {
      console.warn('OAuth redirect returned error:', oauthError);
      try {
        const cleanUrl = window.location.pathname + (window.location.hash ? window.location.hash.split('?')[0] : '');
        window.history.replaceState(null, '', cleanUrl || '/');
      } catch {}
      setOauthProcessing(false);
      try {
        sessionStorage.setItem('zaeem_oauth_error', oauthError);
        window.location.hash = '#/sign-in';
        setLocation('/sign-in');
      } catch {}
      return;
    }

    let isProcessed = false;

    const handleUserSession = async (user: any, token: string) => {
      if (isProcessed || !user || !user.email) return;
      isProcessed = true;

      const meta = user.user_metadata || {};
      const cleanSlug = user.email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
      const authAction = localStorage.getItem('zaeem_auth_action') || 'signin';

      // 1. استعلام قاعدة البيانات لمعرفة ما إذا كان للتاجر متجر مسبقاً
      let dbStore: any = null;
      try {
        const uRes = await fetch(`/api/tenant/user-store?email=${encodeURIComponent(user.email)}&ownerId=${encodeURIComponent(user.id)}`);
        if (uRes.ok) {
          const uData = await uRes.json();
          if (uData.hasStore && uData.store) {
            dbStore = uData.store;
          }
        }
      } catch (e) {}

      // Check if user already has an established store in database metadata or local storage
      let onboarded: any = null;
      try {
        const rawOnb = localStorage.getItem('zaeem_onboarded_store') || localStorage.getItem('zaeem_store_data');
        if (rawOnb) onboarded = JSON.parse(rawOnb);
      } catch {}

      const hasDbStore = Boolean(dbStore || meta.onboarding_completed === true || (meta.store_code && meta.subdomain));
      const hasLocalStore = Boolean(onboarded?.storeCode && localStorage.getItem('zaeem_onboarding_completed') === 'true');
      const isReturningMerchant = (authAction === 'signin' && (hasDbStore || hasLocalStore)) || hasDbStore;

      const avatarUrl = meta.avatar_url || meta.picture || user.user_metadata?.avatar_url || user.user_metadata?.picture || user.avatar_url || '';

      const userObj = {
        id: user.id,
        email: user.email,
        name: meta.full_name || meta.name || (meta.first_name ? `${meta.first_name} ${meta.last_name || ''}`.trim() : user.email.split('@')[0]),
        avatarUrl: avatarUrl,
        phone: meta.phone || user.phone || '+9647700000000',
        governorate: meta.governorate || 'بغداد',
        storeName: dbStore?.name || meta.store_name || onboarded?.storeName || `متجر ${meta.full_name || cleanSlug}`,
        subdomain: dbStore?.subdomain ? `${dbStore.subdomain}.za3em.shop` : (meta.subdomain || onboarded?.subdomain || `${cleanSlug}.za3em.shop`),
        token: token,
        provider: user.app_metadata?.provider || 'google',
        loggedIn: true,
        time: new Date().toISOString()
      };

      localStorage.setItem('zaeem_user', JSON.stringify(userObj));

      if (isReturningMerchant) {
        // SIGN IN: Restore saved store settings and skip onboarding directly to Dashboard!
        const cleanStoredSub = dbStore?.subdomain || (meta.subdomain ? meta.subdomain.replace('.za3em.shop', '') : null) || (onboarded?.subdomain ? onboarded.subdomain.replace('.za3em.shop', '') : null) || cleanSlug;
        const storeCode = dbStore?.storeCode || dbStore?.store_code || meta.store_code || onboarded?.storeCode || `ZAEEM-${cleanStoredSub.toUpperCase().slice(0, 4)}-${Math.floor(1000 + Math.random() * 9000)}`;
        const storeName = dbStore?.name || meta.store_name || onboarded?.storeName || userObj.storeName;
        const subdomain = `${cleanStoredSub}.za3em.shop`;
        const selectedTheme = dbStore?.templateId || dbStore?.template_id || meta.template_id || meta.selected_theme || onboarded?.templateId || 'shoppingcart.1.2.7';
        const product = dbStore?.product || meta.product || onboarded?.product || {
          id: 1,
          title: 'عطر تاج الفخامة الفرنسي الملكي',
          price: 45000,
          compareAtPrice: 58000,
          imageUrl: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&auto=format&fit=crop&q=80'
        };

        const fullStoreData = {
          ...userObj,
          storeName,
          subdomain,
          selectedTheme,
          templateId: selectedTheme,
          storeCode,
          logoUrl: meta.logo_url || onboarded?.logoUrl,
          bannerUrl: meta.banner_url || onboarded?.bannerUrl,
          plan: meta.plan || 'free',
          orderLimit: meta.order_limit || 5,
          categories: meta.categories || onboarded?.categories || ['عام'],
          product
        };

        localStorage.setItem('zaeem_store_data', JSON.stringify(fullStoreData));
        localStorage.setItem('zaeem_onboarded_store', JSON.stringify(fullStoreData));
        localStorage.setItem('zaeem_onboarding_completed', 'true');
        localStorage.setItem('zaeem_auth_action', 'signin');

        // Save product to zaeem_store_products if not present
        try {
          const curProds = JSON.parse(localStorage.getItem('zaeem_store_products') || '[]');
          if (product && (!curProds || curProds.length === 0)) {
            localStorage.setItem('zaeem_store_products', JSON.stringify([{
              id: 1,
              name: product.title || product.name || 'منتج المتجر الحصري',
              sku: `PRD-${cleanSlug.toUpperCase()}`,
              description: (fullStoreData as any).slogan || 'منتج أصلي فاخر مع شحن سريع وضمان الدفع عند الاستلام',
              price: Number(product.price) || 45000,
              compareAtPrice: Number(product.compareAtPrice) || 58000,
              stock: 50,
              lowStockThreshold: 5,
              category: product.category || 'عام',
              status: 'active',
              imageUrl: product.imageUrl || product.image || 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&auto=format&fit=crop&q=80',
              weightGrams: 500
            }]));
          }
        } catch {}

        try {
          window.history.replaceState(null, '', window.location.pathname + '#/dashboard');
        } catch {}
        window.location.hash = '#/dashboard';
        setLocation('/dashboard');
        setOauthProcessing(false);
      } else {
        // SIGN UP: New merchant -> Direct to onboarding to prepare their store!
        localStorage.setItem('zaeem_auth_action', 'signup');
        localStorage.removeItem('zaeem_onboarding_completed');
        localStorage.removeItem('zaeem_onboarded_store');
        localStorage.setItem('zaeem_store_data', JSON.stringify({
          ...userObj,
          plan: 'free',
          orderLimit: 5
        }));

        try {
          window.history.replaceState(null, '', window.location.pathname + '#/onboarding');
        } catch {}
        window.location.hash = '#/onboarding';
        setLocation('/onboarding');
        setOauthProcessing(false);
      }
    };

    // 2. Supabase SDK onAuthStateChange (only on explicit SIGNED_IN event, not INITIAL_SESSION)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session && session.user) {
        handleUserSession(session.user, session.access_token);
      }
    });

    // 3. Check existing session / code ONLY when URL actually contains OAuth params
    const fullUrl = (window.location.hash || '') + (window.location.search || '');
    const hasOAuthParams = fullUrl.includes('access_token=') || fullUrl.includes('code=');

    if (hasOAuthParams) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session && session.user) {
          handleUserSession(session.user, session.access_token);
        } else {
          // Fallback for legacy access_token in hash
          const match = fullUrl.match(/access_token=([^&]+)/);
          const token = match ? match[1] : null;
          if (token) {
            fetch('https://cfpmbasxvjlcfcteyyaa.supabase.co/auth/v1/user', {
              headers: {
                'Authorization': `Bearer ${token}`,
                'apikey': 'sb_publishable_sCozsAhhHZ9v9nWEkiNVlQ_Ne5IoXq2'
              }
            })
            .then(r => r.json())
            .then(u => {
              if (u && u.email) handleUserSession(u, token);
              else setOauthProcessing(false);
            })
            .catch(() => setOauthProcessing(false));
            return;
          }
          setOauthProcessing(false);
        }
      });
    } else {
      setOauthProcessing(false);
    }

    return () => {
      subscription.unsubscribe();
    };
  }, []);


  if (oauthProcessing) {
    const authAction = typeof window !== 'undefined' ? localStorage.getItem('zaeem_auth_action') : 'signin';
    const isSignup = authAction === 'signup';
    return (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-slate-50 text-slate-900 p-4 font-sans" dir="rtl">
        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl text-center space-y-4 max-w-sm w-full animate-fadeIn">
          <div className="size-14 rounded-2xl mx-auto grid place-items-center bg-teal-50 border border-teal-200">
            <svg className="size-7 animate-spin text-teal-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
              <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75" />
            </svg>
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900">
              {isSignup ? 'جاري إنشاء حسابك الجديد عبر Google...' : 'جاري تسجيل الدخول عبر Google...'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {isSignup ? 'يتم تحويلك إلى صفحة تجهيز متجرك الجديد...' : 'يتم استرجاع إعدادات متجرك وتحويلك مباشرة إلى لوحة التحكم'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 1. Template Subdomain Preview (e.g. nova.za3em.shop, classic.za3em.shop, aurit.za3em.shop, etc.)
  const hostMatch = window.location.hostname.match(/^([a-zA-Z0-9-]+)\.za3em\.shop$/i);
  const hostSub = hostMatch?.[1]?.toLowerCase();
  if (hostSub && isTemplatePreview(hostSub)) {
    return <StandaloneStorePage />;
  }

  // 2. Hash Route Template Preview (e.g. #/store/nova or #/view-store/classic)
  const hash = typeof window !== 'undefined' ? window.location.hash : '';
  if (hash.includes('/store/') || hash.includes('/view-store/')) {
    const cleanHash = hash.replace(/^#\/?/, '').split('?')[0];
    const hashParts = cleanHash.split('/').filter(Boolean);
    const hashSlug = hashParts[1] || hashParts[0] || '';
    if (isTemplatePreview(hashSlug)) {
      return <StandaloneStorePage />;
    }
  }

  // 3. Automatic Merchant Subdomain Detection (e.g. zero.za3em.shop)
  if (hostSub && !RESERVED_SUBDOMAINS.includes(hostSub)) {
    return <DynamicStoreLanding />;
  }

  // صفحة التتبع الحي للعملاء
  if (effectiveRoute.startsWith('/track')) {
    return (
      <Suspense fallback={<PageLoadingFallback />}>
        <OrderTrackingPage />
      </Suspense>
    );
  }

  // صفحات المتاجر والهبوط بالنطاقات المباشرة
  if (effectiveRoute.startsWith('/landing/') || effectiveRoute.startsWith('/view-store/') || effectiveRoute.startsWith('/store/') || effectiveRoute.startsWith('/p/')) {
    const segments = effectiveRoute.split('/').filter(Boolean);
    const slug = segments[1] || '';
    if (isTemplatePreview(slug)) {
      return <StandaloneStorePage />;
    }
    return <DynamicStoreLanding />;
  }

  if (effectiveRoute === '/' || effectiveRoute === '') return <PublicHomePage />;
  if (effectiveRoute.startsWith('/sign-in')) return <SignInPage />;
  if (effectiveRoute.startsWith('/sign-up')) return <SignUpPage />;
  if (effectiveRoute.startsWith('/onboarding')) return <OnboardingPage />;
  if (effectiveRoute.startsWith('/support')) {
    return (
      <Suspense fallback={<PageLoadingFallback />}>
        <SupportPage />
      </Suspense>
    );
  }
  if (effectiveRoute.startsWith('/theme-customizer')) {
    return (
      <Suspense fallback={<PageLoadingFallback />}>
        <ThemeCustomizerPage />
      </Suspense>
    );
  }
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
