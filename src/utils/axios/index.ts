import { config } from './config'
import { service } from './service'

const { default_headers } = config

const request = (option: any) => {
  const { url, method, params, data, headersType, responseType, token } = option
  return service({
    url,
    method,
    params,
    data,
    responseType,
    headers: {
      'Content-Type': headersType || default_headers,
      'token': token,
    },
  })
}
export default {
  get: <T = any>(option: any) => {
    return request({ method: 'get', ...option }) as unknown as T
  },
  post: <T = any>(option: any) => {
    return request({ method: 'post', ...option }) as unknown as T
  },
  delete: <T = any>(option: any) => {
    return request({ method: 'delete', ...option }) as unknown as T
  },
  put: <T = any>(option: any) => {
    return request({ method: 'put', ...option }) as unknown as T
  },
}
