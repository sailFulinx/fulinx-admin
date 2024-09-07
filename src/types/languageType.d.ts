interface LanguageListParams {
  languageCode?: string | null
}

interface LanguageData {
  code: string
  id: number
  languageName: string
}

interface ListLanguageRes {
  list: LanguageData[]
  total: number
}
