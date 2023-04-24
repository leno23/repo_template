/* eslint-disable no-fallthrough */
import { dayjs } from '@/common/plugins/Tool'
import { $t, lang } from '@/common/utils/i18n'
import { cloudProviderMap, enumSubAccountStatus } from '@/const/cloudAccount'
import type { SubAccoutStatusEnum } from '@/const/cloudAccount'
import { subAccountTypeMap, noDisplayAssetField } from '@/const/assetConfig'
import { Tag as TTag, Button as TButton, MessagePlugin } from 'tdesign-vue-next'
import type { VxeGridProps, VxeTableDefines } from 'vxe-table'
// import { Grid as VxeGrid, Table as VxeTable } from 'vxe-table'
import { useBusinessStore } from '@/store/modules/business'
import { router } from '@/router'
import type { AssetListItem, AssetParseConfigField } from './Types'
import { reqAssetVpcSubList, reqCreateExportMission, reqExportFileStatus } from '@/api/ResourceManage/Asset'
import type { ExportAssetListPayload } from '@/api/ResourceManage/Asset'
import { requestErrorMsg, downLoadBlob } from '@/common/utils'

// * ----------------- 解析字段，给Colum生成props ------------------------
type RowArg = { row: AssetListItem }

const TableTag = ({ content }: { content: any }) => <TTag size='small' style='margin-right: 5px;' variant='light' theme='primary' content={content} />

const getColumnProps = ({ field, name, template, sortable }: AssetParseConfigField) => {
  const columnProps = {
    minWidth: 200,
    // showHeaderOverflow: true,
    // showOverflow: true,
    field,
    title: name,
    template,
    sortable
  } as VxeTableDefines.ColumnOptions

  let formatter = undefined as (({ row }: RowArg) => string) | undefined

  switch (field) {
  case 'created_at':
  case 'updated_at':
  case 'origin_dead_at':
  case 'min_created_at':
  case 'expiration_date':
  case 'origin_update_at':
  case 'origin_created_at':
  case 'origin_create_time':
  case 'origin_update_time':
    formatter = ({ row }) => row[field] ? dayjs(row[field]).format('YYYY-MM-DD HH:mm:ss') : ''; break

  case 'disk_shareable':
  case 'public_accessible':
  case 'is_high_availability':
  case 'certificate_deployable':
    formatter = ({ row }) => $t(row[field] ? '是' : '否'); break

  case 'console_login': // iam 子用户是否登入控制台
    formatter = ({ row }) => $t(row.console_login === '1' ? '是' : '否'); break

  case 'system_disk': // vm系统盘大小
    formatter = ({ row }) => row.system_disk?.disk_size || ''; break

  case 'data_disks': // vm数据盘大小
    // formatter = ({ row }:any) => _.map(row[item.field], target => target.disk_size).join('、')
    formatter = ({ row }) => row.data_disks?.map(({ disk_size }: { disk_size: number }) => disk_size).join(', '); break

  case 'jms_recent_login': // vm 跳板机JMS近期登入名单
  case 'jms_access_users': // vm 跳板机JMS权限名单
  case 'effective_dns': // dns 有效dns
  case 'origins': // cdn 主源站列表
  case 'security_group': // vm 安全组
    formatter = ({ row }) => row[field]?.join(', ') || ''
    break

  case 'operator': // 主要运维
  case 'bak_operator': // 备份运维
    formatter = ({ row }) => Array.isArray(row[field]) ? row[field].join(', ') : row[field]; break

  case 'provider_key': // 云厂商
    // formatter = ({ row }:any) => _.get(cloudProviders, `${row.provider_key}`, row.provider_key)
    formatter = ({ row }) => cloudProviderMap[row.provider_key as ProviderTypeEnum]?.[lang]; break

  case 'account_type': // iam 账号类型
    formatter = ({ row }) => subAccountTypeMap[row.account_type as 1 | 2] || ''; break

  case 'replica_sets':
    columnProps.slots = {
      default: ({ row }: RowArg) =>
        row.replica_sets?.map(({ replica_id, CacheClusterId }: any) => <TableTag content={replica_id || CacheClusterId} />)
    }; break

    // case 'param_groups':
    //   columnProps.slots = {
    //     default: ({ row }: RowArg) =>
    //       row.param_groups?.map(({ key, value }: any) => <TableTag content={`${key} : ${Array.isArray(value) ? `${JSON.stringify(value)}` : value}`} />)
    //   }; break

  case 'origin_tags':
    columnProps.slots = {
      default: ({ row }: RowArg) => row.origin_tags?.map(
        ({ TagKey, Key, key, TagValue, Value, value }: any) => {
          // 不同的资产类型，用的字段名不一样，直接枚举
          const keyField = TagKey || Key || key
          const valueField = TagValue || Value || value
          return <TableTag content={`${keyField} : ${valueField}`} />
        }
      )
    }; break

  case 'account_status':
    columnProps.slots = {
      default: ({ row }: RowArg) => {
        if (!row.account_status) return ''
        return enumSubAccountStatus[row.account_status as SubAccoutStatusEnum]?.[`label_${lang}`]
      }
    }; break

  case 'mount_targets':
    columnProps.slots = {
      default: ({ row }: RowArg) => {
        if (!row.mount_targets) return ''
        return row.mount_targets.map(({ MountTargetId }: any) => <TableTag content={MountTargetId} />)
      }
    }; break

  case 'listeners': // lb资产的 后端服务列表 字段
  case 'nodes': // k8s_cluster资产的 集群节点 字段; MapReduce
  case 'access_layer': // tcaplus资产的 接入层 字段
  case 'storage_layer': // tcaplus资产的 存储层 字段
    columnProps.slots = {
      default: ({ row }: RowArg) => {
        const { id: assetId, provider_key, asset_type: assetType } = row
        const jump = () => router.push({
          name: 'AssetFieldDetail',
          params: { business_id: useBusinessStore().currentBusinessId, assetType, assetId },
          query: { field_name: name, field, provider_key }
        })

        return <TButton size='small' variant='text' theme='primary' content='详情' onClick={jump}/>
      }
    }; break
  }

  columnProps.formatter = formatter

  return columnProps
}

