# `@fota/logger`

A high-performance, zero-dependency, isomorphic TypeScript logger heavily inspired by the console styling of NestJS.
Built specifically to be shared across NestJS backends, Nuxt 4 frontends, React applications, and other packages within
the FOTA monorepo.

---

## Key Features

- **Multi-Dimensional Syntax Highlighting:** Automatically color-codes URLs, API routes (`/api/v1`), HTTP methods
  (`GET`, `POST`), string literals, numbers, and object structures.
- **Unique Level Color Schemes:** Every log level (`LOG`, `INFO`, `WARN`, `ERROR`, `DEBUG`, `VERBOSE`) features its
  own distinct ANSI badge, prefix, and message theme.
- **100% Isomorphic & Safe:** Works out-of-the-box in Node.js, Bun, NestJS, React (Vite/Next.js), Nuxt 4, and browsers
  without crashing on missing `process.env` or `process.pid`.
- **Smart Environment Auto-Cascade:** Auto-detects configuration across `process.env` and bundler environments
  (`NUXT_PUBLIC_`, `VITE_`, `NEXT_PUBLIC_`, `REACT_APP_`).
- **Equivalence & Level Filtering:** Aliases `log` and `info` so framework startup messages (e.g. NestJS) are never
  accidentally swallowed when filtering log levels.
- **NestJS & Nuxt 4 Integrations:** Native support for NestJS logger contracts and Nuxt composables with dev-terminal
  log mirroring.

---

## 📦 Installation & Setup

Since this is a workspace package in your Bun monorepo, add it to your dependencies:

```json
{
  "dependencies": {
    "@fota/logger": "workspace:*"
  }
}
```

Run `bun install` at the monorepo root:

```bash
bun install

```

---

## Color & Theme Matrix

| Log Level     | Level Badge             | Prefix Color | Message Highlight Rules     |
| ------------- | ----------------------- | ------------ | --------------------------- |
| **`LOG`**     | **Bold Bright Green**   | Green        | Default Green text          |
| **`INFO`**    | **Bold Bright Blue**    | Blue         | Default White text          |
| **`WARN`**    | **Bold Bright Yellow**  | Yellow       | Default Bright Yellow text  |
| **`ERROR`**   | **Bold Bright Red**     | Red          | Default Bright Red text     |
| **`DEBUG`**   | **Bold Bright Magenta** | Magenta      | Default Bright Magenta text |
| **`VERBOSE`** | **Bold Bright Cyan**    | Cyan         | Default Bright Cyan text    |

### Automatic Syntax Highlighting Rules inside Messages

- **API Endpoints (`/api/v1/users`, `/health`)**: Bold Bright Magenta
- **URLs (`http://localhost:3030`)**: Underlined Bright Cyan
- **HTTP Methods (`GET`, `POST`, `PUT`, `DELETE`)**: Bold Bright Yellow
- **Quoted String Literals (`'user_id'`, `"token"`)**: Bright Green
- **Numbers (`3030`, `200`, `100515`)**: Yellow
- **Objects & Arrays**: Key (`Bright Cyan`), String value (`Green`), Number (`Yellow`), Boolean (`Bright Magenta`),
  Structure (`Gray`)

---

## Environment Configuration

Set logger parameters using standard environment variables. `@fota/logger` automatically detects the right prefix for
your frontend or backend framework:

```env
# Disable all log output entirely (Default: false)
LOG_DISABLED=false

# Enable logging switch (Default: true)
LOG_ENABLE=true

# Custom prefix displayed at the start of each log line (Default: App)
LOG_PREFIX="FOTA API"

# Active log levels (Comma-separated)
# Options: log, info, error, warn, debug, verbose
LOG_LEVELS=log,info,error,warn,debug,verbose

```

### Isomorphic Framework Variable Support

| Runtime / Framework        | Environment Variable Prefix Example |
| -------------------------- | ----------------------------------- |
| **Node.js / NestJS / Bun** | `LOG_PREFIX="FOTA API"`             |
| **Nuxt 4 / Vue**           | `NUXT_PUBLIC_LOG_PREFIX="FOTA WEB"` |
| **Vite (React / Vue)**     | `VITE_LOG_PREFIX="FOTA WEB"`        |
| **Next.js (React)**        | `NEXT_PUBLIC_LOG_PREFIX="FOTA WEB"` |
| **Create React App**       | `REACT_APP_LOG_PREFIX="FOTA WEB"`   |

---

## Usage Scenarios

### 1. Basic Instance & Static Usage

```typescript
import { FotaLogger } from '@fota/logger'

// 1. Instance Logger (Tagged Context)
const logger = new FotaLogger('UserService')

logger.info('User 1024 logged in from /api/v1/auth')
logger.warn('Rate limit warning for http://localhost:3030/api/v1/devices')
logger.error('Database query failed', 'Error: Connection timeout\n  at db.ts:22')

// Object / Array Payload Formatting
logger.debug({ userId: 1024, roles: ['admin', 'user'], active: true }, 'AuthContext')

// 2. Global Configuration
FotaLogger.setGlobalOptions({
  prefix: 'GLOBAL',
  timestampFormat: 'iso',
})

// 3. Static Execution
FotaLogger.info('Server boot complete', 'Bootstrap')
```

