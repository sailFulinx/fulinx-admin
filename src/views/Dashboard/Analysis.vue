<script setup lang="ts">
import { useLocale } from '@/hooks/useLocale'
import { THEME_KEY } from 'vue-echarts'

provide(THEME_KEY, 'light')

// import { fetchDashboardAnalyticsApi } from '@/api/dashboard'

const { t: $t } = useLocale()

// const dashboardAnalytics = ref<any>({})

const dateRange = ref<string>('')

const query = reactive({
  dateStarted: '',
  dateEnded: '',
})

const handleChangeDateRange = async () => {
  if (dateRange.value && dateRange.value.length > 0) {
    query.dateStarted = dateRange.value[0]
    query.dateEnded = dateRange.value[1]
  } else {
    query.dateStarted = ''
    query.dateEnded = ''
  }
  // await getDashboardAnalytics()
}

// const getDashboardAnalytics = async () => {
//   const { data } = await fetchDashboardAnalyticsApi(query).catch(err => {
//     throw err
//   })
//   data.repairedPercent = (Number(data.repairedOrderCount / data.orderCount) * 100).toFixed(2)
//   dashboardAnalytics.value = data
// }

// getDashboardAnalytics()
</script>

<template>
  <div class="view-page">
    <div class="bg-gray-100 view-main">
      <div class="px-5 py-5 bg-white mb-5 flex justify-between items-center">
        <div>{{ $t('dashboard.name') }}</div>
        <div class="flex items-center">
          <ElDatePicker
            v-model="dateRange"
            type="daterange"
            :start-placeholder="$t('dashboard.dateStartedPickPlaceHolder')"
            :end-placeholder="$t('dashboard.dateEndedPickPlaceHolder')"
            format="YYYY/MM/DD"
            value-format="YYYY-MM-DD"
            class="mr-3"
            @change="handleChangeDateRange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chart {
  height: 100vh;
}
</style>
