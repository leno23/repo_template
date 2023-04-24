import * as echarts from 'echarts'
import { useChartResize, useRemoveResize } from '@/hook/useChartResize'
import { useEmptyChart } from '@/hook/useEmptyChart'
import { max, min } from 'lodash'

const color = ['#ee6666', '#3ba272', '#5470c6']

const getChartOption = (data: any, echartInstance: echarts.ECharts): echarts.EChartsOption => {
  const titleOption: echarts.EChartsOption['title'] = {
    text: '',
    textStyle: {
      color: 'rgba(255, 255, 255, 0.9)',
      fontWeight: 'normal',
      fontSize: 17
    }
  }

  if (!data || !data?.length) return useEmptyChart(echartInstance, 'middle', titleOption, true)

  const assetDataMap: Record<string, number[]> = {}
  const xAxisLabel: Record<string, string> = {
    cpu_util: 'CPU利用率',
    mem_util: '内存利用率',
    disk_util: '磁盘利用率'
  }
  Object.keys(data[0].value).forEach((asset: string) => {
    assetDataMap[asset] = []
  })
  const dataArr = data.map((item:{value:string, time:string}) => {
    Object.keys(assetDataMap).forEach(asset => assetDataMap[asset].push(item.value[asset] || 0))
    return item.time
  })

  echartInstance.clear()

  return {
    title: titleOption,
    color,
    grid: { top: 50, bottom: 50, left: 40, right: 10 },
    yAxis: {
      splitLine: { lineStyle: { type: 'dashed' } },
      axisLabel: { formatter: (name: string | number) => `${name}%` }
    },
    label: {
      show: true,
      formatter: ({ value, seriesId }: any) => {
        return value === max(assetDataMap[seriesId]) || value === min(assetDataMap[seriesId]) ? `${value}%` : ''
      }
    },
    xAxis: {
      data: dataArr,
      axisTick: { show: false }
    },
    series: Object.keys(assetDataMap).map(asset => ({
      name: xAxisLabel[asset],
      type: 'line',
      id: asset,
      data: assetDataMap[asset],
      smooth: true
    })),
    legend: {
      type: 'scroll',
      bottom: 'bottom',
      icon: 'roundRect'
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

const data = ref<any[]>([])
const title = ref()
const loading = ref(true)
let echartIns: echarts.ECharts

watch(data, () => {
  if (!echartIns) {
    echartIns = echarts.init(chartContainer.value!)
    useChartResize(echartIns)
  }
  loading.value = false
  if (!data.value || !data.value.length) {
    echartIns.setOption(getChartOption(null, echartIns))
    return
  }
  echartIns?.setOption(getChartOption(data.value, echartIns))
})
const chartContainer = ref()
const InspectionLine = () => (
  <>
    <div
      ref={chartContainer}
      style="height:100%"
    />
  </>
)
export default function () {
  onBeforeMount(() => useRemoveResize(echartIns))

  return { InspectionLine, data, title, loading }
}
