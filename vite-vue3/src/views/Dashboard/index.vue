<template>
  <div class="dashboard-container">
    <t-row style="width: 100%; height: 100%;">
      <t-col
        :span="4"
        style="height: 100%;"
      >
        <!-- <t-loading
          :loading="status.left.loading"
          style="height: 100%; width: 100%;"
        > -->
        <dv-border-box-12 style="height: 60px; padding: 15px;">
          <div style="display: flex; align-items: center;">
            <span style="flex-shrink: 0; font-size: 17px;">业务:</span>
            <t-select
              v-model="BusinessStore.selected"
              style="flex: 1; margin: 0 15px 0;"
              placeholder="请指定业务"
              :tag-props="{ maxWidth: 175 }"
              multiple
              filterable
              :min-collapsed-num="1"
              clearable
              :options="businessOptions"
            />
            <t-button
              variant="outline"
              theme="primary"
              style="flex-shrink: 0;"
              @click="refresh"
            >
              <template #icon><t-icon name="search" /></template>
            </t-button>
          </div>
        </dv-border-box-12>

        <dv-border-box-12 style="height: calc((100% - 60px) / 3); padding: 15px;">
          <dv-loading v-if="assetTrend.loading">Loading...</dv-loading>
          <AssetTrend
            v-else
            :data="assetTrend.data"
            style="height: 100%; width: 100%;"
          />
        </dv-border-box-12>

        <dv-border-box-12 style="height: calc((100% - 60px) / 3); padding: 15px;">
          <dv-loading v-if="assetCostDistribute.loading">Loading...</dv-loading>
          <CostDistribution
            v-else
            :data="assetCostDistribute.data"
            style="height: 100%; width: 100%;"
          />
        </dv-border-box-12>

        <dv-border-box-12 style="height: calc((100% - 60px) / 3); padding: 15px;">
          <dv-loading v-if="assetHalfYearCostTrend.loading">Loading...</dv-loading>
          <CostTrend
            v-else
            :data="assetHalfYearCostTrend.data"
            style="height: 100%; width: 100%;"
          />
        </dv-border-box-12>
      </t-col>

      <t-col
        :span="4"
        style="height: 100%;"
      >
        <dv-border-box-12 style="height: 150px; padding: 15px;">
          <dv-loading v-if="monthCost.loading || vmStatistics.loading">Loading...</dv-loading>
          <MachineInfo
            v-else
            style="height: 100%; width: 100%;"
            :curr-cost="monthCost.data"
            :data="vmStatistics.numberData"
          />
          <!-- <t-loading
            :loading="monthCost.loading || vmStatistics.loading"
            style="height: 100%; width: 100%;"
          >
            <MachineInfo
              style="height: 100%; width: 100%;"
              :curr-cost="monthCost.data"
              :data="vmStatistics.numberData"
            />
          </t-loading> -->
        </dv-border-box-12>

        <dv-border-box-11
          style="height: calc((100% - 150px) * 0.6); padding: 60px 15px 15px;"
          title="资产全球分布"
        >
          <dv-loading v-if="earthStatus.loading">Loading...</dv-loading>
          <MapData
            v-else
            style="height: 100%; width: 100%;"
            :data="earthStatus.data"
          />
        </dv-border-box-11>

        <dv-border-box-12 style="height: calc((100% - 150px) * 0.4); padding: 15px;">
          <dv-loading v-if="vmStatistics.loading">Loading...</dv-loading>
          <RegionDistribution
            v-else
            style="height: 100%; width: 100%;"
            :region-data="vmStatistics.region_count_top5"
            :provider-data="vmStatistics.provider_count_top5"
          />
        </dv-border-box-12>
      </t-col>

      <t-col
        :span="4"
        style="height: 100%;"
      >
        <dv-border-box-12 style="height: 280px; padding: 15px;">
          <dv-loading v-if="inspectionStatus.loading">Loading...</dv-loading>
          <Attention
            v-else
            style="height: calc(100% - 15px); width: 100%;"
            :data="inspectionStatus.focus_top5"
          />
        </dv-border-box-12>

        <dv-border-box-12 style="height: calc((100% - 280px) * 0.45); padding: 15px;">
          <dv-loading v-if="inspectionStatus.loading">Loading...</dv-loading>
          <AssetAvailabilityTrend
            v-else
            :data="inspectionStatus.asset_cpu_memory_userate_threading"
            style="height: 100%; width: 100%;"
          />
        </dv-border-box-12>

        <dv-border-box-12 style="height: calc((100% - 280px) * 0.55); padding: 15px;">
          <dv-loading v-if="inspectionStatus.loading">Loading...</dv-loading>
          <RiskTable
            v-else
            style="height: 100%; width: 100%;"
            :data="inspectionStatus.inspection_distribution"
          />
        </dv-border-box-12>
      </t-col>
    </t-row>
  </div>
