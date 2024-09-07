import { siteStatuses } from '@/data/site'

/**
 * 转换状态为文字
 * @param val
 * @returns
 */
export function convertStatus(val: boolean) {
  const valResult = val ? 1 : 0
  let label = ''
  siteStatuses.map(item => {
    if (item.id === valResult) {
      label = item.label
    }
  })
  return label
}
