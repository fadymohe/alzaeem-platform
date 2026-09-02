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

  // جلب بيانات المتجر والمنتج الحقيقية من الـ API
  useEffect(() => {
    let isMounted = true;
    async function loadTenantData() {
      try {
        setLoading(true);
        const res = await fetch(`/api/tenant/stores/${cleanSubdomain}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.store) {
            setStore({
              id: data.store.id,
              name: data.store.name,
              subdomain: data.store.subdomain,
              templateId: data.store.templateId || "easyorders-flash",
            });
            if (data.product) {
              setProduct({
                id: data.product.id,
                title: data.product.title || data.product.name,
                description: data.product.description || "",
                price: Math.round(data.product.price || 450), // جنيه مصري صحيح
                compareAtPrice: Math.round(data.product.price * 1.5),
                imageUrl:
                  data.product.imageUrl ||
                  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
              });
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

        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-400">معاينة القالب:</span>
          <button
            type="button"
            onClick={() => setStore((prev) => ({ ...prev, templateId: "easyorders-flash" }))}
            className={`px-2.5 py-1 rounded-lg font-black transition-colors ${
              store.templateId === "easyorders-flash"
                ? "bg-emerald-500 text-slate-950"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            EasyOrders Flash (COD)
          </button>
          <button
            type="button"
            onClick={() => setStore((prev) => ({ ...prev, templateId: "minimal-luxury" }))}
            className={`px-2.5 py-1 rounded-lg font-black transition-colors ${
              store.templateId === "minimal-luxury"
                ? "bg-amber-500 text-slate-950"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            Minimal Luxury
          </button>
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
