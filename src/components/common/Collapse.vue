<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import { ref, watch } from 'vue'

const appStore = useAppStore()

// 使用一个响应式引用来跟踪 collapse 状态
const collapse = ref(appStore.collapse)

// 监听 appStore.collapse 的变化并更新 collapse
watch(
  () => appStore.collapse,
  newValue => {
    collapse.value = newValue
  },
)

const toggleCollapse = () => {
  // 切换 collapse 状态
  appStore.setCollapse(!collapse.value)
}
</script>

<template>
  <div>
    <Icon
      :size="6"
      :icon="collapse ? 'ant-design:menu-unfold-outlined' : 'ant-design:menu-fold-outlined'"
      class="cursor-pointer"
      @click="toggleCollapse"
    />
  </div>
</template>
