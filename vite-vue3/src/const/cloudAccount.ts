import { $t } from '@/common/utils/i18n'
import { LangEnum } from '@/setting'

export const enumSourceType = [
  { label: $t('自有账号'), value: 'self' },
  { label: $t('二方账号'), value: 'second' },
  { label: $t('三方账号'), value: 'third' }
]

/**
 * 弃用，改为接口获取
 */
export const enumSubAccountRoleList = [
  { label: $t('开发'), value: 'dev' },
  { label: 'DBA', value: 'dba' },
  { label: $t('OPS'), value: 'ops' },
  { label: $t('VIEWER'), value: 'viewer' },
  { label: $t('平台子账号'), value: 'plat' },
  { label: $t('其他'), value: 'other' }
]

export const cloudServiceEnum = {
  1: '腾讯云国际站',
  2: 'Amazon AWS',
  3: 'Google GCP',
  4: 'Microsoft Azure',
  5: '华为 HuaweiCloud',
  6: 'Zenlayer',
  7: 'IBM SoftLayer'
}

export type SubAccountRoleTypeEunm = '用户' | '平台'
export const enumRoleType = [
  { label: $t('用户'), value: '用户' },
  { label: $t('平台'), value: '平台' }
]

// * 子账号状态
export type SubAccoutStatusEnum = 'enable' | 'forbidden'
export const enumSubAccountStatus: Record<SubAccoutStatusEnum, { label_zh: string, label_en: string }> = {
  enable: { label_zh: '启用', label_en: 'Enable' },
  forbidden: { label_zh: '禁用', label_en: 'Forbidden' }
}

// * 子账号角色访问模式
export type SubAccountAccessModeEnum = 'console' | 'programmatic'
export const enumSubAccountAccessMode: Record<SubAccountAccessModeEnum, { label_zh: string, label_en: string }> = {
  console: { label_zh: '控制台访问', label_en: 'Console access' },
  programmatic: { label_zh: 'API访问', label_en: 'API access' }
}

export const cloudProviderMap: Record<ProviderTypeEnum, Record<LangEnum, string>> = {
  tencent: { zh: '腾讯云', en: 'Tencent Cloud' },
  aws: { zh: '亚马逊', en: 'Amazon Web Services' },
  gcp: { zh: '谷歌云', en: 'Google Cloud' },
  huawei: { zh: '华为云', en: 'HUAWEI Cloud' },
  azure: { zh: '微软云', en: 'Microsoft Azure' },
  zenlayer: { zh: 'Zenlayer', en: 'Zenlayer' }
}
