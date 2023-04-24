import { $t } from '@/common/utils/i18n'
import type { RouteRecordRaw } from 'vue-router'

export default {
  path: '/work-order',
  component: 'Layout' as any,
  name: 'WorkOrder',
  meta: {
    // order: 86,
    title: $t('工单')
  },
  children: [
    {
      path: 'my-order',
      name: 'MyOrder',
      meta: {
        title: $t('我的工单'),
        icon: 'file',
        order: 2
      },
      component: () => import('@/views/WorkOrder/MyOrder/index.vue')
    },
    {
      path: 'order-approve',
      name: 'OrderApprove',
      meta: {
        title: $t('工单审批'),
        icon: 'file-paste',
        order: 1
      },
      component: () => import('@/views/WorkOrder/OrderApprove/index.vue')
    }
  ]
} as RouteRecordRaw
