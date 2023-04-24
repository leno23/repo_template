/* eslint-disable camelcase */
import { request } from '@/common/utils/request'

export const reqBusinessUsers = (business_id: number) => request<string[]>({
  url: '/business/list_business_users/',
  params: { business_id }
})

export const reqPatchBusinessUsers = (business_id: number, username_list: string[]) => request<null>({
  url: '/business/update_business_users/',
  data: { business_id, username_list },
  method: 'POST'
})
