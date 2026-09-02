-- ============================================================================
-- za3em.shop - Multi-Tenant Landing Pages & E-Commerce Schema
-- متوافق تماماً مع PostgreSQL ومعايير العملة المصرية (الجنيه المصري الصحيح)
-- ============================================================================

-- 1. جدول المتاجر (stores)
CREATE TABLE IF NOT EXISTS za3em_stores (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    subdomain VARCHAR(100) NOT NULL UNIQUE,
    template_id VARCHAR(100) NOT NULL DEFAULT 'easyorders-flash',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_za3em_stores_subdomain ON za3em_stores(subdomain);

-- 2. جدول المنتجات (products)
-- السعر بالجنيه المصري الصحيح INTEGER (بدون كسور أو قروش)
CREATE TABLE IF NOT EXISTS za3em_products (
    id SERIAL PRIMARY KEY,
    store_id INTEGER NOT NULL REFERENCES za3em_stores(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT DEFAULT '',
    price INTEGER NOT NULL CHECK (price >= 0), -- السعر بالجنيه المصري الصحيح
    image_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_za3em_products_store_id ON za3em_products(store_id);

-- 3. جدول الطلبات (orders)
CREATE TABLE IF NOT EXISTS za3em_orders (
    id SERIAL PRIMARY KEY,
    store_id INTEGER NOT NULL REFERENCES za3em_stores(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES za3em_products(id) ON DELETE CASCADE,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_address TEXT NOT NULL,
    governorate VARCHAR(100) NOT NULL,
    total_amount INTEGER NOT NULL CHECK (total_amount >= 0), -- الإجمالي بالجنيه المصري الصحيح
    shipping_cost INTEGER NOT NULL DEFAULT 0,                -- تكلفة الشحن بالجنيه المصري
    shipping_company VARCHAR(100) NOT NULL DEFAULT 'Bosta Express',
    tracking_number VARCHAR(100),
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, processing, shipped, delivered, cancelled
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_za3em_orders_store_id ON za3em_orders(store_id);
CREATE INDEX IF NOT EXISTS idx_za3em_orders_tracking ON za3em_orders(tracking_number);
CREATE INDEX IF NOT EXISTS idx_za3em_orders_phone ON za3em_orders(customer_phone);

-- ============================================================================
-- بيانات تجريبية أولية (Seed Data)
-- متجر "zero.za3em.shop"
-- ============================================================================

INSERT INTO za3em_stores (id, name, subdomain, template_id)
VALUES (1, 'متجر زيرو إكسبريس', 'zero', 'easyorders-flash')
ON CONFLICT (subdomain) DO UPDATE 
SET name = EXCLUDED.name, template_id = EXCLUDED.template_id;

INSERT INTO za3em_products (id, store_id, title, description, price, image_url)
VALUES (
    1,
    1,
    'سماعة بلوتوث لاسلكية Ultra Bass عازلة للضوضاء - إصدار 2026',
    'سماعة رأس احترافية صوت محيطي 3D، بطارية تدوم 48 ساعة متواصلة، شحن سريع Type-C، متوافقة مع جميع الهواتف، مع ضمان سنة كاملة ضد عيوب الصناعة.',
    450, -- 450 جنيه مصري صحيح بدون قروش
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'
)
ON CONFLICT (id) DO NOTHING;

-- إعادة تعيين تسلسل المفاتيح
SELECT setval(pg_get_serial_sequence('za3em_stores', 'id'), COALESCE(max(id), 1)) FROM za3em_stores;
SELECT setval(pg_get_serial_sequence('za3em_products', 'id'), COALESCE(max(id), 1)) FROM za3em_products;
SELECT setval(pg_get_serial_sequence('za3em_orders', 'id'), COALESCE(max(id), 1)) FROM za3em_orders;
