<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore, useProfileStore, usePostsStore } from '@/stores'
import { avatarConfig, logoImage } from '@/config'
import { isLoading } from '@/router'
import UserPopup from './components/UserPopup.vue'

// 路由
const router = useRouter()
// 鉴权信息
const authStore = useAuthStore()
// 用户个人信息
const profileStore = useProfileStore()
// 动态列表
const postsStore = usePostsStore()

// 弹出层
const userPopupRef = ref<InstanceType<typeof UserPopup>>()

// 点击头像弹出侧栏，未登录则跳转至登录
const avatarClick = () => {
  if (authStore.token) {
    userPopupRef.value?.open()
  } else {
    router.push('/login')
  }
}

// 是否有重要通知
const isImportantNotif = computed(() => {
  return profileStore.importantNotif ? true : false
})
</script>

<template>
  <UserPopup ref="userPopupRef"></UserPopup>
  <van-overlay class="loading-overlay" :show="isLoading">
    <div class="wrapper">
      <van-loading color="#1989fa" />
    </div>
  </van-overlay>
  <van-nav-bar
    @click-left="avatarClick"
    @click-right="router.push('/setting')"
    safe-area-inset-top
    placeholder
    fixed
  >
    <template #title>
      <div
        class="nav-logo"
        :style="{ backgroundImage: `url(${logoImage})` }"
      ></div>
    </template>
    <template #left>
      <van-image
        class="nav-avatar"
        round
        :src="profileStore.user?.avatar || avatarConfig.defaultAvatar"
      ></van-image>
    </template>
    <template #right>
      <van-icon class="nav-setting" name="setting" color="#323233" />
    </template>
  </van-nav-bar>
  <router-view></router-view>
  <van-tabbar route safe-area-inset-bottom placeholder replace>
    <van-tabbar-item replace to="/home" icon="wap-home"></van-tabbar-item>
    <van-tabbar-item replace to="/user-list" icon="friends"></van-tabbar-item>
    <van-tabbar-item replace to="/share" icon="cluster"></van-tabbar-item>
    <van-tabbar-item
      replace
      to="/notif"
      icon="bell"
      :badge-props="{
        content: profileStore.unreadNotifCount,
        dot:
          (!profileStore.readNotifUuid.length &&
            profileStore.unreadNotifCount !== 0) ||
          (isImportantNotif && !profileStore.unreadNotifCount),
        max: 9,
        color: isImportantNotif ? '#ee0a24' : '#1989fa',
        showZero: false
      }"
    ></van-tabbar-item>
    <van-tabbar-item
      replace
      to="/post"
      icon="chat"
      :badge-props="{
        content: postsStore.unreadPostCount,
        dot:
          !postsStore.readPostUuid.length && postsStore.unreadPostCount !== 0,
        max: 9,
        color: '#1989fa',
        showZero: false
      }"
    ></van-tabbar-item>
  </van-tabbar>
</template>

<style lang="scss" scoped>
.van-tabbar__placeholder {
  :deep() {
    .van-tabbar {
      border-top: 1px solid #ddd; /* 上边框*/
      // border-radius: 30px 30px 0 0;
    }
  }
}
.van-nav-bar__placeholder {
  :deep() {
    .van-nav-bar {
      border-bottom: 1px solid #ddd; /* 下边框*/
      // border-radius: 0 0 30px 30px;
      .nav-logo {
        width: 30px;
        height: 30px;
        background-repeat: no-repeat;
        background-position: center;
        background-size: 30px auto;
      }
      .nav-avatar {
        width: 32px;
        height: 32px;
      }
      .nav-setting {
        width: 25px;
        height: 25px;
        font-size: 25px;
      }
    }
  }
}

.loading-overlay {
  background: rgba(247, 248, 250, 0.7);
  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
}
</style>
