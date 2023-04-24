import { request } from '@/common/utils/request'

export interface SubAccountRoleConfigModal {
  id: number,
  created_by: string,
  created_at: string,
  updated_by: string,
  updated_at: string,
  is_deleted: boolean,
  deleted_by: string,
  deleted_at: string,
  description:string,
  role_code: string,
  role_name: string,
  role_type: string,
  provider_key: string,
  policy: string
}

export interface EditFormModal {
  role_code: string,
  role_name: string,
  provider_key: number | string,
  role_type: string,
  policy: string,
  description: string
}

export const getCloudResourceRolesList = () => {
  return request<SubAccountRoleConfigModal[]>({
    url: '/cloud_resource/list_roles/',
    method: 'GET'
  })
}

// 创建
export const createCloudResourceRole = (data: EditFormModal) => {
  return request({
    url: '/cloud_resource/add_role/',
    method: 'POST',
    data
  })
}

// 更新
export const updateCloudResourceRole = (id: number, data: EditFormModal) => {
  return request({
    url: `/cloud_resource/${id}/update_role/`,
    method: 'PATCH',
    data
  })
}

// 删除
export const deleteCloudResourceRole = (id:number) =>
  request({
    url: `/cloud_resource/${id}/delete_role/`,
    method: 'DELETE'
  })

// 同步任务
export const CloudResourceRoleSyncPolicy = (id:number) =>
  request({
    url: '/cloud_resource/sync_policy/',
    method: 'POST',
    data: {
      role_id: id
    }
  })
