<template>
  <div class="whole-map">
    <div
      v-if="!props.data || Object.keys(props.data).length < 1"
      class="empty-container"
    >
      <h1>无数据</h1>
    </div>
    <t-button
      v-if="show"
      style="top: 0; right: 0; position: absolute; z-index: 999;"
      variant="text"
      @click="clickChangeType"
    >
      <icon
        icon="openmoji:world-map"
        style="font-size: 24px;"
        size="small"
      />
    </t-button>
    <DisMap
      v-if="nowType === 'area' && show"
      :data="props.data"
    />
    <EarthMap
      v-if="nowType === 'world' && show"
      :data="props.data"
    />
  </div>
</template>

<script lang="ts" setup>
import DisMap from './DisMap.vue'
import EarthMap from './EarthMap.vue'

const props = defineProps<{ data: Record<string, Record<string, number>> | null }>()
const nowType = ref('area')
const show = ref(true)

watch(() => props.data, () => {
  show.value = false
  if (!props.data || Object.keys(props.data).length < 1) return
  // initModel()
  nextTick(() => {
    show.value = true
  })
}, { immediate: true })

const clickChangeType = () => {
  if (nowType.value === 'area') {
    nowType.value = 'world'
  } else {
    nowType.value = 'area'
  }
}
</script>

<script lang="ts">
export default defineComponent({ name: 'MapContainer' })
</script>

<style>
.empty-container {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
