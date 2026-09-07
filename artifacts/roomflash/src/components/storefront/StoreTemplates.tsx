import React, { useState, useEffect } from 'react';
import {
  ShoppingBag, Search, Check, Star, ArrowLeft, Truck, ShieldCheck,
  Sparkles, ExternalLink, Heart, Clock, Phone, MapPin, X, CheckCircle2,
  Crown, Lock, AlertCircle, Zap
} from 'lucide-react';
import { formatIQD, IRAQ_GOVERNORATES } from '../../data/iraqData';
import { getStoredProducts, addStoredOrder, type StoreProduct } from '../../data/storeState';

// Import All 12 modular theme components
import { StoreClassicTheme } from './store-classic';
import { StoreAuritTheme } from './store-aurit';
import { StoreNovaTheme } from './store-nova';
import { StoreBrickTheme } from './store-brick';
import { StoreNovatrendTheme } from './store-novatrend';
import { StoreGizmoTheme } from './store-gizmo';
import { StoreSneakTheme } from './store-sneak';
import { StoreNexoraTheme } from './store-nexora';
import { StoreSproutTheme } from './store-sprout';
import { StoreWardrobeTheme } from './store-wardrobe';
import { StoreStrideTheme } from './store-stride';
import { StoreChicTheme } from './store-chic';
import { StoreManeTheme } from './store-mane';
import { StoreLoftoraTheme } from './store-loftora';

export type TemplateId =
  | 'store-sprout'
  | 'store-wardrobe'
  | 'store-stride'
  | 'store-chic'
  | 'store-mane'
  | 'store-loftora'
  | 'store-classic'
  | 'store-aurit'
  | 'store-nova'
  | 'store-brick'
  | 'store-novatrend'
  | 'store-gizmo'
  | 'store-sneak'
  | 'store-nexora'
  // Legacy backward-compatible aliases
  | 'sprout'
  | 'wardrobe'
  | 'stride'
  | 'chic'
  | 'mane'
  | 'loftora'
  | 'shoppingcart.1.2.7'
  | 'volt'
  | 'rose'
  | 'nitro'
  | 'sepia'
  | 'oret';

export interface TemplateConfig {
  id: TemplateId;
  name: string;
  nameEn: string;
  niche: string;
  categoryTag: string;
  badge: string;
  isPro: boolean;
  image: string;
  colorDot: string;
  palette: string[];
  description: string;
}

