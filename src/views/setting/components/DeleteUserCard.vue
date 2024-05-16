<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { removeLogin, loadAllData } from '@/utils/dataManage'
import { userDeleteUserService } from '@/api/user'

// 提交中状态标记
const isSubmitting = ref(false)

// 路由
const router = useRouter()

// 注销用户
const deleteUser = async () => {
  await showConfirmDialog({
    title: '温馨提示',
    message: '您确认要注销用户吗'
  })
  // 设置为提交中状态
  isSubmitting.value = true
  try {
    // 调用接口
    await userDeleteUserService()
    showToast('注销成功')
    // 跳转至首页
    await router.push('/home')
    // 退出登录
    await removeLogin()
    // 重新加载全部数据
    await loadAllData()
  } finally {
    // 无论提交成功或失败，都要解除提交中状态
    isSubmitting.value = false
  }
}
</script>
<template>
  <div class="card">
    <div class="my-text-h1 setting-title">注销用户</div>
    <div class="setting-form">
      <van-notice-bar left-icon="warning-o">
        “注销用户”非“退出登录”！注销用户后不可恢复，谨慎注销
      </van-notice-bar>
    </div>
    <div class="button-box">
      <van-button
        color="#ed6a0c"
        size="small"
        block
        round
        @click="deleteUser"
        :loading="isSubmitting"
      >
        注销用户
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
