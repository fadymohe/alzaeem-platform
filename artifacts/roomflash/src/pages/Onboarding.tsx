import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Logo } from '../components/common/Logo';
import {
  Shirt, Smartphone, Sparkles, Grid, Check,
  ChevronLeft, ChevronRight, Upload, ExternalLink,
  Truck, Store, ShieldCheck, Eye, Wand2, RefreshCw,
  CheckCircle2, AlertCircle, Tag, Package, Gift, Plus,
  CheckCheck, Globe, Star, Copy, ShoppingBag,
  X, Search, ShoppingCart, Shield, Laptop, RotateCcw,
  SlidersHorizontal, Heart, Zap, Phone, MapPin, CheckCircle,
  Tablet, Monitor, Maximize2, Minimize2
} from 'lucide-react';
import { formatIQD, IRAQ_GOVERNORATES } from '../data/iraqData';
import { registerStore, encodeStoreSeed, checkSubdomainAvailability } from '../utils/storeRegistry';
import { saveCloudStore } from '../utils/cloudDb';
import { supabase } from '../utils/supabase';
import { getStoredProducts, saveStoredProducts, type StoreProduct } from '../data/storeState';
import { validateProductImageSafety } from '../utils/nsfwDetector';
import { StoreTemplates, TEMPLATES_MAP, type TemplateId, normalizeTemplateId } from '../components/storefront/StoreTemplates';
import { StoreIframePreview } from '../components/storefront/StoreIframePreview';
import { addAppNotification } from '../utils/notificationStore';

export interface RealTemplateOption {
  id: string;
  name: string;
  nameEn: string;
  categoryTitle: string;
  categoryKey: 'all' | 'fashion' | 'perfumes' | 'electronics' | 'home' | 'general';
  badge: string;
  tagline: string;
  features: string[];
  heroImage: string;
  accentColor: string;
  borderActive: string;
  ringColor: string;
  previewBg: string;
  headerBg: string;
  cardBg: string;
  pillBg: string;
  priceColor: string;
  btnBg: string;
  colorDot: string;
  palette: string[];
}

export const REAL_STORE_TEMPLATES: RealTemplateOption[] = [
  {
    id: 'store-aurit',
    name: 'شوب ويل (ShopWell)',
    nameEn: 'ShopWell Mega Store',
    categoryTitle: 'ميجا ستور شامل، أزياء، وإلكترونيات',
    categoryKey: 'all',
    badge: 'القالب الافتراضي الأكثر طلباً ⭐',
    tagline: 'واجهة ميجا ستور حديثة زرقاء فائقة السرعة مع شريط إعلانات أكواد الخصم، وتصنيفات مرئية وشيك أوت فوري.',
    features: ['القالب الافتراضي المعتمد لمنصة الزعيم', 'تصفح حسب الأقسام وعروض فلاش', 'شحن وتتبع فوري عبر الزعيم'],
    heroImage: '/templates/store-aurit.jpg',
    accentColor: 'blue',
    borderActive: 'border-blue-600',
    ringColor: 'ring-blue-500/40',
    previewBg: 'bg-[#f0f7ff]',
    headerBg: 'bg-[#0f172a] border-blue-900',
    cardBg: 'bg-white border-blue-100',
    pillBg: 'bg-blue-50 text-blue-800 border-blue-200',
    priceColor: 'text-blue-700',
    btnBg: 'bg-blue-600 hover:bg-blue-500 text-white',
    colorDot: 'bg-[#2563eb]',
    palette: ['#0f172a', '#2563eb', '#38bdf8', '#f8fafc']
  },
  {
    id: 'store-sprout',
    name: 'سبراوت (Sprout)',
    nameEn: 'Sprout Garden',
    categoryTitle: 'أزياء ملابس أطفال وعائلة بروح الطبيعة',
    categoryKey: 'fashion',
    badge: 'ثيم أطفال وعائلة',
    tagline: 'واجهة ملابس أطفال بروح الحديقة — درجات زيتونية وعاجية راقية، كولاج منتجات عائم، وشبكة مقتنيات مصممة لزيادة المبيعات.',
    features: ['واجهة كولاج للأطفال بروح الحديقة', 'شبكة مقتنيات نقية عالية التحويل', 'شحن سريع لكافة المحافظات مع COD'],
    heroImage: '/templates/store-classic.jpg',
    accentColor: 'emerald',
    borderActive: 'border-emerald-500',
    ringColor: 'ring-emerald-500/40',
    previewBg: 'bg-[#faf9f6]',
    headerBg: 'bg-white border-slate-200',
    cardBg: 'bg-white border-stone-200',
    pillBg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    priceColor: 'text-emerald-800',
    btnBg: 'bg-emerald-700 hover:bg-emerald-800 text-white',
    colorDot: 'bg-[#588157]',
    palette: ['#344e41', '#588157', '#a3b18a', '#dad7cd']
  },
  {
    id: 'store-wardrobe',
    name: 'واردروب (Wardrobe)',
    nameEn: 'Wardrobe Minimal',
    categoryTitle: 'أزياء وملابس كاجوال يومية',
    categoryKey: 'fashion',
    badge: 'تصميم مينيمال أحادي',
    tagline: 'واجهة أزياء تبدأ بالمنتجات مباشرة بلا تعقيد — فسيفساء بانرات وتصفح سلس وسريع مع شريط مميزات يبرز الفخامة.',
    features: ['تصفح بصري سريع للملابس والكاجوال', 'سلة تسوق عائمة ومحدثة فورياً', 'شحن سريع مع أسطول الزعيم'],
    heroImage: '/templates/store-aurit.jpg',
    accentColor: 'slate',
    borderActive: 'border-slate-400',
    ringColor: 'ring-slate-500/40',
    previewBg: 'bg-[#fafafa]',
    headerBg: 'bg-white border-slate-200',
    cardBg: 'bg-white border-slate-200',
    pillBg: 'bg-slate-100 text-slate-800 border-slate-300',
    priceColor: 'text-slate-900',
    btnBg: 'bg-black hover:bg-neutral-800 text-white',
    colorDot: 'bg-black',
    palette: ['#000000', '#333333', '#888888', '#e63946']
  },
  {
    id: 'store-stride',
    name: 'سترايد (Stride)',
    nameEn: 'Stride Sneakers',
    categoryTitle: 'أحذية رياضية وسنيكرز وأناقة حركية',
    categoryKey: 'fashion',
    badge: 'متجر سنيكرز كثيف',
    tagline: 'واجهة أحذية وسنيكرز حيوية وكثيفة — بنرات مائلة، جدار ماركات، مقاسات تفاعلية، وسرعة فائقة في الشيك أوت.',
    features: ['متجر سنيكرز رياضي فائق الحيوية', 'عرض المقاسات والمخزون الحي', 'ربط فوري ببوليصة الشحن'],
    heroImage: '/templates/store-sneak.png',
    accentColor: 'blue',
    borderActive: 'border-blue-500',
    ringColor: 'ring-blue-500/40',
    previewBg: 'bg-[#f0f7ff]',
    headerBg: 'bg-[#071322] border-blue-900',
    cardBg: 'bg-white border-blue-100',
    pillBg: 'bg-blue-50 text-blue-800 border-blue-200',
    priceColor: 'text-blue-700',
    btnBg: 'bg-blue-600 hover:bg-blue-500 text-white',
    colorDot: 'bg-[#0052cc]',
    palette: ['#071322', '#0052cc', '#00c8ff', '#ffffff']
  },
  {
    id: 'store-chic',
    name: 'شيك (Chic)',
    nameEn: 'Chic Boutique',
    categoryTitle: 'بوتيك أزياء وموضة نسائية راقية',
    categoryKey: 'fashion',
    badge: 'بوتيك ومجلات راقية',
    tagline: 'واجهة بوتيك مستوحاة من المجلات العالمية — تباين بصري عالي، وتشكيلات حصرية للفساتين والأناقة والمناسبات.',
    features: ['تصميم مجلات أزياء عصرية راقية', 'عرض تشكيلات الموضة بلمسات ناعمة', 'تجربة شيك أوت COD فورية'],
    heroImage: '/templates/store-nova.jpg',
    accentColor: 'rose',
    borderActive: 'border-rose-500',
    ringColor: 'ring-rose-500/40',
    previewBg: 'bg-[#fff5f6]',
    headerBg: 'bg-white border-rose-100',
    cardBg: 'bg-white border-rose-100',
    pillBg: 'bg-rose-50 text-rose-800 border-rose-200',
    priceColor: 'text-rose-700',
    btnBg: 'bg-[#540b0e] hover:bg-[#6f1115] text-white',
    colorDot: 'bg-[#540b0e]',
    palette: ['#000000', '#ffffff', '#fff0f3', '#540b0e']
  },
  {
    id: 'store-classic',
    name: 'بوتيجا (كلاسيك)',
    nameEn: 'Botiga Minimalist',
    categoryTitle: 'عطور ومستحضرات فاخرة وتراثية',
    categoryKey: 'perfumes',
    badge: 'مينيمال أبيض فاخر',
    tagline: 'واجهة مينيمال ناصعة البياض مع هيدر مركزي أنيق وشبكة مقتنيات وتشكيلات حصرية مناسبة للعطور ومستحضرات التجميل الراقية.',
    features: ['مينيمال أبيض فاخر وهيدر أنيق', 'شبكة مقتنيات نقية عالية التحويل', 'شحن سريع لكافة المحافظات مع COD'],
    heroImage: '/templates/store-classic.jpg',
    accentColor: 'amber',
    borderActive: 'border-amber-500',
    ringColor: 'ring-amber-500/40',
    previewBg: 'bg-[#faf9f6]',
    headerBg: 'bg-white border-slate-200',
    cardBg: 'bg-white border-stone-200',
    pillBg: 'bg-stone-100 text-stone-800 border-stone-300',
    priceColor: 'text-amber-800',
    btnBg: 'bg-stone-900 hover:bg-stone-800 text-white',
    colorDot: 'bg-amber-600',
    palette: ['#1c1917', '#d97706', '#fef3c7', '#ffffff']
  },
  {
    id: 'store-aurit',
    name: 'شوب ويل (أوريت)',
    nameEn: 'ShopWell Mega Store',
    categoryTitle: 'أزياء وإلكترونيات وسلع استهلاكية',
    categoryKey: 'general',
    badge: 'ميجا ستور حديث',
    tagline: 'واجهة ميجا ستور أزرق حديث مع شريط إعلانات أكواد الخصم، وقائمة تسوق حسب الأقسام، ودوائر المنتجات الأكثر طلباً.',
    features: ['شريط إعلانات عروض وأكواد فلاش', 'تسوق ميجا ستور سريع وشامل', 'سلة تسوق عائمة وشيك أوت COD فوري'],
    heroImage: '/templates/store-aurit.jpg',
    accentColor: 'blue',
    borderActive: 'border-blue-500',
    ringColor: 'ring-blue-500/40',
    previewBg: 'bg-[#f8fafc]',
    headerBg: 'bg-[#0f172a] border-blue-900/50',
    cardBg: 'bg-white border-slate-200',
    pillBg: 'bg-blue-50 text-blue-700 border-blue-200',
    priceColor: 'text-blue-600',
    btnBg: 'bg-blue-600 hover:bg-blue-500 text-white',
    colorDot: 'bg-blue-600',
    palette: ['#0f172a', '#2563eb', '#38bdf8', '#f8fafc']
  },
  {
    id: 'store-nova',
    name: 'إيشوب كيت (نوفا)',
    nameEn: 'eShopkit Marketplace',
    categoryTitle: 'إلكترونيات وأجهزة ذكية وملحقات',
    categoryKey: 'electronics',
    badge: 'ماركت بليس تقني',
    tagline: 'واجهة ماركت بليس إلكتروني تقني شامل مع شريط علوي بنفسجي، وبادج عروض فلاش، وبطاقات ترويجية جانبية لزيادة التحويل.',
    features: ['ماركت بليس تقني عصري متطور', 'شارات فلاش وتخفيضات أجهزة ذكية', 'شيك أوت سريع ونموذج استلام سهل'],
    heroImage: '/templates/store-nova.jpg',
    accentColor: 'purple',
    borderActive: 'border-purple-500',
    ringColor: 'ring-purple-500/40',
    previewBg: 'bg-[#faf5ff]',
    headerBg: 'bg-[#581c87] border-purple-800',
    cardBg: 'bg-white border-purple-100',
    pillBg: 'bg-purple-50 text-purple-700 border-purple-200',
    priceColor: 'text-purple-700',
    btnBg: 'bg-purple-600 hover:bg-purple-500 text-white',
    colorDot: 'bg-purple-600',
    palette: ['#581c87', '#9333ea', '#f3e8ff', '#ffffff']
  },
  {
    id: 'store-mane',
    name: 'مين (Mane)',
    nameEn: 'Mane Beauty Salon',
    categoryTitle: 'صالون ومستحضرات تجميل وعناية',
    categoryKey: 'perfumes',
    badge: 'صالون وعناية متقدمة',
    tagline: 'واجهة صالون وعناية مبنية على فكرة التحول والجمال — درجات أرجوانية عميقة تبرز الباقات والمنتجات بأسلوب احترافي.',
    features: ['تصميم صالونات ومستحضرات فاخرة', 'عرض باقات العناية الشخصية', 'شيك أوت سريع مع COD'],
    heroImage: '/templates/store-novatrend.png',
    accentColor: 'purple',
    borderActive: 'border-purple-500',
    ringColor: 'ring-purple-500/40',
    previewBg: 'bg-[#faf5ff]',
    headerBg: 'bg-[#240046] border-purple-900',
    cardBg: 'bg-white border-purple-100',
    pillBg: 'bg-purple-50 text-purple-700 border-purple-200',
    priceColor: 'text-purple-700',
    btnBg: 'bg-[#7209b7] hover:bg-[#8318cb] text-white',
    colorDot: 'bg-[#7209b7]',
    palette: ['#240046', '#7209b7', '#f72585', '#ffffff']
  },
  {
    id: 'store-loftora',
    name: 'لوفتورا (Loftora)',
    nameEn: 'Loftora Home Decor',
    categoryTitle: 'ديكور منزلي وأثاث وتحف',
    categoryKey: 'home',
    badge: 'ديكور وطين وبلوط',
    tagline: 'واجهة ديكور منزلي مختارة بمشهد غرفة وفسيفساء بانرات بألوان حجرية وطينية بلمسة بلوط تعكس فخامة المنزل.',
    features: ['أجواء ديكور منزلي دافئة وأنيقة', 'تنسيق الغرف والمجموعات المنزلية', 'توصيل آمن لجميع محافظات العراق'],
    heroImage: '/templates/store-classic.jpg',
    accentColor: 'amber',
    borderActive: 'border-amber-700',
    ringColor: 'ring-amber-700/40',
    previewBg: 'bg-[#f7f5f0]',
    headerBg: 'bg-[#2b2927] border-amber-900',
    cardBg: 'bg-white border-amber-100',
    pillBg: 'bg-amber-50 text-amber-900 border-amber-200',
    priceColor: 'text-amber-900',
    btnBg: 'bg-[#8b5a2b] hover:bg-[#744a22] text-white',
    colorDot: 'bg-[#8b5a2b]',
    palette: ['#2b2927', '#8b5a2b', '#d4b996', '#f7f5f0']
  },
  {
    id: 'store-gizmo',
    name: 'جيزمو سايبر تك',
    nameEn: 'Gizmo Cyber Tech',
    categoryTitle: 'إلكترونيات وأجهزة ذكية وملحقات',
    categoryKey: 'electronics',
    badge: 'سايبر تك متطور',
    tagline: 'تصميم مستقبلي بتقنية السايبر للإلكترونيات والأجهزة الذكية مع أضواء نيون وتأثيرات تقنية متقدمة.',
    features: ['تصميم سايبر نيون متقدم', 'عرض مواصفات الأجهزة الذكية', 'سلة تسوق إلكترونية سريعة'],
    heroImage: '/templates/store-gizmo.png',
    accentColor: 'cyan',
    borderActive: 'border-cyan-500',
    ringColor: 'ring-cyan-500/40',
    previewBg: 'bg-[#0b1120]',
    headerBg: 'bg-[#070d18] border-cyan-900',
    cardBg: 'bg-slate-900 border-cyan-900/60',
    pillBg: 'bg-cyan-950 text-cyan-300 border-cyan-800',
    priceColor: 'text-cyan-400',
    btnBg: 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black',
    colorDot: 'bg-cyan-400',
    palette: ['#070d18', '#06b6d4', '#3b82f6', '#ffffff']
  },
  {
    id: 'store-novatrend',
    name: 'نوفا تريند',
    nameEn: 'NovaTrend Youth',
    categoryTitle: 'تريندات شبابية وموضة الشارع',
    categoryKey: 'fashion',
    badge: 'تريند شبابي',
    tagline: 'واجهة مخصصة لصيحات الموضة الجريئة والتريندات الشبابية مع خلفيات متدرجة داكنة وتأثيرات حركية.',
    features: ['مظهر شبابي حيوي وعصري', 'شريط عروض فلاش تفاعلي', 'تسوق سهل ومريح عبر الهاتف'],
    heroImage: '/templates/store-novatrend.png',
    accentColor: 'pink',
    borderActive: 'border-pink-500',
    ringColor: 'ring-pink-500/40',
    previewBg: 'bg-[#0f0c1b]',
    headerBg: 'bg-[#18112e] border-pink-900/60',
    cardBg: 'bg-[#1b1435] border-pink-900/40',
    pillBg: 'bg-pink-950 text-pink-300 border-pink-800',
    priceColor: 'text-pink-400',
    btnBg: 'bg-pink-600 hover:bg-pink-500 text-white',
    colorDot: 'bg-pink-500',
    palette: ['#0f0c1b', '#ec4899', '#f43f5e', '#ffffff']
  },
  {
    id: 'store-brick',
    name: 'شوب واي (بريك)',
    nameEn: 'ShopWay Mega Store',
    categoryTitle: 'معدات صناعية وميجا ستور شامل',
    categoryKey: 'general',
    badge: 'ميجا ستور متين',
    tagline: 'واجهة متجر شامل باللون الكحلي والبرتقالي، تحتوي على قائمة أقسام عمودية ومربع العروض الأسبوعية الحصرية.',
    features: ['ميجا ستور للمنتجات المتنوعة', 'قائمة أقسام واسعة وشاملة', 'شحن وتوصيل فوري مع COD'],
    heroImage: '/templates/store-brick.jpg',
    accentColor: 'orange',
    borderActive: 'border-orange-500',
    ringColor: 'ring-orange-500/40',
    previewBg: 'bg-[#fffbf5]',
    headerBg: 'bg-[#111a28] border-orange-950',
    cardBg: 'bg-white border-orange-100',
    pillBg: 'bg-orange-50 text-orange-800 border-orange-200',
    priceColor: 'text-orange-700',
    btnBg: 'bg-orange-600 hover:bg-orange-500 text-white',
    colorDot: 'bg-orange-500',
    palette: ['#111a28', '#ea580c', '#fbbf24', '#ffffff']
  }
];


