import type { AssetListItem, AssetParseConfigField } from '../Types'
import { dayjs } from '@/common/plugins/Tool'
import { cloudProviderMap, enumSourceType } from '@/const/cloudAccount'
import { lang } from '@/common/utils/i18n'
import { enumBusinessType } from '@/const/business'
import type { RouteParams } from 'vue-router'
import { router } from '@/router'

const parseDescConfig = (configList: AssetParseConfigField[], data: AssetListItem, routeParams: RouteParams) => configList.map(item => {
  const fieldValue = data[item.field]

  const config = {
    key: item.field,
    label: item.name,
    type: undefined as any,
    value: '' as any,
    class: '',
    linkProps: {} as any
  }

  switch (item.field) {
  case 'created_at':
  case 'updated_at':
  case 'origin_dead_at':
  case 'min_created_at':
  case 'expiration_date':
  case 'origin_update_at':
  case 'origin_created_at':
  case 'origin_create_time':
  case 'origin_update_time':
    config.value = fieldValue ? dayjs(fieldValue).format('YYYY-MM-DD HH:mm:ss') : null; break

  case 'system_disk':
    config.value = fieldValue?.disk_size || null; break

  case 'data_disks':
    config.value = fieldValue?.map(({ disk_size }: any) => disk_size).join(', ') || null; break

  case 'provider_key':
    config.value = fieldValue ? cloudProviderMap[fieldValue as ProviderTypeEnum]?.[lang] : null; break

  case 'disk_shareable':
  case 'public_accessible':
  case 'is_high_availability':
  case 'certificate_deployable':
    config.value = fieldValue ? '是' : '否'; break

  case 'console_login':
    config.value = fieldValue === '1' ? '是' : '否'; break

  case 'operator':
  case 'bak_operator':
  case 'jms_access_users':
  case 'jms_recent_login':
  case 'private_ip_address':
  case 'security_group':
  case 'public_ip_address':
  case 'sub_vpcs':
    config.value = Array.isArray(fieldValue) ? fieldValue.join(', ') : (fieldValue || null); break

  case 'source':
    config.value = fieldValue ? enumSourceType[fieldValue]?.label : null; break

  case 'genre':
    config.value = fieldValue ? enumBusinessType[fieldValue]?.label : null; break

  case 'nodes':
  case 'listeners':
  case 'sub_domain':
  case 'replica_sets':
  case 'mount_targets':
    // content = () => <span>查看详情</span>; break
    config.linkProps = {
      theme: 'primary',
      content: '查看详情',
      onClick: () => router.push({
        name: 'AssetFieldDetail',
        params: routeParams,
        query: { field_name: item.name, field: item.field, provider_key: data.provider_key }
      })
    }
    config.type = 'link'
    break

  case 'origin_tags':
    config.type = 'tag'
    config.value = Array.isArray(fieldValue)
      ? fieldValue.map(({ TagKey, Key, key, TagValue, Value, value }: any) => {
        const keyField = TagKey || Key || key
        const valueField = TagValue || Value || value
        return `${keyField} : ${valueField}`
      })
      : (fieldValue || null)
    break

  case 'param_groups':
    config.type = 'tag'
    config.value = Array.isArray(fieldValue)
      ? fieldValue.map(({ key, value }: any) => `${key} : ${Array.isArray(value) ? `${JSON.stringify(value)}` : value}`)
      : (fieldValue || null)

    break
  case 'cpu_util':
  case 'mem_util':
  case 'disk_util':
    config.value = Number(fieldValue).toFixed(2) + '%'
    config.class = fieldValue < 20 ? 'active' : ''
    break

  default:
    config.value = fieldValue ?? null
  }

  return config
})

export { parseDescConfig }
