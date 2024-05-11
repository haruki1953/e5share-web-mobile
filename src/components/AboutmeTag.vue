<script setup lang="ts">
import { useProfileStore } from '@/stores'
import type { User } from '@/types/user'
import { computed } from 'vue'

const props = defineProps<{
  user: User
}>()

// 关于自己的信息
const profileStore = useProfileStore()
// 辅助函数，用于检查数组是否存在并包含指定的值
const isInArray = (array: number[] | undefined, value: number) => {
  return Array.isArray(array) && array.includes(value)
}
// 是否正在被当前用户帮助
const isHelpingByThisUser = computed(() => {
  return isInArray(profileStore.user?.helping_by_users, props.user.id)
})
// 是否正在帮助当前用户
const isHelpingThisUser = computed(() => {
  return isInArray(profileStore.user?.helping_users, props.user.id)
})
// 当前用户是否为自己
const isMyself = computed(() => {
  return profileStore.user?.id === props.user.id
})

// 导出信息
defineExpose({
  isHelpingByThisUser,
  isHelpingThisUser,
  isMyself
})
</script>

<template>
  <div class="tag-box">
    <van-tag type="success" plain v-if="isHelpingByThisUser"
      >您正在被TA帮助</van-tag
    >
    <van-tag type="primary" plain v-if="isHelpingThisUser"
      >您正在帮助TA</van-tag
    >
    <van-tag type="default" plain v-if="isMyself">您的信息</van-tag>
  </div>
</template>

<style lang="scss" scoped>
.tag-box {
  display: flex;
  flex-direction: column;
}
.van-tag {
  margin: 2px 0;
}
</style>
