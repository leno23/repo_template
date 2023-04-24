<template>
  <div class="chart-container">
    <div
      v-for="chart of chartData"
      :key="chart.title"
      ref="chartItem"
      class="chart-item"
    />
  </div>
</template>

<script lang="ts" setup>
import * as echarts from 'echarts'
import { $t } from '@/common/utils/i18n'
import { get } from 'lodash'

const prop = defineProps<{ data: any }>()

const lineMap = {
  cpu_util: {
    title: $t('CPU 使用率监控'),
    unit: '%'
  },
  mem_util: {
    title: $t('内存使用率监控'),
    unit: '%'
  },
  disk_util: {
    title: $t('磁盘使用率监控'),
    unit: '%'
  }
}

const chartData = ref<any>([])
const chartItem = ref()

const drawLine = () => {
  if (prop.data && prop.data.length > 0) {
    Object.keys(lineMap).forEach(key => {
      if (get(prop.data[0], key, undefined) !== undefined) {
        chartData.value.push({
          title: {
            text: get(lineMap, key).title,
            textStyle: {
              fontSize: 14
            }
          },
          xAxis: {
            type: 'category',
            data: prop.data.map((item: any) => item.ts_key)
          },
          yAxis: {
            type: 'value',
            axisLabel: { formatter: `{value} ${get(lineMap, key).unit}` }
          },
          legend: {
            type: 'scroll',
            bottom: 'bottom',
            icon: 'roundRect'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross'
            }
          },
          grid: { top: 50, bottom: 50, left: 40, right: 10 },
          series: [{
            name: get(lineMap, key).title,
            type: 'line',
            data: prop.data.map((item: any) => get(item, key))
          }]
        })
      }
    })
    nextTick(() => {
      chartItem.value.forEach((element: any, i: number) => {
        const chart = echarts.init(element)
        chart.setOption(chartData.value[i])
      })
    })
  }
}

onMounted(() => {
  drawLine()
})

</script>
<script lang="ts">
export default defineComponent({ name: 'MonitorChart' })
</script>

<style lang="scss">
.chart-container {
  height: 100%;
  overflow-y: auto;
}
.chart-item {
  height: 200px;
  width: 100%;
}
</style>
