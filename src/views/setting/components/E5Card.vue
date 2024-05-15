<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useProfileStore } from '@/stores'
import { loadUserData } from '@/utils/dataManage'
import { formatDate } from '@/utils/timeUtils'
import { userUpdateE5infoService } from '@/api/user'
import type E5dateForm from '@/components/E5dateForm.vue'

// 日期字符串
const e5Form = ref({
  subscriptionDate: '',
  expirationDate: ''
})

// 日期选择表单的引用
const e5dateFormRef = ref<InstanceType<typeof E5dateForm>>()

const profileStore = useProfileStore()
// 显示初始化订阅信息，并判断是否合法
const showOldData = () => {
  if (!profileStore.user) return null
  // 获取用户信息
  const subDate = formatDate(profileStore.user.e5_subscription_date)
  const expDate = formatDate(profileStore.user.e5_expiration_date)
  // 数据非法时 设置默认为90天
  if (!subDate || !expDate) return e5dateFormRef.value?.calculateDates(90, 90)
  // 数据有效
  e5Form.value.subscriptionDate = subDate
  e5Form.value.expirationDate = expDate
}
onMounted(() => {
  showOldData()
})

// 判断当前表单是否和原来相同
const isFormUnchanged = computed(() => {
  if (!profileStore.user) return null
  return (
    e5Form.value.subscriptionDate ===
      formatDate(profileStore.user.e5_subscription_date) &&
    e5Form.value.expirationDate ===
      formatDate(profileStore.user.e5_expiration_date)
  )
})

// 提交中状态标记
const isSubmitting = ref(false)
// 提交修改E5订阅信息
const submitE5info = async () => {
  if (isFormUnchanged.value) {
    showToast('表单未修改')
    showOldData()
    return
  }
  // 设置为提交中状态
  isSubmitting.value = true
  try {
    // 调用修改E5订阅信息的接口
    await userUpdateE5infoService(e5Form.value)
    // 重新获取数据
    await loadUserData()
    showOldData()
    showToast('修改成功')
  } finally {
    // 无论提交成功或失败，都要解除提交中状态
    isSubmitting.value = false
  }
}
</script>
<template>
  <div class="card">
    <div class="my-text-h2 setting-title">修改E5订阅信息</div>
    <E5dateForm
      v-model="e5Form"
      ref="e5dateFormRef"
      class="e5date-form"
    ></E5dateForm>
    <div class="button-box">
      <van-button type="default" size="small" block round @click="showOldData">
        还原
      </van-button>
      <van-button
        type="primary"
        size="small"
        block
        round
        @click="submitE5info"
        :loading="isSubmitting"
      >
        保存
      </van-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.card {
  padding: 20px;
  border-bottom: 1px solid #dcdfe6; /* 下边框*/
}

.e5date-form {
  margin-top: 10px;
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
