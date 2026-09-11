import React, { useState } from 'react';
import {
  Truck, MapPin, Clock, ShieldCheck, CheckCircle2,
  DollarSign, Search, Zap, Package, ArrowLeft, ArrowRight,
  TrendingUp, Sparkles, Navigation, PhoneCall
} from 'lucide-react';
import { IRAQ_GOVERNORATES, SHIPPING_RATES, formatIQD, Governorate } from '../../data/iraqData';

interface ShippingRatesSummaryProps {
  isAr?: boolean;
}

interface ShippingZone {
  name: string;
  nameEn: string;
  rateRange: string;
  rateRangeEn: string;
  duration: string;
  durationEn: string;
  badge: string;
  badgeEn: string;
  color: 'emerald' | 'teal' | 'cyan';
  governorates: Governorate[];
}

const SHIPPING_ZONES: ShippingZone[] = [
  {
    name: 'بغداد (العاصمة وضواحيها)',
    nameEn: 'Baghdad (Capital & Suburbs)',
    rateRange: '3,000 - 4,000 د.ع',
    rateRangeEn: '3,000 - 4,000 IQD',
    duration: 'خلال 24 ساعة (نفس اليوم أو اليوم التالي)',
    durationEn: 'Within 24 hours (Same day or next day)',
    badge: 'أسرع توصيل ⚡',
    badgeEn: 'Express Speed ⚡',
    color: 'emerald',
    governorates: ['بغداد'],
  },
  {
    name: 'محافظات الفرات الأوسط والجنوب',
    nameEn: 'Central & Southern Governorates',
    rateRange: '4,000 - 5,000 د.ع',
    rateRangeEn: '4,000 - 5,000 IQD',
    duration: 'خلال 24 إلى 48 ساعة',
    durationEn: 'Within 24 to 48 hours',
    badge: 'الأكثر طلباً 📦',
    badgeEn: 'High Volume 📦',
    color: 'teal',
    governorates: ['البصرة', 'النجف', 'كربلاء', 'بابل', 'ذي قار', 'ميسان', 'واسط', 'القادسية', 'المثنى'],
  },
  {
    name: 'محافظات الشمال وإقليم كردستان والغربية',
    nameEn: 'Northern, Kurdistan & Western Region',
    rateRange: '5,000 - 6,000 د.ع',
    rateRangeEn: '5,000 - 6,000 IQD',
    duration: 'خلال 24 إلى 48 ساعة',
    durationEn: 'Within 24 to 48 hours',
    badge: 'تغطية شاملة 🏔️',
    badgeEn: 'Full Coverage 🏔️',
    color: 'cyan',
    governorates: ['أربيل', 'السليمانية', 'دهوك', 'نينوى', 'كركوك', 'الأنبار', 'صلاح الدين', 'ديالى'],
  },
];

