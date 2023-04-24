import { InternetChargeTypeMap, DiskTypeMap, businessTypeMap, AwsDiskTypeMap, AzureDiskTypeMap, GcpDiskTypeMap, HuaweiDiskTypeMap } from '@/api/workOrder/index'
import { lang } from '@/common/utils/i18n'
// 翻译磁盘类型
const typeTextMap = {
  aws: AwsDiskTypeMap,
  azure: AzureDiskTypeMap,
  gcp: GcpDiskTypeMap,
  huawei: HuaweiDiskTypeMap,
  tencent: DiskTypeMap
}
export const getDiskTypeText = (type:string, provider_key:'aws'|'azure'|'huawei'|'gcp'|'tencent') => {
  const textMap = typeTextMap[provider_key] || []
  if (!(textMap && textMap.length)) return ''
  let str = ''
  textMap.forEach((item:{value:string, label:string}) => {
    if (item.value === type) {
      str = item.label
    }
  })
  return str || type
}
// boolean -> 是否
export const getBooleanText = (type:any) => {
  if (type === true) return { zh: '是', en: 'yes' }[lang]
  else if (type === false) return { zh: '否', en: 'no' }[lang]
  else return type
}
// 翻译 云厂商 provider_key
export const providerOptions = [
  { label_zh: '腾讯云', label_en: 'Tencent Cloud', value: 'tencent' },
  { label_zh: '亚马逊', label_en: 'Amazon Web Services', value: 'aws' },
  { label_zh: '谷歌云', label_en: 'Google Cloud', value: 'gcp' },
  { label_zh: '微软云', label_en: 'Microsoft Azure', value: 'azure' },
  { label_zh: '华为云', label_en: 'HUAWEI Cloud', value: 'huawei' }
]
export const getProvidertext = (provider_key:any) => {
  const provider = providerOptions.find(item => item.value === provider_key)
  return (provider && provider[`label_${lang}`]) || provider_key
}

export const subAccountType = {
  role: '角色',
  email: '邮箱',
  name: '子账号名',
  access_type: '访问方式'
}
// 翻译 公网计费模式
export const getInternetChargeTypeText = (val:string) => {
  if (!val) return val
  const temp = InternetChargeTypeMap.find((item) => {
    return item?.value === val
  })
  return temp ? temp[lang] : val
}
// 翻译 业务类型
export const getBusinessTypeText = (val:string) => {
  if (!val) return val
  const temp = businessTypeMap.find((item) => {
    return item?.value === val
  })
  return temp ? temp[lang] : val
}
// Array：[a,b] => String：a，b
export const expandArr = (arr:[]) => {
  if (arr && arr.length) {
    return arr.join('，')
  } else {
    return ''
  }
}
// 将arr格式化成一行一行 arr:any[]，num为一行几个
export const formatToLine = (arr:any[], num:number) => {
  const newArr = []
  for (let i = 0; i < arr.length; i = i + num) {
    const lineArr:any[] = []
    for (let j = 0; j < num; j++) {
      const item = arr[i + j]
      if (item && item.label !== '') { // label不能为空
        lineArr.push({
          label: item.label,
          value: checkVal(item.value)
        })
      }
    }
    // 一行展示 大于 1，但小于指定个数 num，则补齐到num个，对齐好看点
    if (lineArr.length > 1 && lineArr.length < num) {
      for (let i = 0; i <= (num - lineArr.length); i++) {
        lineArr.push({ label: '', value: '' })
      }
    }
    newArr.push(lineArr)
  }
  // console.log({ arr, newArr })
  return newArr
}
export const checkVal = (val:any) => {
  if (typeof val === 'object' && val !== null) return JSON.stringify(val)// 如果是引用对象要变成string格式
  if (!val && val !== 0) return ''// 排除一下null undefined等无意义的（但0有意义）
  return val
}
// 将对象{key:value} 处理成 string-> 'key1：value1,key2：value2'
export const objToStr = (obj:any) => {
  let str = ''
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const val = obj[key]
      str = str ? (str + `，${key}: ${val}`) : (`${key}: ${val}`)
    }
  }
  return str
}
// 展开 {key:value} -> [{label:key,value:value}]
export const expandParams = (data:any) => {
  const arr = []
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      arr.push({
        label: key,
        value: data[key]
      })
    }
  }
  return arr
}
