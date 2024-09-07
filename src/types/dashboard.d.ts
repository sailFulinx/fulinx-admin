interface DashboardQueryRequestDataType {
  dateStarted?: null | string
  dateEnded?: null | string
}

interface DashboardQueryResponseDataType {
  orderCount: number
  completedOrderCount: number
  repairedOrderCount: number
  repairedPercent?: string
}
