import en from 'element-plus/es/locale/lang/en'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { defineStore } from 'pinia'

import type { LocaleDropdownType } from '@/types/localeDropdown'

import { store } from './index'

const elLocaleMap = {
  'zh-CN': zhCn,
  'en': en,
}
interface LocaleState {
  currentLocale: LocaleDropdownType
  localeMap: LocaleDropdownType[]
}

export const useLocaleStore = defineStore('locales', {
  state: (): LocaleState => {
    return {
      currentLocale: {
        lang: 'zh-CN',
        elLocale: elLocaleMap['zh-CN'],
      },
      // 多语言
      localeMap: [
        {
          lang: 'zh-CN',
          name: '简体中文',
        },
        {
          lang: 'en',
          name: 'English',
        },
      ],
    }
  },
  getters: {
    getCurrentLocale(): LocaleDropdownType {
      return this.currentLocale
    },
    getLocaleMap(): LocaleDropdownType[] {
      return this.localeMap
    },
  },
  actions: {
    setCurrentLocale(localeMap: LocaleDropdownType) {
      // this.locale = Object.assign(this.locale, localeMap)
      this.currentLocale.lang = localeMap?.lang
      this.currentLocale.elLocale = elLocaleMap[localeMap?.lang]
    },
  },
})

export const useLocaleStoreWithOut = () => {
  return useLocaleStore(store)
}
