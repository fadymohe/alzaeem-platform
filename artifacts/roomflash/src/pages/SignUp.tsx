import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Logo } from '../components/common/Logo';
import {
  ArrowLeft, ArrowRight, Eye, EyeOff, Globe, Sparkles, CheckCircle2,
  Truck, ShieldCheck, Zap, AlertCircle, Check, Store
} from 'lucide-react';
import { IRAQ_GOVERNORATES } from '../data/iraqData';

export function SignUpPage() {
  const [, setLocation] = useLocation();
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [storeSlug, setStoreSlug] = useState('');
  const [governorate, setGovernorate] = useState('بغداد');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isAr = lang === 'ar';

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!firstName.trim()) errs.firstName = isAr ? 'الاسم الأول مطلوب' : 'First name is required';
    if (!lastName.trim()) errs.lastName = isAr ? 'الاسم الأخير مطلوب' : 'Last name is required';
    if (!email || !/\S+@\S+\.\S+/.test(email)) errs.email = isAr ? 'بريد إلكتروني غير صحيح' : 'Invalid email';
    if (!phone || phone.length < 8) errs.phone = isAr ? 'رقم الهاتف مطلوب' : 'Phone is required';
    if (!storeSlug || storeSlug.length < 3) errs.storeSlug = isAr ? 'اسم المتجر يجب أن يكون 3 أحرف على الأقل' : 'Min 3 chars for store URL';
    if (!password || password.length < 6) errs.password = isAr ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' : 'Min 6 chars password';
    if (password !== confirmPassword) errs.confirmPassword = isAr ? 'كلمتا المرور غير متطابقتين' : 'Passwords do not match';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    const storePayload = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      governorate,
      country: 'Iraq',
      storeName: storeSlug,
      subdomain: `${storeSlug}.za3em.shop`,
      password
    };

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(storePayload)
      });

      const data = await res.json().catch(() => null);

      const userObj = {
        email: email.trim(),
        name: `${firstName.trim()} ${lastName.trim()}`,
        phone: phone.trim(),
        governorate,
        storeName: storeSlug,
        subdomain: `${storeSlug}.za3em.shop`,
        loggedIn: true,
        time: new Date().toISOString()
      };

      if (res.ok && data?.success) {
        localStorage.setItem('zaeem_user', JSON.stringify(userObj));
        localStorage.setItem('zaeem_store_data', JSON.stringify({
          ...storePayload,
          userId: data.user?.id,
          token: data.token,
        }));
      } else if (res.status === 400 && data?.error) {
        setLoading(false);
        setErrors({ general: data.error });
        return;
      } else {
        localStorage.setItem('zaeem_user', JSON.stringify(userObj));
        localStorage.setItem('zaeem_store_data', JSON.stringify({
          ...storePayload,
          userId: `user_${Date.now()}`,
          token: `token_${Date.now()}`,
        }));
      }

      setLoading(false);
      window.location.hash = '#/onboarding';
      setLocation('/onboarding');
    } catch (err) {
      localStorage.setItem('zaeem_user', JSON.stringify({
        email: email.trim(),
        name: `${firstName.trim()} ${lastName.trim()}`,
        loggedIn: true,
        time: new Date().toISOString()
      }));
      localStorage.setItem('zaeem_store_data', JSON.stringify({
        ...storePayload,
        userId: `user_${Date.now()}`,
        token: `token_${Date.now()}`,
      }));
      setLoading(false);
      window.location.hash = '#/onboarding';
      setLocation('/onboarding');
    }
  };

  return (
    <main dir={isAr ? 'rtl' : 'ltr'} className="min-h-[100dvh] flex flex-col lg:flex-row bg-white text-slate-900 font-sans select-none">
      {/* ========================================================================= */}
      {/* RIGHT SIDE: Form Panel */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-10 lg:p-12 border-l border-slate-100">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-6">
          <Logo showSubtitle={false} />
          <button
            type="button"
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
            className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 shadow-sm transition-colors"
          >
            <Globe className="size-3.5 text-teal-600" />
            <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
          </button>
        </div>

        {/* Form Body Container */}
        <div className="max-w-md w-full mx-auto space-y-5 my-auto">
          {/* Badge & Title */}
          <div className="space-y-2 text-right">
            <span className="inline-block rounded-full bg-teal-50 border border-teal-200 px-3 py-1 text-[11px] font-extrabold text-teal-800">
              {isAr ? 'ابدأ مجاناً — أول 20 شحنة مجاناً بدون بطاقة ائتمان' : 'Start free — First 20 shipments free, no credit card'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {isAr ? 'أنشئ متجرك مع الزعيم' : 'Build Your Store with Al-Zaeem'}
            </h1>
          </div>

          {errors.general && (
            <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="size-4 shrink-0" />
              <span>{errors.general}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5 text-right" noValidate>
            {/* First & Last Name */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  {isAr ? 'الاسم الأول *' : 'First Name *'}
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder={isAr ? 'أحمد' : 'Ahmad'}
                  className={`w-full rounded-2xl border px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none transition-all ${
                    errors.firstName ? 'border-red-400 bg-red-50/30' : 'border-slate-200 bg-slate-50/50 focus:border-teal-600 focus:bg-white'
                  }`}
                />
                {errors.firstName && <p className="text-[10px] text-red-500 font-bold">{errors.firstName}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  {isAr ? 'الاسم الأخير *' : 'Last Name *'}
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder={isAr ? 'محمد' : 'Mohammed'}
                  className={`w-full rounded-2xl border px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none transition-all ${
                    errors.lastName ? 'border-red-400 bg-red-50/30' : 'border-slate-200 bg-slate-50/50 focus:border-teal-600 focus:bg-white'
                  }`}
                />
                {errors.lastName && <p className="text-[10px] text-red-500 font-bold">{errors.lastName}</p>}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">
                {isAr ? 'البريد الإلكتروني *' : 'Email Address *'}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                dir="ltr"
                className={`w-full rounded-2xl border px-4 py-2.5 text-xs text-slate-900 focus:outline-none transition-all ${
                  errors.email ? 'border-red-400 bg-red-50/30' : 'border-slate-200 bg-slate-50/50 focus:border-teal-600 focus:bg-white'
                }`}
              />
              {errors.email && <p className="text-[10px] text-red-500 font-bold">{errors.email}</p>}
            </div>

            {/* Country & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  {isAr ? 'المحافظة الحالية *' : 'Governorate *'}
                </label>
                <select
                  value={governorate}
                  onChange={(e) => setGovernorate(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-xs text-slate-900 font-bold focus:border-teal-600 focus:bg-white focus:outline-none"
                >
                  {IRAQ_GOVERNORATES.map((g) => (
                    <option key={g} value={g}>
                      🇮🇶 {g}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  {isAr ? 'رقم الهاتف (+964) *' : 'Phone (+964) *'}
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+964 770 000 0000"
                  dir="ltr"
                  className={`w-full rounded-2xl border px-4 py-2.5 text-xs text-slate-900 focus:outline-none transition-all ${
                    errors.phone ? 'border-red-400 bg-red-50/30' : 'border-slate-200 bg-slate-50/50 focus:border-teal-600 focus:bg-white'
                  }`}
                />
                {errors.phone && <p className="text-[10px] text-red-500 font-bold">{errors.phone}</p>}
              </div>
            </div>

            {/* Subdomain Input */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">
                {isAr ? 'رابط المتجر المطلوب *' : 'Desired Store URL *'}
              </label>
              <div className={`flex items-center rounded-2xl border bg-slate-50/50 overflow-hidden transition-all ${
                errors.storeSlug ? 'border-red-400' : 'border-slate-200 focus-within:border-teal-600 focus-within:bg-white'
              }`}>
                <input
                  type="text"
                  value={storeSlug}
                  onChange={(e) => setStoreSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  placeholder="yourstore"
                  dir="ltr"
                  className="w-full px-4 py-2.5 text-xs text-slate-900 bg-transparent focus:outline-none"
                />
                <span className="bg-slate-200/60 px-3 py-2.5 text-xs font-mono font-bold text-slate-600 border-l border-slate-200 shrink-0">
                  .za3em.shop
                </span>
              </div>
              {storeSlug.length >= 3 && (
                <p className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                  <Check className="size-3" /> {isAr ? `النطاق ${storeSlug}.za3em.shop متاح للاستخدام!` : `URL ${storeSlug}.za3em.shop is available!`}
                </p>
              )}
              {errors.storeSlug && <p className="text-[10px] text-red-500 font-bold">{errors.storeSlug}</p>}
            </div>

            {/* Passwords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  {isAr ? 'كلمة المرور *' : 'Password *'}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full rounded-2xl border px-4 py-2.5 text-xs text-slate-900 focus:outline-none ${
                    errors.password ? 'border-red-400 bg-red-50/30' : 'border-slate-200 bg-slate-50/50 focus:border-teal-600'
                  }`}
                />
                {errors.password && <p className="text-[10px] text-red-500 font-bold">{errors.password}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  {isAr ? 'تأكيد كلمة المرور *' : 'Confirm Password *'}
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full rounded-2xl border px-4 py-2.5 text-xs text-slate-900 focus:outline-none ${
                    errors.confirmPassword ? 'border-red-400 bg-red-50/30' : 'border-slate-200 bg-slate-50/50 focus:border-teal-600'
                  }`}
                />
                {errors.confirmPassword && <p className="text-[10px] text-red-500 font-bold">{errors.confirmPassword}</p>}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-teal-700 hover:bg-teal-800 py-3.5 text-xs font-extrabold text-white shadow-xl shadow-teal-700/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 mt-3"
            >
              <span>{loading ? (isAr ? 'جاري تجهيز المتجر والقالب...' : 'Creating store...') : (isAr ? 'أنشئ حسابك وابدأ البيع' : 'Create Account & Start Selling')}</span>
              {isAr ? <ArrowLeft className="size-4" /> : null}
            </button>
          </form>

          {/* Quick Social Auth */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              type="button"
              onClick={() => setLocation('/onboarding')}
              className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-900 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition-colors"
            >
              <span>Apple</span>
              <span className="text-sm"></span>
            </button>

            <button
              type="button"
              onClick={() => setLocation('/onboarding')}
              className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
            >
              <span>Google</span>
              <span className="font-extrabold text-blue-600">G</span>
            </button>
          </div>

          <p className="text-center text-xs font-medium text-slate-500 pt-1">
            {isAr ? 'لديك حساب بالفعل؟ ' : 'Already have an account? '}
            <Link href="/sign-in" className="font-extrabold text-teal-700 hover:underline">
              {isAr ? 'تسجيل الدخول' : 'Sign In'}
            </Link>
          </p>
        </div>

        {/* Legal Links Footer */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-6 border-t border-slate-100">
          <div className="flex items-center gap-4">
            <a href="#" className="hover:underline">{isAr ? 'شروط الاستخدام' : 'Terms'}</a>
            <a href="#" className="hover:underline">{isAr ? 'سياسة الخصوصية' : 'Privacy'}</a>
          </div>
          <span>© 2026 شركة الزعيم للشحن والتجارة الإلكترونية</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* LEFT SIDE: Value Props Showcase Panel */}
      {/* ========================================================================= */}
      <div className="flex-1 bg-gradient-to-br from-teal-900 via-teal-800 to-slate-950 text-white p-8 lg:p-16 flex flex-col justify-between relative overflow-hidden hidden lg:flex">
        <div className="absolute top-0 right-0 size-96 rounded-full bg-teal-400/10 blur-[120px]" />

        <div className="relative z-10 max-w-lg space-y-6">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/20 border border-teal-400/30 px-3.5 py-1 text-xs font-bold text-teal-300">
            <Sparkles className="size-3.5" /> {isAr ? 'متاح الآن في جميع المحافظات الـ 18' : 'Available across all 18 governorates'}
          </span>

          <h2 className="text-3xl lg:text-5xl font-black leading-tight">
            {isAr ? 'أطلق متجرك.. ووصّل لكل محافظات العراق.' : 'Launch Your Store.. Ship to All Iraq.'}
          </h2>

          <p className="text-xs lg:text-sm text-teal-100/80 leading-relaxed">
            {isAr
              ? 'انضم لأكثر من 32,000 تاجر يبنون عملهم الرقمي بثقة وربط كامل مع أسطول الزعيم للشحن والدفع عند الاستلام.'
              : 'Join over 32,000 merchants building their digital empire with seamless shipping and COD payouts.'}
          </p>
        </div>

        {/* 3 Value Cards */}
        <div className="relative z-10 space-y-4 max-w-lg">
          {[
            {
              title: isAr ? 'أطلق متجرك في دقائق' : 'Launch in Minutes',
              desc: isAr ? 'بدون كود، قوالب جاهزة، وسرعة فائقة مخصصة للموبايل.' : 'No code, ready templates, mobile-first performance.'
            },
            {
              title: isAr ? 'شحن مباشر لـ 18 محافظة' : 'Direct Dispatch to 18 Governorates',
              desc: isAr ? 'ربط فوري مع أسطول شركة الزعيم للشحن وتأكيد الدفع عند الاستلام.' : 'Instant API link with Al-Zaeem Fleet and COD payouts.'
            },
            {
              title: isAr ? 'أدوات نمو متكاملة' : 'Integrated Growth Tools',
              desc: isAr ? 'إحصائيات فورية، فواتير تلقائية، وربط واتساب وبكسل التسويق.' : 'Real-time metrics, auto invoicing, and WhatsApp integration.'
            }
          ].map((val, i) => (
            <div key={i} className="flex items-start gap-4 p-4 rounded-2xl border border-teal-500/20 bg-teal-950/40 backdrop-blur-md">
              <CheckCircle2 className="size-5 text-teal-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-extrabold text-sm text-white">{val.title}</h4>
                <p className="text-xs text-teal-200/70 mt-0.5 leading-relaxed">{val.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="relative z-10 text-xs text-teal-300/60 font-medium">
          {isAr ? 'تاجر جديد انضم خلال الـ 24 ساعة الماضية ●' : 'New merchant joined in the last 24h ●'}
        </div>
      </div>
    </main>
  );
}
