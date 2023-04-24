/* eslint-disable camelcase */
import { request } from '@/common/utils/request'

interface PageParameters {
  page: number;
  page_size: number;
}

interface QueryParameters {
  search?: string;
  status: RiskIssueStatusEnum,
  business_ids?: number[];
  inspection_id?:number|string;
  account_id?: string;
  order_by?:string[];
  asset_types?: string[];
}

export type RiskIssueActionEnum = 'UPDATE_HANDLER' | 'UPDATE_STATUS'

export type RiskIssueStatusEnum = 'Unprocessed' | 'Fixed' | 'Fixing' | 'Ignored'

export interface UpdateParamModel {
  ids: number[]
  action: RiskIssueActionEnum;
  status?: RiskIssueStatusEnum;
  handlers?: string[];
  ignore_reason?:string;
  ignore_destination_date?:string;
}

export const reqRiskIssueList = (param: QueryParameters & PageParameters) => request<any>({
  url: '/abnormal_inspection/list_abnormal_inspections/',
  data: param,
  method: 'POST'
})

export const reqUpdateIssueState = (param: UpdateParamModel) => request<any>({
  url: '/abnormal_inspection/batch_update/',
  data: param,
  method: 'PUT'
})

export const reqSameBoatList = (param: { id: number, business_ids?: number[] } & PageParameters) => request<any>({
  url: `/abnormal_inspection/${param.id}/list_same_boat/`,
  data: param,
  method: 'POST'
})

export const reqInspectionList = (params: { business_ids?: number[], account_id?: string }) => request<any>({
  url: '/abnormal_inspection/list_inspection_distribution/',
  data: params,
  method: 'POST'
})

export const reqInspectionDetail = (id: number) => request<any>({
  url: `/abnormal_inspection/${id}/`,
  method: 'GET'
})

export const reqGetFieldsConfig = (asset_type: string) => request<any>({
  url: '/abnormal_inspection/get_field_config/',
  params: { asset_type },
  method: 'GET'
})

export const reqGetInspectionList = (params?:any) => request<any>({
  url: '/inspection/',
  method: 'GET',
  params
})

export const reqMonitorMetrics = (data: any) => request<any>({
  url: '/monitor_metric/data/',
  method: 'POST',
  data
})
