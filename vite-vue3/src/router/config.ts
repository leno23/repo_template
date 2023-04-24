import type { RouteRecordRaw } from 'vue-router'
import SubMenuRoute from './SubMenuRoute.vue'
// import { RouterView } from 'vue-router'

import Layout from '@/Layout/index.vue'
import { $t } from '@/common/utils/i18n'
import cloneDeep from 'lodash/cloneDeep'

declare module 'vue-router' {
  interface RouteMeta {
    /**
     * 当该路由为menu项时，指定菜单项名
     */
    title?: string

    /**
     * 指定跳转到该路由时的html文档title前缀，若无则会尝试使用title字段，皆无则不改变
     */
    docTitle?: string

    /**
     * 当为true时，将不会在对应层级的菜单中渲染为菜单项，默认为undefined，非菜单项页面必须指定undefined
     */
    hideTab?: boolean

    /**
     * 指定iconify或tdesign的icon名
     */
    icon?: string

    /**
     * 传给Icon组件的props，可指定style对象、size等属性，详看Icon组件文档
     */
    iconProps?: { [key: string]: any }

    /**
     * 只能用在第一层route对象中（也就是component === 'Layout'）
     * 当layout模式为aside并splitMenu时生效，表示在该路由渲染时隐藏侧边栏，并且该路由所有子菜单项都会在navBar上popup渲染
     */
    hideAside?: boolean

    /**
     * 对菜单项生效，指定同级别route的菜单项的排序，数值越大越靠前(靠上、靠左)，默认为0
     */
    order?: number // 指定顺序，数值越大越靠前，默认为0

    /**
     * 该路由的权限值，只要用户拥有的权限值有其中一个，就代表有该路由页面的权限，默认为undefined表示无需权限
     * 子路由不需要再写，因为在路由守卫中的route.meta中是合并所有字段后的meta
     * @example
     * ```js
     * permission: undefined
     * 无需权限即可访问
     *
     * permission: []
     * 指定了权限数组但没有权限值，那么将无法访问
     *
     * permission: ['key1', 'key2']
     * 指定了两个所需权限值，只要用户权限值拥有其中一个，即表示拥有访问权限
     * ```
     */
    permission?: string[]
  }
}

/**
 * @param auth 用户权限值数组
 * @param permission route的所需权限值permission数组
 */
export const hasPermission = (auth: string[], permission: string[]) => {
  // const res = []
  // // 用户权限值与所需权限值有交集，就代表拥有权限
  // auth.forEach(key => permission.includes(key) && res.push(1))
  // return res.length > 0

  let res = false
  for (let i = 0; i < permission.length; i++) {
    if (res) break
    if (auth.includes(permission[i])) res = true
  }
  return res
}

/**
 * @param auth 用户权限值数组
 * @param asyncRoutes 动态路由route数组
 * @returns 经过权限过滤后的动态路由数组
 */
export const handleAsyncRoutes = (auth: string[], asyncRoutes: RouteRecordRaw[]) => {
  const res: RouteRecordRaw[] = []
  asyncRoutes.forEach(item => {
    if (!item.meta!.permission || (Array.isArray(item.meta!.permission) && hasPermission(auth, item.meta!.permission))) res.push(item)
  })

  res.forEach(item => {
    if (item.children && item.children.length) {
      const child = handleAsyncRoutes(auth, item.children)
      if (child.length) { item.children = child } else { delete item.children }
    }
  })

  return res
}

// 递归给所有route加上meta默认值，并按照order排序，如果component是'Sub'二级菜单，则不渲染实际组件而是router-view组件
export function formatRoutes (routes: RouteRecordRaw[]) {
  const res = cloneDeep(routes)
  res.forEach(item => {
    if ((item.component as any) === 'Sub') item.component = SubMenuRoute
    else if ((item.component as any) === 'Layout') item.component = Layout
    item.meta = Object.assign({}, defaultMeat, item.meta || {})
    if (item.children && item.children.length) item.children = formatRoutes(item.children)
  })
  res.sort((prev, next) => next.meta!.order! - prev.meta!.order!)
  return res
}

const defaultMeat = {
  title: '',
  order: 0,
  hideTab: false,
  icon: false
}

// !设置首页的路径
export const HOME_PAGE_NAME = 'Dashboard'

// !设置html文档title的后缀
export const SUFFIX_TITLE = $t('云集')

document.title = SUFFIX_TITLE
