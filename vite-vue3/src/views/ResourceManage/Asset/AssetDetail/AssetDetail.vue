<template>
  <Card class="asset-detail-container">
    <t-loading
      :loading="status.config.loading || status.data.loading"
      style="height: 100%;"
    >
      <t-breadcrumb
        :options="breadcrumbOptions"
        max-item-width="200"
        separator="/"
      />
      <div class="content-warpper">
        <template
          v-for="config in status.config.list"
          :key="config.field"
        >
          <h3 style="margin: 10px 0; font-size: 17px;">{{ config.name }}</h3>

          <Descriptions
            :data="parseDescConfig(filterConfig(config.fields),status.data.info,route.params)"
            :column="2"
          />
        </template>
      </div>
    </t-loading>
  </Card>
</template>

<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router'
import { assetCategoryList, noDisplayAssetField } from '@/const/assetConfig'
import type { AssetTypeConfig } from '@/const/assetConfig'
import { reqAssetFieldConfig, reqAssetDetail } from '@/api/ResourceManage/Asset'
import { requestErrorMsg } from '@/common/utils'
import type { AssetParseConfig, AssetListItem, AssetParseConfigField } from '../Types'
import { useBusinessStore } from '@/store/modules/business'
import { parseDescConfig } from './config'
import type { TdBreadcrumbItemProps } from 'tdesign-vue-next'

const route = useRoute()
const router = useRouter()

const BusinessStore = useBusinessStore()

const assetId = route.params.assetId as string
const assetType = route.params.assetType as string
const providerKey = route.query.provider_key as string

let assetConfig: AssetTypeConfig | undefined
const assetCategory = assetCategoryList.find(item => {
  const typeObj = item.assets.find(asset => asset.value === assetType)
  assetConfig = typeObj
  return typeObj
})

// url参数是否正确指定, 如果不正确就跳回当前业务资产列表第一页
const isParamsCorrect = !!(assetType && assetConfig && assetId)

if (!isParamsCorrect) router.replace({ name: 'calculation', params: { business_id: BusinessStore.currentBusinessId } })

// * -------------------------
const breadcrumbOptions: TdBreadcrumbItemProps[] = [
  // 跳回父级资产大类页面
  // { content: '资产管理: ' + assetCategory?.name, router, to: { name: assetCategory?.value, params: { business_id: BusinessStore.currentBusinessId + '' } } },
  { content: '资产管理: ' + assetCategory?.name, disabled: true },
  { content: assetConfig?.label + ' 资产详情' }
]

const status = reactive({
  config: { loading: false, list: [] as AssetParseConfig[] },
  data: { loading: false, info: {} as AssetListItem }
})

const getAssetConfig = async () => {
  if (!isParamsCorrect) return
  status.config.loading = true
  try {
    status.config.list = await reqAssetFieldConfig(assetType)
  } catch (err: any) {
    requestErrorMsg(err.message)
  }
  status.config.loading = false
}

const filterConfig = (configList: AssetParseConfigField[]) => configList.filter(item =>
  !item.field.startsWith('ct__') &&
  !noDisplayAssetField.includes(item.field) &&
  !item.hidden
)

const getAssetDetail = async () => {
  if (!isParamsCorrect) return
  status.data.loading = true
  try {
    status.data.info = await reqAssetDetail({ assetType, assetId, providerKey })
  } catch (err: any) {
    requestErrorMsg(err.message)
  }
  status.data.loading = false
}

onMounted(() => {
  getAssetConfig()
  getAssetDetail()
})

</script>

<script lang="ts">
export default defineComponent({ name: 'AssetDetail' })
</script>

<style lang="scss" scoped>
.asset-detail-container {
  height: calc(#{$contentHeight} - 20px);
  .content-warpper {
    height: calc(100% - 22px);
    overflow-y: auto;
  }
}
</style>
