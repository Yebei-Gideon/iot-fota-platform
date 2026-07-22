import { FotaLogger } from '@fota/logger'

export default defineNuxtPlugin(() => {
  // Only bridge client-side logs back to the terminal during local development
  if (import.meta.dev) {
    // Save the original print function reference
    const originalPrint = (FotaLogger.prototype as any).print

    // Override print to intercept browser logs
    ;(FotaLogger.prototype as any).print = function (
      level: string,
      message: any,
      context?: string,
      stack?: string,
    ) {
      // Still print in the browser console first
      originalPrint.call(this, level, message, context, stack)

      // Safely dispatch to our terminal proxy endpoint
      const activeContext = context || (this as any).context

      // Use a background fetch so we don't block the browser UI thread
      $fetch('/api/dev-log', {
        method: 'POST',
        body: {
          level,
          message,
          context: activeContext,
          stack,
        },
      }).catch(() => {
        // Silently catch network failures if dev server is restarting
      })
    }
  }
})
