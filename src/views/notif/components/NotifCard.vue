<script setup lang="ts">
import { computed } from 'vue'
import { notificationType } from '@/config'
import { useProfileStore, useShareStore, useUsersStore } from '@/stores'
import { formatTime } from '@/utils/timeUtils'
import type { Notif } from '@/types/notif'

const props = defineProps<{
  notif: Notif
}>()

// 用户列表
const usersStore = useUsersStore()
// 获取相关用户
const otherUser = computed(() => {
  if (props.notif?.otherInfo?.otherUserId) {
    return usersStore.findUserForShow(props.notif.otherInfo.otherUserId)
  }
  return null
})

// 获取通知时间
const notifTime = computed(() => formatTime(props.notif.time))

// 通知类型
const notifType = computed(() => {
  switch (props.notif.type) {
    case notificationType.system:
      return '系统通知'
    case notificationType.e5_share_application:
      return 'e5分享申请通知'
    case notificationType.e5_share_confirmation:
      return 'e5分享确认通知'
    case notificationType.e5_share_completion:
      return 'e5分享完成通知'
    case notificationType.e5_share_closure:
      return 'e5分享注销通知'
    case notificationType.e5_share_sharer_stop:
      return 'e5账号主停止分享通知'
    case notificationType.e5_share_receiver_stop:
      return '用户停止接受分享通知'
    default:
      return '其他通知'
  }
})

// // 根据通知类型返回相应的图标组件
// const notifIcon = computed(() => {
//   switch (props.notif.type) {
//     case notificationType.system:
//       return Setting // 设置图标
//     case notificationType.e5_share_application:
//       return ChatDotRound // 聊天图标
//     case notificationType.e5_share_confirmation:
//     case notificationType.e5_share_completion:
//       return CircleCheck // 圆圈勾选图标
//     case notificationType.e5_share_sharer_stop:
//     case notificationType.e5_share_receiver_stop:
//     case notificationType.e5_share_closure:
//       return CircleClose // 圆圈关闭图标
//     default:
//       return More // 其他通知图标
//   }
// })

// 通知内容
const notifContent = computed(() => {
  switch (props.notif.type) {
    case notificationType.system:
      return props.notif.content
    case notificationType.e5_share_application:
      return `${otherUser.value?.nickname} 向您申请获取e5子账号的分享`
    case notificationType.e5_share_confirmation:
      return `您正在接受 ${otherUser.value?.nickname} 的分享吗，请确认`
    case notificationType.e5_share_completion:
      return `${otherUser.value?.nickname} 已确认接受您的分享`
    case notificationType.e5_share_closure:
      return `${otherUser.value?.nickname} 已取消其e5账号的分享`
    case notificationType.e5_share_sharer_stop:
      return `${otherUser.value?.nickname} 已取消对您的分享`
    case notificationType.e5_share_receiver_stop:
      return `${otherUser.value?.nickname} 已停止接受您的分享`
    default:
      return props.notif.content
  }
})

const shareStore = useShareStore()
// 是否已添加
const isAdded = computed(() => {
  if (!otherUser.value) return null
  return shareStore.findShareInfoByUserId(otherUser.value.id)
})

const profileStore = useProfileStore()
// 是否已确认
const isConfirmed = computed(() => {
  if (!profileStore.user) return null
  return otherUser.value?.helping_users.includes(profileStore.user.id as number)
})

// 是否已读
const isRead = computed(() => {
  return profileStore.isNotifRead(props.notif.id)
})
</script>
<template>
  <div class="card"></div>
</template>

<style lang="scss" scoped>
.card {
  padding: 20px;
  // border-top: 1px solid #dcdfe6; /* 上边框*/
  border-bottom: 1px solid #dcdfe6; /* 下边框*/
  // margin: -1px 0;
}
</style>
