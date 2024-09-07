import request from '@/utils/axios'
/**
 * 获取用户列表 - 分页
 * @param id
 * @returns
 */
export function fetchUserPaginationApi(
  data: Pagination & UserRequestQueryParameterType,
): Promise<IResponse<TableResponse<UserDataType & CommonField>>> {
  return request.post({
    url: 'server-side/users/pagination',
    token: true,
    data,
  })
}

/**
 * 获取用户基础信息
 * @param id
 * @returns
 */
export function fetchUserDetailApi(id: number | string): Promise<IResponse<UserDataType & CommonField>> {
  return request.get({
    url: `server-side/users/${id}`,
    token: true,
  })
}

/**
 * 修改
 * @param id
 * @param data
 * @returns
 */
export function approvalAvatarApi(data: any): Promise<IResponse<UserDataType & CommonField>> {
  return request.post({
    url: 'server-side/users/avatar/approval',
    token: true,
    data,
  })
}

/**
 * 修改
 * @param id
 * @param data
 * @returns
 */
export function editUserApi(id: number | string, data: UserDataType): Promise<IResponse<UserDataType & CommonField>> {
  return request.put({
    url: `server-side/users/${id}`,
    token: true,
    data,
  })
}

/**
 * 修改
 * @param id
 * @param data
 * @returns
 */
export function createUserApi(data: UserDataType): Promise<IResponse<UserDataType & CommonField>> {
  return request.post({
    url: 'server-side/users',
    token: true,
    data,
  })
}

/**
 * 删除
 * @param id
 * @returns
 */
export function removeUserApi(data: DeleteUserDataType): Promise<IResponse<UserDataType & CommonField>> {
  return request.delete({
    url: 'server-side/users',
    token: true,
    data,
  })
}

/**
 * 删除
 * @param id
 * @param data
 * @returns
 */
export function editUserPasswordApi(data: EditUserPasswordType): Promise<IResponse<UserDataType & CommonField>> {
  return request.post({
    url: 'server-side/user/update/password',
    token: true,
    data,
  })
}

export function updateUserStatus(data: UserStatusUpdateRequest): Promise<IResponse<UserDataType & CommonField>> {
  return request.post({
    url: '/server-side/users/update/status',
    token: true,
    data,
  })
}
