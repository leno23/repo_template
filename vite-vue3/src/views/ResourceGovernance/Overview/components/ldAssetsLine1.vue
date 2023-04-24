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
import { assetTypeList } from '@/const/assetConfig'
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
    title: { text: '闲置资产变化趋势', textStyle: { fontSize: 16 } },
    // color: ['#0034B5', '#951114'],
    xAxis: {
      // type: 'category',
      axisTick: { show: false },
      data: getxAxisData()
    },
    yAxis: {
      type: 'value'
    },
    tooltip: {
      trigger: 'axis'
    },
    series: getSeriesData(),
    legend: {
      // data: ['111', '222']
      data: getLegendData(true),
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
  return option
}
const getxAxisData = () => {
  const { idle_last_12_month_threading } = props.data
  const { datas } = idle_last_12_month_threading
  if (datas && datas.length) {
    return datas.map((item:any) => item.time)
  }
  return []
}
const getLegendData = (isMap?:boolean) => {
  const { idle_last_12_month_threading } = props.data
  const { idle_asset_types } = idle_last_12_month_threading
  if (idle_asset_types && idle_asset_types.length) {
    if (isMap) {
      return idle_asset_types.map((type: any) => {
        return assetTypeList.find(i => i.value === type)?.label || type
      })
    } else {
      return idle_asset_types
    }
  }
  return []
}
const getSeriesData = () => {
  const { idle_last_12_month_threading } = props.data
  const { datas } = idle_last_12_month_threading
  if (datas && datas.length) {
    const names = getLegendData()
    const dataMap:any = {}
    for (let i = 0; i < names.length; i++) {
      const name = names[i]
      for (let i = 0; i < datas.length; i++) {
        const item = datas[i].value
        if (dataMap[name]) {
          dataMap[name].push(item[name])
        } else {
          dataMap[name] = [item[name]]
        }
      }
    }
    return names.map((name:any) => {
      return {
        name: assetTypeList.find(val => val.value === name)?.label || name,
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
  name: 'LdAssetsLine'
})
</script>

<style lang="scss" scoped>
.chart {
  width: 100%;
  height: 100%;
}
</style>
