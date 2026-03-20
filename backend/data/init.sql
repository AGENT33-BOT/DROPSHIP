-- DropshipPro Database Initialization

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- CORE TABLES (Medusa base - minimal)
-- =====================================================

-- Products table extension
CREATE TABLE IF NOT EXISTS dropship_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    medusa_product_id VARCHAR(255) UNIQUE NOT NULL,
    supplier_id VARCHAR(255),
    supplier_sku VARCHAR(255),
    supplier_price DECIMAL(10,2),
    markup_percentage DECIMAL(5,2) DEFAULT 30.00,
    min_price DECIMAL(10,2),
    max_price DECIMAL(10,2),
    ai_title TEXT,
    ai_description TEXT,
    ai_features JSONB,
    status VARCHAR(50) DEFAULT 'draft',
    imported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_dropship_products_supplier ON dropship_products(supplier_id);
CREATE INDEX idx_dropship_products_status ON dropship_products(status);

-- =====================================================
-- SUPPLIER INVENTORY
-- =====================================================

CREATE TABLE IF NOT EXISTS supplier_inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_product_id VARCHAR(255) NOT NULL,
    supplier_sku VARCHAR(255),
    product_id UUID REFERENCES dropship_products(id) ON DELETE SET NULL,
    stock_level INTEGER DEFAULT 0,
    stock_status VARCHAR(50) DEFAULT 'unknown',
    price DECIMAL(10,2),
    last_synced_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_supplier_inventory_product ON supplier_inventory(product_id);
CREATE INDEX idx_supplier_inventory_supplier ON supplier_inventory(supplier_product_id);

-- =====================================================
-- FULFILLMENTS
-- =====================================================

CREATE TABLE IF NOT EXISTS fulfillments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id VARCHAR(255) NOT NULL,
    medusa_order_id VARCHAR(255),
    supplier_order_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending',
    tracking_number VARCHAR(255),
    tracking_url VARCHAR(500),
    carrier VARCHAR(100),
    shipped_at TIMESTAMP,
    delivered_at TIMESTAMP,
    failed_at TIMESTAMP,
    retry_count INTEGER DEFAULT 0,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_fulfillments_order ON fulfillments(order_id);
CREATE INDEX idx_fulfillments_status ON fulfillments(status);

-- =====================================================
-- PRICING RULES
-- =====================================================

CREATE TABLE IF NOT EXISTS pricing_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    condition_type VARCHAR(100),
    condition_value JSONB,
    markup_type VARCHAR(50) DEFAULT 'percentage',
    markup_value DECIMAL(10,2),
    min_margin DECIMAL(5,2),
    priority INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_pricing_rules_active ON pricing_rules(active, priority);

-- =====================================================
-- NOTIFICATIONS
-- =====================================================

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id VARCHAR(255),
    order_id VARCHAR(255),
    type VARCHAR(100) NOT NULL,
    channel VARCHAR(50) DEFAULT 'email',
    status VARCHAR(50) DEFAULT 'pending',
    sent_at TIMESTAMP,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_order ON notifications(order_id);
CREATE INDEX idx_notifications_status ON notifications(status);

-- =====================================================
-- WEBHOOK EVENTS
-- =====================================================

CREATE TABLE IF NOT EXISTS webhook_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source VARCHAR(100) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    payload JSONB,
    processed BOOLEAN DEFAULT FALSE,
    processed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_webhook_events_processed ON webhook_events(processed, created_at);

-- =====================================================
-- AUDIT LOGS
-- =====================================================

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor VARCHAR(255),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100),
    resource_id VARCHAR(255),
    changes JSONB,
    ip_address INET,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_actor ON audit_logs(actor);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);

-- =====================================================
-- RETRY QUEUE
-- =====================================================

CREATE TABLE IF NOT EXISTS retry_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_type VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL,
    attempts INTEGER DEFAULT 0,
    max_attempts INTEGER DEFAULT 3,
    next_retry_at TIMESTAMP,
    last_error TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_retry_queue_status ON retry_queue(status, next_retry_at);

-- =====================================================
-- SUPPLIER CONFIGURATION
-- =====================================================

CREATE TABLE IF NOT EXISTS suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    api_key VARCHAR(500),
    api_secret VARCHAR(500),
    webhook_url VARCHAR(500),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert CJ Dropshipping as default supplier
INSERT INTO suppliers (name, type, active) 
VALUES ('CJ Dropshipping', 'cj', true)
ON CONFLICT DO NOTHING;
