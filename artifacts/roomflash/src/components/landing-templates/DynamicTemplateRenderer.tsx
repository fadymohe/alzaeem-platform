import React from "react";
import {
  EasyOrdersFlashTemplate,
  TemplateProduct,
  TemplateStore,
} from "./EasyOrdersFlashTemplate";
import { MinimalLuxuryTemplate } from "./MinimalLuxuryTemplate";
import { StoreTemplates, type TemplateId } from "../storefront/StoreTemplates";

interface DynamicTemplateRendererProps {
  templateId?: string;
  store: TemplateStore;
  product: TemplateProduct;
  onPlaceOrder: (orderData: any) => Promise<any>;
}

export const DynamicTemplateRenderer: React.FC<DynamicTemplateRendererProps> = ({
  templateId = "shoppingcart.1.2.7",
  store,
  product,
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

    case "shoppingcart.1.2.7":
    case "volt":
    case "rose":
    case "nitro":
    case "sepia":
    case "oret":
    default: {
      const validTemplateId: TemplateId =
        cleanTemplateId === "volt" ||
        cleanTemplateId === "rose" ||
        cleanTemplateId === "nitro" ||
        cleanTemplateId === "sepia" ||
        cleanTemplateId === "oret"
          ? (cleanTemplateId as TemplateId)
          : "shoppingcart.1.2.7";

      return (
        <StoreTemplates
          storeName={store.name}
          subdomain={store.subdomain}
          activeTemplateId={validTemplateId}
          standalone={true}
        />
      );
    }
  }
};

