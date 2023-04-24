<template>
  <div class="map-data">
    <div
      v-if="showEmpty"
      class="empty-container"
    >
      <h1>无数据</h1>
    </div>
    <div
      v-if="renderMaps.length > 0"
      class="map-container"
    >
      <template v-if="renderMaps.length <= 3">
        <div
          class="first-line"
          :class="{'half': showHalf}"
        >
          <div
            v-if="renderMaps.length > 0"
            :ref="setItemRef"
            class="chart-item"
          >
            1
          </div>
          <div
            v-if="renderMaps.length > 1"
            :ref="setItemRef"
            class="chart-item"
          >
            1
          </div>
        </div>
        <div
          v-if="renderMaps.length === 3"
          class="second-line"
        >
          <div
            :ref="setItemRef"
            class="chart-item"
          >
            2
          </div>
        </div>
      </template>
      <template v-if="3 < renderMaps.length">
        <div
          class="first-line half"
        >
          <div
            :ref="setItemRef"
            class="chart-item"
          >
            1
          </div>
          <div
            :ref="setItemRef"
            class="chart-item"
          >
            1
          </div>
          <div
            :ref="setItemRef"
            class="chart-item"
          >
            1
          </div>
        </div>
        <div
          class="second-line"
        >
          <div
            v-if="renderMaps.length > 3"
            :ref="setItemRef"
            class="chart-item"
          >
            2
          </div>
          <div
            v-if="renderMaps.length > 4"
            :ref="setItemRef"
            class="chart-item"
          >
            2
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import * as echarts from 'echarts'
import NorthAmerica from '@highcharts/map-collection/custom/north-america.geo.json'
import SorthAmerica from '@highcharts/map-collection/custom/south-america.geo.json'
import Europe from '@highcharts/map-collection/custom/europe.geo.json'
import MiddleEast from '@highcharts/map-collection/custom/middle-east.geo.json'
import Asia from '@highcharts/map-collection/custom/asia.geo.json'
import World from '@highcharts/map-collection/custom/world.geo.json'
import { assetTypeList } from '@/const/assetConfig'

import { cloneDeep, remove, sum } from 'lodash'

const mapData = [
  Europe,
  NorthAmerica,
  SorthAmerica,
  MiddleEast,
  Asia
]

remove(Asia.features, (feature) => {
  return MiddleEast.features.find(item => item.id === feature.id)
})
remove(Asia.features, (feature) => {
  return Europe.features.find(item => item.id === feature.id)
})

echarts.registerMap('north-america', NorthAmerica as any)
echarts.registerMap('south-america', SorthAmerica as any)
echarts.registerMap('europe', Europe as any)
echarts.registerMap('middle-east', MiddleEast as any)
echarts.registerMap('asia', Asia as any)

const props = defineProps<{ data: Record<string, Record<string, number>> | null }>()
const showHalf = ref(true)
const showEmpty = ref(true)
let renderMaps: any = reactive([])
const mapContainers: any = ref([])

const setItemRef = (el: any) => {
  if (el) {
    mapContainers.value.push(el)
  }
}

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
  if (!props.data) {
    showEmpty.value = true
    return
  }
  showEmpty.value = false
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
  renderMaps = reactive([])
  mapContainers.value = []
  mapData.forEach(source => {
    if ((source.features as any).find((item: any) => countries.includes(item.id))) {
      renderMaps.push(source)
    }
  })
  showHalf.value = renderMaps.length >= 3
  nextTick(() => {
    renderMaps.forEach((item: any, index: any) => {
      const chart = echarts.init(mapContainers.value[index])
      const config = cloneDeep(option)
      config.title.text = item.title
      const series = {
        name: item.title,
        type: 'map',
        roam: true,
        map: String(item.title).toLowerCase().replace(' ', '-'),
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
  })
}

onMounted(() => {
  drawEarth()
})
</script>

<script lang="ts">
export default defineComponent({ name: 'DisMap' })
</script>

<style lang="scss" scoped>
.map-data {
  height: 100%;
  width: 100%;
  .empty-container {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
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
}
</style>
