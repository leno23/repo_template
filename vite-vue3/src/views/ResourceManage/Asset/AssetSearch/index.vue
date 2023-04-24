<template>
  <div class="asset-search-container">
    <Card
      class="asset-search-left-warpper"
      margin="0 10px 0 0;"
    >
      <h3 class="search-header">高级搜索</h3>
      <div class="search-main">
        <t-form label-align="top">
          <t-form-item label="资产类型">
            <t-cascader
              v-model="queryForm.assetType"
              :show-all-levels="false"
              :options="assetOptions"
              clearable
            />
          </t-form-item>

          <t-form-item v-if="queryForm.assetType === 'vm'">
            <template #label>
              <div class="flex-y-center">
                <span>IP</span>
                <t-popup
                  placement="right"
                  content="IP搜索支持的资产类型: VM"
                  show-arrow
                >
                  <t-icon
                    name="help-circle-filled"
                    size="large"
                    style="margin-left: 5px; color: var(--td-brand-color);"
                  />
                </t-popup>
              </div>
            </template>
            <div style="flex: 1">
              <t-textarea
                v-model="queryForm.ip"
                placeholder="请输入ip, 多个ip需要用; 或者换行分隔"
              />
              <t-checkbox-group
                v-model="queryForm.ipTypes"
                style="margin-top: 5px;"
                :options="ipTypeOptions"
              />
            </div>
          </t-form-item>

          <t-form-item label="所属业务">
            <t-select
              v-model="BusinessStore.selected"
              :options="businessOptions"
              :disabled="accountLoading"
              :tag-props="{ maxWidth: 300 }"
              multiple
              filterable
              :min-collapsed-num="1"
              clearable
              @change="businessChange"
            />
          </t-form-item>

          <t-form-item label="所属云账号">
            <t-select
              v-model="queryForm.created_by__in"
              :options="accountOptions"
              :loading="accountLoading"
              filterable
              multiple
              :tag-props="{ maxWidth: 240 }"
              clearable
              :min-collapsed-num="1"
              :disabled="!BusinessStore.selected.length"
              @popup-visible-change="bool => bool && getAccount()"
            />
          </t-form-item>

          <template v-if="queryForm.assetType">
            <t-form-item label="字段排序">
              <t-select
                v-model="queryForm.order_by.order"
                style="width: 60px; margin-right: 10px;"
                placeholder=""
              >
                <t-option value="asc">
                  <t-icon name="arrow-up" />
                </t-option>
                <t-option value="desc">
                  <t-icon name="arrow-down" />
                </t-option>
                <template #valueDisplay="{ value }">
                  <t-icon
                    v-if="value === 'asc'"
                    name="arrow-up"
                    style="color: #191919"
                  />
                  <t-icon
                    v-else-if="value === 'desc'"
                    name="arrow-down"
                    style="color: #191919"
                  />
                </template>
              </t-select>

              <t-select
                v-model="queryForm.order_by.field"
                :loading="currConfigLoading"
                filterable
                :options="currAssetSortOptions"
                clearable
              />
            </t-form-item>

            <template
              v-for="field,index in filterStatus.checkedField"
              :key="field"
            >
              <t-form-item v-if="fieldConfigMap[field]">
                <template #label>
                  <div class="async-form-item-label">
                    {{ fieldConfigMap[field].name }}
                    <t-icon
                      name="close"
                      size="large"
                      class="async-form-item-close-btn"
                      @click="deleteFilterItem(field, index)"
                    />
                  </div>
                </template>

                <t-select
                  v-if="field !== 'origin_tags'"
                  v-model="fieldConfigMap[field].checkOperation"
                  style="width: 60px; margin-right: 10px;"
                  placeholder=""
                  :options="objectKeys(fieldConfigMap[field].operations).map(k => ({ value: fieldConfigMap[field].operations[k], label: k }))"
                />

                <!-- field的arr类型特殊处理3个字段 -->
                <t-select
                  v-if="fieldConfigMap[field].type === 'arr' && ['provider_key', 'region', 'zone'].includes(field)"
                  v-model="queryForm[field]"
                  :scroll="{ type: 'virtual' }"
                  :popup-props="{ overlayInnerStyle: { height: '250px' } }"
                  :options="getSpecialFieldOptions(field)"
                  multiple
                  filterable
                  clearable
                  :min-collapsed-num="1"
                  :tag-props="{ maxWidth: 250 }"
                />

                <template v-else-if="fieldConfigMap[field].type === 'arr'">
                  <!-- field的arr类型特殊处理origin_tags字段渲染为键值对输入 -->
                  <div
                    v-if="field === 'origin_tags'"
                    class="key-value-list"
                  >
                    <div
                      v-for="item, i in queryForm.origin_tags"
                      :key="i"
                      class="row"
                    >
                      <t-input
                        v-model="item.key"
                        placeholder="Key"
                      />
                      <div class="middle">=</div>
                      <t-input
                        v-model="item.value"
                        placeholder="Value"
                      />
                      <div
                        v-if="queryForm.origin_tags.length !== 1"
                        class="del"
                        @click="queryForm.origin_tags.splice(i, 1)"
                      >
                        <t-icon name="close-circle-filled" />
                      </div>
                    </div>

                    <t-button
                      size="small"
                      style="margin: 10px 0"
                      block
                      variant="outline"
                      theme="primary"
                      @click="queryForm.origin_tags.push({ key: '', value: '' })"
                    >
                      <template #icon>
                        <t-icon name="add" />
                      </template>
                      标签
                    </t-button>
                  </div>

                  <!-- field的arr类型其他字段处理为自定义创建选项的选择器-->
                  <t-select
                    v-else
                    v-model="queryForm[field]"
                    filterable
                    :min-collapsed-num="1"
                    :tag-props="{ maxWidth: 250 }"
                    clearable
                    multiple
                    placeholder="请输入自定义选项值, 并按回车确认"
                    :options="fieldConfigMap[field].arrCustomOptions"
                    creatable
                    @create="value => fieldConfigMap[field].arrCustomOptions.push({ value, label: value })"
                  />
                </template>

                <t-input
                  v-else-if="fieldConfigMap[field].type === 'int'"
                  v-model.number="queryForm[field]"
                  clearable
                />

                <t-input
                  v-else-if="fieldConfigMap[field].type === 'str'"
                  v-model="queryForm[field]"
                  clearable
                />

                <t-date-picker
                  v-else-if="fieldConfigMap[field].type === 'datetime'"
                  v-model="queryForm[field]"
                  enable-time-picker
                  clearable
                  style="flex: 1;"
                />

                <t-radio-group
                  v-else-if="fieldConfigMap[field].type === 'bool'"
                  v-model="queryForm[field]"
                  :options="([{ value: true, label: 'true' }, { value: false, label: 'false' }] as any)"
                />
              </t-form-item>
            </template>
          </template>
        </t-form>

        <t-button
          v-if="queryForm.assetType"
          theme="primary"
          variant="text"
          :loading="currConfigLoading"
          :content="currConfigLoading ? '加载配置中...' : '添加其他条件'"
          style="margin-top: 12px;"
          @click="openFilter"
        >
          <template #icon><t-icon name="add" /></template>
        </t-button>
      </div>

      <div class="search-footer">
        <t-button
          content="当前资产数据导出"
          style="margin-right: 15px;"
          theme="warning"
          :disabled="!activeType"
          @click="openExport"
        >
          <template #icon><t-icon name="download" /></template>
        </t-button>
        <t-button
          content="搜索"
          :loading="isTotalLoading"
          @click="search(queryForm.assetType ? [queryForm.assetType] : allAssetTypeValues)"
        />
      </div>
    </Card>

    <Card
      margin="0"
      padding="0 10px 10px 10px;"
      class="asset-search-right-warpper"
    >
      <!-- <t-loading
        :loading="isTotalLoading"
        style="flex: 1; height: 0;"
      > -->
      <t-tabs
        v-model="activeType"
        :list="TabPanels"
      />
      <!-- </t-loading> -->
    </Card>

    <t-dialog
      v-model:visible="filterStatus.visible"
      :close-on-esc-keydown="false"
      :close-on-overlay-click="false"
      header="筛选条件"
      top="12vh"
      width="1000px"
      @confirm="confirmFilter"
    >
      <!-- :confirm-btn="{ onClick: conformAction, loading: optStatus.loading }" -->
      <div class="filter-warpper">
        <t-checkbox-group v-model="filterStatus.checkedTemporary">
          <template
            v-for="item in currFieldConfig"
            :key="item.name"
          >
            <div v-if="item.fields.length">
              <h4>{{ item.name }}</h4>
              <t-checkbox
                v-for="opt in item.fields"
                :key="opt.field"
                :value="opt.field"
                :label="opt.name"
              />
            </div>
          </template>
        </t-checkbox-group>
        <br /><br />
        <div>已选择 {{ filterStatus.checkedTemporary.length }} 个条件</div>
      </div>
    </t-dialog>
  </div>
