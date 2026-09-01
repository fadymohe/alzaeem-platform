import { formatIQD } from './iraqData';

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
  items?: Array<{ productName: string; quantity: number; unitPrice: number }>;
}

export interface StoreCustomer {
  id: number;
  name: string;
  phone: string;
  email?: string;
  city: string;
  governorate: string;
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

const INITIAL_CUSTOMERS: StoreCustomer[] = [
  {
    id: 201,
    name: 'أحمد علي',
    phone: '+964 770 123 4567',
    email: 'ahmed.ali@gmail.com',
    city: 'بغداد — الكرادة',
    governorate: 'بغداد',
    ordersCount: 3,
    totalSpent: 240000,
    lastOrderAt: new Date().toISOString()
  },
  {
    id: 202,
    name: 'مريم حسن',
    phone: '+964 780 987 6543',
    email: 'maryam.h@yahoo.com',
    city: 'البصرة — الجزائر',
    governorate: 'البصرة',
    ordersCount: 5,
    totalSpent: 420000,
    lastOrderAt: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: 203,
    name: 'عمر فاروق',
    phone: '+964 750 444 3322',
    email: 'omar.farooq@outlook.com',
    city: 'أربيل — عينكاوا',
    governorate: 'أربيل',
    ordersCount: 2,
    totalSpent: 130000,
    lastOrderAt: new Date(Date.now() - 3600000 * 12).toISOString()
  },
  {
    id: 204,
    name: 'زهراء كاظم',
    phone: '+964 771 555 6677',
    email: 'zahraa.k@gmail.com',
    city: 'النجف — الحنانة',
    governorate: 'النجف',
    ordersCount: 4,
    totalSpent: 310000,
    lastOrderAt: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    id: 205,
    name: 'مصطفى البابلي',
    phone: '+964 781 222 1100',
    email: 'mustafa.babili@gmail.com',
    city: 'بابل — الحلة',
    governorate: 'بابل',
    ordersCount: 1,
    totalSpent: 110000,
    lastOrderAt: new Date(Date.now() - 3600000 * 48).toISOString()
  }
];

// Local Storage Keys
const PRODUCTS_KEY = 'zaeem_store_products';
const ORDERS_KEY = 'zaeem_store_orders';
const CUSTOMERS_KEY = 'zaeem_store_customers';

// Product Methods
export function getStoredProducts(): StoreProduct[] {
  try {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
  return INITIAL_PRODUCTS;
}

export function saveStoredProducts(products: StoreProduct[]): void {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}

export function addStoredProduct(product: Omit<StoreProduct, 'id'>): StoreProduct {
  const products = getStoredProducts();
  const newProduct: StoreProduct = {
    ...product,
    id: Date.now()
  };
  const updated = [newProduct, ...products];
  saveStoredProducts(updated);
  return newProduct;
}

export function updateStoredProduct(id: number, updates: Partial<StoreProduct>): StoreProduct | null {
  const products = getStoredProducts();
  const idx = products.findIndex(p => p.id === id);
  if (idx === -1) return null;
  products[idx] = { ...products[idx], ...updates };
  saveStoredProducts(products);
  return products[idx];
}

export function deleteStoredProduct(id: number): boolean {
  const products = getStoredProducts();
  const updated = products.filter(p => p.id !== id);
  saveStoredProducts(updated);
  return true;
}

// Order Methods
export function getStoredOrders(): StoreOrder[] {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  localStorage.setItem(ORDERS_KEY, JSON.stringify(INITIAL_ORDERS));
  return INITIAL_ORDERS;
}

export function saveStoredOrders(orders: StoreOrder[]): void {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

export function addStoredOrder(order: Omit<StoreOrder, 'id' | 'number' | 'createdAt'>): StoreOrder {
  const orders = getStoredOrders();
  const newOrder: StoreOrder = {
    ...order,
    id: Date.now(),
    number: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
    createdAt: new Date().toISOString()
  };
  const updated = [newOrder, ...orders];
  saveStoredOrders(updated);
  return newOrder;
}

export function updateStoredOrderStatus(id: number, nextStatus: StoreOrder['status']): StoreOrder | null {
  const orders = getStoredOrders();
  const idx = orders.findIndex(o => o.id === id);
  if (idx === -1) return null;
  orders[idx].status = nextStatus;
  saveStoredOrders(orders);
  return orders[idx];
}

// Customer Methods
export function getStoredCustomers(): StoreCustomer[] {
  try {
    const raw = localStorage.getItem(CUSTOMERS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(INITIAL_CUSTOMERS));
  return INITIAL_CUSTOMERS;
}

export function saveStoredCustomers(customers: StoreCustomer[]): void {
  localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));
}

export function addStoredCustomer(customer: Omit<StoreCustomer, 'id' | 'ordersCount' | 'totalSpent'>): StoreCustomer {
  const customers = getStoredCustomers();
  const newCustomer: StoreCustomer = {
    ...customer,
    id: Date.now(),
    ordersCount: 1,
    totalSpent: 45000,
    lastOrderAt: new Date().toISOString()
  };
  const updated = [newCustomer, ...customers];
  saveStoredCustomers(updated);
  return newCustomer;
}
