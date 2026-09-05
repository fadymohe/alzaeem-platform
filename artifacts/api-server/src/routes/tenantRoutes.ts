import { Router, type IRouter, Request, Response } from "express";
import { and, desc, eq, or } from "drizzle-orm";
import {
  db,
  za3emStoresTable,
  za3emProductsTable,
  za3emOrdersTable,
  type Za3emStore,
  type Za3emProduct,
} from "@workspace/db";
import {
  dispatchShipmentToCourier,
  queryLiveCourierTracking,
} from "../services/shippingService";
import { extractSubdomain, RESERVED_SUBDOMAINS } from "../middlewares/tenantRouting";

const router: IRouter = Router();

// متجر افتراضي جاهز للعرض السريع عند بداية التشغيل
const FALLBACK_ZERO_STORE: Za3emStore = {
  id: 1,
  name: "متجر زيرو إكسبريس",
  subdomain: "zero",
  templateId: "easyorders-flash",
  storeCode: "ZAEEM-ZERO-1001",
  slogan: "متجر تجريبي لاختبار طلبات الشحن السريع",
  logoUrl: null,
  bannerUrl: null,
  categories: ["عام"],
  product: {
    id: 1,
    title: "سماعة بلوتوث لاسلكية Ultra Bass عازلة للضوضاء - إصدار 2026",
    price: 45000,
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
    compareAtPrice: 58000,
  },
  userEmail: null,
  ownerId: null,
  createdAt: new Date(),
};

const FALLBACK_ZERO_PRODUCT: Za3emProduct = {
  id: 1,
  storeId: 1,
  title: "سماعة بلوتوث لاسلكية Ultra Bass عازلة للضوضاء - إصدار 2026",
  description:
    "سماعة رأس احترافية مع صوت محيطي 3D نقي وعزل تام للضوضاء، بطارية عملاقة تدوم 48 ساعة متواصلة مع شحن سريع Type-C، متوافقة مع جميع أنواع الهواتف الذكية مع ضمان استبدال رسمي لمدة سنة كاملة.",
  price: 450, // 450 جنيه مصري صحيح بدون قروش
  imageUrl:
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
  createdAt: new Date(),
};

/**
 * 0. فحص توفر الدومين الفرعي من قاعدة البيانات مباشرة (Check Subdomain Availability)
 */
router.get("/check-subdomain", async (req: Request, res: Response): Promise<void> => {
  const rawSub = (req.query.subdomain || req.query.slug || "").toString().toLowerCase().trim();
  const cleanSub = rawSub.replace(".za3em.shop", "").replace(/[^a-z0-9-]/g, "");

  if (!cleanSub) {
    res.status(400).json({ available: false, reason: "short", message: "يرجى إدخال اسم الدومين الفرعي" });
    return;
  }
  if (cleanSub.length < 3) {
    res.json({ available: false, reason: "short", message: "يجب أن يتكون الدومين من 3 أحرف على الأقل" });
    return;
  }
  if (RESERVED_SUBDOMAINS.has(cleanSub)) {
    res.json({ available: false, reason: "reserved", message: "هذا النطاق محجوز للاستخدام الخاص بإدارة المنصة وغير متاح" });
    return;
  }

  try {
    const existing = await db
      .select()
      .from(za3emStoresTable)
      .where(eq(za3emStoresTable.subdomain, cleanSub))
      .limit(1);

    if (existing.length > 0) {
      res.json({
        available: false,
        reason: "taken",
        message: `هذا النطاق (${cleanSub}.za3em.shop) محجوز مسبقاً لمتجر آخر في قاعدة البيانات`,
        suggestions: [`${cleanSub}-store`, `${cleanSub}-shop`, `${cleanSub}-iq`, `${cleanSub}2026`]
      });
      return;
    }

    res.json({
      available: true,
      subdomain: cleanSub,
      message: `النطاق (${cleanSub}.za3em.shop) متاح ويمكنك حجزه فوراً ✅`
    });
  } catch (err) {
    console.error("Check subdomain DB error:", err);
    res.status(500).json({ available: false, error: "فشل التحقق من قاعدة البيانات" });
  }
});

/**
 * 0.1 جلب متجر التاجر بناءً على بريده أو رمز الحساب لتخطي Onboarding عند تسجيل الدخول
 */
