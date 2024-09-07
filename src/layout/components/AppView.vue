<script setup lang="ts">
import { useTagsViewStore } from '@/stores/tagsView'
// import { Footer } from '@/components/Footer'
import { computed } from 'vue'

const tagsViewStore = useTagsViewStore()

const getCaches = computed((): string[] => {
  return tagsViewStore.getCachedViews
})
</script>

<template>
  <section
    class="app-main p-[var(--app-content-padding)] w-[100%] bg-[var(--app-content-bg-color)] dark:bg-[var(--el-bg-color)]"
  >
    <RouterView>
      <template #default="{ Component, route }">
        <KeepAlive :include="getCaches">
          <component :is="Component" :key="route.fullPath" />
        </KeepAlive>
      </template>
    </RouterView>
  </section>
</template>
