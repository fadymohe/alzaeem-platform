import { useState } from 'react';

import { Link } from 'wouter';
import { Logo } from '../components/common/Logo';
import { DashboardMockupHero } from '../components/home/DashboardMockupHero';
import { PlatformVideoShowcase } from '../components/home/PlatformVideoShowcase';
import { TransformationDiagram } from '../components/home/TransformationDiagram';
import { EcosystemRadialHub } from '../components/home/EcosystemRadialHub';
import { HomePricingSection } from '../components/home/HomePricingSection';
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
      ? 'مجاناً لأول 5 طلبات — بدون بطاقة ائتمان — بدون عمولة على المبيعات'
      : 'Free for first 5 orders — No credit card required — 0% sales commission',
    navFeatures: isAr ? 'المميزات' : 'Features',
    navShipping: isAr ? 'الشحن والتوصيل' : 'Shipping',
    navPricing: isAr ? 'الأسعار' : 'Pricing',
    navTemplates: isAr ? 'التصاميم' : 'Templates',
    navStories: isAr ? 'قصص النجاح' : 'Success Stories',
    navBlog: isAr ? 'المدونة' : 'Blog',
    navFaq: isAr ? 'الأسئلة الشائعة' : 'FAQ',
    signIn: isAr ? 'تسجيل الدخول' : 'Sign In',
    startFree: isAr ? 'ابدأ مجاناً' : 'Start Free',
    countryBadge: isAr ? 'العراق' : 'Iraq',

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

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <main dir={isAr ? 'rtl' : 'ltr'} className="min-h-[100dvh] overflow-x-hidden bg-white text-slate-900 font-sans select-none">
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
            {/* Logo Clean (No Country Badge) */}
            <div className="flex items-center gap-3">
              <Logo showSubtitle={false} />
            </div>

            {/* Nav Links With Smooth Scrolling */}
            <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-slate-600">
              <button
                type="button"
                onClick={() => scrollToSection('how-it-works')}
                className="transition-colors hover:text-teal-700 cursor-pointer font-bold flex items-center gap-1.5 text-teal-800 bg-teal-50/80 px-3 py-1 rounded-full border border-teal-100 hover:bg-teal-100/70"
              >
                <Play className="size-3 text-teal-600 fill-teal-600" />
                <span>{isAr ? 'كيف تعمل المنصة' : 'How It Works'}</span>
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('features')}
                className="transition-colors hover:text-teal-700 cursor-pointer font-bold"
              >
                {t.navFeatures}
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('pricing')}
                className="transition-colors hover:text-teal-700 cursor-pointer font-bold flex items-center gap-1 text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200"
              >
                <Globe className="size-3 text-emerald-600" />
                <span>{t.navPricing}</span>
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('stories')}
                className="transition-colors hover:text-teal-700 cursor-pointer font-bold"
              >
                {t.navStories}
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('shipping')}
                className="transition-colors hover:text-teal-700 cursor-pointer font-bold"
              >
                {t.navShipping}
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('blog')}
                className="transition-colors hover:text-teal-700 cursor-pointer font-bold"
              >
                {t.navBlog}
              </button>
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
        <section className="relative mx-auto max-w-5xl px-4 pt-14 pb-8 text-center md:pt-20 md:pb-12 overflow-hidden">
          {/* Ambient background pulsing orbs */}
          <div className="absolute top-10 left-1/2 -translate-x-1/2 size-96 rounded-full bg-gradient-to-tr from-teal-400/15 via-emerald-400/10 to-transparent blur-3xl pointer-events-none animate-pulse-glow -z-10" />

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

            <button
              type="button"
              onClick={() => scrollToSection('how-it-works')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-7 py-4 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              <Play className="size-4 text-teal-700 fill-teal-700" />
              <span>{t.ctaSecondary}</span>
            </button>
          </div>

          <p className="mt-5 text-xs font-bold text-slate-400">
            {t.trustText}
          </p>

          {/* Quick Metrics Bar */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-2xl mx-auto pt-6 border-t border-slate-100">
            <div className="p-3 rounded-2xl bg-white/60 border border-slate-100 shadow-xs">
              <p className="text-xl sm:text-2xl font-black text-slate-900 font-mono">+500</p>
              <p className="text-[11px] font-bold text-slate-500 mt-0.5">{isAr ? 'متجر عراقي نشط' : 'Active Stores'}</p>
            </div>
            <div className="p-3 rounded-2xl bg-white/60 border border-slate-100 shadow-xs">
              <p className="text-xl sm:text-2xl font-black text-teal-700 font-mono">18</p>
              <p className="text-[11px] font-bold text-slate-500 mt-0.5">{isAr ? 'محافظة مغطاة بالشحن' : 'Governorates'}</p>
            </div>
            <div className="col-span-2 sm:col-span-1 p-3 rounded-2xl bg-white/60 border border-slate-100 shadow-xs">
              <p className="text-xl sm:text-2xl font-black text-emerald-600 font-mono">99.4%</p>
              <p className="text-[11px] font-bold text-slate-500 mt-0.5">{isAr ? 'نسبة تسليم الشحنات' : 'Delivery Rate'}</p>
            </div>
          </div>

          {/* Governorates Ticker Banner */}
          <div className="mt-8 overflow-hidden rounded-full bg-slate-100/80 border border-slate-200/70 py-2 px-3 max-w-3xl mx-auto flex items-center gap-3">
            <span className="shrink-0 text-[11px] font-black text-teal-900 bg-teal-100/90 px-3 py-1 rounded-full flex items-center gap-1.5">
              <MapPin className="size-3 text-teal-700" />
              <span>{isAr ? 'تغطية الشحن' : 'Fleet Route'}</span>
            </span>
            <div className="overflow-hidden whitespace-nowrap flex-1">
              <div className="inline-flex gap-4 text-xs font-bold text-slate-600 animate-marquee-row">
                <span>بغداد •</span>
                <span>البصرة •</span>
                <span>أربيل •</span>
                <span>نينوى •</span>
                <span>النجف •</span>
                <span>كربلاء •</span>
                <span>الأنبار •</span>
                <span>بابل •</span>
                <span>السليمانية •</span>
                <span>كركوك •</span>
                <span>ديالى •</span>
                <span>ذي قار •</span>
                <span>ميسان •</span>
                <span>واسط •</span>
                <span>صلاح الدين •</span>
                <span>دهوك •</span>
                <span>المثنى •</span>
                <span>القادسية •</span>
                <span>بغداد •</span>
                <span>البصرة •</span>
                <span>أربيل •</span>
                <span>نينوى •</span>
                <span>النجف •</span>
                <span>كربلاء •</span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3️⃣ INTERACTIVE DASHBOARD MOCKUP (Extracted from provided design) */}
        {/* ========================================================================= */}
        <section id="demo" className="mx-auto max-w-6xl px-2 sm:px-4 pb-16">
          <DashboardMockupHero isAr={isAr} />
        </section>

        {/* ========================================================================= */}
        {/* 3.5️⃣ PLATFORM ANIMATED VIDEO SHOWCASE (Anchored by #how-it-works) */}
        {/* ========================================================================= */}
        <PlatformVideoShowcase isAr={isAr} />

        {/* ========================================================================= */}
        {/* 4️⃣ TRANSFORMATION DIAGRAM (Before vs After with Al-Zaeem Engine) */}
        {/* ========================================================================= */}
        <TransformationDiagram isAr={isAr} />

        {/* ========================================================================= */}
        {/* 4.5️⃣ UNIFIED ECOSYSTEM RADIAL HUB (from Image 1 with Al-Zaeem Logo) */}
        {/* ========================================================================= */}
        <EcosystemRadialHub isAr={isAr} />

        {/* ========================================================================= */}
        {/* 5️⃣ REAL MERCHANT STORIES SECTION */}
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

            {/* 3 Metric Cards with Interactive Elevate Effect */}
            <div className="grid gap-6 md:grid-cols-3 mt-14">
              {/* Card 1 */}
              <div className="group rounded-3xl border border-slate-200/90 bg-white p-7 shadow-sm text-right flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="size-2 rounded-full bg-emerald-500 animate-ping" />
                    <h4 className="font-extrabold text-sm text-slate-900">{isAr ? 'متجر أزياء — بغداد' : 'Fashion Store — Baghdad'}</h4>
                  </div>
                  <div className="space-y-2.5 mb-6">
                    <div className="flex items-center gap-2 text-xs text-red-600 font-medium bg-red-50/70 p-2 rounded-xl border border-red-100">
                      <span className="size-2 rounded-full bg-red-500 shrink-0" />
                      <span>{isAr ? 'سابقاً: البيع اليدوي عبر رسائل إنستغرام' : 'Was selling via Instagram DMs'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-emerald-700 font-extrabold bg-emerald-50/80 p-2 rounded-xl border border-emerald-100">
                      <span className="size-2 rounded-full bg-emerald-500 shrink-0" />
                      <span>{isAr ? 'حالياً: 320 طلباً شهرياً تلقائياً عبر المتجر' : '320 monthly orders automated'}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-baseline justify-between">
                  <span className="text-xs font-bold text-slate-500">{isAr ? 'نمو المبيعات خلال 6 أشهر' : 'Sales growth in 6 months'}</span>
                  <p className="text-4xl font-black text-slate-900 font-mono group-hover:text-teal-700 transition-colors">4x</p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="group rounded-3xl border border-teal-200 bg-white p-7 shadow-md text-right flex flex-col justify-between ring-2 ring-teal-500/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="size-2 rounded-full bg-teal-500 animate-ping" />
                    <h4 className="font-extrabold text-sm text-slate-900">{isAr ? 'علامة عبايات — البصرة' : 'Abaya Brand — Basra'}</h4>
                  </div>
                  <div className="space-y-2.5 mb-6">
                    <div className="flex items-center gap-2 text-xs text-red-600 font-medium bg-red-50/70 p-2 rounded-xl border border-red-100">
                      <span className="size-2 rounded-full bg-red-500 shrink-0" />
                      <span>{isAr ? 'سابقاً: السلات المتروكة تضيع دون متابعة' : 'Abandoned carts were lost'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-teal-700 font-extrabold bg-teal-50/80 p-2 rounded-xl border border-teal-100">
                      <span className="size-2 rounded-full bg-teal-500 shrink-0" />
                      <span>{isAr ? 'حالياً: استرجاع تلقائي عبر رسائل واتساب' : 'Automated WhatsApp recovery'}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-baseline justify-between">
                  <span className="text-xs font-bold text-slate-500">{isAr ? 'من السلات تحولت إلى طلبات فعلية' : 'Abandoned carts converted'}</span>
                  <p className="text-4xl font-black text-teal-700 font-mono group-hover:scale-105 transition-transform">22%</p>
                </div>
              </div>

              {/* Card 3 */}
              <div className="group rounded-3xl border border-slate-200/90 bg-white p-7 shadow-sm text-right flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="size-2 rounded-full bg-emerald-500 animate-ping" />
                    <h4 className="font-extrabold text-sm text-slate-900">{isAr ? 'متجر إلكترونيات — أربيل' : 'Electronics Store — Erbil'}</h4>
                  </div>
                  <div className="space-y-2.5 mb-6">
                    <div className="flex items-center gap-2 text-xs text-red-600 font-medium bg-red-50/70 p-2 rounded-xl border border-red-100">
                      <span className="size-2 rounded-full bg-red-500 shrink-0" />
                      <span>{isAr ? 'سابقاً: إعلانات ممولة بدون تتبع للتحويلات' : 'Ads without conversion tracking'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-emerald-700 font-extrabold bg-emerald-50/80 p-2 rounded-xl border border-emerald-100">
                      <span className="size-2 rounded-full bg-emerald-500 shrink-0" />
                      <span>{isAr ? 'حالياً: ربط Meta Pixel و CAPI من المنصة' : 'Pixel + CAPI integrated'}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-baseline justify-between">
                  <span className="text-xs font-bold text-slate-500">{isAr ? 'تحسن العائد على الإعلانات (ROAS)' : 'ROAS return on ad spend'}</span>
                  <p className="text-4xl font-black text-slate-900 font-mono group-hover:text-emerald-600 transition-colors">2.8x</p>
                </div>
              </div>
            </div>

            <p className="text-xs font-bold text-slate-400 mt-8">
              {t.storiesFooterNote}
            </p>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6️⃣ FOUR CORE PILLARS OF GROWTH (Streamlined & Non-Redundant) */}
        {/* ========================================================================= */}
        <section id="features" className="py-20 px-4 mx-auto max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-extrabold text-teal-700 uppercase tracking-widest block mb-2">{isAr ? 'ركائز المنصة' : 'Core Pillars'}</span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900">
              {isAr ? 'أدوات ذكية متكاملة لإنجاح تجارتك' : 'Smart Tools Built for Your Store'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-3 font-medium">
              {isAr
                ? 'كل ركيزة مصممة لتوفير وقتك وزيادة أرباحك وتخليصك من المهام اليدوية المجهدة.'
                : 'Every tool is built to save your hours, scale sales, and automate tedious manual tasks.'}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                icon: Store,
                title: isAr ? 'متجر إلكتروني فوري وسريع' : 'Instant High-Speed Storefront',
                desc: isAr
                  ? 'واجهة شراء سريعة بدون تعقيدات، تدعم الطلب بنقرة واحدة عبر الموبايل وعرض المنتجات بصور وفيديوهات جذابة.'
                  : 'Fast checkout optimized for mobile shoppers with 1-click express ordering and rich media.',
                tag: isAr ? 'تجربة شراء فائقة السلاسة' : 'Seamless UX'
              },
              {
                icon: MessageSquare,
                title: isAr ? 'أتمتة الواتساب الذكية' : 'Smart WhatsApp Automations',
                desc: isAr
                  ? 'إرسال رسائل تأكيد فورية للزبون مع تفاصيل طلبه، وإشعارات الشحن التلقائية، واسترجاع السلات المتروكة لزيادة مبيعاتك.'
                  : 'Automated WhatsApp order confirmations, live delivery updates, and smart cart recovery messages.',
                tag: isAr ? 'تأكيد الطلب واسترجاع السلات' : 'Automated Recovery'
              },
              {
                icon: BarChart3,
                title: isAr ? 'مخزون ذكي وحساب صافي الأرباح' : 'Smart Inventory & Real Margins',
                desc: isAr
                  ? 'مزامنة دقيقة لحركة المخزون وتنبيهات النفاذ، مع احتساب صافي الأرباح تلقائياً بعد خصم مصاريف الشحن والمندوب.'
                  : 'Live inventory sync with low-stock alerts and automatic net profit margin calculations.',
                tag: isAr ? 'تقارير مالية لحظية 100%' : '100% Financial Clarity'
              },
              {
                icon: Zap,
                title: isAr ? 'تتبع الإعلانات والـ Pixel' : 'Pixel & Conversion API (CAPI)',
                desc: isAr
                  ? 'ربط مباشر بضغطة زر مع Meta Pixel و TikTok Events API لتتبع الشراء الفعلي بدقة وتحسين نتائج حملاتك الإعلانية.'
                  : '1-click native integration with Meta Pixel & TikTok CAPI to optimize ad campaigns and maximize ROAS.',
                tag: isAr ? 'رفع العائد الإعلاني ROAS' : 'Maximized ROAS'
              }
            ].map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="rounded-3xl border border-slate-200/90 bg-white p-7 shadow-sm flex flex-col justify-between hover:shadow-xl hover:border-teal-300 transition-all duration-300 group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="size-12 rounded-2xl bg-teal-50 text-teal-700 grid place-items-center group-hover:scale-110 group-hover:bg-teal-700 group-hover:text-white transition-all duration-300">
                        <Icon className="size-6" />
                      </div>
                      <span className="text-[11px] font-bold text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
                        {feat.tag}
                      </span>
                    </div>
                    <h3 className="text-lg font-black text-slate-900 group-hover:text-teal-800 transition-colors">{feat.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6.5️⃣ PRICING SECTION (Anchored by #pricing) */}
        {/* ========================================================================= */}
        <HomePricingSection isAr={isAr} />

        {/* ========================================================================= */}
        {/* 7️⃣ SHIPPING & FLEET POWERHOUSE (Anchored by #shipping) */}
        {/* ========================================================================= */}
        <section id="shipping" className="py-20 px-4 bg-slate-950 text-white border-y border-slate-800 relative overflow-hidden">
          {/* Ambient background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] rounded-full bg-teal-500/10 blur-[140px] pointer-events-none" />

          <div className="relative z-10 mx-auto max-w-6xl">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="inline-block rounded-full bg-teal-500/20 border border-teal-500/40 px-4 py-1.5 text-xs font-black text-teal-300 mb-3">
                {isAr ? '● أسطول الشحن واللوجستيات' : '● Logistics Fleet'}
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-white">
                {isAr ? 'شحن فوري بأسطول شركة الزعيم' : 'Direct Dispatch with Al-Zaeem Fleet'}
              </h2>
              <p className="text-xs md:text-sm text-slate-400 mt-2 max-w-xl mx-auto leading-relaxed">
                {isAr
                  ? 'منصتك متصلة مباشرة بشركة الزعيم للشحن: إصدار بوليصة فوري، أسطول يغطي كل المحافظات، وتحصيل مالي موثوق وأمين.'
                  : 'Your store directly integrated with Al-Zaeem shipping fleet: 1-click waybills, all 18 governorates, and secure COD.'}
              </p>
            </div>

            {/* Interactive Logistics Flow Stepper */}
            <div className="mb-14 p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-md shadow-2xl">
              <h4 className="text-xs font-bold text-teal-400 text-center mb-6 tracking-wide uppercase">
                {isAr ? 'مسار الشحنة التلقائي من متجرك وحتى استلام الأرباح' : 'Automated Fulfillment Workflow'}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                {[
                  { step: '1', title: isAr ? 'طلب جديد بالمتجر' : 'New Order', desc: isAr ? 'يصلك إشعار فوري بالطلب' : 'Instant push notification' },
                  { step: '2', title: isAr ? 'طباعة بوليصة ZAEEM' : '1-Click Waybill', desc: isAr ? 'إصدار تلقائي بكود التتبع' : 'Auto tracking code generated' },
                  { step: '3', title: isAr ? 'استلام أسطول الزعيم' : 'Fleet Dispatch', desc: isAr ? 'استلام الشحنة من باب متجرك' : 'Doorstep courier pickup' },
                  { step: '4', title: isAr ? 'تحصيل الكاش وتصفية الحساب' : 'COD & Payout', desc: isAr ? 'إيداع الأرباح في محفظتك' : 'Secure earnings deposited' },
                ].map((s, idx) => (
                  <div key={idx} className="relative p-4 rounded-2xl bg-slate-950/70 border border-slate-800/90 flex flex-col items-center justify-center space-y-2">
                    <span className="size-8 rounded-full bg-teal-500/20 text-teal-400 border border-teal-500/40 text-xs font-black grid place-items-center">
                      {s.step}
                    </span>
                    <h5 className="font-black text-xs sm:text-sm text-white">{s.title}</h5>
                    <p className="text-[11px] text-slate-400 leading-tight">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 3 Core Logistics Value Cards */}
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-7 space-y-3 hover:border-teal-500/50 transition-colors">
                <div className="size-12 rounded-2xl bg-teal-500/10 text-teal-400 grid place-items-center mb-2">
                  <Truck className="size-6" />
                </div>
                <h3 className="font-extrabold text-base text-white">{isAr ? 'تغطية 18 محافظة عراقية' : '18 Governorates Coverage'}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {isAr ? 'توصيل سريع من بغداد إلى كافة مراكز وأقضية المحافظات خلال 24 إلى 48 ساعة بأعلى معدلات نجاح التسليم.' : 'Fast parcel delivery from Baghdad across all 18 Iraqi governorates within 24-48 hours.'}
                </p>
              </div>

              <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-7 space-y-3 hover:border-teal-500/50 transition-colors">
                <div className="size-12 rounded-2xl bg-teal-500/10 text-teal-400 grid place-items-center mb-2">
                  <ShieldCheck className="size-6" />
                </div>
                <h3 className="font-extrabold text-base text-white">{isAr ? 'تحصيل المبالغ النقدية (COD)' : 'Cash On Delivery'}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {isAr ? 'تحصيل أموال طلباتك بأمان تام وتصفية الحسابات وإيداع الأرباح الصافية في حسابك أو محفظتك بانتظام ودقة.' : 'Secure COD collection with prompt, transparent payout schedules directly into your account.'}
                </p>
              </div>

              <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-7 space-y-3 hover:border-teal-500/50 transition-colors">
                <div className="size-12 rounded-2xl bg-teal-500/10 text-teal-400 grid place-items-center mb-2">
                  <Zap className="size-6" />
                </div>
                <h3 className="font-extrabold text-base text-white">{isAr ? 'تتبع مباشر للزبائن' : 'Live Customer Tracking'}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {isAr ? 'صفحة تتبع حية لكل شحنة تتيح للعميل معرفة خط سير الطلب لحظة بلحظة، مما يخفف استفسارات خدمة العملاء بنسبة 80%.' : 'Real-time parcel tracking page for buyers, eliminating repetitive "Where is my order?" messages.'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 8️⃣ FAQ & OFFICIAL HEADQUARTERS SECTION (Anchored by #blog) */}
        {/* ========================================================================= */}
        <section id="blog" className="py-20 px-4 mx-auto max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-black text-teal-700 tracking-widest uppercase block mb-2">{isAr ? 'دليلك للنجاح' : 'Guide to Success'}</span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900">
              {isAr ? 'الأسئلة الشائعة والمعلومات الرسمية' : 'FAQ & Official Information'}
            </h2>
          </div>

          <div className="grid gap-4 max-w-3xl mx-auto">
            {[
              {
                q: isAr ? 'كيف تعمل الخطة المجانية التجريبية؟' : 'How does the free trial plan work?',
                a: isAr ? 'تحصل فور إنشاء الحساب على متجر مجاني بالكامل مع نطاق فرعي وإمكانية تجربة شحن أول 5 شحنات مجاناً وبدون أي عمولة على المبيعات.' : 'You get an online store immediately with 5 free shipments and 0% sales commission.'
              },
              {
                q: isAr ? 'هل يتم ربط الشحنات تلقائياً بشركة الزعيم؟' : 'Are orders dispatched automatically with Al-Zaeem?',
                a: isAr ? 'نعم، بمجرد تأكيد الطلب، يمكنك إصدار بوليصة الشحن بنقرة زر واحدة وتحديد موقع الاستلام من مقر متجرك، وسيقوم المندوب باستلامها فوراً.' : 'Yes, 1-click waybill generation directly from your merchant dashboard with automatic driver pickup.'
              },
              {
                q: isAr ? 'أين يقع المقر الرئيسي لشركة الزعيم؟' : 'Where is Al-Zaeem headquarters located?',
                a: isAr ? 'يقع مقرنا الرئيسي في: بغداد - سريع الدورة - مقابل شركة تشانجان. يمكنك زيارتنا أو التواصل معنا هاتفياً على 07822999919 أو 07722999919.' : 'Our HQ is in Baghdad - Dora Highway - Opposite Changan Co. Phone: 07822999919 / 07722999919.'
              },
              {
                q: isAr ? 'كيف يتم تسليم أرباح ومبالغ الدفع عند الاستلام (COD)؟' : 'How are COD payouts received?',
                a: isAr ? 'تتم تصفية مبالغ الطلبات المسلمة دورياً وبشكل تلقائي، ويمكنك استلام أرباحك نقدياً أو عبر المحافظ الإلكترونية مثل زين كاش أو الحساب البنكي.' : 'Delivered order funds are settled regularly and paid out via Cash, Zain Cash, or Bank Transfer.'
              }
            ].map((faq, i) => (
              <details key={i} className="group p-5 rounded-3xl border border-slate-200 bg-white shadow-xs text-right cursor-pointer open:ring-2 open:ring-teal-500/20 transition-all duration-200">
                <summary className="flex items-center justify-between font-black text-sm text-slate-900 list-none select-none">
                  <span>{faq.q}</span>
                  <span className="size-6 rounded-full bg-slate-100 group-open:bg-teal-700 group-open:text-white grid place-items-center text-xs font-bold transition-all duration-300 group-open:rotate-180">
                    ↓
                  </span>
                </summary>
                <p className="text-xs text-slate-600 leading-relaxed mt-3 pt-3 border-t border-slate-100">{faq.a}</p>
              </details>
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
        {/* 9️⃣ FOOTER (Flush to bottom, with official headquarters and phone numbers) */}
        {/* ========================================================================= */}
        <footer className="border-t border-slate-800 bg-slate-950 text-white pt-16 pb-28 px-4">
          <div className="mx-auto max-w-6xl grid gap-10 sm:grid-cols-2 lg:grid-cols-4 mb-12">
            <div className="lg:col-span-2 space-y-4">
              <Logo showSubtitle={false} inverse />
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                {isAr
                  ? 'منصة الزعيم هي المنظومة المتكاملة الأولى لإدارة المتاجر الإلكترونية وربط الشحنات مباشرة بأسطول شركة الزعيم للشحن والدفع عند الاستلام.'
                  : 'Al-Zaeem is the premier all-in-one SaaS platform connecting online stores directly with Al-Zaeem Logistics Fleet & COD.'}
              </p>
              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-start gap-2">
                  <span className="text-teal-400 font-bold shrink-0">📍 المقر الرئيسي:</span>
                  <span>بغداد - سريع الدورة - مقابل شركة تشانجان</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-teal-400 font-bold">📞 هاتف التواصل:</span>
                  <a href="tel:07822999919" dir="ltr" className="font-mono font-bold text-white hover:text-teal-300 transition-colors">07822999919</a>
                  <span>أو</span>
                  <a href="tel:07722999919" dir="ltr" className="font-mono font-bold text-white hover:text-teal-300 transition-colors">07722999919</a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">💬 واتساب مباشر:</span>
                  <a href="https://wa.me/9647822999919" target="_blank" rel="noopener noreferrer" dir="ltr" className="font-mono font-bold text-emerald-300 hover:underline">
                    +964 782 299 9919
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-teal-400 font-bold">✉️ البريد الإلكتروني:</span>
                  <a href="mailto:info@zaeem.shop" className="hover:text-teal-300 font-mono text-white transition-colors">info@zaeem.shop</a>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-extrabold text-xs text-white">{isAr ? 'الشركة والتنقل' : 'Navigation'}</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><button type="button" onClick={() => scrollToSection('how-it-works')} className="hover:text-white transition-colors cursor-pointer">{isAr ? 'كيف تعمل المنصة' : 'How It Works'}</button></li>
                <li><button type="button" onClick={() => scrollToSection('stories')} className="hover:text-white transition-colors cursor-pointer">{t.navStories}</button></li>
                <li><button type="button" onClick={() => scrollToSection('shipping')} className="hover:text-white transition-colors cursor-pointer">{t.navShipping}</button></li>
                <li><button type="button" onClick={() => scrollToSection('blog')} className="hover:text-white transition-colors cursor-pointer">{t.navBlog}</button></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-extrabold text-xs text-white">{isAr ? 'الدعم والسياسات' : 'Support & Policy'}</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><Link href="/support" className="hover:text-white transition-colors">{isAr ? 'المساعدة والدعم' : 'Help & Support'}</Link></li>
                <li><Link href="/sign-in" className="hover:text-white transition-colors">{isAr ? 'تسجيل الدخول' : 'Sign In'}</Link></li>
                <li><Link href="/sign-up" className="hover:text-white transition-colors">{isAr ? 'فتح متجر جديد' : 'Open Store'}</Link></li>
              </ul>
            </div>
          </div>

          <div className="mx-auto max-w-6xl border-t border-slate-800/80 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <p>© 2026 {isAr ? 'شركة الزعيم للشحن والتجارة الإلكترونية — جميع الحقوق محفوظة — جمهورية العراق' : 'Al-Zaeem E-Commerce & Shipping Co. — All rights reserved'}</p>
            <p className="text-[11px] text-slate-400">بغداد - سريع الدورة - مقابل شركة تشانجان</p>
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
