import { useEmptyChart } from '@/hook/useEmptyChart'
import { objectKeys } from '@/common/utils'
import * as echarts from 'echarts'
import type { AssetTrendModel } from '@/api/Dashboard'
import { assetCategoryList } from '@/const/assetConfig'

// const a = echarts.init(document.documentElement)
// a.setOption()
export const getChartOption = (data: AssetTrendModel | null, echartInstance: echarts.ECharts): echarts.EChartsOption => {
  const titleOption: echarts.EChartsOption['title'] = {
    text: '资产变化趋势',
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
    color: [
      '#3fb1e3',
      '#6be6c1',
      '#626c91',
      '#a0a7e6',
      '#c4ebad',
      '#96dee8'
    ],
    darkMode: true,
    grid: { top: 50, bottom: 50, left: 60, right: 10 },
    yAxis: {
      splitLine: { lineStyle: { type: 'dashed', color: '#8aaafbaa' } },
      axisLabel: { color: '#8aaafbaa' }
    },
    xAxis: {
      data: data.months,
      axisTick: { show: false },
      axisLine: { lineStyle: { color: '#8aaafbaa' } }
    },
    series: objectKeys(data).filter(key => key !== 'months').map(asset => ({
      name: asset === 'others' ? '其他' : assetCategoryList.find(item => item.value === asset)?.name || asset,
      type: 'line',
      data: Object.values(data[asset]),
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
      formatter: (params: any) => {
        return params[0].name + '\n\n' + params.map((item: any) => `
          <div style='display: flex; align-items: center; justify-content: space-between; width: 200px;'>
          <span>${item.marker}    ${item.seriesName}</span>
          <span style='font-weight: bold;'>${item.value.toLocaleString()}${item.seriesName === 'VM' ? '台' : '个'}<span/>
          </div>
        `
        ).join('\n\n')
      }
    }
  }
}
