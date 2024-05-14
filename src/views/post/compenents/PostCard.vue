<script setup lang="ts">
import { computed, ref } from 'vue'
import { formatTime } from '@/utils/timeUtils'
import { usePostsStore, useProfileStore } from '@/stores'
import type { Post } from '@/types/post'
import { postsDelPostService } from '@/api/posts'
import { loadE5PostsData } from '@/utils/dataManage'

const props = defineProps<{
  post: Post
  e5id: number
}>()

const profileStore = useProfileStore()

// 是否显示删除按钮
const shouldShowDelButton = computed(() => {
  if (!profileStore.user) return null
  const userId = profileStore.user.id
  if (userId === props.e5id || userId === props.post.userId) {
    return true
  }
  return false
})

const postsStore = usePostsStore()
// 是否已读
const isRead = computed(() => {
  return postsStore.isPostRead(props.post.id)
})

// 加载中状态标记
const isloading = ref(false)
// 删除帖子
const postDel = async () => {
  await showConfirmDialog({
    title: '温馨提示',
    message: `您确认要删除吗：[${props.post.content}]`
  })

  // 设置为提交中状态
  isloading.value = true
  try {
    // 调用接口
    await postsDelPostService(props.e5id, props.post.id)
    // 重新请求当前动态
    await loadE5PostsData(props.e5id)
    showToast('删除成功')
  } finally {
    // 无论提交成功或失败，都要解除提交中状态
    isloading.value = false
  }
}
</script>
<template>
  <div class="card">
    <div class="badge-time">
      <div>
        <van-badge
          content="new"
          color="#1989fa"
          v-if="!isRead"
          position="top-left"
        />
      </div>
      <div class="my-text-p3 notif-time">{{ formatTime(post.time) }}</div>
    </div>
    <div class="user-delbtn">
      <UserItem :userId="post.userId" class="user-item"></UserItem>
      <van-button
        icon="delete-o"
        type="danger"
        size="small"
        round
        :loading="isloading"
        @click="postDel"
        v-if="shouldShowDelButton"
      />
    </div>
    <div class="post-content">
      <van-text-ellipsis
        class="my-text-p2"
        :content="post.content"
        rows="5"
        expand-text="展开"
        collapse-text="收起"
      ></van-text-ellipsis>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.card {
  padding: 15px 20px 20px 20px;
  // border-top: 1px solid #dcdfe6; /* 上边框*/
  border-bottom: 1px solid #dcdfe6; /* 下边框*/
  // margin: -1px 0;
}
.badge-time {
  display: flex;
  justify-content: space-between;
  height: 15px;
}
.user-delbtn {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .user-item {
    width: 300px;
  }
}
.post-content {
  // margin: 10px 10px 0 10px;
  margin-top: 10px;
}
</style>
