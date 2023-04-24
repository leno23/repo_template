import { useEmptyChart } from '@/hook/useEmptyChart'
import * as echarts from 'echarts'
// const color = ['#3fb1e3','#6be6c1','#626c91','#a0a7e6','#c4ebad','#96dee8']
const color = ['#9a60b4', '#ea7ccc', '#ee6666', '#fc8452', '#fac858', '#5470c6', '#73c0de', '#26fd00', '#91cc75', '#3ba272']
// const a = echarts.init(document.documentElement)
// a.setOption()
export const getChartOption = (payload: { type: string[], data: number[], title:string } | null, echartInstance: echarts.ECharts): echarts.EChartsOption => {
  const titleOption: echarts.EChartsOption['title'] = {
    text: payload?.title,
    textStyle: {
      color: '#464646',
      fontWeight: 'bold',
      fontSize: 16
    },
    left: 'center'
  }
  if (!payload) return useEmptyChart(echartInstance, 'middle', titleOption)

  echartInstance.clear()

  return {
    title: titleOption,
    yAxis: {
      // type: 'category',
      data: payload.type,
      axisLine: { lineStyle: { color: '#6e7078' } },
      axisTick: { show: false }
    },
    xAxis: {
      splitLine: { lineStyle: { type: 'dashed', color: '#e0e5f0' } },
      axisLabel: { color: '#6e7078' }
    },
    series: [{
      type: 'bar',
      label: {
        show: true,
        position: 'right'
      },
      data: payload.data,
      itemStyle: {
        color: (params) => color[params.dataIndex % (color.length - 1)],
        borderRadius: [0, 2, 2, 0]
      }
      // barWidth: 40
    }],
    grid: { top: 50, bottom: 20, left: 310, right: 10 },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    }
  }
}