</template>

<script lang="ts" setup>
import AssetTrend from './components/AssetTrend/index.vue'
import CostDistribution from './components/CostDistribution/index.vue'
import CostTrend from './components/CostTrend/index.vue'
import MachineInfo from './components/MachineInfo/index.vue'
// import Earth from './components/Earth/index.vue'
import MapData from './components/MapData/index.vue'
// import RegionAssetTable from './components/RegionAssetTable/index.vue'
import RegionDistribution from './components/RegionDistribution/index.vue'
import Attention from './components/Attention/index.vue'
import AssetAvailabilityTrend from './components/AssetAvailabilityTrend/index.vue'
import RiskTable from './components/RiskTable/index.vue'
import {
  reqDashboardAssetTrend,
  reqDashboardVMStatics,
  reqDashboardInspection,
  reqDashboardEarth,
  reqDashboardHalfYearCostTrend,
  reqDashboardAssetCostStatistics,
  reqDashboardMonthCost
} from '@/api/Dashboard'
import { requestErrorMsg } from '@/common/utils'
import { useBusinessStore } from '@/store/modules/business'
import { MessagePlugin } from 'tdesign-vue-next'
import type{ SelectOption } from 'tdesign-vue-next'
import type {
  AssetTrendModel,
  AssetCostDistribute,
  HalfYearCostTrend,
  RegionDistributeModel,
  ProviderDistributeModel,
  VMStatics,
  AttentionInfo,
  AssetUsageRateTrend,
  InspectionDistribution,
  EarthDataModel,
  MonthCostModel
} from '@/api/Dashboard'

const BusinessStore = useBusinessStore()
const businessOptions = computed<SelectOption[]>(() =>
  [{ label: '全选', checkAll: true } as SelectOption]
    .concat(
      BusinessStore.business.map(item => ({
        value: item.id,
        label: `${item.id}-${item.name_zh}(${item.name_en})`
      }))
    )
)

// * ------------- 资产变化趋势 -----------------
const assetTrend = reactive({
  loading: false,
  data: null as AssetTrendModel | null
})

const getAssetTrend = async () => {
  assetTrend.loading = true
  try {
    assetTrend.data = await reqDashboardAssetTrend(BusinessStore.selected)
  } catch (err: any) {
    requestErrorMsg(err.message)
  }
  assetTrend.loading = false
}

// * ----------- 资产成本分布 -------------------
const assetCostDistribute = reactive({
  loading: false,
  data: null as AssetCostDistribute | null
})

const getAssetCostDistribute = async () => {
  assetCostDistribute.loading = true
  try {
    assetCostDistribute.data = await reqDashboardAssetCostStatistics(BusinessStore.selected)
  } catch (err: any) {
    requestErrorMsg(err.message)
  }
  assetCostDistribute.loading = false
}

// * ----------- 近半年成本趋势 ------------------
const assetHalfYearCostTrend = reactive({
  loading: false,
  data: null as HalfYearCostTrend | null
})

const getHalfYearCostTrend = async () => {
  assetHalfYearCostTrend.loading = true
  try {
    assetHalfYearCostTrend.data = (await reqDashboardHalfYearCostTrend(BusinessStore.selected)).half_year_cost_trend
  } catch (err: any) {
    requestErrorMsg(err.message)
  }
  assetHalfYearCostTrend.loading = false
}

// * ---------------- 当月成本 ------------------------
const monthCost = reactive({
  loading: false,
  data: null as MonthCostModel | null
})

