<script setup lang="ts">
import { ref } from 'vue'
import { loadAllData } from '@/utils/dataManage'
import { shareConfirmAcceptService } from '@/api/share'

const props = defineProps<{
  e5id: number
}>()

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
const confirmForm = ref({
  e5id: props.e5id,
  message: ''
})

// 提交中状态标记
const isSubmitting = ref(false)

// 接受确认
const submitConfirm = async () => {
  // 去除首尾空格
  confirmForm.value.message = confirmForm.value.message.trim()

  await showConfirmDialog({
    title: '温馨提示',
    message: '您确认要确认分享吗'
  })

  // 设置为提交中状态
  isSubmitting.value = true
  try {
    // 调用接口
    await shareConfirmAcceptService(confirmForm.value)

    // 刷新数据
    await loadAllData()
    showToast('确认成功')
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
      <UserItem :userId="e5id" :usernameLink="false"></UserItem>
      <van-field
        v-model="confirmForm.message"
        placeholder="备注"
        type="textarea"
        rows="2"
        autosize
        maxlength="500"
        show-word-limit
      />
      <van-button
        type="primary"
        block
        round
        @click="submitConfirm"
        :loading="isSubmitting"
      >
        确认接受分享
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
