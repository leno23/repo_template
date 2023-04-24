import { useEmptyChart } from '@/hook/useEmptyChart'
import { objectKeys, formatValueSize } from '@/common/utils'
import * as echarts from 'echarts'
import type { HalfYearCostTrend } from '@/api/Dashboard'

// const a = echarts.init(document.documentElement)
// a.setOption()
export const getChartOption = (data: HalfYearCostTrend | null, echartInstance: echarts.ECharts): echarts.EChartsOption => {
  const titleOption: echarts.EChartsOption['title'] = {
    text: '近半年成本趋势',
    textStyle: {
      color: 'rgba(255, 255, 255, 0.9)',
      fontWeight: 'normal',
      fontSize: 17
    }
  }

  // Object.keys(data).length === 表示只有months一个key
  if (!data || Object.keys(data).length === 1) return useEmptyChart(echartInstance, 'middle', titleOption, true)

  echartInstance.clear()

  return {
    title: titleOption,
    darkMode: true,
    color: [
      '#3fb1e3',
      '#6be6c1',
      '#626c91',
      '#a0a7e6',
      '#c4ebad',
      '#96dee8'
    ],
    grid: { top: 50, bottom: 50, left: 60, right: 10 },
    yAxis: {
      splitLine: { lineStyle: { type: 'dashed', color: '#8aaafbaa' } },
      axisLabel: { color: '#8aaafbaa', formatter: (name: number) => `￥${formatValueSize(name)}` }
    },
    xAxis: {
      data: data.months,
      axisTick: { show: false },
      axisLine: { lineStyle: { color: '#8aaafbaa' } }
    },
    series: objectKeys(data)
      .filter(key => key !== 'months' && data[key].find(v => v !== '0.00')) // 如果近半年值都是0的云厂商就去掉不显示
      .map(provider => ({
        name: provider,
        type: 'line',
        data: Object.values(data[provider]),
        smooth: true
      })),
    legend: {
      type: 'scroll',
      bottom: 'bottom',
      icon: 'roundRect',
      inactiveColor: '#454545',
      textStyle: { color: 'rgba(255,255,255, 0.9)' }
    },
    tooltip: {
      trigger: 'axis',
      // enterable: true,
      // position: (point) => {
      //   console.log(point)
      //   return [point[0] + 10, point[1] + 10]
      // },
      formatter: (params: any) => {
        return params[0].name + '\n\n' + params.map((item: any) => `
          <div style='display: flex; align-items: center; justify-content: space-between; width: 220px;'>
          <span>${item.marker}    ${item.seriesName}</span>
          <span style='font-weight: bold;'>${Number(item.value).toLocaleString()}元<span/>
          </div>
        `
        ).join('\n\n')
      }
    }
  }
}
