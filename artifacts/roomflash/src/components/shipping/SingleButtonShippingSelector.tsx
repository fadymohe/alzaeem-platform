import React, { useState, useMemo, useEffect } from "react";
import {
  Truck,
  MapPin,
  ChevronDown,
  Search,
  Check,
  X,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { formatIQD, IRAQ_GOVERNORATES, SHIPPING_RATES, type Governorate } from "../../data/iraqData";

export interface IraqGovernorateShipping {
  id: string;
  name: Governorate;
  zone: 'central' | 'south' | 'north_kurdistan' | 'west';
  zoneName: string;
  shippingCost: number;
  estimatedDelivery: string;
  popular?: boolean;
}

export const IRAQ_GOVERNORATES_LIST: IraqGovernorateShipping[] = [
  { id: 'baghdad', name: 'بغداد', zone: 'central', zoneName: 'العاصمة والوسط', shippingCost: 3000, estimatedDelivery: 'توصيل خلال 24 ساعة', popular: true },
  { id: 'basra', name: 'البصرة', zone: 'south', zoneName: 'الجنوب', shippingCost: 5000, estimatedDelivery: 'توصيل خلال 24 - 48 ساعة', popular: true },
  { id: 'erbil', name: 'أربيل', zone: 'north_kurdistan', zoneName: 'إقليم كردستان', shippingCost: 5000, estimatedDelivery: 'توصيل خلال 24 - 48 ساعة', popular: true },
  { id: 'sulaymaniyah', name: 'السليمانية', zone: 'north_kurdistan', zoneName: 'إقليم كردستان', shippingCost: 5000, estimatedDelivery: 'توصيل خلال 24 - 48 ساعة' },
  { id: 'duhok', name: 'دهوك', zone: 'north_kurdistan', zoneName: 'إقليم كردستان', shippingCost: 6000, estimatedDelivery: 'توصيل خلال 48 ساعة' },
  { id: 'nineveh', name: 'نينوى', zone: 'north_kurdistan', zoneName: 'الشمال', shippingCost: 5000, estimatedDelivery: 'توصيل خلال 24 - 48 ساعة', popular: true },
  { id: 'kirkuk', name: 'كركوك', zone: 'north_kurdistan', zoneName: 'الشمال', shippingCost: 5000, estimatedDelivery: 'توصيل خلال 24 - 48 ساعة' },
  { id: 'najaf', name: 'النجف', zone: 'south', zoneName: 'الفرات الأوسط', shippingCost: 4000, estimatedDelivery: 'توصيل خلال 24 ساعة', popular: true },
  { id: 'karbala', name: 'كربلاء', zone: 'south', zoneName: 'الفرات الأوسط', shippingCost: 4000, estimatedDelivery: 'توصيل خلال 24 ساعة', popular: true },
  { id: 'babil', name: 'بابل', zone: 'central', zoneName: 'الوسط والفرات', shippingCost: 4000, estimatedDelivery: 'توصيل خلال 24 ساعة' },
  { id: 'diyala', name: 'ديالى', zone: 'central', zoneName: 'الوسط', shippingCost: 4000, estimatedDelivery: 'توصيل خلال 24 ساعة' },
  { id: 'anbar', name: 'الأنبار', zone: 'west', zoneName: 'المنطقة الغربية', shippingCost: 5000, estimatedDelivery: 'توصيل خلال 24 - 48 ساعة' },
  { id: 'wasit', name: 'واسط', zone: 'central', zoneName: 'الوسط', shippingCost: 4000, estimatedDelivery: 'توصيل خلال 24 ساعة' },
  { id: 'dhi_qar', name: 'ذي قار', zone: 'south', zoneName: 'الجنوب', shippingCost: 5000, estimatedDelivery: 'توصيل خلال 24 - 48 ساعة' },
  { id: 'maysan', name: 'ميسان', zone: 'south', zoneName: 'الجنوب', shippingCost: 5000, estimatedDelivery: 'توصيل خلال 24 - 48 ساعة' },
  { id: 'muthanna', name: 'المثنى', zone: 'south', zoneName: 'الجنوب', shippingCost: 5000, estimatedDelivery: 'توصيل خلال 24 - 48 ساعة' },
  { id: 'qadisiyyah', name: 'القادسية', zone: 'south', zoneName: 'الفرات الأوسط', shippingCost: 4000, estimatedDelivery: 'توصيل خلال 24 ساعة' },
  { id: 'saladin', name: 'صلاح الدين', zone: 'central', zoneName: 'الوسط', shippingCost: 5000, estimatedDelivery: 'توصيل خلال 24 - 48 ساعة' },
];

interface SingleButtonShippingSelectorProps {
  selectedGovernorate: string;
  onSelect: (governorate: IraqGovernorateShipping) => void;
  className?: string;
  disabled?: boolean;
}

export const SingleButtonShippingSelector: React.FC<SingleButtonShippingSelectorProps> = ({
  selectedGovernorate,
  onSelect,
  className = "",
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeZone, setActiveZone] = useState<string>("all");

  // العثور على المحافظة العراقية المختارة
  const currentGov = useMemo(() => {
    return (
      IRAQ_GOVERNORATES_LIST.find(
        (g) =>
          g.name === selectedGovernorate ||
          selectedGovernorate.includes(g.name) ||
          g.name.includes(selectedGovernorate)
      ) || IRAQ_GOVERNORATES_LIST[0]
    );
  }, [selectedGovernorate]);

  // إغلاق القائمة بمفتاح Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // تصفية المحافظات بالبحث والتصنيف الجغرافي العراقي
  const filteredGovernorates = useMemo(() => {
    return IRAQ_GOVERNORATES_LIST.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.zoneName.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchSearch) return false;
      if (activeZone === "all") return true;
      if (activeZone === "central") return item.zone === "central";
      if (activeZone === "south") return item.zone === "south";
      if (activeZone === "north_kurdistan") return item.zone === "north_kurdistan";
      if (activeZone === "west") return item.zone === "west";
      return true;
    });
  }, [searchQuery, activeZone]);

  const handleSelectGovernorate = (gov: IraqGovernorateShipping) => {
    onSelect(gov);
    setTimeout(() => {
      setIsOpen(false);
    }, 120);
  };

  return (
    <div className={`relative w-full ${className}`}>
      {/* 1. الزر التفاعلي الموحد للشحن */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(true)}
        className="w-full group bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 hover:from-emerald-900/40 hover:to-slate-800 border-2 border-emerald-500/40 hover:border-emerald-400 p-3.5 sm:p-4 rounded-2xl shadow-lg transition-all duration-200 text-right flex items-center justify-between gap-3 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 cursor-pointer"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="size-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 grid place-items-center shrink-0 group-hover:scale-105 transition-transform">
            <Truck className="size-5" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-300">طريقة الشحن والتوصيل:</span>
              <span className="text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                <Clock className="size-3" />
                {currentGov.estimatedDelivery}
              </span>
            </div>

            <div className="flex items-center gap-1.5 mt-1">
              <MapPin className="size-3.5 text-emerald-400 shrink-0" />
              <span className="text-sm sm:text-base font-extrabold text-white truncate">
                محافظة {currentGov.name} ({currentGov.zoneName})
              </span>
            </div>
          </div>
        </div>

        {/* تكلفة الشحن بالدينار العراقي */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="text-left">
            <span className="text-[10px] text-slate-400 block font-bold">مصاريف الشحن</span>
            <span className="text-sm sm:text-base font-black font-mono text-emerald-400">
              +{formatIQD(currentGov.shippingCost)}
            </span>
          </div>

          <div className="size-7 rounded-lg bg-slate-800 border border-slate-700 grid place-items-center text-slate-400 group-hover:text-white group-hover:bg-slate-700 transition-colors">
            <ChevronDown className="size-4" />
          </div>
        </div>
      </button>

      {/* 2. القائمة المنبثقة لاختيار المحافظة */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div
            className="absolute inset-0"
            onClick={() => setIsOpen(false)}
          />

          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[88vh] flex flex-col text-right z-10 animate-in slide-in-from-bottom duration-300">
            <div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto mt-3 sm:hidden" />

            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-black text-base sm:text-lg text-white flex items-center gap-2">
                  <MapPin className="size-5 text-emerald-400" />
                  اختر المحافظة العراقية لحساب تكلفة الشحن
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  الدفع عند الاستلام نقداً بعد المعاينة لجميع محافظات العراق
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="size-8 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 grid place-items-center transition-colors cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* شريط البحث */}
            <div className="p-3 sm:p-4 border-b border-slate-800/80 bg-slate-950/40">
              <div className="relative">
                <Search className="absolute right-3.5 top-3 size-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث باسم المحافظة (بغداد، البصرة، أربيل، النجف...)"
                  autoFocus
                  className="w-full h-10 pr-10 pl-4 rounded-xl border border-slate-700 bg-slate-900 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute left-3 top-2.5 text-xs text-slate-400 hover:text-white cursor-pointer"
                  >
                    مسح
                  </button>
                )}
              </div>

              {/* أزرار التصفية للمناطق العراقية */}
              <div className="flex items-center gap-1.5 overflow-x-auto pt-2.5 pb-0.5 scrollbar-none text-[11px] font-bold">
                {[
                  { id: "all", label: "كل المحافظات (18)" },
                  { id: "central", label: "بغداد والوسط" },
                  { id: "south", label: "الفرات والجنوب" },
                  { id: "north_kurdistan", label: "كردستان والشمال" },
                  { id: "west", label: "الأنبار والغربية" },
                ].map((z) => (
                  <button
                    key={z.id}
                    type="button"
                    onClick={() => setActiveZone(z.id)}
                    className={`px-3 py-1 rounded-lg shrink-0 transition-colors cursor-pointer ${
                      activeZone === z.id
                        ? "bg-emerald-600 text-white font-extrabold shadow-sm"
                        : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    {z.label}
                  </button>
                ))}
              </div>
            </div>

            {/* قائمة المحافظات */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2">
              {filteredGovernorates.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  لا توجد محافظة مطابقة لـ "{searchQuery}".
                </div>
              ) : (
                filteredGovernorates.map((gov) => {
                  const isSelected = gov.name === currentGov.name;
                  return (
                    <button
                      key={gov.id}
                      type="button"
                      onClick={() => handleSelectGovernorate(gov)}
                      className={`w-full p-3 rounded-xl border text-right transition-all flex items-center justify-between gap-3 cursor-pointer ${
                        isSelected
                          ? "bg-emerald-950/60 border-emerald-500 text-white shadow-md ring-1 ring-emerald-500/50"
                          : "bg-slate-800/60 hover:bg-slate-800 border-slate-700/60 text-slate-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`size-6 rounded-full grid place-items-center shrink-0 border ${
                            isSelected
                              ? "bg-emerald-500 border-emerald-400 text-slate-950"
                              : "border-slate-600 bg-slate-900"
                          }`}
                        >
                          {isSelected && <Check className="size-3.5 stroke-[3]" />}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-sm text-white">
                              محافظة {gov.name}
                            </span>
                            {gov.popular && (
                              <span className="text-[9px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded">
                                شحن فائق السرعة
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400 block mt-0.5">
                            {gov.zoneName} • {gov.estimatedDelivery}
                          </span>
                        </div>
                      </div>

                      <div className="text-left shrink-0">
                        <span className="font-mono font-black text-sm text-emerald-400 block">
                          {formatIQD(gov.shippingCost)}
                        </span>
                        <span className="text-[10px] text-slate-400">توصيل لباب البيت</span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between gap-3">
              <div className="text-xs text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-emerald-400" />
                <span>شحن موثوق عبر شركة الزعيم إكسبريس في كافة أرجاء العراق</span>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
