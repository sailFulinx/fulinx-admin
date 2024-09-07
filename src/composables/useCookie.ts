export const useGetCookie = (name: string): string | null => {
  const reg = new RegExp(`(^| )${name}=([^;]*)(;|$)`)
  const arr = document.cookie.match(reg)
  return arr ? decodeURIComponent(arr[2]) : null
}

export const useSetCookie = (name: string, value: string, days?: number) => {
  const date = new Date()
  if (!days) {
    days = 30
  }
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
  const expires = `expires=${date.toUTCString()}`
  document.cookie = `${name}=${encodeURIComponent(value)};${expires};path=/`
}

export const useDeleteCookie = (name: string) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
}

export const useDeleteAllCookies = () => {
  const decodedCookie = decodeURIComponent(document.cookie)
  const cookies = decodedCookie.split(';')
  cookies.forEach(cookie => {
    const cookieName = cookie.split('=')[0].trim()
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
  })
}