---

### 2. NestJS Integration (`main.ts`)

Pass `FotaLogger` directly to `NestFactory.create` and register it globally via `app.useLogger()` so all framework
internal logs route through your custom formatting:

```typescript
import { FotaLogger } from '@fota/logger'
import { SERVICES } from '@fota-api/common'
import { GatewayModule } from '@fota-api/gateway/gateway.module'
import { NestFactory } from '@nestjs/core'
import type { NestExpressApplication } from '@nestjs/platform-express'

const logger = new FotaLogger(SERVICES.GATEWAY.name)

async function bootstrap(): Promise<number> {
  const app = await NestFactory.create<NestExpressApplication>(
    GatewayModule,
    { logger }, // Handles Nest startup logs
  )

  // Route post-bootstrap logs (Controllers, Resolvers, Routes) through FotaLogger
  app.useLogger(logger)

  const port = 3030
  await app.listen(port)
  return port
}

bootstrap()
  .then((port) => {
    logger.log(`Server is running at: http://localhost:${port}/api/v1`)
  })
  .catch((error: unknown) => {
    logger.error('Server startup failed', String(error))
    process.exit(1)
  })
```

---

### 3. Nuxt 4 Integration

#### Step 1: Composable (`composables/useLogger.ts`)

```typescript
import { FotaLogger } from '@fota/logger'
import { getCurrentInstance } from 'vue'

export function useLogger(options?: string | { context: string }) {
  let context = 'NuxtApp'

  if (typeof options === 'string') {
    context = options
  }
  else if (options?.context) {
    context = options.context
  }
  else {
    const instance = getCurrentInstance()
    const componentName = instance?.type.__name || instance?.type.name
    if (componentName) {
      context = componentName
    }
  }

  const logger = new FotaLogger(context)

  const logToTerminal = (level: string, message: unknown, stack?: string, overrideCtx?: string) => {
    if (import.meta.dev && import.meta.client) {
      $fetch('/api/dev-log', {
        method: 'POST',
        body: { level, message, context: overrideCtx || context, stack },
      }).catch(() => {})
    }
  }

  return {
    logger,
    log: (msg: unknown, ctx?: string) => {
      logger.log(msg, ctx)
      logToTerminal('log', msg, undefined, ctx)
    },
    info: (msg: unknown, ctx?: string) => {
      logger.info(msg, ctx)
      logToTerminal('info', msg, undefined, ctx)
    },
    warn: (msg: unknown, ctx?: string) => {
      logger.warn(msg, ctx)
      logToTerminal('warn', msg, undefined, ctx)
    },
    error: (msg: unknown, stack?: string, ctx?: string) => {
      logger.error(msg, stack, ctx)
      logToTerminal('error', msg, stack, ctx)
    },
  }
}
```

#### Step 2: Dev-Terminal Tunnel Endpoint (`server/api/dev-log.post.ts`)

```typescript
import { FotaLogger } from '@fota/logger'

export default defineEventHandler(async (event) => {
  if (process.env.NODE_ENV !== 'development')
    return { success: false }

  const { level, message, context, stack } = await readBody(event)
  const serverLogger = new FotaLogger(context)

  if (level === 'error')
    serverLogger.error(message, stack)
  else if (level === 'warn')
    serverLogger.warn(message)
  else if (level === 'info')
    serverLogger.info(message)
  else serverLogger.log(message)

  return { success: true }
})
```

#### Step 3: Vue Component Usage (`components/Dashboard.vue`)

```vue
<script setup lang="ts">
// Automatically infers context as "Dashboard"
const { info, warn } = useLogger()

onMounted(() => {
  info('Dashboard loaded from route /dashboard')
})

function handleReset() {
  warn('User clicked dangerous action', 'UserAction')
}
</script>
```

---

## API Reference

### `FotaLogger Options`

```typescript
export interface LoggerOptions {
  context?: LogContext
  timestampFormat?: 'iso' | 'locale' | 'time' // Default: 'locale'
  disabled?: boolean // Default: false
  prefix?: string // Default: 'App' or env prefix
  logLevels?: LogLevel[] // Default: ['log', 'info', 'error', 'warn', 'debug', 'verbose']
}
```

### Methods

- `FotaLogger.log(message, context?, ...params)`
- `FotaLogger.info(message, context?, ...params)`
- `FotaLogger.warn(message, context?, ...params)`
- `FotaLogger.error(message, stack?, context?, ...params)`
- `FotaLogger.debug(message, context?, ...params)`
- `FotaLogger.verbose(message, context?, ...params)`
- `FotaLogger.setGlobalOptions(options)`
- `FotaLogger.setGlobalContext(context)`
