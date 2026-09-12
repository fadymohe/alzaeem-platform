import { formatIQD } from './iraqData';
import { saveCloudStore, saveCloudShipment, type CloudShipment } from '../utils/cloudDb';
import { addAppNotification } from '../utils/notificationStore';

export interface StoreProduct {
  id: number;
  name: string;
  sku: string;
  description: string;
  price: number; // in IQD or USD equivalent
  compareAtPrice?: number | null;
  stock: number;
  lowStockThreshold: number;
  category: string;
  status: 'active' | 'draft' | 'archived';
  imageUrl?: string;
  images?: string[]; // 3 images: [main, optional1, optional2]
  weightGrams?: number;
  isManual?: boolean;
  isDefault?: boolean;
}

export interface StoreOrder {
  id: number;
  number: string;
  customerName: string;
  customerPhone: string;
  customerCity: string;
  address: string;
  total: number; // in IQD
  itemsCount: number;
  status: 'pending' | 'confirmed' | 'processing' | 'delivered' | 'cancelled';
  paymentMethod: 'cod' | 'zain_cash' | 'card';
  createdAt: string;
  trackingNumber?: string;
  shippingCompany?: string;
  shippingCost?: number;
  district?: string;
  nearestLandmark?: string;
  notes?: string;
  subdomain?: string;
  merchantId?: string;
  items?: Array<{ productName: string; quantity: number; unitPrice: number }>;
}

export interface StoreCustomer {
  id: number;
  name: string;
  phone: string;
  email?: string;
  city: string;
  governorate: string;
  address?: string;
  ordersCount: number;
  totalSpent: number;
  lastOrderAt?: string;
}

// Initial Sample Seed Data - Empty by default for strict per-store isolation
const INITIAL_PRODUCTS: StoreProduct[] = [];
const INITIAL_ORDERS: StoreOrder[] = [];
const INITIAL_CUSTOMERS: StoreCustomer[] = [];

// Local Storage Keys
const PRODUCTS_KEY = 'zaeem_store_products';
const ORDERS_KEY = 'zaeem_store_orders';
const CUSTOMERS_KEY = 'zaeem_store_customers';

// Product Methods
export function getStoredProducts(): StoreProduct[] {
  try {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        // فلترة أي منتجات تجريبية أو افتراضية لم يضفها التاجر يدوياً
        const validProducts = parsed.filter((p: any) => {
          if (!p || typeof p !== 'object') return false;
          if (p.isDefault === true) return false;
          if (p.sku === 'SHIRT-001' || p.sku === 'PERFUME-99') return false;
          // إزالة العطر الافتراضي المسبق
          if (!p.isManual && (p.name === 'عطر تاج الفخامة الفرنسي الملكي' || p.title === 'عطر تاج الفخامة الفرنسي الملكي')) {
            return false;
          }
          return true;
        });

        // إذا تم تنظيف أي منتجات افتراضية نقوم بتحديث التخزين
        if (validProducts.length !== parsed.length) {
          saveStoredProducts(validProducts);
        }

        if (validProducts.length > 0) {
          return validProducts;
        }
      }
    }
  } catch (e) {}

  // فحص ما إذا كان التاجر يملك منتجات حقيقية أضيفت في الإعداد ولم تكن الافتراضية
  try {
    const rawStore = localStorage.getItem('zaeem_onboarded_store') || localStorage.getItem('zaeem_store_data');
    if (rawStore) {
      const parsedStore = JSON.parse(rawStore);
      if (Array.isArray(parsedStore.products) && parsedStore.products.length > 0) {
        const validList = parsedStore.products.filter((p: any) =>
          p && !p.isDefault && p.name !== 'عطر تاج الفخامة الفرنسي الملكي' && p.title !== 'عطر تاج الفخامة الفرنسي الملكي'
        );
        if (validList.length > 0) {
          saveStoredProducts(validList);
          return validList;
        }
      }
      if (parsedStore.product && (parsedStore.product.name || parsedStore.product.title)) {
        const pTitle = parsedStore.product.title || parsedStore.product.name;
        if (pTitle && pTitle !== 'عطر تاج الفخامة الفرنسي الملكي' && !parsedStore.product.isDefault) {
          const realProd: StoreProduct = {
            id: parsedStore.product.id || 1,
            name: pTitle,
            sku: parsedStore.product.sku || `PRD-${(parsedStore.subdomain || 'ZAEEM').replace(/[^a-zA-Z0-9]/g, '').slice(0, 4).toUpperCase() || 'SHOP'}-001`,
            description: parsedStore.product.description || parsedStore.slogan || '',
            price: Number(parsedStore.product.price) || 0,
            compareAtPrice: parsedStore.product.compareAtPrice ? Number(parsedStore.product.compareAtPrice) : null,
            stock: parsedStore.product.stock !== undefined ? Number(parsedStore.product.stock) : 50,
            lowStockThreshold: 5,
            category: parsedStore.product.category || parsedStore.category || 'عام',
            status: 'active',
            imageUrl: parsedStore.product.imageUrl || parsedStore.product.image || '',
            weightGrams: 500,
            isManual: true,
          };
          saveStoredProducts([realProd]);
          return [realProd];
        }
      }
    }
  } catch (e) {}

  // الافتراضي هو قائمة فارغة إذا لم يقم التاجر بإضافة أي منتج يدوياً
  return [];
}

