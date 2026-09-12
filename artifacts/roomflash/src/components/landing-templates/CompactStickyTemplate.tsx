import React, { useState } from "react";
import {
  Zap,
  ShieldCheck,
  CheckCircle2,
  Star,
  Sparkles,
  Phone,
  Truck,
  ArrowDown,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  Check
} from "lucide-react";
import {
  SingleButtonShippingSelector,
  IRAQ_GOVERNORATES_LIST,
  type IraqGovernorateShipping,
} from "../shipping/SingleButtonShippingSelector";
import { formatIQD } from "../../data/iraqData";
import { TemplateProduct, TemplateStore } from "./EasyOrdersFlashTemplate";

interface CompactStickyTemplateProps {
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

export const CompactStickyTemplate: React.FC<CompactStickyTemplateProps> = ({
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
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const images = product.images && product.images.length > 0 ? product.images : [product.imageUrl];
  const [selectedImage, setSelectedImage] = useState<string>(images[0] || product.imageUrl);

  const basePrice = Math.round(Number(product.price) || 0);
  const comparePrice = Math.round(Number(product.compareAtPrice) || (basePrice ? basePrice * 1.3 : 0));
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
      alert("يرجى إكمال الحقول الأساسية");
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
    const el = document.getElementById("compact-order-form");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const faqs = [
    { q: "هل يمكنني معاينة وفحص الطلب قبل الدفع؟", a: "نعم بالتأكيد، يحق لك فتح الشحنة وفحص المنتج والتأكد منه بالكامل أمام مندوب التوصيل قبل دفع أي دينار." },
    { q: "كم يستغرق وصول الطلب؟", a: "يتم تسليم الطلبات داخل بغداد وكافة محافظات العراق خلال 24 إلى 48 ساعة كحد أقصى عبر شركة الزعيم للشحن." },
    { q: "ما هي سياسة الاستبدال أو الإرجاع؟", a: "نضمن لك حق الاستبدال أو الإرجاع الفوري خلال 14 يوماً في حال وجود أي عيب مصنعي أو عدم مطابقة للمواصفات." },
  ];

  return (
    <div className="min-h-screen bg-[#0d121f] text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950 pb-28" dir="rtl">
      {/* Clean Minimal Header */}
      <header className="border-b border-slate-800 bg-[#111827]/95 backdrop-blur-md px-5 py-3.5 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          {store.logoUrl ? (
            <img src={store.logoUrl} alt={store.name} className="size-9 rounded-xl object-cover border border-slate-700" />
          ) : (
            <div className="size-9 rounded-xl bg-emerald-500 text-slate-950 font-black grid place-items-center text-sm shadow">
              {store.name ? store.name.charAt(0) : "ز"}
            </div>
          )}
          <div>
            <h1 className="text-sm font-black text-white">{store.name || "متجر الزعيم"}</h1>
            <span className="text-[10px] text-emerald-400 font-medium">طلب سريع ومباشر</span>
          </div>
        </div>

        <button
          type="button"
          onClick={scrollToForm}
          className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-colors cursor-pointer"
        >
          طلب الآن ⚡
        </button>
      </header>

      <main className="max-w-xl mx-auto px-4 pt-4 space-y-6">
        {/* Gallery Slider */}
        <div className="space-y-2">
          <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 relative shadow-xl">
            <img src={selectedImage} alt={product.title} className="size-full object-cover" />
            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md text-emerald-400 text-xs font-bold border border-emerald-500/30">
              الدفع عند الاستلام
            </div>
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(img)}
                  className={`size-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    selectedImage === img ? "border-emerald-500 scale-95" : "border-slate-800 opacity-60"
                  }`}
                >
                  <img src={img} alt="" className="size-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Title & Instant Pricing */}
        <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-lg">
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs text-amber-400">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="size-3.5 fill-amber-400" />
                ))}
              </div>
              <span className="text-slate-300 font-bold">(تقييم 4.9 • موثوق في العراق)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
              {product.title}
            </h2>
          </div>

          <div className="flex items-baseline justify-between pt-2 border-t border-slate-800">
            <div>
              <span className="text-xs text-slate-400 block">السعر:</span>
              <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
                {formatIQD(basePrice)}
              </span>
            </div>
            {comparePrice > basePrice && (
              <div className="text-left">
                <span className="text-[10px] text-slate-500 block">قبل الخصم:</span>
                <span className="text-sm line-through text-slate-500 font-mono">
                  {formatIQD(comparePrice)}
                </span>
              </div>
            )}
          </div>

          {/* Instant Tiers */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <span className="text-xs font-bold text-slate-300 block">عروض الكميات المتاحة:</span>
            <div className="grid grid-cols-3 gap-2">
              {[
                { q: 1, label: "1 قطعة", badge: null },
                { q: 2, label: "2 قطعة", badge: `خصم ${disc2}%` },
                { q: 3, label: "3 قطع", badge: "شحن مجاني" },
              ].map((tier) => (
                <button
                  key={tier.q}
                  type="button"
                  onClick={() => setQuantity(tier.q)}
                  className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer relative ${
                    quantity === tier.q
                      ? "bg-emerald-500/15 border-emerald-500 text-white font-bold"
                      : "bg-slate-950 border-slate-800 text-slate-400"
                  }`}
                >
                  {tier.badge && (
                    <span className="absolute -top-2 inset-x-1 bg-emerald-500 text-slate-950 text-[8px] font-black py-0.5 rounded-full">
                      {tier.badge}
                    </span>
                  )}
                  <span className="text-xs block mt-0.5">{tier.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Description */}
        {product.description && (
          <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs leading-relaxed text-slate-300">
            <h3 className="font-bold text-white text-sm">عن المنتج:</h3>
            <p className="whitespace-pre-line">{product.description}</p>
          </div>
        )}

        {/* Guarantees */}
        <div className="grid grid-cols-3 gap-2 text-center text-slate-300">
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <ShieldCheck className="size-5 text-emerald-400 mx-auto" />
            <span className="text-[11px] font-bold block">معاينة قبل الدفع</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <Truck className="size-5 text-emerald-400 mx-auto" />
            <span className="text-[11px] font-bold block">شحن 24-48 ساعة</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <ThumbsUp className="size-5 text-emerald-400 mx-auto" />
            <span className="text-[11px] font-bold block">ضمان استبدال</span>
          </div>
        </div>

        {/* Direct COD Order Form */}
        <div id="compact-order-form" className="p-5 sm:p-6 rounded-3xl bg-slate-900 border-2 border-emerald-500/40 shadow-2xl space-y-5">
          <div className="text-center space-y-1 border-b border-slate-800 pb-3">
            <h3 className="text-lg font-black text-white">استمارة تأكيد الطلب المباشر</h3>
            <p className="text-xs text-slate-400">أدخل اسمك وعنوانك وسيصلك الطلب فوراً</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                الاسم الثلاثي <span className="text-emerald-400">*</span>
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="أدخل اسمك"
                className="w-full h-11 px-3.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                رقم الهاتف <span className="text-emerald-400">*</span>
              </label>
              <input
                type="tel"
                required
                dir="ltr"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="07XXXXXXXXX"
                className="w-full h-11 px-3.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm font-mono focus:border-emerald-500 outline-none text-right"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                المحافظة <span className="text-emerald-400">*</span>
              </label>
              <select
                value={selectedGov.id}
                onChange={(e) => {
                  const found = IRAQ_GOVERNORATES_LIST.find((g) => g.id === e.target.value);
                  if (found) setSelectedGov(found);
                }}
                className="w-full h-11 px-3.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-emerald-500 outline-none cursor-pointer"
              >
                {IRAQ_GOVERNORATES_LIST.map((g) => (
                  <option key={g.id} value={g.id} className="bg-slate-900 text-white">
                    {g.name} — شحن {formatIQD(g.shippingCost)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                العنوان الدقيق / نقطة دالة <span className="text-emerald-400">*</span>
              </label>
              <input
                type="text"
                required
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                placeholder="المنطقة، الشارع، قرب معلم"
                className="w-full h-11 px-3.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-emerald-500 outline-none"
              />
            </div>

            {/* Total */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>سعر الطلب ({quantity} قطع):</span>
                <span className="font-mono font-bold text-white">{formatIQD(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>كلفة التوصيل:</span>
                <span className="font-mono font-bold text-white">
                  {isFreeShipping ? <strong className="text-emerald-400">مجاني</strong> : formatIQD(shippingFee)}
                </span>
              </div>
              <div className="pt-1.5 border-t border-slate-800 flex justify-between text-sm font-black text-emerald-400">
                <span>المبلغ الكلي:</span>
                <span className="text-base font-mono">{formatIQD(grandTotal)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm text-center shadow-xl shadow-emerald-500/20 cursor-pointer active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? "جاري التأكيد..." : `تأكيد الطلب الآن — ${formatIQD(grandTotal)}`}
            </button>
          </form>
        </div>

        {/* FAQs */}
        <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-3">
          <h3 className="font-bold text-white text-xs">الأسئلة الشائعة:</h3>
          <div className="space-y-2">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-slate-800 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-3 text-right text-xs font-bold text-slate-200 flex items-center justify-between bg-slate-950/40"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                </button>
                {openFaq === idx && (
                  <div className="p-3 text-[11px] text-slate-400 bg-slate-900/40 border-t border-slate-800 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Floating Bottom Bar */}
      <div className="fixed bottom-0 inset-x-0 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 px-4 py-3 z-40 flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] text-slate-400 block">المبلغ الإجمالي:</span>
          <span className="text-base font-black text-emerald-400 font-mono">{formatIQD(grandTotal)}</span>
        </div>
        <button
          type="button"
          onClick={scrollToForm}
          className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs text-center shadow-lg shadow-emerald-500/20 cursor-pointer active:scale-95"
        >
          ⚡ اطلب الآن بضغطة واحدة
        </button>
      </div>

      {/* Success Modal */}
      {orderSuccess && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 max-w-md w-full text-center space-y-4">
            <div className="size-14 rounded-full bg-emerald-500/10 text-emerald-400 mx-auto grid place-items-center">
              <CheckCircle2 className="size-7" />
            </div>
            <h4 className="text-lg font-black text-white">تم استلام طلبك بنجاح!</h4>
            <p className="text-xs text-slate-300">
              سيقوم مندوب شركة الزعيم للشحن بالاتصال بك قريباً للتسليم.
            </p>
            {orderSuccess.orderNumber && (
              <div className="p-2.5 rounded-xl bg-slate-950 text-xs font-mono text-emerald-400">
                رقم التتبع: {orderSuccess.orderNumber}
              </div>
            )}
            <button
              type="button"
              onClick={() => setOrderSuccess(null)}
              className="w-full py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
