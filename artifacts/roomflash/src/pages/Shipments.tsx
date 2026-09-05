import { useState, useEffect, type FormEvent, useRef } from 'react';
import { useLocation } from 'wouter';
import {
  Truck, Plus, Search, MapPin, Package, Phone, User, DollarSign, FileText,
  CheckCircle2, Clock, AlertTriangle, ArrowLeft, ExternalLink, RefreshCw,
  Building, ShieldCheck, PhoneCall, Sparkles, Printer, Upload, Download,
  FileSpreadsheet, X, Check, Eye, ChevronRight
} from 'lucide-react';
import {
  IRAQ_GOVERNORATES, formatIQD, type Governorate
} from '../data/iraqData';
import { getStoredOrders } from '../data/storeState';
import {
  saveCloudShipment, fetchCloudShipments, trackCloudShipment,
  type CloudShipment
} from '../utils/cloudDb';

export interface GovernorateDetail {
  name: Governorate;
  region: string;
  rate: number;
  expressRate: number;
  duration: string;
}

export const IRAQ_GOVERNORATE_DETAILS: Record<Governorate, GovernorateDetail> = {
  'بغداد': { name: 'بغداد', region: 'العاصمة والمركز', rate: 5000, expressRate: 7000, duration: '24 ساعة (خلال نفس اليوم أو التالي)' },
  'البصرة': { name: 'البصرة', region: 'المنطقة الجنوبية', rate: 6000, expressRate: 8000, duration: '24 - 48 ساعة' },
  'أربيل': { name: 'أربيل', region: 'إقليم كردستان', rate: 7000, expressRate: 9000, duration: '48 - 72 ساعة' },
  'النجف': { name: 'النجف', region: 'الفرات الأوسط', rate: 5000, expressRate: 7000, duration: '24 - 48 ساعة' },
  'كربلاء': { name: 'كربلاء', region: 'الفرات الأوسط', rate: 5000, expressRate: 7000, duration: '24 - 48 ساعة' },
  'بابل': { name: 'بابل', region: 'الفرات الأوسط', rate: 5000, expressRate: 7000, duration: '24 - 48 ساعة' },
  'نينوى': { name: 'نينوى', region: 'المنطقة الشمالية', rate: 7000, expressRate: 9000, duration: '48 - 72 ساعة' },
  'كركوك': { name: 'كركوك', region: 'المنطقة الشمالية', rate: 6000, expressRate: 8000, duration: '48 - 72 ساعة' },
  'الأنبار': { name: 'الأنبار', region: 'المنطقة الغربية', rate: 6000, expressRate: 8000, duration: '48 - 72 ساعة' },
  'ديالى': { name: 'ديالى', region: 'المنطقة الوسطى', rate: 5000, expressRate: 7000, duration: '24 - 48 ساعة' },
  'ذي قار': { name: 'ذي قار', region: 'المنطقة الجنوبية', rate: 6000, expressRate: 8000, duration: '24 - 48 ساعة' },
  'ميسان': { name: 'ميسان', region: 'المنطقة الجنوبية', rate: 6000, expressRate: 8000, duration: '24 - 48 ساعة' },
  'واسط': { name: 'واسط', region: 'الفرات الأوسط', rate: 5000, expressRate: 7000, duration: '24 - 48 ساعة' },
  'صلاح الدين': { name: 'صلاح الدين', region: 'المنطقة الشمالية', rate: 6000, expressRate: 8000, duration: '48 - 72 ساعة' },
  'القادسية': { name: 'القادسية', region: 'الفرات الأوسط', rate: 5000, expressRate: 7000, duration: '24 - 48 ساعة' },
  'المثنى': { name: 'المثنى', region: 'المنطقة الجنوبية', rate: 6000, expressRate: 8000, duration: '24 - 48 ساعة' },
  'دهوك': { name: 'دهوك', region: 'إقليم كردستان', rate: 7000, expressRate: 9000, duration: '48 - 72 ساعة' },
  'السليمانية': { name: 'السليمانية', region: 'إقليم كردستان', rate: 7000, expressRate: 9000, duration: '48 - 72 ساعة' },
};

