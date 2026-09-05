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
  };
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

  const productObj = {
    id: rawProd.id || 1,
    title: rawProd.title || rawProd.name || 'عطر تاج الفخامة الفرنسي الملكي',
    name: rawProd.title || rawProd.name || 'عطر تاج الفخامة الفرنسي الملكي',
    price: Number(rawProd.price) || 45000,
    compareAtPrice: Number(rawProd.compareAtPrice) || Math.round((Number(rawProd.price) || 45000) * 1.3),
    imageUrl: safeProdImg,
    image: safeProdImg,
    images: Array.isArray(rawProd.images) && rawProd.images.length > 0 ? rawProd.images : [safeProdImg],
    description: rawProd.description || store.slogan || 'منتج أصلي معتمد مع شحن سريع وضمان الدفع عند الاستلام',
    category: rawProd.category || 'عام',
  };
  const productJson = JSON.stringify(productObj).replace(/'/g, "''");
  const categoriesJson = JSON.stringify(store.categories || ['عام']).replace(/'/g, "''");


  const query = `
    INSERT INTO za3em_stores (name, subdomain, template_id, store_code, slogan, logo_url, banner_url, categories, product, user_email, owner_id, is_active)
    VALUES ('${nameEscaped}', '${cleanSub}', '${templateId}', '${codeEscaped}', '${sloganEscaped}', ${logoUrlEscaped}, ${bannerUrlEscaped}, '${categoriesJson}'::jsonb, '${productJson}'::jsonb, ${userEmailEscaped}, ${ownerIdEscaped}, ${isActiveVal})
    ON CONFLICT (subdomain) DO UPDATE
    SET name = EXCLUDED.name,
        template_id = EXCLUDED.template_id,
        store_code = EXCLUDED.store_code,
        slogan = EXCLUDED.slogan,
        logo_url = EXCLUDED.logo_url,
        banner_url = EXCLUDED.banner_url,
        categories = EXCLUDED.categories,
        product = EXCLUDED.product,
        user_email = COALESCE(EXCLUDED.user_email, za3em_stores.user_email),
        owner_id = COALESCE(EXCLUDED.owner_id, za3em_stores.owner_id),
        is_active = COALESCE(EXCLUDED.is_active, za3em_stores.is_active)
    RETURNING id, name, subdomain, store_code, is_active;
  `;

  const result = await executeSql(query);
  const success = Boolean(result && Array.isArray(result.rows) && result.rows.length > 0);
  if (success) {
    console.log(`[CloudDb] Store successfully saved: ${cleanSub}.za3em.shop (${codeEscaped})`);
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

  const query = `SELECT id, name, subdomain, template_id, store_code, slogan, logo_url, banner_url, categories, product, user_email, owner_id, is_active FROM za3em_stores WHERE subdomain = '${clean}' LIMIT 1;`;
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

  const query = `SELECT id, name, subdomain, template_id, store_code, slogan, logo_url, banner_url, categories, product, user_email, owner_id, is_active FROM za3em_stores WHERE ${whereClause} ORDER BY id DESC LIMIT 1;`;
  const result = await executeSql(query);

  if (result && Array.isArray(result.rows) && result.rows.length > 0) {
    return result.rows[0] as CloudStoreRecord;
  }

  return null;
}
