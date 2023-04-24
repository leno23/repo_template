/* eslint-disable camelcase */
import { request } from '@/common/utils/request'

// 所有工单的类型
export type TicketTypeEnum = 'network_segment' | 'request_create_host' | 'request_cloud_account'
| 'request_export_cloud_account' | 'request_binding_cloud_account' | 'request_change_business_budget'
  | 'request_add_sub_account' | 'request_business_auth' | 'request_delete_sub_account' | 'request_forbid_sub_account' | 'request_delete_subnet' | 'request_delete_vpc' | 'request_create_reverse_detect'

export const TicketTypeMap: {name: string, notes: string, status: string, type: TicketTypeEnum}[] = [
  {
    name: '申请⽹段',
    notes: '什么也不做',
    status: '',
    type: 'network_segment'
  },
  {
    name: '申请主机',
    notes: '申请创建⼀个或者多个主机',
    status: '',
    type: 'request_create_host'
  }
]
export type orderTypeEnum = 'Processing' | 'Reject' | 'Success'| 'Fail' | 'PartialFail' | 'Draft'| 'Waiting'
export const orderTypeMap = { Processing: '处理中', Reject: '驳回', Success: '成功', Fail: '失败', PartialFail: '部分失败', Draft: '草稿', Waiting: '待确认' }

// * -------------------

export interface componentInfo {
  id:number,
  role_info:{
    role_name: string
    role_name_en: string
  },
  title: string,
  title_en: string,
  mark_en: string,
  mark: string,
  handle_users:string[]
}
export interface commonOrderParams {
  business_id: number,
  created_at: string,
  created_by: string,
  components:componentInfo[],
  deleted_at: string|null,
  deleted_by: string|null,
  description: string|null,
  id: number,
  current_component_position: number,
  is_deleted: boolean,
  notes: string,
  params:{template_id?:number, provider_key?:any, template_params?:any},
  status: string,
  type: string,
  order_type: string,
  type_en: string,
  type_zh: string,
  updated_at: string,
  updated_by: string,
  err_msg: string,
  success_infos: any,
  watchers: []
}
export interface WorkOrderDetail extends commonOrderParams{
  current_component: {
    business_id: number,
    created_at: string,
    created_by: string,
    deleted_at: string,
    deleted_by: string,
    description: string,
    has_permission: boolean,
    id: number,
    is_deleted: boolean,
    last_approval_username: string,
    notes: string,
    role_info: {
    role_name: string,
    role_name_en: string
  },
  status: orderTypeEnum,
  type: string,
  updated_at: string,
  updated_by: string
  },
  current_component_position:number
  handled_components: [],
}

export interface WorkOrderListModel {
    count:number,
    results:WorkOrderDetail[]
}

export interface TypeDetailModel {
  'name': string,
  'notes': string,
  'status': string,
  'type': string
}
// 获取我的工单类型
export const reqWorkOrderType = () => {
  return request<TypeDetailModel[]>({
    url: '/tickets/list_tickets_types/',
    method: 'GET'
  })
}

// 获取我的工单列表
export const reqMyWorkOrderList = (data:any) => request<WorkOrderListModel>({
  url: '/tickets/list_my_tickets/',
  method: 'POST',
  data
})

// 查询工单列详情
export const reqWorkOrderDetail = (ticket_id:string) => request<commonOrderParams>({
  url: `/tickets/${ticket_id}/`,
  method: 'GET'
})

// 获取我的审批工单
export const reqMyApprovrOrderList = (data:any) => request<WorkOrderListModel>({
  url: '/tickets/list_review_tickets/',
  method: 'POST',
  data
})

// * ---------------------- 创建工单 ------------------------
export interface CreateWorkOrderPayload {
  business_id?: number
  ticket_template_type: TicketTypeEnum
  params: Record<string, any>
  notes?: string
  watchers?: string[]
}

export const reqCreateWorkOrder = (data:CreateWorkOrderPayload) => request<any>({
  url: '/tickets/create_ticket/',
  method: 'POST',
  data
})

// * ---------------------- 审批工单 ------------------------

export const reqApproveWorkOrder = (data:any) => {
  return request<null>({
    url: `/tickets/${data.id}/review_ticket/`,
    method: 'POST',
    data
  })
}

// * ---------------------- 克隆工单 ------------------------

export const reqCloneWorkOrder = (ticket_id: number) => {
  return request({
    url: `/tickets/${ticket_id}/clone/`,
    method: 'POST'
  })
}
// * ---------------------- 撤回工单 ------------------------

export const reqWithdrawWorkOrder = (ticket_id: number) => {
  return request({
    url: `/tickets/${ticket_id}/draft/`,
    method: 'POST'
  })
}
// * ---------------------- 撤回工单 ------------------------

export const reqRetryWorkOrder = (ticket_id: number) => {
  return request({
    url: `/tickets/${ticket_id}/retry/`,
    method: 'POST'
  })
}
// * ---------------------- 发布工单 ------------------------

