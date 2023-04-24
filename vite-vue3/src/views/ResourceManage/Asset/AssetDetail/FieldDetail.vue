<template>
  <Card class="asset-field-detail-container">
    <t-loading
      :loading="status.config.loading || status.data.loading"
      style="height: 100%;"
    >
      <t-breadcrumb
        :options="breadcrumbOptions"
        max-item-width="200"
        separator="/"
      />
      <div class="table-warpper">
        <vxe-grid v-bind="tableProps" />
      </div>
    </t-loading>
  </Card>
</template>

<script lang="tsx" setup>
import { useRoute, useRouter } from 'vue-router'
import { assetCategoryList } from '@/const/assetConfig'
import { reqAssetFieldDetailConfig, reqAssetDetail } from '@/api/ResourceManage/Asset'
import { requestErrorMsg } from '@/common/utils'
import type { AssetFieldDetailConfigField } from '../Types'
import type { VxeGridProps, VxeTableDefines } from 'vxe-table'
import type { TdBreadcrumbItemProps } from 'tdesign-vue-next'
import { Link as TLink } from 'tdesign-vue-next'
import { useBusinessStore } from '@/store/modules/business'
import type { AssetTypeConfig } from '@/const/assetConfig'
import { cloudProviderMap } from '@/const/cloudAccount'
import { lang } from '@/common/utils/i18n'

const route = useRoute()
const router = useRouter()

const BusinessStore = useBusinessStore()

const assetId = route.params.assetId as string
const assetType = route.params.assetType as string

let assetConfig: AssetTypeConfig | undefined
const assetCategory = assetCategoryList.find(item => {
  const typeObj = item.assets.find(asset => asset.value === assetType)
  assetConfig = typeObj
  return typeObj
})

// url参数是否正确指定
const isParamsCorrect = !!(assetType && assetConfig && assetId)

const { field_name, field, provider_key } = route.query

// query是否正确指定
const isQueryCorrect = !!(field_name && field && cloudProviderMap[provider_key as ProviderTypeEnum])

const isPayloadCorrect = isParamsCorrect && isQueryCorrect

if (!isPayloadCorrect) router.replace({ name: 'calculation', params: { business_id: BusinessStore.currentBusinessId } })

// * -------------------------
const breadcrumbOptions: TdBreadcrumbItemProps[] = [
  // 跳回父级资产大类页面
  // { content: '资产管理: ' + assetCategory?.name, router, to: { name: assetCategory?.value, params: { business_id: BusinessStore.currentBusinessId + '' } } },
  { content: '资产管理: ' + assetCategory?.name, disabled: true },
  { content: assetConfig?.label + ' 资产详情', router, to: { name: 'AssetDetail', params: route.params } },
  { content: '资产字段详情: ' + field_name }
]

// * ---------------
const status = reactive({
  config: { loading: false, list: [] as AssetFieldDetailConfigField[] },
  data: { loading: false, list: [] as any[] }
})

const getFieldConfig = async () => {
  if (!isPayloadCorrect) return
  status.config.loading = true
  try {
    status.config.list = (await reqAssetFieldDetailConfig(assetType, provider_key as ProviderTypeEnum))[0]?.fields || []
  } catch (err: any) {
    requestErrorMsg(err.message)
  }
  status.config.loading = false
}

const getAssetDetail = async () => {
  if (!isPayloadCorrect) return
  status.data.loading = true
  try {
    status.data.list = (await reqAssetDetail({ assetType, assetId }))[field as string]
  } catch (err: any) {
    requestErrorMsg(err.message)
  }
  status.data.loading = false
}
onMounted(() => {
  getFieldConfig()
  getAssetDetail()
})

// * ------------------------------------
const tableProps = computed<VxeGridProps>(() => ({
  border: true,
  height: 'auto',
  data: status.data.list,
  showOverflow: true,
  emptyText: ' ',
  columns: status.config.list.map(item => {
    const columnProps: VxeTableDefines.ColumnOptions = {
      minWidth: 150,
      sortable: true,
      field: item.field,
      title: item[`name_${lang}`]
    }

    switch (item.field) {
    case 'InstanceId':
    case 'OrderNo':
    case 'Ec2InstanceId':
      columnProps.slots = {
        default: ({ row }: any) => {
          console.log(provider_key)
          if (['tencent', 'aws'].includes(provider_key as ProviderTypeEnum)) {
            return <TLink
              content={row[item.field]}
              theme='primary'
              onClick={() => router.push({ name: 'AssetDetail', params: { assetType: 'vm', assetId: row.asset_id } })}
            />
          }
          return item.field
        }
      }
    }
    return columnProps
  })
}))

</script>

<script lang="tsx">
export default defineComponent({ name: 'AssetFieldDetail' })
</script>

<style lang="scss" scoped>
.asset-field-detail-container {
  height: calc(#{$contentHeight} - 20px);
  .table-warpper {
    padding-top: 10px;
    height: calc(100% - 22px);
  }
}
</style>
