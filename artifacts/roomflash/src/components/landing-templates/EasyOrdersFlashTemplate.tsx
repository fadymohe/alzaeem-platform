import React, { useState, useEffect } from "react";
import {
  Truck,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Star,
  Sparkles,
  Phone,
  MapPin,
  ArrowDown,
  Lock,
  ThumbsUp,
  Award,
  Zap,
} from "lucide-react";
import {
  SingleButtonShippingSelector,
  IRAQ_GOVERNORATES_LIST,
  type IraqGovernorateShipping,
} from "../shipping/SingleButtonShippingSelector";
import { formatIQD } from "../../data/iraqData";

export interface TemplateProduct {
  id: number | string;
  title: string;
  description: string;
  price: number; // بالدينار العراقي
  compareAtPrice?: number;
  imageUrl: string;
  images?: string[];
  discountTwoItems?: number;
  discountThreeItems?: number;
}

export interface TemplateStore {
  id: number | string;
  name: string;
  subdomain: string;
  templateId?: string;
  storeCode?: string;
  logoUrl?: string;
  bannerUrl?: string;
}

interface EasyOrdersFlashTemplateProps {
  store: TemplateStore;
  product: TemplateProduct;
  onPlaceOrder: (orderData: {
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    governorate: string;
    quantity: number;
    shippingCost: number;
    totalAmount: number;
    notes?: string;
  }) => Promise<any>;
}

