import { FotaLogger } from '@fota/logger'

export default defineNuxtPlugin((nuxtApp) => {
  const logger = new FotaLogger('GlobalNuxtErrorHandler')

  // Capture Vue component runtime errors using Nuxt's native hook
  nuxtApp.hook('vue:error', (error, instance, info) => {
    // Highly resilient component name extraction
    const internalComponent = instance?.$?.type as { __name?: string, name?: string } | undefined

    const componentName
      = instance?.$options?.__name
        || instance?.$options?.name
        || internalComponent?.__name
        || internalComponent?.name
        || 'UnknownComponent'

    const errorMessage = error instanceof Error ? error.message : String(error)
    const stack = error instanceof Error ? error.stack : undefined

    // Grab request URL in both client (window) and server (SSR event context)
    const currentUrl = import.meta.client
      ? window.location.href
      : useRequestURL().href

    logger.error(
      `Vue Runtime Error [${info}] in <${componentName}>: ${errorMessage}`,
      {
        stack,
        context: `Vue:${componentName}`,
        url: currentUrl,
      },
    )
  })

  // Capture global Nuxt application-level errors (SSR / Lifecycle hooks)
  nuxtApp.hook('app:error', (error) => {
    const errorMessage = error instanceof Error ? error.message : String(error)
    const stack = error instanceof Error ? error.stack : undefined

    const currentUrl = import.meta.client
      ? window.location.href
      : useRequestURL().href

    logger.error(`Nuxt Application Error: ${errorMessage}`, {
      stack,
      context: 'NuxtAppError',
      url: currentUrl,
    })
  })
})
