<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import { computed, unref } from 'vue'

defineProps({
  color: {
    type: String,
    default: '',
  },
})

const appStore = useAppStore()

const collapse = computed(() => appStore.getCollapse)

const toggleCollapse = () => {
  const collapsed = unref(collapse)
  appStore.setCollapse(!collapsed)
}
</script>

<template>
  <div>
    <Icon
      :size="18"
      :icon="collapse ? 'ant-design:menu-unfold-outlined' : 'ant-design:menu-fold-outlined'"
      class="cursor-pointer"
      @click="toggleCollapse"
    />
  </div>
</template>
