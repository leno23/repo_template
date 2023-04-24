/* eslint-disable camelcase */
import App from './App.vue'
import { setupRouter } from './router'
import { store } from '@/store'
import { setupUI } from './common/plugins/UI'
import { i18n } from './common/utils/i18n'
import { setupTool } from './common/plugins/Tool'
import { setupUserBusiness } from './setting'
import VueDOMPurifyHTML from 'vue-dompurify-html'
import DataV from '@kjgl77/datav-vue3'

if (window.location.host === 'mcp.devops.intlgame.com') {
  window.location.href = 'https://cmp.devops.intlgame.com'
}
const app = createApp(App)
// 确保Store和i18n最先挂载
app.use(store)
app.use(i18n)
app.use(VueDOMPurifyHTML as any)
app.use(DataV)

setupUI(app)
setupTool(app)

async function setupApp () {
  await setupUserBusiness()

  setupRouter(app)
  app.mount('#app')
}

setupApp()
