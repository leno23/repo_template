import { RouteRecordRaw } from 'vue-router'

const route: RouteRecordRaw = {
  path: '/cost_management',
  name: 'CostManagement',
  component: 'Layout' as any,
  meta: {
    order: 96,
    title: '成本管理'
  },
  children: [
    {
      path: 'overview',
      name: 'CostOverview',
      component: () => import('@/views/CostManagement/Overview/index.vue'),
      meta: {
        title: '概览',
        icon: 'dashboard'
      }
    },
    {
      path: 'bill',
      name: 'Bill',
      component: () => import('@/views/CostManagement/BillList/index.vue'),
      meta: {
        title: '账单',
        icon: 'uil:bill',
        iconProps: {
          width: '20px',
          height: '20px'
        }
      }
    },
    {
      path: 'bill/:bill_id',
      name: 'BillDetail',
      component: () => import('@/views/CostManagement/BillList/components/billDetail.vue'),
      meta: {
        title: '账单详情',
        hideTab: true
      }
    }
  ]
}
export default route
