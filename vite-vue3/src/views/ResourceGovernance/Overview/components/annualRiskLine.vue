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
    title: { text: '年风险趋势（总风险和解决的风险）', textStyle: { fontSize: 16 } },
    color: ['#0034B5', '#951114'],
    xAxis: {
      // type: 'category',
      axisTick: { show: false },
      // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      data: getxAxisData()
    },
    yAxis: {
      type: 'value'
    },
    tooltip: {
      trigger: 'axis'
    },
    // series: [
    //   {
    //     name: '111',
    //     data: [150, 230, 224, 218, 135, 147, 260],
    //     type: 'line'
    //   },
    //   {
    //     name: '222',
    //     data: [218, 135, 147, 260, 150, 230, 224],
    //     type: 'line'
    //   }
    // ],
    series: getSeriesData(),
    legend: {
      // data: ['111', '222']
      data: getLegendData(),
      bottom: 0
    },
    // label: { show: true },
    grid: {
      left: 60,
      right: 60,
      bottom: 40,
      top: 40
    }
  }
}
const getxAxisData = () => {
  console.log(props.data)
  const { last_12_month_threading } = props.data
  if (last_12_month_threading && last_12_month_threading.length) {
    return last_12_month_threading.map((item:any) => item.time)
  }
  return []
}
const getLegendData = () => {
  const { last_12_month_threading } = props.data
  if (last_12_month_threading && last_12_month_threading.length) {
    const obj = last_12_month_threading[0].value || {}
    const keys = Object.keys(obj)
    return keys
  }
  return []
}
const getSeriesData = () => {
  const { last_12_month_threading } = props.data
  if (last_12_month_threading && last_12_month_threading.length) {
    const names = getLegendData()
    const dataMap:any = {}
    for (let i = 0; i < names.length; i++) {
      const name = names[i]
      for (let i = 0; i < last_12_month_threading.length; i++) {
        const item = last_12_month_threading[i].value
        if (dataMap[name]) {
          dataMap[name].push(item[name])
        } else {
          dataMap[name] = [item[name]]
        }
      }
    }
    return names.map((name:any) => {
      return {
        name,
        data: dataMap[name],
        type: 'line'
      }
    })
  }
  return []
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
  name: 'AnnualRiskLine'
})
</script>

<style lang="scss" scoped>
.chart {
  width: 100%;
  height: 100%;
}
</style>
