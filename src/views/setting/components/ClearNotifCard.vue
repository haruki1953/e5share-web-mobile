<script setup lang="ts">
import { ref } from 'vue'
import { loadProfileData } from '@/utils/dataManage'
import { userClearNotifService } from '@/api/user'

// 提交中状态标记
const isSubmitting = ref(false)
// 清空通知
const clearNotif = async () => {
  await showConfirmDialog({
    title: '温馨提示',
    message: '您确认要清空通知吗'
  })
  // 设置为提交中状态
  isSubmitting.value = true
  try {
    // 调用接口
    await userClearNotifService()
    // 重新获取数据
    await loadProfileData()
    showToast('清空通知成功')
  } finally {
    // 无论提交成功或失败，都要解除提交中状态
    isSubmitting.value = false
  }
}
</script>
<template>
  <div class="card">
    <div class="my-text-h1 setting-title">清空通知</div>
    <div class="setting-form">
      <van-notice-bar color="#909090" background="#f0f0f0" left-icon="info-o">
        通知过多时，可在此清空通知
      </van-notice-bar>
    </div>
    <div class="button-box">
      <van-button
        color="#909090"
        size="small"
        block
        round
        @click="clearNotif"
        :loading="isSubmitting"
      >
        清空通知
      </van-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.card {
  padding: 20px;
  border-bottom: 1px solid #dcdfe6; /* 下边框*/
}
.setting-form {
  .van-notice-bar {
    margin-top: 10px;
    border-radius: 20px;
  }
  .field-lable {
    margin: 10px 0 2px 10px;
  }
  .van-field {
    border-radius: 20px;
    background-color: #f5f5f5;
    :deep() {
      .van-field__control {
        color: var(--my-color-b2);
      }
    }
  }
}
.button-box {
  margin-top: 15px;
  display: flex;
  justify-content: space-between;
  .van-button {
    width: 150px;
  }
}
</style>
