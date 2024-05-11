<script setup lang="ts">
import type { User } from '@/types/user'
import { formatDate, formatTime } from '@/utils/timeUtils'
import { computed } from 'vue'
import { accountStatus } from '@/config'
import { useUsersStore } from '@/stores'

const props = withDefaults(
  defineProps<{
    user: User
    isPage?: boolean // 是否为用户主页
    isShareInfo?: boolean // 是否为在分享页，没有多余的信息
  }>(),
  {
    isPage: false,
    isShareInfo: false
  }
)

const usersStore = useUsersStore()

// e5订阅开始日与结束日
const e5subscriptionDate = computed(() =>
  formatDate(props.user.e5_subscription_date)
)
const e5expirationDate = computed(() =>
  formatDate(props.user.e5_expiration_date)
)

// 获取获取用户最后登录时间
const last_login = computed(() => {
  if (props.user.last_login) return formatTime(props.user.last_login)
  usersStore.getLastLoginTime(props.user.id)
  return '获取中...'
})
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
    <div v-if="!isShareInfo">
      <div class="row-info" v-if="user.bio">
        <div class="my-text-h2">简介：</div>
        <div class="text-info my-text-p1" v-if="isPage">
          {{ user.bio }}
        </div>
        <van-text-ellipsis
          :rows="5"
          :content="user.bio"
          expand-text="展开"
          collapse-text="收起"
          class="text-info my-text-p1"
          v-else
        />
      </div>
      <div class="row-info" v-if="user.contact_info">
        <div class="my-text-h2">联系方式：</div>
        <div class="text-info my-text-p1" v-if="isPage">
          {{ user.contact_info }}
        </div>
        <van-text-ellipsis
          :rows="5"
          :content="user.contact_info"
          expand-text="展开"
          collapse-text="收起"
          class="text-info my-text-p1"
          v-else
        />
      </div>

      <div class="row-info" v-if="isPage">
        <span class="my-text-h2">注册时间：</span>
        <span class="text-info my-text-p1">
          {{ formatTime(user.registered_at) }}
        </span>
      </div>
      <div class="row-info" v-if="isPage">
        <span class="my-text-h2">上次登录：</span>
        <span class="text-info my-text-p1">
          {{ last_login }}
        </span>
      </div>
      <van-row
        class="row-info"
        v-if="user.account_status === accountStatus.sharing"
      >
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

      <div v-if="isPage">
        <RelatedUsers
          :userIds="user.helping_users"
          :title="`TA正在帮助 ${user.helping_users.length} 人`"
          color="#1989fa"
          v-if="user.helping_users.length"
          class="users-list"
        ></RelatedUsers>
        <RelatedUsers
          :userIds="user.helping_by_users"
          :title="`${user.helping_by_users.length} 人正在帮助TA`"
          color="#07c160"
          v-if="user.helping_by_users.length"
          class="users-list"
        ></RelatedUsers>
        <RelatedUsers
          :userIds="user.helped_users"
          :title="`TA帮助过 ${user.helped_users.length} 人`"
          color="#1989fa"
          v-if="user.helped_users.length"
          class="users-list"
        ></RelatedUsers>
        <RelatedUsers
          :userIds="user.helped_by_users"
          :title="`${user.helped_by_users.length} 人帮助过TA`"
          color="#07c160"
          v-if="user.helped_by_users.length"
          class="users-list"
        ></RelatedUsers>
      </div>

      <div v-else-if="user.account_status === accountStatus.sharing">
        <RelatedUsers
          :userIds="user.helping_users"
          :title="`正在帮助 ${user.helping_users.length} 人`"
          color="#1989fa"
          v-if="user.helping_users.length"
          class="users-list"
        ></RelatedUsers>
        <!-- <van-cell title="还没有帮助" class="helpnum-text users-list" v-else>
      </van-cell> -->
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.card {
  padding: 30px;
  // border-top: 1px solid #dcdfe6; /* 上边框*/
  border-bottom: 1px solid #dcdfe6; /* 下边框*/
  // margin: -1px 0;
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
  display: flex;
  align-items: center;
  margin-top: 12px;
  .text-info {
    min-width: 120px;
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
.helpnum-text {
  :deep() {
    .van-cell__title {
      // @extend .my-text-h1;
      margin-left: 10px;
      font-size: 16px;
      font-weight: bold;
      color: var(--my-color-b2);
    }
  }
}
</style>
