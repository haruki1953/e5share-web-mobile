<script setup lang="ts">
showFailToast('服务异常')
</script>

<template>
  <div>
    <!-- <router-view></router-view> -->
    <van-button color="linear-gradient(to right, #6ab7ff, #b8e994)">
      <van-icon name="chat-o" />
    </van-button>

    我是app
  </div>
</template>

<style lang="scss" scoped>
.van-button {
  width: 300px;
}
</style>
