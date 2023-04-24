import { request } from '@/common/utils/request'

export interface AssetTrendModel {
  months: string[]
  calculation: string[]
  database: string[]
  middleware: string[]
  network: string[]
  storage: string[]
  others: string[]
}

// 资产成本分布
export interface AssetCostDistribute {
  compute: number
  database: number
  middleware: number
  network: number
  storage: number
  // middle_platform: number
  cdn: number
  others: number
}

export type HalfYearCostTrend = Record<ProviderTypeEnum | 'months', string[]>

// * ------------- 资产变化趋势---------------------
export const reqDashboardAssetTrend = (business_ids: number[]) => request<AssetTrendModel>({
  url: '/dashboard/asset_change_statistics/',
  method: 'POST',
  data: { business_ids },
  timeout: 60000
})

// * ----------- 资产成本分布 -------------
export const reqDashboardAssetCostStatistics = (business_ids: number[]) => request<AssetCostDistribute>({
  url: '/dashboard/asset_cost_statistics/',
  method: 'POST',
  data: { business_ids },
  timeout: 60000
})

// * --------------- 近半年成本趋势 ----------------------
export const reqDashboardHalfYearCostTrend = (business_ids: number[]) => request<{ half_year_cost_trend: HalfYearCostTrend }>({
  url: '/dashboard/half_year_cost_trend/',
  method: 'POST',
  data: { business_ids },
  timeout: 60000
})

// * ------------- 当月成本 ------------------
export interface MonthCostModel { 'cur_month_cost': number, 'month_on_month_ratio':number, 'year_over_year_ratio': number }
export const reqDashboardMonthCost = (business_ids: number[]) => request<MonthCostModel>({
  url: '/dashboard/cur_month_cost_statistics/',
  method: 'POST',
  data: { business_ids },
  timeout: 60000
})

// * -------------- 预计节省、主机数量、主机核数、主机分布图表 ------------------
export interface VMStatics {
  vm_count: number
  cpu_core_count: number
}

export interface RegionDistributeModel {
  region: string
  count: number
}

export interface ProviderDistributeModel {
  provider_key: ProviderTypeEnum
  count: number
}

export const reqDashboardVMStatics = (business_ids: number[]) =>
  request<{
      region_count_top5: RegionDistributeModel[]
      provider_count_top5:ProviderDistributeModel[]
      statics: VMStatics
      expect_save: number
     }>({
       url: '/dashboard/vm_statistics/',
       method: 'POST',
       data: { business_ids },
       timeout: 60000
     })

// * ---------------- 大盘右侧部分 ----------------------
export interface AttentionInfo {
  id: number
  name: string
  count: number
}

export interface AssetUsageRateTrend {
  idle_asset_types: string[]
  datas: { time: string, value: Record<string, number> }[]
}

export interface InspectionDistribution {
  asset_category: string
  risk_count: number
  resource_count: number
  idle_count: number
}

export const reqDashboardInspection = (business_ids: number[]) =>
  request<{
      focus_top5: AttentionInfo[],
      asset_cpu_memory_userate_threading: AssetUsageRateTrend,
      inspection_distribution: InspectionDistribution[]
    }>({
      url: '/dashboard/inspection_statistics/',
      method: 'POST',
      data: { business_ids },
      timeout: 60000
    })

// * -------------------- 地球数据 -----------------------
export type EarthDataModel = Record<string, Record<string, number>>

export const reqDashboardEarth = (business_ids: number[]) =>
  request<EarthDataModel>({
    url: '/dashboard/map_statistics/',
    method: 'POST',
    data: { business_ids },
    timeout: 60000
  })
