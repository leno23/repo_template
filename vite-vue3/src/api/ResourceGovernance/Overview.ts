import { request } from '@/common/utils/request'
export const reqOverviewInfo = (data:any) => {
  return request<any>({
    url: '/abnormal_inspection_dashboard/overview/',
    method: 'POST',
    data
  })
}

export const requestIdleAssets = (data: any) => {
  const page = {
    page: data.page,
    page_size: data.page_size
  }
  return request<any>({
    url: 'idle_inspection/list_idle_asset/',
    method: 'POST',
    data,
    params: page
  })
}

export const getInspection = (data: any) => {
  return request<any>({
    url: 'idle_inspection/inspection/',
    method: 'POST',
    data
  })
}
