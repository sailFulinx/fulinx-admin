/**
 * 用户请求查询的参数
 */
interface UserRequestQueryParameterType {
  username?: string | null
  userType?: number
  name?: string
}

interface RolePermissionType {
  id: number
  roleId: number
  permissionId: number
}

interface RoleDataType {
  id: number
  roleType?: number | null
  roleName: string
  rolePermissions?: RolePermissionType[]
  permissionIds?: number[]
  deletedPermissionIds?: number[]
}

interface DeleteRoleDataType {
  ids: number[]
}
