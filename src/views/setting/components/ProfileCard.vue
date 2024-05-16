<script setup lang="ts">
import { ref, computed } from 'vue'
import { useProfileStore } from '@/stores'
import { userUpdateProfileService } from '@/api/user'
import { loadUserData } from '@/utils/dataManage'
import { userRules } from '@/config/rules'
import type { FormInstance } from 'vant'

// 表单组件
const form = ref<FormInstance>()

// 用于提交的form数据对象
const profileForm = ref({
  nickname: '',
  contactInfo: '',
  bio: ''
})

// 校验规则
const rules = userRules

const profileStore = useProfileStore()
// 显示原数据
const showOldData = () => {
  if (!profileStore.user) return null
  profileForm.value.nickname = profileStore.user.nickname
  profileForm.value.contactInfo = profileStore.user.contact_info
  profileForm.value.bio = profileStore.user.bio
}
showOldData()

// 判断当前表单是否和原来相同
const isFormUnchanged = computed(() => {
  if (!profileStore.user) return null
  return (
    profileForm.value.nickname === profileStore.user.nickname &&
    profileForm.value.contactInfo === profileStore.user.contact_info &&
    profileForm.value.bio === profileStore.user.bio
  )
})

// 提交中状态标记
const isSubmitting = ref(false)
// 提交修改用户信息
const submitProfile = async () => {
  // 去除首尾空格
  profileForm.value.nickname = profileForm.value.nickname.trim()
  profileForm.value.contactInfo = profileForm.value.contactInfo.trim()
  profileForm.value.bio = profileForm.value.bio.trim()
  // 预校验
  await form.value?.validate()

  if (isFormUnchanged.value) {
    showToast('表单未修改')
    showOldData()
    return
  }

  // 设置为提交中状态
  isSubmitting.value = true
  try {
    // 调用修改用户信息的接口
    await userUpdateProfileService(profileForm.value)
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
    <div class="my-text-h1 setting-title">修改基本信息</div>
    <van-form ref="form" class="setting-form">
      <div class="field-lable my-text-p3">昵称</div>
      <van-field
        v-model="profileForm.nickname"
        :rules="rules.nickname"
        placeholder="请输入昵称"
        maxlength="32"
        show-word-limit
      />
      <div class="field-lable my-text-p3">简介</div>
      <van-field
        v-model="profileForm.bio"
        :rules="rules.bio"
        placeholder="请输入简介"
        type="textarea"
        rows="2"
        autosize
        maxlength="500"
        show-word-limit
      />
      <div class="field-lable my-text-p3">联系方式</div>
      <van-field
        v-model="profileForm.contactInfo"
        :rules="rules.contactInfo"
        placeholder="请输入联系方式"
        type="textarea"
        rows="2"
        autosize
        maxlength="500"
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
        @click="submitProfile"
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
