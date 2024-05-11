<script setup lang="ts">
import { ref } from 'vue'
import { loadShareData } from '@/utils/dataManage'
import { shareAddInfoService } from '@/api/share'

const props = defineProps<{
  userId: number
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
const addInfoForm = ref({
  userId: props.userId,
  note: ''
})

// 提交中状态标记
const isSubmitting = ref(false)
// 提交添加分享信息
const submitAddInfo = async () => {
  // 去除首尾空格
  addInfoForm.value.note = addInfoForm.value.note.trim()

  // 设置为提交中状态
  isSubmitting.value = true
  try {
    // 调用接口
    await shareAddInfoService(addInfoForm.value)
    // 刷新数据
    await loadShareData()
    showToast('添加成功')
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
      <UserItem :userId="userId" :usernameLink="false"></UserItem>
      <van-field
        v-model="addInfoForm.note"
        placeholder="备注"
        type="textarea"
        rows="2"
        autosize
        maxlength="500"
        show-word-limit
      />
      <van-button
        type="success"
        block
        round
        @click="submitAddInfo"
        :loading="isSubmitting"
      >
        添加至分享信息
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
