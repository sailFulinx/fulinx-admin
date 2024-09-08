import { useGetPreference, useInitPreference } from '@/hooks/usePreference'
import { defineStore } from 'pinia'

export const usePreferenceStore = defineStore('preference', () => {
  const preference = ref(useInitPreference())

  const getPreferences = () => {
    return useInitPreference()
  }
  const setPreference = () => {
    preference.value = JSON.parse(useGetPreference())
    return preference.value
  }

  return {
    preference,
    getPreferences,
    setPreference,
  }
})
