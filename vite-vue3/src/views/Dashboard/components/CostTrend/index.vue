<template>
  <div ref="chartContainer" />
</template>

<script lang="ts" setup>
import * as echarts from 'echarts'
import { useChartResize, useRemoveResize } from '@/hook/useChartResize'
import { getChartOption } from './chartConfig'
import type { HalfYearCostTrend } from '@/api/Dashboard'

const props = defineProps<{ data: HalfYearCostTrend | null }>()
let echartIns: echarts.ECharts

const chartContainer = ref<HTMLDivElement>()

watch(() => props.data, () => {
  draw()
})

const draw = () => {
  if (!props.data) {
    echartIns.setOption(getChartOption(null, echartIns))
    return
  }
  echartIns.setOption(getChartOption(props.data, echartIns))
}

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

<style lang="scss">
// .half-year-cost-trend-tootip-item {
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   width: 220px;

//   &.click-able {
//     cursor: pointer;
//     transition: all 200ms;
//     color: var(--td-brand-color);
//     &:hover {
//       transform: scale(1.03);
//     }
//   }
// }
</style>
