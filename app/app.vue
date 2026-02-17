<script setup lang="ts">
const { loadCombos } = useCombos()
onMounted(() => {
  loadCombos()
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>