import { RouteRecordRaw } from 'vue-router'

const route: RouteRecordRaw = {
  path: '/resource_governance',
  name: 'ResourceGovernance',
  component: 'Layout' as any,
  // redirect: { name: 'Repository' },
  meta: {
    order: 97,
    title: '资源治理'
  },
  children: [
    {
      path: 'overview',
      name: 'Overview',
      component: () => import('@/views/ResourceGovernance/Overview/index.vue'),
      meta: {
        title: '概览',
        icon: 'dashboard'
      }
    },
    {
      path: 'issues',
      name: 'RiskIssues',
      component: () => import('@/views/ResourceGovernance/RiskIssues/index.vue'),
      meta: {
        title: '问题巡检',
        icon: 'notification'
      }
    },
    {
      path: 'inspection',
      name: 'inspection',
      component: () => import('@/views/ResourceGovernance/Inspection/index.vue'),
      meta: {
        title: '巡检项目',
        icon: 'dashboard'
      }
    },
    {
      path: 'issues_detail',
      name: 'RiskIssuesDetail',
      component: () => import('@/views/ResourceGovernance/RiskIssues/components/RiskDetail.vue'),
      meta: { title: '风险详情', hideTab: true }
    },
    // {
    //   path: 'asset_risk',
    //   name: 'AssetRisk',
    //   component: 'Sub' as any,
    //   meta: {
    //     title: '资产风险',
    //     // icon: 'el-icon-data-analysis'
    //     icon: 'bulletpoint'
    //   },
    //   children: [
    //   ]
    // },
    {
      path: 'unused_assets',
      name: 'UnusedAssets',
      component: () => import('@/views/ResourceGovernance/UnusedAsset/index.vue'),
      meta: {
        title: '闲置资产',
        icon: 'emojione-monotone:free-button',
        iconProps: {
          width: '20px',
          height: '20px'
        }
      }
    },
    {
      path: 'table',
      name: 'AssetRiskTable',
      component: () => import('@/views/ResourceGovernance/AssetsRisk/AssetRiskTable/index.vue'),
      meta: {
        title: '风险汇总',
        icon: 'control-platform'
      }
    }
    // {
    //   path: 'reports',
    //   name: 'Reports',
    //   component: 'Sub' as any,
    //   meta: {
    //     title: '报告',
    //     // icon: 'el-icon-data-analysis'
    //     icon: 'bulletpoint'
    //   },
    //   children: [
    //     {
    //       path: 'report',
    //       name: 'ActiveReport',
    //       component: () => import('@/views/ResourceGovernance/Report/Active/index.vue'),
    //       meta: { title: '查看报告' }
    //     },
    //     {
    //       path: 'config',
    //       name: 'ConfigReports',
    //       component: () => import('@/views/ResourceGovernance/Report/Config/index.vue'),
    //       meta: { title: '配置报告' }
    //     }
    //   ]
    // }
  ]
}
export default route
