import React, { useState } from "react";
import {
  Heart,
  ShieldCheck,
  CheckCircle2,
  Star,
  Sparkles,
  Phone,
  Truck,
  ArrowDown,
  Award,
  ThumbsUp,
  Check
} from "lucide-react";
import {
  IRAQ_GOVERNORATES_LIST,
  type IraqGovernorateShipping,
} from "../shipping/SingleButtonShippingSelector";
import { formatIQD } from "../../data/iraqData";
import { TemplateProduct, TemplateStore } from "./EasyOrdersFlashTemplate";

interface BeautyGlowTemplateProps {
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

export const BeautyGlowTemplate: React.FC<BeautyGlowTemplateProps> = ({
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
      alert("يرجى ملء معلومات التوصيل المطلوبة");
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
    const el = document.getElementById("beauty-order-form");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#110d14] text-slate-100 font-sans selection:bg-rose-400 selection:text-slate-950 pb-24" dir="rtl">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-rose-950/60 via-purple-950/60 to-rose-950/60 border-b border-rose-900/30 px-6 py-2.5 flex items-center justify-between text-xs">
        <span className="text-rose-300 font-medium flex items-center gap-1.5">
          <Heart className="size-3.5 fill-rose-400 text-rose-400" />
          منتج عناية وتجميل أصلي 100% مع ضمان الفحص والمعاينة
        </span>
        <span className="text-rose-200 font-bold bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/20">
          شحن لكافة محافظات العراق 🚚
        </span>
      </div>

      {/* Brand Header */}
      <header className="border-b border-rose-950/60 bg-[#16101c]/90 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          {store.logoUrl ? (
            <img src={store.logoUrl} alt={store.name} className="size-10 rounded-2xl object-cover border border-rose-500/30" />
          ) : (
            <div className="size-10 rounded-2xl bg-gradient-to-tr from-rose-400 to-purple-400 grid place-items-center text-slate-950 font-black text-lg shadow-lg shadow-rose-500/20">
              {store.name ? store.name.charAt(0) : "ب"}
            </div>
          )}
          <div>
            <h1 className="text-base font-black text-white">{store.name || "متجر الأناقة"}</h1>
            <p className="text-[10px] text-rose-300">Beauty & Wellness Boutique</p>
          </div>
        </div>

        <button
          type="button"
          onClick={scrollToForm}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-400 to-pink-500 text-slate-950 font-black text-xs shadow-lg shadow-rose-500/20 cursor-pointer"
        >
          اطلبي الآن 🌸
        </button>
      </header>

