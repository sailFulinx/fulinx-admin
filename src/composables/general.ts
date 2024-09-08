import config from '../../package.json'

export const jsonParse = (obj: any) => {
  return JSON.parse(JSON.stringify(obj))
}

// url 参数
export const getParam = (name: string, urlString: string) => {
  const url = urlString || location.href
  const pattern = new RegExp(`[?&]${name}=([^&]+)`, 'g')
  const matcher = pattern.exec(url)
  let items = null
  if (matcher != null) {
    try {
      items = decodeURIComponent(decodeURIComponent(matcher[1]))
    // eslint-disable-next-line unused-imports/no-unused-vars
    } catch (e) {
      try {
        items = decodeURIComponent(matcher[1])
      // eslint-disable-next-line unused-imports/no-unused-vars
      } catch (e) {
        items = matcher[1]
      }
    }
  }
  return items
}

// 时间戳转换
export function dateFormat(timestamp: string, type = 2): string {
  const oDate = new Date(timestamp)
  const Y = oDate.getFullYear()
  const M = oDate.getMonth() + 1 < 10 ? `0${oDate.getMonth() + 1}` : oDate.getMonth() + 1
  const D = oDate.getDate() < 10 ? `0${oDate.getDate()}` : oDate.getDate()
  const h = oDate.getHours()
  let m: any = oDate.getMinutes()
  let s: any = oDate.getSeconds()
  if (m < 10) {
    m = `0${m}`
  }
  if (s < 10) {
    s = `0${s}`
  }

  let result = `${Y}-${M}-${D}`
  if (type === 1) {
    result = `${Y}-${M}-${D}`
  }
  if (type === 2) {
    result = `${Y}-${M}-${D} ${h}:${m}:${s}`
  }
  if (type === 3) {
    result = `${M}-${D} ${h}:${m}`
  }
  return result
}

export function usePascalCase(val: string) {
  return val.replace(/(^\w|-\w)/g, c => {
    return c.slice(-1).toUpperCase()
  })
}

/**
 * 时间转换，只需要小时和分钟
 * @param val
 * @returns
 */
export function transTime(val: Date) {
  const time = new Date(val)
  const hours = time.getHours()
  const minutes = time.getMinutes()
  const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
  return formattedTime
}

// 把时间格式比如：09:00:00，转换为09:00
export function convertTimeFormat(time: string): string {
  const timeArray = time.split(':')
  return `${timeArray[0]}:${timeArray[1]}`
}

export function useVersion() {
  return config.version
}

export function useFileRootUrl() {
  return import.meta.env.VITE_RESOURCE_URL
}
