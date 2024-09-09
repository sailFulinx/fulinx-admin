<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import AppView from './components/AppView.vue'
import ToolHeader from './components/ToolHeader.vue'

const appStore = useAppStore()
</script>

<template>
  <div class="flex h-screen">
    <!-- 左侧内容 -->
    <div class="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-10">
      <div class="flex items-center py-3 h-16  px-4 border-b border-gray-200">
        <!-- Logo 组件 -->
        <Logo />
        <div class="font-bold ml-2">
          {{ appStore.title }}
        </div>
      </div>
      <div class="mt-5 flex-1 overflow-y-auto">
        <!-- Menu 组件 -->
        <Menu />
      </div>
    </div>

    <!-- 右侧内容 -->
    <div class="flex-1 ml-64">
      <div class="sticky top-0 z-20 flex-shrink-0 flex h-16 bg-white border-b border-gray-200">
        <div class="flex-1 px-4 flex justify-between">
          <div class="flex-1 flex">
            <!-- ToolHeader 组件 -->
            <ToolHeader />
          </div>
        </div>
      </div>

      <main>
        <!-- AppView 组件 -->
        <AppView />
      </main>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