</template>

<script lang="tsx" setup>
import { useBusinessStore } from '@/store/modules/business'
import { useRoute, useRouter } from 'vue-router'
import { noDisplayAssetField, assetTypeList, assetCategoryList } from '@/const/assetConfig'
import { reqAssetFieldConfigParallel, reqAssetListParallel } from '@/api/ResourceManage/Asset'
import type { ExportAssetListPayload } from '@/api/ResourceManage/Asset'
import { reqCloudAccountMultipleBid } from '@/api/cloudAccount'
import type { AccountModal } from '@/api/cloudAccount'
import type { AssetListItem, AssetParseConfig, AssetParseConfigField } from '../Types'
import type { TdCascaderProps, SelectOption, TdTabPanelProps, TdButtonProps, CheckboxOption } from 'tdesign-vue-next'
import { Loading as TLoading, Button as TButton, Pagination as TPagination, Icon as TIcon, MessagePlugin } from 'tdesign-vue-next'
import { objectKeys, requestErrorMsg } from '@/common/utils'
import { getTableProps, getSubnetTableProps, exportTableHandler } from '../dataHandler'
import { Grid as VxeGrid } from 'vxe-table'
import { $t } from '@/common/utils/i18n'
import { dayjs } from '@/common/plugins/Tool'
// import { useCloudAccountStore } from '@/store/modules/cloudAccount'
import { useCloudProviderStore } from '@/store/modules/cloudProvider'
import { cloneDeep } from 'lodash'
import type { VxeGridInstance } from 'vxe-table'

