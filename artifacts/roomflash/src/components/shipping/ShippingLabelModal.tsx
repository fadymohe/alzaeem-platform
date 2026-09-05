import React from 'react';
import { Truck, Printer, X, ShieldCheck, MapPin, Phone, Building2 } from 'lucide-react';
import { Barcode128 } from './Barcode128';
import { formatIQD } from '../../data/iraqData';
import { type CloudShipment } from '../../utils/cloudDb';

export interface ShippingLabelModalProps {
  shipment: CloudShipment | null;
  storeName?: string;
  subdomain?: string;
  storePhone?: string;
  onClose: () => void;
}

/**
 * Standard Thermal Shipping Label Modal & Print Component (100mm x 150mm / 4x6in)
 * Optimized for Thermal Label Printers (e.g., Xprinter XP-233B, Zebra, Dymo).
 */
export const ShippingLabelModal: React.FC<ShippingLabelModalProps> = ({
  shipment,
  storeName = 'متجر الزعيم',
  subdomain = 'alzaeem',
  storePhone = '+964 770 000 0000',
  onClose,
}) => {
  if (!shipment) return null;

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = shipment.date || (shipment.createdAt ? shipment.createdAt.split('T')[0] : new Date().toISOString().split('T')[0]);
  const trackingNumber = shipment.trackingNumber || 'ZAEEM-2026-000000';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white print:static print:inset-auto print:backdrop-blur-none print:overflow-visible">
      {/* Modal Card / Print Container */}
      <div className="max-w-2xl w-full bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 text-slate-900 print:shadow-none print:border-0 print:w-auto print:max-w-none print:p-0 print:m-0 print:rounded-none">
        
        {/* On-screen Header & Controls (Hidden in Print) */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-5 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-teal-50 text-teal-700 grid place-items-center">
              <Printer className="size-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">معاينة بوليصة الشحن الحرارية (100x150mm)</h3>
              <p className="text-xs text-slate-500">جاهزة للطباعة على طابعات الملصقات الحرارية والفواتير (Xprinter / PDF)</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Printer className="size-4" />
              <span>طباعة البوليصة (Print / PDF)</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* OFFICIAL ISOLATED THERMAL SHIPPING LABEL CONTAINER (#print-shipping-card) */}
        {/* ========================================================================= */}
        <div
          id="print-shipping-card"
          dir="rtl"
          className="shipping-label-card bg-white border-2 border-slate-900 p-4 sm:p-5 rounded-2xl text-slate-950 text-right space-y-3.5 print:border-2 print:border-black print:rounded-none print:p-4"
        >
          {/* 1. Header: Logistics Carrier Info & Tracking ID */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-3 gap-2">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-slate-950 text-white rounded-xl print:border print:border-black">
                <Truck className="size-6" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black tracking-tight text-slate-950 leading-tight">
                  شركة الزعيم للشحن السريع
                </h2>
                <p className="text-[10px] sm:text-[11px] font-bold text-slate-700 font-mono">
                  Al-Zaeem Express Delivery & Logistics Iraq
                </p>
                <span className="text-[10px] text-slate-600 block mt-0.5">
                  بوليصة شحن رسمية معتمدة لجميع محافظات العراق
                </span>
              </div>
            </div>

            <div className="text-left font-mono shrink-0">
              <div className="border border-slate-900 px-3 py-1 rounded-lg bg-slate-50 text-right">
                <span className="text-[9px] block font-bold text-slate-600">رقم البوليصة / Waybill</span>
                <span className="text-xs sm:text-sm font-black tracking-wider text-slate-950">
                  {trackingNumber}
                </span>
              </div>
              <p className="text-[10px] text-slate-600 mt-1 text-left">
                التاريخ: {formattedDate}
              </p>
            </div>
          </div>

          {/* 2. Crisp Vector Code 128 Barcode (No Broken Lines) */}
          <div className="barcode-box flex flex-col items-center justify-center p-2.5 bg-white rounded-xl border border-slate-300 print:border-black print:p-2">
            <Barcode128
              value={trackingNumber}
              height={48}
              width={1.8}
              displayValue={true}
              fontSize={11}
              lineColor="#000000"
              background="#ffffff"
              className="max-w-full"
            />
          </div>

          {/* 3. Sender & Consignee Information */}
          <div className="grid grid-cols-2 gap-3 border-b-2 border-slate-900 pb-3 text-xs">
            {/* Sender (الراسل / التاجر) */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1 print:bg-white print:border-black">
              <span className="font-bold text-[10px] text-slate-700 uppercase tracking-wider block border-b border-slate-200 print:border-black pb-1">
                بيانات التاجر / الراسل (SENDER)
              </span>
              <p className="font-black text-slate-950 text-xs sm:text-sm leading-tight">{storeName}</p>
              <p className="text-slate-700 font-mono text-[11px]">النطاق: {subdomain}.za3em.shop</p>
              <p className="text-slate-700 font-mono text-[11px] dir-ltr text-right">هاتف: {storePhone}</p>
              <p className="text-slate-600 text-[10px]">الموقع: العراق - بغداد</p>
            </div>

            {/* Consignee (المستلم / الزبون) */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1 print:bg-white print:border-black">
              <span className="font-bold text-[10px] text-slate-700 uppercase tracking-wider block border-b border-slate-200 print:border-black pb-1">
                بيانات الزبون / المستلم (CONSIGNEE)
              </span>
              <p className="font-black text-slate-950 text-xs sm:text-sm leading-tight">{shipment.recipientName}</p>
              <p className="text-slate-950 font-bold font-mono text-xs dir-ltr text-right">
                هاتف: {shipment.recipientPhone}
              </p>
              <p className="text-slate-900 font-bold text-[11px]">
                {shipment.governorate} — {shipment.district || 'المركز'}
              </p>
              {shipment.nearestLandmark && (
                <p className="text-slate-700 text-[10px]">النقطة الدالة: {shipment.nearestLandmark}</p>
              )}
              <p className="text-slate-600 text-[10px] line-clamp-2">{shipment.address}</p>
            </div>
          </div>

          {/* 4. Financial & COD Section (الدفع عند الاستلام) */}
          <div className="p-3.5 rounded-xl border-2 border-dashed border-slate-900 bg-slate-50 flex items-center justify-between gap-3 print:bg-white print:border-black">
            <div>
              <span className="text-xs font-black text-slate-800 block">
                المبلغ المطلوب تحصيله نقداً عند الاستلام (COD):
              </span>
              <p className="text-2xl sm:text-3xl font-black text-slate-950 font-mono mt-0.5 leading-none">
                {formatIQD(shipment.codAmount)}
              </p>
              <span className="text-[10px] text-slate-600 font-bold block mt-1">
                شامل أجور الشحن المقررة: {formatIQD(shipment.shippingCost || 5000)}
              </span>
            </div>

            <div className="text-center p-2 rounded-lg border border-slate-400 bg-white print:border-black shrink-0">
              <div className="size-14 rounded-md border border-slate-900 grid place-items-center mx-auto text-[9px] font-black tracking-tight print:border-black">
                QR CODE
              </div>
              <span className="text-[8px] font-bold text-slate-700 mt-1 block">تأكيد التسليم</span>
            </div>
          </div>

          {/* 5. Notes & Verification Stamp */}
          <div className="flex items-center justify-between text-xs pt-1">
            <div className="max-w-[65%] text-[10px] sm:text-[11px] text-slate-700 leading-tight">
              <strong>ملاحظات الشحنة:</strong> {shipment.notes || 'يرجى الاتصال بالزبون قبل التوصيل وفحص الطرد عند الاستلام.'}
            </div>
            <div className="text-center border-2 border-slate-900 px-3 py-1 rounded-lg text-slate-950 font-black text-[10px] sm:text-xs rotate-[-2deg] shrink-0 print:border-black">
              ✓ معتمد للشحن الفوري - الزعيم
            </div>
          </div>
        </div>

        {/* Print & Close Action Buttons at bottom of modal */}
        <div className="mt-5 flex justify-end gap-3 print:hidden">
          <button
            type="button"
            onClick={onClose}
            className="px-5 h-11 rounded-xl border border-slate-300 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            إغلاق
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-6 h-11 bg-teal-700 hover:bg-teal-800 text-white text-sm font-bold rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer"
          >
            <Printer className="size-4" />
            <span>طباعة البوليصة (Print / PDF)</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default ShippingLabelModal;
