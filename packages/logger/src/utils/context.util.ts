import type { LogContext } from '../interfaces/logger.interface.js'

export function resolveContext(context?: LogContext, fallback = 'Application'): string {
  if (!context)
    return fallback
  if (typeof context === 'string')
    return context
  if (typeof context === 'function')
    return context.name || fallback
  if (typeof context === 'object') {
    return context.constructor?.name || fallback
  }
  return fallback
}
