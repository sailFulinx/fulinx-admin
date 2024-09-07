import dayjs from 'dayjs'

const { t: $t } = useI18n()

export const pickerStarted = {
  shortcuts: [
    {
      text: $t('time.today'),
      onClick(picker) {
        picker.$emit('pick', new Date())
      },
    },
    {
      text: $t('time.tomorrow'),
      onClick(picker) {
        const date = new Date()
        date.setTime(date.getTime() + 3600 * 1000 * 24)
        picker.$emit('pick', date)
      },
    },
    {
      text: $t('time.aWeekLater'),
      onClick(picker) {
        const date = new Date()
        date.setTime(date.getTime() + 3600 * 1000 * 24 * 7)
        picker.$emit('pick', date)
      },
    },
  ],
}

export const pickerEnded = {
  shortcuts: [
    {
      text: $t('time.today'),
      onClick(picker) {
        const date = new Date()
        date.setTime(date.getTime() + 3600 * 1000 * 24)
        picker.$emit('pick', date)
      },
    },
    {
      text: $t('time.aWeekLater'),
      onClick(picker) {
        const date = new Date()
        date.setTime(date.getTime() + 3600 * 1000 * 24 * 7)
        picker.$emit('pick', date)
      },
    },
    {
      text: $t('time.thirtyDaysLater'),
      onClick(picker) {
        const date = new Date()
        date.setTime(date.getTime() + 3600 * 1000 * 24 * 30)
        picker.$emit('pick', date)
      },
    },
    {
      text: $t('time.oneHundredAndEightyDaysLater'),
      onClick(picker) {
        const date = new Date()
        date.setTime(date.getTime() + 3600 * 1000 * 24 * 180)
        picker.$emit('pick', date)
      },
    },
  ],
}

export const currentTimeMillions = (format?: string) => {
  return dayjs().format(format || 'YYYY-MM-DDTHH:mm:ss.SSSSSS')
}
