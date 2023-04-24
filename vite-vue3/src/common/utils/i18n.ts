import { createI18n } from 'vue-i18n'
// vxe-table的组件内置国际化
import vxeZh from 'vxe-table/lib/locale/lang/zh-CN'
import vxeEn from 'vxe-table/lib/locale/lang/en-US'
import tdZh from 'tdesign-vue-next/es/locale/zh_CN'
import tdEn from 'tdesign-vue-next/es/locale/en_US'
import { ProjectSetting } from '@/setting'
import type { LangEnum } from '@/setting'

const allLang = [
  { value: 'zh', label: '简体中文' },
  { value: 'en', label: 'English' }
]

let lang = localStorage.getItem('dp-lang') as LangEnum
if (!lang || (lang !== 'zh' && lang !== 'en')) {
  lang = ProjectSetting.language
  localStorage.setItem('dp-lang', lang)
}

type MessageModel = Record<LangEnum, { [key: string]: any }>

const vxeLang: MessageModel = {
  zh: vxeZh,
  en: vxeEn
}

const messages: MessageModel = { zh: {}, en: {} }

function loadLocaleMessages () {
  const modules = import.meta.glob('../../locales/**.json', { eager: true })
  Object.keys(modules).forEach(modulePath => {
    const matched = modulePath.match(/([A-Za-z0-9-_]+)\./i)
    if (matched && matched.length > 1) {
      const locale = matched[1] as LangEnum // 分辨语言名
      messages[locale] = { ...(modules[modulePath] as Record<string, any>).default, ...vxeLang[locale] }
    }
  })
}

loadLocaleMessages()

const i18n = createI18n({
  // 使用 Composition API 模式，则需要将其设置为false
  legacy: false,
  // 全局注入 $t 函数
  globalInjection: true,
  locale: lang,
  messages
})

const $t = i18n.global.t.bind(i18n.global)
const tdLang = { zh: tdZh, en: tdEn }
const tdI18n = tdLang[lang]

export { i18n, $t, lang, allLang, tdI18n }
