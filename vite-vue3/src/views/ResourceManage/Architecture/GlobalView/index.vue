<template>
  <div id="global-view-container">
    <Card style="height: 80px;">
      <h3 style="margin: 0 0 5px 0; font-size: 18px;">{{ $t('全局视图') }}</h3>
      <AssetToolBox @redraw="paintView" />
    </Card>
    <Card
      class="global-view-container"
      bordered
    >
      <div class="toolbar">
        <div class="toolbar-content">
          <t-button
            variant="text"
            theme="default"
            size="small"
            @click="graph.zoom(0.2)"
          >
            <ZoomInIcon />
          </t-button>
          <t-button
            variant="text"
            theme="default"
            size="small"
            @click="graph.zoom(-0.1)"
          >
            <ZoomOutIcon />
          </t-button>
          <t-tooltip content="适配画布">
            <t-button
              variant="text"
              theme="default"
              size="small"
              @click="graph.zoomToFit({ maxScale: 1 })"
            >
              <ControlPlatformIcon />
            </t-button>
          </t-tooltip>
          <t-tooltip content="小地图">
            <t-button
              variant="text"
              theme="default"
              size="small"
              @click="showMinimap = !showMinimap"
            >
              <ChartBubbleIcon />
            </t-button>
          </t-tooltip>
        </div>
      </div>
      <div
        ref="view"
        class="architecture-view"
      />
    </Card>
    <div
      v-show="showMinimap"
      class="minimap"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { Graph } from '@antv/x6'
import { register } from '@antv/x6-vue-shape'
import { useBusinessStore } from '@/store/modules/business'
import { useArchitectureStore } from '@/store/modules/architecture'
import { AssetsPreview, ModelInterface } from '@/types/architecture'
import { reqBusinessAssetPreview } from '@/api/ResourceManage/Architecture'
import AssetItem from './AssetItem.vue'
import BusinessItem from './BusinessItem.vue'
import { LoadingPlugin } from 'tdesign-vue-next'
import { prepareData } from './render'
import { DagreLayout } from '@antv/layout'
import { MiniMap } from '@antv/x6-plugin-minimap'
import AssetToolBox from './ToolBox.vue'
import { uniqBy, concat } from 'lodash'
import { assetCategoryList } from '@/const/assetConfig'
import { ChartBubbleIcon, ControlPlatformIcon, ZoomOutIcon } from 'tdesign-icons-vue-next'
// import { Scroller } from '@antv/x6-plugin-scroller'

register({
  shape: 'asset-item',
  width: 100,
  height: 100,
  component: AssetItem
})

register({
  shape: 'business-item',
  width: 200,
  height: 100,
  component: BusinessItem
})

const view = ref<any>(null)
const businessStore = useBusinessStore()
const architectureStore = useArchitectureStore()

let graph: Graph
const showMinimap = ref(false)

const paintView = () => {
  const dagreLayout = new DagreLayout({
    type: 'dagre',
    rankdir: 'TB',
    align: 'DL',
    ranksep: 35,
    nodesep: 15
  })
  const model: ModelInterface = prepareData({ business_id: businessStore.currentBusinessId }, architectureStore.originData, {
    modules: architectureStore.modules,
    countries: architectureStore.country,
    providers: architectureStore.provider,
    assetTypes: architectureStore.assetTypes
  })
  // console.log(model)
  const temp = dagreLayout.layout(model)
  graph.fromJSON(temp)
  graph.zoomToFit({ maxScale: 1 })
}

const drawView = () => {
  const loading = LoadingPlugin({ attach: '#global-view-container', zIndex: 1000 })
  reqBusinessAssetPreview(businessStore.currentBusinessId).then((resp) => {
    architectureStore.setOriginData(resp as AssetsPreview)
    architectureStore.setCountries(
      uniqBy(architectureStore.originData.vpc_assets.concat(
        architectureStore.originData.region_assets
      ), 'country_en'
      ).map((item: any) => item.country_en)
    )
    architectureStore.setProvider(
      uniqBy(architectureStore.originData.vpc_assets.concat(
        architectureStore.originData.region_assets
      ), 'provider_key'
      ).map((item: any) => item.provider_key)
    )
    architectureStore.setAssetTypes(concat(...assetCategoryList.map(item => item.assets.map(asset => asset.value))))
    paintView()
  }).finally(() => {
    loading.hide()
  })
}
onMounted(() => {
  graph = new Graph({
    container: view.value as any,
    background: {
      color: '#F2F7FA'
    },
    // mousewheel: {
    //   factor: 1.05,
    //   enabled: true,
    //   modifiers: null
    // },
    panning: true,
    interacting: {
      nodeMovable: false
    }
  })
  graph.use(new MiniMap({
    container: document.querySelector('.minimap') as any
  }))
  // graph.use(
  //   new Scroller({
  //     enabled: true
  //   } as any)
  // )
  drawView()
})

watch(() => businessStore.currentBusinessId, drawView)

</script>

<script lang="ts">
export default defineComponent({ name: 'GlobalView', components: { ZoomOutIcon, ControlPlatformIcon, ChartBubbleIcon } })
</script>

<style lang="scss" scoped>
.minimap {
  position: fixed;
  z-index: 999;
  top: 170px;
  right: 30px;
  box-shadow: 0 0 10px rgb(0 0 0 / 50%);
}
.toolbar {
  position: absolute;
  z-index: 999;
  padding-left: 10px;
  padding-top: 10px;
  left: 20px;

  .toolbar-content {
    background-color: #fff;
    box-shadow: 1px 1px 4px 0 #0a0a0a2e;
  }
}
.global-view-container {
  height: calc(#{$contentHeight} - 110px);
  .architecture-view {
    height: 100%;
  }
}
</style>
