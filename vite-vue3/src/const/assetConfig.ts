import { reduce } from 'lodash'
import { $t } from '@/common/utils/i18n'

export interface AssetTypeConfig {
  label: string,
  value: string,
  placeholder: {
    name_zh: string,
    name_en: string
  }
}
export interface AssetCategory {
  name: string,
  value: string,
  assets: AssetTypeConfig[]
}

export const assetCategoryList: AssetCategory[] = [
  {
    name: $t('计算资源'),
    value: 'calculation',
    assets: [
      {
        label: 'VM',
        value: 'vm',
        placeholder: {
          name_zh: '搜索IP;云实例名;云厂设备ID等',
          name_en: 'Search IP; Cloud instance name; Cloud factory equipment ID, etc'
        }
      },
      {
        label: 'Kubernetes',
        value: 'k8scluster',
        placeholder: {
          name_zh: '搜索云厂K8S名;云厂设备K8SID等',
          name_en: 'Search Cloud asset name;Cloud factory equipment ID, etc'
        }
      }
    ]
  },
  {
    name: $t('数据库'),
    value: 'database',
    assets: [
      {
        label: 'Mysql',
        value: 'mysql',
        placeholder: {
          name_zh: '搜索云资产名;云厂设备ID等',
          name_en: 'Search Cloud asset name; Cloud factory equipment ID, etc'
        }
      },
      {
        label: 'TcaplusDB',
        value: 'tcaplus',
        placeholder: {
          name_zh: '搜索云资产名;云厂设备ID等',
          name_en: 'Search Cloud asset name;Cloud factory equipment ID, etc'
        }
      },
      {
        label: 'MongoDB',
        value: 'mongo',
        placeholder: {
          name_zh: ' 搜索云资产名;云厂设备ID等',
          name_en: 'Search Cloud asset name; Cloud factory equipment ID, etc'
        }
      },
      {
        label: 'Redis',
        value: 'redis',
        placeholder: {
          name_zh: '搜索云厂Redis实例名;云厂设备ID;内网地址;外网地址等',
          name_en: 'Search the redis instance name of the cloud factory; Cloud factory equipment ID; Intranet address; Internet address, etc'
        }
      },
      {
        label: 'Postgresql',
        value: 'postgresql',
        placeholder: {
          name_zh: '搜索云厂实例名;云厂设备ID等',
          name_en: 'Search the instance name of the cloud factory; Cloud factory equipment ID, etc'
        }
      }
    ]
  },
  {
    name: $t('网络'),
    value: 'network',
    assets: [
      {
        label: 'VPC',
        value: 'vpc',
        placeholder: {
          name_zh: '搜索云厂VPC示例名;云厂设备ID',
          name_en: 'Search the VPC example name of the cloud factory; Cloud factory equipment ID'
        }
      },
      {
        label: $t('子网'),
        value: 'sub_vpc',
        placeholder: {
          name_zh: '搜索云资产名;云厂设备ID等',
          name_en: 'Search Cloud asset name; Cloud factory equipment ID, etc'
        }
      },
      {
        label: $t('专线通道'),
        value: 'dc',
        placeholder: {
          name_zh: '搜索专用通道ID;专用通道名称等',
          name_en: 'Search for dedicated channel ID; Name of dedicated channel, etc'
        }
      },
      {
        label: $t('负载均衡'),
        value: 'lb',
        placeholder: {
          name_zh: '搜索云厂LB资产名;云厂设备ID;内网地址等',
          name_en: 'Search for dedicated channel ID; Name of dedicated channel; private_address, etc'
        }
      },
      {
        label: 'DNS',
        value: 'dns',
        placeholder: {
          name_zh: '搜索云厂DNS资产名;云厂设备DNS ID等',
          name_en: 'Search for dedicated channel ID; Name of dedicated channel; etc'
        }
      },
      {
        label: 'CDN',
        value: 'cdn',
        placeholder: {
          name_zh: '搜索云厂CDN资产名;云厂设备CDNID等',
          name_en: 'Search for dedicated channel ID; Name of dedicated channel; private_address, etc'
        }
      },
      {
        label: 'SSL',
        value: 'ssl',
        placeholder: {
          name_zh: '搜索云厂SSL资产名;云厂设备SSL等',
          name_en: 'Search for dedicated channel ID; Name of dedicated channel; private_address, etc'
        }
      },
      {
        label: 'EIP',
        value: 'eip',
        placeholder: {
          name_zh: '搜索云厂EIP资产名;云厂设备EIP id等',
          name_en: 'Search for dedicated channel ID; Name of dedicated channel; private_address, etc'
        }
      }
    ]
  },
  {
    name: $t('存储'),
    value: 'storage',
    assets: [
      {
        label: $t('对象存储'),
        value: 'cos',
        placeholder: {
          name_zh: '搜索云厂COS实例名;云厂设备ID等',
          name_en: 'Search Cloud asset name; Cloud factory equipment ID, etc'
        }
      },
      {
        label: 'CFS',
        value: 'cfs',
        placeholder: {
          name_zh: '搜索文件系统名称;文件系统ID等',
          name_en: 'Search Cloud asset name; Cloud factory equipment ID, etc'
        }
      },
      {
        label: 'CBS',
        value: 'cbs',
        placeholder: {
          name_zh: '搜索云厂名称;云厂云盘ID等',
          name_en: 'Search Cloud asset name; Cloud factory equipment ID, etc'
        }
      }
    ]
  },
  {
    name: $t('中间件'),
    value: 'middleware',
    assets: [
      {
        label: 'Kafka',
        value: 'kafka',
        placeholder: {
          name_zh: '搜索云厂Kafka实例名;云厂设备Kafka ID等',
          name_en: 'Search Cloud asset name; Cloud factory equipment ID, etc'
        }
      },
      {
        label: 'ES',
        value: 'es',
        placeholder: {
          name_zh: '搜索云厂ES实例名;云厂设备ES ID等',
          name_en: 'Search Cloud asset name; Cloud factory equipment ID, etc'
        }
      }
    ]
  },
  {
    name: '大数据',
    value: 'bigdata',
    assets: [
      {
        label: 'MapReduce',
        value: 'emr',
        placeholder: {
          name_zh: '搜索云厂Emr实例名;云厂设备ID等',
          name_en: 'Search Cloud asset name;Cloud factory equipment ID, etc'
        }
      },
      {
        label: 'ClickHouse',
        value: 'clickhouse',
        placeholder: {
          name_zh: '搜索云厂ClickHouse实例名;云厂设备ID等',
          name_en: 'Search Cloud asset name; Cloud factory equipment ID, etc'
        }
      }
    ]
  },
  {
    // IAM和子账号名字在前端调换，但value和后端暂时保持一致
    // name: $t('子账号'),
    name: 'IAM',
    value: 'sub_account',
    assets: [
      {
        // label: 'IAM',
        label: $t('子账号'),
        value: 'iam',
        placeholder: {
          name_zh: '搜索子用户用户名;子用户用户UID等',
          name_en: 'Search for subuser username; subuser uin, etc'
        }
      }
    ]
  }

]

