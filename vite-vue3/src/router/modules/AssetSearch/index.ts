import { RouteRecordRaw } from 'vue-router'

const route: RouteRecordRaw = {
  path: '/asset_search',
  name: '_AssetSearch',
  component: 'Layout' as any,
  meta: {
    title: '资产搜索',
    hideTab: true,
    hideAside: true
  },
  children: [
    {
      path: '/asset_search',
      name: 'AssetSearch',
      component: () => import('@/views/ResourceManage/Asset/AssetSearch/index.vue'),
      meta: { title: '资产搜索' }
    }
  ]
}
export default route
