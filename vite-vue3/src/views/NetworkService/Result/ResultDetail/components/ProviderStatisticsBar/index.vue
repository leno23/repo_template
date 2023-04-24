<template>
  <div ref="chartContainer" />
</template>

<script lang="ts" setup>
import * as echarts from 'echarts'
import { useChartResize, useRemoveResize } from '@/hook/useChartResize'
import { getChartOption } from './chartConfig'

const props = defineProps<{
  data: any | null,
  title:string
 }>()

let echartIns: echarts.ECharts

const chartContainer = ref<HTMLDivElement>()

watch(() => props.data, () => {
  if (!props.data || !Object.keys(props.data).length) {
    echartIns.setOption(getChartOption(null, echartIns))
    return
  }
  const labelMap = Object.keys(props.data).map((v:string) => ({ key: v, name: v }))
  const chartData = {
    type: labelMap.map(({ name }) => name),
    data: [] as number[],
    title: props.title
  }

  labelMap.forEach(({ key }, index) => {
    chartData.data[index] = props.data![key]
  })

  echartIns.setOption(getChartOption(chartData, echartIns))
})

onMounted(() => {
  echartIns = echarts.init(chartContainer.value!)
  useChartResize(echartIns)
  echartIns.setOption(getChartOption(null, echartIns))
})

onBeforeMount(() => useRemoveResize(echartIns))

</script>

<script lang="ts">
export default defineComponent({ name: 'RatioBar' })
</script>
