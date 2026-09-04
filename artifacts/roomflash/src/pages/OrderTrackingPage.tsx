import React, { useState, useEffect } from "react";
import {
  Search,
  Truck,
  Package,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
  ExternalLink,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { formatIQD } from "../data/iraqData";

export function OrderTrackingPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trackingData, setTrackingData] = useState<any>(null);

  // استخراج معلمات الاستعلام من الرابط إن وجدت: ?q=...
  useEffect(() => {
    const hash = window.location.hash || "";
    const searchParams = new URLSearchParams(hash.includes("?") ? hash.split("?")[1] : "");
    const q = searchParams.get("q") || searchParams.get("tracking");
    if (q) {
      setQuery(q);
      performTrack(q);
    }
  }, []);

  const performTrack = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/tenant/track?q=${encodeURIComponent(searchQuery.trim())}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "تعذر العثور على شحنة مطابقة للبيانات المدخلة");
      }

      setTrackingData(data);
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء الاستعلام عن الشحنة");
      setTrackingData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performTrack(query);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans select-none pb-20">
      {/* الترويسة */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-emerald-500 text-slate-950 font-black grid place-items-center shadow-md">
              <Truck className="size-5" />
            </div>
            <div>
              <h1 className="font-extrabold text-base text-white">تتبع الشحنات الحي</h1>
              <span className="text-xs text-emerald-400 font-bold">
                منصة za3em.shop • أسطول شركة الزعيم للشحن - العراق
              </span>
            </div>
          </div>

          <a
            href="#/"
            className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1.5"
          >
            <span>العودة للرئيسية</span>
            <ArrowRight className="size-3.5" />
          </a>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 mt-8 space-y-8 text-right">
        {/* صندوق البحث */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
          <div className="text-center sm:text-right">
            <h2 className="text-xl sm:text-2xl font-black text-white">
              استعلم عن مسار شحنتك لحظة بلحظة
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              أدخل رقم البوليصة (مثل BST-EG-...)، أو رقم هاتفك المحمول، أو رقم الطلب
            </p>
          </div>

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search className="absolute right-4 top-3.5 size-5 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="أدخل رقم البوليصة أو الهاتف (مثال: 01012345678 أو BST-EG-829104)..."
                className="w-full h-12 pr-12 pl-4 rounded-2xl border border-slate-700 bg-slate-950 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="h-12 px-7 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm shadow-lg transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer disabled:opacity-50"
            >
              <Truck className="size-4" />
              <span>{loading ? "جاري التتبع..." : "تتبع الشحنة الآن"}</span>
            </button>
          </form>

          {error && (
            <div className="p-3.5 rounded-2xl bg-red-950/40 border border-red-800/60 text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* نتائج التتبع */}
        {trackingData && trackingData.tracking && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom duration-300">
            {/* بطاقة ملخص الشحنة */}
            <div className="bg-slate-900 border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs text-slate-400 block font-bold">رقم البوليصة الرسمية:</span>
                  <span className="text-lg sm:text-xl font-black font-mono text-emerald-400">
                    {trackingData.tracking.trackingNumber}
                  </span>
                </div>

                <span className="px-3.5 py-1.5 rounded-full text-xs font-black bg-emerald-950 border border-emerald-500/50 text-emerald-300 flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
                  {trackingData.tracking.currentStatusText}
                </span>
              </div>

              {/* تفاصيل الشحنة والمستلم والمبلغ */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                  <span className="text-slate-400 flex items-center gap-1 font-bold">
                    <MapPin className="size-3.5 text-emerald-400" />
                    المحافظة والوجهة:
                  </span>
                  <span className="font-extrabold text-sm text-white block">
                    {trackingData.tracking.governorate}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                  <span className="text-slate-400 flex items-center gap-1 font-bold">
                    <Truck className="size-3.5 text-emerald-400" />
                    شركة الشحن:
                  </span>
                  <span className="font-extrabold text-sm text-white block">
                    {trackingData.tracking.shippingCompany}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                  <span className="text-slate-400 flex items-center gap-1 font-bold">
                    <ShieldCheck className="size-3.5 text-emerald-400" />
                    المبلغ المطلوب نقداً (COD):
                  </span>
                  <span className="font-black text-sm font-mono text-emerald-400 block">
                    {formatIQD(trackingData.tracking.codAmount)}
                  </span>
                </div>
              </div>
            </div>

            {/* المسار الزمني (Tracking Timeline Stepper) */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <Clock className="size-5 text-emerald-400" />
                المسار والمحطات اللوجستية للشحنة
              </h3>

              <div className="relative pr-4 space-y-8 before:absolute before:top-2 before:bottom-2 before:right-7 before:w-0.5 before:bg-slate-800">
                {trackingData.tracking.checkpoints.map((cp: any, idx: number) => (
                  <div key={idx} className="relative flex items-start gap-4">
                    <div
                      className={`size-7 rounded-full grid place-items-center shrink-0 border z-10 ${
                        cp.isCompleted
                          ? "bg-emerald-500 border-emerald-400 text-slate-950 shadow-md"
                          : "bg-slate-900 border-slate-700 text-slate-500"
                      }`}
                    >
                      {cp.isCompleted ? (
                        <CheckCircle2 className="size-4 stroke-[2.5]" />
                      ) : (
                        <div className="size-2 rounded-full bg-slate-600" />
                      )}
                    </div>

                    <div className="flex-1 text-right">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4
                          className={`font-black text-sm ${
                            cp.isCurrent ? "text-emerald-400" : "text-white"
                          }`}
                        >
                          {cp.title}
                        </h4>
                        <span className="text-xs font-mono font-bold text-slate-400">
                          {cp.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {cp.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