const SAMPLE_PRODUCTS = [
  {
    id: 'p1',
    name: 'عطر تاج الفخامة الفرنسي الملكي',
    price: '45000',
    category: 'عطور وبخور',
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'p2',
    name: 'ساعة لومينور بريميوم أوتوماتيك',
    price: '85000',
    category: 'ساعات وإكسسوارات',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'p3',
    name: 'حذاء سنيكرز برو إير لايت',
    price: '62000',
    category: 'أحذية وأزياء',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'p4',
    name: 'سماعة برو اللاسلكية عازلة للضوضاء',
    price: '55000',
    category: 'إلكترونيات',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'p5',
    name: 'عباية إماراتية ملكية مطرزة',
    price: '75000',
    category: 'أزياء وملابس',
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'p6',
    name: 'طقم مباخر كريستال ذهبي فاخر',
    price: '38000',
    category: 'أدوات منزلية وديكور',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80'
  }
];

const NICHE_OPTIONS = [
  {
    id: 'perfumes',
    label: 'عطور وتجميل',
    desc: 'عطور فرنسية، عود وبخور، عناية بالبشرة',
    icon: Sparkles,
    recommendedTheme: 'store-classic',
    defaultCats: ['عطور فرنسية', 'دهن عود وبخور', 'عناية بالبشرة', 'مستحضرات تجميل']
  },
  {
    id: 'fashion',
    label: 'أزياء وملابس',
    desc: 'رجالي، نسائي، أطفال، أحذية وحقائب',
    icon: Shirt,
    recommendedTheme: 'store-wardrobe',
    defaultCats: ['أزياء رجالي', 'فساتين وعبايات', 'أحذية رياضية', 'حقائب وإكسسوارات']
  },
  {
    id: 'electronics',
    label: 'هواتف وإلكترونيات',
    desc: 'موبايلات، شواحن، ساعات ذكية، ملحقات',
    icon: Smartphone,
    recommendedTheme: 'store-nova',
    defaultCats: ['شواحن وكفرات', 'ساعات ذكية', 'سماعات صوتية', 'أجهزة إلكترونية']
  },
  {
    id: 'watches',
    label: 'ساعات وهدايا',
    desc: 'ساعات رجالي ونسائي، نظارات، أطقم هدايا',
    icon: Star,
    recommendedTheme: 'store-chic',
    defaultCats: ['ساعات كلاسيك', 'ساعات رياضية', 'نظارات شمسية', 'أطقم هدايا']
  },
  {
    id: 'home',
    label: 'أدوات منزلية وديكور',
    desc: 'مستلزمات البيت، ديكورات، إضاءة عصرية',
    icon: Store,
    recommendedTheme: 'store-loftora',
    defaultCats: ['إضاءة عصرية', 'مستلزمات مطبخ', 'ديكور منزلي', 'منظمات']
  },
  {
    id: 'general',
    label: 'متجر عام وتريندات',
    desc: 'منتجات متنوعة وأكثر المنتجات طلباً',
    icon: Grid,
    recommendedTheme: 'store-aurit',
    defaultCats: ['الأكثر طلباً', 'وصل حديثاً', 'عروض التوفير', 'منتجات حصرية']
  }
];

