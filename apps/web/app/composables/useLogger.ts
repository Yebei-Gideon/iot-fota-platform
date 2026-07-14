import { FotaLogger } from '@fota/logger'
import { getCurrentInstance } from 'vue'

export type LoggerOptions = string | { context: string }

export function useLogger(options?: LoggerOptions) {
  let context = 'NuxtApp'

  // Resolve context (string, options object, or fallback to auto-detection)
  if (typeof options === 'string') {
    context = options
  }
  else if (options?.context) {
    context = options.context
  }
  else {
    // Auto-detect Vue component filename (e.g., "login.vue" -> "login")
    const instance = getCurrentInstance()
    const componentName = instance?.type.__name || instance?.type.name
    if (componentName) {
      context = componentName
    }
  }

  const logger = new FotaLogger(context)

  const logToTerminal = (level: string, message: any, stack?: string, overrideCtx?: string) => {
    // Send logs during development in client browser
    if (import.meta.dev && import.meta.client) {
      $fetch('/api/dev-log', {
        method: 'POST',
        body: {
          level,
          message,
          context: overrideCtx || context,
          stack,
        },
      }).catch(() => {
        // Silently catch network failures if dev server restarts
      })
    }
  }

  // Return both the raw instance and destructured helper methods with terminal synchronization
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
