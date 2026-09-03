import { and, count, desc, eq, ilike, sql } from "drizzle-orm";
import { Router, type IRouter } from "express";
import {
  CreateOrderBody,
  CreateProductBody,
  CreateStoreBody,
  GetAdminSummaryResponse,
  GetCustomersQueryParams,
  GetCustomersResponse,
  GetDashboardSummaryResponse,
  GetOrdersQueryParams,
  GetOrdersResponse,
  GetPlansResponse,
  GetProductsQueryParams,
  GetProductsResponse,
  GetStorefrontParams,
  GetStorefrontResponse,
  GetCurrentStoreResponse,
  UpdateOrderBody,
  UpdateOrderParams,
  UpdateOrderResponse,
  UpdateProductBody,
  UpdateProductParams,
  UpdateProductResponse,
  CreateOrderResponse,
  CreateProductResponse,
  CreateStoreResponse,
} from "@workspace/api-zod";
import {
  db,
  customersTable,
  orderItemsTable,
  ordersTable,
  productsTable,
  storesTable,
  subscriptionPlansTable,
  usersTable,
} from "@workspace/db";
import { getUserId, requireAdmin, requireAuth } from "../middlewares/auth";

const router: IRouter = Router();

const otpStore = new Map<string, { code: string; expiresAt: number; verified: boolean }>();

const RESERVED_SUBDOMAINS = [
  "admin", "api", "app", "zaeem", "za3em", "dashboard", "root", "www",
  "mail", "support", "billing", "auth", "account", "portal", "cpanel",
  "system", "null", "undefined", "test", "stores", "store", "static", "assets", "webmail"
];

// Helper to validate name (letters and spaces only, no digits or symbols)
const isValidName = (name: string): boolean => {
  return /^[\u0600-\u06FFa-zA-Z\s]{2,50}$/.test((name || "").trim());
};

// Helper to validate phone (+964 followed by 10 digits starting with 770, 780, or 790)
const isValidIraqPhone = (phone: string): boolean => {
  const clean = (phone || "").replace(/[\s-]/g, "");
  return /^(\+?964)?0?(770|780|790)\d{7}$/.test(clean);
};

// Helper to validate password (min 8 chars, at least 1 letter, 1 number, 1 special character)
const isValidPassword = (pwd: string): boolean => {
  if (!pwd || pwd.length < 8) return false;
  const hasLetter = /[a-zA-Z\u0600-\u06FF]/.test(pwd);
  const hasNumber = /[0-9]/.test(pwd);
  const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(pwd);
  return hasLetter && hasNumber && hasSymbol;
};

// 1. Send OTP for verification or password recovery
router.post("/auth/send-otp", async (req, res): Promise<void> => {
  try {
    const { email, type = "register" } = req.body;
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      res.status(400).json({ error: "يرجى إدخال بريد إلكتروني صحيح" });
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Generate random 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    otpStore.set(normalizedEmail, { code, expiresAt, verified: false });

    console.log(`[OTP SERVICE] Code for ${normalizedEmail}: ${code}`);

    res.json({
      success: true,
      message: `تم إرسال كود التحقق بنجاح إلى ${normalizedEmail}`,
      otpCode: code // provided for demo/testing convenience
    });
  } catch (err) {
    res.status(500).json({ error: "فشل إرسال كود التحقق" });
  }
});

// 2. Verify OTP
router.post("/auth/verify-otp", async (req, res): Promise<void> => {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      res.status(400).json({ error: "البريد الإلكتروني وكود التحقق مطلوبان" });
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();
    const record = otpStore.get(normalizedEmail);

    if (!record || record.expiresAt < Date.now()) {
      res.status(400).json({ error: "كود التحقق منتهي الصلاحية أو غير موجود، يرجى طلب كود جديد" });
      return;
    }

    if (record.code !== code.toString().trim()) {
      res.status(400).json({ error: "كود التحقق غير صحيح، يرجى التأكد وإعادة المحاولة" });
      return;
    }

    record.verified = true;
    otpStore.set(normalizedEmail, record);

    res.json({ success: true, verified: true, message: "تم التحقق من البريد الإلكتروني بنجاح" });
  } catch (err) {
    res.status(500).json({ error: "فشل التحقق من الكود" });
  }
});

