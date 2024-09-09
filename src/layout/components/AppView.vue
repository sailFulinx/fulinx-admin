<script setup lang="ts">
import { useTagsViewStore } from '@/stores/tagsView'

const tagsViewStore = useTagsViewStore()

const getCaches = computed((): string[] => {
  return tagsViewStore.getCachedViews
})
</script>

<template>
  <section
    class="app-main w-full"
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
