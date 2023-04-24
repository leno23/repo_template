/* eslint-disable camelcase */
import { request } from '@/common/utils/request'
// import { CloudProviderType } from '@/common/utils/Type'

//* ****************云厂商公用接口**********************
// 获取所有云厂商得region和zone
export const reqAllCloudRegionAndZone = () =>
  request({
    url: '/unify_api/provider/',
    method: 'POST'
  })

//* ***************腾讯云(Tencent)****************
export interface TencentZoneModel {
  ZoneState: 'AVAILABLE' | 'UNAVAILABLE';
  ZoneId: string;
  ZoneName: string;
  Zone: string;
}
export const reqTencentZoneList = (data: {
  account_id: number;
  region: string;
}) =>
  request<{
    TotalCount: number;
    ZoneSet: TencentZoneModel[];
    RequestId: string;
  }>({
    url: '/tencent_cloud_api/list_zone/',
    method: 'POST',
    data
  })
export interface TencentRegionModel {
  RegionState: string;
  Region: string;
  RegionName: string;
}
export const reqTencentRegionList = (account_id: number) =>
  request<{
    TotalCount: number;
    RegionSet: TencentRegionModel[];
    RequestId: string;
  }>({
    url: '/tencent_cloud_api/list_region/',
    method: 'POST',
    data: {
      region: 'ap-shanghai', // 随便填一个地域，并不影响查询结果
      account_id
    }
  })

//* ***************谷歌云(Google)****************
export interface GoogleZoneModel {
  kind: string;
  id: string;
  creationTimestamp: string;
  name: string;
  description: string;
  status: string;
  region: string;
  selfLink: string;
  availableCpuPlatforms: string[];
  supportsPzs: boolean;
}
export const reqGoogleZoneList = (account_id: number) =>
  request<{ items: GoogleZoneModel[] }>({
    url: '/gcp_cloud_api/list_zone/',
    method: 'POST',
    data: {
      account_id
    }
  })

export interface GoogleRegionModel {
  kind: string;
  id: string;
  creationTimestamp: string;
  name: string;
  description: string;
  status: string;
  zones: string[];
  quotas: string;
  metric: { metric: string; limit: number; usage: number }[];
  selfLink: string;
  supportsPzs: boolean;
}
export const reqGoogleRegionList = (account_id: number) =>
  request<{ items: GoogleRegionModel[] }>({
    url: '/gcp_cloud_api/list_region/',
    method: 'POST',
    data: {
      account_id
    }
  })

//* ***************微软云(Azure)****************
export interface AzureZoneModel {
  name: string;
  zone: string;
}
export interface AzureRegionModel {
  area: string;
  region: string;
  zones: AzureZoneModel[];
}
export const reqAzureRegionList = (data: {
  account_id: number;
  params: { resource_group: string };
}) =>
  request<AzureRegionModel[]>({
    url: '/azure_cloud_api/list_region/',
    method: 'POST',
    data
  })

export interface AzureResourceGroupModel {
  id: string;
  location: string;
  name: string;
  properties: {
    provisioning_state: string;
  };
  tags: Record<PropertyKey, any>;
  type: 'Microsoft.Resources/resourceGroups';
}
export const reqAzureResourceGroupList = (data: {
  account_id: number;
  params: Record<string, never>;
}) =>
  request<AzureResourceGroupModel[]>({
    url: '/azure_cloud_api/list_resource_group/',
    method: 'POST',
    data
  })
