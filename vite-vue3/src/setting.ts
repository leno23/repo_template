import { reqUserInfo } from '@/api/user'
import { reqBussinessInfo } from '@/api/businessConfig'
import { useBusinessStore } from '@/store/modules/business'
import { useUserStore } from '@/store/modules/user'
import { requestErrorMsg } from '@/common/utils'
import { useCloudAccountStore } from '@/store/modules/cloudAccount'
// import { useSettingStore } from '@/store/modules/setting'
// import type { UserInfoModel } from '@/store/modules/user'

// 和loacles的json名一致
export type LangEnum = 'zh' | 'en'
// export type ThemeEnum = 'light' | 'dark'

type ProjectSettingModel = {
  // showBreadcrumb: boolean; // 面包屑
  // mode: 'light' | 'dark'
  /**
   * top表示只有顶栏没有侧边栏，导航菜单全在navBar
   * aside表示有侧边栏
   */
  layout: 'top' | 'aside';
  /**
   * 当layout为aside时生效
   * true时菜单项会被分割在navBar和aside
   * false时菜单项将只存在于aside
   */
  splitMenu: boolean;

  /**
   * 默认语言，只限制初次进入系统时的语言
   */
  language: LangEnum

  // theme: ThemeEnum
};

export const ProjectSetting: ProjectSettingModel = {
  layout: 'aside',
  splitMenu: true,

  // showBreadcrumb: true,

  language: 'zh'

  // theme: 'light',
}

export async function setupUserBusiness () {
  const BusinessStore = useBusinessStore()
  const UserStore = useUserStore()
  const CloudAccountStore = useCloudAccountStore()
  // const SettingStore = useSettingStore()
  const isZh = navigator.language.startsWith('zh')
  // let user: UserInfoModel
  try {
    const user = await reqUserInfo()
    user.profile.last_biz_ids?.sort((curr, next) => curr - next)
    UserStore.$patch(user)

    // if (user.profile.language) SettingStore.setLang(user.profile.language)

    // user = { username: 'dev', name: 'dev', email: 'aaa@qq.com', business: [] }
    const business = await reqBussinessInfo()
    business.sort(({ id: curr }, { id: next }) => curr - next)

    BusinessStore.setBusiness(business)
    // await BusinessStore.getUnitList()

    if (!business.length) return

    // if (user.profile.last_biz_id && business.find(item => item.id === user.profile.last_biz_id)) BusinessStore.setCurrentBusinessId(user.profile.last_biz_id)
    // if (user.profile.last_biz_ids?.length) BusinessStore.selected = user.profile.last_biz_ids
    if (user.profile.last_biz_ids?.length) {
      BusinessStore.setCurrentBusinessId(user.profile.last_biz_ids[0])
      BusinessStore.selected = user.profile.last_biz_ids
    } else BusinessStore.setCurrentBusinessId(business[0].id)

    business.forEach(({ id }) => (CloudAccountStore.controllers[id] = ({ list: [], loading: false, nextRefresh: 0 })))

    // let hashBid: string | number = window.location.hash.slice(1)
    // hashBid = hashBid ? Number(hashBid) : business[0]?.id
    // if (hashBid && business.find((item) => hashBid === item.id)) {
    //   BusinessStore.setBusinessId(hashBid)
    // } else {
    //   requestErrorMsg(`无id为 ${window.location.hash.slice(1)} 的业务，已自动切换`)
    //   BusinessStore.setBusinessId(business[0]?.id)
    // }
  } catch (error:any) {
    const errMsg = error.message
    if (errMsg.startsWith('Request failed with status code 5')) {
      requestErrorMsg((isZh ? '请求服务器失败！无法获取用户/业务信息！' : 'Request error! Unable to get user/business information!') + errMsg)
    } else if (errMsg !== 'Request failed with status code 401') {
      // requestErrorMsg((isZh ? '获取用户/业务信息失败' : 'Unable to get user/business information!') + errMsg)
    }
    throw error
  }
}
