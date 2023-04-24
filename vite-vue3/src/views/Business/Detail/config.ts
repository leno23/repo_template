import { $t, lang } from '@/common/utils/i18n'
import dayjs from 'dayjs'
import {
  enumAppDomainType,
  enumAppType,
  // enumBusinessType,
  enumComponentType,
  enumGameType,
  enumLevel,
  enumReleaseMode,
  enumSensitiveLevel,
  enumStage,
  enumStatus
} from '@/const/business'

export const descriptionsList = [
  {
    label: $t('业务名'),
    key: `name_${lang}`,
    icon: 'layers'
  },
  {
    label: $t('业务ID'),
    key: 'id',
    icon: 'view-module'
  },

  {
    label: $t('业务类型'),
    key: 'genre',
    icon: 'view-list',
    span: 2
  },
  {
    label: $t('业务状态'),
    key: 'status',
    icon: 'root-list',
    format (val:any) {
      const res = enumStatus.find(item => item.value === val)
      if (!res) return undefined
      return res.label
    }
  },
  {
    label: '业务标志',
    key: 'application',
    icon: 'discount'
  },
  {
    label: $t('业务运行状态'),
    key: 'action',
    icon: 'order-descending'
  },
  {
    label: $t('母业务ID'),
    key: 'parent_id',
    icon: 'view-module'
  },
  {
    label: $t('来源'),
    key: 'origin',
    icon: 'file-paste'
  },
  {
    label: $t('发行商'),
    key: 'publisher',
    icon: 'pin'
  },
  {
    label: $t('开发商'),
    key: 'developer',
    icon: 'pin'
  },
  {
    label: $t('描述'),
    key: 'description',
    icon: 'order-descending'
  },
  {
    label: 'OBS ID',
    key: 'obs_id',
    icon: 'view-module'
  },
  {
    label: $t('游戏ID'),
    key: 'game_id',
    icon: 'view-module'
  },
  {
    label: $t('游戏类型'),
    key: 'game_type',
    icon: 'file-paste'
  },

  {
    label: $t('运营阶段'),
    key: 'stage',
    icon: 'layers',
    format: (val:string) => {
      const res = enumStage.find(item => item.value === val)
      if (!res) return undefined
      return res.label
    }
  },

  {
    label: $t('运营产品'),
    key: 'product_name',
    icon: 'star' // !
  },
  {
    label: $t('创建人'),
    key: 'created_by',
    icon: 'user'
  },
  {
    label: $t('创建时间'),
    key: 'created_at',
    icon: 'time',
    format: (val:string) => val ? dayjs(val).format('YYYY-MM-DD HH:mm:ss') : ''
  },
  {
    label: $t('最近更新人'),
    key: 'updated_by',
    icon: 'user'
  },
  {
    label: $t('最近更新时间'),
    key: 'updated_at',
    icon: 'time',
    format: (val:string) => val ? dayjs(val).format('YYYY-MM-DD HH:mm:ss') : ''
  }
]

// * ------------------- 各业务类型表单取的字段 ---------------------------------

