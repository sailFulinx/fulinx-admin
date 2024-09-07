import request from '@/utils/axios'

/**
 * 获取角色列表 - 不带分页
 * @param data
 * @returns
 */
export function fetchRoleListApi() {
  return request.post({
    url: 'role/pagination',
    token: true,
  })
}

/**
 * 获取角色列表
 * @param data
 * @returns
 */
export function fetchRolePaginationApi(
  data: Pagination & RoleRequestQueryParameterType,
): Promise<IResponse<TableResponse<RoleDataType & CommonField>>> {
  return request.post({
    url: 'role/pagination',
    token: true,
    data,
  })
}

export function fetchRoleDetailApi(id: number): Promise<IResponse<RoleDataType & CommonField>> {
  return request.get({
    url: `role/${id}`,
    token: true,
  })
}

/**
 * 修改
 * @param id
 * @param data
 * @returns
 */
export function editRoleApi(id: number | string, data: RoleDataType): Promise<IResponse<RoleDataType & CommonField>> {
  return request.put({
    url: `role/${id}`,
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
export function createRoleApi(data: RoleDataType): Promise<IResponse<RoleDataType & CommonField>> {
  return request.post({
    url: 'role',
    token: true,
    data,
  })
}

/**
 * 删除
 * @param id
 * @returns
 */
export function removeRoleApi(data: DeleteRoleDataType): Promise<IResponse<RoleDataType & CommonField>> {
  return request.delete({
    url: 'role',
    token: true,
    data,
  })
}
