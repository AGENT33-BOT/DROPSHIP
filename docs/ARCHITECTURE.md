# DropshipPro - Architecture Document

## System Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        CUSTOMER FACING LAYER                              │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │   Next.js  │  │  Customer   │  │ Landing    │  │   Funnel   │ │
│  │   Store    │  │  Account    │  │   Builder   │  │   Builder   │ │
│  └──────┬──────┘  └──────┬───────┘  └──────┬──────┘  └──────┬──────┘ │
└─────────┼────────────────┼──────────────┼────────────┼──────────────┘
          │                │              │            │
          └────────────────┴──────────────┴────────────┘
                              │
                    ┌─────────▼─────────┐
                    │   Medusa API      │
                    │ (Commerce Backend) │
                    └─────────┬─────────┘
                              │
┌─────────────────────────────┼───────────────────────────────────────┐
│                    INTERNAL SERVICES LAYER                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │ Price Engine │  │ Stock Sync   │  │ Order Router│              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │Supplier Conn.│  │Notification  │  │Webhook Svc. │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
└─────────────────────────────┬───────────────────────────────────────┘
                              │
┌─────────────────────────────┼───────────────────────────────────────┐
│              OPENCLAW AUTOMATION LAYER (AI Operations)              │
│  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐│
│  │  Ops   │  │Catalog │  │Fulfill│  │Support│  │Marketing│ │Pricing││
│  │ Agent  │  │ Agent  │  │ Agent  │  │ Agent  │  │ Agent  │  │ Agent ││
│  └────────┘  └────────┘  └────────┘  └────────┘  └────────┘  └────────┘│
└─────────────────────────────────────────────────────────────────────┘
```

## Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14 + TypeScript + Tailwind CSS |
| Backend | Medusa (Node.js) |
| Database | PostgreSQL 15 |
| Cache/Queues | Redis 7 |
| Payments | Stripe |
| Shipping | AfterShip |
| Email | Resend |
| Supplier | CJdropshipping API |
| Deployment | Docker + Nginx |
| Automation | OpenClaw |

## Database Schema

### Core Tables (Medusa)

```sql
-- Products extended
CREATE TABLE dropship_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
    imported_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Supplier inventory sync
CREATE TABLE supplier_inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supplier_product_id VARCHAR(255) NOT NULL,
    supplier_sku VARCHAR(255),
    product_id UUID REFERENCES dropship_products(id),
    stock_level INTEGER DEFAULT 0,
    stock_status VARCHAR(50) DEFAULT 'unknown',
    price DECIMAL(10,2),
    last_synced_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Order fulfillment tracking
CREATE TABLE fulfillments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
    created_at TIMESTAMP DEFAULT NOW()
);

-- Pricing rules
CREATE TABLE pricing_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    condition_type VARCHAR(100),
    condition_value JSONB,
    markup_type VARCHAR(50) DEFAULT 'percentage',
    markup_value DECIMAL(10,2),
    min_margin DECIMAL(5,2),
    priority INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Customer notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id VARCHAR(255),
    order_id VARCHAR(255),
    type VARCHAR(100) NOT NULL,
    channel VARCHAR(50) DEFAULT 'email',
    status VARCHAR(50) DEFAULT 'pending',
    sent_at TIMESTAMP,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Webhook events log
CREATE TABLE webhook_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source VARCHAR(100) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    payload JSONB,
    processed BOOLEAN DEFAULT FALSE,
    processed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Audit log
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor VARCHAR(255),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100),
    resource_id VARCHAR(255),
    changes JSONB,
    ip_address INET,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Retry queue
CREATE TABLE retry_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_type VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL,
    attempts INTEGER DEFAULT 0,
    max_attempts INTEGER DEFAULT 3,
    next_retry_at TIMESTAMP,
    last_error TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW()
);
```

## API Routes

### Internal Service Endpoints

| Method | Endpoint | Service | Description |
|--------|----------|---------|-------------|
| POST | /internal/supplier/import | Catalog | Import product from CJ |
| POST | /internal/supplier/sync | Stock Sync | Sync inventory |
| POST | /internal/pricing/calculate | Price Engine | Calculate product price |
| POST | /internal/orders/route | Order Router | Route order to supplier |
| POST | /internal/fulfillment/create | Fulfillment | Create supplier order |
| POST | /internal/fulfillment/track | Fulfillment | Update tracking |
| POST | /internal/notifications/send | Notification | Send email/SMS |
| POST | /internal/webhooks/process | Webhook | Process incoming webhook |

## OpenClaw Agent Definitions

See `agents/` directory for full definitions.

| Agent | Mission |
|-------|---------|
| Ops Agent | System monitoring, alerts, scheduling |
| Catalog Agent | Product import, content generation |
| Fulfillment Agent | Order processing, tracking |
| Support Agent | Customer notifications, refunds |
| Marketing Agent | Ad copy, campaigns |
| Pricing Agent | Price rules, margin management |

## Cron Jobs

| Job | Frequency | Purpose |
|-----|-----------|---------|
| stock-sync | */15 * * * * | Sync supplier inventory |
| price-update | */30 * * * * | Update prices based on rules |
| order-check | */5 * * * * | Check for new orders |
| tracking-update | */10 * * * * | Update tracking info |
| cleanup-logs | 0 2 * * * | Archive old logs |
| weekly-summary | 0 9 * * 1 | Send weekly report |

## Webhook Events

### Inbound Webhooks
- Stripe: payment_intent.succeeded, payment_intent.failed
- CJdropshipping: order.created, order.shipped, order.delivered
- AfterShip: tracking.created, tracking.updated

### Outbound Webhooks
- Order created → Supplier
- Order shipped → Customer
- Refund processed → Customer
- Low stock → Admin

## Deployment

See `docker/` directory for Docker Compose configuration.

## Environment Variables

See `config/env.template` for template.
