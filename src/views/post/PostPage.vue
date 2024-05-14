<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import { usePostsStore } from '@/stores'
import PostMenuItem from './compenents/PostMenuItem.vue'

const postsStore = usePostsStore()
// 获取e5id列表
const e5idList = computed(() => {
  return postsStore.e5idList
})

onMounted(() => {
  // 首次登录时（readPostUuid为空）设置全部已读
  if (!postsStore.readPostUuid.length) {
    postsStore.markAllPostAsRead()
  }
})

// 悬浮球
const actionSheetShow = ref(false)
const onBubbleClick = () => {
  actionSheetShow.value = true
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
  const tabbarHeight = (window.innerWidth / 375) * 50

  // 设置起始位置，tabbar上方24px
  offset.value.x -= 24 + bubbleSize
  offset.value.y -= 24 + bubbleSize + tabbarHeight
})

// 所有动态全部已读
const markAllPostAsRead = () => {
  postsStore.markAllPostAsRead()
  actionSheetShow.value = false
}
</script>
<template>
  <van-floating-bubble
    icon="setting-o"
    @click="onBubbleClick"
    v-model:offset="offset"
    axis="xy"
    magnetic="x"
  />
  <van-action-sheet v-model:show="actionSheetShow" :closeable="false">
    <div class="sheet-content">
      <van-notice-bar
        color="#909090"
        background="#f0f0f0"
        left-icon="info-o"
        wrapable
      >
        <div class="my-text-h4">关于“动态”：</div>
        类似 X 的社群？可以充当公告栏，被帮助的用户也可以发言。
        不过聊天的话还是去 Discord 比较好，联系管理员可以为您创建频道
      </van-notice-bar>
      <van-button
        color="#909399"
        block
        round
        size="small"
        @click="markAllPostAsRead"
      >
        动态全部已读
      </van-button>
    </div>
  </van-action-sheet>
  <div v-if="e5idList.length">
    <PostMenuItem
      v-for="item in e5idList"
      :key="item"
      :e5id="item"
      @click="$router.push(`/post-info/${item}`)"
      class="van-haptics-feedback"
    ></PostMenuItem>
  </div>
  <van-empty description="暂无动态" v-else />
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
  .van-button {
    margin-top: 10px;
  }
}
</style>
