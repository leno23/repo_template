import { $t } from '@/common/utils/i18n'
import type { RouteRecordRaw } from 'vue-router'

export default {
  path: '/business',
  component: 'Layout' as any,
  name: '_Business',
  meta: {
    // order: 86,
    hideAside: true,
    hideTab: true
  },
  children: [
    {
      path: '/business',
      name: 'Business',
      component: () => import('@/views/Business/index.vue'),
      meta: {
        title: $t('业务设置')
      }
    },
    {
      path: '/apply_biz',
      name: 'apply_biz',
      component: () => import('@/views/Auth/Apply.vue')
    },
    {
      path: 'detail/:business_id',
      name: 'BussinessStatus',
      component: () => import('@/views/Business/Detail/index.vue'),
      meta: {
        title: $t('业务状态'),
        icon: 'Document'
      }
    }
  ]
} as RouteRecordRaw
