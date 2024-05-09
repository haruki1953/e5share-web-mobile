<script setup lang="ts">
import { useUsersStore } from '@/stores'
import { computed } from 'vue'

// 用户列表
const usersStore = useUsersStore()

// 要显示的数据
const dataList = computed(() => {
  return usersStore.sharingUsers
})
</script>

<template>
  <div class="card-container">
    <UserCard v-for="item in dataList" :key="item.id" :user="item"></UserCard>
    <van-empty v-if="!dataList.length" description="暂无分享" />
  </div>
</template>

<style lang="scss" scoped>
.card-container {
  margin-bottom: 50px;
}
</style>
