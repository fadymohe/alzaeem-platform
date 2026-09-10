import React, { useState, useEffect } from 'react';
import {
  ShoppingBag, Search, Star, ArrowLeft, ArrowRight, Truck, ShieldCheck,
  Sparkles, Heart, Clock, Check, User, X, Phone, MapPin, MessageCircle,
  SlidersHorizontal, ArrowUpDown, Tag, Plus, Minus, Trash2, CheckCircle2,
  Lock, CreditCard, Send, ExternalLink, HelpCircle, Package, AlertCircle,
  Eye, RefreshCw, Award, Shield, ThumbsUp, ChevronDown, ChevronUp, Share2
} from 'lucide-react';
import { formatIQD, IRAQ_GOVERNORATES } from '../../../data/iraqData';
import { addStoredOrder, type StoreProduct } from '../../../data/storeState';
import { saveCloudShipment, validateAndApplyCoupon, fetchCloudCoupons } from '../../../utils/cloudDb';

export const STORE_PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23f1f5f9'/%3E%3Cpath d='M160 170a40 40 0 1 0 80 0 40 40 0 0 0-80 0zm-30 110h140l-45-60-35 45-25-30-35 45z' fill='%23cbd5e1'/%3E%3C/svg%3E";

export function getProductImage(prod?: any): string {
  if (!prod) return STORE_PLACEHOLDER_IMAGE;
  return prod.imageUrl || prod.featured_image || prod.image_url || prod.image || (Array.isArray(prod.images) && prod.images[0]) || STORE_PLACEHOLDER_IMAGE;
}

export function formatPriceInteger(price: number | string): string {
  const num = typeof price === 'number' ? price : Number(price) || 0;
  return formatIQD(Math.round(num));
}

export interface ThemeSharedProps {
  storeName: string;
  subdomain: string;
  fullDomain: string;
  brandColor: string;
  fontFamily: string;
  isDark?: boolean;
  accentBg?: string;
  cardBg?: string;
  textMuted?: string;
  products: StoreProduct[];
  cartItems?: Array<{ product: StoreProduct; quantity: number }>;
  onAddToCart?: (product: StoreProduct) => void;
  onOpenProductDetail?: (product: StoreProduct) => void;
  onNavigatePage?: (page: 'home' | 'shop' | 'categories' | 'cart' | 'checkout' | 'account' | 'contact' | 'product') => void;
}

/**
 * 1. AMAZON-STYLE PRODUCT DETAIL PAGE (PDP)
 * Dedicated full page view with interactive gallery, specs, reviews, and sticky mobile CTA
 */
