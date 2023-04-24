/* eslint-disable camelcase */
import { defineStore } from 'pinia'
import { requestErrorMsg } from '@/common/utils'
import { reqWorkOrderType, TypeDetailModel } from '@/api/workOrder/index'

export interface WorkOrderStoreModel {
    order_type_list:TypeDetailModel[]
}

export const useWorkOrderStore = defineStore({
  // 一定要有store的id，作为store模块的命名空间
  id: 'Workorder',
  state: ():WorkOrderStoreModel => ({
    order_type_list: []
  }),
  getters: {
    orderTypeListMap: state => state.order_type_list.map(v => { return { label: v.name, value: v.type } })
  },
  actions: {
    setOrderTypeList (payLoad:TypeDetailModel[]) {
      this.order_type_list = payLoad
    },
    async getWorkOrderType () {
      try {
        const data = await reqWorkOrderType()
        this.setOrderTypeList(data)
      } catch ({ message }) {
        requestErrorMsg(message as string)
      }
    }
  }
})
