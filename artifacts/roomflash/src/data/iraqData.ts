export const IRAQ_GOVERNORATES = [
  'بغداد',
  'البصرة',
  'نينوى',
  'أربيل',
  'النجف',
  'كربلاء',
  'الأنبار',
  'ديالى',
  'ذي قار',
  'ميسان',
  'واسط',
  'بابل',
  'صلاح الدين',
  'كركوك',
  'القادسية',
  'المثنى',
  'دهوك',
  'السليمانية',
] as const;

export type Governorate = (typeof IRAQ_GOVERNORATES)[number];

export const SHIPPING_RATES: Record<Governorate, number> = {
  بغداد: 3000,
  البصرة: 5000,
  نينوى: 5000,
  أربيل: 5000,
  النجف: 4000,
  كربلاء: 4000,
  الأنبار: 5000,
  ديالى: 4000,
  'ذي قار': 5000,
  ميسان: 5000,
  واسط: 4000,
  بابل: 4000,
  'صلاح الدين': 5000,
  كركوك: 5000,
  القادسية: 4000,
  المثنى: 5000,
  دهوك: 6000,
  السليمانية: 5000,
};

export function formatIQD(amount: number): string {
  return `${new Intl.NumberFormat('ar-IQ', { maximumFractionDigits: 0 }).format(amount)} د.ع`;
}

export interface DemoShipment {
  id: string;
  trackingNumber: string;
  recipientName: string;
  recipientPhone: string;
  governorate: Governorate;
  district: string;
  address: string;
  codAmount: number;
  itemsCount: number;
  status: 'جديدة' | 'قيد التجهيز' | 'خرجت للتوصيل' | 'تم التسليم' | 'فشل التسليم' | 'مرتجعة';
  date: string;
}

export const DEMO_SHIPMENTS: DemoShipment[] = [
  {
    id: '1',
    trackingNumber: 'ZAEEM-2026-000101',
    recipientName: 'حيدر علي الحلي',
    recipientPhone: '+964 770 123 4567',
    governorate: 'بغداد',
    district: 'الكرادة',
    address: 'شارع العرصات - قرب ساحة الواثق',
    codAmount: 45000,
    itemsCount: 2,
    status: 'خرجت للتوصيل',
    date: '2026-09-01',
  },
  {
    id: '2',
    trackingNumber: 'ZAEEM-2026-000102',
    recipientName: 'زينب الجبوري',
    recipientPhone: '+964 780 987 6543',
    governorate: 'البصرة',
    district: 'الجزائر',
    address: 'شارع 14 تموز - قرب المستشفى التعليمي',
    codAmount: 82000,
    itemsCount: 3,
    status: 'تم التسليم',
    date: '2026-08-31',
  },
  {
    id: '3',
    trackingNumber: 'ZAEEM-2026-000103',
    recipientName: 'عمر خالد الموصلي',
    recipientPhone: '+964 750 444 3322',
    governorate: 'أربيل',
    district: 'عينكاوا',
    address: 'شارع العرب - مجمع الأبراج',
    codAmount: 120000,
    itemsCount: 1,
    status: 'قيد التجهيز',
    date: '2026-09-01',
  },
  {
    id: '4',
    trackingNumber: 'ZAEEM-2026-000104',
    recipientName: 'فاطمة الموسوي',
    recipientPhone: '+964 771 555 6677',
    governorate: 'النجف',
    district: 'حي الحنانة',
    address: 'مقابل مسجد الكوفة القديم',
    codAmount: 35000,
    itemsCount: 1,
    status: 'تم التسليم',
    date: '2026-08-30',
  },
  {
    id: '5',
    trackingNumber: 'ZAEEM-2026-000105',
    recipientName: 'كرار الدليمي',
    recipientPhone: '+964 781 222 3344',
    governorate: 'الأنبار',
    district: 'الرمادي',
    address: 'شارع 17 - قرب شارع الأطباء',
    codAmount: 65000,
    itemsCount: 2,
    status: 'فشل التسليم',
    date: '2026-08-29',
  },
];
