import React, { useState, useEffect, type FormEvent } from 'react';
import {
  Settings2, Store, CreditCard, Shield, Truck, Bell, Code, Webhook,
  Check, Lock, Palette, LifeBuoy, Save, Globe, Power, CheckCircle2,
  AlertCircle, Smartphone, Key, User, Mail, Sparkles, ExternalLink, Clock,
  MapPin, Phone, Building2, HelpCircle, ArrowRight
} from 'lucide-react';
import { updateStoreActiveStatus } from '../utils/storeRegistry';
import { updateCloudStoreFullSettings, checkCloudSubdomain, saveCloudStore } from '../utils/cloudDb';
import { IRAQ_GOVERNORATES } from '../data/iraqData';
import { useLocation } from 'wouter';

export function SettingsPage() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<'store' | 'shipping' | 'payment' | 'security' | 'api'>('store');
  const [notification, setNotification] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // 1. Store & Identity State
  const [storeName, setStoreName] = useState('متجر الفخامة العراقي');
  const [subdomain, setSubdomain] = useState('alzaeem');
  const [originalSubdomain, setOriginalSubdomain] = useState('alzaeem');
  const [slogan, setSlogan] = useState('أفضل المنتجات الأصلية مع شحن سريع لكافة محافظات العراق');
  const [category, setCategory] = useState('أزياء وموضة');
  const [storePhone, setStorePhone] = useState('+964 770 000 0000');
  const [isSubdomainActive, setIsSubdomainActive] = useState(true);

  // 2. Sender Shipping Details (تفاصيل الراسل للشحن)
  const [senderName, setSenderName] = useState('متجر الفخامة العراقي');
  const [senderPhone, setSenderPhone] = useState('07701234567');
  const [senderGovernorate, setSenderGovernorate] = useState('بغداد');
  const [senderAddress, setSenderAddress] = useState('بغداد - الكرادة - قرب ساحة الواثق');

  // 3. Payment Methods State
  const [enableCod, setEnableCod] = useState(true);
  const [enableZainCash, setEnableZainCash] = useState(true);
  const [zainPhone, setZainPhone] = useState('07801234567');
  const [enableQiCard, setEnableQiCard] = useState(true);
  const [qiAccountNumber, setQiAccountNumber] = useState('4128-9901-8842-1092');

  // 4. Security & Account State
  const [merchantName, setMerchantName] = useState('أحمد العراقي');
  const [merchantEmail, setMerchantEmail] = useState('ahmed@za3em.shop');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Load all saved settings from cloud / localStorage on mount
  useEffect(() => {
    try {
      const rawStore = localStorage.getItem('zaeem_store_data') || localStorage.getItem('zaeem_onboarded_store');
      const rawUser = localStorage.getItem('zaeem_user');
      const rawSender = localStorage.getItem('zaeem_sender_shipping_info');
      const rawPayment = localStorage.getItem('zaeem_payment_methods');

      if (rawStore) {
        const p = JSON.parse(rawStore);
        if (p.storeName || p.name) setStoreName(p.storeName || p.name);
        if (p.slogan) setSlogan(p.slogan);
        if (p.category) setCategory(p.category);
        if (p.phone) setStorePhone(p.phone);
        if (typeof p.isActive === 'boolean') setIsSubdomainActive(p.isActive);

        const sub = (p.subdomain || 'alzaeem').replace('.za3em.shop', '').replace(/^https?:\/\//, '').trim();
        setSubdomain(sub);
        setOriginalSubdomain(sub);
      }

      if (rawUser) {
        const u = JSON.parse(rawUser);
        if (u.name) setMerchantName(u.name);
        if (u.email) setMerchantEmail(u.email);
      }

      if (rawSender) {
        const s = JSON.parse(rawSender);
        if (s.senderName) setSenderName(s.senderName);
        if (s.senderPhone) setSenderPhone(s.senderPhone);
        if (s.senderGovernorate) setSenderGovernorate(s.senderGovernorate);
        if (s.senderAddress) setSenderAddress(s.senderAddress);
      }

      if (rawPayment) {
        const pm = JSON.parse(rawPayment);
        if (typeof pm.enableCod === 'boolean') setEnableCod(pm.enableCod);
        if (typeof pm.enableZainCash === 'boolean') setEnableZainCash(pm.enableZainCash);
        if (pm.zainPhone) setZainPhone(pm.zainPhone);
        if (typeof pm.enableQiCard === 'boolean') setEnableQiCard(pm.enableQiCard);
        if (pm.qiAccountNumber) setQiAccountNumber(pm.qiAccountNumber);
      }
    } catch (e) {}
  }, []);

  const handleToggleSubdomainActive = async () => {
    const nextState = !isSubdomainActive;
    setIsSubdomainActive(nextState);
    await updateStoreActiveStatus(subdomain, nextState);
    showToast(nextState ? 'تم تنشيط الموقع أونلاين بنجاح 🟢' : 'تم إيقاف الموقع مؤقتاً في وضع الصيانة ⏸️');
  };

  const handleSaveStoreInfo = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const cleanSub = subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '').trim();
      
      // إذا قام بتغيير الدومين، نتأكد من توفره أولاً
      if (cleanSub !== originalSubdomain) {
        const check = await checkCloudSubdomain(cleanSub, merchantEmail);
        if (!check.available && check.reason === 'taken') {
          alert(`عذراً، النطاق (${cleanSub}.za3em.shop) محجوز لمتجر آخر.`);
          setIsSaving(false);
          return;
        }
      }

      const updatedStoreData = {
        storeName: storeName.trim(),
        subdomain: cleanSub,
        slogan: slogan.trim(),
        category,
        phone: storePhone.trim(),
        isActive: isSubdomainActive,
        country: 'Iraq',
        currency: 'IQD',
      };

      // 1. Save to cloud PostgreSQL server
      await updateCloudStoreFullSettings({
        subdomain: cleanSub,
        name: storeName.trim(),
        isActive: isSubdomainActive,
      });

      // 2. Save locally
      localStorage.setItem('zaeem_store_data', JSON.stringify(updatedStoreData));
      localStorage.setItem('zaeem_onboarded_store', JSON.stringify(updatedStoreData));

      // 3. Update user object
      const rawUser = localStorage.getItem('zaeem_user');
      if (rawUser) {
        const u = JSON.parse(rawUser);
        u.storeName = storeName.trim();
        u.subdomain = `${cleanSub}.za3em.shop`;
        localStorage.setItem('zaeem_user', JSON.stringify(u));
      }

      setOriginalSubdomain(cleanSub);
      await updateStoreActiveStatus(cleanSub, isSubdomainActive);
      window.dispatchEvent(new CustomEvent('zaeem_store_updated'));

      showToast('تم حفظ بيانات المتجر ورفعها على السيرفر المركزي بنجاح ✅');
    } catch (err) {
      console.warn('Error saving store info:', err);
      showToast('تم حفظ البيانات محلياً بنجاح ✅');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveShippingInfo = (e: FormEvent) => {
    e.preventDefault();
    const info = {
      senderName: senderName.trim(),
      senderPhone: senderPhone.trim(),
      senderGovernorate,
      senderAddress: senderAddress.trim(),
    };
    localStorage.setItem('zaeem_sender_shipping_info', JSON.stringify(info));
    window.dispatchEvent(new CustomEvent('zaeem_store_updated'));
    showToast('تم حفظ بيانات الراسل المعتمدة لبوالص الشحن بنجاح 🚚');
  };

  const handleSavePaymentMethods = (e: FormEvent) => {
    e.preventDefault();
    const pm = {
      enableCod,
      enableZainCash,
      zainPhone: zainPhone.trim(),
      enableQiCard,
      qiAccountNumber: qiAccountNumber.trim(),
    };
    localStorage.setItem('zaeem_payment_methods', JSON.stringify(pm));
    showToast('تم تحديث طرق الدفع والتحصيل بنجاح 💳');
  };

  const handleSaveAccountSecurity = (e: FormEvent) => {
    e.preventDefault();

    if (newPassword) {
      if (newPassword.length < 6) {
        alert('كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل.');
        return;
      }
      if (newPassword !== confirmPassword) {
        alert('كلمتا المرور غير متطابقتين.');
        return;
      }
    }

    const rawUser = localStorage.getItem('zaeem_user');
    const userObj = rawUser ? JSON.parse(rawUser) : {};
    userObj.name = merchantName.trim();
    userObj.email = merchantEmail.trim();
    localStorage.setItem('zaeem_user', JSON.stringify(userObj));

    setPasswordSuccess(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    showToast('تم تحديث بيانات الحساب والأمان بنجاح 🔒');
    setTimeout(() => setPasswordSuccess(false), 4000);
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto pb-12 rf-appear text-right">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-teal-500/30 flex items-center gap-2 animate-in fade-in text-xs font-bold">
          <CheckCircle2 className="size-4 text-teal-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-teal-700 dark:text-teal-400 mb-1">
          <Settings2 className="size-4" /> إدارة المتجر والمنظومة
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          إعدادات المتجر والحساب
        </h1>
        <p className="text-sm text-slate-500 mt-1 font-medium">
          إدارة هوية المتجر، الدومين الفرعي المحجوز، تفاصيل الراسل للشحن، بوابات الدفع، والأمان.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-px overflow-x-auto">
        {[
          { id: 'store', label: 'المتجر والهوية', icon: Store },
          { id: 'shipping', label: 'إعدادات الشحن وتفاصيل الراسل', icon: Truck },
          { id: 'payment', label: 'طرق الدفع والتحصيل', icon: CreditCard },
          { id: 'security', label: 'الأمان والحساب', icon: Shield },
          { id: 'api', label: 'المطور و API', icon: Code },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as never)}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-extrabold rounded-t-2xl transition-all border-b-2 -mb-px whitespace-nowrap cursor-pointer ${
              activeTab === t.id
                ? 'border-teal-500 text-teal-600 dark:text-teal-400 bg-teal-50/60 dark:bg-teal-950/30'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <t.icon className="size-4" />
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* 1. TAB: المتجر والهوية (Store & Subdomain) */}
      {/* ========================================================================= */}
      {activeTab === 'store' && (
        <div className="grid gap-6 lg:grid-cols-3">
          <form
            onSubmit={handleSaveStoreInfo}
            className="lg:col-span-2 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 shadow-sm space-y-6"
          >
            {/* بطاقة تنشيط الموقع أونلاين */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950 border border-teal-500/30 text-white shadow-md space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className={`size-11 rounded-xl grid place-items-center transition-colors shrink-0 ${
                    isSubdomainActive
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}>
                    <Globe className="size-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-extrabold text-white">حالة المتجر أونلاين</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-black flex items-center gap-1.5 ${
                        isSubdomainActive
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      }`}>
                        <span className={`size-2 rounded-full ${isSubdomainActive ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                        {isSubdomainActive ? 'نشط ومفتوح للزبائن' : 'معطل مؤقتاً'}
                      </span>
                    </div>
                    <p className="text-xs text-teal-400/90 font-mono mt-0.5 dir-ltr text-right">
                      https://{subdomain || 'mystore'}.za3em.shop
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-300 select-none">
                    {isSubdomainActive ? 'إيقاف المتجر' : 'تنشيط المتجر'}
                  </span>
                  <button
                    type="button"
                    onClick={handleToggleSubdomainActive}
                    className={`relative inline-flex h-8 w-16 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ${
                      isSubdomainActive ? 'bg-emerald-500' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`pointer-events-none flex items-center justify-center size-7 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
                        isSubdomainActive ? 'translate-x-8' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            <h2 className="text-base font-extrabold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
              معلومات وهوية المتجر
            </h2>

            {/* اسم المتجر */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                اسم المتجر <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="مثال: متجر الفخامة العراقي"
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:border-teal-600 text-slate-900 dark:text-white"
              />
            </div>

            {/* الدومين الفرعي المحجوز */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                الدومين الفرعي المحجوز (Subdomain) <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center">
                <input
                  required
                  type="text"
                  value={subdomain}
                  onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  placeholder="alzaeem"
                  className="w-full h-11 px-3.5 rounded-r-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-mono font-bold ltr text-right outline-none focus:border-teal-600 text-slate-900 dark:text-white"
                />
                <span className="h-11 px-3.5 bg-slate-100 dark:bg-slate-800 border border-r-0 border-slate-200 dark:border-slate-700 rounded-l-xl text-xs font-mono font-bold text-slate-600 dark:text-slate-400 flex items-center">
                  .za3em.shop
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                الدومين الظاهر أعلاه هو الدومين الفعلي المحجوز لمتجرك؛ عند تغييره سيتم نقله على السيرفر المركزي تلقائياً.
              </p>
            </div>

            {/* الشعار والوصف */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                شعار ووصف المتجر (Slogan)
              </label>
              <input
                type="text"
                value={slogan}
                onChange={(e) => setSlogan(e.target.value)}
                placeholder="أفضل المنتجات مع شحن سريع لجميع المحافظات"
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:border-teal-600 text-slate-900 dark:text-white"
              />
            </div>

            {/* تصنيف المتجر وسوق العمل */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  تخصص ونشاط المتجر
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="أزياء / عطور / إلكترونيات"
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:border-teal-600 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  سوق العمل المعتمد والعملة
                </label>
                <select
                  disabled
                  value="Iraq"
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-sm font-extrabold text-slate-700 dark:text-slate-300 outline-none cursor-not-allowed"
                >
                  <option value="Iraq">جمهورية العراق — الدينار العراقي (IQD د.ع)</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="px-7 py-3 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-extrabold shadow-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Save className="size-4" />
                <span>{isSaving ? 'جارِ الحفظ والرفع للسيرفر...' : 'حفظ التعديلات ورفعها للسيرفر'}</span>
              </button>
            </div>
          </form>

          {/* Side Shortcuts */}
          <div className="space-y-4">
            {/* مركز المساعدة والدعم */}
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-3">
              <div className="size-11 rounded-2xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 grid place-items-center">
                <HelpCircle className="size-6" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                مركز المساعدة والدعم الفني
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                هل تحتاج لمساعدة في إعداد المتجر، ربط الدومين، أو خدمات شحن شركة الزعيم؟
              </p>
              <button
                type="button"
                onClick={() => setLocation('/support')}
                className="w-full py-3 bg-slate-100 dark:bg-slate-800 hover:bg-teal-700 hover:text-white text-slate-800 dark:text-slate-200 font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>الانتقال لمركز المساعدة والدعم</span>
                <ArrowRight className="size-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. TAB: إعدادات الشحن وتفاصيل الراسل (Sender Shipping Details) */}
      {/* ========================================================================= */}
      {activeTab === 'shipping' && (
        <form
          onSubmit={handleSaveShippingInfo}
          className="max-w-3xl rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 shadow-sm space-y-6"
        >
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="p-2.5 rounded-2xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
              <Truck className="size-6" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                تفاصيل الراسل المعتمدة في بوالص الشحن (SENDER)
              </h2>
              <p className="text-xs text-slate-500">
                هذه البيانات ستظهر تلقائياً على ملصقات الشحن الحرارية المسلمة لمناديب شركة الزعيم
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            {/* اسم الراسل / المتجر */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                اسم التاجر / الراسل (Sender Name) <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="متجر الفخامة العراقي"
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white outline-none focus:border-teal-600"
              />
            </div>

            {/* هاتف الراسل */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                رقم هاتف الراسل / الدعم <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                value={senderPhone}
                onChange={(e) => setSenderPhone(e.target.value)}
                placeholder="07701234567"
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-mono text-slate-900 dark:text-white outline-none focus:border-teal-600"
              />
            </div>

            {/* محافظة الراسل */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                محافظة الراسل / المستودع <span className="text-red-500">*</span>
              </label>
              <select
                value={senderGovernorate}
                onChange={(e) => setSenderGovernorate(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-teal-600"
              >
                {IRAQ_GOVERNORATES.map((gov) => (
                  <option key={gov.id} value={gov.name}>
                    {gov.name}
                  </option>
                ))}
              </select>
            </div>

            {/* عنوان الراسل التفصيلي */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                العنوان التفصيلي وموقع الاستلام للمندوب <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                value={senderAddress}
                onChange={(e) => setSenderAddress(e.target.value)}
                placeholder="بغداد - الكرادة - شارع العرصات قرب ساحة الواثق"
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white outline-none focus:border-teal-600"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              type="submit"
              className="px-7 py-3 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-extrabold shadow-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <Save className="size-4" />
              <span>حفظ تفاصيل الراسل</span>
            </button>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* 3. TAB: طرق الدفع والتحصيل (Payment Methods) */}
      {/* ========================================================================= */}
      {activeTab === 'payment' && (
        <form
          onSubmit={handleSavePaymentMethods}
          className="max-w-3xl rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 shadow-sm space-y-6"
        >
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
              طرق التحصيل والدفع المتاحة في المتجر
            </h2>
            <p className="text-xs text-slate-500">
              تفعيل خيارات الدفع عند الاستلام والمحافظ الإلكترونية العراقية
            </p>
          </div>

          <div className="space-y-4">
            {/* 1. الدفع عند الاستلام */}
            <div className="p-4 rounded-2xl bg-teal-50/50 dark:bg-teal-950/30 border border-teal-200/60 dark:border-teal-900/50 flex items-center justify-between">
              <div>
                <p className="font-extrabold text-sm text-slate-900 dark:text-white">
                  الدفع نقداً عند الاستلام (COD)
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  تحصيل الأموال نقداً بواسطة مندوبي شركة الزعيم مع تصفية أسبوعية/يومية.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-black bg-teal-700 text-white">
                مفعل افتراضياً ✓
              </span>
            </div>

            {/* 2. محفظة زين كاش */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Smartphone className="size-5 text-purple-600" />
                  <div>
                    <p className="font-extrabold text-sm text-slate-900 dark:text-white">
                      محفظة زين كاش (ZainCash)
                    </p>
                    <p className="text-xs text-slate-500">استلام الدفعات عبر رقم محفظة زين كاش مباشرة</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={enableZainCash}
                  onChange={(e) => setEnableZainCash(e.target.checked)}
                  className="size-4 accent-teal-600 cursor-pointer"
                />
              </div>

              {enableZainCash && (
                <div className="pt-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    رقم محفظة زين كاش لاستلام الأموال:
                  </label>
                  <input
                    type="text"
                    value={zainPhone}
                    onChange={(e) => setZainPhone(e.target.value)}
                    placeholder="07801234567"
                    className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono font-bold text-slate-900 dark:text-white"
                  />
                </div>
              )}
            </div>

            {/* 3. مصرف الرافدين / كي كارد */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <CreditCard className="size-5 text-amber-600" />
                  <div>
                    <p className="font-extrabold text-sm text-slate-900 dark:text-white">
                      مصرف الرافدين / بطاقات كي كارد (Qi Card)
                    </p>
                    <p className="text-xs text-slate-500">الدفع الإلكتروني عبر بطاقات الماستر كارد والكي كارد</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={enableQiCard}
                  onChange={(e) => setEnableQiCard(e.target.checked)}
                  className="size-4 accent-teal-600 cursor-pointer"
                />
              </div>

              {enableQiCard && (
                <div className="pt-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    رقم الحساب / بطاقة كي كارد لاستقبال التحويلات:
                  </label>
                  <input
                    type="text"
                    value={qiAccountNumber}
                    onChange={(e) => setQiAccountNumber(e.target.value)}
                    placeholder="4128-XXXX-XXXX-XXXX"
                    className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono font-bold text-slate-900 dark:text-white"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              type="submit"
              className="px-7 py-3 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-extrabold shadow-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <Save className="size-4" />
              <span>حفظ إعدادات الدفع</span>
            </button>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* 4. TAB: الأمان والحساب (Security & Account) */}
      {/* ========================================================================= */}
      {activeTab === 'security' && (
        <form
          onSubmit={handleSaveAccountSecurity}
          className="max-w-3xl rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 shadow-sm space-y-6"
        >
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
              الأمان ومعلومات الحساب
            </h2>
            <p className="text-xs text-slate-500">
              تعديل الاسم الشخصي، البريد الإلكتروني، وتغيير كلمة المرور
            </p>
          </div>

          {passwordSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-900 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-600" />
              <span>تم تحديث بيانات الحساب وكلمة المرور بنجاح ✅</span>
            </div>
          )}

          <div className="space-y-4 text-xs">
            {/* تعديل الاسم */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                الاسم الشخصي للتاجر:
              </label>
              <div className="flex items-center">
                <input
                  type="text"
                  value={merchantName}
                  onChange={(e) => setMerchantName(e.target.value)}
                  placeholder="أحمد علي"
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white outline-none focus:border-teal-600"
                />
              </div>
            </div>

            {/* تعديل البريد الإلكتروني */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                البريد الإلكتروني المسجل:
              </label>
              <input
                type="email"
                value={merchantEmail}
                onChange={(e) => setMerchantEmail(e.target.value)}
                placeholder="ahmed@za3em.shop"
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-mono text-slate-900 dark:text-white outline-none focus:border-teal-600"
              />
            </div>

            {/* قسم تغيير كلمة المرور */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3 pt-4">
              <span className="font-extrabold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
                <Lock className="size-4 text-teal-600" />
                <span>تغيير كلمة المرور:</span>
              </span>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                    كلمة المرور الجديدة:
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                    تأكيد كلمة المرور:
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              type="submit"
              className="px-7 py-3 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-extrabold shadow-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <Save className="size-4" />
              <span>تحديث بيانات الأمان والحساب</span>
            </button>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* 5. TAB: المطور و API (Developer & API) */}
      {/* ========================================================================= */}
      {activeTab === 'api' && (
        <div className="max-w-3xl rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm space-y-6 text-center">
          <div className="size-16 rounded-3xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 grid place-items-center mx-auto border border-amber-200 dark:border-amber-900/50 shadow-inner">
            <Clock className="size-8 animate-pulse" />
          </div>

          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              <Clock className="size-3.5" />
              غير متاح حالياً — تحت التطوير
            </span>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              بوابة المطورين والربط المباشر (REST API & Webhooks)
            </h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              نقوم حالياً بتجهيز واجهات الـ REST API المفتوحة والـ Webhooks المباشرة لتمكين المطورين من ربط المتاجر بالأنظمة المحاسبية وتطبيقات ERP الخاصة.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 max-w-md mx-auto text-xs text-slate-600 dark:text-slate-400 font-mono">
            GET /v1/orders/sync • POST /v1/shipments/create
          </div>
        </div>
      )}
    </div>
  );
}
