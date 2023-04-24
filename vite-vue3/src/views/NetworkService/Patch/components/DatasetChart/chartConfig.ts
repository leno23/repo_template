/* eslint-disable no-irregular-whitespace */
import { useEmptyChart } from '@/hook/useEmptyChart'
// import type { RegionDistributeModel, ProviderDistributeModel } from '@/api/Dashboard'
import * as echarts from 'echarts'

export const getChartOption = (
  data: { title: string, dataset: echarts.EChartsOption['dataset'] },
  echartInstance: echarts.ECharts
): echarts.EChartsOption => {
  const titleOption: echarts.EChartsOption['title'] = {
    text: data.title,
    textStyle: {
      fontWeight: 'normal',
      fontSize: 15
    },
    left: 'center'
  }

  echartInstance.clear()

  if (!data || !data.dataset) return useEmptyChart(echartInstance, 'middle', titleOption)

  return {
    title: titleOption,
    xAxis: { type: 'category' },
    yAxis: {},
    label: { show: true, position: 'top' },
    series: [{ type: 'bar', color: '#73bf69' }, { type: 'bar', color: '#5794f2' }],
    grid: { top: 40, bottom: 30, left: 80, right: 80 },
    tooltip: { trigger: 'axis' },
    legend: { right: '0', orient: 'horizontal' },
    dataset: data.dataset
  }
}
