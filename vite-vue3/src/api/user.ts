/* eslint-disable camelcase */
import { request } from '@/common/utils/request'
import axios from 'axios'
import type { UserInfoModel } from '@/store/modules/user'
import type { LangEnum } from '@/setting'

// 用户信息
export const reqUserInfo = () => request<UserInfoModel>({
  url: '/users/me/'
})

// * --------------------- yufu全量用户 ------------------
export interface YufuUserModel {
  // id: number,
  username: string
  status: string
  primarymail: string
  displayname: string
}

export const reqAllUserList = ():Promise<YufuUserModel[]> => {
  return new Promise((resolve, reject) => {
    axios.get('https://announcement.devops.intlgame.com/info/user/get_user_list')
      .then(res => {
        resolve(res.data.data)
      })
      .catch((err) => reject(err))
  })
}

// api token列表
export interface TokenModel {
  id: number
  name: string
  token: string
  username: string
  visible: boolean
}
export const reqTokenList = () => request<TokenModel[]>({
  url: '/sub_accounts/'
})

// api token新增
export const reqPostToken = (tokeNname: string) => request<TokenModel>({
  url: '/sub_accounts/',
  method: 'POST',
  data: { username: tokeNname }
})

// 系统数据/用户状态
export const reqUserBehavior = () => {
  return request<{is_datadate: string, business_id: number | null, business_ids: number[], is_update: boolean}>({
    url: '/user_behavior/',
    method: 'GET'
  })
}

export const reqPostUserBehavior = (data:{ key: string, value: any }) => {
  return request({
    url: '/user_behavior/',
    method: 'POST',
    data
  })
}

// export const reqPostUserBusiness = (data:{ business_id: number | string | number[] }) => {
//   return request({
//     url: '/users/business/',
//     method: 'POST',
//     data
//   })
// }

export const reqPostUserBusinessMultiple = (business_ids: number[]) => {
  return request({
    url: '/users/save_last_biz_ids/',
    method: 'POST',
    data: { business_ids }
  })
}

export const reqPostUserLanguage = (language: LangEnum) => {
  return request({
    url: '/users/language/',
    method: 'POST',
    data: { language }
  })
}
