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

export interface ThemeCustomizationProps {
  brandColor?: string;
  appearanceMode?: 'system' | 'dark' | 'light';
  defaultLanguage?: 'ar' | 'en';
  heroTitle?: string;
  heroSubtitle?: string;
  heroButtonText?: string;
  showHeroBanner?: boolean;
  showCategoryCircles?: boolean;
  showTrustFeatures?: boolean;
  announcementText?: string;
  showAnnouncement?: boolean;
  isHeaderSticky?: boolean;
  hotlinePhone?: string;
  footerCopyright?: string;
  showPaymentBadges?: boolean;
  enableWhatsAppFloating?: boolean;
  whatsAppNumber?: string;
  enableStickyCartBar?: boolean;
  productGridCols?: number;
  showDiscountBadge?: boolean;
  showStockStatus?: boolean;
  enableQuickBuy?: boolean;
  showUrgencyTicker?: boolean;
  typographyFont?: string;
}

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
  isMostPopular?: boolean;
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
    isMostPopular: true,
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

export const TEMPLATE_IDENTIFIERS = new Set([
  'sprout', 'wardrobe', 'stride', 'chic', 'mane', 'loftora',
  'classic', 'aurit', 'nova', 'brick', 'novatrend', 'gizmo', 'sneak', 'nexora',
  'store-sprout', 'store-wardrobe', 'store-stride', 'store-chic', 'store-mane', 'store-loftora',
  'store-classic', 'store-aurit', 'store-nova', 'store-brick', 'store-novatrend', 'store-gizmo', 'store-sneak', 'store-nexora',
  'volt', 'rose', 'nitro', 'sepia', 'oret', 'shoppingcart.1.2.7'
]);