router.get("/user-store", async (req: Request, res: Response): Promise<void> => {
  const email = (req.query.email as string || "").trim().toLowerCase();
  const ownerId = (req.query.ownerId as string || "").trim();

  if (!email && !ownerId) {
    res.status(400).json({ hasStore: false, error: "البريد الإلكتروني أو رمز الحساب مطلوب" });
    return;
  }

  try {
    let stores: Za3emStore[] = [];
    if (email && ownerId) {
      stores = await db
        .select()
        .from(za3emStoresTable)
        .where(or(eq(za3emStoresTable.userEmail, email), eq(za3emStoresTable.ownerId, ownerId)))
        .limit(1);
    } else if (email) {
      stores = await db
        .select()
        .from(za3emStoresTable)
        .where(eq(za3emStoresTable.userEmail, email))
        .limit(1);
    } else {
      stores = await db
        .select()
        .from(za3emStoresTable)
        .where(eq(za3emStoresTable.ownerId, ownerId))
        .limit(1);
    }

    if (stores.length === 0) {
      res.json({ hasStore: false });
      return;
    }

    const store = stores[0];
    res.json({
      hasStore: true,
      store: {
        id: store.id,
        name: store.name,
        storeName: store.name,
        subdomain: store.subdomain,
        templateId: store.templateId,
        storeCode: store.storeCode,
        slogan: store.slogan,
        logoUrl: store.logoUrl,
        bannerUrl: store.bannerUrl,
        categories: store.categories || ["عام"],
        product: store.product,
      }
    });
  } catch (err) {
    console.error("Fetch user store error:", err);
    res.status(500).json({ hasStore: false, error: "فشل استرجاع بيانات المتجر من قاعدة البيانات" });
  }
});

/**
 * 1. نقطة التوجيه الفوري للنطاق الفرعي (Resolve Subdomain)
 * تفحص الـ Host Header وتعيد بيانات التاجر والقالب المخصص والمنتج
 */
router.get("/resolve", async (req: Request, res: Response): Promise<void> => {
  const hostHeader = (req.headers["x-forwarded-host"] as string) || req.headers.host;
  const manualSub = (req.query.subdomain as string) || (req.headers["x-tenant-subdomain"] as string);

  let { subdomain, isRoot } = extractSubdomain(hostHeader);

  if (manualSub) {
    subdomain = manualSub.toLowerCase();
    isRoot = false;
  }

  // إذا كان الطلب على النطاق الأساسي (za3em.shop أو www.za3em.shop)
  if (isRoot || !subdomain) {
    res.json({
      isRoot: true,
      subdomain: null,
      message: "مرحباً بك في بوابة za3em.shop الرئيسية لإنشاء وحجز المتاجر",
    });
    return;
  }

  try {
    // استعلام قاعدة البيانات لجلب المتجر بناءً على النطاق الفرعي
    let store: Za3emStore | undefined;
    let products: Za3emProduct[] = [];

    try {
      const stores = await db
        .select()
        .from(za3emStoresTable)
        .where(eq(za3emStoresTable.subdomain, subdomain))
        .limit(1);

      if (stores.length > 0) {
        store = stores[0];
        try {
          products = await db
            .select()
            .from(za3emProductsTable)
            .where(eq(za3emProductsTable.storeId, store.id));
        } catch {}
      }
    } catch (dbErr) {
      console.warn("DB query fallback:", dbErr);
    }

    // إذا كان النطاق zero أو لم يتم إدخال بيانات في الـ DB بعد
    if (!store && (subdomain === "zero" || subdomain === "demo")) {
      store = { ...FALLBACK_ZERO_STORE, subdomain };
      products = [FALLBACK_ZERO_PRODUCT];
    }

    if (!store) {
      res.status(404).json({
        isRoot: false,
        error: `المتجر ذو النطاق الفرعي (${subdomain}.za3em.shop) غير موجود أو بانتظار التفعيل`,
      });
      return;
    }

    // استخراج المنتج المخصص المخزن مع المتجر أو من جدول المنتجات
    let mainProduct: any = store.product;
    if (!mainProduct && products.length > 0) {
      mainProduct = products[0];
    }
    if (!mainProduct) {
      mainProduct = { ...FALLBACK_ZERO_PRODUCT, storeId: store.id };
    }

    res.json({
      isRoot: false,
      subdomain: store.subdomain,
      store: {
        id: store.id,
        name: store.name,
        subdomain: store.subdomain,
        templateId: store.templateId,
        storeCode: store.storeCode,
        logoUrl: store.logoUrl,
        bannerUrl: store.bannerUrl,
        slogan: store.slogan,
        categories: store.categories || ["عام"],
      },
      product: mainProduct,
      allProducts: products.length > 0 ? products : [mainProduct],
    });
  } catch (error) {
    console.error("Failed to resolve tenant store:", error);
    res.status(500).json({ error: "فشل استرجاع بيانات النطاق الفرعي" });
  }
});

