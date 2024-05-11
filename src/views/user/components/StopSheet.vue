<script setup lang="ts">
import { ref } from 'vue'
import { loadAllData } from '@/utils/dataManage'
import { shareStopReceivingService } from '@/api/share'

const props = defineProps<{
  e5id: number
}>()

// 控制对话框显示隐藏
const dialogVisible = ref(false)
const open = () => {
  // 显示抽屉
  dialogVisible.value = true
}
// 导出open方法
defineExpose({
  open
})

// 用于提交的form数据对象
const stopForm = ref({
  e5id: props.e5id,
  message: ''
})

// 提交中状态标记
const isSubmitting = ref(false)
// 提交停止接受分享
const submitStop = async () => {
  // 去除首尾空格
  stopForm.value.message = stopForm.value.message.trim()

  await showConfirmDialog({
    title: '温馨提示',
    message: '您确认要停止接受分享吗'
  })

  // 设置为提交中状态
  isSubmitting.value = true
  try {
    // 调用接口
    await shareStopReceivingService(stopForm.value)
    // 刷新数据
    await loadAllData()
    showToast('停止接受分享成功')
    // 关闭对话框
    dialogVisible.value = false
  } finally {
    // 无论提交成功或失败，都要解除提交中状态
    isSubmitting.value = false
  }
}
</script>
<template>
  <van-action-sheet v-model:show="dialogVisible" :closeable="false">
    <div class="sheet-content">
      <van-notice-bar left-icon="info-o">
        请事先联系E5账号主，或填写留言以说明情况
      </van-notice-bar>
      <van-field
        v-model="stopForm.message"
        placeholder="请输入留言"
        type="textarea"
        rows="2"
        autosize
        maxlength="500"
        show-word-limit
      />
      <van-button
        type="danger"
        block
        round
        @click="submitStop"
        :loading="isSubmitting"
      >
        停止接受分享
      </van-button>
    </div>
  </van-action-sheet>
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
