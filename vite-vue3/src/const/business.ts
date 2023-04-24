import { $t } from '@/common/utils/i18n'

type BusinessEnumOptionType<T> = { label: string, value: T, [k: string]: any }[]

/**
 * 业务状态
 */
export const enumStatus: BusinessEnumOptionType<BusinessStatusEnum> = [
  { label: $t('测试'), value: 'test' },
  { label: $t('正式上线'), value: 'live' },
  { label: $t('已退市'), value: 'retired' },
  { label: $t('DEMO'), value: 'demo' },
  { label: $t('下线'), value: 'down' }
]

/**
 * 运营阶段
 */
export const enumStage: BusinessEnumOptionType<BusinessStateEnum> = [
  { label: $t('内部测试'), value: 'INNER' },
  { label: $t('封闭对外测试'), value: 'CBT' },
  { label: $t('公开测试'), value: 'OBT' },
  { label: $t('在有限或不做推广的情况下新产品上线'), value: 'SL' },
  { label: $t('全球不删档产品上线'), value: 'GL' }
]
/**
 * 发行模式
 */
export const enumReleaseMode: BusinessEnumOptionType<BusinessReleaseModeEnum> = [
  { label: $t('自研'), value: 'SELF' },
  { label: $t('二方'), value: 'SECOND_PARTY' },
  { label: $t('三方'), value: 'THIRD_PARTY' },
  { label: $t('整包'), value: 'WHOLE' },
  { label: $t('其它'), value: 'OTHER' }
]

/**
 * 等级
 */
export const enumLevel: BusinessEnumOptionType<BusinessLevelEnum> = [
  { label: 'Super', value: 'Super' },
  { label: 'Key', value: 'Key' },
  { label: 'Regular', value: 'Regular' }
]

/**
 * 游戏类型
 */
export const enumGameType: BusinessEnumOptionType<BusinessGameTypeEnum> = [
  { label: $t('多人竞技场'), value: 'MOBA' },
  { label: $t('第一人称射击'), value: 'FPS' },
  { label: $t('第三人称射击'), value: 'TPS' },
  { label: $t('生存竞技'), value: 'BR' },
  { label: $t('模拟策略游戏'), value: 'SLG' },
  { label: $t('恋爱游戏'), value: 'LVG' },
  { label: $t('沙盒游戏'), value: 'SandBox' },
  { label: $t('多人在线角色扮演'), value: 'MMORPG' },
  { label: $t('休闲游戏'), value: 'ACG' },
  { label: $t('竞速'), value: 'RAC' },
  { label: $t('元宇宙'), value: 'Metaverse' },
  { label: $t('体育游戏'), value: 'SPT' },
  { label: $t('格斗游戏'), value: 'FTG' },
  { label: $t('桌面游戏'), value: 'TAB' },
  { label: $t('卡片游戏'), value: 'CAG' },
  { label: $t('益智类游戏'), value: 'PUZ' },
  { label: $t('其他类型'), value: 'Others' }
]

/**
 * 业务类型 不同的业务类型下的关联字段支持的值不一样
 */
export const enumBusinessType: BusinessEnumOptionType<BusinessTypeEunm> = [
  { label: $t('组件'), value: 'component', type: '' },
  { label: $t('游戏'), value: 'game', type: 'danger' },
  { label: $t('应用'), value: 'app', type: 'success' }
]

/**
  * 组件业务的组件类型
  */
export const enumComponentType: BusinessEnumOptionType<BusinessComponentTypeEnum> = [
  { label: $t('基础'), value: 'B' },
  { label: $t('数据'), value: 'D' },
  { label: $t('营销'), value: 'M' },
  { label: $t('中台'), value: 'P' },
  { label: $t('安全'), value: 'S' }
]

/**
  * app业务类型
  */
export const enumAppType: BusinessEnumOptionType<BusinessAppType> = [
  { label: $t('自研'), value: 'self' },
  { label: $t('外采'), value: 'external' }
]

/**
  * app业务类型 敏感等级
  */
export const enumSensitiveLevel: BusinessEnumOptionType<BusinessSensitiveLevelEnum> = [
  { label: $t('极高'), value: 'top' },
  { label: $t('高'), value: 'high' },
  { label: $t('中'), value: 'middle' },
  { label: $t('低'), value: 'low' }
]

/**
  * app业务类型 域名类型
  */
export const enumAppDomainType: BusinessEnumOptionType<BusinessDomainTypeEnum> = [
  { label: $t('生产'), value: 'productive' },
  { label: $t('非生产'), value: 'nonproductive' }
]
