import request from '@/utils/axios'

export function createSite(data: SiteRequest): Promise<IResponse<SiteData & CommonField>> {
  return request.post({
    url: 'server-side/site',
    data,
    token: true,
  })
}

export function removeSite(data: SiteRemoveRequest): Promise<IResponse<SiteData & CommonField>> {
  return request.delete({
    url: 'server-side/site',
    data,
    token: true,
  })
}

export function editSite(id: number, data: SiteRequest): Promise<IResponse<SiteData & CommonField>> {
  return request.put({
    url: `server-side/site/${id}`,
    data,
    token: true,
  })
}

export function showSite(id: number): Promise<IResponse<SiteData & CommonField>> {
  return request.get({
    url: `server-side/site/${id}`,
    token: true,
  })
}

export function sitePagination(
  data: SiteListParams & Pagination,
): Promise<IResponse<TableResponse<SiteData & CommonField>>> {
  return request.post({
    url: 'server-side/site/pagination',
    data,
    token: true,
  })
}
