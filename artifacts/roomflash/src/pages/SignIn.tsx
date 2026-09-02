import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Logo } from '../components/common/Logo';
import { Eye, EyeOff, ArrowLeft, Globe, Mail, Lock, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';

export function SignInPage() {
  const [, setLocation] = useLocation();
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  const isAr = lang === 'ar';

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = isAr ? 'يرجى إدخال بريد إلكتروني صحيح' : 'Please enter a valid email address';
    }
    if (!password || password.length < 6) {
      newErrors.password = isAr ? 'كلمة المرور يجب أن لا تقل عن 6 أحرف' : 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleQuickLogin = () => {
    const defaultUser = {
      email: email.trim() || 'merchant@za3em.shop',
      name: 'تاجر الزعيم الذهبي',
      phone: '07700000000',
      governorate: 'بغداد',
      token: `token_${Date.now()}`,
      loggedIn: true,
      time: new Date().toISOString()
    };
    localStorage.setItem('zaeem_user', JSON.stringify(defaultUser));
    window.location.hash = '#/dashboard';
    setLocation('/dashboard');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    const userObj = {
      email: email.trim(),
      name: email.split('@')[0] || 'التاجر',
      token: `token_${Date.now()}`,
      loggedIn: true,
      time: new Date().toISOString()
    };

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.success && data.user) {
        userObj.name = `${data.user.firstName || ''} ${data.user.lastName || ''}`.trim() || userObj.name;
        userObj.token = data.token || userObj.token;
      }
    } catch (err) {}

    localStorage.setItem('zaeem_user', JSON.stringify(userObj));
    setLoading(false);
    window.location.hash = '#/dashboard';
    setLocation('/dashboard');
  };

  return (
    <main dir={isAr ? 'rtl' : 'ltr'} className="min-h-[100dvh] flex flex-col items-center justify-center bg-slate-50/80 p-4 text-slate-900 font-sans select-none relative">
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-70" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 size-96 rounded-full bg-teal-400/10 blur-[140px]" />
      </div>

      <div className="relative z-10 w-full max-w-md space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between px-2">
          <Logo showSubtitle={false} />
          <button
            type="button"
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
            className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 shadow-sm transition-colors"
          >
            <Globe className="size-3.5 text-teal-600" />
            <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
          </button>
        </div>

        {/* Card Centered Container */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xl shadow-slate-200/60 space-y-6">
          {/* Heading */}
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              {isAr ? 'مرحباً بعودتك' : 'Welcome Back'}
            </h1>
            <p className="text-xs font-medium text-slate-500">
              {isAr ? 'ادخل لإدارة متجرك وشحناتك' : 'Sign in to manage your store and shipments'}
            </p>
          </div>

          {errors.general && (
            <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="size-4 shrink-0" />
              <span>{errors.general}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-right" noValidate>
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                {isAr ? 'البريد الإلكتروني' : 'Email Address'}
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@store.com"
                  dir="ltr"
                  className={`w-full rounded-2xl border px-4 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all pl-10 ${
                    errors.email ? 'border-red-400 bg-red-50/30' : 'border-slate-200 bg-slate-50/50 focus:border-teal-600 focus:bg-white'
                  }`}
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              </div>
              {errors.email && (
                <p className="text-[11px] font-bold text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="size-3" /> {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 block">
                  {isAr ? 'كلمة المرور' : 'Password'}
                </label>
                <a href="#" className="text-[11px] font-bold text-teal-700 hover:underline">
                  {isAr ? 'نسيت كلمة المرور؟' : 'Forgot password?'}
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full rounded-2xl border px-4 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all pl-10 ${
                    errors.password ? 'border-red-400 bg-red-50/30' : 'border-slate-200 bg-slate-50/50 focus:border-teal-600 focus:bg-white'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[11px] font-bold text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="size-3" /> {errors.password}
                </p>
              )}
            </div>

            {/* Primary Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-teal-700 hover:bg-teal-800 py-3.5 text-xs font-extrabold text-white shadow-lg shadow-teal-700/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 mt-2"
            >
              <span>{loading ? (isAr ? 'جاري التحقق والدخول...' : 'Signing in...') : (isAr ? 'تسجيل الدخول' : 'Sign In')}</span>
              {isAr ? <ArrowLeft className="size-4" /> : null}
            </button>

            {/* Quick One-Click Demo Login */}
            <button
              type="button"
              onClick={handleQuickLogin}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-amber-500 hover:bg-amber-400 py-3 text-xs font-black text-slate-950 shadow-md transition-all hover:scale-[1.01] active:scale-[0.99] mt-2"
            >
              <ShieldCheck className="size-4 text-slate-950" />
              <span>{isAr ? 'الدخول السريع التجريبي بضغطة واحدة ⚡' : 'Quick Demo One-Click Login ⚡'}</span>
            </button>
          </form>

          {/* Social Auth Divider */}
          <div className="relative flex items-center justify-center my-4">
            <div className="border-t border-slate-100 w-full" />
            <span className="bg-white px-3 text-[11px] font-bold text-slate-400 absolute">
              {isAr ? 'أو تابع باستخدام' : 'Or continue with'}
            </span>
          </div>

          {/* Social Auth Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setLocation('/dashboard')}
              className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-900 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition-colors"
            >
              <span>Apple</span>
              <span className="text-sm"></span>
            </button>

            <button
              type="button"
              onClick={() => setLocation('/dashboard')}
              className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
            >
              <span>Google</span>
              <span className="font-extrabold text-blue-600">G</span>
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-xs font-medium text-slate-500">
          {isAr ? 'ليس لديك حساب؟ ' : "Don't have an account? "}
          <Link href="/sign-up" className="font-extrabold text-teal-700 hover:underline">
            {isAr ? 'ابدأ مجاناً' : 'Start for free'}
          </Link>
        </p>
      </div>
    </main>
  );
}