const route = useRoute()
const router = useRouter()
const BusinessStore = useBusinessStore()
// const CloudAccountStore = useCloudAccountStore()
const CloudProviderStore = useCloudProviderStore()

const tableRef = ref<VxeGridInstance>()

const allAssetTypeValues = assetTypeList.map(item => item.value)

const activeType = ref('') // 当前正在查看的资产tab
// const activeLabel = computed(() => assetTypeList.find(item => activeType.value === item.value)?.label || '')

const queryForm = reactive<Record<string, any>>({
  assetType: '',
  ip: '',
  ipTypes: ['private_ip_address__icontains'], // 默认选中内网ip类型
  // business_ids: [] as number[],
  created_by__in: [] as number[],
  order_by: { field: '', order: 'desc' }
  // origin_tags: [] as {key: string, value: string}[]
})

// * --------------- 资产类型级联选项,只支持单选或不选 -------------------
const assetOptions: TdCascaderProps['options'] = assetCategoryList.map(item => ({
  label: item.name,
  value: item.value,
  children: item.assets.map(asset => ({ label: asset.label, value: asset.value }))
}))

// * ----------------------- 业务选择 --------------------------------
const businessOptions = computed(() =>
  [{ label: '全选', checkAll: true } as SelectOption]
    .concat(BusinessStore.business.map(bus => ({ label: `${bus.id}-${bus.name_zh}(${bus.name_en})`, value: bus.id })))
)

