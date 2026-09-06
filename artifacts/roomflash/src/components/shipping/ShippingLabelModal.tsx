import React, { useState } from 'react';
import { Truck, Printer, X, ShieldCheck, MapPin, Phone, Building2, Check, FileText } from 'lucide-react';
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
 * Standard Thermal & A4 Shipping Label Modal & Isolated Print Component
 * Fully compatible with Thermal Printers (e.g. Xprinter XP-233B, Zebra, Dymo) and Standard A4/PDF.
 */
export const ShippingLabelModal: React.FC<ShippingLabelModalProps> = ({
  shipment,
  storeName = 'متجر الزعيم',
  subdomain = 'alzaeem',
  storePhone = '+964 770 000 0000',
  onClose,
}) => {
  const [printFormat, setPrintFormat] = useState<'thermal' | 'a4'>('thermal');
  const [isPrinting, setIsPrinting] = useState(false);

  if (!shipment) return null;

  const formattedDate = shipment.date || (shipment.createdAt ? shipment.createdAt.split('T')[0] : new Date().toISOString().split('T')[0]);
  const trackingNumber = shipment.trackingNumber || 'ZAEEM-2026-000000';

  /**
   * Direct, Isolated Iframe Printing Function.
   * Completely eliminates blank page bugs caused by global CSS/parent hidden rules.
   */
  const handlePrint = (format: 'thermal' | 'a4' = printFormat) => {
    setIsPrinting(true);
    const cardEl = document.getElementById('print-shipping-card');
    if (!cardEl) {
      window.print();
      setIsPrinting(false);
      return;
    }

    try {
      // Remove any previous print iframes
      const oldIframe = document.getElementById('zaeem-print-iframe');
      if (oldIframe) {
        document.body.removeChild(oldIframe);
      }

      // Create a dedicated hidden iframe
      const iframe = document.createElement('iframe');
      iframe.id = 'zaeem-print-iframe';
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      iframe.style.visibility = 'hidden';
      document.body.appendChild(iframe);

      const doc = iframe.contentWindow?.document;
      if (!doc) {
        window.print();
        setIsPrinting(false);
        return;
      }

      const pageStyle = format === 'a4'
        ? `@page { size: A4 portrait; margin: 12mm 15mm; }`
        : `@page { size: 100mm 150mm; margin: 0; }`;

      const cardWidth = format === 'a4' ? '135mm' : '98mm';
      const cardMargin = format === 'a4' ? '10px auto' : '0 auto';

      const htmlContent = `
        <!DOCTYPE html>
        <html lang="ar" dir="rtl">
        <head>
          <meta charset="utf-8" />
          <title>بوليصة شحن الزعيم - ${trackingNumber}</title>
          <style>
            ${pageStyle}
            * {
              box-sizing: border-box !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            html, body {
              margin: 0 !important;
              padding: ${format === 'a4' ? '8px' : '0'} !important;
              background: #ffffff !important;
              color: #000000 !important;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
              direction: rtl !important;
              text-align: right !important;
              width: 100% !important;
            }
            .shipping-label-card {
              width: ${cardWidth} !important;
              max-width: 100% !important;
              margin: ${cardMargin} !important;
              border: 2px solid #000000 !important;
              border-radius: 4px !important;
              padding: 10px !important;
              background: #ffffff !important;
              color: #000000 !important;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              box-sizing: border-box !important;
            }
            .barcode-box {
              display: flex !important;
              flex-direction: column !important;
              align-items: center !important;
              justify-content: center !important;
              padding: 6px !important;
              background: #ffffff !important;
              border: 1px solid #000000 !important;
              border-radius: 4px !important;
              margin: 6px 0 !important;
            }
            .barcode-box svg {
              max-width: 100% !important;
              height: auto !important;
              display: block !important;
            }
            .grid-cols-2 {
              display: grid !important;
              grid-template-columns: 1fr 1fr !important;
              gap: 8px !important;
            }
            .border-b-2 { border-bottom: 2px solid #000000 !important; }
            .border-2 { border: 2px solid #000000 !important; }
            .border { border: 1px solid #000000 !important; }
            .border-dashed { border-style: dashed !important; }
            .rounded-xl { border-radius: 6px !important; }
            .rounded-lg { border-radius: 4px !important; }
            .p-2 { padding: 6px !important; }
            .p-3 { padding: 8px !important; }
            .p-3\\.5 { padding: 10px !important; }
            .pb-3 { padding-bottom: 8px !important; }
            .mt-1 { margin-top: 4px !important; }
            .text-xs { font-size: 11px !important; }
            .text-sm { font-size: 12px !important; }
            .text-base { font-size: 13px !important; }
            .text-lg { font-size: 15px !important; }
            .text-xl { font-size: 17px !important; }
            .text-2xl { font-size: 20px !important; }
            .text-3xl { font-size: 24px !important; }
            .font-bold { font-weight: 700 !important; }
            .font-black { font-weight: 900 !important; }
            .font-mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace !important; }
            .flex { display: flex !important; }
            .items-center { align-items: center !important; }
            .items-start { align-items: flex-start !important; }
            .justify-between { justify-content: space-between !important; }
            .gap-2 { gap: 6px !important; }
            .gap-2\\.5 { gap: 8px !important; }
            .gap-3 { gap: 10px !important; }
            .shrink-0 { flex-shrink: 0 !important; }
            .bg-slate-50, .bg-slate-900, .bg-slate-950, .bg-white { background: #ffffff !important; }
            .text-white, .text-slate-950, .text-slate-900, .text-slate-800, .text-slate-700, .text-slate-600 { color: #000000 !important; }
          </style>
        </head>
        <body>
          ${cardEl.outerHTML}
        </body>
        </html>
      `;

      doc.open();
      doc.write(htmlContent);
      doc.close();

      setTimeout(() => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        setIsPrinting(false);
      }, 300);
    } catch (err) {
      console.warn('Iframe print fallback to window.print:', err);
      window.print();
      setIsPrinting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-3 sm:p-4 backdrop-blur-md overflow-y-auto animate-fadeIn">
      {/* Modal Dialog Card */}
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-2xl border border-slate-200 text-slate-900 flex flex-col max-h-[92vh] overflow-hidden my-auto">
        
        {/* On-screen Fixed Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3.5 bg-slate-50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-teal-100 text-teal-800 grid place-items-center shadow-xs">
              <Printer className="size-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900">معاينة بوليصة الشحن الرسمية</h3>
              <p className="text-[11px] text-slate-500">جاهزة للطباعة على طابعات الملصقات الحرارية وورق A4 العادي</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-200/60 transition-colors cursor-pointer"
            title="إغلاق"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Scrollable Label Preview Area (Fits perfectly on screen without cutting) */}
        <div className="overflow-y-auto p-4 sm:p-5 rf-scrollbar flex-1 bg-slate-100/70 flex justify-center items-start">
          
          {/* ========================================================================= */}
          {/* OFFICIAL ISOLATED SHIPPING LABEL CONTAINER (#print-shipping-card)         */}
          {/* ========================================================================= */}
          <div
            id="print-shipping-card"
            dir="rtl"
            className="shipping-label-card w-full max-w-[420px] bg-white border-2 border-slate-950 p-4 rounded-2xl text-slate-950 text-right space-y-3 shadow-md"
          >
            {/* 1. Header: Logistics Carrier Info & Tracking ID */}
            <div className="flex items-start justify-between border-b-2 border-slate-950 pb-2.5 gap-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-slate-950 text-white rounded-lg border border-black">
                  <Truck className="size-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black tracking-tight text-slate-950 leading-tight">
                    شركة الزعيم للشحن السريع
                  </h2>
                  <p className="text-[9px] sm:text-[10px] font-bold text-slate-700 font-mono">
                    Al-Zaeem Express Delivery & Logistics Iraq
                  </p>
                  <span className="text-[9px] text-slate-600 block mt-0.5 font-bold">
                    بوليصة شحن رسمية معتمدة لجميع المحافظات
                  </span>
                </div>
              </div>

              <div className="text-left font-mono shrink-0">
                <div className="border border-slate-900 px-2.5 py-1 rounded-lg bg-slate-50 text-right">
                  <span className="text-[8px] block font-bold text-slate-600">رقم البوليصة / Waybill</span>
                  <span className="text-xs font-black tracking-wider text-slate-950">
                    {trackingNumber}
                  </span>
                </div>
                <p className="text-[9px] text-slate-600 mt-0.5 text-left">
                  التاريخ: {formattedDate}
                </p>
              </div>
            </div>

            {/* 2. Crisp Vector Code 128 Barcode */}
            <div className="barcode-box flex flex-col items-center justify-center p-2 bg-white rounded-xl border border-slate-300">
              <Barcode128
                value={trackingNumber}
                height={44}
                width={1.7}
                displayValue={true}
                fontSize={10}
                lineColor="#000000"
                background="#ffffff"
                className="max-w-full"
              />
            </div>

            {/* 3. Sender & Consignee Information */}
            <div className="grid grid-cols-2 gap-2.5 border-b-2 border-slate-950 pb-2.5 text-xs">
              {/* Sender (الراسل / التاجر) */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5">
                <span className="font-bold text-[9px] text-slate-700 uppercase tracking-wider block border-b border-slate-200 pb-0.5">
                  بيانات التاجر / الراسل (SENDER)
                </span>
                <p className="font-black text-slate-950 text-xs leading-tight">{storeName}</p>
                <p className="text-slate-700 font-mono text-[10px]">النطاق: {subdomain}.za3em.shop</p>
                <p className="text-slate-700 font-mono text-[10px] dir-ltr text-right">هاتف: {storePhone}</p>
                <p className="text-slate-600 text-[9px]">الموقع: العراق - بغداد</p>
              </div>

              {/* Consignee (المستلم / الزبون) */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5">
                <span className="font-bold text-[9px] text-slate-700 uppercase tracking-wider block border-b border-slate-200 pb-0.5">
                  بيانات الزبون / المستلم (CONSIGNEE)
                </span>
                <p className="font-black text-slate-950 text-xs leading-tight">{shipment.recipientName}</p>
                <p className="text-slate-950 font-bold font-mono text-[11px] dir-ltr text-right">
                  هاتف: {shipment.recipientPhone}
                </p>
                <p className="text-slate-900 font-bold text-[10px]">
                  {shipment.governorate} — {shipment.district || 'المركز'}
                </p>
                {shipment.nearestLandmark && (
                  <p className="text-slate-700 text-[9px]">النقطة الدالة: {shipment.nearestLandmark}</p>
                )}
                <p className="text-slate-600 text-[9px] line-clamp-2">{shipment.address}</p>
              </div>
            </div>

            {/* 4. Financial & COD Section (الدفع عند الاستلام) */}
            <div className="p-2.5 sm:p-3 rounded-xl border-2 border-dashed border-slate-900 bg-slate-50 flex items-center justify-between gap-2.5">
              <div>
                <span className="text-[11px] font-black text-slate-800 block">
                  المبلغ المطلوب تحصيله نقداً عند الاستلام (COD):
                </span>
                <p className="text-xl sm:text-2xl font-black text-slate-950 font-mono mt-0.5 leading-none">
                  {formatIQD(shipment.codAmount)}
                </p>
                <span className="text-[9px] text-slate-600 font-bold block mt-0.5">
                  شامل أجور الشحن المقررة: {formatIQD(shipment.shippingCost || 5000)}
                </span>
              </div>

              <div className="text-center p-1.5 rounded-lg border border-slate-400 bg-white shrink-0">
                <div className="size-11 rounded border border-slate-900 grid place-items-center mx-auto text-[8px] font-black tracking-tight">
                  QR CODE
                </div>
                <span className="text-[7px] font-bold text-slate-700 mt-0.5 block">تأكيد التسليم</span>
              </div>
            </div>

            {/* 5. Notes & Verification Stamp */}
            <div className="flex items-center justify-between text-xs pt-0.5">
              <div className="max-w-[65%] text-[9px] sm:text-[10px] text-slate-700 leading-tight">
                <strong>ملاحظات الشحنة:</strong> {shipment.notes || 'يرجى الاتصال بالزبون قبل التوصيل وفحص الطرد عند الاستلام.'}
              </div>
              <div className="text-center border-2 border-slate-900 px-2.5 py-0.5 rounded-lg text-slate-950 font-black text-[9px] sm:text-[10px] rotate-[-2deg] shrink-0">
                ✓ معتمد للشحن الفوري - الزعيم
              </div>
            </div>
          </div>
        </div>

        {/* Modal Fixed Footer with Format Switcher & Print Buttons */}
        <div className="px-4 py-3 border-t border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3 shrink-0">
          {/* Format Selector Pills */}
          <div className="flex items-center gap-1.5 bg-slate-200/70 p-1 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setPrintFormat('thermal')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                printFormat === 'thermal'
                  ? 'bg-white text-slate-900 shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              حراري (100x150mm)
            </button>
            <button
              type="button"
              onClick={() => setPrintFormat('a4')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                printFormat === 'a4'
                  ? 'bg-white text-slate-900 shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ورقة A4 عادية
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-white transition-colors cursor-pointer"
            >
              إغلاق
            </button>

            <button
              type="button"
              disabled={isPrinting}
              onClick={() => handlePrint(printFormat)}
              className="px-5 py-2 bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white text-xs font-black rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Printer className="size-4" />
              <span>{isPrinting ? 'جاري التجهيز...' : 'طباعة البوليصة (Print / PDF)'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ShippingLabelModal;