export function isTemplatePreview(slug?: string): boolean {
  if (!slug) return false;
  const clean = slug.toLowerCase().replace(/^\/?(store|view-store)\//, '').replace(/^store-/, '').trim();
  return TEMPLATE_IDENTIFIERS.has(clean) || TEMPLATE_IDENTIFIERS.has(`store-${clean}`);
}

// Theme-Specific Authentic Products matching screenshots
export const THEME_SPECIFIC_PRODUCTS: Record<string, StoreProduct[]> = {
  'store-wardrobe': [
    {
      id: 201,
      name: 'Cotton Long-Sleeve Striped T-Shirt',
      sku: 'WDR-STRIPE-01',
      description: 'تيشيرت مقلم كلاسيكي مخطط بأكمام طويلة مصنوع من القطن الطبيعي 100% لإطلالة يومية مريحة وراقية.',
      price: 135000,
      compareAtPrice: 165000,
      stock: 15,
      lowStockThreshold: 3,
      category: 'أزياء نسائية',
      status: 'active',
      imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=700&auto=format&fit=crop&q=80',
      weightGrams: 280
    },
    {
      id: 202,
      name: 'Plain Cotton Undershirt - Wide Neck',
      sku: 'WDR-TANK-02',
      description: 'توب قطني ناصع البياض بفتحة رقبة عريضة وتفاصيل حياكة متقنة تناسب الإطلالات الصيفية والعملية.',
      price: 45000,
      compareAtPrice: 60000,
      stock: 28,
      lowStockThreshold: 5,
      category: 'أزياء نسائية',
      status: 'active',
      imageUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=700&auto=format&fit=crop&q=80',
      weightGrams: 180
    },
    {
      id: 203,
      name: 'Regular-Fit Denim Bermuda Shorts',
      sku: 'WDR-SHORTS-03',
      description: 'شورت جينز برمودا بقصة مريحة عصرية وخامة قطن دنيم معالج مع جيوب كلاسيكية متينة.',
      price: 75000,
      compareAtPrice: 95000,
      stock: 12,
      lowStockThreshold: 2,
      category: 'أزياء نسائية',
      status: 'active',
      imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=700&auto=format&fit=crop&q=80',
      weightGrams: 350
    },
    {
      id: 204,
      name: 'Braid Detailed Sleeveless Flow Top',
      sku: 'WDR-FLOW-04',
      description: 'توب انسيابي كحلي بدون أكمام مع حواف مضفرة أنيقة ولمسة حريرية ناعمة للمناسبات.',
      price: 160000,
      compareAtPrice: 190000,
      stock: 8,
      lowStockThreshold: 2,
      category: 'أزياء نسائية',
      status: 'active',
      imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=700&auto=format&fit=crop&q=80',
      weightGrams: 220
    }
  ],
  'store-stride': [
    {
      id: 301,
      name: 'حذاء لوفر شمواه كلاسيكي بني فاخر',
      sku: 'STR-LOAFER-01',
      description: 'حذاء لوفر إيطالي فاخر من الشمواه الطبيعي فائق النعومة مع نعل مريح يدوم طوال اليوم.',
      price: 95000,
      compareAtPrice: 125000,
      stock: 14,
      lowStockThreshold: 3,
      category: 'أحذية كلاسيكية',
      status: 'active',
      imageUrl: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=700&auto=format&fit=crop&q=80',
      weightGrams: 600
    },
    {
      id: 302,
      name: 'سنيكرز إير فليكس الرياضي للجري خفيف الوزن',
      sku: 'STR-RUNNER-02',
      description: 'حذاء جري بتصميم هوائي مبطن يوفر راحة فائقة وممتص للصدمات وتهوية ممتازة للقدمين.',
      price: 58000,
      compareAtPrice: 75000,
      stock: 22,
      lowStockThreshold: 4,
      category: 'أحذية رياضية',
      status: 'active',
      imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700&auto=format&fit=crop&q=80',
      weightGrams: 420
    },
    {
      id: 303,
      name: 'بوت تشيلسي جلد طبيعي برقبة عالية أنيق',
      sku: 'STR-BOOT-03',
      description: 'بوت جلد أسود طبيعي مقاوم للماء مع شريط مطاطي جانبي لسهولة الارتداء وأناقة مطلقة.',
      price: 110000,
      compareAtPrice: 140000,
      stock: 9,
      lowStockThreshold: 2,
      category: 'بوت وشتاء',
      status: 'active',
      imageUrl: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=700&auto=format&fit=crop&q=80',
      weightGrams: 750
    },
    {
      id: 304,
      name: 'سنيكرز كورت جلد أبيض مينيمال',
      sku: 'STR-COURT-04',
      description: 'سنيكرز أبيض ناصع بتصميم كورت الرياضي الكلاسيكي، مناسب لكافة الملابس اليومية والكاجوال.',
      price: 65000,
      compareAtPrice: 85000,
      stock: 19,
      lowStockThreshold: 4,
      category: 'سنيكرز كاجوال',
      status: 'active',
      imageUrl: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=700&auto=format&fit=crop&q=80',
      weightGrams: 480
    }
  ],
  'store-chic': [
    {
      id: 401,
      name: 'توب صيفي قصير بأكمام متداخلة Crossover',
      sku: 'CHC-TOP-01',
      description: 'تصميم أنيق مستوحى من كبريات دور الأزياء مع قصة متقاطعة وخامة ليفية مريحة.',
      price: 68000,
      compareAtPrice: 89000,
      stock: 11,
      lowStockThreshold: 3,
      category: 'أزياء بوتيك',
      status: 'active',
      imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=700&auto=format&fit=crop&q=80',
      weightGrams: 200
    },
    {
      id: 402,
      name: 'قميص قطني مخطط كلاسيكي ناعم',
      sku: 'CHC-SHIRT-02',
      description: 'قميص بأزرار أمامية وأكمام طويلة بقماش قطن عضوي منسدل مع خطوط طولية عصرية.',
      price: 85000,
      compareAtPrice: 110000,
      stock: 16,
      lowStockThreshold: 4,
      category: 'أزياء بوتيك',
      status: 'active',
      imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=700&auto=format&fit=crop&q=80',
      weightGrams: 260
    },
    {
      id: 403,
      name: 'فستان صيفي منسدل بحزام خصر أنيق',
      sku: 'CHC-DRESS-03',
      description: 'فستان ماكسي بنقشات هادئة وقماش شيفون ناعم يوفر إطلالة صيفية جذابة وفاخرة.',
      price: 145000,
      compareAtPrice: 180000,
      stock: 7,
      lowStockThreshold: 2,
      category: 'فساتين',
      status: 'active',
      imageUrl: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=700&auto=format&fit=crop&q=80',
      weightGrams: 380
    },
    {
      id: 404,
      name: 'بلوزة حريرية انسيابية للسهرات',
      sku: 'CHC-BLOUSE-04',
      description: 'بلوزة ساتان حرير بلمعان خافت وقصة رقبة واسعة تناسب السهرات والمناسبات الخاصة.',
      price: 95000,
      compareAtPrice: 125000,
      stock: 14,
      lowStockThreshold: 3,
      category: 'أزياء بوتيك',
      status: 'active',
      imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=700&auto=format&fit=crop&q=80',
      weightGrams: 210
    }
  ],
  'store-sprout': [
    {
      id: 501,
      name: 'دمية غزال قطيفة فائقة النعومة مع بطانية',
      sku: 'SPT-DEER-01',
      description: 'لعبة عناق قطيفة فائقة النعومة وآمنة للأطفال الرضع مع بطانية صوفية دافئة لطيفة على البشرة.',
      price: 42000,
      compareAtPrice: 55000,
      stock: 20,
      lowStockThreshold: 4,
      category: 'ألعاب ودمى',
      status: 'active',
      imageUrl: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=700&auto=format&fit=crop&q=80',
      weightGrams: 320
    },
    {
      id: 502,
      name: 'فستان مخملي بناتي بلون عنابي كلاسيكي',
      sku: 'SPT-DRESS-02',
      description: 'فستان فاخر من المخمل الناعم بتطريزات رقيقة وتصميم كلاسيكي للأعياد والمناسبات العائلية.',
      price: 68000,
      compareAtPrice: 88000,
      stock: 15,
      lowStockThreshold: 3,
      category: 'ملابس أطفال',
      status: 'active',
      imageUrl: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=700&auto=format&fit=crop&q=80',
      weightGrams: 250
    },
    {
      id: 503,
      name: 'سويتشيرت قطني بأشكال الحيوانات اللطيفة',
      sku: 'SPT-SWEAT-03',
      description: 'سويتشيرت من القطن الطبيعي العضوي برسومات حيوانات محببة للأطفال وقصة واسعة مريحة.',
      price: 38000,
      compareAtPrice: 49000,
      stock: 25,
      lowStockThreshold: 5,
      category: 'ملابس أطفال',
      status: 'active',
      imageUrl: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=700&auto=format&fit=crop&q=80',
      weightGrams: 240
    },
    {
      id: 504,
      name: 'طقم بيجاما قطنية وردية للأطفال',
      sku: 'SPT-PJ-04',
      description: 'طقم مكون من قطعتين من القطن الخالص 100%، مريح جداً للنوم واللعب اليومي في المنزل.',
      price: 44000,
      compareAtPrice: 58000,
      stock: 18,
      lowStockThreshold: 3,
      category: 'ملابس أطفال',
      status: 'active',
      imageUrl: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=700&auto=format&fit=crop&q=80',
      weightGrams: 270
    }
  ],
  'store-loftora': [
    {
      id: 601,
      name: 'كرسي طعام إسكندنافي خشب بلوط وأبيض',
      sku: 'LFT-CHAIR-01',
      description: 'كرسي عصري بتصميم دنماركي بسيط يجمع بين خشب البلوط الطبيعي والمقعد المريح لغرفة الطعام.',
      price: 115000,
      compareAtPrice: 145000,
      stock: 10,
      lowStockThreshold: 2,
      category: 'أثاث منزلي',
      status: 'active',
      imageUrl: 'https://images.unsplash.com/photo-1580481077194-4d8e950a4176?w=700&auto=format&fit=crop&q=80',
      weightGrams: 4200
    },
    {
      id: 602,
      name: 'مصباح متدلي بتصميم هندسي من خشب البتولا',
      sku: 'LFT-LAMP-02',
      description: 'إضاءة سقف دافئة مصنوعة يدوياً من شرائح الخشب الطبيعي، تمنح الغرفة إحساساً بالسكينة والجمال.',
      price: 85000,
      compareAtPrice: 110000,
      stock: 14,
      lowStockThreshold: 3,
      category: 'إضاءة وديكور',
      status: 'active',
      imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=700&auto=format&fit=crop&q=80',
      weightGrams: 1200
    },
    {
      id: 603,
      name: 'نبتة كالاتيا منزلية في حوض سيراميك وردي',
      sku: 'LFT-PLANT-03',
      description: 'نبات داخلي طبيعي ينقي الهواء موضوع داخل حوض سيراميكي فخاري أنيق بدرجة الباستيل.',
      price: 48000,
      compareAtPrice: 65000,
      stock: 20,
      lowStockThreshold: 4,
      category: 'نباتات وديكور',
      status: 'active',
      imageUrl: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=700&auto=format&fit=crop&q=80',
      weightGrams: 1500
    },
    {
      id: 604,
      name: 'مرآة حائط دائرية بإطار أسود مينيمال',
      sku: 'LFT-MIRROR-04',
      description: 'مرآة عاكسة نقية بقطر 60 سم مع إطار ألومنيوم أسود مطفي تناسب المداخل والصالونات.',
      price: 92000,
      compareAtPrice: 120000,
      stock: 12,
      lowStockThreshold: 2,
      category: 'مرايا وتحف',
      status: 'active',
      imageUrl: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=700&auto=format&fit=crop&q=80',
      weightGrams: 2800
    }
  ],
  'store-mane': [
    {
      id: 701,
      name: 'سيروم فيتامين سي النقي 15% لنضارة البشرة',
      sku: 'MNE-SERUM-01',
      description: 'مصل مضاد للأكسدة يعزز نضارة البشرة ويقلل التصبغات ويوحد لون الوجه مع حمض الفيروليك.',
      price: 65000,
      compareAtPrice: 85000,
      stock: 22,
      lowStockThreshold: 5,
      category: 'سيرومات وعناية',
      status: 'active',
      imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=700&auto=format&fit=crop&q=80',
      weightGrams: 150
    },
    {
      id: 702,
      name: 'غسول رغوي لطيف ومقشر للبشرة الحساسة',
      sku: 'MNE-CLEAN-02',
      description: 'منظف وجه رغوي يزيل الشوائب والمكياج بلطف دون تجريد البشرة من ترطيبها الطبيعي.',
      price: 42000,
      compareAtPrice: 55000,
      stock: 30,
      lowStockThreshold: 6,
      category: 'غسول ومنظفات',
      status: 'active',
      imageUrl: 'https://images.unsplash.com/photo-1608248597359-07f23a9d9e45?w=700&auto=format&fit=crop&q=80',
      weightGrams: 250
    },
    {
      id: 703,
      name: 'كريم ترطيب عميق بالسيراميد وحمض الهيالورونيك',
      sku: 'MNE-CREAM-03',
      description: 'مرطب مغذي يعيد بناء حاجز البشرة الواقي ويوفر ترطيباً مستمراً لمدة 24 ساعة.',
      price: 54000,
      compareAtPrice: 70000,
      stock: 19,
      lowStockThreshold: 4,
      category: 'كريمات ومرطبات',
      status: 'active',
      imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=700&auto=format&fit=crop&q=80',
      weightGrams: 200
    },
    {
      id: 704,
      name: 'سيروم كولاجين وماكا لترميم خصلات الشعر',
      sku: 'MNE-HAIR-04',
      description: 'زيت علاجي خفيف يغذي الشعر التالف من الجذور وحتى الأطراف ويمنحه لمعاناً حريرياً دون ملمس دهني.',
      price: 78000,
      compareAtPrice: 98000,
      stock: 16,
      lowStockThreshold: 3,
      category: 'عناية بالشعر',
      status: 'active',
      imageUrl: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=700&auto=format&fit=crop&q=80',
      weightGrams: 180
    }
  ]
};

export const SAMPLE_THEME_PRODUCTS: StoreProduct[] = [
  {
    id: 101,
    name: 'سماعات برو اللاسلكية بنظام العزل الفائق ANC',
    sku: 'AUDIO-PRO-MAX',
    description: 'سماعات رأس لاسلكية مريحة مع بطارية تدوم 30 ساعة وصوت نقي بدقة Hi-Res وعزل ضوضاء فعال',
    price: 45000,
    compareAtPrice: 65000,
    stock: 25,
    lowStockThreshold: 5,
    category: 'إلكترونيات',
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    weightGrams: 300
  },
  {
    id: 102,
    name: 'ساعة ذكية ألترا تيتانيوم مقاومة للماء',
    sku: 'SMART-WATCH-ULTRA',
    description: 'ساعة ذكية مع شاشة AMOLED لمسية ساطعة، مراقبة نبضات القلب، ومكالمات بلوتوث مباشرة',
    price: 68000,
    compareAtPrice: 85000,
    stock: 18,
    lowStockThreshold: 4,
    category: 'إلكترونيات',
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    weightGrams: 180
  },
  {
    id: 103,
    name: 'حذاء سنيكرز رياضي مرن وخفيف للجري اليومي',
    sku: 'SNEAK-RUN-PRO',
    description: 'حذاء جري بتصميم هوائي مبطن يوفر راحة فائقة طوال اليوم وتهوية ممتازة للقدمين',
    price: 39000,
    compareAtPrice: 52000,
    stock: 30,
    lowStockThreshold: 6,
    category: 'أزياء',
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
    weightGrams: 450
  },
  {
    id: 104,
    name: 'عطر العود والمسك الأبيض الملكي 100 مل',
    sku: 'PERFUME-ROYAL-OUD',
    description: 'تركيبة عطرية شرقية ساحرة تدوم طويلاً تجمع بين خشب الصندل والعود الفاخر وعبير المسك',
    price: 55000,
    compareAtPrice: 75000,
    stock: 20,
    lowStockThreshold: 5,
    category: 'عطور',
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&auto=format&fit=crop&q=80',
    weightGrams: 400
  }
];

// Check if merchant has an explicit paid PRO plan
export function isPaidMerchantPro(): boolean {
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

// Get merchant account creation timestamp (ms)
export function getAccountCreatedAt(): number {
  try {
    const rawStored = localStorage.getItem('zaeem_account_created_at');
    if (rawStored) {
      const t = new Date(rawStored).getTime();
      if (!isNaN(t) && t > 0) return t;
    }

    const rawUser = localStorage.getItem('zaeem_user');
    if (rawUser) {
      const u = JSON.parse(rawUser);
      const dateVal = u.createdAt || u.created_at || u.time;
      if (dateVal) {
        const t = new Date(dateVal).getTime();
        if (!isNaN(t) && t > 0) {
          localStorage.setItem('zaeem_account_created_at', new Date(t).toISOString());
          return t;
        }
      }
    }

    const rawStore = localStorage.getItem('zaeem_store_data');
    if (rawStore) {
      const s = JSON.parse(rawStore);
      if (s.createdAt) {
        const t = new Date(s.createdAt).getTime();
        if (!isNaN(t) && t > 0) {
          localStorage.setItem('zaeem_account_created_at', new Date(t).toISOString());
          return t;
        }
      }
    }
  } catch {}

  // If no previous creation date found, initialize to now
  const now = Date.now();
  try {
    localStorage.setItem('zaeem_account_created_at', new Date(now).toISOString());
  } catch {}
  return now;
}

// 3-Day Free Trial window for all themes from account creation date
export const THEME_TRIAL_DURATION_MS = 3 * 24 * 60 * 60 * 1000; // 3 days (72 hours)

export function isFreeTrialActive(): boolean {
  const createdMs = getAccountCreatedAt();
  const diffMs = Date.now() - createdMs;
  return diffMs <= THEME_TRIAL_DURATION_MS;
}

export function getTrialTimeRemaining(): { days: number; hours: number; isExpired: boolean } {
  const createdMs = getAccountCreatedAt();
  const diffMs = Date.now() - createdMs;
  const remainingMs = THEME_TRIAL_DURATION_MS - diffMs;
  if (remainingMs <= 0) {
    return { days: 0, hours: 0, isExpired: true };
  }
  const days = Math.floor(remainingMs / (24 * 60 * 60 * 1000));
  const hours = Math.floor((remainingMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  return { days, hours, isExpired: false };
}

// Check if merchant has access to PRO themes (either paid PRO or within 3-day free trial)
export function isMerchantPro(): boolean {
  if (isPaidMerchantPro()) return true;
  return isFreeTrialActive();
}

/**
 * Check if the 3-day trial has expired for a free merchant.
 * If expired and currently using a PRO theme, automatically revert to a free theme (store-sprout or store-classic).
 */
export async function checkAndEnforceThemeTrialExpiration(subdomain?: string): Promise<boolean> {
  if (isPaidMerchantPro()) return false;
  if (isFreeTrialActive()) return false;

  try {
    const rawStore = localStorage.getItem('zaeem_store_data') || localStorage.getItem('zaeem_onboarded_store') || '{}';
    const parsed = JSON.parse(rawStore);
    const activeId = normalizeTemplateId(parsed.selectedTheme || parsed.templateId || 'store-sprout');
    const themeConfig = TEMPLATES_MAP[activeId];

    if (themeConfig?.isPro) {
      const freeThemeId: TemplateId = 'store-sprout';
      parsed.selectedTheme = freeThemeId;
      parsed.templateId = freeThemeId;
      localStorage.setItem('zaeem_store_data', JSON.stringify(parsed));
      localStorage.setItem('zaeem_onboarded_store', JSON.stringify(parsed));

      const rawUser = localStorage.getItem('zaeem_user');
      if (rawUser) {
        const u = JSON.parse(rawUser);
        u.selectedTheme = freeThemeId;
        u.templateId = freeThemeId;
        localStorage.setItem('zaeem_user', JSON.stringify(u));
      }

      window.dispatchEvent(new CustomEvent('zaeem_store_updated'));

      // Lazy import cloudDb update to avoid circular dependency
      try {
        const { updateCloudStoreFullSettings } = await import('../../utils/cloudDb');
        const cleanSub = (subdomain || parsed.subdomain || 'alzaeem').replace('.za3em.shop', '').toLowerCase().trim();
        await updateCloudStoreFullSettings({
          subdomain: cleanSub,
          templateId: freeThemeId
        });
      } catch {}

      console.log(`[ThemeTrial] 3-day trial period expired. Reverted store to free theme: ${freeThemeId}`);
      return true;
    }
  } catch (err) {
    console.warn('[ThemeTrial] Error checking trial expiration:', err);
  }
  return false;
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
  customization?: ThemeCustomizationProps;
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
  logoUrl,
  customization
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
  const themeDefaults = THEME_SPECIFIC_PRODUCTS[currentThemeId] || THEME_SPECIFIC_PRODUCTS['store-wardrobe'] || SAMPLE_THEME_PRODUCTS;

  // In standalone preview mode, always use the authentic theme products matching the screenshots unless merchant passed specific products
  const productsList: StoreProduct[] = standalone
    ? (Array.isArray(products) && products.length > 0 ? products : themeDefaults)
    : (Array.isArray(products) && products.length > 0
      ? products
      : (baseProducts.length > 0 ? baseProducts : themeDefaults));

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
    storeCode,
    customization
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

  const isDarkMode = customization?.appearanceMode === 'dark';
  const isEnglish = customization?.defaultLanguage === 'en';

  return (
    <div
      className={`relative min-h-[100dvh] transition-colors duration-300 ${
        isDarkMode ? 'dark bg-[#080d1a] text-slate-100' : 'bg-white text-slate-900'
      }`}
      dir={isEnglish ? 'ltr' : 'rtl'}
      style={{
        '--theme-primary': customization?.brandColor || undefined,
        '--theme-accent': customization?.brandColor || undefined,
        fontFamily: customization?.typographyFont ? `${customization.typographyFont}, system-ui, sans-serif` : undefined
      } as React.CSSProperties}
    >
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
