<template>
  <div ref="chartContainer" />
</template>

<script lang="ts" setup>
import * as echarts from 'echarts'
import { useChartResize, useRemoveResize } from '@/hook/useChartResize'
import { getChartOption } from './chartConfig'

let echartIns: echarts.ECharts

const chartContainer = ref<HTMLDivElement>()

onMounted(() => {
  echartIns = echarts.init(chartContainer.value!)
  // getChartOption([])
  useChartResize(echartIns)

  echartIns.setOption(getChartOption([1], echartIns))
})

onBeforeMount(() => useRemoveResize(echartIns))

</script>

<script lang="ts">
export default defineComponent({ name: 'DashboardRegionDistribution' })
</script>
