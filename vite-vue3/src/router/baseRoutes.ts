import { $t } from '@/common/utils/i18n'
import { HOME_PAGE_NAME } from './config'
import type { RouteRecordRaw } from 'vue-router'

export const baseRoutes: RouteRecordRaw[] = [
  {
    // 访问根路径的路由 这里要带一个Layout，因为计算重定向的逻辑在Layout的代码中
    path: '/',
    component: 'Layout' as any,
    redirect: { name: HOME_PAGE_NAME },
    meta: { hideTab: true }
  }
]

export const errorRoutes: RouteRecordRaw[] = [
  {
    path: '/error',
    name: 'ErrorPage', // 这个name不能修改，否则会影响Layout里的计算
    component: 'Layout' as any,
    meta: { hideTab: true, hideAside: true },
    children: [
      {
        path: 'test',
        component: () => import('@/views/Test/index.vue'),
        meta: { hideTab: true, hideAside: true }
      },
      {
        path: ':title/:subTitle?',
        component: () => import('@/views/Error/index.vue'),
        meta: { docTitle: 'error' },
        props: true
      },
      {
        path: '403',
        name: '403',
        component: () => import('@/views/Error/index.vue'),
        meta: { docTitle: '403' },
        props: {
          title: '403',
          subTitle: $t('抱歉，您无权限访问此页面')
        }
      },
      // ! 404路由,一定要放在最后面
      {
        path: '404',
        name: '404',
        component: () => import('@/views/Error/index.vue'),
        meta: { docTitle: '404' },
        props: {
          title: '404',
          subTitle: $t('抱歉，您访问的页面不存在')
        }
      }
    ]
  },
  // vue3里面的router需要这样来匹配 *
  {
    path: '/:pathMatch(.*)*',
    meta: { hideTab: true },
    redirect: { name: '404' }
  }
]
