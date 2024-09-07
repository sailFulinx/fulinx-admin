<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import { computed, nextTick, ref } from 'vue'

// 获取 store 中的数据
const appStore = useAppStore()
const breadcrumb = computed(() => appStore.getBreadcrumb)
const hamburger = computed(() => appStore.getHamburger)
const locale = computed(() => appStore.getLocale)

// 引用 Preference 组件实例
const preferenceDialogRef = ref()

// 打开偏好设置对话框
const handleOpenPreference = async () => {
  await nextTick()
  preferenceDialogRef.value?.openDialog()
}
</script>

<template>
  <div
    class="h-[var(--top-tool-height)] relative px-[var(--top-tool-p-x)] flex items-center justify-between dark:bg-[var(--el-bg-color)]"
  >
    <div class="h-full flex items-center">
      <Collapse v-if="hamburger" class="hover-trigger" color="var(--top-header-text-color)" />
      <Breadcrumb v-if="breadcrumb" />
    </div>
    <div class="h-full flex items-center">
      <LocaleDropdown v-if="locale" class="hover-trigger" color="var(--top-header-text-color)" />
      <Icon
        icon="ep:setting"
        class="mx-2 hover-trigger cursor-pointer"
        color="var(--top-header-text-color)"
        :size="18"
        @click="handleOpenPreference"
      />
      <UserInfo class="hover-trigger" />
      <Preference ref="preferenceDialogRef" />
    </div>
  </div>
</template>
