import type { LogContext } from '@fota/logger'
import { FotaLogger } from '@fota/logger'
import { getCurrentInstance } from 'vue'

export type LoggerOptions = LogContext | { context: LogContext }

export function useLogger(options?: LoggerOptions) {
  let defaultContext: LogContext = 'NuxtApp'

  // Resolve context (string, class/object context, or Vue component auto-detection)
  if (typeof options === 'string' || typeof options === 'function') {
    defaultContext = options
  }
  else if (options && typeof options === 'object' && 'context' in options && options.context) {
    defaultContext = options.context
  }
  else {
    // Auto-detect Vue component name (e.g., "Login.vue" -> "Login")
    const instance = getCurrentInstance()
    const componentName = instance?.type.__name || instance?.type.name
    if (componentName) {
      defaultContext = componentName.toUpperCase()
    }
  }

  const logger = new FotaLogger(defaultContext)

  return {
    logger,

    log: (message: unknown, context?: LogContext, ...optionalParams: unknown[]) => {
      logger.log(message, context, ...optionalParams)
    },

    info: (message: unknown, context?: LogContext, ...optionalParams: unknown[]) => {
      logger.info(message, context, ...optionalParams)
    },

    warn: (message: unknown, context?: LogContext, ...optionalParams: unknown[]) => {
      logger.warn(message, context, ...optionalParams)
    },

    error: (message: unknown, context?: LogContext, ...optionalParams: unknown[]) => {
      logger.error(message, context, ...optionalParams)
    },

    debug: (message: unknown, context?: LogContext, ...optionalParams: unknown[]) => {
      logger.debug(message, context, ...optionalParams)
    },

    verbose: (message: unknown, context?: LogContext, ...optionalParams: unknown[]) => {
      logger.verbose(message, context, ...optionalParams)
    },
  }
}