export function ShipmentsPage() {
  const [location] = useLocation();

  // Tab switcher
  const getInitialTab = (): 'list' | 'create' | 'track' | 'rates' => {
    if (typeof window === 'undefined') return 'list';
    const hash = window.location.hash || '';
    const search = window.location.search || '';
    if (hash.includes('rates') || search.includes('rates') || location.includes('/shipments/rates')) return 'rates';
    if (hash.includes('track') || search.includes('track') || location.includes('/shipments/track')) return 'track';
    if (hash.includes('new') || hash.includes('create') || search.includes('create') || location.includes('/shipments/new')) return 'create';
    return 'list';
  };

  const [activeTab, setActiveTab] = useState<'list' | 'create' | 'track' | 'rates'>(getInitialTab);

  // Sync tab on URL change
  useEffect(() => {
    setActiveTab(getInitialTab());
  }, [location]);

  // Store information
  const [subdomain, setSubdomain] = useState<string>('');
  const [storeName, setStoreName] = useState<string>('متجر الزعيم');
  const [storePhone, setStorePhone] = useState<string>('07700000000');

  useEffect(() => {
    try {
      const rawStore = localStorage.getItem('zaeem_onboarded_store') || localStorage.getItem('zaeem_store_data');
      const rawUser = localStorage.getItem('zaeem_user');
      let storeObj: any = null;
      let userObj: any = null;
      if (rawStore) storeObj = JSON.parse(rawStore);
      if (rawUser) userObj = JSON.parse(rawUser);

      const sub = (storeObj?.subdomain || userObj?.subdomain || 'alzaeem')
        .replace('.za3em.shop', '')
        .replace(/^https?:\/\//, '')
        .trim();
      setSubdomain(sub);
      setStoreName(storeObj?.storeName || userObj?.storeName || 'متجر الزعيم');
      setStorePhone(userObj?.phone || '07700000000');
    } catch {}
  }, []);

  // 1. Real Shipments from Server (Purge Dummy Shipments)
  const [shipments, setShipments] = useState<CloudShipment[]>([]);
  const [isLoadingShipments, setIsLoadingShipments] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedGovernorate, setSelectedGovernorate] = useState<string>('الكل');

  const loadShipmentsFromServer = async () => {
    setIsLoadingShipments(true);
    try {
      const serverData = await fetchCloudShipments(subdomain);
      // Also merge with locally stored shipments if any
      let localData: CloudShipment[] = [];
      try {
        const raw = localStorage.getItem('zaeem_local_shipments');
        if (raw) localData = JSON.parse(raw);
      } catch {}

      const map = new Map<string, CloudShipment>();
      (serverData || []).forEach(s => map.set(s.trackingNumber, s));
      (localData || []).forEach(s => {
        if (!map.has(s.trackingNumber)) map.set(s.trackingNumber, s);
      });

      const merged = Array.from(map.values()).sort((a, b) => {
        const tA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const tB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return tB - tA;
      });

      setShipments(merged);
    } catch (err) {
      console.warn('Error loading shipments:', err);
    } finally {
      setIsLoadingShipments(false);
    }
  };

  useEffect(() => {
    loadShipmentsFromServer();
  }, [subdomain]);

  // 2. Track Shipment State & Stages
  const [trackCode, setTrackCode] = useState('');
  const [trackedShipment, setTrackedShipment] = useState<CloudShipment | null>(null);
  const [isTrackingLoading, setIsTrackingLoading] = useState(false);
  const [trackError, setTrackError] = useState(false);

  const handleTrackSearch = async (e: FormEvent) => {
    e.preventDefault();
    const clean = trackCode.trim();
    if (!clean) return;

    setIsTrackingLoading(true);
    setTrackError(false);
    setTrackedShipment(null);

    try {
      // 1. Check local shipments first
      const foundLocal = shipments.find(s =>
        s.trackingNumber.toLowerCase() === clean.toLowerCase() ||
        s.recipientPhone === clean
      );

      if (foundLocal) {
        setTrackedShipment(foundLocal);
      } else {
        // 2. Query cloud database API
        const cloudResult = await trackCloudShipment(clean);
        if (cloudResult) {
          setTrackedShipment(cloudResult);
        } else {
          setTrackError(true);
        }
      }
    } catch (err) {
      setTrackError(true);
    } finally {
      setIsTrackingLoading(false);
    }
  };

  // Helper to determine active tracking stages (المراحل التي مرت بها الشحنة)
  const getTrackingStages = (status: CloudShipment['status']) => {
    const isDelivered = status === 'تم التسليم';
    const isOut = status === 'خرجت للتوصيل' || isDelivered;
    const inWarehouse = status === 'في المستودع' || status === 'قيد التجهيز' || isOut;
    const isReceived = true; // Once generated, order is received
    const isFailed = status === 'فشل التسليم' || status === 'مرتجعة';

    return [
      {
        id: 1,
        title: 'استلام الشحنة وتأكيد البوليصة',
        desc: 'تم استلام بيانات الشحنة من المتجر وإصدار كود التتبع الرسمي',
        completed: isReceived,
        active: status === 'جديدة',
        date: 'نفس اليوم'
      },
      {
        id: 2,
        title: 'في مستودع الفرز والتجهيز (الزعيم - بغداد)',
        desc: 'وصل الطرد إلى مركز التوزيع اللوجستي للفرز والتجهيز مع المندوب',
        completed: inWarehouse,
        active: status === 'في المستودع' || status === 'قيد التجهيز',
        date: 'مكتمل'
      },
      {
        id: 3,
        title: 'خرجت مع المندوب للتوصيل',
        desc: 'الشحنة بعهدة مندوب شركة الزعيم وتتجه إلى عنوان المستلم',
        completed: isOut,
        active: status === 'خرجت للتوصيل',
        date: 'جاري التوصيل'
      },
      {
        id: 4,
        title: isFailed ? 'فشل التسليم / مرتجع للمتجر' : 'تم التسليم للزبون وتحصيل المبلغ (COD)',
        desc: isFailed ? 'تعذر الوصول إلى الزبون وسيتم إرجاع الطرد للتاجر' : 'تم تسليم الشحنة للزبون بنجاح وتحصيل المبلغ نقداً',
        completed: isDelivered,
        active: isDelivered,
        date: isDelivered ? 'تم الإنجاز' : 'بانتظار التسليم'
      }
    ];
  };

  // 3. Create Shipment State (Manual + Bulk Upload)
  const [createMode, setCreateMode] = useState<'manual' | 'bulk'>('manual');

  // Manual Form
  const [form, setForm] = useState({
    recipientName: '',
    recipientPhone: '',
    governorate: 'بغداد' as Governorate,
    district: '',
    neighborhood: '',
    address: '',
    nearestLandmark: '',
    codAmount: '',
    paymentType: 'cod' as 'cod' | 'prepaid',
    notes: '',
  });

  // Validation Errors State
  const [validationErrors, setValidationErrors] = useState<{
    recipientName?: string;
    recipientPhone?: string;
    district?: string;
    neighborhood?: string;
    nearestLandmark?: string;
  }>({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdSuccessShipment, setCreatedSuccessShipment] = useState<CloudShipment | null>(null);

  // Dynamic Shipping Rate Calculation
  const currentGovDetail = IRAQ_GOVERNORATE_DETAILS[form.governorate] || IRAQ_GOVERNORATE_DETAILS['بغداد'];
  const shippingCost = currentGovDetail.rate;
  const deliveryDuration = currentGovDetail.duration;
  const codNum = Number(form.codAmount) || 0;
  const merchantNetAmount = Math.max(0, codNum - shippingCost);

  // Strict Form Inputs Handlers
  const handleNameChange = (val: string) => {
    // Only Arabic and English letters and spaces (Strictly no numbers, no symbols)
    const sanitized = val.replace(/[^a-zA-Z\u0600-\u06FF\s]/g, '');
    setForm(prev => ({ ...prev, recipientName: sanitized }));

    const parts = sanitized.trim().split(/\s+/).filter(Boolean);
    if (sanitized && parts.length < 2) {
      setValidationErrors(prev => ({ ...prev, recipientName: 'يجب أن يكون اسم العميل ثنائياً على الأقل (اسمين) وبدون أرقام أو رموز' }));
    } else {
      setValidationErrors(prev => ({ ...prev, recipientName: undefined }));
    }
  };

  const handlePhoneChange = (val: string) => {
    // Only numbers, no letters, no symbols, max 10 digits, strip 964 prefix if pasted
    let digits = val.replace(/\D/g, '');
    if (digits.startsWith('964')) {
      digits = digits.slice(3);
    }
    if (digits.length > 10) {
      digits = digits.slice(0, 10);
    }
    setForm(prev => ({ ...prev, recipientPhone: digits }));

    if (digits && digits.length !== 10) {
      setValidationErrors(prev => ({ ...prev, recipientPhone: 'رقم الهاتف يجب أن يتكون من 10 أرقام فقط وبدون كود الدولة 964 (مثال: 0770123456)' }));
    } else {
      setValidationErrors(prev => ({ ...prev, recipientPhone: undefined }));
    }
  };

  const handleNoSymbolChange = (field: 'district' | 'neighborhood' | 'nearestLandmark', val: string) => {
    // Strictly no special symbols in district, neighborhood, or landmark
    const sanitized = val.replace(/[!@#$%^&*()_+=\[\]{};':"\\|,.<>\/?~`]/g, '');
    setForm(prev => ({ ...prev, [field]: sanitized }));
  };

  // Auto fill from latest order in the merchant's store
  const handleAutoFillFromLatestOrder = () => {
    const orders = getStoredOrders();
    if (!orders || orders.length === 0) {
      alert('لا توجد طلبات شراء مسجلة بعد في متجرك لتعبئة الشحنة منها.');
      return;
    }
    const latest = orders[0];
    const rawPhone = (latest.customerPhone || '').replace(/\D/g, '').replace(/^964/, '').slice(0, 10);
    const sanitizedName = (latest.customerName || '').replace(/[^a-zA-Z\u0600-\u06FF\s]/g, '');

    setForm(prev => ({
      ...prev,
      recipientName: sanitizedName,
      recipientPhone: rawPhone,
      address: latest.address || prev.address,
      codAmount: String(latest.total || 0),
      notes: `شحنة مخصصة للطلب (${latest.number})`,
    }));
    alert(`تمت تعبئة بيانات الشحنة من الطلب (${latest.number}) بنجاح ✅`);
  };

  // Manual Shipment Submission
  const handleManualCreateShipment = async (e: FormEvent) => {
    e.preventDefault();

    // 1. Validate Recipient Name: No digits/symbols & at least 2 words
    const nameParts = form.recipientName.trim().split(/\s+/).filter(Boolean);
    if (nameParts.length < 2) {
      setValidationErrors(prev => ({ ...prev, recipientName: 'اسم المستلم يجب أن يكون ثنائياً على الأقل (اسمين) وبدون أرقام أو رموز' }));
      alert('يرجى كتابة اسم المستلم ثنائياً على الأقل بدون أرقام أو رموز.');
      return;
    }

    // 2. Validate Phone: Exactly 10 digits, no symbols/letters
    if (form.recipientPhone.length !== 10) {
      setValidationErrors(prev => ({ ...prev, recipientPhone: 'رقم الهاتف يجب أن يتكون من 10 أرقام فقط وبدون كود الدولة 964 (مثال: 0770123456)' }));
      alert('رقم الهاتف غير صحيح! يجب أن يتكون من 10 أرقام فقط وبدون كود الدولة 964.');
      return;
    }

    // 3. Validate Landmark and District (No symbols)
    if (!form.district.trim() || !form.nearestLandmark.trim()) {
      alert('يرجى إدخال المدينة / القضاء والنقطة الدالة بشكل صحيح.');
      return;
    }

    setIsSubmitting(true);
    const newTracking = `ZAEEM-2026-${Math.floor(100000 + Math.random() * 900000)}`;

    const newShipment: CloudShipment = {
      trackingNumber: newTracking,
      subdomain: subdomain,
      recipientName: form.recipientName.trim(),
      recipientPhone: form.recipientPhone.trim(),
      governorate: form.governorate,
      district: form.district.trim(),
      nearestLandmark: form.nearestLandmark.trim(),
      address: `${form.neighborhood.trim()} ${form.address.trim()} (قرب ${form.nearestLandmark.trim()})`.trim(),
      codAmount: form.paymentType === 'cod' ? Number(form.codAmount) || 0 : 0,
      shippingCost: shippingCost,
      paymentType: form.paymentType,
      status: 'جديدة',
      shippingCompany: 'شركة الزعيم للشحن السريع واللوجستي',
      notes: form.notes.trim(),
      createdAt: new Date().toISOString(),
      date: new Date().toISOString().split('T')[0],
    };

    try {
      // 1. Upload to Server & Shipping Company API
      await saveCloudShipment(newShipment);

      // 2. Save locally
      const currentList = [newShipment, ...shipments];
      setShipments(currentList);
      try {
        localStorage.setItem('zaeem_local_shipments', JSON.stringify(currentList));
      } catch {}

      // 3. Reset form and prompt success
      setCreatedSuccessShipment(newShipment);
      setForm({
        recipientName: '',
        recipientPhone: '',
        governorate: 'بغداد',
        district: '',
        neighborhood: '',
        address: '',
        nearestLandmark: '',
        codAmount: '',
        paymentType: 'cod',
        notes: '',
      });
    } catch (err) {
      console.warn('Error saving shipment:', err);
      alert('حدث خطأ أثناء حفظ الشحنة في السيرفر. تم حفظها محلياً.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Bulk Shipments Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [bulkParsedRows, setBulkParsedRows] = useState<{
    id: number;
    recipientName: string;
    recipientPhone: string;
    governorate: Governorate;
    district: string;
    neighborhood: string;
    nearestLandmark: string;
    codAmount: number;
    notes: string;
    isValid: boolean;
    errorReason?: string;
  }[]>([]);
  const [isBulkUploading, setIsBulkUploading] = useState(false);

  // Download Sample CSV Template
  const handleDownloadTemplate = () => {
    const header = 'اسم المستلم,رقم الهاتف,المحافظة,المدينة والقضاء,المنطقة,النقطة الدالة,مبلغ التحصيل,ملاحظات';
    const row1 = 'حيدر علي الحسيني,0770123456,بغداد,الكرادة,شارع العرصات,قرب ساحة الواثق,45000,يرجى الاتصال قبل الوصول';
    const row2 = 'زينب حسن الجبوري,0780987654,البصرة,الجزائر,حي الأندلس,مقابل المستشفى التعليمي,75000,تسليم سريع';
    const csvContent = '\uFEFF' + [header, row1, row2].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'نموذج_شحنات_الزعيم_المجمعة.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Parse Uploaded CSV File
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
      if (lines.length <= 1) {
        alert('الملف المرفوع فارغ أو لا يحتوي على صفوف بيانات.');
        return;
      }

      // Process rows (skip header)
      const parsed: any[] = [];
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].replace(/\r/g, '').trim();
        if (!line) continue;

        const cols = line.split(',').map(c => c.trim().replace(/^"|"$/g, ''));
        const rawName = cols[0] || '';
        const rawPhone = cols[1] || '';
        const rawGov = (cols[2] || 'بغداد') as Governorate;
        const rawDistrict = cols[3] || 'المركز';
        const rawNeighborhood = cols[4] || '';
        const rawLandmark = cols[5] || 'قرب المركز';
        const rawCod = Number(cols[6]) || 0;
        const rawNotes = cols[7] || '';

        // Validation Rules:
        const cleanName = rawName.replace(/[^a-zA-Z\u0600-\u06FF\s]/g, '').trim();
        const nameValid = cleanName.split(/\s+/).filter(Boolean).length >= 2;

        let cleanPhone = rawPhone.replace(/\D/g, '');
        if (cleanPhone.startsWith('964')) cleanPhone = cleanPhone.slice(3);
        const phoneValid = cleanPhone.length === 10;

        const govValid = IRAQ_GOVERNORATES.includes(rawGov);
        const noSymbolsInAddress = !/[!@#$%^&*()_+=\[\]{};':"\\|,.<>\/?~`]/.test(rawDistrict + rawNeighborhood + rawLandmark);

        let errorReason = '';
        if (!nameValid) errorReason = 'الاسم يجب أن يكون ثنائياً وبدون أرقام/رموز';
        else if (!phoneValid) errorReason = 'الهاتف يجب أن يكون 10 أرقام بدون 964';
        else if (!govValid) errorReason = 'اسم المحافظة غير صحيح';
        else if (!noSymbolsInAddress) errorReason = 'العنوان يحتوي على رموز غير مسموحة';

        parsed.push({
          id: i,
          recipientName: cleanName || rawName,
          recipientPhone: cleanPhone || rawPhone,
          governorate: govValid ? rawGov : 'بغداد',
          district: rawDistrict,
          neighborhood: rawNeighborhood,
          nearestLandmark: rawLandmark,
          codAmount: rawCod,
          notes: rawNotes,
          isValid: nameValid && phoneValid && govValid && noSymbolsInAddress,
          errorReason,
        });
      }

      setBulkParsedRows(parsed);
    };
    reader.readAsText(file, 'UTF-8');
  };

  // Submit all valid rows from bulk upload
  const handleConfirmBulkUpload = async () => {
    const validRows = bulkParsedRows.filter(r => r.isValid);
    if (validRows.length === 0) {
      alert('لا توجد أي شحنات صالحة للرفع في الملف. يرجى تصحيح الأخطاء أولاً.');
      return;
    }

    setIsBulkUploading(true);
    const newShipmentsList: CloudShipment[] = [];

    for (const r of validRows) {
      const tracking = `ZAEEM-2026-${Math.floor(100000 + Math.random() * 900000)}`;
      const govRate = IRAQ_GOVERNORATE_DETAILS[r.governorate]?.rate || 5000;

      const s: CloudShipment = {
        trackingNumber: tracking,
        subdomain: subdomain,
        recipientName: r.recipientName,
        recipientPhone: r.recipientPhone,
        governorate: r.governorate,
        district: r.district,
        nearestLandmark: r.nearestLandmark,
        address: `${r.neighborhood} ${r.district} (قرب ${r.nearestLandmark})`.trim(),
        codAmount: r.codAmount,
        shippingCost: govRate,
        paymentType: 'cod',
        status: 'جديدة',
        shippingCompany: 'شركة الزعيم للشحن السريع واللوجستي',
        notes: r.notes,
        createdAt: new Date().toISOString(),
        date: new Date().toISOString().split('T')[0],
      };

      await saveCloudShipment(s);
      newShipmentsList.push(s);
    }

    const merged = [...newShipmentsList, ...shipments];
    setShipments(merged);
    try {
      localStorage.setItem('zaeem_local_shipments', JSON.stringify(merged));
    } catch {}

    setIsBulkUploading(false);
    setBulkParsedRows([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setActiveTab('list');
    alert(`تم رفع (${newShipmentsList.length}) شحنة بنجاح إلى السيرفر ونظام شركة الزعيم للشحن! 🚀`);
  };

  // 4. PDF Waybill Printing State
  const [waybillModalShipment, setWaybillModalShipment] = useState<CloudShipment | null>(null);

  const handlePrintWaybill = (shipment: CloudShipment) => {
    setWaybillModalShipment(shipment);
  };

  const executeWaybillPrint = () => {
    window.print();
  };

  // Filter Shipments
  const filteredShipments = shipments.filter((s) => {
    const matchSearch =
      (s.recipientName || '').includes(search) ||
      (s.trackingNumber || '').includes(search) ||
      (s.recipientPhone || '').includes(search);
    const matchGov = selectedGovernorate === 'الكل' || s.governorate === selectedGovernorate;
    return matchSearch && matchGov;
  });

  return (
    <div className="space-y-6 rf-appear">
      {/* Printable Waybill Area */}
      {waybillModalShipment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm print:p-0 print:bg-white print:static print:inset-auto">
          <div className="zaeem-waybill-print-area max-w-2xl w-full bg-white rounded-3xl p-6 md:p-8 shadow-2xl border border-slate-200 text-slate-900 print:shadow-none print:border-0 print:w-full print:max-w-none print:p-6 print:rounded-none">
            {/* Modal Header for screen */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6 print:hidden">
              <div className="flex items-center gap-2">
                <Printer className="size-5 text-teal-700" />
                <h3 className="font-extrabold text-lg text-slate-900">معاينة بوليصة الشحن الرسمية (PDF)</h3>
              </div>
              <button
                type="button"
                onClick={() => setWaybillModalShipment(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Official Waybill Form */}
            <div className="border-2 border-slate-900 p-5 rounded-2xl space-y-4">
              {/* Waybill Top Header */}
              <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-slate-900 text-white rounded-lg">
                      <Truck className="size-5" />
                    </span>
                    <div>
                      <h2 className="text-xl font-black tracking-tight text-slate-950">شركة الزعيم للشحن السريع</h2>
                      <p className="text-[11px] font-bold text-slate-600">Al-Zaeem Express Delivery & Logistics Iraq</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">الناقل الرسمي لمنصة الزعيم للتجارة الإلكترونية</p>
                </div>

                <div className="text-left font-mono">
                  <div className="border border-slate-900 px-3 py-1 rounded-lg bg-slate-50 text-right">
                    <span className="text-[10px] block font-bold text-slate-500">رقم البوليصة / Tracking ID</span>
                    <span className="text-sm font-black tracking-wider text-slate-950">{waybillModalShipment.trackingNumber}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">تاريخ الإصدار: {waybillModalShipment.date || new Date().toISOString().split('T')[0]}</p>
                </div>
              </div>

              {/* Barcode Visualization */}
              <div className="flex flex-col items-center justify-center p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="h-10 flex items-center justify-center gap-0.5 tracking-widest font-mono text-2xl font-black select-none">
                  ||| | |||| | ||||| ||| || ||||| | |||| || |||
                </div>
                <span className="font-mono text-xs font-black tracking-widest mt-1">{waybillModalShipment.trackingNumber}</span>
              </div>

              {/* Merchant / Sender & Recipient Details */}
              <div className="grid grid-cols-2 gap-4 border-b-2 border-slate-900 pb-4 text-xs">
                {/* Sender */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="font-bold text-[10px] text-teal-800 uppercase tracking-wider block border-b border-slate-200 pb-1">
                    بيانات التاجر / الراسل (Sender)
                  </span>
                  <p className="font-black text-slate-900 text-sm">{storeName}</p>
                  <p className="text-slate-600">النطاق: {subdomain}.za3em.shop</p>
                  <p className="text-slate-600 font-mono">هاتف الدعم: {storePhone}</p>
                  <p className="text-slate-500">الموقع: العراق - بغداد</p>
                </div>

                {/* Recipient */}
                <div className="p-3 rounded-xl bg-teal-50/50 border border-teal-200 space-y-1">
                  <span className="font-bold text-[10px] text-teal-800 uppercase tracking-wider block border-b border-teal-200 pb-1">
                    بيانات الزبون / المستلم (Consignee)
                  </span>
                  <p className="font-black text-slate-950 text-sm">{waybillModalShipment.recipientName}</p>
                  <p className="text-slate-900 font-bold font-mono text-sm">هاتف: {waybillModalShipment.recipientPhone}</p>
                  <p className="text-slate-700 font-bold">
                    {waybillModalShipment.governorate} — {waybillModalShipment.district}
                  </p>
                  <p className="text-slate-600">النقطة الدالة: {waybillModalShipment.nearestLandmark}</p>
                  <p className="text-slate-500 text-[11px] truncate">{waybillModalShipment.address}</p>
                </div>
              </div>

              {/* Financial Breakdown (COD) */}
              <div className="p-4 rounded-xl border-2 border-dashed border-slate-900 bg-slate-50 flex items-center justify-between">
                <div>
                  <span className="text-xs font-black text-slate-700 block">المبلغ المطلوب تحصيله نقداً عند الاستلام:</span>
                  <p className="text-2xl font-black text-teal-900 font-mono mt-0.5">
                    {formatIQD(waybillModalShipment.codAmount)}
                  </p>
                  <span className="text-[10px] text-slate-500 font-medium">شامل أجور الشحن المقررة: {formatIQD(waybillModalShipment.shippingCost || 5000)}</span>
                </div>

                <div className="text-center p-2 rounded-lg border border-slate-300 bg-white">
                  <div className="size-14 rounded-lg border border-slate-900 grid place-items-center mx-auto text-[9px] font-bold">
                    QR CODE
                  </div>
                  <span className="text-[9px] font-bold text-slate-600 mt-1 block">تأكيد التسليم</span>
                </div>
              </div>

              {/* Notes & Seal */}
              <div className="flex items-center justify-between text-xs pt-2">
                <div className="max-w-xs text-[11px] text-slate-600">
                  <strong>ملاحظات الشحنة:</strong> {waybillModalShipment.notes || 'يرجى الاتصال بالزبون والتسليم لباب المنزل مع فحص الطرد.'}
                </div>
                <div className="text-center border-2 border-teal-700 px-4 py-1.5 rounded-xl text-teal-800 font-black text-xs rotate-[-3deg]">
                  ✓ معتمد للشحن الفوري - الزعيم
                </div>
              </div>
            </div>

            {/* Print Action Buttons */}
            <div className="mt-6 flex justify-end gap-3 print:hidden">
              <button
                type="button"
                onClick={() => setWaybillModalShipment(null)}
                className="px-5 h-11 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50"
              >
                إغلاق
              </button>
              <button
                type="button"
                onClick={executeWaybillPrint}
                className="px-6 h-11 bg-teal-700 hover:bg-teal-800 text-white text-sm font-bold rounded-xl shadow-md flex items-center gap-2 transition-all"
              >
                <Printer className="size-4" />
                <span>طباعة البوليصة (Print / PDF)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal after adding a shipment */}
      {createdSuccessShipment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-2xl border border-teal-200 dark:border-teal-900 text-center space-y-4">
            <div className="size-16 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-400 grid place-items-center mx-auto border border-teal-200 dark:border-teal-800">
              <Check className="size-8 stroke-[3]" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              تم إنشاء وتأكيد الشحنة بنجاح! 🚀
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              تم تسجيل الشحنة برقم تتبع رسمي ورفعها على سيستم شركة الزعيم للشحن وسيستم الموقع.
            </p>
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl font-mono text-sm font-black text-teal-800 dark:text-teal-300 border border-slate-200 dark:border-slate-700">
              {createdSuccessShipment.trackingNumber}
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  const s = createdSuccessShipment;
                  setCreatedSuccessShipment(null);
                  handlePrintWaybill(s);
                }}
                className="h-11 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl shadow flex items-center justify-center gap-1.5 transition-all"
              >
                <Printer className="size-4" />
                <span>طباعة البوليصة فوراً</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setCreatedSuccessShipment(null);
                  setActiveTab('list');
                }}
                className="h-11 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold text-xs rounded-xl transition-all"
              >
                عرض في جدول الشحنات
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Header Bar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-teal-700 dark:text-teal-400 mb-1">
            <Truck className="size-4" /> شركة الزعيم للشحن السريع واللوجستي
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            الشحن والتتبع
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            إدارة الشحنات، تتبع مراحل الطرود لحظة بلحظة، وطباعة بوالص الشحن لكافة محافظات العراق.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveTab('list')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'list'
                ? 'bg-teal-700 text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <span>جميع الشحنات ({shipments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('create')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'create'
                ? 'bg-teal-700 text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <Plus className="size-3.5" />
            <span>إضافة شحنة جديدة</span>
          </button>

          <button
            onClick={() => setActiveTab('track')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'track'
                ? 'bg-teal-700 text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <Search className="size-3.5" />
            <span>تتبع الشحنة</span>
          </button>

          <button
            onClick={() => setActiveTab('rates')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'rates'
                ? 'bg-teal-700 text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <MapPin className="size-3.5" />
            <span>استعراض التغطية والأسعار</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 🌟 Tab 1: Coverage & Rates (استعراض التغطية والأسعار ومدة الشحن)             */}
      {/* ========================================================================= */}
      {activeTab === 'rates' && (
        <div className="space-y-6">
          {/* Hero Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white p-7 md:p-10 shadow-xl border border-teal-900/50">
            <div className="absolute -right-20 -top-20 size-72 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold mb-3 border border-teal-500/30">
                <Building className="size-3.5" /> التغطية الشاملة لشركة الزعيم في 18 محافظة عراقية
              </div>
              <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight leading-tight">
                أسعار الشحن ومدة التوصيل للمحافظات العراقية
              </h2>
              <p className="mt-2 text-sm md:text-base text-slate-300 leading-relaxed font-medium">
                تغطية لوجستية متكاملة لجميع مدن وأقضية العراق مع توصيل فوري داخل بغداد خلال 24 ساعة، وتصفية يومية لمستحقات الدفع عند الاستلام (COD).
              </p>

              <div className="mt-6 flex flex-wrap gap-3 items-center">
                <button
                  type="button"
                  onClick={() => setActiveTab('create')}
                  className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center gap-1.5"
                >
                  <Plus className="size-4" />
                  <span>إنشاء شحنة فورية</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('track')}
                  className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl backdrop-blur-md transition-all flex items-center gap-1.5"
                >
                  <Search className="size-4" />
                  <span>تتبع شحنة مباشرة</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
              <p className="text-xs font-bold text-slate-500">التغطية الجغرافية</p>
              <p className="text-2xl font-extrabold text-teal-700 dark:text-teal-400 mt-1">18 محافظة</p>
              <p className="text-[11px] text-slate-400 mt-1">تغطية لكل مدن وقرى العراق</p>
            </div>
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
              <p className="text-xs font-bold text-slate-500">مدة التوصيل ببغداد</p>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">24 ساعة</p>
              <p className="text-[11px] text-slate-400 mt-1">نفس اليوم أو اليوم التالي</p>
            </div>
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
              <p className="text-xs font-bold text-slate-500">تصفية المبالغ (COD)</p>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">يومياً / أسبوعياً</p>
              <p className="text-[11px] text-slate-400 mt-1">تحويل كاش أو زين كاش</p>
            </div>
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
              <p className="text-xs font-bold text-slate-500">نسبة التسليم الناجح</p>
              <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">98.4%</p>
              <p className="text-[11px] text-slate-400 mt-1">مع متابعة دقيقة لكل طرد</p>
            </div>
          </div>

          {/* Full Rates & Duration Table */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <MapPin className="size-5 text-teal-700 dark:text-teal-400" />
                  جدول أسعار الشحن ومدة التوصيل المتوقعة لكافة محافظات العراق
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  الأسعار الرسمية المعتمدة لشركة الزعيم شاملة التوصيل لباب العميل وتحصيل المبالغ.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs font-bold text-slate-500">
                  <tr>
                    <th className="p-3.5">المحافظة</th>
                    <th className="p-3.5">المنطقة الجغرافية</th>
                    <th className="p-3.5">مدة الشحن والتوصيل</th>
                    <th className="p-3.5">سعر التوصيل العادي</th>
                    <th className="p-3.5">سعر التوصيل السريع</th>
                    <th className="p-3.5 text-center">إجراء فوري</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {IRAQ_GOVERNORATES.map((gov) => {
                    const detail = IRAQ_GOVERNORATE_DETAILS[gov] || {
                      name: gov,
                      region: 'المحافظات',
                      rate: 5000,
                      expressRate: 7000,
                      duration: '24 - 48 ساعة',
                    };
                    return (
                      <tr key={gov} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="p-3.5 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <MapPin className="size-3.5 text-teal-600 dark:text-teal-400" />
                          <span>{gov}</span>
                        </td>
                        <td className="p-3.5 text-xs text-slate-600 dark:text-slate-300">
                          {detail.region}
                        </td>
                        <td className="p-3.5">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800/50">
                            <Clock className="size-3" />
                            {detail.duration}
                          </span>
                        </td>
                        <td className="p-3.5 font-mono font-bold text-slate-900 dark:text-white">
                          {formatIQD(detail.rate)}
                        </td>
                        <td className="p-3.5 font-mono font-bold text-teal-700 dark:text-teal-400">
                          {formatIQD(detail.expressRate)}
                        </td>
                        <td className="p-3.5 text-center">
                          <button
                            type="button"
                            onClick={() => {
                              setForm(prev => ({ ...prev, governorate: gov }));
                              setActiveTab('create');
                            }}
                            className="px-3 py-1 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 hover:bg-teal-700 hover:text-white text-xs font-bold transition-colors cursor-pointer"
                          >
                            إنشاء شحنة لـ {gov}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🌟 Tab 2: Track Shipment (تتبع الشحنة وعرض تفاصيلها والمراحل)                */}
      {/* ========================================================================= */}
      {activeTab === 'track' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 shadow-sm text-center">
            <div className="size-14 rounded-2xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 grid place-items-center mx-auto mb-4 border border-teal-100 dark:border-teal-900/50">
              <Truck className="size-7" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              نظام تتبع الشحنات الحي — شركة الزعيم
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-6">
              أدخل رقم تتبع الشحنة المكون من الكود (مثال: ZAEEM-2026-104928) أو رقم هاتف المستلم
            </p>

            <form onSubmit={handleTrackSearch} className="flex gap-2 max-w-lg mx-auto mb-4">
              <input
                required
                type="text"
                value={trackCode}
                onChange={(e) => setTrackCode(e.target.value)}
                placeholder="أدخل رقم الشحنة أو رقم هاتف المستلم"
                className="flex-1 h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-mono font-bold outline-none focus:border-teal-600"
              />
              <button
                type="submit"
                disabled={isTrackingLoading}
                className="px-6 h-12 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-2"
              >
                {isTrackingLoading ? (
                  <RefreshCw className="size-4 animate-spin" />
                ) : (
                  <Search className="size-4" />
                )}
                <span>تتبع</span>
              </button>
            </form>

            {trackError && (
              <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs font-bold">
                لم يتم العثور على أي شحنة مسجلة بهذا الرقم في سيرفر شركة الزعيم. يرجى التثبت من الرقم والمحاولة مجدداً.
              </div>
            )}
          </div>

          {/* Tracked Shipment Result Card & Multi-stage Timeline */}
          {trackedShipment && (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 shadow-sm space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 block">رقم الشحنة المسجل</span>
                  <p className="font-mono text-xl font-black text-teal-800 dark:text-teal-400">
                    {trackedShipment.trackingNumber}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    الناقل: {trackedShipment.shippingCompany || 'شركة الزعيم للشحن السريع'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                    الحالة: {trackedShipment.status}
                  </span>
                  <button
                    type="button"
                    onClick={() => handlePrintWaybill(trackedShipment)}
                    className="px-3 py-1.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <Printer className="size-3.5" />
                    <span>طباعة البوليصة</span>
                  </button>
                </div>
              </div>

              {/* Multi-Stage Visual Tracking Timeline (المراحل التي مرت بها الشحنة) */}
              <div className="space-y-3">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Clock className="size-4 text-teal-700" /> مراحل مسار الشحنة
                </h3>

                <div className="relative border-r-2 border-teal-200 dark:border-teal-900 mr-3 pr-6 space-y-6">
                  {getTrackingStages(trackedShipment.status).map((stage, idx) => (
                    <div key={stage.id} className="relative">
                      {/* Circle indicator */}
                      <span
                        className={`absolute -right-[31px] top-0 size-6 rounded-full grid place-items-center text-xs font-bold ${
                          stage.completed
                            ? 'bg-teal-700 text-white shadow-sm'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                        }`}
                      >
                        {stage.completed ? <Check className="size-3.5 stroke-[3]" /> : idx + 1}
                      </span>

                      <div>
                        <div className="flex items-center justify-between">
                          <h4 className={`text-xs font-extrabold ${stage.completed ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
                            {stage.title}
                          </h4>
                          <span className="text-[10px] text-slate-400 font-mono font-medium">
                            {stage.date}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                          {stage.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detailed Shipment Info */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-xs font-extrabold text-slate-900 dark:text-white mb-3">
                  بيانات تفصيلية للطلب والمستلم
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400 block text-[10px] font-bold">اسم المستلم</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{trackedShipment.recipientName}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400 block text-[10px] font-bold">رقم الهاتف</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{trackedShipment.recipientPhone}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400 block text-[10px] font-bold">المحافظة والقضاء</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{trackedShipment.governorate} - {trackedShipment.district}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400 block text-[10px] font-bold">أقرب نقطة دالة</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{trackedShipment.nearestLandmark || 'غير محددة'}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400 block text-[10px] font-bold">مبلغ التحصيل (COD)</span>
                    <span className="font-mono font-black text-teal-800 dark:text-teal-400">{formatIQD(trackedShipment.codAmount)}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400 block text-[10px] font-bold">أجور الشحن</span>
                    <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{formatIQD(trackedShipment.shippingCost || 5000)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🌟 Tab 3: Create Shipment (إضافة شحنة + رفع ملف شحنات مجمعة)                 */}
      {/* ========================================================================= */}
      {activeTab === 'create' && (
        <div className="max-w-4xl mx-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Plus className="size-5 text-teal-700" /> إنشاء وإضافة شحنة جديدة
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                إصدار بوليصة شحن فورية مع شركة الزعيم للتوصيل والتحصيل لكافة محافظات العراق
              </p>
            </div>

            {/* Mode Switcher: Manual vs Bulk Upload */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setCreateMode('manual')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  createMode === 'manual'
                    ? 'bg-white dark:bg-slate-900 text-teal-800 dark:text-teal-300 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                إدخال يدوي
              </button>
              <button
                type="button"
                onClick={() => setCreateMode('bulk')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  createMode === 'bulk'
                    ? 'bg-white dark:bg-slate-900 text-teal-800 dark:text-teal-300 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <FileSpreadsheet className="size-3.5" />
                <span>رفع ملف شحنات مجمعة</span>
              </button>
            </div>
          </div>

          {/* Bulk Upload Option */}
          {createMode === 'bulk' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-teal-50/50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900/50 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-teal-950 dark:text-teal-200 flex items-center gap-2">
                    <FileSpreadsheet className="size-4" /> رفع وتوليد بوالص شحن مجمعة عبر ملف CSV أو Excel
                  </h3>
                  <button
                    type="button"
                    onClick={handleDownloadTemplate}
                    className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-teal-300 dark:border-teal-800 text-teal-800 dark:text-teal-200 text-xs font-bold hover:bg-teal-100 dark:hover:bg-slate-700 flex items-center gap-1.5 shadow-sm"
                  >
                    <Download className="size-3.5" />
                    <span>تحميل نموذج الشحنات الجاهز (CSV)</span>
                  </button>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  قم بتحميل النموذج المرفق وتعبئة أسماء الزبائن، أرقام الهواتف (10 أرقام)، المحافظات والمبالغ، ثم ارفع الملف هنا لتوليد البوالص ورفعها إلى السيرفر وشركة الشحن فورياً.
                </p>
              </div>

              {/* Upload Input */}
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-teal-500 rounded-2xl p-8 text-center transition-colors">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".csv, .txt, .xlsx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="zaeem-bulk-shipments-input"
                />
                <label
                  htmlFor="zaeem-bulk-shipments-input"
                  className="cursor-pointer flex flex-col items-center justify-center space-y-2"
                >
                  <div className="size-12 rounded-2xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 grid place-items-center">
                    <Upload className="size-6" />
                  </div>
                  <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                    اضغط هنا لاختيار ملف الشحنات (CSV / Excel)
                  </span>
                  <span className="text-xs text-slate-500">
                    الملفات المدعومة: .csv و .txt بصيغة UTF-8
                  </span>
                </label>
              </div>

              {/* Parsed Rows Preview Table */}
              {bulkParsedRows.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">
                        معاينة الشحنات المستخرجة من الملف ({bulkParsedRows.length})
                      </h4>
                      <p className="text-xs text-slate-500">
                        الشحنات الصالحة: {bulkParsedRows.filter(r => r.isValid).length} | الشحنات التي بها أخطاء: {bulkParsedRows.filter(r => !r.isValid).length}
                      </p>
                    </div>
                    <button
                      type="button"
                      disabled={isBulkUploading || bulkParsedRows.filter(r => r.isValid).length === 0}
                      onClick={handleConfirmBulkUpload}
                      className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center gap-1.5"
                    >
                      {isBulkUploading ? <RefreshCw className="size-3.5 animate-spin" /> : <Check className="size-3.5" />}
                      <span>تأكيد ورفع كافة الشحنات الصالحة ({bulkParsedRows.filter(r => r.isValid).length})</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                    <table className="w-full text-right text-xs">
                      <thead className="bg-slate-50 dark:bg-slate-800/60 font-bold text-slate-500">
                        <tr>
                          <th className="p-3">#</th>
                          <th className="p-3">اسم المستلم</th>
                          <th className="p-3">الهاتف</th>
                          <th className="p-3">المحافظة</th>
                          <th className="p-3">المدينة / النقطة الدالة</th>
                          <th className="p-3">مبلغ التحصيل</th>
                          <th className="p-3">حالة الصف</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {bulkParsedRows.map(row => (
                          <tr key={row.id} className={row.isValid ? '' : 'bg-rose-50/50 dark:bg-rose-950/20'}>
                            <td className="p-3 font-mono">{row.id}</td>
                            <td className="p-3 font-bold">{row.recipientName}</td>
                            <td className="p-3 font-mono">{row.recipientPhone}</td>
                            <td className="p-3">{row.governorate}</td>
                            <td className="p-3">{row.district} - {row.nearestLandmark}</td>
                            <td className="p-3 font-mono font-bold">{formatIQD(row.codAmount)}</td>
                            <td className="p-3">
                              {row.isValid ? (
                                <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                                  <Check className="size-3.5" /> جاهزة للرفع
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400 font-bold">
                                  <AlertTriangle className="size-3.5" /> {row.errorReason}
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Manual Entry Form */}
          {createMode === 'manual' && (
            <form onSubmit={handleManualCreateShipment} className="space-y-6">
              {/* Quick Preset Buttons */}
              <div className="p-4 rounded-xl bg-teal-50/80 dark:bg-teal-950/30 border border-teal-200/60 dark:border-teal-800/50">
                <span className="text-xs font-extrabold text-teal-900 dark:text-teal-300 block mb-2">
                  ⚡ خيارات سريعة وتعبئة تلقائية:
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, governorate: 'بغداد', notes: 'شحن فوري داخل بغداد - تسليم خلال 24 ساعة 🚀' }))}
                    className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-teal-300 text-teal-800 dark:text-teal-200 text-xs font-bold hover:bg-teal-100 transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <span>🚀</span> شحن بغداد (24 ساعة)
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, governorate: 'البصرة', notes: 'شحن محافظات العراق' }))}
                    className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-teal-300 text-teal-800 dark:text-teal-200 text-xs font-bold hover:bg-teal-100 transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <span>🚚</span> شحن المحافظات
                  </button>
                  <button
                    type="button"
                    onClick={handleAutoFillFromLatestOrder}
                    className="px-3 py-1.5 rounded-lg bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <Sparkles className="size-3.5" /> تعبئة من أحدث طلب بالمتجر
                  </button>
                </div>
              </div>

              {/* Section 1: Recipient Details */}
              <div>
                <h3 className="text-sm font-bold text-teal-800 dark:text-teal-400 mb-4 flex items-center gap-2">
                  <User className="size-4" /> بيانات المستلم (يمنع الرموز والأرقام في الاسم)
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      اسم المستلم الثنائي على الأقل <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      value={form.recipientName}
                      onChange={(e) => handleNameChange(e.target.value)}
                      placeholder="مثال: حيدر علي الحسيني"
                      className={`w-full h-11 px-3.5 rounded-xl border bg-white dark:bg-slate-800 text-sm outline-none transition-all ${
                        validationErrors.recipientName
                          ? 'border-rose-500 focus:border-rose-600 focus:ring-2 focus:ring-rose-500/10'
                          : 'border-slate-200 dark:border-slate-700 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10'
                      }`}
                    />
                    {validationErrors.recipientName ? (
                      <p className="text-[11px] text-rose-500 mt-1 font-bold flex items-center gap-1">
                        <AlertTriangle className="size-3" />
                        {validationErrors.recipientName}
                      </p>
                    ) : (
                      <p className="text-[10px] text-slate-400 mt-1">يجب أن يتكون من اسمين على الأقل بدون أرقام أو رموز خاصة.</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      رقم الهاتف (10 أرقام دون 964) <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      maxLength={10}
                      value={form.recipientPhone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      placeholder="0770123456"
                      className={`w-full h-11 px-3.5 rounded-xl border bg-white dark:bg-slate-800 text-sm font-mono ltr text-right outline-none transition-all ${
                        validationErrors.recipientPhone
                          ? 'border-rose-500 focus:border-rose-600 focus:ring-2 focus:ring-rose-500/10'
                          : 'border-slate-200 dark:border-slate-700 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10'
                      }`}
                    />
                    {validationErrors.recipientPhone ? (
                      <p className="text-[11px] text-rose-500 mt-1 font-bold flex items-center gap-1">
                        <AlertTriangle className="size-3" />
                        {validationErrors.recipientPhone}
                      </p>
                    ) : (
                      <p className="text-[10px] text-slate-400 mt-1">أرقام فقط، 10 خانات دون رمز الدولة 964 (مثال: 0770123456).</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 2: Address Details */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-bold text-teal-800 dark:text-teal-400 mb-4 flex items-center gap-2">
                  <MapPin className="size-4" /> عنوان التوصيل بالتفصيل (يمنع استخدام الرموز)
                </h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      المحافظة العراقية <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={form.governorate}
                      onChange={(e) => setForm({ ...form, governorate: e.target.value as Governorate })}
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:border-teal-600"
                    >
                      {IRAQ_GOVERNORATES.map((g) => (
                        <option key={g} value={g}>
                          {g} ({IRAQ_GOVERNORATE_DETAILS[g]?.duration || '24-48 ساعة'})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      المدينة / القضاء <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      value={form.district}
                      onChange={(e) => handleNoSymbolChange('district', e.target.value)}
                      placeholder="مثال: الكرادة / المنصور / الزبير"
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:border-teal-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      المنطقة / الحي
                    </label>
                    <input
                      type="text"
                      value={form.neighborhood}
                      onChange={(e) => handleNoSymbolChange('neighborhood', e.target.value)}
                      placeholder="مثال: شارع فلسطين"
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:border-teal-600"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 mt-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      الشارع / رقم الدار
                    </label>
                    <input
                      type="text"
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      placeholder="مثال: زقاق 12 دار 45"
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:border-teal-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      أقرب نقطة دالة (العلامة المميزة) <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      value={form.nearestLandmark}
                      onChange={(e) => handleNoSymbolChange('nearestLandmark', e.target.value)}
                      placeholder="مثال: قرب جامع الحكيم / مقابل مستشفى العلوية"
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:border-teal-600"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Financials & Live Shipping Fee Auto-Calculation */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-bold text-teal-800 dark:text-teal-400 mb-4 flex items-center gap-2">
                  <DollarSign className="size-4" /> احتساب تكلفة الشحن ومبلغ التحصيل
                </h3>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      طريقة الدفع
                    </label>
                    <select
                      value={form.paymentType}
                      onChange={(e) => setForm({ ...form, paymentType: e.target.value as 'cod' | 'prepaid' })}
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:border-teal-600"
                    >
                      <option value="cod">الدفع عند الاستلام (COD)</option>
                      <option value="prepaid">مدفوع مسبقاً (Prepaid)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      المبلغ الإجمالي للتحصيل من الزبون (د.ع) <span className="text-red-500">*</span>
                    </label>
                    <input
                      required={form.paymentType === 'cod'}
                      disabled={form.paymentType === 'prepaid'}
                      type="number"
                      value={form.paymentType === 'prepaid' ? 0 : form.codAmount}
                      onChange={(e) => setForm({ ...form, codAmount: e.target.value })}
                      placeholder="مثال: 50000"
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:border-teal-600 disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Auto Calculated Shipping Cost Card */}
                <div className="mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 grid sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block font-bold text-[10px]">كلفة الشحن المقررة لـ ({form.governorate})</span>
                    <span className="text-base font-black text-teal-700 dark:text-teal-400 font-mono mt-0.5 block">
                      {formatIQD(shippingCost)}
                    </span>
                    <span className="text-[10px] text-slate-500">المدة: {deliveryDuration}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block font-bold text-[10px]">قيمة تحصيل الطلب (COD)</span>
                    <span className="text-base font-black text-slate-900 dark:text-white font-mono mt-0.5 block">
                      {formatIQD(codNum)}
                    </span>
                    <span className="text-[10px] text-slate-500">المبلغ المستلم من الزبون</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block font-bold text-[10px]">صافي مستحقات المتجر المحولة</span>
                    <span className="text-base font-black text-emerald-600 dark:text-emerald-400 font-mono mt-0.5 block">
                      {formatIQD(merchantNetAmount)}
                    </span>
                    <span className="text-[10px] text-slate-500">تصفية يومية / أسبوعية</span>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    ملاحظات الشحنة للمندوب
                  </label>
                  <textarea
                    rows={2}
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder="مثال: يرجى الاتصال قبل التوصيل بنصف ساعة."
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:border-teal-600"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('list')}
                  className="px-5 h-11 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 h-11 bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white text-sm font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <RefreshCw className="size-4 animate-spin" />
                  ) : (
                    <Check className="size-4" />
                  )}
                  <span>تأكيد وإنشاء الشحنة (شركة الزعيم)</span>
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🌟 Tab 4: All Shipments Table (الشحنات الحقيقية من السيرفر)                 */}
      {/* ========================================================================= */}
      {activeTab === 'list' && (
        <div className="space-y-4">
          {/* Filters & Refresh */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center justify-between">
            <div className="flex flex-1 items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute right-3.5 top-3.5 size-4 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="ابحث برقم الشحنة، اسم المستلم، أو رقم الهاتف..."
                  className="w-full h-11 pr-10 pl-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm outline-none focus:border-teal-600"
                />
              </div>

              <select
                value={selectedGovernorate}
                onChange={(e) => setSelectedGovernorate(e.target.value)}
                className="h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold outline-none"
              >
                <option value="الكل">جميع المحافظات</option>
                {IRAQ_GOVERNORATES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={loadShipmentsFromServer}
                disabled={isLoadingShipments}
                className="h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
              >
                <RefreshCw className={`size-3.5 ${isLoadingShipments ? 'animate-spin text-teal-600' : ''}`} />
                <span>تحديث البيانات</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('create')}
                className="h-11 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
              >
                <Plus className="size-4" />
                <span>إضافة شحنة</span>
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
            {isLoadingShipments ? (
              <div className="py-20 text-center space-y-3">
                <RefreshCw className="size-8 animate-spin text-teal-700 mx-auto" />
                <p className="text-xs text-slate-500 font-bold">جاري جلب الشحنات من سيرفر شركة الزعيم...</p>
              </div>
            ) : filteredShipments.length === 0 ? (
              <div className="py-16 px-4 text-center space-y-3 bg-slate-50/50 dark:bg-slate-800/20">
                <div className="size-12 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 grid place-items-center mx-auto">
                  <Package className="size-6" />
                </div>
                <h3 className="font-extrabold text-slate-800 dark:text-slate-200 text-base">
                  لا توجد شحنات مسجلة بعد
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  لم يتم إصدار أي بوالص شحن بعد في حسابك. يمكنك إنشاء شحنة جديدة يدوياً أو رفع ملف شحنات مجمعة بضغطة زر.
                </p>
                <div className="pt-2 flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('create')}
                    className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
                  >
                    <Plus className="size-3.5" />
                    <span>إضافة شحنة جديدة</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('rates')}
                    className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all"
                  >
                    استعراض الأسعار والتغطية
                  </button>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500">
                    <tr>
                      <th className="p-4">رقم الشحنة (Tracking ID)</th>
                      <th className="p-4">المستلم والتلفون</th>
                      <th className="p-4">المحافظة والعنوان</th>
                      <th className="p-4">مبلغ التحصيل (COD)</th>
                      <th className="p-4">أجور الشحن</th>
                      <th className="p-4">حالة الشحنة</th>
                      <th className="p-4 text-center">إجراءات وبوليصة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredShipments.map((s) => (
                      <tr key={s.id || s.trackingNumber} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="p-4">
                          <button
                            type="button"
                            onClick={() => {
                              setTrackCode(s.trackingNumber);
                              setTrackedShipment(s);
                              setActiveTab('track');
                            }}
                            className="font-mono font-bold text-teal-800 dark:text-teal-400 hover:underline flex items-center gap-1"
                          >
                            <span>{s.trackingNumber}</span>
                            <ChevronRight className="size-3.5" />
                          </button>
                          <span className="text-[10px] text-slate-400 block mt-0.5">{s.date || (s.createdAt ? s.createdAt.split('T')[0] : '')}</span>
                        </td>
                        <td className="p-4">
                          <p className="font-bold text-slate-900 dark:text-white">{s.recipientName}</p>
                          <p className="text-xs text-slate-500 ltr text-right font-mono">{s.recipientPhone}</p>
                        </td>
                        <td className="p-4 text-xs">
                          <span className="font-bold text-slate-800 dark:text-slate-200">{s.governorate}</span> - {s.district}
                          <p className="text-slate-500 truncate max-w-xs">{s.address || s.nearestLandmark}</p>
                        </td>
                        <td className="p-4 font-mono font-bold text-slate-900 dark:text-white">
                          {formatIQD(s.codAmount)}
                        </td>
                        <td className="p-4 font-mono text-xs font-bold text-slate-600 dark:text-slate-400">
                          {formatIQD(s.shippingCost || 5000)}
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${
                              s.status === 'تم التسليم'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : s.status === 'خرجت للتوصيل'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                                : s.status === 'فشل التسليم' || s.status === 'مرتجعة'
                                ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            }`}
                          >
                            {s.status}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handlePrintWaybill(s)}
                              title="طباعة بوليصة الشحن (PDF)"
                              className="px-2.5 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 hover:bg-teal-700 hover:text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer border border-teal-200/60 dark:border-teal-800/60 shadow-sm"
                            >
                              <Printer className="size-3.5" />
                              <span>طباعة البوليصة PDF</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setTrackCode(s.trackingNumber);
                                setTrackedShipment(s);
                                setActiveTab('track');
                              }}
                              title="تتبع الشحنة"
                              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                              <Eye className="size-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
