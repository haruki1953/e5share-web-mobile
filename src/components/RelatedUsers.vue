<script setup lang="ts">
import { ref } from 'vue'

withDefaults(
  defineProps<{
    userIds: number[]
    title: string
    color?: string
  }>(),
  {
    color: '#1989fa'
  }
)

const activeCollapseName = ref('')
</script>
<template>
  <van-collapse v-model="activeCollapseName" accordion>
    <van-collapse-item name="1" class="help-users">
      <template #title>
        <div class="helpnum-text" :style="{ color: color }">
          {{ title }}
        </div>
      </template>
      <UserItem v-for="item in userIds" :key="item" :userId="item"></UserItem>
    </van-collapse-item>
  </van-collapse>
</template>

<style lang="scss" scoped>
.van-collapse-item {
  .helpnum-text {
    font-size: 14px;
    font-weight: bold;
  }
  :deep() {
    .van-cell {
      border-radius: 20px;
      .van-cell__title {
        // @extend .my-text-h1;
        margin-left: 10px;
        font-size: 16px;
        font-weight: bold;
      }
    }
    .van-collapse-item__content {
      border-radius: 20px;
      padding: 1px 20px;
    }
  }
  .user-item {
    margin: 10px 0;
  }
}
</style>