export const EasyOrdersFlashTemplate: React.FC<EasyOrdersFlashTemplateProps> = ({
  store,
  product,
  onPlaceOrder,
}) => {
  // حالات النموذج
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [notes, setNotes] = useState("");

  // اختيار المحافظة والشحن الافتراضي (بغداد 3,000 د.ع)
  const [selectedGov, setSelectedGov] = useState<IraqGovernorateShipping>(
    IRAQ_GOVERNORATES_LIST[0]
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<string>(product.imageUrl);

  useEffect(() => {
    setSelectedImage(product.imageUrl);
  }, [product.imageUrl]);

  // عداد تنازلي للخصم (Urgency)
  const [timeLeft, setTimeLeft] = useState({ hours: 3, minutes: 42, seconds: 18 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 4, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // حساب باقات العروض بالدينار العراقي الصحيح
  // 1 قطعة: السعر الأساسي
  // 2 قطعة: نسبة الخصم المحددة (افتراضياً 15%)
  // 3 قطع: نسبة الخصم المحددة (افتراضياً 25%) + شحن مجاني
  const calculatePricing = () => {
    const basePrice = Math.round(product.price);
    let itemsTotal = basePrice * quantity;
    let shipping = selectedGov.shippingCost;

    const disc2 = typeof product.discountTwoItems === 'number' && product.discountTwoItems >= 0 ? product.discountTwoItems : 15;
    const disc3 = typeof product.discountThreeItems === 'number' && product.discountThreeItems >= 0 ? product.discountThreeItems : 25;

    if (quantity === 2) {
      itemsTotal = Math.round(basePrice * 2 * (1 - disc2 / 100));
    } else if (quantity >= 3) {
      itemsTotal = Math.round(basePrice * quantity * (1 - disc3 / 100));
      shipping = 0; // شحن مجاني عند طلب 3 قطع أو أكثر
    }

    const grandTotal = Math.round(itemsTotal + shipping);
    return {
      itemsTotal,
      shipping,
      grandTotal,
      savings: Math.round(
        (product.compareAtPrice || basePrice * 1.3) * quantity - itemsTotal
      ),
    };
  };

  const { itemsTotal, shipping, grandTotal, savings } = calculatePricing();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !customerAddress) {
      alert("يرجى ملء جميع الحقول المطلوبة (الاسم، الهاتف، العنوان بالتفصيل)");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await onPlaceOrder({
        customerName,
        customerPhone,
        customerAddress,
        governorate: selectedGov.name,
        quantity,
        shippingCost: shipping,
        totalAmount: grandTotal,
        notes,
      });
      setOrderSuccess(result);
    } catch (err: any) {
      alert(err.message || "حدث خطأ أثناء إرسال الطلب، يرجى المحاولة ثانية");
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToCheckout = () => {
    document.getElementById("checkout-form-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans select-none pb-24 selection:bg-emerald-500 selection:text-slate-950">
      {/* ========================================================================= */}
      {/* 1. شريط الإعلانات الترويجي العلوي (Top Flash Promo Bar) */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white py-2.5 px-4 text-center text-xs sm:text-sm font-black tracking-wide shadow-md flex items-center justify-center gap-2">
        <Zap className="size-4 animate-bounce text-yellow-300 fill-yellow-300" />
        <span>عرض حصري اليوم: الدفع عند الاستلام بعد المعاينة + شحن لجميع المحافظات!</span>
      </div>

      {/* ترويسة المتجر */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-emerald-500 text-slate-950 font-black grid place-items-center text-base shadow-sm">
              {store.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="font-extrabold text-sm sm:text-base text-white leading-tight">
                {store.name}
              </h1>
              <span className="text-[10px] text-emerald-400 font-bold block">
                متجر معتمد على za3em.shop
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={scrollToCheckout}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <span>اطلب الآن</span>
            <ArrowDown className="size-3.5 animate-bounce" />
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. العداد التنازلي وعداد المشاهدات الحية */}
      {/* ========================================================================= */}
      <div className="max-w-4xl mx-auto px-4 mt-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-red-500 animate-ping" />
            <span className="text-xs font-bold text-slate-300">
              يشاهد هذا المنتج الآن <strong className="text-emerald-400 font-black font-mono">36 مشترٍ</strong> في العراق
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold">
            <Clock className="size-4 text-amber-400" />
            <span className="text-slate-400">ينتهي العرض خلال:</span>
            <div className="flex items-center gap-1 font-mono font-black text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-800/60">
              <span>{String(timeLeft.hours).padStart(2, "0")}</span>:
              <span>{String(timeLeft.minutes).padStart(2, "0")}</span>:
              <span>{String(timeLeft.seconds).padStart(2, "0")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. استعراض المنتج الرئيسي وصور العرض (Hero Product Showcase) */}
      {/* ========================================================================= */}
      <main className="max-w-4xl mx-auto px-4 mt-6 space-y-8">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-8 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* صورة المنتج مع الشارات */}
            <div className="space-y-3">
              <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 aspect-square group shadow-inner">
                <img
                  src={selectedImage || product.imageUrl}
                  alt={product.title}
                  className="size-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <span className="absolute top-3 right-3 text-xs font-black bg-red-600 text-white px-3 py-1 rounded-full shadow-md">
                  خصم خاص لفترة محدودة
                </span>
                <span className="absolute bottom-3 left-3 text-[11px] font-bold bg-slate-950/90 text-emerald-400 border border-emerald-500/40 px-3 py-1 rounded-full backdrop-blur-md flex items-center gap-1">
                  <CheckCircle2 className="size-3.5" />
                  منتج أصلي 100%
                </span>
              </div>

              {/* صور إضافية مصغرة للتنقل بين زوايا المنتج */}
              {product.images && product.images.length > 1 && (
                <div className="flex items-center gap-2 justify-center">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedImage(img)}
                      className={`relative size-14 rounded-xl overflow-hidden border-2 transition-all ${
                        (selectedImage || product.imageUrl) === img
                          ? 'border-teal-500 shadow-md scale-105'
                          : 'border-slate-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`صورة ${i + 1}`} className="size-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* تفاصيل المنتج والأسعار بالجنيه المصري الصحيح */}
            <div className="space-y-4 text-right">
              {/* تقييم النجوم */}
              <div className="flex items-center gap-2">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="size-4 fill-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-400">
                  (4.9/5 بناءً على 480 تقييم موثق)
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white leading-snug">
                {product.title}
              </h2>

              {/* الأسعار بالدينار العراقي (IQD) */}
              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-1">
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">
                    {formatIQD(product.price)}
                  </span>
                  <span className="text-sm font-bold font-mono text-slate-500 line-through">
                    {formatIQD(product.compareAtPrice || product.price + 12000)}
                  </span>
                </div>
                <p className="text-xs font-bold text-emerald-300">
                  وفر اليوم {formatIQD(12000)} + الدفع نقداً عند استلام الشحنة
                </p>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {product.description}
              </p>

              {/* مميزات سريعة */}
              <ul className="space-y-2 pt-2 border-t border-slate-800 text-xs font-bold text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                  <span>معاينة وفحص المنتج قبل دفع أي مبالغ للمندوب</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                  <span>شحن سريع مع أسطول شركة الزعيم لجميع محافظات العراق</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                  <span>ضمان استبدال فوري لمدة 14 يوماً ضد عيوب الصناعة</span>
                </li>
              </ul>

              <button
                type="button"
                onClick={scrollToCheckout}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-base shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 animate-pulse"
              >
                <span>اطلب الآن - الدفع عند الاستلام</span>
                <ArrowDown className="size-5" />
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. قسم نموذج الطلب والدفع عند الاستلام مع زر الشحن الموحد */}
        {/* ========================================================================= */}
        <section
          id="checkout-form-section"
          className="bg-slate-900 border-2 border-emerald-500/40 rounded-3xl p-5 sm:p-8 shadow-2xl relative"
        >
          <div className="absolute -top-3.5 right-6 bg-emerald-500 text-slate-950 text-xs font-black px-4 py-1 rounded-full shadow-md">
            نموذج الطلب السريع (COD)
          </div>

          <div className="text-right mb-6">
            <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              <Truck className="size-5 text-emerald-400" />
              أدخل بياناتك وسيتم شحن طلبك فوراً
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              لن تدفع أي مبالغ مقدماً - الدفع للمندوب نقداً بعد استلام ومعاينة المنتج
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 text-right">
            {/* 1. اختيار باقة العرض والكمية */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 block">
                اختر العرض المناسب لك:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  {
                    qty: 1,
                    title: "قطعة واحدة",
                    badge: "العرض الأساسي",
                    price: formatIQD(product.price),
                  },
                  {
                    qty: 2,
                    title: `قطعتين (خصم ${product.discountTwoItems ?? 15}%)`,
                    badge: "الأكثر طلباً ⭐",
                    price: formatIQD(Math.round(product.price * 2 * (1 - (product.discountTwoItems ?? 15) / 100))),
                  },
                  {
                    qty: 3,
                    title: `3 قطع (خصم ${product.discountThreeItems ?? 25}%)`,
                    badge: "شحن مجاني 🎁",
                    price: formatIQD(Math.round(product.price * 3 * (1 - (product.discountThreeItems ?? 25) / 100))),
                  },
                ].map((pack) => (
                  <button
                    key={pack.qty}
                    type="button"
                    onClick={() => setQuantity(pack.qty)}
                    className={`p-3 rounded-2xl border text-right transition-all flex flex-col justify-between ${
                      quantity === pack.qty
                        ? "bg-emerald-950/60 border-emerald-500 text-white ring-2 ring-emerald-500/50 shadow-md"
                        : "bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-black bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full">
                        {pack.badge}
                      </span>
                      <div
                        className={`size-4 rounded-full border grid place-items-center ${
                          quantity === pack.qty
                            ? "bg-emerald-500 border-emerald-400 text-slate-950"
                            : "border-slate-600"
                        }`}
                      >
                        {quantity === pack.qty && <div className="size-2 bg-slate-950 rounded-full" />}
                      </div>
                    </div>
                    <span className="text-xs font-black text-white">{pack.title}</span>
                    <span className="text-sm font-mono font-black text-emerald-400 mt-1">
                      {pack.price}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. بيانات العميل */}
            <div className="space-y-4 pt-2">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  الاسم الكامل باللغة العربية *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="مثال: علي حسن عبد الرضا"
                  className="w-full h-11 px-4 rounded-xl border border-slate-700 bg-slate-950 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  رقم الهاتف للتواصل وتأكيد الشحن *
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="مثال: 07701234567 أو 07801234567 أو 07501234567"
                  dir="ltr"
                  className="w-full h-11 px-4 rounded-xl border border-slate-700 bg-slate-950 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-right"
                />
              </div>

              {/* 3. واجهة الشحن الموحدة (Single-Button Shipping Selector) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">
                  المحافظة وتكلفة الشحن (اضغط لتغيير المحافظة) *
                </label>
                <SingleButtonShippingSelector
                  selectedGovernorate={selectedGov.name}
                  onSelect={(gov) => setSelectedGov(gov)}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  العنوان بالتفصيل *
                </label>
                <input
                  type="text"
                  required
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder="اسم المنطقة / الشارع / رقم العمارة / رقم الشقة أو علامة مميزة"
                  className="w-full h-11 px-4 rounded-xl border border-slate-700 bg-slate-950 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  ملاحظات إضافية للمندوب (اختياري)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="مثال: الاتصال قبل الوصول بنصف ساعة، التوصيل بعد الظهر..."
                  className="w-full h-10 px-4 rounded-xl border border-slate-800 bg-slate-950 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* ملخص الفاتورة بالدينار العراقي (IQD) */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>سعر المنتجات ({quantity} قطعة):</span>
                <span className="font-mono font-bold">{formatIQD(itemsTotal)}</span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>
                  مصاريف الشحن ({selectedGov.name} - {selectedGov.estimatedDelivery}):
                </span>
                <span className="font-mono font-bold text-emerald-400">
                  {shipping === 0 ? "مجاني 🎁" : formatIQD(shipping)}
                </span>
              </div>

              <div className="border-t border-slate-800 pt-2 flex items-center justify-between">
                <div>
                  <span className="text-sm font-black text-white block">
                    المبلغ الإجمالي المستحق عند الاستلام:
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold">
                    شامل الشحن والتوصيل لباب بيتك
                  </span>
                </div>
                <span className="text-xl sm:text-2xl font-black font-mono text-emerald-400">
                  {formatIQD(grandTotal)}
                </span>
              </div>
            </div>

            {/* زر تأكيد الطلب الرئيسي */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-base sm:text-lg shadow-xl shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Truck className="size-5" />
              <span>
                {isSubmitting
                  ? "جاري تأكيد الطلب وإصدار البوليصة..."
                  : `تأكيد طلب الشراء الآن (${formatIQD(grandTotal)})`}
              </span>
            </button>

            <p className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1">
              <Lock className="size-3 text-emerald-400" />
              بياناتك مشفرة ومحمية بالكامل • الدفع عند الاستلام بعد المعاينة
            </p>
          </form>
        </section>

        {/* شارات الأمان والثقة */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          {[
            { icon: ShieldCheck, title: "معاينة قبل الدفع", desc: "افحص طلبك براحتك" },
            { icon: Truck, title: "توصيل سريع", desc: "شحن خلال 24-48 ساعة" },
            { icon: Award, title: "ضمان 14 يوم", desc: "استبدال واسترجاع فوري" },
            { icon: ThumbsUp, title: "خدمة عملاء 24/7", desc: "متابعة مستمرة للشحنة" },
          ].map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col items-center gap-1.5"
              >
                <Icon className="size-5 text-emerald-400" />
                <span className="text-xs font-black text-white">{badge.title}</span>
                <span className="text-[10px] text-slate-400">{badge.desc}</span>
              </div>
            );
          })}
        </div>
      </main>

      {/* ========================================================================= */}
      {/* 5. الشريط العائم الثابت للموبايل (Sticky COD Bottom CTA Bar) */}
      {/* ========================================================================= */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 p-3 flex items-center justify-between gap-3 sm:hidden">
        <div>
          <span className="text-[10px] text-slate-400 block">الإجمالي بالدفع عند الاستلام:</span>
          <span className="text-lg font-black font-mono text-emerald-400">
            {formatIQD(grandTotal)}
          </span>
        </div>

        <button
          type="button"
          onClick={scrollToCheckout}
          className="px-6 py-3 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-1.5"
        >
          <span>اطلب الآن</span>
          <ArrowDown className="size-3.5" />
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 6. نافذة نجاح الطلب وإصدار بوليصة الشحن (Order Placed Success Modal) */}
      {/* ========================================================================= */}
      {orderSuccess && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900 border-2 border-emerald-500/60 rounded-3xl p-6 sm:p-7 text-center space-y-4 shadow-2xl text-right animate-in zoom-in-95 duration-200">
            <div className="size-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 grid place-items-center mx-auto">
              <CheckCircle2 className="size-9" />
            </div>

            <div className="text-center">
              <h3 className="text-xl font-black text-white">تم تأكيد طلبك بنجاح!</h3>
              <p className="text-xs text-slate-300 mt-1">
                شكراً لثقتك بـ {store.name}. تم تسجيل طلبك وتوليد بوليصة الشحن تلقائياً.
              </p>
            </div>

            {/* تفاصيل البوليصة والتتبع */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">رقم بوليصة الشحن (Waybill):</span>
                <span className="font-mono font-black text-emerald-400 text-sm">
                  {orderSuccess.shipping?.trackingNumber || "ZAEEM-IQ-948123"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">شركة الشحن المسؤولة:</span>
                <span className="font-bold text-white">
                  {orderSuccess.shipping?.shippingCompany || "شركة الزعيم للشحن"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">المبلغ المطلوب عند الاستلام:</span>
                <span className="font-mono font-black text-emerald-400">
                  {formatIQD(grandTotal)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">عنوان التوصيل:</span>
                <span className="font-bold text-white">{selectedGov.name} - {customerAddress}</span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <a
                href={`#/track?q=${orderSuccess.shipping?.trackingNumber || orderSuccess.order?.id || customerPhone}`}
                className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition-colors flex items-center justify-center gap-2"
              >
                <span>تتبع حالة الشحنة مباشرةً</span>
                <Truck className="size-4" />
              </a>

              <button
                type="button"
                onClick={() => setOrderSuccess(null)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors"
              >
                إغلاق والعودة لصفحة المتجر
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
