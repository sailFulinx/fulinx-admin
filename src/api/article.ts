import request from '@/utils/axios'

export function createArticle(data: ArticleRequest): Promise<IResponse<ArticleData & CommonField>> {
  return request.post({
    url: 'server-side/article',
    data,
    token: true,
  })
}

export function removeArticle(data: ArticleRemoveRequest): Promise<IResponse<ArticleData & CommonField>> {
  return request.delete({
    url: 'server-side/article',
    data,
    token: true,
  })
}

export function editArticle(id: number, data: ArticleRequest): Promise<IResponse<ArticleData & CommonField>> {
  return request.put({
    url: `server-side/article/${id}`,
    data,
    token: true,
  })
}

export function showArticle(id: number): Promise<IResponse<ArticleData & CommonField>> {
  return request.get({
    url: `server-side/article/${id}`,
    token: true,
  })
}

export function articlePagination(
  data: ArticleListParams & Pagination,
): Promise<IResponse<TableResponse<ArticleData & CommonField>>> {
  return request.post({
    url: 'server-side/article/pagination',
    data,
    token: true,
  })
}

export function articleList(data?: ArticleListParams): Promise<IResponse<TableResponse<ArticleData & CommonField>>> {
  return request.post({
    url: 'server-side/article/list',
    data,
    token: true,
  })
}

export function fetchArticleTypeListApi(
  data?: ArticleTypeListParams,
): Promise<IResponse<TableResponse<ArticleTypeData>>> {
  return request.post({
    url: 'share/public/article/type/list',
    data,
  })
}
