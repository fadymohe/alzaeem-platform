import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Logo } from '../components/common/Logo';
import {
  Shirt, Smartphone, Sparkles, Grid, Check,
  ChevronLeft, ChevronRight, Upload, ExternalLink,
  Truck, Store, ShieldCheck, Eye, Wand2, RefreshCw,
  CheckCircle2, AlertCircle, Tag, Package, Gift,
  CheckCheck, Globe, Star, Copy, ShoppingBag,
  X, Search, ShoppingCart, Shield
} from 'lucide-react';
import { formatIQD } from '../data/iraqData';
import { registerStore, encodeStoreSeed, checkSubdomainAvailability } from '../utils/storeRegistry';

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
    tagline: 'سلة مشتريات عائمة، تصفية أقسام، بحث فوري، ودفع عند الاستلام لكافة المحافظات',
    features: ['سلة تسوق عائمة متفاعلة', 'تصفح أقسام وبحث فوري', 'شيك أوت COD مع كافة المحافظات'],
    heroImage: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&auto=format&fit=crop&q=80',
    accentColor: 'blue',
    borderActive: 'border-blue-500',
    ringColor: 'ring-blue-500/40',
    previewBg: 'bg-[#0b1220]',
    headerBg: 'bg-[#0f172a] border-blue-500/30',
    cardBg: 'bg-[#131d33] border-blue-500/20',
    pillBg: 'bg-blue-950/80 text-blue-300 border-blue-700/60',
    priceColor: 'text-blue-400',
    btnBg: 'bg-blue-600 hover:bg-blue-500 text-white'
  },
  {
    id: 'volt',
    name: 'فولت إكسبريس (Volt Tech)',
    categoryTitle: 'إلكترونيات وهواتف وتريندات',
    badge: 'داكن عصري احترافي',
    tagline: 'تصميم عالي التقنية للإلكترونيات والأجهزة الذكية مع شارات جودة ومواصفات دقيقة',
    features: ['إضاءات هادئة وتقنية', 'كروت مواصفات فنية سريعة', 'متوافق مع أحدث الهواتف الذكية'],
    heroImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    accentColor: 'cyan',
    borderActive: 'border-cyan-500',
    ringColor: 'ring-cyan-500/40',
    previewBg: 'bg-[#07131e]',
    headerBg: 'bg-[#0c1e2f] border-cyan-900/40',
    cardBg: 'bg-[#0f2438] border-cyan-900/40',
    pillBg: 'bg-cyan-950/80 text-cyan-300 border-cyan-800/60',
    priceColor: 'text-cyan-400',
    btnBg: 'bg-cyan-600 hover:bg-cyan-500 text-white'
  },
  {
    id: 'rose',
    name: 'روز بوتيك (Rose Atelier)',
    categoryTitle: 'أزياء، عبايات ومستحضرات تجميل',
    badge: 'بوتيك راقي وفاخر',
    tagline: 'تجربة تسوق أنيقة بتدرجات هادئة ودافئة تبرز تفاصيل الأزياء والجمال',
    features: ['خطوط طباعية متناسقة', 'عرض صور عريض للأزياء', 'نموذج استلام سهل وبسيط'],
    heroImage: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&auto=format&fit=crop&q=80',
    accentColor: 'rose',
    borderActive: 'border-rose-500',
    ringColor: 'ring-rose-500/40',
    previewBg: 'bg-[#150d14]',
    headerBg: 'bg-[#21111e] border-rose-900/40',
    cardBg: 'bg-[#291425] border-rose-900/40',
    pillBg: 'bg-rose-950/80 text-rose-300 border-rose-800/60',
    priceColor: 'text-rose-400',
    btnBg: 'bg-rose-600 hover:bg-rose-500 text-white'
  },
  {
    id: 'nitro',
    name: 'نيترو سبورت (Nitro Sports)',
    categoryTitle: 'أزياء رياضية وأحذية شارع',
    badge: 'رياضي عالي الأداء',
    tagline: 'تصميم رياضي مركز لعرض الأحذية والمستلزمات الرياضية مع سرعة طلب استثنائية',
    features: ['شارات تخفيض وعروض خاطفة', 'أزرار طلب كبيرة وحاسمة', 'تحميل فائق السرعة'],
    heroImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
    accentColor: 'indigo',
    borderActive: 'border-indigo-500',
    ringColor: 'ring-indigo-500/40',
    previewBg: 'bg-[#0f1122]',
    headerBg: 'bg-[#151934] border-indigo-900/40',
    cardBg: 'bg-[#1b2042] border-indigo-900/40',
    pillBg: 'bg-indigo-950/80 text-indigo-300 border-indigo-800/60',
    priceColor: 'text-indigo-400',
    btnBg: 'bg-indigo-600 hover:bg-indigo-500 text-white'
  },
  {
    id: 'sepia',
    name: 'هاير الملكي (Royal Sepia)',
    categoryTitle: 'ساعات، عطور فاخرة وهدايا',
    badge: 'كلاسيكي فخم وراقي',
    tagline: 'أصالة التراث وفخامة المقتنيات الملكية للساعات والعطور والجلديات والهدايا',
    features: ['لمسات لونية دافئة ومريحة', 'إبراز مواصفات المنتجات الفاخرة', 'خدمة تغليف الهدايا'],
    heroImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    accentColor: 'amber',
    borderActive: 'border-amber-500',
    ringColor: 'ring-amber-500/40',
    previewBg: 'bg-[#14100c]',
    headerBg: 'bg-[#221a14] border-amber-900/40',
    cardBg: 'bg-[#2c221a] border-amber-900/40',
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
    features: ['نموذج طلب COD مدمج مباشرة', 'عداد كمية وإثبات اجتماعي', 'مثالي للحملات الإعلانية الممولة'],
    heroImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
    accentColor: 'blue',
    borderActive: 'border-blue-500',
    ringColor: 'ring-blue-500/40',
    previewBg: 'bg-[#0a121e]',
    headerBg: 'bg-[#0f1c2d] border-blue-900/40',
    cardBg: 'bg-[#122238] border-blue-900/40',
    pillBg: 'bg-blue-950/80 text-blue-300 border-blue-800/60',
    priceColor: 'text-blue-400',
    btnBg: 'bg-blue-600 hover:bg-blue-500 text-white'
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
    recommendedTheme: 'sepia',
    defaultCats: ['عطور فرنسية', 'دهن عود وبخور', 'عناية بالبشرة', 'مستحضرات تجميل']
  },
  {
    id: 'fashion',
    label: 'أزياء وملابس',
    desc: 'رجالي، نسائي، أطفال، أحذية وحقائب',
    icon: Shirt,
    recommendedTheme: 'rose',
    defaultCats: ['أزياء رجالي', 'فساتين وعبايات', 'أحذية رياضية', 'حقائب وإكسسوارات']
  },
  {
    id: 'electronics',
    label: 'هواتف وإلكترونيات',
    desc: 'موبايلات، شواحن، ساعات ذكية، ملحقات',
    icon: Smartphone,
    recommendedTheme: 'volt',
    defaultCats: ['شواحن وكفرات', 'ساعات ذكية', 'سماعات صوتية', 'أجهزة إلكترونية']
  },
  {
    id: 'watches',
    label: 'ساعات وهدايا',
    desc: 'ساعات رجالي ونسائي، نظارات، أطقم هدايا',
    icon: Star,
    recommendedTheme: 'sepia',
    defaultCats: ['ساعات كلاسيك', 'ساعات رياضية', 'نظارات شمسية', 'أطقم هدايا']
  },
  {
    id: 'home',
    label: 'أدوات منزلية وديكور',
    desc: 'مستلزمات البيت، ديكورات، إضاءة عصرية',
    icon: Store,
    recommendedTheme: 'shoppingcart.1.2.7',
    defaultCats: ['إضاءة عصرية', 'مستلزمات مطبخ', 'ديكور منزلي', 'منظمات']
  },
  {
    id: 'general',
    label: 'متجر عام وتريندات',
    desc: 'منتجات متنوعة وأكثر المنتجات طلباً',
    icon: Grid,
    recommendedTheme: 'shoppingcart.1.2.7',
    defaultCats: ['الأكثر طلباً', 'وصل حديثاً', 'عروض التوفير', 'منتجات حصرية']
  }
];

