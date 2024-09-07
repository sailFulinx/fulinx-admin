import { fetchLanguageListApi } from '@/api/language'

import { useSetStorage } from './useStorage'

export const useSetLanguages = async (languagePayload?: LanguageListParams) => {
  const { data } = await fetchLanguageListApi(languagePayload || { languageCode: null }).catch(error => {
    throw error
  })
  useSetStorage('languages', JSON.stringify(data.list))
}

export const useGetLanguageList: () => LanguageData[] = () => {
  return JSON.parse(useGetStorage('languages') || '[]')
}

export const useInitLanguageList = async () => {
  const languages = useGetStorage('languages')
  if (!languages) {
    await useSetLanguages()
  }
}