export function saveStoredProducts(products: StoreProduct[]): void {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}

export async function syncProductToLiveStoreAndServer(product?: StoreProduct, allProductsList?: StoreProduct[]): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    const currentProducts = (allProductsList && allProductsList.length > 0)
      ? allProductsList
      : getStoredProducts();
    const leadProduct = product || currentProducts[0];

    // 1. Update zaeem_store_data & zaeem_onboarded_store
    const updateLocalStoreObject = (key: string) => {
      const raw = localStorage.getItem(key);
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (leadProduct) {
            parsed.product = {
              id: leadProduct.id,
              title: leadProduct.name,
              name: leadProduct.name,
              sku: leadProduct.sku,
              price: leadProduct.price,
              compareAtPrice: leadProduct.compareAtPrice,
              image: leadProduct.imageUrl,
              imageUrl: leadProduct.imageUrl,
              images: leadProduct.images && leadProduct.images.length > 0 ? leadProduct.images : (leadProduct.imageUrl ? [leadProduct.imageUrl] : []),
              description: leadProduct.description,
              category: leadProduct.category,
            };
          }
          parsed.products = currentProducts;
          localStorage.setItem(key, JSON.stringify(parsed));
          return parsed;
        } catch {}
      }
      return null;
    };

    const storeObj = updateLocalStoreObject('zaeem_store_data') || updateLocalStoreObject('zaeem_onboarded_store');

    // 2. Update zaeem_stores_registry
    const rawReg = localStorage.getItem('zaeem_stores_registry');
    let subdomain = storeObj?.subdomain ? storeObj.subdomain.replace('.za3em.shop', '') : '';
    if (rawReg) {
      try {
        const reg = JSON.parse(rawReg);
        if (!subdomain && Object.keys(reg).length > 0) {
          subdomain = Object.keys(reg)[0];
        }
        if (subdomain && reg[subdomain]) {
          if (leadProduct) {
            reg[subdomain].product = {
              id: leadProduct.id,
              title: leadProduct.name,
              name: leadProduct.name,
              sku: leadProduct.sku,
              price: leadProduct.price,
              compareAtPrice: leadProduct.compareAtPrice,
              image: leadProduct.imageUrl,
              imageUrl: leadProduct.imageUrl,
              images: leadProduct.images && leadProduct.images.length > 0 ? leadProduct.images : (leadProduct.imageUrl ? [leadProduct.imageUrl] : []),
              description: leadProduct.description,
              category: leadProduct.category,
            };
          }
          reg[subdomain].products = currentProducts;
          localStorage.setItem('zaeem_stores_registry', JSON.stringify(reg));
        }
      } catch {}
    }

    // 3. Publish full catalog to central Neon Cloud Database so it is live on the server and all subdomains
    if (subdomain || storeObj) {
      const cleanSub = (subdomain || storeObj?.subdomain || 'shop').replace('.za3em.shop', '');
      await saveCloudStore({
        storeName: storeObj?.storeName || `متجر ${cleanSub}`,
        subdomain: cleanSub,
        templateId: storeObj?.templateId || storeObj?.selectedTheme || 'shoppingcart.1.2.7',
        storeCode: storeObj?.storeCode,
        slogan: storeObj?.slogan || leadProduct?.description,
        logoUrl: storeObj?.logoUrl,
        bannerUrl: storeObj?.bannerUrl,
        userEmail: storeObj?.userEmail || storeObj?.email,
        ownerId: storeObj?.ownerId || storeObj?.id,
        isActive: storeObj?.isActive ?? true,
        product: leadProduct ? {
          id: leadProduct.id,
          title: leadProduct.name,
          name: leadProduct.name,
          sku: leadProduct.sku,
          price: leadProduct.price,
          compareAtPrice: leadProduct.compareAtPrice,
          image: leadProduct.imageUrl,
          imageUrl: leadProduct.imageUrl,
          images: leadProduct.images && leadProduct.images.length > 0 ? leadProduct.images : (leadProduct.imageUrl ? [leadProduct.imageUrl] : []),
          description: leadProduct.description,
          category: leadProduct.category,
          products: currentProducts,
        } : undefined,
        products: currentProducts,
      });
    }
  } catch (err) {
    console.warn('[storeState] Error syncing products to store:', err);
  }
}

