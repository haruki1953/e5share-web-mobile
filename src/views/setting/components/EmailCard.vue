<script setup lang="ts">
import { ref, computed } from 'vue'
import { userRules } from '@/config/rules'
import { useProfileStore } from '@/stores'
import { loadUserData } from '@/utils/dataManage'
import { userUpdateEmailService } from '@/api/user'
import type { FormInstance } from 'vant'

// 表单组件
const form = ref<FormInstance>()

// 用于提交的form数据对象
const emailForm = ref({
  email: ''
})

// 校验规则
const rules = userRules

const profileStore = useProfileStore()
// 显示原数据
const showOldData = () => {
  if (!profileStore.user) return false
  emailForm.value.email = profileStore.user.email
}
showOldData()

// 判断当前表单是否和原来相同
const isFormUnchanged = computed(() => {
  if (!profileStore.user) return false
  return emailForm.value.email === profileStore.user.email
})

// 提交中状态标记
const isSubmitting = ref(false)
// 提交修改邮箱
const submitEmail = async () => {
  // 设置为提交中状态
  isSubmitting.value = true
  try {
    // 预校验
    await form.value?.validate()

    if (isFormUnchanged.value) {
      showToast('表单未修改')
      showOldData()
      return
    }
    // 调用修改邮箱的接口
    await userUpdateEmailService(emailForm.value)
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
    <div class="my-text-h2 setting-title">修改邮箱</div>
    <van-form ref="form" class="setting-form">
      <div class="field-lable my-text-p3">邮箱</div>
      <van-field
        v-model="emailForm.email"
        :rules="rules.email"
        placeholder="请输入邮箱"
        show-word-limit
      />
    </van-form>
    <div class="button-box">
      <van-button type="default" size="small" block round @click="showOldData">
        还原
      </van-button>
      <van-button
        type="primary"
        size="small"
        block
        round
        @click="submitEmail"
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

.setting-form {
  .van-notice-bar {
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
