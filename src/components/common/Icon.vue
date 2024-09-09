<script setup lang="ts">
import { Icon } from '@iconify/vue'

defineProps({
  name: {
    type: String,
    default: 'home',
  },
  size: {
    type: Number,
    default: 18,
  },
  color: {
    type: String,
    default: 'currentColor',
  },
})
</script>

<template>
  <Icon :icon="name" :size="size" :color="color" />
</template>
