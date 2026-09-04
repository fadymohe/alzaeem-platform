import type { Plugin } from 'vite';
import fs from 'node:fs';
import path from 'node:path';

export function zaeemApiPlugin(): Plugin {
  const dataDir = path.resolve(__dirname, 'server_data');
  const storesFile = path.join(dataDir, 'stores.json');
  const ordersFile = path.join(dataDir, 'orders.json');

  const getStores = (): Record<string, any> => {
    try {
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      if (fs.existsSync(storesFile)) {
        const raw = fs.readFileSync(storesFile, 'utf8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('[Vite API] Error reading stores:', e);
    }
    // Default initial stores
    return {
      fakhama: {
        subdomain: 'fakhama',
        name: 'متجر الفخامة العراقي',
        slogan: 'وجهتك الأولى للتسوق الراقي والشحن السريع لجميع محافظات العراق',
        templateId: 'shoppingcart.1.2.7',
        storeCode: 'ZAEEM-FAKH-8421',
        productTitle: 'عطر تاج الفخامة الفرنسي الملكي',
        productPrice: 45000,
        productImage: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&auto=format&fit=crop&q=80',
        categories: ['عطور فرنسية', 'دهن عود وبخور', 'عناية بالبشرة']
      },
      zero: {
        subdomain: 'zero',
        name: 'متجر زيرو إكسبريس',
        slogan: 'متجر تجريبي لاختبار طلبات الشحن السريع',
        templateId: 'easyorders-flash',
        storeCode: 'ZAEEM-ZERO-1001',
        productTitle: 'سماعة بلوتوث لاسلكية Ultra Bass عازلة للضوضاء',
        productPrice: 35000,
        productImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
        categories: ['إلكترونيات', 'صوتيات']
      },
      alzaeem: {
        subdomain: 'alzaeem',
        name: 'متجر الزعيم الذهبي',
        slogan: 'أفضل الإلكترونيات والأجهزة الذكية بضمان حقيقي والدفع عند الاستلام',
        templateId: 'volt',
        storeCode: 'ZAEEM-ALZA-7721',
        productTitle: 'ساعة لومينور بريميوم أوتوماتيك',
        productPrice: 85000,
        productImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
        categories: ['ساعات ذكية', 'إلكترونيات']
      }
    };
  };

  const saveStores = (stores: Record<string, any>) => {
    try {
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      fs.writeFileSync(storesFile, JSON.stringify(stores, null, 2), 'utf8');
    } catch (e) {
      console.warn('[Vite API] Error saving stores:', e);
    }
  };

  const RESERVED = [
    'admin', 'api', 'app', 'zaeem', 'za3em', 'dashboard', 'root', 'www',
    'mail', 'support', 'billing', 'auth', 'account', 'portal', 'cpanel',
    'system', 'null', 'undefined', 'test', 'stores', 'store', 'static', 'assets', 'demo'
  ];

  return {
    name: 'zaeem-api-server-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url || '';

        // Only intercept /api/ routes
        if (!url.startsWith('/api/')) {
          return next();
        }

        const parsedUrl = new URL(url, 'http://localhost');
        const pathname = parsedUrl.pathname;

        // Helper to send JSON
        const sendJson = (status: number, data: any) => {
          res.statusCode = status;
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.end(JSON.stringify(data));
        };

        // Helper to read body
        const readBody = async (): Promise<any> => {
          return new Promise((resolve) => {
            let body = '';
            req.on('data', (chunk) => {
              body += chunk.toString();
            });
            req.on('end', () => {
              try {
                resolve(body ? JSON.parse(body) : {});
              } catch {
                resolve({});
              }
            });
          });
        };

        // 1. Health check
        if (pathname === '/api/health') {
          return sendJson(200, { status: 'ok', time: new Date().toISOString() });
        }

        // 2. Subdomain check endpoint: GET /api/stores/check-subdomain
        if (pathname === '/api/stores/check-subdomain' && req.method === 'GET') {
          const rawSlug = (parsedUrl.searchParams.get('subdomain') || parsedUrl.searchParams.get('slug') || '').toLowerCase().trim();
          const cleanSub = rawSlug.replace(/[^a-z0-9-]/g, '');

          if (!cleanSub) {
            return sendJson(400, { available: false, error: 'اسم النطاق مطلوب' });
          }

          if (cleanSub.length < 3) {
            return sendJson(200, {
              available: false,
              reason: 'short',
              message: 'يجب أن يتكون الدومين من 3 أحرف إنجليزية أو أرقام على الأقل'
            });
          }

          if (RESERVED.includes(cleanSub)) {
            return sendJson(200, {
              available: false,
              reason: 'reserved',
              message: 'هذا النطاق محجوز لاستخدام إدارة منصة الزعيم وغير متاح للمتاجر',
              suggestions: [`${cleanSub}-store`, `${cleanSub}-shop`, `${cleanSub}-iq`]
            });
          }

          const stores = getStores();
          if (stores[cleanSub]) {
            return sendJson(200, {
              available: false,
              reason: 'taken',
              message: `هذا النطاق (${cleanSub}.za3em.shop) محجوز مسبقاً من متجر آخر`,
              suggestions: [`${cleanSub}-store`, `${cleanSub}-shop`, `${cleanSub}-iq`, `${cleanSub}2026`]
            });
          }

          return sendJson(200, {
            available: true,
            subdomain: cleanSub,
            message: `النطاق (${cleanSub}.za3em.shop) متاح ويمكن حجزه فوراً لمتجرك`
          });
        }

        // 3. Store creation / reservation: POST /api/tenant/stores
        if (pathname === '/api/tenant/stores' && req.method === 'POST') {
          const body = await readBody();
          const { name, subdomain, templateId, storeCode, productTitle, productPrice, productImage, logoUrl, bannerUrl, categories, slogan } = body;

          if (!name || !subdomain) {
            return sendJson(400, { error: 'اسم المتجر والنطاق الفرعي مطلوبان' });
          }

          const cleanSub = (subdomain || '').toLowerCase().replace(/[^a-z0-9-]/g, '');
          const generatedCode = storeCode || `ZAEEM-${cleanSub.toUpperCase().slice(0, 4)}-${Math.floor(1000 + Math.random() * 9000)}`;

          const stores = getStores();
          const newStoreEntry = {
            id: Date.now(),
            name,
            subdomain: cleanSub,
            templateId: templateId || 'shoppingcart.1.2.7',
            storeCode: generatedCode,
            slogan: slogan || 'أفضل المنتجات المختارة بعناية مع التوصيل السريع لجميع محافظات العراق',
            logoUrl: logoUrl || undefined,
            bannerUrl: bannerUrl || undefined,
            categories: categories || ['عام'],
            product: {
              id: 1,
              title: productTitle || 'منتج المتجر الحصري',
              name: productTitle || 'منتج المتجر الحصري',
              price: Number(productPrice) || 45000,
              compareAtPrice: Math.round((Number(productPrice) || 45000) * 1.3),
              imageUrl: productImage || 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&auto=format&fit=crop&q=80',
              image: productImage || 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&auto=format&fit=crop&q=80',
              description: slogan || 'منتج فاخر عالي الجودة مع شحن سريع وضمان الدفع عند الاستلام.'
            },
            createdAt: new Date().toISOString()
          };

          // ACTUALLY RESERVE AND SAVE SUBDOMAIN ON SERVER!
          stores[cleanSub] = newStoreEntry;
          saveStores(stores);

          console.log(`[Vite API] Store successfully registered: ${cleanSub}.za3em.shop (${generatedCode})`);

          return sendJson(200, {
            success: true,
            store: newStoreEntry,
            product: newStoreEntry.product,
            domainUrl: `https://${cleanSub}.za3em.shop`
          });
        }

        // 4. Store fetching by subdomain: GET /api/tenant/stores/:subdomain
        if (pathname.startsWith('/api/tenant/stores/') && req.method === 'GET') {
          const rawSub = pathname.replace('/api/tenant/stores/', '').toLowerCase().trim();
          const cleanSub = rawSub.replace(/[^a-z0-9-]/g, '');

          const stores = getStores();
          const found = stores[cleanSub];

          if (found) {
            return sendJson(200, {
              store: found,
              product: found.product,
              products: [found.product]
            });
          }

          return sendJson(404, {
            error: `المتجر ذو النطاق الفرعي (${cleanSub}.za3em.shop) غير مسجل بعد`
          });
        }

        // 5. Tenant resolve endpoint: GET /api/tenant/resolve
        if (pathname === '/api/tenant/resolve' && req.method === 'GET') {
          const manualSub = (parsedUrl.searchParams.get('subdomain') || '').toLowerCase().trim();
          const cleanSub = manualSub.replace(/[^a-z0-9-]/g, '');

          if (cleanSub) {
            const stores = getStores();
            const found = stores[cleanSub];
            if (found) {
              return sendJson(200, {
                isRoot: false,
                subdomain: cleanSub,
                store: found,
                product: found.product,
                allProducts: [found.product]
              });
            }
          }

          return sendJson(200, {
            isRoot: true,
            subdomain: null,
            message: 'بوابة منصة الزعيم'
          });
        }

        // 6. Order placement endpoint: POST /api/tenant/orders
        if (pathname === '/api/tenant/orders' && req.method === 'POST') {
          const body = await readBody();
          const trackingNumber = `IQ-ZAEEM-${Math.floor(10000000 + Math.random() * 90000000)}`;

          const orderEntry = {
            id: Date.now(),
            trackingNumber,
            customerName: body.customerName,
            customerPhone: body.customerPhone,
            customerAddress: body.customerAddress,
            governorate: body.governorate,
            quantity: body.quantity || 1,
            unitPrice: body.unitPrice,
            shippingCost: body.shippingCost || 5000,
            totalAmount: (body.quantity || 1) * (body.unitPrice || 45000) + (body.shippingCost || 5000),
            status: 'confirmed',
            shippingPartner: 'شركة الزعيم للشحن - أسطول العراق',
            createdAt: new Date().toISOString()
          };

          try {
            let orders: any[] = [];
            if (fs.existsSync(ordersFile)) {
              orders = JSON.parse(fs.readFileSync(ordersFile, 'utf8'));
            }
            orders.unshift(orderEntry);
            fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2), 'utf8');
          } catch {}

          return sendJson(200, {
            success: true,
            order: orderEntry,
            trackingNumber,
            message: 'تم تسجيل الطلب وتوليد بوليصة الشحن بنجاح'
          });
        }

        // 7. Auth OTP mocks (instant access fallback)
        if (pathname === '/api/auth/send-otp' && req.method === 'POST') {
          return sendJson(200, { success: true, otpCode: '123456', message: 'تم إرسال كود التحقق بنجاح' });
        }

        if (pathname === '/api/auth/verify-otp' && req.method === 'POST') {
          return sendJson(200, { success: true, message: 'تم التحقق بنجاح' });
        }

        if (pathname === '/api/auth/check-email' && req.method === 'POST') {
          return sendJson(200, { exists: false });
        }

        // Pass to next if not matched
        return next();
      });
    }
  };
}
