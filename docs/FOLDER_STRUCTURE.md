# DropshipPro - Folder Structure

```
dropship-pro/
├── docs/
│   ├── ARCHITECTURE.md          # System architecture
│   ├── PHASES.md               # Build phases
│   ├── SECURITY.md             # Security notes
│   └── LAUNCH.md               # Launch checklist
│
├── agents/                      # OpenClaw agent definitions
│   ├── ops-agent.md
│   ├── catalog-agent.md
│   ├── fulfillment-agent.md
│   ├── support-agent.md
│   ├── marketing-agent.md
│   └── pricing-agent.md
│
├── backend/                      # Medusa backend
│   ├── src/
│   │   ├── services/          # Custom services
│   │   │   ├── pricing.service.ts
│   │   │   ├── supplier.service.ts
│   │   │   ├── fulfillment.service.ts
│   │   │   └── notification.service.ts
│   │   ├── subscribers/       # Event subscribers
│   │   ├── api/              # Custom API routes
│   │   │   ├── routes/
│   │   │   │   ├── internal/
│   │   │   │   │   ├── supplier/
│   │   │   │   │   ├── pricing/
│   │   │   │   │   └── fulfillment/
│   │   │   │   └── webhooks/
│   │   │   └── index.ts
│   │   └── migrations/       # DB migrations
│   ├── Dockerfile
│   └── package.json
│
├── frontend/                    # Next.js frontend
│   ├── src/
│   │   ├── app/              # App router
│   │   │   ├── (store)/      # Customer store
│   │   │   ├── (admin)/      # Admin dashboard
│   │   │   └── api/          # API routes
│   │   ├── components/        # UI components
│   │   ├── lib/              # Utilities
│   │   └── hooks/            # React hooks
│   ├── public/
│   ├── Dockerfile
│   ├── next.config.js
│   └── tailwind.config.ts
│
├── config/
│   ├── env.template          # Environment template
│   ├── openclaw.json         # OpenClaw config
│   └── nginx.conf           # (reference)
│
├── scripts/
│   ├── supplier/            # CJ integration
│   ├── pricing/             # Price engine
│   ├── ai/                 # AI content
│   └── sync/                # Sync scripts
│
├── docker/
│   ├── docker-compose.yml
│   ├── nginx.conf
│   ├── Dockerfile.backend
│   ├── Dockerfile.frontend
│   └── ssl/                 # SSL certificates
│
└── memory/                   # OpenClaw memory (runtime)
    ├── ops/
    ├── catalog/
    ├── fulfillment/
    ├── support/
    ├── marketing/
    └── pricing/
```

## Key Directories

| Directory | Purpose |
|-----------|----------|
| `backend/src/services` | Custom Medusa services |
| `backend/src/api/routes/internal` | Internal API endpoints |
| `frontend/src/app/(admin)` | Admin dashboard |
| `scripts/supplier` | CJ API integration |
| `docker/` | Deployment configs |
