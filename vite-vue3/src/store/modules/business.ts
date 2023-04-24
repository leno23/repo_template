/* eslint-disable camelcase */
// import { reqUnitList } from '@/api/costManage/settingManage/setting'

import { defineStore } from 'pinia'
// import { requestErrorMsg } from '@/common/utils'
export interface BusinessStoreModel {
  // business_id: number;
  business: BusinessFullModel[]
  // unit_list: string[],
  currentBusinessId: number

  selected: number[]
}

export type BusinessMapModel = {[k: string]: {
  name_zh: string;
  name_en: string;
}}[]

export const useBusinessStore = defineStore({
  // 一定要有store的id，作为store模块的命名空间
  id: 'Business',

  state: (): BusinessStoreModel => ({
    // business_id: NaN,
    business: [],
    selected: [],
    // unit_list: [],
    currentBusinessId: NaN
  }),
  getters: {
    /**
     * 数据格式转化
     * [{ id:1, name_zh:'xx', name_en: 'xx' },{ id:2, name_zh:'xx', name_en: 'xx' }]
     * =>
     * { 1: { name_zh:'xx', name_en: 'xx' }, 2:  { name_zh:'xx', name_en: 'xx' }}
     */
    businessMap: state => Object.fromEntries(state.business.map(v => [v.id, { name_zh: v.name_zh, name_en: v.name_en }]))
  },
  // getters: {
  //   currBussines: state => state.business.find(({ id }) => id === state.business_id)
  // },

  actions: {
    setBusiness (payLoad: BusinessFullModel[]) {
      this.business = payLoad
    },

    updatedBusinessItem (payLoad: BusinessFullModel) {
      let targetIndex = -1
      this.business.find(({ id }, index) => {
        if (payLoad.id === id) {
          targetIndex = index
          return true
        }
        return false
      })
      this.business.splice(targetIndex, 1, payLoad)
    },
    setCurrentBusinessId (business_id: number) {
      this.currentBusinessId = business_id
    }
  }
})
