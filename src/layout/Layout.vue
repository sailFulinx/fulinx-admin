<script setup lang="ts">
import { ElScrollbar } from 'element-plus'

import AppView from './components/AppView.vue'
import ToolHeader from './components/ToolHeader.vue'
</script>

<template>
  <section class="w-[100%] h-[100%] relative">
    <div>
      <Logo />
    </div>
    <div>
      <ElScrollbar>
        <div>
          <ToolHeader
            class="border-bottom-1 border-solid border-[var(--top-tool-border-color)] bg-[var(--top-header-bg-color)] dark:border-[var(--el-border-color)]"
          />

          <TagsView
            class="border-bottom-1 border-top-1 border-solid border-[var(--tags-view-border-color)] dark:border-[var(--el-border-color)]"
          />
        </div>

        <AppView />
      </ElScrollbar>
    </div>
  </section>
</template>

<style lang="scss" scoped></style>
