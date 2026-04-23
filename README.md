# Secure Firmware Over-The-Air (FOTA) Update Management Platform for IoT Devices

## Project Goal
- Provide a secure, auditable, and scalable platform to manage firmware distribution, staged rollouts, and device lifecycle for constrained IoT devices (ESP-based firmware libs included).

```
iot-fota-platform/
├── apps/                        # Deployable applications (services, UI)
│   ├── api-gateway/              # External API (OpenAPI, auth, rate limits)
│   ├── device-service/           # Device registry & device auth (mTLS)
│   ├── firmware-service/         # Firmware storage, versions, metadata
│   ├── ota-orchestrator/         # Rollouts, scheduling, retries
│   ├── telemetry-service/        # Logs, metrics, device reports
│   ├── web/                      # Nuxt 4 web UI
│
├── packages/                    # Shared libraries (pure logic)
│   ├── shared-types/             # TypeScript types (devices, firmware, OTA)
│   ├── shared-crypto/            # Hashing, signing, verification helpers
│   ├── hono-rpc-contracts/       # RPC contracts between services
│   ├── openapi-specs/            # OpenAPI YAML/JSON definitions
│   ├── config/                   # Shared config (env schemas, constants)
│   └── logger/                   # Pino logger wrapper
│
├── docker/                        # Infrastructure & ops
│   ├── apps/                   # Dockerfiles per service
│   ├── compose/                  # docker-compose stacks
│   ├── pg/                       # PostgreSQL init & migrations
│   ├── redis/                    # Redis docker container.
│   ├── mqtt/                     # Mosquitto (TLS) docker container.
│   ├── supabase/                 # supabase docker container.
│   └── rabbitmq/                 # Rabbit MQ docker container.
│
├── tools/                       # Dev & automation tools
│   ├── prisma/                   # Prisma schema & generators
│   ├── drizzle/                  # drizzle schema & generators
│   ├── scripts/                  # Signing, keygen, seeding, etc.
│
├── firmware/                    # Embedded side (not JS)
│   ├── mcu-client/               # C/C++ OTA client library
│   ├── esp32-demo/               # ESP32 reference implementation
│   └── linux-agent/              # Linux OTA agent
│
├── docs/                        # Documentation
│   ├── architecture/             # Diagrams, flows
│   ├── security/                 # Threat model, PKI, signing
│   ├── api/                      # API docs
│   └── evaluation/               # Metrics & experiments
│
├── bun.lockb
├── package.json
├── docker-compose.yml
└── README.md
```

## Deployments Link

- [apps/web live at fotaweb-beta.up.railway.app](#)
- [app/api-gateway live at fota-api-gateway-beta.up.railway.app](#)