export function ShippingRatesSummary({ isAr = true }: ShippingRatesSummaryProps) {
  const [selectedGov, setSelectedGov] = useState<Governorate>('بغداد');
  const [searchQuery, setSearchQuery] = useState('');

  const currentRate = SHIPPING_RATES[selectedGov] || 5000;

  const filteredGovs = IRAQ_GOVERNORATES.filter((gov) =>
    gov.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  return (
    <div className="space-y-10 my-12">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-4 py-1.5 text-xs font-black text-teal-300 backdrop-blur-sm">
          <Truck className="size-3.5 text-teal-400" />
          <span>{isAr ? 'ملخص أسعار الشحن والتوصيل' : 'Shipping Rates Overview'}</span>
        </div>
        <h3 className="text-2xl sm:text-4xl font-black text-white">
          {isAr ? 'أسعار شحن تنافسية وثابتة لجميع المحافظات' : 'Flat & Competitive Rates for All Iraq'}
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-medium">
          {isAr
            ? 'اربط متجرك بأسطول الزعيم واحصل على أفضل أسعار التوصيل وتحصيل الأموال (COD) مع تتبع لحظي مجاني.'
            : 'Integrate your store with Al-Zaeem fleet for transparent rates, zero hidden COD fees, and real-time live tracking.'}
        </p>
      </div>

      {/* 3 Zone Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {SHIPPING_ZONES.map((zone, idx) => {
          return (
            <div
              key={idx}
              className="rounded-3xl border border-slate-800/90 bg-gradient-to-b from-slate-900/90 to-slate-950 p-6 sm:p-7 shadow-xl hover:border-teal-500/40 hover:shadow-teal-900/20 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Badge */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-[11px] font-black px-3 py-1 rounded-full bg-teal-500/15 text-teal-300 border border-teal-500/30">
                    {isAr ? zone.badge : zone.badgeEn}
                  </span>
                  <Truck className="size-4 text-slate-500 group-hover:text-teal-400 transition-colors" />
                </div>

                {/* Zone Name */}
                <h4 className="text-base sm:text-lg font-black text-white mb-2">
                  {isAr ? zone.name : zone.nameEn}
                </h4>

                {/* Price Display */}
                <div className="my-4 p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80">
                  <span className="text-xs font-bold text-slate-400 block mb-1">
                    {isAr ? 'سعر الشحن والتوصيل:' : 'Shipping Rate:'}
                  </span>
                  <div className="text-2xl sm:text-3xl font-black font-mono text-teal-400">
                    {isAr ? zone.rateRange : zone.rateRangeEn}
                  </div>
                </div>

                {/* Duration */}
                <div className="flex items-center gap-2 text-xs font-bold text-slate-300 mb-4">
                  <Clock className="size-3.5 text-emerald-400 shrink-0" />
                  <span>{isAr ? zone.duration : zone.durationEn}</span>
                </div>

                {/* Included Governorates */}
                <div className="border-t border-slate-800/80 pt-4">
                  <span className="text-[11px] font-bold text-slate-400 block mb-2">
                    {isAr ? 'المحافظات المشمولة:' : 'Covered Governorates:'}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {zone.governorates.map((gov) => (
                      <span
                        key={gov}
                        onClick={() => setSelectedGov(gov)}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                          selectedGov === gov
                            ? 'bg-teal-500 text-slate-950 font-black shadow-md'
                            : 'bg-slate-800/70 text-slate-300 hover:bg-slate-700/80 hover:text-white'
                        }`}
                      >
                        {gov}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Governorate Instant Rate Calculator Box */}
      <div className="rounded-3xl border border-teal-500/30 bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-950 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 size-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center lg:text-right flex-1">
            <div className="inline-flex items-center gap-2 text-xs font-black text-teal-400">
              <Sparkles className="size-4" />
              <span>{isAr ? 'حاسبة الشحن الفورية' : 'Instant Shipping Calculator'}</span>
            </div>
            <h4 className="text-xl sm:text-2xl font-black text-white">
              {isAr
                ? `كم تكلفة شحن طلب إلى محافظة ${selectedGov}؟`
                : `How much is shipping to ${selectedGov}?`}
            </h4>
            <p className="text-xs text-slate-400 max-w-xl">
              {isAr
                ? 'اختر محافظتك لمعرفة تكلفة الشحن المقدرة وسرعة التوصيل مع شركة الزعيم:'
                : 'Select any province to check the flat shipping rate and delivery ETA with Al-Zaeem:'}
            </p>
          </div>

          {/* Selector & Result */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
            {/* Dropdown */}
            <div className="w-full sm:w-56">
              <label className="text-[11px] font-bold text-slate-400 block mb-1.5">
                {isAr ? 'اختر المحافظة:' : 'Select Governorate:'}
              </label>
              <select
                value={selectedGov}
                onChange={(e) => setSelectedGov(e.target.value as Governorate)}
                className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-4 py-3 text-xs font-black text-white focus:outline-hidden focus:border-teal-400 cursor-pointer shadow-inner"
              >
                {IRAQ_GOVERNORATES.map((gov) => (
                  <option key={gov} value={gov} className="bg-slate-900 text-white font-bold">
                    {gov}
                  </option>
                ))}
              </select>
            </div>

            {/* Calculated Price Pill */}
            <div className="w-full sm:w-auto p-4 rounded-2xl bg-teal-500/10 border border-teal-500/40 text-center sm:text-right min-w-[200px]">
              <span className="text-[11px] font-bold text-teal-300 block">
                {isAr ? 'أجرة التوصيل مع الزعيم' : 'Shipping Fee'}
              </span>
              <div className="text-2xl sm:text-3xl font-black font-mono text-teal-400 mt-0.5">
                {formatIQD(currentRate)}
              </div>
              <span className="text-[10px] font-extrabold text-emerald-400 block mt-1">
                ✓ {selectedGov === 'بغداد' ? (isAr ? 'توصيل خلال 24 ساعة' : 'Within 24h') : (isAr ? 'توصيل خلال 24-48 ساعة' : '24-48h')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Core Shipping Guarantees Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            icon: ShieldCheck,
            title: isAr ? 'تحصيل COD مجاناً' : 'Zero COD Surcharge',
            desc: isAr ? 'بدون أي عمولات خفية على تحصيل الكاش' : '100% secure cash collection',
          },
          {
            icon: Zap,
            title: isAr ? 'إشعار واتساب تلقائي' : 'Instant WhatsApp Alerts',
            desc: isAr ? 'رسالة تلقائية للزبون برقم البوليصة' : 'Auto tracking sent to buyer',
          },
          {
            icon: MapPin,
            title: isAr ? 'استلام من باب المتجر' : 'Doorstep Pickup',
            desc: isAr ? 'مندوبنا يستلم الشحنات من موقعك' : 'Courier collects from your store',
          },
          {
            icon: TrendingUp,
            title: isAr ? 'تصفية أرباح سريعة' : 'Rapid Cash Settlement',
            desc: isAr ? 'تحويل الأرباح عبر زين كاش أو بنكياً' : 'Fast payouts via Zain Cash/Bank',
          },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <div
              key={i}
              className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-3 hover:border-teal-500/30 transition-colors"
            >
              <div className="size-9 rounded-xl bg-teal-500/10 text-teal-400 grid place-items-center shrink-0 mt-0.5">
                <Icon className="size-4" />
              </div>
              <div>
                <h5 className="text-xs sm:text-sm font-black text-white">{item.title}</h5>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
