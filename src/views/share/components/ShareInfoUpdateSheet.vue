<script setup lang="ts">
import { ref, computed } from 'vue'
import { useShareStore } from '@/stores'
import { loadShareData, loadUserData } from '@/utils/dataManage'
import {
  shareUpdateInfoService,
  shareDeleteInfoService,
  shareConfirmSendService,
  shareStopSharingService
} from '@/api/share'
import { shareInfoCantDelStatus, shareInfoStatus } from '@/config'
import StatusTag from './StatusTag.vue'
import { copyText } from '@/utils/copyText'

// 控制对话框显示隐藏
const dialogVisible = ref(false)
const open = (userId: number) => {
  // 重置表单
  shareInfoForm.value.userId = userId
  shareInfoForm.value.note = ''
  shareInfoForm.value.message = ''
  // userId不存在则返回，并打印信息
  if (!isUserIdExists.value) {
    console.warn('User ID does not exist in ShareInfo')
    return
  }
  // 显示数据
  showOldData()
  // 显示抽屉
  dialogVisible.value = true
}

// 导出open方法
defineExpose({
  open
})

// 用于提交的form数据对象
const shareInfoForm = ref<{
  userId: number | null
  note: string
  message: string
}>({
  userId: null,
  note: '',
  message: ''
})

const shareStore = useShareStore()
// 用户id是否存在于分享信息
const isUserIdExists = computed(() => {
  const userId = shareInfoForm.value.userId
  if (!userId) return null
  if (!shareStore.findShareInfoByUserId(userId)) return null
  return userId
})

// 分享信息
const shareInfo = computed(() => {
  if (shareInfoForm.value.userId === null) return null
  return shareStore.findShareInfoByUserId(shareInfoForm.value.userId)
})

// 显示原数据
const showOldData = () => {
  shareInfoForm.value.note = shareInfo.value?.note || ''
}

// 提交中状态标记
const isSubmitting = ref(false)

// 判断备注是否和原来相同
const isNoteUnchanged = computed(() => {
  return shareInfoForm.value.note === shareInfo.value?.note
})

// 修改备注
const submitUpdateNote = async () => {
  if (shareInfoForm.value.userId === null) return null

  // 去除首尾空格
  shareInfoForm.value.note = shareInfoForm.value.note.trim()

  if (isNoteUnchanged.value) {
    showToast('表单未修改')
    showOldData()
    return
  }

  // 设置为提交中状态
  isSubmitting.value = true
  try {
    // 调用接口
    await shareUpdateInfoService({
      ...shareInfoForm.value,
      userId: shareInfoForm.value.userId
    })
    // 刷新数据
    await loadShareData()
    showOldData()
    showToast('修改成功')
  } finally {
    // 无论提交成功或失败，都要解除提交中状态
    isSubmitting.value = false
  }
}

// 删除用户
const submitDelete = async () => {
  if (shareInfoForm.value.userId === null) return null

  await showConfirmDialog({
    title: '温馨提示',
    message: '您确认要删除吗'
  })

  // 设置为提交中状态
  isSubmitting.value = true
  try {
    // 调用接口
    await shareDeleteInfoService({
      ...shareInfoForm.value,
      userId: shareInfoForm.value.userId
    })
    // 刷新数据
    await loadShareData()
    showToast('删除成功')
    // 关闭对话框
    dialogVisible.value = false
  } finally {
    // 无论提交成功或失败，都要解除提交中状态
    isSubmitting.value = false
  }
}

// 是否不能删除
const isCantDel = computed(() => {
  if (!shareInfo.value) return null
  return shareInfoCantDelStatus.includes(shareInfo.value.status)
})

// 分享进度
const shareStep = computed(() => {
  if (!shareInfo.value) return null
  let stepVal = 0
  switch (shareInfo.value.status) {
    case shareInfoStatus.unsent:
      stepVal = 0
      break
    case shareInfoStatus.pending_confirmation:
      stepVal = 1
      break
    case shareInfoStatus.confirmed:
      stepVal = 2
      break
    default:
      break
  }
  return stepVal
})

// 发送确认
const submitSendConfirm = async () => {
  if (shareInfoForm.value.userId === null) return null

  // 去除首尾空格
  shareInfoForm.value.message = shareInfoForm.value.message.trim()

  await showConfirmDialog({
    title: '温馨提示',
    message: '您确认要发送分享确认吗'
  })

  // 设置为提交中状态
  isSubmitting.value = true
  try {
    // 调用接口
    const res = await shareConfirmSendService({
      ...shareInfoForm.value,
      userId: shareInfoForm.value.userId
    })
    // 处理返回信息
    shareStore.addConfirmInfo(shareInfoForm.value.userId, res.data.data.id)
    // 刷新数据
    await loadShareData()
    showOldData()
    showToast('确认信息发送成功')
  } finally {
    // 无论提交成功或失败，都要解除提交中状态
    isSubmitting.value = false
  }
}

