import React, { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { DynamicTemplateRenderer } from "../components/landing-templates/DynamicTemplateRenderer";
import {
  TemplateProduct,
  TemplateStore,
} from "../components/landing-templates/EasyOrdersFlashTemplate";
import {
  getRegisteredStore,
  RegisteredStoreData,
  updateStoreActiveStatus,
  getCookie,
} from "../utils/storeRegistry";
import { fetchCloudStore } from "../utils/cloudDb";
import { addStoredOrder } from "../data/storeState";
import { Globe, Sparkles, CheckCircle2, AlertTriangle, ArrowRight, ExternalLink, PauseCircle, Power } from "lucide-react";

export function DynamicStoreLanding() {
  const [matchView, paramsView] = useRoute("/view-store/:subdomain");
  const [matchStore, paramsStore] = useRoute("/store/:subdomain");
  const [matchLanding, paramsLanding] = useRoute("/landing/:subdomain");

  // 1. استخراج النطاق الفرعي من Hostname أو Route Params
  const hostMatch = window.location.hostname.match(/^([a-zA-Z0-9-]+)\.za3em\.shop$/i);
  const hostSub = hostMatch?.[1]?.toLowerCase();

  // فحص معلمات الاستعلام أيضاً (?subdomain=zero)
  const hash = window.location.hash || "";
  const searchParams = new URLSearchParams(
    hash.includes("?") ? hash.split("?")[1] : window.location.search
  );
  const querySub = searchParams.get("subdomain");

  // استخراج النطاق الفرعي من الهاش مباشرة كضمان إضافي مع Wouter HashLocation
  let hashSub = "";
  if (hash.includes('/store/') || hash.includes('/view-store/') || hash.includes('/landing/')) {
    const parts = hash.split('?')[0].split('/');
    const lastPart = parts[parts.length - 1];
    if (lastPart && lastPart !== 'store' && lastPart !== 'landing' && lastPart !== 'view-store') {
      hashSub = lastPart;
    }
  }

  const rawSub =
    (hostSub && hostSub !== "www" && hostSub !== "za3em")
      ? hostSub
      : paramsView?.subdomain ||
        paramsStore?.subdomain ||
        paramsLanding?.subdomain ||
        hashSub ||
        querySub ||
        "zero";

  const cleanSubdomain = (rawSub || "zero").toLowerCase().replace(/[^a-z0-9-]/g, "");

  // 2. التحقق من السجل المركزي للمتاجر المسجلة فورياً
  const initialRegisteredData = getRegisteredStore(cleanSubdomain);
  const isInitiallyKnown =
    cleanSubdomain === "zero" ||
    cleanSubdomain === "demo" ||
    initialRegisteredData !== null;

  const [isStoreRegistered, setIsStoreRegistered] = useState<boolean>(isInitiallyKnown);

  const resolveCurrentActive = () => {
    try {
      // 1. فحص كوكيز الدومين المشترك للدومين الفرعي
      const cSub = getCookie(`zaeem_store_active_${cleanSubdomain}`);
      if (cSub !== null) return cSub === 'true';

      // 2. فحص التخزين المحلي للدومين الفرعي
      const lSub = localStorage.getItem(`zaeem_store_active_${cleanSubdomain}`);
      if (lSub !== null) return lSub === 'true';

      // 3. فحص كوكيز الدومين المشترك العام
      const cGen = getCookie('zaeem_store_active');
      if (cGen !== null) return cGen === 'true';

      // 4. فحص التخزين المحلي العام
      const lGen = localStorage.getItem('zaeem_store_active');
      if (lGen !== null) return lGen === 'true';

      // 5. فحص كائن المتجر المحفوظ
      const rawStore = localStorage.getItem('zaeem_store_data') || localStorage.getItem('zaeem_onboarded_store');
      if (rawStore) {
        const parsed = JSON.parse(rawStore);
        const storedSub = (parsed.subdomain || '').replace('.za3em.shop', '').toLowerCase().trim();
        if ((!cleanSubdomain || cleanSubdomain === storedSub || cleanSubdomain === 'shop') && typeof parsed.isActive === 'boolean') {
          return parsed.isActive;
        }
      }

      // 6. فحص السجل المبدئي
      if (initialRegisteredData && typeof initialRegisteredData.isActive === 'boolean') {
        return initialRegisteredData.isActive;
      }
    } catch {}
    return true;
  };

  const [isStoreActive, setIsStoreActive] = useState<boolean>(resolveCurrentActive);

  // بيانات المتجر والمنتج المعتمدة
  const [store, setStore] = useState<TemplateStore>({
    id: 1,
    name: initialRegisteredData?.storeName || (cleanSubdomain === "zero" ? "متجر زيرو إكسبريس" : `متجر ${cleanSubdomain}`),
    subdomain: cleanSubdomain,
    templateId: initialRegisteredData?.templateId || "shoppingcart.1.2.7",
    storeCode: initialRegisteredData?.storeCode || `ZAEEM-${cleanSubdomain.toUpperCase().slice(0, 4)}-${Math.floor(1000 + Math.random() * 9000)}`,
    logoUrl: initialRegisteredData?.logoUrl,
    bannerUrl: initialRegisteredData?.bannerUrl,
  });

  const [product, setProduct] = useState<TemplateProduct>({
    id: 1,
    title: initialRegisteredData?.product?.title || initialRegisteredData?.product?.name || "عطر تاج الفخامة الفرنسي الملكي",
    description:
      initialRegisteredData?.product?.description ||
      "منتج أصلي عالي الجودة مع شحن سريع لجميع محافظات العراق وضمان الدفع عند الاستلام بعد المعاينة.",
    price: Number(initialRegisteredData?.product?.price) || 45000,
    compareAtPrice: Number(initialRegisteredData?.product?.compareAtPrice) || 58000,
    imageUrl:
      initialRegisteredData?.product?.imageUrl ||
      initialRegisteredData?.product?.image ||
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&auto=format&fit=crop&q=80",
  });

  const [productsList, setProductsList] = useState<any[]>(() => {
    if (Array.isArray((initialRegisteredData as any)?.products) && (initialRegisteredData as any).products.length > 0) {
      return (initialRegisteredData as any).products;
    }
    return initialRegisteredData?.product ? [initialRegisteredData.product] : [];
  });

  const [loading, setLoading] = useState<boolean>(!isInitiallyKnown);

  // جلب ومزامنة بيانات المتجر لحظياً
  useEffect(() => {
    let isMounted = true;

    // A. مزامنة الحالة اللحظية من الكوكيز والتخزين المحلي
    const currentActive = resolveCurrentActive();
    if (typeof currentActive === 'boolean' && isMounted) {
      setIsStoreActive(currentActive);
    }

    // B. فحص السجل المباشر
    const registered = getRegisteredStore(cleanSubdomain);
    if (registered && isMounted) {
      setIsStoreRegistered(true);
      setLoading(false);
      if (typeof registered.isActive === 'boolean') {
        setIsStoreActive(registered.isActive);
      }
      setStore({
        id: 1,
        name: registered.storeName || `متجر ${cleanSubdomain}`,
        subdomain: cleanSubdomain,
        templateId: registered.templateId || "shoppingcart.1.2.7",
        storeCode: registered.storeCode || `ZAEEM-${cleanSubdomain.toUpperCase().slice(0, 4)}-${Math.floor(1000 + Math.random() * 9000)}`,
        logoUrl: registered.logoUrl,
        bannerUrl: registered.bannerUrl,
      });
      if ((registered as any)?.products && Array.isArray((registered as any).products) && (registered as any).products.length > 0) {
        setProductsList((registered as any).products);
      }
      if (registered.product) {
        const pImg = registered.product.imageUrl || registered.product.image || "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&auto=format&fit=crop&q=80";
        setProduct({
          id: 1,
          title: registered.product.title || registered.product.name || "منتج العرض الحصري",
          description: registered.product.description || registered.slogan || "منتج فاخر مع شحن سريع لجميع محافظات العراق.",
          price: Number(registered.product.price) || 45000,
          compareAtPrice: Number(registered.product.compareAtPrice) || Math.round((Number(registered.product.price) || 45000) * 1.3),
          imageUrl: pImg,
          images: (registered.product as any)?.images || [pImg],
        });
        if (!((registered as any)?.products && Array.isArray((registered as any).products) && (registered as any).products.length > 0)) {
          setProductsList([registered.product]);
        }
      }
    } else if (cleanSubdomain === "zero" || cleanSubdomain === "demo") {
      if (isMounted) {
        setIsStoreRegistered(true);
        setLoading(false);
      }
    }

    // C. الاستعلام الدائم من قاعدة بيانات Neon السحابية (المصدر الحقيقي لكافة الدومينات الفرعية)
    async function syncCloudStore() {
      try {
        const cloudStore = await fetchCloudStore(cleanSubdomain);
        if (cloudStore && isMounted) {
          setIsStoreRegistered(true);
          setLoading(false);
          // Neon DB هو المرجع الحاسم لحالة نشط / معطل عبر مختلف المتصفحات والأجهزة
          if (typeof cloudStore.is_active === 'boolean') {
            setIsStoreActive(cloudStore.is_active);
          }
          setStore((prev) => ({
            ...prev,
            id: cloudStore.id || prev.id,
            name: cloudStore.name || prev.name,
            subdomain: cleanSubdomain,
            templateId: cloudStore.template_id || prev.templateId,
            storeCode: cloudStore.store_code || prev.storeCode,
            logoUrl: cloudStore.logo_url || prev.logoUrl,
            bannerUrl: cloudStore.banner_url || prev.bannerUrl,
          }));

          // استخراج كتالوج كافة المنتجات (القديمة والجديدة) المعروضة في المتجر
          const cloudCatalog = Array.isArray(cloudStore.products) && cloudStore.products.length > 0
            ? cloudStore.products
            : (Array.isArray((cloudStore.product as any)?.products) && (cloudStore.product as any).products.length > 0
              ? (cloudStore.product as any).products
              : (Array.isArray((cloudStore.product as any)?.catalog) && (cloudStore.product as any).catalog.length > 0
                ? (cloudStore.product as any).catalog
                : (cloudStore.product ? [cloudStore.product] : [])));

          if (cloudCatalog.length > 0) {
            setProductsList(cloudCatalog);
          }

          if (cloudStore.product) {
            setProduct((prev) => {
              const cImg = cloudStore.product?.imageUrl || cloudStore.product?.image || prev.imageUrl;
              return {
                ...prev,
                id: cloudStore.product?.id || prev.id,
                title: cloudStore.product?.title || cloudStore.product?.name || prev.title,
                description: cloudStore.product?.description || cloudStore.slogan || prev.description,
                price: Number(cloudStore.product?.price) || prev.price,
                compareAtPrice: Number(cloudStore.product?.compareAtPrice) || Math.round((Number(cloudStore.product?.price) || prev.price) * 1.3),
                imageUrl: cImg,
                images: (cloudStore.product as any)?.images || [cImg],
              };
            });
          }
          return;
        }
      } catch (cloudErr) {
        console.warn("Neon Cloud DB fetch error:", cloudErr);
      }

      // فحص بديل عبر API السيرفر
      if (!registered && cleanSubdomain !== "zero" && cleanSubdomain !== "demo") {
        try {
          const res = await fetch(`/api/tenant/stores/${cleanSubdomain}`);
          if (res.ok && isMounted) {
            const data = await res.json();
            if (data.store) {
              setIsStoreRegistered(true);
              setLoading(false);
              if (typeof data.store.isActive === 'boolean') {
                setIsStoreActive(data.store.isActive);
              }
              setStore((prev) => ({
                ...prev,
                id: data.store.id || prev.id,
                name: data.store.name || prev.name,
                subdomain: data.store.subdomain || prev.subdomain,
                templateId: data.store.templateId || prev.templateId,
                storeCode: data.store.storeCode || prev.storeCode,
                logoUrl: data.store.logoUrl || prev.logoUrl,
                bannerUrl: data.store.bannerUrl || prev.bannerUrl,
              }));
              return;
            }
          }
        } catch (err) {}

        if (isMounted) {
          setIsStoreRegistered(false);
          setLoading(false);
        }
      }
    }

    syncCloudStore();

    // D. الاستماع للتحديثات اللحظية عبر التبويبات والمكونات
    const handleUpdate = (e: any) => {
      if (e?.detail && typeof e.detail.isActive === 'boolean') {
        setIsStoreActive(e.detail.isActive);
      } else {
        const freshActive = resolveCurrentActive();
        if (typeof freshActive === 'boolean') setIsStoreActive(freshActive);
      }
    };
    window.addEventListener('zaeem_store_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      isMounted = false;
      window.removeEventListener('zaeem_store_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [cleanSubdomain]);

  const handleDirectActivateStore = async () => {
    try {
      await updateStoreActiveStatus(cleanSubdomain, true);
      setIsStoreActive(true);
    } catch {}
  };

  // إرسال الطلب وحجز الشحنة تلقائياً مع شركة الشحن وتخزينه بلوحة التاجر
  const handlePlaceOrder = async (orderPayload: any) => {
    let apiResult: any = null;
    try {
      const response = await fetch("/api/tenant/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          storeId: store.id,
          productId: product.id,
          customerName: orderPayload.customerName,
          customerPhone: orderPayload.customerPhone,
          customerAddress: orderPayload.customerAddress,
          governorate: orderPayload.governorate,
          quantity: orderPayload.quantity,
          shippingCost: orderPayload.shippingCost,
          unitPrice: product.price,
          notes: orderPayload.notes,
        }),
      });

      if (response.ok) {
        apiResult = await response.json().catch(() => null);
      }
    } catch {}

    // حفظ الطلب بتسلسل order0001, order0002... في التخزين المركزي للمتجر
    const stored = addStoredOrder({
      customerName: orderPayload.customerName,
      customerPhone: orderPayload.customerPhone,
      customerCity: orderPayload.governorate || 'بغداد',
      address: orderPayload.customerAddress || `العراق — ${orderPayload.governorate || 'بغداد'}`,
      total: Number(orderPayload.totalAmount || (product.price * (orderPayload.quantity || 1) + (orderPayload.shippingCost || 0))),
      itemsCount: orderPayload.quantity || 1,
      status: 'pending',
      paymentMethod: 'cod',
      items: [{
        productName: product.title || (product as any).name || 'منتج المتجر',
        quantity: orderPayload.quantity || 1,
        unitPrice: product.price
      }]
    });

    return apiResult || { success: true, orderNumber: stored.number, order: stored };
  };

  // =========================================================================
  // حالة جاري التحقق واسترداد المتجر من السيرفر السحابي
  // =========================================================================
  if (loading && cleanSubdomain !== "zero" && cleanSubdomain !== "demo") {
    return (
      <div className="w-full min-h-screen bg-[#070b14] text-white flex flex-col items-center justify-center p-6 text-center font-sans selection:bg-teal-500 selection:text-slate-950" dir="rtl">
        <div className="size-16 rounded-3xl bg-teal-500/10 border border-teal-500/30 text-teal-400 grid place-items-center mb-6 shadow-2xl shadow-teal-500/10">
          <Globe className="size-8 animate-spin text-teal-400" />
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-white mb-2">جاري استرداد وإطلاق متجرك أونلاين...</h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-sm mb-4">
          يتم تحميل قالب المتجر ومنتجاتك من قاعدة البيانات السحابية المركزية
        </p>
        <span className="font-mono text-xs px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-teal-300">
          https://{cleanSubdomain}.za3em.shop
        </span>
      </div>
    );
  }

  // =========================================================================
  // حالة عدم وجود المتجر (404 - النطاق الفرعي غير مسجل بعد)
  // =========================================================================
  if (!isStoreRegistered && cleanSubdomain !== "zero" && cleanSubdomain !== "demo") {
    return (
      <div className="w-full min-h-screen bg-[#070b14] text-white flex flex-col justify-between selection:bg-teal-500 selection:text-slate-950 font-sans" dir="rtl">

        {/* Top Header */}
        <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
          <a href="https://www.za3em.shop" className="flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 grid place-items-center text-slate-950 font-black text-lg shadow-lg shadow-teal-500/20">
              ز
            </div>
            <div>
              <h1 className="text-base font-black text-white">منصة الزعيم — العراق</h1>
              <p className="text-[10px] text-teal-400 font-mono">za3em.shop</p>
            </div>
          </a>

          <a
            href="https://www.za3em.shop"
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-bold text-slate-300 border border-slate-700/80 transition-colors"
          >
            الرئيسية 🏠
          </a>
        </header>

        {/* Center 404 / Claim Domain Banner */}
        <main className="max-w-2xl mx-auto w-full px-4 py-16 text-center space-y-8 animate-fadeIn">
          <div className="size-20 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mx-auto grid place-items-center shadow-2xl shadow-amber-500/10">
            <Globe className="size-10" />
          </div>

          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-800/80 text-amber-300 text-xs font-bold">
              <AlertTriangle className="size-3.5" />
              <span>هذا الدومين الفرعي غير مسجل بعد في منصة الزعيم</span>
            </span>

            <h2 className="text-2xl sm:text-3xl font-black text-white font-mono dir-ltr">
              https://{cleanSubdomain}.za3em.shop
            </h2>

            <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
              لم يتم إنشاء أو ربط أي متجر إلكتروني على هذا الرابط حتى الآن.
              إذا كان هذا الاسم يخص علامتك التجارية أو تجارتك، فيمكنك حجزه فوراً وإطلاق متجرك الإلكتروني في أقل من دقيقتين مجاناً!
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 text-right">
            <h3 className="text-xs font-black text-slate-300 flex items-center gap-2">
              <Sparkles className="size-4 text-teal-400" />
              <span>ماذا ستحصل عند حجز هذا النطاق مع منصة الزعيم؟</span>
            </h3>
            <ul className="text-xs text-slate-400 space-y-2 font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                <span>متجر تسوق حقيقي مع سلة ودفع عند الاستلام (COD).</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                <span>ربط تلقائي مع أسطول شركة الزعيم للشحن في كافة محافظات العراق الـ 18.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                <span>رصيد 5 شحنات مجانية بالكامل لمتجرك فور التسجيل.</span>
              </li>
            </ul>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <a
                href={`https://www.za3em.shop/#/onboarding?claim=${cleanSubdomain}`}
                className="flex-1 py-3.5 px-6 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs text-center shadow-lg shadow-teal-500/20 transition-all cursor-pointer"
              >
                🚀 احجز {cleanSubdomain}.za3em.shop وأطلق متجرك الآن
              </a>
              <a
                href="https://www.za3em.shop"
                className="py-3.5 px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs text-center border border-slate-700 transition-colors"
              >
                العودة للمنصة الرئيسية 🏠
              </a>
            </div>
          </div>

          {/* Explore Active Live Stores */}
          <div className="pt-4 border-t border-slate-800/80 text-xs text-slate-400 space-y-3">
            <p className="font-bold text-slate-300">أو تصفح المتاجر النشطة المعتمدة على المنصة:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                { sub: "fadymoheb945za3emshop", name: "متجر الزعيم الذهبي" },
                { sub: "fakhama", name: "متجر الفخامة العراقي" },
                { sub: "alzaeem", name: "متجر فولت الإلكتروني" },
                { sub: "zero", name: "متجر زيرو فلاش" },
              ].map((sample) => (
                <a
                  key={sample.sub}
                  href={`https://${sample.sub}.za3em.shop`}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-teal-300 font-mono text-[11px] border border-slate-800 transition-colors"
                >
                  {sample.name} ↗
                </a>
              ))}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-800/80 py-4 text-center text-xs text-slate-500">
          منصة الزعيم للتجارة والشحن السريع في العراق © {new Date().getFullYear()}
        </footer>
      </div>
    );
  }

  // =========================================================================
  // حالة المتجر معطل مؤقتاً (المتجر متوقف عن العمل بأمر المالك أو تحت الصيانة)
  // =========================================================================
  if (!isStoreActive) {
    return (
      <div className="w-full min-h-screen bg-[#070b14] text-white flex flex-col justify-between selection:bg-teal-500 selection:text-slate-950 font-sans" dir="rtl">
        {/* Header */}
        <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 grid place-items-center text-slate-950 font-black text-lg shadow-lg shadow-teal-500/20">
              ز
            </div>
            <div>
              <h1 className="text-base font-black text-white">{store.name || `متجر ${cleanSubdomain}`}</h1>
              <p className="text-[10px] text-teal-400 font-mono dir-ltr text-right">https://{cleanSubdomain}.za3em.shop</p>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-rose-400" />
            المتجر معطل مؤقتاً
          </span>
        </header>

        {/* Maintenance Message */}
        <main className="max-w-xl mx-auto w-full px-4 py-16 text-center space-y-6 animate-fadeIn">
          <div className="size-24 rounded-3xl bg-rose-500/10 border border-rose-500/30 text-rose-400 mx-auto grid place-items-center shadow-2xl shadow-rose-500/10">
            <PauseCircle className="size-12 text-rose-400" />
          </div>

          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/80 border border-rose-800/80 text-rose-300 text-xs font-bold">
              <AlertTriangle className="size-3.5" />
              <span>المتجر متوقف عن استقبال الطلبات حالياً</span>
            </span>

            <h2 className="text-2xl sm:text-3xl font-black text-white">
              {store.name || `متجر ${cleanSubdomain}`}
            </h2>

            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
              عذراً، هذا المتجر الإلكتروني متوقف مؤقتاً بأمر المالك أو يخضع لعمليات صيانة وتحديث منتجات.
              لا يمكن إتمام عمليات الشراء أو حجز الشحنات في الوقت الحالي. يرجى مراجعتنا لاحقاً.
            </p>
          </div>

          {/* إذا كان المشاهد هو صاحب المتجر نفسه (أو لديه صلاحيات التحكم) */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 text-right">
            <div className="flex items-center gap-2 text-teal-400 text-xs font-black">
              <Sparkles className="size-4" />
              <span>هل أنت مالك هذا المتجر؟</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              متجرك في وضع <strong className="text-rose-400 font-bold">"معطل"</strong>. لإعادة تفعيله فوراً واستقبال طلبات الزبائن والشحن، يمكنك التبديل إلى "نشط" من لوحة التحكم أو بالضغط على الزر أدناه.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <a
                href="https://za3em.shop/#/settings"
                className="flex-1 py-3 px-5 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs text-center shadow-lg shadow-teal-500/20 transition-all cursor-pointer"
              >
                ⚙️ الذهاب للإعدادات لتفعيل المتجر
              </a>
              <button
                type="button"
                onClick={handleDirectActivateStore}
                className="py-3 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs text-center border border-emerald-500 transition-colors cursor-pointer"
              >
                ⚡ تفعيل المتجر الآن أونلاين
              </button>
            </div>
          </div>
        </main>

        <footer className="border-t border-slate-900 py-6 text-center text-slate-600 text-xs">
          منصة الزعيم للتجارة الإلكترونية والشحن في العراق © {new Date().getFullYear()}
        </footer>
      </div>
    );
  }

  // =========================================================================
  // حالة وجود المتجر الحقيقي (عرض القالب المختار فورياً)
  // =========================================================================
  const isDebugMode = searchParams.get("debug") === "1" || searchParams.get("admin") === "1";

  return (
    <div className="w-full min-h-screen bg-slate-950">
      {/* شريط اختيار وتبديل القالب السريع يظهر فقط عند تفعيل وضع الفحص debug=1 */}
      {isDebugMode && (
        <div className="bg-slate-900/90 border-b border-slate-800 text-xs text-slate-300 px-4 py-2 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-50">
          <div className="flex items-center gap-2 font-mono">
            <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-black text-white">النطاق المباشر:</span>
            <span className="text-emerald-400 font-bold">https://{cleanSubdomain}.za3em.shop</span>
            {store.storeCode && (
              <span className="bg-blue-900/60 text-blue-300 px-2 py-0.5 rounded text-[10px] font-mono border border-blue-700/50">
                {store.storeCode}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <span className="font-bold text-slate-400 text-[11px] shrink-0">تبديل القالب:</span>
            {[
              { id: "shoppingcart.1.2.7", label: "سلة التسوق الشاملة" },
              { id: "volt", label: "فولت الزمردي" },
              { id: "rose", label: "روز بوتيك" },
              { id: "nitro", label: "نيترو الرياضي" },
              { id: "sepia", label: "هاير الملكي" },
              { id: "easyorders-flash", label: "فلاش لاندينج (COD)" },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setStore((prev) => ({ ...prev, templateId: t.id }))}
                className={`px-2.5 py-1 rounded-lg text-xs font-black transition-colors shrink-0 cursor-pointer ${
                  store.templateId === t.id
                    ? "bg-teal-500 text-slate-950 shadow-sm font-bold"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* محرك القوالب الديناميكي */}
      <DynamicTemplateRenderer
        templateId={store.templateId}
        store={store}
        product={product}
        products={productsList}
        onPlaceOrder={handlePlaceOrder}
      />
    </div>
  );
}
