<script setup lang="ts">
import { ref } from 'vue'
import type { Icon } from 'vant'
import type TestBox from '@/components/TestBox.vue'

const refVanIcon = ref<InstanceType<typeof Icon> | null>(null)
const refTestBox = ref<InstanceType<typeof TestBox> | null>(null)

showFailToast('服务异常')
showNotify('test')
</script>

<template>
  <div>
    <router-view></router-view>
    <van-button type="warning"></van-button>
    <van-icon name="chat-o" /><van-icon name="chat-o" />
    <van-image
      width="100"
      height="100"
      src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"
    />
    <TestBox foo="a"></TestBox>
  </div>
</template>

<style lang="scss" scoped></style>
