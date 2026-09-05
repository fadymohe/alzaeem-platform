/**
 * Cloud Database Service for za3em.shop
 * 
 * Provides universal, cross-subdomain, direct PostgreSQL access over HTTPS
 * (powered by Neon HTTP SQL API). Works identically on za3em.shop, any subdomain (*.za3em.shop),
 * and local development without relying on local server files or browser-isolated storage.
 */

const NEON_HTTP_ENDPOINT = 'https://ep-divine-meadow-axnl1tvy-pooler.c-4.us-east-2.aws.neon.tech/sql';
const NEON_CONN_STRING = 'postgresql://neondb_owner:npg_c7prHhSn5FsV@ep-divine-meadow-axnl1tvy-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require';

export interface CloudStoreRecord {
  id?: number;
  name: string;
  subdomain: string;
  template_id: string;
  store_code: string;
  slogan?: string;
  logo_url?: string;
  banner_url?: string;
  categories?: string[];
  product?: {
    id?: number;
    title?: string;
    name?: string;
    price: number;
    compareAtPrice?: number;
    imageUrl?: string;
    image?: string;
    description?: string;
    category?: string;
    products?: any[];
  };
  products?: any[];
  is_active?: boolean;
  created_at?: string;
}

/**
 * Execute an arbitrary SQL query against Neon PostgreSQL over HTTPS
 */
async function executeSql(query: string, params: any[] = []): Promise<any> {
  try {
    const res = await fetch(NEON_HTTP_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
        'Neon-Connection-String': NEON_CONN_STRING,
      },
      body: JSON.stringify({ query, params }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      console.warn('[CloudDb] HTTP Error:', res.status, errText);
      return null;
    }

    return await res.json();
  } catch (err) {
    console.warn('[CloudDb] Network Error:', err);
    return null;
  }
}

/**
 * Check if a subdomain is already registered in the central Neon database
 */
export async function checkCloudSubdomain(
  subdomain: string,
  currentUserEmail?: string,
  currentOwnerId?: string
): Promise<{
  available: boolean;
  reason?: 'taken';
  message?: string;
  store?: CloudStoreRecord;
}> {
  const clean = (subdomain || '').toLowerCase().trim().replace('.za3em.shop', '').replace(/[^a-z0-9-]/g, '');
  if (!clean || clean.length < 3) {
    return { available: false, message: 'اسم النطاق يجب أن يكون 3 أحرف على الأقل' };
  }

  const query = `SELECT id, name, subdomain, template_id, store_code, slogan, product, user_email, owner_id, is_active FROM za3em_stores WHERE subdomain = '${clean}' LIMIT 1;`;
  const result = await executeSql(query);

  if (result && Array.isArray(result.rows) && result.rows.length > 0) {
    const row = result.rows[0];
    const normalizedCurrentEmail = (currentUserEmail || '').toLowerCase().trim();
    const rowEmail = (row.user_email || '').toLowerCase().trim();
    const currentOwner = (currentOwnerId || '').trim();
    const rowOwner = (row.owner_id || '').trim();

    // If this store belongs to the current user (by email or owner ID), it is their own domain!
    const isOwner = (normalizedCurrentEmail && rowEmail && normalizedCurrentEmail === rowEmail) ||
                    (currentOwner && rowOwner && currentOwner === rowOwner);

    if (isOwner) {
      return {
        available: true,
        message: `هذا النطاق (${clean}.za3em.shop) خاص بحسابك ومتاح للاستخدام فوراً ✅`,
        store: row,
      };
    }

    // If the store is registered and owned by another user:
    if (rowEmail || rowOwner) {
      return {
        available: false,
        reason: 'taken',
        message: `هذا النطاق (${clean}.za3em.shop) محجوز مسبقاً لمتجر آخر`,
        store: row,
      };
    }
  }

  return {
    available: true,
    message: `هذا النطاق (${clean}.za3em.shop) متاح ويمكنك حجزه لمتجرك فوراً ✅`
  };
}

