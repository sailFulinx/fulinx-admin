import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', () => {
  const title = ref(import.meta.env.VITE_APP_TITLE)
  const locale = ref<string>('zh-CN')
  const collapse = ref<boolean>(false)

  const setTitle = (value: string) => {
    title.value = value
  }

  const setLocale = (value: string) => {
    locale.value = value
  }

  const setCollapse = (value: boolean) => {
    collapse.value = value
  }

  return {
    title,
    locale,
    collapse,
    setTitle,
    setLocale,
    setCollapse,
  }
})
