import { $t } from '@/common/utils/i18n'
import type { RouteRecordRaw } from 'vue-router'

export default {
  path: '/operational-data/',
  component: 'Layout' as any,
  name: '_OperationalData',
  meta: {
    order: 80,
    title: $t('运营数据'),
    permission: ['super']
  },
  children: [
    {
      path: 'cloud',
      name: 'Cloud',
      meta: {
        title: $t('云账号'),
        icon: 'cloud'
      },
      component: () => import('@/views/OperationalData/Cloud/index.vue')
    },
    {
      path: 'sub-account-role-config',
      name: 'SubAccountRoleConfig',
      meta: {
        title: $t('子账户角色配置'),
        icon: 'material-symbols:supervisor-account-outline'
      },
      component: () => import('@/views/OperationalData/SubAccountRoleConfig/index.vue')
    }
  ]
} as RouteRecordRaw
