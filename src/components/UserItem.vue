<script setup lang="ts">
import { computed } from 'vue'
import { useUsersStore } from '@/stores'

const props = withDefaults(
  defineProps<{
    userId: number
    usernameLink?: boolean
  }>(),
  {
    usernameLink: true
  }
)

const usersStore = useUsersStore()
// 获取用户
const user = computed(() => {
  // 根据id查找用户
  return usersStore.findUserForShow(props.userId)
})
</script>
<template>
  <div class="user-item">
    <div class="avatar-item">
      <van-image
        class="avatar-img"
        round
        :src="user.avatar"
        lazy-load
      ></van-image>
    </div>
    <div class="name-box">
      <div class="my-text-h3">{{ user.nickname }}</div>
      <div
        v-if="usernameLink"
        @click.stop="$router.push(`/user/${user.id}`)"
        class="my-text-p2 van-haptics-feedback"
      >
        @{{ user.username }}
      </div>
      <div v-else class="my-text-p2 van-haptics-feedback">
        @{{ user.username }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.user-item {
  display: flex;
  align-items: center;
  line-height: initial;
}
.avatar-item {
  display: flex;
  align-items: center;
  line-height: initial;
}
.avatar-img {
  width: 40px;
  height: 40px;
  margin-right: 10px;
}

.name-box {
  overflow: hidden;
  div {
    overflow: hidden;
    white-space: nowrap; /* 防止文本换行 */
    text-overflow: ellipsis;
  }
}
</style>