export function OnboardingPage() {
  const [, setLocation] = useLocation();

  // 0. Strict Authentication & Direct URL Access Verification Guard
  const [authStatus, setAuthStatus] = useState<'checking' | 'authenticated' | 'unauthenticated'>('checking');

  useEffect(() => {
    let isMounted = true;

    const verifyAccess = async () => {
      try {
        // 1. Check localStorage user session
        let activeUser: any = null;
        const rawUser = localStorage.getItem('zaeem_user');
        if (rawUser) {
          try {
            const parsed = JSON.parse(rawUser);
            if (parsed && (parsed.email || parsed.id) && parsed.loggedIn !== false) {
              activeUser = parsed;
            }
          } catch {}
        }

        // 2. Check Supabase Auth session if not found in localStorage
        if (!activeUser) {
          try {
            const { data } = await supabase.auth.getUser();
            if (data?.user && data.user.email) {
              const meta = data.user.user_metadata || {};
              activeUser = {
                id: data.user.id,
                email: data.user.email,
                name: meta.full_name || meta.name || data.user.email.split('@')[0],
                phone: meta.phone || data.user.phone || '+9647700000000',
                governorate: meta.governorate || 'بغداد',
                loggedIn: true,
                time: new Date().toISOString()
              };
              localStorage.setItem('zaeem_user', JSON.stringify(activeUser));
            }
          } catch {}
        }

        if (!isMounted) return;

        // If NOT authenticated -> Redirect to sign-in with clear notice
        if (!activeUser || !activeUser.email) {
          sessionStorage.setItem(
            'zaeem_auth_redirect_notice',
            'يرجى تسجيل الدخول أو إنشاء حسابك أولاً للبدء في إعداد متجرك الإلكتروني'
          );
          setAuthStatus('unauthenticated');
          window.location.hash = '#/sign-in';
          setLocation('/sign-in');
          return;
        }

        // Check if user already completed onboarding previously
        const isOnboarded = localStorage.getItem('zaeem_onboarding_completed') === 'true';
        const rawOnb = localStorage.getItem('zaeem_onboarded_store');
        const hasReconfigParam =
          window.location.href.includes('reconfigure=true') ||
          window.location.hash.includes('reconfigure=true');

        if (isOnboarded && rawOnb && !hasReconfigParam) {
          // Already has a store and not explicitly reconfiguring -> redirect directly to dashboard
          window.location.hash = '#/dashboard';
          setLocation('/dashboard');
          return;
        }

        setAuthStatus('authenticated');
      } catch (err) {
        if (isMounted) setAuthStatus('authenticated');
      }
    };

    verifyAccess();

    return () => {
      isMounted = false;
    };
  }, [setLocation]);

  // Wizard Navigation: Step 1 to 5
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Store Configuration State
  const [storeName, setStoreName] = useState(() => {
    try {
      const u = localStorage.getItem('zaeem_user');
      if (u) {
        const parsed = JSON.parse(u);
        if (parsed.name && parsed.name.trim()) return `متجر ${parsed.name.trim().split(' ')[0]}`;
      }
    } catch {}
    return 'متجر الفخامة العراقي';
  });
  const [subdomain, setSubdomain] = useState(() => {
    try {
      const u = localStorage.getItem('zaeem_user');
      if (u) {
        const parsed = JSON.parse(u);
        if (parsed.email) {
          const prefix = parsed.email.split('@')[0].toLowerCase().replace(/[^a-z0-9-]/g, '');
          if (prefix && prefix.length >= 3) return `${prefix}.za3em.shop`;
        }
      }
    } catch {}
    return 'my-store.za3em.shop';
  });
  const [slogan, setSlogan] = useState('أفضل المنتجات المختارة بعناية مع التوصيل السريع لجميع محافظات العراق');

  // Read initial theme from URL query param if present (e.g. ?theme=store-nova or #/onboarding?theme=nova)
  const initialThemeFromUrl = (() => {
    try {
      if (typeof window !== 'undefined') {
        const search = window.location.search;
        const hash = window.location.hash;
        const urlParams = new URLSearchParams(search);
        let themeParam = urlParams.get('theme');
        if (!themeParam && hash.includes('?')) {
          const hashSearch = hash.split('?')[1];
          themeParam = new URLSearchParams(hashSearch).get('theme');
        }
        if (themeParam) {
          const clean = themeParam.toLowerCase().trim();
          return clean.startsWith('store-') ? clean : `store-${clean}`;
        }
      }
    } catch {}
    return null;
  })();

  const [selectedTheme, setSelectedTheme] = useState(() => initialThemeFromUrl || 'store-aurit');
  const [selectedNiche, setSelectedNiche] = useState(() => {
    if (initialThemeFromUrl === 'store-nova') return 'electronics';
    if (initialThemeFromUrl === 'store-classic') return 'perfumes';
    return 'fashion';
  });
  const [categories, setCategories] = useState<string[]>(() => {
    if (initialThemeFromUrl === 'store-nova') return ['شواحن وكفرات', 'ساعات ذكية', 'سماعات صوتية', 'أجهزة إلكترونية'];
    if (initialThemeFromUrl === 'store-classic') return ['عطور فرنسية', 'دهن عود وبخور', 'عناية بالبشرة'];
    return ['أزياء رجالي', 'فساتين وعبايات', 'أحذية رياضية', 'حقائب وإكسسوارات'];
  });
  const [newCatInput, setNewCatInput] = useState('');

  // Branding: Optional Logo & Banner
  const [logoUrl, setLogoUrl] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');

  // Store Code (Unique Store Identifier)
  const [storeCode] = useState(() => `ZAEEM-${Math.random().toString(36).substring(2, 8).toUpperCase()}`);

  // Real-time Subdomain Verification State
  const [subdomainCheck, setSubdomainCheck] = useState<{
    status: 'idle' | 'checking' | 'available' | 'unavailable';
    message: string;
    reason?: 'short' | 'invalid' | 'reserved' | 'taken';
    suggestions?: string[];
  }>({
    status: 'available',
    message: 'الدومين متاح ومحجوز لحسابك فوراً'
  });

  // Product Selection & Customization (Manual Addition Only)
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productCategory, setProductCategory] = useState('عام');
  const [productImage, setProductImage] = useState('');
  const [productAdded, setProductAdded] = useState(false);

  // Interactive Live Preview Controls
  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');
  const [fullscreenPreview, setFullscreenPreview] = useState<boolean>(false);
  const [previewQuantity, setPreviewQuantity] = useState(1);
  const [previewGov, setPreviewGov] = useState('بغداد');
  const [previewCustomerName, setPreviewCustomerName] = useState('');
  const [previewCustomerPhone, setPreviewCustomerPhone] = useState('');
  const [previewActiveCategory, setPreviewActiveCategory] = useState('الكل');
  const [previewIsReloading, setPreviewIsReloading] = useState(false);
  const [previewOrderPlaced, setPreviewOrderPlaced] = useState(false);
  const [templateFilter, setTemplateFilter] = useState<'all' | 'fashion' | 'perfumes' | 'electronics' | 'home' | 'general'>('all');
  const [previewReloadKey, setPreviewReloadKey] = useState<number>(0);
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);

  // Launch Modal State
  const [isLaunching, setIsLaunching] = useState(false);
  const [launchSuccessData, setLaunchSuccessData] = useState<{
    open: boolean;
    subdomain: string;
    storeName: string;
    templateName: string;
    storeCode: string;
    seedUrl?: string;
  } | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  // Full-Screen Template Live Preview Modal State
  const [previewModalTemplate, setPreviewModalTemplate] = useState<RealTemplateOption | null>(null);

  // Real-time Subdomain Verification with local and remote checking
  useEffect(() => {
    const rawClean = subdomain.replace('.za3em.shop', '').toLowerCase().trim();

    if (!rawClean) {
      setSubdomainCheck({
        status: 'unavailable',
        message: 'يرجى كتابة اسم الدومين الفرعي لمتجرك',
        reason: 'short'
      });
      return;
    }

    if (rawClean.length < 3) {
      setSubdomainCheck({
        status: 'unavailable',
        message: 'يجب أن يتكون الدومين من 3 أحرف إنجليزية أو أرقام على الأقل (مثال: my-store)',
        reason: 'short'
      });
      return;
    }

    if (!/^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(rawClean)) {
      setSubdomainCheck({
        status: 'unavailable',
        message: 'الدومين يجب أن يبدأ وينتهي بحرف أو رقم، ويحتوي على أحرف إنجليزية وأرقام وشرطة فقط',
        reason: 'invalid'
      });
      return;
    }

    setSubdomainCheck(prev => ({
      ...prev,
      status: 'checking',
      message: 'جاري فحص توفر الدومين لحظياً عبر السيرفر...'
    }));

    const timer = setTimeout(async () => {
      try {
        let currentEmail = '';
        try {
          const userRaw = localStorage.getItem('zaeem_user');
          if (userRaw) currentEmail = JSON.parse(userRaw)?.email || '';
        } catch {}
        const checkResult = await checkSubdomainAvailability(rawClean, currentEmail);
        setSubdomainCheck({
          status: checkResult.available ? 'available' : 'unavailable',
          message: checkResult.message,
          reason: checkResult.reason,
          suggestions: checkResult.suggestions
        });
      } catch {
        setSubdomainCheck({
          status: 'unavailable',
          message: 'تعذر التحقق من توفر الدومين في قاعدة البيانات، يرجى المحاولة مرة أخرى',
          reason: 'invalid'
        });
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [subdomain]);

  // Auto-fill from localStorage on initial load if present
  useEffect(() => {
    try {
      // Remove any legacy taken list from localStorage
      localStorage.removeItem('zaeem_registered_stores');

      const stored = localStorage.getItem('zaeem_store_data') || localStorage.getItem('zaeem_onboarded_store');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.storeName) {
          setStoreName(parsed.storeName);
        }
        if (parsed.subdomain) {
          const cleanSub = parsed.subdomain
            .toLowerCase()
            .replace('.za3em.shop', '')
            .replace(/[^a-z0-9-]/g, '');
          if (cleanSub) setSubdomain(`${cleanSub}.za3em.shop`);
        }
        if (parsed.logoUrl) setLogoUrl(parsed.logoUrl);
        if (parsed.bannerUrl) setBannerUrl(parsed.bannerUrl);
        if (parsed.templateId) setSelectedTheme(parsed.templateId);
      }
    } catch {}
  }, []);

  // Quick 1-Click Auto Pilot Filler (Random Unique Subdomain Every Time)
  const handleUseDefaultSample = () => {
    const samples = [
      { name: 'متجر الفخامة العراقي', subPrefix: 'fakhama', niche: 'perfumes', theme: 'store-classic', cats: ['عطور رجالي', 'عطور نسائي', 'بخور ومباخر'] },
      { name: 'متجر شوب ويل بغداد', subPrefix: 'shopwell', niche: 'fashion', theme: 'store-aurit', cats: ['أزياء رجالي', 'أحذية رياضية', 'حقائب'] },
      { name: 'متجر نوفا تك العراق', subPrefix: 'novatech', niche: 'electronics', theme: 'store-nova', cats: ['ساعات ذكية', 'سماعات صوتية', 'شواحن'] },
      { name: 'بوتيك بلاد الرافدين', subPrefix: 'mesopotamia', niche: 'perfumes', theme: 'store-classic', cats: ['عطور ملكية', 'عود كمبودي', 'مستحضرات فاخرة'] },
      { name: 'تريندات العراق شوب', subPrefix: 'iraq-trend', niche: 'general', theme: 'store-aurit', cats: ['الأكثر طلباً', 'عروض التوفير', 'إلكترونيات'] }
    ];
    const picked = samples[Math.floor(Math.random() * samples.length)];
    const randNum = Math.floor(1000 + Math.random() * 9000);
    const uniqueSub = `${picked.subPrefix}-${randNum}`;

    setStoreName(picked.name);
    setSubdomain(`${uniqueSub}.za3em.shop`);
    setSlogan('أفضل المنتجات المختارة بعناية والشحن السريع لجميع محافظات العراق مع الدفع عند الاستلام');
    setSelectedNiche(picked.niche);
    setSelectedTheme(picked.theme);
    setCategories(picked.cats);
    setProductCategory(picked.cats[0] || 'عام');
    setCurrentStep(5);
  };

  // Step 2 Niche Switch Helper
  const handleSelectNiche = (nicheId: string) => {
    setSelectedNiche(nicheId);
    const found = NICHE_OPTIONS.find(n => n.id === nicheId);
    if (found) {
      setCategories(found.defaultCats);
      setProductCategory(found.defaultCats[0] || 'عام');
      if (found.recommendedTheme) {
        setSelectedTheme(found.recommendedTheme);
      }
    }
  };

  const handleAddCategory = () => {
    if (newCatInput.trim() && !categories.includes(newCatInput.trim())) {
      setCategories([...categories, newCatInput.trim()]);
      setNewCatInput('');
    }
  };

  const handleRemoveCategory = (catToRemove: string) => {
    setCategories(categories.filter(c => c !== catToRemove));
  };

  // External live preview router for templates (e.g. nova.za3em.shop, classic.za3em.shop, aurit.za3em.shop)
  const handlePreviewTemplateExternal = (templateId: string) => {
    const cleanId = templateId.replace('store-', '').toLowerCase();
    const isLocal = typeof window !== 'undefined' && (window.location.hostname.includes('localhost') || window.location.hostname.includes('127.0.0.1'));
    const targetUrl = isLocal ? `/#/store/${cleanId}` : `https://${cleanId}.za3em.shop`;
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  // Permanent Base64 Image Reader with Automatic Canvas Compression (Prevents broken blob URLs & huge payloads)
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    target: 'product' | 'logo' | 'banner'
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Validate image safety & NSFW heuristics
      const safety = await validateProductImageSafety(file, file.name);
      if (!safety.isSafe) {
        alert(safety.reason || 'عذراً، تم حظر الصورة لمخالفتها معايير النشر ومحتوى المنصة.');
        e.target.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const rawResult = reader.result as string;
        // Compress image via HTML5 Canvas to keep SQL payload ultralight (< 80KB)
        const img = new Image();
        img.src = rawResult;
        img.onload = () => {
          const maxDim = target === 'banner' ? 1200 : 800;
          let width = img.width;
          let height = img.height;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.75);

          if (target === 'product') {
            setProductImage(compressed);
            setProductAdded(true);
          } else if (target === 'logo') {
            setLogoUrl(compressed);
          } else if (target === 'banner') {
            setBannerUrl(compressed);
          }
        };
        img.onerror = () => {
          if (target === 'product') {
            setProductImage(rawResult);
            setProductAdded(true);
          } else if (target === 'logo') {
            setLogoUrl(rawResult);
          } else if (target === 'banner') {
            setBannerUrl(rawResult);
          }
        };
      };
      reader.readAsDataURL(file);
    }
  };


  // Final Complete & Online Launch Store
  const handleCompleteAndLaunch = async () => {
    const cleanSub = subdomain.replace('.za3em.shop', '').toLowerCase().trim();

    if (subdomainCheck.status === 'unavailable') {
      alert(`عذراً، النطاق الفرعي (${cleanSub}.za3em.shop) غير متاح أو محجوز مسبقاً. يرجى اختيار اسم متاح أولاً.`);
      return;
    }

    setIsLaunching(true);

    const userRaw = localStorage.getItem('zaeem_user');
    let userEmail: string | undefined = undefined;
    let ownerId: string | undefined = undefined;
    if (userRaw) {
      try {
        const u = JSON.parse(userRaw);
        userEmail = u.email;
        ownerId = u.id;
      } catch {}
    }

    const payload = {
      storeCode,
      subdomain: cleanSub,
      storeName,
      slogan,
      templateId: selectedTheme,
      userEmail,
      ownerId,
      categories,
      logoUrl: logoUrl || undefined,
      bannerUrl: bannerUrl || undefined,
      product: {
        id: 1,
        name: productName,
        title: productName,
        price: Number(productPrice) || 45000,
        compareAtPrice: Math.round((Number(productPrice) || 45000) * 1.3),
        category: productCategory,
        image: productImage,
        imageUrl: productImage,
        description: slogan,
      },
      freeShipmentsRemaining: 5,
    };

    // 1. Save custom product directly to store state so it is live in catalog & dashboard
    try {
      const customStoreProduct: StoreProduct = {
        id: 1,
        name: productName || 'منتج المتجر الحصري',
        sku: `PRD-${cleanSub.toUpperCase()}`,
        description: slogan || 'منتج أصلي معتمد مع شحن سريع لجميع محافظات العراق ودفع عند الاستلام',
        price: Number(productPrice) || 45000,
        compareAtPrice: Math.round((Number(productPrice) || 45000) * 1.3),
        stock: 50,
        lowStockThreshold: 5,
        category: productCategory || 'عام',
        status: 'active',
        imageUrl: productImage || 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&auto=format&fit=crop&q=80',
        weightGrams: 500
      };
      const curProducts = getStoredProducts();
      const updatedProds = [customStoreProduct, ...curProducts.filter(p => p.id !== 1 && p.name !== customStoreProduct.name)];
      saveStoredProducts(updatedProds);
    } catch (e) {
      console.warn('Failed saving custom product to store state:', e);
    }

    // 2. Register store in local storage, cookies, and reserved list
    registerStore(payload);

    // Also persist in zaeem_onboarded_store for immediate restoration upon login
    try {
      localStorage.setItem('zaeem_onboarded_store', JSON.stringify({
        ...payload,
        fullSubdomain: `${cleanSub}.za3em.shop`,
        completedAt: new Date().toISOString()
      }));
      localStorage.setItem('zaeem_onboarding_completed', 'true');
      localStorage.setItem('zaeem_auth_action', 'signin');
      if (userRaw) {
        const u = JSON.parse(userRaw);
        localStorage.setItem('zaeem_user', JSON.stringify({
          ...u,
          storeName,
          subdomain: `${cleanSub}.za3em.shop`,
          onboarding_completed: true
        }));
      }
    } catch {}

    // 3. Register directly in Central Neon Cloud PostgreSQL Database (universal cross-subdomain truth)
    try {
      const saved = await saveCloudStore({
        storeName,
        subdomain: cleanSub,
        templateId: selectedTheme,
        storeCode,
        userEmail,
        ownerId,
        slogan,
        logoUrl: logoUrl || undefined,
        bannerUrl: bannerUrl || undefined,
        categories,
        product: (typeof productName !== 'undefined' && productName && productName !== 'عطر تاج الفخامة الفرنسي الملكي') ? {
          id: 1,
          title: productName,
          name: productName,
          price: Number(typeof productPrice !== 'undefined' ? productPrice : 0),
          compareAtPrice: Math.round((Number(typeof productPrice !== 'undefined' ? productPrice : 0)) * 1.3),
          imageUrl: typeof productImage !== 'undefined' ? productImage : undefined,
          description: slogan || '',
          category: typeof productCategory !== 'undefined' ? productCategory : 'عام',
        } : undefined
      });
      if (!saved) {
        console.warn('First save attempt returned false, retrying with lightweight safe payload...');
        await saveCloudStore({
          storeName,
          subdomain: cleanSub,
          templateId: selectedTheme,
          storeCode,
          userEmail,
          ownerId,
          slogan,
          categories,
          product: (typeof productName !== 'undefined' && productName && productName !== 'عطر تاج الفخامة الفرنسي الملكي') ? {
            id: 1,
            title: productName,
            price: Number(typeof productPrice !== 'undefined' ? productPrice : 0),
            compareAtPrice: Math.round((Number(typeof productPrice !== 'undefined' ? productPrice : 0)) * 1.3),
            imageUrl: typeof productImage !== 'undefined' ? productImage : undefined,
            description: slogan || '',
            category: typeof productCategory !== 'undefined' ? productCategory : 'عام',
          } : undefined
        });
      }
    } catch (cloudErr) {
      console.warn('Neon Cloud store register fallback:', cloudErr);
    }


    // 3b. Register with server API to permanently bind subdomain and template in database
    try {
      await fetch('/api/tenant/stores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeCode,
          name: storeName,
          subdomain: cleanSub,
          templateId: selectedTheme,
          userEmail,
          ownerId,
          slogan,
          productTitle: productName,
          productPrice: Number(productPrice) || 45000,
          productImage: productImage,
          productCompareAtPrice: Math.round((Number(productPrice) || 45000) * 1.3),
          productDescription: slogan,
          productCategory,
          logoUrl: logoUrl || undefined,
          bannerUrl: bannerUrl || undefined,
          categories,
          product: payload.product
        })
      });
    } catch (apiErr) {
      console.warn('API store register fallback:', apiErr);
    }

    // 4. Update Supabase user metadata with onboarding_completed = true and full store settings
    try {
      const userRaw = localStorage.getItem('zaeem_user');
      if (userRaw) {
        const u = JSON.parse(userRaw);
        if (u.token) {
          await fetch('https://cfpmbasxvjlcfcteyyaa.supabase.co/auth/v1/user', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'apikey': 'sb_publishable_sCozsAhhHZ9v9nWEkiNVlQ_Ne5IoXq2',
              'Authorization': `Bearer ${u.token}`
            },
            body: JSON.stringify({
              data: {
                onboarding_completed: true,
                store_code: storeCode,
                store_name: storeName,
                subdomain: `${cleanSub}.za3em.shop`,
                template_id: selectedTheme,
                selected_theme: selectedTheme,
                slogan: slogan,
                categories: categories,
                product: payload.product
              }
            })
          }).catch(() => null);
        }
      }
    } catch (sbErr) {
      console.warn('Supabase metadata update error:', sbErr);
    }

    setIsLaunching(false);

    // 2.5 Dispatch mandatory warehouse address notification to merchant
    try {
      addAppNotification({
        title: '⚠️ تنبيه إجباري: يرجى إضافة عنوان المخزن لاستلام الشحنات',
        desc: 'لتتمكن من إرسال شحناتك واستلام الكباتن للبضاعة وتوصيلها للزبائن، يرجى ملء بيانات المستودع وعنوان الراسل في الإعدادات.',
        type: 'system',
        link: '/settings'
      });
      addAppNotification({
        title: `🎉 مبروك! تم إطلاق ${storeName} بنجاح`,
        desc: `متجرك الإلكتروني أصبح متاحاً الآن بقالب ${activeTheme.name} على الرابط https://${cleanSub}.za3em.shop`,
        type: 'system',
        link: '/dashboard'
      });
    } catch {}

    // 3. Show Launch Success Celebration Modal
    const activeT = REAL_STORE_TEMPLATES.find(t => t.id === selectedTheme) || REAL_STORE_TEMPLATES[0];
    const seed = encodeStoreSeed(payload);

    setLaunchSuccessData({
      open: true,
      subdomain: cleanSub,
      storeName,
      templateName: activeT.name,
      storeCode,
      seedUrl: `https://${cleanSub}.za3em.shop/#init=${seed}`,
    });
  };

  const handleCopyStoreLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2500);
  };

  const handleCopyStoreCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2500);
  };

  const activeTheme = REAL_STORE_TEMPLATES.find(t => t.id === selectedTheme) || REAL_STORE_TEMPLATES[0];

  const [existingStoreInfo] = useState<{
    hasStore: boolean;
    storeName?: string;
    storeCode?: string;
    subdomain?: string;
  }>(() => {
    try {
      const raw = localStorage.getItem('zaeem_onboarded_store') || localStorage.getItem('zaeem_store_data');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.storeCode && (localStorage.getItem('zaeem_onboarding_completed') === 'true')) {
          return {
            hasStore: true,
            storeName: parsed.storeName,
            storeCode: parsed.storeCode,
            subdomain: parsed.subdomain
          };
        }
      }
    } catch {}
    return { hasStore: false };
  });

  if (authStatus === 'checking' || authStatus === 'unauthenticated') {
    return (
      <div dir="rtl" className="min-h-screen bg-[#0b0f19] text-slate-200 flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4 text-center max-w-sm">
          <div className="size-16 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center shadow-lg shadow-teal-500/10 animate-pulse">
            <Logo className="size-10" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-lg font-bold text-white">منصة الزعيم للتجارة الإلكترونية</h3>
            <p className="text-xs text-slate-400">جاري التحقق من بيانات الدخول وحالة الحساب...</p>
          </div>
          <div className="flex items-center gap-1.5 text-teal-400 text-xs mt-2">
            <span className="size-2 rounded-full bg-teal-400 animate-ping" />
            <span>يرجى الانتظار لحظات</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main dir="rtl" className="min-h-[100dvh] bg-[#0b0f19] text-slate-200 font-sans select-none flex flex-col relative overflow-x-hidden">
      {/* Background Soft Glows (Teal & Emerald Homepage Palette) */}
      <div className="fixed top-0 right-1/4 -z-10 size-96 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-1/4 -z-10 size-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* ========================================================================= */}
      {/* 1️⃣ TOP HEADER: Store Identity & Dynamic Brand Logo */}
      {/* ========================================================================= */}
      <header className="border-b border-slate-800 bg-[#0f172a]/95 backdrop-blur-md sticky top-0 z-40 px-4 md:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          {/* Dynamic Store Icon / Uploaded Logo */}
          <div className="relative size-10 rounded-xl overflow-hidden shadow-md border border-teal-500/40 bg-slate-900 grid place-items-center shrink-0">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={storeName || 'شعار المتجر'}
                className="size-full object-cover"
              />
            ) : (
              <span className="text-base font-black text-teal-400">
                {(storeName || 'م').charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          <div className="h-6 w-px bg-slate-800 hidden sm:block" />

          {/* Store Name & Store Subtitle */}
          <div className="text-right">
            <h1 className="text-sm font-black text-white flex items-center gap-1.5 leading-tight">
              <span>{storeName || 'متجري الإلكتروني'}</span>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                متجر إلكتروني
              </span>
            </h1>
            <p className="text-[10px] text-slate-400 mt-0.5">مركز تخصيص وإطلاق متجرك الإلكتروني على الإنترنت</p>
          </div>
        </div>

        {/* Action Button: Ready Template (Teal & Emerald Theme) */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleUseDefaultSample}
            className="flex items-center gap-2 rounded-xl border border-teal-500/40 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 px-4 py-2 text-xs font-black text-white transition-all shadow-lg shadow-teal-600/25 hover:scale-[1.02] cursor-pointer"
          >
            <Wand2 className="size-3.5 text-teal-200" />
            <span>نموذج جاهز بنقرة واحدة</span>
          </button>

          {/* Step Counter Pill */}
          <div className="flex items-center gap-2.5 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-1.5 text-xs">
            <span className="font-mono font-black text-teal-400 text-[11px]">
              {currentStep * 20}%
            </span>
            <span className="text-[10px] font-bold text-slate-400 hidden sm:inline">
              الخطوة {currentStep} من 5
            </span>
          </div>
        </div>
      </header>

      {/* Existing Store Notification Banner */}
      {existingStoreInfo.hasStore && (
        <div className="bg-gradient-to-r from-teal-950/90 via-slate-900 to-emerald-950/90 border-b border-teal-500/30 px-4 md:px-8 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-teal-200">
            <CheckCircle2 className="size-4 text-teal-400 shrink-0" />
            <span>
              لديك متجر نشط محفوظ: <strong>{existingStoreInfo.storeName}</strong> (رمز المتجر: <code className="font-mono text-white bg-teal-900/60 px-2 py-0.5 rounded border border-teal-700">{existingStoreInfo.storeCode}</code>).
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              window.location.hash = '#/dashboard';
              setLocation('/dashboard');
            }}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black text-xs transition-all cursor-pointer shadow-lg shadow-teal-500/25 hover:scale-105"
          >
            <span>الانتقال المباشر إلى لوحة التحكم</span>
            <ChevronLeft className="size-4 text-slate-950" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2️⃣ STEP TRACKER */}
      {/* ========================================================================= */}
      <div className="border-b border-slate-800/80 bg-[#0d1424]/80 backdrop-blur-sm px-4 md:px-8 py-2.5 overflow-x-auto rf-scrollbar">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-2 min-w-[650px]">
          {[
            { step: 1, title: 'هوية المتجر', subtitle: 'الاسم والدومين والشعار', icon: Globe },
            { step: 2, title: 'مجال التجارة', subtitle: 'التخصص والتصنيفات', icon: Tag },
            { step: 3, title: 'قالب المتجر', subtitle: 'اختر تصميم موقعك', icon: ShoppingBag },
            { step: 4, title: 'المنتج الأول', subtitle: 'تخصيص ورصيد الشحن', icon: Package },
            { step: 5, title: 'الإطلاق المباشر', subtitle: 'نشر فوري أونلاين', icon: CheckCheck }
          ].map((item) => {
            const isCompleted = currentStep > item.step;
            const isCurrent = currentStep === item.step;

            return (
              <button
                key={item.step}
                type="button"
                onClick={() => setCurrentStep(item.step)}
                className={`flex-1 flex items-center gap-2.5 p-2 rounded-2xl transition-all cursor-pointer text-right ${
                  isCurrent
                    ? 'bg-teal-950/60 border border-teal-500/40 text-white shadow-md shadow-teal-950/40 ring-1 ring-teal-500/30'
                    : isCompleted
                    ? 'bg-slate-900/50 text-slate-300 hover:bg-slate-900 border border-slate-800/60'
                    : 'text-slate-500 hover:text-slate-400 opacity-60'
                }`}
              >
                <span className={`size-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                  isCurrent
                    ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-sm'
                    : isCompleted
                    ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {isCompleted ? <Check className="size-3.5 stroke-[3]" /> : item.step}
                </span>

                <div className="overflow-hidden">
                  <p className={`text-xs font-black truncate leading-tight ${isCurrent ? 'text-teal-300' : 'text-slate-200'}`}>
                    {item.title}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">
                    {item.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3️⃣ MAIN LAYOUT: Wizard (7 cols) + Real Live Preview (5 cols) */}
      {/* ========================================================================= */}
      <div className="flex-1 max-w-[1500px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 p-4 md:p-8">

        {/* LEFT: Config Wizard Steps */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6 order-1">

          {/* STEP 1: Store Identity & Subdomain & Branding */}
          {currentStep === 1 && (
            <div className="rounded-3xl border border-slate-800 bg-[#0f172a]/95 backdrop-blur-xl p-6 md:p-8 space-y-6 shadow-2xl animate-fadeIn text-right">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] font-black text-teal-400 bg-teal-950/60 px-2.5 py-1 rounded-full border border-teal-800/40">
                    الخطوة 1 من 5 • هوية المتجر
                  </span>
                  <h2 className="text-xl font-black text-white mt-2">
                    اسم متجرك وحجز الدومين والشعار
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    هذا الدومين هو الرابط الحقيقي المباشر لمتجرك على الإنترنت.
                  </p>
                </div>
                <div className="size-12 rounded-2xl bg-teal-500/10 text-teal-400 grid place-items-center border border-teal-500/20">
                  <Globe className="size-6" />
                </div>
              </div>

              {/* Store Name Input */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-200 block">
                  اسم المتجر التجاري *
                </label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => {
                    setStoreName(e.target.value);
                    const clean = e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '') || 'store';
                    setSubdomain(`${clean}.za3em.shop`);
                  }}
                  placeholder="مثال: متجر الفخامة العراقي"
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all"
                />

                {/* Quick Name Suggestions */}
                <div className="flex items-center gap-2 pt-1 flex-wrap">
                  <span className="text-[10px] text-slate-400 font-bold">اقتراحات سريعة:</span>
                  {['متجر الفخامة', 'بوتيك الزعيم', 'أوريت إكسبريس', 'ركن الأناقة'].map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => {
                        setStoreName(suggestion);
                        const clean = suggestion.toLowerCase().replace(/[^a-z0-9]/g, '') || 'store';
                        setSubdomain(`${clean}.za3em.shop`);
                      }}
                      className="text-[10px] font-bold text-slate-300 bg-slate-900 hover:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-800 transition-colors cursor-pointer"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subdomain Input with Real-time Verification */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-slate-200 block">
                    رابط موقعك الفرعي المباشر (Subdomain)
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">
                    فحص حقيقي مؤكد
                  </span>
                </div>

                <div className={`flex items-center rounded-2xl border bg-slate-950 px-4 py-3 transition-all ${
                  subdomainCheck.status === 'checking'
                    ? 'border-teal-500/60 ring-2 ring-teal-500/10'
                    : subdomainCheck.status === 'available'
                    ? 'border-teal-500/80 ring-2 ring-teal-500/20'
                    : 'border-rose-500/80 ring-2 ring-rose-500/20'
                }`}>
                  <input
                    type="text"
                    value={subdomain.replace('.za3em.shop', '')}
                    onChange={(e) => {
                      const clean = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
                      setSubdomain(`${clean}.za3em.shop`);
                    }}
                    placeholder="my-store"
                    dir="ltr"
                    className="flex-1 bg-transparent text-sm font-mono text-white focus:outline-none text-right placeholder:text-slate-600"
                  />
                  <span className="text-slate-400 text-xs font-mono font-bold select-none pr-1 pl-2">
                    .za3em.shop
                  </span>

                  <div className="shrink-0 flex items-center pr-2 border-r border-slate-800 mr-1">
                    {subdomainCheck.status === 'checking' && (
                      <span title="جاري الفحص...">
                        <RefreshCw className="size-4 text-teal-400 animate-spin" />
                      </span>
                    )}
                    {subdomainCheck.status === 'available' && (
                      <span title="متاح للحجز">
                        <CheckCircle2 className="size-4 text-emerald-400" />
                      </span>
                    )}
                    {subdomainCheck.status === 'unavailable' && (
                      <span title="غير متاح">
                        <AlertCircle className="size-4 text-rose-400" />
                      </span>
                    )}
                  </div>
                </div>

                {/* Subdomain Feedback */}
                <div className="space-y-1.5 pt-0.5">
                  <div className="flex items-center justify-between text-xs">
                    {subdomainCheck.status === 'checking' && (
                      <span className="text-teal-400 font-bold flex items-center gap-1.5 text-[11px]">
                        <RefreshCw className="size-3 animate-spin" />
                        <span>{subdomainCheck.message}</span>
                      </span>
                    )}

                    {subdomainCheck.status === 'available' && (
                      <span className="text-emerald-400 font-bold flex items-center gap-1.5 text-[11px]">
                        <CheckCircle2 className="size-3.5" />
                        <span>{subdomainCheck.message}</span>
                      </span>
                    )}

                    {subdomainCheck.status === 'unavailable' && (
                      <span className="text-rose-400 font-bold flex items-center gap-1.5 text-[11px]">
                        <AlertCircle className="size-3.5" />
                        <span>{subdomainCheck.message}</span>
                      </span>
                    )}

                    <span className="text-[10px] font-mono text-slate-500 hidden sm:inline">
                      شهادة أمان SSL معتمدة
                    </span>
                  </div>

                  {subdomainCheck.status === 'unavailable' && subdomainCheck.suggestions && subdomainCheck.suggestions.length > 0 && (
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] space-y-1.5 animate-fadeIn">
                      <span className="text-slate-400 font-bold block">اقتراحات بديلة متاحة لمتجرك:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {subdomainCheck.suggestions.map((sug) => (
                          <button
                            key={sug}
                            type="button"
                            onClick={() => setSubdomain(`${sug}.za3em.shop`)}
                            className="px-2.5 py-1 rounded-lg bg-teal-950/60 hover:bg-teal-900/80 text-teal-300 font-mono text-[11px] border border-teal-800/60 transition-colors cursor-pointer"
                          >
                            {sug}.za3em.shop +
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Slogan */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-200 block">
                  شعار المتجر أو النبذة الترحيبية (Slogan)
                </label>
                <input
                  type="text"
                  value={slogan}
                  onChange={(e) => setSlogan(e.target.value)}
                  placeholder="مثال: أفضل المنتجات بأسعار منافسة والتوصيل السريع لجميع محافظات العراق"
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-xs text-white focus:border-teal-500 focus:outline-none transition-all"
                />
              </div>

              {/* Optional Store Logo & Banner Uploads */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
                {/* Logo Upload */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 block">
                    شعار المتجر (Logo) — اختياري
                  </label>
                  <div className="relative rounded-2xl border border-slate-800 bg-slate-950 p-3 flex items-center gap-3 hover:border-teal-500/50 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'logo')}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <div className="size-12 rounded-xl bg-slate-900 border border-slate-800 grid place-items-center shrink-0 overflow-hidden">
                      {logoUrl ? (
                        <img src={logoUrl} alt="Logo" className="size-full object-cover" />
                      ) : (
                        <Upload className="size-5 text-slate-500" />
                      )}
                    </div>
                    <div className="text-right overflow-hidden">
                      <p className="text-xs font-bold text-white truncate">
                        {logoUrl ? 'تم اختيار الشعار' : 'رفع لوجو المتجر'}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">PNG, JPG أو SVG</p>
                    </div>
                    {logoUrl && (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setLogoUrl(''); }}
                        className="mr-auto text-slate-400 hover:text-rose-400 text-xs font-bold p-1 z-10"
                        title="إزالة الشعار"
                      >
                        إزالة
                      </button>
                    )}
                  </div>
                </div>

                {/* Banner Upload */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 block">
                    بنر المتجر الترويجي (Banner) — اختياري
                  </label>
                  <div className="relative rounded-2xl border border-slate-800 bg-slate-950 p-3 flex items-center gap-3 hover:border-teal-500/50 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'banner')}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <div className="size-12 rounded-xl bg-slate-900 border border-slate-800 grid place-items-center shrink-0 overflow-hidden">
                      {bannerUrl ? (
                        <img src={bannerUrl} alt="Banner" className="size-full object-cover" />
                      ) : (
                        <Upload className="size-5 text-slate-500" />
                      )}
                    </div>
                    <div className="text-right overflow-hidden">
                      <p className="text-xs font-bold text-white truncate">
                        {bannerUrl ? 'تم اختيار البنر' : 'رفع بنر أعلى الموقع'}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">أبعاد عريضة 1200x400</p>
                    </div>
                    {bannerUrl && (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setBannerUrl(''); }}
                        className="mr-auto text-slate-400 hover:text-rose-400 text-xs font-bold p-1 z-10"
                        title="إزالة البنر"
                      >
                        إزالة
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Niche & Categories */}
          {currentStep === 2 && (
            <div className="rounded-3xl border border-slate-800 bg-[#0f172a]/95 backdrop-blur-xl p-6 md:p-8 space-y-6 shadow-2xl animate-fadeIn text-right">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] font-black text-teal-400 bg-teal-950/60 px-2.5 py-1 rounded-full border border-teal-800/40">
                    الخطوة 2 من 5 • تخصص المتجر
                  </span>
                  <h2 className="text-xl font-black text-white mt-2">
                    ما هو مجال تجارتك والأقسام الرئيسية؟
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    اختر نشاطك التجاري ليتم تخصيص الأقسام والقالب المناسب لمتجرك تلقائياً.
                  </p>
                </div>
                <div className="size-12 rounded-2xl bg-teal-500/10 text-teal-400 grid place-items-center border border-teal-500/20">
                  <Tag className="size-6" />
                </div>
              </div>

              {/* Niche Selector Grid */}
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-200 block">
                  اختر تخصص متجرك:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {NICHE_OPTIONS.map((niche) => {
                    const Icon = niche.icon;
                    const isSelected = selectedNiche === niche.id;

                    return (
                      <button
                        key={niche.id}
                        type="button"
                        onClick={() => handleSelectNiche(niche.id)}
                        className={`flex flex-col items-start justify-between p-4 rounded-2xl border text-right transition-all cursor-pointer h-28 ${
                          isSelected
                            ? 'border-teal-500 bg-teal-950/50 text-white shadow-lg shadow-teal-950/50 ring-2 ring-teal-500/40 scale-[1.02]'
                            : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <Icon className={`size-5 ${isSelected ? 'text-teal-400' : 'text-slate-400'}`} />
                          {isSelected && (
                            <span className="size-4 rounded-full bg-teal-600 text-white grid place-items-center text-[9px] font-black">
                              ✓
                            </span>
                          )}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-xs text-white">{niche.label}</h4>
                          <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{niche.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Categories Pills Manager */}
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-slate-200 block">
                    أقسام وتصنيفات المتجر (يمكنك التعديل والحذف والإضافة):
                  </label>
                  <span className="text-[10px] text-teal-400 font-bold">{categories.length} أقسام محددة</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {categories.map((cat, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-slate-200"
                    >
                      <span>{cat}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveCategory(cat)}
                        className="text-slate-400 hover:text-rose-400 font-black cursor-pointer"
                        title="حذف هذا القسم"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex gap-2 pt-2">
                  <input
                    type="text"
                    value={newCatInput}
                    onChange={(e) => setNewCatInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCategory(); } }}
                    placeholder="اكتب اسم قسم جديد واضغط إضافة..."
                    className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-xs text-white focus:border-teal-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddCategory}
                    className="rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 px-5 text-xs font-bold text-white transition-colors cursor-pointer shadow-md"
                  >
                    + إضافة
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Real E-Commerce Shopping Templates Selection */}
          {currentStep === 3 && (
            <div className="rounded-3xl border border-slate-800 bg-[#0f172a]/95 backdrop-blur-xl p-6 md:p-8 space-y-6 shadow-2xl animate-fadeIn text-right">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] font-black text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-800/40">
                    الخطوة 3 من 5 • قوالب وتصميمات المتجر المعتمدة (الجديدة)
                  </span>
                  <h2 className="text-xl font-black text-white mt-2">
                    اختر تصميم متجرك الفعلي من القوالب المعتمدة
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    12 ثيم تسوق حقيقي معتمد بالكامل يدعم سلة المشتريات، بوليصة شحن أسطول الزعيم، وتأكيد الطلب السريع.
                  </p>
                </div>
                <div className="size-12 rounded-2xl bg-emerald-500/10 text-emerald-400 grid place-items-center border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
                  <ShoppingBag className="size-6" />
                </div>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 rf-scrollbar select-none">
                {[
                  { key: 'all', label: 'جميع القوالب (12)' },
                  { key: 'fashion', label: 'أزياء وملابس' },
                  { key: 'perfumes', label: 'عطور وتجميل' },
                  { key: 'electronics', label: 'إلكترونيات وتقنية' },
                  { key: 'home', label: 'ديكور ومنزل' },
                  { key: 'general', label: 'ميجا ستور وشامل' },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setTemplateFilter(tab.key as any)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                      templateFilter === tab.key
                        ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md shadow-teal-600/30'
                        : 'bg-slate-900/90 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Full Store Templates Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[580px] overflow-y-auto rf-scrollbar pr-1">
                {REAL_STORE_TEMPLATES
                  .filter(tmpl => templateFilter === 'all' || tmpl.categoryKey === templateFilter)
                  .map((tmpl) => {
                    const isSelected = selectedTheme === tmpl.id;

                    return (
                      <div
                        key={tmpl.id}
                        onClick={() => {
                          setSelectedTheme(tmpl.id);
                          setPreviewReloadKey(k => k + 1);
                        }}
                        className={`relative rounded-2xl border p-4 transition-all flex flex-col justify-between space-y-3 cursor-pointer group ${
                          isSelected
                            ? 'border-emerald-500 bg-slate-900/95 ring-2 ring-emerald-500/40 shadow-xl scale-[1.01]'
                            : 'bg-slate-950/60 border-slate-800/90 hover:border-slate-700 opacity-90 hover:opacity-100 hover:bg-slate-900/60'
                        }`}
                      >
                        <div className="space-y-3">
                          <div className="relative h-40 rounded-xl overflow-hidden border border-slate-800 shadow-md">
                            <img
                              src={tmpl.heroImage}
                              alt={tmpl.name}
                              className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

                            <div className="absolute top-2.5 right-2.5 left-2.5 flex items-center justify-between">
                              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-slate-950/90 text-emerald-300 border border-emerald-500/40 shadow-sm backdrop-blur-sm">
                                {tmpl.badge}
                              </span>
                              {isSelected && (
                                <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-teal-600 to-emerald-600 text-white text-[10px] font-black flex items-center gap-1 shadow-lg shadow-teal-600/40 animate-pulse">
                                  <Check className="size-3 stroke-[3]" /> مفعّل لمتجرك
                                </span>
                              )}
                            </div>

                            <div className="absolute bottom-2.5 right-3 left-3 text-right">
                              <h4 className="text-sm font-black text-white flex items-center gap-2">
                                <span>{tmpl.name}</span>
                                <span className={`size-2.5 rounded-full ${tmpl.colorDot}`} />
                              </h4>
                              <p className="text-[10px] text-teal-300 font-bold mt-0.5">{tmpl.categoryTitle}</p>
                            </div>
                          </div>

                          <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-2">
                            {tmpl.tagline}
                          </p>

                          {/* Palette color dots & Features */}
                          <div className="flex items-center justify-between gap-2 pt-1">
                            <div className="flex flex-wrap gap-1">
                              {tmpl.features.slice(0, 2).map((feat, fIdx) => (
                                <span
                                  key={fIdx}
                                  className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-black/40 border border-white/10 text-slate-300 truncate max-w-[150px]"
                                >
                                  ✓ {feat}
                                </span>
                              ))}
                            </div>

                            <div className="flex items-center gap-1 shrink-0 bg-black/40 px-2 py-1 rounded-md border border-white/10">
                              {tmpl.palette.map((colorHex, cIdx) => (
                                <span
                                  key={cIdx}
                                  style={{ backgroundColor: colorHex }}
                                  className="size-2.5 rounded-full border border-black/30"
                                  title={colorHex}
                                />
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                          <span className={`text-[10px] font-bold ${isSelected ? 'text-emerald-400' : 'text-slate-400'}`}>
                            {isSelected ? '✓ الثيم المختار' : 'اضغط للتطبيق'}
                          </span>

                          <div className="flex items-center gap-1.5">
                            {/* Live Interactive Fullscreen Preview Modal */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedTheme(tmpl.id);
                                setPreviewReloadKey(k => k + 1);
                                setFullscreenPreview(true);
                              }}
                              className="flex items-center gap-1 text-[11px] font-bold text-teal-300 hover:text-white bg-teal-950/60 hover:bg-teal-900 border border-teal-800/60 px-2.5 py-1 rounded-lg transition-colors cursor-pointer shadow-sm"
                              title={`معاينة تفاعلية حية لمتجرك بقالب ${tmpl.name}`}
                            >
                              <Eye className="size-3 text-teal-400" />
                              <span>معاينة حية</span>
                            </button>

                            {/* Quick Modal Preview */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setPreviewModalTemplate(tmpl);
                              }}
                              className="flex items-center gap-1 text-[11px] font-bold text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                              title="تفاصيل ومميزات الثيم"
                            >
                              <span>تفاصيل</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>

              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-3 text-xs text-emerald-200">
                <ShieldCheck className="size-5 text-emerald-400 shrink-0" />
                <span>
                  جميع القوالب الـ 12 معتمدة ومجانية 100%، متوافقة مع أحدث هوية بصرية للمنصة ومربوطة بسلة التسوق والشحن السريع لأسطول الزعيم في كافة محافظات العراق.
                </span>
              </div>
            </div>
          )}

          {/* STEP 4: First Product & Customization (Manual Addition Only) */}
          {currentStep === 4 && (
            <div className="rounded-3xl border border-slate-800 bg-[#0f172a]/95 backdrop-blur-xl p-6 md:p-8 space-y-6 shadow-2xl animate-fadeIn text-right">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] font-black text-teal-400 bg-teal-950/60 px-2.5 py-1 rounded-full border border-teal-800/40">
                    الخطوة 4 من 5 • إضافة منتجك الأول
                  </span>
                  <h2 className="text-xl font-black text-white mt-2">
                    أضف منتجك الأول يدوياً لمتجرك
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    أدخل بيانات منتجك الحقيقي وسعره وصورته ليتم نشره في متجرك فوراً.
                  </p>
                </div>
                <div className="size-12 rounded-2xl bg-teal-500/10 text-teal-400 grid place-items-center border border-teal-500/20">
                  <Package className="size-6" />
                </div>
              </div>

              {/* Product Form */}
              <div className="space-y-4 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1 text-right">
                    <label className="text-xs font-bold text-slate-300 block">اسم المنتج *</label>
                    <input
                      type="text"
                      value={productName}
                      onChange={(e) => { setProductName(e.target.value); setProductAdded(true); }}
                      placeholder="مثال: ساعة لومينور الفاخرة أو عطر خاص"
                      className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-xs text-white focus:border-teal-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1 text-right">
                    <label className="text-xs font-bold text-slate-300 block">السعر بالدينار العراقي (د.ع) *</label>
                    <input
                      type="number"
                      value={productPrice}
                      onChange={(e) => { setProductPrice(e.target.value); setProductAdded(true); }}
                      placeholder="مثال: 35000"
                      className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-xs text-white font-mono focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1 text-right">
                  <label className="text-xs font-bold text-slate-300 block">قسم المنتج</label>
                  <select
                    value={productCategory}
                    onChange={(e) => setProductCategory(e.target.value)}
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-xs text-white focus:border-teal-500 focus:outline-none"
                  >
                    {categories.map((c, i) => (
                      <option key={i} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Permanent Image Upload */}
                <div className="relative rounded-2xl border-2 border-dashed border-slate-700 bg-slate-950 p-4 text-center hover:border-teal-500/50 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'product')}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div className="flex items-center justify-center gap-3">
                    {productImage ? (
                      <img src={productImage} alt="Product" className="size-16 rounded-xl object-cover border border-teal-500/50 shadow-md" />
                    ) : (
                      <div className="size-16 rounded-xl bg-slate-900 border border-slate-800 grid place-items-center text-slate-500">
                        <Upload className="size-6" />
                      </div>
                    )}
                    <div className="text-right">
                      <p className="text-xs font-bold text-white">
                        {productImage ? 'اضغط لتغيير صورة المنتج' : 'اضغط لرفع صورة المنتج'}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">يتم حفظ الصورة بصيغة دائمة وثابتة في المتجر</p>
                    </div>
                  </div>
                </div>

                {/* Prominent Add/Save Product Button replacing the free gift card */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (!productName.trim()) {
                        alert('يرجى كتابة اسم المنتج أولاً');
                        return;
                      }
                      if (!productPrice) {
                        alert('يرجى تحديد سعر المنتج بالدينار العراقي');
                        return;
                      }
                      setProductAdded(true);
                      alert('✓ تم حفظ المنتج بنجاح وتحديث المعاينة الحية لمتجرك!');
                    }}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-black text-sm shadow-xl shadow-teal-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
                  >
                    <Package className="size-4" />
                    <span>+ إضافة وحفظ المنتج بالمتجر</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Final Review & Live Internet Launch */}
          {currentStep === 5 && (
            <div className="rounded-3xl border border-teal-500/40 bg-gradient-to-br from-[#0f172a] via-[#0d1424] to-slate-950 p-6 md:p-8 space-y-6 shadow-2xl animate-fadeIn text-right">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] font-black text-teal-400 bg-teal-950/60 px-2.5 py-1 rounded-full border border-teal-800/40">
                    الخطوة الأخيرة • الربط والإطلاق الفوري
                  </span>
                  <h2 className="text-xl font-black text-white mt-2">
                    متجرك جاهز للربط بالدومين والإطلاق أونلاين
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    بمجرد النقر سيتم ربط القالب المختار (<span className="text-teal-300 font-bold">{activeTheme.name}</span>) بالدومين والرمز التعريفي وإطلاقه مباشرة.
                  </p>
                </div>
                <div className="size-12 rounded-2xl bg-teal-500/10 text-teal-400 grid place-items-center border border-teal-500/20">
                  <Sparkles className="size-6" />
                </div>
              </div>

              {/* Summary Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold block">اسم المتجر التجاري</span>
                  <span className="font-black text-sm text-white">{storeName}</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold block">الدومين الفرعي المباشر</span>
                  <span className="font-mono font-bold text-sm text-teal-400 truncate block">{subdomain}</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold block">الرمز التعريفي للمتجر (Store Code)</span>
                  <span className="font-mono font-bold text-sm text-emerald-400 block">{storeCode}</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold block">قالب المتجر المختار</span>
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <span className="size-2.5 rounded-full bg-teal-500" />
                    {activeTheme.name}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 sm:col-span-2">
                  <span className="text-[10px] text-slate-400 font-bold block">المنتج المعروض للبيع</span>
                  <span className="font-bold text-white truncate block">
                    {productName ? `${productName} (${formatIQD(Number(productPrice) || 0)})` : 'لم تتم إضافة منتج بعد (يمكن إضافته لاحقاً)'}
                  </span>
                </div>
              </div>

              {/* Logistics & Free Shipments Badge */}
              <div className="p-4 rounded-2xl bg-teal-950/40 border border-teal-800/60 flex items-center justify-between text-xs text-teal-200">
                <div className="flex items-center gap-3">
                  <Truck className="size-5 text-teal-400 shrink-0" />
                  <div>
                    <span className="font-black block text-teal-300">أسطول الزعيم للشحن مفعل تلقائياً</span>
                    <span className="text-[11px] text-teal-300/80">رصيدك: 5 شحنات مجانية + توصيل لجميع المحافظات الـ 18</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-teal-600 text-white text-[10px] font-black shrink-0 shadow-sm">
                  مؤكد
                </span>
              </div>

              {/* Big Launch Button */}
              {subdomainCheck.status === 'unavailable' && (
                <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-800/80 text-rose-200 text-xs font-bold flex items-center gap-2.5 animate-shake">
                  <AlertCircle className="size-4 shrink-0 text-rose-400" />
                  <span>عذراً، النطاق الفرعي ({subdomain}) محجوز مسبقاً أو غير متاح في قاعدة البيانات. يرجى الرجوع للخطوة 1 واختيار اسم متاح.</span>
                </div>
              )}

              <button
                type="button"
                disabled={isLaunching || subdomainCheck.status === 'unavailable' || subdomainCheck.status === 'checking'}
                onClick={handleCompleteAndLaunch}
                className="w-full flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 py-4 text-sm font-black text-white shadow-2xl shadow-teal-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLaunching ? (
                  <>
                    <RefreshCw className="size-4 animate-spin" />
                    <span>جاري ربط القالب بالدومين وإطلاق المتجر على الإنترنت...</span>
                  </>
                ) : subdomainCheck.status === 'unavailable' ? (
                  <span>النطاق محجوز مسبقاً — يرجى الرجوع للخطوة 1 وتغييره</span>
                ) : (
                  <span>ربط القالب وافتتاح المتجر أونلاين فوراً</span>
                )}
              </button>
            </div>
          )}

          {/* Wizard Step Controls */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-xs font-bold text-slate-300 transition-all cursor-pointer"
              >
                <ChevronRight className="size-4" />
                <span>الخطوة السابقة</span>
              </button>
            ) : (
              <div />
            )}

            {currentStep < 5 && (
              <button
                type="button"
                disabled={currentStep === 1 && (subdomainCheck.status === 'unavailable' || subdomainCheck.status === 'checking')}
                onClick={() => {
                  if (currentStep === 1 && subdomainCheck.status !== 'available') return;
                  setCurrentStep(prev => prev + 1);
                }}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black transition-all ${
                  currentStep === 1 && (subdomainCheck.status === 'unavailable' || subdomainCheck.status === 'checking')
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700 opacity-60'
                    : 'bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white shadow-lg shadow-teal-600/20 cursor-pointer hover:scale-[1.02]'
                }`}
              >
                <span>
                  {currentStep === 1 && subdomainCheck.status === 'checking'
                    ? 'جاري فحص الدومين...'
                    : currentStep === 1 && subdomainCheck.status === 'unavailable'
                    ? 'الدومين غير متاح'
                    : 'متابعة للخطوة التالية'}
                </span>
                <ChevronLeft className="size-4" />
              </button>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT: Real Live Website Preview (Authentic Interactive Store Simulator)  */}
        {/* ========================================================================= */}
                {/* ========================================================================= */}
        {/* RIGHT: Real Live Website Preview (Interactive Modular Store Engine)       */}
        {/* ========================================================================= */}
        <div className="lg:col-span-5 order-2">
          <div className="sticky top-20 rounded-3xl border border-slate-800 bg-[#0f172a]/95 backdrop-blur-xl p-4 flex flex-col space-y-3.5 shadow-2xl">
            {/* Top Controls: Live Indicator + Device Mode Switcher + Fullscreen */}
            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Globe className="size-4 text-emerald-400" />
                <span className="font-extrabold text-white">معاينة المتجر الحقيقي المباشر</span>
                <span className="size-2 rounded-full bg-emerald-500 animate-ping" />
              </div>

              {/* Mobile / Tablet / Desktop Toggle & Reload & Maximize Buttons */}
              <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setPreviewDevice('mobile')}
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    previewDevice === 'mobile'
                      ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="عرض هاتف محمول (375px)"
                >
                  <Smartphone className="size-3" />
                  <span className="hidden sm:inline">جوال</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPreviewDevice('tablet')}
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    previewDevice === 'tablet'
                      ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="عرض جهاز لوحي (768px)"
                >
                  <Tablet className="size-3" />
                  <span className="hidden sm:inline">لوحي</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPreviewDevice('desktop')}
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    previewDevice === 'desktop'
                      ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="عرض شاشة كمبيوتر"
                >
                  <Laptop className="size-3" />
                  <span className="hidden sm:inline">شاشة</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPreviewIsReloading(true);
                    setPreviewReloadKey(k => k + 1);
                    setTimeout(() => setPreviewIsReloading(false), 450);
                  }}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  title="إعادة تحميل المعاينة"
                >
                  <RotateCcw className={`size-3 ${previewIsReloading ? 'animate-spin text-teal-400' : ''}`} />
                </button>

                <button
                  type="button"
                  onClick={() => setFullscreenPreview(true)}
                  className="p-1 rounded-lg bg-emerald-950/80 text-emerald-400 hover:text-white hover:bg-emerald-800/80 border border-emerald-700/60 transition-colors cursor-pointer"
                  title="تكبير المعاينة بالكامل (ملء الشاشة)"
                >
                  <Maximize2 className="size-3" />
                </button>
              </div>
            </div>

            {/* Current Active Theme Indicator & Quick Fullscreen Button */}
            <div className="flex items-center justify-between px-1 text-[11px]">
              <span className="text-slate-400 font-bold flex items-center gap-1.5">
                <span>القالب المطبق:</span>
                <span className="text-emerald-400 font-black">{activeTheme.name}</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-300 font-bold">معتمد 100%</span>
              </span>
              <button
                type="button"
                onClick={() => setFullscreenPreview(true)}
                className="text-[10px] text-teal-400 hover:text-teal-300 font-bold flex items-center gap-1 cursor-pointer hover:underline"
              >
                <Maximize2 className="size-2.5" />
                <span>تكبير المعاينة</span>
              </button>
            </div>

            {/* Realistic Browser Window Frame */}
            <div className="transition-all duration-300 mx-auto w-full">
              <div className={`rounded-3xl border-2 border-slate-700/80 bg-slate-900 overflow-hidden shadow-2xl flex flex-col transition-all ${previewIsReloading ? 'opacity-50 scale-[0.99]' : 'opacity-100 scale-100'}`}>

                {/* macOS Chrome Bar */}
                <div className="bg-[#1e293b] border-b border-slate-700/80 px-3 py-2 flex items-center justify-between gap-2 select-none">
                  {/* Traffic Lights - Clicking green opens fullscreen */}
                  <div className="flex items-center gap-1.5 text-[10px] shrink-0">
                    <span className="size-2.5 rounded-full bg-[#ef4444] inline-block" />
                    <span className="size-2.5 rounded-full bg-[#f59e0b] inline-block" />
                    <button
                      type="button"
                      onClick={() => setFullscreenPreview(true)}
                      className="size-2.5 rounded-full bg-[#10b981] inline-block hover:opacity-80 cursor-pointer"
                      title="تكبير المعاينة"
                    />
                  </div>

                  {/* HTTPS Omnibar */}
                  <div className="flex-1 max-w-sm mx-auto bg-[#0f172a] border border-slate-700 rounded-full px-3 py-1 flex items-center justify-between text-[11px] font-mono text-slate-300 shadow-inner">
                    <div className="flex items-center gap-1.5 overflow-hidden">
                      <ShieldCheck className="size-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate text-emerald-400 font-bold">https://</span>
                      <span className="truncate text-slate-200">{subdomain.replace('.za3em.shop', '')}</span>
                      <span className="text-slate-500">.za3em.shop</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(`https://${subdomain.replace('.za3em.shop', '')}.za3em.shop`);
                        setCopiedUrl(true);
                        setTimeout(() => setCopiedUrl(false), 2000);
                      }}
                      title="نسخ الرابط"
                      className="text-slate-500 hover:text-white shrink-0 ml-1 cursor-pointer"
                    >
                      {copiedUrl ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
                    </button>
                  </div>

                  {/* Live Status Pill & Maximize */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-600/60 text-emerald-300 text-[9px] font-black">
                      <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>مباشر</span>
                    </div>
                  </div>
                </div>

                {/* Main Store Viewport (Mobile, Tablet, or Desktop) */}
                {previewDevice === 'mobile' ? (
                  /* Realistic iPhone Frame with Dynamic Island */
                  <div className="bg-slate-950 p-2 sm:p-3 flex justify-center">
                    <div className="w-[365px] max-w-full h-[600px] rounded-[42px] border-[6px] border-slate-800 bg-slate-900 overflow-hidden shadow-2xl relative flex flex-col">
                      {/* Dynamic Island Header */}
                      <div className="bg-slate-950 px-5 pt-2 pb-1 flex items-center justify-between text-[10px] text-slate-400 font-mono select-none shrink-0">
                        <span>09:41</span>
                        <div className="h-4 w-20 bg-black rounded-full flex items-center justify-center gap-1.5 px-2">
                          <span className="size-1.5 rounded-full bg-slate-700" />
                          <span className="size-1 rounded-full bg-emerald-500 animate-pulse" />
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-[9px]">5G</span>
                          <span className="size-2 rounded-full border border-slate-400 inline-block" />
                        </div>
                      </div>

                      {/* True Isolated Mobile Viewport via Iframe */}
                      <div className="flex-1 w-full overflow-hidden relative bg-white">
                        <StoreIframePreview
                          width="100%"
                          height="100%"
                          reloadKey={`${selectedTheme}-${previewReloadKey}-${storeName}`}
                        >
                          <StoreTemplates
                            key={`${selectedTheme}-${previewReloadKey}-${storeName}`}
                            storeName={storeName || 'متجري'}
                            subdomain={subdomain.replace('.za3em.shop', '')}
                            activeTemplateId={selectedTheme as any}
                            standalone={true}
                            logoUrl={logoUrl}
                            storeCode={storeCode}
                            customProduct={
                              productAdded && productName
                                ? {
                                    id: 1,
                                    name: productName,
                                    price: Number(productPrice) || 35000,
                                    imageUrl: productImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700&auto=format&fit=crop&q=80',
                                    category: productCategory || 'عام',
                                    description: slogan || 'منتج أصلي معتمد'
                                  }
                                : undefined
                            }
                          />
                        </StoreIframePreview>
                      </div>

                      {/* Home Indicator Bar */}
                      <div className="bg-slate-950 py-1.5 flex justify-center shrink-0">
                        <div className="w-28 h-1 bg-slate-500 rounded-full" />
                      </div>
                    </div>
                  </div>
                ) : previewDevice === 'tablet' ? (
                  /* Realistic Tablet Frame */
                  <div className="bg-slate-950 p-2 sm:p-3 flex justify-center">
                    <div className="w-full max-w-[460px] h-[600px] rounded-[28px] border-[6px] border-slate-800 bg-slate-900 overflow-hidden shadow-2xl relative flex flex-col">
                      <div className="bg-slate-950 h-3 flex items-center justify-center shrink-0">
                        <span className="size-1 rounded-full bg-slate-700" />
                      </div>
                      <div className="flex-1 w-full overflow-hidden relative bg-white">
                        <StoreIframePreview
                          width="100%"
                          height="100%"
                          reloadKey={`${selectedTheme}-${previewReloadKey}-${storeName}`}
                        >
                          <StoreTemplates
                            key={`${selectedTheme}-${previewReloadKey}-${storeName}`}
                            storeName={storeName || 'متجري'}
                            subdomain={subdomain.replace('.za3em.shop', '')}
                            activeTemplateId={selectedTheme as any}
                            standalone={true}
                            logoUrl={logoUrl}
                            storeCode={storeCode}
                            customProduct={
                              productAdded && productName
                                ? {
                                    id: 1,
                                    name: productName,
                                    price: Number(productPrice) || 35000,
                                    imageUrl: productImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700&auto=format&fit=crop&q=80',
                                    category: productCategory || 'عام',
                                    description: slogan || 'منتج أصلي معتمد'
                                  }
                                : undefined
                            }
                          />
                        </StoreIframePreview>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Scaled Desktop Viewport in Sidebar */
                  <div className="bg-slate-950 p-2 sm:p-3 flex flex-col items-center">
                    <div className="w-full mb-1.5 flex items-center justify-between text-[10px] text-slate-400 px-1">
                      <span>محاكاة شاشة سطح المكتب</span>
                      <button
                        type="button"
                        onClick={() => setFullscreenPreview(true)}
                        className="text-teal-400 hover:text-teal-300 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Maximize2 className="size-3" />
                        <span>فتح بالحجم الكامل (100%)</span>
                      </button>
                    </div>
                    <div className="w-full h-[580px] overflow-hidden rounded-2xl border-2 border-slate-800 bg-white relative">
                      <div
                        className="origin-top-right overflow-y-auto rf-scrollbar"
                        style={{
                          width: '1000px',
                          height: '1260px',
                          transform: 'scale(0.46)',
                          transformOrigin: 'top right'
                        }}
                      >
                        <StoreIframePreview
                          width="1000px"
                          height="1260px"
                          reloadKey={`${selectedTheme}-${previewReloadKey}-${storeName}`}
                        >
                          <StoreTemplates
                            key={`${selectedTheme}-${previewReloadKey}-${storeName}`}
                            storeName={storeName || 'متجري'}
                            subdomain={subdomain.replace('.za3em.shop', '')}
                            activeTemplateId={selectedTheme as any}
                            standalone={true}
                            logoUrl={logoUrl}
                            storeCode={storeCode}
                            customProduct={
                              productAdded && productName
                                ? {
                                    id: 1,
                                    name: productName,
                                    price: Number(productPrice) || 35000,
                                    imageUrl: productImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700&auto=format&fit=crop&q=80',
                                    category: productCategory || 'عام',
                                    description: slogan || 'منتج أصلي معتمد'
                                  }
                                : undefined
                            }
                          />
                        </StoreIframePreview>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Mobile Live Preview Trigger Button (Visible only on mobile/tablets) */}
      <div className="lg:hidden fixed bottom-5 left-4 right-4 z-40">
        <button
          type="button"
          onClick={() => setFullscreenPreview(true)}
          className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-600 hover:from-teal-500 hover:to-emerald-500 text-white font-black text-xs shadow-2xl shadow-teal-950/80 flex items-center justify-between border border-teal-400/40 cursor-pointer animate-pulse hover:animate-none"
        >
          <div className="flex items-center gap-2">
            <Eye className="size-4 text-teal-200" />
            <span>معاينة المتجر المباشر الآن</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] bg-slate-950/60 px-2.5 py-1 rounded-full border border-teal-500/30">
            <span className="text-emerald-300 font-bold">{activeTheme.name}</span>
            <Maximize2 className="size-3 text-teal-300" />
          </div>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 3.5 FULLSCREEN INTERACTIVE STORE PREVIEW MODAL */}
      {/* ========================================================================= */}
      {fullscreenPreview && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex flex-col p-2 sm:p-4 animate-fadeIn">
          {/* Modal Header Controls */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 mb-2 flex items-center justify-between gap-3 shadow-xl select-none">
            {/* Left: Window Controls + Title */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setFullscreenPreview(false)}
                  className="size-3 rounded-full bg-[#ef4444] hover:opacity-80 cursor-pointer"
                  title="إغلاق المعاينة"
                />
                <span className="size-3 rounded-full bg-[#f59e0b]" />
                <span className="size-3 rounded-full bg-[#10b981]" />
              </div>
              <div className="h-5 w-px bg-slate-800 hidden sm:block" />
              <div className="hidden sm:flex items-center gap-2">
                <span className="font-black text-white text-xs">{storeName || 'متجري'}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                  {activeTheme.name}
                </span>
              </div>
            </div>

            {/* Center: Device Viewport Switcher */}
            <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setPreviewDevice('mobile')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  previewDevice === 'mobile'
                    ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="size-3.5" />
                <span className="hidden sm:inline">هاتف (375px)</span>
              </button>

              <button
                type="button"
                onClick={() => setPreviewDevice('tablet')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  previewDevice === 'tablet'
                    ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Tablet className="size-3.5" />
                <span className="hidden sm:inline">لوحي (768px)</span>
              </button>

              <button
                type="button"
                onClick={() => setPreviewDevice('desktop')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  previewDevice === 'desktop'
                    ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Monitor className="size-3.5" />
                <span className="hidden sm:inline">شاشة كمبيوتر (كامل)</span>
              </button>
            </div>

            {/* Right: Omnibar, Reload & Close */}
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-full px-3 py-1 text-xs font-mono text-slate-300">
                <ShieldCheck className="size-3.5 text-emerald-400" />
                <span className="text-emerald-400">https://</span>
                <span>{subdomain.replace('.za3em.shop', '')}</span>
                <span className="text-slate-500">.za3em.shop</span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(`https://${subdomain.replace('.za3em.shop', '')}.za3em.shop`);
                    setCopiedUrl(true);
                    setTimeout(() => setCopiedUrl(false), 2000);
                  }}
                  className="mr-1 text-slate-400 hover:text-white cursor-pointer"
                  title="نسخ الرابط"
                >
                  {copiedUrl ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  setPreviewIsReloading(true);
                  setPreviewReloadKey(k => k + 1);
                  setTimeout(() => setPreviewIsReloading(false), 450);
                }}
                className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors cursor-pointer"
                title="إعادة تحميل المعاينة"
              >
                <RotateCcw className={`size-3.5 ${previewIsReloading ? 'animate-spin text-teal-400' : ''}`} />
              </button>

              <button
                type="button"
                onClick={() => setFullscreenPreview(false)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-xs font-bold transition-colors cursor-pointer"
              >
                <X className="size-3.5" />
                <span>العودة للإعداد</span>
              </button>
            </div>
          </div>

          {/* Modal Main Interactive Preview Canvas */}
          <div className="flex-1 w-full overflow-hidden flex items-center justify-center p-2 rounded-2xl bg-slate-950/60 border border-slate-800 relative">
            {previewDevice === 'mobile' ? (
              /* Fullscreen Mobile Bezel */
              <div className="w-[375px] max-w-full h-full max-h-[82vh] rounded-[48px] border-[8px] border-slate-800 bg-slate-900 shadow-2xl flex flex-col relative overflow-hidden">
                <div className="bg-slate-950 px-6 pt-2.5 pb-1 flex items-center justify-between text-[10px] text-slate-400 font-mono select-none shrink-0">
                  <span>09:41</span>
                  <div className="h-4 w-24 bg-black rounded-full flex items-center justify-center gap-1.5 px-2">
                    <span className="size-1.5 rounded-full bg-slate-700" />
                    <span className="size-1 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[9px]">5G</span>
                    <span className="size-2 rounded-full border border-slate-400 inline-block" />
                  </div>
                </div>

                <div className="flex-1 w-full overflow-hidden relative bg-white">
                  <StoreIframePreview
                    width="100%"
                    height="100%"
                    reloadKey={`${selectedTheme}-${previewReloadKey}-${storeName}`}
                  >
                    <StoreTemplates
                      key={`${selectedTheme}-${previewReloadKey}-${storeName}`}
                      storeName={storeName || 'متجري'}
                      subdomain={subdomain.replace('.za3em.shop', '')}
                      activeTemplateId={selectedTheme as any}
                      standalone={true}
                      logoUrl={logoUrl}
                      storeCode={storeCode}
                      customProduct={
                        productAdded && productName
                          ? {
                              id: 1,
                              name: productName,
                              price: Number(productPrice) || 35000,
                              imageUrl: productImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700&auto=format&fit=crop&q=80',
                              category: productCategory || 'عام',
                              description: slogan || 'منتج أصلي معتمد'
                            }
                          : undefined
                      }
                    />
                  </StoreIframePreview>
                </div>

                <div className="bg-slate-950 py-2 flex justify-center shrink-0">
                  <div className="w-32 h-1 bg-slate-500 rounded-full" />
                </div>
              </div>
            ) : previewDevice === 'tablet' ? (
              /* Fullscreen Tablet Bezel */
              <div className="w-[768px] max-w-full h-full max-h-[82vh] rounded-[36px] border-[8px] border-slate-800 bg-slate-900 shadow-2xl flex flex-col relative overflow-hidden">
                <div className="bg-slate-950 h-3 flex items-center justify-center shrink-0">
                  <span className="size-1.5 rounded-full bg-slate-700" />
                </div>
                <div className="flex-1 w-full overflow-hidden relative bg-white">
                  <StoreIframePreview
                    width="100%"
                    height="100%"
                    reloadKey={`${selectedTheme}-${previewReloadKey}-${storeName}`}
                  >
                    <StoreTemplates
                      key={`${selectedTheme}-${previewReloadKey}-${storeName}`}
                      storeName={storeName || 'متجري'}
                      subdomain={subdomain.replace('.za3em.shop', '')}
                      activeTemplateId={selectedTheme as any}
                      standalone={true}
                      logoUrl={logoUrl}
                      storeCode={storeCode}
                      customProduct={
                        productAdded && productName
                          ? {
                              id: 1,
                              name: productName,
                              price: Number(productPrice) || 35000,
                              imageUrl: productImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700&auto=format&fit=crop&q=80',
                              category: productCategory || 'عام',
                              description: slogan || 'منتج أصلي معتمد'
                            }
                          : undefined
                      }
                    />
                  </StoreIframePreview>
                </div>
              </div>
            ) : (
              /* Fullscreen Desktop Viewport */
              <div className="w-full max-w-[1360px] h-full max-h-[84vh] rounded-2xl border-2 border-slate-800 bg-slate-900 shadow-2xl overflow-hidden flex flex-col">
                <div className="flex-1 w-full overflow-hidden relative bg-white">
                  <StoreIframePreview
                    width="100%"
                    height="100%"
                    reloadKey={`${selectedTheme}-${previewReloadKey}-${storeName}`}
                  >
                    <StoreTemplates
                      key={`${selectedTheme}-${previewReloadKey}-${storeName}`}
                      storeName={storeName || 'متجري'}
                      subdomain={subdomain.replace('.za3em.shop', '')}
                      activeTemplateId={selectedTheme as any}
                      standalone={true}
                      logoUrl={logoUrl}
                      storeCode={storeCode}
                      customProduct={
                        productAdded && productName
                          ? {
                              id: 1,
                              name: productName,
                              price: Number(productPrice) || 35000,
                              imageUrl: productImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700&auto=format&fit=crop&q=80',
                              category: productCategory || 'عام',
                              description: slogan || 'منتج أصلي معتمد'
                            }
                          : undefined
                      }
                    />
                  </StoreIframePreview>
                </div>
              </div>
            )}
          </div>

          {/* Modal Bottom Template Switcher Quick Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2.5 mt-2 flex items-center justify-between gap-2 overflow-x-auto rf-scrollbar select-none shrink-0">
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-bold text-slate-400">تبديل القالب المباشر:</span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto rf-scrollbar">
              {REAL_STORE_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => {
                    setSelectedTheme(tmpl.id);
                    setPreviewReloadKey(k => k + 1);
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                    selectedTheme === tmpl.id
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-1 ring-emerald-400'
                      : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800'
                  }`}
                >
                  <span className={`size-2 rounded-full ${tmpl.colorDot}`} />
                  <span>{tmpl.name}</span>
                  {selectedTheme === tmpl.id && <Check className="size-3" />}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setFullscreenPreview(false)}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-xs font-black shadow-md cursor-pointer shrink-0"
            >
              اعتماد ومتابعة الإعداد
            </button>
          </div>
        </div>
      )}

{/* 4️⃣ FULL-SCREEN TEMPLATE LIVE PREVIEW MODAL */}
      {/* ========================================================================= */}
      {previewModalTemplate && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 md:p-6 animate-fadeIn">
          <div className="max-w-4xl w-full rounded-3xl border border-slate-800 bg-[#0f172a] shadow-2xl flex flex-col overflow-hidden max-h-[92vh]">
            <div className="p-4 md:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
              <div className="flex items-center gap-3 text-right">
                <span className="size-9 rounded-xl bg-emerald-500/20 text-emerald-400 grid place-items-center font-bold">
                  <Eye className="size-5" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-white">{previewModalTemplate.name}</h3>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                      ثيم مجاني معتمد
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{previewModalTemplate.tagline}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setPreviewModalTemplate(null)}
                className="size-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white grid place-items-center text-sm font-bold transition-colors cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="p-4 md:p-6 overflow-y-auto space-y-6 text-right rf-scrollbar">
              {/* Large Theme Showcase Visual */}
              <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
                <img
                  src={previewModalTemplate.heroImage}
                  alt={previewModalTemplate.name}
                  className="size-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <div className="absolute bottom-6 right-6 left-6 space-y-2">
                  <span className="text-xs font-black px-3 py-1 rounded-full bg-emerald-600 text-white shadow-md">
                    {previewModalTemplate.badge}
                  </span>
                  <h2 className="text-2xl font-black text-white">{previewModalTemplate.name}</h2>
                  <p className="text-sm text-slate-300 max-w-xl leading-relaxed">{previewModalTemplate.tagline}</p>
                </div>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {previewModalTemplate.features.map((feat, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              {/* Real Connection Info Box */}
              <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 text-xs text-slate-300 space-y-2 leading-relaxed">
                <p className="font-black text-white flex items-center gap-1.5">
                  <ShieldCheck className="size-4 text-emerald-400" />
                  <span>مميزات هذا القالب المجاني مع متجرك:</span>
                </p>
                <p>
                  عند اعتماد هذا القالب، سيتم ربطه تلقائياً بالدومين الفرعي (<span className="text-emerald-400 font-mono font-bold">{subdomain}</span>). سيحصل زبائنك على تجربة تسوق كاملة تدعم اللغة العربية، سلة المشتريات، وحجز الشحنة فوراً برقم بوليصة تتبع من أسطول الزعيم للشحن لكافة المحافظات بدون أي رسوم إضافية.
                </p>
              </div>
            </div>

            <div className="p-4 md:p-5 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setPreviewModalTemplate(null)}
                className="px-5 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-xs font-bold text-slate-300 transition-colors cursor-pointer"
              >
                إغلاق المعاينة
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedTheme(previewModalTemplate.id);
                  setPreviewModalTemplate(null);
                }}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-black text-white shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
              >
                <Check className="size-4 stroke-[3]" />
                <span>اعتماد وربط هذا القالب بمتجري (مجاناً)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5️⃣ INSTANT ONLINE LAUNCH CELEBRATION MODAL */}
      {/* ========================================================================= */}
      {launchSuccessData && launchSuccessData.open && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
          <div className="max-w-md w-full rounded-2xl sm:rounded-3xl border border-teal-500/40 bg-[#0f172a] p-4 sm:p-6 text-right space-y-3 sm:space-y-4 shadow-2xl relative my-auto max-h-[94vh] flex flex-col justify-between overflow-y-auto rf-scrollbar">
            <div className="absolute top-0 right-0 size-36 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="text-center space-y-1.5">
              <div className="size-11 sm:size-12 rounded-2xl bg-teal-500/20 border border-teal-500/40 text-teal-400 mx-auto grid place-items-center shadow-lg shadow-teal-500/20">
                <Sparkles className="size-6 text-teal-400 animate-pulse" />
              </div>
              <span className="inline-block text-[10px] font-black text-teal-400 bg-teal-950/80 px-2.5 py-0.5 rounded-full border border-teal-800/80">
                تم الربط والإطلاق أونلاين بنجاح
              </span>
              <h2 className="text-lg sm:text-xl font-black text-white">
                متجرك انطلق الآن على الإنترنت
              </h2>
              <p className="text-[11px] text-slate-300 max-w-sm mx-auto leading-relaxed">
                تم حجز دومينك وربطه بقالب (<span className="text-teal-300 font-bold">{launchSuccessData.templateName}</span>) وأصبح متاحاً للزبائن فوراً.
              </p>
            </div>

            {/* Store Code & Live Link Compact Cards */}
            <div className="space-y-2">
              {/* Store Code Box */}
              <div className="p-2.5 sm:p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[9px] text-slate-400 font-bold block">الرمز التعريفي الفريد لمتجرك:</span>
                  <span className="font-mono text-xs sm:text-sm font-black text-emerald-400">{launchSuccessData.storeCode}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyStoreCode(launchSuccessData.storeCode)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[10px] font-black transition-colors cursor-pointer"
                >
                  <Copy className="size-3" />
                  <span>{codeCopied ? 'تم النسخ' : 'نسخ الرمز'}</span>
                </button>
              </div>

              {/* Live Store URL Box */}
              <div className="p-2.5 sm:p-3 rounded-xl bg-slate-900/90 border border-teal-900/50 space-y-1.5">
                <span className="text-[9px] text-slate-400 font-bold block">رابط متجرك الحقيقي المباشر:</span>
                <div className="flex items-center justify-between gap-2 bg-slate-950 p-2 rounded-lg border border-slate-800">
                  <span className="font-mono text-[11px] sm:text-xs text-teal-400 font-bold truncate dir-ltr">
                    https://{launchSuccessData.subdomain}.za3em.shop
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyStoreLink(`https://${launchSuccessData.subdomain}.za3em.shop`)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-[10px] font-black transition-colors shrink-0 cursor-pointer"
                  >
                    <Copy className="size-3" />
                    <span>{linkCopied ? 'تم النسخ' : 'نسخ الرابط'}</span>
                  </button>
                </div>
              </div>

              {/* Quick Preview & Free Shipments Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px]">
                <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-slate-300">
                  <span>معاينة الرابط الفرعي:</span>
                  <a
                    href={window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? `/#/store/${launchSuccessData.subdomain}` : `https://${launchSuccessData.subdomain}.za3em.shop`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-teal-400 hover:text-teal-300 font-bold underline flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>زيارة الآن</span>
                    <ExternalLink className="size-2.5" />
                  </a>
                </div>

                <div className="p-2 rounded-xl bg-teal-950/40 border border-teal-800/60 text-teal-300 flex items-center gap-1.5 font-bold">
                  <Truck className="size-3 text-teal-400 shrink-0" />
                  <span className="truncate">5 شحنات مجانية مفعلة!</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2.5 pt-2">
              <a
                href={launchSuccessData.seedUrl || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? `/#/store/${launchSuccessData.subdomain}` : `https://${launchSuccessData.subdomain}.za3em.shop`)}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-black text-xs sm:text-sm text-center flex items-center justify-center gap-2 shadow-lg shadow-teal-600/25 transition-all cursor-pointer active:scale-[0.98]"
              >
                <span>فتح وتجربة المتجر المباشر</span>
                <ExternalLink className="size-3.5" />
              </a>

              {/* Ultra-clear, Prominent Dashboard Button */}
              <button
                type="button"
                onClick={() => {
                  window.location.hash = '#/dashboard';
                  setLocation('/dashboard');
                }}
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/25 border-2 border-emerald-300 transition-all cursor-pointer active:scale-[0.98]"
              >
                <Store className="size-4 stroke-[2.5]" />
                <span>الانتقال إلى لوحة التحكم ومتابعة الشحنات ←</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