export function addStoredProduct(product: Omit<StoreProduct, 'id'>): StoreProduct {
  const products = getStoredProducts();
  const newProduct: StoreProduct = {
    ...product,
    id: Date.now(),
    isManual: true,
  };
  const updated = [newProduct, ...products];
  saveStoredProducts(updated);
  syncProductToLiveStoreAndServer(newProduct, updated);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('zaeem_store_updated'));
  }
  return newProduct;
}

export function updateStoredProduct(id: number, updates: Partial<StoreProduct>): StoreProduct | null {
  const products = getStoredProducts();
  const idx = products.findIndex(p => p.id === id);
  if (idx === -1) return null;
  products[idx] = { ...products[idx], ...updates };
  saveStoredProducts(products);
  syncProductToLiveStoreAndServer(products[idx], products);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('zaeem_store_updated'));
  }
  return products[idx];
}

export function deleteStoredProduct(id: number): boolean {
  const products = getStoredProducts();
  const updated = products.filter(p => p.id !== id);
  saveStoredProducts(updated);
  syncProductToLiveStoreAndServer(updated[0], updated);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('zaeem_store_updated'));
  }
  return true;
}

// Helper to determine the next sequential order number: order0001, order0002, order0003...
export function getNextOrderNumber(existingOrders: StoreOrder[]): string {
  let maxSeq = 0;
  for (const o of existingOrders) {
    const match = o.number?.match(/order(\d+)/i);
    if (match) {
      const n = parseInt(match[1], 10);
      if (n > maxSeq) maxSeq = n;
    }
  }
  const nextSeq = Math.max(maxSeq + 1, existingOrders.length + 1);
  return `order${String(nextSeq).padStart(4, '0')}`;
}

// Helper to get active user ID or email
export function getActiveMerchantIdentifier(): string {
  try {
    const rawUser = localStorage.getItem('zaeem_user');
    if (rawUser) {
      const u = JSON.parse(rawUser);
      if (u.id) return String(u.id);
      if (u.email) return u.email.toLowerCase().trim();
      if (u.subdomain) return u.subdomain.toLowerCase().trim();
    }
    const rawStore = localStorage.getItem('zaeem_store_data') || localStorage.getItem('zaeem_onboarded_store');
    if (rawStore) {
      const s = JSON.parse(rawStore);
      if (s.ownerId) return String(s.ownerId);
      if (s.userEmail) return s.userEmail.toLowerCase().trim();
      if (s.subdomain) return s.subdomain.toLowerCase().trim();
    }
  } catch {}
  return 'default';
}

