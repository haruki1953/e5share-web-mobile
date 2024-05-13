<script setup lang="ts">
import { computed, ref } from 'vue'
import { notificationType } from '@/config'
import { useProfileStore, useShareStore, useUsersStore } from '@/stores'
import { formatTime } from '@/utils/timeUtils'
import type { Notif } from '@/types/notif'
import AddShareSheet from '@/views/user/components/AddShareSheet.vue'
import ShareConfirmSheet from './ShareConfirmSheet.vue'

const props = defineProps<{
  notif: Notif
}>()

// const emit = defineEmits<{
//   (e: 'shareAdd', userId: number): void
//   (e: 'shareConfirm', userId: number): void
// }>()

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

// 根据通知类型返回相应的图标组件
const notifIcon = computed(() => {
  switch (props.notif.type) {
    case notificationType.system:
      return 'setting-o' // 设置图标
    case notificationType.e5_share_application:
      return 'comment-o' // 聊天图标
    case notificationType.e5_share_confirmation:
    case notificationType.e5_share_completion:
      return 'passed' // 圆圈勾选图标
    case notificationType.e5_share_sharer_stop:
    case notificationType.e5_share_receiver_stop:
    case notificationType.e5_share_closure:
      return 'close' // 圆圈关闭图标
    default:
      return 'info-o' // 其他通知图标
  }
})

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

// 按钮显示情况
const notifButton = computed(() => {
  if (props.notif.type === notificationType.e5_share_application) return true
  if (props.notif.type === notificationType.e5_share_confirmation) return true
  return false
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

// 是否为重要通知
const isImportant = computed(() => {
  const importantNotif = profileStore.importantNotif
  if (importantNotif && importantNotif.id === props.notif.id) return true
  return false
})

// 徽标内容
const badgeInfo = computed(() => {
  const color = isImportant.value ? '#ee0a24' : '#1989fa'
  let content = '0' // 0为不显示
  if (isImportant.value) {
    content = 'important'
  } else if (!isRead.value) {
    content = 'new'
  }
  return { color, content }
})

// 分享添加面板
const addShareSheetRef = ref<InstanceType<typeof AddShareSheet>>()
// 分享确认面板
const shareConfirmSheetRef = ref<InstanceType<typeof ShareConfirmSheet>>()
</script>
<template>
  <div class="card">
    <div class="my-text-p3 notif-time">{{ notifTime }}</div>
    <van-badge
      :content="badgeInfo.content"
      :color="badgeInfo.color"
      :show-zero="false"
      class="notif-type"
    >
      <div class="my-text-h2">{{ notifType }}</div>
    </van-badge>

    <van-notice-bar
      color="#909090"
      background="#f0f0f0"
      :left-icon="notifIcon"
      wrapable
    >
      {{ notifContent }}
    </van-notice-bar>
    <div class="user-button" v-if="otherUser || notifButton">
      <UserItem
        v-if="otherUser"
        :userId="otherUser.id"
        :class="notifButton ? 'small-width' : 'big-width'"
      ></UserItem>
      <!-- 按钮 根据通知类型显示 -->
      <div>
        <div
          v-if="
            notif.type === notificationType.e5_share_application && otherUser
          "
        >
          <van-button v-if="isAdded" type="primary" size="small" round disabled>
            已添加
          </van-button>
          <van-button
            v-else
            type="primary"
            size="small"
            round
            @click="addShareSheetRef?.open()"
          >
            加入分享管理
          </van-button>
          <AddShareSheet
            v-if="!isAdded"
            :userId="otherUser.id"
            ref="addShareSheetRef"
          ></AddShareSheet>
        </div>
        <div
          v-else-if="
            notif.type === notificationType.e5_share_confirmation && otherUser
          "
        >
          <van-button
            v-if="isConfirmed"
            type="primary"
            size="small"
            round
            disabled
          >
            分享已完成
          </van-button>
          <van-button
            v-else
            type="primary"
            size="small"
            round
            @click="shareConfirmSheetRef?.open()"
          >
            确认
          </van-button>
          <ShareConfirmSheet
            v-if="!isConfirmed"
            :e5id="otherUser.id"
            ref="shareConfirmSheetRef"
          ></ShareConfirmSheet>
        </div>
      </div>
    </div>
    <div class="user-message" v-if="otherUser">
      <van-text-ellipsis
        class="my-text-p2"
        :content="`留言：${notif.content || '无'}`"
        rows="3"
        expand-text="展开"
        collapse-text="收起"
      ></van-text-ellipsis>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.card {
  padding: 15px 20px 30px 20px;
  // border-top: 1px solid #dcdfe6; /* 上边框*/
  border-bottom: 1px solid #dcdfe6; /* 下边框*/
  // margin: -1px 0;
}
.notif-time {
  display: flex;
  justify-content: flex-end;
}
.notif-type {
  margin-left: 10px;
}
.van-notice-bar {
  margin-top: 10px;
  border-radius: 20px;
}
.user-button {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: 5px;
  margin-top: 10px;
  .small-width {
    width: 220px;
  }
  .big-width {
    width: 330px;
  }
  .van-button {
    width: 90px;
  }
}
.user-message {
  margin: 10px 10px 0 10px;
}
</style>