/**
 * 2. جلب بيانات متجر محدد بالنطاق الفرعي
 */
router.get("/stores/:subdomain", async (req: Request, res: Response): Promise<void> => {
  const rawSub = Array.isArray(req.params.subdomain) ? req.params.subdomain[0] : req.params.subdomain;
  const subdomain = (rawSub || "").toLowerCase().trim();

  try {
    let store: Za3emStore | undefined;
    let products: Za3emProduct[] = [];

    try {
      const stores = await db
        .select()
        .from(za3emStoresTable)
        .where(eq(za3emStoresTable.subdomain, subdomain))
        .limit(1);

      if (stores.length > 0) {
        store = stores[0];
        try {
          products = await db
            .select()
            .from(za3emProductsTable)
            .where(eq(za3emProductsTable.storeId, store.id));
        } catch {}
      }
    } catch (e) {}

    if (!store) {
      if (subdomain === "zero" || subdomain === "demo") {
        store = { ...FALLBACK_ZERO_STORE, subdomain };
        products = [FALLBACK_ZERO_PRODUCT];
      } else {
        res.status(404).json({ error: "المتجر غير موجود" });
        return;
      }
    }

    let mainProduct: any = store.product;
    if (!mainProduct && products.length > 0) {
      mainProduct = products[0];
    }
    if (!mainProduct) {
      mainProduct = { ...FALLBACK_ZERO_PRODUCT, storeId: store.id };
    }

    res.json({
      store,
      product: mainProduct,
      products: products.length > 0 ? products : [mainProduct],
    });
  } catch (error) {
    res.status(500).json({ error: "خطأ أثناء جلب المتجر" });
  }
});

/**
 * 3. إنشاء متجر جديد وحجز النطاق الفرعي نهائياً في قاعدة البيانات (Merchant Onboarding)
 */
