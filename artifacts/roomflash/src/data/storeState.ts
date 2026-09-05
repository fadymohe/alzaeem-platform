import { formatIQD } from './iraqData';
import { saveCloudStore, saveCloudShipment, type CloudShipment } from '../utils/cloudDb';

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

// Initial Sample Seed Data
const INITIAL_PRODUCTS: StoreProduct[] = [
  {
    id: 1,
    name: 'قميص قطن فاخر أبيض',
    sku: 'SHIRT-001',
    description: 'قميص رجالي قطن 100% ممتاز مريح لجميع المناسبات',
    price: 45000,
    compareAtPrice: 55000,
    stock: 18,
    lowStockThreshold: 5,
    category: 'أزياء رجالي',
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&auto=format&fit=crop&q=80',
    weightGrams: 350
  },
  {
    id: 2,
    name: 'عطر الفخامة الملكي 100ml',
    sku: 'PERFUME-99',
    description: 'عطر شرقي فاخر بلمسات العود والمسك الأبيض',
    price: 65000,
    compareAtPrice: 80000,
    stock: 24,
    lowStockThreshold: 4,
    category: 'عطور وتجميل',
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=500&auto=format&fit=crop&q=80',
    weightGrams: 500
  },
  {
    id: 3,
    name: 'ساعة لومينور أوتوماتيك',
    sku: 'WATCH-LUM',
    description: 'ساعة يد أوتوماتيكية مقاومة للماء مع سوار جلدي فاخر',
    price: 85000,
    compareAtPrice: 110000,
    stock: 8,
    lowStockThreshold: 3,
    category: 'إكسسوارات وساعات',
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80',
    weightGrams: 250
  },
  {
    id: 4,
    name: 'سماعات بلوتوث اللاسلكية برو',
    sku: 'AUDIO-PRO',
    description: 'سماعات عازلة للصوت مع بطارية تدوم 24 ساعة',
    price: 35000,
    compareAtPrice: 45000,
    stock: 30,
    lowStockThreshold: 5,
    category: 'إلكترونيات',
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80',
    weightGrams: 200
  },
  {
    id: 5,
    name: 'حقيبة ظهر جلد طبيعي',
    sku: 'BAG-LEATHER',
    description: 'حقيبة سفر وعمل تتسع للابتاوب مع حماية من الصدمات',
    price: 55000,
    compareAtPrice: 70000,
    stock: 12,
    lowStockThreshold: 2,
    category: 'حقائب ومستلزمات',
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&auto=format&fit=crop&q=80',
    weightGrams: 800
  }
];