// Order Methods - STRICTLY SCOPED PER MERCHANT TO PREVENT CROSS-ACCOUNT DATA LEAKAGE
export function getStoredOrders(): StoreOrder[] {
  try {
    const merchantId = getActiveMerchantIdentifier();
    const scopedKey = `${ORDERS_KEY}_${merchantId}`;
    
    // Read from scoped key first, or migrate un-scoped if current merchant matches
    let raw = localStorage.getItem(scopedKey);
    if (!raw && merchantId === 'default') {
      raw = localStorage.getItem(ORDERS_KEY);
    }

    if (raw) {
      const parsed = JSON.parse(raw);
      // Clean out legacy fake seed orders (ORD-1001 to ORD-1005)
      const cleaned = (Array.isArray(parsed) ? parsed : []).filter((o: any) => {
        const isOldDummy = (o.number?.startsWith('ORD-100') && o.id >= 101 && o.id <= 105) ||
          (o.customerName === 'أحمد علي' && o.customerPhone?.includes('123 4567')) ||
          (o.customerName === 'مريم حسن' && o.customerPhone?.includes('987 6543')) ||
          (o.customerName === 'عمر فاروق' && o.customerPhone?.includes('444 3322'));
        return !isOldDummy;
      });

      // Filter: only return orders that belong to this merchant or current subdomain
      let currentSub = '';
      try {
        const rawStore = localStorage.getItem('zaeem_store_data') || localStorage.getItem('zaeem_onboarded_store');
        if (rawStore) {
          currentSub = (JSON.parse(rawStore).subdomain || '').replace('.za3em.shop', '').toLowerCase().trim();
        }
      } catch {}

      const isolatedOrders = cleaned.filter((o: any) => {
        // If order has an explicit merchant owner, it MUST match
        if (o.merchantId && merchantId !== 'default' && o.merchantId !== merchantId) {
          return false;
        }
        // If order has subdomain, it must match current store subdomain
        if (o.subdomain && currentSub && o.subdomain !== currentSub) {
          return false;
        }
        return true;
      });

      return isolatedOrders;
    }
  } catch (e) {}

  // Clean fresh stores start with 0 orders
  return [];
}

export function saveStoredOrders(orders: StoreOrder[]): void {
  const merchantId = getActiveMerchantIdentifier();
  const scopedKey = `${ORDERS_KEY}_${merchantId}`;
  localStorage.setItem(scopedKey, JSON.stringify(orders));
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

export function addStoredOrder(order: Omit<StoreOrder, 'id' | 'number' | 'createdAt'>): StoreOrder {
  const orders = getStoredOrders();
  const orderNumber = getNextOrderNumber(orders);

  // 1. Generate unique Iraqi shipment tracking number (e.g. ZAEEM-2026-XXXXXX)
  const trackingNumber = order.trackingNumber || `ZAEEM-2026-${Math.floor(100000 + Math.random() * 900000)}`;
  const shippingCompany = order.shippingCompany || 'شركة الزعيم للشحن السريع';

  let sub = order.subdomain || '';
  if (!sub && typeof window !== 'undefined') {
    const hostParts = window.location.hostname.split('.');
    if (hostParts.length > 2 && hostParts[0] !== 'www' && hostParts[0] !== 'za3em') {
      sub = hostParts[0];
    } else {
      const hash = window.location.hash || '';
      const match = hash.match(/\/store\/([^/?]+)/);
      if (match) sub = match[1];
    }
  }
  if (!sub) {
    try {
      const rawStore = localStorage.getItem('zaeem_onboarded_store') || localStorage.getItem('zaeem_store_data');
      const rawUser = localStorage.getItem('zaeem_user');
      const sObj = rawStore ? JSON.parse(rawStore) : null;
      const uObj = rawUser ? JSON.parse(rawUser) : null;
      sub = (sObj?.subdomain || uObj?.subdomain || 'alzaeem')
        .replace('.za3em.shop', '')
        .replace(/^https?:\/\//, '')
        .trim() || 'alzaeem';
    } catch {}
  }

  const newOrder: StoreOrder = {
    ...order,
    id: Date.now(),
    number: orderNumber,
    trackingNumber,
    shippingCompany,
    subdomain: sub,
    merchantId: getActiveMerchantIdentifier(),
    createdAt: new Date().toISOString()
  };
  const updated = [newOrder, ...orders];
  saveStoredOrders(updated);

  // 2. Sync Customer record with actual order amount
  try {
    addStoredCustomer({
      name: order.customerName,
      phone: order.customerPhone,
      city: order.customerCity,
      governorate: order.customerCity,
      address: order.address,
      ordersCount: 1,
      totalSpent: Number(order.total) || 0
    });
  } catch {}

  // 2.1 Trigger Live Notification for new order
  try {
    addAppNotification({
      title: `طلب شراء جديد #${orderNumber}`,
      desc: `استلمت طلباً جديداً من ${order.customerName} بقيمة ${formatIQD(order.total)} (${order.customerCity || 'بغداد'})`,
      type: 'order',
      link: '/orders'
    });
  } catch {}

  // 3. Immediately create & upload Shipment to Al-Zaeem Logistics (Local + Neon Cloud Database)
  try {
    const newShipment: CloudShipment = {
      trackingNumber,
      subdomain: sub,
      recipientName: order.customerName,
      recipientPhone: order.customerPhone,
      governorate: order.customerCity || 'بغداد',
      district: order.district || order.customerCity || 'المركز',
      nearestLandmark: order.nearestLandmark || '',
      address: order.address || `العراق — ${order.customerCity || 'بغداد'}`,
      codAmount: Number(order.total) || 0,
      shippingCost: order.shippingCost || 5000,
      paymentType: 'cod',
      status: 'جديدة',
      shippingCompany,
      notes: order.notes || `طلب شراء إلكتروني (${orderNumber}) - الدفع عند الاستلام بعد المعاينة`,
      createdAt: new Date().toISOString(),
      date: new Date().toISOString().split('T')[0]
    };

    // Save to local shipments storage
    try {
      const rawLocal = localStorage.getItem('zaeem_local_shipments');
      let localShipments: CloudShipment[] = [];
      if (rawLocal) {
        localShipments = JSON.parse(rawLocal);
      }
      const filtered = localShipments.filter(s => s.trackingNumber !== trackingNumber);
      localStorage.setItem('zaeem_local_shipments', JSON.stringify([newShipment, ...filtered]));
    } catch {}

    // Upload directly to central Neon PostgreSQL database (za3em_shipments table)
    saveCloudShipment(newShipment).catch(err => {
      console.warn('[storeState] Neon cloud shipment upload warning:', err);
    });

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('zaeem_shipment_added', { detail: newShipment }));
      window.dispatchEvent(new CustomEvent('zaeem_shipments_updated', { detail: newShipment }));
    }
  } catch (shipErr) {
    console.warn('[storeState] Error dispatching shipment to logistics:', shipErr);
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('zaeem_store_updated', { detail: { order: newOrder } }));
    window.dispatchEvent(new Event('storage'));
  }

  return newOrder;
}

