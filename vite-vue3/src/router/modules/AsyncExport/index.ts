import { $t } from '@/common/utils/i18n'
import type { RouteRecordRaw } from 'vue-router'

export default {
  path: '/async_export',
  component: 'Layout' as any,
  name: '_AsyncExport',
  meta: { hideTab: true, hideAside: true },
  children: [
    {
      path: '/async_export',
      name: 'AsyncExport',
      meta: { title: $t('异步导出') },
      component: () => import('@/views/AsyncExport/index.vue')
    }
  ]
} as RouteRecordRaw
