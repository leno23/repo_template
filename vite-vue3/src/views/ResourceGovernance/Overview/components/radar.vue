<template>
  <div
    ref="chartRef"
    class="chart"
  />
</template>

<script lang="ts" setup>
import * as echarts from 'echarts'
import { ECharts } from 'echarts'
import { useChartResize, useRemoveResize } from '@/hook/useChartResize'
interface IProps {
  data: any
}
const props = withDefaults(defineProps<IProps>(), {
  data: {}
})
const chartRef = ref<HTMLDivElement>()
let chart: ECharts
function getChartOptions () {
  return {
    title: {
      show: false,
      textStyle: { fontSize: 16 }
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: getLegendData(),
      bottom: 0
    },
    label: { show: true },
    radar: {
      // shape: 'circle',
      // radius: '75%',
      nameGap: '10',
      axisName: { color: '#000' },
      splitNumber: 3,
      splitLine: { lineStyle: { color: '#c6c6c6' } },
      splitArea: { show: true, areaStyle: { color: ['#DCDCDC', '#DCDCDC'] } },
      indicator: getIndicator()
      // axisLabel: {
      //   show: true,
      //   showMinLabel: false,
      //   showMaxLabel: true,
      //   margin: 8
      // }
    },
    series: [
      {
        // name: 'Budget vs spending',
        type: 'radar',
        // color: ['#0034B5', '#951114'],
        symbolSize: 3,
        tooltip: {
          trigger: 'item',
          confine: true
        },

        label: {
          show: true, // 显示数值
          position: 'insideTop',
          fontSize: 10
        },
        data: getSeriesData()
      }
    ]
  }
}
const getIndicator = () => {
  const { account_category_distribution } = props.data
  if (account_category_distribution && account_category_distribution.max) { // cost: '成本', availability: '可用性', service_limit: '服务限制', security: '安全'
    const tempMap:any = [
      { key: 'performance', text: '性能' },
      { key: 'cost', text: '成本' },
      { key: 'availability', text: '可用性' },
      { key: 'service_limit', text: '服务限制' },
      { key: 'security', text: '安全' }
    ]
    const arr = []
    for (let i = 0; i < tempMap.length; i++) {
      const item:any = tempMap[i]
      const { key, text } = item
      const max = account_category_distribution.max[key]
      arr.push({ text, max })
    }
    return arr
  } else {
    return [{ text: '性能' }, { text: '成本' }, { text: '可用性' }, { text: '服务限制 ' }, { text: '安全' }]
  }
}
const getLegendData = () => {
  const { account_category_distribution } = props.data
  if (account_category_distribution && account_category_distribution.datas) {
    return ['风险问题类型分布']
  }
}
const getSeriesData = () => {
  const { account_category_distribution } = props.data
  if (account_category_distribution && account_category_distribution.datas) {
    return [
      {
        name: '风险问题类型分布',
        // value: [200, 500, 600, 800, 110]
        value: [
          account_category_distribution.datas.performance,
          account_category_distribution.datas.cost,
          account_category_distribution.datas.availability,
          account_category_distribution.datas.service_limit,
          account_category_distribution.datas.security
        ]
      }
    ]
  } else {
    return []
  }
}
onMounted(() => {
  useChartResize(chart = echarts.init(chartRef.value!))
  chart.setOption(getChartOptions())
})
onUnmounted(() => {
  if (chart) {
    useRemoveResize(chart)
    chart.dispose()
  }
})
watch(() => props.data, () => {
  chart.clear()
  chart.setOption(getChartOptions())
})
</script>

<script lang="ts">
export default defineComponent({
  name: 'Radar'
})
</script>

<style lang="scss" scoped>
.chart {
  width: 100%;
  height: 100%;
}
</style>
