import { resetRouter } from '@/router'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import qs from 'qs'

import type { AxiosError, AxiosInstance, AxiosRequestHeaders, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

import { config } from './config'

// 创建axios实例
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // api 的 base_url
  timeout: config.request_timeout, // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (
      config.method === 'post'
      && (config.headers as AxiosRequestHeaders)['Content-Type'] === 'application/x-www-form-urlencoded'
    ) {
      config.data = qs.stringify(config.data)
    }
    if (config.headers.token) {
      config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
    }
    // get参数编码
    if (config.method === 'get' && config.params) {
      let url = config.url as string
      url += '?'
      const keys = Object.keys(config.params)
      for (const key of keys) {
        if (config.params[key] !== void 0 && config.params[key] !== null) {
          url += `${key}=${encodeURIComponent(config.params[key])}&`
        }
      }
      url = url.substring(0, url.length - 1)
      config.params = {}
      config.url = url
    }
    return config
  },
  (error: AxiosError) => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  },
)

// response 拦截器
service.interceptors.response.use(
  (response: AxiosResponse<any>) => {
    if (response.config.responseType === 'blob') {
      // 如果是文件流，直接过
      return response
    } else {
      if (response.data.errorCode !== 0) {
        ElMessage({
          message: response.data.errorMessage || 'Error',
          type: 'error',
          duration: 5 * 1000,
        })
        ElMessage.error(response.data.errorMessage)
        return Promise.reject(new Error(response.data.errorMessage || 'Error'))
      }
      return response.data
    }
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      const data = error.response?.data as any
      if (data.errorCode === -9) {
        ElMessage.error('无权限或TOKEN过期')
        localStorage.removeItem('token')
        localStorage.removeItem('tokenExpiration')
        router.push('/login').then(() => {
          resetRouter() // 重置静态路由表
        })
      } else {
        router.push('/dashboard/analysis').then(() => {
          // resetRouter() // 重置静态路由表
        })
        ElMessage.error(data.errorMessage)
      }
    } else if (error.response?.status === 403) {
      ElMessage.error('不允许访问')
      // const data = error.response?.data as any
      router.push('/dashboard/analysis').then(() => {
        // resetRouter() // 重置静态路由表
      })
      return Promise.reject(error)
    }
    console.log(error) // for debug
    const resData = error?.response?.data as IResponse
    const res = resData.errorMessage ? resData.errorMessage : { message: '失去响应，请检查网络' }
    ElMessage.error(res)
    return Promise.reject(error)
  },
)

export { service }
