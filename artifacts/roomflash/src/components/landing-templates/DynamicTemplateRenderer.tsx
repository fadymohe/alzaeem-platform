import React from "react";
import {
  EasyOrdersFlashTemplate,
  TemplateProduct,
  TemplateStore,
} from "./EasyOrdersFlashTemplate";
import { MinimalLuxuryTemplate } from "./MinimalLuxuryTemplate";

interface DynamicTemplateRendererProps {
  templateId?: string;
  store: TemplateStore;
  product: TemplateProduct;
  onPlaceOrder: (orderData: any) => Promise<any>;
}

export const DynamicTemplateRenderer: React.FC<DynamicTemplateRendererProps> = ({
  templateId = "easyorders-flash",
  store,
  product,
  onPlaceOrder,
}) => {
  const cleanTemplateId = (templateId || "").toLowerCase().trim();

  switch (cleanTemplateId) {
    case "minimal-luxury":
    case "sepia":
    case "rose":
      return (
        <MinimalLuxuryTemplate
          store={store}
          product={product}
          onPlaceOrder={onPlaceOrder}
        />
      );

    case "easyorders-flash":
    case "shoppingcart.1.2.7":
    case "volt":
    case "nitro":
    default:
      return (
        <EasyOrdersFlashTemplate
          store={store}
          product={product}
          onPlaceOrder={onPlaceOrder}
        />
      );
  }
};
