<template>
  <div ref="chartContainer" />
</template>

<script lang="ts" setup>
import * as echarts from 'echarts'
import { useChartResize, useRemoveResize } from '@/hook/useChartResize'
import { getChartOption } from './chartConfig'
import type { AssetCostDistribute } from '@/api/Dashboard'

const props = defineProps<{ data: AssetCostDistribute | null }>()

let echartIns: echarts.ECharts

const chartContainer = ref<HTMLDivElement>()

// 要按这个顺序
const labelMap = [
  { key: 'compute', name: '云服务器' },
  { key: 'database', name: '数据库' },
  { key: 'middleware', name: '中间件' },
  // { key: 'network', name: '网络' },
  { key: 'storage', name: '存储' },
  // { key: 'middle_platform', name: '中台' },
  { key: 'cdn', name: 'CDN' },
  { key: 'others', name: '其他' }
]

watch(() => props.data, () => {
  draw()
})

const draw = () => {
  if (!props.data) {
    echartIns.setOption(getChartOption(null, echartIns))
    return
  }
  const chartData = {
    type: labelMap.map(({ name }) => name),
    // data: objectKeys(props.data).map(key => props.)
    data: [] as number[]
  }

  labelMap.forEach(({ key }, index) => {
    chartData.data[index] = props.data![key as keyof AssetCostDistribute]
  })

  echartIns.setOption(getChartOption(chartData, echartIns))
}

onMounted(() => {
  echartIns = echarts.init(chartContainer.value!)
  useChartResize(echartIns)
  draw()
})

onBeforeMount(() => useRemoveResize(echartIns))

</script>

<script lang="ts">
export default defineComponent({ name: 'DashboardCostDistribution' })
</script>
