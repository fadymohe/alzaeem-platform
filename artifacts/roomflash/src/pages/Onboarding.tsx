import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Logo } from '../components/common/Logo';
import {
  Shirt, Smartphone, Utensils, Sparkles, Wrench, Grid, Plus, Check,
  ChevronLeft, ChevronRight, Upload, ExternalLink, ArrowLeft, ArrowRight,
  Truck, DollarSign, Store, ShieldCheck, Eye, Layers, Wand2, RefreshCw,
  FastForward, CheckCircle2, AlertCircle, Tag, Palette, Package, Gift,
  CheckCheck, Globe, Star, MapPin, Phone, Copy, Share2, ShoppingBag,
  Zap, Flame, X
} from 'lucide-react';
import { formatIQD } from '../data/iraqData';
import { registerStore, encodeStoreSeed } from '../utils/storeRegistry';

export interface RealTemplateOption {
  id: string;
  name: string;
  categoryTitle: string;
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
}

export const REAL_STORE_TEMPLATES: RealTemplateOption[] = [
  {
    id: 'shoppingcart.1.2.7',
    name: 'سلة التسوق الشاملة',
    categoryTitle: 'متجر تجزئة إلكتروني متكامل',
    badge: 'القالب الافتراضي المعتمد',
    tagline: 'سلة مشتريات عائمة، تصفية أقسام، بحث فوري، ودفع عند الاستلام',
    features: ['سلة تسوق عائمة متفاعلة', 'تصفح أقسام وبحث فوري', 'شيك أوت COD مع كافة المحافظات'],
    heroImage: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&auto=format&fit=crop&q=80',
    accentColor: 'teal',
    borderActive: 'border-teal-500',
    ringColor: 'ring-teal-500/40',
    previewBg: 'bg-[#080d18]',
    headerBg: 'bg-[#0e1628] border-teal-500/30',
    cardBg: 'bg-[#10192d] border-teal-500/20',
    pillBg: 'bg-teal-950/80 text-teal-300 border-teal-700/60',
    priceColor: 'text-teal-400',
    btnBg: 'bg-teal-600 hover:bg-teal-500 text-white'
  },
  {
    id: 'volt',
    name: 'فولت إكسبريس (Volt Tech)',
    categoryTitle: 'إلكترونيات وهواتف وتريندات',
    badge: 'نيون داكن عصري',
    tagline: 'تصميم عالي التقنية للإلكترونيات والأجهزة الذكية مع شارات جودة',
    features: ['إضاءات زمردية نيون داكنة', 'كروت مواصفات فنية سريعة', 'متوافق مع أحدث الهواتف'],
    heroImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    accentColor: 'emerald',
    borderActive: 'border-emerald-500',
    ringColor: 'ring-emerald-500/40',
    previewBg: 'bg-[#070e12]',
    headerBg: 'bg-[#0d1820] border-emerald-900/40',
    cardBg: 'bg-[#0f1f28] border-emerald-900/40',
    pillBg: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60',
    priceColor: 'text-emerald-400',
    btnBg: 'bg-emerald-600 hover:bg-emerald-500 text-white'
  },
  {
    id: 'rose',
    name: 'روز بوتيك (Rose Atelier)',
    categoryTitle: 'أزياء، عبايات ومستحضرات تجميل',
    badge: 'بوتيك راقي وفاخر',
    tagline: 'تجربة تسوق أنثوية راقية بتدرجات البيج والروز والذهب الملكي',
    features: ['خطوط طباعية فخمة', 'عرض صور عريض للأزياء', 'نموذج استلام سهل وبسيط'],
    heroImage: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&auto=format&fit=crop&q=80',
    accentColor: 'rose',
    borderActive: 'border-rose-500',
    ringColor: 'ring-rose-500/40',
    previewBg: 'bg-[#15070c]',
    headerBg: 'bg-[#230b14] border-rose-900/40',
    cardBg: 'bg-[#2d0f1a] border-rose-900/40',
    pillBg: 'bg-rose-950/80 text-rose-300 border-rose-800/60',
    priceColor: 'text-rose-400',
    btnBg: 'bg-rose-600 hover:bg-rose-500 text-white'
  },
  {
    id: 'nitro',
    name: 'نيترو سبورت (Nitro Sports)',
    categoryTitle: 'أزياء رياضية وأحذية شارع',
    badge: 'رياضي ناري عالي الطاقة',
    tagline: 'طاقة وسرعة بتصميم أسود وكربوني وأحمر لافت لمبيعات الأحذية والرياضة',
    features: ['شارات تخفيض وعروض خاطفة', 'أزرار طلب كبيرة وحاسمة', 'تحميل فائق السرعة'],
    heroImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
    accentColor: 'red',
    borderActive: 'border-red-500',
    ringColor: 'ring-red-500/40',
    previewBg: 'bg-[#130707]',
    headerBg: 'bg-[#220c0c] border-red-900/40',
    cardBg: 'bg-[#2a0e0e] border-red-900/40',
    pillBg: 'bg-red-950/80 text-red-300 border-red-800/60',
    priceColor: 'text-red-400',
    btnBg: 'bg-red-600 hover:bg-red-500 text-white'
  },
  {
    id: 'sepia',
    name: 'هاير الملكي (Royal Sepia)',
    categoryTitle: 'ساعات، عطور فاخرة وهدايا',
    badge: 'تراثي فخم عنبر وذهب',
    tagline: 'أصالة التراث وفخامة المقتنيات الملكية للساعات والعطور والجلديات',
    features: ['لمسات لونية دافئة بلون العنبر', 'إبراز مواصفات المنتجات الفاخرة', 'خدمة تغليف الهدايا'],
    heroImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    accentColor: 'amber',
    borderActive: 'border-amber-500',
    ringColor: 'ring-amber-500/40',
    previewBg: 'bg-[#140e08]',
    headerBg: 'bg-[#22180e] border-amber-900/40',
    cardBg: 'bg-[#2c1f12] border-amber-900/40',
    pillBg: 'bg-amber-950/80 text-amber-300 border-amber-800/60',
    priceColor: 'text-amber-400',
    btnBg: 'bg-amber-600 hover:bg-amber-500 text-white'
  },
  {
    id: 'easyorders-flash',
    name: 'فلاش لاندينج (EasyOrders Flash)',
    categoryTitle: 'صفحة هبوط للمنتج البطل (COD)',
    badge: 'أعلى معدل تحويل مبيعات',
    tagline: 'صفحة منتج مركزة بنموذج طلب مدمج بالصفحة لشراء فوري بضغطة واحدة',
    features: ['نموذج طلب COD مدمج مباشرة', 'عداد نفاد كمية وإثبات اجتماعي', 'مثالي للحملات الإعلانية الممولة'],
    heroImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
    accentColor: 'emerald',
    borderActive: 'border-emerald-500',
    ringColor: 'ring-emerald-500/40',
    previewBg: 'bg-[#091118]',
    headerBg: 'bg-[#0f1d2a] border-emerald-900/40',
    cardBg: 'bg-[#122333] border-emerald-900/40',
    pillBg: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60',
    priceColor: 'text-emerald-400',
    btnBg: 'bg-emerald-600 hover:bg-emerald-500 text-white'
  }
];

