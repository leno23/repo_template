import { $t, lang } from '@/common/utils/i18n'
import { enumBusinessType } from '@/const/business'
import { enumSubAccountAccessMode, SubAccountAccessModeEnum } from '@/const/cloudAccount'
import { getBooleanText, getProvidertext, subAccountType, getInternetChargeTypeText, getBusinessTypeText, expandArr, formatToLine, objToStr, expandParams, getDiskTypeText } from './tool'
import _ from 'lodash'

/** --数据处理函数-- */
export const dataInit = (type:string, data:any) => {
  switch (type) {
  // 申请网段
  case 'network_segment':
    return handleRequestNetworkSegment(data)
    // 申请机器
  case 'request_create_host':
    return handleRequestCreateHostOtherParams(data)
    // 申请机器的（模板信息）
  case 'templateInfo':
    return handleTemplateInfoParams(data)
    // 申请云账号
  case 'request_cloud_account':
    return handleRequestCloudAccount(data)
    // 导入云账号
  case 'request_export_cloud_account':
    return handleRequestExportCloudAccount(data)
    // 关联云账号
  case 'request_binding_cloud_account':
    return handleRequestBindingCloudAccount(data)
    // 预算变更申请
  case 'request_change_business_budget':
    return handleRequestChangeBusinessBudget(data)
    // vpc创建
  case 'request_create_vpc':
    return handleRequestCreateVpc(data)
    // 子网创建
  case 'request_create_subnet':
    return handleRequestCreateSubnet(data)
    // 创建子账号
  case 'request_add_sub_account':
    return handleRequestAddSubAccount(data)
    // 申请业务权限
  case 'request_business_auth':
    return handleRequestBusinessAuth(data)
    // 删除、禁用 子账号
  case 'request_delete_sub_account':
  case 'request_forbid_sub_account':
    return handleDeleteOrForbidSubAccount(data)
    // 删除子网/VPC
  case 'request_delete_subnet':
  case 'request_delete_vpc':
    return handleRequestDeleteSubnetOrVpc(data)
    // 网络服务反向拨测
  case 'request_create_reverse_detect':
    return handleRequestReverseDetect(data)
    // 默认把data展开为 key：value
  default:
    return formatToLine(expandParams(data), 2)
  }
}
// 处理 申请机器 类型的 other_params
const handleRequestCreateHostOtherParams = (data:any) => {
  const { other_params } = data
  const publicOtherParams = [
    { label: '云账号ID', value: data?.account_id },
    { label: '主机名', value: other_params?.name },
    { label: '创建数量', value: other_params?.instance_count }
  ]
  data?.account_name && publicOtherParams.splice(1, 0, { label: '云账号名', value: data?.account_name })
  return [
    ...formatToLine([...publicOtherParams, ...getDiffOtherParams(data)], 2)
  ]
}
const getDiffOtherParams = (data:any) => {
  const { other_params, provider_key } = data
  let tempArr
  switch (provider_key) {
  case 'tencent':
    tempArr = [
      { label: '云地域', value: other_params?.region },
      { label: '可用区', value: other_params?.zone },
      { label: 'Vpc ID', value: other_params?.vpc_id },
      { label: '子网ID', value: other_params.subnet_id },
      { label: '标签', value: objToStr(other_params?.tags) },
      { label: '安全组', value: expandArr(other_params?.security_groups) }
    ]
    if (other_params?.password) {
      tempArr.push({ label: '登录方式', value: $t('密码') })
    } else if (other_params?.key_name) {
      tempArr.push({ label: '秘钥', value: other_params?.key_name })
    } else {
      tempArr.push({ label: '登录方式', value: $t('创建后设置') })
    }
    break
  case 'azure':
    tempArr = [
      { label: '资源组', value: other_params?.resource_group },
      { label: '云地域', value: other_params?.zone },
      { label: '安全组ID', value: other_params?.network_security_group_id },
      { label: '用户名', value: other_params?.admin_username },
      { label: '子网ID', value: other_params?.subnet_id },
      { label: '标签', value: objToStr(other_params?.tags) }
    ]
    if (other_params?.admin_password) {
      tempArr.push({ label: '登录方式', value: $t('密码') })
    } else if (other_params?.public_key) {
      tempArr.push({ label: '秘钥', value: other_params?.public_key })
    } else {
      tempArr.push({ label: '登录方式', value: $t('创建后设置') })
    }
    break
  case 'huawei':
    tempArr = [
      { label: '云地域', value: other_params?.region },
      { label: '可用区', value: other_params?.availability_zone },
      { label: '子网ID', value: other_params?.subnet_id },
      { label: '标签', value: objToStr(other_params?.tags) },
      { label: '安全组ID', value: expandArr(other_params?.security_group_ids) }
    ]
    if (other_params?.admin_pass) {
      tempArr.push({ label: '登录方式', value: $t('密码') })
    } else if (other_params?.key_pair) {
      tempArr.push({ label: '秘钥', value: other_params?.key_pair })
    } else {
      tempArr.push({ label: '登录方式', value: $t('创建后设置') })
    }
    break
  case 'aws':
    tempArr = [
      { label: '云地域', value: other_params?.region },
      { label: '可用区', value: other_params?.zone },
      { label: '子网ID', value: other_params?.subnet_id },
      { label: '安全组ID', value: expandArr(other_params?.security_groups) }
    ]
    if (other_params?.key_name) {
      tempArr.push({ label: '秘钥名', value: other_params?.key_name })
    } else {
      tempArr.push({ label: '登录方式', value: $t('创建后设置') })
    }
    break
  case 'gcp':
    tempArr = [
      { label: '云地域', value: other_params?.region },
      { label: '可用区', value: other_params?.zone },
      { label: 'Vpc Link', value: other_params?.vpc_link },
      { label: '子网Link', value: other_params?.subnet_link },
      { label: '标签', value: objToStr(other_params?.labels) }
    ]
    break
  default:
    tempArr = expandParams(other_params)
  }
  return tempArr
}
// 处理 申请机器 类型的 模板信息
const handleTemplateInfoParams = (data:any) => {
  const { config, provider_key } = data
  const publicParams = [
    { label: '模板名', value: data[`name_${lang}`] },
    { label: '云厂商', value: getProvidertext(data.provider_key) },
    { label: '设备规格', value: config?.specification },
    { label: '操作系统', value: config?.os },
    { label: '设备类型', value: config?.type }
  ]
  const publicFields = { use: '用途', disk_type: '磁盘类型', disk_size: '磁盘容量(GB)', num: '数量' }// delete_with_instance: '随实例释放',
  return [
    [
      { type: 'TITLE', value: $t('主机模板参数') }
    ],
    ...formatToLine([...publicParams, ...getDiffTemplateParams(data)], 2),
    [{
      type: 'COLUMNTABLE',
      label: '磁盘信息',
      value: {
        fields: ['tencent', 'aws'].includes(provider_key) ? Object.assign(publicFields, { delete_with_instance: '随实例释放' }) : publicFields,
        list: getDiffDiskTableData(data)
      }
    }]
  ]
}
const getDiffTemplateParams = (data:any) => {
  const { config, provider_key } = data
  let tempArr
  switch (provider_key) {
  case 'tencent':
    tempArr = [
      { label: '开启外网ip', value: getBooleanText(config?.allocate_public_ip) },
      { label: '公网计费模式', value: getInternetChargeTypeText(config?.internet_charge_type) },
      { label: '公网带宽', value: (config?.internet_max_bandwidth_out) + ' Mbps/s' },
      { label: '镜像ID', value: config?.image_id },
      { label: '镜像名', value: config?.image_name }
    ]
    break
  case 'azure':
    tempArr = [
      { label: '镜像', value: (config?.storage_image_reference?.offer) + ' | ' + (config?.storage_image_reference?.sku) },
      { label: '镜像名', value: config?.image_name },
      { label: '开启外网ip', value: getBooleanText(config?.allocate_public_ip) }
    ]
    break
  case 'huawei':
    tempArr = [
      { label: '镜像ID', value: config?.image_id },
      { label: '镜像名', value: config?.image_name },
      { label: '开启外网ip', value: getBooleanText(config?.allocate_public_ip) }
    ]
    config?.public_ip_type && tempArr.push({ label: '外网ip类型', value: $t({ '5_bgp': '全动态BGP', '5_sbgp': '静态BGP' }[config?.public_ip_type + ''] || '') })
    config?.public_ip_size && tempArr.push({ label: '公网带宽', value: config?.public_ip_size + ' Mbit/s' })
    config?.public_ip_share_type && tempArr.push({ label: '公网带宽类型', value: $t({ PER: '专用带宽', WHOLE: '共享带宽' }[config?.public_ip_share_type + ''] || '') })
    config?.public_ip_charge_mode && tempArr.push({ label: '公网计费模式', value: $t({ traffic: '按流量计费', bandwidth: '按带宽计费' }[config?.public_ip_charge_mode + ''] || '') })
    break
  case 'aws':
    tempArr = [
      { label: '镜像ID', value: config?.ami },
      { label: '镜像名', value: config?.image_name },
      { label: '开启外网ip', value: getBooleanText(config?.allocate_public_ip) }
    ]
    break
  case 'gcp':
    tempArr = [
      { label: '镜像Link', value: config?.image },
      { label: '镜像名', value: config?.image_name },
      { label: '开启外网ip', value: getBooleanText(config?.allocate_public_ip) }
    ]
    break
  default:
    tempArr = expandParams(config)
  }
  return tempArr
}
// 处理 申请机器 类型的 磁盘信息
const handleDataDiskInfo = (keyMap:any, list:any[], useLabel:string, provider_key:'aws'|'azure'|'huawei'|'gcp'|'tencent') => {
  // 兼容不同厂商的 字段
  const { type_key, size_key, delete_key } = keyMap
  const resArr:any[] = []
  if (!(list && list.length)) return []
  for (let i = 0; i < list.length; i++) {
    const diskTypeText = getDiskTypeText(list[i][type_key], provider_key)
    // 找出相同的盘
    const SameOne = resArr.find((item:any) => {
      return (item.disk_type === diskTypeText) && (item.disk_size === list[i][size_key])
    })
    if (SameOne) { // 相同的盘，num++
      SameOne.num++
    } else { // 没有相同的，push
      resArr.push({ use: useLabel, disk_type: diskTypeText, disk_size: list[i][size_key], delete_with_instance: getBooleanText(list[i][delete_key]), num: 1 })
    }
    // console.log({ SameOne, resArr, list, keyMap })
  }
  return resArr
}
const getDiffDiskTableData = (data:any) => {
  const { config, provider_key } = data
  let tableData:any
  switch (provider_key) {
  case 'tencent':
    tableData = [
      { disk_type: getDiskTypeText(config?.system_disk_type, provider_key), disk_size: config?.system_disk_size, delete_with_instance: '', num: 1, use: '系统盘' },
      ...handleDataDiskInfo({ type_key: 'data_disk_type', size_key: 'data_disk_size', delete_key: 'delete_with_instance' }, config?.data_disks || [], '数据盘', provider_key)
    ]
    break
  case 'azure':
    tableData = [
      { disk_type: getDiskTypeText(config?.storage_os_disk?.managed_disk_type, provider_key), disk_size: config?.storage_os_disk?.disk_size_gb, delete_with_instance: '', num: 1, use: '系统盘' },
      ...handleDataDiskInfo({ type_key: 'managed_disk_type', size_key: 'disk_size_gb', delete_key: '' }, config?.storage_data_disk || [], '数据盘', provider_key)
    ]
    break
  case 'huawei':
    tableData = [
      { disk_type: getDiskTypeText(config?.system_disk_type, provider_key), disk_size: config?.system_disk_size, delete_with_instance: '', num: 1, use: '系统盘' },
      ...handleDataDiskInfo({ type_key: 'type', size_key: 'size', delete_key: '' }, config?.data_disks || [], '数据盘', provider_key)
    ]
    break
  case 'aws':
    tableData = [
      ...handleDataDiskInfo({ type_key: 'volume_type', size_key: 'volume_size', delete_key: 'delete_on_termination' }, config?.root_block_device || [], '系统盘', provider_key),
      ...handleDataDiskInfo({ type_key: 'volume_type', size_key: 'volume_size', delete_key: 'delete_on_termination' }, config?.ebs_block_device || [], '数据盘', provider_key)
    ]
    break
  case 'gcp':
    tableData = [
      { disk_type: getDiskTypeText(config?.boot_disk_type, provider_key), disk_size: config?.boot_disk_size, delete_with_instance: config?.boot_disk_auto_delete, num: 1, use: '系统盘', provider_key },
      ...handleDataDiskInfo({ type_key: 'type', size_key: 'size', delete_key: '' }, config?.compute_disk || [], '数据盘', provider_key)
    ]
    break
  default:
    tableData = []
  }
  return tableData
}
// 申请网段
const handleRequestNetworkSegment = (data:any) => {
  return formatToLine([
    { label: '云账号ID', value: data?.account_id },
    { label: 'IP块数量', value: data?.block_num },
    { label: '网段头', value: data?.head },
    { label: '业务名称', value: data[`business_name_${lang}`] },
    { label: '账号名称', value: data?.account_name },
    { label: '云厂商', value: getProvidertext(data?.provider_key) }
  ], 2)
}
// 申请云账号
const handleRequestCloudAccount = (data:any) => {
  const genre = _.get(_.find(enumBusinessType, { value: data.genre }), 'label', '')
  const subAccount = _.get(data, 'sub_account', [])
  const subAccountList = _.map(subAccount, (item:{access_type:SubAccountAccessModeEnum, role:any}) => {
    return {
      ...item,
      // role: _.get(_.find(enumSubAccountRoleList, { value: item.role }), 'label', ''),
      access_type: enumSubAccountAccessMode[item.access_type] ? enumSubAccountAccessMode[item.access_type][`label_${lang}`] : item.access_type
    }
  })
  const resArr = formatToLine([
    { label: '云厂商', value: getProvidertext(data.provider_key) },
    { label: '运营产品', value: data?.product },
    { label: '账号名', value: data?.cloud_account_name },
    { label: '账号类型', value: genre },
    { label: 'OBS ID', value: data?.obs_id },
    { label: '账号维护人', value: expandArr(data?.maintainer) },
    { label: '预估每月成本', value: data?.cost_estimate },
    { label: '需求背景说明', value: data?.statement_needs }
  ], 2)
  if (subAccountList && subAccountList.length) {
    resArr.push([{
      type: 'COLUMNTABLE',
      label: '初始子账号',
      value: {
        fields: subAccountType,
        list: subAccountList
      }
    }])
  }
  return resArr
}
// 导入云账号
const handleRequestExportCloudAccount = (data:any) => {
  return [
    ...formatToLine([
      { label: '云厂商', value: getProvidertext(data.provider_key) },
      { label: '云账号名称', value: data?.name },
      { label: '关联业务', value: getBooleanText(data?.is_relation) },
      { label: 'UIN', value: data?.uin },
      { label: '认证秘钥', value: data?.credentials },
      { label: '描述', value: data?.description }
    ], 2)
  ]
}
// 关联云账号
const handleRequestBindingCloudAccount = (data:any) => {
  return [
    ...formatToLine([
      { label: '关联账号', value: expandArr(data.name_list) },
      { label: '描述', value: data?.description },
      { label: '业务ID', value: data?.business_id },
      { label: '业务名', value: data?.business_name }
    ], 2)
  ]
}
// 创建子账号
const handleRequestAddSubAccount = (data:any) => {
  const subAccount = _.get(data, 'sub_account', [])
  const subAccountList = _.map(subAccount, (item:{access_type:SubAccountAccessModeEnum, role:any}) => {
    return {
      ...item,
      // role: _.get(_.find(enumSubAccountRoleList, { value: item.role }), 'label', ''),
      access_type: enumSubAccountAccessMode[item.access_type] ? enumSubAccountAccessMode[item.access_type][`label_${lang}`] : item.access_type
    }
  })
  const resArr = formatToLine([
    { label: '云账号名', value: data?.name },
    { label: '云厂商', value: getProvidertext(data.provider_key) },
    { label: '理由', value: data?.reason },
    { label: '备注', value: data?.notes }
  ], 2)
  if (subAccountList && subAccountList.length) {
    resArr.push([{
      type: 'COLUMNTABLE',
      label: '子账号',
      value: {
        fields: subAccountType,
        list: subAccountList
      }
    }])
  }
  return resArr
}
// 预算变更申请
const handleRequestChangeBusinessBudget = (data:any) => {
  return [
    ...formatToLine([
      { label: '当年年度', value: data?.year },
      { label: '当年总额度', value: data?.year_budget_balance + ` ${$t('元')}` },
      { label: '追加理由', value: data?.reason }
    ], 2)
  ]
}
// VPC创建
const handleRequestCreateVpc = (data:any) => {
  const resArr = [
    ...formatToLine([
      { label: '账号ID', value: data?.account_id },
      { label: '地区', value: data?.region },
      { label: '名称', value: data?.vpc_name },
      { label: 'IP数量', value: data?.ip_count },
      { label: '云厂商', value: getProvidertext(data.provider_key) },
      { label: '网段', value: data?.network_segment }
    ], 2)
  ]
  if (data?.subnets && data?.subnets?.length) {
    const fields = Object.assign({}, { subnet_name: '名称', ip_count: 'IP数量' }, data.provider_key === 'gcp' ? { region: '云地域' } : { zone: '可用区' })
    resArr.push([{
      type: 'COLUMNTABLE',
      label: '子网',
      value: {
        fields,
        list: data?.subnets
      }
    }])
  }
  return resArr
}
// 子网创建
const handleRequestCreateSubnet = (data:any) => {
  const resArr = [
    ...formatToLine([
      { label: '账号ID', value: data?.account_id },
      { label: 'vpc id', value: data?.vpc_id },
      { label: 'vpc cidr', value: data?.vpc_cidr_block },
      { label: '网段', value: data?.network_segment },
      { label: '地区', value: data?.region },
      { label: '云厂商', value: data?.provider_key }
    ], 2)
  ]
  if (data?.subnets && data?.subnets?.length) {
    const fields = Object.assign({}, { subnet_name: '名称', ip_count: 'IP数量' }, data.provider_key === 'gcp' ? { region: '云地域' } : { zone: '可用区' })
    resArr.push([{
      type: 'COLUMNTABLE',
      label: '子网',
      value: {
        fields,
        list: data?.subnets
      }
    }])
  }
  return resArr
}
// 申请业务权限
const handleRequestBusinessAuth = (data:any) => {
  return formatToLine([
    { label: '中文名', value: data.name_zh },
    { label: '英文名', value: data.name_en },
    { label: '业务类型', value: getBusinessTypeText(data?.genre) },
    { label: '业务ID', value: data?.business_id }
  ], 2)
}
// 删除、禁用 子账号
const handleDeleteOrForbidSubAccount = (data:any) => {
  const { sub_account } = data
  const list = sub_account.map((item:{account_type:number, provider_key:string}) => {
    return {
      ...item,
      account_type: { 1: $t('个人子账号'), 2: $t('平台子账号') }[item.account_type] || item.account_type
    }
  })
  return [
    ...formatToLine([
      { label: '账号ID', value: data.account_id },
      { label: '账号名', value: data.account_name },
      { label: '云厂商', value: getProvidertext(data.provider_key) },
      { label: '理由', value: data.reason },
      { label: '备注', value: data.notes }
    ], 2),
    [{
      type: 'COLUMNTABLE',
      label: '子账号',
      value: {
        fields: { account_type: '账号类型', origin_name: '用户名', email: '邮箱' },
        list
      }
    }]
  ]
}
// 删除子网/VPC
const handleRequestDeleteSubnetOrVpc = (data:any) => {
  return formatToLine([
    { label: '业务ID', value: data?.business_id },
    { label: '账号ID', value: data.account_id },
    { label: '账号名', value: data.account_name },
    { label: '云厂商', value: getProvidertext(data.provider_key) },
    { label: '地区', value: data?.region },
    { label: '实例名称', value: data?.origin_name },
    { label: '备注', value: data.notes }
  ], 2)
}
// 反向网络拨测
const handleRequestReverseDetect = (data: any) => {
  return [
    ...formatToLine([
      { label: '目的', value: data?.purpose },
      { label: '时间', value: `${data.start_time} ~ ${data.end_time}` },
      { label: '拨测类型', value: data?.detect_type },
      { label: '单次发包个数', value: data?.packet_num + ' （个/次）' },
      { label: '发包间隔', value: data?.packet_interval + ' （秒）' },
      { label: '包大小', value: data?.packet_size + ' （字节）' }
      // { label: '测速配置', value: data.config }
    ], 2),
    [{
      type: 'COLUMNTABLE',
      label: '测速配置',
      value: {
        fields: { cloud_net: '测速云厂', server_region: '地区', server_ips: '服务器', cover_iso: '覆盖国家' },
        list: data.config
      }
    }]
  ]
}

