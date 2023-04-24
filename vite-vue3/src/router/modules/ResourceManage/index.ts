import { assetCategoryList } from '@/const/assetConfig'
import { RouteRecordRaw } from 'vue-router'

const route: RouteRecordRaw = {
  path: '/resource_manage/:business_id',
  name: 'ResourceManage',
  component: 'Layout' as any,
  meta: {
    order: 98,
    title: '资产管理'
  },
  children: [
    {
      path: 'business_overview',
      name: 'BusinessOverview',
      component: () => import('@/views/ResourceManage/Architecture/GlobalView/index.vue'),
      meta: {
        title: '全局视图',
        icon: 'dashboard'
      }
    },
    // {
    //   path: 'architecture',
    //   name: 'Architecture',
    //   // component: () => import('@/views/ResourceManage/Architecture/index.vue'),
    //   component: 'Sub' as any,
    //   meta: {
    //     title: '架构图',
    //     // icon: 'el-icon-data-analysis'
    //     icon: 'fork'
    //   },
    //   children: [
    //     {
    //       path: 'global',
    //       name: 'architecture_global',
    //       component: () => import('@/views/ResourceManage/Architecture/GlobalView/index.vue'),
    //       meta: { title: '全局视图' }
    //     }
    //     // {
    //     //   path: 'network',
    //     //   name: 'architecture_network',
    //     //   component: () => import('@/views/ResourceManage/Architecture/NetworkView/index.vue'),
    //     //   meta: { title: '网络视图' }
    //     // },
    //     // {
    //     //   path: 'host',
    //     //   name: 'architecture_host',
    //     //   component: () => import('@/views/ResourceManage/Architecture/HostView/index.vue'),
    //     //   meta: { title: '主机视图' }
    //     // }
    //   ]
    // },
    {
      path: 'asset',
      name: 'Asset',
      component: 'Sub' as any,
      meta: {
        title: '资产',
        // icon: 'el-icon-data-analysis'
        icon: 'bulletpoint'
      },
      children: assetCategoryList.map(item => ({
        path: `${item.value}/:assetType?`,
        name: item.value,
        component: () => import('@/views/ResourceManage/Asset/AssetTable/index.vue'),
        meta: { title: item.name }
      }))
    },
    // {
    //   path: 'asset_detail/:assetType/:assetId',
    //   name: 'AssetDetail',
    //   component: () => import('@/views/ResourceManage/Asset/AssetDetail/AssetDetail.vue'),
    //   meta: { title: '资产详情', hideTab: true }
    // },

    // {
    //   path: 'field_detail/:assetType/:assetId',
    //   name: 'AssetFieldDetail',
    //   component: () => import('@/views/ResourceManage/Asset/AssetDetail/FieldDetail.vue'),
    //   meta: { title: '资产字段详情', hideTab: true }
    // },

    {
      path: 'cloud_accounts',
      name: 'CloudAccounts',
      component: () => import('@/views/ResourceManage/CloudAccounts/index.vue'),
      meta: {
        title: '云账号管理',
        // icon: 'el-icon-data-analysis'
        icon: 'cloud'
      }
    }
  ]
}
export default route