const businessChange = () => {
  queryForm.created_by__in = []
  accounts.value = []
}

// * --------------- 云账号级联选项, 动态加载控制, 没有使用Store中的数据, 改起来麻烦 -------------------
const accounts = ref<AccountModal[]>([])
const accountLoading = ref(false)
const getAccount = async () => {
  // const bid = queryForm.business_id as number | undefined
  if (!BusinessStore.selected.length) return
  accountLoading.value = true
  try {
    accounts.value = await reqCloudAccountMultipleBid(BusinessStore.selected)
  } catch (err: any) {
    requestErrorMsg(err.message)
  }
  accountLoading.value = false
}

const accountOptions = computed(() => [{ label: '全选', checkAll: true } as SelectOption].concat(accounts.value.map(item => ({ label: item.name, value: item.id }))))

// * ----------------- 资产列配置Config ------------------
const currConfigLoading = computed(() => dataMap[queryForm.assetType]?.config.loading)

interface DataMapModel {
  config: { loading: boolean, list: AssetParseConfig[] }
  data: {
    page: number
    page_size: number
    count: number
    list: AssetListItem[]
    loading: boolean
  }
}
/**
  * @description 存放所有资产类型的的列配置config，当页面没有卸载时，每个资产类型的config只会请求一遍
  * @description 存放所有资产类型的list和状态控制
 */
const dataMap = reactive<Record<string, DataMapModel>>({})

const resetData = (isInit: boolean) => {
  if (isInit) {
    allAssetTypeValues.forEach(val => {
      dataMap[val] = {
        config: { loading: false, list: [] },
        data: {
          page: 1,
          page_size: 15,
          count: 0,
          list: [],
          loading: false
        }
      }
    })
  } else {
    allAssetTypeValues.forEach(val => {
      dataMap[val].data = {
        page: 1,
        page_size: 15,
        count: 0,
        list: [],
        loading: false
      }
    })
  }
}
onMounted(() => resetData(true))

// 初始化dataMap对象
const getConfig = async (type: string) => {
  const assetConfig = dataMap[type].config
  assetConfig.loading = true
  try {
    const configList = await reqAssetFieldConfigParallel(type)

    // 有一些operations会是null，为流程方便直接指定默认值
    configList.forEach(({ fields }) => fields.forEach(item => {
      if (!item.operations) item.operations = {}
    }))

    assetConfig.list = configList

    if (type === 'vpc') {
      const subVpcConfig = dataMap.sub_vpc?.config
      if (!subVpcConfig.list.length && !subVpcConfig.loading) getConfig('sub_vpc')
    }
  } catch (err: any) {
    requestErrorMsg(err.message)
  }
  assetConfig.loading = false
}

// 资产选择器指定将要搜索的资产类型时, 检查是否已有config若无则请求, 在初次搜索前就支持添加资产过滤的指定条件
watch(() => queryForm.assetType, (type) => {
  const target = dataMap[type]?.config
  if (!type || !target || target.list.length || target.loading) return
  getConfig(type)
})

// 当直接搜索时, 加载当前查看的资产类型的config以进行列表渲染
watch(() => activeType.value, type => {
  const target = dataMap[type]?.config
  if (!type || !target || target.list.length || target.loading) return
  getConfig(type)

  // if (type === 'vpc') {
  //   const subVpcConfig = dataMap.sub_vpc?.config
  //   if (!subVpcConfig || subVpcConfig.list.length || subVpcConfig.loading) return
  //   getConfig('sub_vpc')
  // }
})

// * ------------------ 动态筛选控制 ------------------