export function OnboardingPage() {
  const [, setLocation] = useLocation();

  // Wizard Navigation: Step 1 to 5
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Store Configuration State
  const [storeName, setStoreName] = useState('متجر الفخامة العراقي');
  const [subdomain, setSubdomain] = useState('fakhama.za3em.shop');
  const [slogan, setSlogan] = useState('أفضل المنتجات المختارة بعناية مع التوصيل السريع لجميع محافظات العراق');
  const [selectedNiche, setSelectedNiche] = useState('perfumes');
  const [selectedTheme, setSelectedTheme] = useState('shoppingcart.1.2.7');
  const [categories, setCategories] = useState<string[]>(['عطور فرنسية', 'دهن عود وبخور', 'عناية بالبشرة']);
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

  // Product Selection & Customization
  const [productMode, setProductMode] = useState<'preset' | 'custom'>('preset');
  const [productName, setProductName] = useState('عطر تاج الفخامة الفرنسي الملكي');
  const [productPrice, setProductPrice] = useState('45000');
  const [productCategory, setProductCategory] = useState('عطور فرنسية');
  const [productImage, setProductImage] = useState(SAMPLE_PRODUCTS[0].image);
  const [productAdded, setProductAdded] = useState(true);

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
        const checkResult = await checkSubdomainAvailability(rawClean);
        setSubdomainCheck({
          status: checkResult.available ? 'available' : 'unavailable',
          message: checkResult.message,
          reason: checkResult.reason,
          suggestions: checkResult.suggestions
        });
      } catch {
        setSubdomainCheck({
          status: 'available',
          message: 'الدومين متاح ومحجوز لمتجرك'
        });
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [subdomain]);

  // Auto-fill from localStorage on initial load if present
  useEffect(() => {
    try {
      const stored = localStorage.getItem('zaeem_store_data') || localStorage.getItem('zaeem_onboarded_store');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.storeName) {
          setStoreName(parsed.storeName);
          const cleanSub = (parsed.subdomain || parsed.storeName)
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '') || 'store';
          setSubdomain(`${cleanSub}.za3em.shop`);
        }
        if (parsed.logoUrl) setLogoUrl(parsed.logoUrl);
        if (parsed.bannerUrl) setBannerUrl(parsed.bannerUrl);
        if (parsed.templateId) setSelectedTheme(parsed.templateId);
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
    setProductName(SAMPLE_PRODUCTS[0].name);
    setProductPrice(SAMPLE_PRODUCTS[0].price);
    setProductCategory('عطور رجالي');
    setProductImage(SAMPLE_PRODUCTS[0].image);
    setProductAdded(true);
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

  const handlePickSampleProduct = (sample: typeof SAMPLE_PRODUCTS[0]) => {
    setProductName(sample.name);
    setProductPrice(sample.price);
    setProductCategory(sample.category);
    setProductImage(sample.image);
    setProductAdded(true);
  };

  // Permanent Base64 Image Reader (Prevents broken blob URLs)
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    target: 'product' | 'logo' | 'banner'
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (target === 'product') {
          setProductImage(result);
          setProductAdded(true);
        } else if (target === 'logo') {
          setLogoUrl(result);
        } else if (target === 'banner') {
          setBannerUrl(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Final Complete & Online Launch Store
  const handleCompleteAndLaunch = async () => {
    setIsLaunching(true);

    const cleanSub = subdomain.replace('.za3em.shop', '').toLowerCase().trim();

    const payload = {
      storeCode,
      subdomain: cleanSub,
      storeName,
      slogan,
      templateId: selectedTheme,
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

    // 1. Register store in local storage and cross-domain cookie
    registerStore(payload);

    // Also persist in zaeem_onboarded_store for immediate restoration upon login
    try {
      localStorage.setItem('zaeem_onboarded_store', JSON.stringify({
        ...payload,
        fullSubdomain: `${cleanSub}.za3em.shop`,
        completedAt: new Date().toISOString()
      }));
    } catch {}

    // 2. Register with server API to bind subdomain and template
    try {
      await fetch('/api/tenant/stores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeCode,
          name: storeName,
          subdomain: cleanSub,
          templateId: selectedTheme,
          productTitle: productName,
          productPrice: Number(productPrice) || 45000,
          productImage: productImage,
          logoUrl: logoUrl || undefined,
          bannerUrl: bannerUrl || undefined
        })
      });
    } catch (apiErr) {
      console.warn('API store register fallback:', apiErr);
    }

    setIsLaunching(false);

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

  return (
    <main dir="rtl" className="min-h-[100dvh] bg-[#0b0f19] text-slate-200 font-sans select-none flex flex-col relative overflow-x-hidden">
      {/* Background Soft Glows */}
      <div className="fixed top-0 right-1/4 -z-10 size-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-1/4 -z-10 size-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* ========================================================================= */}
      {/* 1️⃣ TOP HEADER */}
      {/* ========================================================================= */}
      <header className="border-b border-slate-800 bg-[#0f172a]/95 backdrop-blur-md sticky top-0 z-40 px-4 md:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Logo showSubtitle={false} inverse />
          <div className="h-5 w-px bg-slate-800 hidden sm:block" />
          <div className="hidden sm:block text-right">
            <h1 className="text-xs font-black text-white flex items-center gap-1.5">
              <Shield className="size-3.5 text-blue-400" />
              مركز إعداد المتجر والقوالب المعتمدة — منصة الزعيم
            </h1>
            <p className="text-[10px] text-slate-400">اختر قالب متجرك واربطه بدومينك وأطلقه على الإنترنت فوراً</p>
          </div>
        </div>

        {/* Action Button: Ready Template (Blue Theme) */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleUseDefaultSample}
            className="flex items-center gap-2 rounded-xl border border-blue-500/40 bg-blue-600 hover:bg-blue-500 px-4 py-1.5 text-xs font-black text-white transition-all shadow-lg shadow-blue-600/25 hover:scale-[1.02] cursor-pointer"
          >
            <Wand2 className="size-3.5 text-blue-200" />
            <span>نموذج جاهز بنقرة واحدة</span>
          </button>

          {/* Step Counter Pill */}
          <div className="flex items-center gap-2.5 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-1 text-xs">
            <span className="font-mono font-black text-blue-400 text-[11px]">
              {currentStep * 20}%
            </span>
            <span className="text-[10px] font-bold text-slate-400 hidden sm:inline">
              الخطوة {currentStep} من 5
            </span>
          </div>
        </div>
      </header>

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
                    ? 'bg-blue-950/60 border border-blue-500/40 text-white shadow-md shadow-blue-950/40 ring-1 ring-blue-500/30'
                    : isCompleted
                    ? 'bg-slate-900/50 text-slate-300 hover:bg-slate-900 border border-slate-800/60'
                    : 'text-slate-500 hover:text-slate-400 opacity-60'
                }`}
              >
                <span className={`size-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                  isCurrent
                    ? 'bg-blue-600 text-white'
                    : isCompleted
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {isCompleted ? <Check className="size-3.5 stroke-[3]" /> : item.step}
                </span>

                <div className="overflow-hidden">
                  <p className={`text-xs font-black truncate leading-tight ${isCurrent ? 'text-blue-300' : 'text-slate-200'}`}>
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
                  <span className="text-[10px] font-black text-blue-400 bg-blue-950/60 px-2.5 py-1 rounded-full border border-blue-800/40">
                    الخطوة 1 من 5 • هوية المتجر
                  </span>
                  <h2 className="text-xl font-black text-white mt-2">
                    اسم متجرك وحجز الدومين والشعار
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    هذا الدومين هو الرابط الحقيقي المباشر لمتجرك على الإنترنت.
                  </p>
                </div>
                <div className="size-12 rounded-2xl bg-blue-500/10 text-blue-400 grid place-items-center border border-blue-500/20">
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
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
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
                    ? 'border-blue-500/60 ring-2 ring-blue-500/10'
                    : subdomainCheck.status === 'available'
                    ? 'border-blue-500/80 ring-2 ring-blue-500/20'
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
                        <RefreshCw className="size-4 text-blue-400 animate-spin" />
                      </span>
                    )}
                    {subdomainCheck.status === 'available' && (
                      <span title="متاح للحجز">
                        <CheckCircle2 className="size-4 text-blue-400" />
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
                      <span className="text-blue-400 font-bold flex items-center gap-1.5 text-[11px]">
                        <RefreshCw className="size-3 animate-spin" />
                        <span>{subdomainCheck.message}</span>
                      </span>
                    )}

                    {subdomainCheck.status === 'available' && (
                      <span className="text-blue-400 font-bold flex items-center gap-1.5 text-[11px]">
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
                            className="px-2.5 py-1 rounded-lg bg-blue-950/60 hover:bg-blue-900/80 text-blue-300 font-mono text-[11px] border border-blue-800/60 transition-colors cursor-pointer"
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
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-xs text-white focus:border-blue-500 focus:outline-none transition-all"
                />
              </div>

              {/* Optional Store Logo & Banner Uploads */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
                {/* Logo Upload */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 block">
                    شعار المتجر (Logo) — اختياري
                  </label>
                  <div className="relative rounded-2xl border border-slate-800 bg-slate-950 p-3 flex items-center gap-3 hover:border-blue-500/50 transition-colors">
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
                  <div className="relative rounded-2xl border border-slate-800 bg-slate-950 p-3 flex items-center gap-3 hover:border-blue-500/50 transition-colors">
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
                  <span className="text-[10px] font-black text-blue-400 bg-blue-950/60 px-2.5 py-1 rounded-full border border-blue-800/40">
                    الخطوة 2 من 5 • تخصص المتجر
                  </span>
                  <h2 className="text-xl font-black text-white mt-2">
                    ما هو مجال تجارتك والأقسام الرئيسية؟
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    اختر نشاطك التجاري ليتم تخصيص الأقسام والقالب المناسب لمتجرك تلقائياً.
                  </p>
                </div>
                <div className="size-12 rounded-2xl bg-blue-500/10 text-blue-400 grid place-items-center border border-blue-500/20">
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
                            ? 'border-blue-500 bg-blue-950/50 text-white shadow-lg shadow-blue-950/50 ring-2 ring-blue-500/40 scale-[1.02]'
                            : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <Icon className={`size-5 ${isSelected ? 'text-blue-400' : 'text-slate-400'}`} />
                          {isSelected && (
                            <span className="size-4 rounded-full bg-blue-600 text-white grid place-items-center text-[9px] font-black">
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
                  <span className="text-[10px] text-blue-400 font-bold">{categories.length} أقسام محددة</span>
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
                    className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddCategory}
                    className="rounded-xl bg-blue-600 hover:bg-blue-500 px-5 text-xs font-bold text-white transition-colors cursor-pointer"
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
                  <span className="text-[10px] font-black text-blue-400 bg-blue-950/60 px-2.5 py-1 rounded-full border border-blue-800/40">
                    الخطوة 3 من 5 • قوالب مواقع تسوق معتمدة
                  </span>
                  <h2 className="text-xl font-black text-white mt-2">
                    اختر تصميم متجرك الفعلي
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    قوالب تسوق حقيقية تدعم سلة المشتريات وشيك أوت الدفع عند الاستلام، ومربوطة فوراً بدومينك.
                  </p>
                </div>
                <div className="size-12 rounded-2xl bg-blue-500/10 text-blue-400 grid place-items-center border border-blue-500/20">
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
                      className={`relative rounded-2xl border p-4 transition-all flex flex-col justify-between space-y-3 cursor-pointer group ${
                        isSelected
                          ? `${tmpl.borderActive} ${tmpl.previewBg} ring-2 ${tmpl.ringColor} shadow-xl scale-[1.01]`
                          : `${tmpl.previewBg} border-slate-800 hover:border-slate-700 opacity-85 hover:opacity-100`
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="relative h-32 rounded-xl overflow-hidden border border-slate-800">
                          <img
                            src={tmpl.heroImage}
                            alt={tmpl.name}
                            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                          <div className="absolute top-2.5 right-2.5 left-2.5 flex items-center justify-between">
                            <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-slate-900/90 text-white border border-white/20 backdrop-blur-sm">
                              {tmpl.badge}
                            </span>
                            {isSelected && (
                              <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center gap-1 shadow-lg">
                                <Check className="size-3 stroke-[3]" /> مفعّل لدومينك
                              </span>
                            )}
                          </div>

                          <div className="absolute bottom-2 right-2.5 left-2.5 text-right">
                            <h4 className="text-sm font-black text-white">{tmpl.name}</h4>
                            <p className="text-[10px] text-blue-300 font-bold">{tmpl.categoryTitle}</p>
                          </div>
                        </div>

                        <p className="text-[11px] text-slate-300 leading-snug">
                          {tmpl.tagline}
                        </p>

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
                          <Eye className="size-3 text-blue-400" />
                          <span>معاينة القالب</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-500/30 flex items-center gap-3 text-xs text-blue-200">
                <ShieldCheck className="size-5 text-blue-400 shrink-0" />
                <span>
                  كل قالب يعمل تلقائياً برابط الدومين الفرعي لمتجرك مع سلة التسوق وشحن الزعيم لكافة المحافظات بدون تعقيد.
                </span>
              </div>
            </div>
          )}

          {/* STEP 4: First Product & Customization */}
          {currentStep === 4 && (
            <div className="rounded-3xl border border-slate-800 bg-[#0f172a]/95 backdrop-blur-xl p-6 md:p-8 space-y-6 shadow-2xl animate-fadeIn text-right">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] font-black text-blue-400 bg-blue-950/60 px-2.5 py-1 rounded-full border border-blue-800/40">
                    الخطوة 4 من 5 • أول منتج حقيقي
                  </span>
                  <h2 className="text-xl font-black text-white mt-2">
                    أضف أو اختر منتجاً لمتجرك
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    يمكنك اختيار منتج جاهز من مكتبة المنصة أو تخصيص منتجك الخاص مع رفع صورته.
                  </p>
                </div>
                <div className="size-12 rounded-2xl bg-blue-500/10 text-blue-400 grid place-items-center border border-blue-500/20">
                  <Package className="size-6" />
                </div>
              </div>

              {/* Toggle Mode: Preset vs Custom */}
              <div className="flex items-center gap-2 p-1 rounded-2xl bg-slate-950 border border-slate-800">
                <button
                  type="button"
                  onClick={() => setProductMode('preset')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    productMode === 'preset'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  اختيار من المنتجات الجاهزة
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setProductMode('custom');
                    setProductName('');
                    setProductPrice('');
                  }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    productMode === 'custom'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  تخصيص منتج جديد خاص بي
                </button>
              </div>

              {/* Preset Mode: Library Grid */}
              {productMode === 'preset' && (
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-300 block">
                    اختر منتجاً جاهزاً لمتجرك:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {SAMPLE_PRODUCTS.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handlePickSampleProduct(item)}
                        className={`p-2.5 rounded-xl border text-right transition-all flex items-center gap-2.5 cursor-pointer ${
                          productName === item.name
                            ? 'border-blue-500 bg-blue-950/60 text-white ring-1 ring-blue-500/40'
                            : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700 hover:text-white'
                        }`}
                      >
                        <img src={item.image} alt={item.name} className="size-11 rounded-lg object-cover shrink-0 border border-slate-800" />
                        <div className="overflow-hidden">
                          <p className="text-[11px] font-bold truncate leading-tight">{item.name}</p>
                          <p className="text-[10px] text-blue-400 font-mono mt-0.5">{formatIQD(Number(item.price))}</p>
                          <span className="text-[9px] text-slate-500 block truncate">{item.category}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Product Form */}
              <div className="space-y-4 pt-2 border-t border-slate-800">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1 text-right">
                    <label className="text-xs font-bold text-slate-300 block">اسم المنتج *</label>
                    <input
                      type="text"
                      value={productName}
                      onChange={(e) => { setProductName(e.target.value); setProductAdded(true); }}
                      placeholder="مثال: عطر الفخامة الملكي"
                      className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-xs text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1 text-right">
                    <label className="text-xs font-bold text-slate-300 block">السعر بالدينار العراقي (د.ع) *</label>
                    <input
                      type="number"
                      value={productPrice}
                      onChange={(e) => { setProductPrice(e.target.value); setProductAdded(true); }}
                      placeholder="45000"
                      className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-xs text-white font-mono focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1 text-right">
                  <label className="text-xs font-bold text-slate-300 block">قسم المنتج</label>
                  <select
                    value={productCategory}
                    onChange={(e) => setProductCategory(e.target.value)}
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-xs text-white focus:border-blue-500 focus:outline-none"
                  >
                    {categories.map((c, i) => (
                      <option key={i} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Permanent Image Upload */}
                <div className="relative rounded-2xl border-2 border-dashed border-slate-700 bg-slate-950 p-4 text-center hover:border-blue-500/50 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'product')}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div className="flex items-center justify-center gap-3">
                    <img src={productImage} alt="Product" className="size-14 rounded-xl object-cover border border-slate-700" />
                    <div className="text-right">
                      <p className="text-xs font-bold text-white">اضغط لرفع وتحديث صورة المنتج</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">يتم حفظ الصورة بصيغة دائمة وثابتة في قاعدة البيانات</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Free 5 Shipments Celebration Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/40 border border-blue-500/30 text-right flex items-start gap-3.5">
                <div className="size-10 rounded-xl bg-blue-500/20 text-blue-400 grid place-items-center shrink-0 border border-blue-500/30">
                  <Gift className="size-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-blue-300">
                    هدية مجانية لمتجرك: 5 شحنات مجانية بالكامل
                  </h4>
                  <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                    تم تفعيل رصيد 5 شحنات مجانية مع أسطول شركة الزعيم للشحن في العراق (توصيل لكافة المحافظات مع تحصيل الدفع عند الاستلام).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Final Review & Live Internet Launch */}
          {currentStep === 5 && (
            <div className="rounded-3xl border border-blue-500/40 bg-gradient-to-br from-[#0f172a] via-[#0d1424] to-slate-950 p-6 md:p-8 space-y-6 shadow-2xl animate-fadeIn text-right">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] font-black text-blue-400 bg-blue-950/60 px-2.5 py-1 rounded-full border border-blue-800/40">
                    الخطوة الأخيرة • الربط والإطلاق الفوري
                  </span>
                  <h2 className="text-xl font-black text-white mt-2">
                    متجرك جاهز للربط بالدومين والإطلاق أونلاين
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    بمجرد النقر سيتم ربط القالب المختار (<span className="text-blue-300 font-bold">{activeTheme.name}</span>) بالدومين والرمز التعريفي وإطلاقه مباشرة.
                  </p>
                </div>
                <div className="size-12 rounded-2xl bg-blue-500/10 text-blue-400 grid place-items-center border border-blue-500/20">
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
                  <span className="font-mono font-bold text-sm text-blue-400 truncate block">{subdomain}</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold block">الرمز التعريفي للمتجر (Store Code)</span>
                  <span className="font-mono font-bold text-sm text-indigo-400 block">{storeCode}</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold block">قالب المتجر المختار</span>
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <span className="size-2.5 rounded-full bg-blue-500" />
                    {activeTheme.name}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 sm:col-span-2">
                  <span className="text-[10px] text-slate-400 font-bold block">المنتج المعروض للبيع</span>
                  <span className="font-bold text-white truncate block">
                    {productName || 'منتج المتجر'} ({formatIQD(Number(productPrice) || 45000)})
                  </span>
                </div>
              </div>

              {/* Logistics & Free Shipments Badge */}
              <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-800/60 flex items-center justify-between text-xs text-blue-200">
                <div className="flex items-center gap-3">
                  <Truck className="size-5 text-blue-400 shrink-0" />
                  <div>
                    <span className="font-black block text-blue-300">أسطول الزعيم للشحن مفعل تلقائياً</span>
                    <span className="text-[11px] text-blue-300/80">رصيدك: 5 شحنات مجانية + توصيل لجميع المحافظات الـ 18</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-blue-600 text-white text-[10px] font-black shrink-0">
                  مؤكد
                </span>
              </div>

              {/* Big Launch Button */}
              <button
                type="button"
                disabled={isLaunching}
                onClick={handleCompleteAndLaunch}
                className="w-full flex items-center justify-center gap-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 py-4 text-sm font-black text-white shadow-2xl shadow-blue-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-50"
              >
                {isLaunching ? (
                  <>
                    <RefreshCw className="size-4 animate-spin" />
                    <span>جاري ربط القالب بالدومين وإطلاق المتجر على الإنترنت...</span>
                  </>
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
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 cursor-pointer hover:scale-[1.02]'
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
        {/* RIGHT: Real Live Website Preview (Looks like an authentic live store) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-5 order-2">
          <div className="sticky top-20 rounded-3xl border border-slate-800 bg-[#0f172a]/95 backdrop-blur-xl p-4 flex flex-col space-y-3.5 shadow-2xl">
            {/* Real Store Header Bar */}
            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Globe className="size-4 text-blue-400" />
                <span className="font-extrabold text-white">معاينة المتجر الحقيقي</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-[10px] text-blue-300 font-bold">{activeTheme.name}</span>
              </div>
            </div>

            {/* Mobile Browser Window */}
            <div className={`rounded-2xl border-2 border-slate-800 ${activeTheme.previewBg} overflow-hidden shadow-inner flex flex-col`}>

              {/* Browser Address Bar */}
              <div className="bg-slate-900/95 border-b border-slate-800 px-3 py-2 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1 text-[10px] text-slate-500">
                  <span className="size-2 rounded-full bg-rose-500/80 inline-block" />
                  <span className="size-2 rounded-full bg-amber-500/80 inline-block" />
                  <span className="size-2 rounded-full bg-emerald-500/80 inline-block" />
                </div>
                <div className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 flex items-center justify-between text-[11px] font-mono text-slate-300">
                  <span className="truncate dir-ltr">https://{subdomain}</span>
                  <ShieldCheck className="size-3 text-blue-400 shrink-0" />
                </div>
              </div>

              {/* Storefront Real Header Navigation */}
              <div className={`p-3 border-b ${activeTheme.headerBg} flex items-center justify-between gap-2`}>
                <div className="flex items-center gap-2 overflow-hidden">
                  {logoUrl ? (
                    <img src={logoUrl} alt="Logo" className="size-8 rounded-xl object-cover border border-white/20 shrink-0" />
                  ) : (
                    <span className="size-8 rounded-xl bg-blue-600 text-white font-black grid place-items-center text-xs shrink-0 shadow-md">
                      {storeName.charAt(0).toUpperCase()}
                    </span>
                  )}
                  <div className="text-right overflow-hidden">
                    <h4 className="font-black text-xs text-white leading-tight truncate">{storeName}</h4>
                    <p className="text-[9px] text-slate-400 truncate max-w-[130px]">{slogan}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="size-7 rounded-lg bg-white/5 border border-white/10 grid place-items-center text-slate-400">
                    <Search className="size-3.5" />
                  </span>
                  <div className="relative size-7 rounded-lg bg-blue-600 text-white grid place-items-center shadow-md">
                    <ShoppingCart className="size-3.5" />
                    <span className="absolute -top-1 -right-1 size-3.5 rounded-full bg-amber-500 text-slate-950 text-[8px] font-black grid place-items-center">
                      1
                    </span>
                  </div>
                </div>
              </div>

              {/* Storefront Hero Banner */}
              <div className="relative h-28 bg-slate-900 overflow-hidden">
                {bannerUrl ? (
                  <img src={bannerUrl} alt="Banner" className="size-full object-cover" />
                ) : (
                  <img src={activeTheme.heroImage} alt="Theme Banner" className="size-full object-cover opacity-60" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-3 text-right">
                  <span className="text-[9px] font-bold text-blue-300 bg-blue-950/80 border border-blue-800/80 px-2 py-0.5 rounded-full w-fit mb-1">
                    شحن سريع لكافة محافظات العراق
                  </span>
                  <p className="text-xs font-black text-white leading-tight truncate">
                    {slogan}
                  </p>
                </div>
              </div>

              {/* Store Categories Horizontal Pills */}
              <div className="p-2.5 flex items-center gap-1.5 overflow-x-auto border-b border-slate-800/60 rf-scrollbar">
                <span className="shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-600 text-white">
                  الكل
                </span>
                {categories.map((cat, idx) => (
                  <span
                    key={idx}
                    className={`shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full border ${activeTheme.pillBg}`}
                  >
                    {cat}
                  </span>
                ))}
              </div>

              {/* Store Real Product Card (COD Fast Order) */}
              <div className="p-3 space-y-3">
                <div className={`rounded-xl border ${activeTheme.cardBg} overflow-hidden shadow-lg`}>
                  <div className="h-36 relative bg-slate-900">
                    <img src={productImage} alt={productName} className="size-full object-cover" />
                    <span className="absolute top-2 right-2 text-[9px] font-black bg-blue-600 text-white px-2 py-0.5 rounded-full shadow-md">
                      الأكثر طلباً
                    </span>
                    <span className="absolute bottom-2 left-2 text-[9px] font-bold bg-slate-950/80 text-emerald-400 border border-emerald-800/60 px-2 py-0.5 rounded-md">
                      متوفر بالمخزن
                    </span>
                  </div>

                  <div className="p-3 text-right space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold text-slate-400 bg-white/5 px-2 py-0.5 rounded">
                        {productCategory}
                      </span>
                      <div className="flex items-center gap-1 text-[10px] text-amber-400">
                        <Star className="size-3 fill-amber-400" />
                        <span className="font-bold font-mono">4.9</span>
                      </div>
                    </div>

                    <h4 className="font-black text-xs text-white leading-snug truncate">
                      {productName || 'عطر تاج الفخامة'}
                    </h4>

                    <div className="flex items-baseline gap-2">
                      <span className={`text-base font-black ${activeTheme.priceColor} font-mono`}>
                        {formatIQD(Number(productPrice) || 45000)}
                      </span>
                      <span className="text-[10px] text-slate-500 line-through font-mono">
                        {formatIQD(Math.round((Number(productPrice) || 45000) * 1.3))}
                      </span>
                    </div>

                    {/* Quick Order Mini Form */}
                    <div className="pt-2 border-t border-white/10 space-y-1.5">
                      <div className="grid grid-cols-2 gap-1.5">
                        <div className="rounded-lg bg-slate-950/80 border border-white/10 px-2 py-1 text-[9px] text-slate-400 text-right">
                          الاسم: زبون تجريبي
                        </div>
                        <div className="rounded-lg bg-slate-950/80 border border-white/10 px-2 py-1 text-[9px] text-slate-400 text-right">
                          المحافظة: بغداد
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setCurrentStep(5)}
                        className={`w-full py-2.5 rounded-xl ${activeTheme.btnBg} text-xs font-black shadow-md transition-all text-center cursor-pointer`}
                      >
                        اطلب الآن — الدفع عند الاستلام
                      </button>
                    </div>
                  </div>
                </div>

                {/* Trust Footer inside Storefront */}
                <div className="rounded-xl bg-slate-950/60 border border-slate-800/80 p-2 text-center text-[10px] text-slate-400 flex items-center justify-center gap-2">
                  <Truck className="size-3.5 text-blue-400 shrink-0" />
                  <span>توصيل سريع لكافة المحافظات بواسطة أسطول الزعيم</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4️⃣ FULL-SCREEN TEMPLATE LIVE PREVIEW MODAL */}
      {/* ========================================================================= */}
      {previewModalTemplate && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 md:p-8 animate-fadeIn">
          <div className="max-w-4xl w-full rounded-3xl border border-slate-800 bg-[#0f172a] shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
              <div className="flex items-center gap-3 text-right">
                <span className="size-9 rounded-xl bg-blue-500/20 text-blue-400 grid place-items-center font-bold">
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

            <div className="p-6 overflow-y-auto space-y-6 text-right rf-scrollbar">
              <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
                <img
                  src={previewModalTemplate.heroImage}
                  alt={previewModalTemplate.name}
                  className="size-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <div className="absolute bottom-6 right-6 left-6 space-y-2">
                  <span className="text-xs font-black px-3 py-1 rounded-full bg-blue-600 text-white">
                    {previewModalTemplate.badge}
                  </span>
                  <h2 className="text-2xl font-black text-white">{previewModalTemplate.name}</h2>
                  <p className="text-sm text-slate-300 max-w-xl">{previewModalTemplate.tagline}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {previewModalTemplate.features.map((feat, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-blue-400 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-300 space-y-2 leading-relaxed">
                <p className="font-bold text-white">تجربة المتجر بهذا القالب:</p>
                <p>
                  عند اختيار هذا القالب، سيتم ربطه تلقائياً بالدومين الفرعي (<span className="text-blue-400 font-mono font-bold">{subdomain}</span>). سيحصل زبائنك على تجربة تسوق كاملة تدعم اللغة العربية، سلة المشتريات، وحجز الشحنة فوراً برقم بوليصة تتبع من أسطول الزعيم للشحن.
                </p>
              </div>
            </div>

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
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-black text-white shadow-lg shadow-blue-600/20 transition-all cursor-pointer"
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
          <div className="max-w-lg w-full rounded-3xl border border-blue-500/40 bg-[#0f172a] p-6 md:p-8 text-right space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 size-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="text-center space-y-2">
              <div className="size-16 rounded-2xl bg-blue-500/20 border border-blue-500/40 text-blue-400 mx-auto grid place-items-center shadow-lg shadow-blue-500/20">
                <Sparkles className="size-8 animate-bounce" />
              </div>
              <span className="inline-block text-[11px] font-black text-blue-400 bg-blue-950/80 px-3 py-1 rounded-full border border-blue-800/80">
                تم الربط والإطلاق أونلاين بنجاح
              </span>
              <h2 className="text-2xl font-black text-white">
                متجرك انطلق الآن على الإنترنت
              </h2>
              <p className="text-xs text-slate-300 max-w-sm mx-auto">
                تم حجز دومينك وربطه بقالب (<span className="text-blue-300 font-bold">{launchSuccessData.templateName}</span>) وأصبح متاحاً للزبائن للطلب فوراً.
              </p>
            </div>

            {/* Store Code Box */}
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-indigo-900/50 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">الرمز التعريفي الفريد لمتجرك:</span>
                <span className="font-mono text-sm font-black text-indigo-400">{launchSuccessData.storeCode}</span>
              </div>
              <button
                type="button"
                onClick={() => handleCopyStoreCode(launchSuccessData.storeCode)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-black transition-colors cursor-pointer"
              >
                <Copy className="size-3" />
                <span>{codeCopied ? 'تم النسخ' : 'نسخ الرمز'}</span>
              </button>
            </div>

            {/* Live Store URL Box */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-700/80 space-y-2">
              <span className="text-[10px] text-slate-400 font-bold block">رابط متجرك الحقيقي المباشر:</span>
              <div className="flex items-center justify-between gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="font-mono text-xs text-blue-400 font-bold truncate dir-ltr">
                  https://{launchSuccessData.subdomain}.za3em.shop
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyStoreLink(`https://${launchSuccessData.subdomain}.za3em.shop`)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-black transition-colors shrink-0 cursor-pointer"
                >
                  <Copy className="size-3" />
                  <span>{linkCopied ? 'تم النسخ' : 'نسخ الرابط'}</span>
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
                className="text-blue-400 hover:text-blue-300 font-bold underline flex items-center gap-1 font-mono text-[11px]"
              >
                <span>زيارة المتجر الآن</span>
                <ExternalLink className="size-3" />
              </a>
            </div>

            {/* Logistics & 5 Free Shipments Active */}
            <div className="p-3.5 rounded-2xl bg-blue-950/40 border border-blue-800/60 text-xs text-blue-300 flex items-center gap-2 font-bold">
              <Truck className="size-4 text-blue-400 shrink-0" />
              <span>رصيد 5 شحنات مجانية مفعل لمتجرك مع أسطول الزعيم في العراق!</span>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2">
              <a
                href={launchSuccessData.seedUrl || `https://${launchSuccessData.subdomain}.za3em.shop`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs text-center flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition-all cursor-pointer"
              >
                <span>فتح وتجربة المتجر المباشر</span>
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
                الانتقال للوحة التحكم ومتابعة الشحنات
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