router.post("/stores", async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name,
      subdomain,
      templateId,
      storeCode,
      userEmail,
      ownerId,
      slogan,
      logoUrl,
      bannerUrl,
      categories,
      productTitle,
      productPrice,
      productImage,
      productCompareAtPrice,
      productDescription,
      productCategory,
      product: inputProduct,
    } = req.body;

    if (!name || !subdomain) {
      res.status(400).json({ error: "اسم المتجر والنطاق الفرعي مطلوبان" });
      return;
    }

    const cleanSub = subdomain.toLowerCase().replace(".za3em.shop", "").replace(/[^a-z0-9-]/g, "");

    if (RESERVED_SUBDOMAINS.has(cleanSub)) {
      res.status(400).json({ error: "هذا النطاق الفرعي محجوز للإدارة ويمنع استخدامه" });
      return;
    }

    // التحقق مما إذا كان الدومين محجوزاً مسبقاً
    const existing = await db
      .select()
      .from(za3emStoresTable)
      .where(eq(za3emStoresTable.subdomain, cleanSub))
      .limit(1);

    const generatedCode = storeCode || `ZAEEM-${cleanSub.toUpperCase().slice(0, 4)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const integerPrice = Math.round(Number(inputProduct?.price || productPrice) || 45000);
    const resolvedProduct = {
      id: 1,
      title: inputProduct?.title || inputProduct?.name || productTitle || "منتج العرض الخاص",
      name: inputProduct?.name || inputProduct?.title || productTitle || "منتج العرض الخاص",
      price: integerPrice,
      compareAtPrice: Math.round(Number(inputProduct?.compareAtPrice || productCompareAtPrice) || integerPrice * 1.3),
      imageUrl: inputProduct?.imageUrl || inputProduct?.image || productImage || FALLBACK_ZERO_PRODUCT.imageUrl,
      image: inputProduct?.image || inputProduct?.imageUrl || productImage || FALLBACK_ZERO_PRODUCT.imageUrl,
      description: inputProduct?.description || productDescription || slogan || "أعلى جودة مع ضمان التوصيل والدفع عند الاستلام.",
      category: inputProduct?.category || productCategory || "عام",
    };

    let newStore: Za3emStore;

    if (existing.length > 0) {
      // تحديث المتجر المحجوز مسبقاً لنفس النطاق
      const [updated] = await db
        .update(za3emStoresTable)
        .set({
          name,
          templateId: templateId || "shoppingcart.1.2.7",
          storeCode: generatedCode,
          userEmail: userEmail ? userEmail.toLowerCase().trim() : existing[0].userEmail,
          ownerId: ownerId || existing[0].ownerId,
          slogan: slogan || existing[0].slogan,
          logoUrl: logoUrl || existing[0].logoUrl,
          bannerUrl: bannerUrl || existing[0].bannerUrl,
          categories: categories || existing[0].categories || ["عام"],
          product: resolvedProduct,
        })
        .where(eq(za3emStoresTable.id, existing[0].id))
        .returning();
      newStore = updated;
    } else {
      // إدراج متجر جديد وحجز الدومين الفرعي فعلياً في قاعدة البيانات
      const [inserted] = await db
        .insert(za3emStoresTable)
        .values({
          name,
          subdomain: cleanSub,
          templateId: templateId || "shoppingcart.1.2.7",
          storeCode: generatedCode,
          userEmail: userEmail ? userEmail.toLowerCase().trim() : null,
          ownerId: ownerId || null,
          slogan: slogan || "أفضل المنتجات مع التوصيل السريع لجميع المحافظات والدفع عند الاستلام",
          logoUrl: logoUrl || null,
          bannerUrl: bannerUrl || null,
          categories: categories || ["عام"],
          product: resolvedProduct,
        })
        .returning();
      newStore = inserted;
    }

    // إدراج المنتج في جدول za3em_products لمطابقة معايير المتجر
    try {
      const existingProds = await db
        .select()
        .from(za3emProductsTable)
        .where(eq(za3emProductsTable.storeId, newStore.id))
        .limit(1);

      if (existingProds.length > 0) {
        await db
          .update(za3emProductsTable)
          .set({
            title: resolvedProduct.title,
            description: resolvedProduct.description,
            price: resolvedProduct.price,
            imageUrl: resolvedProduct.imageUrl,
          })
          .where(eq(za3emProductsTable.id, existingProds[0].id));
      } else {
        await db.insert(za3emProductsTable).values({
          storeId: newStore.id,
          title: resolvedProduct.title,
          description: resolvedProduct.description,
          price: resolvedProduct.price,
          imageUrl: resolvedProduct.imageUrl,
        });
      }
    } catch (prodErr) {
      console.warn("Product sync table notice:", prodErr);
    }

    res.json({
      success: true,
      store: newStore,
      product: resolvedProduct,
      domainUrl: `https://${cleanSub}.za3em.shop`,
    });
  } catch (error) {
    console.error("Failed to register store in DB:", error);
    res.status(500).json({ error: "حدث خطأ أثناء حجز المتجر في قاعدة البيانات" });
  }
});

/**
 * 4. إنشاء طلب دفع عند الاستلام والربط التلقائي بشركة الشحن (Place Order & Auto Dispatch)
 */
