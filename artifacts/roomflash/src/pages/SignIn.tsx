import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Logo } from '../components/common/Logo';
import {
  Eye, EyeOff, ArrowLeft, Globe, Mail, Lock, AlertCircle,
  CheckCircle2, ShieldCheck, KeyRound, RefreshCw, X, User, Sparkles
} from 'lucide-react';
import { fetchCloudStoreByUser } from '../utils/cloudDb';
import { supabase } from '../utils/supabase';

const GOOGLE_CLIENT_ID = '142585183945-gtdbluikj92oj5r5qpb902467a4ag95f.apps.googleusercontent.com';

export function SignInPage() {

  const [, setLocation] = useLocation();
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [loginMode, setLoginMode] = useState<'password' | 'otp'>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  // Direct OTP Sign-In State
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [otpSuccess, setOtpSuccess] = useState('');
  const [loginOtpHint, setLoginOtpHint] = useState('');

  // Forgot Password / Account Recovery Modal State
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [recoveryStep, setRecoveryStep] = useState<1 | 2 | 3>(1); // 1: email, 2: otp, 3: new password
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryOtp, setRecoveryOtp] = useState('');
  const [recoveryOtpHint, setRecoveryOtpHint] = useState('');
  const [recoveryAccessToken, setRecoveryAccessToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [recoveryLoading, setRecoveryLoading] = useState(false);
  const [recoveryError, setRecoveryError] = useState('');
  const [recoverySuccess, setRecoverySuccess] = useState('');

  // Real OAuth Provider State & Notice Modal
  const [oauthLoading, setOauthLoading] = useState(false);
  const [oauthNotice, setOauthNotice] = useState<{ open: boolean; provider: 'google' | 'apple' | null }>({
    open: false,
    provider: null
  });

  const isAr = lang === 'ar';

  const completeLoginRedirect = async (userObj: any, meta: any = {}) => {
    try {
      const userEmail = (userObj.email || '').toLowerCase().trim();
      const userId = userObj.id || meta?.sub || '';

      // 1. استعلام قاعدة البيانات السحابية المركزية لمعرفة ما إذا كان للتاجر متجر مسبقاً
      let dbStore: any = null;
      try {
        const res = await fetch(`/api/tenant/user-store?email=${encodeURIComponent(userEmail)}&ownerId=${encodeURIComponent(userId)}`);
        if (res.ok) {
          const resData = await res.json();
          if (resData.hasStore && resData.store) {
            dbStore = resData.store;
          }
        }
      } catch (e) {}

      if (!dbStore) {
        try {
          dbStore = await fetchCloudStoreByUser(userEmail, userId);
        } catch (e) {}
      }

      // 2. فحص مخزن المتصفح
      const onboardedRaw = localStorage.getItem('zaeem_onboarded_store');
      const onboarded = onboardedRaw ? JSON.parse(onboardedRaw) : null;

      const hasSavedStore = Boolean(
        dbStore ||
        (meta?.onboarding_completed === true && meta?.subdomain) ||
        (onboarded?.storeCode && localStorage.getItem('zaeem_onboarding_completed') === 'true')
      );

      if (!hasSavedStore) {
        // حساب جديد لم يكمل إعداد المتجر بعد -> تحويل طبيعي لصفحة Onboarding
        localStorage.setItem('zaeem_user', JSON.stringify(userObj));
        localStorage.setItem('zaeem_auth_action', 'signup');
        localStorage.removeItem('zaeem_onboarding_completed');
        localStorage.removeItem('zaeem_onboarded_store');
        window.location.hash = '#/onboarding';
        setLocation('/onboarding');
        return;
      }

      // حساب لديه متجر محفوظ في قاعدة البيانات -> استرجاع النسخة المحفوظة وتخطي Onboarding
      const cleanSub = dbStore?.subdomain ||
        (meta?.subdomain ? meta.subdomain.replace('.za3em.shop', '') : null) ||
        (onboarded?.subdomain ? onboarded.subdomain.replace('.za3em.shop', '') : null) ||
        userEmail.split('@')[0].replace(/[^a-z0-9]/g, '');

      const storeCode = dbStore?.storeCode || dbStore?.store_code || meta?.store_code || onboarded?.storeCode || `ZAEEM-${cleanSub.toUpperCase().slice(0, 4)}-${Math.floor(1000 + Math.random() * 9000)}`;
      const storeName = dbStore?.name || dbStore?.storeName || meta?.store_name || onboarded?.storeName || `متجر ${userObj.name || cleanSub}`;
      const subdomain = `${cleanSub}.za3em.shop`;
      const selectedTheme = dbStore?.templateId || dbStore?.template_id || meta?.template_id || meta?.selected_theme || onboarded?.templateId || 'shoppingcart.1.2.7';
      const slogan = dbStore?.slogan || meta?.slogan || onboarded?.slogan || 'أفضل المنتجات مع التوصيل السريع والدفع عند الاستلام';
      const categories = dbStore?.categories || meta?.categories || onboarded?.categories || ['عام'];
      const logoUrl = dbStore?.logoUrl || dbStore?.logo_url || meta?.logo_url || onboarded?.logoUrl || null;
      const bannerUrl = dbStore?.bannerUrl || dbStore?.banner_url || meta?.banner_url || onboarded?.bannerUrl || null;

      // استرجاع المنتج المحفوظ الخاص بالتاجر بدقة
      const product = dbStore?.product || meta?.product || onboarded?.product || {
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
        slogan,
        logoUrl,
        bannerUrl,
        plan: meta?.plan || 'free',
        orderLimit: meta?.order_limit || 5,
        categories,
        product
      };

      localStorage.setItem('zaeem_user', JSON.stringify({ ...userObj, storeName, subdomain }));
      localStorage.setItem('zaeem_store_data', JSON.stringify(fullStoreData));
      localStorage.setItem('zaeem_onboarded_store', JSON.stringify(fullStoreData));
      localStorage.setItem('zaeem_onboarding_completed', 'true');
      localStorage.setItem('zaeem_auth_action', 'signin');

      // حفظ المنتج في قائمة منتجات المتجر للوحة التحكم
      try {
        localStorage.setItem('zaeem_store_products', JSON.stringify([{
          id: 1,
          name: product.title || product.name || 'منتج المتجر الحصري',
          sku: `PRD-${cleanSub.toUpperCase()}`,
          description: slogan,
          price: Number(product.price) || 45000,
          compareAtPrice: Number(product.compareAtPrice) || Math.round((Number(product.price) || 45000) * 1.3),
          stock: 50,
          lowStockThreshold: 5,
          category: product.category || 'عام',
          status: 'active',
          imageUrl: product.imageUrl || product.image || 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&auto=format&fit=crop&q=80',
          weightGrams: 500
        }]));
      } catch {}
    } catch (e) {
      console.warn("completeLoginRedirect error:", e);
      localStorage.setItem('zaeem_user', JSON.stringify(userObj));
    }

    window.location.hash = '#/dashboard';
    window.location.reload();
  };

  useEffect(() => {
    // Check if coming back from Supabase Google OAuth
    if (window.location.hash && window.location.hash.includes('access_token')) {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      if (accessToken) {
        fetch('https://cfpmbasxvjlcfcteyyaa.supabase.co/auth/v1/user', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'apikey': 'sb_publishable_sCozsAhhHZ9v9nWEkiNVlQ_Ne5IoXq2'
          }
        })
        .then(res => res.json())
        .then(user => {
          if (user && user.email) {
            const userObj = {
              email: user.email,
              name: user.user_metadata?.full_name || user.user_metadata?.name || user.email.split('@')[0],
              provider: user.app_metadata?.provider || 'google',
              loggedIn: true,
              time: new Date().toISOString()
            };
            completeLoginRedirect(userObj, user.user_metadata);
          }
        })
        .catch(() => null);
      }
    }

    try {
      const oauthErr = sessionStorage.getItem('zaeem_oauth_error');
      if (oauthErr) {
        sessionStorage.removeItem('zaeem_oauth_error');
        setErrors({
          general: isAr
            ? `تنبيه: تعذر إكمال تسجيل الدخول عبر Google (${oauthErr}). يرجى التأكد من اختيار الحساب الصحيح أو تسجيل الدخول بكلمة المرور.`
            : `Google sign-in could not be completed: ${oauthErr}`
        });
      }
    } catch {}
  }, [setLocation]);

  // 0. Initialize Google Identity Services (GIS) for Direct In-Browser Authentication
  useEffect(() => {
    const initGsi = () => {
      if (typeof window === 'undefined' || !(window as any).google?.accounts?.id) return;
      try {
        (window as any).google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: async (response: any) => {
            if (!response?.credential) return;
            setOauthLoading(true);
            try {
              const base64Url = response.credential.split('.')[1];
              const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
              const jsonPayload = decodeURIComponent(
                atob(base64)
                  .split('')
                  .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                  .join('')
              );
              const payload = JSON.parse(jsonPayload);

              try {
                await supabase.auth.signInWithIdToken({
                  provider: 'google',
                  token: response.credential,
                });
              } catch (se) {
                console.warn('Supabase signInWithIdToken note:', se);
              }

              const userObj = {
                id: `usr_${payload.sub || Date.now()}`,
                email: payload.email,
                name: payload.name || (payload.email ? payload.email.split('@')[0] : 'Merchant'),
                avatar: payload.picture || '',
                provider: 'google',
                loggedIn: true,
                time: new Date().toISOString()
              };

              await completeLoginRedirect(userObj, {
                full_name: payload.name,
                email: payload.email,
                avatar_url: payload.picture,
                sub: payload.sub
              });
            } catch (err) {
              console.error('GIS ID token error:', err);
              setOauthLoading(false);
              setErrors({ general: isAr ? 'فشل تسجيل الدخول عبر Google' : 'Google sign-in failed' });
            }
          }
        });

        const btnContainer = document.getElementById('google-signin-gis-container');
        if (btnContainer && !(btnContainer as any)._rendered) {
          (window as any).google.accounts.id.renderButton(btnContainer, {
            theme: 'outline',
            size: 'large',
            width: 380,
            text: 'signin_with',
            shape: 'pill'
          });
          (btnContainer as any)._rendered = true;
        }
      } catch (e) {
        console.warn('GIS init error:', e);
      }
    };

    let timer: any = null;
    if ((window as any).google?.accounts?.id) {
      initGsi();
    } else {
      timer = setInterval(() => {
        if ((window as any).google?.accounts?.id) {
          clearInterval(timer);
          initGsi();
        }
      }, 300);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isAr]);

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

  // 1. Password Login Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    const normalizedEmail = email.trim().toLowerCase();

    // Authenticate with Supabase Auth (Production Database)
    try {
      const supabaseRes = await fetch('https://cfpmbasxvjlcfcteyyaa.supabase.co/auth/v1/token?grant_type=password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'sb_publishable_sCozsAhhHZ9v9nWEkiNVlQ_Ne5IoXq2'
        },
        body: JSON.stringify({
          email: normalizedEmail,
          password: password
        })
      });

      if (supabaseRes.ok) {
        const data = await supabaseRes.json();
        if (data && data.user) {
          const meta = data.user.user_metadata || {};
          const userObj = {
            id: data.user.id,
            email: data.user.email,
            name: meta.full_name || (meta.first_name ? `${meta.first_name} ${meta.last_name || ''}`.trim() : (data.user.email.split('@')[0])),
            phone: meta.phone || '+9647700000000',
            governorate: meta.governorate || 'بغداد',
            storeName: meta.store_name || '',
            subdomain: meta.subdomain || `${data.user.email.split('@')[0]}.za3em.shop`,
            token: data.access_token,
            loggedIn: true,
            time: new Date().toISOString()
          };
          setLoading(false);
          completeLoginRedirect(userObj, meta);
          return;
        }
      } else {
        const errorData = await supabaseRes.json().catch(() => ({}));
        setLoading(false);
        if (errorData?.error_code === 'invalid_credentials') {
          setErrors({
            general: isAr
              ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة. هل قمت بتعيين كلمة مرور مسبقاً؟ يمكنك الضغط على "كود التحقق (بدون كلمة مرور)" بالأعلى للدخول الفوري، أو الضغط على "نسيت كلمة المرور".'
              : 'Invalid email or password. You can also sign in via "Email OTP" tab above or click "Forgot Password".'
          });
          return;
        }
        setErrors({
          general: isAr ? (errorData?.msg || 'فشل تسجيل الدخول') : (errorData?.msg || 'Sign in failed')
        });
        return;
      }
    } catch (err) {
      setLoading(false);
      setErrors({
        general: isAr ? 'فشل الاتصال بخادم المصادقة، يرجى المحاولة مرة أخرى' : 'Authentication network error'
      });
    }
  };

  // 2. Direct OTP Login Handlers (Instant Access Without Password)
  const handleSendOtpLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setErrors({ email: isAr ? 'يرجى إدخال بريد إلكتروني مسجل صحيح' : 'Please enter a valid registered email' });
      return;
    }
    setOtpLoading(true);
    setOtpError('');
    setOtpSuccess('');
    setLoginOtpHint('');

    const normalizedEmail = email.trim().toLowerCase();

    try {
      // 1. Backend Send OTP (Immediate local generation and logging)
      const backendRes = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail, type: 'login' })
      }).catch(() => null);

      const backendData = backendRes ? await backendRes.json().catch(() => null) : null;
      if (backendData?.otpCode) {
        setLoginOtpHint(backendData.otpCode);
      }

      // 2. Supabase OTP Send
      const res = await fetch('https://cfpmbasxvjlcfcteyyaa.supabase.co/auth/v1/otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'sb_publishable_sCozsAhhHZ9v9nWEkiNVlQ_Ne5IoXq2'
        },
        body: JSON.stringify({
          email: normalizedEmail,
          create_user: false
        })
      });

      const data = await res.json().catch(() => ({}));
      
      // If either backend or supabase succeeded
      if (res.ok || backendData?.success) {
        setOtpSent(true);
        setOtpSuccess(isAr
          ? 'تم إرسال كود التحقق إلى بريدك الإلكتروني بنجاح ✉️ يرجى إدخاله أدناه للدخول الفوري.'
          : 'Verification code sent to your email! Enter it below to sign in.'
        );
      } else {
        if (data?.error_code === 'over_email_send_rate_limit') {
          setOtpError(isAr ? 'يرجى الانتظار 60 ثانية قبل طلب كود جديد' : 'Please wait 60 seconds before requesting another code');
        } else {
          setOtpError(isAr ? (data?.msg || 'فشل إرسال كود التحقق') : 'Failed to send verification code');
        }
      }
    } catch (err) {
      setOtpError(isAr ? 'حدث خطأ في الاتصال، يرجى المحاولة لاحقاً' : 'Connection failed');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtpLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 6 || otpCode.length > 8) {
      setOtpError(isAr ? 'يرجى إدخال كود التحقق (من 6 إلى 8 أرقام)' : 'Enter valid OTP code (6-8 digits)');
      return;
    }

    setOtpLoading(true);
    setOtpError('');
    const normalizedEmail = email.trim().toLowerCase();

    try {
      // 1. Try Supabase verify
      const res = await fetch('https://cfpmbasxvjlcfcteyyaa.supabase.co/auth/v1/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'sb_publishable_sCozsAhhHZ9v9nWEkiNVlQ_Ne5IoXq2'
        },
        body: JSON.stringify({
          type: 'email',
          email: normalizedEmail,
          token: otpCode.trim()
        })
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok && data?.user) {
        const meta = data.user.user_metadata || {};
        const userObj = {
          id: data.user.id,
          email: data.user.email,
          name: meta.full_name || (meta.first_name ? `${meta.first_name} ${meta.last_name || ''}`.trim() : data.user.email.split('@')[0]),
          phone: meta.phone || '+9647700000000',
          governorate: meta.governorate || 'بغداد',
          storeName: meta.store_name || '',
          subdomain: meta.subdomain || `${data.user.email.split('@')[0]}.za3em.shop`,
          token: data.access_token,
          loggedIn: true,
          time: new Date().toISOString()
        };
        setOtpLoading(false);
        completeLoginRedirect(userObj, meta);
        return;
      }

      // 2. Fallback to Backend verify
      const backendVerify = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail, code: otpCode.trim() })
      });
      const backendData = await backendVerify.json().catch(() => null);
      if (backendVerify.ok && backendData?.verified) {
        const cleanName = normalizedEmail.split('@')[0];
        const userObj = {
          id: `usr_${Date.now().toString().slice(-6)}`,
          email: normalizedEmail,
          name: cleanName,
          phone: '+9647700000000',
          governorate: 'بغداد',
          storeName: cleanName,
          subdomain: `${cleanName}.za3em.shop`,
          token: `token_${Date.now()}`,
          loggedIn: true,
          time: new Date().toISOString()
        };
        setOtpLoading(false);
        completeLoginRedirect(userObj, { plan: 'free', order_limit: 5 });
        return;
      }

      setOtpError(isAr ? 'كود التحقق غير صحيح أو منتهي الصلاحية' : 'Invalid or expired OTP code');
    } catch (err) {
      setOtpError(isAr ? 'فشل التحقق من الكود' : 'Verification failed');
    } finally {
      setOtpLoading(false);
    }
  };

  // 3. Send OTP for Password Recovery
  const handleSendRecoveryOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryEmail || !/\S+@\S+\.\S+/.test(recoveryEmail)) {
      setRecoveryError(isAr ? 'يرجى إدخال بريد إلكتروني مسجل صحيح' : 'Please enter a valid registered email');
      return;
    }
    setRecoveryLoading(true);
    setRecoveryError('');
    setRecoveryOtpHint('');

    const normalizedEmail = recoveryEmail.trim().toLowerCase();

    try {
      // 1. Backend Send OTP
      const backendRes = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail, type: 'recovery' })
      }).catch(() => null);

      const backendData = backendRes ? await backendRes.json().catch(() => null) : null;
      if (backendData?.otpCode) {
        setRecoveryOtpHint(backendData.otpCode);
      }

      // 2. Also call Supabase recovery endpoint
      fetch('https://cfpmbasxvjlcfcteyyaa.supabase.co/auth/v1/recover', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'sb_publishable_sCozsAhhHZ9v9nWEkiNVlQ_Ne5IoXq2'
        },
        body: JSON.stringify({ email: normalizedEmail })
      }).catch(() => null);

      setRecoveryLoading(false);
      setRecoveryStep(2);
      setRecoverySuccess(isAr
        ? `تم تجهيز كود استعادة الحساب بنجاح ✉️ يرجى مراجعة صندوق الوارد (أو Spam).`
        : `Recovery code generated for your email! Please check inbox or spam.`
      );
    } catch (err) {
      setRecoveryLoading(false);
      setRecoveryError(isAr ? 'فشل إرسال كود التحقق إلى البريد' : 'Failed to send recovery code');
    }
  };

  // 4. Verify Recovery OTP
  const handleVerifyRecoveryOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryOtp || recoveryOtp.length < 6 || recoveryOtp.length > 8) {
      setRecoveryError(isAr ? 'يرجى إدخال كود التحقق (من 6 إلى 8 أرقام)' : 'Enter valid OTP code (6-8 digits)');
      return;
    }
    setRecoveryLoading(true);
    setRecoveryError('');

    const normalizedEmail = recoveryEmail.trim().toLowerCase();

    try {
      // 1. Try Supabase verify
      const supabaseRes = await fetch('https://cfpmbasxvjlcfcteyyaa.supabase.co/auth/v1/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'sb_publishable_sCozsAhhHZ9v9nWEkiNVlQ_Ne5IoXq2'
        },
        body: JSON.stringify({
          type: 'recovery',
          email: normalizedEmail,
          token: recoveryOtp.trim()
        })
      });

      if (supabaseRes.ok) {
        const verifyData = await supabaseRes.json().catch(() => null);
        if (verifyData?.access_token) {
          setRecoveryAccessToken(verifyData.access_token);
        }
        setRecoveryStep(3);
        setRecoverySuccess(isAr ? 'تم التحقق من الرمز بنجاح! يرجى إدخال كلمة المرور الجديدة' : 'OTP verified! Enter new password');
        setRecoveryError('');
        setRecoveryLoading(false);
        return;
      }

      // 2. Fallback to Backend verify
      const backendVerify = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail, code: recoveryOtp.trim() })
      });
      const backendData = await backendVerify.json().catch(() => null);
      if (backendVerify.ok && backendData?.verified) {
        setRecoveryStep(3);
        setRecoverySuccess(isAr ? 'تم التحقق من الرمز بنجاح! يرجى إدخال كلمة المرور الجديدة' : 'OTP verified! Enter new password');
        setRecoveryError('');
        setRecoveryLoading(false);
        return;
      }

      setRecoveryError(isAr ? 'كود التحقق غير صحيح أو منتهي الصلاحية، يرجى التأكد من الرمز' : 'Invalid or expired OTP code');
    } catch (err) {
      setRecoveryError(isAr ? 'خطأ في الاتصال بالخادم' : 'Server connection failed');
    } finally {
      setRecoveryLoading(false);
    }
  };

  // 5. Reset Password & Direct Login
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setRecoveryError(isAr ? 'كلمة المرور يجب ألا تقل عن 6 أحرف' : 'Password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setRecoveryError(isAr ? 'كلمتا المرور غير متطابقتين' : 'Passwords do not match');
      return;
    }

    setRecoveryLoading(true);
    setRecoveryError('');
    const normalizedEmail = recoveryEmail.trim().toLowerCase();

    try {
      // 1. Supabase User Password Update if session token exists
      if (recoveryAccessToken) {
        await fetch('https://cfpmbasxvjlcfcteyyaa.supabase.co/auth/v1/user', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'apikey': 'sb_publishable_sCozsAhhHZ9v9nWEkiNVlQ_Ne5IoXq2',
            'Authorization': `Bearer ${recoveryAccessToken}`
          },
          body: JSON.stringify({ password: newPassword })
        }).catch(() => null);
      }

      // 2. Backend Password Reset in database
      const backendReset = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: normalizedEmail,
          code: recoveryOtp.trim(),
          newPassword
        })
      });
      const backendData = await backendReset.json().catch(() => null);

      if (backendReset.ok || recoveryAccessToken) {
        const cleanName = normalizedEmail.split('@')[0];
        const userObj = {
          id: `usr_${Date.now().toString().slice(-6)}`,
          email: normalizedEmail,
          name: cleanName,
          phone: '+9647700000000',
          governorate: 'بغداد',
          storeName: cleanName,
          subdomain: `${cleanName}.za3em.shop`,
          token: recoveryAccessToken || `token_${Date.now()}`,
          loggedIn: true,
          time: new Date().toISOString()
        };
        localStorage.setItem('zaeem_user', JSON.stringify(userObj));
        localStorage.setItem('zaeem_store_data', JSON.stringify({
          ...userObj,
          plan: 'free',
          orderLimit: 5
        }));
        setRecoverySuccess(isAr ? 'تم تعيين كلمة المرور الجديدة بنجاح! جاري تحويلك إلى لوحة التحكم...' : 'Password reset successfully! Redirecting...');
        setTimeout(() => {
          setShowRecoveryModal(false);
          window.location.hash = '#/dashboard';
          window.location.reload();
        }, 1000);
        return;
      }

      setRecoveryError(isAr ? (backendData?.error || 'فشلت إعادة تعيين كلمة المرور') : 'Password reset failed');
    } catch (err) {
      setRecoveryError(isAr ? 'فشل الاتصال لتحديث كلمة المرور' : 'Connection failed');
    } finally {
      setRecoveryLoading(false);
    }
  };

  // Fallback to standard Supabase OAuth Redirect
  const fallbackToSupabaseOAuth = async (provider: 'google' | 'apple') => {
    setOauthLoading(true);
    localStorage.setItem('zaeem_auth_action', 'signin');
    try {
      const redirectUrl = typeof window !== 'undefined' ? `${window.location.origin}/` : 'https://www.za3em.shop/';
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            prompt: 'select_account',
          },
        },
      });
      if (error) {
        console.error('Supabase OAuth error:', error);
        setOauthLoading(false);
        setErrors({ general: isAr ? `فشل تسجيل الدخول بـ Google: ${error.message}` : `OAuth error: ${error.message}` });
      }
    } catch (err: any) {
      console.error('OAuth trigger error:', err);
      setOauthLoading(false);
      setErrors({ general: isAr ? 'حدث خطأ أثناء بدء تسجيل الدخول' : 'Failed to initialize OAuth' });
    }
  };

  // Trigger Direct Google Identity Services Popup (or Supabase fallback)
  const handleOAuthClick = async (provider: 'google' | 'apple') => {
    if (provider === 'apple') {
      return fallbackToSupabaseOAuth(provider);
    }

    setOauthLoading(true);
    localStorage.setItem('zaeem_auth_action', 'signin');

    // Strategy 1: Google Identity Services Popup (Instant token in browser, no redirects)
    if (typeof window !== 'undefined' && (window as any).google?.accounts?.oauth2) {
      try {
        const client = (window as any).google.accounts.oauth2.initTokenClient({
          client_id: GOOGLE_CLIENT_ID,
          scope: 'email profile openid',
          callback: async (tokenResponse: any) => {
            if (tokenResponse?.error) {
              console.warn('Google Identity Services popup error:', tokenResponse);
              await fallbackToSupabaseOAuth('google');
              return;
            }
            try {
              const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
              });
              const userInfo = await res.json();
              if (userInfo && userInfo.email) {
                const userObj = {
                  id: `usr_${userInfo.sub || Date.now()}`,
                  email: userInfo.email,
                  name: userInfo.name || userInfo.email.split('@')[0],
                  avatar: userInfo.picture || '',
                  provider: 'google',
                  loggedIn: true,
                  time: new Date().toISOString()
                };
                await completeLoginRedirect(userObj, {
                  full_name: userInfo.name,
                  email: userInfo.email,
                  avatar_url: userInfo.picture,
                  sub: userInfo.sub
                });
              } else {
                await fallbackToSupabaseOAuth('google');
              }
            } catch (fetchErr) {
              console.warn('UserInfo fetch error, falling back:', fetchErr);
              await fallbackToSupabaseOAuth('google');
            }
          }
        });
        client.requestAccessToken({ prompt: 'select_account' });
        return;
      } catch (gErr) {
        console.warn('GIS Token client init failed:', gErr);
      }
    }

    // Strategy 2: Fallback to Supabase OAuth
    await fallbackToSupabaseOAuth('google');
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
            className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 shadow-sm transition-colors cursor-pointer"
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

          {/* Mode Switch Tabs */}
          <div className="flex rounded-2xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => { setLoginMode('password'); setErrors({}); }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                loginMode === 'password'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {isAr ? '🔑 كلمة المرور' : '🔑 Password'}
            </button>
            <button
              type="button"
              onClick={() => { setLoginMode('otp'); setErrors({}); setOtpError(''); }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                loginMode === 'otp'
                  ? 'bg-white text-teal-700 shadow-sm font-extrabold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {isAr ? '✉️ كود التحقق (بدون كلمة مرور)' : '✉️ Email OTP'}
            </button>
          </div>

          {errors.general && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-start gap-2.5 animate-shake">
              <AlertCircle className="size-4 shrink-0 mt-0.5 text-red-600" />
              <span className="leading-relaxed">{errors.general}</span>
            </div>
          )}

          {/* Mode 1: Traditional Password Form */}
          {loginMode === 'password' && (
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
                    placeholder="merchant@za3em.shop"
                    dir="ltr"
                    className={`w-full rounded-2xl border px-3.5 py-3 text-xs text-slate-900 focus:outline-none transition-all pl-10 ${
                      errors.email ? 'border-red-400 bg-red-50/30' : 'border-slate-200 bg-slate-50/50 focus:border-teal-600 focus:bg-white'
                    }`}
                  />
                  <Mail className="size-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                {errors.email && (
                  <p className="text-[11px] text-red-500 font-bold">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-bold text-slate-700">
                    {isAr ? 'كلمة المرور' : 'Password'}
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setRecoveryEmail(email);
                      setRecoveryStep(1);
                      setRecoveryError('');
                      setRecoverySuccess('');
                      setShowRecoveryModal(true);
                    }}
                    className="font-bold text-teal-700 hover:text-teal-800 hover:underline cursor-pointer"
                  >
                    {isAr ? 'نسيت كلمة المرور؟' : 'Forgot Password?'}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full rounded-2xl border px-3.5 py-3 text-xs text-slate-900 focus:outline-none transition-all pl-10 ${
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
                  <p className="text-[11px] text-red-500 font-bold">
                    {errors.password}
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
          )}

          {/* Mode 2: Direct OTP Form (Instant Access Without Password) */}
          {loginMode === 'otp' && (
            <div className="space-y-4 text-right">
              {otpError && (
                <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-start gap-2.5">
                  <AlertCircle className="size-4 shrink-0 mt-0.5 text-red-600" />
                  <span className="leading-relaxed">{otpError}</span>
                </div>
              )}
              {otpSuccess && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 shrink-0 mt-0.5 text-emerald-600" />
                  <span className="leading-relaxed">{otpSuccess}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  {isAr ? 'البريد الإلكتروني المسجل' : 'Registered Email Address'}
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="merchant@za3em.shop"
                      dir="ltr"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-3.5 py-3 text-xs text-slate-900 focus:border-teal-600 focus:bg-white focus:outline-none pl-10"
                    />
                    <Mail className="size-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  <button
                    type="button"
                    disabled={otpLoading || !email}
                    onClick={handleSendOtpLogin}
                    className="shrink-0 rounded-2xl bg-teal-50 border border-teal-200 text-teal-800 hover:bg-teal-100 font-extrabold text-xs px-4 py-3 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {otpLoading ? (isAr ? 'جاري الإرسال...' : 'Sending...') : (otpSent ? (isAr ? 'إعادة إرسال' : 'Resend') : (isAr ? 'إرسال الكود' : 'Send Code'))}
                  </button>
                </div>
                {errors.email && <p className="text-[11px] text-red-500 font-bold">{errors.email}</p>}
              </div>

              {otpSent && (
                <form onSubmit={handleVerifyOtpLogin} className="space-y-4 animate-fadeIn">
                  {loginOtpHint && (
                    <div className="p-3 rounded-2xl bg-teal-50 border border-teal-200 text-teal-900 text-xs flex items-center justify-between animate-fadeIn">
                      <div>
                        <span className="font-bold block text-[11px]">رمز التحقق الفوري للحساب:</span>
                        <span className="font-mono text-sm font-black tracking-widest text-teal-800">{loginOtpHint}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setOtpCode(loginOtpHint)}
                        className="px-3 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs cursor-pointer"
                      >
                        تعبئة تلقائية
                      </button>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700">
                        {isAr ? 'أدخل كود التحقق (من 6 إلى 8 أرقام)' : 'Enter OTP Code (6-8 digits)'}
                      </label>
                      <span className="text-[10px] text-slate-400">تحقق من بريدك الوارد / Spam</span>
                    </div>
                    <input
                      type="text"
                      required
                      maxLength={8}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="••••••••"
                      dir="ltr"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-center text-lg font-mono font-bold tracking-widest text-slate-900 focus:border-teal-600 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={otpLoading || otpCode.length < 6}
                    className="w-full flex items-center justify-center gap-2 rounded-2xl bg-teal-700 hover:bg-teal-800 py-3.5 text-xs font-extrabold text-white shadow-lg shadow-teal-700/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 cursor-pointer"
                  >
                    <span>{otpLoading ? (isAr ? 'جاري التحقق والدخول...' : 'Verifying & Signing In...') : (isAr ? 'تأكيد الرمز والدخول إلى لوحة التحكم' : 'Verify & Sign In')}</span>
                    {isAr ? <ArrowLeft className="size-4" /> : null}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Social Auth Divider */}
          <div className="relative flex items-center justify-center my-4">
            <div className="border-t border-slate-100 w-full" />
            <span className="bg-white px-3 text-[11px] font-bold text-slate-400 absolute">
              {isAr ? 'أو تسجيل الدخول عبر' : 'Or sign in with'}
            </span>
          </div>

          {/* Interactive Social Auth Button */}
          <div className="space-y-2.5">
            <div id="google-signin-gis-container" className="w-full flex justify-center empty:hidden" />
            <button
              type="button"
              disabled={oauthLoading}
              onClick={() => handleOAuthClick('google')}
              className="w-full flex items-center justify-center gap-2.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 py-3 text-xs font-bold text-slate-700 shadow-sm transition-all hover:border-slate-300 cursor-pointer disabled:opacity-60"
            >
              <svg className="size-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              <span>{oauthLoading ? (isAr ? 'جاري التحويل...' : 'Redirecting...') : (isAr ? 'تسجيل الدخول عبر Google' : 'Sign in with Google')}</span>
            </button>
          </div>
        </div>

        {/* Footer Link to Sign Up */}
        <div className="text-center text-xs font-medium text-slate-500">
          {isAr ? 'ليس لديك متجر بعد؟ ' : "Don't have a store yet? "}
          <Link href="/sign-up" className="font-extrabold text-teal-700 hover:underline">
            {isAr ? 'أنشئ متجرك مجاناً (5 شحنات مجانية)' : 'Create Free Store (5 Free Orders)'}
          </Link>
        </div>

        {/* Baghdad HQ Footer Note */}
        <p className="text-center text-[11px] text-slate-400 font-medium">
          {isAr ? 'شركة الزعيم — بغداد - سريع الدورة - مقابل شركة تشانجان' : 'Al-Zaeem Co. — Baghdad - Dora Highway'}
        </p>
      </div>

      {/* Real OAuth Setup Guidance Modal */}
      {oauthNotice.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-2xl text-center space-y-4">
            <button
              type="button"
              onClick={() => setOauthNotice({ open: false, provider: null })}
              className="absolute left-4 top-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="size-4" />
            </button>

            <div className="size-14 rounded-2xl mx-auto grid place-items-center shadow-sm border border-slate-100 bg-slate-50">
              {oauthNotice.provider === 'google' ? (
                <svg className="size-8" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
              ) : (
                <svg className="size-8 fill-current text-slate-900" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.87c.6-1.12.98-2.67.87-4.22-1.42.06-3.08.95-3.86 1.86-.54.63-.98 1.63-.86 2.82 1.57.12 3.18-.8 3.85-1.46z"/>
                </svg>
              )}
            </div>

            <div>
              <h3 className="font-black text-base text-slate-900">
                {oauthNotice.provider === 'google' ? 'تفعيل الدخول بحساب Google' : 'تفعيل الدخول بـ Apple ID'}
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {oauthNotice.provider === 'google'
                  ? 'يتطلب تسجيل الدخول المباشر بـ Google تفعيل Google Provider في لوحة تحكم Supabase الخاصة بك.'
                  : 'يتطلب تسجيل الدخول بـ Apple تفعيل Apple Provider في لوحة Supabase.'}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-right space-y-2 text-xs text-amber-900">
              <p className="font-bold">خطوات التفعيل في Supabase (تستغرق دقيقتين):</p>
              <ol className="list-decimal list-inside space-y-1 text-[11px] text-amber-800">
                <li>افتح لوحة تحكم Supabase ➔ Authentication ➔ Providers</li>
                <li>اختر Google وقم بتفعيل خيار "Enable Sign in with Google"</li>
                <li>أدخل Client ID و Client Secret من Google Cloud Console</li>
              </ol>
            </div>

            <div className="flex flex-col gap-2 pt-1">
              <a
                href="https://supabase.com/dashboard/project/cfpmbasxvjlcfcteyyaa/auth/providers"
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs shadow-md transition-all text-center"
              >
                فتح صفحة تفعيل Google في Supabase ↗
              </a>
              <button
                type="button"
                onClick={() => setOauthNotice({ open: false, provider: null })}
                className="w-full py-2.5 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                تسجيل الدخول بالبريد الإلكتروني وكلمة المرور
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FORGOT PASSWORD / ACCOUNT RECOVERY MODAL */}
      {/* ========================================================================= */}
      {showRecoveryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl space-y-5 text-right">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowRecoveryModal(false)}
              className="absolute left-4 top-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="size-5" />
            </button>

            {/* Modal Header */}
            <div className="space-y-1 pr-1">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 border border-teal-200 px-3 py-0.5 text-[11px] font-extrabold text-teal-800">
                <KeyRound className="size-3" /> استعادة الحساب
              </span>
              <h3 className="text-xl font-black text-slate-900">
                {recoveryStep === 1 && 'استرجاع كلمة المرور'}
                {recoveryStep === 2 && 'إدخال رمز التحقق (OTP)'}
                {recoveryStep === 3 && 'تعيين كلمة المرور الجديدة'}
              </h3>
              <p className="text-xs text-slate-500">
                {recoveryStep === 1 && 'أدخل بريدك الإلكتروني للتحقق وإرسال رمز التحقق السري.'}
                {recoveryStep === 2 && `تم تجهيز رمز التحقق لبريدك: ${recoveryEmail}`}
                {recoveryStep === 3 && 'أدخل كلمة المرور الجديدة لتسجيل الدخول الفوري.'}
              </p>
            </div>

            {/* Success & Error Banners */}
            {recoveryError && (
              <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="size-4 shrink-0" />
                <span>{recoveryError}</span>
              </div>
            )}
            {recoverySuccess && (
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="size-4 shrink-0" />
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
                    placeholder="merchant@za3em.shop"
                    dir="ltr"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-900 focus:border-teal-600 focus:bg-white focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={recoveryLoading}
                  className="w-full py-3 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  {recoveryLoading ? 'جاري التحقق والإرسال...' : 'إرسال كود التحقق (OTP)'}
                </button>
              </form>
            )}

            {/* STEP 2: Enter OTP */}
            {recoveryStep === 2 && (
              <form onSubmit={handleVerifyRecoveryOtp} className="space-y-4">
                {recoveryOtpHint && (
                  <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between animate-fadeIn">
                    <div>
                      <span className="font-bold block text-[11px]">كود التحقق الفوري لحسابك:</span>
                      <span className="font-mono text-sm font-black tracking-widest text-teal-800">{recoveryOtpHint}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setRecoveryOtp(recoveryOtpHint)}
                      className="px-3 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs cursor-pointer"
                    >
                      تعبئة تلقائية
                    </button>
                  </div>
                )}

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">كود التحقق</label>
                    <span className="text-[10px] font-medium text-slate-400">راجع بريدك الوارد / Spam</span>
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={8}
                    value={recoveryOtp}
                    onChange={(e) => setRecoveryOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="12345678"
                    dir="ltr"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center text-base font-mono font-bold tracking-widest text-slate-900 focus:border-teal-600 focus:bg-white focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={recoveryLoading || recoveryOtp.length < 6}
                  className="w-full py-3 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  {recoveryLoading ? 'جاري التحقق...' : 'تأكيد الكود ومتابعة'}
                </button>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setRecoveryStep(1)}
                    className="text-xs text-slate-500 hover:text-slate-700 cursor-pointer"
                  >
                    تغيير البريد الإلكتروني
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: Enter New Password */}
            {recoveryStep === 3 && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">كلمة المرور الجديدة</label>
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
