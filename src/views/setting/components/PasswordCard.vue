<script setup lang="ts">
import { ref } from 'vue'
import { userRules } from '@/config/rules'
import { userUpdatePasswordService } from '@/api/user'
import type { FieldRule, FormInstance } from 'vant'

// 表单组件
const form = ref<FormInstance>()

const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  rePassword: ''
})

// 校验规则
const rules: Record<'newPassword' | 'rePassword' | 'oldPassword', FieldRule[]> =
  {
    oldPassword: userRules.password,
    newPassword: [
      ...userRules.password,
      {
        // newPassword 与 oldPassword 不能一致
        validator: (value: string) => value !== passwordForm.value.oldPassword,
        message: '新密码 与 旧密码 不能一致',
        trigger: 'onBlur'
      }
    ],
    rePassword: [
      {
        // 判断 value 和 当前 passwordForm 中收集的 newPassword 是否一致
        validator: (value: string) => value === passwordForm.value.newPassword,
        message: '两次输入密码不一致',
        trigger: 'onBlur'
      }
    ]
  }

// 提交中状态标记
const isSubmitting = ref(false)
// 提交修改密码
const submitPassword = async () => {
  // 预校验
  await form.value?.validate()

  // 设置为提交中状态
  isSubmitting.value = true
  try {
    // 调用修改密码的接口
    await userUpdatePasswordService(passwordForm.value)
    showToast('修改成功')
  } finally {
    // 无论提交成功或失败，都要解除提交中状态
    isSubmitting.value = false
    // 重置表单
    resetform()
  }
}

// 重置表单
const resetform = () => {
  passwordForm.value = {
    oldPassword: '',
    newPassword: '',
    rePassword: ''
  }
  form.value?.resetValidation()
}
</script>
<template>
  <div class="card">
    <div class="my-text-h2 setting-title">修改密码</div>
    <van-form ref="form" class="setting-form">
      <div class="field-lable my-text-p3">旧密码</div>
      <van-field
        v-model="passwordForm.oldPassword"
        :rules="rules.oldPassword"
        placeholder="请输入旧密码"
      />
      <div class="field-lable my-text-p3">新密码</div>
      <van-field
        v-model="passwordForm.newPassword"
        :rules="rules.newPassword"
        placeholder="请输入新密码"
      />
      <div class="field-lable my-text-p3">确认密码</div>
      <van-field
        v-model="passwordForm.rePassword"
        :rules="rules.rePassword"
        placeholder="请确认密码"
      />
    </van-form>
    <div class="button-box">
      <van-button type="default" size="small" block round @click="resetform">
        取消
      </van-button>
      <van-button
        type="primary"
        size="small"
        block
        round
        @click="submitPassword"
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
