/* eslint-disable camelcase */
import { reqAllUserList } from '@/api/user'
import { LangEnum } from '@/setting'
import { defineStore } from 'pinia'

export interface UserInfoModel {
  username: string
  name: string
  is_superuser: boolean
  profile: {
    id?:number,
    language?: LangEnum
    user?: number
    last_biz_id?: null | number
    last_biz_ids?: null | number[]
  },

  /**
   * yufu全量用户，直接赋值成options的形式
   */
  yufuUsers: { label: string, value: string }[],
  yufuLoading: boolean
}

export const useUserStore = defineStore({
  // 一定要有store的id，作为store模块的命名空间
  id: 'User',
  state: (): UserInfoModel => ({
    username: '',
    name: '',
    is_superuser: false,
    profile: {},

    yufuUsers: [],
    yufuLoading: false
  }),

  actions: {
    async refreshYufuUsers () {
      this.yufuLoading = true
      try {
        this.yufuUsers = (await reqAllUserList()).map(({ username }) => ({ label: username, value: username }))
        setTimeout(() => this.yufuLoading || this.refreshYufuUsers(), 900000) // 如果一直停留在界面,则15分钟刷新一次
        this.yufuLoading = false
      } catch (err: any) {
        this.yufuLoading = false
        setTimeout(() => this.refreshYufuUsers(), 5000) // 失败5秒重试
        throw err
      }
    }
  }
})