// Complete Themes Definitions (Matching Baseet reference screenshots & PRO catalog)
export const TEMPLATES_MAP: Record<string, TemplateConfig> = {
  'store-sprout': {
    id: 'store-sprout',
    name: 'سبراوت',
    nameEn: 'Sprout',
    niche: 'أزياء ملابس أطفال بروح الحديقة',
    categoryTag: 'أزياء أطفال',
    badge: 'ثيم أطفال وعائلة',
    isPro: false,
    image: '/templates/store-classic.jpg',
    colorDot: 'bg-[#588157]',
    palette: ['#344e41', '#588157', '#a3b18a', '#dad7cd'],
    description: 'واجهة ملابس أطفال بروح الحديقة — زيتوني وعاجي، وواجهة كولاج عائمة، وشبكة منتجات تحيط بقطعة مميزة.'
  },
  'store-wardrobe': {
    id: 'store-wardrobe',
    name: 'واردروب',
    nameEn: 'Wardrobe',
    niche: 'أزياء وملابس كاجوال يومية',
    categoryTag: 'أزياء',
    badge: 'تصميم مينيمال أحادي',
    isPro: false,
    image: '/templates/store-aurit.jpg',
    colorDot: 'bg-black',
    palette: ['#000000', '#333333', '#888888', '#e63946'],
    description: 'واجهة ملابس تبدأ بالمنتجات مباشرة بلا واجهة رئيسية — فسيفساء بانرات فوق شريط المزايا، ثم صفوف طويلة سهلة التصفح. أحادية اللون تماماً: الأحمر للتخفيضات فقط.'
  },
  'store-stride': {
    id: 'store-stride',
    name: 'سترايد',
    nameEn: 'Stride',
    niche: 'أحذية رياضية وسنيكرز وأناقة',
    categoryTag: 'أزياء',
    badge: 'متجر أحذية كثيف',
    isPro: true,
    image: '/templates/store-sneak.png',
    colorDot: 'bg-[#0052cc]',
    palette: ['#071322', '#0052cc', '#00c8ff', '#ffffff'],
    description: 'واجهة متجر أحذية، وأكثر الصفحات كثافة في المكتبة — واجهة مائلة مقسمة، ثم جدار ماركات، ثم بانرات ومقاطع نصية متتابعة. خط عريض جداً بلون كوبالت عميق.'
  },
  'store-chic': {
    id: 'store-chic',
    name: 'شيك',
    nameEn: 'Chic',
    niche: 'بوتيك أزياء نسائية وموضة راقية',
    categoryTag: 'أزياء',
    badge: 'واجهة مجلات وبوتيك',
    isPro: true,
    image: '/templates/store-nova.jpg',
    colorDot: 'bg-[#540b0e]',
    palette: ['#000000', '#ffffff', '#fff0f3', '#540b0e'],
    description: 'واجهة بوتيك تبدأ بشريط متحرك فوق الطية، ثم واجهة بأسلوب المجلات ومجموعتان مميزتان تحيطان بالصفحة. خط عريض عالي التباين على أبيض بلمسة وردية عميقة.'
  },
  'store-mane': {
    id: 'store-mane',
    name: 'مين',
    nameEn: 'Mane',
    niche: 'صالون ومستحضرات تجميل وعناية',
    categoryTag: 'تجميل',
    badge: 'صالون وعناية متقدمة',
    isPro: true,
    image: '/templates/store-novatrend.png',
    colorDot: 'bg-[#7209b7]',
    palette: ['#240046', '#7209b7', '#f72585', '#ffffff'],
    description: 'واجهة صالون مبنية على فكرة التحول — شريط فتات فوق الواجهة، وصور بورتريه متدرجة، وشريط مقارنة قبل/بعد في القلب. أرجواني عميق على أبيض.'
  },
  'store-loftora': {
    id: 'store-loftora',
    name: 'لوفتورا',
    nameEn: 'Loftora',
    niche: 'ديكور منزلي وأثاث وتحف',
    categoryTag: 'منزل',
    badge: 'ديكور وطين وبلوط',
    isPro: false,
    image: '/templates/store-classic.jpg',
    colorDot: 'bg-[#8b5a2b]',
    palette: ['#2b2927', '#8b5a2b', '#d4b996', '#f7f5f0'],
    description: 'واجهة ديكور منزلي مختارة — واجهة بمشهد غرفة، وفسيفساء بانرات بأحجام غير متساوية، وألوان حجرية وطينية بلمسة بلوط.'
  },
  'store-nova': {
    id: 'store-nova',
    name: 'إيشوب كيت (نوفا)',
    nameEn: 'eShopkit Marketplace',
    niche: 'إلكترونيات وأجهزة ذكية وملحقات',
    categoryTag: 'إلكترونيات',
    badge: 'ماركت بليس متكامل',
    isPro: false,
    image: '/templates/store-nova.jpg',
    colorDot: 'bg-purple-600',
    palette: ['#581c87', '#9333ea', '#f3e8ff', '#ffffff'],
    description: 'واجهة ماركت بليس إلكتروني تقني شامل مع شريط علوي بنفسجي، وبادج عروض فلاش، وبطاقات ترويجية جانبية لزيادة التحويل.'
  },
  'store-brick': {
    id: 'store-brick',
    name: 'شوب واي (بريك)',
    nameEn: 'ShopWay Mega Store',
    niche: 'معدات صناعية وميجا ستور شامل',
    categoryTag: 'إلكترونيات',
    badge: 'ميجا ستور متين',
    isPro: true,
    image: '/templates/store-brick.jpg',
    colorDot: 'bg-orange-500',
    palette: ['#111a28', '#ea580c', '#fbbf24', '#ffffff'],
    description: 'واجهة متجر شامل باللون الكحلي والبرتقالي، تحتوي على قائمة أقسام عمودية بشارات Hot وNew، ومربع العروض الأسبوعية الحصرية.'
  },
  'store-aurit': {
    id: 'store-aurit',
    name: 'شوب ويل (أوريت)',
    nameEn: 'ShopWell Mega Store',
    niche: 'أزياء وإلكترونيات وسلع استهلاكية',
    categoryTag: 'أزياء',
    badge: 'ميجا ستور أزرق',
    isPro: false,
    image: '/templates/store-aurit.jpg',
    colorDot: 'bg-blue-600',
    palette: ['#0f172a', '#2563eb', '#38bdf8', '#f8fafc'],
    description: 'واجهة ميجا ستور أزرق حديث مع شريط إعلانات أكواد الخصم، وقائمة تسوق حسب الأقسام، ودوائر المنتجات الأكثر طلباً.'
  },
  'store-classic': {
    id: 'store-classic',
    name: 'بوتيجا (كلاسيك)',
    nameEn: 'Botiga Minimalist',
    niche: 'عطور ومستحضرات فاخرة وتراثية',
    categoryTag: 'تجميل',
    badge: 'مينيمال فاخر',
    isPro: false,
    image: '/templates/store-classic.jpg',
    colorDot: 'bg-amber-600',
    palette: ['#1c1917', '#d97706', '#fef3c7', '#ffffff'],
    description: 'واجهة مينيمال ناصعة البياض مع هيدر مركزي أنيق وشبكة مقتنيات وتشكيلات حصرية مناسبة للعطور ومستحضرات التجميل الراقية.'
  },
  'store-novatrend': {
    id: 'store-novatrend',
    name: 'نوفا تريند',
    nameEn: 'NovaTrend Youth',
    niche: 'تريندات شبابية وموضة الشارع',
    categoryTag: 'أزياء',
    badge: 'تريند شبابي',
    isPro: true,
    image: '/templates/store-novatrend.png',
    colorDot: 'bg-pink-500',
    palette: ['#0f0c1b', '#ec4899', '#f43f5e', '#ffffff'],
    description: 'واجهة مخصصة لصيحات الموضة الجريئة والتريندات الشبابية مع خلفيات متدرجة داكنة.'
  },
  'store-gizmo': {
    id: 'store-gizmo',
    name: 'جيزمو سايبر تك',
    nameEn: 'Gizmo Cyber Tech',
    niche: 'إلكترونيات وأجهزة ذكية وملحقات تقنية',
    categoryTag: 'إلكترونيات',
    badge: 'سايبر تك متطور',
    isPro: true,
    image: '/templates/store-gizmo.png',
    colorDot: 'bg-cyan-400',
    palette: ['#070d18', '#06b6d4', '#3b82f6', '#ffffff'],
    description: 'تصميم مستقبلي بتقنية السايبر للإلكترونيات والأجهزة الذكية مع تأثيرات النيون.'
  },
  'store-sneak': {
    id: 'store-sneak',
    name: 'سنيك سبورت',
    nameEn: 'Sneak Athletic',
    niche: 'سنيكرز وملابس رياضية حيوية',
    categoryTag: 'أزياء',
    badge: 'رياضة وحيوية',
    isPro: true,
    image: '/templates/store-sneak.png',
    colorDot: 'bg-red-500',
    palette: ['#0d0707', '#dc2626', '#f97316', '#ffffff'],
    description: 'واجهة رياضية ديناميكية لعشاق السنيكرز والملابس الرياضية باللونين الأحمر والأسود.'
  },
  'store-nexora': {
    id: 'store-nexora',
    name: 'نيكسورا الملكي',
    nameEn: 'Nexora Royal VIP',
    niche: 'فخامة مطلقة وأجهزة ذكية وإكسسوارات VIP',
    categoryTag: 'إلكترونيات',
    badge: 'فخامة VIP',
    isPro: true,
    image: '/templates/store-nexora.png',
    colorDot: 'bg-indigo-500',
    palette: ['#080816', '#6366f1', '#f59e0b', '#ffffff'],
    description: 'واجهة ملكية استثنائية لأصحاب المنتجات الفاخرة وعالية القيمة بدرجات الإنديجو والذهبي.'
  },
};

