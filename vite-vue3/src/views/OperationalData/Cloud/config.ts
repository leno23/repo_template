import { $t } from '@/common/utils/i18n'

export * from '@/const/business'
export * from '@/const/cloudAccount'

export const enumCostAttribution = [
  { label: 'IEGG', value: 'iegg' },
  { label: $t('其他'), value: 'other' }
]

export const enumStationType = [
  { label: $t('国际站'), value: 'international' },
  { label: $t('国内站'), value: 'internal' }
]
