<script setup lang="ts">
import { usePostsStore, useUsersStore } from '@/stores'
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import PostCard from './compenents/PostCard.vue'
import type { User } from '@/types/user'
import SendSheet from './compenents/SendSheet.vue'

const route = useRoute()
const usersStore = useUsersStore()
// 动态
const postsStore = usePostsStore()

onBeforeUnmount(() => {
  if (!e5User.value) return null
  // 在动态页关闭时，当前动态全部已读
  postsStore.markE5PostsAsRead(e5User.value.id)
})

const e5User = ref<User>()
// 根据路由参数获取用户数据
onMounted(() => {
  const userId = Number(route.params.id)
  if (isNaN(userId)) {
    return null
  }
  e5User.value = usersStore.findUserById(userId)
})

// 获取动态数据、倒序
const e5Posts = computed(() => {
  if (!e5User.value) return null
  const posts = postsStore.findE5PostsByE5id(e5User.value.id)
  if (!posts) return null
  return posts.slice().reverse()
})

// 悬浮球
const onBubbleClick = () => {
  // 唤起动态发送面板
  refSendSheet.value?.open()
}
const offset = ref({
  x: window.innerWidth,
  y: window.innerHeight
})
onMounted(async () => {
  await nextTick() // 等待下一次更新才会有动画效果
  // 计算悬浮球大小
  const bubbleSize = (window.innerWidth / 375) * 48
  // 计算tabbar高度
  // const tabbarHeight = (window.innerWidth / 375) * 50

  // 设置起始位置
  offset.value.x -= 24 + bubbleSize
  offset.value.y -= 24 + bubbleSize //+ tabbarHeight
})

const refSendSheet = ref<InstanceType<typeof SendSheet>>()
</script>
<template>
  <van-floating-bubble
    icon="chat-o"
    @click="onBubbleClick"
    v-model:offset="offset"
    axis="xy"
    magnetic="x"
    v-if="e5Posts"
  />
  <SendSheet
    v-if="e5User && e5Posts"
    :e5id="e5User.id"
    ref="refSendSheet"
  ></SendSheet>
  <van-nav-bar
    :title="`动态 | ${e5User?.nickname}`"
    left-text="返回"
    left-arrow
    @click-left="$router.back()"
    @click-right="e5User && $router.push(`/user/${e5User.id}`)"
    safe-area-inset-top
    placeholder
    fixed
  >
    <template #right>
      <van-image
        class="nav-avatar"
        round
        v-if="e5User"
        :src="e5User.avatar"
      ></van-image>
    </template>
  </van-nav-bar>
  <div class="card-container" v-if="e5Posts && e5Posts.length && e5User">
    <PostCard
      v-for="item in e5Posts"
      :key="item.id"
      :post="item"
      :e5id="e5User.id"
    ></PostCard>
  </div>
  <van-empty v-else description="暂无消息" />
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
.nav-avatar {
  width: 32px;
  height: 32px;
}
.card-container {
  margin-bottom: 50px;
}
</style>
