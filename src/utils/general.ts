import { customTypes } from '@/data/general'

export function convertCustomTypeValue(value: string) {
  let label = ''
  customTypes.map(item => {
    if (item.value === value) {
      label = item.label
    }
  })
  return label
}
