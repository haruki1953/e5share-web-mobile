<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUsersStore, useProfileStore, usePostsStore } from '@/stores'
import { accountStatus } from '@/config'
import { formatDate, formatTime } from '@/utils/timeUtils'
// import ApplyDrawer from './components/ApplyDrawer.vue'
// import StopDialog from './components/StopDialog.vue'

const route = useRoute()
const router = useRouter()
const usersStore = useUsersStore()
const profileStore = useProfileStore()
const postsStore = usePostsStore()

// 根据路由参数获取用户数据
const user = computed(() => {
  const userId = Number(route.params.id)
  if (isNaN(userId)) {
    return null
  }
  return usersStore.findUserById(userId)
})

// 控制按钮显示
const buttonDisplay = computed(() => {
  // 分享申请
  let applyButton = false
  // 分享停止接受
  let stopButton = false
  // 当前用户状态为分享 且 当前用户非登录用户 时显示分享相关按钮
  if (
    user.value?.id &&
    user.value.account_status === accountStatus.sharing &&
    user.value.id !== profileStore.user?.id
  ) {
    // 当前用户帮助登录用户时，显示停止接受分享按钮，否则显示申请分享按钮
    if (
      profileStore.user?.id &&
      user.value.helping_users.includes(profileStore.user.id)
    ) {
      stopButton = true
    } else {
      applyButton = true
    }
  }

  // 添加至分享信息
  // 登录用户状态为分享 且 当前用户非登录用户 且 当前用户未被自己分享，显示添加至分享信息按钮
  let addshareButton =
    user.value?.id &&
    profileStore.user?.account_status === accountStatus.sharing &&
    user.value.id !== profileStore.user?.id &&
    !profileStore.user.helping_users.includes(user.value.id)

  // 关注动态
  let followButton = user.value?.id && postsStore.shouldAddFollow(user.value.id)

  // 查看动态
  let toPostButton =
    user.value?.id && Boolean(postsStore.findE5PostsByE5id(user.value.id))

  return {
    applyButton,
    stopButton,
    addshareButton,
    followButton,
    toPostButton
  }
})

// // 分享申请抽屉
// const applyDrawerRef = ref()
// const shareApply = () => {
//   applyDrawerRef.value.open()
// }

// // 分享停止接受对话框
// const stopDialogRef = ref()
// const shareStop = () => {
//   stopDialogRef.value.open()
// }

// // 关注加载状态
// const isFollowingLoading = ref(false)
// // 关注动态
// const postFollow = async () => {
//   // 设置为提交中状态
//   isFollowingLoading.value = true
//   try {
//     await postsStore.addFollow(user.value.id)
//     ElMessage.success('关注动态成功')
//     // 跳转至动态页面
//     toPostPage()
//   } finally {
//     // 无论提交成功或失败，都要解除提交中状态
//     isFollowingLoading.value = false
//   }
// }
// // 查看动态,跳转至动态页
// const toPostPage = () => {
//   router.push(`/post?e5id=${user.value.id}`)
// }
</script>
<template>
  <van-nav-bar
    title="用户主页"
    left-text="返回"
    left-arrow
    @click-left="router.back()"
    safe-area-inset-top
    placeholder
    fixed
  />
  <van-empty v-if="!user" description="用户不存在" />
  <div v-else>
    <div class="button-box">
      <van-button type="primary" block round v-if="buttonDisplay.applyButton">
        向TA申请E5账号
      </van-button>
      <van-button type="danger" block round v-if="buttonDisplay.stopButton">
        停止接受TA的分享
      </van-button>
      <van-button
        type="success"
        block
        round
        v-if="buttonDisplay.addshareButton"
      >
        将TA添加至分享信息
      </van-button>
      <van-button
        icon="star"
        color="#e6a23c"
        block
        round
        v-if="buttonDisplay.followButton"
      >
        关注动态
      </van-button>
      <van-button
        icon="star"
        color="#e6a23c"
        block
        round
        v-if="buttonDisplay.toPostButton"
      >
        查看动态
      </van-button>
    </div>
    <UserCard :user="user" isPage></UserCard>
  </div>
</template>

<style lang="scss" scoped>
.van-nav-bar__placeholder {
  :deep() {
    .van-nav-bar {
      border-bottom: 1px solid #ddd; /* 下边框*/
      // border-radius: 0 0 30px 30px;
    }
  }
}
.button-box {
  padding: 10px 30px;
  .van-button {
    margin: 10px;
  }
}
</style>