const getMonthCost = async () => {
  monthCost.loading = true
  try {
    monthCost.data = await reqDashboardMonthCost(BusinessStore.selected)
  } catch (err: any) {
    requestErrorMsg(err.message)
  }
  monthCost.loading = false
}

// * -------------- 预计节省、主机数量、主机核数、主机分布图表 ------------------
const vmStatistics = reactive({
  loading: false,
  numberData: null as (VMStatics & { expect_save: number }) | null,
  region_count_top5: null as RegionDistributeModel[] | null,
  provider_count_top5: null as ProviderDistributeModel[] | null
})

const getVmStatistics = async () => {
  vmStatistics.loading = true
  try {
    const { region_count_top5, provider_count_top5, statics, expect_save } = await reqDashboardVMStatics(BusinessStore.selected)
    vmStatistics.numberData = { ...statics, expect_save }
    vmStatistics.provider_count_top5 = provider_count_top5
    vmStatistics.region_count_top5 = region_count_top5
  } catch (err: any) {
    requestErrorMsg(err.message)
  }
  vmStatistics.loading = false
}

// * ------------------- 地球数据 ------------------
const earthStatus = reactive({
  loading: false,
  data: null as EarthDataModel | null
})

const getEarth = async () => {
  earthStatus.loading = true
  try {
    earthStatus.data = await reqDashboardEarth(BusinessStore.selected)
    // k8s字段少了下划线，处理一下
    // Object.values(data).forEach(v => {
    //   v.k8s_cluster = v.k8scluster
    //   delete v.k8scluster
    // })
    // earthStatus.data = data
  } catch (err: any) {
    requestErrorMsg(err.message)
  }
  earthStatus.loading = false
}

// * -------------- 右侧三个板块数据 --------------------
const inspectionStatus = reactive({
  loading: false,
  focus_top5: null as AttentionInfo[] | null,
  asset_cpu_memory_userate_threading: null as AssetUsageRateTrend | null,
  inspection_distribution: null as InspectionDistribution[] | null
})

// 右侧数据
const getInspection = async () => {
  inspectionStatus.loading = true
  try {
    const { focus_top5, asset_cpu_memory_userate_threading, inspection_distribution } = await reqDashboardInspection(BusinessStore.selected)
    inspectionStatus.focus_top5 = focus_top5
    inspectionStatus.asset_cpu_memory_userate_threading = asset_cpu_memory_userate_threading
    inspectionStatus.inspection_distribution = inspection_distribution
  } catch (err: any) {
    requestErrorMsg(err.message)
  }
  inspectionStatus.loading = false
}

const refresh = () => {
  if (!BusinessStore.selected.length) {
    MessagePlugin.error('请选择业务')
    return
  }
  getAssetCostDistribute()
  getAssetTrend()
  getHalfYearCostTrend()
  getMonthCost()
  getVmStatistics()
  getInspection()
  getEarth()
}

onMounted(refresh)

// * ---------------- 首页大屏需要临时去除掉版权信息, 直接修改, 避免增加Layout的状态判断 ------------------------
onMounted(() => {
  const style = document.createElement('style')
  style.setAttribute('id', 'dashboard-temp-style')

  style.textContent = `
    .layout-main-inner {
      padding-bottom: 0 !important;
    }
    .dp-copyright {
      display: none !important;
    }
  `
  document.head.appendChild(style)
  document.documentElement.setAttribute('theme-mode', 'dark')
})

onBeforeUnmount(() => {
  document.head.removeChild(document.getElementById('dashboard-temp-style')!)
  document.documentElement.removeAttribute('theme-mode')
})

const clickMapContainer = () => {
  console.log('hello world')
}
</script>

<script lang="ts">
export default defineComponent({ name: 'Dashboard' })
</script>

<style lang="scss" scoped>
.dashboard-container {
  height: calc(100vh - #{$navBarHeight});
  background-color: #030409;
  overflow: hidden;
  color: rgba(255, 255, 255, 0.9);
  display: flex;
  // .left-part {
  //   height: 100%;
  // }
  // .card-container {
  //   padding: 10px;
  //   // margin: 10px;
  //   background-color: #181818;
  // }

  // .column {
  //   display: flex;
  //   flex: 1;
  //   width: 0;
  //   flex-direction: column;
  // }
}
</style>
