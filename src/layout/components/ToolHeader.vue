<script setup lang="ts">
// 引用 Preference 组件实例
const preferenceDialogRef = ref()

// 打开偏好设置对话框
const handleOpenPreference = async () => {
  await nextTick()
  preferenceDialogRef.value?.openDialog()
}
</script>

<template>
  <div class="flex items-center justify-between w-full">
    <div class="flex items-center">
      <Collapse class="hover-trigger" />
      <Breadcrumb />
    </div>
    <div class="flex items-center">
      <!-- <LocaleDropdown class="hover-trigger" color="var(--top-header-text-color)" /> -->
      <Icon
        icon="ep:setting"
        class="mx-2 hover-trigger cursor-pointer"
        :size="6"
        @click="handleOpenPreference"
      />
      <UserInfo class="hover-trigger" />
      <Preference ref="preferenceDialogRef" />
    </div>
  </div>
</template>
