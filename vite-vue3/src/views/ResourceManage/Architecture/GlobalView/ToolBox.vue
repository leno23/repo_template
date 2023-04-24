<template>
  <div class="toolbox">
    <div style="display: flex; align-items: center; justify-content: flex-start; flex: 1;">
      <span>{{ $t('展示模块') }}：</span>
      <t-select
        v-model="architectureStore.modules"
        :options="moduleList"
        style="width: 200px; margin-left: 10px;"
        multiple
        :min-collapsed-num="1"
      />
      <span style="margin-left: 20px;">{{ $t('国家') }}：</span>
      <t-select
        v-model="architectureStore.country"
        style="width: 200px; margin-left: 10px;"
        multiple
        :min-collapsed-num="1"
        :options="countries"
      />
      <span style="margin-left: 20px;">{{ $t('厂商') }}：</span>
      <t-select
        v-model="architectureStore.provider"
        style="width: 200px; margin-left: 10px;"
        multiple
        :min-collapsed-num="1"
        :options="providers"
      />
      <span style="margin-left: 20px;">{{ $t('展示资产') }}：</span>
      <t-select
        v-model="architectureStore.assetTypes"
        style="width: 200px; margin-left: 10px;"
        multiple
        :min-collapsed-num="1"
        :options="assetTypes"
      />
    </div>
    <div>
      <!-- <t-button
        theme="default"
        @click="showPivotTable=true"
      >
        {{ $t('透视') }}
      </t-button> -->
      <t-button
        style="margin-left: 10px;"
        @click="clickRedraw"
      >
        {{ $t('确定') }}
      </t-button>
    </div>
    <t-dialog v-model:visible="showPivotTable">
      <PivotTable />
    </t-dialog>
  </div>
</template>

<script lang="ts" setup>
import { $t } from '@/common/utils/i18n'
import { useArchitectureStore } from '@/store/modules/architecture'
import { uniqBy, concat } from 'lodash'
import { assetCategoryList } from '@/const/assetConfig'
import PivotTable from './PivotTable.vue'

const architectureStore = useArchitectureStore()

const moduleList: any = [
  { value: 'country', label: $t('国家') },
  { value: 'region', label: $t('地域') },
  { value: 'provider', label: $t('厂商') },
  { value: 'vpc', label: $t('VPC详情') },
  { value: 'asset', label: $t('资产') }
]

const assetTypes = concat(...assetCategoryList.map(item => item.assets))

const countries = computed(() => {
  return concat({ label: '全选', checkAll: true } as any, uniqBy(architectureStore.originData.vpc_assets.concat(architectureStore.originData.region_assets), 'country_en').map((item: any) => {
    return {
      value: item.country_en,
      label: item.country_zh
    }
  }))
})

const providers = computed(() => {
  return concat({ label: '全选', checkAll: true } as any, uniqBy(architectureStore.originData.vpc_assets.concat(architectureStore.originData.region_assets), 'provider_key').map((item: any) => {
    return {
      value: item.provider_key,
      label: item.provider_key
    }
  }))
})

const emit = defineEmits(['redraw'])

const clickRedraw = () => {
  emit('redraw')
}

const showPivotTable = ref(false)
</script>

<script lang="ts">
export default defineComponent({ name: 'GlobalViewToolBox' })
</script>

<style lang="scss" scoped>
.toolbox {
  margin-top: 10px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
