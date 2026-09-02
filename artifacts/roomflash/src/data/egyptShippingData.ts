/**
 * بيانات الشحن والمحافظات المصرية لجمهورية مصر العربية
 * متوافقة مع تسعيرة شركات الشحن الرائدة (بوسطة، أرامكس، زاجل)
 * المبالغ بالجنيه المصري الصحيح (INTEGER) بدون كسور أو قروش
 */

export interface GovernorateShipping {
  id: string;
  name: string;
  zone: "greater_cairo" | "alexandria" | "delta" | "canal" | "upper_egypt" | "frontier";
  zoneName: string;
  shippingCost: number; // بالجنيه المصري الصحيح
  estimatedDelivery: string;
  popular?: boolean;
}

export const EGYPT_GOVERNORATES: GovernorateShipping[] = [
  // القاهرة الكبرى
  {
    id: "cairo",
    name: "القاهرة",
    zone: "greater_cairo",
    zoneName: "القاهرة الكبرى",
    shippingCost: 45,
    estimatedDelivery: "خلال 24 ساعة",
    popular: true,
  },
  {
    id: "giza",
    name: "الجيزة",
    zone: "greater_cairo",
    zoneName: "القاهرة الكبرى",
    shippingCost: 45,
    estimatedDelivery: "خلال 24 ساعة",
    popular: true,
  },
  {
    id: "qalyubia",
    name: "القليوبية",
    zone: "greater_cairo",
    zoneName: "القاهرة الكبرى",
    shippingCost: 50,
    estimatedDelivery: "خلال 24-48 ساعة",
  },

  // الإسكندرية والساحل
  {
    id: "alexandria",
    name: "الإسكندرية",
    zone: "alexandria",
    zoneName: "الإسكندرية والساحل",
    shippingCost: 55,
    estimatedDelivery: "خلال 24-48 ساعة",
    popular: true,
  },
  {
    id: "beheira",
    name: "البحيرة",
    zone: "delta",
    zoneName: "محافظات الدلتا",
    shippingCost: 60,
    estimatedDelivery: "خلال 48 ساعة",
  },
  {
    id: "matrouh",
    name: "مطروح",
    zone: "frontier",
    zoneName: "المحافظات الحدودية",
    shippingCost: 85,
    estimatedDelivery: "خلال 2-3 أيام",
  },

  // محافظات الدلتا
  {
    id: "gharbia",
    name: "الغربية (طنطا / المحلة)",
    zone: "delta",
    zoneName: "محافظات الدلتا",
    shippingCost: 55,
    estimatedDelivery: "خلال 24-48 ساعة",
    popular: true,
  },
  {
    id: "dakahlia",
    name: "الدقهلية (المنصورة)",
    zone: "delta",
    zoneName: "محافظات الدلتا",
    shippingCost: 55,
    estimatedDelivery: "خلال 24-48 ساعة",
    popular: true,
  },
  {
    id: "sharqia",
    name: "الشرقية (الزقازيق / العاشر)",
    zone: "delta",
    zoneName: "محافظات الدلتا",
    shippingCost: 55,
    estimatedDelivery: "خلال 24-48 ساعة",
  },
  {
    id: "monufia",
    name: "المنوفية (شبين الكوم)",
    zone: "delta",
    zoneName: "محافظات الدلتا",
    shippingCost: 55,
    estimatedDelivery: "خلال 24-48 ساعة",
  },
  {
    id: "kafr_el_sheikh",
    name: "كفر الشيخ",
    zone: "delta",
    zoneName: "محافظات الدلتا",
    shippingCost: 60,
    estimatedDelivery: "خلال 48 ساعة",
  },
  {
    id: "damietta",
    name: "دمياط",
    zone: "delta",
    zoneName: "محافظات الدلتا",
    shippingCost: 60,
    estimatedDelivery: "خلال 48 ساعة",
  },

  // مدن القناة
  {
    id: "port_said",
    name: "بورسعيد",
    zone: "canal",
    zoneName: "مدن القناة",
    shippingCost: 60,
    estimatedDelivery: "خلال 24-48 ساعة",
  },
  {
    id: "ismailia",
    name: "الإسماعيلية",
    zone: "canal",
    zoneName: "مدن القناة",
    shippingCost: 60,
    estimatedDelivery: "خلال 24-48 ساعة",
  },
  {
    id: "suez",
    name: "السويس",
    zone: "canal",
    zoneName: "مدن القناة",
    shippingCost: 60,
    estimatedDelivery: "خلال 24-48 ساعة",
  },

  // شمال الصعيد
  {
    id: "fayoum",
    name: "الفيوم",
    zone: "upper_egypt",
    zoneName: "شمال الصعيد",
    shippingCost: 65,
    estimatedDelivery: "خلال 48 ساعة",
  },
  {
    id: "beni_suef",
    name: "بني سويف",
    zone: "upper_egypt",
    zoneName: "شمال الصعيد",
    shippingCost: 65,
    estimatedDelivery: "خلال 48 ساعة",
  },
  {
    id: "minya",
    name: "المنيا",
    zone: "upper_egypt",
    zoneName: "شمال الصعيد",
    shippingCost: 70,
    estimatedDelivery: "خلال 48 ساعة",
  },

  // جنوب الصعيد
  {
    id: "assiut",
    name: "أسيوط",
    zone: "upper_egypt",
    zoneName: "جنوب الصعيد",
    shippingCost: 75,
    estimatedDelivery: "خلال 2-3 أيام",
  },
  {
    id: "sohag",
    name: "سوهاج",
    zone: "upper_egypt",
    zoneName: "جنوب الصعيد",
    shippingCost: 80,
    estimatedDelivery: "خلال 2-3 أيام",
  },
  {
    id: "qena",
    name: "قنا",
    zone: "upper_egypt",
    zoneName: "جنوب الصعيد",
    shippingCost: 80,
    estimatedDelivery: "خلال 2-3 أيام",
  },
  {
    id: "luxor",
    name: "الأقصر",
    zone: "upper_egypt",
    zoneName: "جنوب الصعيد",
    shippingCost: 85,
    estimatedDelivery: "خلال 2-3 أيام",
  },
  {
    id: "aswan",
    name: "أسوان",
    zone: "upper_egypt",
    zoneName: "جنوب الصعيد",
    shippingCost: 90,
    estimatedDelivery: "خلال 3 أيام",
  },

  // المحافظات الحدودية وسياحية
  {
    id: "red_sea",
    name: "البحر الأحمر (الغردقة)",
    zone: "frontier",
    zoneName: "المحافظات الحدودية والسياحية",
    shippingCost: 85,
    estimatedDelivery: "خلال 2-3 أيام",
  },
  {
    id: "south_sinai",
    name: "جنوب سيناء (شرم الشيخ)",
    zone: "frontier",
    zoneName: "المحافظات الحدودية والسياحية",
    shippingCost: 90,
    estimatedDelivery: "خلال 2-3 أيام",
  },
  {
    id: "north_sinai",
    name: "شمال سيناء (العريش)",
    zone: "frontier",
    zoneName: "المحافظات الحدودية والسياحية",
    shippingCost: 95,
    estimatedDelivery: "خلال 3-4 أيام",
  },
  {
    id: "new_valley",
    name: "الوادي الجديد",
    zone: "frontier",
    zoneName: "المحافظات الحدودية والسياحية",
    shippingCost: 95,
    estimatedDelivery: "خلال 3-4 أيام",
  },
];

/**
 * تنسيق المبالغ بالجنيه المصري كأعداد صحيحة بدون كسور أو قروش
 * مثال: 450 ج.م
 */
export function formatEGP(amount: number | string): string {
  const numeric = Math.round(Number(amount) || 0);
  return `${numeric.toLocaleString("en-US")} ج.م`;
}

/**
 * جلب تكلفة الشحن لمحافظة بالاسم
 */
export function getGovernorateShipping(name: string): GovernorateShipping {
  const found = EGYPT_GOVERNORATES.find(
    (g) => g.name.includes(name) || name.includes(g.name.split(" ")[0])
  );
  return (
    found || {
      id: "cairo",
      name: name || "القاهرة",
      zone: "greater_cairo",
      zoneName: "القاهرة الكبرى",
      shippingCost: 45,
      estimatedDelivery: "خلال 24-48 ساعة",
    }
  );
}
