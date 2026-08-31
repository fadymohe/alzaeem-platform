import { createInsertSchema } from "drizzle-zod";
import {
  index,
  integer,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { z } from "zod/v4";

export const storesTable = pgTable(
  "roomflash_stores",
  {
    id: serial("id").primaryKey(),
    ownerClerkId: text("owner_clerk_id").notNull(),
    name: text("name").notNull(),
    subdomain: text("subdomain").notNull(),
    country: text("country").notNull(),
    category: text("category").notNull(),
    status: text("status").notNull().default("draft"),
    theme: text("theme").notNull().default("general"),
    plan: text("plan").notNull().default("free"),
    orderLimit: integer("order_limit").notNull().default(10),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    ownerIdx: index("roomflash_stores_owner_idx").on(table.ownerClerkId),
    subdomainUnique: uniqueIndex("roomflash_stores_subdomain_unique").on(table.subdomain),
  }),
);

export const productsTable = pgTable(
  "roomflash_products",
  {
    id: serial("id").primaryKey(),
    storeId: integer("store_id").notNull().references(() => storesTable.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    sku: text("sku").notNull(),
    description: text("description").notNull().default(""),
    priceCents: integer("price_cents").notNull(),
    compareAtPriceCents: integer("compare_at_price_cents"),
    stock: integer("stock").notNull().default(0),
    lowStockThreshold: integer("low_stock_threshold").notNull().default(5),
    category: text("category").notNull(),
    status: text("status").notNull().default("draft"),
    imageUrl: text("image_url"),
    weightGrams: integer("weight_grams").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    storeIdx: index("roomflash_products_store_idx").on(table.storeId),
    skuUnique: uniqueIndex("roomflash_products_store_sku_unique").on(table.storeId, table.sku),
  }),
);

export const customersTable = pgTable(
  "roomflash_customers",
  {
    id: serial("id").primaryKey(),
    storeId: integer("store_id").notNull().references(() => storesTable.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    phone: text("phone").notNull(),
    email: text("email"),
    address: text("address").notNull().default(""),
    city: text("city").notNull(),
    country: text("country").notNull(),
    ordersCount: integer("orders_count").notNull().default(0),
    totalSpentCents: integer("total_spent_cents").notNull().default(0),
    lastOrderAt: timestamp("last_order_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    storeIdx: index("roomflash_customers_store_idx").on(table.storeId),
  }),
);

export const ordersTable = pgTable(
  "roomflash_orders",
  {
    id: serial("id").primaryKey(),
    storeId: integer("store_id").notNull().references(() => storesTable.id, { onDelete: "cascade" }),
    customerId: integer("customer_id").notNull().references(() => customersTable.id),
    number: text("number").notNull(),
    customerName: text("customer_name").notNull(),
    customerPhone: text("customer_phone").notNull(),
    customerCity: text("customer_city").notNull(),
    address: text("address").notNull(),
    country: text("country").notNull(),
    notes: text("notes"),
    totalCents: integer("total_cents").notNull(),
    itemsCount: integer("items_count").notNull(),
    status: text("status").notNull().default("pending"),
    paymentMethod: text("payment_method").notNull().default("cod"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    storeIdx: index("roomflash_orders_store_idx").on(table.storeId),
    createdIdx: index("roomflash_orders_created_idx").on(table.createdAt),
    numberUnique: uniqueIndex("roomflash_orders_number_unique").on(table.number),
  }),
);

export const orderItemsTable = pgTable(
  "roomflash_order_items",
  {
    id: serial("id").primaryKey(),
    orderId: integer("order_id").notNull().references(() => ordersTable.id, { onDelete: "cascade" }),
    productId: integer("product_id").notNull().references(() => productsTable.id),
    productName: text("product_name").notNull(),
    quantity: integer("quantity").notNull(),
    unitPriceCents: integer("unit_price_cents").notNull(),
  },
  (table) => ({
    orderIdx: index("roomflash_order_items_order_idx").on(table.orderId),
  }),
);

export const subscriptionPlansTable = pgTable("roomflash_subscription_plans", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  monthlyPrice: numeric("monthly_price", { precision: 12, scale: 2, mode: "number" }).notNull(),
  annualDiscount: numeric("annual_discount", { precision: 5, scale: 4, mode: "number" }).notNull(),
  description: text("description").notNull(),
  features: text("features").array().notNull(),
});

export const insertStoreSchema = createInsertSchema(storesTable).omit({ id: true, createdAt: true });
export const insertProductSchema = createInsertSchema(productsTable).omit({ id: true, createdAt: true });
export const insertCustomerSchema = createInsertSchema(customersTable).omit({ id: true, createdAt: true });
export const insertOrderSchema = createInsertSchema(ordersTable).omit({ id: true, createdAt: true });
export type Store = typeof storesTable.$inferSelect;
export type Product = typeof productsTable.$inferSelect;
export type Customer = typeof customersTable.$inferSelect;
export type Order = typeof ordersTable.$inferSelect;
export type Plan = typeof subscriptionPlansTable.$inferSelect;
export type InsertStore = z.infer<typeof insertStoreSchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;