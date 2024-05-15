<script setup lang="ts">
import { ref, nextTick, onMounted, type ComponentPublicInstance } from 'vue'
import { useRoute } from 'vue-router'
import ProfileCard from './components/ProfileCard.vue'
import AvatarCard from './components/AvatarCard.vue'
import EmailCard from './components/EmailCard.vue'
import PasswordCard from './components/PasswordCard.vue'
import E5Card from './components/E5Card.vue'
// import ClearNotifCard from './components/ClearNotifCard.vue'
// import DeleteUserCard from './components/DeleteUserCard.vue'

const refE5Card = ref<ComponentPublicInstance>()

// scrollToCard 函数，根据传入卡片的引用进行滚动
const scrollToCard = (cardRef: ComponentPublicInstance) => {
  nextTick(() => {
    if (cardRef) {
      // 如果卡片引用存在，则执行滚动
      cardRef.$el.scrollIntoView({ behavior: 'smooth' })
    }
  })
}

const route = useRoute()
onMounted(() => {
  // 判断参数，滚动至对应卡片
  switch (route.query.setting) {
    case 'e5':
      if (refE5Card.value) scrollToCard(refE5Card.value)
      break
  }
})
</script>
<template>
  <van-nav-bar
    title="设置"
    left-text="返回"
    left-arrow
    @click-left="$router.back()"
    @click-right="$router.push('/home')"
    safe-area-inset-top
    placeholder
    fixed
  >
    <template #right>
      <van-icon class="nav-right" name="wap-home" color="#323233" />
    </template>
  </van-nav-bar>
  <div class="card-container">
    <ProfileCard></ProfileCard>
    <AvatarCard></AvatarCard>
    <EmailCard></EmailCard>
    <PasswordCard></PasswordCard>
    <E5Card></E5Card>
  </div>
</template>

<style lang="scss" scoped>
.van-nav-bar__placeholder {
  :deep() {
    .van-nav-bar {
      border-bottom: 1px solid #ddd; /* 下边框*/
      // border-radius: 0 0 30px 30px;
    }
  }
}
.nav-right {
  width: 25px;
  height: 25px;
  font-size: 25px;
}

.card-container {
  margin-bottom: 50px;
}
</style>
