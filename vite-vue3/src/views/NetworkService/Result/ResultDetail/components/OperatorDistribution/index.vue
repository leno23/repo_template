<template>
  <div
    ref="chartContainer"
    class="chart"
  />
</template>

<script lang="ts" setup>
import * as echarts from 'echarts'
import { useChartResize, useRemoveResize } from '@/hook/useChartResize'
import mapDataIndex from './mapDataIndex'
import { useEmptyChart } from '@/hook/useEmptyChart'

const props = defineProps<{
  data: any | null;
  country: string;
}>()

let echartIns: echarts.ECharts
const chartContainer = ref<HTMLDivElement>()
const color = [
  '#313695',
  '#4575b4',
  '#74add1',
  '#abd9e9',
  '#e0f3f8',
  '#ffffbf',
  '#fee090',
  '#fdae61',
  '#f46d43',
  '#d73027',
  '#a50026'
]

function getChartOption (data:any, echartInstance:echarts.ECharts) {
  if (!data) return useEmptyChart(echartInstance, 'middle', {})
  const len = data.length
  return {
    title: {
      text: '运营商分布情况',
      left: 'left'
    },
    tooltip: {
      trigger: 'item',
      showDelay: 0,
      transitionDuration: 0.2,
      formatter: ({ marker, name, value }: any) => `
        <div style='display: flex; align-items: center;'>
        <span>${marker}    ${name}</span>
        <span style='margin-left: 20px; font-weight: bold;'>${isNaN(value) ? 0 : value}<span/>
        </div>
      `
    },
    showLegendSymbol: false,
    legend: {
      // orient: 'vertical',
      left: 0,
      top: 40,
      selectedMode: 'single',
      type: 'scroll'
    },
    visualMap: [
      {
        show: false,
        inRange: {
          color
        },
        calculable: true
      }
    ],
    series: Object.entries(data).map(([name, data]) => {
      return {
        name,
        type: 'map',
        roam: true,
        map: 'USA',
        emphasis: {
          label: {
            show: true
          }
        },
        data
      }
    })
  }
}

// function getCountryName () {
//   if (props.country === 'United States') return 'USA'
//   return props.country
// }

watch(
  () => props,
  async () => {
    console.log(props)
    if (!props.data || !props.country) {
      echartIns.setOption(getChartOption(null, echartIns))
      return
    }
    const json = await mapDataIndex[props.country]()

    echarts.registerMap('USA', json)
    echartIns.setOption(getChartOption(props.data, echartIns))
  },
  { deep: true, immediate: true }
)

onMounted(() => {
  echartIns = echarts.init(chartContainer.value!)
  useChartResize(echartIns)

  echartIns.setOption(getChartOption(null, echartIns))
})

onBeforeMount(() => useRemoveResize(echartIns))
</script>

<script lang="ts">
export default defineComponent({ name: 'OperatorDistribution' })
</script>
<style lang="scss" scoped>
.chart {
  width: 100%;
  height: 400px;
}
</style>
