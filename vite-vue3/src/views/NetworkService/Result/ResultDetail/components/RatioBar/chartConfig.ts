import { useEmptyChart } from '@/hook/useEmptyChart'
import { formatValueSize } from '@/common/utils'
import * as echarts from 'echarts'
import { round, sum } from 'lodash'

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
  const total = sum(payload.data)
  titleOption.text += `(总数:${total})`
  return {
    title: titleOption,
    yAxis: {
      splitLine: { lineStyle: { type: 'dashed', color: '#e0e5f0' } },
      axisLabel: { color: '#6e7078', formatter: (name: number) => `${formatValueSize(name, 2)}` }
    },
    label: {
      show: true,
      position: 'top',
      formatter ({ value }:{value: number}) {
        return `${value} ${round(value * 100 / total, 2)}%`
      }
    },
    xAxis: {
      // type: 'category',
      data: payload.type,
      axisLine: { lineStyle: { color: '#6e7078' } },
      axisTick: { show: false }
    },
    series: [{
      type: 'bar',
      data: payload.data,
      itemStyle: {
        color: (params) => color[params.dataIndex % (color.length - 1)],
        borderRadius: [0, 0, 0, 0]
      }
      // barWidth: 40
    }],
    grid: { top: 50, bottom: 20, left: 60, right: 10 },
    tooltip: {
      trigger: 'item',
      axisPointer: { type: 'shadow' },
      formatter ({ marker, name, value }: any) {
        return `${marker} ${name}<br>${value} ${round(value * 100 / total, 2)}%`
      }
    }
  }
}
