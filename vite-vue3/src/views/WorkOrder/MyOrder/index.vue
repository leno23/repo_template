<template>
  <div class="my-worder">
    <Card
      style="min-height: 52px;"
      margin="10px 10px 0"
    >
      <SearchForm
        @clear="clear"
        @search="search"
      />
    </Card>
    <Card class="main-card">
      <OrderTable
        ref="OrderTableRef"
        :req-list-func="reqMyWorkOrderList"
      >
        <template #operate="{ row }">
          <t-button
            size="small"
            theme="primary"
            @click="handlePreview(row, 'clone')"
          >
            {{ $t('克隆') }}
          </t-button>
          <t-button
            v-show="(row.status === 'Processing' && row.components && row.components[0] && row.components[0].status === 'Waiting' && row.components[0].type === 'Approval')"
            theme="warning"
            size="small"
            @click="handlePreview(row, 'withdraw')"
          >
            {{ $t('撤回') }}
          </t-button>
          <t-button
            v-show="isShowRetry(row)"
            size="small"
            variant="outline"
            theme="primary"
            @click="handlePreview(row, 'retry')"
          >
            {{ $t('重试') }}
          </t-button>
        </template>
      </OrderTable>
    </Card>
  </div>
</template>

<script lang="ts" setup>
import SearchForm from '../components/searchForm.vue'
import OrderTable from '../components/orderTable.vue'
import Card from '@/components/Card/index.vue'
import { reqMyWorkOrderList } from '@/api/workOrder/index'
const OrderTableRef = ref<InstanceType<typeof OrderTable>>()
/** --筛选-- */
const search = async (val: any, callBack: any) => {
  OrderTableRef?.value?.search(val, callBack)
}
const clear = async (callBack: any) => {
  OrderTableRef?.value?.clear(callBack)
}
/** --克隆/撤回/重试工单-- */
const handlePreview = (row: any, type: any) => {
  OrderTableRef.value?.view(row, type)
}
/** 是否展示重试按钮 */
const isShowRetry = (row: any) => {
  const checkStatus = ['Fail', 'PartialFail'].includes(row.status)
  const checkComponents = row?.components && row?.components.find((item: any) => item.status === 'Fail')
  return checkStatus && checkComponents
}
</script>

<script lang="ts">
export default defineComponent({ name: 'MyOrder' })
</script>

<style lang="scss" scoped>
.my-worder {
  height: $contentHeight;
  display: flex;
  flex-direction: column;

  .main-card {
    flex: 1;
    height: 0;
  }
}

</style>
