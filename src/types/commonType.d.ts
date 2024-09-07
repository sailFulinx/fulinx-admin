declare interface Fn<T = any> {
  (...arg: T[]): T
}

declare type Nullable<T> = T | null

declare type ElRef<T extends HTMLElement = HTMLDivElement> = Nullable<T>

declare type Recordable<T = any, K = string> = Record<K extends null | undefined ? string : K, T>

declare type ComponentRef<T> = InstanceType<T>

declare type LocaleType = 'zh-CN' | 'en'

declare type AxiosHeaders = 'application/json' | 'application/x-www-form-urlencoded' | 'multipart/form-data'

declare type AxiosMethod = 'get' | 'post' | 'delete' | 'put'

declare type AxiosResponseType = 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream'

declare interface AxiosConfig {
  params?: any
  data?: any
  url?: string
  method?: AxiosMethod
  headersType?: string
  responseType?: AxiosResponseType
}

declare interface IResponse<T = any> {
  errorCode: string | number
  data: T extends any ? T : T & any
  serverTime: string
  errorMessage: null | string
}

declare interface AppRouteRecordRaw extends Omit<RouteRecordRaw, 'meta'> {
  name: string
  meta: RouteMeta
  component?: Component | string
  children?: AppRouteRecordRaw[]
  props?: Recordable
  fullPath?: string
}

declare interface AppCustomRouteRecordRaw extends Omit<RouteRecordRaw, 'meta'> {
  name: string
  meta: RouteMeta
  component: string
  path: string
  redirect: string
  children?: AppCustomRouteRecordRaw[]
}

interface RouteMeta extends Record<string | number | symbol, unknown> {
  hidden?: boolean
  alwaysShow?: boolean
  title?: string
  icon?: string
  noCache?: boolean
  breadcrumb?: boolean
  affix?: boolean
  activeMenu?: string
  noTagsView?: boolean
  followAuth?: string
  canTo?: boolean
}

type Component<T = any> =
  | ReturnType<typeof defineComponent>
  | (() => Promise<typeof import('*.vue')>)
  | (() => Promise<T>)

/**
 * 分页
 */
interface Pagination {
  id?: number | null
  status?: number | null
  isDelete?: number | null
  pageNumber?: number
  pageSize: number
}

interface PaginationComponentData {
  limit: number
  page: number
}

interface CommonField {
  id: number
  isDelete?: number | null
  remark?: string | null
  recordVersion?: number | null
  recordCreateName?: string
  recordUpdateName?: string | null
  recordCreateTime?: string
  recordUpdateTime?: string | null
}

interface CommonFieldType {
  id?: number
  isDelete?: number | null
  remark?: string | null
  recordVersion?: number | null
  recordCreateName?: string
  recordUpdateName?: string | null
  recordCreateTime?: string
  recordUpdateTime?: string | null
}

interface TableResponse<T = any> {
  total: number
  list: T[]
}

interface PaginationComponentDataType {
  limit: number
  page: number
}

interface PreferenceType {
  language: LanguageData
}
