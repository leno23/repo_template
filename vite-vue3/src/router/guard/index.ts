import NProgress from 'nprogress'
// import { useBusinessStore } from '@/store/modules/business'
import { useSettingStore } from '@/store/modules/setting'
import { SUFFIX_TITLE, hasPermission } from '../config'
import type { Router, RouteLocationNormalized } from 'vue-router'

function setDocumentTitle ({ meta: { title, docTitle } }: RouteLocationNormalized) {
  const asyncTitle = docTitle || title || undefined
  if (!asyncTitle) return
  document.title = asyncTitle + ' - ' + SUFFIX_TITLE
}

function checkPermission ({ meta: { permission } }: RouteLocationNormalized) {
  const SettingStore = useSettingStore()
  if (!permission) return true
  if (!permission.length) return false
  return hasPermission(SettingStore.permissions, permission)
  // let res = false
  // for (let i = 0; i < permission.length; i++) {
  //   if (res) break
  //   if (SettingStore.permissions.includes(permission[i])) res = true
  // }
  // return res
}

export const setupGuard = (router: Router) => {
  router.beforeEach(async (to, form, next) => {
    NProgress.inc()
    if (!checkPermission(to)) {
      // next({ name: 'ErrorPage', params: { title: '401', subTitle: '无权限访问该页面' } })
      next({ name: '403' })
      return
    }
    next()
  })

  router.afterEach((to) => {
    // const href = window.location.href
    // const hash = window.location.hash
    // const id = useBusinessStore().business_id

    // if (id && hash.slice(1) !== id.toString()) {
    //   window.location.replace(href.replace(hash, '') + '#' + id)
    // }

    setDocumentTitle(to)
    NProgress.done()
  })
}
