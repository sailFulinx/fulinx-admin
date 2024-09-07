export const useGetStorage = (key: string) => {
  return localStorage.getItem(key)
}

export const useSetStorage = (key: string, value: string) => {
  localStorage.setItem(key, value)
}

export const useRemoveStorage = (key: string) => {
  localStorage.removeItem(key)
}

export const useClearStorage = () => {
  localStorage.clear()
}