// 字段排序单独渲染的逻辑
const currAssetSortOptions = computed(() => {
  if (!queryForm.assetType) return []
  return dataMap[queryForm.assetType].config.list
    .reduce((res, curr) => res.concat(curr.fields), [] as AssetParseConfigField[])
    // 过滤掉hidden列与ip列，并展示余下sortable的列
    .filter((opt) => !noDisplayAssetField.concat(['private_ip_address', 'public_ip_address']).includes(opt.field) && !opt.hidden && opt.sortable)
    .map(({ field, name }) => ({ value: field, label: `${name} (${field})` }))
})

// 所有资产都默认显示的筛选字段
const commonSelectFields = ['origin_uid', 'origin_name', 'provider_key', 'region', 'zone']

const ipTypeOptions: CheckboxOption[] = [
  { value: 'private_ip_address__icontains', label: '内网IP' },
  { value: 'public_ip_address__icontains', label: '外网IP' },
  { value: 'accurate', label: '精确' }
]

const filterStatus = reactive({
  visible: false,
  checkedTemporary: [] as string[], // 在dialog正在选择的字段, 确认后会推到checkedField中
  checkedField: [...commonSelectFields]
})

// 当前资产类型的列配置, 过滤部分字段, 用于筛选条件的动态多选
const currFieldConfig = computed(() => {
  if (!queryForm.assetType) return []
  return dataMap[queryForm.assetType].config.list.map(item => ({
    name: item.name,
    // 过滤hidden列、ip列、不支持筛选的列
    fields: item.fields.filter(opt =>
      !noDisplayAssetField.concat(['private_ip_address', 'public_ip_address']).includes(opt.field) &&
      opt.filterable &&
      !opt.hidden
    )
  }))
})

type FieldConfig = AssetParseConfigField & { checkOperation: string, arrCustomOptions: SelectOption[] }
// 便于动态筛选流程中获取field字段的config对象, 因为需要使用双向绑定, 所以用watch创建新的对象
const fieldConfigMap = ref<Record<string, FieldConfig>>({})
watch(() => currFieldConfig.value, () => {
  const res: Record<string, FieldConfig> = {}
  cloneDeep(toRaw(currFieldConfig.value))
    .forEach(({ fields }) => (fields as FieldConfig[]).forEach(item => {
      item.checkOperation = Object.values(item.operations)[0]
      // 用于field的数据类型为arr时需要手动输入任意option时临时保存选项
      item.arrCustomOptions = []
      res[item.field] = item
    }))
  fieldConfigMap.value = res
})

const openFilter = () => {
  filterStatus.visible = true
  filterStatus.checkedTemporary = [...filterStatus.checkedField]
}

const confirmFilter = () => {
  filterStatus.visible = false
  filterStatus.checkedField = [...filterStatus.checkedTemporary]
  if (filterStatus.checkedField.includes('origin_tags') && !queryForm.origin_tags) queryForm.origin_tags = [{ key: '', value: '' }]
}

const deleteFilterItem = (field: string, index: number) => {
  filterStatus.checkedField.splice(index, 1)
  delete queryForm[field]
}

// 切换资产时重置选中筛选项, 重置表单
watch(() => queryForm.assetType, () => {
  filterStatus.checkedField.forEach(field => { delete queryForm[field] })
  filterStatus.checkedField = [...commonSelectFields]
  queryForm.order_by = { field: '', order: 'desc' }
})

// 类型特殊字段选项: provider_key', 'region', 'zone'的选择器选项
const getSpecialFieldOptions = (field: string) => {
  // if (field === 'provider_key') return CloudProviderStore.regionAndZone.map(item => ({ value: item.key, label: item[`name_${lang}`] }))
  if (field === 'provider_key') return CloudProviderStore.regionAndZone.map(item => ({ value: item.key, label: item.name_en }))

  const regionList = CloudProviderStore.regionAndZone.reduce((res, item) => res.concat(
    // item.regions.map(region => ({ value: region.region, label: `${item[`name_${lang}`]} / ${region.area}(${region.region})`, zones: region.zones }))
    item.regions.map(region => ({ value: region.region, label: `${item.name_en} / ${region.region}`, zones: region.zones }))
  ), [] as any[])

  if (field === 'region') return regionList
  if (field === 'zone') {
    return regionList.reduce(
      (res, region) => res.concat(
        region.zones.map((zone: any) => ({ value: zone.zone, label: `${region.label} / ${zone.zone}` }))
      ), [] as any[])
  }

  return []
}

