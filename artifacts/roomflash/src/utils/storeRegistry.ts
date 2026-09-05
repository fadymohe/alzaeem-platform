/**
 * Central Store Registry & Cross-Subdomain Synchronization Manager
 * 
 * Enables stores created in Onboarding to be immediately available on:
 * - Direct subdomains: https://[subdomain].za3em.shop
 * - In-app store views: /#/store/[subdomain]
 * - Cross-subdomain sharing via .za3em.shop root domain cookies and URL seeds.
 */
import { checkCloudSubdomain, saveCloudStore, fetchCloudStore } from './cloudDb';

export interface RegisteredStoreData {
  subdomain: string;
  storeName: string;
  slogan?: string;
  templateId: string;
  storeCode?: string;
  logoUrl?: string;
  bannerUrl?: string;
  categories?: string[];
  product?: {
    id?: number;
    name?: string;
    title?: string;
    price: number;
    compareAtPrice?: number;
    image?: string;
    imageUrl?: string;
    description?: string;
    category?: string;
  };
  freeShipmentsRemaining?: number;
  createdAt?: string;
}

// Built-in pre-registered stores & active demo stores
export const BUILTIN_REGISTERED_STORES: Record<string, RegisteredStoreData> = {
  "fadymoheb945za3emshop": {
    subdomain: "fadymoheb945za3emshop",
    storeName: "متجر فادي مهيب",
    slogan: "أفضل المنتجات المختارة بعناية والتوصيل السريع لباب بيتك",
    templateId: "shoppingcart.1.2.7",
    categories: ["عطور رجالي", "عطور نسائي", "بخور ومباخر ملكية"],
    product: {
      id: 1,
      name: "عطر تاج الفخامة الفرنسي الملكي",
      title: "عطر تاج الفخامة الفرنسي الملكي",
      price: 45000,
      compareAtPrice: 58000,
      image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&auto=format&fit=crop&q=80",
      imageUrl: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&auto=format&fit=crop&q=80",
      description: "عطر فاخر بثباتية تدوم 48 ساعة مع تركيبة فرنسية ملكية نادرة وتوصيل سريع لباب بيتك.",
      category: "عطور رجالي",
    },
    freeShipmentsRemaining: 5,
  },
  "fakhama": {
    subdomain: "fakhama",
    storeName: "متجر الفخامة العراقي",
    slogan: "وجهتك الأولى للتسوق الراقي والشحن السريع لجميع محافظات العراق",
    templateId: "shoppingcart.1.2.7",
    categories: ["عطور فرنسية", "دهن عود وبخور", "عناية بالبشرة"],
    product: {
      id: 1,
      name: "عطر تاج الفخامة الفرنسي الملكي",
      title: "عطر تاج الفخامة الفرنسي الملكي",
      price: 45000,
      compareAtPrice: 58000,
      image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&auto=format&fit=crop&q=80",
      imageUrl: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&auto=format&fit=crop&q=80",
      description: "أفضل العطور الفاخرة المختارة بعناية مع الشحن المجاني والدفع عند الاستلام.",
      category: "عطور فرنسية",
    },
    freeShipmentsRemaining: 5,
  },
  "alzaeem": {
    subdomain: "alzaeem",
    storeName: "متجر الزعيم الذهبي",
    slogan: "أفضل الإلكترونيات والأجهزة الذكية بضمان حقيقي والدفع عند الاستلام",
    templateId: "volt",
    categories: ["سماعات بلوتوث", "ساعات ذكية", "شواحن وإكسسوارات"],
    product: {
      id: 1,
      name: "سماعة بلوتوث لاسلكية Ultra Bass عازلة للضوضاء",
      title: "سماعة بلوتوث لاسلكية Ultra Bass عازلة للضوضاء",
      price: 45000,
      compareAtPrice: 60000,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
      imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
      description: "صوت محيطي نقي وعزل تام للضوضاء مع بطارية تدوم 48 ساعة وضمان استبدال.",
      category: "سماعات بلوتوث",
    },
    freeShipmentsRemaining: 5,
  },
  "zero": {
    subdomain: "zero",
    storeName: "متجر زيرو إكسبريس",
    slogan: "متجر تجريبي لاختبار طلبات الشحن السريع",
    templateId: "easyorders-flash",
    product: {
      id: 1,
      name: "سماعة بلوتوث لاسلكية Ultra Bass عازلة للضوضاء - إصدار 2026",
      title: "سماعة بلوتوث لاسلكية Ultra Bass عازلة للضوضاء - إصدار 2026",
      price: 35000,
      compareAtPrice: 50000,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
      imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
      description: "سماعة رأس احترافية مع صوت محيطي 3D نقي وعزل تام للضوضاء.",
    },
    freeShipmentsRemaining: 5,
  },
  "demo": {
    subdomain: "demo",
    storeName: "متجر العرض التجريبي",
    slogan: "معاينة حية لجميع قوالب المتاجر على منصة الزعيم",
    templateId: "shoppingcart.1.2.7",
    freeShipmentsRemaining: 5,
  }
};