export const formField = {
  component: [
    // {
    //   field: 'genre',
    //   name: '业务类型',
    //   type: 'select',
    //   options:() => enumBusinessType
    // },
    {
      field: 'status',
      name: '状态',
      type: 'select',
      options: () => enumStatus
    },
    {
      field: 'application',
      name: '业务标志',
      type: 'input'
    },
    {
      field: 'game_id',
      name: '游戏ID',
      type: 'input'
    },
    {
      field: 'component_type',
      name: '组件类型',
      type: 'select',
      options: () => enumComponentType
    },
    {
      field: 'developer',
      name: '开发商',
      type: 'input'
    },
    {
      field: 'stage',
      name: '运营阶段',
      type: 'select',
      options: ({ status }: BusinessFullModel) => {
        if (status === 'live') return enumStage.filter(item => ['SL', 'GL'].includes(item.value))
        else if (status === 'test') return enumStage.filter(item => ['INNER', 'OBT', 'CBT'].includes(item.value))
      },
      disabled: ({ status }: BusinessFullModel) => !['test', 'live'].includes(status)
    },
    {
      field: 'release_mode',
      name: '发行模式',
      type: 'select',
      options: () => enumReleaseMode
    },
    {
      field: 'level',
      name: '等级',
      type: 'select',
      options: () => enumLevel,
      disabled: ({ release_mode }: BusinessFullModel) => release_mode !== 'SELF'
    },
    {
      field: 'obs_id',
      name: 'OBS ID',
      type: 'input'
    },
    {
      field: 'product_name',
      name: '运营产品',
      type: 'input'
    },
    {
      field: 'description',
      name: '描述',
      type: 'textarea'
    }
  ],
  game: [
    // {
    //   field: 'genre',
    //   name: '业务类型',
    //   type: 'select',
    //   options:() => enumBusinessType
    // },
    {
      field: 'status',
      name: '状态',
      type: 'select',
      options: () => enumStatus
    },
    {
      field: 'application',
      name: '业务标志',
      type: 'input'
    },
    {
      field: 'game_id',
      name: '游戏ID',
      type: 'input'
    },
    {
      field: 'game_type',
      name: '游戏类型',
      type: 'select',
      options: () => enumGameType
    },
    {
      field: 'developer',
      name: '开发商',
      type: 'input'
    },
    {
      field: 'stage',
      name: '运营阶段',
      type: 'select',
      options: ({ status }: BusinessFullModel) => {
        if (status === 'live') return enumStage.filter(item => ['SL', 'GL'].includes(item.value))
        else if (status === 'test') return enumStage.filter(item => ['INNER', 'OBT', 'CBT'].includes(item.value))
      },
      disabled: ({ status }: BusinessFullModel) => !['test', 'live'].includes(status)
    },
    {
      field: 'release_mode',
      name: '发行模式',
      type: 'select',
      options: () => enumReleaseMode
    },
    {
      field: 'level',
      name: '等级',
      type: 'select',
      options: () => enumLevel,
      disabled: ({ release_mode }: BusinessFullModel) => release_mode !== 'SELF'
    },
    {
      field: 'obs_id',
      name: 'OBS ID',
      type: 'input'
    },
    {
      field: 'product_name',
      name: '运营产品',
      type: 'input'
    },
    {
      field: 'description',
      name: '描述',
      type: 'textarea'
    }
  ],
  app: [
    // {
    //   field: 'genre',
    //   name: '业务类型',
    //   type: 'select',
    //   options:() => enumBusinessType
    // },
    {
      field: 'status',
      name: '状态',
      type: 'select',
      options: () => enumStatus.filter(item => ['test', 'live', 'down'].includes(item.value))
    },
    {
      field: 'application',
      name: '业务标志',
      type: 'input'
    },
    {
      field: 'app_type',
      name: '应用类型',
      type: 'select',
      options: () => enumAppType
    },
    {
      field: 'app_domains',
      name: '域名',
      type: 'app-domain',
      options: () => enumAppDomainType
    },
    {
      field: 'app_data_type',
      name: '数据类型',
      type: 'app-data-type'
    },
    {
      field: 'app_sensitive_level',
      name: '敏感等级',
      type: 'select',
      options: () => enumSensitiveLevel,
      disabled: () => true
    },
    // {
    //   field: 'app_is_public',
    //   name: '对公网开放',
    //   type: 'switch'
    // },
    {
      field: 'obs_id',
      name: 'OBS ID',
      type: 'input'
    },
    {
      field: 'product_name',
      name: '运营产品',
      type: 'input'
    },
    {
      field: 'description',
      name: '描述',
      type: 'textarea'
    }
  ]
}