// 对筛选项进行处理
const parseParams = () => {
  const params: Record<string, any> = {}

  // 处理ip (实际上目前只有vm支持ip搜索, 但需求是顶栏搜索ip的), 每选择一个要搜索的ip类型都对应一个单独的字段
  const { ip, ipTypes, assetType, created_by__in, order_by, origin_tags } = queryForm
  if (assetType === 'vm' && ip.trim()) {
    const ips = ip.trim().replace(/(\n|\r)/g, ';').split(';').filter((i: string) => i)
    ipTypes.forEach((ipField: string) => { params[ipField] = ips })
  }

  // 处理固定/特殊字段
  if (BusinessStore.selected.length) params.business_ids = BusinessStore.selected
  if (created_by__in.length) params.created_by__in = created_by__in
  if (order_by.field && order_by.order) params.order_by = [`${order_by.order === 'desc' ? '-' : ''}${order_by.field}`]

  if (origin_tags) {
    const tags = (origin_tags as {key: string, value: string}[])
      .map(({ key, value }: {key: string, value: string}) => (key.trim() && value.trim()) ? { key: key.trim(), value: value.trim() } : undefined)
      .filter(v => v)
    if (tags.length) params.origin_tags__contains = tags
    // if (tags.length) params.origin_tags = tags
  }

  objectKeys(queryForm).forEach(field => {
    // 过滤掉固定/特殊处理的字段
    if (['ip', 'ipTypes', 'assetType', 'created_by__in', 'origin_tags'].includes(field)) return
    const value = queryForm[field]
    const fieldConfig = fieldConfigMap.value[field]
    if (!fieldConfig) return

    // 直接取所选的operations, 某些config的operations为空, 则字段名不变
    const key = fieldConfig.checkOperation ? fieldConfig.checkOperation : field

    switch (fieldConfig.type) {
    case 'arr':
      if (value.length) params[key] = value
      break
    case 'bool':
      params[key] = value
      break
    case 'datetime':
      if (value) params[key] = dayjs(value).utc().format()
      break
    case 'str':
      if (value.length) params[key] = value.trim()
      break
    case 'int':
      if (typeof value === 'number') params[key] = value // v-model.number也会有字符串的情况
      break
    }
  })

  return params
}

// * ------------------ 资产list查询渲染 ------------------
const isTotalLoading = computed(() => Object.values(dataMap).some(item => item.data.loading))

const search = (assets: string[], isPage = false) => {
  // 如果是搜索按钮,则清空状态, 如果是当前资产下翻页则只清空该资产的列表

  if (!isPage) {
    resetData(false)
    activeType.value = ''
  }

  assets.forEach(async type => {
    const assetData = dataMap[type].data
    if (isPage) assetData.list = [] // 不清除count,避免页数切换时页码溢出
    const { page, page_size } = assetData
    assetData.loading = true
    try {
      // console.log({ type, page, page_enabled: true, page_size, ...parseParams() })
      const { count, results } = await reqAssetListParallel({ type, page, page_enabled: true, page_size, ...parseParams() })
      assetData.list = results
      assetData.count = count

      // 如果搜索单个资产则直接显示tab, 如果搜索多个资产则显示第一个完成请求并有数据的资产
      if (!isPage && (assets.length === 1 || (!activeType.value && count))) activeType.value = type
    } catch (err: any) {
      requestErrorMsg(err.message)
    }
    assetData.loading = false
  })
}

