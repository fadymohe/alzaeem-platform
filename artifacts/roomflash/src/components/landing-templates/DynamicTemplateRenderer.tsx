import React from "react";
import {
  EasyOrdersFlashTemplate,
  TemplateProduct,
  TemplateStore,
} from "./EasyOrdersFlashTemplate";
import { MinimalLuxuryTemplate } from "./MinimalLuxuryTemplate";
import { UrgencyCountdownTemplate } from "./UrgencyCountdownTemplate";
import { TechShowcaseTemplate } from "./TechShowcaseTemplate";
import { BeautyGlowTemplate } from "./BeautyGlowTemplate";
import { CompactStickyTemplate } from "./CompactStickyTemplate";
import { StoreTemplates, type TemplateId, normalizeTemplateId } from "../storefront/StoreTemplates";

interface DynamicTemplateRendererProps {
  templateId?: string;
  store: TemplateStore;
  product: TemplateProduct;
  products?: any[];
  onPlaceOrder: (orderData: any) => Promise<any>;
}

export const DynamicTemplateRenderer: React.FC<DynamicTemplateRendererProps> = ({
  templateId = "easyorders-flash",
  store,
  product,
  products,
  onPlaceOrder,
}) => {
  const cleanTemplateId = (templateId || "").toLowerCase().trim();

  // 1. قوالب صفحات الهبوط المخصصة ذات معدل التحويل العالي (Single Product COD Landing Pages)
  switch (cleanTemplateId) {
    case "easyorders-flash":
    case "flash":
    case "cod":
      return (
        <EasyOrdersFlashTemplate
          store={store}
          product={product}
          onPlaceOrder={onPlaceOrder}
        />
      );

    case "minimal-luxury":
    case "luxury":
    case "boutique":
      return (
        <MinimalLuxuryTemplate
          store={store}
          product={product}
          onPlaceOrder={onPlaceOrder}
        />
      );

    case "urgency-scarcity":
    case "urgency":
    case "countdown":
    case "limited":
      return (
        <UrgencyCountdownTemplate
          store={store}
          product={product}
          onPlaceOrder={onPlaceOrder}
        />
      );

    case "tech-showcase":
    case "tech":
    case "showcase":
      return (
        <TechShowcaseTemplate
          store={store}
          product={product}
          onPlaceOrder={onPlaceOrder}
        />
      );

    case "beauty-glow":
    case "beauty":
    case "glow":
    case "wellness":
      return (
        <BeautyGlowTemplate
          store={store}
          product={product}
          onPlaceOrder={onPlaceOrder}
        />
      );

    case "compact-sticky":
    case "compact":
    case "sticky":
    case "mobile":
      return (
        <CompactStickyTemplate
          store={store}
          product={product}
          onPlaceOrder={onPlaceOrder}
        />
      );

    default: {
      // إذا كان الرابط لمتجر متكامل فيه كتالوج منتجات متعددة
      if (Array.isArray(products) && products.length > 1) {
        const validTemplateId: TemplateId = normalizeTemplateId(cleanTemplateId);
        return (
          <StoreTemplates
            storeName={store.name || `متجر ${store.subdomain || 'الزعيم'}`}
            subdomain={store.subdomain || 'alzaeem'}
            activeTemplateId={validTemplateId}
            standalone={true}
            customProduct={product}
            products={products}
            storeCode={store.storeCode}
            logoUrl={store.logoUrl}
          />
        );
      }

      // إذا كانت صفحة لمنتج واحد (صفحة هبوط)، نعرض قالب فلاش لاندينج السريع
      return (
        <EasyOrdersFlashTemplate
          store={store}
          product={product}
          onPlaceOrder={onPlaceOrder}
        />
      );
    }
  }
};