// export const reqPublishWorkOrder = (ticket_id: number) => {
//   return request({
//     url: `/tickets/${ticket_id}/publish/`,
//     method: 'POST'
//   })
// }
// * -------------- 根据id拿单个模板信息 -----------------
// * ---------------------- 资源模板列表 ----------------------------
export interface ResourceTemplateModel {
  id: number,
  created_by: string,
  created_at: string,
  updated_by: null | string,
  updated_at: null | string,
  is_deleted: boolean,
  deleted_by: null | string,
  deleted_at: null | string,
  description: string,
  name_zh: string,
  name_en: string,
  provider_key: ProviderTypeEnum,
  asset_type: 'vm',
  action: 'create_instance',
  version: string,
  regions: string[],
  config: any,
  last_error_infos: {
    last_error?: string,
    last_ticket?: number
  }
}
export const reqTemplateItem = (id: number) => request<ResourceTemplateModel>({ url: `/cloud_template/${id}/` })
// * ------------------ 子账号角色 ------------------------
export type SubAccountRoleTypeEunm = '用户' | '平台'
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
// 公网带宽付费模式
export type InternetChargeTypeEnum = /* 'BANDWIDTH_PREPAID' | */ 'TRAFFIC_POSTPAID_BY_HOUR' | 'BANDWIDTH_POSTPAID_BY_HOUR' /* | 'BANDWIDTH_PACKAGE' */
export const InternetChargeTypeMap: { value: InternetChargeTypeEnum, zh: string, en: string }[] = [
  // { value: 'BANDWIDTH_PREPAID', zh: '预付费按带宽结算', en: 'Bandwidth Prepaid' },
  { value: 'TRAFFIC_POSTPAID_BY_HOUR', zh: '流量按小时后付费', en: 'Traffic Postpaid By Hour' },
  { value: 'BANDWIDTH_POSTPAID_BY_HOUR', zh: '带宽按小时后付费', en: 'Bandwidth Postpaid By Hour' }
  // { value: 'BANDWIDTH_PACKAGE', zh: '带宽包用户', en: 'Bandwidth Package' } // 暂时不用，因为拿不到要选择的带宽包id
]
export type DiskTypeEnum = 'CLOUD_SSD' | 'CLOUD_PREMIUM' | 'CLOUD_BSSD'

export const DiskTypeMap: { value: DiskTypeEnum, label: string, disabledRootDisk: boolean }[] = [
  // { value: 'LOCAL_BASIC', label: '本地硬盘' },
  // { value: 'LOCAL_SSD', label: '本地SSD硬盘' },
  // { value: 'CLOUD_BASIC', label: '普通云硬盘' },
  { value: 'CLOUD_SSD', label: 'SSD云硬盘', disabledRootDisk: true },
  { value: 'CLOUD_PREMIUM', label: '高性能云硬盘', disabledRootDisk: false },
  { value: 'CLOUD_BSSD', label: '通用性SSD云硬盘', disabledRootDisk: true }
]
// * ---------------------- 业务类型 ------------------------
export const businessTypeMap: { value: 'game' | 'component' | 'app', zh: string, en: string }[] = [
  { value: 'game', zh: '游戏业务', en: 'Game business' },
  { value: 'component', zh: '组件业务', en: 'Component business' },
  { value: 'app', zh: '应用业务', en: 'Application business' }
]
export type AwsDiskTypeEnum = 'standard' | 'gp2' | 'gp3' | 'io1' | 'io2' | 'sc1' | 'st1'

export const AwsDiskTypeMap: { value: AwsDiskTypeEnum, label: string }[] = [
  { value: 'standard', label: 'standard' },
  { value: 'gp2', label: '通用SDD卷 gp2' },
  { value: 'gp3', label: '通用SDD卷 gp3' },
  { value: 'io1', label: '预置IOPS SSD卷 io1' },
  { value: 'io2', label: '预置IOPS SSD卷 io2' },
  { value: 'sc1', label: 'Cold HHD卷 sc1' },
  { value: 'st1', label: '吞吐量优化型HDD卷 st1' }
]
export type AzureDiskTypeEnum = 'Premium_LRS' | 'Premium_ZRS' | 'StandardSSD_LRS' | 'StandardSSD_ZRS' | 'Standard_LRS' | 'UltraSSD_LRS'

export const AzureDiskTypeMap: { value: AzureDiskTypeEnum, label: string }[] = [
  { value: 'Premium_LRS', label: '高级SSD - 本地冗余' },
  { value: 'Premium_ZRS', label: '高级SSD - 区域冗余' },
  { value: 'StandardSSD_LRS', label: '标准SSD - 本地冗余' },
  { value: 'StandardSSD_ZRS', label: '标准SSD - 区域冗余' },
  { value: 'Standard_LRS', label: '标准HDD' },
  { value: 'UltraSSD_LRS', label: '超级SSD - 本地冗余' }
]
export type GcpDiskTypeEnum = 'pd-standard' | 'pd-balanced' | 'pd-ssd'

export const GcpDiskTypeMap: { value: GcpDiskTypeEnum; label: string }[] = [
  { value: 'pd-standard', label: '标准永久性磁盘' },
  { value: 'pd-balanced', label: '平衡永久性磁盘' },
  { value: 'pd-ssd', label: 'ssd永久性磁盘' }
]
export type HuaweiDiskTypeEnum = 'SAS' | 'SSD' | 'GPSSD' | 'ESSD'

export const HuaweiDiskTypeMap: { value: HuaweiDiskTypeEnum, label: string }[] = [
  { value: 'SAS', label: '高IO磁盘' },
  { value: 'SSD', label: '超高IO磁盘' },
  { value: 'GPSSD', label: 'GPSSD' },
  { value: 'ESSD', label: 'ESSD' }
]
