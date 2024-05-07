<script setup lang="ts">
const props = defineProps({
  foo: { type: String, required: true },
  bar: Number
})

props.foo // string
props.bar // number | undefined
</script>
<template>
  <div>测试</div>
</template>

<style lang="scss" scoped></style>
