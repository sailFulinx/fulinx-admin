export const useGetPreference = () => {
  return useGetStorage('preference') || ''
}

export const useInitPreference = () => {
  const preferenceData = useGetPreference() || ''
  if (!preferenceData) {
    const preference = reactive<PreferenceType>({
      language: {
        code: 'ZH',
        id: 2,
        languageName: 'Chinese',
      },
    })
    useSetStorage('preference', JSON.stringify(preference))
    return preference
  }
  return JSON.parse(preferenceData) || ''
}

export const useGetPreferenceLanguage = () => {
  const preference = useGetPreference()
  if (preference) {
    const preferenceData = JSON.parse(preference)
    return preferenceData.language
  }
}
