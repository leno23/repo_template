import type { App } from 'vue'
import { Icon, addAPIProvider } from '@iconify/vue'
import NProgress from 'nprogress'

import 'tdesign-vue-next/es/style/index.css'
import 'tdesign-vue-next/dist/reset.css'
// import {
//   MessagePlugin,
//   DialogPlugin,
//   NotifyPlugin,
//   LoadingPlugin
// } from 'tdesign-vue-next'

/**
 * 没有全局引入TDesign时import NotifyPlugin 不会自动引入样式，所以还得手动引一下
 */
// import 'tdesign-vue-next/es/notification/style/index.css'

import 'nprogress/nprogress.css'

NProgress.configure({ showSpinner: false })

addAPIProvider('', { resources: ['https://iconapi.devops.intlgame.com'] })

export const setupUI = (app: App) => {
  app.component('Icon', Icon)
  // app.use(LoadingPlugin)
  // TDesign使用自动按需引入时，组件原型上的install的方法如$message还需要单独use一下
  // app.use(MessagePlugin).use(DialogPlugin).use(NotifyPlugin).use(LoadingPlugin)
}
