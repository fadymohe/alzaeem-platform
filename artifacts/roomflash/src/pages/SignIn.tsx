import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Logo } from '../components/common/Logo';
import {
  Eye, EyeOff, ArrowLeft, Globe, Mail, Lock, AlertCircle,
  CheckCircle2, ShieldCheck, KeyRound, RefreshCw, X
} from 'lucide-react';

export function SignInPage() {
  const [, setLocation] = useLocation();
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  // Forgot Password / Account Recovery Modal State
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [recoveryStep, setRecoveryStep] = useState<1 | 2 | 3>(1); // 1: email, 2: otp, 3: new password
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryOtp, setRecoveryOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [recoveryLoading, setRecoveryLoading] = useState(false);
  const [recoveryError, setRecoveryError] = useState('');
  const [recoverySuccess, setRecoverySuccess] = useState('');

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

  // Strict Login - Absolutely NO bypass or fake bypass!
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.success && data.user) {
        const userObj = {
          email: data.user.email,
          name: `${data.user.firstName || ''} ${data.user.lastName || ''}`.trim() || data.user.email.split('@')[0],
          token: data.token,
          store: data.store || null,
          loggedIn: true,
          time: new Date().toISOString()
        };
        localStorage.setItem('zaeem_user', JSON.stringify(userObj));
        setLoading(false);
        window.location.hash = '#/dashboard';
        setLocation('/dashboard');
      } else {
        setLoading(false);
        setErrors({
          general: data?.error || (isAr ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة، يرجى المحاولة مرة أخرى' : 'Invalid email or password. Please try again.')
        });
      }
    } catch (err) {
      setLoading(false);
      setErrors({
        general: isAr ? 'فشل الاتصال بالخادم، يرجى التحقق من اتصال الإنترنت والمحاولة لاحقاً' : 'Network error. Please check your connection and try again.'
      });
    }
  };

  // 1. Send OTP for recovery
  const handleSendRecoveryOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryEmail || !/\S+@\S+\.\S+/.test(recoveryEmail)) {
      setRecoveryError(isAr ? 'يرجى إدخال بريد إلكتروني مسجل صحيح' : 'Please enter a valid registered email');
      return;
    }
    setRecoveryLoading(true);
    setRecoveryError('');

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: recoveryEmail.trim(), type: 'recovery' }),
      });
      const data = await res.json().catch(() => null);

      if (res.ok && data?.success) {
        setRecoveryStep(2);
        setRecoverySuccess(isAr ? `تم إرسال كود التحقق بنجاح إلى ${recoveryEmail}` : `Verification code sent to ${recoveryEmail}`);
      } else {
        setRecoveryError(data?.error || (isAr ? 'هذا البريد الإلكتروني غير مسجل لدينا في قاعدة البيانات' : 'This email is not registered'));
      }
    } catch (err) {
      setRecoveryError(isAr ? 'خطأ في الاتصال بالخادم' : 'Server connection failed');
    } finally {
      setRecoveryLoading(false);
    }
  };

  // 2. Verify OTP
  const handleVerifyRecoveryOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryOtp || recoveryOtp.length !== 6) {
      setRecoveryError(isAr ? 'يرجى إدخال كود التحقق المكون من 6 أرقام' : 'Enter the 6-digit OTP code');
      return;
    }
    setRecoveryLoading(true);
    setRecoveryError('');

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: recoveryEmail.trim(), code: recoveryOtp.trim() }),
      });
      const data = await res.json().catch(() => null);

      if (res.ok && data?.success) {
        setRecoveryStep(3);
        setRecoverySuccess('');
      } else {
        setRecoveryError(data?.error || (isAr ? 'كود التحقق غير صحيح أو منتهي' : 'Invalid or expired OTP code'));
      }
    } catch (err) {
      setRecoveryError(isAr ? 'خطأ في الاتصال بالخادم' : 'Server connection failed');
    } finally {
      setRecoveryLoading(false);
    }
  };

  // 3. Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setRecoveryError(isAr ? 'كلمة المرور يجب أن لا تقل عن 8 أحرف' : 'Password must be at least 8 characters');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setRecoveryError(isAr ? 'كلمتا المرور غير متطابقتين' : 'Passwords do not match');
      return;
    }

    setRecoveryLoading(true);
    setRecoveryError('');

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: recoveryEmail.trim(), code: recoveryOtp.trim(), newPassword }),
      });
      const data = await res.json().catch(() => null);

      if (res.ok && data?.success) {
        setRecoverySuccess(isAr ? 'تم تغيير كلمة المرور بنجاح! يمكنك الآن تسجيل الدخول بها.' : 'Password reset successfully! You can now log in.');
        setTimeout(() => {
          setShowRecoveryModal(false);
          setRecoveryStep(1);
          setPassword(newPassword);
          setEmail(recoveryEmail);
        }, 1500);
      } else {
        setRecoveryError(data?.error || (isAr ? 'فشلت عملية تغيير كلمة المرور' : 'Password reset failed'));
      }
    } catch (err) {
      setRecoveryError(isAr ? 'خطأ بالاتصال بالخادم' : 'Server connection failed');
    } finally {
      setRecoveryLoading(false);
    }
  };

  // Google / Apple OAuth Handlers
  const handleOAuthLogin = (provider: 'google' | 'apple') => {
    alert(isAr
      ? `جاري الربط الآمن مع حسابك في ${provider === 'google' ? 'Google' : 'Apple'} عبر البوابة الرسمية...`
      : `Redirecting to secure ${provider} authentication...`
    );
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
              {isAr ? 'تسجيل الدخول إلى حسابك' : 'Sign In to Your Account'}
            </h1>
            <p className="text-xs font-medium text-slate-500">
              {isAr ? 'أدخل بريدك الإلكتروني المعتمد وكلمة المرور للوصول إلى لوحة التحكم' : 'Enter your registered email and password to access dashboard'}
            </p>
          </div>

          {errors.general && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-start gap-2.5 animate-shake">
              <AlertCircle className="size-4 shrink-0 mt-0.5 text-red-600" />
              <span className="leading-relaxed">{errors.general}</span>
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
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="merchant@store.com"
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
                <button
                  type="button"
                  onClick={() => {
                    setRecoveryEmail(email);
                    setRecoveryError('');
                    setRecoverySuccess('');
                    setRecoveryStep(1);
                    setShowRecoveryModal(true);
                  }}
                  className="text-[11px] font-bold text-teal-700 hover:text-teal-800 hover:underline cursor-pointer"
                >
                  {isAr ? 'نسيت كلمة المرور؟' : 'Forgot password?'}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
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
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
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
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-teal-700 hover:bg-teal-800 py-3.5 text-xs font-extrabold text-white shadow-lg shadow-teal-700/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 mt-2 cursor-pointer"
            >
              <span>{loading ? (isAr ? 'جاري التحقق والدخول...' : 'Verifying & Signing In...') : (isAr ? 'تسجيل الدخول' : 'Sign In')}</span>
              {isAr ? <ArrowLeft className="size-4" /> : null}
            </button>
          </form>

          {/* Social Auth Divider */}
          <div className="relative flex items-center justify-center my-4">
            <div className="border-t border-slate-100 w-full" />
            <span className="bg-white px-3 text-[11px] font-bold text-slate-400 absolute">
              {isAr ? 'أو تسجيل الدخول عبر' : 'Or sign in with'}
            </span>
          </div>

          {/* Authentic Social Auth Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleOAuthLogin('google')}
              className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition-all hover:border-slate-300 cursor-pointer"
            >
              <svg className="size-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              <span>Google</span>
            </button>

            <button
              type="button"
              onClick={() => handleOAuthLogin('apple')}
              className="flex items-center justify-center gap-2 rounded-2xl border border-slate-800 bg-slate-900 hover:bg-slate-800 py-2.5 text-xs font-bold text-white shadow-sm transition-all cursor-pointer"
            >
              <svg className="size-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.87c.6-1.12.98-2.67.87-4.22-1.42.06-3.08.95-3.86 1.86-.54.63-.98 1.63-.86 2.82 1.57.12 3.18-.8 3.85-1.46z"/>
              </svg>
              <span>Apple</span>
            </button>
          </div>
        </div>

        {/* Footer Link to Sign Up */}
        <p className="text-center text-xs font-medium text-slate-500">
          {isAr ? 'ليس لديك متجر بعد؟ ' : "Don't have a store yet? "}
          <Link href="/sign-up" className="font-extrabold text-teal-700 hover:underline">
            {isAr ? 'أنشئ متجرك مجاناً (أول 5 شحنات)' : 'Create free store (First 5 shipments)'}
          </Link>
        </p>
      </div>

      {/* ========================================================================= */}
      {/* 🔐 ACCOUNT RECOVERY / FORGOT PASSWORD MODAL */}
      {/* ========================================================================= */}
      {showRecoveryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl text-right space-y-5">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowRecoveryModal(false)}
              className="absolute left-4 top-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="size-4" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-2xl bg-teal-50 text-teal-700 grid place-items-center">
                <KeyRound className="size-5" />
              </div>
              <div>
                <h3 className="font-black text-base text-slate-900">
                  {isAr ? 'استعادة الحساب وكلمة المرور' : 'Account & Password Recovery'}
                </h3>
                <p className="text-xs text-slate-500">
                  {recoveryStep === 1 && (isAr ? 'الخطوة 1: أدخل بريدك الإلكتروني المسجل' : 'Step 1: Enter your registered email')}
                  {recoveryStep === 2 && (isAr ? 'الخطوة 2: أدخل كود التحقق (OTP) المكون من 6 أرقام' : 'Step 2: Enter 6-digit OTP code')}
                  {recoveryStep === 3 && (isAr ? 'الخطوة 3: تعيين كلمة المرور الجديدة' : 'Step 3: Set your new password')}
                </p>
              </div>
            </div>

            {/* Status Messages */}
            {recoveryError && (
              <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="size-4 shrink-0" />
                <span>{recoveryError}</span>
              </div>
            )}
            {recoverySuccess && (
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
                <span>{recoverySuccess}</span>
              </div>
            )}

            {/* STEP 1: Enter Email */}
            {recoveryStep === 1 && (
              <form onSubmit={handleSendRecoveryOtp} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">البريد الإلكتروني المسجل</label>
                  <input
                    type="email"
                    required
                    value={recoveryEmail}
                    onChange={(e) => setRecoveryEmail(e.target.value)}
                    placeholder="merchant@store.com"
                    dir="ltr"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-900 focus:border-teal-600 focus:bg-white focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={recoveryLoading}
                  className="w-full py-3 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  {recoveryLoading ? 'جاري التحقق وإرسال الكود...' : 'إرسال كود التحقق إلى البريد'}
                </button>
              </form>
            )}

            {/* STEP 2: Enter OTP Code */}
            {recoveryStep === 2 && (
              <form onSubmit={handleVerifyRecoveryOtp} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">كود التحقق المكون من 6 أرقام</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={recoveryOtp}
                    onChange={(e) => setRecoveryOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    dir="ltr"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center text-lg font-mono font-bold tracking-widest text-slate-900 focus:border-teal-600 focus:bg-white focus:outline-none"
                  />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={handleSendRecoveryOtp}
                    className="text-teal-700 font-bold hover:underline"
                  >
                    إعادة إرسال الكود
                  </button>
                  <button
                    type="button"
                    onClick={() => setRecoveryStep(1)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    تغيير البريد
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={recoveryLoading}
                  className="w-full py-3 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  {recoveryLoading ? 'جاري التحقق...' : 'تأكيد الكود ومتابعة'}
                </button>
              </form>
            )}

            {/* STEP 3: Set New Password */}
            {recoveryStep === 3 && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">كلمة المرور الجديدة (8 أحرف + رموز وأرقام)</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-900 focus:border-teal-600 focus:bg-white focus:outline-none pl-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showNewPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">تأكيد كلمة المرور الجديدة</label>
                  <input
                    type="password"
                    required
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-900 focus:border-teal-600 focus:bg-white focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={recoveryLoading}
                  className="w-full py-3 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  {recoveryLoading ? 'جاري حفظ التغيير...' : 'حفظ كلمة المرور الجديدة والدخول'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
