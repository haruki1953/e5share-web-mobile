<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useProfileStore, useUsersStore, useShareStore } from '@/stores'
// import NotifCard from './NotifCard.vue'
// import ShareConfirmDialog from './ShareConfirmDialog.vue'

// 用户信息
const profileStore = useProfileStore()

onMounted(() => {
  // 首次登录时（readNotifUuid为空）设置全部已读
  if (!profileStore.readNotifUuid.length) {
    profileStore.markAllNotifAsRead()
  }
})

// 通知数据，倒序排序，剔除重点通知
const notifData = computed(() => {
  const notifs = profileStore.notifications.slice().reverse()
  // if (importantNotif.value) {
  //   const index = notifs.findIndex(
  //     (notif) => notif.id === importantNotif.value.id
  //   )
  //   if (index !== -1) {
  //     notifs.splice(index, 1)
  //   }
  // }
  return notifs
})

// const router = useRouter()
// // 添加分享：跳转至分享页面并带上add参数【修改：跳转至用户主页】
// const addShareInfo = (userId: number) => {
//   router.push(`/share?add=${userId}`)
// }

// const shareConfirmDialogRef = ref()
// // 确认接受分享，打开对话框
// const confirmShare = (userId: number) => {
//   shareConfirmDialogRef.value.open(userId)
// }
</script>
<template>
  <div class="card-container"></div>
</template>

<style lang="scss" scoped>
.card-container {
  margin-bottom: 50px;
}
</style>
