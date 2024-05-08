<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore, useProfileStore, usePostsStore } from '@/stores'
import { removeLogin } from '@/utils/dataManage'
import { avatarConfig, logoImage } from '@/config'
import { isLoading } from '@/router'
import LinkCollapse from './components/LinkCollapse.vue'

// 路由
const router = useRouter()
// 鉴权信息
const authStore = useAuthStore()
// 用户个人信息
const profileStore = useProfileStore()
// 动态列表
const postsStore = usePostsStore()

// 退出登录
const logout = async () => {
  await showConfirmDialog({
    title: '温馨提示',
    message: '您确认要退出登录吗'
  })
  // 退出前跳转到首页
  await router.push('/home')
  await removeLogin()
  isShowPopup.value = false
}

// 弹出层
const isShowPopup = ref(false)

// 点击头像弹出侧栏，未登录则跳转至登录
const avatarClick = () => {
  if (authStore.token) {
    isShowPopup.value = true
  } else {
    router.push('/login')
  }
}
</script>

<template>
  <van-overlay class="loading-overlay" :show="isLoading">
    <div class="wrapper">
      <van-loading color="#1989fa" />
    </div>
  </van-overlay>
  <van-popup
    v-model:show="isShowPopup"
    position="left"
    :style="{ width: '90%', height: '100%' }"
  >
    <div class="popup-box">
      <div
        class="user van-haptics-feedback"
        @click="router.push(`/user/${profileStore.user?.id}`)"
      >
        <div class="user-avatar">
          <van-image round :src="profileStore.user?.avatar"></van-image>
        </div>
        <div class="user-nickname my-text-h1">
          {{ profileStore.user?.nickname }}
        </div>
        <div class="user-username my-text-p1">
          @{{ profileStore.user?.username }}
        </div>
      </div>
      <van-divider :hairline="false" />
      <div class="cell-nav" @click="isShowPopup = false">
        <van-cell
          title="首页"
          clickable
          to="/home"
          size="large"
          icon="wap-home"
          replace
        />
        <van-cell
          title="用户列表"
          clickable
          to="/user-list"
          size="large"
          icon="friends"
          replace
        />
        <van-cell
          title="E5分享管理"
          clickable
          to="/share"
          size="large"
          icon="cluster"
          replace
        />
        <van-cell title="通知" clickable to="/notif" size="large" icon="bell" />
        <van-cell
          title="动态"
          clickable
          to="/post"
          size="large"
          icon="comment"
          replace
        />
        <van-cell
          title="个人主页"
          clickable
          :to="`/user/${profileStore.user?.id}`"
          size="large"
          icon="user"
        />
        <van-cell
          title="设置"
          clickable
          to="/setting"
          size="large"
          icon="setting"
        />
      </div>
      <van-button
        class="logout-button"
        type="primary"
        round
        block
        @click="logout"
      >
        退出登录
      </van-button>
    </div>
    <div class="popup-buttom">
      <LinkCollapse></LinkCollapse>
    </div>
  </van-popup>
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
        dot: !profileStore.readNotifUuid.length,
        max: 9,
        color: '#1989fa',
        showZero: false
      }"
    ></van-tabbar-item>
    <van-tabbar-item
      replace
      to="/post"
      icon="comment"
      :badge-props="{
        content: postsStore.unreadPostCount,
        dot: !postsStore.readPostUuid.length,
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

.van-popup {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .popup-box {
    margin: 30px;
    .user-avatar {
      .van-image {
        width: 80px;
        height: 80px;
      }
    }
    .user-nickname {
      margin-bottom: 5px;
    }
    .cell-nav {
      .van-cell {
        border-radius: 20px; /* 设置圆角 */
        :deep() {
          .van-cell__title {
            margin-left: 10px;
            font-weight: bold; /* 设置昵称字体加粗 */
            // color: var(--my-color-b1); /* 设置昵称字体颜色 */
          }
          .van-cell__left-icon {
            width: 20px;
            height: 20px;
            font-size: 20px;
          }
          // .van-cell__right-icon {
          //   display: none;
          // }
        }
      }
    }
    .logout-button {
      margin-top: 10px;
    }
  }
  .popup-buttom {
    margin: 0 30px 30px 30px;
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
