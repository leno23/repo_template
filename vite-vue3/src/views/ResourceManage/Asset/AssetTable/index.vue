<template>
  <Card class="asset-manage-container">
    <h3 style="margin: 0 0 5px 0; font-size: 18px;">资产管理</h3>
    <t-tabs
      v-model="status.activeType"
      :list="TabPanels"
    />

    <t-dialog
      v-model:visible="optStatus.visible"
      :close-on-esc-keydown="false"
      :close-on-overlay-click="false"
      :header="optMap[optStatus.action] + activeLabel"
      :confirm-btn="{ onClick: conformAction, loading: optStatus.loading }"
    >
      <t-form
        ref="optFormRef"
        :data="optStatus.form"
        :label-width="80"
      >
        <t-form-item
          v-if="status.activeType === 'iam'"
          name="reason"
          label="理由"
          :rules="[{ required: true, message: '请输入理由' }]"
        >
          <t-textarea
            v-model="optStatus.form.reason"
            :maxcharacter="255"
          />
        </t-form-item>

        <t-form-item
          label="备注"
          name="notes"
        >
          <t-textarea
            v-model="optStatus.form.notes"
            :maxcharacter="255"
          />
        </t-form-item>
      </t-form>
    </t-dialog>

    <SubAccountCreater v-model:visible="createSubAccountVisible" />

    <AssetTypeSearch
      ref="AssetTypeSearchRef"
      v-model:visible="searchVisible"
      :loading="status.data.loading"
      :config="status.config.list"
      :asset-type="status.activeType"
      @search="initPageDispatchGetList"
    />
  </Card>
</template>

<script lang="tsx" setup>
import { useRoute, useRouter } from 'vue-router'
import { Loading as TLoading, Button as TButton, Pagination as TPagination, DialogPlugin, Input as TInput, MessagePlugin } from 'tdesign-vue-next'
import { assetCategoryList } from '@/const/assetConfig'
import { getTableProps, getSubnetTableProps, exportTableHandler } from '../dataHandler'
import { Grid as VxeGrid } from 'vxe-table'
import SubAccountCreater from './components/SubAccountCreater.vue'
import AssetTypeSearch from './components/AssetTypeSearch.vue'
import { reqAssetFieldConfig, reqAssetList } from '@/api/ResourceManage/Asset'
import type { ExportAssetListPayload } from '@/api/ResourceManage/Asset'
import { useBusinessStore } from '@/store/modules/business'
import { requestErrorMsg } from '@/common/utils'
import { $t, lang } from '@/common/utils/i18n'
import { useCloudAccountStore } from '@/store/modules/cloudAccount'
import { reqCreateWorkOrder } from '@/api/workOrder'
import { SearchIcon, FilterIcon } from 'tdesign-icons-vue-next'
import type { AssetListItem, AssetParseConfig, AssetParseConfigField, AssetActionType } from '../Types'
import type { TdTabPanelProps, TdButtonProps, FormInstanceFunctions } from 'tdesign-vue-next'
import type { VxeGridInstance } from 'vxe-table'

const BusinessStore = useBusinessStore()
const CloudAccountStore = useCloudAccountStore()

const route = useRoute()
const router = useRouter()

const status = reactive({
  activeType: '',
  keyword: '',
  config: {
    loading: false,
    list: [] as AssetParseConfig[],

    // 当资产为VPC时，有显示子网的一个展开子表格，需要用到subVpc的配置
    subVpcConfig: [] as AssetParseConfig[]
  },
  data: {
    page: 1,
    page_size: 15,
    list: [] as AssetListItem[],
    count: 0,
    loading: false
  }
})

const AssetTypeSearchRef = ref<InstanceType<typeof AssetTypeSearch>>()
const searchVisible = ref(false)

// 当前资产大分类对象
const currAssetCategory = computed(() => assetCategoryList.find(({ value }) => value === route.name)!)

