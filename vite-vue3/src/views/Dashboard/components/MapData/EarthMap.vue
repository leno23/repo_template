<template>
  <div
    ref="mapContainer"
    class="map-container"
  />
</template>

<script lang="ts" setup>
import * as echarts from 'echarts'
import World from '@highcharts/map-collection/custom/world.geo.json'
import { assetTypeList } from '@/const/assetConfig'

import { cloneDeep, sum } from 'lodash'

echarts.registerMap('world', World as any)

const props = defineProps<{ data: Record<string, Record<string, number>> | null }>()
const mapContainer: any = ref()

const option = {
  backgroundColor: 'transparent',
  tooltip: {
    show: true,
    trigger: 'item',
    showDelay: 0,
    transitionDuration: 0.2,
    formatter (params: any) {
      const dataLine = Object.keys(params.data?.data || []).filter(item => {
        return params.data?.data[item] > 0
      }).map(item => {
        const assetType = assetTypeList.find(asset => asset.value === item)
        if (assetType) {
          return `<div style="display: flex; align-items: center; justify-content: space-between;"><span>${assetType.label}</span><span>${params.data.data[item]}</span></div>`
        }
        return item
      }).join('')
      return `<h3>${params.name}</h3></br>${dataLine}`
    }
  },
  title: {
    text: ''
  },
  dataZoom: {
    type: 'inside'
  },
  visualMap: {
    show: false,
    left: 'right',
    min: 0,
    max: 0,

    text: ['High', 'Low'],
    calculable: true
  },
  series: [] as any
}

const drawEarth = () => {
  const countries: Array<string> = Object.keys(props.data as any)
  const mapSeries: any = []
  let maxData = 0
  countries.forEach(country => {
    const data = props.data![country]
    const cData = World.features.find(item => item.id === country)
    if (!cData) {
      return true
    }
    const sumValue = sum(Object.values(data))
    if (maxData < sumValue) maxData = sumValue
    mapSeries.push({
      name: cData.properties.name,
      value: sumValue,
      data,
      key: country
    })
  })
  option.visualMap.max = maxData
  nextTick(() => {
    const chart = echarts.init(mapContainer.value)
    const config = cloneDeep(option)
    const series = {
      name: '',
      type: 'map',
      roam: true,
      map: 'world',
      emphasis: {
        label: {
          show: true
        }
      },
      itemStyle: {
        borderColor: 'rgb(38 122 219 / 0.4)',
        borderWidth: 1,
        areaColor: 'rgb(4 4 63 / 0.6)'
      },
      data: mapSeries
    }
    config.series.push(series)
    chart.setOption(config)
  })
}

onMounted(() => {
  drawEarth()
})
</script>

<script lang="ts">
export default defineComponent({ name: 'EarthMap' })
</script>

<style lang="scss" scoped>
.map-container {
  height: 100%;
  width: 100%;

  .chart-item {
    height: 100%;
    flex: 1;
  }
  .first-line {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &.half {
      height: 50% !important;
    }
  }
  .second-line {
    height: 50%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
