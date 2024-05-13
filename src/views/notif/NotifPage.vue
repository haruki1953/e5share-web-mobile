<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount } from 'vue'
import { useProfileStore } from '@/stores'
import NotifCard from './components/NotifCard.vue'

// 用户信息
const profileStore = useProfileStore()

onMounted(() => {
  // 首次登录时（readNotifUuid为空）设置全部已读
  if (!profileStore.readNotifUuid.length) {
    profileStore.markAllNotifAsRead()
  }
})
onBeforeUnmount(() => {
  // 在通知页关闭时全部已读
  profileStore.markAllNotifAsRead()
})

// 重点通知
const importantNotif = computed(() => {
  return profileStore.importantNotif
})

// 通知数据，倒序排序，剔除重点通知
const notifData = computed(() => {
  const notifs = profileStore.notifications.slice().reverse()
  if (importantNotif.value) {
    const index = notifs.findIndex(
      (notif) => notif.id === importantNotif.value?.id
    )
    if (index !== -1) {
      notifs.splice(index, 1)
    }
  }
  return notifs
})
</script>
<template>
  <van-empty
    description="暂无通知"
    v-if="!notifData.length && !importantNotif"
  />
  <div class="card-container" v-else>
    <NotifCard v-if="importantNotif" :notif="importantNotif"></NotifCard>
    <van-divider v-if="importantNotif"
      ><van-icon name="like" color="#ee0a24"
    /></van-divider>
    <NotifCard
      v-for="item in notifData"
      :key="item.id"
      :notif="item"
    ></NotifCard>
  </div>
</template>

<style lang="scss" scoped>
.card-container {
  margin-bottom: 50px;
  .van-divider {
    margin: 0;
    padding: 16px;
    border-bottom: 1px solid #dcdfe6; /* 下边框*/
  }
}
</style>
