import { RouteRecordRaw } from 'vue-router'

const route: RouteRecordRaw = {
  path: '/resource_detail',
  name: 'ResourceDetail',
  component: 'Layout' as any,
  meta: {
    order: 98,
    hideAside: true,
    hideTab: true
  },
  children: [
    {
      path: 'asset/:assetType/:assetId',
      name: 'AssetDetail',
      component: () => import('@/views/ResourceManage/Asset/AssetDetail/AssetDetail.vue'),
      meta: { title: '资产详情', hideTab: true }
    },

    {
      path: 'field/:assetType/:assetId',
      name: 'AssetFieldDetail',
      component: () => import('@/views/ResourceManage/Asset/AssetDetail/FieldDetail.vue'),
      meta: { title: '资产字段详情', hideTab: true }
    }
  ]
}
export default route
