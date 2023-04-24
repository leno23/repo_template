/* eslint-disable camelcase */
import { request } from '@/common/utils/request'
import { defineStore } from 'pinia'

export interface CloudProviderStoreModel {
  regionAndZone: AllCloudRegionAndZoneModel[]
  loading: boolean
}

export const useCloudProviderStore = defineStore({
  id: 'CloudProvider',

  state: (): CloudProviderStoreModel => ({
    regionAndZone: [],
    loading: false
  }),
  getters: {
    tencent: state => state.regionAndZone.find(item => item.key === 'tencent')?.regions || [],
    azure: state => state.regionAndZone.find(item => item.key === 'azure')?.regions || [],
    gcp: state => state.regionAndZone.find(item => item.key === 'gcp')?.regions || [],
    huawei: state => state.regionAndZone.find(item => item.key === 'huawei')?.regions || [],
    aws: state => state.regionAndZone.find(item => item.key === 'aws')?.regions || [],
    zenlayer: state => state.regionAndZone.find(item => item.key === 'zenlayer')?.regions || []
  },
  actions: {
    setRegionAndZone (payLoad: AllCloudRegionAndZoneModel[]) {
      this.regionAndZone = payLoad
    },
    async refreshRegionAndZone () {
      this.loading = true
      try {
        this.regionAndZone = await request<AllCloudRegionAndZoneModel[]>({
          url: '/system_config/cloud_provider/',
          method: 'POST'
        })
        setTimeout(() => this.loading || this.refreshRegionAndZone(), 3600000) // 如果一直停留在界面,则60分钟刷新一次
        this.loading = false
      } catch (err: any) {
        this.loading = false
        setTimeout(() => this.refreshRegionAndZone(), 5000) // 失败5秒重试
        throw err
      }
    }
  }
})
