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
  userEmail?: string;
  ownerId?: string;
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
      userEmail: normalizedData.userEmail,
      ownerId: normalizedData.ownerId,
      slogan: normalizedData.slogan,
      logoUrl: normalizedData.logoUrl,
      bannerUrl: normalizedData.bannerUrl,
      categories: normalizedData.categories,
      product: normalizedData.product
    }).catch(err => console.warn("[storeRegistry] Cloud DB save fallback:", err));

    // 6. Asynchronously persist to server API for persistent reservation in za3em_stores
    try {
      fetch("/api/tenant/stores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeCode: generatedCode,
          name: normalizedData.storeName,
          subdomain: cleanSub,
          templateId: normalizedData.templateId,
          userEmail: normalizedData.userEmail,
          ownerId: normalizedData.ownerId,
          slogan: normalizedData.slogan,
          productTitle: normalizedData.product?.name || normalizedData.product?.title,
          productPrice: normalizedData.product?.price,
          productImage: normalizedData.product?.image || normalizedData.product?.imageUrl,
          productCompareAtPrice: normalizedData.product?.compareAtPrice,
          productCategory: normalizedData.product?.category,
          productDescription: normalizedData.product?.description,
          logoUrl: normalizedData.logoUrl,
          bannerUrl: normalizedData.bannerUrl,
          categories: normalizedData.categories,
          product: normalizedData.product,
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
 * Robust real-time subdomain check against reserved list and central Neon PostgreSQL Database
 */
export async function checkSubdomainAvailability(rawSubdomain: string, currentUserEmail?: string): Promise<{
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

  // Get current user's email and ID if not explicitly provided
  let userEmail = currentUserEmail;
  let ownerId = '';
  if (typeof window !== 'undefined') {
    try {
      const u = localStorage.getItem('zaeem_user');
      if (u) {
        const parsed = JSON.parse(u);
        if (!userEmail) userEmail = parsed?.email || '';
        ownerId = parsed?.id || '';
      }
    } catch {}
  }

  // Directly check Central Neon Cloud PostgreSQL Database (universal truth over HTTPS)
  try {
    const cloudCheck = await checkCloudSubdomain(clean, userEmail, ownerId);
    if (cloudCheck && !cloudCheck.available) {
      return {
        available: false,
        reason: 'taken',
        message: cloudCheck.message || `هذا النطاق (${clean}.za3em.shop) محجوز مسبقاً لمتجر آخر`,
        suggestions: [`${clean}-store`, `${clean}-shop`, `${clean}-iq`, `${clean}2026`],
      };
    }
    if (cloudCheck && cloudCheck.available && cloudCheck.message) {
      return {
        available: true,
        message: cloudCheck.message,
      };
    }
  } catch (cloudErr) {
    console.warn('Direct Neon cloud check error:', cloudErr);
  }

  return {
    available: true,
    message: `هذا النطاق (${clean}.za3em.shop) متاح ويمكنك حجزه لمتجرك فوراً ✅`,
  };
}
