import request from '@/utils/axios'
/**
 * 登录
 * @param data
 * @returns
 */
export function loginApi(data: LoginRequestType): Promise<IResponse<AuthResponseType>> {
  return request.post({
    url: 'server-side/system-user/authentication/login',
    data,
    token: false,
  })
}

/**
 * 获取用户信息
 * @param id
 * @returns
 */
export function getUserDetailApi(): Promise<IResponse<UserDetailResponseType>> {
  return request.get({
    url: 'server-side/system/user',
    token: true,
  })
}