/** 注意:
 * 1：[label:'',value:'']list 不需要管奇数还是偶数个,直接传进去formatToLine函数就行,会自动换行，不够会自动补齐空的[label:'',value:'']或占满整行;
 *
 * 2：value值兜底,集中在函数处理了;
 *
 * 3：label 在展示位置已经包裹$t适配国际化，本文件可不用处理。
      value 没有加，value可能的值类型很多,$t接收string;全部加可能报错 且 没必要，要适配国际化可再本文件加。
 *
 * 4:这代表，渲染3行数据，每行占两个label:value
      [
        [{label:'',value:'}, {label:'',value:'}],
        [{label:'',value:'}, {label:'',value:'}],
        [{label:'',value:'}, {label:'',value:'}]
      ]
 *
 * 5：这代表TITLE,渲染一个title独占一行
 *    [{ type: 'TITLE', value: '子账号' }]
 *
 * 6：这代表COLUMNTABLE，用vxe-table渲染一个列表;
     list作为vxe-table的data；
     fields循环后，key -> field,value -> title
     [{
         type: 'COLUMNTABLE',
         label:'',  //可有可无，有就渲染
         value: {
           fields: {key：value，key1：value1},  //循环后，key作为取值的field，value作为vxe-table列的title
           list: []  //vxe-table的data
         }
      }]

* 7：组合使用：先渲染三行label：value，再渲染一个title，再渲染一个vxe-table
      [
        [{label:'',value:'}, {label:'',value:'}],
        [{label:'',value:'}, {label:'',value:'}],
        [{label:'',value:'}]，

        [{ type: 'TITLE', value: '子账号' }]，

        [{
         type: 'COLUMNTABLE',
         label:'',
         value: {
           fields: {key：value，key1：value1},
           list: []
         }
        }]
      ]
 */