const fieldParser = (fieldConfig: AssetParseConfigField[]) => fieldConfig
// 过滤掉不显示的字段
  .filter(item => !noDisplayAssetField.includes(item.field) && !item.hidden && !item.field.startsWith('ct__'))
  .map(item => getColumnProps(item))

const getTableProps = ({ fieldConfig, data, toolbar }: { fieldConfig: AssetParseConfigField[], data: AssetListItem[], toolbar?: boolean }) => {
  const filedColumn = (fieldConfig.length && data.length) ? fieldParser(fieldConfig) : [] // 因为config和list不是同时更新的，避免无用计算，给空数组

  return {
    data,
    height: 'auto',
    border: true,
    resizable: true,
    showHeaderOverflow: true,
    showOverflow: true,
    rowConfig: { keyField: 'id'/* isHover: true */ },
    columnConfig: { resizable: true },
    // emptyText: ' ',
    class: 'asset-main-table-class',
    expandConfig: {
      lazy: true,
      accordion: true,
      // Vpc资产展开子账号，目前只有这个展开逻辑，所以不需要加判断
      loadMethod: ({ row }: RowArg) => new Promise(resolve => {
        // if (asstInfo.activeName !== 'vpc') {
        //   resolve()
        //   return
        // }
        reqAssetVpcSubList(row.origin_uid).then(res => {
          row.subVpcList = res
        }).catch(err => requestErrorMsg(err.message)).finally(() => resolve())
      })
    },
    toolbarConfig: toolbar === false
      ? undefined
      : {
        custom: true,
        zoom: true,
        export: true,
        slots: { buttons: 'ToolbarLeft', tools: 'ToolbarRight' }
      },
    columns: [
      {
        field: 'id',
        visible: false,
        title: 'ID',
        minWidth: 60
      },
      ...filedColumn
    ]
  } as VxeGridProps
}

// * --------------- Vpc资产展开子账号 -------------------------
const getSubnetTableProps = ({ fieldConfig, data }: { fieldConfig: AssetParseConfigField[], data: AssetListItem[] }) => {
  const filedColumn = (fieldConfig.length && data.length) ? fieldParser(fieldConfig) : [] // 因为config和list不是同时更新的，避免无用计算，给空数组

  return {
    data,
    size: 'mini',
    maxHeight: 600,
    border: true,
    // resizable: true,
    showHeaderOverflow: true,
    showOverflow: true,
    rowConfig: { keyField: 'id'/* isHover: true */ },
    columnConfig: { resizable: true },
    columns: [
      ...filedColumn,
      {
        width: 180,
        fixed: 'right',
        title: $t('操作'),
        slots: {
          default: ({ row }) => {
            const { id: assetId, asset_type: assetType } = row
            const jump = () => router.push({
              name: 'AssetDetail',
              params: { /* business_id: useBusinessStore().currentBusinessId, */ assetType, assetId }
            })
            return <TButton size='small' variant='text' theme='primary' content='详情' onClick={jump}
            />
          }
        }
      }
    ]
  } as VxeGridProps
}

