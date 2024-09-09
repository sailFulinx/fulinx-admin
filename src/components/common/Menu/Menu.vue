<script lang="ts" setup>
import { useLocale } from '@/hooks/useLocale'
import { useAppStore } from '@/stores/app'
import { usePermissionStore } from '@/stores/permission'
import { isUrl } from '@/utils/is'
import { pathResolve } from '@/utils/routerHelper'
import type { RouteMeta } from 'vue-router'

const { t: $t } = useLocale()

type OnlyOneChildType = AppRouteRecordRaw & { noShowingChildren?: boolean }

interface HasOneShowingChild {
  oneShowingChild?: boolean
  onlyOneChild?: OnlyOneChildType
}

/**
 * 判断是否只有一个child
 */
const hasOneShowingChild = (children: AppRouteRecordRaw[] = [], parent: AppRouteRecordRaw): HasOneShowingChild => {
  const onlyOneChild = ref<OnlyOneChildType>()

  const showingChildren = children.filter(v => {
    const meta = (v.meta ?? {}) as RouteMeta
    if (meta.hidden) {
      return false
    } else {
      // Temp set(will be used if only has one showing child)
      onlyOneChild.value = v
      return true
    }
  })

  // When there is only one child router, the child router is displayed by default
  if (showingChildren.length === 1) {
    return {
      oneShowingChild: true,
      onlyOneChild: unref(onlyOneChild),
    }
  }

  // Show parent if there are no child router to display
  if (!showingChildren.length) {
    onlyOneChild.value = { ...parent, path: '', noShowingChildren: true }
    return {
      oneShowingChild: true,
      onlyOneChild: unref(onlyOneChild),
    }
  }

  return {
    oneShowingChild: false,
    onlyOneChild: unref(onlyOneChild),
  }
}

const renderMenuItem = (routers: AppRouteRecordRaw[], parentPath = '/') => {
  if (!routers) {
    return
  }

  return routers
    .filter(item => {
      const meta = (item.meta ?? {}) as RouteMeta
      return !meta.hidden // 过滤掉不符合条件的路由
    })
    .map(item => {
      const meta = (item.meta ?? {}) as RouteMeta
      const fullPath = isUrl(item.path) ? item.path : pathResolve(parentPath, item.path)

      // 判断当前路由是否只有一个显示的子路由
      const { oneShowingChild, onlyOneChild } = hasOneShowingChild(item.children, item)

      // 设置路径和菜单属性
      if (oneShowingChild && (!onlyOneChild?.children || onlyOneChild?.noShowingChildren) && !meta?.alwaysShow) {
        item.indexPath = onlyOneChild ? pathResolve(fullPath, onlyOneChild.path) : fullPath
        item.isMenuItem = true
      } else {
        item.indexPath = fullPath
        item.isMenuItem = false
      }

      // 设置标题
      item.title = $t(meta?.title as string)

      // 递归处理 children
      if (item.children && item.children.length > 0) {
        item.children = renderMenuItem(item.children, fullPath) // 递归调用并传递当前的 fullPath 作为 parentPath
      }

      item.fullPath = fullPath
      return item
    })
}

const appStore = useAppStore()

const permissionStore = usePermissionStore()

const { push, currentRoute } = useRouter()

const routers = permissionStore.routers

const activeMenu = () => {
  const { meta, path } = currentRoute.value
  // if set path, the sidebar will highlight the path you set
  if (meta.activeMenu) {
    return meta.activeMenu as string
  }
  return path
}

const menuSelect = (index: string) => {
  // 自定义事件
  if (isUrl(index)) {
    window.open(index)
  } else {
    push(index)
  }
}

const routerMap = renderMenuItem(routers)

const collapse = ref(appStore.collapse)

watch(
  () => appStore.collapse,
  newValue => {
    collapse.value = newValue
  },
)
</script>

<template>
  <div>
    <ElMenu :default-active="activeMenu" active-text-color="var(--accent-200)" :collapse="collapse" class="bg-white border-none" @select="menuSelect">
      <div v-for="item in routerMap" :key="item?.path" :index="item.indexPath">
        <ElSubMenu v-if="!item.isMenuItem">
          <template #title>
            <Icon v-if="item?.meta.icon" :icon="item?.meta.icon" :size="4" class="mr-2" />
            <span>{{ item.title }}</span>
          </template>
          <ElMenuItem v-for="subItem in item.children" :key="subItem?.path" :index="item.fullPath">
            <template #title>
              <Icon v-if="subItem?.meta.icon" :icon="subItem?.meta.icon" :size="4" class="mr-2" />
              <span>{{ subItem.title }}</span>
            </template>
          </ElMenuItem>
        </ElSubMenu>
        <ElMenuItem v-else :index="item.fullPath">
          <template #title>
            <Icon v-if="item?.meta.icon" :icon="item?.meta.icon" :size="4" class="mr-2" />
            <span>{{ item.title }}</span>
          </template>
        </ElMenuItem>
      </div>
    </ElMenu>
  </div>
</template>
