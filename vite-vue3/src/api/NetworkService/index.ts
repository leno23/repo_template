/* eslint-disable camelcase */
import { request } from '@/common/utils/request'

export interface DetectResultModel {
  provider: string
  country: string
  workOrderId: string
  timeRangeStart: string
  timeRangeEnd: string
  tag: string
  delay: number
  loss: number
  jitter: number
  serverRegion: string
  median: number
  pingCount: string
}

interface RequestQueryModel {
  page: number
  page_size: number
  country: string
  cloud_net: string
  ticket_id?: string
}
// 获取拨测结果
export const reqDetectResultList = (params: RequestQueryModel) =>
  request<{total: number, rows: DetectResultModel[]}>({
    url: '/yuntu/list_detect_reverse_result/',
    method: 'GET',
    params
  })

// 获取测速配置参数
export interface IsoConfigModel {
  cloudNetList: string[]
  isoList: string[]
}

export const reqIsoConfig = () => request<IsoConfigModel>({
  url: '/yuntu/list_iso_config/',
  method: 'GET'
})

export const reqDetectList = (data:any) => request<any>({
  url: '/yuntu/list_detect_reverse_tickets/',
  method: 'POST',
  data
})

export const reqDelDetectOrder = (data: any) => request<any>({
  url: '/yuntu/soft_delete_ticket/',
  method: 'POST',
  data
})

/**
 * @description yuntu接口转发
 */
export const reqYuntuForward = (data: any) => request<any>({
  url: '/yuntu/yuntu_forward/',
  method: 'POST',
  data
})

// * ------------------- 网络对比页 ----------------------
interface LinkItem {
  countryList:{country:string, ispList:string[]}[]
  provider:string
}
export interface DetectFilterParmas {
  providerList: string[]
  countryList: string[]
  ispList: string[]
  link: LinkItem[]
}

// 获取过滤参数选项
export const reqDetectFilterParmas = (params?: { work_order_id?: string }) => request<DetectFilterParmas>({
  url: '/yuntu/yuntu_forward/',
  method: 'POST',
  data: { uri: '/network-measure/api/info/reverseDetect/filterparams', params }
})

export interface DetectOrderPatchCommonPayload {
  work_order_id: string
  provider?: string
  country?: string
  isp?: string
}

// 单个工单ID详情对象
export interface DetectOrderPatchDetailModel {
  provider: string
  country: string
  isp: string
  region: string
  tag: string
  delay: number
  jitter: number
  loss: number
  median: number
}

// 获取单个工单id详情
export const reqDetectOrderPatchDetail = (params: DetectOrderPatchCommonPayload) => request<{list: DetectOrderPatchDetailModel[]}>({
  url: '/yuntu/yuntu_forward/',
  method: 'POST',
  data: { uri: '/network-measure/api/info/contrast/reverseDetect/detail', params }
})

// 运营商比例分布对象
export interface IspDistributionModel {
  isp: string
  count: number
  rate: number
}
// 运营商比例分布
export const reqIspDistribution = (params: DetectOrderPatchCommonPayload) => request<{ total: number, list: IspDistributionModel[] }>({
  url: '/yuntu/yuntu_forward/',
  method: 'POST',
  data: { uri: '/network-measure/api/info/contrast/reverseDetect/rate', params }
})

// 丢包比例/ping抖动/延迟中位数/平均延迟 对象
export interface RangeCommonModel {
  step: string
  count: number
}

// 丢包比例/ping抖动/延迟中位数/平均延迟
export const reqPatchRange = (params: DetectOrderPatchCommonPayload) =>
  request<Record<'delayList' | 'jitterList' | 'lossList' | 'medianList', RangeCommonModel[]>>({
    url: '/yuntu/yuntu_forward/',
    method: 'POST',
    data: { uri: '/network-measure/api/info/contrast/reverseDetect/range', params }
  })
