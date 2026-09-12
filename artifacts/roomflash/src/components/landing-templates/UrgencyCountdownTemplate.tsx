import React, { useState, useEffect } from "react";
import {
  Flame,
  Clock,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Star,
  Sparkles,
  Phone,
  MapPin,
  Lock,
  ThumbsUp,
  Award,
  Zap,
  ArrowDown,
  Users,
  AlertCircle
} from "lucide-react";
import {
  SingleButtonShippingSelector,
  IRAQ_GOVERNORATES_LIST,
  type IraqGovernorateShipping,
} from "../shipping/SingleButtonShippingSelector";
import { formatIQD } from "../../data/iraqData";
import { TemplateProduct, TemplateStore } from "./EasyOrdersFlashTemplate";

interface UrgencyCountdownTemplateProps {
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

export const UrgencyCountdownTemplate: React.FC<UrgencyCountdownTemplateProps> = ({
  store,
  product,
  onPlaceOrder,
}) => {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedGov, setSelectedGov] = useState<IraqGovernorateShipping>(IRAQ_GOVERNORATES_LIST[0]);
  const [quantity, setQuantity] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<any>(null);

  const images = product.images && product.images.length > 0 ? product.images : [product.imageUrl];
  const [selectedImage, setSelectedImage] = useState<string>(images[0] || product.imageUrl);

