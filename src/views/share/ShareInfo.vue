<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUsersStore, useProfileStore, useShareStore } from '@/stores'
import { accountStatus } from '@/config'
import ShareRegisterSheet from './components/ShareRegisterSheet.vue'
import ShareCancelSheet from './components/ShareCancelSheet.vue'
import ShareInfoUpdateSheet from './components/ShareInfoUpdateSheet.vue'
import StatusTag from './components/StatusTag.vue'

const usersStore = useUsersStore()
const profileStore = useProfileStore()
const shareStore = useShareStore()

// 要显示的数据，帮助自己的用户列表
const helpingByUsers = computed(() => {
  if (!profileStore.user) return null
  return usersStore.filterUsersByIds(profileStore.user.helping_by_users)
})

// 用户信息
const user = computed(() => {
  return profileStore.user
})

// 分享信息表格
const shareInfo = computed(() => {
  return shareStore.shareInfoList
})

// 分享登记抽屉 分享注销抽屉
const shareRegisterSheetRef = ref<InstanceType<typeof ShareRegisterSheet>>()
const shareCancelSheetRef = ref<InstanceType<typeof ShareCancelSheet>>()
// 分享信息操作
const shareInfoUpdateSheetRef = ref<InstanceType<typeof ShareInfoUpdateSheet>>()
</script>
<template>
  <div class="card-container">
    <div
      v-if="user?.account_status === accountStatus.sharing"
      class="share-status"
    >
      <ShareCancelSheet ref="shareCancelSheetRef"></ShareCancelSheet>
      <div class="my-text-h2" style="color: #1989fa">您正在分享</div>
      <div>
        <van-button
          type="default"
          round
          size="small"
          @click="$router.push('/setting?setting=e5')"
        >
          修改E5订阅信息
        </van-button>
        <van-button
          type="primary"
          round
          size="small"
          @click="shareCancelSheetRef?.open()"
        >
          注销分享
        </van-button>
      </div>
    </div>
    <div v-else class="share-status">
      <ShareRegisterSheet ref="shareRegisterSheetRef"></ShareRegisterSheet>
      <div class="my-text-h2">您还未开始分享</div>
      <van-button
        type="primary"
        round
        size="small"
        @click="shareRegisterSheetRef?.open()"
      >
        登记分享
      </van-button>
    </div>

    <div
      class="share-info"
      v-if="user && user?.account_status === accountStatus.sharing"
    >
      <ShareInfoUpdateSheet
        ref="shareInfoUpdateSheetRef"
      ></ShareInfoUpdateSheet>
      <UserCard :user="user" isShareInfo class="main-user"></UserCard>
      <div class="share-info-item" v-for="item in shareInfo" :key="item.id">
        <div class="info-item-row">
          <UserItem :userId="item.userId" class="user-item"></UserItem>
          <van-button
            type="primary"
            size="small"
            round
            @click="shareInfoUpdateSheetRef?.open(item.userId)"
          >
            操作
          </van-button>
        </div>
        <div class="info-item-row">
          <van-text-ellipsis
            :content="item.note || '无备注'"
            class="text-info my-text-p3"
          />
          <StatusTag :status="item.status"></StatusTag>
        </div>
      </div>
    </div>

    <div>
      <UserCard
        v-for="item in helpingByUsers"
        :key="item.id"
        :user="item"
        isShareInfo
      ></UserCard>
    </div>
    <van-empty
      v-if="
        profileStore.user?.account_status !== accountStatus.sharing &&
        !helpingByUsers?.length
      "
      description="您还未被分享"
    />
  </div>
</template>

<style lang="scss" scoped>
.card-container {
  margin-bottom: 50px;
}
.share-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  border-bottom: 1px solid #dcdfe6; /* 下边框*/
  .van-button {
    margin-left: 10px;
  }
}
.share-info {
  padding-bottom: 10px;
  border-bottom: 1px solid #dcdfe6; /* 下边框*/
  .main-user {
    border-bottom-width: 0px;
    padding-bottom: 20px;
  }
  .share-info-item {
    padding: 0 30px 15px 30px;
    .info-item-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .user-item {
        width: 250px;
      }
      .van-button {
        padding-left: 10px;
        padding-right: 10px;
      }
      .text-info {
        min-width: 240px;
        margin-top: 2px;
        display: flex;
        align-items: center;
        white-space: pre-line;
      }
    }
  }
}
</style>
