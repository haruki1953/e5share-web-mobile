<script setup lang="ts">
import { ref } from 'vue'
import { loadAllData, loadProfileData } from '@/utils/dataManage'
import { shareCancelService } from '@/api/share'
import { useShareStore } from '@/stores'

// 控制抽屉显示隐藏
const visibleDrawer = ref(false)
const open = () => {
  // 显示抽屉
  visibleDrawer.value = true
}

// 导出open方法
defineExpose({
  open
})

// 用于提交的form数据对象
const cancelForm = ref({
  message: ''
})

// 提交中状态标记
const isSubmitting = ref(false)

const shareStore = useShareStore()
// 提交注销分享
const submitCancel = async () => {
  // 去除首尾空格
  cancelForm.value.message = cancelForm.value.message.trim()

  await showConfirmDialog({
    title: '温馨提示',
    message: '您确认要注销分享吗'
  })

  // 设置为提交中状态
  isSubmitting.value = true
  try {
    // 调用接口
    await shareCancelService(cancelForm.value)
    // 清除本地分享信息
    shareStore.removeInfoOnCancelShare()
    // 刷新数据
    await loadProfileData()
    await loadAllData()
    showToast('注销分享成功')
  } finally {
    // 无论提交成功或失败，都要解除提交中状态
    isSubmitting.value = false
  }
}
</script>
<template>
  <van-action-sheet v-model:show="visibleDrawer" :closeable="false">
    <div class="sheet-content">
      <van-notice-bar left-icon="info-o">
        注销分享将取消对所有用户的分享，请填写留言以说明情况
      </van-notice-bar>
      <van-field
        v-model="cancelForm.message"
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
        @click="submitCancel"
        :loading="isSubmitting"
      >
        注销分享
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