/**
 * Cookie Helper to read cookies by key
 */
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

/**
 * Cookie Helper to write cookies across all subdomains on za3em.shop
 */
function setCrossSubdomainCookie(name: string, value: string, days = 365): void {
  if (typeof document === "undefined") return;
  try {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    const isZa3em = typeof window !== "undefined" && window.location.hostname.endsWith("za3em.shop");
    const isHttps = typeof window !== "undefined" && (window.location.protocol === "https:" || isZa3em);
    const domainPart = isZa3em ? "; domain=.za3em.shop" : "";
    const securePart = isHttps ? "; Secure" : "";
    
    // Ensure cookie does not exceed 3KB limit
    if (encodeURIComponent(value).length > 3000) {
      console.warn("[Cookie] Value too large, skipping cross-subdomain cookie");
      return;
    }
    
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/${domainPart}; SameSite=Lax${securePart}`;
  } catch (e) {
    console.warn("[Cookie] Failed to set cookie:", e);
  }
}

/**
 * Encode a store object into a URL-safe compact string
 */
export function encodeStoreSeed(data: RegisteredStoreData): string {
  try {
    return btoa(unescape(encodeURIComponent(JSON.stringify(data))));
  } catch {
    return "";
  }
}

/**
 * Decode a store object from URL seed
 */
export function decodeStoreSeed(seedStr: string): RegisteredStoreData | null {
  try {
    return JSON.parse(decodeURIComponent(escape(atob(seedStr))));
  } catch {
    return null;
  }
}

/**
 * Save a store to localStorage, shared cookie, and Central Neon Cloud Database
 */
export function registerStore(data: RegisteredStoreData): RegisteredStoreData {
  const cleanSub = data.subdomain.replace(".za3em.shop", "").toLowerCase().trim();
  const generatedCode = data.storeCode || `ZAEEM-${Math.floor(100000 + Math.random() * 900000)}`;
  const normalizedData: RegisteredStoreData = {
    ...data,
    subdomain: cleanSub,
    storeName: data.storeName || `متجر ${cleanSub}`,
    templateId: data.templateId || "shoppingcart.1.2.7",
    storeCode: generatedCode,
    logoUrl: data.logoUrl,
    bannerUrl: data.bannerUrl,
    createdAt: data.createdAt || new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    try {
      // 1. Save in local registry map in localStorage
      const localMapRaw = localStorage.getItem("zaeem_stores_registry");
      const localMap: Record<string, RegisteredStoreData> = localMapRaw ? JSON.parse(localMapRaw) : {};
      localMap[cleanSub] = normalizedData;
      localStorage.setItem("zaeem_stores_registry", JSON.stringify(localMap));

      // 2. Save in array of registered subdomains
      const arrRaw = localStorage.getItem("zaeem_registered_stores");
      const arr: string[] = arrRaw ? JSON.parse(arrRaw) : [];
      if (!arr.includes(cleanSub)) {
        arr.push(cleanSub);
        localStorage.setItem("zaeem_registered_stores", JSON.stringify(arr));
      }

      // 3. Update legacy single keys for fast fallback and onboarding persistence
      localStorage.setItem("zaeem_onboarded_store", JSON.stringify(normalizedData));
      localStorage.setItem("zaeem_onboarding_completed", "true");
      localStorage.setItem("zaeem_auth_action", "signin");
      localStorage.setItem("zaeem_store_data", JSON.stringify({
        storeName: normalizedData.storeName,
        subdomain: `${cleanSub}.za3em.shop`,
        selectedTheme: normalizedData.templateId,
        templateId: normalizedData.templateId,
        storeCode: generatedCode,
        logoUrl: normalizedData.logoUrl,
        bannerUrl: normalizedData.bannerUrl,
        plan: "free",
        orderLimit: 5,
        categories: normalizedData.categories || ["عام"],
        product: normalizedData.product
      }));
    } catch (err) {
      console.warn("Error saving store to localStorage:", err);
    }

    try {
      // 4. Save compact version in shared cookie on .za3em.shop so all subdomains immediately receive it!
      const compactStore = {
        subdomain: cleanSub,
        storeName: normalizedData.storeName,
        templateId: normalizedData.templateId,
        storeCode: generatedCode,
        logoUrl: normalizedData.logoUrl,
      };
      const cookieMapRaw = getCookie("zaeem_stores_registry");
      const cookieMap: Record<string, any> = cookieMapRaw ? JSON.parse(cookieMapRaw) : {};
      cookieMap[cleanSub] = compactStore;
      setCrossSubdomainCookie("zaeem_stores_registry", JSON.stringify(cookieMap));
    } catch (err) {
      console.warn("Error saving store to cookie:", err);
    }

    // 5. Asynchronously persist to central Neon PostgreSQL Cloud Database
    saveCloudStore({
      storeName: normalizedData.storeName,
      subdomain: cleanSub,
      templateId: normalizedData.templateId,
      storeCode: generatedCode,
      slogan: normalizedData.slogan,
      logoUrl: normalizedData.logoUrl,
      bannerUrl: normalizedData.bannerUrl,
      categories: normalizedData.categories,
      product: normalizedData.product
    }).catch(err => console.warn("[storeRegistry] Cloud DB save fallback:", err));

    // 6. Asynchronously persist to server API for persistent reservation in server_data/stores.json
    try {
      fetch("/api/tenant/stores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeCode: generatedCode,
          name: normalizedData.storeName,
          subdomain: cleanSub,
          templateId: normalizedData.templateId,
          productTitle: normalizedData.product?.name || normalizedData.product?.title,
          productPrice: normalizedData.product?.price,
          productImage: normalizedData.product?.image || normalizedData.product?.imageUrl,
          logoUrl: normalizedData.logoUrl,
          bannerUrl: normalizedData.bannerUrl,
        })
      }).catch((e) => console.warn("Background server store register fallback:", e));
    } catch {}
  }

  return normalizedData;
}

/**
 * Retrieve a registered store by subdomain from all available sources
 */
export function getRegisteredStore(subdomain: string): RegisteredStoreData | null {
  const cleanSub = (subdomain || "").replace(".za3em.shop", "").toLowerCase().trim();
  if (!cleanSub) return null;

  if (typeof window !== "undefined") {
    // 1. Check URL hash or search params for instant seed transfer
    const hash = window.location.hash || "";
    const search = window.location.search || "";
    
    let seedParam = "";
    if (hash.includes("init=")) {
      seedParam = hash.split("init=")[1]?.split("&")[0];
    } else if (search.includes("init=")) {
      seedParam = new URLSearchParams(search).get("init") || "";
    }

    if (seedParam) {
      const decoded = decodeStoreSeed(seedParam);
      if (decoded && decoded.subdomain.replace(".za3em.shop", "").toLowerCase() === cleanSub) {
        // Register it locally and clean up the URL
        registerStore(decoded);
        try {
          const cleanUrl = window.location.pathname + (window.location.hash.split("#")[0] || "");
          window.history.replaceState(null, "", cleanUrl || window.location.pathname);
        } catch {}
        return decoded;
      }
    }

    // 2. Check shared root-domain cookie (.za3em.shop)
    try {
      const cookieMapRaw = getCookie("zaeem_stores_registry");
      if (cookieMapRaw) {
        const cookieMap: Record<string, RegisteredStoreData> = JSON.parse(cookieMapRaw);
        if (cookieMap[cleanSub]) {
          return cookieMap[cleanSub];
        }
      }
    } catch {}

    // 3. Check localStorage registry map
    try {
      const localMapRaw = localStorage.getItem("zaeem_stores_registry");
      if (localMapRaw) {
        const localMap: Record<string, RegisteredStoreData> = JSON.parse(localMapRaw);
        if (localMap[cleanSub]) {
          return localMap[cleanSub];
        }
      }
    } catch {}

    // 4. Check single onboarded store in localStorage
    try {
      const onboardedRaw = localStorage.getItem("zaeem_onboarded_store");
      if (onboardedRaw) {
        const onboarded = JSON.parse(onboardedRaw);
        const onbSub = (onboarded.subdomain || "").replace(".za3em.shop", "").toLowerCase().trim();
        if (onbSub === cleanSub) {
          return {
            subdomain: cleanSub,
            storeName: onboarded.storeName || `متجر ${cleanSub}`,
            slogan: onboarded.slogan,
            templateId: onboarded.selectedTheme || onboarded.templateId || "shoppingcart.1.2.7",
            categories: onboarded.categories,
            product: onboarded.product,
            freeShipmentsRemaining: onboarded.freeShipmentsRemaining || 5,
          };
        }
      }
    } catch {}

    // 4b. Check registered subdomains array in localStorage
    try {
      const regArrRaw = localStorage.getItem("zaeem_registered_stores");
      if (regArrRaw) {
        const regArr: string[] = JSON.parse(regArrRaw);
        if (regArr.includes(cleanSub)) {
          return {
            subdomain: cleanSub,
            storeName: `متجر ${cleanSub}`,
            templateId: "shoppingcart.1.2.7",
            freeShipmentsRemaining: 5,
          };
        }
      }
    } catch {}
  }

  // 5. Check built-in registered catalog
  if (BUILTIN_REGISTERED_STORES[cleanSub]) {
    return BUILTIN_REGISTERED_STORES[cleanSub];
  }

  return null;
}

/**
 * Check if a subdomain is registered and active
 */
export function isSubdomainRegistered(subdomain: string): boolean {
  return getRegisteredStore(subdomain) !== null;
}

export const RESERVED_SUBDOMAINS_LIST = [
  'admin', 'api', 'app', 'zaeem', 'za3em', 'dashboard', 'root', 'www',
  'mail', 'support', 'billing', 'auth', 'account', 'portal', 'cpanel',
  'system', 'null', 'undefined', 'test', 'stores', 'store', 'static', 'assets', 'webmail', 'demo'
];

/**
 * Robust real-time subdomain check combining local registry, cookies, reserved list, and API
 */
export async function checkSubdomainAvailability(rawSubdomain: string): Promise<{
  available: boolean;
  reason?: 'short' | 'invalid' | 'reserved' | 'taken';
  message: string;
  suggestions?: string[];
}> {
  const clean = (rawSubdomain || '').replace('.za3em.shop', '').toLowerCase().trim();

  if (!clean) {
    return {
      available: false,
      reason: 'short',
      message: 'يرجى كتابة اسم الدومين الفرعي لمتجرك',
    };
  }

  if (clean.length < 3) {
    return {
      available: false,
      reason: 'short',
      message: 'يجب أن يتكون الدومين من 3 أحرف إنجليزية أو أرقام على الأقل',
    };
  }

  if (!/^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(clean)) {
    return {
      available: false,
      reason: 'invalid',
      message: 'الدومين يجب أن يبدأ وينتهي بحرف أو رقم، ويحتوي على أحرف إنجليزية وأرقام وشرطة (-) فقط',
    };
  }

  if (RESERVED_SUBDOMAINS_LIST.includes(clean)) {
    return {
      available: false,
      reason: 'reserved',
      message: 'هذا النطاق محجوز لاستخدام إدارة منصة الزعيم وغير متاح للمتاجر',
      suggestions: [`${clean}-store`, `${clean}-shop`, `${clean}-iq`],
    };
  }

  // Check known registry & cookies & built-ins
  if (isSubdomainRegistered(clean)) {
    return {
      available: false,
      reason: 'taken',
      message: `هذا النطاق (${clean}.za3em.shop) محجوز مسبقاً من متجر آخر`,
      suggestions: [`${clean}-store`, `${clean}-shop`, `${clean}-iq`, `${clean}2026`],
    };
  }

  // Check local storage registered stores
  try {
    const localTaken: string[] = JSON.parse(localStorage.getItem('zaeem_registered_stores') || '[]');
    if (localTaken.includes(clean)) {
      return {
        available: false,
        reason: 'taken',
        message: `هذا النطاق (${clean}.za3em.shop) محجوز مسبقاً في قائمة المتاجر المسجلة`,
        suggestions: [`${clean}-store`, `${clean}-shop`, `${clean}-iq`, `${clean}2026`],
      };
    }
  } catch {}

  // Check backend API (which checks local stores.json + Supabase)
  try {
    const res = await fetch(`/api/stores/check-subdomain?subdomain=${clean}`);
    if (res.ok) {
      const text = await res.text();
      try {
        const data = JSON.parse(text);
        if (data && data.available === false) {
          return {
            available: false,
            reason: data.reason || 'taken',
            message: data.message || `هذا النطاق (${clean}.za3em.shop) محجوز مسبقاً من متجر آخر`,
            suggestions: data.suggestions || [`${clean}-store`, `${clean}-shop`, `${clean}-iq`],
          };
        }
      } catch {
        // Non-JSON response
      }
    }
  } catch (err) {
    console.warn('API subdomain check fallback:', err);
  }

  // Directly check Supabase cloud database as an independent guarantee
  try {
    const sbRes = await fetch(`https://cfpmbasxvjlcfcteyyaa.supabase.co/rest/v1/za3em_stores?subdomain=eq.${clean}`, {
      headers: {
        'apikey': 'sb_publishable_sCozsAhhHZ9v9nWEkiNVlQ_Ne5IoXq2'
      }
    });
    if (sbRes.ok) {
      const dbStores = await sbRes.json();
      if (Array.isArray(dbStores) && dbStores.length > 0) {
        return {
          available: false,
          reason: 'taken',
          message: `هذا النطاق (${clean}.za3em.shop) محجوز مسبقاً في قاعدة بيانات منصة الزعيم`,
          suggestions: [`${clean}-store`, `${clean}-shop`, `${clean}-iq`, `${clean}2026`],
        };
      }
    }
  } catch (sbErr) {
    console.warn('Direct Supabase check error:', sbErr);
  }

  // Directly check Central Neon Cloud PostgreSQL Database (works 100% on live web & subdomains)
  try {
    const cloudCheck = await checkCloudSubdomain(clean);
    if (cloudCheck && !cloudCheck.available) {
      return {
        available: false,
        reason: 'taken',
        message: cloudCheck.message || `هذا النطاق (${clean}.za3em.shop) محجوز مسبقاً في قاعدة بيانات منصة الزعيم`,
        suggestions: [`${clean}-store`, `${clean}-shop`, `${clean}-iq`, `${clean}2026`],
      };
    }
  } catch (cloudErr) {
    console.warn('Direct Neon cloud check error:', cloudErr);
  }

  return {
    available: true,
    message: `هذا النطاق (${clean}.za3em.shop) متاح ويمكنك حجزه لمتجرك فوراً`,
  };
}
