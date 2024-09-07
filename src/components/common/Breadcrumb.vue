<script lang="ts">
import { useAppStore } from '@/stores/app'
import { usePermissionStore } from '@/stores/permission'
import { pathResolve } from '@/utils/routerHelper'
import { filter, treeToList } from '@/utils/tree'
import { useRouter } from 'vue-router'

import type { RouteMeta } from 'vue-router'

const { currentRoute } = useRouter()
const appStore = useAppStore()
const permissionStore = usePermissionStore()

const breadcrumbIcon = appStore.getBreadcrumbIcon

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

const menuRouters = computed(() => {
  const routers = permissionStore.getRouters
  return filterBreadcrumb(routers)
})

const getBreadcrumb = () => {
  levelList.value = filter<AppRouteRecordRaw>(menuRouters.value, node => {
    return node.name === currentRoute.value.name
  })
}

const breadcrumbList = ref(treeToList<AppRouteRecordRaw[]>(levelList.value))

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

onMounted(() => {
  getBreadcrumb()
})
</script>

<template>
  <ElBreadcrumb separator="/" class="flex items-center h-full ml-[10px]">
    <TransitionGroup name="fade" appear>
      <ElBreadcrumbItem
        v-for="item in breadcrumbList"
        :key="item.name"
        :to="{ path: item.redirect === 'noredirect' ? '' : item.path }"
      >
        <template v-if="item.meta?.icon && breadcrumbIcon">
          <Icon :icon="item.meta.icon" class="mr-[5px]" />
          {{ t(item.meta?.title) }}
        </template>
        <template v-else>
          {{ t(item.meta?.title) }}
        </template>
      </ElBreadcrumbItem>
    </TransitionGroup>
  </ElBreadcrumb>
</template>

<style scoped>
/* Add any required styles here */
</style>
