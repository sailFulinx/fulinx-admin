import request from '@/utils/axios'

/**
 * 获取权限列表 - 不带分页
 * @param data
 * @returns
 */
export function fetchPermissionListApi() {
  return request.get({
    url: 'server-side/permission/list',
    token: true,
  })
}
