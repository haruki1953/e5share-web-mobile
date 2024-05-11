<script setup lang="ts">
import { shareInfoStatus } from '@/config'
defineProps<{
  status: string
}>()
</script>
<template>
  <van-tag type="default" v-if="status === shareInfoStatus.unsent">
    未发送
  </van-tag>
  <van-tag type="primary" v-if="status === 'sent'"> 已发送 </van-tag>
  <van-tag
    type="warning"
    v-if="status === shareInfoStatus.pending_confirmation"
  >
    待确认
  </van-tag>
  <van-tag type="success" v-if="status === shareInfoStatus.confirmed">
    已确认
  </van-tag>
  <van-tag type="danger" v-if="status === shareInfoStatus.stoped">
    已停止
  </van-tag>
</template>

<style lang="scss" scoped></style>
