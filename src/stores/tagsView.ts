import router from '@/router'
import { findIndex } from '@/utils'
import { getRawRoute } from '@/utils/routerHelper'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { RouteLocationNormalizedLoaded } from 'vue-router'

export const useTagsViewStore = defineStore('tagsView', () => {
  const visitedViews = ref<RouteLocationNormalizedLoaded[]>([])
  const cachedViews = ref<Set<string>>(new Set())

  const getVisitedViews = computed(() => visitedViews.value)
  const getCachedViews = computed(() => Array.from(cachedViews.value))

  const addCachedView = () => {
    const cacheMap = new Set<string>()
    for (const v of visitedViews.value) {
      const item = getRawRoute(v)
      if (!item.meta?.noCache) {
        const name = item.name as string
        cacheMap.add(name)
      }
    }
    if (Array.from(cachedViews.value).sort().toString() === Array.from(cacheMap).sort().toString()) {
      return
    }
    cachedViews.value = cacheMap
  }

  const addVisitedView = (view: RouteLocationNormalizedLoaded) => {
    if (visitedViews.value.some(v => v.path === view.path) || view.meta?.noTagsView) {
      return
    }
    visitedViews.value.push(
      Object.assign({}, view, {
        title: view.meta?.title || 'no-name',
      }),
    )
  }

  const addView = (view: RouteLocationNormalizedLoaded) => {
    addVisitedView(view)
    addCachedView()
  }

  const delVisitedView = (view: RouteLocationNormalizedLoaded) => {
    const index = visitedViews.value.findIndex(v => v.name === view.name)
    if (index > -1) {
      visitedViews.value.splice(index, 1)
    }
  }

  const delCachedView = () => {
    const route = router.currentRoute.value
    const index = findIndex<string>(getCachedViews.value, v => v === route.name)
    if (index > -1) {
      cachedViews.value.delete(getCachedViews.value[index])
    }
  }

  const delView = (view: RouteLocationNormalizedLoaded) => {
    delVisitedView(view)
    addCachedView()
  }

  const delAllVisitedViews = () => {
    visitedViews.value = []
  }

  const delAllViews = () => {
    delAllVisitedViews()
    addCachedView()
  }

  const delOthersVisitedViews = (view: RouteLocationNormalizedLoaded) => {
    visitedViews.value = visitedViews.value.filter(v => v?.meta?.affix || v.path === view.path)
  }

  const delOthersViews = (view: RouteLocationNormalizedLoaded) => {
    delOthersVisitedViews(view)
    addCachedView()
  }

  const delLeftViews = (view: RouteLocationNormalizedLoaded) => {
    const index = findIndex<RouteLocationNormalizedLoaded>(visitedViews.value, v => v.path === view.path)
    if (index > -1) {
      visitedViews.value = visitedViews.value.filter((v, i) => v?.meta?.affix || v.path === view.path || i > index)
      addCachedView()
    }
  }

  const delRightViews = (view: RouteLocationNormalizedLoaded) => {
    const index = findIndex<RouteLocationNormalizedLoaded>(visitedViews.value, v => v.path === view.path)
    if (index > -1) {
      visitedViews.value = visitedViews.value.filter((v, i) => v?.meta?.affix || v.path === view.path || i < index)
      addCachedView()
    }
  }

  const updateVisitedView = (view: RouteLocationNormalizedLoaded) => {
    for (const v of visitedViews.value) {
      if (v.path === view.path) {
        Object.assign(v, view)
        break
      }
    }
  }

  return {
    visitedViews,
    cachedViews,
    getVisitedViews,
    getCachedViews,
    addView,
    delView,
    delCachedView,
    delAllViews,
    delAllVisitedViews,
    delOthersViews,
    delOthersVisitedViews,
    delLeftViews,
    delRightViews,
    updateVisitedView,
  }
})
