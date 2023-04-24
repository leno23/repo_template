<template>
  <div ref="chartContainer" />
</template>

<script lang="ts" setup>
import * as echarts from 'echarts'
import { useChartResize, useRemoveResize } from '@/hook/useChartResize'
import { getChartOption } from './chartConfig'
import type { AssetTrendModel } from '@/api/Dashboard'

const props = defineProps<{ data: AssetTrendModel | null }>()
let echartIns: echarts.ECharts

const chartContainer = ref<HTMLDivElement>()

const draw = () => {
  if (!props.data) {
    echartIns.setOption(getChartOption(null, echartIns))
    return
  }
  echartIns.setOption(getChartOption(props.data, echartIns))
}
watch(() => props.data, () => {
  draw()
})

onMounted(() => {
  echartIns = echarts.init(chartContainer.value!)
  useChartResize(echartIns)

  draw()
})

onBeforeMount(() => useRemoveResize(echartIns))

</script>

<script lang="ts">
export default defineComponent({ name: 'DashboardCostTrend' })
</script>