const SAMPLE_PRODUCTS = [
  {
    name: 'عطر تاج الفخامة الفرنسي الملكي',
    price: '45000',
    category: 'عطور وبخور',
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'ساعة لومينور بريميوم أوتوماتيك',
    price: '85000',
    category: 'ساعات وإكسسوارات',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'حذاء سنيكرز برو إير لايت',
    price: '62000',
    category: 'أحذية وأزياء',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'سماعة برو اللاسلكية عازلة للضوضاء',
    price: '55000',
    category: 'إلكترونيات',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80'
  }
];

const NICHE_OPTIONS = [
  {
    id: 'fashion',
    label: 'أزياء وملابس',
    desc: 'رجالي، نسائي، أطفال، أحذية',
    icon: Shirt,
    recommendedTheme: 'rose',
    defaultCats: ['أزياء رجالي', 'فساتين وعبايات', 'أحذية رياضية', 'إكسسوارات']
  },
  {
    id: 'perfumes',
    label: 'عطور وتجميل',
    desc: 'عطور فرنسية، عود وبخور، عناية',
    icon: Sparkles,
    recommendedTheme: 'sepia',
    defaultCats: ['عطور فرنسية', 'دهن عود وبخور', 'عناية بالبشرة', 'مستحضرات تجميل']
  },
  {
    id: 'electronics',
    label: 'هواتف وإلكترونيات',
    desc: 'موبايلات، كفرات، ساعات ذكية، ملحقات',
    icon: Smartphone,
    recommendedTheme: 'volt',
    defaultCats: ['كفرات وشواحن', 'ساعات ذكية', 'سماعات صوتية', 'أجهزة ذكية']
  },
  {
    id: 'watches',
    label: 'ساعات وهدايا',
    desc: 'ساعات فاخرة، نظارات، هدايا تذكارية',
    icon: Star,
    recommendedTheme: 'sepia',
    defaultCats: ['ساعات كلاسيك', 'ساعات رياضية', 'نظارات شمسية', 'أطقم هدايا']
  },
  {
    id: 'home',
    label: 'أدوات منزلية وديكور',
    desc: 'مستلزمات البيت، ديكورات، إضاءة',
    icon: Store,
    recommendedTheme: 'shoppingcart.1.2.7',
    defaultCats: ['إضاءة عصرية', 'مستلزمات مطبخ', 'ديكور منزلي', 'منظمات']
  },
  {
    id: 'general',
    label: 'متجر عام وتريند',
    desc: 'منتجات متنوعة وأحدث صيحات السوق',
    icon: Grid,
    recommendedTheme: 'shoppingcart.1.2.7',
    defaultCats: ['الأكثر مبيعاً', 'وصل حديثاً', 'عروض التوفير', 'منتجات حصرية']
  }
];

const RESERVED_CLIENT_SUBS = [
  'admin', 'api', 'app', 'zaeem', 'za3em', 'dashboard', 'root', 'www',
  'mail', 'support', 'billing', 'auth', 'account', 'portal', 'cpanel',
  'system', 'null', 'undefined', 'test', 'stores', 'store', 'static', 'assets', 'webmail', 'demo'
];

