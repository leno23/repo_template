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
  const option = {
    title: {
      text: '风险账号分布（Top10）',
      textStyle: { fontSize: 16 }
    },
    grid: {
      top: 40,
      bottom: 60,
      left: 50,
      right: 50
    },
    // color: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'],
    xAxis: {
      show: true,
      type: 'category',
      axisLabel: {
        interval: 0,
        formatter: (params:any) => {
          let newParamsName = ''
          const paramsNameNumber = params.length
          const provideNumber = 3 // 单行显示文字个数
          const rowNumber = Math.ceil(paramsNameNumber / provideNumber)
          if (paramsNameNumber > provideNumber) {
            for (let p = 0; p < Math.min(rowNumber, 4); p++) {
              let tempStr = ''
              const start = p * provideNumber
              const end = start + provideNumber
              if (p >= 3) {
                tempStr = '...'
              } else {
                tempStr = params.substring(start, end) + '\n'
              }
              newParamsName += tempStr
            }
          } else {
            newParamsName = params
          }
          return newParamsName
        }
      },
      // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      data: getLegend()
    },
    tooltip: {
      show: true,
      trigger: 'axis',
      confine: true
    },
    yAxis: {
      type: 'value'
    },
    // label: { show: true },
    series: [
      {
        // data: [120, 200, 150, 80, 70, 110, 130],
        data: getSeriesData(),
        type: 'bar',
        // color: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'],
        showBackground: true,
        backgroundStyle: {
          color: 'rgba(180, 180, 180, 0.2)'
        }
      }
    ]
  }
  return option
}
const getLegend = () => {
  const { account_inspection_count_top10 } = props.data
  if (account_inspection_count_top10 && account_inspection_count_top10.length) {
    return account_inspection_count_top10.map((item:any) => {
      return item?.account_info?.name
    })
  } else {
    return []
  }
}
const getSeriesData = () => {
  const colors = ['#9a60b4', '#ea7ccc', '#ee6666', '#fc8452', '#fac858', '#5470c6', '#73c0de', '#26fd00', '#91cc75', '#3ba272']
  const { account_inspection_count_top10 } = props.data
  if (account_inspection_count_top10 && account_inspection_count_top10.length) {
    return account_inspection_count_top10.map((item: any, index:number) => {
      return {
        name: item?.account_info?.name,
        value: item?.count,
        itemStyle: {
          color: colors[index]
        }
      }
    })
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
  name: 'LineTrend'
})
</script>

<style lang="scss" scoped>
.chart {
  width: 100%;
  height: 100%;
}
</style>
