<script lang="ts" setup>
const { log } = useLogger()

onMounted(() => {
  log('App mounted successfully and ready.')
})

// Watcher logging on route changes
const route = useRoute()
watch(
  () => route.path,
  (newPath) => {
    log(`Navigated to route: ${newPath}`, 'RouteWatcher')
  },
)
</script>

<template>
  <NuxtLayout>
    <NuxtRouteAnnouncer />
    <NuxtLoadingIndicator
      :height="3"
      color="repeating-linear-gradient(to right, #14b8a6 0%, #0d9488 50%, #2dd4bf 100%)"
    />
    <NuxtPage />
  </NuxtLayout>
</template>
