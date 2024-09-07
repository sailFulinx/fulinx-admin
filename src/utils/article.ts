import { articleCustomTypes, articleStatuses } from '@/data/article'

/**
 * 转换订单状态为文字
 * @param val
 * @returns
 */
export function convertStatus(val: boolean) {
  const valResult = val ? 1 : 0
  let label = ''
  articleStatuses.map(item => {
    if (item.id === valResult) {
      label = item.label
    }
  })
  return label
}

export function convertCustomTypeValue(value: string) {
  let label = ''
  articleCustomTypes.map(item => {
    if (item.value === value) {
      label = item.label
    }
  })
  return label
}