// 已发送的确认信息
const confirmInfo = computed(() => {
  if (shareInfoForm.value.userId === null) return null
  return shareStore.findConfirmInfoByUserId(shareInfoForm.value.userId)
})

// 停止分享
const submitStopShareing = async () => {
  if (shareInfoForm.value.userId === null) return null
  // 去除首尾空格
  shareInfoForm.value.message = shareInfoForm.value.message.trim()

  await showConfirmDialog({
    title: '温馨提示',
    message: '您确认要停止对用户的分享吗'
  })

  // 设置为提交中状态
  isSubmitting.value = true
  try {
    // 调用接口
    await shareStopSharingService({
      ...shareInfoForm.value,
      userId: shareInfoForm.value.userId
    })
    // 刷新数据
    await Promise.all([loadUserData(), loadShareData()])
    showOldData()
    showToast('停止分享成功')
  } finally {
    // 无论提交成功或失败，都要解除提交中状态
    isSubmitting.value = false
  }
}
</script>
<template>
  <van-action-sheet v-model:show="dialogVisible" :closeable="false">
    <div class="sheet-content" v-if="shareInfoForm.userId">
      <UserItem :userId="shareInfoForm.userId" :usernameLink="false"></UserItem>
      <van-field
        v-model="shareInfoForm.note"
        placeholder="备注"
        type="textarea"
        rows="1"
        autosize
        maxlength="500"
        show-word-limit
      />
      <div class="button-box">
        <van-button
          type="primary"
          block
          round
          @click="submitUpdateNote"
          :loading="isSubmitting"
        >
          修改备注
        </van-button>
        <van-button
          type="danger"
          block
          round
          @click="submitDelete"
          :loading="isSubmitting"
          :disabled="isCantDel || false"
        >
          删除用户
        </van-button>
      </div>
      <!-- 状态 分割线 -->
      <van-divider content-position="left">
        <span class="my-text-h2">当前状态为：</span>
        <StatusTag :status="shareInfo.status" v-if="shareInfo"></StatusTag>
      </van-divider>
      <!-- 分享已停止：进行提示 -->
      <van-notice-bar
        left-icon="info-o"
        v-if="shareInfo?.status === shareInfoStatus.stoped"
      >
        如果需重新分享，请删除后重新添加
      </van-notice-bar>
      <!-- 分享过程中：分享进度步骤条 -->
      <van-steps :active="shareStep" v-else-if="typeof shareStep === 'number'">
        <van-step>添加分享信息</van-step>
        <van-step>发送分享确认</van-step>
        <van-step>用户接受确认</van-step>
      </van-steps>

      <!-- 发送确认表单 -->
      <div
        class="share-form"
        v-if="shareInfo?.status === shareInfoStatus.unsent"
      >
        <van-notice-bar color="#1989fa" background="#ecf9ff" left-icon="info-o">
          发送分享确认：请与用户取得联系，并告知其E5子账号信息
        </van-notice-bar>
        <van-field
          v-model="shareInfoForm.message"
          placeholder="发送分享确认 | 请输入留言"
          type="textarea"
          rows="1"
          autosize
          maxlength="500"
          show-word-limit
        />
        <van-button
          type="primary"
          block
          round
          @click="submitSendConfirm"
          :loading="isSubmitting"
        >
          发送分享确认
        </van-button>
      </div>

      <!-- 状态为待确认时，显示发送的确认信息 -->
      <div
        v-else-if="
          shareInfo?.status === shareInfoStatus.pending_confirmation &&
          confirmInfo
        "
      >
        <van-notice-bar color="#07c160" background="#e8f7e5" left-icon="info-o">
          已发送确认，联系用户并发送链接，即可帮助其快速定位到您的确认信息
        </van-notice-bar>
        <van-button
          type="success"
          block
          round
          @click="copyText(confirmInfo.link)"
        >
          点击复制链接
        </van-button>
      </div>

      <!-- 停止分享表单 -->
      <div
        class="share-form"
        v-else-if="shareInfo?.status === shareInfoStatus.confirmed"
      >
        <van-notice-bar left-icon="info-o">
          停止分享：请事先联系用户，或填写留言以说明情况。停止分享后才能删除用户
        </van-notice-bar>
        <van-field
          v-model="shareInfoForm.message"
          placeholder="停止分享 | 请输入留言"
          type="textarea"
          rows="1"
          autosize
          maxlength="500"
          show-word-limit
        />
        <van-button
          type="danger"
          block
          round
          @click="submitStopShareing"
          :loading="isSubmitting"
        >
          停止分享
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
  .button-box {
    display: flex;
    justify-content: space-between;
    margin: 10px 0 30px 0;
    .van-button {
      margin: 0 10px;
    }
  }
  .van-button {
    margin-top: 10px;
  }
}
</style>
