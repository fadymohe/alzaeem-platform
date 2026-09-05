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
} from "../utils/storeRegistry";
import { Globe, Sparkles, CheckCircle2, AlertTriangle, ArrowRight, ExternalLink } from "lucide-react";

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

  const [loading, setLoading] = useState(false);

  // جلب ومزامنة بيانات المتجر لحظياً
  useEffect(() => {
    let isMounted = true;

    // 1. فحص السجل المركزي للمتاجر (كوكيز الدومين المشترك .za3em.shop + الذاكرة المحلية + البذور)
    const registered = getRegisteredStore(cleanSubdomain);

    if (registered) {
      if (isMounted) {
        setIsStoreRegistered(true);
        setStore({
          id: 1,
          name: registered.storeName || `متجر ${cleanSubdomain}`,
          subdomain: cleanSubdomain,
          templateId: registered.templateId || "shoppingcart.1.2.7",
          storeCode: registered.storeCode || `ZAEEM-${cleanSubdomain.toUpperCase().slice(0, 4)}-${Math.floor(1000 + Math.random() * 9000)}`,
          logoUrl: registered.logoUrl,
          bannerUrl: registered.bannerUrl,
        });
        if (registered.product) {
          setProduct({
            id: 1,
            title: registered.product.title || registered.product.name || "منتج العرض الحصري",
            description: registered.product.description || registered.slogan || "منتج فاخر مع شحن سريع لجميع محافظات العراق.",
            price: Number(registered.product.price) || 45000,
            compareAtPrice: Number(registered.product.compareAtPrice) || Math.round((Number(registered.product.price) || 45000) * 1.3),
            imageUrl: registered.product.imageUrl || registered.product.image || "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&auto=format&fit=crop&q=80",
          });
        }
      }
      return;
    }

    // للمتاجر التجريبية المضمنة
    if (cleanSubdomain === "zero" || cleanSubdomain === "demo") {
      if (isMounted) setIsStoreRegistered(true);
      return;
    }

    // 2. فحص السيرفر المحلي عبر API
    async function checkApiStore() {
      try {
        const res = await fetch(`/api/tenant/stores/${cleanSubdomain}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.store) {
            setIsStoreRegistered(true);
            setStore((prev) => ({
              ...prev,
              id: data.store.id || prev.id,
              name: data.store.name || prev.name,
              subdomain: data.store.subdomain || prev.subdomain,
              templateId: data.store.templateId || prev.templateId || "shoppingcart.1.2.7",
              storeCode: data.store.storeCode || prev.storeCode,
              logoUrl: data.store.logoUrl || prev.logoUrl,
              bannerUrl: data.store.bannerUrl || prev.bannerUrl,
            }));
            if (data.product) {
              setProduct((prev) => ({
                ...prev,
                id: data.product.id || prev.id,
                title: data.product.title || data.product.name || prev.title,
                description: data.product.description || prev.description,
                price: Number(data.product.price) || prev.price,
                compareAtPrice: Math.round((Number(data.product.price) || prev.price) * 1.3),
                imageUrl: data.product.imageUrl || prev.imageUrl,
              }));
            }
            return;
          }
        }
      } catch (err) {
        console.warn("API store check fallback:", err);
      }

      // 3. فحص قاعدة بيانات Supabase السحابية مباشرة
      try {
        const sbRes = await fetch(`https://cfpmbasxvjlcfcteyyaa.supabase.co/rest/v1/za3em_stores?subdomain=eq.${cleanSubdomain}`, {
          headers: {
            'apikey': 'sb_publishable_sCozsAhhHZ9v9nWEkiNVlQ_Ne5IoXq2'
          }
        });
        if (sbRes.ok) {
          const dbStores = await sbRes.json();
          if (Array.isArray(dbStores) && dbStores.length > 0) {
            const row = dbStores[0];
            const st = row.settings || {};
            if (isMounted) {
              setIsStoreRegistered(true);
              setStore({
                id: row.id || 1,
                name: row.store_name || st.name || `متجر ${cleanSubdomain}`,
                subdomain: cleanSubdomain,
                templateId: row.template_id || st.templateId || "shoppingcart.1.2.7",
                storeCode: row.store_code || st.storeCode || `ZAEEM-${cleanSubdomain.toUpperCase().slice(0, 4)}-1001`,
                logoUrl: st.logoUrl,
                bannerUrl: st.bannerUrl,
              });
              if (st.product) {
                setProduct({
                  id: 1,
                  title: st.product.title || st.product.name || "منتج العرض الحصري",
                  description: st.product.description || "منتج أصلي عالي الجودة مع شحن سريع وضمان الدفع عند الاستلام.",
                  price: Number(st.product.price) || 45000,
                  compareAtPrice: Number(st.product.compareAtPrice) || 58000,
                  imageUrl: st.product.imageUrl || st.product.image || "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&auto=format&fit=crop&q=80",
                });
              }
              return;
            }
          }
        }
      } catch (sbErr) {
        console.warn("Direct Supabase query fallback:", sbErr);
      }

      // إذا وصلنا هنا ولم يتم العثور على المتجر في أي سجل
      if (isMounted) {
        setIsStoreRegistered(false);
      }
    }

    checkApiStore();

    return () => {
      isMounted = false;
    };
  }, [cleanSubdomain]);

  // إرسال الطلب وحجز الشحنة تلقائياً مع شركة الشحن عبر الـ API
  const handlePlaceOrder = async (orderPayload: any) => {
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

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || "فشل إتمام الطلب");
    }

    return await response.json();
  };

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
        onPlaceOrder={handlePlaceOrder}
      />
    </div>
  );
}