// 表格渲染JSX
const optButtonProps: TdButtonProps = {
  size: 'small',
  variant: 'text'
}
const PanelContent = () => {
  const payload = dataMap[activeType.value]

  const isLoading = payload.config.loading || payload.data.loading

  const tableProps = getTableProps({
    fieldConfig: payload.config.list.reduce((res, curr) => res.concat(curr.fields), [] as AssetParseConfigField[]),
    data: payload.data.list,
    toolbar: false
  })

  // 当loading完成时才插入动态列
  if (!isLoading && payload.data.count) {
    if (activeType.value === 'vpc') {
    // vpc资产插入展开列展示subnet子网
      const subnetFieldConfig = dataMap.sub_vpc.config.list.reduce((res, curr) => res.concat(curr.fields), [] as AssetParseConfigField[])
      tableProps.columns?.unshift({
        type: 'expand',
        slots: {
          content: ({ row }: {row: AssetListItem}) => {
          // 拿表格的宽度来做对比
            const width = (document.getElementsByClassName('asset-main-table-class')[0]?.clientWidth || 600) - 300 + 'px'
            return row.subVpcList?.length
              ? (
                <div style={{ width, padding: '10px 20px' }}>
                  <h4 style='margin: 0 0 10px 0'>子网</h4>
                  <VxeGrid {...getSubnetTableProps({ fieldConfig: subnetFieldConfig, data: row.subVpcList })} />
                </div>
              )
              : <h4 style="padding: 20px">{$t('暂无数据')}</h4>
          }
        }
      })
    }

    tableProps.columns?.push({
      width: 80,
      fixed: 'right',
      align: 'center',
      title: $t('操作'),
      slots: {
        default: ({ row }: { row: AssetListItem }) => <TButton {...optButtonProps} theme='primary' content='详情' onClick={() => goToAssetDetail(row)} />
      }
    })

    tableProps.columns?.unshift({
      minWidth: 100,
      title: '所属业务ID',
      formatter: ({ row }) => row.business_ids?.join(', ')
    })
  }

  tableProps.exportConfig = {
    remote: true,
    modes: ['current', 'all'],
    type: 'xlsx',
    types: ['xlsx', 'csv'],
    original: true,
    exportMethod: async ({ options }) => {
      const { type, filename, columns, mode } = options

      if (!filename?.trim()) {
        MessagePlugin.error('请输入文件名')
        return
      }

      const params: ExportAssetListPayload = {
        type: activeType.value,
        export_fields: columns.map(({ field }) => field),
        file_name: filename.trim() + '.' + type,
        page_enabled: mode !== 'all',
        page: mode === 'all' ? undefined : payload.data.page,
        page_size: mode === 'all' ? undefined : payload.data.page_size,
        ...parseParams()
      }

      await exportTableHandler(params)
    }
  }

  if (isLoading) tableProps.emptyText = ' '

  return (
    <TLoading loading={isLoading} style='height: 100%;'>
      <div style='display: flex; flex-direction: column; height: 100%;'>
        <div style='flex: 1; height: 0;'>
          <VxeGrid ref={ins => { tableRef.value = ins as any }} {...tableProps} />
        </div>
        {/* // ! 注意在jsx写冒号会导致eslint解析失败，所以不用v-model */}
        <TPagination
          current={payload.data.page}
          pageSize={payload.data.page_size}
          onCurrentChange={(v) => { payload.data.page = v; search([activeType.value], true) }}
          onPageSizeChange={(v) => { payload.data.page_size = v; search([activeType.value], true) }}
          total={payload.data.count}
          showJumper
          pageSizeOptions={[15, 25, 35, 50, 100]}
          size='small'
          style='margin-top: 10px; flex-shrink: 0;'
        />
      </div>
    </TLoading>
  )
}