/**
 * Persist or update a store in the central Neon database
 */
export async function saveCloudStore(store: {
  storeName: string;
  subdomain: string;
  templateId: string;
  storeCode?: string;
  slogan?: string;
  logoUrl?: string;
  bannerUrl?: string;
  categories?: string[];
  product?: any;
  products?: any[];
  userEmail?: string;
  ownerId?: string;
  isActive?: boolean;
}): Promise<boolean> {
  const cleanSub = (store.subdomain || '').toLowerCase().trim().replace('.za3em.shop', '').replace(/[^a-z0-9-]/g, '');
  if (!cleanSub) return false;

  const nameEscaped = (store.storeName || `متجر ${cleanSub}`).replace(/'/g, "''");
  const codeEscaped = (store.storeCode || `ZAEEM-${cleanSub.toUpperCase().slice(0, 4)}-${Math.floor(1000 + Math.random() * 9000)}`).replace(/'/g, "''");
  const templateId = (store.templateId || 'shoppingcart.1.2.7').replace(/'/g, "''");
  const sloganEscaped = (store.slogan || 'أفضل المنتجات مع التوصيل السريع لجميع محافظات العراق').replace(/'/g, "''");
  // Protect against huge base64 strings breaking Neon SQL payload limits
  let safeLogo = store.logoUrl;
  if (safeLogo && safeLogo.length > 250000) safeLogo = undefined;
  let safeBanner = store.bannerUrl;
  if (safeBanner && safeBanner.length > 250000) safeBanner = undefined;

  const logoUrlEscaped = safeLogo ? `'${safeLogo.replace(/'/g, "''")}'` : 'NULL';
  const bannerUrlEscaped = safeBanner ? `'${safeBanner.replace(/'/g, "''")}'` : 'NULL';
  const userEmailEscaped = store.userEmail ? `'${store.userEmail.toLowerCase().trim().replace(/'/g, "''")}'` : 'NULL';
  const ownerIdEscaped = store.ownerId ? `'${store.ownerId.trim().replace(/'/g, "''")}'` : 'NULL';
  const isActiveVal = typeof store.isActive === 'boolean' ? (store.isActive ? 'TRUE' : 'FALSE') : 'TRUE';

  const rawProd = store.product || {};
  let safeProdImg = rawProd.imageUrl || rawProd.image || 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&auto=format&fit=crop&q=80';
  if (safeProdImg.length > 250000) {
    safeProdImg = 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&auto=format&fit=crop&q=80';
  }

  // Sanitize full products list
  const inputProducts = Array.isArray(store.products) && store.products.length > 0
    ? store.products
    : (Array.isArray(rawProd.products) && rawProd.products.length > 0
      ? rawProd.products
      : [rawProd]);

  const sanitizedProducts = inputProducts.map((p: any, idx: number) => {
    let pImg = p.imageUrl || p.image || safeProdImg;
    if (pImg && pImg.length > 250000) {
      pImg = 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&auto=format&fit=crop&q=80';
    }
    return {
      id: p.id || (idx + 1),
      name: p.name || p.title || `منتج ${idx + 1}`,
      title: p.title || p.name || `منتج ${idx + 1}`,
      sku: p.sku || `PRD-${idx + 1}`,
      price: Number(p.price) || 45000,
      compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
      stock: p.stock !== undefined ? Number(p.stock) : 20,
      lowStockThreshold: p.lowStockThreshold || 3,
      category: p.category || 'عام',
      status: p.status || 'active',
      imageUrl: pImg,
      image: pImg,
      images: Array.isArray(p.images) && p.images.length > 0 ? p.images : [pImg],
      description: p.description || '',
    };
  });

  const productObj = {
    id: rawProd.id || sanitizedProducts[0]?.id || 1,
    title: rawProd.title || rawProd.name || sanitizedProducts[0]?.name || 'عطر تاج الفخامة الفرنسي الملكي',
    name: rawProd.title || rawProd.name || sanitizedProducts[0]?.name || 'عطر تاج الفخامة الفرنسي الملكي',
    price: Number(rawProd.price) || sanitizedProducts[0]?.price || 45000,
    compareAtPrice: Number(rawProd.compareAtPrice) || sanitizedProducts[0]?.compareAtPrice || Math.round((Number(rawProd.price) || 45000) * 1.3),
    imageUrl: safeProdImg,
    image: safeProdImg,
    images: Array.isArray(rawProd.images) && rawProd.images.length > 0 ? rawProd.images : [safeProdImg],
    description: rawProd.description || store.slogan || 'منتج أصلي معتمد مع شحن سريع وضمان الدفع عند الاستلام',
    category: rawProd.category || 'عام',
    products: sanitizedProducts,
    catalog: sanitizedProducts,
  };
  const productJson = JSON.stringify(productObj).replace(/'/g, "''");
  const productsJson = JSON.stringify(sanitizedProducts).replace(/'/g, "''");
  const categoriesJson = JSON.stringify(store.categories || ['عام']).replace(/'/g, "''");

  const query = `
    INSERT INTO za3em_stores (name, subdomain, template_id, store_code, slogan, logo_url, banner_url, categories, product, products, user_email, owner_id, is_active)
    VALUES ('${nameEscaped}', '${cleanSub}', '${templateId}', '${codeEscaped}', '${sloganEscaped}', ${logoUrlEscaped}, ${bannerUrlEscaped}, '${categoriesJson}'::jsonb, '${productJson}'::jsonb, '${productsJson}'::jsonb, ${userEmailEscaped}, ${ownerIdEscaped}, ${isActiveVal})
    ON CONFLICT (subdomain) DO UPDATE
    SET name = EXCLUDED.name,
        template_id = EXCLUDED.template_id,
        store_code = EXCLUDED.store_code,
        slogan = EXCLUDED.slogan,
        logo_url = EXCLUDED.logo_url,
        banner_url = EXCLUDED.banner_url,
        categories = EXCLUDED.categories,
        product = EXCLUDED.product,
        products = EXCLUDED.products,
        user_email = COALESCE(EXCLUDED.user_email, za3em_stores.user_email),
        owner_id = COALESCE(EXCLUDED.owner_id, za3em_stores.owner_id),
        is_active = COALESCE(EXCLUDED.is_active, za3em_stores.is_active)
    RETURNING id, name, subdomain, store_code, is_active;
  `;

  const result = await executeSql(query);
  const success = Boolean(result && Array.isArray(result.rows) && result.rows.length > 0);
  if (success) {
    console.log(`[CloudDb] Store successfully saved: ${cleanSub}.za3em.shop (${codeEscaped}) with ${sanitizedProducts.length} products`);
  }
  return success;
}

/**
 * Update the active status of a store in Neon PostgreSQL
 */
export async function updateCloudStoreActive(subdomain: string, isActive: boolean): Promise<boolean> {
  const clean = (subdomain || '').toLowerCase().trim().replace('.za3em.shop', '').replace(/[^a-z0-9-]/g, '');
  if (!clean) return false;

  const query = `UPDATE za3em_stores SET is_active = ${isActive ? 'TRUE' : 'FALSE'} WHERE subdomain = '${clean}';`;
  const result = await executeSql(query);
  const success = Boolean(result && !result.error);
  if (success) {
    console.log(`[CloudDb] Store active status updated: ${clean}.za3em.shop -> ${isActive ? 'ACTIVE' : 'DEACTIVATED'}`);
  }
  return success;
}

/**
 * Fetch a store by subdomain from the central Neon database
 */
export async function fetchCloudStore(subdomain: string): Promise<CloudStoreRecord | null> {
  const clean = (subdomain || '').toLowerCase().trim().replace('.za3em.shop', '').replace(/[^a-z0-9-]/g, '');
  if (!clean) return null;

  const query = `SELECT id, name, subdomain, template_id, store_code, slogan, logo_url, banner_url, categories, product, products, user_email, owner_id, is_active FROM za3em_stores WHERE subdomain = '${clean}' LIMIT 1;`;
  const result = await executeSql(query);

  if (result && Array.isArray(result.rows) && result.rows.length > 0) {
    return result.rows[0] as CloudStoreRecord;
  }

  return null;
}

/**
 * Fetch a store by owner email or ID from the central Neon database
 */
export async function fetchCloudStoreByUser(email: string, ownerId?: string): Promise<CloudStoreRecord | null> {
  const cleanEmail = (email || '').toLowerCase().trim().replace(/'/g, "''");
  const cleanOwner = (ownerId || '').trim().replace(/'/g, "''");
  if (!cleanEmail && !cleanOwner) return null;

  let whereClause = '';
  if (cleanEmail && cleanOwner) {
    whereClause = `user_email = '${cleanEmail}' OR owner_id = '${cleanOwner}'`;
  } else if (cleanEmail) {
    whereClause = `user_email = '${cleanEmail}'`;
  } else {
    whereClause = `owner_id = '${cleanOwner}'`;
  }

  const query = `SELECT id, name, subdomain, template_id, store_code, slogan, logo_url, banner_url, categories, product, products, user_email, owner_id, is_active FROM za3em_stores WHERE ${whereClause} ORDER BY id DESC LIMIT 1;`;
  const result = await executeSql(query);

  if (result && Array.isArray(result.rows) && result.rows.length > 0) {
    return result.rows[0] as CloudStoreRecord;
  }

  return null;
}

/**
 * Save a customer to the central Neon cloud database
 */
export async function saveCloudCustomer(customer: {
  subdomain?: string;
  name: string;
  phone: string;
  email?: string;
  governorate: string;
  city: string;
  address?: string;
  ordersCount?: number;
  totalSpent?: number;
}): Promise<boolean> {
  try {
    const cleanSub = (customer.subdomain || '').toLowerCase().trim().replace('.za3em.shop', '').replace(/[^a-z0-9-]/g, '');
    const nameEscaped = (customer.name || '').replace(/'/g, "''");
    const phoneEscaped = (customer.phone || '').replace(/'/g, "''");
    const emailEscaped = customer.email ? `'${customer.email.toLowerCase().trim().replace(/'/g, "''")}'` : 'NULL';
    const govEscaped = (customer.governorate || 'بغداد').replace(/'/g, "''");
    const cityEscaped = (customer.city || '').replace(/'/g, "''");
    const addressEscaped = (customer.address || '').replace(/'/g, "''");
    const ordersCount = Number(customer.ordersCount) || 1;
    const totalSpent = Number(customer.totalSpent) || 0;

    const query = `
      INSERT INTO za3em_customers (subdomain, name, phone, email, governorate, city, address, orders_count, total_spent)
      VALUES ('${cleanSub}', '${nameEscaped}', '${phoneEscaped}', ${emailEscaped}, '${govEscaped}', '${cityEscaped}', '${addressEscaped}', ${ordersCount}, ${totalSpent})
      RETURNING id;
    `;
    const res = await executeSql(query);
    const success = Boolean(res && Array.isArray(res.rows) && res.rows.length > 0);
    if (success) {
      console.log(`[CloudDb] Customer saved successfully to server: ${customer.name} (${customer.phone})`);
    }
    return success;
  } catch (err) {
    console.warn('[CloudDb] Error saving cloud customer:', err);
    return false;
  }
}

/**
 * Fetch all customers from the central Neon cloud database
 */
export async function fetchCloudCustomers(subdomain?: string): Promise<any[]> {
  try {
    const cleanSub = (subdomain || '').toLowerCase().trim().replace('.za3em.shop', '').replace(/[^a-z0-9-]/g, '');
    let query = `SELECT id, subdomain, name, phone, email, governorate, city, address, orders_count, total_spent, created_at FROM za3em_customers ORDER BY id DESC;`;
    if (cleanSub) {
      query = `SELECT id, subdomain, name, phone, email, governorate, city, address, orders_count, total_spent, created_at FROM za3em_customers WHERE subdomain = '${cleanSub}' OR subdomain = '' OR subdomain IS NULL ORDER BY id DESC;`;
    }
    const res = await executeSql(query);
    if (res && Array.isArray(res.rows)) {
      return res.rows.map((row: any) => ({
        id: Number(row.id),
        name: row.name,
        phone: row.phone,
        email: row.email || undefined,
        governorate: row.governorate || 'بغداد',
        city: row.city || row.governorate || 'بغداد',
        address: row.address || '',
        ordersCount: Number(row.orders_count) || 1,
        totalSpent: Number(row.total_spent) || 0,
        createdAt: row.created_at,
      }));
    }
    return [];
  } catch (err) {
    console.warn('[CloudDb] Error fetching cloud customers:', err);
    return [];
  }
}

export interface CloudShipment {
  id?: string | number;
  trackingNumber: string;
  subdomain?: string;
  recipientName: string;
  recipientPhone: string;
  governorate: string;
  district: string;
  nearestLandmark: string;
  address: string;
  codAmount: number;
  shippingCost: number;
  paymentType: 'cod' | 'prepaid';
  status: 'جديدة' | 'قيد التجهيز' | 'في المستودع' | 'خرجت للتوصيل' | 'تم التسليم' | 'فشل التسليم' | 'مرتجعة';
  shippingCompany?: string;
  notes?: string;
  createdAt?: string;
  date?: string;
}

/**
 * Save a single shipment to the central Neon cloud database and shipping system
 */
export async function saveCloudShipment(shipment: CloudShipment): Promise<boolean> {
  try {
    const cleanSub = (shipment.subdomain || '').toLowerCase().trim().replace('.za3em.shop', '').replace(/[^a-z0-9-]/g, '');
    const trackEsc = (shipment.trackingNumber || '').replace(/'/g, "''");
    const nameEsc = (shipment.recipientName || '').replace(/'/g, "''");
    const phoneEsc = (shipment.recipientPhone || '').replace(/'/g, "''");
    const govEsc = (shipment.governorate || 'بغداد').replace(/'/g, "''");
    const distEsc = (shipment.district || '').replace(/'/g, "''");
    const markEsc = (shipment.nearestLandmark || '').replace(/'/g, "''");
    const addrEsc = (shipment.address || '').replace(/'/g, "''");
    const codAmt = Number(shipment.codAmount) || 0;
    const shipCost = Number(shipment.shippingCost) || 5000;
    const payType = (shipment.paymentType || 'cod').replace(/'/g, "''");
    const statusEsc = (shipment.status || 'جديدة').replace(/'/g, "''");
    const companyEsc = (shipment.shippingCompany || 'شركة الزعيم للشحن السريع').replace(/'/g, "''");
    const notesEsc = (shipment.notes || '').replace(/'/g, "''");

    const query = `
      INSERT INTO za3em_shipments (tracking_number, subdomain, recipient_name, recipient_phone, governorate, district, nearest_landmark, address, cod_amount, shipping_cost, payment_type, status, shipping_company, notes)
      VALUES ('${trackEsc}', '${cleanSub}', '${nameEsc}', '${phoneEsc}', '${govEsc}', '${distEsc}', '${markEsc}', '${addrEsc}', ${codAmt}, ${shipCost}, '${payType}', '${statusEsc}', '${companyEsc}', '${notesEsc}')
      ON CONFLICT (tracking_number) DO UPDATE
      SET status = EXCLUDED.status,
          cod_amount = EXCLUDED.cod_amount,
          address = EXCLUDED.address
      RETURNING id, tracking_number;
    `;
    const res = await executeSql(query);
    return Boolean(res && Array.isArray(res.rows) && res.rows.length > 0);
  } catch (err) {
    console.warn('[CloudDb] Error saving cloud shipment:', err);
    return false;
  }
}

/**
 * Fetch all shipments from the central Neon cloud database
 */
export async function fetchCloudShipments(subdomain?: string): Promise<CloudShipment[]> {
  try {
    const cleanSub = (subdomain || '').toLowerCase().trim().replace('.za3em.shop', '').replace(/[^a-z0-9-]/g, '');
    let query = `SELECT id, tracking_number, subdomain, recipient_name, recipient_phone, governorate, district, nearest_landmark, address, cod_amount, shipping_cost, payment_type, status, shipping_company, notes, created_at FROM za3em_shipments ORDER BY created_at DESC;`;
    if (cleanSub) {
      query = `SELECT id, tracking_number, subdomain, recipient_name, recipient_phone, governorate, district, nearest_landmark, address, cod_amount, shipping_cost, payment_type, status, shipping_company, notes, created_at FROM za3em_shipments WHERE subdomain = '${cleanSub}' OR subdomain = '' OR subdomain IS NULL ORDER BY created_at DESC;`;
    }
    const res = await executeSql(query);
    if (res && Array.isArray(res.rows)) {
      return res.rows.map((r: any) => ({
        id: String(r.id),
        trackingNumber: r.tracking_number,
        subdomain: r.subdomain,
        recipientName: r.recipient_name,
        recipientPhone: r.recipient_phone,
        governorate: r.governorate,
        district: r.district,
        nearestLandmark: r.nearest_landmark,
        address: r.address,
        codAmount: Number(r.cod_amount) || 0,
        shippingCost: Number(r.shipping_cost) || 5000,
        paymentType: r.payment_type || 'cod',
        status: r.status || 'جديدة',
        shippingCompany: r.shipping_company || 'شركة الزعيم للشحن السريع',
        notes: r.notes || '',
        createdAt: r.created_at,
        date: r.created_at ? new Date(r.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      }));
    }
    return [];
  } catch (err) {
    console.warn('[CloudDb] Error fetching cloud shipments:', err);
    return [];
  }
}

/**
 * Track a shipment by tracking code in the central Neon database
 */
export async function trackCloudShipment(trackCode: string): Promise<CloudShipment | null> {
  try {
    const cleanCode = trackCode.trim().replace(/'/g, "''");
    if (!cleanCode) return null;

    const query = `
      SELECT id, tracking_number, subdomain, recipient_name, recipient_phone, governorate, district, nearest_landmark, address, cod_amount, shipping_cost, payment_type, status, shipping_company, notes, created_at
      FROM za3em_shipments
      WHERE LOWER(tracking_number) = LOWER('${cleanCode}') OR recipient_phone = '${cleanCode}'
      ORDER BY id DESC LIMIT 1;
    `;
    const res = await executeSql(query);
    if (res && Array.isArray(res.rows) && res.rows.length > 0) {
      const r = res.rows[0];
      return {
        id: String(r.id),
        trackingNumber: r.tracking_number,
        subdomain: r.subdomain,
        recipientName: r.recipient_name,
        recipientPhone: r.recipient_phone,
        governorate: r.governorate,
        district: r.district,
        nearestLandmark: r.nearest_landmark,
        address: r.address,
        codAmount: Number(r.cod_amount) || 0,
        shippingCost: Number(r.shipping_cost) || 5000,
        paymentType: r.payment_type || 'cod',
        status: r.status || 'جديدة',
        shippingCompany: r.shipping_company || 'شركة الزعيم للشحن السريع',
        notes: r.notes || '',
        createdAt: r.created_at,
        date: r.created_at ? new Date(r.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      };
    }
    return null;
  } catch (err) {
    console.warn('[CloudDb] Error tracking cloud shipment:', err);
    return null;
  }
}
