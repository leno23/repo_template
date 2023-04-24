import { useEmptyChart } from '@/hook/useEmptyChart'
import { formatValueSize } from '@/common/utils'
import * as echarts from 'echarts'
const color = [
  '#3fb1e3',
  '#6be6c1',
  '#626c91',
  '#a0a7e6',
  '#c4ebad',
  '#96dee8'
]
// const a = echarts.init(document.documentElement)
// a.setOption()
export const getChartOption = (payload: { type: string[], data: number[] } | null, echartInstance: echarts.ECharts): echarts.EChartsOption => {
  const titleOption: echarts.EChartsOption['title'] = {
    text: '资产成本分布',
    textStyle: {
      color: 'rgba(255, 255, 255, 0.9)',
      fontWeight: 'normal',
      fontSize: 17
    }
  }

  if (!payload) return useEmptyChart(echartInstance, 'middle', titleOption, true)

  echartInstance.clear()

  return {
    darkMode: true,
    title: titleOption,
    yAxis: {
      splitLine: { lineStyle: { type: 'dashed', color: '#8aaafbaa' } },
      axisLabel: { color: '#8aaafbaa', formatter: (name: number) => `￥${formatValueSize(name, 2)}` }
    },
    xAxis: {
      // type: 'category',
      data: payload.type,
      axisLine: { lineStyle: { color: '#8aaafbaa' } },
      axisTick: { show: false }
    },
    series: [{
      type: 'bar',
      data: payload.data,
      itemStyle: {
        color: (params) => color[params.dataIndex % (color.length - 1)],
        borderRadius: [5, 5, 0, 0]
      },
      barWidth: 40
    }],
    grid: { top: 50, bottom: 20, left: 60, right: 10 },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params: any) =>
        `<div>${params[0].name}</div>${params[0].marker}    <span style='font-weight: bold;'>${Number(params[0].value).toLocaleString()}元<span/>`
    }
  }
}
