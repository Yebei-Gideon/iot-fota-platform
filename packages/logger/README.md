# `@fota/logger`

A high-performance, zero-dependency, isomorphic TypeScript logger heavily inspired by the beautiful console styling of NestJS. Built specifically to be shared across NestJS backends, Nuxt frontends, and other packages within the FOTA monorepo.

---

## Features

- **NestJS-Inspired Formatting:** Includes Process IDs (PID), clean ISO timestamps, and contextual tag styling.
- **Smart Timing Indicators:** Automatically calculates execution duration increments (`+ms`) between log operations.
- **Isomorphic & Safe:** Works out-of-the-box in Node/Bun environments and modern browsers (safely falls back when Node APIs like `process` are unavailable).
- **Colorized CLI Outputs:** High-speed ANSI terminal styling without heavy dependencies like `chalk`.
- **Flexible Signatures:** Supports both static API execution and instance-level context pinning.
- **Nuxt Integration Ready:** Features deep support for Nuxt composables, auto-component context inference, and local dev-terminal log mirroring.

---

## Installation & Setup

Since this is a workspace package in your Bun monorepo, add it to your apps or other packages via your `package.json`:

```json
{
  "dependencies": {
    "@fota/logger": "workspace:*"
  }
}
```

Then run `bun install` at the monorepo root to link the dependency:

```bash
bun install
```

---

## Basic Usage

### 1. Instance Logger (Recommended)

Instantiate with a context string to tag all subsequent logs.

```typescript
import { FotaLogger } from '@fota/logger'

const logger = new FotaLogger('AuthService')

logger.log('User logged in successfully')
logger.info('Sending verification email...')
logger.warn('Rate limit threshold reached (80%)')
logger.error('Failed to parse JWT token', 'Error: Invalid signature\n  at auth.service.ts:12')
```

### 2. Static Methods

For quick, inline logs without creating an instance:

```typescript
import { FotaLogger } from '@fota/logger'

FotaLogger.debug('Database connection established', 'Database')
```

---

## Integration Guides

### NestJS Integration

Use the `@fota/logger` to power your NestJS application logger.

```typescript
import { FotaLogger } from '@fota/logger'
import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'

async function bootstrap() {
  // Use FotaLogger to print Nest's system bootstrap logs
  const app = await NestFactory.create(AppModule, {
    logger: {
      log: (msg, ctx) => FotaLogger.log(msg, ctx),
      error: (msg, stack, ctx) => FotaLogger.error(msg, stack, ctx),
      warn: (msg, ctx) => FotaLogger.warn(msg, ctx),
      debug: (msg, ctx) => FotaLogger.debug(msg, ctx),
      verbose: (msg, ctx) => FotaLogger.verbose(msg, ctx),
    }
  })

  await app.listen(3030)
}
bootstrap()
```

---

### Nuxt Integration

Create the following files in your Nuxt frontend workspace to allow logging inside components and syncing them directly to your dev terminal.

#### 1. Create the Composable (`composables/useLogger.ts`)

```typescript
import { FotaLogger } from '@fota/logger'
import { getCurrentInstance } from 'vue'

export type LoggerOptions = string | { context: string }

export function useLogger(options?: LoggerOptions) {
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

  const logToTerminal = (level: string, message: any, stack?: string, overrideCtx?: string) => {
    if (import.meta.dev && import.meta.client) {
      $fetch('/api/dev-log', {
        method: 'POST',
        body: {
          level,
          message,
          context: overrideCtx || context,
          stack,
        }
      }).catch(() => {})
    }
  }

  return {
    logger,
    log: (message: any, ctx?: string) => {
      logger.log(message, ctx)
      logToTerminal('log', message, undefined, ctx)
    },
    info: (message: any, ctx?: string) => {
      logger.info(message, ctx)
      logToTerminal('info', message, undefined, ctx)
    },
    warn: (message: any, ctx?: string) => {
      logger.warn(message, ctx)
      logToTerminal('warn', message, undefined, ctx)
    },
    error: (message: any, stack?: string, ctx?: string) => {
      logger.error(message, stack, ctx)
      logToTerminal('error', message, stack, ctx)
    },
    debug: (message: any, ctx?: string) => {
      logger.debug(message, ctx)
      logToTerminal('debug', message, undefined, ctx)
    },
    verbose: (message: any, ctx?: string) => {
      logger.verbose(message, ctx)
      logToTerminal('verbose', message, undefined, ctx)
    },
  }
}
```

#### 2. Create the Terminal Tunnel endpoint (`server/api/dev-log.post.ts`)

```typescript
import { FotaLogger } from '@fota/logger'

export default defineEventHandler(async (event) => {
  if (process.env.NODE_ENV !== 'development') {
    return { success: false }
  }

  const { level, message, context, stack } = await readBody(event)
  const serverLogger = new FotaLogger(context)

  if (level === 'error') {
    serverLogger.error(message, stack)
  }
  else if (level === 'warn') {
    serverLogger.warn(message)
  }
  else if (level === 'info') {
    serverLogger.info(message)
  }
  else if (level === 'debug') {
    serverLogger.debug(message)
  }
  else if (level === 'verbose') {
    serverLogger.verbose(message)
  }
  else {
    serverLogger.log(message)
  }

  return { success: true }
})
```

#### 3. Logging in your Vue Components

```vue
<script setup lang="ts">
// Automatically resolves context to component name: "Dashboard"
const { info, warn } = useLogger()

onMounted(() => {
  info('Dashboard client loaded successfully!') // Prints to browser AND server terminal
})

function triggerAction() {
  warn('User initiated a dangerous action', 'UserAction')
}
</script>
```

---

## Log Output Preview

```text
[FOTA] 84210  - 07/14/2026, 11:25:32 AM   LOG     [NestApplication] Nest application successfully started +3ms
[FOTA] 84210  - 07/14/2026, 11:25:32 AM   INFO    [Dashboard] Dashboard client loaded successfully! +120ms
[FOTA] 84210  - 07/14/2026, 11:25:35 AM   WARN    [UserAction] User initiated a dangerous action +3001ms
```
