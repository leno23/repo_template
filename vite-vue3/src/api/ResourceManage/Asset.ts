import { request } from '@/common/utils/request'
// import axios from 'axios'
import type { AssetListItem, AssetParseConfig, AssetFieldDetailConfig } from '@/views/ResourceManage/Asset/Types'

export interface AssetListPayload {
  business_id?: number | string
  type: string
  page?: number
  page_size?: number
  page_enabled?: boolean
  [key: string]: any
}

// 每次触发都会取消上一个请求
let listReqAborter: AbortController | null = null
export const reqAssetList = ({ type, ...data }: AssetListPayload) => {
  if (listReqAborter) listReqAborter.abort()
  listReqAborter = new AbortController()
  return request<{ count: number, results: AssetListItem[] }>({
    url: `/assets/${type}/list_assets/`,
    method: 'POST',
    signal: listReqAborter.signal,
    timeout: 120000,
    data
  }).then(res => {
    listReqAborter = null
    return res
  })
}

// 可以并行多个的请求
export const reqAssetListParallel = ({ type, ...data }: AssetListPayload) => request<{ count: number, results: AssetListItem[] }>({
  url: `/assets/${type}/list_assets/`,
  method: 'POST',
  timeout: 120000,
  data
})

// * ---------------------------------------

// 每次触发都会取消上一个请求
let configReqAborter: AbortController | null = null
export const reqAssetFieldConfig = (config_type: string) => {
  if (configReqAborter) configReqAborter.abort()
  configReqAborter = new AbortController()
  return request<AssetParseConfig[]>({
    url: '/assets/config/all/',
    signal: configReqAborter.signal,
    params: { config_type }
  }).then(res => {
    configReqAborter = null
    return res
  })
}

// 可以并行多个的请求
export const reqAssetFieldConfigParallel = (config_type: string) => request<AssetParseConfig[]>({
  url: '/assets/config/all/',
  params: { config_type }
})

export const reqAssetVpcSubList = (vpc_origin_uid:string) => request<AssetListItem[]>({
  url: '/assets/vpc/list_sub_vpcs_by_vpc_id/',
  method: 'POST',
  data: { vpc_origin_uid }
})

// * -------------- 请求单个资产信息详情 ----------------
export const reqAssetDetail = ({ assetType, assetId, providerKey }: { assetType: string, assetId: string, providerKey?:string }) => request<AssetListItem>({
  url: `/assets/${assetType}/${assetId}/asset_detail/`,
  params: {
    provider_key: providerKey
  }
})

export const reqAssetFieldDetailConfig = (asset_name: string, provider_key: ProviderTypeEnum) => request<[AssetFieldDetailConfig]>({
  url: '/assets/config/detail_field_config/',
  params: { asset_name, provider_key }
})

// * ----------- 导出 -----------------
export type ExportAssetListPayload = AssetListPayload & { file_name: string, export_fields: string[] }
// 创建导出任务, 返回一个导出任务唯一标识
export const reqCreateExportMission = ({ type, ...data }: ExportAssetListPayload) => request<{ file_name: string }>({
  url: `/assets/${type}/download_assets/`,
  method: 'POST',
  data
})

// 导出任务唯一标识请求任务是否已经完成，若完成返回buffer
export const reqExportFileStatus = (file_name: string) => request<any>({
  url: '/assets/is_file_exist/',
  method: 'POST',
  data: { file_name },
  // responseType: undefined
  responseType: 'blob'
})
