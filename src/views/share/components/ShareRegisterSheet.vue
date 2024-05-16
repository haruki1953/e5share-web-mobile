<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { shareRegisterService } from '@/api/share'
import { loadAllData, loadProfileData } from '@/utils/dataManage'

// 控制抽屉显示隐藏
const visibleDrawer = ref(false)
const open = () => {
  // 显示抽屉
  visibleDrawer.value = true
  // 使用 nextTick 延迟执行 初始化数据 方法
  nextTick(() => {
    showOldData()
  })
}

// 日期字符串，用于提交
const e5Form = ref({
  subscriptionDate: '',
  expirationDate: ''
})

// 日期选择表单的引用
const e5dateFormRef = ref()

// 显示初始化订阅信息 默认为90天
const showOldData = () => {
  e5dateFormRef.value.calculateDates(90, 89)
}

// 提交中状态标记
const isSubmitting = ref(false)
// 提交修改E5订阅信息
const submitE5info = async () => {
  // 设置为提交中状态
  isSubmitting.value = true
  try {
    // 调用修改E5订阅信息的接口
    await shareRegisterService(e5Form.value)
    // 刷新数据
    await loadProfileData()
    await loadAllData()
    showToast('登记成功')
    // 关闭抽屉
  } finally {
    // 无论提交成功或失败，都要解除提交中状态
    isSubmitting.value = false
  }
}

// 导出open方法
defineExpose({
  open
})
</script>
<template>
  <van-action-sheet v-model:show="visibleDrawer" :closeable="false">
    <div class="sheet-content">
      <E5dateForm v-model="e5Form" ref="e5dateFormRef"></E5dateForm>
      <van-button
        type="primary"
        block
        round
        @click="submitE5info"
        :loading="isSubmitting"
      >
        设置E5订阅信息 | 登记分享
      </van-button>
    </div>
  </van-action-sheet>
</template>

<style lang="scss" scoped>
.sheet-content {
  margin: 10px 20px;
  .van-button {
    margin-top: 20px;
  }
}
</style>
