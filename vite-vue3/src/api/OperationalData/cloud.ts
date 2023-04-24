/* eslint-disable camelcase */
import { request } from '@/common/utils/request'
export interface AccountEditForm {
  uin: string,
  name: string,
  source: string,
  genre: string,
  credentials: string,
  description: string,
  is_safety_control: boolean,
  is_share_bill: boolean,
  maintainer: string[],
  cost_belong: string,
  station_type: string
}

export const updateCloudAccount = (account_id: number, params: AccountEditForm) => {
  return request({
    url: '/cloud_account/update_account/',
    method: 'post',
    data: {
      ...params,
      account_id
    }
  })
}

export const deleteCloudAccount = (account_id: number) => {
  return request({
    url: '/cloud_account/delete_account/',
    method: 'post',
    data: {
      account_id
    }
  })
}