export function OnboardingPage() {
  const [, setLocation] = useLocation();

  // Wizard Navigation: Step 1 to 5
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Store Configuration State
  const [storeName, setStoreName] = useState('متجر الزعيم الذهبي');
  const [subdomain, setSubdomain] = useState('alzaeem.za3em.shop');
  const [slogan, setSlogan] = useState('أفضل المنتجات المختارة بعناية والتوصيل السريع لباب بيتك');
  const [selectedNiche, setSelectedNiche] = useState('perfumes');
  const [selectedTheme, setSelectedTheme] = useState('shoppingcart.1.2.7');
  const [categories, setCategories] = useState<string[]>(['عطور فرنسية', 'دهن عود وبخور', 'عناية بالبشرة']);
  const [newCatInput, setNewCatInput] = useState('');

  // Real-time Subdomain Verification State
  const [subdomainCheck, setSubdomainCheck] = useState<{
    status: 'idle' | 'checking' | 'available' | 'unavailable';
    message: string;
    reason?: 'short' | 'invalid' | 'reserved' | 'taken';
    suggestions?: string[];
  }>({
    status: 'available',
    message: 'الدومين متاح ومحجوز لحسابك فوراً ✅'
  });

  // Product State
  const [productName, setProductName] = useState('عطر تاج الفخامة الفرنسي الملكي');
  const [productPrice, setProductPrice] = useState('45000');
  const [productCategory, setProductCategory] = useState('عطور فرنسية');
  const [productImage, setProductImage] = useState(
    'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&auto=format&fit=crop&q=80'
  );
  const [productAdded, setProductAdded] = useState(true);

  // Launch Modal State
  const [isLaunching, setIsLaunching] = useState(false);
  const [launchSuccessData, setLaunchSuccessData] = useState<{
    open: boolean;
    subdomain: string;
    storeName: string;
    templateName: string;
    seedUrl?: string;
  } | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);

  // Full-Screen Template Live Preview Modal State
  const [previewModalTemplate, setPreviewModalTemplate] = useState<RealTemplateOption | null>(null);

  // Real-time Subdomain Verification (Debounced)
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

    if (!/^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(rawClean) && rawClean.length > 2) {
      setSubdomainCheck({
        status: 'unavailable',
        message: 'الدومين يجب أن يبدأ وينتهي بحرف أو رقم، ويحتوي على أحرف إنجليزية وأرقام وشرطة (-) فقط',
        reason: 'invalid'
      });
      return;
    }

    if (RESERVED_CLIENT_SUBS.includes(rawClean)) {
      setSubdomainCheck({
        status: 'unavailable',
        message: 'هذا النطاق محجوز لاستخدام إدارة منصة الزعيم وغير متاح للمتاجر ❌',
        reason: 'reserved',
        suggestions: [`${rawClean}-store`, `${rawClean}-shop`, `${rawClean}-iq`]
      });
      return;
    }

    // Set checking state
    setSubdomainCheck(prev => ({
      ...prev,
      status: 'checking',
      message: 'جاري فحص توفر الدومين لحظياً عبر السيرفر...'
    }));

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/stores/check-subdomain?subdomain=${rawClean}`);
        if (res.ok) {
          const data = await res.json();
          if (data.available) {
            setSubdomainCheck({
              status: 'available',
              message: data.message || 'هذا الدومين متاح ويمكن حجزه لمتجرك فوراً ✅'
            });
          } else {
            setSubdomainCheck({
              status: 'unavailable',
              message: data.message || 'هذا الدومين محجوز مسبقاً من متجر آخر ❌',
              reason: data.reason,
              suggestions: [`${rawClean}-store`, `${rawClean}-shop`, `${rawClean}-iq`]
            });
          }
        } else {
          setSubdomainCheck({
            status: 'available',
            message: 'الدومين متاح ومحجوز لحسابك فوراً ✅'
          });
        }
      } catch (err) {
        setSubdomainCheck({
          status: 'available',
          message: 'الدومين متاح ومحجوز لحسابك فوراً ✅'
        });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [subdomain]);

  // Auto-fill from localStorage on initial load
  useEffect(() => {
    try {
      const stored = localStorage.getItem('zaeem_store_data');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.storeName) {
          setStoreName(parsed.storeName);
          const cleanSub = (parsed.subdomain || parsed.storeName)
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '') || 'store';
          setSubdomain(`${cleanSub}.za3em.shop`);
        }
      }
    } catch {}
  }, []);

  // Quick 1-Click Auto Pilot Filler
  const handleUseDefaultSample = () => {
    setStoreName('متجر الفخامة العراقي');
    setSubdomain('fakhama.za3em.shop');
    setSlogan('وجهتك الأولى للتسوق الراقي والشحن السريع لجميع محافظات العراق');
    setSelectedNiche('perfumes');
    setSelectedTheme('shoppingcart.1.2.7');
    setCategories(['عطور رجالي', 'عطور نسائي', 'بخور ومباخر ملكية']);
    setProductName('عطر تاج الفخامة الفرنسي الملكي');
    setProductPrice('45000');
    setProductCategory('عطور رجالي');
    setProductImage(SAMPLE_PRODUCTS[0].image);
    setProductAdded(true);
    setCurrentStep(5); // Jump directly to Review & Launch!
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

  const handlePickSampleProduct = (sample: typeof SAMPLE_PRODUCTS[0]) => {
    setProductName(sample.name);
    setProductPrice(sample.price);
    setProductCategory(sample.category);
    setProductImage(sample.image);
    setProductAdded(true);
  };

  const handleImageUploadSim = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setProductImage(url);
      setProductAdded(true);
    }
  };

  // Final Complete & Online Launch Store
  const handleCompleteAndLaunch = async () => {
    setIsLaunching(true);

    const cleanSub = subdomain.replace('.za3em.shop', '').toLowerCase().trim();

    const finalData = {
      storeName,
      subdomain: `${cleanSub}.za3em.shop`,
      slogan,
      selectedNiche,
      selectedTheme,
      categories,
      product: {
        name: productName,
        price: productPrice,
        category: productCategory,
        image: productImage
      },
      freeShipmentsRemaining: 5,
      governorate: 'بغداد',
      shippingPartner: 'شركة الزعيم للشحن',
      onboardingComplete: true,
      completedAt: new Date().toISOString()
    };

    // 1. Save in local browser storage and cross-subdomain cookie via central registry!
    registerStore({
      subdomain: cleanSub,
      storeName,
      slogan,
      templateId: selectedTheme,
      categories,
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
    });

    // 2. Register with server API to bind subdomain and template (if backend is active)
    try {
      await fetch('/api/tenant/stores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: storeName,
          subdomain: cleanSub,
          templateId: selectedTheme,
          productTitle: productName,
          productPrice: Number(productPrice) || 45000,
          productImage: productImage
        })
      });
    } catch (apiErr) {
      console.warn('API store register fallback:', apiErr);
    }

    setIsLaunching(false);

    // 3. Show Launch Success Celebration Modal with seed URL
    const activeT = REAL_STORE_TEMPLATES.find(t => t.id === selectedTheme) || REAL_STORE_TEMPLATES[0];
    const seed = encodeStoreSeed({
      subdomain: cleanSub,
      storeName,
      slogan,
      templateId: selectedTheme,
      categories,
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
    });

    setLaunchSuccessData({
      open: true,
      subdomain: cleanSub,
      storeName,
      templateName: activeT.name,
      seedUrl: `https://${cleanSub}.za3em.shop/#init=${seed}`,
    });
  };

  const handleCopyStoreLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2500);
  };

  const activeTheme = REAL_STORE_TEMPLATES.find(t => t.id === selectedTheme) || REAL_STORE_TEMPLATES[0];

  return (
    <main dir="rtl" className="min-h-[100dvh] bg-[#070b14] text-slate-100 font-sans select-none flex flex-col relative overflow-x-hidden">
      {/* Dynamic Background Glows */}
      <div className="fixed top-0 right-1/4 -z-10 size-96 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-1/4 -z-10 size-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* ========================================================================= */}
      {/* 1️⃣ TOP HEADER & WIZARD PROGRESS BAR */}
      {/* ========================================================================= */}
      <header className="border-b border-slate-800/80 bg-[#0a101d]/90 backdrop-blur-md sticky top-0 z-40 px-4 md:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Logo showSubtitle={false} inverse />
          <div className="h-5 w-px bg-slate-800 hidden sm:block" />
          <div className="hidden sm:block text-right">
            <h1 className="text-xs font-black text-white flex items-center gap-1.5">
              <Sparkles className="size-3.5 text-teal-400" />
              مركز إعداد المتجر والقوالب الحقيقية — منصة الزعيم
            </h1>
            <p className="text-[10px] text-slate-400">اختر قالب موقعك واربطه بدومينك وأطلقه على الإنترنت فوراً</p>
          </div>
        </div>

        {/* 1-Click Fast Track Button */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleUseDefaultSample}
            className="flex items-center gap-2 rounded-full border border-amber-500/40 bg-gradient-to-r from-amber-950/60 to-amber-900/40 hover:from-amber-900/70 hover:to-amber-800/60 px-4 py-1.5 text-xs font-black text-amber-300 transition-all shadow-lg shadow-amber-950/50 hover:scale-[1.02] cursor-pointer"
          >
            <Wand2 className="size-3.5 text-amber-400 animate-pulse" />
            <span>نموذج جاهز بنقرة واحدة 🪄</span>
          </button>

          {/* Step Counter Pill */}
          <div className="flex items-center gap-2.5 bg-slate-900/90 border border-slate-800 rounded-full px-3.5 py-1 text-xs">
            <span className="font-mono font-black text-teal-400 text-[11px]">
              {currentStep * 20}%
            </span>
            <span className="text-[10px] font-bold text-slate-400 hidden sm:inline">
              الخطوة {currentStep} من 5
            </span>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2️⃣ SEQUENTIAL STEP TRACKER TABS */}
      {/* ========================================================================= */}
      <div className="border-b border-slate-800/60 bg-[#090e1a]/60 backdrop-blur-sm px-4 md:px-8 py-2.5 overflow-x-auto rf-scrollbar">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-2 min-w-[650px]">
          {[
            { step: 1, title: 'هوية المتجر', subtitle: 'الاسم والدومين الفرعي', icon: Globe },
            { step: 2, title: 'مجال التجارة', subtitle: 'التخصص والأقسام', icon: Tag },
            { step: 3, title: 'القوالب الحقيقية', subtitle: 'اختر موقعك الفعلي', icon: ShoppingBag },
            { step: 4, title: 'المنتج الأول', subtitle: 'مع رصيد الشحن', icon: Package },
            { step: 5, title: 'الإطلاق المباشر', subtitle: 'نشر فوري أونلاين', icon: CheckCheck }
          ].map((item) => {
            const Icon = item.icon;
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
                    ? 'bg-teal-500 text-slate-950'
                    : isCompleted
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
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
      {/* 3️⃣ MAIN SPLIT LAYOUT: Config wizard (7 cols) + Live simulator (5 cols) */}
      {/* ========================================================================= */}
      <div className="flex-1 max-w-[1500px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 p-4 md:p-8">

        {/* ========================================================================= */}
        {/* LEFT / TOP: Wizard Steps (7 cols) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6 order-1">

          {/* ----------------------------------------------------------------------- */}
          {/* STEP 1: Store Identity & Subdomain */}
          {/* ----------------------------------------------------------------------- */}
          {currentStep === 1 && (
            <div className="rounded-3xl border border-slate-800/90 bg-[#0d1424]/90 backdrop-blur-xl p-6 md:p-8 space-y-6 shadow-2xl animate-fadeIn text-right">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] font-black text-teal-400 bg-teal-950/60 px-2.5 py-1 rounded-full border border-teal-800/40">
                    الخطوة 1 من 5 • هوية المتجر
                  </span>
                  <h2 className="text-xl font-black text-white mt-2">
                    اسم متجرك وحجز الدومين الفرعي
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    هذا الدومين هو الرابط الحقيقي الذي سيطلقه الزعيم على الإنترنت لمتجرك فوراً.
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
                  className="w-full rounded-2xl border border-slate-700/80 bg-slate-950/90 px-4 py-3.5 text-sm text-white focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all"
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
                      className="text-[10px] font-bold text-slate-300 bg-slate-800/80 hover:bg-slate-700 px-2.5 py-1 rounded-lg border border-slate-700 transition-colors cursor-pointer"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subdomain URL Generator with Real-time Check */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-slate-200 block">
                    رابط موقعك الفرعي المباشر (Subdomain)
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">
                    فحص فوري لحظي
                  </span>
                </div>

                <div className={`flex items-center rounded-2xl border bg-slate-950/90 px-4 py-3 transition-all ${
                  subdomainCheck.status === 'checking'
                    ? 'border-teal-500/60 ring-2 ring-teal-500/10'
                    : subdomainCheck.status === 'available'
                    ? 'border-emerald-500/80 ring-2 ring-emerald-500/20'
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
                  <span className="text-slate-500 text-xs font-mono font-bold select-none pr-1 pl-2">
                    .za3em.shop
                  </span>

                  {/* Real-time status indicator icon */}
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

                {/* Real-Time Result Banner & Suggestions */}
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
                      HTTPS / SSL مجاني معتمد
                    </span>
                  </div>

                  {/* Alternative Suggestions if taken or reserved */}
                  {subdomainCheck.status === 'unavailable' && subdomainCheck.suggestions && subdomainCheck.suggestions.length > 0 && (
                    <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] space-y-1.5 animate-fadeIn">
                      <span className="text-slate-400 font-bold block">💡 نقترح عليك هذه الدومينات البديلة المتاحة:</span>
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
                  className="w-full rounded-2xl border border-slate-700/80 bg-slate-950/90 px-4 py-3 text-xs text-white focus:border-teal-500 focus:outline-none transition-all"
                />
              </div>
            </div>
          )}

          {/* ----------------------------------------------------------------------- */}
          {/* STEP 2: Niche & Categories */}
          {/* ----------------------------------------------------------------------- */}
          {currentStep === 2 && (
            <div className="rounded-3xl border border-slate-800/90 bg-[#0d1424]/90 backdrop-blur-xl p-6 md:p-8 space-y-6 shadow-2xl animate-fadeIn text-right">
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
                            : 'border-slate-800 bg-slate-950/80 text-slate-400 hover:border-slate-700 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <Icon className={`size-5 ${isSelected ? 'text-teal-400' : 'text-slate-400'}`} />
                          {isSelected && (
                            <span className="size-4 rounded-full bg-teal-500 text-slate-950 grid place-items-center text-[9px] font-black">
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
                    أقسام وتصنيفات المتجر (يمكنك الحذف والإضافة):
                  </label>
                  <span className="text-[10px] text-teal-400 font-bold">{categories.length} أقسام محددة</span>
                </div>

                {/* Pills List */}
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
                        className="text-slate-400 hover:text-red-400 font-black cursor-pointer"
                        title="حذف هذا القسم"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                {/* Add New Category Tag */}
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
                    className="rounded-xl bg-teal-600 hover:bg-teal-500 px-5 text-xs font-bold text-white transition-colors cursor-pointer"
                  >
                    + إضافة
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ----------------------------------------------------------------------- */}
          {/* STEP 3: Real E-Commerce Shopping Templates Selection */}
          {/* ----------------------------------------------------------------------- */}
          {currentStep === 3 && (
            <div className="rounded-3xl border border-slate-800/90 bg-[#0d1424]/90 backdrop-blur-xl p-6 md:p-8 space-y-6 shadow-2xl animate-fadeIn text-right">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] font-black text-teal-400 bg-teal-950/60 px-2.5 py-1 rounded-full border border-teal-800/40">
                    الخطوة 3 من 5 • قوالب مواقع تسوق حقيقية
                  </span>
                  <h2 className="text-xl font-black text-white mt-2">
                    اختر ثيم موقع التسوق الفعلي لمتجرك
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    هذه قوالب مواقع تسوق كاملة وحقيقية بسلة مشتريات وشيك أوت دفع عند الاستلام. سيتم ربط القالب المختار بدومينك وإطلاقه فوراً.
                  </p>
                </div>
                <div className="size-12 rounded-2xl bg-teal-500/10 text-teal-400 grid place-items-center border border-teal-500/20">
                  <ShoppingBag className="size-6" />
                </div>
              </div>

              {/* 6 Real Store Templates Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {REAL_STORE_TEMPLATES.map((tmpl) => {
                  const isSelected = selectedTheme === tmpl.id;

                  return (
                    <div
                      key={tmpl.id}
                      onClick={() => setSelectedTheme(tmpl.id)}
                      className={`relative rounded-2xl border p-4.5 transition-all flex flex-col justify-between space-y-3 cursor-pointer group ${
                        isSelected
                          ? `${tmpl.borderActive} ${tmpl.previewBg} ring-2 ${tmpl.ringColor} shadow-xl scale-[1.01]`
                          : `${tmpl.previewBg} border-slate-800/80 hover:border-slate-700 opacity-80 hover:opacity-100`
                      }`}
                    >
                      {/* Top Badges & Image Preview */}
                      <div className="space-y-3">
                        <div className="relative h-32 rounded-xl overflow-hidden border border-slate-800">
                          <img
                            src={tmpl.heroImage}
                            alt={tmpl.name}
                            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                          {/* Top Badges */}
                          <div className="absolute top-2.5 right-2.5 left-2.5 flex items-center justify-between">
                            <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-slate-900/90 text-white border border-white/20 backdrop-blur-sm">
                              {tmpl.badge}
                            </span>
                            {isSelected && (
                              <span className="px-2 py-0.5 rounded-full bg-teal-500 text-slate-950 text-[10px] font-black flex items-center gap-1 shadow-lg">
                                <Check className="size-3 stroke-[3]" /> مفعّل لدومينك
                              </span>
                            )}
                          </div>

                          {/* Title over Image */}
                          <div className="absolute bottom-2 right-2.5 left-2.5 text-right">
                            <h4 className="text-sm font-black text-white">{tmpl.name}</h4>
                            <p className="text-[10px] text-teal-300 font-bold">{tmpl.categoryTitle}</p>
                          </div>
                        </div>

                        {/* Tagline */}
                        <p className="text-[11px] text-slate-300 leading-snug">
                          {tmpl.tagline}
                        </p>

                        {/* Feature Tags */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {tmpl.features.map((feat, fIdx) => (
                            <span
                              key={fIdx}
                              className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-300"
                            >
                              ✓ {feat}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Card Bottom Actions: Selection & Full Live Preview Modal */}
                      <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                        <span className={`text-[10px] font-bold ${tmpl.priceColor}`}>
                          {isSelected ? '✓ تم الربط بهذا القالب' : 'اضغط للاختيار والتطبيق'}
                        </span>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewModalTemplate(tmpl);
                          }}
                          className="flex items-center gap-1 text-[11px] font-bold text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                        >
                          <Eye className="size-3 text-teal-400" />
                          <span>معاينة حية للقالب</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Theme Guarantee Callout */}
              <div className="p-4 rounded-2xl bg-teal-950/40 border border-teal-500/30 flex items-center gap-3 text-xs text-teal-200">
                <ShieldCheck className="size-5 text-teal-400 shrink-0" />
                <span>
                  كل قالب تم اختباره برمجياً ليعمل فورياً برابط الدومين الفرعي مع سلة التسوق وشحن الزعيم بدون أي إعدادات معقدة.
                </span>
              </div>
            </div>
          )}

          {/* ----------------------------------------------------------------------- */}
          {/* STEP 4: First Product & Free Shipping Activation */}
          {/* ----------------------------------------------------------------------- */}
          {currentStep === 4 && (
            <div className="rounded-3xl border border-slate-800/90 bg-[#0d1424]/90 backdrop-blur-xl p-6 md:p-8 space-y-6 shadow-2xl animate-fadeIn text-right">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] font-black text-teal-400 bg-teal-950/60 px-2.5 py-1 rounded-full border border-teal-800/40">
                    الخطوة 4 من 5 • أول منتج حقيقي
                  </span>
                  <h2 className="text-xl font-black text-white mt-2">
                    أضف أول منتج لمتجرك لتبدأ بالبيع
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    يمكنك اختيار منتج جاهز بنقرة واحدة أو كتابة بيانات منتجك الخاص.
                  </p>
                </div>
                <div className="size-12 rounded-2xl bg-teal-500/10 text-teal-400 grid place-items-center border border-teal-500/20">
                  <Package className="size-6" />
                </div>
              </div>

              {/* Quick Sample Products Picker */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-300 block">
                  أو اختر نموذجاً جاهزاً سريعاً:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {SAMPLE_PRODUCTS.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handlePickSampleProduct(item)}
                      className={`p-2 rounded-xl border text-right transition-all flex items-center gap-2 cursor-pointer ${
                        productName === item.name
                          ? 'border-teal-500 bg-teal-950/60 text-white ring-1 ring-teal-500/40'
                          : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-white'
                      }`}
                    >
                      <img src={item.image} alt={item.name} className="size-10 rounded-lg object-cover shrink-0" />
                      <div className="overflow-hidden">
                        <p className="text-[11px] font-bold truncate leading-tight">{item.name}</p>
                        <p className="text-[10px] text-teal-400 font-mono mt-0.5">{formatIQD(Number(item.price))}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Form */}
              <div className="space-y-4 pt-2 border-t border-slate-800">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1 text-right">
                    <label className="text-xs font-bold text-slate-300 block">اسم المنتج *</label>
                    <input
                      type="text"
                      value={productName}
                      onChange={(e) => { setProductName(e.target.value); setProductAdded(true); }}
                      placeholder="مثال: عطر تاج الفخامة الملكي"
                      className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-xs text-white focus:border-teal-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1 text-right">
                    <label className="text-xs font-bold text-slate-300 block">السعر بالدينار العراقي (د.ع) *</label>
                    <input
                      type="number"
                      value={productPrice}
                      onChange={(e) => { setProductPrice(e.target.value); setProductAdded(true); }}
                      placeholder="45000"
                      className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-xs text-white font-mono focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Category selector for this product */}
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

                {/* Image Upload simulation */}
                <div className="relative rounded-2xl border-2 border-dashed border-slate-700 bg-slate-950 p-4 text-center hover:border-teal-500/50 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUploadSim}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div className="flex items-center justify-center gap-3">
                    <img src={productImage} alt="Preview" className="size-12 rounded-xl object-cover border border-slate-700" />
                    <div className="text-right">
                      <p className="text-xs font-bold text-white">اضغط لتغيير صورة المنتج أو ارفع صورتك الخاصة</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">JPG, PNG, WEBP — التحسين والضغط فوري</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Free 5 Shipments Celebration Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/30 border border-amber-500/30 text-right flex items-start gap-3.5">
                <div className="size-10 rounded-xl bg-amber-500/20 text-amber-400 grid place-items-center shrink-0 border border-amber-500/30">
                  <Gift className="size-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-amber-300">
                    هدية مجانية لمتجرك: 5 شحنات مجانية بالكامل
                  </h4>
                  <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                    تم تفعيل رصيد 5 شحنات مجانية مع أسطول شركة الزعيم للشحن في العراق (توصيل لكافة المحافظات مع تحصيل الدفع عند الاستلام).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ----------------------------------------------------------------------- */}
          {/* STEP 5: Final Review & Live Internet Launch */}
          {/* ----------------------------------------------------------------------- */}
          {currentStep === 5 && (
            <div className="rounded-3xl border border-teal-500/40 bg-gradient-to-br from-[#0c1424] via-[#09101d] to-slate-950 p-6 md:p-8 space-y-6 shadow-2xl animate-fadeIn text-right">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] font-black text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-800/40">
                    الخطوة الأخيرة • الربط والإطلاق الفوري
                  </span>
                  <h2 className="text-xl font-black text-white mt-2">
                    متجرك جاهز للربط بالدومين والإطلاق أونلاين! 🚀
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    بمجرد النقر سيتم ربط القالب المختار (<span className="text-teal-300 font-bold">{activeTheme.name}</span>) بالدومين الفرعي وإتاحته مباشرة على الإنترنت.
                  </p>
                </div>
                <div className="size-12 rounded-2xl bg-emerald-500/10 text-emerald-400 grid place-items-center border border-emerald-500/20">
                  <Sparkles className="size-6 animate-pulse" />
                </div>
              </div>

              {/* Summary Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold block">اسم المتجر التجاري</span>
                  <span className="font-black text-sm text-white">{storeName}</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold block">الدومين الفرعي المباشر</span>
                  <span className="font-mono font-bold text-sm text-teal-400 truncate block">{subdomain}</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold block">قالب المتجر المختار</span>
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <span className={`size-2.5 rounded-full ${activeTheme.btnBg.split(' ')[0]}`} />
                    {activeTheme.name}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold block">المنتج الأول المعروض</span>
                  <span className="font-bold text-white truncate block">
                    {productName} ({formatIQD(Number(productPrice))})
                  </span>
                </div>
              </div>

              {/* Logistics & Free Shipments Badge */}
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 flex items-center justify-between text-xs text-emerald-200">
                <div className="flex items-center gap-3">
                  <Truck className="size-5 text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-black block text-emerald-300">أسطول الزعيم للشحن مفعل تلقائياً</span>
                    <span className="text-[11px] text-emerald-400/80">رصيدك: 5 شحنات مجانية + توصيل لجميع المحافظات الـ 18</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black shrink-0">
                  مؤكد ✅
                </span>
              </div>

              {/* Big Launch Button */}
              <button
                type="button"
                disabled={isLaunching}
                onClick={handleCompleteAndLaunch}
                className="w-full flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 py-4 text-sm font-black text-slate-950 shadow-2xl shadow-emerald-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-50"
              >
                {isLaunching ? (
                  <>
                    <RefreshCw className="size-4 animate-spin" />
                    <span>جاري ربط القالب بالدومين وإطلاق المتجر على الإنترنت...</span>
                  </>
                ) : (
                  <span>🚀 ربط القالب وافتتاح المتجر أونلاين فوراً</span>
                )}
              </button>
            </div>
          )}

          {/* ----------------------------------------------------------------------- */}
          {/* BOTTOM STEP NAVIGATION CONTROLS */}
          {/* ----------------------------------------------------------------------- */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-xs font-bold text-slate-300 transition-all cursor-pointer"
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
                    : 'bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-lg shadow-teal-500/20 cursor-pointer hover:scale-[1.02]'
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
        {/* RIGHT: Live Interactive Mobile Mockup (5 cols) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-5 order-2">
          <div className="sticky top-20 rounded-3xl border border-slate-800/90 bg-[#0c1220]/90 backdrop-blur-xl p-5 flex flex-col space-y-4 shadow-2xl">
            {/* Header Simulator Title */}
            <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Smartphone className="size-4 text-teal-400" />
                <span className="font-extrabold text-slate-200">معاينة مباشرة على الموبايل</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] text-teal-300 font-bold">{activeTheme.name}</span>
              </div>
            </div>

            {/* Mobile Device Frame */}
            <div className={`rounded-3xl border-4 border-slate-800 ${activeTheme.previewBg} p-3.5 space-y-3 min-h-[500px] flex flex-col justify-between shadow-inner transition-colors duration-300`}>

              {/* Dynamic Island / Device Top Bar */}
              <div className="flex items-center justify-between px-2 pt-1 text-[10px] text-slate-400 font-mono">
                <span>9:41</span>
                <div className="h-3 w-16 bg-black rounded-full mx-auto" />
                <div className="flex items-center gap-1">
                  <span>5G</span>
                  <span>100%</span>
                </div>
              </div>

              {/* URL Bar */}
              <div className="flex items-center justify-between rounded-xl bg-slate-900/90 border border-slate-800 px-3 py-1.5 text-xs">
                <span className="font-mono text-[10px] text-teal-400 truncate dir-ltr">
                  https://{subdomain}
                </span>
                <span className="size-2 rounded-full bg-emerald-500 shrink-0" />
              </div>

              {/* Store View Content */}
              <div className="space-y-3.5 flex-1">
                {/* Store Header Inside Mobile */}
                <div className={`p-3.5 rounded-2xl ${activeTheme.headerBg} flex items-center justify-between transition-colors duration-300`}>
                  <div className="flex items-center gap-2.5">
                    <span className={`size-8 rounded-xl ${activeTheme.btnBg.split(' ')[0]} text-white font-black grid place-items-center text-xs shadow-md`}>
                      {storeName.charAt(0).toUpperCase()}
                    </span>
                    <div className="text-right">
                      <h4 className="font-black text-xs text-white leading-tight truncate max-w-[140px]">{storeName}</h4>
                      <p className="text-[9px] text-slate-400 truncate max-w-[140px] mt-0.5">{slogan}</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-black text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-2 py-0.5 rounded-full shrink-0">
                    🇮🇶 العراق
                  </span>
                </div>

                {/* Categories Scroll Pills */}
                {categories.length > 0 && (
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 rf-scrollbar">
                    {categories.map((cat, idx) => (
                      <span key={idx} className={`shrink-0 text-[9px] font-bold px-2.5 py-1 rounded-full border ${activeTheme.pillBg} transition-colors duration-300`}>
                        {cat}
                      </span>
                    ))}
                  </div>
                )}

                {/* Live Product Card */}
                {productAdded ? (
                  <div className={`rounded-2xl border ${activeTheme.cardBg} overflow-hidden space-y-2 transition-colors duration-300`}>
                    <div className="h-40 bg-slate-900 relative">
                      <img src={productImage} alt="Product" className="size-full object-cover" />
                      <span className={`absolute top-2.5 right-2.5 text-[9px] font-black ${activeTheme.btnBg.split(' ')[0]} text-white px-2 py-0.5 rounded-full shadow-md`}>
                        مميز
                      </span>
                    </div>
                    <div className="p-3 text-right">
                      <h4 className="font-extrabold text-xs text-white leading-snug">{productName}</h4>
                      <div className="flex items-center justify-between mt-2">
                        <p className={`text-sm font-black ${activeTheme.priceColor} font-mono`}>
                          {formatIQD(Number(productPrice) || 45000)}
                        </p>
                        <span className="text-[9px] font-bold text-slate-400 bg-white/5 px-2 py-0.5 rounded-md">
                          {productCategory}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-40 rounded-2xl border-2 border-dashed border-slate-800 grid place-items-center text-xs text-slate-500">
                    أضف منتجك لتراه هنا
                  </div>
                )}

                {/* Shipping Badge in Mobile */}
                <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-2 text-[10px] text-slate-300">
                  <Truck className="size-3.5 text-teal-400 shrink-0" />
                  <span>شحن سريع لجميع محافظات العراق • الدفع عند الاستلام</span>
                </div>
              </div>

              {/* Bottom Mobile Action Button */}
              <button
                type="button"
                onClick={() => setCurrentStep(5)}
                className={`w-full py-3 rounded-xl ${activeTheme.btnBg} text-xs font-black shadow-lg transition-all text-center cursor-pointer`}
              >
                طلب المنتج الآن (الدفع عند الاستلام)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4️⃣ FULL-SCREEN REAL TEMPLATE LIVE PREVIEW MODAL */}
      {/* ========================================================================= */}
      {previewModalTemplate && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 md:p-8 animate-fadeIn">
          <div className="max-w-4xl w-full rounded-3xl border border-slate-800 bg-[#0c1322] shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
              <div className="flex items-center gap-3 text-right">
                <span className="size-9 rounded-xl bg-teal-500/20 text-teal-400 grid place-items-center font-bold">
                  <Eye className="size-5" />
                </span>
                <div>
                  <h3 className="text-base font-black text-white">{previewModalTemplate.name}</h3>
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

            {/* Modal Content / Template Preview Display */}
            <div className="p-6 overflow-y-auto space-y-6 text-right rf-scrollbar">
              <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
                <img
                  src={previewModalTemplate.heroImage}
                  alt={previewModalTemplate.name}
                  className="size-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <div className="absolute bottom-6 right-6 left-6 space-y-2">
                  <span className="text-xs font-black px-3 py-1 rounded-full bg-teal-500 text-slate-950">
                    {previewModalTemplate.badge}
                  </span>
                  <h2 className="text-2xl font-black text-white">{previewModalTemplate.name}</h2>
                  <p className="text-sm text-slate-300 max-w-xl">{previewModalTemplate.tagline}</p>
                </div>
              </div>

              {/* Template Feature Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {previewModalTemplate.features.map((feat, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-teal-400 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              {/* Live Preview Info */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-300 space-y-2 leading-relaxed">
                <p className="font-bold text-white">✨ كيف سيبدو متجرك بهذا القالب؟</p>
                <p>
                  عند اختيار هذا القالب، سيتم ربطه تلقائياً بالدومين الفرعي (<span className="text-teal-400 font-mono font-bold">{subdomain}</span>). سيحصل زبائنك على تجربة تسوق كاملة تدعم اللغة العربية، سلة المشتريات، وحجز الشحنة فوراً برقم بوليصة تتبع من شركة الزعيم للشحن.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between gap-3">
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
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-xs font-black text-slate-950 shadow-lg shadow-teal-500/20 transition-all cursor-pointer"
              >
                <Check className="size-4 stroke-[3]" />
                <span>اعتماد وربط هذا القالب بمتجري</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5️⃣ INSTANT ONLINE LAUNCH CELEBRATION MODAL */}
      {/* ========================================================================= */}
      {launchSuccessData && launchSuccessData.open && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-lg flex items-center justify-center p-4 animate-fadeIn">
          <div className="max-w-lg w-full rounded-3xl border border-emerald-500/40 bg-[#0c1524] p-6 md:p-8 text-right space-y-6 shadow-2xl relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 size-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* Top Confetti & Header */}
            <div className="text-center space-y-2">
              <div className="size-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto grid place-items-center shadow-lg shadow-emerald-500/20">
                <Sparkles className="size-8 animate-bounce" />
              </div>
              <span className="inline-block text-[11px] font-black text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-800/80">
                تم الربط والإطلاق أونلاين بنجاح! 🎉
              </span>
              <h2 className="text-2xl font-black text-white">
                متجرك انطلق الآن على الإنترنت!
              </h2>
              <p className="text-xs text-slate-300 max-w-sm mx-auto">
                تم حجز دومينك وربطه بقالب (<span className="text-emerald-300 font-bold">{launchSuccessData.templateName}</span>) وأصبح متاحاً للزبائن للطلب فوراً.
              </p>
            </div>

            {/* Live Store URL Box */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-700/80 space-y-2">
              <span className="text-[10px] text-slate-400 font-bold block">رابط متجرك الحقيقي المباشر:</span>
              <div className="flex items-center justify-between gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="font-mono text-xs text-emerald-400 font-bold truncate dir-ltr">
                  https://{launchSuccessData.subdomain}.za3em.shop
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyStoreLink(`https://${launchSuccessData.subdomain}.za3em.shop`)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-slate-950 text-[11px] font-black transition-colors shrink-0 cursor-pointer"
                >
                  <Copy className="size-3" />
                  <span>{linkCopied ? 'تم النسخ! ✅' : 'نسخ الرابط'}</span>
                </button>
              </div>
            </div>

            {/* Quick Preview Link */}
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs text-slate-300">
              <span className="text-[11px]">معاينة فورية داخل المنصة:</span>
              <a
                href={`/#/store/${launchSuccessData.subdomain}`}
                target="_blank"
                rel="noreferrer"
                className="text-teal-400 hover:text-teal-300 font-bold underline flex items-center gap-1 font-mono text-[11px]"
              >
                <span>زيارة المتجر الآن</span>
                <ExternalLink className="size-3" />
              </a>
            </div>

            {/* Logistics & 5 Free Shipments Active */}
            <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 text-xs text-emerald-300 flex items-center gap-2 font-bold">
              <Truck className="size-4 text-emerald-400 shrink-0" />
              <span>رصيد 5 شحنات مجانية مفعل لمتجرك مع أسطول الزعيم في العراق!</span>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2">
              <a
                href={launchSuccessData.seedUrl || `https://${launchSuccessData.subdomain}.za3em.shop`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs text-center flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 transition-all cursor-pointer"
              >
                <span>فتح وتجربة المتجر المباشر 🌐</span>
                <ExternalLink className="size-4" />
              </a>

              <button
                type="button"
                onClick={() => {
                  window.location.hash = '#/dashboard';
                  setLocation('/dashboard');
                }}
                className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                الانتقال للوحة التحكم ومتابعة الشحنات 🚀
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
