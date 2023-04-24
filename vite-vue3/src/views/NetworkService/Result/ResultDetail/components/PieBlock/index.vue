<template>
  <div style="position: relative;">
    <div
      ref="chartContainer"
      style="height:300px"
    />
  </div>
</template>

<script lang="ts" setup>
import * as echarts from 'echarts'
import { useChartResize, useRemoveResize } from '@/hook/useChartResize'
import { getChartOption } from './chartConfig'

const props = defineProps<{ data:any[] }>()

const regionChartHighLight = reactive({
  currIndex: 0,
  region: '',
  count: 0
})
let echartIns: echarts.ECharts

const chartContainer = ref<HTMLDivElement>()

watch(() => props.data, () => {
  if (!props.data?.length) {
    echartIns.setOption(getChartOption(null, echartIns))
    return
  }

  echartIns.setOption(getChartOption(props.data, echartIns))

  regionChartHighLight.currIndex = 0
  regionChartHighLight.region = props.data[0].region
  regionChartHighLight.count = props.data[0].count
  echartIns.dispatchAction({
    type: 'highlight',
    seriesIndex: 0,
    dataIndex: 0
  })
})

onMounted(() => {
  echartIns = echarts.init(chartContainer.value!)
  useChartResize(echartIns)

  echartIns.setOption(getChartOption(null, echartIns))
  echartIns.on('mouseover', ({ seriesIndex, dataIndex, name, value }) => {
    // clearInterval(timerId)

    echartIns.dispatchAction({
      type: 'downplay',
      seriesIndex,
      dataIndex: regionChartHighLight.currIndex
    })
    echartIns.dispatchAction({
      type: 'highlight',
      seriesIndex,
      dataIndex
    })
    regionChartHighLight.currIndex = dataIndex
    regionChartHighLight.region = name
    regionChartHighLight.count = value as number
  })
})

onBeforeMount(() => useRemoveResize(echartIns))

</script>

<script lang="ts">
export default defineComponent({ name: 'PieBlock' })
</script>

<style lang="scss">
.chart-custom-title {
  display: flex;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 17px;
}
</style>
