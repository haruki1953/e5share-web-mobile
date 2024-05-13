<script setup lang="ts">
import { loadAllData } from '@/utils/dataManage'
import { onMounted } from 'vue'

onMounted(async () => {
  // 请求数据
  await loadAllData()
})
</script>

<template>
  <router-view></router-view>
</template>

<style lang="scss" scoped></style>
