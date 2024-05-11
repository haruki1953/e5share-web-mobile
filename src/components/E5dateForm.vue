<script setup lang="ts">
import { ref, computed } from 'vue'
import { formatDate } from '@/utils/timeUtils'
import type { E5Date } from '@/types/share'

const props = defineProps<{
  modelValue: E5Date
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: E5Date): void
}>()

// 是否为直接选择日期
const isSelectedDate = ref(false)

// 获取 开始日期 结束日期
const startDate = computed(() => new Date(props.modelValue.subscriptionDate))
const endDate = computed(() => new Date(props.modelValue.expirationDate))

// 设置日期
const setDate = (startDate: string | Date, endDate: string | Date) => {
  const subscriptionDate = formatDate(startDate)
  const expirationDate = formatDate(endDate)
  if (!subscriptionDate || !expirationDate) return false
  emit('update:modelValue', {
    subscriptionDate,
    expirationDate
  })
}

// 日期四舍五入
const dataRound = (date: Date): Date => {
  // 舍入到前一天的起始时间
  const previousDay = new Date(date)
  previousDay.setHours(0, 0, 0, 0)

  // 舍入到后一天的起始时间
  const nextDay = new Date(date)
  nextDay.setDate(nextDay.getDate() + 1)
  nextDay.setHours(0, 0, 0, 0)

  // 计算时间差
  const diffPrevious = Math.abs(date.getTime() - previousDay.getTime())
  const diffNext = Math.abs(date.getTime() - nextDay.getTime())

  // 选择时间差较小的日期
  if (diffPrevious < diffNext) {
    return previousDay
  } else {
    return nextDay
  }
}

// 根据总天数和剩余天数计算日期
const calculateDates = (totalDays: number, remainingDays: number) => {
  const now = new Date()
  const newStartDate = new Date()
  newStartDate.setDate(now.getDate() - (totalDays - remainingDays))
  const newEndDate = new Date()
  newEndDate.setDate(now.getDate() + remainingDays)

  setDate(dataRound(newStartDate), dataRound(newEndDate))
}
// 总天数
const totalDays = computed({
  get: () => {
    const days = Math.round(
      (endDate.value.getTime() - startDate.value.getTime()) /
        (1000 * 60 * 60 * 24)
    )
    return days >= 1 ? days : 1
  },
  set: (val) => {
    // 如果总天数小于剩余天数，则剩余天数为总天数
    if (val < remainingDays.value) {
      return calculateDates(val, val)
    }
    calculateDates(val, remainingDays.value)
  }
})
// 剩余天数
const remainingDays = computed({
  get: () => {
    const days = Math.round(
      (endDate.value.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    )
    return days >= 0 ? days : 0
  },
  set: (val) => {
    calculateDates(totalDays.value, val)
  }
})

const showPopup = ref(false)
const startDatePicker = ref<string[]>()
const endDatePicker = ref<string[]>()

const openPopup = () => {
  // 初始化选择器数据
  startDatePicker.value = dateObj2Array(startDate.value)
  endDatePicker.value = dateObj2Array(endDate.value)
  showPopup.value = true
}

const onConfirm = () => {
  if (startDatePicker.value && endDatePicker.value) {
    const newStartDate = dateArray2Obj(startDatePicker.value)
    let newEndDate = dateArray2Obj(endDatePicker.value)

    // 如果 endDate 小于等于 startDate，则将 endDate 设置为 startDate 的后一天
    if (newEndDate <= newStartDate) {
      newEndDate = new Date(newStartDate)
      newEndDate.setDate(newStartDate.getDate() + 1)
      showToast('结束日期需晚于开始日期')
    }

    // 设置日期数据
    setDate(newStartDate, newEndDate)
  }
  showPopup.value = false
}

const onCancel = () => {
  showPopup.value = false
}

const dateObj2Array = (date: Date) => {
  // 使用 Date 对象的 getFullYear、getMonth 和 getDate 方法获取年、月和日
  let year = date.getFullYear().toString() // 年份转为字符串
  let month = (date.getMonth() + 1).toString().padStart(2, '0') // 月份需要加 1，并且补齐两位数
  let day = date.getDate().toString().padStart(2, '0') // 日补齐两位数
  // 将年、月、日组合成数组
  return [year, month, day]
}
const dateArray2Obj = (dateArray: string[]) => {
  // 使用数组中的年、月、日创建一个新的 Date 对象
  return new Date(`${dateArray[0]}-${dateArray[1]}-${dateArray[2]}`)
}

defineExpose({
  calculateDates,
  totalDays,
  remainingDays
})
</script>
<template>
  <div class="form-box">
    <div v-if="isSelectedDate" class="picker-box">
      <div class="date-box">
        <div class="my-text-h2">E5订阅开始日</div>
        <div class="my-text-p1">{{ formatDate(startDate) }}</div>
      </div>
      <van-button round @click="openPopup"> 选择日期 </van-button>
      <div class="date-box">
        <div class="my-text-h2">E5订阅结束日</div>
        <div class="my-text-p1">{{ formatDate(endDate) }}</div>
      </div>
    </div>
    <div v-else class="num-box">
      <div class="day-row">
        <div class="my-text-h2">总天数</div>
        <div class="slider-stepper">
          <van-slider v-model="totalDays" :min="1" :max="365" />
          <van-stepper v-model="totalDays" integer :min="1" :max="365" />
        </div>
      </div>
      <div class="day-row">
        <div class="my-text-h2">剩余天数</div>
        <div class="slider-stepper">
          <van-slider v-model="remainingDays" :min="0" :max="totalDays" />
          <van-stepper
            v-model="remainingDays"
            integer
            :min="0"
            :max="totalDays"
            :auto-fixed="false"
          />
        </div>
      </div>
    </div>
    <div class="button-box">
      <van-checkbox v-model="isSelectedDate"> 直接选择日期 </van-checkbox>
      <div>
        <slot name="buttons"></slot>
      </div>
    </div>
  </div>
  <van-popup v-model:show="showPopup" position="bottom">
    <van-picker-group
      title="E5订阅信息"
      :tabs="['开始日期', '结束日期']"
      @confirm="onConfirm"
      @cancel="onCancel"
      v-if="startDatePicker && endDatePicker"
    >
      <van-date-picker v-model="startDatePicker" />
      <van-date-picker v-model="endDatePicker" />
    </van-picker-group>
  </van-popup>
</template>

<style lang="scss" scoped>
.picker-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px;
}
.num-box {
  margin: 20px 10px;
  .day-row {
    margin: 10px 0;
    .slider-stepper {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 5px;
      .van-slider {
        width: 220px;
      }
    }
  }
}
.button-box {
  margin: 10px;
}
</style>
