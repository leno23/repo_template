<template>
  <div class="earth-container">
    <div
      ref="modelContainer"
      class="asset-tooltip"
      :class="{ active: modelStatus.visible }"
    >
      <div
        class="country-name"
        :title="modelStatus.countryName"
      >
        {{ modelStatus.countryName }}
      </div>
      <div
        v-for="item of modelStatus.data"
        :key="item.value"
        class="asset-item"
        :title="`${item.label}      ${item.count}`"
        @click="gotoAsset(item)"
      >
        <div class="asset-name">{{ item.label }}</div>
        <div class="asset-count">{{ item.count }}</div>
      </div>
    </div>
    <div
      ref="chartContainer"
      style="width: 100%; height: 100%;"
    />
  </div>
</template>

<script lang="ts" setup>
import * as echarts from 'echarts'
import 'echarts-gl'
import { useRouter } from 'vue-router'
import { useBusinessStore } from '@/store/modules/business'
import world from '@highcharts/map-collection/custom/world.geo.json'
import { get } from 'lodash'
import { assetCategoryList, assetTypeList } from '@/const/assetConfig'
import starfield from '@/assets/starfield.jpeg'

echarts.registerMap('world', world as any)

const props = defineProps<{ data: Record<string, Record<string, number>> | null }>()
const router = useRouter()
const BusinessStore = useBusinessStore()

let echartIns: echarts.ECharts
const chart = echarts.init(document.createElement('canvas'), {}, {
  width: 1536,
  height: 1536
})

watch(() => props.data, () => {
  if (!props.data) return
  initModel()
  drawEarth()
}, { immediate: true })

const chartContainer = ref<HTMLElement>()
const drawEarth = () => {
  const series: any = []
  const data = props.data
  if (data) {
    Object.keys(data).forEach(key => {
      const country = world.features.find((feat: any) => feat.id === key)

      if (!country) return

      series.push({
        name: country.properties.name,
        value: 0,
        data: get(data, key),
        key
      })
    })
  }

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      show: true,
      trigger: 'item',
      showDelay: 0,
      transitionDuration: 0.2
    },
    visualMap: {
      show: false,
      left: 'right',
      inRange: {
        color: [
          '#3fb1e3',
          '#6be6c1',
          '#626c91',
          '#a0a7e6',
          '#c4ebad',
          '#96dee8'
        ]
      },
      text: ['High', 'Low'],
      calculable: true
    },
    series: [
      {
        type: 'map',
        roam: true,
        map: 'world',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        zoom: 0,
        itemStyle: {
          borderColor: 'rgb(38 122 219 / 0.4)',
          borderWidth: 1,
          areaColor: 'rgb(4 4 63 / 0.6)'
        },
        label: {
          fontSize: 14,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Microsoft YaHei", "Hiragino Sans GB", "Helvetica Neue", Helvetica, Arial, sans-serif;'
        },
        emphasis: {
          // disabled: true,
          label: {
            show: true,
            fontSize: 14,
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Microsoft YaHei", "Hiragino Sans GB", "Helvetica Neue", Helvetica, Arial, sans-serif;'
          }
        },
        // select: {
        //   disabled: true
        // },
        data: series
      }
    ]
  }

  const temp = {
    globe: {
      show: true,
      baseTexture: chart,
      environment: starfield,
      top: 'middle',
      left: 'center',
      shading: 'color',
      viewControl: {
        autoRotateSpeed: 2
      }
    }
  }
  chart.setOption(option, true)
  echartIns = echarts.init(chartContainer.value!)
  echartIns.setOption(temp, true)
}

// * ------------------- 对话框控制 ------------------
let closeModelTimer: NodeJS.Timeout | null = null
const closeModelDelay = 2000 // 2秒延迟关闭
const modelContainer = ref<HTMLDivElement>()

const modelStatus = reactive({
  data: [] as { value: string, label: string, count: string }[],
  countryName: '',
  visible: false
})

const initModel = () => {
  modelStatus.countryName = ''
  modelStatus.data = []
  modelStatus.visible = false
}

// 当鼠标在国家上移动的时候会触发
const openModel = (params: echarts.ECElementEvent) => {
  const paramsData = params.data as any
  // 有data的国家才触发
  // console.log(111)

  // if (!paramsData) {
  //   closeModel()
  //   return
  // }

  if (!paramsData || !Object.keys(props.data!).includes(paramsData.key)) {
    // initModel()
    closeModel()
    // console.log('立即关闭')
    // if (closeModelTimer) {
    //   clearTimeout(closeModelTimer)
    //   closeModelTimer = null
    // }
    return
  }

  // console.log(222)

  if (closeModelTimer) {
    clearTimeout(closeModelTimer)
    closeModelTimer = null
    console.log('停止计时')
  }

  const modelData = assetTypeList.map(({ value }) => value) // 要按照这个资产顺序渲染model资产
    .filter((assetType: string) => paramsData.data[assetType]) // 过滤当前国家没有的资产和数目为0的资产
    .map((assetType: string) => ({
      value: assetType,
      label: assetTypeList.find(({ value }) => value === assetType)?.label || assetType,
      count: paramsData.data[assetType]
    }))

  modelStatus.visible = true
  modelStatus.data = modelData
  modelStatus.countryName = paramsData.name
}

const closeModel = () => {
  if (closeModelTimer || !modelStatus.visible) return
  console.log('触发计时')

  closeModelTimer = setTimeout(() => {
    initModel()
    // modelStatus.countryName = ''
    // modelStatus.visible = false
    // modelStatus.data = []
    console.log('确认关闭')
  }, closeModelDelay)
}

const onModelFoucs = () => {
  if (!closeModelTimer) return
  clearTimeout(closeModelTimer)
  closeModelTimer = null
  console.log('关闭计时')
}

chart.on('mouseover', openModel)

// chart.on('click', openModel)

const gotoAsset = ({ value }: any) => {
  let name = ''
  assetCategoryList.find(item => {
    const typeObj = item.assets.find(asset => asset.value === value)
    name = item?.value || ''
    return typeObj
  })
  router.push({ name, params: { assetType: value, business_id: BusinessStore.currentBusinessId } })
}

onMounted(() => {
  modelContainer.value?.addEventListener('mouseenter', onModelFoucs)
  modelContainer.value?.addEventListener('mouseleave', closeModel)
})

onBeforeUnmount(() => {
  if (echartIns) echartIns.dispose()
  if (chart) chart.dispose()
  modelContainer.value?.removeEventListener('mouseenter', onModelFoucs)
  modelContainer.value?.removeEventListener('mouseleave', closeModel)
})

</script>

<script lang="ts">
export default defineComponent({ name: 'EarthContainer' })
</script>

<style lang="scss" scoped>
.earth-container {
  position: relative;
  user-select: none;
}
.asset-tooltip {
  position: absolute;
  right: 5px;
  top: 0;
  padding: 10px;
  // border: 1px dotted #5d72aa;
  background-color: #2c2c2c99;
  border-radius: 3px;
  width: 130px;
  // height: 98%;
  height: 0;
  // overflow: hidden;
  transition: all 300ms;
  // opacity: 98%;
  opacity: 0;
  overflow-y: auto;
  z-index: 999;

  &.active {
    opacity: 0.9;
    height: 98%;
    // overflow-y: auto;
  }

  .country-name {
    font-size: 13px;
    font-weight: bold;
    margin-bottom: 5px;
    height: 22px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .asset-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    cursor: pointer;
    transition: color 200ms;

    &:hover {
      color: var(--td-brand-color);
    }

    .asset-name {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .asset-count {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align: right;
    }
  }
}
</style>
