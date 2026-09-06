import React, { useState } from 'react';
import { Truck, Printer, X, MapPin, Phone, Building2, Check, FileText, QrCode, Package, Layers } from 'lucide-react';
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

export type PrintFormatType = 'thermal' | 'a4-full' | 'a4-double';

/**
 * Standard Thermal & A4 Shipping Label Modal & Isolated Print Component
 * - 'thermal': Strictly single-page 100x150mm / 80mm barcode label (XP-233B, Zebra, Dymo) - zero overflow onto page 2.
 * - 'a4-full': Full-page official A4 waybill & manifest with complete itemization and signatures.
 * - 'a4-double': 2 identical waybill copies on 1 A4 page (Merchant Copy + Courier Copy).
 */
export const ShippingLabelModal: React.FC<ShippingLabelModalProps> = ({
  shipment,
  storeName = 'متجر الزعيم',
  subdomain = 'alzaeem',
  storePhone = '+964 770 000 0000',
  onClose,
}) => {
  const [printFormat, setPrintFormat] = useState<PrintFormatType>('thermal');
  const [isPrinting, setIsPrinting] = useState(false);

  if (!shipment) return null;

  const formattedDate = shipment.date || (shipment.createdAt ? shipment.createdAt.split('T')[0] : new Date().toISOString().split('T')[0]);
  const trackingNumber = shipment.trackingNumber || 'ZAEEM-2026-000000';

  /**
   * Generates clean HTML for isolated iframe printing based on selected format
   */
  const getPrintHtml = (format: PrintFormatType) => {
    // Thermal format: strictly 100x150mm single page with zero margins and overflow prevention
    if (format === 'thermal') {
      return `
        <!DOCTYPE html>
        <html lang="ar" dir="rtl">
        <head>
          <meta charset="utf-8" />
          <title>بوليصة شحن حرارية - ${trackingNumber}</title>
          <style>
            @page {
              size: 100mm 150mm;
              margin: 0mm;
            }
            * {
              box-sizing: border-box !important;
              margin: 0;
              padding: 0;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            html, body {
              width: 100mm !important;
              height: 148mm !important;
              max-height: 148mm !important;
              overflow: hidden !important;
              background: #ffffff !important;
              color: #000000 !important;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
              direction: rtl !important;
              text-align: right !important;
              page-break-inside: avoid !important;
              page-break-after: avoid !important;
              page-break-before: avoid !important;
            }
            .label-wrapper {
              width: 96mm !important;
              height: 144mm !important;
              max-height: 144mm !important;
              margin: 2mm auto !important;
              padding: 3mm !important;
              border: 2px solid #000000 !important;
              border-radius: 4px !important;
              display: flex !important;
              flex-direction: column !important;
              justify-content: space-between !important;
              overflow: hidden !important;
              background: #ffffff !important;
              box-sizing: border-box !important;
            }
            .header-row {
              display: flex !important;
              justify-content: space-between !important;
              align-items: flex-start !important;
              border-bottom: 2px solid #000000 !important;
              padding-bottom: 2mm !important;
            }
            .title-main { font-size: 13px !important; font-weight: 900 !important; line-height: 1.1 !important; }
            .title-sub { font-size: 8px !important; font-weight: 700 !important; font-family: monospace !important; }
            .title-badge { font-size: 8px !important; font-weight: bold !important; color: #333333 !important; }
            .waybill-box {
              border: 1px solid #000000 !important;
              padding: 1mm 2mm !important;
              border-radius: 3px !important;
              text-align: center !important;
            }
            .waybill-lbl { font-size: 7px !important; font-weight: bold !important; display: block !important; }
            .waybill-val { font-size: 10px !important; font-weight: 900 !important; font-family: monospace !important; letter-spacing: 0.5px !important; }
            .waybill-date { font-size: 8px !important; margin-top: 1mm !important; }
            
            .barcode-container {
              display: flex !important;
              flex-direction: column !important;
              align-items: center !important;
              justify-content: center !important;
              padding: 1.5mm !important;
              border: 1px solid #000000 !important;
              border-radius: 3px !important;
              background: #ffffff !important;
            }
            .barcode-container svg {
              max-width: 90mm !important;
              height: 38px !important;
              display: block !important;
            }

            .info-grid {
              display: grid !important;
              grid-template-columns: 1fr 1fr !important;
              gap: 2mm !important;
              border-bottom: 2px solid #000000 !important;
              padding-bottom: 2mm !important;
            }
            .info-card {
              border: 1px solid #000000 !important;
              border-radius: 3px !important;
              padding: 1.5mm 2mm !important;
              background: #ffffff !important;
            }
            .info-head {
              font-size: 8px !important;
              font-weight: 900 !important;
              border-bottom: 1px dashed #666666 !important;
              padding-bottom: 0.5mm !important;
              margin-bottom: 1mm !important;
              display: block !important;
            }
            .info-name { font-size: 11px !important; font-weight: 900 !important; margin-bottom: 0.5mm !important; line-height: 1.1 !important; }
            .info-text { font-size: 9px !important; font-weight: 700 !important; line-height: 1.2 !important; }
            .info-sub { font-size: 8px !important; color: #333333 !important; }

            .cod-section {
              border: 2px dashed #000000 !important;
              border-radius: 4px !important;
              padding: 2mm !important;
              display: flex !important;
              justify-content: space-between !important;
              align-items: center !important;
              background: #ffffff !important;
            }
            .cod-label { font-size: 9px !important; font-weight: 900 !important; display: block !important; }
            .cod-amount { font-size: 18px !important; font-weight: 900 !important; font-family: monospace !important; line-height: 1 !important; margin: 1mm 0 !important; }
            .cod-shipping { font-size: 8px !important; font-weight: bold !important; color: #444444 !important; }
            
            .qr-box {
              width: 14mm !important;
              height: 14mm !important;
              border: 1px solid #000000 !important;
              border-radius: 3px !important;
              display: flex !important;
              flex-direction: column !important;
              align-items: center !important;
              justify-content: center !important;
              text-align: center !important;
            }
            .qr-text { font-size: 6px !important; font-weight: 900 !important; }

            .footer-row {
              display: flex !important;
              justify-content: space-between !important;
              align-items: center !important;
              font-size: 8px !important;
              line-height: 1.1 !important;
            }
            .notes-text { font-size: 8px !important; max-width: 65mm !important; }
            .stamp-box {
              border: 1.5px solid #000000 !important;
              padding: 0.5mm 1.5mm !important;
              border-radius: 3px !important;
              font-weight: 900 !important;
              font-size: 8px !important;
              white-space: nowrap !important;
            }
          </style>
        </head>
        <body>
          <div class="label-wrapper">
            <!-- Header -->
            <div class="header-row">
              <div>
                <div class="title-main">شركة الزعيم للشحن السريع</div>
                <div class="title-sub">Al-Zaeem Express Delivery & Logistics</div>
                <div class="title-badge">بوليصة شحن رسمية معتمدة لجميع المحافظات</div>
              </div>
              <div class="waybill-box">
                <span class="waybill-lbl">رقم البوليصة / Waybill</span>
                <span class="waybill-val">${trackingNumber}</span>
                <div class="waybill-date">التاريخ: ${formattedDate}</div>
              </div>
            </div>

            <!-- Barcode -->
            <div class="barcode-container">
              ${document.getElementById('barcode-svg-element')?.outerHTML || ''}
            </div>

            <!-- Sender & Consignee -->
            <div class="info-grid">
              <!-- Sender -->
              <div class="info-card">
                <span class="info-head">التاجر / الراسل (SENDER)</span>
                <div class="info-name">${storeName}</div>
                <div class="info-text">${subdomain}.za3em.shop</div>
                <div class="info-text" dir="ltr">${storePhone}</div>
                <div class="info-sub">العراق - بغداد</div>
              </div>
              <!-- Consignee -->
              <div class="info-card">
                <span class="info-head">الزبون / المستلم (CONSIGNEE)</span>
                <div class="info-name">${shipment.recipientName}</div>
                <div class="info-text" dir="ltr">${shipment.recipientPhone}</div>
                <div class="info-text">${shipment.governorate} — ${shipment.district || 'المركز'}</div>
                ${shipment.nearestLandmark ? `<div class="info-sub">دالة: ${shipment.nearestLandmark}</div>` : ''}
                <div class="info-sub">${shipment.address}</div>
              </div>
            </div>

            <!-- Financial COD -->
            <div class="cod-section">
              <div>
                <span class="cod-label">المبلغ المطلوب تحصيله نقداً عند الاستلام (COD):</span>
                <div class="cod-amount">${formatIQD(shipment.codAmount)}</div>
                <div class="cod-shipping">شامل أجور الشحن: ${formatIQD(shipment.shippingCost || 5000)}</div>
              </div>
              <div class="qr-box">
                <div class="qr-text">QR SCAN</div>
                <div class="qr-text">تأكيد التسليم</div>
              </div>
            </div>

            <!-- Footer -->
            <div class="footer-row">
              <div class="notes-text">
                <strong>ملاحظات:</strong> ${shipment.notes || 'يرجى الاتصال بالزبون قبل التوصيل وفحص الطرد عند الاستلام.'}
              </div>
              <div class="stamp-box">
                ✓ معتمد للشحن الفوري
              </div>
            </div>
          </div>
        </body>
        </html>
      `;
    }

    // A4 Full Page Waybill & Manifest Layout (Fills standard A4 210x297mm perfectly)
    if (format === 'a4-full') {
      return `
        <!DOCTYPE html>
        <html lang="ar" dir="rtl">
        <head>
          <meta charset="utf-8" />
          <title>بوليصة شحن رسمية A4 - ${trackingNumber}</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 10mm 12mm;
            }
            * {
              box-sizing: border-box !important;
              margin: 0;
              padding: 0;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            html, body {
              width: 100% !important;
              background: #ffffff !important;
              color: #000000 !important;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
              direction: rtl !important;
              text-align: right !important;
            }
            .a4-container {
              width: 100% !important;
              max-width: 186mm !important;
              margin: 0 auto !important;
              border: 2.5px solid #000000 !important;
              border-radius: 8px !important;
              padding: 6mm 7mm !important;
              display: flex !important;
              flex-direction: column !important;
              gap: 4mm !important;
              background: #ffffff !important;
            }
            .a4-header {
              display: flex !important;
              justify-content: space-between !important;
              align-items: center !important;
              border-bottom: 2.5px solid #000000 !important;
              padding-bottom: 3.5mm !important;
            }
            .a4-title-main { font-size: 20px !important; font-weight: 900 !important; }
            .a4-title-sub { font-size: 11px !important; font-weight: 700 !important; font-family: monospace !important; color: #222222 !important; }
            .a4-title-badge { font-size: 10px !important; font-weight: bold !important; color: #444444 !important; }
            
            .a4-waybill-card {
              border: 2px solid #000000 !important;
              border-radius: 6px !important;
              padding: 2mm 4mm !important;
              text-align: center !important;
              background: #f8fafc !important;
            }
            .a4-waybill-lbl { font-size: 9px !important; font-weight: bold !important; display: block !important; }
            .a4-waybill-num { font-size: 14px !important; font-weight: 900 !important; font-family: monospace !important; letter-spacing: 1px !important; }
            .a4-waybill-date { font-size: 9px !important; margin-top: 1mm !important; font-weight: bold !important; }

            .a4-barcode-section {
              display: flex !important;
              flex-direction: column !important;
              align-items: center !important;
              justify-content: center !important;
              padding: 3mm !important;
              border: 1.5px solid #000000 !important;
              border-radius: 6px !important;
              background: #ffffff !important;
            }
            .a4-barcode-section svg {
              max-width: 140mm !important;
              height: 48px !important;
            }

            .a4-parties-grid {
              display: grid !important;
              grid-template-columns: 1fr 1fr !important;
              gap: 4mm !important;
            }
            .a4-party-box {
              border: 1.5px solid #000000 !important;
              border-radius: 6px !important;
              padding: 3.5mm !important;
              background: #fdfdfd !important;
            }
            .a4-party-head {
              font-size: 11px !important;
              font-weight: 900 !important;
              border-bottom: 1.5px solid #000000 !important;
              padding-bottom: 1.5mm !important;
              margin-bottom: 2mm !important;
              display: flex !important;
              justify-content: space-between !important;
            }
            .a4-party-name { font-size: 14px !important; font-weight: 900 !important; margin-bottom: 1mm !important; }
            .a4-party-line { font-size: 11px !important; font-weight: 700 !important; margin-bottom: 1mm !important; }
            .a4-party-sub { font-size: 10px !important; color: #333333 !important; }

            .a4-table {
              width: 100% !important;
              border-collapse: collapse !important;
              border: 1.5px solid #000000 !important;
              border-radius: 6px !important;
              overflow: hidden !important;
              margin: 1mm 0 !important;
            }
            .a4-table th {
              background: #000000 !important;
              color: #ffffff !important;
              font-size: 10px !important;
              font-weight: 900 !important;
              padding: 2.5mm !important;
              text-align: right !important;
              border: 1px solid #000000 !important;
            }
            .a4-table td {
              font-size: 11px !important;
              font-weight: 700 !important;
              padding: 2.5mm !important;
              border: 1px solid #000000 !important;
              background: #ffffff !important;
            }

            .a4-cod-banner {
              border: 2.5px dashed #000000 !important;
              border-radius: 8px !important;
              padding: 4mm 5mm !important;
              display: flex !important;
              justify-content: space-between !important;
              align-items: center !important;
              background: #fafafa !important;
            }
            .a4-cod-title { font-size: 12px !important; font-weight: 900 !important; }
            .a4-cod-val { font-size: 24px !important; font-weight: 900 !important; font-family: monospace !important; margin: 1mm 0 !important; }
            .a4-cod-note { font-size: 10px !important; font-weight: bold !important; color: #444444 !important; }

            .a4-signatures-grid {
              display: grid !important;
              grid-template-columns: 1fr 1fr !important;
              gap: 4mm !important;
              margin-top: 1mm !important;
            }
            .a4-sig-box {
              border: 1px solid #000000 !important;
              border-radius: 6px !important;
              padding: 2.5mm 3.5mm !important;
              height: 22mm !important;
              display: flex !important;
              flex-direction: column !important;
              justify-content: space-between !important;
            }
            .a4-sig-title { font-size: 9px !important; font-weight: 900 !important; }
            .a4-sig-line { border-bottom: 1px dashed #666666 !important; margin-top: auto !important; }
            
            .a4-footer-notes {
              border-top: 1.5px solid #000000 !important;
              padding-top: 2.5mm !important;
              display: flex !important;
              justify-content: space-between !important;
              align-items: center !important;
              font-size: 9px !important;
              font-weight: 600 !important;
            }
          </style>
        </head>
        <body>
          <div class="a4-container">
            <!-- Header -->
            <div class="a4-header">
              <div>
                <h1 class="a4-title-main">شركة الزعيم للشحن السريع واللوجستيات</h1>
                <p class="a4-title-sub">Al-Zaeem Express Delivery & Logistics Network Iraq</p>
                <span class="a4-title-badge">بوليصة شحن وتوصيل رسمية معتمدة لكافة المحافظات العراقية</span>
              </div>
              <div class="a4-waybill-card">
                <span class="a4-waybill-lbl">رقم البوليصة / Waybill No.</span>
                <span class="a4-waybill-num">${trackingNumber}</span>
                <div class="a4-waybill-date">تاريخ الإصدار: ${formattedDate}</div>
              </div>
            </div>

            <!-- Barcode 128 -->
            <div class="a4-barcode-section">
              ${document.getElementById('barcode-svg-element')?.outerHTML || ''}
            </div>

            <!-- Sender & Consignee Parties -->
            <div class="a4-parties-grid">
              <!-- Sender -->
              <div class="a4-party-box">
                <div class="a4-party-head">
                  <span>بيانات التاجر / الراسل (SENDER)</span>
                  <span>معتمد ✓</span>
                </div>
                <div class="a4-party-name">${storeName}</div>
                <div class="a4-party-line">المتجر: ${subdomain}.za3em.shop</div>
                <div class="a4-party-line" dir="ltr">هاتف: ${storePhone}</div>
                <div class="a4-party-sub">مركز الشحن: العراق - بغداد</div>
              </div>

              <!-- Consignee -->
              <div class="a4-party-box">
                <div class="a4-party-head">
                  <span>بيانات الزبون / المستلم (CONSIGNEE)</span>
                  <span>شحن مباشر</span>
                </div>
                <div class="a4-party-name">${shipment.recipientName}</div>
                <div class="a4-party-line" dir="ltr">هاتف: ${shipment.recipientPhone}</div>
                <div class="a4-party-line">${shipment.governorate} — ${shipment.district || 'المركز'}</div>
                ${shipment.nearestLandmark ? `<div class="a4-party-sub">النقطة الدالة: ${shipment.nearestLandmark}</div>` : ''}
                <div class="a4-party-sub">العنوان: ${shipment.address}</div>
              </div>
            </div>

            <!-- Shipment Details Table -->
            <table class="a4-table">
              <thead>
                <tr>
                  <th>وصف الشحنة والمحتوى</th>
                  <th>عدد الطرود</th>
                  <th>نوع الخدمة</th>
                  <th>طريقة الدفع</th>
                  <th>أجور التوصيل</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>بضاعة تجارة إلكترونية — طلبية متجر (${storeName})</td>
                  <td>1 طرد مغلق</td>
                  <td>توصيل باب لباب (Express)</td>
                  <td>الدفع نقداً عند الاستلام (COD)</td>
                  <td>${formatIQD(shipment.shippingCost || 5000)}</td>
                </tr>
              </tbody>
            </table>

            <!-- Financial COD Banner -->
            <div class="a4-cod-banner">
              <div>
                <div class="a4-cod-title">المبلغ الإجمالي المطلوب تحصيله نقداً عند الاستلام (COD):</div>
                <div class="a4-cod-val">${formatIQD(shipment.codAmount)}</div>
                <div class="a4-cod-note">شامل أجور الشحن المقررة: ${formatIQD(shipment.shippingCost || 5000)} — يرجى تسليم الوصل للزبون</div>
              </div>
              <div style="text-align: center; border: 1.5px solid #000; padding: 2mm 3mm; border-radius: 6px; background: #fff;">
                <div style="font-size: 11px; font-weight: 900;">QR CODE</div>
                <div style="font-size: 8px; font-weight: bold; margin-top: 1mm;">مسح تأكيد التسليم</div>
              </div>
            </div>

            <!-- Signatures -->
            <div class="a4-signatures-grid">
              <div class="a4-sig-box">
                <span class="a4-sig-title">توقيع واستلام الزبون (Customer Signature):</span>
                <div class="a4-sig-line"></div>
              </div>
              <div class="a4-sig-box">
                <span class="a4-sig-title">توقيع وختم مندوب شركة الزعيم (Courier Stamp):</span>
                <div class="a4-sig-line"></div>
              </div>
            </div>

            <!-- Footer Notes -->
            <div class="a4-footer-notes">
              <div>
                <strong>ملاحظات الشحنة:</strong> ${shipment.notes || 'يرجى الاتصال بالزبون قبل التوصيل وفحص الطرد عند الاستلام.'}
              </div>
              <div style="font-weight: 900;">
                شركة الزعيم — بغداد — خدمة العملاء: 07700000000
              </div>
            </div>
          </div>
        </body>
        </html>
      `;
    }

    // A4 Double (2 labels on 1 A4 page: Merchant Copy & Carrier Copy)
    return `
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
      <head>
        <meta charset="utf-8" />
        <title>بوليصة شحن A4 (نسختان) - ${trackingNumber}</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 8mm 10mm;
          }
          * {
            box-sizing: border-box !important;
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          html, body {
            width: 100% !important;
            background: #ffffff !important;
            color: #000000 !important;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
            direction: rtl !important;
            text-align: right !important;
          }
          .double-wrapper {
            display: flex !important;
            flex-direction: column !important;
            gap: 6mm !important;
          }
          .half-card {
            border: 2px solid #000000 !important;
            border-radius: 6px !important;
            padding: 4mm 5mm !important;
            display: flex !important;
            flex-direction: column !important;
            gap: 2.5mm !important;
            page-break-inside: avoid !important;
          }
          .cut-line {
            border-bottom: 1.5px dashed #666666 !important;
            text-align: center !important;
            position: relative !important;
            margin: 1mm 0 !important;
          }
          .cut-text {
            background: #fff !important;
            padding: 0 4mm !important;
            font-size: 9px !important;
            color: #666 !important;
            position: absolute !important;
            top: -6px !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
          }
        </style>
      </head>
      <body>
        <div class="double-wrapper">
          <!-- Copy 1: Merchant & Courier Copy -->
          <div class="half-card">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #000; padding-bottom: 2mm;">
              <div>
                <strong style="font-size: 15px;">شركة الزعيم للشحن السريع</strong>
                <span style="font-size: 9px; font-weight: bold; color: #444; margin-right: 2mm;">(نسخة شركة الشحن والمندوب)</span>
              </div>
              <div style="border: 1px solid #000; padding: 1mm 3mm; border-radius: 4px; font-family: monospace; font-size: 11px; font-weight: 900;">
                ${trackingNumber}
              </div>
            </div>
            <div style="display: flex; justify-content: center;">
              ${document.getElementById('barcode-svg-element')?.outerHTML || ''}
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 3mm; font-size: 10px;">
              <div style="border: 1px solid #000; padding: 2mm; border-radius: 4px;">
                <strong>التاجر:</strong> ${storeName} (${storePhone})<br/>
                <strong>النطاق:</strong> ${subdomain}.za3em.shop
              </div>
              <div style="border: 1px solid #000; padding: 2mm; border-radius: 4px;">
                <strong>المستلم:</strong> ${shipment.recipientName} (${shipment.recipientPhone})<br/>
                <strong>العنوان:</strong> ${shipment.governorate} — ${shipment.district || 'المركز'} (${shipment.address})
              </div>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; border: 2px dashed #000; padding: 2.5mm; border-radius: 4px;">
              <div>
                <strong style="font-size: 11px;">المبلغ المطلوب تحصيله (COD):</strong>
                <span style="font-size: 18px; font-weight: 900; font-family: monospace; margin-right: 2mm;">${formatIQD(shipment.codAmount)}</span>
              </div>
              <div style="font-size: 9px; font-weight: bold;">شامل الشحن: ${formatIQD(shipment.shippingCost || 5000)}</div>
            </div>
          </div>

          <!-- Cut separator -->
          <div class="cut-line"><span class="cut-text">✂ قص الورقة من هنا (نسختان)</span></div>

          <!-- Copy 2: Customer Copy -->
          <div class="half-card">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #000; padding-bottom: 2mm;">
              <div>
                <strong style="font-size: 15px;">شركة الزعيم للشحن السريع</strong>
                <span style="font-size: 9px; font-weight: bold; color: #444; margin-right: 2mm;">(وصل استلام الزبون)</span>
              </div>
              <div style="border: 1px solid #000; padding: 1mm 3mm; border-radius: 4px; font-family: monospace; font-size: 11px; font-weight: 900;">
                ${trackingNumber}
              </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 3mm; font-size: 10px;">
              <div style="border: 1px solid #000; padding: 2mm; border-radius: 4px;">
                <strong>التاجر:</strong> ${storeName} (${storePhone})<br/>
                <strong>المتجر الإلكتروني:</strong> ${subdomain}.za3em.shop
              </div>
              <div style="border: 1px solid #000; padding: 2mm; border-radius: 4px;">
                <strong>المستلم:</strong> ${shipment.recipientName} (${shipment.recipientPhone})<br/>
                <strong>العنوان:</strong> ${shipment.governorate} — ${shipment.district || 'المركز'}
              </div>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; border: 2px dashed #000; padding: 2.5mm; border-radius: 4px;">
              <div>
                <strong style="font-size: 11px;">المبلغ المسدد نقداً (COD):</strong>
                <span style="font-size: 18px; font-weight: 900; font-family: monospace; margin-right: 2mm;">${formatIQD(shipment.codAmount)}</span>
              </div>
              <div style="font-size: 9px; font-weight: bold;">تاريخ التسليم: ${formattedDate}</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  /**
   * Direct, Isolated Iframe Printing Function.
   * Completely eliminates blank page bugs and multi-page thermal overflowing.
   */
  const handlePrint = (format: PrintFormatType = printFormat) => {
    setIsPrinting(true);

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

      const htmlContent = getPrintHtml(format);

      doc.open();
      doc.write(htmlContent);
      doc.close();

      setTimeout(() => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        setIsPrinting(false);
      }, 350);
    } catch (err) {
      console.warn('Iframe print fallback to window.print:', err);
      window.print();
      setIsPrinting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-3 sm:p-4 backdrop-blur-md overflow-y-auto animate-fadeIn">
      {/* Hidden Master Barcode for Extraction into Iframe */}
      <div className="hidden" aria-hidden="true">
        <div id="barcode-svg-element">
          <Barcode128
            value={trackingNumber}
            height={42}
            width={1.7}
            displayValue={true}
            fontSize={11}
            lineColor="#000000"
            background="#ffffff"
          />
        </div>
      </div>

      {/* Modal Dialog Card */}
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl border border-slate-200 text-slate-900 flex flex-col max-h-[92vh] overflow-hidden my-auto">
        
        {/* On-screen Fixed Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3.5 bg-slate-50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-teal-100 text-teal-800 grid place-items-center shadow-xs">
              <Printer className="size-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900">معاينة بوليصة الشحن الرسمية</h3>
              <p className="text-[11px] text-slate-500">طباعة حرارية دقيقة (ورقة واحدة بدون قص) ومقاس A4 رسمي</p>
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

        {/* Scrollable Label Preview Area (Reflects chosen print format) */}
        <div className="overflow-y-auto p-4 sm:p-6 rf-scrollbar flex-1 bg-slate-100/70 flex justify-center items-start">
          
          {/* ========================================================================= */}
          {/* 1. THERMAL PREVIEW (100x150mm XP-233B)                                   */}
          {/* ========================================================================= */}
          {printFormat === 'thermal' && (
            <div className="w-full max-w-[390px] bg-white border-2 border-slate-950 p-3.5 rounded-xl text-slate-950 text-right space-y-2.5 shadow-md">
              <div className="flex items-start justify-between border-b-2 border-slate-950 pb-2 gap-2">
                <div>
                  <h2 className="text-sm font-black tracking-tight text-slate-950 leading-tight">
                    شركة الزعيم للشحن السريع
                  </h2>
                  <p className="text-[8px] font-bold text-slate-700 font-mono">
                    Al-Zaeem Express Delivery & Logistics Iraq
                  </p>
                  <span className="text-[8px] text-slate-600 block mt-0.5 font-bold">
                    بوليصة شحن معتمدة لجميع المحافظات
                  </span>
                </div>
                <div className="border border-slate-900 px-2 py-0.5 rounded bg-slate-50 text-center shrink-0">
                  <span className="text-[7px] block font-bold text-slate-600">رقم البوليصة</span>
                  <span className="text-[11px] font-black font-mono text-slate-950">{trackingNumber}</span>
                  <div className="text-[8px] text-slate-600">{formattedDate}</div>
                </div>
              </div>

              {/* Barcode */}
              <div className="flex flex-col items-center justify-center p-1.5 bg-white rounded border border-slate-300">
                <Barcode128
                  value={trackingNumber}
                  height={38}
                  width={1.6}
                  displayValue={true}
                  fontSize={10}
                  lineColor="#000000"
                  background="#ffffff"
                />
              </div>

              {/* Sender & Consignee */}
              <div className="grid grid-cols-2 gap-2 border-b-2 border-slate-950 pb-2 text-[10px]">
                <div className="p-2 rounded bg-slate-50 border border-slate-200 space-y-0.5">
                  <span className="font-bold text-[8px] text-slate-700 block border-b border-slate-200 pb-0.5">
                    الراسل (SENDER)
                  </span>
                  <p className="font-black text-slate-950 text-[11px] leading-tight">{storeName}</p>
                  <p className="text-slate-700 font-mono text-[9px]">{subdomain}.za3em.shop</p>
                  <p className="text-slate-700 font-mono text-[9px]" dir="ltr">{storePhone}</p>
                  <p className="text-slate-600 text-[8px]">العراق - بغداد</p>
                </div>

                <div className="p-2 rounded bg-slate-50 border border-slate-200 space-y-0.5">
                  <span className="font-bold text-[8px] text-slate-700 block border-b border-slate-200 pb-0.5">
                    المستلم (CONSIGNEE)
                  </span>
                  <p className="font-black text-slate-950 text-[11px] leading-tight">{shipment.recipientName}</p>
                  <p className="text-slate-950 font-bold font-mono text-[10px]" dir="ltr">{shipment.recipientPhone}</p>
                  <p className="text-slate-900 font-bold text-[9px]">{shipment.governorate} — {shipment.district || 'المركز'}</p>
                  {shipment.nearestLandmark && <p className="text-slate-700 text-[8px]">دالة: {shipment.nearestLandmark}</p>}
                  <p className="text-slate-600 text-[8px] line-clamp-1">{shipment.address}</p>
                </div>
              </div>

              {/* Financial COD */}
              <div className="p-2 rounded-lg border-2 border-dashed border-slate-900 bg-slate-50 flex items-center justify-between gap-2">
                <div>
                  <span className="text-[9px] font-black text-slate-800 block">
                    المبلغ المطلوب تحصيله نقداً (COD):
                  </span>
                  <p className="text-lg font-black text-slate-950 font-mono mt-0.5 leading-none">
                    {formatIQD(shipment.codAmount)}
                  </p>
                  <span className="text-[8px] text-slate-600 font-bold block mt-0.5">
                    شامل الشحن: {formatIQD(shipment.shippingCost || 5000)}
                  </span>
                </div>
                <div className="size-10 rounded border border-slate-900 grid place-items-center text-center p-1 bg-white shrink-0">
                  <span className="text-[7px] font-black leading-tight">QR CODE</span>
                  <span className="text-[6px] font-bold text-slate-600">تأكيد</span>
                </div>
              </div>

              {/* Notes & Stamp */}
              <div className="flex items-center justify-between text-[9px]">
                <div className="max-w-[70%] text-slate-700 leading-tight">
                  <strong>ملاحظات:</strong> {shipment.notes || 'يرجى الاتصال بالزبون قبل التوصيل وفحص الطرد.'}
                </div>
                <div className="border border-slate-900 px-1.5 py-0.5 rounded text-slate-950 font-black text-[8px] shrink-0">
                  ✓ شحن فوري
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 2. FULL A4 PREVIEW                                                        */}
          {/* ========================================================================= */}
          {printFormat === 'a4-full' && (
            <div className="w-full max-w-[540px] bg-white border-2 border-slate-950 p-5 rounded-2xl text-slate-950 text-right space-y-3.5 shadow-md">
              <div className="flex items-center justify-between border-b-2 border-slate-950 pb-3">
                <div>
                  <h2 className="text-base font-black text-slate-950">شركة الزعيم للشحن السريع واللوجستيات</h2>
                  <p className="text-[10px] font-bold text-slate-700 font-mono">Al-Zaeem Express Logistics Network Iraq</p>
                  <span className="text-[9px] text-slate-600 font-bold">بوليصة شحن وتوصيل رسمية A4 معتمدة</span>
                </div>
                <div className="border-2 border-slate-950 px-3 py-1 rounded-xl bg-slate-50 text-center">
                  <span className="text-[8px] font-bold text-slate-600 block">Waybill No.</span>
                  <span className="text-xs font-black font-mono text-slate-950">{trackingNumber}</span>
                  <div className="text-[8px] text-slate-600 font-bold">{formattedDate}</div>
                </div>
              </div>

              {/* Barcode */}
              <div className="flex flex-col items-center justify-center p-2 bg-white rounded-xl border border-slate-300">
                <Barcode128
                  value={trackingNumber}
                  height={44}
                  width={1.8}
                  displayValue={true}
                  fontSize={11}
                  lineColor="#000000"
                  background="#ffffff"
                />
              </div>

              {/* Sender & Consignee */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-300 space-y-1">
                  <span className="font-bold text-[9px] text-slate-700 block border-b border-slate-200 pb-0.5">
                    الراسل / المتجر (SENDER)
                  </span>
                  <p className="font-black text-slate-950 text-xs">{storeName}</p>
                  <p className="text-slate-700 font-mono text-[10px]">{subdomain}.za3em.shop</p>
                  <p className="text-slate-700 font-mono text-[10px]" dir="ltr">{storePhone}</p>
                  <p className="text-slate-600 text-[9px]">العراق - بغداد</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-300 space-y-1">
                  <span className="font-bold text-[9px] text-slate-700 block border-b border-slate-200 pb-0.5">
                    المستلم / الزبون (CONSIGNEE)
                  </span>
                  <p className="font-black text-slate-950 text-xs">{shipment.recipientName}</p>
                  <p className="text-slate-950 font-bold font-mono text-[11px]" dir="ltr">{shipment.recipientPhone}</p>
                  <p className="text-slate-900 font-bold text-[10px]">{shipment.governorate} — {shipment.district || 'المركز'}</p>
                  {shipment.nearestLandmark && <p className="text-slate-700 text-[9px]">دالة: {shipment.nearestLandmark}</p>}
                  <p className="text-slate-600 text-[9px]">{shipment.address}</p>
                </div>
              </div>

              {/* Table */}
              <div className="border border-slate-950 rounded-xl overflow-hidden text-xs">
                <div className="bg-slate-950 text-white font-bold text-[10px] grid grid-cols-4 p-2 text-center">
                  <span>المحتوى</span>
                  <span>العدد</span>
                  <span>طريقة الدفع</span>
                  <span>أجور الشحن</span>
                </div>
                <div className="grid grid-cols-4 p-2 text-[10px] text-center font-bold bg-white border-t border-slate-200">
                  <span>طلب متجر ({storeName})</span>
                  <span>1 طرد مغلق</span>
                  <span>نقداً عند الاستلام</span>
                  <span>{formatIQD(shipment.shippingCost || 5000)}</span>
                </div>
              </div>

              {/* COD */}
              <div className="p-3 rounded-xl border-2 border-dashed border-slate-900 bg-slate-50 flex items-center justify-between">
                <div>
                  <span className="text-xs font-black text-slate-800 block">المبلغ الإجمالي المطلوب تحصيله (COD):</span>
                  <p className="text-2xl font-black text-slate-950 font-mono">{formatIQD(shipment.codAmount)}</p>
                  <span className="text-[9px] text-slate-600 font-bold">شامل أجور التوصيل — يرجى تسليم الوصل للزبون</span>
                </div>
                <div className="text-center border border-slate-900 px-3 py-1.5 rounded-lg bg-white">
                  <div className="text-xs font-black">QR SCAN</div>
                  <span className="text-[8px] font-bold text-slate-600">تأكيد التسليم</span>
                </div>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="border border-slate-300 p-2 rounded-lg text-[9px] h-14 flex flex-col justify-between">
                  <span className="font-bold">توقيع واستلام الزبون:</span>
                  <div className="border-b border-dashed border-slate-400"></div>
                </div>
                <div className="border border-slate-300 p-2 rounded-lg text-[9px] h-14 flex flex-col justify-between">
                  <span className="font-bold">ختم وتوقيع مندوب شركة الزعيم:</span>
                  <div className="border-b border-dashed border-slate-400"></div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 3. A4 DOUBLE PREVIEW (2 Copies on 1 A4 sheet)                             */}
          {/* ========================================================================= */}
          {printFormat === 'a4-double' && (
            <div className="w-full max-w-[500px] space-y-3">
              <div className="bg-white border-2 border-slate-950 p-3 rounded-xl text-slate-950 text-right space-y-2 shadow-sm">
                <div className="flex justify-between items-center border-b pb-1 text-xs">
                  <strong>شركة الزعيم للشحن (نسخة المندوب)</strong>
                  <span className="font-mono font-bold text-[10px]">{trackingNumber}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div><strong>التاجر:</strong> {storeName} ({storePhone})</div>
                  <div><strong>المستلم:</strong> {shipment.recipientName} ({shipment.recipientPhone})</div>
                </div>
                <div className="flex justify-between items-center border border-dashed p-1.5 rounded bg-slate-50 text-xs">
                  <span>المبلغ المطلوب: <strong>{formatIQD(shipment.codAmount)}</strong></span>
                  <span className="text-[9px] text-slate-600">{shipment.governorate} — {shipment.district}</span>
                </div>
              </div>

              <div className="text-center text-[10px] text-slate-400 font-bold border-b border-dashed border-slate-400 py-1">
                ✂ خط القص بين النسختين
              </div>

              <div className="bg-white border-2 border-slate-950 p-3 rounded-xl text-slate-950 text-right space-y-2 shadow-sm">
                <div className="flex justify-between items-center border-b pb-1 text-xs">
                  <strong>شركة الزعيم للشحن (وصل استلام الزبون)</strong>
                  <span className="font-mono font-bold text-[10px]">{trackingNumber}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div><strong>التاجر:</strong> {storeName}</div>
                  <div><strong>المستلم:</strong> {shipment.recipientName}</div>
                </div>
                <div className="flex justify-between items-center border border-dashed p-1.5 rounded bg-slate-50 text-xs">
                  <span>المبلغ المسدد: <strong>{formatIQD(shipment.codAmount)}</strong></span>
                  <span className="text-[9px] text-slate-600">{formattedDate}</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Fixed Footer with Format Switcher & Print Buttons */}
        <div className="px-5 py-3.5 border-t border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3 shrink-0">
          {/* Format Selector Pills */}
          <div className="flex items-center gap-1.5 bg-slate-200/80 p-1 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setPrintFormat('thermal')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                printFormat === 'thermal'
                  ? 'bg-white text-slate-900 shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Package className="size-3.5" />
              <span>طابعة حرارية (XP-233B ورقة واحدة)</span>
            </button>
            <button
              type="button"
              onClick={() => setPrintFormat('a4-full')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                printFormat === 'a4-full'
                  ? 'bg-white text-slate-900 shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="size-3.5" />
              <span>ورقة A4 كاملة</span>
            </button>
            <button
              type="button"
              onClick={() => setPrintFormat('a4-double')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                printFormat === 'a4-double'
                  ? 'bg-white text-slate-900 shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="size-3.5" />
              <span>A4 (نسختان)</span>
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
              className="px-5 py-2 bg-teal-700 hover:bg-teal-800 active:scale-95 disabled:opacity-50 text-white text-xs font-black rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Printer className="size-4" />
              <span>{isPrinting ? 'جاري تجهيز الطباعة...' : 'طباعة البوليصة الآن'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ShippingLabelModal;

