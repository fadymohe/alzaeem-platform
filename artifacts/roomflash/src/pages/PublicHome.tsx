import { useState } from 'react';
import { Link } from 'wouter';
import { Logo } from '../components/common/Logo';
import {
  Sparkles, ArrowLeft, ArrowRight, CheckCircle2, XCircle, ShoppingBag,
  Truck, BarChart3, ShieldCheck, PhoneCall, Globe, Layers, Zap, MessageSquare,
  FileSpreadsheet, AlertCircle, Clock, PackageCheck, Repeat, ChevronLeft,
  Smartphone, Monitor, Play, Check, TrendingUp, Users, DollarSign, Wallet,
  Store, Building2, MapPin, ArrowUpRight, Palette, Layout, Award
} from 'lucide-react';
import { formatIQD } from '../data/iraqData';

export function PublicHomePage() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [activeStep, setActiveStep] = useState(0);
  const [selectedTemplateTab, setSelectedTemplateTab] = useState<'brisk' | 'nova' | 'classic' | 'aurit'>('brisk');

  const isAr = lang === 'ar';

  const t = {
    badge: isAr ? 'منصة التجارة والشحن المتكاملة الأولى' : 'The #1 E-Commerce & Logistics Platform',
    titleMain: isAr ? 'أنشئ متجرك الإلكتروني وأدِر' : 'Build Your Online Store & Manage Your',
    titleHighlight: isAr ? 'شحناتك في منصة واحدة' : 'Shipments in One Unified Platform',
    subtitle: isAr
      ? 'كل ما تحتاجه لإدارة متجرك، منتجاتك، طلبياتك، وربط شحناتك مباشرة بأسطول شركة الزعيم للشحن في كل المحافظات.'
      : 'Everything you need to manage your store, inventory, orders, and dispatch shipments with Al-Zaeem Fleet across all governorates.',
    ctaPrimary: isAr ? 'ابدأ متجرك الآن مجاناً' : 'Start Your Free Store Now',
    ctaSecondary: isAr ? 'شاهد كيف تعمل المنصة' : 'Watch How It Works',
    trustText: isAr
      ? 'مجاناً لأول 20 طلباً — بدون بطاقة ائتمان — بدون عمولة على المبيعات'
      : 'Free for first 20 orders — No credit card required — 0% sales commission',
    navFeatures: isAr ? 'المميزات' : 'Features',
    navShipping: isAr ? 'الشحن والتوصيل' : 'Shipping',
    navPricing: isAr ? 'الأسعار' : 'Pricing',
    navTemplates: isAr ? 'التصاميم' : 'Templates',
    navStories: isAr ? 'قصص النجاح' : 'Success Stories',
    navBlog: isAr ? 'المدونة' : 'Blog',
    navFaq: isAr ? 'الأسئلة الشائعة' : 'FAQ',
    signIn: isAr ? 'تسجيل الدخول' : 'Sign In',
    startFree: isAr ? 'ابدأ مجاناً' : 'Start Free',
    countryBadge: isAr ? 'مصر' : 'Egypt',

    // Dashboard Mockup
    liveBadge: isAr ? 'مباشر' : 'LIVE',
    dashboardTitle: isAr ? 'لوحة تحكم متجرك — الزعيم' : 'Store Dashboard — Al-Zaeem',
    statSales: isAr ? 'إجمالي المبيعات (د.ع)' : 'Total Revenue (IQD)',
    statSalesNote: isAr ? '↑ +24% مقارنة بالشهر السابق' : '↑ +24% vs last month',
    statOrders: isAr ? 'عدد الطلبات الناجحة' : 'Successful Orders',
    statOrdersNote: isAr ? '18 بغداد · 12 البصرة · 18 محافظات' : '18 Baghdad · 12 Basra · 18 Other',
    statCustomers: isAr ? 'عدد الزبائن الجدد' : 'New Customers',
    statCustomersNote: isAr ? '✓ 100% تم تأكيد الطلبات عبر واتساب' : '✓ 100% WhatsApp Confirmed',
    whatsappOverlay: isAr ? 'رسالة واتساب تلقائية «تم تأكيد طلبك #1003 ✓»' : 'Automated WhatsApp «Order #1003 Confirmed ✓»',
    shippingOverlay: isAr ? 'حجز شحنة أسطول الزعيم - بغداد (TRK-29841)' : 'Al-Zaeem Fleet Dispatch - Baghdad (TRK-29841)',

    // Problem vs Solution
    beforeBadge: isAr ? 'قبل الزعيم' : 'Before Al-Zaeem',
    beforeTitle: isAr ? 'مبيعاتك تنمو... لكن إدارتها أصبحت فوضى' : 'Sales Are Growing... But Management Is Chaos',
    beforeSubtitle: isAr ? 'إذا كنت تدير متجرك عبر واتساب وملفات إكسل، فأنت تعرف هذا التحدي جيداً.' : 'If you manage your store via WhatsApp and Excel sheets, you know this struggle well.',
    afterBadge: isAr ? 'نقطة التحول مع الزعيم' : 'The Turning Point with Al-Zaeem',
    afterTitle: isAr ? 'هنا يأتي دور الزعيم — الجهد نفسه ونتيجة مختلفة تماماً' : 'Here Comes Al-Zaeem — Same Effort, Entirely Better Results',

    // Templates Section (from Image 1)
    templatesBadge: isAr ? '● التصاميم' : '● Templates',
    templatesHeading: isAr ? 'تصميم يليق بمجالك' : 'Designs Built for Your Niche',
    templatesSubheading: isAr ? 'قوالب حقيقية من متاجر فعلية — وليست تصاميم وهمية.' : 'Real templates from active stores — not fake concepts.',
    templateFooterNote: isAr ? 'غيّر الألوان والخطوط والأقسام في أي وقت — دون سطر برمجي واحد.' : 'Customize colors, fonts, and layouts anytime — without code.',
    tryTemplatesBtn: isAr ? 'جرب التصاميم ←' : 'Try Templates →',

    // Case Studies Section (from Image 1)
    storiesBadge: isAr ? '● قصص حقيقية' : '● Real Stories',
    storiesHeading: isAr ? 'تجار بدأوا من حيث أنت... ونمت متاجرهم مع الزعيم' : 'Merchants Who Started Where You Are... And Scaled with Al-Zaeem',
    storiesSubheading: isAr ? 'أرقام من متاجر فعلية على المنصة.' : 'Real metrics from active merchants on the platform.',
    storiesFooterNote: isAr ? 'نتائج فعلية لتجار على المنصة — وتختلف النتائج باختلاف المجال وطريقة التشغيل.' : 'Actual results from real merchants — results vary based on niche and execution.',

    // Bottom Sticky Bar (from Image 2)
    stickyQuestion: isAr ? 'جاهز للبدء؟' : 'Ready to start?',
    stickyBtn: isAr ? 'ابدأ متجرك مجاناً' : 'Start Free Store'
  };

  return (
    <main dir={isAr ? 'rtl' : 'ltr'} className="min-h-[100dvh] overflow-x-hidden bg-white text-slate-900 font-sans select-none pb-24">
      {/* Background Grid & Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-70" />
        <div className="absolute top-0 right-1/4 size-96 rounded-full bg-teal-400/10 blur-[120px]" />
        <div className="absolute top-1/3 left-1/4 size-96 rounded-full bg-emerald-400/10 blur-[120px]" />
      </div>

      <div className="relative z-10">
        {/* ========================================================================= */}
        {/* 1️⃣ NAVBAR: Floating Glass Navbar */}
        {/* ========================================================================= */}
        <div className="sticky top-4 z-50 px-4 md:px-8">
          <header className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-slate-200/80 bg-white/80 px-4 md:px-6 py-3 backdrop-blur-md shadow-lg shadow-slate-100/50">
            {/* Logo + Iraq Badge */}
            <div className="flex items-center gap-3">
              <Logo showSubtitle={false} />
              <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-1 text-[11px] font-extrabold text-teal-800 border border-teal-200/60">
                {t.countryBadge}
              </span>
            </div>

            {/* Nav Links */}
            <nav className="hidden lg:flex items-center gap-8 text-xs font-bold text-slate-600">
              <a href="#features" className="transition-colors hover:text-teal-700">{t.navFeatures}</a>
              <a href="#templates" className="transition-colors hover:text-teal-700">{t.navTemplates}</a>
              <a href="#stories" className="transition-colors hover:text-teal-700">{t.navStories}</a>
              <a href="#shipping" className="transition-colors hover:text-teal-700">{t.navShipping}</a>
              <a href="#blog" className="transition-colors hover:text-teal-700">{t.navBlog}</a>
            </nav>

            {/* Language Switcher & Auth */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
                data-testid="button-lang-toggle"
                className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-extrabold text-slate-700 hover:bg-slate-100 transition-colors shadow-sm"
              >
                <Globe className="size-3.5 text-teal-600" />
                <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
              </button>

              <Link
                href="/sign-in"
                className="hidden sm:inline-flex rounded-full px-4 py-2 text-xs font-extrabold text-slate-700 hover:text-teal-700 transition-colors"
              >
                {t.signIn}
              </Link>

              <Link
                href="/sign-up"
                className="inline-flex items-center justify-center rounded-full bg-teal-700 hover:bg-teal-800 px-5 py-2.5 text-xs font-extrabold text-white shadow-md shadow-teal-700/20 transition-all hover:scale-105"
              >
                {t.startFree}
              </Link>
            </div>
          </header>
        </div>

        {/* ========================================================================= */}
        {/* 2️⃣ HERO SECTION */}
        {/* ========================================================================= */}
        <section className="mx-auto max-w-5xl px-4 pt-16 pb-12 text-center md:pt-24 md:pb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-200/80 bg-teal-50/80 px-4 py-1.5 text-xs font-extrabold text-teal-800 shadow-sm backdrop-blur-sm mb-6">
            <Sparkles className="size-4 text-teal-600 animate-pulse" />
            <span>{t.badge}</span>
          </div>

          <h1 className="text-3xl font-black leading-tight tracking-tight text-slate-900 md:text-6xl lg:text-7xl">
            {t.titleMain}{' '}
            <span className="bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 bg-clip-text text-transparent">
              {t.titleHighlight}
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-600 md:text-lg">
            {t.subtitle}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/sign-up"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-teal-700 hover:bg-teal-800 px-8 py-4 text-sm font-extrabold text-white shadow-xl shadow-teal-700/25 transition-all hover:scale-105"
            >
              <span>{t.ctaPrimary}</span>
              {isAr ? <ArrowLeft className="size-4" /> : <ArrowRight className="size-4" />}
            </Link>

            <a
              href="#demo"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-7 py-4 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all"
            >
              <Play className="size-4 text-teal-700 fill-teal-700" />
              <span>{t.ctaSecondary}</span>
            </a>
          </div>

          <p className="mt-5 text-xs font-bold text-slate-400">
            {t.trustText}
          </p>
        </section>

        {/* ========================================================================= */}
        {/* 3️⃣ INTERACTIVE DASHBOARD MOCKUP */}
        {/* ========================================================================= */}
        <section id="demo" className="mx-auto max-w-6xl px-4 pb-20">
          <div className="relative rounded-3xl border border-slate-200/90 bg-white p-3 md:p-6 shadow-2xl shadow-slate-200/80">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="size-3 rounded-full bg-red-400" />
                <span className="size-3 rounded-full bg-amber-400" />
                <span className="size-3 rounded-full bg-emerald-400" />
                <span className="mx-3 text-xs font-bold text-slate-400 hidden sm:inline">{t.dashboardTitle}</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200/60 px-3 py-1 text-[11px] font-extrabold text-emerald-700">
                <span className="size-2 rounded-full bg-emerald-500 animate-ping" />
                <span>{t.liveBadge}</span>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              <div className="rounded-2xl border border-teal-100 bg-teal-50/40 p-4">
                <span className="text-xs font-bold text-slate-500">{t.statSales}</span>
                <p className="text-2xl font-black text-slate-900 mt-1 font-mono">{formatIQD(19020000)}</p>
                <span className="text-[11px] font-bold text-teal-700 mt-1 block">{t.statSalesNote}</span>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                <span className="text-xs font-bold text-slate-500">{t.statOrders}</span>
                <p className="text-2xl font-black text-slate-900 mt-1 font-mono">48</p>
                <span className="text-[11px] font-bold text-slate-500 mt-1 block">{t.statOrdersNote}</span>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                <span className="text-xs font-bold text-slate-500">{t.statCustomers}</span>
                <p className="text-2xl font-black text-slate-900 mt-1 font-mono">32</p>
                <span className="text-[11px] font-bold text-emerald-600 mt-1 block">{t.statCustomersNote}</span>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50/40 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-extrabold text-slate-700">{isAr ? 'مؤشر نمو المبيعات بالأيام' : 'Daily Sales Growth Chart'}</span>
                <span className="text-[11px] font-bold text-slate-400">{isAr ? 'بغداد والفرع الرئيسي' : 'Baghdad Main Branch'}</span>
              </div>
              <div className="h-32 w-full flex items-end gap-2 pt-4">
                {[35, 45, 60, 50, 75, 90, 110, 130, 120, 145, 160, 190].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                    <div
                      className="w-full rounded-t-lg bg-gradient-to-t from-teal-700 to-teal-500 transition-all group-hover:bg-teal-400"
                      style={{ height: `${(h / 190) * 100}%` }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="absolute -top-6 -right-4 hidden md:block">
              <div className="flex items-center gap-2.5 rounded-2xl border border-emerald-200 bg-white p-3.5 shadow-xl shadow-emerald-500/10">
                <MessageSquare className="size-5 text-emerald-600" />
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block">{isAr ? 'تأكيد تلقائي' : 'Auto Confirm'}</span>
                  <p className="text-xs font-extrabold text-slate-900">{t.whatsappOverlay}</p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -left-4 hidden md:block">
              <div className="flex items-center gap-2.5 rounded-2xl border border-teal-200 bg-white p-3.5 shadow-xl shadow-teal-500/10">
                <Truck className="size-5 text-teal-700" />
                <div>
                  <span className="text-[10px] font-bold text-teal-700 block">{isAr ? 'أسطول الشحن' : 'Fleet Shipping'}</span>
                  <p className="text-xs font-extrabold text-slate-900">{t.shippingOverlay}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4️⃣ PROBLEM VS SOLUTION SECTION */}
        {/* ========================================================================= */}
        <section className="bg-slate-50/80 border-y border-slate-200/60 py-20 px-4">
          <div className="mx-auto max-w-6xl">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="inline-block rounded-full bg-red-50 border border-red-200/80 px-3.5 py-1 text-xs font-extrabold text-red-700 mb-3">
                {t.beforeBadge}
              </span>
              <h2 className="text-2xl md:text-4xl font-black text-slate-900">
                {t.beforeTitle}
              </h2>
              <p className="text-xs md:text-sm font-medium text-slate-500 mt-2">
                {t.beforeSubtitle}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-20">
              <div className="rounded-2xl border border-red-200/80 bg-red-50/40 p-5 transform -rotate-1 hover:rotate-0 transition-transform">
                <XCircle className="size-6 text-red-500 mb-3" />
                <h4 className="font-extrabold text-sm text-slate-900">{isAr ? 'رسائل واتساب متناثرة' : 'Scattered WhatsApp DMs'}</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{isAr ? 'ضياع الطلبات بين الرسائل وتأخر الرد على الزبائن.' : 'Lost orders in chat histories and delayed responses.'}</p>
              </div>

              <div className="rounded-2xl border border-red-200/80 bg-red-50/40 p-5 transform rotate-1 hover:rotate-0 transition-transform">
                <FileSpreadsheet className="size-6 text-red-500 mb-3" />
                <h4 className="font-extrabold text-sm text-slate-900">{isAr ? 'ملفات إكسل مبعثرة' : 'Messy Excel Sheets'}</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{isAr ? 'تتبع يدوي مرهق لكل شحنة وعدم دقة الأرقام.' : 'Exhausting manual tracking for each parcel and mismatching figures.'}</p>
              </div>

              <div className="rounded-2xl border border-red-200/80 bg-red-50/40 p-5 transform -rotate-1 hover:rotate-0 transition-transform">
                <Clock className="size-6 text-red-500 mb-3" />
                <h4 className="font-extrabold text-sm text-slate-900">{isAr ? '«أين طلبي؟»' : '«Where is my order?»'}</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{isAr ? 'عملاء ينتظرون التتبع واستفسارات مستمرة بدون جواب.' : 'Customers waiting for status updates without answers.'}</p>
              </div>

              <div className="rounded-2xl border border-red-200/80 bg-red-50/40 p-5 transform rotate-1 hover:rotate-0 transition-transform">
                <AlertCircle className="size-6 text-red-500 mb-3" />
                <h4 className="font-extrabold text-sm text-slate-900">{isAr ? 'أرباح بالتخمين' : 'Guessing Profits'}</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{isAr ? 'نفاد مفاجئ للمخزون وغياب التقارير المالية الدقيقة.' : 'Sudden stockouts and lack of clear financial insight.'}</p>
              </div>
            </div>

            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="inline-block rounded-full bg-teal-50 border border-teal-200 px-3.5 py-1 text-xs font-extrabold text-teal-800 mb-3">
                {t.afterBadge}
              </span>
              <h3 className="text-2xl md:text-4xl font-black text-slate-900">
                {t.afterTitle}
              </h3>
            </div>

            <div className="space-y-4 max-w-4xl mx-auto">
              {[
                {
                  before: isAr ? 'رسائل واتساب متناثرة وضياع الطلبات' : 'Scattered WhatsApp chats and lost orders',
                  after: isAr ? 'منظومة طلبات موحدة مع تأكيد واتساب تلقائي بنقرة واحدة ✓' : 'Unified order engine with 1-click WhatsApp auto confirm ✓'
                },
                {
                  before: isAr ? 'ملفات إكسل مبعثرة وتتبع يدوي لكل شحنة' : 'Messy spreadsheets and manual tracking',
                  after: isAr ? 'تزامن تلقائي للمخزون والطلبات لحظة بلحظة ✓' : 'Real-time inventory and order synchronization ✓'
                },
                {
                  before: isAr ? 'متابعة يدوية مع المندوب واستفسارات العملاء' : 'Manual calls with couriers & impatient buyers',
                  after: isAr ? 'ربط فوري وشحن مباشر لـ 18 محافظة مع تتبع كود ZAEEM ✓' : 'Direct dispatch to 18 governorates with ZAEEM tracking code ✓'
                },
                {
                  before: isAr ? 'أرباح تُحسب بالتخمين ونفاد المخزون' : 'Guessing profits and running out of stock',
                  after: isAr ? 'تحليلات مالية وتقارير أرباح لحظية لكل محافظة ومنتج ✓' : 'Instant financial reports & profit metrics per city & item ✓'
                }
              ].map((item, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-red-50/60 text-red-900 text-xs font-bold">
                    <XCircle className="size-4 text-red-500 shrink-0" />
                    <span>{item.before}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-teal-50/80 text-teal-900 text-xs font-extrabold">
                    <CheckCircle2 className="size-4 text-teal-600 shrink-0" />
                    <span>{item.after}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5️⃣ TEMPLATES SHOWCASE SECTION (from Image 1) */}
        {/* ========================================================================= */}
        <section id="templates" className="py-20 px-4 mx-auto max-w-6xl text-center">
          <span className="inline-block rounded-full bg-teal-50 border border-teal-200 px-3.5 py-1 text-xs font-extrabold text-teal-800 mb-3">
            {t.templatesBadge}
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900">
            {t.templatesHeading}
          </h2>
          <p className="text-xs md:text-sm font-medium text-slate-500 mt-2 max-w-xl mx-auto">
            {t.templatesSubheading}
          </p>

          {/* Template Selector Pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8 mb-10">
            {[
              { id: 'brisk', label: isAr ? 'بريسك' : 'Brisk', tag: isAr ? 'أزياء وإكسسوار' : 'Fashion & Accessories' },
              { id: 'nova', label: isAr ? 'نوفا' : 'Nova', tag: isAr ? 'عبايات وأقمشة' : 'Abayas & Fabrics' },
              { id: 'classic', label: isAr ? 'كلاسيك' : 'Classic', tag: isAr ? 'عطور ومستلزمات' : 'Perfumes & Beauty' },
              { id: 'aurit', label: isAr ? 'أوريت' : 'Aurit', tag: isAr ? 'إلكترونيات وهدايا' : 'Electronics & Gifts' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTemplateTab(tab.id as any)}
                className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-extrabold transition-all border ${
                  selectedTemplateTab === tab.id
                    ? 'border-red-300 bg-red-50 text-red-700 shadow-md ring-2 ring-red-200'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{tab.label}</span>
                <span className="text-[10px] font-normal opacity-80">({tab.tag})</span>
              </button>
            ))}
          </div>

          {/* Store Browser Window Mockup */}
          <div className="relative mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-3 md:p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="size-3 rounded-full bg-red-400" />
                <span className="size-3 rounded-full bg-amber-400" />
                <span className="size-3 rounded-full bg-emerald-400" />
              </div>
              <div className="rounded-full bg-slate-100 border border-slate-200/80 px-4 py-1 text-[11px] font-mono text-slate-500">
                ● store.zaeem.iq
              </div>
            </div>

            {/* Active Template Preview Content */}
            <div className="rounded-2xl border border-slate-100 bg-amber-50/30 p-6 text-slate-900 space-y-6">
              <div className="grid md:grid-cols-2 items-center gap-6 text-right">
                <div className="space-y-3">
                  <span className="inline-block rounded-full bg-teal-100 text-teal-800 text-[10px] font-extrabold px-3 py-1">
                    {isAr ? 'مجموعة الصيف 2026' : 'Summer Collection 2026'}
                  </span>
                  <h3 className="text-2xl md:text-4xl font-black">
                    {isAr ? 'مغامرات الصيف' : 'Summer Adventures'}
                  </h3>
                  <p className="text-xs text-slate-600">
                    {isAr ? 'استقبل موسم الشمس الدافئة مع مجموعتنا الجديدة والأنيقة.' : 'Embrace the sun with our new luxury curated store collection.'}
                  </p>
                  <button className="rounded-full bg-slate-900 text-white font-extrabold text-xs px-6 py-2.5 hover:bg-teal-700 transition-colors">
                    {isAr ? 'تسوق الآن' : 'Shop Now'}
                  </button>
                </div>
                <div className="relative h-48 rounded-2xl overflow-hidden bg-slate-200">
                  <img
                    src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop&q=80"
                    alt="Store Preview Banner"
                    className="size-full object-cover"
                  />
                </div>
              </div>

              {/* Categories Pills */}
              <div className="pt-4 border-t border-slate-200/60">
                <h4 className="text-xs font-black text-slate-700 mb-3 text-right">{isAr ? 'التصنيفات' : 'Categories'}</h4>
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {[
                    isAr ? 'ملابس' : 'Apparel',
                    isAr ? 'عطور' : 'Perfumes',
                    isAr ? 'ساعات' : 'Watches',
                    isAr ? 'حقائب' : 'Bags',
                    isAr ? 'نظارات' : 'Eyewear'
                  ].map((cat, i) => (
                    <span key={i} className="shrink-0 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-extrabold text-slate-700 shadow-sm">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <p className="text-xs font-bold text-slate-400 mt-6">
            {t.templateFooterNote}
          </p>

          <div className="mt-6">
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-xs font-extrabold text-slate-800 hover:bg-slate-50 shadow-sm transition-all"
            >
              <span>{t.tryTemplatesBtn}</span>
            </Link>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6️⃣ REAL MERCHANT STORIES SECTION (from Image 1) */}
        {/* ========================================================================= */}
        <section id="stories" className="bg-slate-50 py-20 px-4 border-y border-slate-200/60">
          <div className="mx-auto max-w-6xl text-center">
            <span className="inline-block rounded-full bg-teal-50 border border-teal-200 px-3.5 py-1 text-xs font-extrabold text-teal-800 mb-3">
              {t.storiesBadge}
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900">
              {t.storiesHeading}
            </h2>
            <p className="text-xs md:text-sm font-medium text-slate-500 mt-2 max-w-xl mx-auto">
              {t.storiesSubheading}
            </p>

            {/* 3 Metric Cards */}
            <div className="grid gap-6 md:grid-cols-3 mt-14">
              {/* Card 1 */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm text-right flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 mb-4">{isAr ? 'متجر أزياء — القاهرة / بغداد' : 'Fashion Store — Baghdad'}</h4>
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-xs text-red-600 font-medium">
                      <span className="size-2 rounded-full bg-red-500" />
                      <span>{isAr ? 'كان البيع عبر رسائل إنستغرام' : 'Was selling via Instagram DMs'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-emerald-600 font-extrabold">
                      <span className="size-2 rounded-full bg-emerald-500" />
                      <span>{isAr ? '320 طلباً شهرياً عبر المتجر' : '320 monthly orders automated'}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <p className="text-4xl font-black text-slate-900 font-mono">4x</p>
                  <span className="text-xs font-bold text-slate-500 mt-1 block">{isAr ? 'نمو المبيعات خلال 6 أشهر' : 'Sales growth in 6 months'}</span>
                </div>
              </div>

              {/* Card 2 */}
              <div className="rounded-2xl border border-teal-200 bg-white p-6 shadow-sm text-right flex flex-col justify-between ring-2 ring-teal-500/20 hover:shadow-md transition-shadow">
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 mb-4">{isAr ? 'علامة عبايات — البصرة' : 'Abaya Brand — Basra'}</h4>
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-xs text-red-600 font-medium">
                      <span className="size-2 rounded-full bg-red-500" />
                      <span>{isAr ? 'كانت السلات المتروكة تضيع' : 'Abandoned carts were lost'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-emerald-600 font-extrabold">
                      <span className="size-2 rounded-full bg-emerald-500" />
                      <span>{isAr ? 'استرجاع تلقائي عبر واتساب' : 'Automated WhatsApp recovery'}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <p className="text-4xl font-black text-teal-700 font-mono">22%</p>
                  <span className="text-xs font-bold text-slate-500 mt-1 block">{isAr ? 'من السلات المتروكة تحولت إلى طلبات' : 'Abandoned carts turned into orders'}</span>
                </div>
              </div>

              {/* Card 3 */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm text-right flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 mb-4">{isAr ? 'متجر إلكترونيات — أربيل' : 'Electronics Store — Erbil'}</h4>
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-xs text-red-600 font-medium">
                      <span className="size-2 rounded-full bg-red-500" />
                      <span>{isAr ? 'إعلانات دون تتبع واسع' : 'Ads without conversion tracking'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-emerald-600 font-extrabold">
                      <span className="size-2 rounded-full bg-emerald-500" />
                      <span>{isAr ? 'بكسل + CAPI من اللوحة' : 'Pixel + CAPI integrated'}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <p className="text-4xl font-black text-slate-900 font-mono">2.8x</p>
                  <span className="text-xs font-bold text-slate-500 mt-1 block">{isAr ? 'تحسن العائد على الإعلانات (ROAS)' : 'ROAS return on ad spend'}</span>
                </div>
              </div>
            </div>

            <p className="text-xs font-bold text-slate-400 mt-8">
              {t.storiesFooterNote}
            </p>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 7️⃣ FEATURE GRID WITH METRICS */}
        {/* ========================================================================= */}
        <section id="features" className="py-20 px-4 mx-auto max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-extrabold text-teal-700 uppercase tracking-widest block mb-2">{isAr ? 'حلول عملية' : 'Practical Solutions'}</span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900">
              {isAr ? 'كل ميزة تحل مشكلة حقيقية' : 'Every Feature Solves a Real Challenge'}
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                pain: isAr ? '«أضيع ساعات في كتابة بوليصة الشحن»' : '«Spending hours writing waybills»',
                title: isAr ? 'حجز الشحنة وطباعة البوليصة بنقرة واحدة' : 'Waybill Generation in 1 Click',
                desc: isAr ? 'توليد تلقائي لكود الشحنة ZAEEM وطباعة البولايص دفعة واحدة دون كتابة يدوية.' : 'Automatic ZAEEM tracking code generation and bulk waybill printing.',
                metric: isAr ? 'وفر 3 ساعات يومياً' : 'Save 3 hrs daily'
              },
              {
                pain: isAr ? '«التوصيل يتأخر والمندوب لا يجيب»' : '«Couriers delay & don’t pick up»',
                title: isAr ? 'ربط فوري بأسطول شركة الزعيم للشحن' : 'Direct Dispatch with Al-Zaeem Fleet',
                desc: isAr ? 'تغطية كاملة لـ 18 محافظة مع تتبع حي ومباشر لحالة الشحنة حتى تسليم المبلغ.' : 'Full coverage across 18 Iraqi cities with live tracking until payout.',
                metric: isAr ? 'شحن لـ 18 محافظة' : '18 Governorates'
              },
              {
                pain: isAr ? '«أحسب أرباحي بالتخمين وأتفاجأ بالنفاذ»' : '«Guessing profit margins»',
                title: isAr ? 'مخزون دقيق وتقارير مالية لحظية' : 'Inventory & Real-Time Financials',
                desc: isAr ? 'تتبع حركة كل قطعة ومزامنة الأرباح الصافية بعد خصم أجور الشحن تلقائياً.' : 'Track item movement and auto-calculate net profit after shipping fees.',
                metric: isAr ? '100% دقة مخزون' : '100% Accuracy'
              }
            ].map((feat, idx) => (
              <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-600 mb-3">
                    {feat.pain}
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 mb-2">{feat.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{feat.desc}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-black text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
                    {feat.metric}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 8️⃣ BOTTOM CTA BANNER */}
        {/* ========================================================================= */}
        <section className="py-16 px-4 mx-auto max-w-6xl">
          <div className="relative rounded-3xl bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 text-white p-8 md:p-16 text-center shadow-2xl overflow-hidden">
            <div className="absolute -right-20 -top-20 size-80 rounded-full bg-teal-500/20 blur-3xl" />
            <div className="relative z-10 max-w-3xl mx-auto space-y-6">
              <h2 className="text-3xl md:text-6xl font-black leading-tight">
                {isAr ? 'حوّل فكرتك إلى متجر ينمو كل يوم' : 'Turn Your Vision Into a Scalable Store'}
              </h2>
              <p className="text-sm md:text-base text-teal-100 max-w-xl mx-auto leading-relaxed">
                {isAr ? 'انضم لمئات التجار الذين يثقون بمنصة الزعيم وأسطول شحنها لترتيب وإدارة أعمالهم.' : 'Join hundreds of merchants who rely on Al-Zaeem SaaS and logistics fleet.'}
              </p>
              <div className="pt-4">
                <Link
                  href="/sign-up"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white hover:bg-slate-100 px-9 py-4 text-sm font-black text-teal-900 shadow-xl transition-transform hover:scale-105"
                >
                  <span>{t.ctaPrimary}</span>
                  {isAr ? <ArrowLeft className="size-4" /> : <ArrowRight className="size-4" />}
                </Link>
              </div>
              <p className="text-xs font-medium text-teal-200/80">
                {t.trustText}
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 9️⃣ FOOTER */}
        {/* ========================================================================= */}
        <footer className="border-t border-slate-200 bg-slate-900 text-white pt-16 pb-12 px-4">
          <div className="mx-auto max-w-6xl grid gap-10 sm:grid-cols-2 lg:grid-cols-4 mb-12">
            <div className="lg:col-span-2 space-y-4">
              <Logo showSubtitle={false} />
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                {isAr
                  ? 'منصة الزعيم هي المنظومة المتكاملة لإدارة المتاجر الإلكترونية وربط الشحنات مباشرة بخدمات الشحن السريع والدفع عند الاستلام.'
                  : 'Al-Zaeem is the premier all-in-one SaaS platform connecting online stores directly with logistics fleets and cash on delivery.'}
              </p>
              <div className="flex items-center gap-2 text-xs font-bold text-teal-400">
                <span>📍 {isAr ? 'القاهرة · الجيزة · الإسكندرية · جميع المحافظات' : 'Cairo · Giza · Alexandria · All Governorates'}</span>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-extrabold text-xs text-white">{isAr ? 'الشركة' : 'Company'}</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><a href="#features" className="hover:text-white transition-colors">{t.navFeatures}</a></li>
                <li><a href="#templates" className="hover:text-white transition-colors">{t.navTemplates}</a></li>
                <li><a href="#stories" className="hover:text-white transition-colors">{t.navStories}</a></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-extrabold text-xs text-white">{isAr ? 'الدعم والسياسات' : 'Support & Policy'}</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><Link href="/support" className="hover:text-white transition-colors">{isAr ? 'المساعدة والدعم' : 'Help & Support'}</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">{isAr ? 'الشروط والسياسات' : 'Terms & Policies'}</a></li>
              </ul>
            </div>
          </div>

          <div className="mx-auto max-w-6xl border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <p>© 2026 {isAr ? 'شركة الزعيم للشحن والتجارة الإلكترونية — جميع الحقوق محفوظة' : 'Al-Zaeem E-Commerce & Shipping Co. — All rights reserved'}</p>
          </div>
        </footer>

        {/* ========================================================================= */}
        {/* 🔟 FLOATING STICKY BOTTOM BAR (from Image 2) */}
        {/* ========================================================================= */}
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md">
          <div className="flex items-center justify-between gap-4 rounded-full border border-slate-200/90 bg-white/95 px-5 py-2.5 shadow-2xl backdrop-blur-md">
            <span className="text-xs font-extrabold text-slate-800">{t.stickyQuestion}</span>
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center rounded-full bg-teal-700 hover:bg-teal-800 px-5 py-2 text-xs font-black text-white shadow-md transition-all hover:scale-105"
            >
              {t.stickyBtn}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
