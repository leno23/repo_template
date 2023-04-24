import type { SubAccountRoleTypeEunm } from '@/const/cloudAccount'
import { request } from '@/common/utils/request'

// * ------------------ 子账号角色 ------------------------
export interface SubAccountRoleModel {
  id: number
  created_by: null | string
  created_at: string
  updated_by: string | null
  updated_at: null | string
  is_deleted: boolean
  deleted_by: null | string
  deleted_at: null | string
  description: null | string
  role_code: string
  role_name: string
  role_type: SubAccountRoleTypeEunm
  provider_key: ProviderTypeEnum
  policy: {
    version: string
    statement: {
      action: string[]
      effect: string
      resource: string[]
    }[]
  }
}

export const reqSubAccountRole = (provider_key: ProviderTypeEnum) => request<SubAccountRoleModel[]>({
  url: '/cloud_resource/list_roles/',
  params: { provider_key }
})
