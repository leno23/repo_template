<template>
  <div ref="chartContainer" />
</template>

<script lang="ts" setup>
import * as echarts from 'echarts'
import { useChartResize, useRemoveResize } from '@/hook/useChartResize'
import { getChartOption } from './chartConfig'

const props = defineProps<{
  title: string,
  data: {name: string, value: number}[]
}>()

const chartContainer = ref<HTMLDivElement>()

let echartIns: echarts.ECharts

watch(() => props.data, () => {
  if (!props.data || !props.data.length) {
    echartIns.setOption(getChartOption({ title: props.title, data: [] }, echartIns))
    return
  }
  echartIns.setOption(getChartOption({ title: props.title, data: props.data }, echartIns))
})

onMounted(() => {
  echartIns = echarts.init(chartContainer.value!)
  useChartResize(echartIns)

  echartIns.setOption(getChartOption({ title: props.title, data: [] }, echartIns))
})

onBeforeMount(() => useRemoveResize(echartIns))

</script>
<script lang="ts">
export default defineComponent({ name: 'IspDistributionChart' })
</script>

<style lang="scss" scoped>

</style>