/**
 * Sync orders seamlessly between central Neon PostgreSQL database and merchant dashboard
 */
export async function syncCloudOrders(targetSubdomain?: string): Promise<StoreOrder[]> {
  try {
    let sub = targetSubdomain;
    if (!sub) {
      try {
        const rawStore = localStorage.getItem('zaeem_onboarded_store') || localStorage.getItem('zaeem_store_data');
        const rawUser = localStorage.getItem('zaeem_user');
        const sObj = rawStore ? JSON.parse(rawStore) : null;
        const uObj = rawUser ? JSON.parse(rawUser) : null;
        sub = (sObj?.subdomain || uObj?.subdomain || '')
          .replace('.za3em.shop', '')
          .replace(/^https?:\/\//, '')
          .trim();
      } catch {}
    }

    const { fetchCloudShipments } = await import('../utils/cloudDb');
    const shipments = await fetchCloudShipments(sub);
    if (!shipments || shipments.length === 0) {
      return getStoredOrders();
    }

    const currentOrders = getStoredOrders();
    const existingTrackingMap = new Map<string, StoreOrder>();
    currentOrders.forEach(o => {
      if (o.trackingNumber) existingTrackingMap.set(o.trackingNumber, o);
    });

    let hasNew = false;
    const syncedOrders: StoreOrder[] = [...currentOrders];

    shipments.forEach((ship, idx) => {
      if (ship.trackingNumber && !existingTrackingMap.has(ship.trackingNumber)) {
        // Map cloud shipment status to merchant order status
        let mappedStatus: StoreOrder['status'] = 'pending';
        if (ship.status === 'تم التسليم') mappedStatus = 'delivered';
        else if (ship.status === 'قيد التجهيز') mappedStatus = 'processing';
        else if (ship.status === 'خرجت للتوصيل' || ship.status === 'في المستودع') mappedStatus = 'confirmed';
        else if (ship.status === 'مرتجعة' || ship.status === 'فشل التسليم') mappedStatus = 'cancelled';

        // Extract order number from notes (e.g. order0001) or generate sequential
        let ordNumber = `order${String(shipments.length - idx).padStart(4, '0')}`;
        const match = ship.notes?.match(/order\d+/i);
        if (match) ordNumber = match[0].toLowerCase();

        // Extract product name from notes or provide default
        let pName = 'منتج المتجر';
        if (ship.notes && !ship.notes.includes('طلب شراء إلكتروني')) {
          pName = ship.notes;
        }

        const newOrd: StoreOrder = {
          id: Number(ship.id) || Date.now() + idx,
          number: ordNumber,
          customerName: ship.recipientName || 'زبون المتجر',
          customerPhone: ship.recipientPhone || '',
          customerCity: ship.governorate || 'بغداد',
          address: ship.address || `العراق — ${ship.governorate || 'بغداد'}`,
          total: Number(ship.codAmount) || 0,
          shippingCost: Number(ship.shippingCost) || 5000,
          itemsCount: 1,
          status: mappedStatus,
          paymentMethod: 'cod',
          createdAt: ship.createdAt || new Date().toISOString(),
          trackingNumber: ship.trackingNumber,
          shippingCompany: ship.shippingCompany || 'شركة الزعيم للشحن السريع',
          subdomain: ship.subdomain,
          notes: ship.notes,
          items: [{
            productName: pName,
            quantity: 1,
            unitPrice: Number(ship.codAmount) || 0
          }]
        };

        syncedOrders.push(newOrd);
        existingTrackingMap.set(ship.trackingNumber, newOrd);
        hasNew = true;

        // Sync Customer record as well with actual order amount
        try {
          addStoredCustomer({
            name: ship.recipientName,
            phone: ship.recipientPhone,
            city: ship.governorate,
            governorate: ship.governorate,
            address: ship.address,
            ordersCount: 1,
            totalSpent: Number(ship.codAmount) || 0
          });
        } catch {}

        // Trigger notification for incoming cloud order
        try {
          addAppNotification({
            title: `طلب شراء جديد #${newOrd.number}`,
            desc: `طلب وارد من ${newOrd.customerName} بقيمة ${formatIQD(newOrd.total)} (${newOrd.customerCity})`,
            type: 'order',
            link: '/orders'
          });
        } catch {}
      }
    });

    if (hasNew) {
      syncedOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      saveStoredOrders(syncedOrders);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('zaeem_store_updated', { detail: { orders: syncedOrders } }));
        window.dispatchEvent(new Event('storage'));
      }
    }

    return syncedOrders;
  } catch (e) {
    console.warn('[storeState] Error syncing cloud orders:', e);
    return getStoredOrders();
  }
}

