import { useTagsViewStore } from '@/stores/modules/tagsView'

import type { RouteLocationNormalizedLoaded } from 'vue-router'

interface TagViewType {
  view: RouteLocationNormalizedLoaded
  pushName: string
  close: boolean
}
export const useTagView = (payload: TagViewType) => {
  const { pushName, close = false, view } = payload

  if (close) {
    const tagsViewStore = useTagsViewStore()
    tagsViewStore.delView(view)
  }
  if (pushName) {
    router.push({ name: pushName })
  }
}
