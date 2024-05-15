<script setup lang="ts">
import { ref } from 'vue'
import { userUpdateAvatarService } from '@/api/user'
import { loadUserData } from '@/utils/dataManage'
import { avatarRule } from '@/config/rules'
import type { UploaderProps } from 'vant'

const avatarObj = ref<File>() // 图片对象用于提交
const avatarUrl = ref('') // 用于预览

// 图片选择
const onSelectFile: UploaderProps['afterRead'] = (uploadFile) => {
  if (Array.isArray(uploadFile) || !uploadFile.file) return null

  const { allowedTypes, typeError, maxSize, sizeError } = avatarRule
  // 检查文件类型是否允许
  if (!allowedTypes.includes(uploadFile.file?.type)) {
    showToast(typeError)
    return
  }
  // 检查文件大小是否超过限制
  if (uploadFile.file?.size > maxSize) {
    showToast(sizeError)
    return
  }

  // 创建本地预览的地址
  avatarUrl.value = URL.createObjectURL(uploadFile.file)
  // 将图片对象存入 avatarObj 将来用于提交
  avatarObj.value = uploadFile.file
}

// 取消
const clearAvatar = () => {
  avatarObj.value = undefined
  avatarUrl.value = ''
}

// 提交中状态标记
const isSubmitting = ref(false)
// 图片上传
const submitAvatar = async () => {
  if (!avatarObj.value) return null
  // 设置为提交中状态
  isSubmitting.value = true
  try {
    // 注意：当前接口，需要的是 formData 对象
    // 将普通对象 => 转换成 => formData对象
    const fd = new FormData()
    fd.append('avatar', avatarObj.value)
    // 调用接口
    await userUpdateAvatarService(fd)
    // 清除
    clearAvatar()
    // 重新获取数据
    await loadUserData()
    showToast('修改成功')
  } finally {
    // 无论提交成功或失败，都要解除提交中状态
    isSubmitting.value = false
  }
}
</script>
<template>
  <div class="card">
    <div class="my-text-h2 setting-title">修改头像</div>
    <div class="avatar-uploader">
      <van-uploader :after-read="onSelectFile">
        <div
          v-if="avatarUrl"
          :style="{ backgroundImage: `url(${avatarUrl})` }"
          class="avatar"
        ></div>
        <van-icon name="plus" v-else class="avatar-uploader-icon" />
      </van-uploader>
    </div>
    <div class="button-box" v-if="avatarUrl">
      <van-button type="default" size="small" block round @click="clearAvatar">
        取消
      </van-button>
      <van-button
        type="primary"
        size="small"
        block
        round
        @click="submitAvatar"
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

.avatar-uploader {
  display: flex;
  justify-content: center;
  // margin-top: 10px;
  .van-uploader {
    border: 1px dashed #dcdfe6;
    border-radius: 128px;
    overflow: hidden;
    transition: 0.1s;
  }
  .van-uploader:active {
    border-color: #409eff;
  }
  .avatar {
    width: 256px;
    height: 256px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 256px;
    height: 256px;
    text-align: center;
    line-height: 256px;
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