// * ---------------- app业务类型的数据类型 ------------------------------
export const appDataTypeList = [
  {
    type: 'top',
    name_zh: '极高 系统/工具包含下列数据：',
    name_en: '系统/工具包含下列数据：',
    color: '#CD0C0C',
    info: {
      1: {
        title_zh: '1. 敏感个人信息数据，如：',
        title_en: '1. 敏感个人信息数据，如：',
        list: [
          {
            value: 1,
            name_zh: '个人身份信息',
            name_en: '个人身份信息',
            tooltip_zh: '个人身份信息中，身份证件号码、护照号、纳税账号、社会保险号码、真实地址、电子邮箱地址、电话号码、传真号码、医疗记录编号、车牌号、驾照号码',
            tooltip_en: '个人身份信息中，身份证件号码、护照号、纳税账号、社会保险号码、真实地址、电子邮箱地址、电话号码、传真号码、医疗记录编号、车牌号、驾照号码'
          },
          {
            value: 2,
            name_zh: '个人生物信息',
            name_en: '个人生物信息',
            tooltip_zh: '个人生物信息中，人脸识别信息、指纹、照片、种族',
            tooltip_en: '个人生物信息中，人脸识别信息、指纹、照片、种族'
          },
          {
            value: 3,
            name_zh: '购买信息',
            name_en: '购买信息',
            tooltip_zh: '购买信息中，付款卡号、付款账户、账单地址',
            tooltip_en: '购买信息中，付款卡号、付款账户、账单地址'
          },
          {
            value: 4,
            name_zh: '设备信息',
            name_en: '设备信息',
            tooltip_zh: '设备信息中，设备唯一 ID、设备序列号、IMEI、MAC 地址',
            tooltip_en: '设备信息中，设备唯一 ID、设备序列号、IMEI、MAC 地址'
          },
          {
            value: 5,
            name_zh: '调查问卷信息',
            name_en: '调查问卷信息',
            tooltip_zh: '调查问卷信息中，用户填写的邮箱',
            tooltip_en: '调查问卷信息中，用户填写的邮箱'
          },
          {
            value: 6,
            name_zh: '位置信息',
            name_en: '位置信息',
            tooltip_zh: '位置信息中，GPS精确位置信息',
            tooltip_en: '位置信息中，GPS精确位置信息'
          },
          {
            value: 7,
            name_zh: '游戏内信息',
            name_en: '游戏内信息',
            tooltip_zh: '游戏内信息中，账号密码、声音记录、视频记录、真实头像、安全问题和答案、聊天记录',
            tooltip_en: '游戏内信息中，账号密码、声音记录、视频记录、真实头像、安全问题和答案、聊天记录'
          }
        ]
      },
      2: {
        title_zh: '2. 核心企业数据，如：',
        title_en: '2. 核心企业数据，如：',
        list: [
          {
            value: 1,
            name_zh: '产品研发核心数据',
            name_en: '产品研发核心数据',
            tooltip_zh: '如系统架构设计书、源代码等',
            tooltip_en: '如系统架构设计书、源代码等'
          },
          {
            value: 2,
            name_zh: '核心管理数据',
            name_en: '核心管理数据',
            tooltip_zh: '如收购计划、业务投资和发展战略及规划数据、年度投资计划数据、年度预算数据、经营财务报表、考核信息、财务审计信息、人力具体薪酬信息等',
            tooltip_en: '如收购计划、业务投资和发展战略及规划数据、年度投资计划数据、年度预算数据、经营财务报表、考核信息、财务审计信息、人力具体薪酬信息等'
          },
          {
            value: 3,
            name_zh: '技术/知识产权内容数据',
            name_en: '技术/知识产权内容数据',
            tooltip_zh: '如已注册未公开使用的域名、正在申请注册的商标、未申请专利或已申请专利但还未公开的技术信息（包括立项表、技术交底书、专利申请提交电子流信息）、技术秘密等',
            tooltip_en: '如已注册未公开使用的域名、正在申请注册的商标、未申请专利或已申请专利但还未公开的技术信息（包括立项表、技术交底书、专利申请提交电子流信息）、技术秘密等'
          },
          {
            value: 4,
            name_zh: '重要网络设备资源类/支持类数据',
            name_en: '重要网络设备资源类/支持类数据',
            tooltip_zh: '如登陆访问帐号密码及IP信息、内部IP及端口信息、网络设备互联接口信息',
            tooltip_en: '如登陆访问帐号密码及IP信息、内部IP及端口信息、网络设备互联接口信息'
          }
        ]
      }
    }
  },
  {
    type: 'high',
    color: '#E74F06',
    name_zh: '高 系统/工具包含下列数据：',
    name_en: '高 系统/工具包含下列数据：',
    info: {
      1: {
        title_zh: '1. 个人数据，如：',
        title_en: '1. 个人数据，如：',
        list: [
          {
            value: 1,
            name_zh: '个人身份信息',
            name_en: '个人身份信息',
            tooltip_zh: '个人身份信息中，真实姓名、职业、婚姻状况、收入状况、地址邮编、公司/团体/组织名称、电话区号',
            tooltip_en: '个人身份信息中，真实姓名、职业、婚姻状况、收入状况、地址邮编、公司/团体/组织名称、电话区号'
          },
          {
            value: 2,
            name_zh: '个人生物信息',
            name_en: '个人生物信息',
            tooltip_zh: '个人生物信息中，年龄、出生日期',
            tooltip_en: '个人生物信息中，年龄、出生日期'
          },
          {
            value: 3,
            name_zh: '购买信息',
            name_en: '购买信息',
            tooltip_zh: '购买信息中，购买详情、消费者偏好',
            tooltip_en: '购买信息中，购买详情、消费者偏好'
          },
          {
            value: 4,
            name_zh: '设备信息',
            name_en: '设备信息',
            tooltip_zh: '设备信息中，广告ID、IP地址、设备无线设备信息',
            tooltip_en: '设备信息中，广告ID、IP地址、设备无线设备信息'
          },
          {
            value: 5,
            name_zh: '调查问卷信息',
            name_en: '调查问卷信息',
            tooltip_zh: '调查问卷信息中，用户填写的姓名、性别、年龄、国家/城市、反馈、客服记录/添加的公共帐号、收藏列表等',
            tooltip_en: '调查问卷信息中，用户填写的姓名、性别、年龄、国家/城市、反馈、客服记录/添加的公共帐号、收藏列表等'
          },
          {
            value: 6,
            name_zh: '网络活动信息',
            name_en: '网络活动信息',
            tooltip_zh: '网络活动信息中，浏览历史记录、搜索历史记录、WEB COOKIES、与网站/社区/广告交互的相关信息',
            tooltip_en: '网络活动信息中，浏览历史记录、搜索历史记录、WEB COOKIES、与网站/社区/广告交互的相关信息'
          },
          {
            value: 7,
            name_zh: '位置信息',
            name_en: '位置信息',
            tooltip_zh: '位置信息中，模糊位置信息、国家、省、城市',
            tooltip_en: '位置信息中，模糊位置信息、国家、省、城市'
          },
          {
            value: 8,
            name_zh: '游戏内信息',
            name_en: '游戏内信息',
            tooltip_zh: '游戏内信息中，游戏账号、第三方账号、用户名、好友列表、用户签名',
            tooltip_en: '游戏内信息中，游戏账号、第三方账号、用户名、好友列表、用户签名'
          }
        ]
      },
      2: {
        title_zh: '2. 企业数据，如：',
        title_en: '2. 企业数据，如：',
        list: [
          {
            value: 1,
            name_zh: '产品一般研发数据',
            name_en: '产品一般研发数据',
            tooltip_zh: '如研发项目需求书、项目会议纪要、研发培训材料、环境审批数据等',
            tooltip_en: '如研发项目需求书、项目会议纪要、研发培训材料、环境审批数据等'
          },
          {
            value: 2,
            name_zh: '产品商业、市场、渠道等数据',
            name_en: '产品商业、市场、渠道等数据',
            tooltip_zh: '如产品商业计划书、有关合同、非公开市场策划方案等、渠道佣金、渠道用户数据等',
            tooltip_en: '如产品商业计划书、有关合同、非公开市场策划方案等、渠道佣金、渠道用户数据等'
          },
          {
            value: 3,
            name_zh: '业务/产品运营数据',
            name_en: '业务/产品运营数据',
            tooltip_zh: '如产品原始操作流水日志、产品运营中间数据',
            tooltip_en: '如产品原始操作流水日志、产品运营中间数据'
          },
          {
            value: 4,
            name_zh: '企业重要管理数据',
            name_en: '企业重要管理数据',
            tooltip_zh: '如会计凭证及账本数据、采购数据、供应商考核数据、人工成本及薪酬福利统计数数据、纳税申报数据、人事档案数据、法律案卷数据、审计数据等',
            tooltip_en: '如会计凭证及账本数据、采购数据、供应商考核数据、人工成本及薪酬福利统计数数据、纳税申报数据、人事档案数据、法律案卷数据、审计数据等'
          },
          {
            value: 5,
            name_zh: '企业合作伙伴数据',
            name_en: '企业合作伙伴数据',
            tooltip_zh: '如合同相关信息（包括订立、履约、终止情况等）、产品培训材料、活动培训材料等',
            tooltip_en: '如合同相关信息（包括订立、履约、终止情况等）、产品培训材料、活动培训材料等'
          },
          {
            value: 6,
            name_zh: '技术研发测试、分析数据',
            name_en: '技术研发测试、分析数据',
            tooltip_zh: '如实验测试数据、试验分析报告、专利申请数量及其统计信息等测试分析数据',
            tooltip_en: '如实验测试数据、试验分析报告、专利申请数量及其统计信息等测试分析数据'
          },
          {
            value: 7,
            name_zh: ' 网络设备管理数据',
            name_en: ' 网络设备管理数据',
            tooltip_zh: '如相关管理规范和流程、规划设计方案书、实施方案书、计算机/员工绑定列表、服务器服务申请表和记录、软件许可证、购买合同等 /员工绑定列表、服务器服务申请表和记录、软件许可证、购买合同等',
            tooltip_en: '如相关管理规范和流程、规划设计方案书、实施方案书、计算机/员工绑定列表、服务器服务申请表和记录、软件许可证、购买合同等 '
          }
        ]
      }
    }
  },
  {
    type: 'middle',
    color: '#FFB600',
    name_zh: '中 系统/工具包含下列数据：',
    name_en: '中 系统/工具包含下列数据：',
    info: {
      1: {
        title_zh: '1. 个人数据，如：',
        title_en: '1. 个人数据，如：',
        list: [
          {
            value: 1,
            name_zh: '设备信息',
            name_en: '设备信息',
            tooltip_zh: '设备信息中，设备品牌、内存、硬盘、屏幕、系统、语言、网络、浏览器信息',
            tooltip_en: '设备信息中，设备品牌、内存、硬盘、屏幕、系统、语言、网络、浏览器信息'
          },
          {
            value: 2,
            name_zh: '游戏内信息',
            name_en: '游戏内信息',
            tooltip_zh: '游戏内信息中，登陆渠道、角色性别',
            tooltip_en: '游戏内信息中，登陆渠道、角色性别'
          }
        ]
      },
      2: {
        title_zh: '2. 企业数据，如：',
        title_en: '2. 企业数据，如：',
        list: [
          {
            value: 1,
            name_zh: '产品基本信息数据',
            name_en: '产品基本信息数据',
            tooltip_zh: '产品基本信息数据，如产品编号、名称、适用用户类型等',
            tooltip_en: ' 产品基本信息数据，如产品编号、名称、适用用户类型等'
          },
          {
            value: 2,
            name_zh: '渠道/营销管理相关信息',
            name_en: '渠道/营销管理相关信息',
            tooltip_zh: '如渠道编号、渠道启用/停止日期、相关合同信息等',
            tooltip_en: '如渠道编号、渠道启用/停止日期、相关合同信息等'
          },
          {
            value: 3,
            name_zh: '业务核心运营指标',
            name_en: '业务核心运营指标',
            tooltip_zh: '如满意度调研数据、与产品有关的第三方监测数据等',
            tooltip_en: '如满意度调研数据、与产品有关的第三方监测数据等'
          },
          {
            value: 4,
            name_zh: '业务一般运营数据',
            name_en: '业务一般运营数据',
            tooltip_zh: '非核心DAU、收入相关聚合统计数据或指标，如在线时长分布等',
            tooltip_en: '非核心DAU、收入相关聚合统计数据或指标，如在线时长分布等'
          },
          {
            value: 5,
            name_zh: '一般管理数据',
            name_en: '一般管理数据',
            tooltip_zh: '如内部公开后的企业管理数据等',
            tooltip_en: '如内部公开后的企业管理数据等'
          },
          {
            value: 6,
            name_zh: '合作伙伴一般信息',
            name_en: '合作伙伴一般信息',
            tooltip_zh: '如单位名称、股东信息、联系人、违规处罚信息等',
            tooltip_en: '如单位名称、股东信息、联系人、违规处罚信息等'
          },
          {
            value: 7,
            name_zh: '技术管理类数据',
            name_en: '技术管理类数据',
            tooltip_zh: '如知识产权管理制度文件、技术类规范等',
            tooltip_en: '如知识产权管理制度文件、技术类规范等'
          },
          {
            value: 8,
            name_zh: '技术/知识产权凭证类数据',
            name_en: '技术/知识产权凭证类数据',
            tooltip_zh: '如专利申请布局规划、已申请专利并经公开后的公司内部的专利申请相关文件（非指官方公开渠道上得到的）、知识产权诉讼信息、知识产权证书等',
            tooltip_en: '如专利申请布局规划、已申请专利并经公开后的公司内部的专利申请相关文件（非指官方公开渠道上得到的）、知识产权诉讼信息、知识产权证书等'
          },
          {
            value: 9,
            name_zh: '一般网络设备数据',
            name_en: '一般网络设备数据',
            tooltip_zh: '如登陆访问帐号密码及IP信息、内部IP及端口信息、网络设备互联接口信息',
            tooltip_en: '如登陆访问帐号密码及IP信息、内部IP及端口信息、网络设备互联接口信息'
          }
        ]
      }
    }
  },
  {
    type: 'low',
    color: '#648D00',
    name_zh: '低 系统/工具包含下列数据：',
    name_en: '低 统/工具包含下列数据：',
    info: {
      1: {
        title_zh: '',
        title_en: '',
        list: [
          {
            value: 1,
            name_zh: '市场营销公开数据',
            name_en: '市场营销公开数据',
            tooltip_zh: '',
            tooltip_en: ''
          },
          {
            value: 2,
            name_zh: '公开网络设备资源类/支持类数据',
            name_en: '公开网络设备资源类/支持类数据',
            tooltip_zh: 'IP及端口信息、网络设备互联接口信息等',
            tooltip_en: 'IP及端口信息、网络设备互联接口信息等'
          }
        ]
      }
    }
  }
]