// 切换资产分类时，默认显示第一个tab
watch(
  currAssetCategory,
  () => {
    if (!currAssetCategory.value) return
    let urlAssetType = route.params.assetType as string
    urlAssetType = currAssetCategory.value.assets.find(item => item.value === urlAssetType) ? urlAssetType : ''
    status.activeType = urlAssetType || (currAssetCategory.value.assets[0].value || '')
  },
  { immediate: true }
)

// 资产类型配置对象
const activeAssetTypeObj = computed(() => currAssetCategory.value?.assets.find(({ value }) => value === status.activeType))
const activeLabel = computed(() => activeAssetTypeObj.value?.label || '')

// * -----------------------------------------------------
const getAssetConfig = async () => {
  status.config.subVpcConfig = []
  status.config.list = []

  status.config.loading = true
  try {
    status.config.list = await reqAssetFieldConfig(status.activeType)

    // 当资产为VPC时，有显示子网的一个展开子表格，需要用到subVpc的配置
    if (status.activeType === 'vpc') {
      status.config.subVpcConfig = await reqAssetFieldConfig('sub_vpc')
    }
    status.config.loading = false
  } catch (err: any) {
    requestErrorMsg(err.message)
    // 该接口调用有自动取消上一个请求的逻辑，如果当前调用被取消则表示已经开始下一个请求，保留loading
    if (err.message !== 'Cancel Request canceled') status.config.loading = false
  }
}

// * -----------------------------------------------------
const getAssetList = async () => {
  status.data.list = []

  const { page, page_size, count } = status.data
  let maxPage = Math.ceil(count / page_size)
  if (!maxPage) maxPage = 1
  if (page > maxPage) {
    status.data.page = maxPage
    return // 从现有的count计算最大支持页码，如果目标page与变动后的page_size超出count，则中止请求，修改page到最大页码，依赖监听自动重新调用
  }

  // console.log(AssetTypeSearchRef.value?.parseParams())

  status.data.loading = true
  try {
    const { results, count } = await reqAssetList({
      business_id: BusinessStore.currentBusinessId,
      type: status.activeType,
      page,
      page_size,
      page_enabled: true,
      search: status.keyword.trim() || undefined,
      ...(AssetTypeSearchRef.value?.parseParams() || {})
    })
    status.data.list = results
    status.data.count = count

    status.data.loading = false
  } catch (err: any) {
    requestErrorMsg(err.message)
    // 该接口调用有自动取消上一个请求的逻辑，如果当前调用被取消则表示已经开始下一个请求，保留loading
    if (err.message !== 'Cancel Request canceled') status.data.loading = false
  }
}

// 某些情况下触发请求数据需要重置页码为第一页
const initPageDispatchGetList = () => {
  if (status.data.page === 1) getAssetList()
  else status.data.page = 1
}

// 切换资产和业务时刷新，需要把count重置，getAssetList中会自动计算page更改为1，并改为触发分页的监听器进行刷新
watch(
  () => [status.activeType, BusinessStore.currentBusinessId],
  () => {
    if (!BusinessStore.currentBusinessId || !status.activeType) return
    // 绑定tab激活和params的assetType
    if (status.activeType !== route.params.assetType) router.push({ params: { ...route.params, assetType: status.activeType } })
    status.data.count = 0
    getAssetConfig()
    getAssetList()
  },
  { immediate: true }
)

// 单独监听分页更改，只刷新list不刷新config
watch(
  () => [status.data.page, status.data.page_size],
  () => {
    if (!BusinessStore.currentBusinessId || !status.activeType) return
    getAssetList()
  }
)

// * ---------------------- 渲染 --------------------------------
const optButtonProps: TdButtonProps = {
  size: 'small',
  variant: 'text'
}

