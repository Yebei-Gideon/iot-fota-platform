<script lang="ts" setup>
</script>

<template>
  <div>
    <h1 class="text-4xl font-bold text-amber-200">
      Welcome to the IoT FOTA Platform
    </h1>
    <p class="mt-4 text-lg text-gray-400">
      This platform provides a comprehensive solution for managing and updating firmware over-the-air (FOTA) for IoT
      devices. Explore the features and capabilities to streamline your device management process.
    </p>
    <div class="mt-6">
      <NuxtLink class="text-blue-500 hover:underline" to="#">
        Manage Devices
      </NuxtLink>
      <NuxtLink class="ml-4 text-blue-500 hover:underline" to="#">
        Manage Firmware
      </NuxtLink>
      <NuxtLink class="ml-4 text-blue-500 hover:underline" to="#">
        View Updates
      </NuxtLink>
    </div>
  </div>
</template>
