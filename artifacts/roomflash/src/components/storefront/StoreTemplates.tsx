import { useState, useEffect } from 'react';
import {
  ShoppingBag, Search, Check, Star, ArrowLeft, Truck, ShieldCheck,
  Sparkles, ExternalLink, Heart, Clock, Phone, MapPin, X, CheckCircle2
} from 'lucide-react';
import { formatIQD, IRAQ_GOVERNORATES } from '../../data/iraqData';
import { getStoredProducts, addStoredOrder, type StoreProduct } from '../../data/storeState';

export type TemplateId = 'shoppingcart.1.2.7' | 'volt' | 'rose' | 'nitro' | 'sepia' | 'oret';

export interface TemplateConfig {
  id: TemplateId;
  name: string;
  nameEn: string;
  niche: string;
  badge: string;
  bgClass: string;
  cardClass: string;
  headerClass: string;
  accentBtnClass: string;
  accentTextClass: string;
  badgeClass: string;
  heroBannerTitle: string;
  heroBannerSubtitle: string;
  heroImage: string;
}

export const TEMPLATES_MAP: Record<TemplateId, TemplateConfig> = {
  'shoppingcart.1.2.7': {
    id: 'shoppingcart.1.2.7',
    name: 'shoppingcart.1.2.7',
    nameEn: 'Shopping Cart v1.2.7 (Default)',
    niche: 'الافتراضي الشامل • سلة التسوق',
    badge: 'القالب الافتراضي • shoppingcart.1.2.7',
    bgClass: 'bg-[#090d16] text-white font-sans',
    cardClass: 'bg-[#0d1322] border-teal-500/40 text-white shadow-xl',
    headerClass: 'bg-[#0d1322]/90 border-teal-500/40 backdrop-blur-md',
    accentBtnClass: 'bg-teal-500 hover:bg-teal-400 text-slate-950 font-black',
    accentTextClass: 'text-teal-400',
    badgeClass: 'bg-teal-950 border-teal-800 text-teal-300',
    heroBannerTitle: 'قالب shoppingcart.1.2.7 الافتراضي الشامل',
    heroBannerSubtitle: 'مربوط تلقائياً بالنطاق الفرعي والدفع عند الاستلام مع خدمات الشحن السريع في جميع المحافظات',
    heroImage: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&auto=format&fit=crop&q=80'
  },
  volt: {
    id: 'volt',
    name: 'فولت',
    nameEn: 'Volt Tech',
    niche: 'إلكترونيات وتقنية',
    badge: 'داكن عصري • نيون',
    bgClass: 'bg-[#090d16] text-white font-sans',
    cardClass: 'bg-[#0d1322] border-slate-800 text-white',
    headerClass: 'bg-[#0d1322]/90 border-slate-800 backdrop-blur-md',
    accentBtnClass: 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black',
    accentTextClass: 'text-emerald-400',
    badgeClass: 'bg-emerald-950 border-emerald-800 text-emerald-300',
    heroBannerTitle: 'جيل جديد من التقنية بين يديك',
    heroBannerSubtitle: 'سماعات، ساعات ذكية وإلكترونيات فاخرة بتوصيل سريع لجميع المحافظات',
    heroImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'
  },
  rose: {
    id: 'rose',
    name: 'روز أتيليه',
    nameEn: 'Rose Atelier',
    niche: 'أزياء وعبايات وتجميل',
    badge: 'كلاسيك فاخر • بيج ووردي',
    bgClass: 'bg-[#faf6f3] text-slate-900 font-sans',
    cardClass: 'bg-white border-rose-100 text-slate-900 shadow-sm',
    headerClass: 'bg-white/90 border-rose-100 backdrop-blur-md',
    accentBtnClass: 'bg-rose-700 hover:bg-rose-800 text-white font-bold',
    accentTextClass: 'text-rose-700',
    badgeClass: 'bg-rose-50 border-rose-200 text-rose-800',
    heroBannerTitle: 'أناقتكِ هي عنوان تميزكِ',
    heroBannerSubtitle: 'أحدث تشكيلة من الأزياء والعبايات والعطور الملكية المميزة',
    heroImage: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&auto=format&fit=crop&q=80'
  },
  nitro: {
    id: 'nitro',
    name: 'نيترو',
    nameEn: 'Nitro Sports',
    niche: 'رياضة وفتنس وملابس شارع',
    badge: 'رياضي داكن • أحمر نيون',
    bgClass: 'bg-[#0c0808] text-white font-sans',
    cardClass: 'bg-[#140c0c] border-red-950 text-white',
    headerClass: 'bg-[#140c0c]/90 border-red-950 backdrop-blur-md',
    accentBtnClass: 'bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-wider',
    accentTextClass: 'text-red-500',
    badgeClass: 'bg-red-950 border-red-800 text-red-300',
    heroBannerTitle: 'تجاوز حدودك مع نترو الرياضي',
    heroBannerSubtitle: 'معدات لياقة بدنية وملابس رياضية حادة الأداء أعلى جودة',
    heroImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80'
  },
  sepia: {
    id: 'sepia',
    name: 'هاير سيبيا',
    nameEn: 'Higher Sepia',
    niche: 'ساعات وعطور وجلديات',
    badge: 'تراثي راقي • ذهبي وسيبيا',
    bgClass: 'bg-[#17120c] text-amber-50 font-sans',
    cardClass: 'bg-[#211a12] border-amber-900/40 text-amber-100',
    headerClass: 'bg-[#211a12]/90 border-amber-900/40 backdrop-blur-md',
    accentBtnClass: 'bg-amber-600 hover:bg-amber-500 text-slate-950 font-black',
    accentTextClass: 'text-amber-400',
    badgeClass: 'bg-amber-950 border-amber-800 text-amber-300',
    heroBannerTitle: 'أصالة التراث وفخامة المقتنيات',
    heroBannerSubtitle: 'ساعات أوتوماتيكية، عود ملكي وحقائب جلد طبيعي فاخرة',
    heroImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'
  },
  oret: {
    id: 'oret',
    name: 'أوريت إكسبريس',
    nameEn: 'Oret Express',
    niche: 'متجر عام وهدايا سرعة',
    badge: 'عصري ملون • سايبر',
    bgClass: 'bg-[#0f172a] text-white font-sans',
    cardClass: 'bg-[#1e293b] border-slate-700 text-white',
    headerClass: 'bg-[#1e293b]/90 border-slate-700 backdrop-blur-md',
    accentBtnClass: 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black',
    accentTextClass: 'text-cyan-400',
    badgeClass: 'bg-cyan-950 border-cyan-800 text-cyan-300',
    heroBannerTitle: 'كل ما تحتاجه في مكان واحد',
    heroBannerSubtitle: 'عروض سريعة وشحن مباشر لجميع المحافظات والدفع عند الاستلام',
    heroImage: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80'
  }
};

