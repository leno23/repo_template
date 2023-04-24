/* eslint-disable camelcase */
import { request } from '@/common/utils/request'
// * ---------------------- 业务类型 ------------------------
export const businessTypeMap: { value: 'game'|'component'|'app', zh: string, en: string }[] = [
  { value: 'game', zh: '游戏业务', en: 'Game business' },
  { value: 'component', zh: '组件业务', en: 'Component business' },
  { value: 'app', zh: '应用业务', en: 'Application business' }
]

// * ---------------------- 获取无权限的业务 ------------------------
export const reqUsersNoAuthBusiness = () => {
  return request<{business:[]}>({
    url: '/users/no_auth_business/',
    method: 'POST'
  })
}
