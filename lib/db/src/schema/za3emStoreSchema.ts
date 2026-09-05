import { createInsertSchema } from "drizzle-zod";
import {
  index,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { z } from "zod/v4";

/**
 * جدول المتاجر (stores)
 * يشمل: id, name, subdomain (فريد وغير مكرر), template_id, store_code, slogan, logo_url, banner_url, categories, product, user_email, owner_id, created_at
 */
export const za3emStoresTable = pgTable(
  "za3em_stores",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    subdomain: text("subdomain").notNull(),
    templateId: text("template_id").notNull().default("easyorders-flash"),
    storeCode: text("store_code"),
    slogan: text("slogan"),
    logoUrl: text("logo_url"),
    bannerUrl: text("banner_url"),
    categories: jsonb("categories").$type<string[]>(),
    product: jsonb("product").$type<any>(),
    userEmail: text("user_email"),
    ownerId: text("owner_id"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    subdomainUnique: uniqueIndex("za3em_stores_subdomain_unique").on(table.subdomain),
    userEmailIdx: index("za3em_stores_user_email_idx").on(table.userEmail),
    ownerIdx: index("za3em_stores_owner_idx").on(table.ownerId),
  }),
);

/**
 * جدول المنتجات (products)
 * يشمل: id, store_id, title, description, price (الحساب بالجنيه المصري الصحيح فقط بدون كسور أو قروش), image_url
 */
export const za3emProductsTable = pgTable(
  "za3em_products",
  {
    id: serial("id").primaryKey(),
    storeId: integer("store_id")
      .notNull()
      .references(() => za3emStoresTable.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description").notNull().default(""),
    // الحساب بالجنيه المصري كعدد صحيح فقط (مثال: 450 ج.م)
    price: integer("price").notNull(),
    imageUrl: text("image_url").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    storeIdx: index("za3em_products_store_idx").on(table.storeId),
  }),
);

/**
 * جدول الطلبات (orders)
 * يشمل: تفاصيل العميل، العنوان، المحافظة، الإجمالي (بالجنيه المصري الصحيح)، shipping_company، ورقم التتبع tracking_number
 */
export const za3emOrdersTable = pgTable(
  "za3em_orders",
  {
    id: serial("id").primaryKey(),
    storeId: integer("store_id")
      .notNull()
      .references(() => za3emStoresTable.id, { onDelete: "cascade" }),
    productId: integer("product_id")
      .notNull()
      .references(() => za3emProductsTable.id, { onDelete: "cascade" }),
    customerName: text("customer_name").notNull(),
    customerPhone: text("customer_phone").notNull(),
    customerAddress: text("customer_address").notNull(),
    governorate: text("governorate").notNull(),
    // الإجمالي وتكلفة الشحن بالجنيه المصري الصحيح
    totalAmount: integer("total_amount").notNull(),
    shippingCost: integer("shipping_cost").notNull().default(0),
    shippingCompany: text("shipping_company").notNull().default("Bosta Express"),
    trackingNumber: text("tracking_number"),
    status: text("status").notNull().default("pending"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    storeIdx: index("za3em_orders_store_idx").on(table.storeId),
    trackingIdx: index("za3em_orders_tracking_idx").on(table.trackingNumber),
    phoneIdx: index("za3em_orders_phone_idx").on(table.customerPhone),
  }),
);

// Zod validation schemas
export const insertZa3emStoreSchema = createInsertSchema(za3emStoresTable).omit({ id: true, createdAt: true });
export const insertZa3emProductSchema = createInsertSchema(za3emProductsTable).omit({ id: true, createdAt: true });
export const insertZa3emOrderSchema = createInsertSchema(za3emOrdersTable).omit({ id: true, createdAt: true });

// TypeScript types inferred
export type Za3emStore = typeof za3emStoresTable.$inferSelect;
export type Za3emProduct = typeof za3emProductsTable.$inferSelect;
export type Za3emOrder = typeof za3emOrdersTable.$inferSelect;
export type InsertZa3emStore = z.infer<typeof insertZa3emStoreSchema>;
export type InsertZa3emProduct = z.infer<typeof insertZa3emProductSchema>;
export type InsertZa3emOrder = z.infer<typeof insertZa3emOrderSchema>;