const TabPanels = computed<TdTabPanelProps[]>(() => objectKeys(dataMap)
  // .filter(type => dataMap[type].data.count) // 展示方案一: 只显示有数据的资产类型在tab上, 但空提示不太好做
  .map(type => ({
    // label: () => {
    //   const labelTetx = assetTypeList.find(({ value }) => value === type)?.label || ''
    //   return <div class='flex-y-center'>{ labelTetx }{ dataMap[type].data.loading && <TIcon name='loading' style={{ marginLeft: '10px' }} /> }</div>
    // },
    label: assetTypeList.find(({ value }) => value === type)?.label || '',
    value: type,
    disabled: !dataMap[type].data.count, // 展示方案二: 有数据的才激活,
    panel: PanelContent
  }))
)
// * -------------------- 详情操作 -------------------
const goToAssetDetail = (item: AssetListItem) => {
  router.push({
    name: 'AssetDetail',
    params: {
      assetType: item.asset_type,
      assetId: item.id
      // business_id: BusinessStore.currentBusinessId
    }
  })
}

// * --------------------------------
const openExport = () => {
  tableRef.value?.openExport()
}

// 顶栏跳转带一个ip, 实际上目前只有vm支持ip搜索,所以如果带ip进入本页面,直接指定为vm
onMounted(() => {
  const ip = route.params.ip
  if (ip) {
    queryForm.ip = ip
    queryForm.assetType = 'vm'
    search(['vm'])
  }
})

</script>

<script lang="tsx">
export default defineComponent({ name: 'AssetSearch' })
</script>

<style lang="scss" scoped>
.asset-search-container {
  display: flex;
  padding: 10px;
  // height: calc(#{$contentHeight} - 20px);
  height: $contentHeight;

  .asset-search-left-warpper {
    display: flex;
    flex-direction: column;
    width: 450px;
    height: 100%;
    background-color: #fff;
    border-right: 1px solid #e8e8e8;
    flex-shrink: 0;

    .search-header {
      padding-bottom: 10px;
      margin: 0 0 10px 0;
      font-size: 18px;
      border-bottom: 1px solid #e8e8e8;
    }

    .search-main {
      flex: 1;
      overflow-y: auto;

      .async-form-item-label {
        position: relative;

        .async-form-item-close-btn {
          position: absolute;
          right: -17px;
          top: 7px;
          cursor: pointer;
          color: #ccc;
          transition: color 200ms;
          &:hover {
            color: #333;
          }
        }
      }

      :deep(.t-form__item) {
        margin-bottom: 12px;
      }

      .key-value-list {
        max-height: 200px;
        overflow-y: auto;
        overflow-x: visible;
        padding-right: 34px;
        width: 100%;

        .row {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 10px;

          .middle {
            text-align: center;
            line-height: 32px;
            height: 32px;
            width: 32px;
            flex-shrink: 0;
            border-top: 1px solid #dcdcdc;
            border-bottom: 1px solid #dcdcdc;
            background-color: #f3f3f3;
          }

          .del {
            position: absolute;
            right: -25px;
            top: 50%;
            transform: translateY(-50%);
            opacity: 0;
            cursor: pointer;
            color: var(--td-error-color);
            transition: opacity 450ms;
          }

          &:hover .del {
            opacity: 1;
          }
        }
      }
    }

    .search-footer {
      padding-top: 10px;
      margin-top: 10px;
      border-top: 1px solid #e8e8e8;
      text-align: right;
    }
  }

  .asset-search-right-warpper {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 0; // 为了不被溢出的内容撑开, 把宽度交给flex控制

    :deep(.t-tabs) {
      height: 100%;

      .t-tab-panel {
        padding-top: 10px;
        // 减去48px的tabs顶部
        height: calc(100% - 48px);

        // .vxe-toolbar {
        //   padding: 10px 0;
        // }
      }
    }
  }
}

.filter-warpper {
  max-height: 600px;

  :deep(.t-checkbox-group) {
    flex-direction: column;
    width: 100%;

    .t-checkbox {
      min-width: 18%;
      margin: 10px 10px 0 0;
    }
  }
}
</style>

<style>
/* .t-cascader__panel.t-cascader--normal {
  height: 200px;
} */
</style>
