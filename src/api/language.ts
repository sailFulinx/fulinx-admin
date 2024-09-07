import request from '@/utils/axios'

export function fetchLanguageListApi(data: LanguageListParams): Promise<IResponse<TableResponse<LanguageData>>> {
  return request.post({
    url: 'share/public/language/list',
    data,
  })
}
