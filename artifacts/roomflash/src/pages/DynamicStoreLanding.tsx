import React, { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { DynamicTemplateRenderer } from "../components/landing-templates/DynamicTemplateRenderer";
import {
  TemplateProduct,
  TemplateStore,
} from "../components/landing-templates/EasyOrdersFlashTemplate";

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

  const rawSub =
    (hostSub && hostSub !== "www" && hostSub !== "za3em")
      ? hostSub
      : paramsView?.subdomain ||
        paramsStore?.subdomain ||
        paramsLanding?.subdomain ||
        querySub ||
        "zero";

  const cleanSubdomain = (rawSub || "zero").toLowerCase().replace(/[^a-z0-9-]/g, "");

  // بيانات المتجر والمنتج
  const [store, setStore] = useState<TemplateStore>({
    id: 1,
    name: cleanSubdomain === "zero" ? "متجر زيرو إكسبريس" : `متجر ${cleanSubdomain}`,
    subdomain: cleanSubdomain,
    templateId: "easyorders-flash",
  });

  const [product, setProduct] = useState<TemplateProduct>({
    id: 1,
    title: "سماعة بلوتوث لاسلكية Ultra Bass عازلة للضوضاء - إصدار 2026",
    description:
      "سماعة رأس احترافية مع صوت محيطي 3D نقي وعزل تام للضوضاء، بطارية عملاقة تدوم 48 ساعة متواصلة مع شحن سريع Type-C، متوافقة مع جميع أنواع الهواتف الذكية مع ضمان استبدال رسمي لمدة سنة كاملة.",
    price: 450, // 450 جنيه مصري صحيح بدون قروش
    compareAtPrice: 700,
    imageUrl:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
  });

  const [loading, setLoading] = useState(true);

  // جلب بيانات المتجر والمنتج الحقيقية من السيرفر أو الذاكرة المحلية
  useEffect(() => {
    let isMounted = true;

    // 1. فحص الذاكرة المحلية أولاً للعرض الفوري
    try {
      const storedOnboarded = localStorage.getItem("zaeem_onboarded_store");
      const storedStore = localStorage.getItem("zaeem_store_data");
      const activeData = storedOnboarded ? JSON.parse(storedOnboarded) : (storedStore ? JSON.parse(storedStore) : null);

      if (activeData) {
        const localSub = (activeData.subdomain || "").replace(".za3em.shop", "").toLowerCase();
        if (localSub === cleanSubdomain || cleanSubdomain === "zero" || cleanSubdomain === "demo") {
          setStore({
            id: 1,
            name: activeData.storeName || `متجر ${cleanSubdomain}`,
            subdomain: cleanSubdomain,
            templateId: activeData.selectedTheme || "shoppingcart.1.2.7",
          });
          if (activeData.product) {
            setProduct({
              id: 1,
              title: activeData.product.name || "منتج العرض الحصري",
              description: activeData.slogan || "منتج أصلي عالي الجودة مع شحن سريع لجميع محافظات العراق وضمان الدفع عند الاستلام.",
              price: Number(activeData.product.price) || 45000,
              compareAtPrice: Math.round((Number(activeData.product.price) || 45000) * 1.3),
              imageUrl: activeData.product.image || "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&auto=format&fit=crop&q=80",
            });
          }
        }
      }
    } catch (e) {
      console.warn("Local store parse fallback:", e);
    }

    // 2. مزامنة البيانات الحية من السيرفر
    async function loadTenantData() {
      try {
        const res = await fetch(`/api/tenant/stores/${cleanSubdomain}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.store) {
            setStore((prev) => ({
              ...prev,
              id: data.store.id || prev.id,
              name: data.store.name || prev.name,
              subdomain: data.store.subdomain || prev.subdomain,
              templateId: data.store.templateId || prev.templateId || "shoppingcart.1.2.7",
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
          }
        }
      } catch (err) {
        console.warn("Using offline tenant defaults:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadTenantData();
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
      const err = await response.json();
      throw new Error(err.error || "فشل إتمام الطلب");
    }

    return await response.json();
  };

  return (
    <div className="w-full min-h-screen bg-slate-950">
      {/* شريط اختيار وتبديل القالب السريع للمعاينة */}
      <div className="bg-slate-900/90 border-b border-slate-800 text-xs text-slate-300 px-4 py-2 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-50">
        <div className="flex items-center gap-2 font-mono">
          <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-black text-white">النطاق المباشر:</span>
          <span className="text-emerald-400 font-bold">https://{cleanSubdomain}.za3em.shop</span>
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
              className={`px-2.5 py-1 rounded-lg text-xs font-black transition-colors shrink-0 ${
                store.templateId === t.id
                  ? "bg-teal-500 text-slate-950 shadow-sm"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

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