// 3. Reset Password using verified OTP
router.post("/auth/reset-password", async (req, res): Promise<void> => {
  try {
    const { email, code, newPassword } = req.body;
    if (!email || !code || !newPassword) {
      res.status(400).json({ error: "جميع الحقول مطلوبة" });
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();
    const record = otpStore.get(normalizedEmail);

    if (!record || record.code !== code.toString().trim() || record.expiresAt < Date.now()) {
      res.status(400).json({ error: "كود التحقق غير صحيح أو منتهي الصلاحية" });
      return;
    }

    if (!isValidPassword(newPassword)) {
      res.status(400).json({ error: "كلمة المرور يجب أن تتكون من 8 أحرف على الأقل، وتحتوي على حروف وأرقام ورموز خاصة" });
      return;
    }

    const passwordHash = Buffer.from(newPassword).toString("base64");
    const updated = await db.update(usersTable)
      .set({ passwordHash })
      .where(eq(usersTable.email, normalizedEmail))
      .returning();

    if (updated.length === 0) {
      await db.insert(usersTable).values({
        firstName: normalizedEmail.split('@')[0],
        lastName: 'الزعيم',
        email: normalizedEmail,
        passwordHash,
        governorate: 'بغداد'
      });
    }

    otpStore.delete(normalizedEmail);

    res.json({ success: true, message: "تمت إعادة تعيين كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول." });
  } catch (err) {
    res.status(500).json({ error: "فشلت إعادة تعيين كلمة المرور" });
  }
});

// 4. Check if Email Exists
router.post("/auth/check-email", async (req, res): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ error: "البريد الإلكتروني مطلوب" });
      return;
    }
    const normalizedEmail = email.toLowerCase().trim();
    let exists = false;
    try {
      const existing = await db.select().from(usersTable).where(eq(usersTable.email, normalizedEmail));
      exists = existing.length > 0;
    } catch (dbErr) {
      console.warn("[CHECK EMAIL] DB check warning:", dbErr);
    }
    res.json({ exists });
  } catch (err) {
    res.status(500).json({ error: "خطأ في فحص البريد الإلكتروني" });
  }
});