export const cloudProviders = {
  tencent: '腾讯云',
  aws: '亚马逊云',
  gcp: '谷歌云',
  huawei: '华为云',
  azure: '微软云',
  zenlayer: 'Zenlayer'
}

export const checkIps = [
  { value: 'private_ip_address__icontains', label: '内网IP' },
  { value: 'public_ip_address__icontains', label: '外网IP' },
  { value: 'accurate', label: '精确' }
]

export const assetTypeList = reduce(assetCategoryList, (result, item) => {
  return result.concat(item.assets)
}, [] as AssetTypeConfig[])

// 所有资产都不展示的资产字段
export const noDisplayAssetField = [
  'has_topo',
  'topo_names',
  'name',
  'operator',
  'bak_operator',
  'jms_access_users',
  'jms_recent_login',
  'created_at',
  'updated_at',
  'uid'
]

export const subAccountTypeMap = {
  1: $t('个人账号'),
  2: $t('平台子账号')
}

export const tcaplusRegionMap = [
  { zone: 'ap-beijing', name: '华北地区(北京)' },
  { zone: 'ap-guangzhou', name: '华南地区(广州)' },
  { zone: 'ap-hongkong', name: '港澳台地区(中国香港)' },
  { zone: 'ap-seoul', name: '亚太地区(首尔)' },
  { zone: 'ap-shanghai', name: '华东地区(上海)' },
  { zone: 'ap-singapore', name: '东南亚地区(新加坡)' },
  { zone: 'eu-frankfurt', name: '欧洲地区(法兰克福)' },
  { zone: 'na-siliconvalley', name: '美国西部(硅谷)' },
  { zone: 'na-ashburn', name: '美国东部(弗吉尼亚)' },
  { zone: 'eu-moscow', name: '欧洲地区(莫斯科)' },
  { zone: 'ap-tokyo', name: '亚太地区(东京)' },
  { zone: 'sa-saopaulo', name: '南美地区(圣保罗)' }
]
