import { useEmptyChart } from '@/hook/useEmptyChart'
import { objectKeys } from '@/common/utils'
import * as echarts from 'echarts'
import { assetTypeList } from '@/const/assetConfig'
import type { AssetUsageRateTrend } from '@/api/Dashboard'

// const a = echarts.init(document.documentElement)
// a.setOption()
export const getChartOption = (payload: AssetUsageRateTrend | null, echartInstance: echarts.ECharts): echarts.EChartsOption => {
  const titleOption: echarts.EChartsOption['title'] = {
    text: '主机资产利用率变化趋势',
    textStyle: {
      color: 'rgba(255, 255, 255, 0.9)',
      fontWeight: 'normal',
      fontSize: 17
    }
  }

  if (!payload || !payload.datas?.length) return useEmptyChart(echartInstance, 'middle', titleOption, true)

  const assetDataMap: Record<string, number[]> = {}

  payload.idle_asset_types.forEach(asset => { assetDataMap[asset] = [] })

  const dataArr = payload.datas.map((item) => {
    objectKeys(assetDataMap).forEach(asset => assetDataMap[asset].push(item.value[asset] || 0))
    return item.time
  })

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
    grid: { top: 50, bottom: 50, left: 40, right: 10 },
    yAxis: {
      splitLine: { lineStyle: { type: 'dashed', color: '#8aaafbaa' } },
      axisLabel: { color: '#8aaafbaa', formatter: (name: string | number) => `${name}%` }
    },
    xAxis: {
      data: dataArr,
      axisTick: { show: false },
      axisLine: { lineStyle: { color: '#8aaafbaa' } }
    },
    series: objectKeys(assetDataMap).map(asset => ({
      name: assetTypeList.find(({ value }) => value === asset)?.label || asset,
      type: 'line',
      data: assetDataMap[asset],
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
          <span style='font-weight: bold;'>${item.value}%<span/>
          </div>
        `
        ).join('\n\n')
      }
    }
  }
}
