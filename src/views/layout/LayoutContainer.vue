<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore, useProfileStore, usePostsStore } from '@/stores'
import { loadAllData, removeLogin } from '@/utils/dataManage'
import { avatarConfig, logoImage } from '@/config'
import { isLoading } from '@/router'

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
  // 退出前跳转到首页
  await router.push('/home')
  await removeLogin()
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
  <!-- 左侧弹出 -->
  <van-popup
    v-model:show="isShowPopup"
    position="left"
    :style="{ width: '80%', height: '100%' }"
  >
    <div class="popup-box">
      <div class="user-avatar">
        <van-image
          round
          width="80px"
          height="80px"
          :src="profileStore.user?.avatar"
        ></van-image>
      </div>
      <div class="user-nickname">长期素食</div>
      <div class="user-username">@NagasakiSoyo</div>
    </div>
  </van-popup>
  <van-nav-bar @click-left="avatarClick" @click-right="router.push('/setting')">
    <template #title>
      <div
        class="nav-logo"
        :style="{ backgroundImage: `url(${logoImage})` }"
      ></div>
    </template>
    <template #left>
      <van-image
        round
        width="32px"
        height="32px"
        :src="profileStore.user?.avatar || avatarConfig.defaultAvatar"
      ></van-image>
    </template>
    <template #right>
      <van-icon name="setting" size="25" color="#323233" />
    </template>
  </van-nav-bar>
  <router-view></router-view>
  <van-tabbar route>
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
.van-tabbar {
  border-top: 1px solid #dcdfe6; /* 上边框：3 像素宽，蓝色实线 */
  border-radius: 30px 30px 0 0;
}
.van-nav-bar {
  border-bottom: 1px solid #dcdfe6; /* 上边框：3 像素宽，蓝色实线 */
  border-radius: 0 0 30px 30px;
  .nav-logo {
    width: 30px;
    height: 30px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 30px auto;
  }
}

.user-nickname {
  font-size: 18px; /* 设置昵称字体大小 */
  font-weight: bold; /* 设置昵称字体加粗 */
  color: #333; /* 设置昵称字体颜色 */
  margin-bottom: 5px; /* 设置昵称下方留白 */
}

.user-username {
  font-size: 14px; /* 设置用户名字体大小 */
  color: #666; /* 设置用户名字体颜色 */
}

.popup-box {
  margin: 20px;
}
</style>