export function updateStoredOrderStatus(id: number, nextStatus: StoreOrder['status']): StoreOrder | null {
  const orders = getStoredOrders();
  const idx = orders.findIndex(o => o.id === id);
  if (idx === -1) return null;
  orders[idx].status = nextStatus;
  saveStoredOrders(orders);

  // Sync status to Central Neon database if trackingNumber exists
  if (orders[idx].trackingNumber) {
    let cloudStatus: CloudShipment['status'] = 'جديدة';
    if (nextStatus === 'confirmed') cloudStatus = 'في المستودع';
    else if (nextStatus === 'processing') cloudStatus = 'قيد التجهيز';
    else if (nextStatus === 'delivered') cloudStatus = 'تم التسليم';
    else if (nextStatus === 'cancelled') cloudStatus = 'مرتجعة';

    import('../utils/cloudDb').then((mod: any) => {
      if (typeof mod?.executeSql === 'function') {
        const q = `UPDATE za3em_shipments SET status = '${cloudStatus}' WHERE tracking_number = '${orders[idx].trackingNumber?.replace(/'/g, "''")}';`;
        mod.executeSql(q).catch(() => {});
      }
    });

    // Trigger Notification for shipment status change
    try {
      addAppNotification({
        title: `تحديث حالة الشحنة #${orders[idx].trackingNumber || orders[idx].number}`,
        desc: `تم تغيير حالة الشحنة للزبون (${orders[idx].customerName}) إلى "${cloudStatus}"`,
        type: 'shipment',
        link: '/shipments'
      });
    } catch {}
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('zaeem_store_updated'));
    window.dispatchEvent(new CustomEvent('zaeem_shipments_updated'));
  }
  return orders[idx];
}