// 5. Register with Strict Business Rules
router.post("/auth/register", async (req, res): Promise<void> => {
  try {
    const { firstName, lastName, email, phone, governorate, password, storeName, subdomain } = req.body;

    if (!firstName || !lastName || !email || !password || !phone) {
      res.status(400).json({ error: "جميع الحقول الأساسية مطلوبة لإتمام التسجيل" });
      return;
    }

    // Rule: Name must contain only letters and spaces (no digits or symbols)
    if (!isValidName(firstName) || !isValidName(lastName)) {
      res.status(400).json({ error: "يمنع إدخال أرقام أو رموز في حقول الاسم الأول واسم العائلة" });
      return;
    }

    // Rule: Phone must be 10 digits starting with 770, 780, or 790
    if (!isValidIraqPhone(phone)) {
      res.status(400).json({ error: "رقم الهاتف يجب أن يتكون من 10 أرقام ويبدأ بـ 770 أو 780 أو 790" });
      return;
    }

    // Rule: Password minimum 8 characters with letters, numbers, and symbols
    if (!isValidPassword(password)) {
      res.status(400).json({ error: "كلمة المرور يجب ألا تقل عن 8 أحرف وتحتوي على حروف وأرقام ورموز خاصة (!@#$...)" });
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUsers = await db.select().from(usersTable).where(eq(usersTable.email, normalizedEmail));
    if (existingUsers.length > 0) {
      res.status(400).json({ error: "يوجد حساب مسجل بهذا البريد بالفعل" });
      return;
    }

    // Format phone to clean +964...
    const cleanDigits = phone.replace(/\D/g, "").replace(/^964/, "").replace(/^0/, "");
    const formattedPhone = `+964${cleanDigits}`;

    const [newUser] = await db.insert(usersTable).values({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: normalizedEmail,
      phone: formattedPhone,
      governorate: governorate || "بغداد",
      passwordHash: Buffer.from(password).toString("base64"),
    }).returning();

    let createdStore = null;
    if (subdomain || storeName) {
      const storeSlug = (subdomain || storeName).toLowerCase().replace(/[^a-z0-9-]/g, "");

      if (RESERVED_SUBDOMAINS.includes(storeSlug)) {
        res.status(400).json({ error: "هذا النطاق الفرعي محجوز للاستخدام الخاص بإدارة المنصة، يرجى اختيار اسم آخر" });
        return;
      }

      const existingStores = await db.select().from(storesTable).where(eq(storesTable.subdomain, storeSlug));
      if (existingStores.length > 0) {
        res.status(400).json({ error: "اسم النطاق الفرعي محجوز لمتجر آخر، يرجى اختيار اسم متاح" });
        return;
      }

      const [newStore] = await db.insert(storesTable).values({
        ownerClerkId: `usr_${newUser.id}`,
        name: storeName || `متجر ${firstName}`,
        subdomain: storeSlug,
        country: "Iraq",
        category: "general",
        status: "published",
        theme: "shoppingcart.1.2.7",
        plan: "free",
        orderLimit: 5, // Free trial: max 5 shipments as requested
      }).returning();
      createdStore = newStore;
    }

    res.json({
      success: true,
      user: { id: newUser.id, firstName: newUser.firstName, lastName: newUser.lastName, email: newUser.email },
      store: createdStore,
      token: `token_${newUser.id}_${Date.now()}`
    });
  } catch (err) {
    res.status(500).json({ error: "حدث خطأ بالخادم أثناء التسجيل" });
  }
});

router.post("/auth/login", async (req, res): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "البريد الإلكتروني وكلمة المرور مطلوبان" });
      return;
    }

    const users = await db.select().from(usersTable).where(eq(usersTable.email, email.toLowerCase()));
    if (users.length === 0) {
      res.status(401).json({ error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" });
      return;
    }

    const user = users[0];
    const passwordHash = Buffer.from(password).toString("base64");
    if (user.passwordHash !== passwordHash) {
      res.status(401).json({ error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" });
      return;
    }

    const stores = await db.select().from(storesTable).where(eq(storesTable.ownerClerkId, `usr_${user.id}`));

    res.json({
      success: true,
      user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email },
      store: stores[0] || null,
      token: `token_${user.id}_${Date.now()}`
    });
  } catch (err) {
    res.status(500).json({ error: "حدث خطأ بالخادم أثناء تسجيل الدخول" });
  }
});

router.get("/stores/check-subdomain", async (req, res): Promise<void> => {
  try {
    const slugParam = (req.query.subdomain || req.query.slug || "").toString().toLowerCase().trim().replace(/[^a-z0-9-]/g, "");
    if (!slugParam) {
      res.status(400).json({ available: false, error: "اسم النطاق مطلوب" });
      return;
    }
    if (RESERVED_SUBDOMAINS.includes(slugParam)) {
      res.json({ available: false, reason: "reserved", message: "هذا النطاق محجوز للاستخدام الخاص بإدارة المنصة وغير متاح" });
      return;
    }
    const existingStores = await db.select().from(storesTable).where(eq(storesTable.subdomain, slugParam));
    if (existingStores.length > 0) {
      res.json({ available: false, reason: "taken", message: "هذا النطاق مستخدم مسبقاً من متجر آخر" });
      return;
    }
    res.json({ available: true, subdomain: slugParam, message: "النطاق متاح ويمكن حجزه ✅" });
  } catch (err) {
    res.status(500).json({ available: false, error: "خطأ بالخادم" });
  }
});

const orderStatuses = ["pending", "confirmed", "processing", "delivered", "cancelled"] as const;

function productResponse(product: typeof productsTable.$inferSelect) {
  return {
    id: product.id,
    name: product.name,
    sku: product.sku,
    description: product.description,
    price: product.priceCents / 100,
    compareAtPrice: product.compareAtPriceCents == null ? null : product.compareAtPriceCents / 100,
    stock: product.stock,
    lowStockThreshold: product.lowStockThreshold,
    category: product.category,
    status: product.status as "active" | "draft" | "archived",
    imageUrl: product.imageUrl,
    weightGrams: product.weightGrams,
  };
}

