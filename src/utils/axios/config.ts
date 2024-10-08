const config: {
  errorCode: number | string
  default_headers: AxiosHeaders
  request_timeout: number
} = {
  /**
   * 接口成功返回状态码
   */
  errorCode: 0,

  /**
   * 接口请求超时时间
   */
  request_timeout: 1800000,

  /**
   * 默认接口请求类型
   * 可选值：application/x-www-form-urlencoded multipart/form-data
   */
  default_headers: 'application/json',
}

export { config }
