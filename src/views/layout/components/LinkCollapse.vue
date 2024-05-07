<script setup lang="ts">
import { ref } from 'vue'
import { contactInfo, friendshipLinks } from '@/config'

const activeCollapseName = ref('')
</script>
<template>
  <van-collapse v-model="activeCollapseName" accordion>
    <van-collapse-item title="联系方式" name="1" class="my-text-h1">
      <van-cell
        v-for="linkKey in Object.keys(contactInfo)"
        :key="linkKey"
        :title="contactInfo[linkKey].name"
        :url="contactInfo[linkKey].link"
        :label="contactInfo[linkKey].description"
        clickable
        class="link-cell"
      >
        <template #icon>
          <van-icon
            v-if="contactInfo[linkKey].fontawesomeClass"
            class="link-icon"
            :class-prefix="contactInfo[linkKey].fontawesomeClass"
          />
          <van-icon
            v-else-if="contactInfo[linkKey].logoUrl"
            class="link-icon-img"
            :name="contactInfo[linkKey].logoUrl"
          />
        </template>
      </van-cell>
    </van-collapse-item>
    <van-collapse-item title="友情链接" name="2" class="my-text-h1">
      <van-cell
        v-for="linkKey in Object.keys(friendshipLinks)"
        :key="linkKey"
        :title="friendshipLinks[linkKey].name"
        :url="friendshipLinks[linkKey].link"
        :label="friendshipLinks[linkKey].description"
        clickable
        class="link-cell"
      >
        <template #icon>
          <van-icon
            v-if="friendshipLinks[linkKey].fontawesomeClass"
            class="link-icon"
            :class-prefix="friendshipLinks[linkKey].fontawesomeClass"
          />
          <van-icon
            v-else-if="friendshipLinks[linkKey].logoUrl"
            class="link-icon-img"
            :name="friendshipLinks[linkKey].logoUrl"
          />
        </template>
      </van-cell>
    </van-collapse-item>
  </van-collapse>
</template>

<style lang="scss" scoped>
.van-collapse-item {
  :deep() {
    .van-cell {
      border-radius: 20px;
      .van-cell__title {
        // @extend .my-text-h1;
        margin-left: 10px;
        font-size: 16px;
        font-weight: bold;
      }
    }
    .van-collapse-item__content {
      padding: 0;
    }
  }
  .link-cell {
    .link-icon {
      display: flex;
      font-size: 25px;
      align-items: center;
      justify-content: center;
      width: 30px;
    }
    .link-icon-img {
      display: flex;
      font-size: 30px;
      align-items: center;
      justify-content: center;
      width: 30px;
    }
    :deep() {
      .van-cell__label {
        margin-top: 0;
      }
    }
  }
}
</style>
