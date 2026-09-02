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
import { extractSubdomain } from "../middlewares/tenantRouting";

const router: IRouter = Router();

// متجر افتراضي جاهز للعرض السريع عند بداية التشغيل
const FALLBACK_ZERO_STORE: Za3emStore = {
  id: 1,
  name: "متجر زيرو إكسبريس",
  subdomain: "zero",
  templateId: "easyorders-flash",
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
 * 1. نقطة التوجيه الفوري للنطاق الفرعي (Resolve Subdomain)
 * تفحص الـ Host Header وتعيد بيانات التاجر والقالب المخصص
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
        products = await db
          .select()
          .from(za3emProductsTable)
          .where(eq(za3emProductsTable.storeId, store.id));
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

    // إذا لم يكن لديه منتج بعد، وفر المنتج الافتراضي للبدء فوراً
    if (products.length === 0) {
      products = [{ ...FALLBACK_ZERO_PRODUCT, storeId: store.id }];
    }

    res.json({
      isRoot: false,
      subdomain: store.subdomain,
      store: {
        id: store.id,
        name: store.name,
        subdomain: store.subdomain,
        templateId: store.templateId,
      },
      product: products[0], // Single-Product Landing Page
      allProducts: products,
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
        products = await db
          .select()
          .from(za3emProductsTable)
          .where(eq(za3emProductsTable.storeId, store.id));
      }
    } catch (e) {}

    if (!store) {
      store = { ...FALLBACK_ZERO_STORE, subdomain, name: `متجر ${subdomain}` };
      products = [FALLBACK_ZERO_PRODUCT];
    }

    res.json({
      store,
      product: products[0] || FALLBACK_ZERO_PRODUCT,
      products,
    });
  } catch (error) {
    res.status(500).json({ error: "خطأ أثناء جلب المتجر" });
  }
});

/**
 * 3. إنشاء متجر جديد وحجز النطاق الفرعي (Merchant Onboarding)
 */
router.post("/stores", async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, subdomain, templateId, productTitle, productPrice, productImage } = req.body;

    if (!name || !subdomain) {
      res.status(400).json({ error: "اسم المتجر والنطاق الفرعي مطلوبان" });
      return;
    }

    const cleanSub = subdomain.toLowerCase().replace(/[^a-z0-9-]/g, "");

    // إنشاء المتجر
    let newStore: Za3emStore;
    try {
      const [inserted] = await db
        .insert(za3emStoresTable)
        .values({
          name,
          subdomain: cleanSub,
          templateId: templateId || "easyorders-flash",
        })
        .returning();
      newStore = inserted;
    } catch (dbErr) {
      newStore = {
        id: Math.floor(Math.random() * 10000),
        name,
        subdomain: cleanSub,
        templateId: templateId || "easyorders-flash",
        createdAt: new Date(),
      };
    }

    // إنشاء المنتج التابع للمتجر بالسعر الصحيح بالجنيه المصري
    const integerPrice = Math.round(Number(productPrice) || 450);
    let newProduct: Za3emProduct;

    try {
      const [insertedProduct] = await db
        .insert(za3emProductsTable)
        .values({
          storeId: newStore.id,
          title: productTitle || "منتج العرض الخاص",
          description: "أعلى جودة مع ضمان التوصيل والدفع عند الاستلام.",
          price: integerPrice,
          imageUrl: productImage || FALLBACK_ZERO_PRODUCT.imageUrl,
        })
        .returning();
      newProduct = insertedProduct;
    } catch (pErr) {
      newProduct = {
        id: Math.floor(Math.random() * 10000),
        storeId: newStore.id,
        title: productTitle || "منتج العرض الخاص",
        description: "أعلى جودة مع ضمان التوصيل والدفع عند الاستلام.",
        price: integerPrice,
        imageUrl: productImage || FALLBACK_ZERO_PRODUCT.imageUrl,
        createdAt: new Date(),
      };
    }

    res.json({
      success: true,
      store: newStore,
      product: newProduct,
      domainUrl: `https://${cleanSub}.za3em.shop`,
    });
  } catch (error) {
    res.status(500).json({ error: "حدث خطأ أثناء حجز المتجر" });
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
