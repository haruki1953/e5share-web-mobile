<script setup lang="ts">
import { ref, computed } from 'vue'
import { loadE5PostsData } from '@/utils/dataManage'
import { postsSendPostService, postsClearPostService } from '@/api/posts'
import { usePostsStore, useProfileStore } from '@/stores'
import { useRouter } from 'vue-router'

const props = defineProps<{
  e5id: number
}>()

const actionSheetShow = ref(false)
const open = () => {
  // 显示抽屉
  actionSheetShow.value = true
}

// 导出open方法
defineExpose({
  open
})

const content = ref('')

const isLoading = ref(false)
// 发送帖子
const postSend = async () => {
  // 去除首尾空格，为空返回
  content.value = content.value.trim()
  if (!content.value) {
    showToast('内容为空')
    return
  }
  // 设置为提交中状态
  isLoading.value = true
  try {
    // 调用接口
    await postsSendPostService(props.e5id, content.value)
    // 清空content
    content.value = ''
    // 重新请求当前动态
    await loadE5PostsData(props.e5id)
    showToast('发送成功')
    // 关闭面板
    actionSheetShow.value = false
  } finally {
    // 无论提交成功或失败，都要解除提交中状态
    isLoading.value = false
  }
}

const postsStore = usePostsStore()

const profileStore = useProfileStore()
// 登录用户是否为e5帐号主，据此显示清空动态按钮
const isE5Master = computed(() => {
  return props.e5id === profileStore.user?.id
})

// 清空动态
const postClear = async () => {
  await showConfirmDialog({
    title: '温馨提示',
    message: `您确认要清空动态吗`
  })

  // 设置为提交中状态
  isLoading.value = true
  try {
    // 调用接口
    await postsClearPostService()
    // 重新请求当前动态
    await loadE5PostsData(props.e5id)
    showToast('清空成功')
    // 关闭面板
    actionSheetShow.value = false
  } finally {
    // 无论提交成功或失败，都要解除提交中状态
    isLoading.value = false
  }
}

// 是否为关注
const isFollowing = computed(() => {
  return postsStore.followE5ids.includes(props.e5id)
})

const router = useRouter()
// 取消关注
const removeFollow = async () => {
  await showConfirmDialog({
    title: '温馨提示',
    message: `您确认要取消关注动态吗`
  })
  postsStore.removeFollow(props.e5id)
  showToast('取消关注成功')
  // 跳转至动态菜单页
  router.push('/post')
}
</script>
<template>
  <van-action-sheet v-model:show="actionSheetShow" :closeable="false">
    <div class="sheet-content" v-if="isFollowing">
      <van-notice-bar
        color="#909090"
        background="#f0f0f0"
        left-icon="info-o"
        wrapable
      >
        <div class="my-text-h4">关于“关注动态”：</div>
        您已关注此动态，可以浏览但无法发言，被帮助的用户可以发言。
        关注信息保存在本地，退出登录时将取消关注。
      </van-notice-bar>
      <van-button
        class="send-button"
        type="danger"
        block
        round
        @click="removeFollow"
        :loading="isLoading"
      >
        取消关注
      </van-button>
    </div>
    <div class="sheet-content" v-else>
      <div v-if="isE5Master" class="del-box">
        <van-button
          type="danger"
          size="mini"
          round
          icon="delete-o"
          @click="postClear"
          :loading="isLoading"
        >
          清空动态
        </van-button>
      </div>
      <van-field
        v-model="content"
        placeholder="发送动态"
        type="textarea"
        rows="2"
        autosize
        maxlength="500"
        show-word-limit
      />
      <van-button
        class="send-button"
        type="primary"
        block
        round
        @click="postSend"
        :loading="isLoading"
      >
        发送动态
      </van-button>
    </div>
  </van-action-sheet>
</template>

<style lang="scss" scoped>
.sheet-content {
  margin: 10px;
  .van-notice-bar {
    border-radius: 20px;
  }
  .van-field {
    margin-top: 10px;
    border-radius: 20px;
    background-color: #f5f5f5;
  }
  .send-button {
    margin-top: 10px;
  }
}
</style>
