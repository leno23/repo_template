import { RouteRecordRaw } from 'vue-router'

const route: RouteRecordRaw = {
  path: '/network_service',
  name: 'NetworkService',
  component: 'Layout' as any,
  // redirect: { name: 'Repository' },
  meta: {
    order: 85,
    title: '网络服务'
    // hideTab: true
  },
  children: [
    {
      path: 'network',
      name: 'Network',
      component: 'Sub' as any,
      meta: {
        title: '网络测速',
        icon: 'server'
      },
      children: [
        {
          path: 'network_order',
          name: 'NetworkOrder',
          component: () => import('@/views/NetworkService/Order/index.vue'),
          meta: {
            title: '反向拨测单据',
            icon: 'bulletpoint'
          }
        },
        {
          path: 'network_result',
          name: 'NetworkResult',
          component: () => import('@/views/NetworkService/Result/index.vue'),
          meta: {
            title: '反向拨测结果',
            icon: 'carbon:result',
            iconProps: {
              width: '20px',
              height: '20px'
            }
          }
        },
        {
          path: 'network_result_detail',
          name: 'NetworkResultDetail',
          component: () => import('@/views/NetworkService/Result/ResultDetail/index.vue'),
          meta: {
            title: '反向拨测结果详情',
            hideTab: true
          }
        }
      ]
    },

    {
      path: 'patch',
      name: 'NetworkPatch',
      component: () => import('@/views/NetworkService/Patch/index.vue'),
      meta: { title: '网络对比', icon: 'wifi', hideTab: true, hideAside: true }
    }

  ]
}
export default route
