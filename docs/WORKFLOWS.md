# DropshipPro - OpenClaw Workflows

## Workflow Definitions

### 1. Import Product

```yaml
name: import-product
trigger:
  type: command
  command: "import product [sku]"
  
steps:
  - agent: catalog
    action: fetch-supplier-product
    inputs:
      sku: "{{trigger.params.sku}}"
      
  - agent: catalog
    action: generate-ai-content
    inputs:
      product: "{{steps.0.product}}"
      
  - agent: catalog
    action: create-draft-product
    inputs:
      data: "{{steps.1.data}}"
      
  - response: "Product imported! Review at: {{steps.2.url}}"
```

### 2. Publish Product

```yaml
name: publish-product
trigger:
  type: command
  command: "publish product [id]"
  
steps:
  - agent: catalog
    action: validate-product
    inputs:
      product_id: "{{trigger.params.id}}"
      
  - agent: ops
    action: require-approval
    inputs:
      type: publish
      product_id: "{{trigger.params.id}}"
      
  - agent: catalog
    action: publish-product
    inputs:
      product_id: "{{trigger.params.id}}"
      
  - response: "Product published successfully!"
```

### 3. Daily Sales Summary

```yaml
name: daily-sales-summary
trigger:
  type: cron
  schedule: "0 9 * * *"
  
steps:
  - agent: ops
    action: fetch-sales-data
    inputs:
      date: "yesterday"
      
  - agent: ops
    action: format-summary
    inputs:
      data: "{{steps.0.data}}"
      
  - agent: ops
    action: send-telegram
    inputs:
      message: "{{steps.1.message}}"
      
  - agent: marketing
    action: update-dashboard
    inputs:
      metrics: "{{steps.0.data}}"
```

### 4. Order Fulfillment

```yaml
name: fulfill-order
trigger:
  type: webhook
  source: medusa
  event: order.placed
  
steps:
  - agent: fulfillment
    action: route-order
    inputs:
      order_id: "{{trigger.order_id}}"
      
  - agent: fulfillment
    action: create-supplier-order
    inputs:
      route: "{{steps.0.route}}"
      
  - agent: fulfillment
    action: save-tracking
    inputs:
      order_id: "{{trigger.order_id}}"
      tracking: "{{steps.1.tracking}}"
      
  - agent: support
    action: notify-customer
    inputs:
      order_id: "{{trigger.order_id}}"
      type: shipped
```

### 5. Low Stock Alert

```yaml
name: low-stock-alert
trigger:
  type: cron
  schedule: "0 * * * *"
  
steps:
  - agent: fulfillment
    action: check-stock-levels
    inputs:
      threshold: 10
      
  - condition:
      when: "{{steps.0.products}}"
      operator: not-empty
      
  - agent: ops
    action: send-alert
    inputs:
      level: warning
      message: "Low stock: {{steps.0.products}}"
```

### 6. Refund Triage

```yaml
name: refund-triage
trigger:
  type: webhook
  source: medusa
  event: refund.created
  
steps:
  - agent: support
    action: check-order-status
    inputs:
      order_id: "{{trigger.order_id}}"
      
  - condition:
      when: "{{steps.0.status}}"
      equals: not_shipped
      
  - agent: support
    action: auto-approve-refund
    inputs:
      refund_id: "{{trigger.refund_id}}"
      
  - else:
    - agent: support
      action: request-return
      inputs:
        order_id: "{{trigger.order_id}}"
```

## Event Map

| Event | Source | Action |
|-------|--------|--------|
| order.placed | Medusa | Fulfill order |
| order.canceled | Medusa | Cancel fulfillment |
| payment.succeeded | Stripe | Confirm order |
| payment.failed | Stripe | Notify customer |
| product.imported | CJ | Update inventory |
| shipment.created | CJ | Update tracking |
