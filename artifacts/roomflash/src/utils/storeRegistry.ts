/**
 * Central Store Registry & Cross-Subdomain Synchronization Manager
 * 
 * Enables stores created in Onboarding to be immediately available on:
 * - Direct subdomains: https://[subdomain].za3em.shop
 * - In-app store views: /#/store/[subdomain]
 * - Cross-subdomain sharing via .za3em.shop root domain cookies and URL seeds.
 */

export interface RegisteredStoreData {
  subdomain: string;
  storeName: string;
  slogan?: string;
  templateId: string;
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
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  const isZa3em = window.location.hostname.endsWith("za3em.shop");
  const domainPart = isZa3em ? "; domain=.za3em.shop" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/${domainPart}; SameSite=Lax`;
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
 * Save a store to both localStorage and the shared root-domain cookie
 */
export function registerStore(data: RegisteredStoreData): void {
  const cleanSub = data.subdomain.replace(".za3em.shop", "").toLowerCase().trim();
  const normalizedData: RegisteredStoreData = {
    ...data,
    subdomain: cleanSub,
    storeName: data.storeName || `متجر ${cleanSub}`,
    templateId: data.templateId || "shoppingcart.1.2.7",
  };

  if (typeof window === "undefined") return;

  try {
    // 1. Save in local registry map in localStorage
    const localMapRaw = localStorage.getItem("zaeem_stores_registry");
    const localMap: Record<string, RegisteredStoreData> = localMapRaw ? JSON.parse(localMapRaw) : {};
    localMap[cleanSub] = normalizedData;
    localStorage.setItem("zaeem_stores_registry", JSON.stringify(localMap));

    // Also update legacy single keys for fast fallback
    localStorage.setItem("zaeem_onboarded_store", JSON.stringify(normalizedData));
    localStorage.setItem("zaeem_store_data", JSON.stringify({
      storeName: normalizedData.storeName,
      subdomain: `${cleanSub}.za3em.shop`,
      selectedTheme: normalizedData.templateId,
      plan: "free",
      orderLimit: 5,
    }));
  } catch (err) {
    console.warn("Error saving store to localStorage:", err);
  }

  try {
    // 2. Save in shared cookie on .za3em.shop so all subdomains immediately receive it!
    const cookieMapRaw = getCookie("zaeem_stores_registry");
    const cookieMap: Record<string, RegisteredStoreData> = cookieMapRaw ? JSON.parse(cookieMapRaw) : {};
    cookieMap[cleanSub] = normalizedData;
    setCrossSubdomainCookie("zaeem_stores_registry", JSON.stringify(cookieMap));
  } catch (err) {
    console.warn("Error saving store to cookie:", err);
  }
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
