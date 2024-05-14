<script setup lang="ts">
import { usePostsStore, useUsersStore } from '@/stores'
import type { User } from '@/types/user'
import { computed } from 'vue'

const props = defineProps<{
  e5id: number
}>()

const usersStore = useUsersStore()
// e5帐号主用户数据
const e5User = computed(() => {
  return usersStore.findUserById(props.e5id)
})

// 在动态中的用户
const postUsersId = computed(() => {
  if (!e5User.value) return null
  return [props.e5id, ...e5User.value.helping_users]
})
const postUsers = computed(() => {
  if (!postUsersId.value) return null
  // 取后三个显示头像
  const start = Math.max(0, postUsersId.value.length - 3) // 起始索引
  return usersStore
    .mapUsersByIds(postUsersId.value.slice(start))
    .filter((user) => user !== undefined) as User[]
})

const postsStore = usePostsStore()
// 最近动态的文字信息
const lastContent = computed(() => {
  const content = postsStore.getE5PostLastContent(props.e5id)
  if (content) {
    return content
  }
  return '暂无消息'
})

// 未读通知数
const unreadCountInE5Posts = computed(() => {
  return postsStore.unreadCountInE5Posts(props.e5id)
})
</script>
<template>
  <div class="card">
    <div class="user-box">
      <UserItem
        :userId="e5id"
        :usernameLink="false"
        class="user-item"
      ></UserItem>
      <van-badge
        :content="unreadCountInE5Posts"
        :show-zero="false"
        color="#1989fa"
        max="9"
      />
    </div>
    <div class="info-box">
      <div class="content-box">
        <van-text-ellipsis :content="lastContent" class="my-text-p3" />
      </div>
      <div class="hrlping-box">
        <div class="avatar-list">
          <van-image
            v-for="item in postUsers"
            :key="item.id"
            round
            :src="item.avatar"
            lazy-load
          ></van-image>
        </div>
        <div class="my-text-h4">{{ postUsersId?.length }}人</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.card {
  padding: 20px;
  border-bottom: 1px solid #dcdfe6; /* 下边框*/
}
.user-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  .user-item {
    width: 300px;
  }
  .van-badge {
    --van-badge-size: 20px;
  }
}
.info-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 5px;
  .content-box {
    width: 240px;
  }
  .hrlping-box {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .avatar-list {
      margin-right: 5px;
      display: flex;
      .van-image {
        width: 24px;
        height: 24px;
        margin-left: -8px;
      }
    }
  }
}
</style>
