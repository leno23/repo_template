import { request } from '@/common/utils/request'

export interface AccountModal {
  id: number
  name: string
  uin: string
  genre: 'game' | 'component'
  source: string
  maintainer: string[]
  created_by: string
  created_at: string
  description: string
  provider_key: ProviderTypeEnum
  credentials: Record<string, string>

  updated_by: string | null
  updated_at: string |null

  account_identify: string
  security_maintainer: string[]
  cost_belong: string
  station_type: string
  is_safety_control: boolean
  is_share_bill: boolean
}

export interface AccountEditForm {
  uin: string
  name: string
  source: string
  genre: string
  // credentials: string
  description: string
  maintainer: string[]
}

export const reqCloudAccountList = () => {
  return request<AccountModal[]>({
    url: '/cloud_account/',
    method: 'GET'
  })
}

export const reqCloudAllAccount = () => request<AccountModal[]>({
  // url: '/cloud_account/list_accounts/',
  url: '/cloud_account/list_safe_accounts/',
  method: 'GET'
})
export const reqCloudBusinessAccount = (business_id: number, signal?: AbortController['signal']) => request<AccountModal[]>({
  url: '/cloud_account/list_business_account/',
  method: 'POST',
  signal,
  data: { business_id }
})

// 多个业务下的云账户
export const reqCloudAccountMultipleBid = (business_id: number[]) => request<AccountModal[]>({
  url: '/cloud_account/list_business_account/',
  method: 'POST',
  data: { business_id }
})

export const reqCloudRelationAccount = (account_id: number) => request<BusinessFullModel[]>({
  url: '/cloud_account/list_account_business/',
  method: 'post',
  data: { account_id }
})

// export const updateCloudAccount = (account_id: number, params: AccountEditForm) => {
//   return request({
//     url: '/cloud_account/update_account/',
//     method: 'post',
//     data: {
//       ...params,
//       account_id
//     }
//   })
// }
// 取消云账号和业务的关联关系
export const releaseCloudAccount = (account_id: number, business_id: number) => request({
  url: '/cloud_account/release_business_with_account/',
  method: 'post',
  data: {
    account_id,
    business_id
  }
})

export const reqAccountCollectList = (params:{ account_id?: number, cidr: string}) => {
  return request({
    url: '/vpc/account_collect/',
    method: 'GET',
    params
  })
}

export interface ProductAndObsModel {
  id: number,
  created_by: null | string
  created_at: string
  updated_by: null | string
  updated_at: null | string
  is_deleted: boolean
  deleted_by: null | string
  deleted_at: null | string
  description: null | string
  name: string
  product_id: string // 数字字符串？
  business_department_name: string
  obs_department_name: string
  ops_department_name: string
  planning_department_name: string
  maintainer: string[],
  obs_id: number | null
  watchers: string[]
}

export const reqProductAndObs = () => request<{ count: number, results: ProductAndObsModel[] }>({
  url: '/products/',
  params: { page_enabled: false }
})