// Helper: Normalize legacy or unknown template IDs
export function normalizeTemplateId(id?: string): TemplateId {
  if (!id) return 'store-sprout';
  const clean = id.toLowerCase().trim();

  if (TEMPLATES_MAP[clean]) {
    return clean as TemplateId;
  }

  switch (clean) {
    case 'sprout':
      return 'store-sprout';
    case 'wardrobe':
      return 'store-wardrobe';
    case 'stride':
      return 'store-stride';
    case 'chic':
      return 'store-chic';
    case 'mane':
      return 'store-mane';
    case 'loftora':
      return 'store-loftora';
    case 'shoppingcart.1.2.7':
    case 'classic':
    case 'sepia':
      return 'store-classic';
    case 'volt':
      return 'store-gizmo';
    case 'rose':
    case 'nova':
      return 'store-nova';
    case 'nitro':
      return 'store-sneak';
    case 'oret':
    case 'aurit':
      return 'store-aurit';
    case 'brick':
      return 'store-brick';
    case 'novatrend':
      return 'store-novatrend';
    case 'gizmo':
      return 'store-gizmo';
    case 'sneak':
      return 'store-sneak';
    case 'nexora':
      return 'store-nexora';
    default:
      return 'store-sprout';
  }
}

// Check if merchant has an active PRO subscription
export function isMerchantPro(): boolean {
  try {
    const rawUser = localStorage.getItem('zaeem_user');
    const user = rawUser ? JSON.parse(rawUser) : null;
    const plan = (
      user?.plan ||
      user?.subscription ||
      user?.tier ||
      localStorage.getItem('zaeem_plan') ||
      localStorage.getItem('zaeem_subscription') ||
      'free'
    ).toLowerCase();

    return plan === 'pro' || plan === 'enterprise' || plan === 'vip' || plan === 'premium';
  } catch {
    return false;
  }
}

