<script setup lang="ts">
import { computed, ref } from 'vue'
import type { User } from '@/types/user'
import { accountStatus } from '@/config'
import { formatDate, dateRound } from '@/utils/timeUtils'

const props = defineProps<{
  user: User
}>()

// 开始日期与结束日期，formatDate去掉时间应该比较好
const startDate = computed(() => {
  const data = formatDate(props.user.e5_subscription_date)
  if (!data) return null
  return new Date(data)
})
const endDate = computed(() => {
  const data = formatDate(props.user.e5_expiration_date)
  if (!data) return null
  return new Date(data)
})
// 总天数
const totalDays = computed(() => {
  if (!endDate.value || !startDate.value) return null
  return Math.round(
    (endDate.value.getTime() - startDate.value.getTime()) /
      (1000 * 60 * 60 * 24)
  )
})
// 剩余天数
const remainingDays = computed(() => {
  if (!endDate.value || !startDate.value) return null
  return Math.round(
    (endDate.value.getTime() - dateRound(new Date()).getTime()) /
      (1000 * 60 * 60 * 24)
  )
})
// 进度值
const progressVal = computed(() => {
  if (
    !startDate.value ||
    typeof totalDays.value !== 'number' ||
    typeof remainingDays.value !== 'number'
  )
    return null
  if (startDate.value > dateRound(new Date())) {
    return 0 // 未开始状态，即订阅开始日期晚于当前日期
  }
  return Math.min(
    ((totalDays.value - remainingDays.value) / totalDays.value) * 100,
    100
  )
})
// 状态 剩余天数大于10时为空，小于时为warning，为小于等于0时为exception
const progressStatus = computed(() => {
  let status = '' // 默认为空状态
  if (
    !startDate.value ||
    typeof totalDays.value !== 'number' ||
    typeof remainingDays.value !== 'number'
  )
    return null
  if (remainingDays.value <= 10 && remainingDays.value > 0) {
    status = 'warning' // 警告状态
  } else if (remainingDays.value <= 0) {
    status = 'exception' // 异常状态、过期
  } else if (startDate.value > dateRound(new Date())) {
    status = 'notStarted' // 未开始状态，即订阅开始日期晚于当前日期
  }
  return status
})
// 颜色
const progressColor = computed(() => {
  let color = '#409eff' // 默认为蓝色
  switch (progressStatus.value) {
    case 'warning':
      color = '#e6a23c'
      break
    case 'exception':
      color = '#f56c6c'
      break
    default:
      break
  }
  return color
})

const currentRate = ref(0)

// 导出信息
defineExpose({
  startDate,
  endDate,
  totalDays,
  remainingDays,
  progressVal,
  progressStatus
})
</script>
<template>
  <div>
    <!-- <div>startDate{{ formatDate(startDate) }}</div>
    <div>progressVal{{ progressVal }}</div>
    <div>totalDays{{ totalDays }}</div>
    <div>remainingDays{{ remainingDays }}</div> -->
    <van-circle
      v-if="
        user.account_status === accountStatus.sharing &&
        typeof progressVal === 'number' &&
        typeof totalDays === 'number' &&
        typeof remainingDays === 'number'
      "
      v-model:current-rate="currentRate"
      :rate="progressVal"
      :speed="100"
      :stroke-width="50"
      layer-color="#ebedf0"
      :color="progressColor"
    >
      <div class="circle-content" v-if="progressStatus === 'exception'">
        <div class="my-text-h2">已过期</div>
      </div>
      <div class="circle-content" v-else-if="progressStatus === 'notStarted'">
        <div class="my-text-h2">未开始</div>
      </div>
      <div class="circle-content" v-else>
        <div>
          <span class="remaining-days">{{ remainingDays }}/</span>
          <span class="total-days">{{ totalDays }}</span>
        </div>
        <div class="content-lable">剩余天数</div>
      </div>
    </van-circle>
    <van-circle
      v-else
      v-model:current-rate="currentRate"
      :rate="0"
      :speed="150"
      :stroke-width="50"
      layer-color="#ebedf0"
    >
      <div class="my-text-h2">未分享</div>
    </van-circle>
  </div>
</template>

<style lang="scss" scoped>
.van-circle {
  display: flex;
  align-items: center;
  justify-content: center;
}

.circle-content {
  display: flex;
  flex-direction: column;
  align-items: center;

  .remaining-days {
    font-size: 24px;
    // font-weight: bold;
    color: var(--my-color-b3);
  }

  .total-days {
    font-size: 11px;
    color: var(--my-color-b3); // 可以根据需要调整颜色
    // margin-left: 1px; // 可以根据需要调整间距
  }

  .content-lable {
    // margin-top: 10px; // 可以根据需要调整间距
    font-size: 11px;
    color: var(--my-color-b3); // 可以根据需要调整颜色
  }
}
</style>