// 表格toolbar左侧jsx
const ToolbarLeft = () => (
  <>
    <TInput
      v-model={status.keyword}
      style='width: 350px;'
      clearable
      placeholder={activeAssetTypeObj.value?.placeholder[`name_${lang}`]}
      onKeyup={(_, { e }) => e.key === 'Enter' && initPageDispatchGetList()}
      onClear={initPageDispatchGetList}
    />
    <TButton
      icon={() => <SearchIcon />}
      theme='default'
      title={$t('搜索关键词')}
      onClick={initPageDispatchGetList}
    />
    <TButton icon={() => <FilterIcon />} theme='default' onClick={() => { searchVisible.value = true }} style='margin-left: 15px;' title={$t('资产搜索')} />
  </>
)

const createSubAccountVisible = ref(false)

// 表格toolbar右侧自定义部分的jsx
const ToolbarRight = () => status.activeType === 'iam'
  ? <TButton onClick={() => { createSubAccountVisible.value = true }} content='新增' style='margin-right: 12px;' />
  : null

const tableRef = ref<VxeGridInstance>()

// 表格渲染JSX
const PanelContent = () => {
  const tableProps = getTableProps({
    fieldConfig: status.config.list.reduce((res, curr) => res.concat(curr.fields), [] as AssetParseConfigField[]),
    data: status.data.list
  })

  if (status.config.list.length && status.data.list.length) {
    if (status.activeType === 'vpc') {
    // vpc资产插入展开列展示subnet子网
      const subnetFieldConfig = status.config.subVpcConfig.reduce((res, curr) => res.concat(curr.fields), [] as AssetParseConfigField[])
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
      width: 180,
      fixed: 'right',
      title: $t('操作'),
      slots: {
        default: ({ row }: { row: AssetListItem }) => {
          const operations = [<TButton {...optButtonProps} theme='primary' content='详情' onClick={() => goToAssetDetail(row)} />]
          if (['iam'].includes(status.activeType)) operations.push(<TButton {...optButtonProps} theme='warning' content='禁用' onClick={() => openActionDialog(row, 'forbid')} />)
          if (['iam', 'vpc', 'sub_vpc'].includes(status.activeType)) operations.push(<TButton {...optButtonProps} theme='danger' content='删除' onClick={() => openActionDialog(row, 'delete')} />)
          return operations
        }
      }
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
        type: status.activeType,
        export_fields: columns.map(({ field }) => field),
        business_id: BusinessStore.currentBusinessId,
        search: status.keyword.trim() || undefined,
        file_name: filename.trim() + '.' + type,
        page_enabled: mode !== 'all',
        page: mode === 'all' ? undefined : status.data.page,
        page_size: mode === 'all' ? undefined : status.data.page_size,
        ...(AssetTypeSearchRef.value?.parseParams() || {})
      }

      await exportTableHandler(params)
    }
  }

  if (status.config.loading || status.data.loading) tableProps.emptyText = ' '

  return (
    <TLoading loading={status.config.loading || status.data.loading} style='height: 100%;'>
      <div style='display: flex; flex-direction: column; height: 100%;'>
        <div style='flex: 1; height: 0;'>
          <VxeGrid {...tableProps} ref={ins => { tableRef.value = ins as any }}>{{ ToolbarLeft, ToolbarRight }}</VxeGrid>
        </div>
        {/* // ! 注意在jsx写冒号会导致eslint解析失败，所以不用v-model */}
        <TPagination
          current={status.data.page}
          pageSize={status.data.page_size}
          onCurrentChange={(v) => { status.data.page = v }}
          onPageSizeChange={(v) => { status.data.page_size = v }}
          total={status.data.count}
          showJumper
          pageSizeOptions={[15, 25, 35, 50, 100]}
          size='small'
          style='margin-top: 10px; flex-shrink: 0;'
        />
      </div>
    </TLoading>
  )
}

const TabPanels = computed(() => currAssetCategory.value?.assets.map(item => ({
  label: item.label,
  value: item.value,
  panel: PanelContent
} as TdTabPanelProps) || []))

