<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useUsersStore } from '@/stores'

// 用户列表
const usersStore = useUsersStore()

// 搜索值 用于绑定 可以不用
// const searchVal = ref('')

// 搜索键 用于生成显示的数据
const searchKey = ref('')

// 要显示的数据
const dataList = computed(() => {
  return usersStore.searchUsers(searchKey.value)
})

// 处理搜索按钮点击事件
// const handleSearch = () => {
//   searchKey.value = searchVal.value
// }

// showAll 显示全部用户
const showAll = () => {
  // searchVal.value = ''
  searchKey.value = ''
}

const actionSheetShow = ref(false)

const onBubbleClick = () => {
  // 如果已搜索则显示全部用户，未搜索打开动作面板
  if (searchKey.value) {
    showAll()
  } else {
    actionSheetShow.value = true
  }
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
</script>

<template>
  <div class="card-container">
    <UserCard v-for="item in dataList" :key="item.id" :user="item"></UserCard>
    <van-empty v-if="!dataList.length" description="未找到用户" />
  </div>
  <van-floating-bubble
    :icon="searchKey ? 'cross' : 'search'"
    @click="onBubbleClick"
    v-model:offset="offset"
    axis="xy"
    magnetic="x"
  />
  <van-action-sheet v-model:show="actionSheetShow" :closeable="false">
    <div class="sheet-content">
      <van-field v-model="searchKey" placeholder="搜索用户" />
    </div>
  </van-action-sheet>
</template>

<style lang="scss" scoped>
.card-container {
  margin-bottom: 50px;
}
.sheet-content {
  margin: 10px;
  .van-field {
    border-radius: 22px;
    background-color: #f5f5f5;
  }
}
</style>
