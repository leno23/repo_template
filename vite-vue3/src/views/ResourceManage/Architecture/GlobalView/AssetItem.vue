<template>
  <t-popup>
    <template #content>
      <div
        v-for="c of content"
        :key="c"
      >
        {{ c }}
      </div>
    </template>
    <t-badge
      v-if="data.count"
      :count="data.count"
    >
      <div class="asset-container">
        <div class="asset-item">
          <Icon
            style="font-size: 20px;"
            :icon="icon"
          />
        </div>
        <div
          v-if="showName"
          class="name"
          style="text-align: center; width: 50px; font-size: 12px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;"
        >
          {{ name }}
        </div>
      </div>
    </t-badge>
    <div
      v-else
      class="asset-container"
    >
      <div class="asset-item">
        <Icon
          style="font-size: 20px;"
          :icon="icon"
        />
      </div>
      <div
        v-if="showName"
        class="name"
        style="text-align: center; width: 50px; font-size: 12px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;"
      >
        {{ name }}
      </div>
    </div>
  </t-popup>
</template>

<script lang="ts" setup>
import { computed, inject } from 'vue'
// import { Node } from '@antv/x6'
import { assetTypeIcon, vendorIcon, countryIcon } from '@/const/iconMap'
import { Icon } from '@iconify/vue'
import { Popup as TPopup } from 'tdesign-vue-next'
import { get, concat } from 'lodash'
import { assetCategoryList } from '@/const/assetConfig'
import { $t } from '@/common/utils/i18n'

const assetTypes = concat(...assetCategoryList.map(item => item.assets))
const getNode = inject('getNode') as any
const node = getNode()
const data = node.getData()
let icon = assetTypeIcon[data.assetType ? data.assetType : data.type]
if (data.type === 'provider') {
  icon = vendorIcon[data.name]
}
if (data.type === 'country') {
  if (get(countryIcon, data.code, null)) {
    icon = get(countryIcon, data.code, null)
  } else {
    icon = `twemoji:flag-${String(data.id).toLowerCase().replaceAll(' ', '-')}`
  }
}
// const icon = data.type === 'provider' ? vendorIcon[data.name] : assetTypeIcon[data.type]
const name = data.type === 'asset' ? assetTypes.find(item => item.value === data.assetType)?.label : data.name
// const showName = ['vpc', 'region', 'provider'].includes(data.type)
const showName = true
const content = computed(() => {
  const res = [
    `${data.type}: ${name}`
  ]
  if (data.type === 'asset') {
    res.push(`${$t('数量')}: ${data.count}`)
  }
  return res
})

</script>

<script lang="ts">
export default defineComponent({ name: 'AssetItem' })
</script>

<style lang="scss" scoped>

.asset-container {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  .asset-item {
    width: 50px;
    height: 50px;
    border-radius: 25px;
    border: 2px solid #000;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
