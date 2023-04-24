// import { $t } from '@/common/utils/i18n'
import { RouteRecordRaw } from 'vue-router'

const route: RouteRecordRaw = {
  path: '/dashboard',
  name: '_Dashboard',
  component: 'Layout' as any,
  // redirect: { name: 'Repository' },
  meta: {
    order: 99,
    title: '仪表盘',
    hideAside: true
  },
  children: [
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('@/views/Dashboard/index.vue')
      // meta: {
      //   title: $t('首页'),
      //   // icon: 'el-icon-data-analysis'
      //   icon: 'bulletpoint'
      // }
    }
  ]
}
export default route
