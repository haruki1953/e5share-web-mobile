<script setup lang="ts">
import { ref, computed } from 'vue'
import { shareApplicationService } from '@/api/share'
import { useShareStore } from '@/stores'
import { copyText } from '@/utils/copyText'

const props = defineProps<{
  e5id: number
}>()

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
const applyForm = ref({
  e5id: props.e5id,
  message: ''
})

// 提交中状态标记
const isSubmitting = ref(false)

const shareStore = useShareStore()
// 提交分享申请
const submitApply = async () => {
  // 去除首尾空格
  applyForm.value.message = applyForm.value.message.trim()

  await showConfirmDialog({
    title: '温馨提示',
    message: '您确认要发送申请吗'
  })

  // 设置为提交中状态
  isSubmitting.value = true
  try {
    // 调用接口
    const res = await shareApplicationService(applyForm.value)
    // 处理返回的数据
    shareStore.addApplyInfo(applyForm.value.e5id, res.data.data.id)

    showToast('申请发送成功')
  } finally {
    // 无论提交成功或失败，都要解除提交中状态
    isSubmitting.value = false
  }
}

// 已发送的申请信息
const applyInfo = computed(() => {
  return shareStore.findApplyInfoByUserId(props.e5id)
})
</script>
<template>
  <van-action-sheet v-model:show="visibleDrawer" :closeable="false">
    <div class="sheet-content">
      <div v-if="applyInfo">
        <van-notice-bar color="#07c160" background="#e8f7e5" left-icon="info-o">
          已发送申请，联系E5帐号主并发送链接，即可帮助其快速定位到您的申请信息
        </van-notice-bar>
        <van-button
          type="success"
          block
          round
          @click="copyText(applyInfo.link)"
        >
          点击复制链接
        </van-button>
      </div>
      <div v-else>
        <van-notice-bar color="#1989fa" background="#ecf9ff" left-icon="info-o">
          请在发送申请后，根据联系方式与E5账号主取得联系。
        </van-notice-bar>
        <van-field
          v-model="applyForm.message"
          placeholder="请输入留言"
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
          @click="submitApply"
          :loading="isSubmitting"
        >
          发送申请
        </van-button>
      </div>
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