export function ThemeProductDetailView({
  storeName,
  product,
  products,
  brandColor,
  fontFamily,
  isDark = false,
  onAddToCart,
  onOpenProductDetail,
  onNavigatePage
}: ThemeSharedProps & { product: StoreProduct }) {
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'reviews'>('desc');
  const [showStickyBar, setShowStickyBar] = useState(false);

  // Prepare gallery images (primary + fallback angle variants)
  const primaryImg = getProductImage(product);
  const galleryImages = [
    primaryImg,
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80'
  ];

  // Scroll listener for sticky mobile CTA bar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowStickyBar(true);
      } else {
        setShowStickyBar(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAdd = () => {
    if (isAdding) return;
    setIsAdding(true);
    if (onAddToCart) {
      for (let i = 0; i < quantity; i++) {
        onAddToCart(product);
      }
    }
    setToastMsg(`تمت إضافة "${product.name}" (${quantity}) إلى سلة التسوق بنجاح ✨`);
    setTimeout(() => {
      setIsAdding(false);
    }, 600);
    setTimeout(() => {
      setToastMsg(null);
    }, 4000);
  };

  const relatedProducts = products
    .filter(p => p.id !== product.id && (p.category === product.category || !product.category))
    .slice(0, 4);

  const roundedPrice = Math.round(product.price);
  const roundedCompare = product.compareAtPrice ? Math.round(product.compareAtPrice) : null;
  const discountPercent = roundedCompare && roundedCompare > roundedPrice
    ? Math.round(((roundedCompare - roundedPrice) / roundedCompare) * 100)
    : 0;

  return (
    <div className="space-y-10 animate-fadeIn py-6 px-4 md:px-8 max-w-7xl mx-auto" style={{ fontFamily }} dir="rtl">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[9999] bg-slate-900/95 text-white px-5 py-3 rounded-2xl shadow-2xl border border-emerald-500/40 flex items-center gap-3 animate-in slide-in-from-top-4 duration-300">
          <div className="size-6 rounded-full bg-emerald-500 text-slate-950 grid place-items-center font-bold">
            <Check className="size-4" />
          </div>
          <span className="text-xs font-black">{toastMsg}</span>
          <button
            type="button"
            onClick={() => onNavigatePage?.('cart')}
            className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-[11px] font-black mr-2 transition-all cursor-pointer"
          >
            عرض السلة
          </button>
        </div>
      )}

      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-400 pb-3 border-b border-white/10 overflow-x-auto whitespace-nowrap">
        <button type="button" onClick={() => onNavigatePage?.('home')} className="hover:underline">الرئيسية</button>
        <span>/</span>
        <button type="button" onClick={() => onNavigatePage?.('shop')} className="hover:underline">المتجر والمنتجات</button>
        <span>/</span>
        <span className="text-slate-300 font-bold">{product.category || 'عام'}</span>
        <span>/</span>
        <span className="text-inherit font-black truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* Main PDP Grid: Gallery (6 cols) + Buy Box (6 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Image Gallery (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square rounded-3xl overflow-hidden border border-white/10 bg-slate-900/40 p-4 flex items-center justify-center shadow-lg group">
            <img
              src={galleryImages[selectedImageIdx] || primaryImg}
              alt={product.name}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).onerror = null;
                (e.currentTarget as HTMLImageElement).src = STORE_PLACEHOLDER_IMAGE;
              }}
              className="size-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
            />
            {discountPercent > 0 && (
              <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-black bg-rose-600 text-white shadow-lg">
                وفر {discountPercent}%
              </span>
            )}
            <span className="absolute bottom-4 right-4 px-3 py-1 rounded-xl text-xs font-bold bg-black/60 text-white backdrop-blur-md">
              صورة {selectedImageIdx + 1} من {galleryImages.length}
            </span>
          </div>

          {/* Thumbnails Row */}
          <div className="grid grid-cols-4 gap-3">
            {galleryImages.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedImageIdx(idx)}
                className={`relative aspect-square rounded-2xl overflow-hidden border-2 bg-slate-900/30 p-1 transition-all cursor-pointer ${
                  selectedImageIdx === idx
                    ? 'border-emerald-500 shadow-md scale-95'
                    : 'border-white/10 hover:border-white/30 opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={img}
                  alt={`${product.name} thumbnail ${idx}`}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).onerror = null;
                    (e.currentTarget as HTMLImageElement).src = STORE_PLACEHOLDER_IMAGE;
                  }}
                  className="size-full object-contain"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Product Info & Purchase Actions (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-0.5 rounded-full text-[11px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {product.category || 'منتج أصلي'}
              </span>
              <span className="text-xs text-slate-400 font-mono">كود القطعة: {product.sku || `PRD-${product.id}`}</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-inherit leading-tight">
              {product.name}
            </h1>

            {/* Ratings Summary */}
            <div className="flex items-center gap-2 pt-1 text-xs">
              <div className="flex items-center text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="size-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="font-bold text-inherit">4.9</span>
              <span className="text-slate-400">(48 تقييم ومراجعة من مشترين موثقين)</span>
            </div>
          </div>

          {/* Price Box */}
          <div className="p-5 rounded-3xl bg-black/10 border border-white/10 space-y-2">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl md:text-4xl font-black text-inherit font-mono">
                {formatPriceInteger(roundedPrice)}
              </span>
              {roundedCompare && roundedCompare > roundedPrice && (
                <span className="text-sm font-mono text-slate-400 line-through">
                  {formatPriceInteger(roundedCompare)}
                </span>
              )}
            </div>
            <p className="text-xs text-emerald-400 font-bold flex items-center gap-1.5">
              <ShieldCheck className="size-4" />
              <span>السعر يشمل ضمان المعاينة والفحص باليد قبل دفع المبلغ للمندوب</span>
            </p>
          </div>

          {/* Stock & Fulfillment Info */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <CheckCircle2 className="size-4" />
              <span>متوفر في المستودع وجاهز للشحن الفوري</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Truck className="size-4 text-teal-400" />
              <span>التوصيل السريع خلال 24 - 48 ساعة لكافة محافظات العراق</span>
            </div>
          </div>

          {/* Short Description */}
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            {product.description || 'قطعة أصلية فاخرة مختارة بعناية لتلبي أعلى معايير الجودة والأناقة مع شحن سريع وضمان فحص الشحنة قبل إتمام الدفع.'}
          </p>

          {/* Quantity Selector + Add to Cart Button */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-300">الكمية:</span>
              <div className="flex items-center bg-black/20 border border-white/10 rounded-2xl p-1">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="size-8 rounded-xl bg-white/10 hover:bg-white/20 text-inherit grid place-items-center transition-colors cursor-pointer"
                >
                  <Minus className="size-3.5" />
                </button>
                <span className="w-10 text-center font-mono font-black text-sm">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="size-8 rounded-xl bg-white/10 hover:bg-white/20 text-inherit grid place-items-center transition-colors cursor-pointer"
                >
                  <Plus className="size-3.5" />
                </button>
              </div>
            </div>

            {/* Single Add to Cart Button with Spinner & Disabled State */}
            <button
              type="button"
              onClick={handleAdd}
              disabled={isAdding}
              className="w-full h-14 rounded-2xl font-black text-sm text-white shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-75 cursor-pointer"
              style={{ backgroundColor: brandColor }}
            >
              {isAdding ? (
                <>
                  <RefreshCw className="size-5 animate-spin" />
                  <span>جارِ الإضافة إلى السلة...</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="size-5" />
                  <span>أضف إلى السلة — {formatPriceInteger(roundedPrice * quantity)}</span>
                </>
              )}
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/10 text-center text-[11px]">
            <div className="p-3 rounded-2xl bg-black/10 border border-white/5 space-y-1">
              <ShieldCheck className="size-5 mx-auto text-emerald-400" />
              <span className="font-bold block">فحص ومعاينة</span>
              <span className="text-[10px] text-slate-400">قبل دفع المبلغ</span>
            </div>
            <div className="p-3 rounded-2xl bg-black/10 border border-white/5 space-y-1">
              <Truck className="size-5 mx-auto text-teal-400" />
              <span className="font-bold block">شحن سريع</span>
              <span className="text-[10px] text-slate-400">لكل العراق</span>
            </div>
            <div className="p-3 rounded-2xl bg-black/10 border border-white/5 space-y-1">
              <Award className="size-5 mx-auto text-amber-400" />
              <span className="font-bold block">ضمان الأصالة</span>
              <span className="text-[10px] text-slate-400">100% أصلي</span>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications, Detailed Description & Customer Reviews Tabs */}
      <div className="pt-8 border-t border-white/10 space-y-6">
        <div className="flex border-b border-white/10 gap-4 text-xs md:text-sm font-black">
          <button
            type="button"
            onClick={() => setActiveTab('desc')}
            className={`pb-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'desc' ? 'border-emerald-400 text-inherit' : 'border-transparent text-slate-400 hover:text-inherit'
            }`}
          >
            الوصف الكامل والمميزات
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('specs')}
            className={`pb-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'specs' ? 'border-emerald-400 text-inherit' : 'border-transparent text-slate-400 hover:text-inherit'
            }`}
          >
            جدول المواصفات الفنية
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'reviews' ? 'border-emerald-400 text-inherit' : 'border-transparent text-slate-400 hover:text-inherit'
            }`}
          >
            مراجعات وتقييمات العملاء (48)
          </button>
        </div>

        {activeTab === 'desc' && (
          <div className="space-y-4 text-xs md:text-sm text-slate-300 leading-relaxed max-w-4xl">
            <p>
              {product.description || 'تم تصميم هذه القطعة لتجمع بين الأناقة الرفيعة والأداء العملي الممتاز. تم اختيار المواد الخام بعناية فائقة لضمان المتانة وطول العمر الافتراضي.'}
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-slate-300">
              <li>خامات أصلية عالية الجودة مقاومة للاستخدام اليومي.</li>
              <li>مطابقة تامة للمواصفات المعروضة في الصور دون أي اختلاف.</li>
              <li>مغلفة بعناية في عبوة متجر {storeName} لضمان وصولها بحالة ممتازة.</li>
              <li>إمكانية المعاينة والفحص المباشر عند استلام الشحنة من مندوب التوصيل.</li>
            </ul>
          </div>
        )}

        {activeTab === 'specs' && (
          <div className="max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-black/10">
            <table className="w-full text-right text-xs">
              <tbody className="divide-y divide-white/5">
                <tr>
                  <td className="p-3 font-bold text-slate-400 bg-white/5 w-1/3">رقم الموديل (SKU)</td>
                  <td className="p-3 font-mono text-inherit">{product.sku || `PRD-${product.id}`}</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-400 bg-white/5">التصنيف / القسم</td>
                  <td className="p-3 text-inherit">{product.category || 'عام'}</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-400 bg-white/5">حالة المخزون</td>
                  <td className="p-3 text-emerald-400 font-bold">متوفر في المستودع ({product.stock || 20} قطعة)</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-400 bg-white/5">الوزن التقريبي للشحنة</td>
                  <td className="p-3 font-mono text-inherit">{product.weightGrams || 500} غرام</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-400 bg-white/5">سياسة الفحص</td>
                  <td className="p-3 text-inherit">يحق للزبون فحص ومعاينة المنتج قبل دفع المبلغ للمندوب</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-400 bg-white/5">طريقة الدفع</td>
                  <td className="p-3 text-inherit">الدفع عند الاستلام (COD) / زين كاش</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-4 max-w-3xl">
            <div className="p-5 rounded-2xl bg-black/10 border border-white/10 flex items-center justify-between gap-4">
              <div>
                <div className="text-3xl font-black text-inherit">4.9 <span className="text-xs text-slate-400 font-normal">/ 5.0</span></div>
                <div className="flex text-amber-400 mt-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="size-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-400 mt-1">بناءً على 48 تقييم حقيقي</p>
              </div>
              <div className="text-left text-xs font-bold text-emerald-400">
                100% نسبة رضا المشترين
              </div>
            </div>

            {/* Individual Reviews */}
            {[
              { name: 'حيدر الكرخي', city: 'بغداد — الكرادة', rating: 5, date: 'قبل يومين', text: 'المنتج ممتاز جداً والتغليف فخم والتوصيل كان سريع خلال 24 ساعة فقط. فحصت المنتج قبل الاستلام وكان مطابق تماماً.' },
              { name: 'زينب الموسوي', city: 'البصرة — العشار', rating: 5, date: 'قبل 4 أيام', text: 'الجودة رائعة والتفاصيل دقيقة مثل الصور تماماً. تعامل راقي وسرعة بالرد.' },
              { name: 'عمر الشمري', city: 'أربيل', rating: 5, date: 'قبل أسبوع', text: 'سعر مناسب جداً مقارنة بالجودة، والشحن مع الزعيم ممتاز والمندوب محترم.' }
            ].map((rev, i) => (
              <div key={i} className="p-4 rounded-2xl bg-black/5 border border-white/5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-inherit">{rev.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold">مشتري موثق ✓</span>
                    <span className="text-[10px] text-slate-400">{rev.city}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">{rev.date}</span>
                </div>
                <div className="flex text-amber-400">
                  {[...Array(rev.rating)].map((_, r) => (
                    <Star key={r} className="size-3 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-300">{rev.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="pt-8 border-t border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg md:text-xl font-black text-inherit">منتجات مشابهة قد تعجبك</h3>
            <button
              type="button"
              onClick={() => onNavigatePage?.('shop')}
              className="text-xs font-black text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>عرض الكل</span>
              <ArrowLeft className="size-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedProducts.map((rel) => (
              <div
                key={rel.id}
                className="rounded-2xl border border-white/10 bg-black/10 overflow-hidden hover:border-white/25 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div
                  className="relative aspect-square overflow-hidden bg-slate-900/30 cursor-pointer p-2 flex items-center justify-center"
                  onClick={() => onOpenProductDetail?.(rel)}
                >
                  <img
                    src={getProductImage(rel)}
                    alt={rel.name}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).onerror = null;
                      (e.currentTarget as HTMLImageElement).src = STORE_PLACEHOLDER_IMAGE;
                    }}
                    className="size-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>

                <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
                  <h4
                    className="font-bold text-xs text-inherit line-clamp-2 cursor-pointer hover:underline"
                    onClick={() => onOpenProductDetail?.(rel)}
                  >
                    {rel.name}
                  </h4>
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-1">
                    <span className="font-mono font-black text-xs text-inherit">
                      {formatPriceInteger(rel.price)}
                    </span>
                    <button
                      type="button"
                      onClick={() => onAddToCart?.(rel)}
                      className="px-3 py-1.5 rounded-xl text-[11px] font-black text-white shadow-sm transition-all hover:opacity-90 active:scale-95 cursor-pointer"
                      style={{ backgroundColor: brandColor }}
                    >
                      + السلة
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sticky Mobile CTA Bar (Appears when scrolling down) */}
      {showStickyBar && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 p-3 px-4 flex items-center justify-between gap-3 shadow-2xl animate-in slide-in-from-bottom-2">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <img
              src={primaryImg}
              alt={product.name}
              className="size-11 rounded-xl object-contain bg-slate-900 shrink-0 border border-slate-800"
            />
            <div className="truncate text-right">
              <h4 className="text-xs font-bold text-white truncate">{product.name}</h4>
              <p className="text-xs font-mono font-black text-emerald-400">{formatPriceInteger(roundedPrice)}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            disabled={isAdding}
            className="px-5 py-2.5 rounded-xl font-black text-xs text-white shadow-lg shrink-0 flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            style={{ backgroundColor: brandColor }}
          >
            {isAdding ? <RefreshCw className="size-3.5 animate-spin" /> : <ShoppingBag className="size-3.5" />}
            <span>أضف للسلة</span>
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * 2. SHOP / CATALOG PAGE VIEW
 * Dynamic category filters, search, sorting, direct navigation to PDP, and single Add to Cart
 */
export function ThemeShopView({
  storeName,
  products,
  brandColor,
  fontFamily,
  isDark = false,
  onAddToCart,
  onOpenProductDetail,
  onNavigatePage
}: ThemeSharedProps) {
  const [selectedCat, setSelectedCat] = useState<string>('الكل');
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc' | 'popular'>('newest');
  const [search, setSearch] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<number>(300000);
  const [addingId, setAddingId] = useState<number | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const categories = ['الكل', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];
  const highestPrice = Math.max(...products.map(p => p.price || 0), 150000);

  const filtered = products.filter(p => {
    const matchCat = selectedCat === 'الكل' || p.category === selectedCat;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || (p.description || '').toLowerCase().includes(search.toLowerCase());
    const matchPrice = (p.price || 0) <= maxPrice;
    return matchCat && matchSearch && matchPrice;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return (a.price || 0) - (b.price || 0);
    if (sortBy === 'price-desc') return (b.price || 0) - (a.price || 0);
    if (sortBy === 'popular') return (b.stock || 0) - (a.stock || 0);
    return (b.id || 0) - (a.id || 0);
  });

  const handleAddToCartWithFeedback = (prod: StoreProduct) => {
    if (addingId !== null) return;
    setAddingId(prod.id);
    if (onAddToCart) onAddToCart(prod);
    setToastMsg(`تمت إضافة "${prod.name}" إلى السلة ✨`);
    setTimeout(() => setAddingId(null), 500);
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="space-y-6 animate-fadeIn py-6 px-4 md:px-8 max-w-7xl mx-auto" style={{ fontFamily }} dir="rtl">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[9999] bg-slate-900/95 text-white px-5 py-3 rounded-2xl shadow-2xl border border-emerald-500/40 flex items-center gap-3 animate-in slide-in-from-top-4 duration-300">
          <div className="size-6 rounded-full bg-emerald-500 text-slate-950 grid place-items-center font-bold">
            <Check className="size-4" />
          </div>
          <span className="text-xs font-black">{toastMsg}</span>
          <button
            type="button"
            onClick={() => onNavigatePage?.('cart')}
            className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-[11px] font-black mr-2 transition-all cursor-pointer"
          >
            عرض السلة
          </button>
        </div>
      )}

      {/* Breadcrumb & Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <button type="button" onClick={() => onNavigatePage?.('home')} className="hover:underline">الرئيسية</button>
            <span>/</span>
            <span className="font-bold text-slate-200">كتالوج المنتجات</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-inherit">جميع المنتجات والتصنيفات</h2>
          <p className="text-xs text-slate-400 mt-0.5">تصفح أحدث القطع والمقتنيات المتوفرة في {storeName}</p>
        </div>

        {/* Sorting Dropdown & Items Count */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-400 hidden sm:inline">
            عرض {filtered.length} من {products.length} منتج
          </span>
          <div className="flex items-center gap-1.5 bg-black/20 border border-white/10 rounded-xl px-3 py-1.5 text-xs font-bold">
            <ArrowUpDown className="size-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              aria-label="ترتيب المنتجات"
              className="bg-transparent text-inherit outline-none cursor-pointer text-xs font-bold"
            >
              <option value="newest" className="bg-slate-900 text-white">الأحدث وصولاً</option>
              <option value="price-asc" className="bg-slate-900 text-white">السعر: من الأقل للأعلى</option>
              <option value="price-desc" className="bg-slate-900 text-white">السعر: من الأعلى للأقل</option>
              <option value="popular" className="bg-slate-900 text-white">الأكثر طلباً</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Shop Layout: Sidebar Filters + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Filter Sidebar (3 cols) */}
        <aside className="lg:col-span-3 space-y-5 p-4 rounded-2xl bg-black/10 border border-white/10 backdrop-blur-md">
          {/* Quick Search */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-inherit block">بحث سريع</label>
            <div className="relative">
              <Search className="size-3.5 absolute right-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ابحث بالاسم أو الوصف..."
                className="w-full bg-white/5 border border-white/10 rounded-xl pr-8 pl-3 py-1.5 text-xs text-inherit placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Categories Filter */}
          <div className="space-y-2">
            <label className="text-xs font-black text-inherit block">التصنيفات والأقسام</label>
            <div className="flex flex-col gap-1">
              {categories.map((cat) => {
                const count = cat === 'الكل' ? products.length : products.filter(p => p.category === cat).length;
                const isSelected = selectedCat === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCat(cat)}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all text-right cursor-pointer ${
                      isSelected
                        ? 'text-white shadow-sm'
                        : 'text-slate-400 hover:text-inherit hover:bg-white/5'
                    }`}
                    style={isSelected ? { backgroundColor: brandColor } : {}}
                  >
                    <span>{cat}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/20 font-mono">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-2 pt-3 border-t border-white/10">
            <div className="flex items-center justify-between text-xs font-bold">
              <span>أقصى سعر:</span>
              <span className="font-mono text-emerald-400 font-black">{formatPriceInteger(maxPrice)}</span>
            </div>
            <input
              type="range"
              min={10000}
              max={highestPrice > 300000 ? highestPrice : 300000}
              step={5000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              aria-label="أقصى سعر للمنتج"
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>10,000 د.ع</span>
              <span>{formatPriceInteger(highestPrice > 300000 ? highestPrice : 300000)}</span>
            </div>
          </div>

          {/* Reset Filters */}
          <button
            type="button"
            onClick={() => { setSelectedCat('الكل'); setSearch(''); setMaxPrice(highestPrice > 300000 ? highestPrice : 300000); }}
            className="w-full py-2 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
          >
            إعادة ضبط الفلاتر
          </button>
        </aside>

        {/* Right Products Grid (9 cols) */}
        <div className="lg:col-span-9 space-y-4">
          {filtered.length === 0 ? (
            <div className="text-center py-16 p-6 rounded-3xl bg-black/10 border border-white/10 space-y-3">
              <ShoppingBag className="size-12 mx-auto text-slate-500 opacity-60" />
              <h3 className="font-black text-lg text-inherit">لا توجد منتجات تطابق هذا البحث</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                جرب تغيير خيارات التصفية أو توسيع نطاق السعر للعثور على ما تبحث عنه.
              </p>
              <button
                type="button"
                onClick={() => { setSelectedCat('الكل'); setSearch(''); setMaxPrice(300000); }}
                className="px-5 py-2 rounded-xl text-xs font-black text-white shadow-md cursor-pointer"
                style={{ backgroundColor: brandColor }}
              >
                عرض كل المنتجات
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {filtered.map((prod) => (
                <div
                  key={prod.id}
                  className="rounded-2xl border border-white/10 bg-black/10 overflow-hidden hover:border-white/25 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  {/* Product Image Click Navigates to PDP */}
                  <div
                    className="relative aspect-square overflow-hidden bg-slate-900/30 p-2 flex items-center justify-center cursor-pointer"
                    onClick={() => onOpenProductDetail?.(prod)}
                  >
                    <img
                      src={getProductImage(prod)}
                      alt={prod.name}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).onerror = null;
                        (e.currentTarget as HTMLImageElement).src = STORE_PLACEHOLDER_IMAGE;
                      }}
                      className="size-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    {prod.compareAtPrice && prod.compareAtPrice > prod.price && (
                      <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-600 text-white shadow-md">
                        خصم {Math.round(((prod.compareAtPrice - prod.price) / prod.compareAtPrice) * 100)}%
                      </span>
                    )}
                    <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md text-[9px] font-bold bg-black/60 text-white backdrop-blur-sm">
                      {prod.category || 'عام'}
                    </span>
                  </div>

                  <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <h4
                        className="font-bold text-xs md:text-sm text-inherit line-clamp-2 cursor-pointer hover:underline"
                        onClick={() => onOpenProductDetail?.(prod)}
                      >
                        {prod.name}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">{prod.description}</p>
                    </div>

                    <div className="pt-2 border-t border-white/5 space-y-2">
                      <div className="flex items-baseline justify-between gap-1">
                        <span className="font-black text-sm md:text-base text-inherit font-mono">
                          {formatPriceInteger(prod.price)}
                        </span>
                        {prod.compareAtPrice && prod.compareAtPrice > prod.price && (
                          <span className="text-[10px] font-mono text-slate-500 line-through">
                            {formatPriceInteger(prod.compareAtPrice)}
                          </span>
                        )}
                      </div>

                      {/* Single Add to Cart Action with Loading Spinner */}
                      <button
                        type="button"
                        onClick={() => handleAddToCartWithFeedback(prod)}
                        disabled={addingId === prod.id}
                        className="w-full py-2 rounded-xl text-xs font-black text-white shadow-sm transition-all flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-75 cursor-pointer"
                        style={{ backgroundColor: brandColor }}
                      >
                        {addingId === prod.id ? (
                          <>
                            <RefreshCw className="size-3.5 animate-spin" />
                            <span>تمت الإضافة...</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="size-3.5" />
                            <span>أضف إلى السلة</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * 3. CATEGORIES PAGE VIEW
 */
export function ThemeCategoriesView({
  products,
  brandColor,
  fontFamily,
  onNavigatePage
}: ThemeSharedProps) {
  const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean)));

  const categoryCards = categories.map(cat => {
    const catProds = products.filter(p => p.category === cat);
    const sampleImage = getProductImage(catProds[0]);
    return {
      title: cat,
      count: catProds.length,
      image: sampleImage
    };
  });

  return (
    <div className="space-y-6 animate-fadeIn py-6 px-4 md:px-8 max-w-7xl mx-auto" style={{ fontFamily }} dir="rtl">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-white/10 text-inherit inline-block">
          التصنيفات الرئيسية
        </span>
        <h2 className="text-2xl md:text-3xl font-black text-inherit">أقسام ومجموعات المتجر</h2>
        <p className="text-xs md:text-sm text-slate-400">
          تصفح التشكيلات المختارة بعناية، كل قسم يضم أفضل القطع الأصلية مع الشحن السريع لكافة المحافظات العراقية.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-4">
        {categoryCards.map((cat, idx) => (
          <div
            key={idx}
            onClick={() => onNavigatePage?.('shop')}
            className="group relative h-64 md:h-72 rounded-3xl overflow-hidden border border-white/10 shadow-lg cursor-pointer transition-all duration-500 hover:shadow-2xl hover:scale-[1.02]"
          >
            <img
              src={cat.image}
              alt={cat.title}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).onerror = null;
                (e.currentTarget as HTMLImageElement).src = STORE_PLACEHOLDER_IMAGE;
              }}
              className="size-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

            <div className="absolute bottom-5 right-5 left-5 space-y-2 text-right">
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-md">
                {cat.count} منتج متوفر
              </span>
              <h3 className="text-xl font-black text-white">{cat.title}</h3>
              <div className="flex items-center gap-1 text-xs font-bold text-emerald-400 group-hover:translate-x-[-4px] transition-transform">
                <span>تصفح هذا القسم</span>
                <ArrowLeft className="size-3.5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * 4. DEDICATED CART & CHECKOUT VIEW (/cart)
 * Interactive Free Shipping Progress Bar, Quantity Management, and Express COD Checkout
 */
export function ThemeCartCheckoutView({
  storeName,
  subdomain,
  fullDomain,
  brandColor,
  fontFamily,
  cartItems = [],
  onNavigatePage
}: ThemeSharedProps) {
  const [items, setItems] = useState<Array<{ product: StoreProduct; quantity: number }>>(cartItems);

  // Keep items synced if prop changes
  useEffect(() => {
    if (cartItems && cartItems.length > 0) {
      setItems(cartItems);
    }
  }, [cartItems]);

  const [activeStep, setActiveStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any | null>(null);
  const [couponMsg, setCouponMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  useEffect(() => {
    fetchCloudCoupons().catch(() => {});
  }, []);

  // Customer Checkout Inputs
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custGov, setCustGov] = useState('بغداد');
  const [custAddress, setCustAddress] = useState('');
  const [custNotes, setCustNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'zaincash' | 'mastercard'>('cod');
  const [orderCode, setOrderCode] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');

  const subtotal = items.reduce((acc, item) => acc + (Math.round(item.product.price) * item.quantity), 0);
  const freeShippingThreshold = 50000;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const freeShippingRemaining = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const selectedGovData = IRAQ_GOVERNORATES.find(g => g.name === custGov);
  const standardDeliveryFee = selectedGovData?.deliveryFee || 5000;
  const shippingFee = isFreeShipping ? 0 : standardDeliveryFee;

  const couponDiscount = (() => {
    if (!appliedCoupon || subtotal <= 0) return 0;
    let d = 0;
    if (appliedCoupon.discountType === 'percentage') {
      d = Math.round((subtotal * Number(appliedCoupon.discountValue)) / 100);
    } else {
      d = Number(appliedCoupon.discountValue) || 5000;
    }
    return Math.min(d, subtotal);
  })();

  const total = Math.max(0, subtotal - couponDiscount + (items.length > 0 ? shippingFee : 0));

  const updateQuantity = (idx: number, delta: number) => {
    setItems(prev => {
      const copy = [...prev];
      const newQ = copy[idx].quantity + delta;
      if (newQ <= 0) {
        return copy.filter((_, i) => i !== idx);
      }
      copy[idx] = { ...copy[idx], quantity: newQ };
      return copy;
    });
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setIsApplyingCoupon(true);
    setCouponMsg(null);

    try {
      const res = await validateAndApplyCoupon(couponCode, subtotal);
      if (res.valid) {
        setAppliedCoupon(res.coupon || { code: couponCode.trim().toUpperCase(), discountType: 'fixed', discountValue: res.discountAmount });
        setCouponMsg({ type: 'success', text: res.message });
      } else {
        setAppliedCoupon(null);
        setCouponMsg({ type: 'error', text: res.message });
      }
    } catch {
      setCouponMsg({ type: 'error', text: 'حدث خطأ أثناء فحص كود الكوبون' });
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponMsg(null);
  };

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName || !custPhone || items.length === 0) return;

    const randOrder = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const randTrack = `ZM-IQ-${Math.floor(100000 + Math.random() * 900000)}`;

    addStoredOrder({
      customerName: custName.trim(),
      customerPhone: custPhone.trim(),
      customerCity: custGov,
      address: `${custGov} — ${custAddress.trim()}`,
      total,
      shippingCost: shippingFee,
      itemsCount: items.reduce((acc, i) => acc + i.quantity, 0),
      status: 'pending',
      paymentMethod,
      notes: custNotes || undefined,
      items: items.map(i => ({
        productName: i.product.name,
        quantity: i.quantity,
        unitPrice: Math.round(i.product.price)
      }))
    });

    try {
      saveCloudShipment({
        trackingNumber: randTrack,
        subdomain,
        recipientName: custName.trim(),
        recipientPhone: custPhone.trim(),
        governorate: custGov,
        district: custAddress.trim(),
        nearestLandmark: custAddress.trim(),
        address: `${custGov} — ${custAddress.trim()}`,
        codAmount: total,
        shippingCost: shippingFee,
        paymentType: paymentMethod,
        status: 'جديدة',
        shippingCompany: 'شركة الزعيم للشحن السريع',
        notes: custNotes || '',
        createdAt: new Date().toISOString(),
        date: new Date().toISOString().split('T')[0],
      });
    } catch {}

    setOrderCode(randOrder);
    setTrackingNumber(randTrack);
    setActiveStep('success');
  };

  if (activeStep === 'success') {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 animate-fadeIn text-center space-y-6" style={{ fontFamily }} dir="rtl">
        <div className="size-20 rounded-full bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500 grid place-items-center mx-auto shadow-2xl animate-bounce">
          <CheckCircle2 className="size-10" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-black text-inherit">تم استلام طلبك وتجهيز بوليصة الشحن بنجاح!</h2>
          <p className="text-xs md:text-sm text-slate-400">
            شكراً لطلبك من {storeName}. سيصلك اتصال أو رسالة واتساب من مندوب شركة الزعيم لتأكيد موعد التسليم.
          </p>
        </div>

        {/* Invoice Summary */}
        <div className="p-6 rounded-3xl bg-black/15 border border-white/10 text-right space-y-3 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs">
            <span className="text-slate-400 font-bold">رقم الطلب:</span>
            <span className="font-mono font-black text-teal-400">{orderCode}</span>
          </div>
          <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs">
            <span className="text-slate-400 font-bold">رقم بوليصة الشحن (الزعيم):</span>
            <span className="font-mono font-black text-emerald-400">{trackingNumber}</span>
          </div>
          <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs">
            <span className="text-slate-400 font-bold">عنوان الاستلام:</span>
            <span className="font-bold text-inherit">{custGov} — {custAddress}</span>
          </div>
          <div className="flex items-center justify-between pt-1 text-sm font-black">
            <span className="text-slate-200">المبلغ المطلوب عند الاستلام (COD):</span>
            <span className="font-mono text-emerald-400 text-lg">{formatPriceInteger(total)}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => onNavigatePage?.('home')}
            className="px-6 py-3 rounded-2xl text-xs font-black text-white shadow-md cursor-pointer"
            style={{ backgroundColor: brandColor }}
          >
            العودة للتسوق في المتجر
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn py-6 px-4 md:px-8 max-w-7xl mx-auto" style={{ fontFamily }} dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-inherit">
            {activeStep === 'cart' ? 'سلة التسوق والمشتريات' : 'إتمام الطلب وبيانات التوصيل'}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {activeStep === 'cart' ? `مراجعة المنتجات المختارة في ${storeName}` : 'أدخل بيانات التوصيل في العراق والدفع عند الاستلام'}
          </p>
        </div>

        {activeStep === 'checkout' && (
          <button
            type="button"
            onClick={() => setActiveStep('cart')}
            className="px-3.5 py-1.5 rounded-xl bg-white/10 text-xs font-bold hover:bg-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowRight className="size-3.5" />
            <span>الرجوع للسلة</span>
          </button>
        )}
      </div>

      {/* Interactive Free Shipping Progress Bar */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-transparent border border-emerald-500/30 space-y-2">
        <div className="flex items-center justify-between text-xs font-black">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <Truck className="size-4 shrink-0" />
            {isFreeShipping ? (
              <span>🎉 مبروك! طلبيتك مؤهلة للشحن المجاني لجميع محافظات العراق!</span>
            ) : (
              <span>أضف منتجات بقيمة {formatPriceInteger(freeShippingRemaining)} للحصول على شحن مجاني 🚚</span>
            )}
          </span>
          <span className="font-mono font-bold text-slate-300">{freeShippingProgress}%</span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-black/20 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-500"
            style={{ width: `${freeShippingProgress}%` }}
          />
        </div>
      </div>

      {/* Step 1: Cart Items List */}
      {activeStep === 'cart' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Items (8 cols) */}
          <div className="lg:col-span-8 space-y-3">
            {items.length === 0 ? (
              <div className="text-center py-16 p-6 rounded-3xl bg-black/10 border border-white/10 space-y-4">
                <ShoppingBag className="size-14 mx-auto text-slate-500 opacity-60" />
                <h3 className="font-black text-lg text-inherit">سلة التسوق فارغة حالياً</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  تصفح المنتجات وأضف ما يناسبك إلى السلة للاستفادة من عروض الشحن السريع.
                </p>
                <button
                  type="button"
                  onClick={() => onNavigatePage?.('shop')}
                  className="px-6 py-2.5 rounded-2xl text-xs font-black text-white shadow-md cursor-pointer"
                  style={{ backgroundColor: brandColor }}
                >
                  تصفح المنتجات الآن
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-black/10 border border-white/10 flex items-center justify-between gap-4 transition-all hover:border-white/20"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <img
                        src={getProductImage(item.product)}
                        alt={item.product.name}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).onerror = null;
                          (e.currentTarget as HTMLImageElement).src = STORE_PLACEHOLDER_IMAGE;
                        }}
                        className="size-16 rounded-xl object-contain bg-slate-900/40 p-1 shrink-0 border border-white/10"
                      />
                      <div className="text-right truncate">
                        <h4 className="font-bold text-xs md:text-sm text-inherit truncate">{item.product.name}</h4>
                        <p className="text-xs font-mono font-black text-emerald-400 mt-0.5">
                          {formatPriceInteger(item.product.price)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="flex items-center bg-black/20 border border-white/10 rounded-xl p-1">
                        <button
                          type="button"
                          onClick={() => updateQuantity(idx, 1)}
                          className="size-6 rounded-lg bg-white/10 hover:bg-white/20 text-inherit grid place-items-center cursor-pointer"
                        >
                          <Plus className="size-3" />
                        </button>
                        <span className="font-mono font-bold text-xs px-2">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(idx, -1)}
                          className="size-6 rounded-lg bg-white/10 hover:bg-white/20 text-inherit grid place-items-center cursor-pointer"
                        >
                          <Minus className="size-3" />
                        </button>
                      </div>

                      <span className="font-mono font-black text-xs md:text-sm text-inherit hidden sm:inline">
                        {formatPriceInteger(Math.round(item.product.price) * item.quantity)}
                      </span>

                      <button
                        type="button"
                        onClick={() => updateQuantity(idx, -item.quantity)}
                        className="text-slate-400 hover:text-rose-400 p-1 cursor-pointer transition-colors"
                        title="حذف المنتج من السلة"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Summary (4 cols) */}
          <div className="lg:col-span-4 p-5 rounded-3xl bg-black/15 border border-white/10 space-y-4">
            <h4 className="font-black text-sm text-inherit pb-2 border-b border-white/10">ملخص الطلب والتوصيل</h4>

            {/* Coupon Code Input */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <Tag className="size-3.5 text-amber-400" />
                  <span>كود الخصم الترويجي</span>
                </span>
                {appliedCoupon && (
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="text-[10px] text-rose-400 hover:underline font-bold cursor-pointer"
                  >
                    إلغاء الكوبون
                  </button>
                )}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.replace(/[^A-Za-z0-9\u0600-\u06FF]/g, '').toUpperCase())}
                  placeholder="مثال: ZAEEM أو SALE20"
                  disabled={Boolean(appliedCoupon)}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-inherit font-mono uppercase focus:outline-none focus:border-emerald-500 disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={appliedCoupon ? handleRemoveCoupon : handleApplyCoupon}
                  disabled={isApplyingCoupon || (!appliedCoupon && !couponCode.trim())}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    appliedCoupon
                      ? 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30'
                      : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md disabled:opacity-50'
                  }`}
                >
                  {isApplyingCoupon ? 'جارِ الفحص...' : appliedCoupon ? 'إلغاء' : 'تطبيق'}
                </button>
              </div>

              {couponMsg && (
                <p className={`text-[11px] font-bold flex items-center gap-1 mt-1 ${
                  couponMsg.type === 'success' ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {couponMsg.type === 'success' ? <Check className="size-3.5" /> : <AlertCircle className="size-3.5" />}
                  <span>{couponMsg.text}</span>
                </p>
              )}
            </div>

            <div className="space-y-2 text-xs font-bold pt-2 border-t border-white/10">
              <div className="flex justify-between text-slate-400">
                <span>المجموع الفرعي:</span>
                <span className="font-mono text-inherit">{formatPriceInteger(subtotal)}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>الخصم المطبق {appliedCoupon ? `(${appliedCoupon.code})` : ''}:</span>
                  <span className="font-mono font-bold">- {formatPriceInteger(couponDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-400">
                <span>أجور الشحن (أسطول الزعيم):</span>
                <span className="font-mono text-inherit">
                  {shippingFee === 0 ? <span className="text-emerald-400 font-bold">شحن مجاني 🎉</span> : formatPriceInteger(shippingFee)}
                </span>
              </div>
              <div className="flex justify-between text-base font-black pt-2 border-t border-white/10">
                <span>المجموع الإجمالي:</span>
                <span className="font-mono text-emerald-400">{formatPriceInteger(total)}</span>
              </div>
            </div>

            <button
              type="button"
              disabled={items.length === 0}
              onClick={() => setActiveStep('checkout')}
              className="w-full py-3.5 rounded-2xl text-xs font-black text-white shadow-lg transition-all hover:opacity-95 disabled:opacity-50 cursor-pointer"
              style={{ backgroundColor: brandColor }}
            >
              متابعة لإتمام الطلب (Checkout)
            </button>
          </div>
        </div>
      ) : (
        /* Step 2: Dedicated Checkout View */
        <form onSubmit={handleConfirmOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 p-6 rounded-3xl bg-black/10 border border-white/10 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="text-base font-black text-inherit">عنوان التوصيل في العراق</h3>
                <p className="text-xs text-slate-400">سيتم تسليم الشحنة عبر شركة الزعيم للشحن السريع مع فحص الشحنة قبل الدفع</p>
              </div>
              <Truck className="size-6 text-emerald-400" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">الاسم الثلاثي للعميل *</label>
                <input
                  type="text"
                  required
                  value={custName}
                  onChange={(e) => setCustName(e.target.value)}
                  placeholder="مثال: علي محمد حسن"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-inherit focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">رقم الهاتف النشط (واتساب) *</label>
                <input
                  type="tel"
                  required
                  value={custPhone}
                  onChange={(e) => setCustPhone(e.target.value)}
                  placeholder="مثال: 0770 000 0000"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-inherit font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">المحافظة *</label>
                <select
                  value={custGov}
                  onChange={(e) => setCustGov(e.target.value)}
                  aria-label="اختيار المحافظة"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-inherit focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  {IRAQ_GOVERNORATES.map(g => (
                    <option key={g.name} value={g.name} className="bg-slate-900 text-white">
                      {g.name} (توصيل: {formatPriceInteger(g.deliveryFee)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">العنوان بالتفصيل والعلامة المميزة *</label>
                <input
                  type="text"
                  required
                  value={custAddress}
                  onChange={(e) => setCustAddress(e.target.value)}
                  placeholder="المنطقة، الشارع، أقرب نقطة دالة..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-inherit focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2 pt-3 border-t border-white/10">
              <label className="text-xs font-black text-inherit block">طريقة الدفع المفضلة</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'cod', title: 'الدفع عند الاستلام', desc: 'معاينة وفحص الطلب قبل الدفع' },
                  { id: 'zaincash', title: 'زين كاش (ZainCash)', desc: 'دفع رقمي آمن وفوري' },
                  { id: 'mastercard', title: 'ماستركارد / فيزا', desc: 'دفع بالبطاقات المصرفية' },
                ].map((pm) => (
                  <div
                    key={pm.id}
                    onClick={() => setPaymentMethod(pm.id as any)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-right space-y-1 ${
                      paymentMethod === pm.id
                        ? 'border-emerald-500 bg-emerald-500/10 shadow-md'
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                    }`}
                  >
                    <span className="text-xs font-black text-inherit block">{pm.title}</span>
                    <span className="text-[10px] text-slate-400 block">{pm.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary (4 cols) */}
          <div className="lg:col-span-4 p-5 rounded-3xl bg-black/15 border border-white/10 space-y-4">
            <h4 className="font-black text-sm text-inherit pb-2 border-b border-white/10">ملخص الفاتورة النهائية</h4>

            <div className="space-y-2 text-xs font-bold">
              <div className="flex justify-between text-slate-400">
                <span>المجموع الفرعي ({items.length} منتجات):</span>
                <span className="font-mono text-inherit">{formatPriceInteger(subtotal)}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>خصم الكوبون:</span>
                  <span className="font-mono font-bold">- {formatPriceInteger(couponDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-400">
                <span>أجور الشحن ({custGov}):</span>
                <span className="font-mono text-inherit">
                  {shippingFee === 0 ? <span className="text-emerald-400 font-bold">شحن مجاني 🎉</span> : formatPriceInteger(shippingFee)}
                </span>
              </div>
              <div className="flex justify-between text-base font-black pt-2 border-t border-white/10">
                <span>المبلغ الإجمالي للدفع:</span>
                <span className="font-mono text-emerald-400 text-lg">{formatPriceInteger(total)}</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl text-xs font-black text-white shadow-xl transition-all hover:opacity-95 cursor-pointer"
              style={{ backgroundColor: brandColor }}
            >
              تأكيد الطلب وإصدار البوليصة فوراً
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

/**
 * 5. CUSTOMER ACCOUNT & PROFILE VIEW
 */
export function ThemeAccountView({
  storeName,
  brandColor,
  fontFamily,
  onNavigatePage
}: ThemeSharedProps) {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
  };

  if (isLoggedIn) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 md:px-8 space-y-6 animate-fadeIn" style={{ fontFamily }} dir="rtl">
        <div className="flex items-center justify-between p-5 rounded-3xl bg-black/10 border border-white/10">
          <div className="flex items-center gap-3">
            <div className="size-12 rounded-2xl text-white font-black grid place-items-center text-lg shadow-md" style={{ backgroundColor: brandColor }}>
              {(fullName || 'ع').charAt(0)}
            </div>
            <div className="text-right">
              <h3 className="font-black text-base text-inherit">{fullName || 'الزبون المعتمد'}</h3>
              <p className="text-xs text-slate-400 font-mono">{phone || '0770 000 0000'}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsLoggedIn(false)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 cursor-pointer"
          >
            تسجيل الخروج
          </button>
        </div>

        <div className="space-y-3">
          <h4 className="font-black text-base text-inherit">شحناتك وطلباتك السابقة في {storeName}</h4>
          <div className="p-4 rounded-2xl bg-black/10 border border-white/10 flex items-center justify-between text-xs">
            <div className="space-y-1 text-right">
              <div className="flex items-center gap-2">
                <span className="font-bold text-inherit">طلب رقم #ORD-849201</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-950 text-emerald-300 border border-emerald-800">
                  تم التوصيل بنجاح
                </span>
              </div>
              <p className="text-slate-400 font-mono">بوليصة الشحن: ZM-BG-4912 • بغداد</p>
            </div>
            <span className="font-mono font-black text-emerald-400">{formatPriceInteger(45000)}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-10 px-4 animate-fadeIn" style={{ fontFamily }} dir="rtl">
      <div className="p-6 rounded-3xl bg-black/15 border border-white/10 shadow-2xl space-y-5">
        <div className="text-center space-y-1">
          <div className="size-12 rounded-2xl mx-auto text-white grid place-items-center shadow-lg" style={{ backgroundColor: brandColor }}>
            <User className="size-6" />
          </div>
          <h3 className="font-black text-lg text-inherit">حساب العميل في {storeName}</h3>
          <p className="text-xs text-slate-400">سجل الدخول لتتبع شحناتك وحفظ عناوينك المفضلة</p>
        </div>

        <div className="flex bg-black/20 p-1 rounded-xl border border-white/10 text-xs font-bold">
          <button
            type="button"
            onClick={() => setAuthMode('login')}
            className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${authMode === 'login' ? 'bg-white/10 text-white shadow-sm' : 'text-slate-400'}`}
          >
            تسجيل الدخول
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('register')}
            className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${authMode === 'register' ? 'bg-white/10 text-white shadow-sm' : 'text-slate-400'}`}
          >
            حساب جديد
          </button>
        </div>

        <form onSubmit={handleAuthSubmit} className="space-y-3.5">
          {authMode === 'register' && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 block">الاسم الكامل *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="أدخل اسمك الكريم"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-inherit focus:outline-none focus:border-emerald-500"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 block">رقم الهاتف العراقي *</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0770 000 0000"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-inherit font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 block">كلمة المرور *</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-inherit focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl text-xs font-black text-white shadow-lg transition-all hover:opacity-95 cursor-pointer"
            style={{ backgroundColor: brandColor }}
          >
            {authMode === 'login' ? 'دخول إلى حسابي' : 'إنشاء حساب جديد'}
          </button>
        </form>
      </div>
    </div>
  );
}

/**
 * 6. CONTACT US VIEW
 */
export function ThemeContactView({
  storeName,
  subdomain,
  fullDomain,
  brandColor,
  fontFamily
}: ThemeSharedProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [msg, setMsg] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setName('');
    setPhone('');
    setMsg('');
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 md:px-8 space-y-8 animate-fadeIn" style={{ fontFamily }} dir="rtl">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-white/10 text-inherit inline-block">
          خدمة العملاء والدعم
        </span>
        <h2 className="text-2xl md:text-3xl font-black text-inherit">تواصل مع {storeName}</h2>
        <p className="text-xs md:text-sm text-slate-400">
          فريق خدمة العملاء جاهز للرد على استفساراتكم ومتابعة شحناتكم على مدار الساعة.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        <div className="md:col-span-5 space-y-3.5">
          <div className="p-4 rounded-2xl bg-black/10 border border-white/10 flex items-center gap-3">
            <div className="size-10 rounded-xl bg-emerald-500/20 text-emerald-400 grid place-items-center shrink-0">
              <Phone className="size-5" />
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block font-bold">الخط الساخن والطلبات</span>
              <a href="tel:+9647700000000" className="text-sm font-black text-inherit font-mono hover:underline">
                +964 770 000 0000
              </a>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-black/10 border border-white/10 flex items-center gap-3">
            <div className="size-10 rounded-xl bg-emerald-600/20 text-emerald-400 grid place-items-center shrink-0">
              <MessageCircle className="size-5" />
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block font-bold">المحادثة الفورية (واتساب)</span>
              <a
                href={`https://wa.me/9647700000000?text=${encodeURIComponent(`مرحباً متجر ${storeName}`)}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-black text-emerald-400 hover:underline flex items-center gap-1"
              >
                <span>محادثة فريق الدعم الآن</span>
                <ExternalLink className="size-3" />
              </a>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-black/10 border border-white/10 flex items-center gap-3">
            <div className="size-10 rounded-xl bg-amber-500/20 text-amber-400 grid place-items-center shrink-0">
              <MapPin className="size-5" />
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block font-bold">مقر ومستودع التوزيع</span>
              <span className="text-xs font-bold text-inherit">العراق — بغداد وكافة المحافظات</span>
            </div>
          </div>
        </div>

        <div className="md:col-span-7 p-6 rounded-3xl bg-black/15 border border-white/10 space-y-4">
          <h3 className="font-black text-base text-inherit">أرسل رسالة مباشرة لإدارة المتجر</h3>

          {sent && (
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold text-center">
              ✓ تم إرسال رسالتك بنجاح! سيتواصل معك فريق خدمة العملاء قريباً.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 block">الاسم الكريم *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="أدخل اسمك"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-inherit focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 block">رقم الهاتف للتواصل *</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0770 000 0000"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-inherit font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 block">نص الرسالة أو الاستفسار *</label>
              <textarea
                rows={4}
                required
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                placeholder="اكتب استفسارك بالتفصيل..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-inherit focus:outline-none focus:border-emerald-500 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl text-xs font-black text-white shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              style={{ backgroundColor: brandColor }}
            >
              <Send className="size-4" />
              <span>إرسال الرسالة الآن</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
