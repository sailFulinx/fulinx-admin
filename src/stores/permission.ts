import { asyncRouterMap, constantRouterMap } from '@/router'
import { flatMultiLevelRoutes } from '@/utils/routerHelper'
import { cloneDeep } from 'lodash-es'
import { defineStore } from 'pinia'

export const usePermissionStore = defineStore('permission', () => {
  const routers = ref<AppRouteRecordRaw[]>([])
  const addRouters = ref<AppRouteRecordRaw[]>([])
  const isAddRouters = ref<boolean>(false)
  const menuTabRouters = ref<AppRouteRecordRaw[]>([])

  const getRouters = computed(() => routers.value)
  const getAddRouters = computed(() => flatMultiLevelRoutes(cloneDeep(addRouters.value)))
  const getIsAddRouters = computed(() => isAddRouters.value)
  const getMenuTabRouters = computed(() => menuTabRouters.value)

  const generateRoutes = () => {
    return new Promise<void>(resolve => {
      let routerMap: AppRouteRecordRaw[] = []
      // 根据类型决定路由逻辑
      routerMap = cloneDeep(asyncRouterMap)
      addRouters.value = routerMap.concat([
        {
          path: '/:path(.*)*',
          redirect: '/404',
          name: '404Page',
          meta: {
            hidden: true,
            breadcrumb: false,
          },
        },
      ])
      routers.value = cloneDeep(constantRouterMap).concat(routerMap)
      resolve()
    })
  }

  const setIsAddRouters = (state: boolean) => {
    isAddRouters.value = state
  }

  const setMenuTabRouters = (routes: AppRouteRecordRaw[]) => {
    menuTabRouters.value = routes
  }

  return {
    routers,
    addRouters,
    isAddRouters,
    menuTabRouters,
    getRouters,
    getAddRouters,
    getIsAddRouters,
    getMenuTabRouters,
    generateRoutes,
    setIsAddRouters,
    setMenuTabRouters,
  }
})
