<script setup lang="ts">
import { useLocale } from '@/hooks/useLocale'
import { usePermissionStore } from '@/stores/permission'
import { pathResolve } from '@/utils/routerHelper'
import { filter, treeToList } from '@/utils/tree'
import { useRouter } from 'vue-router'

import type { RouteMeta } from 'vue-router'

const { t: $t } = useLocale()

const { currentRoute } = useRouter()

const permissionStore = usePermissionStore()

const levelList = ref<AppRouteRecordRaw[]>([])

const filterBreadcrumb = (routes: AppRouteRecordRaw[], parentPath = ''): AppRouteRecordRaw[] => {
  const res: AppRouteRecordRaw[] = []

  for (const route of routes) {
    const meta = route?.meta as RouteMeta
    if (meta.hidden && !meta.canTo) {
      continue
    }

    const data: AppRouteRecordRaw
      = !meta.alwaysShow && route.children?.length === 1
        ? { ...route.children[0], path: pathResolve(route.path, route.children[0].path) }
        : { ...route }

    data.path = pathResolve(parentPath, data.path)

    if (data.children) {
      data.children = filterBreadcrumb(data.children, data.path)
    }
    if (data) {
      res.push(data)
    }
  }
  return res
}

const getBreadcrumb = () => {
  levelList.value = filter<AppRouteRecordRaw>(filterBreadcrumb(permissionStore.routers), node => {
    return node.name === currentRoute.value.name
  })
}

getBreadcrumb()

const breadcrumbList = ref(treeToList<AppRouteRecordRaw[]>(levelList.value))

const renderBreadcrumb = () => {
  breadcrumbList.value = treeToList<AppRouteRecordRaw[]>(unref(levelList.value))
  return breadcrumbList.value.map(v => {
    const disabled = v.redirect === 'noredirect'
    const meta = v.meta as RouteMeta
    meta.title = $t(meta.title as string)
    if (disabled) {
      v.path = ''
    }
    return v
  })
}

renderBreadcrumb()

watch(
  () => currentRoute.value,
  route => {
    if (route.path.startsWith('/redirect/')) {
      return
    }
    getBreadcrumb()
  },
  { immediate: true },
)
</script>

<template>
  <ElBreadcrumb separator="/" class="flex items-center h-full ml-2">
    <TransitionGroup name="fade" appear>
      <ElBreadcrumbItem
        v-for="item in breadcrumbList"
        :key="item.name"
        :to="{ path: item.redirect === 'noredirect' ? '' : item.path }"
      >
        <template v-if="item.meta?.icon">
          <div class="flex">
            <Icon :icon="item.meta.icon" class="mr-2" />
            {{ item.meta?.title }}
          </div>
        </template>
        <template v-else>
          {{ item.meta?.title }}
        </template>
      </ElBreadcrumbItem>
    </TransitionGroup>
  </ElBreadcrumb>
</template>

<style scoped>
/* Add any required styles here */
</style>
