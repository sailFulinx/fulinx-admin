import request from '@/utils/axios'

export function createCategoryApi(data: CategoryRequestParams): Promise<IResponse<CategoryData & CommonField>> {
  return request.post({
    url: 'server-side/category',
    data,
    token: true,
  })
}

export function removeCategoryApi(data: RemoveCategoryParams): Promise<IResponse<boolean>> {
  return request.delete({
    url: 'server-side/category',
    data,
    token: true,
  })
}

export function editCategoryApi(id: number, data: CategoryRequestParams): Promise<IResponse<CategoryData & CommonField>> {
  return request.put({
    url: `server-side/category/${id}`,
    data,
    token: true,
  })
}

export function showCategoryApi(id: number): Promise<IResponse<CategoryShowData & CommonField>> {
  return request.get({
    url: `server-side/category/${id}`,
    token: true,
  })
}

export function listCategoryApi(data?: CategoryListParams): Promise<IResponse<ListCategoryRes>> {
  return request.post({
    url: 'server-side/category/list',
    data,
    token: true,
  })
}

export function paginationCategoryApi(data: CategoryListParams & Pagination): Promise<IResponse<ListCategoryRes>> {
  return request.post({
    url: 'server-side/category/pagination',
    data,
    token: true,
  })
}
