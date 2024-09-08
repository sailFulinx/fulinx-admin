import { localeMap } from '@/data/language'

import { createI18n } from 'vue-i18n'
import type { I18nOptions } from 'vue-i18n'

/**
 *  set html page lang
 * @param locale
 */
export const setHtmlPageLang = (locale: string) => {
  document.querySelector('html')?.setAttribute('lang', locale)
}

/**
 *  create i18n options
 * @returns
 */
export const createI18nOptions = async (): Promise<I18nOptions> => {
  const locale = useGetStorage('locale')?.toString() || 'zh-CN'
  const defaultLocal = await import(`../locales/${locale}.ts`)
  const message = defaultLocal.default ?? {}

  setHtmlPageLang(locale)
  const res = {
    legacy: false,
    locale,
    fallbackLocale: locale,
    messages: {
      [locale]: message,
    },
    availableLocales: localeMap.map(v => v.lang),
    sync: true,
    silentTranslationWarn: true,
    missingWarn: false,
    silentFallbackWarn: true,
  }
  return res
}

export const useCreateI18n = async () => {
  const options = await createI18nOptions()
  return createI18n(options)
}
