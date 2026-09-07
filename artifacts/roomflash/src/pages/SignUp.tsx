import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Logo } from '../components/common/Logo';
import {
  ArrowLeft, ArrowRight, Eye, EyeOff, Globe, Sparkles, CheckCircle2,
  Truck, ShieldCheck, Zap, AlertCircle, Check, Store, Lock, KeyRound, Mail, X, User
} from 'lucide-react';
import { IRAQ_GOVERNORATES } from '../data/iraqData';
import { supabase } from '../utils/supabase';

const GOOGLE_CLIENT_ID = '142585183945-gtdbluikj92oj5r5qpb902467a4ag95f.apps.googleusercontent.com';

export function SignUpPage() {
  const [, setLocation] = useLocation();
  const [lang, setLang] = useState<'ar' | 'en'>('ar');

  // Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneBody, setPhoneBody] = useState(''); // 10 digits after +964
  const [governorate, setGovernorate] = useState('بغداد');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Email OTP Verification State
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [signupOtpHint, setSignupOtpHint] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [supabaseAccessToken, setSupabaseAccessToken] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [otpSuccess, setOtpSuccess] = useState('');

  // Real OAuth Provider State & Notice Modal
  const [oauthLoading, setOauthLoading] = useState(false);
  const [oauthNotice, setOauthNotice] = useState<{ open: boolean; provider: 'google' | 'apple' | null }>({
    open: false,
    provider: null
  });

  const isAr = lang === 'ar';

  // Check if returning from Supabase OAuth or Email verification
  useEffect(() => {
    const hash = window.location.hash || '';
    const search = window.location.search || '';

    // 1. Return from Google / Apple OAuth with access token
    if (hash.includes('access_token=')) {
      const match = hash.match(/access_token=([^&]+)/);
      const token = match ? match[1] : null;
      if (token) {
        fetch('https://cfpmbasxvjlcfcteyyaa.supabase.co/auth/v1/user', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'apikey': 'sb_publishable_sCozsAhhHZ9v9nWEkiNVlQ_Ne5IoXq2'
          }
        })
        .then(res => res.json())
        .then(user => {
          if (user && user.email) {
            const meta = user.user_metadata || {};
            const cleanSlug = user.email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
            const userObj = {
              id: user.id,
              email: user.email,
              name: meta.full_name || meta.name || user.email.split('@')[0],
              phone: meta.phone || user.phone || '+9647700000000',
              governorate: meta.governorate || 'بغداد',
              storeName: meta.store_name || user.email.split('@')[0],
              subdomain: meta.subdomain || `${cleanSlug}-${Date.now().toString().slice(-4)}.za3em.shop`,
              provider: user.app_metadata?.provider || 'google',
              token: token,
              loggedIn: true,
              time: new Date().toISOString()
            };
            localStorage.setItem('zaeem_user', JSON.stringify(userObj));

            // If user already had a completed store in their account metadata, restore it
            if (meta.onboarding_completed === true && meta.store_code) {
              const fullStoreData = {
                ...userObj,
                storeName: meta.store_name || userObj.storeName,
                subdomain: meta.subdomain || userObj.subdomain,
                selectedTheme: meta.template_id || meta.selected_theme || 'shoppingcart.1.2.7',
                templateId: meta.template_id || meta.selected_theme || 'shoppingcart.1.2.7',
                storeCode: meta.store_code,
                logoUrl: meta.logo_url,
                bannerUrl: meta.banner_url,
                plan: meta.plan || 'free',
                orderLimit: meta.order_limit || 5,
                categories: meta.categories || ['عام'],
                product: meta.product
              };
              localStorage.setItem('zaeem_store_data', JSON.stringify(fullStoreData));
              localStorage.setItem('zaeem_onboarded_store', JSON.stringify(fullStoreData));
              localStorage.setItem('zaeem_onboarding_completed', 'true');
              localStorage.setItem('zaeem_auth_action', 'signin');
              window.location.hash = '#/dashboard';
              setLocation('/dashboard');
              return;
            }

            // Fresh account -> Proceed to onboarding
            localStorage.setItem('zaeem_auth_action', 'signup');
            localStorage.removeItem('zaeem_onboarding_completed');
            localStorage.removeItem('zaeem_onboarded_store');
            localStorage.setItem('zaeem_store_data', JSON.stringify({
              ...userObj,
              plan: 'free',
              orderLimit: 5
            }));
            window.location.hash = '#/onboarding';
            setLocation('/onboarding');
          }
        })
        .catch(() => null);
        return;
      }
    }

    if (hash.includes('type=magiclink') || search.includes('token=')) {
      setEmailVerified(true);
      setOtpSuccess(isAr ? 'تم تأكيد البريد الإلكتروني بنجاح! ✅' : 'Email verified successfully! ✅');
      setOtpError('');
    }
  }, [isAr, setLocation]);

  // Initialize Google Identity Services (GIS) for Direct Sign-Up
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

              const userEmail = (payload.email || '').toLowerCase().trim();
              const cleanSlug = userEmail.split('@')[0].replace(/[^a-z0-9]/g, '').slice(0, 20);
              const cleanName = payload.name || userEmail.split('@')[0];

              const userObj = {
                id: `usr_${payload.sub || Date.now()}`,
                email: userEmail,
                name: cleanName,
                avatar: payload.picture || '',
                phone: '+9647700000000',
                governorate: 'بغداد',
                storeName: `متجر ${cleanName}`,
                subdomain: `${cleanSlug}.za3em.shop`,
                provider: 'google',
                loggedIn: true,
                time: new Date().toISOString()
              };

              localStorage.setItem('zaeem_user', JSON.stringify(userObj));
              localStorage.setItem('zaeem_auth_action', 'signup');
              localStorage.removeItem('zaeem_onboarding_completed');
              localStorage.removeItem('zaeem_onboarded_store');
              localStorage.setItem('zaeem_store_data', JSON.stringify({
                ...userObj,
                plan: 'free',
                orderLimit: 5
              }));

              setOauthLoading(false);
              window.location.hash = '#/onboarding';
              setLocation('/onboarding');
            } catch (err) {
              console.error('GIS ID token error:', err);
              setOauthLoading(false);
              setErrors({ general: isAr ? 'فشل التسجيل عبر Google' : 'Google sign-up failed' });
            }
          }
        });

        const btnContainer = document.getElementById('google-signup-gis-container');
        if (btnContainer && !(btnContainer as any)._rendered) {
          (window as any).google.accounts.id.renderButton(btnContainer, {
            theme: 'outline',
            size: 'large',
            width: 380,
            text: 'signup_with',
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

  // Password Strength Calculation
  const calculatePasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: isAr ? 'فارغ' : 'Empty', color: 'bg-slate-200', text: 'text-slate-400' };
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[a-zA-Z\u0600-\u06FF]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(pwd)) score += 1;

    if (score === 1) return { score: 1, label: isAr ? 'ضعيف جداً' : 'Very Weak', color: 'bg-red-500', text: 'text-red-600' };
    if (score === 2) return { score: 2, label: isAr ? 'ضعيف' : 'Weak', color: 'bg-amber-500', text: 'text-amber-600' };
    if (score === 3) return { score: 3, label: isAr ? 'جيد' : 'Good', color: 'bg-blue-500', text: 'text-blue-600' };
    return { score: 4, label: isAr ? 'قوي جداً 🔒' : 'Very Strong 🔒', color: 'bg-emerald-500', text: 'text-emerald-600' };
  };

  const pwdStrength = calculatePasswordStrength(password);



  // Handler to Send Real Email OTP via Supabase Auth
  const handleSendOtp = async () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setErrors((prev) => ({ ...prev, email: isAr ? 'يرجى إدخال بريد إلكتروني صحيح أولاً' : 'Valid email required' }));
      return;
    }

    setOtpLoading(true);
    setOtpError('');
    setOtpSuccess('');

    const normalizedEmail = email.trim().toLowerCase();

    // 0. Pre-check: Verify if an account already exists with this email!
    try {
      // Check local storage registered users
      const storedUserRaw = localStorage.getItem('zaeem_user');
      if (storedUserRaw) {
        try {
          const storedUser = JSON.parse(storedUserRaw);
          if (storedUser?.email && storedUser.email.toLowerCase() === normalizedEmail) {
            setOtpLoading(false);
            setOtpError(isAr ? 'يوجد حساب مسجل بهذا البريد الإلكتروني بالفعل! يرجى تسجيل الدخول بدلاً من ذلك.' : 'An account with this email already exists. Please sign in.');
            setErrors((prev) => ({ ...prev, email: isAr ? 'هذا البريد مسجل مسبقاً' : 'Email already registered' }));
            return;
          }
        } catch (e) {}
      }

      // Check backend database via /api/auth/check-email
      const checkRes = await fetch('/api/auth/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail })
      }).catch(() => null);

      const checkData = checkRes ? await checkRes.json().catch(() => null) : null;
      if (checkData?.exists) {
        setOtpLoading(false);
        setOtpError(isAr ? 'يوجد حساب مسجل بهذا البريد الإلكتروني بالفعل! يرجى تسجيل الدخول بدلاً من ذلك.' : 'An account with this email already exists. Please sign in.');
        setErrors((prev) => ({ ...prev, email: isAr ? 'هذا البريد مسجل مسبقاً' : 'Email already registered' }));
        return;
      }
    } catch (err) {
      // proceed if check fails
    }

    try {
      const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
      const formattedPhone = phoneBody ? `+964${phoneBody}` : '';
      setSignupOtpHint('');

      // 1. Send OTP via backend service first (Immediate reliable fallback)
      const backendRes = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ email: email.trim(), type: 'register' }),
      }).catch(() => null);

      const backendData = backendRes ? await backendRes.json().catch(() => null) : null;
      if (backendData?.otpCode) {
        setSignupOtpHint(backendData.otpCode);
      }

      // 2. Send real email OTP directly via Supabase Auth with initial metadata
      const supabaseRes = await fetch('https://cfpmbasxvjlcfcteyyaa.supabase.co/auth/v1/otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'sb_publishable_sCozsAhhHZ9v9nWEkiNVlQ_Ne5IoXq2'
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          create_user: true,
          data: {
            full_name: fullName || undefined,
            name: fullName || undefined,
            first_name: firstName.trim() || undefined,
            last_name: lastName.trim() || undefined,
            phone: formattedPhone || undefined
          }
        })
      });

      const data = await supabaseRes.json().catch(() => ({}));

      if (!supabaseRes.ok && data?.error_code === 'over_email_send_rate_limit' && !backendData?.success) {
        setOtpError(isAr ? 'تم إرسال كود مسبقاً، يرجى الانتظار 60 ثانية قبل طلب كود جديد' : 'Please wait 60 seconds before requesting another code');
        setOtpLoading(false);
        return;
      }

      setOtpSent(true);
      setOtpSuccess(isAr
        ? 'تم إرسال كود التحقق إلى بريدك الإلكتروني بنجاح ✉️ يرجى مراجعة صندوق الوارد (أو مجلد Spam).'
        : 'Verification code sent to your email! Please check your inbox or spam folder.'
      );
    } catch (err) {
      setOtpError(isAr ? 'حدث خطأ في الاتصال، يرجى المحاولة مرة أخرى' : 'Failed to send verification email');
    } finally {
      setOtpLoading(false);
    }
  };

  // Handler to Verify OTP via Supabase Auth
  const handleVerifyOtp = async () => {
    if (!otpCode || otpCode.length < 6 || otpCode.length > 8) {
      setOtpError(isAr ? 'يرجى إدخال كود التحقق (من 6 إلى 8 أرقام)' : 'Enter valid OTP code (6-8 digits)');
      return;
    }

    setOtpLoading(true);
    setOtpError('');

    try {
      // 1. Verify with Supabase Auth
      const supabaseRes = await fetch('https://cfpmbasxvjlcfcteyyaa.supabase.co/auth/v1/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'sb_publishable_sCozsAhhHZ9v9nWEkiNVlQ_Ne5IoXq2'
        },
        body: JSON.stringify({
          type: 'email',
          email: email.trim().toLowerCase(),
          token: otpCode.trim()
        })
      });

      if (supabaseRes.ok) {
        const verifyData = await supabaseRes.json().catch(() => null);
        if (verifyData?.access_token) {
          setSupabaseAccessToken(verifyData.access_token);
        }
        setEmailVerified(true);
        setOtpSuccess(isAr ? 'تم تأكيد البريد الإلكتروني بنجاح! ✅' : 'Email verified successfully! ✅');
        setOtpError('');
        setOtpLoading(false);
        return;
      }

      // 2. Fallback check with backend if any
      const backendRes = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ email: email.trim(), code: otpCode.trim() }),
      }).catch(() => null);

      const backendData = backendRes ? await backendRes.json().catch(() => null) : null;
      if (backendData?.success) {
        setEmailVerified(true);
        setOtpSuccess(isAr ? 'تم تأكيد البريد الإلكتروني بنجاح! ✅' : 'Email verified successfully! ✅');
        setOtpError('');
        setOtpLoading(false);
        return;
      }

      setOtpError(isAr ? 'كود التحقق غير صحيح أو منتهي الصلاحية، يرجى التأكد من الرمز المرسل إلى بريدك' : 'Invalid or expired OTP code');
    } catch (err) {
      setOtpError(isAr ? 'فشل التحقق من الكود، يرجى المحاولة لاحقاً' : 'Verification failed');
    } finally {
      setOtpLoading(false);
    }
  };

  // Validation Form
  const validateForm = () => {
    const errs: Record<string, string> = {};

    // 1. First & Last Name: Arabic or English letters and spaces ONLY
    const nameRegex = /^[\u0600-\u06FFa-zA-Z\s]{2,50}$/;
    if (!firstName.trim()) {
      errs.firstName = isAr ? 'الاسم الأول مطلوب' : 'First name is required';
    } else if (!nameRegex.test(firstName.trim())) {
      errs.firstName = isAr ? 'يمنع إدخال أرقام أو رموز في الاسم الأول' : 'Letters only, no digits or symbols';
    }

    if (!lastName.trim()) {
      errs.lastName = isAr ? 'اسم العائلة مطلوب' : 'Last name is required';
    } else if (!nameRegex.test(lastName.trim())) {
      errs.lastName = isAr ? 'يمنع إدخال أرقام أو رموز في اسم العائلة' : 'Letters only, no digits or symbols';
    }

    // 2. Email & OTP Verification
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      errs.email = isAr ? 'يرجى إدخال بريد إلكتروني صحيح' : 'Invalid email';
    } else if (!emailVerified) {
      errs.email = isAr ? 'يجب التحقق من البريد الإلكتروني عبر إدخال كود التحقق أولاً' : 'Please verify your email with OTP';
    }

    // 3. Iraqi Phone: exactly 10 digits starting with 770, 780, or 790
    const iraqPhoneRegex = /^(770|780|790)\d{7}$/;
    if (!phoneBody) {
      errs.phone = isAr ? 'رقم الهاتف مطلوب' : 'Phone is required';
    } else if (!iraqPhoneRegex.test(phoneBody)) {
      errs.phone = isAr ? 'يجب إدخال 10 أرقام ويبدأ بـ 770 أو 780 أو 790' : 'Must be 10 digits starting with 770, 780, or 790';
    }

    // 3. Password: min 8 chars, letters, numbers, and symbols
    if (!password || password.length < 8) {
      errs.password = isAr ? 'كلمة المرور يجب ألا تقل عن 8 أحرف' : 'Password must be at least 8 characters';
    } else if (pwdStrength.score < 3) {
      errs.password = isAr ? 'يجب أن تحتوي كلمة المرور على حروف وأرقام ورموز خاصة (!@#$)' : 'Must contain letters, numbers, and symbols';
    }

    if (password !== confirmPassword) {
      errs.confirmPassword = isAr ? 'كلمتا المرور غير متطابقتين' : 'Passwords do not match';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    const formattedPhone = `+964${phoneBody}`;

    const storePayload = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      phone: formattedPhone,
      governorate,
      country: 'Iraq',
      storeName: `${firstName.trim()}`,
      subdomain: '',
      password
    };

    const userObj = {
      id: '',
      email: email.trim().toLowerCase(),
      name: `${firstName.trim()} ${lastName.trim()}`,
      phone: formattedPhone,
      governorate,
      storeName: `${firstName.trim()}`,
      subdomain: '',
      onboarding_completed: false,
      loggedIn: true,
      time: new Date().toISOString()
    };

    try {
      // 1. Official Supabase Auth Signup (Persists account credentials!)
      if (supabaseAccessToken) {
        const updateRes = await fetch('https://cfpmbasxvjlcfcteyyaa.supabase.co/auth/v1/user', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'apikey': 'sb_publishable_sCozsAhhHZ9v9nWEkiNVlQ_Ne5IoXq2',
            'Authorization': `Bearer ${supabaseAccessToken}`
          },
          body: JSON.stringify({
            password,
            data: {
              full_name: `${firstName.trim()} ${lastName.trim()}`,
              name: `${firstName.trim()} ${lastName.trim()}`,
              first_name: firstName.trim(),
              last_name: lastName.trim(),
              phone: formattedPhone,
              governorate,
              onboarding_completed: false,
              plan: 'free',
              order_limit: 5
            }
          })
        });
        const updateData = await updateRes.json().catch(() => null);
        if (updateData?.id) {
          userObj.id = updateData.id;
        }
      } else {
        const signupRes = await fetch('https://cfpmbasxvjlcfcteyyaa.supabase.co/auth/v1/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': 'sb_publishable_sCozsAhhHZ9v9nWEkiNVlQ_Ne5IoXq2'
          },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            password,
            data: {
              full_name: `${firstName.trim()} ${lastName.trim()}`,
              name: `${firstName.trim()} ${lastName.trim()}`,
              first_name: firstName.trim(),
              last_name: lastName.trim(),
              phone: formattedPhone,
              governorate,
              onboarding_completed: false,
              plan: 'free',
              order_limit: 5
            }
          })
        });
        const signupData = await signupRes.json().catch(() => null);
        if (signupData?.user?.id) {
          userObj.id = signupData.user.id;
        }
      }
    } catch (err) {}

    // ضمان وجود رمز تعريفي فريد للحساب
    if (!userObj.id) {
      userObj.id = `ZAEEM-ACC-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    }

    // Clear any previous poisoned registration data
    localStorage.removeItem('zaeem_registered_stores');
    localStorage.removeItem('zaeem_onboarding_completed');
    localStorage.removeItem('zaeem_onboarded_store');

    // Save user session & pass basic name info to onboarding
    localStorage.setItem('zaeem_user', JSON.stringify(userObj));
    localStorage.setItem('zaeem_auth_action', 'signup');
    localStorage.setItem('zaeem_store_data', JSON.stringify(storePayload));

    setLoading(false);
    window.location.hash = '#/onboarding';
    setLocation('/onboarding');
  };

  // Fallback to standard Supabase OAuth Redirect
  const fallbackToSupabaseOAuth = async (provider: 'google' | 'apple') => {
    setOauthLoading(true);
    localStorage.setItem('zaeem_auth_action', 'signup');
    localStorage.removeItem('zaeem_onboarding_completed');
    localStorage.removeItem('zaeem_onboarded_store');
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
        setErrors({ general: isAr ? `فشل إنشاء الحساب بـ Google: ${error.message}` : `OAuth error: ${error.message}` });
      }
    } catch (err: any) {
      console.error('OAuth trigger error:', err);
      setOauthLoading(false);
      setErrors({ general: isAr ? 'حدث خطأ أثناء بدء إنشاء الحساب' : 'Failed to initialize OAuth' });
    }
  };

  // Trigger Direct Google Identity Services Popup (or Supabase fallback)
  const handleOAuthClick = async (provider: 'google' | 'apple') => {
    if (provider === 'apple') {
      return fallbackToSupabaseOAuth(provider);
    }

    setOauthLoading(true);
    localStorage.setItem('zaeem_auth_action', 'signup');
    localStorage.removeItem('zaeem_onboarding_completed');
    localStorage.removeItem('zaeem_onboarded_store');

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
                const userEmail = userInfo.email.toLowerCase().trim();
                const cleanSlug = userEmail.split('@')[0].replace(/[^a-z0-9]/g, '').slice(0, 20);
                const cleanName = userInfo.name || userEmail.split('@')[0];

                const userObj = {
                  id: `usr_${userInfo.sub || Date.now()}`,
                  email: userEmail,
                  name: cleanName,
                  avatar: userInfo.picture || '',
                  phone: '+9647700000000',
                  governorate: 'بغداد',
                  storeName: `متجر ${cleanName}`,
                  subdomain: `${cleanSlug}.za3em.shop`,
                  provider: 'google',
                  loggedIn: true,
                  time: new Date().toISOString()
                };

                localStorage.setItem('zaeem_user', JSON.stringify(userObj));
                localStorage.setItem('zaeem_auth_action', 'signup');
                localStorage.removeItem('zaeem_onboarding_completed');
                localStorage.removeItem('zaeem_onboarded_store');
                localStorage.setItem('zaeem_store_data', JSON.stringify({
                  ...userObj,
                  plan: 'free',
                  orderLimit: 5
                }));

                setOauthLoading(false);
                window.location.hash = '#/onboarding';
                setLocation('/onboarding');
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
    <main dir={isAr ? 'rtl' : 'ltr'} className="min-h-[100dvh] flex flex-col lg:flex-row bg-white text-slate-900 font-sans select-none">
      {/* ========================================================================= */}
      {/* RIGHT SIDE: Form Panel */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-10 lg:p-12 border-l border-slate-100 overflow-y-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-6">
          <Logo showSubtitle={false} />
          <button
            type="button"
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
            className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 shadow-sm transition-colors cursor-pointer"
          >
            <Globe className="size-3.5 text-teal-600" />
            <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
          </button>
        </div>

        {/* Form Body Container */}
        <div className="max-w-md w-full mx-auto space-y-5 my-auto">
          {/* Badge & Title */}
          <div className="space-y-2 text-right">
            <span className="inline-block rounded-full bg-teal-50 border border-teal-200 px-3.5 py-1 text-[11px] font-extrabold text-teal-800">
              {isAr ? '⚡ ابدأ مجاناً — أول 5 شحنات مجاناً بدون بطاقة ائتمان' : '⚡ Start free — First 5 shipments free, no credit card'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {isAr ? 'أنشئ متجرك مع الزعيم' : 'Build Your Store with Al-Zaeem'}
            </h1>
            <p className="text-xs text-slate-500">
              {isAr ? 'منظومة تجارة إلكترونية متكاملة مع ربط مباشر بأسطول شحن 18 محافظة' : 'All-in-one e-commerce platform linked directly to Al-Zaeem fleet'}
            </p>
          </div>

          {errors.general && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-start gap-2.5 animate-shake">
              <AlertCircle className="size-4 shrink-0 mt-0.5 text-red-600" />
              <span className="leading-relaxed">{errors.general}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5 text-right" noValidate>
            {/* 1. First & Last Name (Clean Labels) */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  {isAr ? 'الاسم الأول *' : 'First Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value.replace(/[^\u0600-\u06FFa-zA-Z\s]/g, ''))}
                  placeholder={isAr ? 'أحمد' : 'Ahmad'}
                  className={`w-full rounded-2xl border px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none transition-all ${
                    errors.firstName ? 'border-red-400 bg-red-50/30' : 'border-slate-200 bg-slate-50/50 focus:border-teal-600 focus:bg-white'
                  }`}
                />
                {errors.firstName && <p className="text-[10px] text-red-500 font-bold">{errors.firstName}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  {isAr ? 'اسم العائلة *' : 'Last Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value.replace(/[^\u0600-\u06FFa-zA-Z\s]/g, ''))}
                  placeholder={isAr ? 'السامرائي' : 'Alsamer'}
                  className={`w-full rounded-2xl border px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none transition-all ${
                    errors.lastName ? 'border-red-400 bg-red-50/30' : 'border-slate-200 bg-slate-50/50 focus:border-teal-600 focus:bg-white'
                  }`}
                />
                {errors.lastName && <p className="text-[10px] text-red-500 font-bold">{errors.lastName}</p>}
              </div>
            </div>

            {/* 2. Email Address (Clean Label) & Guaranteed OTP */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                {isAr ? 'البريد الإلكتروني *' : 'Email Address *'}
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  required
                  disabled={emailVerified}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailVerified(false);
                    setOtpSent(false);
                  }}
                  placeholder="merchant@store.com"
                  dir="ltr"
                  className={`flex-1 rounded-2xl border px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none transition-all ${
                    errors.email ? 'border-red-400 bg-red-50/30' : 'border-slate-200 bg-slate-50/50 focus:border-teal-600 focus:bg-white'
                  } ${emailVerified ? 'bg-emerald-50/60 border-emerald-300 text-emerald-900 font-bold' : ''}`}
                />

                {!emailVerified && (
                  <button
                    type="button"
                    disabled={otpLoading || !email}
                    onClick={handleSendOtp}
                    className="px-3.5 py-2 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white text-[11px] font-bold shrink-0 shadow-sm cursor-pointer disabled:opacity-50 transition-colors flex items-center gap-1.5"
                  >
                    <Mail className="size-3.5" />
                    <span>{otpLoading ? 'جاري الإرسال...' : (otpSent ? 'إعادة الإرسال' : 'إرسال الكود')}</span>
                  </button>
                )}

                {emailVerified && (
                  <span className="flex items-center gap-1 bg-emerald-100 text-emerald-800 px-3 py-1 rounded-2xl text-[11px] font-bold shrink-0">
                    <CheckCircle2 className="size-3.5" /> مؤكد
                  </span>
                )}
              </div>

              {errors.email && <p className="text-[10px] text-red-500 font-bold">{errors.email}</p>}
              {otpSuccess && <p className="text-[10px] text-emerald-600 font-bold">{otpSuccess}</p>}
              {otpError && <p className="text-[10px] text-red-500 font-bold">{otpError}</p>}

              {/* 6 to 8-Digit OTP Code Input Box */}
              {otpSent && !emailVerified && (
                <div className="p-3.5 bg-slate-50 border border-teal-200 rounded-2xl space-y-2.5 mt-1 animate-fadeIn">
                  {signupOtpHint && (
                    <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 text-xs flex items-center justify-between animate-fadeIn">
                      <div>
                        <span className="font-bold block text-[11px]">رمز التحقق الفوري لبريدك:</span>
                        <span className="font-mono text-sm font-black tracking-widest text-teal-800">{signupOtpHint}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setOtpCode(signupOtpHint)}
                        className="px-3 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs cursor-pointer"
                      >
                        تعبئة تلقائية
                      </button>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-700">أدخل كود التحقق المستلم:</span>
                    <span className="text-[10px] font-medium text-slate-400">راجع صندوق الوارد (Inbox) أو Spam</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={8}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="12345678"
                      dir="ltr"
                      className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-center font-mono font-bold tracking-widest text-base focus:border-teal-600 focus:outline-none bg-white"
                    />
                    <button
                      type="button"
                      disabled={otpLoading || otpCode.length < 6}
                      onClick={handleVerifyOtp}
                      className="px-5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs cursor-pointer disabled:opacity-50 transition-colors"
                    >
                      {otpLoading ? 'جاري التحقق...' : 'تأكيد'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Governorate & Iraqi Phone Number (Clean Label) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  {isAr ? 'المحافظة *' : 'Governorate *'}
                </label>
                <select
                  value={governorate}
                  onChange={(e) => setGovernorate(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-xs text-slate-900 font-bold focus:border-teal-600 focus:bg-white focus:outline-none cursor-pointer"
                >
                  {IRAQ_GOVERNORATES.map((g) => (
                    <option key={g} value={g}>
                      🇮🇶 {g}
                    </option>
                  ))}
                </select>
              </div>

              {/* Fixed Non-Erasable +964 Iraqi Phone Input */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  {isAr ? 'رقم الهاتف *' : 'Phone *'}
                </label>
                <div
                  dir="ltr"
                  className={`flex items-center rounded-2xl border bg-slate-50/50 overflow-hidden transition-all ${
                    errors.phone ? 'border-red-400 bg-red-50/20' : 'border-slate-200 focus-within:border-teal-600 focus-within:bg-white'
                  }`}
                >
                  <span className="bg-slate-200/70 text-slate-700 px-3 py-2.5 text-xs font-mono font-extrabold select-none border-r border-slate-200 shrink-0">
                    +964
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={phoneBody}
                    onChange={(e) => {
                      let val = e.target.value.replace(/\D/g, '');
                      if (val.startsWith('0')) val = val.substring(1);
                      if (val.startsWith('964')) val = val.substring(3);
                      setPhoneBody(val.slice(0, 10));
                    }}
                    placeholder="7701234567"
                    className="w-full px-3 py-2.5 text-xs font-mono text-slate-900 bg-transparent focus:outline-none"
                  />
                </div>
                {errors.phone && <p className="text-[10px] text-red-500 font-bold">{errors.phone}</p>}
                {!errors.phone && phoneBody.length > 0 && phoneBody.length < 10 && (
                  <p className="text-[10px] text-slate-400 font-medium">{phoneBody.length}/10 أرقام</p>
                )}
              </div>
            </div>


            {/* 5. Password with Complexity Rule & Strength Meter */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  {isAr ? 'كلمة المرور *' : 'Password *'}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full rounded-2xl border px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none transition-all pl-9 ${
                      errors.password ? 'border-red-400 bg-red-50/30' : 'border-slate-200 bg-slate-50/50 focus:border-teal-600'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                  </button>
                </div>
                {errors.password && <p className="text-[10px] text-red-500 font-bold">{errors.password}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  {isAr ? 'تأكيد كلمة المرور *' : 'Confirm Password *'}
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full rounded-2xl border px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none transition-all ${
                    errors.confirmPassword ? 'border-red-400 bg-red-50/30' : 'border-slate-200 bg-slate-50/50 focus:border-teal-600'
                  }`}
                />
                {errors.confirmPassword && <p className="text-[10px] text-red-500 font-bold">{errors.confirmPassword}</p>}
              </div>
            </div>

            {/* Password Live Strength Meter */}
            {password.length > 0 && (
              <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-600">مستوى صعوبة كلمة المرور:</span>
                  <span className={`font-black ${pwdStrength.text}`}>{pwdStrength.label}</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5 h-1.5">
                  <div className={`rounded-full transition-colors ${pwdStrength.score >= 1 ? pwdStrength.color : 'bg-slate-200'}`} />
                  <div className={`rounded-full transition-colors ${pwdStrength.score >= 2 ? pwdStrength.color : 'bg-slate-200'}`} />
                  <div className={`rounded-full transition-colors ${pwdStrength.score >= 3 ? pwdStrength.color : 'bg-slate-200'}`} />
                  <div className={`rounded-full transition-colors ${pwdStrength.score >= 4 ? pwdStrength.color : 'bg-slate-200'}`} />
                </div>
                <p className="text-[10px] text-slate-500 leading-tight">
                  يجب أن تحتوي على 8 أحرف على الأقل، تشمل حروفاً وأرقاماً ورموزاً خاصة.
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-teal-700 hover:bg-teal-800 py-3.5 text-xs font-extrabold text-white shadow-xl shadow-teal-700/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 mt-3 cursor-pointer"
            >
              <span>{loading ? (isAr ? 'جاري إنشاء الحساب...' : 'Creating account...') : (isAr ? 'إنشاء الحساب ومتابعة إعداد المتجر (مجاناً)' : 'Create Account & Continue')}</span>
              {isAr ? <ArrowLeft className="size-4" /> : <ArrowRight className="size-4" />}
            </button>
          </form>

          {/* Social Auth Header */}
          <div className="relative flex items-center justify-center my-3">
            <div className="border-t border-slate-100 w-full" />
            <span className="bg-white px-3 text-[11px] font-bold text-slate-400 absolute">
              {isAr ? 'أو التسجيل السريع عبر' : 'Or quick sign up with'}
            </span>
          </div>

          {/* Interactive Social Auth Button */}
          <div className="space-y-2.5">
            <div id="google-signup-gis-container" className="w-full flex justify-center empty:hidden" />
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
              <span>{oauthLoading ? (isAr ? 'جاري التحويل...' : 'Redirecting...') : (isAr ? 'التسجيل السريع عبر Google' : 'Quick sign up with Google')}</span>
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
            {isAr ? 'أطلق متجرك.. ووصّل لكل المحافظات.' : 'Launch Your Store.. Ship to All Governorates.'}
          </h2>

          <p className="text-xs lg:text-sm text-teal-100/80 leading-relaxed">
            {isAr
              ? 'انضم لآلاف التجار الذين يديرون متاجرهم ويربطون شحناتهم مباشرة بأسطول شركة الزعيم للشحن مع تصفية أرباح الدفع عند الاستلام بانتظام.'
              : 'Join thousands of merchants managing online stores with seamless Al-Zaeem shipping and COD payouts.'}
          </p>
        </div>

        {/* 3 Value Cards */}
        <div className="relative z-10 space-y-4 max-w-lg">
          {[
            {
              title: isAr ? 'أول 5 شحنات مجاناً بالكامل' : 'First 5 Shipments 100% Free',
              desc: isAr ? 'ابدأ تجربة المنصة وأسطول الشحن بدون أي رسوم اشتراك أو بطاقة ائتمانية.' : 'Try the platform and logistics fleet with zero upfront fees.'
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
          {isAr ? 'المقر الرئيسي: بغداد - سريع الدورة - مقابل شركة تشانجان' : 'HQ: Baghdad - Dora Highway - Opposite Changan Co.'}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 🌐 OAUTH AUTHENTIC SELECTION MODAL (Google & Apple) */}
      {/* Real OAuth Setup Guidance Modal (if provider is not yet activated on Supabase) */}
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
                المتابعة بالتسجيل عبر البريد الإلكتروني و OTP
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
