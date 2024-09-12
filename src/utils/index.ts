// import type { Plugin } from 'vue'

/**
 *
 * @param component 需要注册的组件
 * @param alias 组件别名
 * @returns any
 */
export const withInstall = <T>(component: T, alias?: string) => {
  const comp = component as any
  comp.install = (app: any) => {
    app.component(comp.name || comp.displayName, component)
    if (alias) {
      app.config.globalProperties[alias] = component
    }
  }
  return component as T & Plugin
}

/**
 * @param str 需要转下划线的驼峰字符串
 * @returns 字符串下划线
 */
export const humpToUnderline = (str: string): string => {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase()
}

/**
 * @param str 需要转驼峰的下划线字符串
 * @returns 字符串驼峰
 */
export const underlineToHump = (str: string): string => {
  if (!str) {
    return ''
  }
  return str.replace(/-(\w)/g, (_, letter: string) => {
    return letter.toUpperCase()
  })
}

export const setCssVar = (prop: string, val: any, dom = document.documentElement) => {
  dom.style.setProperty(prop, val)
}

/**
 * 查找数组对象的某个下标
 * @param {Array} ary 查找的数组
 * @param {Functon} fn 判断的方法
 */

export const findIndex = <T = Recordable>(ary: Array<T>, fn: Fn): number => {
  if (ary.findIndex) {
    return ary.findIndex(fn)
  }
  let index = -1
  ary.some((item: T, i: number, ary: Array<T>) => {
    const ret: T = fn(item, i, ary)
    if (ret) {
      index = i
      return ret
    }
  })
  return index
}

export const trim = (str: string) => {
  return str.replace(/(^\s*)|(\s*$)/g, '')
}

/**
 * @param {Date | number | string} time 需要转换的时间
 * @param {string} fmt 需要转换的格式 如 yyyy-MM-dd、yyyy-MM-dd HH:mm:ss
 */
export function formatTime(time: Date | number | string, fmt = 'yyyy-MM-dd HH:mm:ss') {
  if (!time) {
    return ''
  } else {
    const date = new Date(time)
    const o = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'H+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds(),
      'q+': Math.floor((date.getMonth() + 3) / 3),
      'S': date.getMilliseconds(),
    }
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, `${date.getFullYear()}`.substr(4 - RegExp.$1.length))
    }
    for (const k in o) {
      if (new RegExp(`(${k})`).test(fmt)) {
        fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : `00${o[k]}`.substr(`${o[k]}`.length))
      }
    }
    return fmt
  }
}

export function convertTimeFormat(time: string): string {
  const timeArray = time.split(':')
  return `${timeArray[0]}:${timeArray[1]}`
}

/**
 * 生成随机字符串
 */
export function toAnyString() {
  const str: string = 'xxxxx-xxxxx-4xxxx-yxxxx-xxxxx'.replace(/[xy]/g, (c: string) => {
    const r: number = (Math.random() * 16) | 0
    const v: number = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString()
  })
  return str
}

/**
 * 小写转大写
 * @param {*} val
 */
export function transPascalCase(val: string) {
  return val.replace(/(^\w|-\w)/g, (c: string) => {
    return c.slice(-1).toUpperCase()
  })
}

export function getCurrentFormattedDate(): string {
  const currentDate = new Date()

  const year = currentDate.getFullYear()
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0') // Months are zero-based
  const day = currentDate.getDate().toString().padStart(2, '0')

  const formattedDate = `${year}-${month}-${day}`
  return formattedDate
}

export function hasContentElements(content: Record<string, any>): boolean {
  return Object.values(content).some(value => {
    if (Array.isArray(value)) {
      // 检查数组是否非空
      return value.length > 0
    } else if (typeof value === 'string') {
      // 检查字符串是否非空
      return value.trim().length > 0
    } else if (typeof value === 'object' && value !== null) {
      if (value instanceof Date) {
        // 检查 Date 是否有效
        return !isNaN(value.getTime())
      } else if (value instanceof Set || value instanceof Map) {
        // 检查 Set 或 Map 是否非空
        return value.size > 0
      } else {
        // 检查普通对象是否有属性
        return Object.keys(value).length > 0
      }
    } else if (typeof value === 'number') {
      // 检查数字是否非零
      return value !== 0
    } else if (typeof value === 'boolean') {
      // 布尔值，true 代表有效内容
      return value === true
    }
    // 处理其他可能的类型，如 undefined、null 等
    return !!value
  })
}

export function copyToClipboard(text: string) {
  // 创建一个临时的 textarea 元素
  const textarea = document.createElement('textarea')
  textarea.value = text

  // 将 textarea 添加到 DOM 中
  document.body.appendChild(textarea)

  // 选中 textarea 中的文本
  textarea.select()

  // 执行复制操作
  document.execCommand('copy')

  // 移除 textarea 元素
  document.body.removeChild(textarea)
}
