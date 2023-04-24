<template>
  <div ref="chartContainer" />
</template>

<script lang="ts" setup>
import * as echarts from 'echarts'
import { useChartResize, useRemoveResize } from '@/hook/useChartResize'
import { getChartOption } from './chartConfig'

const props = defineProps<{ title: string, data: {category: string, data: { name: string, value: number, percent: number }[]}[]}>()

const chartContainer = ref<HTMLDivElement>()

let echartIns: echarts.ECharts

watch(() => props.data, () => {
  if (!props.data || !props.data.length) {
    echartIns.setOption(getChartOption({ title: props.title, dataset: [] }, echartIns))
    return
  }

  // @ 只取第一个数据所有x轴分类, 避免多个category数据不对其的情况, 在prop传入前要求数据已对其
  const allDatasetName = props.data[0].data.map(({ name }) => name)

  /**
   * 转换数据格式至, 便于取值
   * {
   *   category1: { name1: 123, name2: 456 },
   *   category2: { name1: 123, name2: 456 }
   * }
   */
  const dataMap: Record<string, Record<string, number>> = {}

  props.data.forEach(item => {
    const temp: Record<string, number> = {}
    item.data.forEach(({ name, value }) => { temp[name] = value })
    dataMap[item.category] = temp
  })

  const dataset = {
    // dimensions: ['name', ...props.data.map(({ category }) => category)],
    // source: allDatasetName.map(name => {
    //   const res: Record<string, number> = {}
    //   props.data.forEach(({ category }) => { res[category] = dataMap[category][name] })
    //   return { name, ...res }
    // })
    source: [
      ['', ...props.data.map(({ category }) => category)],
      ...allDatasetName.map(name => [name, ...props.data.map(({ category }) => dataMap[category][name])])
    ]
  }

  // console.log(dataset)

  echartIns.setOption(getChartOption({ title: props.title, dataset }, echartIns))
})

onMounted(() => {
  echartIns = echarts.init(chartContainer.value!)
  useChartResize(echartIns)

  echartIns.setOption(getChartOption({ title: props.title, dataset: [] }, echartIns))
})

onBeforeMount(() => useRemoveResize(echartIns))

</script>
<script lang="ts">
export default defineComponent({ name: 'OperatorDistributionChart' })
</script>

<style lang="scss" scoped>

</style>