interface StoreTemplatesProps {
  storeName?: string;
  subdomain?: string;
  activeTemplateId?: TemplateId;
  standalone?: boolean;
  onTemplateChange?: (id: TemplateId) => void;
  customProduct?: {
    id?: number | string;
    title?: string;
    name?: string;
    description?: string;
    price: number;
    compareAtPrice?: number;
    imageUrl?: string;
    image?: string;
    category?: string;
  };
  products?: any[];
  storeCode?: string;
  logoUrl?: string;
}

export function StoreTemplates({
  storeName = 'متجر الزعيم الذهبي',
  subdomain = 'fady',
  activeTemplateId = 'shoppingcart.1.2.7',
  standalone = false,
  onTemplateChange,
  customProduct,
  products,
  storeCode,
  logoUrl
}: StoreTemplatesProps) {
  const [currentThemeId, setCurrentThemeId] = useState<TemplateId>(activeTemplateId);
  const [cartCount, setCartCount] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductModal, setSelectedProductModal] = useState<StoreProduct | null>(null);
  const [orderSuccessModal, setOrderSuccessModal] = useState(false);

  // Sync activeTemplateId prop changes
  useEffect(() => {
    if (activeTemplateId && TEMPLATES_MAP[activeTemplateId]) {
      setCurrentThemeId(activeTemplateId);
    }
  }, [activeTemplateId]);

  // Form states inside order modal
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custCity, setCustCity] = useState('بغداد');

  const baseProducts = getStoredProducts();

  // Normalize incoming props.products if supplied
  const incomingList: StoreProduct[] = Array.isArray(products) && products.length > 0
    ? products.map((p: any, idx: number) => ({
        id: p.id || (idx + 1),
        name: p.name || p.title || `منتج ${idx + 1}`,
        sku: p.sku || `PRD-${idx + 1}`,
        price: Number(p.price) || 45000,
        compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : Math.round((Number(p.price) || 45000) * 1.3),
        imageUrl: p.imageUrl || p.image || '',
        images: Array.isArray(p.images) && p.images.length > 0 ? p.images : (p.imageUrl || p.image ? [p.imageUrl || p.image] : []),
        category: p.category || 'عام',
        stock: p.stock !== undefined ? Number(p.stock) : 20,
        lowStockThreshold: p.lowStockThreshold || 3,
        status: p.status || 'active',
        description: p.description || '',
      }))
    : [];

  let productsList: StoreProduct[] = [];
  if (incomingList.length > 0) {
    productsList = [...incomingList];
    // If customProduct is provided and not yet in incomingList, prepend it
    if (customProduct && (customProduct.title || customProduct.name)) {
      const cName = (customProduct.title || customProduct.name || '').trim();
      if (!productsList.some(p => p.name === cName)) {
        productsList.unshift({
          id: typeof customProduct.id === 'number' ? customProduct.id : 999,
          name: cName,
          sku: 'PRD-999',
          price: Number(customProduct.price) || 45000,
          compareAtPrice: Number(customProduct.compareAtPrice) || Math.round((Number(customProduct.price) || 45000) * 1.3),
          imageUrl: customProduct.imageUrl || (customProduct as any).image || '',
          category: customProduct.category || 'المنتجات المميزة',
          stock: 35,
          lowStockThreshold: 5,
          status: 'active',
          description: customProduct.description || 'منتج أصلي عالي الجودة مع شحن سريع لجميع محافظات العراق والدفع عند الاستلام.'
        });
      }
    }
  } else if (baseProducts.length > 0) {
    productsList = [...baseProducts];
    if (customProduct && (customProduct.title || customProduct.name)) {
      const cName = (customProduct.title || customProduct.name || '').trim();
      if (!productsList.some(p => p.name === cName)) {
        productsList.unshift({
          id: typeof customProduct.id === 'number' ? customProduct.id : 999,
          name: cName,
          sku: 'PRD-999',
          price: Number(customProduct.price) || 45000,
          compareAtPrice: Number(customProduct.compareAtPrice) || Math.round((Number(customProduct.price) || 45000) * 1.3),
          imageUrl: customProduct.imageUrl || (customProduct as any).image || '',
          category: customProduct.category || 'المنتجات المميزة',
          stock: 35,
          lowStockThreshold: 5,
          status: 'active',
          description: customProduct.description || 'منتج أصلي عالي الجودة مع شحن سريع لجميع محافظات العراق والدفع عند الاستلام.'
        });
      }
    }
  } else if (customProduct && (customProduct.title || customProduct.name)) {
    productsList = [{
      id: typeof customProduct.id === 'number' ? customProduct.id : 999,
      name: customProduct.title || customProduct.name || 'المنتج المختار',
      sku: 'PRD-999',
      price: Number(customProduct.price) || 45000,
      compareAtPrice: Number(customProduct.compareAtPrice) || Math.round((Number(customProduct.price) || 45000) * 1.3),
      imageUrl: customProduct.imageUrl || (customProduct as any).image || '',
      category: customProduct.category || 'المنتجات المميزة',
      stock: 35,
      lowStockThreshold: 5,
      status: 'active',
      description: customProduct.description || 'منتج أصلي عالي الجودة مع شحن سريع لجميع محافظات العراق والدفع عند الاستلام.'
    }];
  }

  const theme = TEMPLATES_MAP[currentThemeId] || TEMPLATES_MAP.volt;
  const fullDomain = `${subdomain}.za3em.shop`;

  const handleSelectTheme = (id: TemplateId) => {
    setCurrentThemeId(id);
    if (onTemplateChange) onTemplateChange(id);
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName || !custPhone || !selectedProductModal) return;

    // Save order to merchant dashboard with sequential order0001, order0002...
    addStoredOrder({
      customerName: custName,
      customerPhone: custPhone,
      customerCity: custCity,
      address: `العراق — ${custCity}`,
      total: selectedProductModal.price,
      itemsCount: 1,
      status: 'pending',
      paymentMethod: 'cod',
      items: [{
        productName: selectedProductModal.name,
        quantity: 1,
        unitPrice: selectedProductModal.price
      }]
    });

    setOrderSuccessModal(true);
    setSelectedProductModal(null);
    setCartCount(cartCount + 1);
    setCustName('');
    setCustPhone('');
  };

  const filteredProducts = productsList.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = selectedCategory === 'الكل' || p.category.includes(selectedCategory);
    return matchSearch && matchCat;
  });

  return (
    <div className={`min-h-[100dvh] ${theme.bgClass} transition-colors duration-300 select-none pb-16 relative`}>
      {/* ========================================================================= */}
      {/* TOP LIVE TEMPLATE SWITCHER BAR (Merchant Control) */}
      {/* ========================================================================= */}
      {!standalone && (
        <div className="bg-slate-950 text-white border-b border-slate-800 px-4 py-3 sticky top-0 z-50 flex flex-wrap items-center justify-between gap-3 shadow-xl">
          <div className="flex items-center gap-3">
            <span className="size-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-black text-slate-200">اختر القالب للتطبيق فوراً على ({fullDomain}):</span>
          </div>

        {/* 5 Theme Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {(Object.keys(TEMPLATES_MAP) as TemplateId[]).map((tId) => {
            const t = TEMPLATES_MAP[tId];
            const isSel = currentThemeId === tId;
            return (
              <button
                key={tId}
                type="button"
                onClick={() => handleSelectTheme(tId)}
                className={`px-3 py-1.5 rounded-full text-xs font-extrabold transition-all border shrink-0 flex items-center gap-1.5 ${
                  isSel
                    ? 'bg-emerald-600 text-white border-emerald-400 shadow-md scale-105'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-600'
                }`}
              >
                <span>{t.name}</span>
                <span className="text-[10px] opacity-70">({t.niche})</span>
              </button>
            );
          })}
        </div>
      </div>
      )}

      {/* ========================================================================= */}
      {/* STORE HEADER */}
      {/* ========================================================================= */}
      <header className={`border-b ${theme.headerClass} px-4 md:px-8 py-4 sticky top-14 z-40`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo & Domain Tag */}
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-emerald-600 text-white font-black grid place-items-center text-lg shadow-md">
              {storeName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="font-extrabold text-base leading-none">{storeName}</h1>
              <span className="text-[11px] font-mono font-bold opacity-75 dir-ltr block mt-1">
                https://{fullDomain}
              </span>
            </div>
          </div>

          {/* Search & Cart */}
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block w-64">
              <Search className="absolute right-3 top-2.5 size-4 opacity-50" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن منتج..."
                className="w-full h-9 pr-9 pl-3 rounded-full border border-slate-700/50 bg-slate-900/30 text-xs focus:outline-none"
              />
            </div>

            <button
              type="button"
              className={`flex items-center gap-2 px-4 py-2 rounded-full ${theme.accentBtnClass} shadow-md`}
            >
              <ShoppingBag className="size-4" />
              <span className="text-xs">السلة ({cartCount})</span>
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* HERO BANNER SECTION */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mt-6">
        <div className={`relative rounded-3xl overflow-hidden ${theme.cardClass} p-8 md:p-12 min-h-[300px] flex items-center border shadow-xl`}>
          <img
            src={theme.heroImage}
            alt={theme.name}
            className="absolute inset-0 size-full object-cover opacity-20"
          />
          <div className="relative z-10 max-w-xl space-y-4 text-right">
            <span className={`inline-block px-3.5 py-1 rounded-full text-xs font-bold border ${theme.badgeClass}`}>
              ● متجر مباشر على النطاق الحقيقي {fullDomain}
            </span>
            <h2 className="text-3xl md:text-5xl font-black leading-tight">
              {theme.heroBannerTitle}
            </h2>
            <p className="text-xs md:text-sm opacity-80 leading-relaxed">
              {theme.heroBannerSubtitle}
            </p>
            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                className={`px-6 py-3 rounded-2xl text-xs font-black ${theme.accentBtnClass} shadow-lg`}
              >
                تسوق التشكيلة الآن ←
              </button>
              <span className="text-xs font-bold opacity-75 flex items-center gap-1">
                <Truck className="size-4 text-emerald-400" /> توصيل لجميع المحافظات (IQD)
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* CATEGORIES CAROUSEL */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mt-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {['الكل', 'أزياء رجالي', 'عطور وتجميل', 'إكسسوارات وساعات', 'إلكترونيات', 'حقائب ومستلزمات'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all border shrink-0 ${
                selectedCategory === cat
                  ? `${theme.accentBtnClass} border-transparent`
                  : 'bg-slate-900/40 border-slate-700/50 hover:border-slate-500 opacity-80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* PRODUCTS GRID */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-extrabold text-lg">المنتجات المعروضة في المتجر</h3>
          <span className="text-xs font-mono opacity-70">{filteredProducts.length} منتج متاح</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className={`rounded-3xl border ${theme.cardClass} overflow-hidden shadow-lg flex flex-col justify-between group transition-all hover:scale-[1.01]`}
            >
              <div>
                <div className="h-60 bg-slate-800 relative overflow-hidden">
                  <img src={p.imageUrl} alt={p.name} className="size-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-3 right-3 text-[10px] font-black bg-slate-950/80 backdrop-blur-md text-white px-2.5 py-1 rounded-full border border-white/20">
                    {p.category}
                  </span>
                  <span className="absolute top-3 left-3 text-[10px] font-black bg-emerald-600 text-white px-2.5 py-1 rounded-full">
                    شحن لجميع المحافظات
                  </span>
                </div>

                <div className="p-5 text-right space-y-2">
                  <h4 className="font-black text-base line-clamp-1">{p.name}</h4>
                  <p className="text-xs opacity-75 line-clamp-2 leading-relaxed">{p.description}</p>
                </div>
              </div>

              <div className="p-5 border-t border-slate-800/50 flex items-center justify-between">
                <div>
                  <span className="text-base font-black font-mono block">{formatIQD(p.price)}</span>
                  {p.compareAtPrice && (
                    <span className="text-xs opacity-50 line-through font-mono">{formatIQD(p.compareAtPrice)}</span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedProductModal(p)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-black ${theme.accentBtnClass} shadow-md flex items-center gap-1.5`}
                >
                  <span>شراء فوري</span>
                  <ArrowLeft className="size-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* ORDER/CHECKOUT MODAL */}
      {/* ========================================================================= */}
      {selectedProductModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`max-w-md w-full rounded-3xl border ${theme.cardClass} p-6 text-right space-y-4 shadow-2xl relative`}>
            <button
              onClick={() => setSelectedProductModal(null)}
              className="absolute top-4 left-4 text-slate-400 hover:text-white"
            >
              <X className="size-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <img src={selectedProductModal.imageUrl} className="size-12 rounded-xl object-cover" />
              <div>
                <h4 className="font-extrabold text-sm text-white">{selectedProductModal.name}</h4>
                <p className="text-xs font-mono font-black text-emerald-400">{formatIQD(selectedProductModal.price)}</p>
              </div>
            </div>

            <form onSubmit={handlePlaceOrder} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">اسمك الكامل *</label>
                <input
                  type="text"
                  required
                  value={custName}
                  onChange={(e) => setCustName(e.target.value)}
                  placeholder="أحمد محمد"
                  className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 block">رقم الهاتف *</label>
                  <input
                    type="tel"
                    required
                    value={custPhone}
                    onChange={(e) => setCustPhone(e.target.value)}
                    placeholder="+964 770 000 0000"
                    dir="ltr"
                    className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 block">المحافظة *</label>
                  <select
                    value={custCity}
                    onChange={(e) => setCustCity(e.target.value)}
                    className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs font-bold text-white focus:border-emerald-500 focus:outline-none"
                  >
                    {IRAQ_GOVERNORATES.map((g) => (
                      <option key={g} value={g}>🇮🇶 {g}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-teal-950/40 border border-teal-800/60 text-xs text-teal-200">
                الدفع عند الاستلام مع شركة الزعيم للشحن في {custCity}.
              </div>

              <button
                type="submit"
                className={`w-full py-3.5 rounded-2xl text-xs font-black ${theme.accentBtnClass} shadow-lg`}
              >
                تأكيد طلب الشراء والدفع عند الاستلام
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ORDER SUCCESS POPUP */}
      {/* ========================================================================= */}
      {orderSuccessModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-sm w-full rounded-3xl border border-emerald-500/40 bg-slate-900 p-6 text-center space-y-4 shadow-2xl">
            <CheckCircle2 className="size-12 text-emerald-400 mx-auto" />
            <h3 className="font-extrabold text-lg text-white">تم استلام طلبك بنجاح!</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              سيقوم مندوب شركة الزعيم للشحن بالاتصال بك قريباً لتأكيد الموعد والتوصيل.
            </p>
            <button
              onClick={() => setOrderSuccessModal(false)}
              className="w-full py-3 bg-emerald-600 text-white font-black text-xs rounded-2xl"
            >
              متابعة التسوق
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
