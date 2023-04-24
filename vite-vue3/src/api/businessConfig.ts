/* eslint-disable no-redeclare */
// import { CloudProviderType } from './../common/utils/Type'
/* eslint-disable camelcase */
import { request } from '@/common/utils/request'

// 获取业务列表
export const reqBussinessInfo = () => request<BusinessFullModel[]>({
  url: '/business/'
})

// 修改业务信息
export const reqUpdateBussinessInfo = (id: number, data: any) => request<null>({
  url: '/assets/asset_forward/',
  method: 'POST',
  data: {
    http_method: 'PUT',
    uri: `/business/${id}`,
    data
  }
})

// 获取单个业务信息
export const reqBusinessById = (id: number) => request<BusinessFullModel>({
  url: '/assets/asset_forward/',
  method: 'POST',
  data: {
    http_method: 'GET',
    uri: `/business/${id}`
  }
})

// * ---------------------------------------------------------------------
export interface BusinessAccounts { provider: string; name: string }

export function reqCloudAccounts(data:{business_id: number}): Promise<{ business_accounts: BusinessAccounts[]; business_info: BusinessFullModel }>
export function reqCloudAccounts(data:{ is_multi_account: true, business_id: number[] }): Promise<{id:number, name: string, provider: string}[]>
export function reqCloudAccounts (data:{business_id: number} | { is_multi_account: true, business_id: number[] }) {
  return request({
    url: '/cloud_accounts/', data, method: 'POST'
  })
}