export interface StoreTemplatesProps {
  storeName?: string;
  subdomain?: string;
  activeTemplateId?: TemplateId;
  standalone?: boolean;
  onTemplateChange?: (id: TemplateId) => void;
  customProduct?: any;
  products?: any[];
  storeCode?: string;
  logoUrl?: string;
}

export function StoreTemplates({
  storeName = 'متجر الزعيم',
  subdomain = 'alzaeem',
  activeTemplateId = 'store-sprout',
  standalone = false,
  onTemplateChange,
  customProduct,
  products,
  storeCode,
  logoUrl
}: StoreTemplatesProps) {
  const [currentThemeId, setCurrentThemeId] = useState<TemplateId>(() => normalizeTemplateId(activeTemplateId));
  const [cartCount, setCartCount] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductModal, setSelectedProductModal] = useState<StoreProduct | null>(null);
  const [orderSuccessModal, setOrderSuccessModal] = useState(false);

  // Pro Upgrade Warning Modal
  const [showProModal, setShowProModal] = useState(false);
  const [selectedProTheme, setSelectedProTheme] = useState<TemplateConfig | null>(null);

  // Sync activeTemplateId prop changes
  useEffect(() => {
    if (activeTemplateId) {
      setCurrentThemeId(normalizeTemplateId(activeTemplateId));
    }
  }, [activeTemplateId]);

  // Form states inside order modal
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custCity, setCustCity] = useState('بغداد');
  const [custAddress, setCustAddress] = useState('');
  const [lastPlacedOrder, setLastPlacedOrder] = useState<any>(null);

  const baseProducts = getStoredProducts();

  const productsList: StoreProduct[] = Array.isArray(products) && products.length > 0
    ? products
    : baseProducts.length > 0
    ? baseProducts
    : [];

  const fullDomain = `${subdomain}.za3em.shop`;

  const handleSelectTheme = (id: TemplateId) => {
    const normId = normalizeTemplateId(id);
    const themeConfig = TEMPLATES_MAP[normId];

    if (themeConfig?.isPro && !isMerchantPro()) {
      setSelectedProTheme(themeConfig);
      setShowProModal(true);
      return;
    }

    setCurrentThemeId(normId);
    try {
      const raw = localStorage.getItem('zaeem_store_data') || '{}';
      const parsed = JSON.parse(raw);
      parsed.selectedTheme = normId;
      parsed.templateId = normId;
      localStorage.setItem('zaeem_store_data', JSON.stringify(parsed));
      window.dispatchEvent(new CustomEvent('zaeem_store_updated'));
    } catch {}

    if (onTemplateChange) {
      onTemplateChange(normId);
    }
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName || !custPhone || !selectedProductModal) return;

    const stored = addStoredOrder({
      customerName: custName.trim(),
      customerPhone: custPhone.trim(),
      customerCity: custCity,
      address: custAddress.trim() ? `${custCity} — ${custAddress.trim()}` : `العراق — ${custCity}`,
      total: selectedProductModal.price,
      shippingCost: 5000,
      itemsCount: 1,
      status: 'pending',
      paymentMethod: 'cod',
      items: [{
        productName: selectedProductModal.name,
        quantity: 1,
        unitPrice: selectedProductModal.price
      }]
    });

    setLastPlacedOrder(stored);
    setOrderSuccessModal(true);
    setSelectedProductModal(null);
    setCartCount(cartCount + 1);
    setCustName('');
    setCustPhone('');
    setCustAddress('');
  };

  const filteredProducts = productsList.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = selectedCategory === 'الكل' || p.category.includes(selectedCategory);
    return matchSearch && matchCat;
  });

  const themeProps = {
    storeName,
    subdomain,
    fullDomain,
    products: productsList,
    filteredProducts,
    cartCount,
    selectedCategory,
    onSelectCategory: setSelectedCategory,
    searchQuery,
    onSearchChange: setSearchQuery,
    onQuickBuy: (p: StoreProduct) => setSelectedProductModal(p),
    onAddToCart: (p: StoreProduct) => setCartCount(c => c + 1),
    logoUrl,
    storeCode
  };

  // Render matching theme component
  const renderThemeComponent = () => {
    switch (currentThemeId) {
      case 'store-sprout':
      case 'sprout':
        return <StoreSproutTheme {...themeProps} />;

      case 'store-wardrobe':
      case 'wardrobe':
        return <StoreWardrobeTheme {...themeProps} />;

      case 'store-stride':
      case 'stride':
        return <StoreStrideTheme {...themeProps} />;

      case 'store-chic':
      case 'chic':
        return <StoreChicTheme {...themeProps} />;

      case 'store-mane':
      case 'mane':
        return <StoreManeTheme {...themeProps} />;

      case 'store-loftora':
      case 'loftora':
        return <StoreLoftoraTheme {...themeProps} />;

      case 'store-classic':
      case 'shoppingcart.1.2.7':
        return <StoreClassicTheme {...themeProps} />;

      case 'store-aurit':
      case 'oret':
        return <StoreAuritTheme {...themeProps} />;

      case 'store-nova':
      case 'rose':
        return <StoreNovaTheme {...themeProps} />;

      case 'store-brick':
      case 'sepia':
        return <StoreBrickTheme {...themeProps} />;

      case 'store-novatrend':
        return <StoreNovatrendTheme {...themeProps} />;

      case 'store-gizmo':
      case 'volt':
        return <StoreGizmoTheme {...themeProps} />;

      case 'store-sneak':
      case 'nitro':
        return <StoreSneakTheme {...themeProps} />;

      case 'store-nexora':
        return <StoreNexoraTheme {...themeProps} />;

      default:
        return <StoreSproutTheme {...themeProps} />;
    }
  };

  return (
    <div className="relative min-h-[100dvh]">
      {/* Live Switcher Bar for Merchant Testing */}
      {!standalone && (
        <div className="bg-slate-950 text-white border-b border-slate-800 px-4 py-2.5 sticky top-0 z-50 flex flex-wrap items-center justify-between gap-3 shadow-xl">
          <div className="flex items-center gap-3">
            <span className="size-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-black text-slate-200">
              اختر القالب للتطبيق فوراً على ({fullDomain}):
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
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
                  <span className={`size-2.5 rounded-full ${t.colorDot}`} />
                  <span>{t.name}</span>
                  {t.isPro ? (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-amber-500 text-slate-950 flex items-center gap-0.5">
                      <Crown className="size-2.5" /> PRO
                    </span>
                  ) : (
                    <span className="text-[10px] opacity-70">(مجاني)</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* RENDER THE SELECTED THEME VIEW */}
      {renderThemeComponent()}

      {/* PRO UPGRADE MODAL */}
      {showProModal && selectedProTheme && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-3xl border border-amber-500/50 bg-slate-900 p-6 sm:p-7 text-center space-y-4 shadow-2xl animate-in zoom-in-95 relative">
            <button
              onClick={() => setShowProModal(false)}
              className="absolute top-4 left-4 text-slate-400 hover:text-white"
            >
              <X className="size-5" />
            </button>

            <div className="size-16 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 grid place-items-center mx-auto shadow-lg">
              <Crown className="size-8" />
            </div>

            <div className="space-y-1">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-950 border border-amber-700 text-amber-300 inline-block">
                ثيم خاص باشتراك PRO
              </span>
              <h3 className="font-extrabold text-xl text-white pt-2">
                قالب {selectedProTheme.name}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                هذا الثيم مخصص للمشتركين في باقة الزعيم PRO. يرجى ترقية باقتك للاستفادة من كامل الميزات الاحترافية والتصاميم الحصرية.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <a
                href="#/subscriptions"
                onClick={() => setShowProModal(false)}
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-105"
              >
                <Crown className="size-4" />
                <span>ترقية الحساب إلى باقة PRO الآن</span>
              </a>

              <button
                onClick={() => setShowProModal(false)}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all"
              >
                إلغاء والتراجع
              </button>
            </div>
          </div>
        </div>
      )}

      {/* COD CHECKOUT MODAL */}
      {selectedProductModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-3xl border border-slate-800 bg-slate-900 p-6 text-right space-y-4 shadow-2xl relative">
            <button
              onClick={() => setSelectedProductModal(null)}
              className="absolute top-4 left-4 text-slate-400 hover:text-white"
            >
              <X className="size-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <img src={selectedProductModal.imageUrl || '/templates/store-classic.jpg'} className="size-12 rounded-xl object-cover" />
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

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">العنوان بالتفصيل *</label>
                <input
                  type="text"
                  required
                  value={custAddress}
                  onChange={(e) => setCustAddress(e.target.value)}
                  placeholder="المنطقة، الشارع، أقرب نقطة دالة"
                  className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="p-3 rounded-xl bg-teal-950/40 border border-teal-800/60 text-xs text-teal-200">
                الدفع عند الاستلام مع شركة الزعيم للشحن في {custCity}.
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl text-xs font-black bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg"
              >
                تأكيد طلب الشراء والدفع عند الاستلام
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ORDER SUCCESS POPUP */}
      {orderSuccessModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-3xl border border-emerald-500/50 bg-slate-900 p-6 sm:p-7 text-center space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="size-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 grid place-items-center mx-auto">
              <CheckCircle2 className="size-9" />
            </div>
            <h3 className="font-extrabold text-xl text-white">تم تأكيد طلبك وإصدار البوليصة بنجاح!</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              تم تسجيل طلبك في لوحة التحكم وتوليد بوليصة الشحن مع شركة الزعيم للشحن السريع لجميع محافظات العراق.
            </p>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-right space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">رقم الطلب:</span>
                <span className="font-mono font-black text-teal-400">{lastPlacedOrder?.number}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">رقم بوليصة الشحن:</span>
                <span className="font-mono font-black text-emerald-400">{lastPlacedOrder?.trackingNumber}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">شركة الشحن:</span>
                <span className="font-bold text-white">شركة الزعيم للشحن السريع</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">المبلغ المطلوب عند الاستلام:</span>
                <span className="font-mono font-black text-emerald-400">
                  {lastPlacedOrder ? formatIQD(lastPlacedOrder.total) : ''}
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <a
                href={`#/track?q=${lastPlacedOrder?.trackingNumber || lastPlacedOrder?.number}`}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <Truck className="size-4" />
                <span>تتبع حالة الشحنة مباشرةً</span>
              </a>

              <button
                onClick={() => setOrderSuccessModal(false)}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all"
              >
                متابعة التسوق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StoreTemplates;
