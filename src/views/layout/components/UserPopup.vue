<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useProfileStore } from '@/stores'
import { removeLogin } from '@/utils/dataManage'
import LinkCollapse from './LinkCollapse.vue'

// 路由
const router = useRouter()
// 用户个人信息
const profileStore = useProfileStore()

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

// 打开弹出层
const open = () => {
  isShowPopup.value = true
}

defineExpose({
  open
})
</script>
<template>
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
</template>

<style lang="scss" scoped>
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
</style>
