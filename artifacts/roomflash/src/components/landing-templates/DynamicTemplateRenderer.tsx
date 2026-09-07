import React from "react";
import {
  EasyOrdersFlashTemplate,
  TemplateProduct,
  TemplateStore,
} from "./EasyOrdersFlashTemplate";
import { MinimalLuxuryTemplate } from "./MinimalLuxuryTemplate";
import { StoreTemplates, type TemplateId, normalizeTemplateId } from "../storefront/StoreTemplates";

interface DynamicTemplateRendererProps {
  templateId?: string;
  store: TemplateStore;
  product: TemplateProduct;
  products?: any[];
  onPlaceOrder: (orderData: any) => Promise<any>;
}

export const DynamicTemplateRenderer: React.FC<DynamicTemplateRendererProps> = ({
  templateId = "store-classic",
  store,
  product,
  products,
  onPlaceOrder,
}) => {
  const cleanTemplateId = (templateId || "").toLowerCase().trim();

  switch (cleanTemplateId) {
    case "easyorders-flash":
      return (
        <EasyOrdersFlashTemplate
          store={store}
          product={product}
          onPlaceOrder={onPlaceOrder}
        />
      );

    case "minimal-luxury":
      return (
        <MinimalLuxuryTemplate
          store={store}
          product={product}
          onPlaceOrder={onPlaceOrder}
        />
      );

    default: {
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
  }
};

