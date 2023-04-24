<template>
  <t-tooltip
    :content="content"
  >
    <div class="asset-container">
      <div class="asset-item">
        {{ business?.name_zh }}
      </div>
    </div>
  </t-tooltip>
</template>

<script lang="ts" setup>
import { useBusinessStore } from '@/store/modules/business'

const businessStore = useBusinessStore()
const business = businessStore.business.find(biz => biz.id === businessStore.currentBusinessId)
const content = `OBSID: ${business?.obs_id}; 业务标签：${business?.application}`

</script>

<script lang="ts">
export default defineComponent({ name: 'BusinessItem' })
</script>

<style lang="scss" scoped>

.asset-container {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  .asset-item {
    width: 200px;
    height: 50px;
    border: 2px solid #000;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