// Customer Methods
export function getStoredCustomers(): StoreCustomer[] {
  try {
    const raw = localStorage.getItem(CUSTOMERS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const DUMMY_NAMES = ['أحمد علي', 'مريم حسن', 'عمر فاروق', 'زهراء كاظم', 'مصطفى البابلي'];
      const cleaned = (Array.isArray(parsed) ? parsed : []).filter((c: any) => {
        const isDummy = (c.id >= 200 && c.id <= 210) ||
          DUMMY_NAMES.includes(c.name) ||
          c.phone === '+964 770 123 4567' ||
          c.phone === '+964 780 987 6543' ||
          c.phone === '+964 750 444 3322' ||
          c.phone === '+964 771 555 6677' ||
          c.phone === '+964 781 222 1100';
        return !isDummy;
      });
      if (cleaned.length !== parsed.length) {
        saveStoredCustomers(cleaned);
      }
      return cleaned;
    }
  } catch (e) {}

  return [];
}

export function saveStoredCustomers(customers: StoreCustomer[]): void {
  localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));
}

export function addStoredCustomer(customer: Omit<StoreCustomer, 'id' | 'ordersCount' | 'totalSpent'> & { ordersCount?: number; totalSpent?: number; address?: string }): StoreCustomer {
  const customers = getStoredCustomers();
  const existingIdx = customers.findIndex(c => c.phone === customer.phone || (c.name === customer.name && c.city === customer.city));

  const ordersCount = typeof customer.ordersCount === 'number' ? customer.ordersCount : 0;
  const totalSpent = typeof customer.totalSpent === 'number' ? customer.totalSpent : 0;

  if (existingIdx !== -1) {
    customers[existingIdx].ordersCount += ordersCount;
    customers[existingIdx].totalSpent += totalSpent;
    if (customer.address) customers[existingIdx].address = customer.address;
    if (customer.governorate) customers[existingIdx].governorate = customer.governorate;
    customers[existingIdx].lastOrderAt = new Date().toISOString();
    saveStoredCustomers(customers);
    return customers[existingIdx];
  }

  const newCustomer: StoreCustomer = {
    name: customer.name,
    phone: customer.phone,
    email: customer.email,
    city: customer.city,
    governorate: customer.governorate,
    address: customer.address || '',
    id: Date.now(),
    ordersCount,
    totalSpent,
    lastOrderAt: new Date().toISOString()
  };
  const updated = [newCustomer, ...customers];
  saveStoredCustomers(updated);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('zaeem_store_updated'));
  }
  return newCustomer;
}

/**
 * Completely purges previous user/account cached store records on logout
 * to prevent cross-account data leakage in the same browser.
 */
export function clearMerchantSessionData(): void {
  if (typeof window === 'undefined') return;
  try {
    const keysToRemove = [
      ORDERS_KEY,
      CUSTOMERS_KEY,
      PRODUCTS_KEY,
      'zaeem_local_shipments',
      'zaeem_store_data',
      'zaeem_onboarded_store',
      'zaeem_store_active',
      'zaeem_support_tickets',
      'zaeem_notifications',
      'zaeem_user',
      'zaeem_active_subdomain',
      'zaeem_onboarding_completed',
      'zaeem_theme_customization'
    ];
    keysToRemove.forEach(k => localStorage.removeItem(k));

    // Also remove any scoped orders keys
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && (key.startsWith(`${ORDERS_KEY}_`) || key.startsWith(`${CUSTOMERS_KEY}_`))) {
        localStorage.removeItem(key);
      }
    }

    window.dispatchEvent(new CustomEvent('zaeem_store_updated'));
    window.dispatchEvent(new CustomEvent('zaeem_notifications_updated'));
  } catch (e) {
    console.warn('Error clearing merchant session data:', e);
  }
}

/**
 * Ensures account data isolation: if a different merchant logs in on the same browser,
 * cleans previous merchant data so it starts pristine and re-syncs from cloud.
 */
export function ensureAccountDataIsolation(currentUserIdOrEmail: string): void {
  if (!currentUserIdOrEmail || typeof window === 'undefined') return;
  try {
    const cleanId = currentUserIdOrEmail.toLowerCase().trim();
    const lastId = localStorage.getItem('zaeem_active_account_id');
    if (lastId && lastId !== cleanId) {
      clearMerchantSessionData();
    }
    localStorage.setItem('zaeem_active_account_id', cleanId);
  } catch {}
}
