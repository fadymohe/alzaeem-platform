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
} from "lucide-react";
import { SingleButtonShippingSelector } from "../shipping/SingleButtonShippingSelector";
import {
  EGYPT_GOVERNORATES,
  GovernorateShipping,
  formatEGP,
} from "../../data/egyptShippingData";
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
  const [selectedGov, setSelectedGov] = useState<GovernorateShipping>(EGYPT_GOVERNORATES[0]);
  const [quantity, setQuantity] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<any>(null);

  const pricePerUnit = Math.round(product.price);
  const shippingFee = selectedGov.shippingCost;
  const grandTotal = Math.round(pricePerUnit * quantity + shippingFee);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !customerAddress) {
      alert("يرجى ملء جميع الحقول");
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
      });
      setOrderSuccess(res);
    } catch (err: any) {
      alert(err.message || "حدث خطأ أثناء الطلب");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-slate-100 font-sans select-none pb-20">
      {/* Top Banner */}
      <div className="border-b border-amber-900/30 bg-[#161b22] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-lg bg-amber-500 text-slate-950 font-black grid place-items-center text-sm shadow">
            {store.name.charAt(0)}
          </div>
          <span className="font-extrabold text-sm text-amber-100">{store.name}</span>
        </div>
        <span className="text-xs font-mono text-amber-400 bg-amber-950/40 border border-amber-800/40 px-3 py-1 rounded-full">
          الدفع عند الاستلام في مصر
        </span>
      </div>

      <div className="max-w-3xl mx-auto px-4 mt-8 space-y-8 text-right">
        {/* Product Showcase */}
        <div className="bg-[#161b22] border border-amber-900/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-slate-950 relative border border-slate-800">
            <img src={product.imageUrl} alt={product.title} className="size-full object-cover" />
            <span className="absolute top-4 right-4 bg-amber-500 text-slate-950 text-xs font-black px-3.5 py-1 rounded-full shadow">
              الإصدار الحصري
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="size-4 fill-amber-400" />
                ))}
              </div>
              <span className="text-xs text-slate-400 font-bold">تقييم 4.9 من عملائنا في مصر</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white">{product.title}</h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{product.description}</p>

            <div className="pt-2 flex items-baseline gap-3">
              <span className="text-3xl font-black font-mono text-amber-400">
                {formatEGP(product.price)}
              </span>
              <span className="text-sm line-through text-slate-500 font-mono">
                {formatEGP(product.price + 200)}
              </span>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-[#161b22] border border-amber-900/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
          <h2 className="font-black text-lg text-white flex items-center gap-2">
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
                placeholder="أحمد علي"
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
                placeholder="01000000000"
                dir="ltr"
                className="w-full h-11 px-4 rounded-xl border border-slate-700 bg-slate-950 text-sm text-white focus:border-amber-500 focus:outline-none text-right"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">المحافظة والتوصيل *</label>
              <SingleButtonShippingSelector
                selectedGovernorate={selectedGov.name}
                onSelect={(gov) => setSelectedGov(gov)}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">العنوان بالتفصيل *</label>
              <input
                type="text"
                required
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                placeholder="الشارع، رقم العقار، الشقة"
                className="w-full h-11 px-4 rounded-xl border border-slate-700 bg-slate-950 text-sm text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            {/* Total */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-300">الإجمالي المستحق عند الاستلام:</span>
              <span className="text-xl font-black font-mono text-amber-400">
                {formatEGP(grandTotal)}
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-base shadow-lg transition-all"
            >
              {isSubmitting ? "جاري الإرسال..." : `تأكيد الشراء (${formatEGP(grandTotal)})`}
            </button>
          </form>
        </div>
      </div>

      {orderSuccess && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 flex items-center justify-center p-4">
          <div className="max-w-sm w-full bg-slate-900 border border-amber-500/40 rounded-3xl p-6 text-center space-y-4 shadow-2xl">
            <CheckCircle2 className="size-12 text-amber-400 mx-auto" />
            <h3 className="font-black text-lg text-white">تم استلام طلبك بنجاح!</h3>
            <p className="text-xs text-slate-300">رقم البوليصة: {orderSuccess.shipping?.trackingNumber}</p>
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
