<script lang="ts" setup>
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

const collapse = ref(appStore.collapse)
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
watch(
  () => appStore.collapse,
  newValue => {
    collapse.value = newValue
  },
)
</script>

<template>
  <div>
    <ElMenu
      :collapse="collapse"
      default-active="2"
      class="bg-white border-none"
      @open="handleOpen"
      @close="handleClose"
    >
      <ElSubMenu class="bg-white" index="1">
        <template #title>
          <ElIcon><Location /></ElIcon>
          <span>Navigator One</span>
        </template>
        <ElMenuItemGroup class="bg-white" title="Group One">
          <ElMenuItem class="bg-white" index="1-1">
            item one
          </ElMenuItem>
          <ElMenuItem class="bg-white" index="1-2">
            item two
          </ElMenuItem>
        </ElMenuItemGroup>
        <ElMenuItemGroup class="bg-white" title="Group Two">
          <ElMenuItem class="bg-white" index="1-3">
            item three
          </ElMenuItem>
        </ElMenuItemGroup>
        <ElSubMenu class="bg-white" index="1-4">
          <template #title>
            item four
          </template>
          <ElMenuItem class="bg-white" index="1-4-1">
            item one
          </ElMenuItem>
        </ElSubMenu>
      </ElSubMenu>
      <ElMenuItem class="bg-white" index="2">
        <ElIcon><IconMenu /></ElIcon>
        <span>Navigator Two</span>
      </ElMenuItem>
      <ElMenuItem class="bg-white" index="3" disabled>
        <ElIcon><Document /></ElIcon>
        <span>Navigator Three</span>
      </ElMenuItem>
      <ElMenuItem class="bg-white" index="4">
        <ElIcon><Setting /></ElIcon>
        <span>Navigator Four</span>
      </ElMenuItem>
    </ElMenu>
  </div>
</template>
