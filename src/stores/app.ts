import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import type { ElementPlusSize } from '@/types/elementPlus'
import type { ThemeTypes } from '@/types/theme'

export const useAppStore = defineStore('app', () => {
  // Define state variables
  const breadcrumb = ref(true)
  const breadcrumbIcon = ref(true)
  const collapse = ref(false)
  const uniqueOpened = ref(false)
  const hamburger = ref(true)
  const screenfull = ref(true)
  const size = ref(true)
  const locale = ref(true)
  const tagsView = ref(true)
  const tagsViewIcon = ref(true)
  const logo = ref(true)
  const fixedHeader = ref(true)
  const greyMode = ref(false)
  const title = ref(import.meta.env.VITE_APP_TITLE)
  const userInfo = ref('userInfo')
  const currentSize = ref('default')
  const sizeMap = ref<ElementPlusSize[]>(['default', 'large', 'small'])
  const footer = ref(false)
  const theme = ref<ThemeTypes>(
    {
      elColorPrimary: 'var(--accent-100)',
      leftMenuBorderColor: 'var(--border-100)',
      leftMenuBgColor: 'var(--bg-100)',
      leftMenuBgLightColor: 'var(--bg-100)',
      leftMenuBgActiveColor: 'var(--primary-100)',
      leftMenuCollapseBgActiveColor: 'var(--accent-100)',
      leftMenuTextColor: 'var(--text-100)',
      leftMenuTextActiveColor: 'var(--text-100)',
      logoTitleTextColor: 'var(--text-100)',
      logoBorderColor: 'var(--border-100)',
      topHeaderBgColor: 'var(--bg-100)',
      topHeaderTextColor: 'var(--text-100)',
      topHeaderHoverColor: '#f6f6f6',
      topToolBorderColor: 'var(--border-100)',
    },
  )

  // Define computed properties
  const getBreadcrumb = computed(() => breadcrumb.value)
  const getBreadcrumbIcon = computed(() => breadcrumbIcon.value)
  const getCollapse = computed(() => collapse.value)
  const getUniqueOpened = computed(() => uniqueOpened.value)
  const getHamburger = computed(() => hamburger.value)
  const getScreenfull = computed(() => screenfull.value)
  const getSize = computed(() => size.value)
  const getLocale = computed(() => locale.value)
  const getTagsView = computed(() => tagsView.value)
  const getTagsViewIcon = computed(() => tagsViewIcon.value)
  const getLogo = computed(() => logo.value)
  const getFixedHeader = computed(() => fixedHeader.value)
  const getGreyMode = computed(() => greyMode.value)
  const getTitle = computed(() => title.value)
  const getUserInfo = computed(() => userInfo.value)
  const getCurrentSize = computed(() => currentSize.value)
  const getSizeMap = computed(() => sizeMap.value)
  const getTheme = computed(() => theme.value)
  const getFooter = computed(() => footer.value)

  // Define actions
  const setBreadcrumb = (value: boolean) => {
    breadcrumb.value = value
  }
  const setBreadcrumbIcon = (value: boolean) => {
    breadcrumbIcon.value = value
  }
  const setCollapse = (value: boolean) => {
    collapse.value = value
  }
  const setUniqueOpened = (value: boolean) => {
    uniqueOpened.value = value
  }
  const setHamburger = (value: boolean) => {
    hamburger.value = value
  }
  const setScreenfull = (value: boolean) => {
    screenfull.value = value
  }
  const setSize = (value: boolean) => {
    size.value = value
  }
  const setLocale = (value: boolean) => {
    locale.value = value
  }
  const setTagsView = (value: boolean) => {
    tagsView.value = value
  }
  const setTagsViewIcon = (value: boolean) => {
    tagsViewIcon.value = value
  }
  const setLogo = (value: boolean) => {
    logo.value = value
  }
  const setFixedHeader = (value: boolean) => {
    fixedHeader.value = value
  }
  const setGreyMode = (value: boolean) => {
    greyMode.value = value
  }
  const setTitle = (value: string) => {
    title.value = value
  }
  const setCurrentSize = (value: ElementPlusSize) => {
    currentSize.value = value
  }
  const setTheme = (value: ThemeTypes) => {
    theme.value = { ...theme.value, ...value }
  }
  const setFooter = (value: boolean) => {
    footer.value = value
  }

  return {
    getBreadcrumb,
    getBreadcrumbIcon,
    getCollapse,
    getUniqueOpened,
    getHamburger,
    getScreenfull,
    getSize,
    getLocale,
    getTagsView,
    getTagsViewIcon,
    getLogo,
    getFixedHeader,
    getGreyMode,
    getTitle,
    getUserInfo,
    getCurrentSize,
    getSizeMap,
    getTheme,
    getFooter,
    setBreadcrumb,
    setBreadcrumbIcon,
    setCollapse,
    setUniqueOpened,
    setHamburger,
    setScreenfull,
    setSize,
    setLocale,
    setTagsView,
    setTagsViewIcon,
    setLogo,
    setFixedHeader,
    setGreyMode,
    setTitle,
    setCurrentSize,
    setTheme,
    setFooter,
  }
})