function orderResponse(order: typeof ordersTable.$inferSelect) {
  return {
    id: order.id,
    number: order.number,
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    customerCity: order.customerCity,
    total: order.totalCents / 100,
    itemsCount: order.itemsCount,
    status: order.status as (typeof orderStatuses)[number],
    paymentMethod: "cod" as const,
    createdAt: order.createdAt.toISOString(),
  };
}

async function currentStore(userId: string) {
  const [store] = await db.select().from(storesTable).where(eq(storesTable.ownerClerkId, userId)).limit(1);
  return store;
}

async function getStoreOrdersCount(storeId: number) {
  const [row] = await db.select({ value: count() }).from(ordersTable).where(eq(ordersTable.storeId, storeId));
  return Number(row?.value ?? 0);
}

function storeResponse(store: typeof storesTable.$inferSelect, ordersThisMonth = 0) {
  return {
    id: store.id,
    name: store.name,
    subdomain: store.subdomain,
    country: store.country as "Egypt" | "Iraq",
    category: store.category,
    status: store.status as "draft" | "published" | "paused",
    theme: store.theme,
    plan: store.plan,
    orderLimit: store.orderLimit,
    ordersThisMonth,
  };
}

router.get("/stores/current", requireAuth, async (req, res): Promise<void> => {
  const store = await currentStore(getUserId(req));
  if (!store) {
    res.status(404).json({ error: "Store not found" });
    return;
  }
  res.json(GetCurrentStoreResponse.parse(storeResponse(store, await getStoreOrdersCount(store.id))));
});

router.post("/stores/current", requireAuth, async (req, res): Promise<void> => {
  const parsed = CreateStoreBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const userId = getUserId(req);
  const existing = await currentStore(userId);
  if (existing) {
    res.status(409).json({ error: "This account already has a store" });
    return;
  }
  try {
    const [store] = await db
      .insert(storesTable)
      .values({
        ownerClerkId: userId,
        name: parsed.data.name,
        subdomain: parsed.data.subdomain,
        country: parsed.data.country,
        category: parsed.data.category,
        theme: parsed.data.theme ?? "general",
      })
      .returning();
    res.status(201).json(CreateStoreResponse.parse(storeResponse(store)));
  } catch (error) {
    req.log.warn({ err: error }, "Store creation failed");
    res.status(409).json({ error: "That subdomain is already in use" });
  }
});

router.get("/storefront/:subdomain", async (req, res): Promise<void> => {
  const params = GetStorefrontParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [store] = await db.select().from(storesTable).where(eq(storesTable.subdomain, params.data.subdomain)).limit(1);
  if (!store) {
    res.status(404).json({ error: "Store not found" });
    return;
  }
  const products = await db
    .select()
    .from(productsTable)
    .where(and(eq(productsTable.storeId, store.id), eq(productsTable.status, "active")))
    .orderBy(desc(productsTable.createdAt));
  res.json(GetStorefrontResponse.parse({ store: storeResponse(store), products: products.map(productResponse) }));
});

router.get("/products", requireAuth, async (req, res): Promise<void> => {
  const query = GetProductsQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }
  const store = await currentStore(getUserId(req));
  if (!store) {
    res.status(404).json({ error: "Create a store before managing products" });
    return;
  }
  const filters = [eq(productsTable.storeId, store.id)];
  if (query.data.search) {
    filters.push(ilike(productsTable.name, `%${query.data.search}%`));
  }
  if (query.data.status && query.data.status !== "all") {
    filters.push(eq(productsTable.status, query.data.status));
  }
  const products = await db.select().from(productsTable).where(and(...filters)).orderBy(desc(productsTable.createdAt));
  res.json(GetProductsResponse.parse(products.map(productResponse)));
});

router.post("/products", requireAuth, async (req, res): Promise<void> => {
  const parsed = CreateProductBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const store = await currentStore(getUserId(req));
  if (!store) {
    res.status(404).json({ error: "Create a store before adding products" });
    return;
  }
  try {
    const [product] = await db.insert(productsTable).values({
      storeId: store.id,
      name: parsed.data.name,
      sku: parsed.data.sku,
      description: parsed.data.description,
      priceCents: Math.round(parsed.data.price * 100),
      compareAtPriceCents: parsed.data.compareAtPrice == null ? null : Math.round(parsed.data.compareAtPrice * 100),
      stock: parsed.data.stock,
      lowStockThreshold: parsed.data.lowStockThreshold,
      category: parsed.data.category,
      status: parsed.data.status,
      imageUrl: parsed.data.imageUrl ?? null,
      weightGrams: parsed.data.weightGrams,
    }).returning();
    res.status(201).json(CreateProductResponse.parse(productResponse(product)));
  } catch (error) {
    req.log.warn({ err: error }, "Product creation failed");
    res.status(409).json({ error: "That SKU is already in use in this store" });
  }
});

