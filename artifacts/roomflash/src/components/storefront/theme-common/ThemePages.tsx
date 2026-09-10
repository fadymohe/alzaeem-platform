import React, { useState } from 'react';
import {
  ShoppingBag, Search, Star, ArrowLeft, ArrowRight, Truck, ShieldCheck,
  Sparkles, Heart, Clock, Check, User, X, Phone, MapPin, MessageCircle,
  SlidersHorizontal, ArrowUpDown, Tag, Plus, Minus, Trash2, CheckCircle2,
  Lock, CreditCard, Send, ExternalLink, HelpCircle, Package, AlertCircle
} from 'lucide-react';
import { formatIQD, IRAQ_GOVERNORATES } from '../../../data/iraqData';
import { addStoredOrder, type StoreProduct } from '../../../data/storeState';
import { saveCloudShipment } from '../../../utils/cloudDb';

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
  onQuickBuy?: (product: StoreProduct) => void;
  onOpenProductDetail?: (product: StoreProduct) => void;
  onNavigatePage?: (page: 'home' | 'shop' | 'categories' | 'cart' | 'checkout' | 'account' | 'contact') => void;
}

/**
 * 1. SHOP / CATALOG PAGE VIEW
 * With dynamic category filters, price range filter, search, and sorting
 */
export function ThemeShopView({
  storeName,
  products,
  brandColor,
  fontFamily,
  isDark = false,
  onAddToCart,
  onQuickBuy,
  onOpenProductDetail,
  onNavigatePage
}: ThemeSharedProps) {
  const [selectedCat, setSelectedCat] = useState<string>('الكل');
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc' | 'popular'>('newest');
  const [search, setSearch] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<number>(300000);

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

  return (
    <div className="space-y-6 animate-fadeIn py-6 px-4 md:px-8 max-w-7xl mx-auto" style={{ fontFamily }}>
      {/* Breadcrumb & Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200/20">
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
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all text-right ${
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
              <span className="font-mono text-emerald-400 font-black">{formatIQD(maxPrice)}</span>
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
              <span>{formatIQD(highestPrice > 300000 ? highestPrice : 300000)}</span>
            </div>
          </div>

          {/* Reset Filters */}
          <button
            type="button"
            onClick={() => { setSelectedCat('الكل'); setSearch(''); setMaxPrice(highestPrice > 300000 ? highestPrice : 300000); }}
            className="w-full py-2 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
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
                className="px-5 py-2 rounded-xl text-xs font-black text-white shadow-md"
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
                  <div
                    className="relative aspect-square overflow-hidden bg-black/20 cursor-pointer"
                    onClick={() => onOpenProductDetail?.(prod)}
                  >
                    <img
                      src={prod.imageUrl}
                      alt={prod.name}
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
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
                          {formatIQD(prod.price)}
                        </span>
                        {prod.compareAtPrice && prod.compareAtPrice > prod.price && (
                          <span className="text-[10px] font-mono text-slate-500 line-through">
                            {formatIQD(prod.compareAtPrice)}
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-1.5 pt-1">
                        <button
                          type="button"
                          onClick={() => onQuickBuy?.(prod)}
                          className="py-1.5 rounded-xl text-[11px] font-black text-white shadow-sm transition-all hover:opacity-90 active:scale-95"
                          style={{ backgroundColor: brandColor }}
                        >
                          شراء سريع
                        </button>
                        <button
                          type="button"
                          onClick={() => onAddToCart?.(prod)}
                          className="py-1.5 rounded-xl text-[11px] font-bold bg-white/10 hover:bg-white/20 text-inherit transition-all active:scale-95"
                        >
                          + السلة
                        </button>
                      </div>
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
 * 2. CATEGORIES PAGE VIEW
 * Elegant card grid of all store collections & niches
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
    const sampleImage = catProds[0]?.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700&auto=format&fit=crop&q=80';
    return {
      title: cat,
      count: catProds.length,
      image: sampleImage
    };
  });

  return (
    <div className="space-y-6 animate-fadeIn py-6 px-4 md:px-8 max-w-7xl mx-auto" style={{ fontFamily }}>
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
 * 3. CART & CHECKOUT VIEW
 * Complete interactive shopping bag and express Iraqi COD checkout flow
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
  const [items, setItems] = useState(cartItems.length > 0 ? cartItems : [
    {
      product: {
        id: 101,
        name: 'منتج المتجر الحصري المميز',
        sku: 'PRD-EXCLUSIVE-01',
        description: 'قطعة راقية أصلية مع شحن سريع وضمان فحص الشحنة قبل الدفع',
        price: 45000,
        stock: 15,
        category: 'المميزة',
        imageUrl: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&auto=format&fit=crop&q=80'
      } as StoreProduct,
      quantity: 1
    }
  ]);

  const [activeStep, setActiveStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);

  // Checkout inputs
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custGov, setCustGov] = useState('بغداد');
  const [custAddress, setCustAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'zaincash' | 'mastercard'>('cod');
  const [orderCode, setOrderCode] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');

  const subtotal = items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const selectedGovData = IRAQ_GOVERNORATES.find(g => g.name === custGov);
  const shippingFee = selectedGovData?.deliveryFee || 5000;
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

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    const clean = couponCode.toUpperCase().trim();

    let foundCoupon: any = null;
    try {
      const rawCloud = localStorage.getItem('zaeem_cloud_coupons');
      const rawCoupons = localStorage.getItem('zaeem_coupons');
      const list = [
        ...(rawCloud ? JSON.parse(rawCloud) : []),
        ...(rawCoupons ? JSON.parse(rawCoupons) : [])
      ];
      foundCoupon = list.find((c: any) => c.code && c.code.toUpperCase().trim() === clean);
    } catch {}

    if (!foundCoupon) {
      if (clean === 'ZAEEM' || clean === 'VIP' || clean === 'ZAEEM10' || clean === 'DISCOUNT10') {
        foundCoupon = { code: clean, discountType: 'percentage', discountValue: 15, minOrderValue: 0 };
      } else if (clean === 'WELCOME' || clean === 'ZA3EM5') {
        foundCoupon = { code: clean, discountType: 'fixed', discountValue: 5000, minOrderValue: 20000 };
      } else if (clean === 'RAMADAN' || clean === 'SALE20') {
        foundCoupon = { code: clean, discountType: 'percentage', discountValue: 20, minOrderValue: 0 };
      }
    }

    if (!foundCoupon) {
      alert('كود الخصم غير صالح أو منتهي الصلاحية');
      return;
    }

    if (foundCoupon.status === 'متوقف') {
      alert('هذا الكوبون متوقف حالياً');
      return;
    }

    if (foundCoupon.minOrderValue && subtotal < Number(foundCoupon.minOrderValue)) {
      alert(`الحد الأدنى لتطبيق هذا الكوبون هو ${formatIQD(Number(foundCoupon.minOrderValue))}`);
      return;
    }

    let discount = 0;
    if (foundCoupon.discountType === 'percentage') {
      discount = Math.round((subtotal * Number(foundCoupon.discountValue)) / 100);
    } else {
      discount = Number(foundCoupon.discountValue) || 5000;
    }

    const appliedDiscount = Math.min(discount, subtotal);
    setCouponDiscount(appliedDiscount);
    alert(`تم تطبيق كود الخصم بنجاح! تم خصم ${formatIQD(appliedDiscount)} من إجمالي الطلب 🎉`);
  };

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName || !custPhone || !custAddress) {
      alert('يرجى ملء جميع الحقول المطلوبة (الاسم، رقم الهاتف، العنوان).');
      return;
    }
    const randCode = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const randTrack = `ZAEEM-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderCode(randCode);
    setTrackingNumber(randTrack);

    // Save actual order to storeState
    try {
      const orderItems = items.map(i => ({
        productName: i.product.name,
        quantity: i.quantity,
        unitPrice: i.product.price,
      }));

      addStoredOrder({
        customerName: custName.trim(),
        customerPhone: custPhone.trim(),
        customerCity: custGov,
        address: `${custGov} — ${custAddress.trim()}`,
        total: total,
        shippingCost: shippingFee,
        itemsCount: orderItems.reduce((acc, i) => acc + i.quantity, 0),
        status: 'pending',
        paymentMethod: 'cod',
        notes: custNotes || undefined,
        items: orderItems,
      });

      // Save corresponding shipment
      saveCloudShipment({
        trackingNumber: randTrack,
        subdomain: subdomain,
        recipientName: custName.trim(),
        recipientPhone: custPhone.trim(),
        governorate: custGov,
        district: custAddress.trim(),
        nearestLandmark: custAddress.trim(),
        address: `${custGov} — ${custAddress.trim()}`,
        codAmount: total,
        shippingCost: shippingFee,
        paymentType: 'cod',
        status: 'جديدة',
        shippingCompany: 'شركة الزعيم للشحن السريع',
        notes: custNotes || '',
        createdAt: new Date().toISOString(),
        date: new Date().toISOString().split('T')[0],
      });
    } catch (err) {
      console.warn('Error recording order:', err);
    }

    setActiveStep('success');
  };

  if (activeStep === 'success') {
    return (
      <div className="max-w-lg mx-auto py-12 px-4 text-center space-y-5 animate-fadeIn" style={{ fontFamily }}>
        <div className="size-20 rounded-full bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500 mx-auto grid place-items-center shadow-xl">
          <CheckCircle2 className="size-10" />
        </div>
        <div className="space-y-1.5">
          <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
            تم تسجيل الطلب وإصدار البوليصة فوراً
          </span>
          <h2 className="text-2xl font-black text-inherit">شكراً لطلبك من {storeName}!</h2>
          <p className="text-xs text-slate-400">
            سيتم تجهيز شحنتك وتسليمها لأسطول الزعيم للشحن السريع للتوصيل إلى {custGov}.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-black/20 border border-white/10 text-xs text-right space-y-2.5 font-mono">
          <div className="flex justify-between">
            <span className="text-slate-400">رقم الطلب:</span>
            <span className="font-bold text-emerald-400">{orderCode}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">رقم بوليصة تتبع الزعيم:</span>
            <span className="font-bold text-teal-400">{trackingNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">المستلم:</span>
            <span className="font-bold text-inherit">{custName} ({custPhone})</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">العنوان:</span>
            <span className="font-bold text-inherit">{custGov} — {custAddress}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-white/10 font-black text-sm">
            <span>المبلغ المطلوب عند الاستلام:</span>
            <span className="text-emerald-400">{formatIQD(total)}</span>
          </div>
        </div>

        <div className="space-y-2">
          <button
            type="button"
            onClick={() => onNavigatePage?.('home')}
            className="w-full py-3 rounded-xl text-xs font-black text-white shadow-lg transition-all"
            style={{ backgroundColor: brandColor }}
          >
            العودة لمتابعة التسوق
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 md:px-8 space-y-8 animate-fadeIn" style={{ fontFamily }}>
      {/* Steps Progress Header */}
      <div className="flex items-center justify-center gap-3 text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveStep('cart')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border transition-all ${
            activeStep === 'cart'
              ? 'text-white border-emerald-500 shadow-md'
              : 'text-slate-400 border-white/10'
          }`}
          style={activeStep === 'cart' ? { backgroundColor: brandColor } : {}}
        >
          <ShoppingBag className="size-4" />
          <span>1. سلة التسوق ({items.length})</span>
        </button>

        <span className="text-slate-600">←</span>

        <button
          type="button"
          onClick={() => items.length > 0 && setActiveStep('checkout')}
          disabled={items.length === 0}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border transition-all ${
            activeStep === 'checkout'
              ? 'text-white border-emerald-500 shadow-md'
              : 'text-slate-400 border-white/10'
          }`}
          style={activeStep === 'checkout' ? { backgroundColor: brandColor } : {}}
        >
          <CreditCard className="size-4" />
          <span>2. إتمام الطلب والعنوان</span>
        </button>
      </div>

      {activeStep === 'cart' ? (
        /* STEP 1: CART VIEW */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Cart Items List (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <h3 className="text-lg font-black text-inherit">المنتجات في سلتك</h3>
            {items.length === 0 ? (
              <div className="text-center py-16 p-6 rounded-3xl bg-black/10 border border-white/10 space-y-3">
                <ShoppingBag className="size-12 mx-auto text-slate-500 opacity-60" />
                <h4 className="font-bold text-inherit">سلة التسوق فارغة حالياً</h4>
                <p className="text-xs text-slate-400">تصفح أقسام المتجر واختر ما يناسبك لإضافته للسلة</p>
                <button
                  type="button"
                  onClick={() => onNavigatePage?.('shop')}
                  className="px-5 py-2 rounded-xl text-xs font-black text-white shadow-md"
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
                    className="p-3.5 rounded-2xl bg-black/10 border border-white/10 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="size-16 rounded-xl object-cover shrink-0 border border-white/10"
                      />
                      <div className="overflow-hidden text-right">
                        <h5 className="font-bold text-xs md:text-sm text-inherit truncate">{item.product.name}</h5>
                        <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                          {formatIQD(item.product.price)} للقطعة
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-2 py-1">
                        <button
                          type="button"
                          onClick={() => updateQuantity(idx, 1)}
                          className="size-5 rounded-lg bg-white/10 hover:bg-white/20 text-inherit grid place-items-center"
                        >
                          <Plus className="size-3" />
                        </button>
                        <span className="font-mono font-bold text-xs px-1">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(idx, -1)}
                          className="size-5 rounded-lg bg-white/10 hover:bg-white/20 text-inherit grid place-items-center"
                        >
                          <Minus className="size-3" />
                        </button>
                      </div>

                      <span className="font-mono font-black text-sm text-inherit hidden sm:inline">
                        {formatIQD(item.product.price * item.quantity)}
                      </span>

                      <button
                        type="button"
                        onClick={() => updateQuantity(idx, -item.quantity)}
                        className="text-slate-400 hover:text-rose-400 p-1"
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
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">كود الخصم الترويجي</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="مثال: ZAEEM"
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-inherit font-mono uppercase focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-inherit"
                >
                  تطبيق
                </button>
              </div>
            </div>

            <div className="space-y-2 text-xs font-bold pt-2 border-t border-white/10">
              <div className="flex justify-between text-slate-400">
                <span>المجموع الفرعي:</span>
                <span className="font-mono text-inherit">{formatIQD(subtotal)}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-rose-400">
                  <span>الخصم المطبق:</span>
                  <span className="font-mono">- {formatIQD(couponDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-400">
                <span>أجور الشحن (أسطول الزعيم):</span>
                <span className="font-mono text-inherit">{formatIQD(shippingFee)}</span>
              </div>
              <div className="flex justify-between text-base font-black pt-2 border-t border-white/10">
                <span>المجموع الإجمالي:</span>
                <span className="font-mono text-emerald-400">{formatIQD(total)}</span>
              </div>
            </div>

            <button
              type="button"
              disabled={items.length === 0}
              onClick={() => setActiveStep('checkout')}
              className="w-full py-3 rounded-2xl text-xs font-black text-white shadow-lg transition-all hover:opacity-95 disabled:opacity-50"
              style={{ backgroundColor: brandColor }}
            >
              متابعة لإتمام الطلب (Checkout)
            </button>
          </div>
        </div>
      ) : (
        /* STEP 2: CHECKOUT VIEW */
        <form onSubmit={handleConfirmOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Shipping Details Form (8 cols) */}
          <div className="lg:col-span-8 p-6 rounded-3xl bg-black/10 border border-white/10 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="text-base font-black text-inherit">عنوان التوصيل في العراق</h3>
                <p className="text-xs text-slate-400">سيتم تسليم الشحنة عبر شركة الزعيم للشحن السريع</p>
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
                      {g.name} (توصيل: {formatIQD(g.deliveryFee)})
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
                  placeholder="المنطقة، الشارع، أقرب علامة مميزة..."
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
                    className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === pm.id
                        ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-md'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-inherit">{pm.title}</span>
                      {paymentMethod === pm.id && <Check className="size-3.5 text-emerald-400" />}
                    </div>
                    <p className="text-[10px] text-slate-400">{pm.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Checkout Review & Submit (4 cols) */}
          <div className="lg:col-span-4 p-5 rounded-3xl bg-black/15 border border-white/10 space-y-4">
            <h4 className="font-black text-sm text-inherit pb-2 border-b border-white/10">تأكيد الحجز النهائي</h4>

            <div className="space-y-2 text-xs font-bold">
              <div className="flex justify-between text-slate-400">
                <span>عدد الأصناف:</span>
                <span>{items.reduce((acc, i) => acc + i.quantity, 0)} قطع</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>المحافظة المحددة:</span>
                <span>{custGov}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>الشحن:</span>
                <span>{formatIQD(shippingFee)}</span>
              </div>
              <div className="flex justify-between text-base font-black pt-2 border-t border-white/10">
                <span>المجموع النهائي:</span>
                <span className="font-mono text-emerald-400">{formatIQD(total)}</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl text-xs font-black text-white shadow-xl transition-all hover:scale-[1.01]"
              style={{ backgroundColor: brandColor }}
            >
              تأكيد الطلب وإصدار البوليصة فوراً
            </button>

            <p className="text-[10px] text-slate-400 text-center leading-relaxed">
              بالنقر على تأكيد الطلب، سيتم إصدار بوليصة شحن رسمي من شركة الزعيم للشحن السريع مع التزام بفحص الشحنة قبل الاستلام.
            </p>
          </div>
        </form>
      )}
    </div>
  );
}

/**
 * 4. CUSTOMER ACCOUNT & PROFILE VIEW
 * Login / Register tabs, past orders status tracking
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
      <div className="max-w-4xl mx-auto py-8 px-4 md:px-8 space-y-6 animate-fadeIn" style={{ fontFamily }}>
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
            className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20"
          >
            تسجيل الخروج
          </button>
        </div>

        {/* Orders Tracking History */}
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
              <p className="text-slate-400 font-mono">بوليصة الزعيم: ZM-BG-4912 • بغداد</p>
            </div>
            <span className="font-mono font-black text-emerald-400">45,000 د.ع</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-10 px-4 animate-fadeIn" style={{ fontFamily }}>
      <div className="p-6 rounded-3xl bg-black/15 border border-white/10 shadow-2xl space-y-5">
        <div className="text-center space-y-1">
          <div className="size-12 rounded-2xl mx-auto text-white grid place-items-center shadow-lg" style={{ backgroundColor: brandColor }}>
            <User className="size-6" />
          </div>
          <h3 className="font-black text-lg text-inherit">حساب العميل في {storeName}</h3>
          <p className="text-xs text-slate-400">سجل الدخول لتتبع شحناتك وحفظ عناوينك المفضلة</p>
        </div>

        {/* Login / Register Mode Switcher */}
        <div className="flex bg-black/20 p-1 rounded-xl border border-white/10 text-xs font-bold">
          <button
            type="button"
            onClick={() => setAuthMode('login')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${authMode === 'login' ? 'bg-white/10 text-white shadow-sm' : 'text-slate-400'}`}
          >
            تسجيل الدخول
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('register')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${authMode === 'register' ? 'bg-white/10 text-white shadow-sm' : 'text-slate-400'}`}
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
            className="w-full py-3 rounded-xl text-xs font-black text-white shadow-lg transition-all hover:opacity-95"
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
 * 5. CONTACT US VIEW
 * Direct messaging form, hotline, WhatsApp quick link, Iraq distribution hub
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
    <div className="max-w-5xl mx-auto py-8 px-4 md:px-8 space-y-8 animate-fadeIn" style={{ fontFamily }}>
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
        {/* Contact Info Cards (5 cols) */}
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
            <div className="size-10 rounded-xl bg-blue-500/20 text-blue-400 grid place-items-center shrink-0">
              <Truck className="size-5" />
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block font-bold">شريك الشحن الرسمي</span>
              <span className="text-xs font-bold text-inherit">شركة الزعيم للشحن السريع لجميع محافظات العراق</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-black/10 border border-white/10 flex items-center gap-3">
            <div className="size-10 rounded-xl bg-amber-500/20 text-amber-400 grid place-items-center shrink-0">
              <MapPin className="size-5" />
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block font-bold">المقر ومستودع التوزيع</span>
              <span className="text-xs font-bold text-inherit">العراق — بغداد والمحافظات</span>
            </div>
          </div>
        </div>

        {/* Message Send Form (7 cols) */}
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
              className="w-full py-3 rounded-xl text-xs font-black text-white shadow-lg transition-all flex items-center justify-center gap-2"
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