      <main className="max-w-4xl mx-auto px-4 pt-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Gallery */}
          <div className="space-y-3">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-slate-950 border-2 border-rose-500/30 relative shadow-2xl">
              <img src={selectedImage} alt={product.title} className="size-full object-cover" />
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-rose-500 text-slate-950 font-black text-xs shadow">
                المنتج الأكثر طلباً ✨
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
                      selectedImage === img ? "border-rose-400 scale-95 shadow-md shadow-rose-500/20" : "border-slate-800 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="size-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details & Offers */}
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
                <Sparkles className="size-3.5" />
                <span>إشراقة طبيعية ومكونات آمنة ومختبرة</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                {product.title}
              </h2>
              <div className="flex items-center gap-2 text-xs text-rose-300">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="size-3.5 fill-amber-400" />
                  ))}
                </div>
                <span>(تقييم ممتاز 4.9 من 5 بناءً على تجارب حقيقية)</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#191321] border border-rose-900/40 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block">السعر المخفض:</span>
                <span className="text-3xl font-black text-rose-300 font-mono">{formatIQD(basePrice)}</span>
              </div>
              {comparePrice > basePrice && (
                <div className="text-left">
                  <span className="text-xs text-slate-500 block">السعر السابق:</span>
                  <span className="text-sm line-through text-slate-500 font-mono">{formatIQD(comparePrice)}</span>
                </div>
              )}
            </div>

            {/* Quantity Cards */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-rose-200 block">اختاري العرض المناسب:</label>
              <div className="grid grid-cols-1 gap-2">
                <button
                  type="button"
                  onClick={() => setQuantity(1)}
                  className={`p-3 rounded-2xl border text-right transition-all flex items-center justify-between cursor-pointer ${
                    quantity === 1
                      ? "bg-rose-500/15 border-rose-400 text-white"
                      : "bg-[#191321] border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <span className="text-xs font-bold text-white">عبوة واحدة (تجربة أولى)</span>
                  <span className="text-xs font-mono font-bold text-rose-300">{formatIQD(basePrice)}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setQuantity(2)}
                  className={`p-3 rounded-2xl border text-right transition-all flex items-center justify-between cursor-pointer relative ${
                    quantity === 2
                      ? "bg-rose-500/20 border-rose-400 text-white ring-1 ring-rose-400"
                      : "bg-[#191321] border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <span className="absolute -top-2 left-4 bg-rose-400 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded-full shadow">
                    الأكثر طلباً • خصم {disc2}%
                  </span>
                  <div>
                    <span className="text-xs font-bold text-white block">عبوتان (كورس كامل)</span>
                    <span className="text-[10px] text-emerald-400">وفر {formatIQD((basePrice * 2) - (discountedUnit * 2))}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-rose-300">{formatIQD(discountedUnit * 2)}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setQuantity(3)}
                  className={`p-3 rounded-2xl border text-right transition-all flex items-center justify-between cursor-pointer relative ${
                    quantity === 3
                      ? "bg-purple-500/20 border-purple-400 text-white ring-1 ring-purple-400"
                      : "bg-[#191321] border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <span className="absolute -top-2 left-4 bg-purple-400 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded-full shadow">
                    شحن مجاني + خصم {disc3}%
                  </span>
                  <div>
                    <span className="text-xs font-bold text-white block">3 عبوات (توفير العائلة)</span>
                    <span className="text-[10px] text-emerald-400">توصيل مجاني لكل المحافظات</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-rose-300">{formatIQD(discountedUnit * 3)}</span>
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={scrollToForm}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400 hover:opacity-95 text-slate-950 font-black text-sm text-center shadow-xl shadow-rose-500/25 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
            >
              <span>اطلبي الآن والدفع عند الاستلام بعد المعاينة</span>
              <ArrowDown className="size-4" />
            </button>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          <div className="p-5 rounded-3xl bg-[#191321] border border-rose-950 space-y-2">
            <Heart className="size-6 text-rose-400" />
            <h4 className="text-sm font-black text-white">نتائج ملحوظة وسريعة</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              تركيبة فعالة تمنحك أفضل النتائج في وقت قياسي مع الاستخدام المنتظم.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-[#191321] border border-rose-950 space-y-2">
            <ShieldCheck className="size-6 text-emerald-400" />
            <h4 className="text-sm font-black text-white">ضمان الفحص قبل الدفع</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              حق المعاينة والتأكد من سلامة المنتج ومطابقته التامة قبل تسليم المبلغ.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-[#191321] border border-rose-950 space-y-2">
            <Truck className="size-6 text-purple-400" />
            <h4 className="text-sm font-black text-white">توصيل آمن وسري</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              تغليف محكم وخاص يضمن وصول طلبك بأعلى درجات الخصوصية والأمان.
            </p>
          </div>
        </div>

        {/* Direct COD Form */}
        <div id="beauty-order-form" className="p-6 sm:p-8 rounded-3xl bg-[#16101c] border-2 border-rose-500/30 shadow-2xl space-y-6">
          <div className="text-center space-y-2 border-b border-rose-950 pb-4">
            <span className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-300 text-xs font-bold">
              استمارة الطلب المباشر
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              أدخلي معلومات التوصيل لاستلام طلبك
            </h3>
            <p className="text-xs text-slate-400">
              الدفع نقداً عند استلام الطلب من مندوب شركة الزعيم
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-rose-200 block mb-1.5">
                الاسم الكامل <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="أدخلي اسمك الكامل"
                className="w-full h-12 px-4 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-rose-400 outline-none transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-rose-200 block mb-1.5">
                رقم الهاتف (واتساب) <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  dir="ltr"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="07XXXXXXXXX"
                  className="w-full h-12 px-4 pl-10 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm font-mono focus:border-rose-400 outline-none transition-colors text-right"
                />
                <Phone className="size-4 text-slate-500 absolute left-3.5 top-4 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-rose-200 block mb-1.5">
                المحافظة <span className="text-rose-400">*</span>
              </label>
              <select
                value={selectedGov.id}
                onChange={(e) => {
                  const found = IRAQ_GOVERNORATES_LIST.find((g) => g.id === e.target.value);
                  if (found) setSelectedGov(found);
                }}
                className="w-full h-12 px-4 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-rose-400 outline-none transition-colors cursor-pointer"
              >
                {IRAQ_GOVERNORATES_LIST.map((g) => (
                  <option key={g.id} value={g.id} className="bg-slate-900 text-white">
                    {g.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-rose-200 block mb-1.5">
                العنوان الدقيق / نقطة دالة <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                placeholder="المنطقة، الشارع، قرب معلم معروف"
                className="w-full h-12 px-4 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-rose-400 outline-none transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-rose-200 block mb-1.5">
                ملاحظات للتوصيل (اختياري)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="تعليمات خاصة بالتوصيل أو الوقت المفضل"
                className="w-full h-11 px-4 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-slate-700 outline-none transition-colors"
              />
            </div>

            {/* Total Summary */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-rose-950 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>المبلغ ({quantity} قطع):</span>
                <span className="font-mono font-bold text-white">{formatIQD(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>كلفة الشحن ({selectedGov.name}):</span>
                <span className="font-mono font-bold text-white">
                  {isFreeShipping ? <strong className="text-emerald-400">مجاني</strong> : formatIQD(shippingFee)}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-black text-rose-300">
                <span>المجموع النهائي عند الاستلام:</span>
                <span className="text-base font-mono">{formatIQD(grandTotal)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400 hover:opacity-95 text-slate-950 font-black text-base text-center shadow-xl shadow-rose-500/25 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>جاري تأكيد الطلب...</span>
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
          <div className="bg-[#191321] border border-rose-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center space-y-5 animate-scaleUp">
            <div className="size-16 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 mx-auto grid place-items-center">
              <CheckCircle2 className="size-8" />
            </div>
            <div className="space-y-2">
              <h4 className="text-xl font-black text-white">تم استلام طلبكِ بنجاح!</h4>
              <p className="text-xs text-slate-300">
                شكراً لثقتكِ بمتجرنا. سيتم تجهيز الشحنة والتواصل معكِ لتسليمها بأسرع وقت.
              </p>
            </div>
            {orderSuccess.orderNumber && (
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-rose-300">
                رقم الشحنة: <strong>{orderSuccess.orderNumber}</strong>
              </div>
            )}
            <button
              type="button"
              onClick={() => setOrderSuccess(null)}
              className="w-full py-3 rounded-xl bg-rose-400 text-slate-950 font-black text-xs hover:bg-rose-300 transition-colors"
            >
              حسناً، شكراً
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
