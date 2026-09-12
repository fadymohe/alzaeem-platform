import React, { useState } from "react";
import {
  Truck,
  ShieldCheck,
  CheckCircle2,
  Star,
  Sparkles,
  Phone,
  MapPin,
  Lock,
  ArrowDown,
  Award,
  Crown,
  ThumbsUp
} from "lucide-react";
import {
  SingleButtonShippingSelector,
  IRAQ_GOVERNORATES_LIST,
  type IraqGovernorateShipping,
} from "../shipping/SingleButtonShippingSelector";
import { formatIQD } from "../../data/iraqData";
import { TemplateProduct, TemplateStore } from "./EasyOrdersFlashTemplate";

interface MinimalLuxuryTemplateProps {
  store: TemplateStore;
  product: TemplateProduct;
  onPlaceOrder: (orderData: any) => Promise<any>;
}

export const MinimalLuxuryTemplate: React.FC<MinimalLuxuryTemplateProps> = ({
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
      alert("يرجى ملء جميع الحقول لتأكيد الطلب");
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
    const el = document.getElementById("luxury-order-form");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#0a0c10] text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950 pb-24" dir="rtl">
      {/* Top Banner */}
      <div className="border-b border-amber-900/30 bg-[#12161f] px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {store.logoUrl ? (
            <img src={store.logoUrl} alt={store.name} className="size-8 rounded-lg object-cover border border-amber-500/40" />
          ) : (
            <div className="size-8 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 font-black grid place-items-center text-sm shadow">
              <Crown className="size-4" />
            </div>
          )}
          <span className="font-extrabold text-sm text-amber-200">{store.name || "بوتيك الفخامة"}</span>
        </div>
        <span className="text-xs font-mono text-amber-400 bg-amber-950/40 border border-amber-800/40 px-3 py-1 rounded-full">
          الدفع عند الاستلام بعد المعاينة 🚚
        </span>
      </div>

      <div className="max-w-3xl mx-auto px-4 mt-8 space-y-8 text-right">
        {/* Product Showcase */}
        <div className="bg-[#12161f] border border-amber-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-slate-950 relative border border-slate-800">
            <img src={selectedImage} alt={product.title} className="size-full object-cover" />
            <span className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 text-xs font-black px-3.5 py-1 rounded-full shadow">
              الإصدار الملكي الحصري
            </span>
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(img)}
                  className={`size-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    selectedImage === img ? "border-amber-400 scale-95 shadow-md shadow-amber-500/20" : "border-slate-800 opacity-60"
                  }`}
                >
                  <img src={img} alt="" className="size-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="size-4 fill-amber-400" />
                ))}
              </div>
              <span className="text-xs text-amber-200/80 font-bold">تقييم 4.9 من عملائنا في العراق</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white">{product.title}</h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">{product.description}</p>

            <div className="pt-2 flex items-baseline justify-between border-t border-slate-800">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black font-mono text-amber-400">
                  {formatIQD(basePrice)}
                </span>
                {comparePrice > basePrice && (
                  <span className="text-sm line-through text-slate-500 font-mono">
                    {formatIQD(comparePrice)}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={scrollToForm}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs shadow-lg transition-all cursor-pointer"
              >
                طلب فوري ⚡
              </button>
            </div>
          </div>
        </div>

        {/* Quantity Bundles */}
        <div className="bg-[#12161f] border border-amber-900/30 rounded-3xl p-6 space-y-3">
          <span className="text-xs font-bold text-amber-200 block">اختر باقة العرض:</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => setQuantity(1)}
              className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                quantity === 1
                  ? "bg-amber-500/15 border-amber-400 text-white font-bold"
                  : "bg-slate-950 border-slate-800 text-slate-400"
              }`}
            >
              <span className="text-xs block font-bold">1 قطعة</span>
              <span className="text-xs font-mono text-amber-400 mt-1 block">{formatIQD(basePrice)}</span>
            </button>

            <button
              type="button"
              onClick={() => setQuantity(2)}
              className={`p-3 rounded-2xl border text-center transition-all cursor-pointer relative ${
                quantity === 2
                  ? "bg-amber-500/20 border-amber-400 text-white font-bold ring-1 ring-amber-400"
                  : "bg-slate-950 border-slate-800 text-slate-400"
              }`}
            >
              <span className="absolute -top-2 inset-x-2 bg-amber-500 text-slate-950 text-[9px] font-black py-0.5 rounded-full">
                خصم {disc2}%
              </span>
              <span className="text-xs block font-bold">2 قطعة</span>
              <span className="text-xs font-mono text-amber-400 mt-1 block">{formatIQD(discountedUnit * 2)}</span>
            </button>

            <button
              type="button"
              onClick={() => setQuantity(3)}
              className={`p-3 rounded-2xl border text-center transition-all cursor-pointer relative ${
                quantity === 3
                  ? "bg-amber-500/20 border-amber-400 text-white font-bold ring-1 ring-amber-400"
                  : "bg-slate-950 border-slate-800 text-slate-400"
              }`}
            >
              <span className="absolute -top-2 inset-x-2 bg-amber-400 text-slate-950 text-[9px] font-black py-0.5 rounded-full">
                شحن مجاني + خصم {disc3}%
              </span>
              <span className="text-xs block font-bold">3 قطع</span>
              <span className="text-xs font-mono text-amber-400 mt-1 block">{formatIQD(discountedUnit * 3)}</span>
            </button>
          </div>
        </div>

        {/* Guarantees */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-[#12161f] border border-amber-900/30 flex items-center gap-3">
            <ShieldCheck className="size-6 text-amber-400 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-white">معاينة قبل الدفع</h4>
              <p className="text-[10px] text-slate-400">افحص طلبك وتأكد منه</p>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-[#12161f] border border-amber-900/30 flex items-center gap-3">
            <Truck className="size-6 text-amber-400 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-white">شحن سريع</h4>
              <p className="text-[10px] text-slate-400">لكافة محافظات العراق الـ 18</p>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-[#12161f] border border-amber-900/30 flex items-center gap-3">
            <Award className="size-6 text-amber-400 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-white">ضمان استبدال</h4>
              <p className="text-[10px] text-slate-400">حق استرجاع واستبدال مؤكد</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div id="luxury-order-form" className="bg-[#12161f] border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
          <h2 className="font-black text-lg text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Truck className="size-5 text-amber-400" />
            بيانات طلب الشراء الفوري (الدفع عند الاستلام)
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">الاسم الكامل *</label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="أدخل اسمك الثلاثي"
                className="w-full h-11 px-4 rounded-xl border border-slate-700 bg-slate-950 text-sm text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">رقم الهاتف *</label>
              <input
                type="tel"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="07XXXXXXXXX"
                dir="ltr"
                className="w-full h-11 px-4 rounded-xl border border-slate-700 bg-slate-950 text-sm text-white focus:border-amber-500 focus:outline-none text-right font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">المحافظة والتوصيل *</label>
              <select
                value={selectedGov.id}
                onChange={(e) => {
                  const found = IRAQ_GOVERNORATES_LIST.find((g) => g.id === e.target.value);
                  if (found) setSelectedGov(found);
                }}
                className="w-full h-11 px-4 rounded-xl border border-slate-700 bg-slate-950 text-sm text-white focus:border-amber-500 focus:outline-none cursor-pointer"
              >
                {IRAQ_GOVERNORATES_LIST.map((g) => (
                  <option key={g.id} value={g.id} className="bg-slate-900 text-white">
                    {g.name} — شحن {formatIQD(g.shippingCost)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">العنوان بالتفصيل *</label>
              <input
                type="text"
                required
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                placeholder="المنطقة، الشارع، قرب معلم معروف"
                className="w-full h-11 px-4 rounded-xl border border-slate-700 bg-slate-950 text-sm text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">ملاحظات (اختياري)</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="أي تعليمات للمندوب"
                className="w-full h-11 px-4 rounded-xl border border-slate-700 bg-slate-950 text-xs text-white focus:border-slate-600 focus:outline-none"
              />
            </div>

            {/* Total */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>سعر الطلب ({quantity} قطع):</span>
                <span className="font-mono font-bold text-white">{formatIQD(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>كلفة الشحن ({selectedGov.name}):</span>
                <span className="font-mono font-bold text-white">
                  {isFreeShipping ? <strong className="text-emerald-400">مجاني</strong> : formatIQD(shippingFee)}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-sm font-black text-amber-400">
                <span>الإجمالي المستحق عند الاستلام:</span>
                <span className="text-lg font-mono">
                  {formatIQD(grandTotal)}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-base shadow-xl shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? "جاري الإرسال..." : `تأكيد الشراء الآن (${formatIQD(grandTotal)})`}
            </button>
          </form>
        </div>
      </div>

      {orderSuccess && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-sm w-full bg-slate-900 border border-amber-500/40 rounded-3xl p-6 text-center space-y-4 shadow-2xl">
            <CheckCircle2 className="size-12 text-amber-400 mx-auto" />
            <h3 className="font-black text-lg text-white">تم استلام طلبك بنجاح!</h3>
            <p className="text-xs text-slate-300">
              شكراً لاختيارك متجرنا. سيتواصل معك مندوب الشحن لتأكيد موعد التسليم.
            </p>
            {orderSuccess.orderNumber && (
              <p className="text-xs font-mono text-amber-300">رقم البوليصة: {orderSuccess.orderNumber}</p>
            )}
            <button
              onClick={() => setOrderSuccess(null)}
              className="w-full py-3 bg-amber-500 text-slate-950 font-black text-xs rounded-xl"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
