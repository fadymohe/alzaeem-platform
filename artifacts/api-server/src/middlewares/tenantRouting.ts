import { Request, Response, NextFunction } from "express";
import { db, za3emStoresTable, za3emProductsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

// تعريف أنواع الطلب لتشمل بيانات النطاق الفرعي والمتجر
declare global {
  namespace Express {
    interface Request {
      tenantSubdomain?: string;
      isRootDomain?: boolean;
      tenantStore?: any;
    }
  }
}

// النطاقات الفرعية المحجوزة التي لا يجب اعتبارها متاجر مستأجرين
export const RESERVED_SUBDOMAINS = new Set([
  "api",
  "admin",
  "www",
  "app",
  "static",
  "assets",
  "za3em",
  "home",
  "login",
  "register",
  "dashboard",
  "stores",
  "store",
  "track",
  "tracking",
]);

/**
 * استخراج النطاق الفرعي من Host Header
 * يدعم كلاً من:
 * - النطاق الحقيقي: zero.za3em.shop
 * - التطوير المحلي: zero.localhost:5000 أو zero.127.0.0.1.nip.io
 * - ترويسات البروكسي العكسي: x-forwarded-host
 */
export function extractSubdomain(hostHeader?: string): {
  subdomain: string | null;
  isRoot: boolean;
} {
  if (!hostHeader) {
    return { subdomain: null, isRoot: true };
  }

  // إزالة رقم المنفذ إن وجد (مثل :5000 أو :3000)
  const host = hostHeader.split(":")[0].toLowerCase().trim();

  // فحص النطاق الأساسي
  if (
    host === "za3em.shop" ||
    host === "www.za3em.shop" ||
    host === "localhost" ||
    host === "127.0.0.1"
  ) {
    return { subdomain: null, isRoot: true };
  }

  // مطابقة النطاق الفرعي لـ za3em.shop
  const za3emMatch = host.match(/^([a-z0-9-]+)\.za3em\.shop$/);
  if (za3emMatch) {
    const sub = za3emMatch[1];
    if (RESERVED_SUBDOMAINS.has(sub)) {
      return { subdomain: null, isRoot: true };
    }
    return { subdomain: sub, isRoot: false };
  }

  // مطابقة بيئة التطوير المحلي (مثل zero.localhost)
  const localMatch = host.match(/^([a-z0-9-]+)\.localhost$/);
  if (localMatch) {
    const sub = localMatch[1];
    if (RESERVED_SUBDOMAINS.has(sub)) {
      return { subdomain: null, isRoot: true };
    }
    return { subdomain: sub, isRoot: false };
  }

  // دعم الاستعلام اليدوي عن طريق Query Param في بيئات المعاينة المباشرة: ?subdomain=zero
  return { subdomain: null, isRoot: true };
}

/**
 * Wildcard Tenant Routing Middleware
 * برمجية وسيطة لفحص الـ Host Header وتوجيه المستأجر فورياً
 */
export function wildcardTenantMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const hostHeader = (req.headers["x-forwarded-host"] as string) || req.headers.host;
  
  // إمكانية تجاوز النطاق في بيئات التطوير/المعاينة عبر header أو query
  const querySub = req.query.tenant_subdomain as string;
  const headerSub = req.headers["x-tenant-subdomain"] as string;

  if (querySub && !RESERVED_SUBDOMAINS.has(querySub)) {
    req.tenantSubdomain = querySub.toLowerCase();
    req.isRootDomain = false;
    return next();
  }

  if (headerSub && !RESERVED_SUBDOMAINS.has(headerSub)) {
    req.tenantSubdomain = headerSub.toLowerCase();
    req.isRootDomain = false;
    return next();
  }

  const { subdomain, isRoot } = extractSubdomain(hostHeader);
  req.tenantSubdomain = subdomain || undefined;
  req.isRootDomain = isRoot;

  next();
}

/**
 * برمجية وسيطة لجلب بيانات التاجر والقالب المخصص برمجياً بناءً على النطاق الفرعي
 */
export async function resolveTenantStore(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const subdomain = req.tenantSubdomain || (req.params.subdomain as string);

  if (!subdomain) {
    if (req.isRootDomain) {
      return next();
    }
    res.status(400).json({ error: "لم يتم تحديد نطاق المتجر" });
    return;
  }

  try {
    // جلب المتجر من قاعدة البيانات
    const [store] = await db
      .select()
      .from(za3emStoresTable)
      .where(eq(za3emStoresTable.subdomain, subdomain.toLowerCase()))
      .limit(1);

    if (!store) {
      // متجر تجريبي افتراضي في حال لم يكن مسجلاً بعد في قاعدة البيانات
      if (subdomain.toLowerCase() === "zero") {
        req.tenantStore = {
          id: 1,
          name: "متجر زيرو إكسبريس",
          subdomain: "zero",
          templateId: "easyorders-flash",
          createdAt: new Date(),
        };
        return next();
      }

      res.status(404).json({
        error: `المتجر ذو النطاق الفرعي (${subdomain}.za3em.shop) غير موجود أو معلق`,
      });
      return;
    }

    req.tenantStore = store;
    next();
  } catch (error) {
    console.error("Error resolving tenant store:", error);
    // fallback gracefully for zero store
    if (subdomain.toLowerCase() === "zero") {
      req.tenantStore = {
        id: 1,
        name: "متجر زيرو إكسبريس",
        subdomain: "zero",
        templateId: "easyorders-flash",
        createdAt: new Date(),
      };
      return next();
    }
    res.status(500).json({ error: "فشل استرجاع بيانات المتجر" });
  }
}
