import request from '@/utils/axios'

/**
 * 上传图片
 * @param id
 * @returns
 */
export function uploadFileApi(data: any): Promise<IResponse> {
  return request.post({
    url: 'server-side/file',
    token: true,
    data,
    headersType: 'multipart/form-data',
  })
}
