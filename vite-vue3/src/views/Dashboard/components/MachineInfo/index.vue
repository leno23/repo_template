<template>
  <div class="vm-info-container">
    <div
      class="info-item"
      style="width: 35%;"
      :title="(currCost?.cur_month_cost || '') + ''"
    >
      <div class="info-label">
        当月成本
      </div>
      <div class="info-num">
        ￥{{ formatValueSize(transitionNumbers[0]) }}
      </div>
    </div>
    <div
      class="info-item"
      :title="(data?.expect_save || '') + ''"
      style="width: 35%; border-right: 1px solid #2e6099;"
    >
      <div class="info-label">可优化资产规模</div>
      <div class="info-num">
        {{ formatValueSize(transitionNumbers[1]) }}
      </div>
    </div>
    <div
      class="info-item"
      style="width: 30%; text-align: center;"
    >
      <div
        style="margin-bottom: 10px;"
        :title="(data?.vm_count || '') + ''"
      >
        <div style="font-size: 15px;">主机数量</div>
        <div style="margin-top: 5px; font-size: 22px; color: #3de5c7;">{{ transitionNumbers[2].toFixed(0) }}</div>
      </div>

      <div :title="(data?.cpu_core_count || '') + ''">
        <div style="font-size: 15px;">主机核数</div>
        <div style="margin-top: 5px; font-size: 22px; color: #3de5c7;">{{ transitionNumbers[3].toFixed(0) }}</div>
      </div>
    </div>

    <div
      :style="`position:absolute; left: 0; top: 0; width: 35%; font-size: 12px; color: ${(currCost?.month_on_month_ratio || 0) >= 0 ? '#e24c59' : '#078c5a'};`"
      class="flex-xy-center"
    >
      <t-icon
        :name="(currCost?.month_on_month_ratio || 0) >= 0 ? 'caret-up-small' : 'caret-down-small'"
        size="25px"
      />
      环比{{ (currCost?.month_on_month_ratio || 0) >= 0 ? '上涨' : '下跌' }}{{ transitionNumbers[4].toFixed(2) }}%
    </div>

    <div
      :style="`position:absolute; left: 0; bottom: 0; width: 35%; font-size: 12px; color: ${(currCost?.year_over_year_ratio || 0) >= 0 ? '#e24c59' : '#078c5a'};`"
      class="flex-xy-center"
    >
      <t-icon
        :name="(currCost?.year_over_year_ratio || 0) >= 0 ? 'caret-up-small' : 'caret-down-small'"
        size="25px"
      />
      同比{{ (currCost?.year_over_year_ratio || 0) >= 0 ? '上涨' : '下跌' }}{{ transitionNumbers[5].toFixed(2) }}%
    </div>
  </div>
</template>

<script lang="ts" setup>
import { formatValueSize } from '@/common/utils'
import { useTransition } from '@vueuse/core'
import type { VMStatics, MonthCostModel } from '@/api/Dashboard'

const props = defineProps<{
  data:(VMStatics & { expect_save: number }) | null
  currCost: MonthCostModel | null
}>()

const numberSource = computed(() => [
  props.currCost?.cur_month_cost || 0,
  props.data?.expect_save || 0,
  props.data?.vm_count || 0,
  props.data?.cpu_core_count || 0,
  ((props.currCost?.month_on_month_ratio || 0) * 100),
  ((props.currCost?.year_over_year_ratio || 0) * 100)
])

const transitionNumbers = useTransition(numberSource)

</script>

<script lang="ts">
export default defineComponent({ name: 'DashboardCostTrend' })
</script>

<style lang="scss" scoped>
.vm-info-container {
  display: flex;
  align-items: center;
  .info-item {
    display:flex;
    flex-direction: column;
    // flex: 1;
    // width: 25%;
    align-items: center;
    // padding: 10px 0;

    .info-label {
      font-size: 17px;
      flex-shrink: 0;
    }

    .info-num {
      flex-shrink: 0;
      margin-top: 10px;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 100%;
      white-space: nowrap;
      font-size: 30px;
      text-align: center;
      line-height: 30px;
      color: #3de5c7;
    }
  }
}
</style>