const INITIAL_ORDERS: StoreOrder[] = [
  {
    id: 101,
    number: 'ORD-1001',
    customerName: 'أحمد علي',
    customerPhone: '+964 770 123 4567',
    customerCity: 'بغداد — الكرادة',
    address: 'شارع عرصة الهندي قرب جامع الخضيري',
    total: 90000,
    itemsCount: 2,
    status: 'pending',
    paymentMethod: 'cod',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    items: [
      { productName: 'قميص قطن فاخر أبيض', quantity: 2, unitPrice: 45000 }
    ]
  },
  {
    id: 102,
    number: 'ORD-1002',
    customerName: 'مريم حسن',
    customerPhone: '+964 780 987 6543',
    customerCity: 'البصرة — الجزائر',
    address: 'حي الجزائر قرب مستشفى البصرة العام',
    total: 130000,
    itemsCount: 2,
    status: 'confirmed',
    paymentMethod: 'cod',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    items: [
      { productName: 'عطر الفخامة الملكي 100ml', quantity: 2, unitPrice: 65000 }
    ]
  },
  {
    id: 103,
    number: 'ORD-1003',
    customerName: 'عمر فاروق',
    customerPhone: '+964 750 444 3322',
    customerCity: 'أربيل — عينكاوا',
    address: 'شارع 100 المتر قرب مجمع الأبراج',
    total: 85000,
    itemsCount: 1,
    status: 'processing',
    paymentMethod: 'cod',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    items: [
      { productName: 'ساعة لومينور أوتوماتيك', quantity: 1, unitPrice: 85000 }
    ]
  },
  {
    id: 104,
    number: 'ORD-1004',
    customerName: 'زهراء كاظم',
    customerPhone: '+964 771 555 6677',
    customerCity: 'النجف — الحنانة',
    address: 'شارع المدينة قرب مرقد الإمام علي',
    total: 45000,
    itemsCount: 1,
    status: 'delivered',
    paymentMethod: 'cod',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    items: [
      { productName: 'قميص قطن فاخر أبيض', quantity: 1, unitPrice: 45000 }
    ]
  },
  {
    id: 105,
    number: 'ORD-1005',
    customerName: 'مصطفى البابلي',
    customerPhone: '+964 781 222 1100',
    customerCity: 'بابل — الحلة',
    address: 'شارع 40 قرب مستشفى الحلة التخصصي',
    total: 110000,
    itemsCount: 2,
    status: 'delivered',
    paymentMethod: 'cod',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    items: [
      { productName: 'حقيبة ظهر جلد طبيعي', quantity: 2, unitPrice: 55000 }
    ]
  }
];

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
      // Clean out the 5 hardcoded dummy sample products if present
      const isDummyCatalog = Array.isArray(parsed) && parsed.length === 5 &&
        parsed.some((p: any) => p.sku === 'SHIRT-001' || p.sku === 'PERFUME-99');
      
      if (!isDummyCatalog && Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {}

  // Check if merchant has an onboarded product or products list
  try {
    const rawStore = localStorage.getItem('zaeem_onboarded_store') || localStorage.getItem('zaeem_store_data');
    if (rawStore) {
      const parsedStore = JSON.parse(rawStore);
      if (Array.isArray(parsedStore.products) && parsedStore.products.length > 0) {
        saveStoredProducts(parsedStore.products);
        return parsedStore.products;
      }
      if (parsedStore.product && (parsedStore.product.name || parsedStore.product.title)) {
        const realProd: StoreProduct = {
          id: 1,
          name: parsedStore.product.title || parsedStore.product.name,
          sku: `PRD-${(parsedStore.subdomain || 'ZAEEM').replace(/[^a-zA-Z0-9]/g, '').slice(0, 4).toUpperCase() || 'SHOP'}-001`,
          description: parsedStore.product.description || parsedStore.slogan || 'منتج أصلي عالي الجودة مع شحن سريع وضمان الدفع عند الاستلام',
          price: Number(parsedStore.product.price) || 45000,
          compareAtPrice: Number(parsedStore.product.compareAtPrice) || Math.round((Number(parsedStore.product.price) || 45000) * 1.3),
          stock: 50,
          lowStockThreshold: 5,
          category: parsedStore.category || 'عام',
          status: 'active',
          imageUrl: parsedStore.product.imageUrl || parsedStore.product.image || 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&auto=format&fit=crop&q=80',
          weightGrams: 500
        };
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify([realProd]));
        return [realProd];
      }
    }
  } catch (e) {}

  // Default is empty if merchant has not added any products
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
    id: Date.now()
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

// Order Methods
export function getStoredOrders(): StoreOrder[] {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
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

      // Normalize any existing real orders to follow the order0001 format if needed
      let hasChange = cleaned.length !== parsed.length;
      cleaned.forEach((ord, index) => {
        if (!ord.number || !ord.number.toLowerCase().startsWith('order')) {
          ord.number = `order${String(cleaned.length - index).padStart(4, '0')}`;
          hasChange = true;
        }
      });

      if (hasChange) {
        saveStoredOrders(cleaned);
      }
      return cleaned;
    }
  } catch (e) {}

  // Real stores start with 0 orders by default
  return [];
}

export function saveStoredOrders(orders: StoreOrder[]): void {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

export function addStoredOrder(order: Omit<StoreOrder, 'id' | 'number' | 'createdAt'>): StoreOrder {
  const orders = getStoredOrders();
  const orderNumber = getNextOrderNumber(orders);

  // 1. Generate unique Iraqi shipment tracking number (e.g. ZAEEM-2026-XXXXXX)
  const trackingNumber = order.trackingNumber || `ZAEEM-2026-${Math.floor(100000 + Math.random() * 900000)}`;
  const shippingCompany = order.shippingCompany || 'شركة الزعيم للشحن السريع';

  const newOrder: StoreOrder = {
    ...order,
    id: Date.now(),
    number: orderNumber,
    trackingNumber,
    shippingCompany,
    createdAt: new Date().toISOString()
  };
  const updated = [newOrder, ...orders];
  saveStoredOrders(updated);

  // 2. Sync Customer record
  try {
    addStoredCustomer({
      name: order.customerName,
      phone: order.customerPhone,
      city: order.customerCity,
      governorate: order.customerCity,
      address: order.address
    });
  } catch {}

  // 3. Immediately create & upload Shipment to Al-Zaeem Logistics (Local + Neon Cloud Database)
  try {
    let sub = 'alzaeem';
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

export function updateStoredOrderStatus(id: number, nextStatus: StoreOrder['status']): StoreOrder | null {
  const orders = getStoredOrders();
  const idx = orders.findIndex(o => o.id === id);
  if (idx === -1) return null;
  orders[idx].status = nextStatus;
  saveStoredOrders(orders);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('zaeem_store_updated'));
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

  const ordersCount = typeof customer.ordersCount === 'number' ? customer.ordersCount : 1;
  const totalSpent = typeof customer.totalSpent === 'number' ? customer.totalSpent : 45000;

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
