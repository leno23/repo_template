/* eslint-disable camelcase */
import { defineStore } from 'pinia'
import { lang } from '@/common/utils/i18n'
import { cloneDeep } from 'lodash'
import { ProjectSetting } from '@/setting'
import { handleAsyncRoutes } from '@/router/config'
import type { LangEnum/* , ThemeEnum */ } from '@/setting'
import type { RouteRecordName, RouteRecordRaw } from 'vue-router'

// *--------------super用户权限值----------------
// export type RoleEnum = 'super' | 'ops' | 'none'
export const getAuthValues = (isSuper: boolean) => {
  return isSuper ? ['super'] : []
}

/*
let theme = localStorage.getItem('dp-theme') as ThemeEnum
if (!theme || (theme !== 'light' && theme !== 'dark')) {
  localStorage.setItem('dp-theme', ProjectSetting.theme)
  theme = ProjectSetting.theme
}
*/

type SettingStoreModel = {
  asyncRoutes: RouteRecordRaw[];
  lang: LangEnum;
  collapsed: boolean;
  permissions: string[]
  // theme: ThemeEnum
};

const filterHideTab = (routes: RouteRecordRaw[]) => {
  const res: RouteRecordRaw[] = []
  routes.forEach((item) => {
    if (!item.meta!.hideTab) res.push(item)
  })
  res.forEach((item) => {
    if (item.children?.length) {
      const child = filterHideTab(item.children)
      if (child.length) {
        item.children = child
      } else {
        delete item.children
      }
    }
  })
  return res
}

export const useSettingStore = defineStore({
  // 一定要有store的id，作为store模块的命名空间
  id: 'Setting',
  state: (): SettingStoreModel => ({
    asyncRoutes: [],
    lang,
    collapsed: !!localStorage.getItem('dp-collapsed'),
    permissions: []
    // theme: theme as ThemeEnum
  }),

  actions: {
    setAsyncRoutes (asyncRoutes: RouteRecordRaw[]) {
      this.asyncRoutes = filterHideTab(cloneDeep(asyncRoutes))
    },
    setPermissions (isSuper: boolean) {
      this.permissions = getAuthValues(isSuper)
    },
    setLang (lang: LangEnum) {
      localStorage.setItem('dp-lang', lang)

      window.location.reload()
    },
    changeCollapsed () {
      this.collapsed = !this.collapsed
      if (this.collapsed) localStorage.setItem('dp-collapsed', 'true')
      else localStorage.removeItem('dp-collapsed')
    }
  },

  getters: {
    navBarMenu (state) {
      const { layout, splitMenu } = ProjectSetting
      // 如果使用侧边栏，并且不分割菜单，则navBar的menu永远为空数组
      if (layout === 'aside') {
        if (!splitMenu) return []
        const res = handleAsyncRoutes(state.permissions, cloneDeep(state.asyncRoutes))
        res.forEach((item) => {
          let redirectName: RouteRecordName = ''

          const firstDeepChild = (route: RouteRecordRaw): any => {
            if (redirectName) return
            if (!route.children || route.children.length === 0) redirectName = route.name!
            else firstDeepChild(route.children[0])
          }

          firstDeepChild(item)

          item.redirect = item.redirect || { name: redirectName }
          delete item.children
        })
        return res
      }
      if (layout === 'top') return handleAsyncRoutes(state.permissions, cloneDeep(state.asyncRoutes))
      return []
    },
    asideMenu (state) {
      const { layout, splitMenu } = ProjectSetting
      if (layout !== 'aside') return () => []
      if (splitMenu) return (name?: string) => handleAsyncRoutes(state.permissions, cloneDeep(state.asyncRoutes.find(item => item.name === name)?.children || []))
      return () => handleAsyncRoutes(state.permissions, cloneDeep(state.asyncRoutes))
    }
  }
})