router.post("/orders", async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      storeId,
      productId,
      customerName,
      customerPhone,
      customerAddress,
      governorate,
      quantity = 1,
      shippingCost = 45,
      unitPrice,
      notes,
    } = req.body;

    if (!customerName || !customerPhone || !customerAddress || !governorate) {
      res.status(400).json({ error: "بيانات العميل والعنوان والمحافظة مطلوبة بالكامل" });
      return;
    }

    // الحساب بالجنيه المصري الصحيح حصراً بدون أي كسور
    const pricePerUnit = Math.round(Number(unitPrice) || 450);
    const shipFee = Math.round(Number(shippingCost) || 45);
    const qty = Math.max(1, Math.round(Number(quantity) || 1));
    const totalAmount = Math.round(pricePerUnit * qty + shipFee);

    // 1. إنشاء سجل الطلب في قاعدة البيانات
    let orderId = Date.now();
    let savedOrder: any = null;

    try {
      const [inserted] = await db
        .insert(za3emOrdersTable)
        .values({
          storeId: Number(storeId) || 1,
          productId: Number(productId) || 1,
          customerName,
          customerPhone,
          customerAddress,
          governorate,
          totalAmount,
          shippingCost: shipFee,
          shippingCompany: "Bosta Express",
          status: "pending",
        })
        .returning();

      savedOrder = inserted;
      orderId = inserted.id;
    } catch (e) {
      console.warn("Using fallback in-memory order tracking:", e);
    }

    // 2. استدعاء وظيفة الـ Shipping API لإرسال الشحنة لشركة الشحن وتوليد البوليصة
    const dispatchResult = await dispatchShipmentToCourier({
      orderId,
      customerName,
      customerPhone,
      customerAddress,
      governorate,
      codAmount: totalAmount,
      notes: notes || `طلب شراء منتج واحد (الكمية: ${qty})`,
    });

    // 3. تحديث الطلب برقم البوليصة واسم شركة الشحن
    if (savedOrder && dispatchResult.trackingNumber) {
      try {
        await db
          .update(za3emOrdersTable)
          .set({
            trackingNumber: dispatchResult.trackingNumber,
            shippingCompany: dispatchResult.shippingCompany,
            status: "processing",
          })
          .where(eq(za3emOrdersTable.id, orderId));
      } catch (updErr) {
        console.warn("Failed to update tracking in DB:", updErr);
      }
    }

    res.json({
      success: true,
      order: {
        id: orderId,
        customerName,
        customerPhone,
        governorate,
        totalAmount,
        shippingCost: shipFee,
        currency: "EGP", // جنيه مصري
        status: "processing",
      },
      shipping: {
        trackingNumber: dispatchResult.trackingNumber,
        waybillUrl: dispatchResult.waybillUrl,
        shippingCompany: dispatchResult.shippingCompany,
        estimatedDeliveryDays: dispatchResult.estimatedDeliveryDays,
      },
      message: "تم تسجيل طلبك وإصدار بوليصة الشحن بنجاح",
    });
  } catch (error) {
    console.error("Order processing error:", error);
    res.status(500).json({ error: "فشل إتمام الطلب وإرسال الشحنة" });
  }
});

/**
 * 5. الاستعلام الحي عن تتبع الشحنة برقم البوليصة أو رقم هاتف العميل أو رقم الطلب
 */
router.get("/track", async (req: Request, res: Response): Promise<void> => {
  const query = (req.query.q as string || req.query.tracking_number as string || "").trim();

  if (!query) {
    res.status(400).json({ error: "يرجى إدخال رقم الطلب أو رقم الهاتف أو رقم البوليصة" });
    return;
  }

  try {
    let orderMatch: any = null;

    // محاولة العثور على الطلب في قاعدة البيانات
    try {
      const orders = await db
        .select()
        .from(za3emOrdersTable)
        .where(
          or(
            eq(za3emOrdersTable.trackingNumber, query),
            eq(za3emOrdersTable.customerPhone, query),
            eq(za3emOrdersTable.id, isNaN(Number(query)) ? -1 : Number(query))
          )
        )
        .orderBy(desc(za3emOrdersTable.createdAt))
        .limit(1);

      if (orders.length > 0) {
        orderMatch = orders[0];
      }
    } catch (e) {}

    const trackingNum = orderMatch?.trackingNumber || (query.startsWith("BST-") ? query : `BST-EG-${query.slice(-7)}`);

    const trackingData = await queryLiveCourierTracking(trackingNum, {
      customerName: orderMatch?.customerName || "عميل منصة الزعيم",
      governorate: orderMatch?.governorate || "القاهرة",
      totalAmount: orderMatch?.totalAmount || 495,
      createdAt: orderMatch?.createdAt || new Date(),
      status: orderMatch?.status || "out_for_delivery",
    });

    res.json({
      success: true,
      tracking: trackingData,
      order: orderMatch
        ? {
            id: orderMatch.id,
            customerName: orderMatch.customerName,
            customerPhone: orderMatch.customerPhone,
            governorate: orderMatch.governorate,
            totalAmount: orderMatch.totalAmount,
            createdAt: orderMatch.createdAt,
          }
        : null,
    });
  } catch (error) {
    res.status(500).json({ error: "تعذر استرجاع تفاصيل التتبع حالياً" });
  }
});

export default router;
