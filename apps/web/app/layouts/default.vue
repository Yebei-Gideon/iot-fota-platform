<script lang="ts" setup>
</script>

<template>
  <UApp>
    <UHeader>
      <template #title>
        <div>FOTA</div>
      </template>
    </UHeader>
    <UMain class="min-h-screen">
      <UContainer>
        <slot />
      </UContainer>
    </UMain>
    <UFooter>
      <template #bottom>
        <div>FOTA</div>
      </template>
    </UFooter>
  </UApp>
</template>
