const { t: $t } = useI18n()

export const fileTypes = [
  {
    id: 1,
    code: 'image',
    label: $t('file.fileType.image'),
  },
  {
    id: 2,
    code: 'video',
    label: $t('file.fileType.video'),
  },
  {
    id: 3,
    code: 'pdf',
    label: $t('file.fileType.pdf'),
  },
  {
    id: 4,
    code: 'excel',
    label: $t('file.fileType.excel'),
  },
  {
    id: 5,
    code: 'other',
    label: $t('file.fileType.other'),
  },
]
