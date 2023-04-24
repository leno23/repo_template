/* eslint-disable camelcase */
import { defineStore } from 'pinia'
import type { AccountModal } from '@/api/cloudAccount'
import { reqCloudBusinessAccount } from '@/api/cloudAccount'
import { useBusinessStore } from './business'
import { requestErrorMsg } from '@/common/utils'

export interface CloudAccountControllerModel { list: AccountModal[], loading: boolean, nextRefresh: number }

const refreshInterval = 600000 // 10分钟间隔刷新
const pollingInterval = 1500 // 1.5秒状态轮询间隔

let timer: NodeJS.Timeout // 轮询计时器
let controller: AbortController // 当前业务正在请求的取消器

const emptyAccountController = { list: [], loading: false, nextRefresh: 0 } as CloudAccountControllerModel

//
/**
 * @description 每个业务的云账号列表，初次访问每个业务时都会请求该业务的云账号列表。每个业务的云账号列表刷新时间为refreshInterval的值
 */
export const useCloudAccountStore = defineStore({
  id: 'CloudAccount',

  state: (): { controllers: {[key: number | string]: CloudAccountControllerModel} } => ({ controllers: {} }),

  getters: {
    businessAccounts: (state) => (business_id: number | string) => {
      if (!business_id) return emptyAccountController
      return state.controllers[business_id] || emptyAccountController
    }
  },

  actions: {
    async resfreshBusinessAccount () {
      const BusinessStore = useBusinessStore()
      const business_id = BusinessStore.currentBusinessId

      this.controllers[business_id].loading = true
      controller = new AbortController()
      try {
        const accounts = await reqCloudBusinessAccount(business_id, controller.signal)
        this.controllers[business_id].list = accounts
        this.controllers[business_id].nextRefresh = Date.now() + refreshInterval
        this.controllers[business_id].loading = false
      } catch (err: any) {
        requestErrorMsg(err.message)
        // 如果失败，则5秒后重试 (非主动取消请求)
        if (err.message !== 'Cancel Request canceled') {
          this.controllers[business_id].nextRefresh = Date.now() + 5000
          this.controllers[business_id].loading = false
        }
      }
    },

    polling () {
      const BusinessStore = useBusinessStore()
      const business_id = BusinessStore.currentBusinessId
      clearTimeout(timer)
      timer = setTimeout(this.polling, pollingInterval)

      if (!business_id || this.controllers[business_id].loading || !BusinessStore.businessMap[business_id]) return

      if (!this.controllers[business_id].nextRefresh || this.controllers[business_id].nextRefresh <= Date.now()) this.resfreshBusinessAccount()
    },

    immediate () {
      const BusinessStore = useBusinessStore()
      const business_id = BusinessStore.currentBusinessId
      if (!business_id || !BusinessStore.businessMap[business_id]) return

      if (this.controllers[business_id].loading) controller.abort()

      this.resfreshBusinessAccount()
    }
  }
})
