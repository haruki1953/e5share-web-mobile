<script setup lang="ts">
import type { User } from '@/types/user'
import { formatDate } from '@/utils/timeUtils'
import { computed } from 'vue'
import { accountStatus } from '@/config'

const props = defineProps<{
  user: User
}>()

// e5订阅开始日与结束日
const e5subscriptionDate = computed(() =>
  formatDate(props.user.e5_subscription_date)
)
const e5expirationDate = computed(() =>
  formatDate(props.user.e5_expiration_date)
)
</script>
<template>
  <div class="card">
    <div class="user-e5">
      <div
        @click="$router.push(`/user/${user.id}`)"
        class="user-box van-haptics-feedback"
      >
        <div class="user-avatar">
          <van-image
            class="avatar-img"
            round
            :src="user.avatar"
            lazy-load
          ></van-image>

          <div class="tag-box">
            <AboutmeTag :user="user"></AboutmeTag>
          </div>
        </div>
        <div class="my-text-h2">
          {{ user.nickname }}
        </div>
        <div class="my-text-p1">@{{ user.username }}</div>
      </div>
      <E5sharingProgress :user="user"></E5sharingProgress>
    </div>
    <div class="row-info" v-if="user.bio">
      <div class="my-text-h2">简介：</div>
      <div class="text-info my-text-p1">
        {{ user.bio }}
      </div>
    </div>
    <div class="row-info" v-if="user.contact_info">
      <div class="my-text-h2">联系方式：</div>
      <div class="text-info my-text-p1">
        {{ user.contact_info }}
      </div>
    </div>
    <div v-if="user.account_status === accountStatus.sharing">
      <van-row class="row-info">
        <van-col :span="12">
          <div class="my-text-h2">E5订阅开始日：</div>
          <div class="text-info my-text-p1">
            {{ e5subscriptionDate }}
          </div>
        </van-col>
        <van-col :span="12">
          <div class="my-text-h2">E5订阅结束日：</div>
          <div class="text-info my-text-p1">
            {{ e5expirationDate }}
          </div>
        </van-col>
      </van-row>
      <RelatedUsers
        :userIds="user.helping_users"
        :title="`正在帮助 ${user.helping_users.length} 人`"
        color="#1989fa"
        v-if="user.helping_users.length"
        class="users-list"
      ></RelatedUsers>
      <van-cell title="还没有帮助" class="helpnum-text users-list" v-else>
      </van-cell>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.card {
  padding: 30px;
  border-top: 1px solid #dcdfe6; /* 下边框*/
  border-bottom: 1px solid #dcdfe6; /* 下边框*/
  margin: -1px 0;
}
.user-box {
  margin-right: 5px;
}
.user-e5 {
  display: flex;
  justify-content: space-between;
  flex-wrap: nowrap; /* 不换行 */
  .user-avatar {
    margin: 0 0 5px 5px;
    display: flex;
    flex-wrap: nowrap; /* 不换行 */
    .van-image {
      width: 64px;
      height: 64px;
    }
    .tag-box {
      display: flex;
      align-items: center;
      margin: 0 5px;
    }
  }
}

.row-info {
  margin-top: 12px;
  .text-info {
    white-space: pre-line;
  }
}

.date-text {
  margin-right: 10px;
  white-space: nowrap;
}

.my-text-p1 {
  margin-top: 2px;
}

.users-list {
  margin-top: 15px;
  border-radius: 20px;
  .van-cell__title {
    // @extend .my-text-h1;
    margin-left: 10px;
    font-size: 16px;
    font-weight: bold;
  }
}
</style>
