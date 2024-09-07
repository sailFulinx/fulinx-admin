interface LoginType {
  username: string
  password: string
  captchaKey: string
  captchaValue: string
}

/**
 * 用户请求查询的参数
 */
interface RoleRequestQueryParameterType {
  roleName?: string | null
  roleType?: number
}

/**
 * 修改用户
 */
interface UserDataType {
  id: number
  username: string
  userType: number | null
  password?: string
  name: string
  telephone: string
  status: number
  post: string
  gender: number | null
}

interface UserListParams {
  telephone?: string | null
}

/**
 * 修改指定用户密码
 */
interface EditUserPasswordType {
  userId: string | number
  newPassword: string
}

/**
 * 用户登录
 */
interface AuthResponseType {
  userId: number
  accessToken: string
  accessTokenExpiration: string
  refreshToken: string
  refreshTokenExpiration: string
  userDetail: UserDetailResponseType
}

/**
 * 用户详情
 */
interface UserDetailResponseType {
  operatorName: string
  userId: number
  userType: number
  userProfileId: number
  username: string
  name: string
  gender: number
  telephone: string
  post: string
}

/**
 * 用户授权
 */
interface UserAuthorityItem {
  authority: string
}

interface DeleteUserDataType {
  ids: number[]
}

interface UserStatusUpdateRequest {
  userId: number
  status: number
}