router.patch("/products/:id", requireAuth, async (req, res): Promise<void> => {
  const params = UpdateProductParams.safeParse(req.params);
  const parsed = UpdateProductBody.safeParse(req.body);
  if (!params.success || !parsed.success) {
    const message = !params.success
      ? params.error.message
      : !parsed.success
        ? parsed.error.message
        : "Invalid request";
    res.status(400).json({ error: message });
    return;
  }
  const store = await currentStore(getUserId(req));
  if (!store) {
    res.status(404).json({ error: "Store not found" });
    return;
  }
  const [existing] = await db.select().from(productsTable)
    .where(and(eq(productsTable.id, params.data.id), eq(productsTable.storeId, store.id)));
  if (!existing) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  const data = parsed.data;
  const [product] = await db.update(productsTable).set({
    ...(data.name !== undefined ? { name: data.name } : {}),
    ...(data.description !== undefined ? { description: data.description } : {}),
    ...(data.price !== undefined ? { priceCents: Math.round(data.price * 100) } : {}),
    ...(data.compareAtPrice !== undefined ? { compareAtPriceCents: data.compareAtPrice == null ? null : Math.round(data.compareAtPrice * 100) } : {}),
    ...(data.stock !== undefined ? { stock: data.stock } : {}),
    ...(data.category !== undefined ? { category: data.category } : {}),
    ...(data.status !== undefined ? { status: data.status } : {}),
    ...(data.imageUrl !== undefined ? { imageUrl: data.imageUrl ?? null } : {}),
    ...(data.weightGrams !== undefined ? { weightGrams: data.weightGrams } : {}),
  }).where(eq(productsTable.id, existing.id)).returning();
  res.json(UpdateProductResponse.parse(productResponse(product)));
});

router.delete("/products/:id", requireAuth, async (req, res): Promise<void> => {
  const params = UpdateProductParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const store = await currentStore(getUserId(req));
  if (!store) {
    res.status(404).json({ error: "Store not found" });
    return;
  }
  const [product] = await db.update(productsTable).set({ status: "archived" })
    .where(and(eq(productsTable.id, params.data.id), eq(productsTable.storeId, store.id))).returning();
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  res.sendStatus(204);
});

router.get("/orders", requireAuth, async (req, res): Promise<void> => {
  const query = GetOrdersQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }
  const store = await currentStore(getUserId(req));
  if (!store) {
    res.status(404).json({ error: "Create a store before managing orders" });
    return;
  }
  const filters = [eq(ordersTable.storeId, store.id)];
  if (query.data.search) {
    filters.push(ilike(ordersTable.customerName, `%${query.data.search}%`));
  }
  if (query.data.status && query.data.status !== "all") {
    filters.push(eq(ordersTable.status, query.data.status));
  }
  const orders = await db.select().from(ordersTable).where(and(...filters)).orderBy(desc(ordersTable.createdAt));
  res.json(GetOrdersResponse.parse(orders.map(orderResponse)));
});