// * ------------------------------ 导出数据时处理列表字段值 --------------------------------------------------
const parseExportFiled = (item: AssetListItem) => {
  Object.keys(item).forEach(field => {
    const val = item[field]
    switch (field) {
    case 'origin_tags':
      item.origin_tags = val?.map(({ TagKey, Key, key, TagValue, Value, value }: any) => {
        // 不同的资产类型，用的字段名不一样，直接枚举
        const keyField = TagKey || Key || key
        const valueField = TagValue || Value || value
        return `${keyField}:${valueField}`
      }).join('      ')
      break

    case 'system_disk':
      item.system_disk = val?.disk_size || ''
      break

    case 'data_disks':
      item.data_disks = val?.map(({ disk_size }: { disk_size: number }) => disk_size).join(',')
      break

    case 'operator': // 主要运维
    case 'bak_operator': // 备份运维
    case 'effective_dns': // dns 有效dns
    case 'origins': // cdn 主源站列表
    case 'security_group': // vm 安全组
      item[field] = Array.isArray(val) ? val.join(', ') : val
      break

    case 'replica_sets':
      item.replica_sets = val?.map(({ replica_id, CacheClusterId }: any) => replica_id || CacheClusterId).join(', ')
      break

    case 'param_groups':
      item.param_groups = val?.map(({ key, value }: any) => `${key} : ${Array.isArray(value) ? `${JSON.stringify(value)}` : value}`)
      break

    case 'mount_targets':
      item.mount_targets = val?.map(({ MountTargetId }: any) => MountTargetId).join(', ')
      break

    case 'listeners': // lb资产的 后端服务列表 字段
    case 'nodes': // k8s_cluster资产的 集群节点 字段; MapReduce
    case 'access_layer': // tcaplus资产的 接入层 字段
    case 'storage_layer': // tcaplus资产的 存储层 字段
      item[field] = ''
      break
    }
  })
}
const exportDataParser = (data: AssetListItem[]) => {
  data.forEach(parseExportFiled)
}

// * -------------------------- listeners字段后端服务列表，弹窗table ------------------------------------
// const getListenersTableProps = (data: LinstenersItemModel[]) => ({
//   data,
//   size: 'mini',
//   border: true,
//   maxHeight: 500,
//   columnConfig: { resizable: true },
//   align: 'center',
//   columns: [
//     { width: 100, field: 'Url' },
//     { width: 100, field: 'Port' },
//     { width: 100, field: 'EniId' },
//     { width: 100, field: 'EndPort' },
//     { width: 100, field: 'Type' },
//     { width: 100, field: 'Domain' },
//     { width: 100, field: 'Weight' },
//     { width: 100, field: 'Protocol' },
//     { width: 100, field: 'InstanceId' },
//     { width: 100, field: 'ListenerId' },
//     { width: 100, field: 'LocationId' },
//     { width: 100, field: 'InstanceName' },
//     { width: 100, field: 'instance_port' },
//     { width: 100, field: 'RegisteredTime' },
//     { width: 100, field: 'PublicIpAddresses' },
//     { width: 100, field: 'PrivateIpAddresses' },
//     {
//       width: 100,
//       title: 'Targets',
//       type: 'expand',
//       slots: {
//         content: ({ row }: RowArg) => {
//           if (!row.Targets || !row.Targets.length) return ''
//           return (
//             <div style='padding: 10px; max-width: 500px; max-height: 300p; overflow: auto;'>
//               { JSON.stringify(row.Targets) }
//             </div>
//           )
//         }
//       }
//     }
//   ]
// }) as VxeGridProps

// const getListenersTargetsTableProps = (data: LinstenersItemModel['Targets']) => {
//   const columns = [
//     { width: 100, align: 'center', colKey: 'Port', title: 'Port' },
//     { width: 100, align: 'center', colKey: 'Type', title: 'Type' },
//     { width: 100, align: 'center', colKey: 'EniId', title: 'EniId' },
//     { width: 100, align: 'center', colKey: 'Weight', title: 'Weight' },
//     { width: 150, align: 'center', colKey: 'InstanceId', title: 'InstanceId' },
//     { width: 150, align: 'center', colKey: 'InstanceName', title: 'InstanceName' },
//     { width: 150, align: 'center', colKey: 'RegisteredTime', title: 'RegisteredTime' },
//     { width: 150, align: 'center', colKey: 'PublicIpAddresses', title: 'PublicIpAddresses' },
//     { width: 150, align: 'center', colKey: 'PrivateIpAddresses', title: 'PrivateIpAddresses' }
//   ] as TableProps['columns']