const goToAssetDetail = (item: AssetListItem) => {
  // business_id已存在url,不用传params
  router.push({ name: 'AssetDetail', params: { assetType: item.asset_type, assetId: item.id } })
}

// * -------------------- 禁用、删除操作 -------------------
const optFormRef = ref<FormInstanceFunctions>()

const optMap: Record<AssetActionType, string> = {
  forbid: $t('禁用'),
  delete: $t('删除')
}

// const accountList = computed(() => )

const optStatus = reactive({
  visible: false,
  loading: false,
  action: 'forbin' as AssetActionType,
  form: { reason: '', notes: '' },
  targetRow: null as null | AssetListItem
})

const openActionDialog = (item: AssetListItem, action: AssetActionType) => {
  optFormRef.value?.reset()
  optStatus.visible = true
  optStatus.action = action
  optStatus.targetRow = item
}

// 解析要提交的工单的请求参数
const getActionParams = (item: AssetListItem) => {
  const business_id = BusinessStore.currentBusinessId
  const { vpc_id, azure_resource_group_name, region, created_by, provider_key, origin_name, origin_uid, email, account_type, console_login } = item
  const account_name = CloudAccountStore.businessAccounts(business_id)?.list.find(({ id }) => id === Number(created_by))?.name || ''

  const { reason, notes } = optStatus.form

  if (status.activeType === 'iam') {
    return {
      ticket_template_type: `request_${optStatus.action}_sub_account`,
      business_id,
      params: {
        account_id: created_by,
        reason: reason.trim(),
        notes: notes.trim() || undefined,
        account_name,
        provider_key,
        sub_account: [{ account_id: created_by, provider_key, origin_name, origin_uid, email, account_type, console_login }]
      }
    }
  }

  if (['sub_vpc', 'vpc'].includes(status.activeType)) {
    return {
      ticket_template_type: { sub_vpc: 'request_delete_subnet', vpc: 'request_delete_vpc' }[status.activeType],
      params: {
        account_id: created_by,
        business_id,
        provider_key,
        region,
        origin_uid,
        origin_name,
        account_name,
        notes: notes.trim() || undefined,
        azure_resource_group_name: azure_resource_group_name || undefined,
        vpc_id: vpc_id || undefined
      }
    }
  }

  return null
}

const conformAction = async () => {
  const pass = await optFormRef.value?.validate()
  if (pass !== true) return

  const payload = getActionParams(optStatus.targetRow!)
  if (!payload) return

  // diaIns?.destroy()

  optStatus.loading = true
  try {
    const { ticket_id } = await reqCreateWorkOrder(payload as any)

    const diaIns = DialogPlugin.confirm({
      header: '已成功提交工单， ID: ' + ticket_id,
      body: '是否跳转至查看工单',
      closeOnEscKeydown: false,
      closeOnOverlayClick: false,
      onConfirm: () => { diaIns.destroy(); router.push({ name: 'MyOrder', params: { ticket_id } }) },
      onClosed: () => diaIns.destroy()
    })
  } catch (err: any) {
    requestErrorMsg(err.message)
  }
  optStatus.loading = false
  optStatus.visible = false
}

</script>

<script lang="tsx">
export default defineComponent({ name: 'Assets' })
</script>

<style lang="scss" scoped>
.asset-manage-container {
  display: flex;
  flex-direction: column;
  height: calc(#{$contentHeight} - 20px);
  .asset-warpper {
    border: 1px solid #e7e7e7;
  }

  :deep(.t-tabs) {
    flex: 1;

    // tabs顶部重置为40px
    .t-tabs__nav-item {
      line-height: 40px;
      height: 40px;
    }
    .t-tab-panel {
      // padding-top: 10px;
      // 减去40px的tabs顶部
      height: calc(100% - 40px);

      .vxe-toolbar {
        padding: 10px 0;
      }
    }
  }
}
</style>
