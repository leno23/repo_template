// 资产表格table的列解析配置
export interface AssetParseConfigField {
  field: string
  type: 'str' | 'arr' | 'datetime' | 'int' | 'bool'
  name: string
  operations: Record<string, string>
  sortable: boolean
  editable: boolean
  filterable: boolean
  hidden: boolean
  custom: boolean
  template: boolean
  // 这一列 是否在风险问题详情-相似问题实例表格中展示
  inspection_visible: boolean
}

// 资产表格字段分类
export interface AssetParseConfig {
  name: string
  fields: AssetParseConfigField[]
}

export interface AssetFieldDetailConfigField {
  field: string
  name_zh: string
  name_en: string
}

// 资产field详情config
export interface AssetFieldDetailConfig {
  origin_field_name: string
  display: string
  fields: AssetFieldDetailConfigField[]
}

// 资产表格数据
export type AssetListItem = Record<string, any>

export type AssetActionType = 'delete' | 'forbid'

// listeners后端服务列表字段
export interface LinstenersItemModel {
  Url?: string
  Port?: number
  Type?: string
  EniId?: string
  Domain?: string
  Weight?: number
  EndPort?: number
  Targets?: {
    Port?: number
    Type?: string
    EniId?: string
    Weight?: number
    InstanceId?: string
    InstanceName?: string
    RegisteredTime?: string
    PublicIpAddresses?: string[]
    PrivateIpAddresses?: string[]
  }[]
  Protocol?: string
  InstanceId?: string
  ListenerId?: string
  LocationId?: string
  InstanceName?: string
  instance_port?: number
  RegisteredTime?: string
  PublicIpAddresses?: string[]
  PrivateIpAddresses?: string[]
}
// {
//   "Port": 30071,
//   "Type": "CVM",
//   "EniId": "eni-oxku1lbo",
//   "Weight": 10,
//   "InstanceId": "ins-0pfz9xs0",
//   "InstanceName": "aix-2",
//   "RegisteredTime": "2023-01-12 16:34:09",
//   "PublicIpAddresses": [
//     "43.155.84.238"
//   ],
//   "PrivateIpAddresses": [
//     "10.191.62.10"
//   ]
// }