//   // Targets对象的key不固定，枚举所有key，只显示有值的字段给到Table
//   // columns = data!.length ? columns!.filter(item => data?.[0]?.[item.colKey as keyof LinstenersItemModel['Targets']]) : []

//   return {
//     rowKey: 'InstanceId',
//     data,
//     size: 'small',
//     maxHeight: 250,
//     // tableContentWidth: '800px',
//     columns
//   } as TableProps
// }

// const getListenersTableProps = (data: LinstenersItemModel[]) => {
//   let columns = [
//     { width: 100, align: 'center', colKey: 'Url', title: 'Url' },
//     { width: 100, align: 'center', colKey: 'Port', title: 'Port' },
//     { width: 100, align: 'center', colKey: 'EniId', title: 'EniId' },
//     { width: 100, align: 'center', colKey: 'EndPort', title: 'EndPort' },
//     { width: 100, align: 'center', colKey: 'Type', title: 'Type' },
//     { width: 100, align: 'center', colKey: 'Domain', title: 'Domain' },
//     { width: 100, align: 'center', colKey: 'Weight', title: 'Weight' },
//     { width: 100, align: 'center', colKey: 'Protocol', title: 'Protocol' },
//     { width: 150, align: 'center', colKey: 'InstanceId', title: 'InstanceId' },
//     { width: 150, align: 'center', colKey: 'ListenerId', title: 'ListenerId' },
//     { width: 150, align: 'center', colKey: 'LocationId', title: 'LocationId' },
//     { width: 150, align: 'center', colKey: 'InstanceName', title: 'InstanceName' },
//     { width: 150, align: 'center', colKey: 'instance_port', title: 'instance_port' },
//     { width: 150, align: 'center', colKey: 'RegisteredTime', title: 'RegisteredTime' },
//     { width: 150, align: 'center', colKey: 'PublicIpAddresses', title: 'PublicIpAddresses' },
//     { width: 150, align: 'center', colKey: 'PrivateIpAddresses', title: 'PrivateIpAddresses' }
//   ] as TableProps['columns']

//   // Linsteners对象的key不固定，枚举所有key，只显示有值的字段给到Table
//   columns = data.length ? columns!.filter(item => data[0][item.colKey as keyof LinstenersItemModel]) : []

//   return {
//     rowKey: 'ListenerId',
//     data,
//     size: 'small',
//     height: 600,
//     expandedRow: (h, { row }) => <TTable {...getListenersTargetsTableProps(row.Targets || [])} />,
//     columns
//   } as TableProps
// }

// const checkListeners = (data: LinstenersItemModel[]) => {
//   const tableProps = getListenersTableProps(data)

//   const dialogIns = DialogPlugin.confirm({
//     confirmBtn: null,
//     onClosed: () => dialogIns.destroy(),
//     header: '后端服务列表',
//     width: 1200,
//     top: '8vh',
//     body: () => <TTable {...tableProps} />
//   })
// }

// * ----------------------------------------------
// const getExportFileStatus = async () => {
//   await
// }

const exportTableHandler = async (params: ExportAssetListPayload) => {
  let exportId = ''

  try {
    exportId = (await reqCreateExportMission(params)).file_name
  } catch (err: any) {
    requestErrorMsg(err.message)
    return
  }

  let reqCount = 0
  await new Promise(resolve => {
    const checker = async () => {
      if (reqCount >= 240) { // 最长20分钟
        resolve(1)
        MessagePlugin.error('拉取导出文件超时')
        return
      }

      reqCount++

      try {
        await reqExportFileStatus(exportId)
      } catch (blob: any) {
        // 因为请求拦截器对code判断的原因，成功失败的数据都会走catch
        if (blob && blob.size) {
          downLoadBlob(params.file_name, blob)
          resolve(1)
        } else {
          setTimeout(checker, 5000) // 5秒轮询
        }
      }
    }

    setTimeout(checker, 2000) // 2秒触发第一次
  })
}

export { getTableProps, getSubnetTableProps, exportDataParser, exportTableHandler }
