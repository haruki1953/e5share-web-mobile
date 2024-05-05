<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(async () => {
  const { loadAllData } = await import('./utils/dataManage')
  loadAllData()
})
</script>

<template>
  <router-view></router-view>
</template>

<style lang="scss" scoped></style>
