<script lang="ts" setup>
import type { NuxtError } from 'nuxt/app'

const props = defineProps<{
  error: NuxtError
}>()

const { error: logError } = useLogger('ErrorBoundary')
const isDev = import.meta.dev
onMounted(() => {
  // Safely fallback statusCode to 500 if undefined
  const statusCode = props.error?.status ?? 500
  const statusMessage = props.error?.statusText || props.error?.message || 'Unhandled Error'

  logError(
    `HTTP ${statusCode} - ${statusMessage} on route: ${useRoute().path}`,
    props.error?.stack || statusMessage,
    `Error:${statusCode}`,
  )
})

function handleClearError() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <UApp>
    <div class="bg-background flex min-h-screen items-center justify-center p-4">
      <UCard class="w-full max-w-lg space-y-6 p-6 text-center">
        <template #header>
          <div class="space-y-2">
            <!-- Use nullish coalescing (??) for comparison -->
            <UBadge
              :color="(props.error?.status ?? 500) >= 500 ? 'error' : 'warning'"
              size="lg"
              variant="subtle"
            >
              {{ props.error?.status ?? 500 }}
            </UBadge>

            <h1 class="text-2xl font-bold tracking-tight">
              {{ props.error?.status === 404 ? 'Page Not Found' : 'An Error Occurred' }}
            </h1>
          </div>
        </template>

        <p class="text-sm text-muted">
          {{
            props.error?.message || props.error?.statusText || 'An unexpected error occurred while processing your request.'
          }}
        </p>

        <!-- Dev Mode: Stack Trace Preview -->
        <div
          v-if="isDev && props.error?.stack"
          class="max-h-40 overflow-x-auto rounded border border-muted bg-muted/20 p-3 text-left font-mono text-xs"
        >
          <pre class="whitespace-pre-wrap">{{ props.error.stack }}</pre>
        </div>

        <template #footer>
          <div class="flex justify-center gap-3">
            <UButton
              color="neutral"
              label="Go Back"
              variant="outline"
              @click="$router.back()"
            />
            <UButton
              color="primary"
              label="Back to Home"
              @click="handleClearError"
            />
          </div>
        </template>
      </UCard>
    </div>
  </UApp>
</template>
