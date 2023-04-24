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

// [50,100] [0,50] 根据下限排序
const sortLabelByLower = (mp:any[]) => {
  const getLower = (k:string) => +k.slice(1, k.indexOf(','))
  const compare = ({ key: k1 }:{key:string}, { key: k2 }:{key:string}) => {
    return getLower(k1) - getLower(k2)
  }
  mp.sort(compare)
}

watch(() => props.data, () => {
  if (!props.data) {
    echartIns.setOption(getChartOption(null, echartIns))
    return
  }
  const labelMap = Object.keys(props.data).map((v:string) => ({ key: v, name: v }))
  sortLabelByLower(labelMap)

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
