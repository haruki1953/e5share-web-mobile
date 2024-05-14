<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  useUsersStore,
  useProfileStore,
  usePostsStore,
  useShareStore
} from '@/stores'
import { accountStatus } from '@/config'
import ApplySheet from './components/ApplySheet.vue'
import StopSheet from './components/StopSheet.vue'
import AddShareSheet from './components/AddShareSheet.vue'

const route = useRoute()
const router = useRouter()
const usersStore = useUsersStore()
const profileStore = useProfileStore()
const postsStore = usePostsStore()
const shareStore = useShareStore()

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
  // 登录用户状态为分享 且 当前用户非登录用户 且 当前用户未在分享信息，显示添加至分享信息按钮
  let addshareButton =
    user.value?.id &&
    profileStore.user?.account_status === accountStatus.sharing &&
    user.value.id !== profileStore.user?.id &&
    !shareStore.findShareInfoByUserId(user.value.id)

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

// 分享申请面板
const applySheetRef = ref<InstanceType<typeof ApplySheet>>()
const shareApply = () => {
  applySheetRef.value?.open()
}

// 停止接受分享面板
const stopSheetRef = ref<InstanceType<typeof StopSheet>>()
const shareStop = () => {
  stopSheetRef.value?.open()
}

// 添加分享信息面板

const addShareSheetRef = ref<InstanceType<typeof AddShareSheet>>()
const shareAdd = () => {
  addShareSheetRef.value?.open()
}

// 关注加载状态
const isFollowingLoading = ref(false)
// 关注动态
const postFollow = async () => {
  if (!user.value) return

  // 设置为提交中状态
  isFollowingLoading.value = true
  try {
    await postsStore.addFollow(user.value.id)
    showToast('关注动态成功')
    // 跳转至动态页面
    toPostPage()
  } finally {
    // 无论提交成功或失败，都要解除提交中状态
    isFollowingLoading.value = false
  }
}
// 查看动态,跳转至动态页
const toPostPage = () => {
  if (!user.value) return
  router.push(`/post-info/${user.value.id}`)
}
</script>
<template>
  <van-nav-bar
    title="用户主页"
    left-text="返回"
    left-arrow
    @click-left="router.back()"
    @click-right="router.push('/home')"
    safe-area-inset-top
    placeholder
    fixed
  >
    <template #right>
      <van-icon class="nav-right" name="wap-home" color="#323233" />
    </template>
  </van-nav-bar>
  <van-empty v-if="!user" description="用户不存在" />
  <div class="card-container" v-else>
    <ApplySheet
      :e5id="user.id"
      ref="applySheetRef"
      v-if="buttonDisplay.applyButton"
    ></ApplySheet>
    <StopSheet
      :e5id="user.id"
      ref="stopSheetRef"
      v-if="buttonDisplay.stopButton"
    ></StopSheet>
    <AddShareSheet
      :userId="user.id"
      ref="addShareSheetRef"
      v-if="buttonDisplay.addshareButton"
    ></AddShareSheet>
    <div class="button-box">
      <van-button
        type="primary"
        block
        round
        v-if="buttonDisplay.applyButton"
        @click="shareApply"
      >
        向TA申请E5账号
      </van-button>
      <van-button
        type="danger"
        block
        round
        v-if="buttonDisplay.stopButton"
        @click="shareStop"
      >
        停止接受TA的分享
      </van-button>
      <van-button
        type="success"
        block
        round
        v-if="buttonDisplay.addshareButton"
        @click="shareAdd"
      >
        将TA添加至分享信息
      </van-button>
      <van-button
        icon="star"
        color="#e6a23c"
        block
        round
        v-if="buttonDisplay.followButton"
        @click="postFollow"
        :loading="isFollowingLoading"
      >
        关注动态
      </van-button>
      <van-button
        icon="star"
        color="#e6a23c"
        block
        round
        v-if="buttonDisplay.toPostButton"
        @click="toPostPage"
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
.nav-right {
  width: 25px;
  height: 25px;
  font-size: 25px;
}

.card-container {
  margin-bottom: 50px;
}
.button-box {
  padding: 0 30px;
  padding-bottom: 15px;
  border-bottom: 1px solid #dcdfe6; /* 下边框*/
  .van-button {
    margin-top: 15px;
  }
}
</style>