  // Live countdown timer (Hours, Minutes, Seconds)
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 45, seconds: 12 });
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 3, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const basePrice = Math.round(Number(product.price) || 0);
  const comparePrice = Math.round(Number(product.compareAtPrice) || (basePrice ? basePrice * 1.4 : 0));
  const disc2 = Number(product.discountTwoItems) || 15;
  const disc3 = Number(product.discountThreeItems) || 25;

  let unitDiscountPercent = 0;
  let isFreeShipping = false;
  if (quantity === 2) unitDiscountPercent = disc2;
  else if (quantity >= 3) {
    unitDiscountPercent = disc3;
    isFreeShipping = true;
  }

  const discountedUnit = Math.round(basePrice * (1 - unitDiscountPercent / 100));
  const subtotal = discountedUnit * quantity;
  const shippingFee = isFreeShipping ? 0 : selectedGov.shippingCost;
  const grandTotal = subtotal + shippingFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !customerAddress) {
      alert("يرجى ملء كافة الحقول الأساسية لإتمام الطلب");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await onPlaceOrder({
        customerName,
        customerPhone,
        customerAddress,
        governorate: selectedGov.name,
        quantity,
        shippingCost: shippingFee,
        totalAmount: grandTotal,
        notes,
      });
      setOrderSuccess(res);
    } catch (err: any) {
      alert(err.message || "حدث خطأ أثناء تأكيد الطلب");
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToForm = () => {
    const el = document.getElementById("urgency-order-form");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white font-sans selection:bg-rose-500 selection:text-white pb-24" dir="rtl">
      {/* Top Urgency Sticky Bar */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 text-white px-4 py-2.5 shadow-xl flex items-center justify-between text-xs sm:text-sm font-black">
        <div className="flex items-center gap-2">
          <Flame className="size-4 sm:size-5 text-amber-200 animate-bounce shrink-0" />
          <span className="tracking-tight">عرض خاص وحصري — ينتهي خلال:</span>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-xs sm:text-sm">
          <span className="bg-black/40 px-2 py-0.5 rounded-md font-bold">{String(timeLeft.hours).padStart(2, "0")}</span>:
          <span className="bg-black/40 px-2 py-0.5 rounded-md font-bold">{String(timeLeft.minutes).padStart(2, "0")}</span>:
          <span className="bg-black/40 px-2 py-0.5 rounded-md font-bold text-amber-300">{String(timeLeft.seconds).padStart(2, "0")}</span>
        </div>
      </div>

      {/* Brand Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {store.logoUrl ? (
            <img src={store.logoUrl} alt={store.name} className="size-10 rounded-2xl object-cover border border-slate-700" />
          ) : (
            <div className="size-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 grid place-items-center text-slate-950 font-black text-lg shadow-lg shadow-rose-500/20">
              {store.name ? store.name.charAt(0) : "ز"}
            </div>
          )}
          <div>
            <h1 className="text-base font-black text-white">{store.name || "متجر الزعيم"}</h1>
            <p className="text-[10px] text-rose-400 font-medium">صفحة العرض المحدود المعتمدة</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-rose-500 animate-ping" />
            الدفع بعد المعاينة
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 pt-6 space-y-8">
        {/* Title & Trust Badges */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black">
            <Sparkles className="size-3.5" />
            <span>عرض التوفير الأكبر في العراق — ضمان الجودة 100%</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
            {product.title}
          </h2>
          <div className="flex items-center justify-center gap-3 text-xs text-slate-400">
            <div className="flex items-center text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="size-4 fill-amber-400" />
              ))}
            </div>
            <span className="font-bold text-slate-300">4.9 / 5</span>
            <span>•</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="size-3.5" /> أكثر من 850 زبون راضٍ
            </span>
          </div>
        </div>

        {/* Live Scarcity Stock Bar */}
        <div className="bg-slate-900/90 border border-rose-900/40 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="flex items-center gap-1.5 text-rose-400">
              <Flame className="size-4 text-rose-500" />
              الكمية المتبقية بسعر العرض: <strong>8 قطع فقط</strong>
            </span>
            <span className="text-slate-400 font-mono">تم بيع 88%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-amber-500 to-rose-500 rounded-full w-[88%] animate-pulse" />
          </div>
        </div>

        {/* Product Visual Showcase & Price Box */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Gallery */}
          <div className="space-y-3">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 relative shadow-2xl">
              <img src={selectedImage} alt={product.title} className="size-full object-cover" />
              <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-rose-600 text-white font-black text-xs shadow-lg">
                وفر {Math.round(((comparePrice - basePrice) / (comparePrice || 1)) * 100)}% الآن
              </div>
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(img)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === img ? "border-rose-500 scale-95 shadow-md shadow-rose-500/20" : "border-slate-800 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="size-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Pricing & CTA Card */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6">
            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-black text-amber-400">
                  {formatIQD(basePrice)}
                </span>
                {comparePrice > basePrice && (
                  <span className="text-base text-slate-500 line-through font-bold">
                    {formatIQD(comparePrice)}
                  </span>
                )}
              </div>
              <p className="text-xs text-emerald-400 font-bold flex items-center gap-1.5">
                <Truck className="size-4" /> توصيل سريع لكافة محافظات العراق خلال 24 - 48 ساعة
              </p>
            </div>

            {/* Quantity Offer Bundles */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-slate-300 block">اختر باقة العرض المناسبة لك:</label>
              <div className="grid grid-cols-1 gap-2">
                {/* 1 Piece */}
                <button
                  type="button"
                  onClick={() => setQuantity(1)}
                  className={`p-3 rounded-2xl border text-right transition-all flex items-center justify-between cursor-pointer ${
                    quantity === 1
                      ? "bg-rose-500/10 border-rose-500 text-white"
                      : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`size-4 rounded-full border-2 flex items-center justify-center ${quantity === 1 ? "border-rose-500" : "border-slate-600"}`}>
                      {quantity === 1 && <div className="size-2 rounded-full bg-rose-500" />}
                    </div>
                    <span className="text-xs font-bold text-white">قطعة واحدة</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-400">{formatIQD(basePrice)}</span>
                </button>

                {/* 2 Pieces */}
                <button
                  type="button"
                  onClick={() => setQuantity(2)}
                  className={`p-3 rounded-2xl border text-right transition-all flex items-center justify-between cursor-pointer relative ${
                    quantity === 2
                      ? "bg-rose-500/15 border-rose-500 text-white ring-1 ring-rose-500"
                      : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <span className="absolute -top-2.5 left-4 bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow">
                    الأكثر طلباً • خصم {disc2}%
                  </span>
                  <div className="flex items-center gap-2.5">
                    <div className={`size-4 rounded-full border-2 flex items-center justify-center ${quantity === 2 ? "border-rose-500" : "border-slate-600"}`}>
                      {quantity === 2 && <div className="size-2 rounded-full bg-rose-500" />}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">قطعتان (خصم خاص)</span>
                      <span className="text-[10px] text-emerald-400 font-medium">وفّر {formatIQD((basePrice * 2) - (discountedUnit * 2))}</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-400">{formatIQD(Math.round(basePrice * (1 - disc2 / 100)) * 2)}</span>
                </button>

                {/* 3 Pieces */}
                <button
                  type="button"
                  onClick={() => setQuantity(3)}
                  className={`p-3 rounded-2xl border text-right transition-all flex items-center justify-between cursor-pointer relative ${
                    quantity === 3
                      ? "bg-emerald-500/15 border-emerald-500 text-white ring-1 ring-emerald-500"
                      : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <span className="absolute -top-2.5 left-4 bg-emerald-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow">
                    شحن مجاني + خصم {disc3}%
                  </span>
                  <div className="flex items-center gap-2.5">
                    <div className={`size-4 rounded-full border-2 flex items-center justify-center ${quantity === 3 ? "border-emerald-500" : "border-slate-600"}`}>
                      {quantity === 3 && <div className="size-2 rounded-full bg-emerald-500" />}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">3 قطع (العرض الذهبي)</span>
                      <span className="text-[10px] text-emerald-400 font-medium">شحن مجاني لكافة المحافظات</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400">{formatIQD(Math.round(basePrice * (1 - disc3 / 100)) * 3)}</span>
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={scrollToForm}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-slate-950 font-black text-sm text-center shadow-xl shadow-rose-600/30 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
            >
              <Zap className="size-4 fill-slate-950" />
              <span>اطلب الآن واستفد من سعر العرض</span>
              <ArrowDown className="size-4 animate-bounce" />
            </button>
          </div>
        </div>

        {/* Product Description & Highlights */}
        {product.description && (
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Award className="size-5 text-amber-400" />
              <span>مواصفات وتفاصيل المنتج</span>
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-800">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                <ShieldCheck className="size-5 text-emerald-400 shrink-0" />
                <span className="text-xs font-bold text-slate-200">معاينة قبل الدفع</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                <Truck className="size-5 text-rose-400 shrink-0" />
                <span className="text-xs font-bold text-slate-200">شحن سريع 18 محافظة</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                <ThumbsUp className="size-5 text-amber-400 shrink-0" />
                <span className="text-xs font-bold text-slate-200">ضمان استبدال حقيقي</span>
              </div>
            </div>
          </div>
        )}

        {/* Direct COD Checkout Form */}
        <div id="urgency-order-form" className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-rose-500/40 shadow-2xl space-y-6">
          <div className="text-center space-y-2 border-b border-slate-800 pb-4">
            <span className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-black">
              استمارة الطلب المباشر
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              أدخل معلومات التوصيل واستلم طلبك
            </h3>
            <p className="text-xs text-slate-400">
              الدفع نقداً عند استلام الشحنة ومعاينتها من مندوب الزعيم
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                الاسم الكامل <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="أدخل اسمك الثلاثي"
                className="w-full h-12 px-4 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-rose-500 outline-none transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                رقم الهاتف (واتساب متاح) <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  dir="ltr"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="07XXXXXXXXX"
                  className="w-full h-12 px-4 pl-10 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm font-mono focus:border-rose-500 outline-none transition-colors text-right"
                />
                <Phone className="size-4 text-slate-500 absolute left-3.5 top-4 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                المحافظة <span className="text-rose-400">*</span>
              </label>
              <select
                value={selectedGov.id}
                onChange={(e) => {
                  const found = IRAQ_GOVERNORATES_LIST.find((g) => g.id === e.target.value);
                  if (found) setSelectedGov(found);
                }}
                className="w-full h-12 px-4 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-rose-500 outline-none transition-colors cursor-pointer"
              >
                {IRAQ_GOVERNORATES_LIST.map((g) => (
                  <option key={g.id} value={g.id} className="bg-slate-900 text-white">
                    {g.name} — شحن {formatIQD(g.shippingCost)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                العنوان الدقيق / أقرب نقطة دالة <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                placeholder="المنطقة، الشارع، قرب معلم معروف"
                className="w-full h-12 px-4 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-rose-500 outline-none transition-colors"
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
                placeholder="وقت التوصيل المفضل أو أي تعليمات خاصة"
                className="w-full h-11 px-4 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-slate-700 outline-none transition-colors"
              />
            </div>

            {/* Order Price Breakdown */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>سعر المنتجات ({quantity} قطع):</span>
                <span className="font-mono font-bold text-white">{formatIQD(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>أجور الشحن ({selectedGov.name}):</span>
                <span className="font-mono font-bold text-white">
                  {isFreeShipping ? <strong className="text-emerald-400">شحن مجاني</strong> : formatIQD(shippingFee)}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-black text-amber-400">
                <span>المبلغ الإجمالي عند الاستلام:</span>
                <span className="text-base font-mono">{formatIQD(grandTotal)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-600 via-red-500 to-amber-500 hover:opacity-95 text-slate-950 font-black text-base text-center shadow-2xl shadow-rose-600/30 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>جاري إرسال وتأكيد الطلب...</span>
              ) : (
                <>
                  <CheckCircle2 className="size-5" />
                  <span>تأكيد الطلب الآن — {formatIQD(grandTotal)}</span>
                </>
              )}
            </button>
          </form>
        </div>
      </main>

      {/* Sticky Bottom Order Bar on Mobile */}
      <div className="fixed bottom-0 inset-x-0 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 px-4 py-3 z-40 sm:hidden flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] text-slate-400 block">الإجمالي:</span>
          <span className="text-base font-black text-amber-400 font-mono">{formatIQD(grandTotal)}</span>
        </div>
        <button
          type="button"
          onClick={scrollToForm}
          className="flex-1 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 text-slate-950 font-black text-xs text-center shadow-lg shadow-rose-600/30 cursor-pointer active:scale-95"
        >
          ⚡ اطلب الآن بضغطة واحدة
        </button>
      </div>

      {/* Success Modal */}
      {orderSuccess && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center space-y-5 animate-scaleUp">
            <div className="size-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mx-auto grid place-items-center">
              <CheckCircle2 className="size-8" />
            </div>
            <div className="space-y-2">
              <h4 className="text-xl font-black text-white">تم استلام طلبك بنجاح!</h4>
              <p className="text-xs text-slate-300">
                شكراً لتسوقك معنا. سيقوم مندوب شركة الزعيم للشحن بالاتصال بك قريباً لتأكيد موعد التسليم.
              </p>
            </div>
            {orderSuccess.orderNumber && (
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-teal-400">
                رقم التتبع: <strong>{orderSuccess.orderNumber}</strong>
              </div>
            )}
            <button
              type="button"
              onClick={() => setOrderSuccess(null)}
              className="w-full py-3 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs hover:bg-emerald-400 transition-colors"
            >
              حسناً، شكراً لكم
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
