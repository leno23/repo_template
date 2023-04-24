<template>
  <div style="position: relative;">
    <div class="chart-custom-title">
      <span style="flex: 1;">主机地域分布TOP5</span>
      <span style="flex: 1;">主机云厂商分布</span>
    </div>

    <div
      v-if="props.regionData?.length && props.providerData?.length"
      class="chart-custom-label"
    >
      <span style="flex: 1;">{{ regionChartHighLight.region }}<br />{{ regionChartHighLight.count.toLocaleString() }}台</span>
      <span style="flex: 1;">{{ providerChartHighLight.provider }}<br />{{ providerChartHighLight.count.toLocaleString() }}台</span>
    </div>
    <div
      ref="chartContainer"
      style="height: 100%;"
    />
  </div>
</template>

<script lang="ts" setup>
import type { RegionDistributeModel, ProviderDistributeModel } from '@/api/Dashboard'
import * as echarts from 'echarts'
import { useChartResize, useRemoveResize } from '@/hook/useChartResize'
import { getChartOption } from './chartConfig'

const props = defineProps<{ regionData: RegionDistributeModel[] | null, providerData: ProviderDistributeModel[] | null }>()

const regionChartHighLight = reactive({
  currIndex: 0,
  region: '',
  count: 0
})

const providerChartHighLight = reactive({
  currIndex: 0,
  provider: '',
  count: 0
})

// let timerId: NodeJS.Timer

let echartIns: echarts.ECharts

const chartContainer = ref<HTMLDivElement>()

// const playHighlight = () => {
//   timerId = setInterval(() => {

//   })
// }

const draw = () => {
  if (!props.regionData?.length || !props.providerData?.length) {
    echartIns.setOption(getChartOption(null, echartIns))
    return
  }

  echartIns.setOption(getChartOption({ regionData: props.regionData, providerData: props.providerData }, echartIns))

  regionChartHighLight.currIndex = 0
  regionChartHighLight.region = props.regionData[0].region
  regionChartHighLight.count = props.regionData[0].count
  echartIns.dispatchAction({
    type: 'highlight',
    seriesIndex: 0,
    dataIndex: 0
  })
  providerChartHighLight.currIndex = 0
  providerChartHighLight.provider = props.providerData[0].provider_key
  providerChartHighLight.count = props.providerData[0].count

  echartIns.dispatchAction({
    type: 'highlight',
    seriesIndex: 1,
    dataIndex: 0
  })
}
watch(() => [props.regionData, props.providerData], () => {
  draw()
})

onMounted(() => {
  echartIns = echarts.init(chartContainer.value!)
  useChartResize(echartIns)

  draw()
  echartIns.on('mouseover', ({ seriesIndex, dataIndex, name, value }) => {
    // clearInterval(timerId)

    if (seriesIndex === 0) {
      echartIns.dispatchAction({
        type: 'downplay',
        seriesIndex,
        dataIndex: regionChartHighLight.currIndex
      })
      echartIns.dispatchAction({
        type: 'highlight',
        seriesIndex,
        dataIndex
      })
      regionChartHighLight.currIndex = dataIndex
      regionChartHighLight.region = name
      regionChartHighLight.count = value as number
    } else if (seriesIndex === 1) {
      echartIns.dispatchAction({
        type: 'downplay',
        seriesIndex,
        dataIndex: providerChartHighLight.currIndex
      })
      echartIns.dispatchAction({
        type: 'highlight',
        seriesIndex,
        dataIndex
      })
      providerChartHighLight.currIndex = dataIndex
      providerChartHighLight.provider = name
      providerChartHighLight.count = value as number
    }
  })

  // echartIns.on('mouseout', () => {

  // })

  // setTimeout(() => {

  // }, timeout);

  // echartIns.on('highlight', (a) => console.log(a))

  // setTimeout(() => {
  //   echartIns.dispatchAction({
  //     type: 'highlight',
  //     seriesIndex: 0,
  //     dataIndex: 1
  //   })
  //   console.log(123)
  // }, 3000)
  // echartIns.on('mouseover', ({ seriesIndex, dataIndex }) => {
  //   echartIns.dispatchAction({
  //     type: 'downplay',
  //     seriesIndex: 0,
  //     dataIndex: currHiglightIndex
  //   })

  //   echartIns.dispatchAction({
  //     type: 'highlight',
  //     seriesIndex,
  //     dataIndex
  //   })

  //   echartIns.dispatchAction({
  //     type: 'showtip',
  //     seriesIndex,
  //     dataIndex
  //   })
  // })
})

onBeforeMount(() => useRemoveResize(echartIns))

</script>

<script lang="ts">
export default defineComponent({ name: 'DashboardRegionDistribution' })
</script>

<style lang="scss">
.chart-custom-title {
  display: flex;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 17px;
}
.chart-custom-label{
  display: flex;
  align-items: center;
  position: absolute;
  top: 47%;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 14px;
}
</style>
