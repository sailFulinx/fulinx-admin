<script setup name="EBtn" inheritAttrs="false" lang="ts">
const emit = defineEmits(['click'])
const attrs = useAttrs()
const size = attrs.size || 'small'
const onClick = event => {
  emit('click', event)
}
</script>

<template>
  <ElButton v-bind="attrs" :size="size" @click="onClick">
    <slot />
  </ElButton>
</template>
