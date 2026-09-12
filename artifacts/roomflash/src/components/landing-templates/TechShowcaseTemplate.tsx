import React, { useState } from "react";
import {
  Cpu,
  ShieldCheck,
  CheckCircle2,
  Star,
  Sparkles,
  Phone,
  Truck,
  Zap,
  ArrowDown,
  Layers,
  Check,
  X,
  Award
} from "lucide-react";
import {
  IRAQ_GOVERNORATES_LIST,
  type IraqGovernorateShipping,
} from "../shipping/SingleButtonShippingSelector";
import { formatIQD } from "../../data/iraqData";
import { TemplateProduct, TemplateStore } from "./EasyOrdersFlashTemplate";

interface TechShowcaseTemplateProps {
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

export const TechShowcaseTemplate: React.FC<TechShowcaseTemplateProps> = ({
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

  const basePrice = Math.round(Number(product.price) || 0);
  const comparePrice = Math.round(Number(product.compareAtPrice) || (basePrice ? basePrice * 1.35 : 0));
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
      alert("يرجى ملء جميع الحقول لتأكيد طلبك");
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
      alert(err.message || "حدث خطأ أثناء إتمام الطلب");
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToForm = () => {
    const el = document.getElementById("tech-order-form");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#070d18] text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950 pb-24" dir="rtl">
      {/* Top Banner */}
      <div className="bg-slate-950 border-b border-cyan-900/30 px-6 py-3 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-cyan-400 font-mono">
          <Cpu className="size-4" />
          <span>النسخة الأصلية المعتمدة مع ضمان الفحص</span>
        </div>
        <span className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 px-3 py-0.5 rounded-full font-bold">
          شحن لجميع المحافظات 🚚
        </span>
      </div>

      {/* Brand Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          {store.logoUrl ? (
            <img src={store.logoUrl} alt={store.name} className="size-10 rounded-2xl object-cover border border-cyan-500/30" />
          ) : (
            <div className="size-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 grid place-items-center text-slate-950 font-black text-lg shadow-lg shadow-cyan-500/20">
              {store.name ? store.name.charAt(0) : "Z"}
            </div>
          )}
          <div>
            <h1 className="text-base font-black text-white">{store.name || "متجر الزعيم"}</h1>
            <p className="text-[10px] text-cyan-400 font-mono">Original Tech Spec</p>
          </div>
        </div>

        <button
          type="button"
          onClick={scrollToForm}
          className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-colors shadow-lg shadow-cyan-500/20 cursor-pointer"
        >
          طلب سريع (COD) ⚡
        </button>
      </header>

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto px-4 pt-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Gallery with Tech Frame */}
          <div className="space-y-3">
            <div className="aspect-square rounded-3xl overflow-hidden bg-slate-950 border-2 border-cyan-500/30 relative shadow-2xl group">
              <img src={selectedImage} alt={product.title} className="size-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-cyan-500/90 backdrop-blur-md text-slate-950 font-black text-xs font-mono shadow">
                100% ORIGINAL
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
                      selectedImage === img ? "border-cyan-400 scale-95 shadow-lg shadow-cyan-500/20" : "border-slate-800 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="size-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details & Fast Order CTA */}
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono">
                <Sparkles className="size-3.5" />
                <span>أداء فائق مع ضمان استبدال كامل</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                {product.title}
              </h2>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block font-medium">السعر الحالي:</span>
                <span className="text-3xl font-black text-cyan-400 font-mono">{formatIQD(basePrice)}</span>
              </div>
              {comparePrice > basePrice && (
                <div className="text-left">
                  <span className="text-xs text-slate-500 block font-medium">قبل العرض:</span>
                  <span className="text-sm line-through text-slate-500 font-mono">{formatIQD(comparePrice)}</span>
                </div>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 block">اختر الكمية:</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { q: 1, label: "قطعة واحدة", badge: null },
                  { q: 2, label: "قطعتان", badge: `خصم ${disc2}%` },
                  { q: 3, label: "3 قطع", badge: "شحن مجاني" },
                ].map((tier) => (
                  <button
                    key={tier.q}
                    type="button"
                    onClick={() => setQuantity(tier.q)}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer relative ${
                      quantity === tier.q
                        ? "bg-cyan-500/15 border-cyan-400 text-white font-bold"
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    {tier.badge && (
                      <span className="absolute -top-2 inset-x-2 bg-cyan-500 text-slate-950 text-[9px] font-black py-0.5 rounded-full">
                        {tier.badge}
                      </span>
                    )}
                    <span className="text-xs block">{tier.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={scrollToForm}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-95 text-slate-950 font-black text-sm text-center shadow-xl shadow-cyan-500/25 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
            >
              <Zap className="size-4 fill-slate-950" />
              <span>طلب مباشر مع الدفع عند الاستلام</span>
              <ArrowDown className="size-4 animate-bounce" />
            </button>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-2">
            <Cpu className="size-6 text-cyan-400" />
            <h4 className="text-sm font-black text-white">جودة وتصنيع فائق</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              تم تصنيع المنتج وفق أعلى معايير الجودة لضمان أداء مستقر وعمر افتراضي طويل.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-2">
            <ShieldCheck className="size-6 text-emerald-400" />
            <h4 className="text-sm font-black text-white">حق الفحص والمعاينة</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              افتح الشحنة وافحص جهازك وتأكد منه 100% قبل تسليم المبلغ لمندوب التوصيل.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-2">
            <Truck className="size-6 text-blue-400" />
            <h4 className="text-sm font-black text-white">شحن سريع 18 محافظة</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              توصيل سريع مباشر إلى باب منزلك عبر أسطول شركة الزعيم للشحن في العراق.
            </p>
          </div>
        </div>

        {/* Comparison Section (Our Original vs Fakes) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
            <Award className="size-5 text-cyan-400" />
            <span>لماذا تشتري النسخة الأصلية من متجرنا؟</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 space-y-2.5">
              <span className="text-xs font-black text-cyan-400 flex items-center gap-1.5">
                <Check className="size-4 text-cyan-400" /> منتجنا الأصلي المعتمد
              </span>
              <ul className="text-xs text-slate-300 space-y-1.5">
                <li>• فحص وتجربة كاملة عند الاستلام</li>
                <li>• متانة عالية وخامات أصلية غير مقلدة</li>
                <li>• ضمان استبدال حقيقي لمدة 14 يوم</li>
              </ul>
            </div>
            <div className="p-4 rounded-2xl bg-rose-950/10 border border-rose-900/30 space-y-2.5">
              <span className="text-xs font-black text-rose-400 flex items-center gap-1.5">
                <X className="size-4 text-rose-400" /> المنتجات المقلدة في السوق
              </span>
              <ul className="text-xs text-slate-400 space-y-1.5">
                <li>• جودة رديئة وتلف سريع بعد أيام</li>
                <li>• بدون أي ضمان أو خدمة ما بعد البيع</li>
                <li>• عدم السماح بفتح الشحنة والمعاينة</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Direct COD Order Form */}
        <div id="tech-order-form" className="p-6 sm:p-8 rounded-3xl bg-slate-900 border-2 border-cyan-500/40 shadow-2xl space-y-6">
          <div className="text-center space-y-2 border-b border-slate-800 pb-4">
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono font-bold">
              ORDER SPECIFICATION FORM
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              استمارة الطلب المباشر والدفع عند الاستلام
            </h3>
            <p className="text-xs text-slate-400">
              أدخل معلوماتك وسيقوم المندوب بالتواصل معك فوراً
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                الاسم الكامل <span className="text-cyan-400">*</span>
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="أدخل اسمك الثلاثي"
                className="w-full h-12 px-4 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-cyan-400 outline-none transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                رقم الهاتف <span className="text-cyan-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  dir="ltr"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="07XXXXXXXXX"
                  className="w-full h-12 px-4 pl-10 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm font-mono focus:border-cyan-400 outline-none transition-colors text-right"
                />
                <Phone className="size-4 text-slate-500 absolute left-3.5 top-4 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                المحافظة <span className="text-cyan-400">*</span>
              </label>
              <select
                value={selectedGov.id}
                onChange={(e) => {
                  const found = IRAQ_GOVERNORATES_LIST.find((g) => g.id === e.target.value);
                  if (found) setSelectedGov(found);
                }}
                className="w-full h-12 px-4 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-cyan-400 outline-none transition-colors cursor-pointer"
              >
                {IRAQ_GOVERNORATES_LIST.map((g) => (
                  <option key={g.id} value={g.id} className="bg-slate-900 text-white">
                    {g.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                العنوان الدقيق / نقطة دالة <span className="text-cyan-400">*</span>
              </label>
              <input
                type="text"
                required
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                placeholder="المدينة، الحي، الشارع، أقرب نقطة دالة"
                className="w-full h-12 px-4 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-cyan-400 outline-none transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                ملاحظات إضافية (اختياري)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="أي تعليمات إضافية بخصوص الشحن أو التوصيل"
                className="w-full h-11 px-4 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-slate-700 outline-none transition-colors"
              />
            </div>

            {/* Total Breakdown */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>سعر الطلب ({quantity} قطع):</span>
                <span className="font-mono font-bold text-white">{formatIQD(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>الشحن ({selectedGov.name}):</span>
                <span className="font-mono font-bold text-white">
                  {isFreeShipping ? <strong className="text-emerald-400">مجاني</strong> : formatIQD(shippingFee)}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-black text-cyan-400">
                <span>المبلغ الكلي المطلوب عند التسليم:</span>
                <span className="text-base font-mono">{formatIQD(grandTotal)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-95 text-slate-950 font-black text-base text-center shadow-xl shadow-cyan-500/25 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>جاري إرسال الطلب...</span>
              ) : (
                <>
                  <CheckCircle2 className="size-5" />
                  <span>تأكيد الطلب — {formatIQD(grandTotal)}</span>
                </>
              )}
            </button>
          </form>
        </div>
      </main>

      {/* Success Modal */}
      {orderSuccess && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center space-y-5 animate-scaleUp">
            <div className="size-16 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mx-auto grid place-items-center">
              <CheckCircle2 className="size-8" />
            </div>
            <div className="space-y-2">
              <h4 className="text-xl font-black text-white">تم استلام طلبك بنجاح!</h4>
              <p className="text-xs text-slate-300">
                سيقوم مندوب الشحن بالاتصال بك للتنسيق والتسليم.
              </p>
            </div>
            {orderSuccess.orderNumber && (
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-400">
                رقم التتبع: <strong>{orderSuccess.orderNumber}</strong>
              </div>
            )}
            <button
              type="button"
              onClick={() => setOrderSuccess(null)}
              className="w-full py-3 rounded-xl bg-cyan-500 text-slate-950 font-black text-xs hover:bg-cyan-400 transition-colors"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