router.post("/orders", requireAuth, async (req, res): Promise<void> => {
  const parsed = CreateOrderBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const store = await currentStore(getUserId(req));
  if (!store) {
    res.status(404).json({ error: "Store not found" });
    return;
  }
  const order = await db.transaction(async (tx) => {
    const items: Array<{ product: typeof productsTable.$inferSelect; quantity: number }> = [];
    for (const item of parsed.data.items) {
      const [product] = await tx.select().from(productsTable)
        .where(and(eq(productsTable.id, item.productId), eq(productsTable.storeId, store.id)));
      if (!product || product.stock < item.quantity || product.status !== "active") {
        throw new Error("One or more products are unavailable");
      }
      items.push({ product, quantity: item.quantity });
    }
    const existingCustomer = await tx.select().from(customersTable)
      .where(and(eq(customersTable.storeId, store.id), eq(customersTable.phone, parsed.data.customerPhone))).limit(1);
    const [customer] = existingCustomer.length > 0
      ? existingCustomer
      : await tx.insert(customersTable).values({
        storeId: store.id,
        name: parsed.data.customerName,
        phone: parsed.data.customerPhone,
        email: parsed.data.email ?? null,
        address: parsed.data.address,
        city: parsed.data.city,
        country: parsed.data.country,
      }).returning();
    if (existingCustomer.length > 0) {
      await tx.update(customersTable).set({
        name: parsed.data.customerName,
        email: parsed.data.email ?? customer.email,
        address: parsed.data.address,
        city: parsed.data.city,
        lastOrderAt: new Date(),
      }).where(eq(customersTable.id, customer.id));
    }
    const totalCents = items.reduce((sum, item) => sum + item.product.priceCents * item.quantity, 0);
    const itemsCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const [created] = await tx.insert(ordersTable).values({
      storeId: store.id,
      customerId: customer.id,
      number: `ZAEEM-${Date.now()}`,
      customerName: parsed.data.customerName,
      customerPhone: parsed.data.customerPhone,
      customerCity: parsed.data.city,
      address: parsed.data.address,
      country: parsed.data.country,
      notes: parsed.data.notes ?? null,
      totalCents,
      itemsCount,
    }).returning();
    await tx.insert(orderItemsTable).values(items.map((item) => ({
      orderId: created.id,
      productId: item.product.id,
      productName: item.product.name,
      quantity: item.quantity,
      unitPriceCents: item.product.priceCents,
    })));
    for (const item of items) {
      await tx.update(productsTable).set({ stock: sql`${productsTable.stock} - ${item.quantity}` })
        .where(eq(productsTable.id, item.product.id));
    }
    await tx.update(customersTable).set({
      ordersCount: sql`${customersTable.ordersCount} + 1`,
      totalSpentCents: sql`${customersTable.totalSpentCents} + ${totalCents}`,
      lastOrderAt: created.createdAt,
    }).where(eq(customersTable.id, customer.id));
    return created;
  });
  res.status(201).json(CreateOrderResponse.parse(orderResponse(order)));
});

router.patch("/orders/:id", requireAuth, async (req, res): Promise<void> => {
  const params = UpdateOrderParams.safeParse(req.params);
  const parsed = UpdateOrderBody.safeParse(req.body);
  if (!params.success || !parsed.success) {
    const message = !params.success
      ? params.error.message
      : !parsed.success
        ? parsed.error.message
        : "Invalid request";
    res.status(400).json({ error: message });
    return;
  }
  const store = await currentStore(getUserId(req));
  if (!store) {
    res.status(404).json({ error: "Store not found" });
    return;
  }
  const [order] = await db.update(ordersTable).set({ status: parsed.data.status })
    .where(and(eq(ordersTable.id, params.data.id), eq(ordersTable.storeId, store.id))).returning();
  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }
  res.json(UpdateOrderResponse.parse(orderResponse(order)));
});

router.get("/customers", requireAuth, async (req, res): Promise<void> => {
  const query = GetCustomersQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }
  const store = await currentStore(getUserId(req));
  if (!store) {
    res.status(404).json({ error: "Store not found" });
    return;
  }
  const filters = [eq(customersTable.storeId, store.id)];
  if (query.data.search) {
    filters.push(ilike(customersTable.name, `%${query.data.search}%`));
  }
  const customers = await db.select().from(customersTable).where(and(...filters)).orderBy(desc(customersTable.lastOrderAt));
  res.json(GetCustomersResponse.parse(customers.map((customer) => ({
    id: customer.id,
    name: customer.name,
    phone: customer.phone,
    email: customer.email,
    city: customer.city,
    ordersCount: customer.ordersCount,
    totalSpent: customer.totalSpentCents / 100,
    lastOrderAt: customer.lastOrderAt?.toISOString() ?? null,
    segment: customer.ordersCount >= 5 ? "vip" : customer.ordersCount > 1 ? "returning" : "new",
  }))));
});

