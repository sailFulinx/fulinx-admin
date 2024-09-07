import request from '@/utils/axios'

/**
 * 获取零件列表 - 分页
 * @param id
 * @returns
 */
export function fetchDashboardAnalyticsApi(
  data: DashboardQueryRequestDataType,
): Promise<IResponse<DashboardQueryResponseDataType & CommonField>> {
  return request.post({
    url: 'dashboard/analytics',
    token: true,
    data,
  })
}