router.get("/dashboard/summary", requireAuth, async (req, res): Promise<void> => {
  const store = await currentStore(getUserId(req));
  if (!store) {
    res.status(404).json({ error: "Create a store to see your dashboard" });
    return;
  }
  const [revenueRow] = await db.select({ value: sql<number>`coalesce(sum(${ordersTable.totalCents}), 0)` })
    .from(ordersTable).where(and(eq(ordersTable.storeId, store.id), eq(ordersTable.status, "delivered")));
  const [ordersRow] = await db.select({ value: count() }).from(ordersTable).where(eq(ordersTable.storeId, store.id));
  const [customersRow] = await db.select({ value: count() }).from(customersTable).where(eq(customersTable.storeId, store.id));
  const [lowStockRow] = await db.select({ value: count() }).from(productsTable)
    .where(and(eq(productsTable.storeId, store.id), sql`${productsTable.stock} <= ${productsTable.lowStockThreshold}`, eq(productsTable.status, "active")));
  const latest = await db.select().from(ordersTable).where(eq(ordersTable.storeId, store.id)).orderBy(desc(ordersTable.createdAt)).limit(6);
  const revenue = Number(revenueRow?.value ?? 0) / 100;
  const orders = Number(ordersRow?.value ?? 0);
  res.json(GetDashboardSummaryResponse.parse({
    revenue,
    orders,
    customers: Number(customersRow?.value ?? 0),
    averageOrderValue: orders > 0 ? revenue / orders : 0,
    revenueChange: null,
    freeOrdersRemaining: Math.max(0, store.orderLimit - orders),
    orderLimit: store.orderLimit,
    lowStockCount: Number(lowStockRow?.value ?? 0),
    latestOrders: latest.map(orderResponse),
  }));
});

router.get("/plans", async (_req, res): Promise<void> => {
  let plans = await db.select().from(subscriptionPlansTable).orderBy(subscriptionPlansTable.id);
  if (plans.length === 0) {
    await db.insert(subscriptionPlansTable).values([
      { name: "Growth", monthlyPrice: 300, annualDiscount: 0, description: "للبدء والنمو بثقة", features: ["متجر إلكتروني", "منتجات ومخزون أساسي", "10 طلبات مجانية شهرياً"] },
      { name: "Scale", monthlyPrice: 500, annualDiscount: 0.1, description: "للأعمال التي تستعد للتوسع", features: ["طلبات ومنتجات غير محدودة", "نطاق مخصص", "تحليلات متقدمة", "كوبونات وخصومات"] },
    ]);
    plans = await db.select().from(subscriptionPlansTable).orderBy(subscriptionPlansTable.id);
  }
  res.json(GetPlansResponse.parse(plans.map((plan) => ({
    id: plan.id,
    name: plan.name,
    monthlyPrice: plan.monthlyPrice,
    annualDiscount: plan.annualDiscount,
    annualPrice: plan.monthlyPrice * 12 * (1 - plan.annualDiscount),
    description: plan.description,
    features: plan.features,
  }))));
});

router.get("/admin/summary", requireAdmin, async (_req, res): Promise<void> => {
  const [storesRow] = await db.select({ value: count() }).from(storesTable);
  const [activeRow] = await db.select({ value: count() }).from(storesTable).where(eq(storesTable.status, "published"));
  const [freeRow] = await db.select({ value: count() }).from(storesTable).where(eq(storesTable.plan, "free"));
  const [paidRow] = await db.select({ value: count() }).from(storesTable).where(sql`${storesTable.plan} <> 'free'`);
  const [ordersRow] = await db.select({ value: count() }).from(ordersTable);
  const [revenueRow] = await db.select({ value: sql<number>`coalesce(sum(${ordersTable.totalCents}), 0)` }).from(ordersTable);
  res.json(GetAdminSummaryResponse.parse({
    totalMerchants: Number(storesRow?.value ?? 0),
    activeMerchants: Number(activeRow?.value ?? 0),
    freeMerchants: Number(freeRow?.value ?? 0),
    paidMerchants: Number(paidRow?.value ?? 0),
    orders: Number(ordersRow?.value ?? 0),
    revenue: Number(revenueRow?.value ?? 0) / 100,
    mrr: 0,
    pendingPayments: 0,
  }));
});

export default router;