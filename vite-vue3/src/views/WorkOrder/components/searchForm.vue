<template>
  <t-form
    ref="form"
    :data="searchParams"
    :colon="true"
    layout="inline"
    style="flex-wrap: nowrap;"
    @reset="onReset"
    @submit="onSubmit"
  >
    <!-- <t-form-item
        :label-width="50"
        label="ID"
      >
        <t-input
          v-model="searchParams.id"
          placeholder="请输入"
        />
      </t-form-item> -->
    <t-form-item :label="$t('所属业务')">
      <BusinessSelect
        v-model="searchParams.business_ids"
        multiple
        :placeholder="$t('请选择业务')"
      />
    </t-form-item>
    <t-form-item :label="$t('工单类型')">
      <t-select
        v-model="searchParams.type"
        filterable
        clearable
        multiple
        :min-collapsed-num="1"
        style="width: 200px;"
        placeholder="请输入"
        :tag-props="{ maxWidth: 90 }"
      >
        <t-option
          v-for="val of WorkOrderStore.orderTypeListMap"
          :key="val.value"
          :label="val.label"
          :value="val.value"
        >
          {{ $t(val.label) }}
        </t-option>
      </t-select>
    </t-form-item>
    <t-form-item
      :label-width="70"
      :label="$t('状态')"
    >
      <t-select
        v-model="searchParams.status"
        filterable
        clearable
        multiple
        :min-collapsed-num="1"
        style="width: 200px;"
        placeholder="请输入"
        :tag-props="{ maxWidth: 90 }"
      >
        <t-option
          v-for="(val,key) of orderTypeMap"
          :key="key"
          :label="val"
          :value="key"
        >
          {{ $t(val) }}
        </t-option>
      </t-select>
    </t-form-item>
    <t-form-item
      class="search-box-btn"
      :label-width="20"
    >
      <t-button
        :loading="searchLoading"
        theme="primary"
        type="submit"
        content="查询"
        style="margin-right: 10px"
      />

      <t-button
        :loading="searchLoading"
        theme="default"
        variant="base"
        type="reset"
        content="重置"
      />
    </t-form-item>
  </t-form>
</template>

<script lang="ts" setup>
import { useWorkOrderStore } from '@/store/modules/workorder'
import { orderTypeMap } from '@/api/workOrder'
/** --获取工单类型-- */
const WorkOrderStore = useWorkOrderStore()
if (!(WorkOrderStore.order_type_list && WorkOrderStore.order_type_list.length)) {
  WorkOrderStore.getWorkOrderType()
}
interface searchModel {
  type?: string[] | undefined;
  business_ids?: number[] | undefined;
  status?: string[] | undefined;
  id?: any;
}
interface Emits {
  (e: 'search', val: searchModel, callBack: any): void
  (e: 'clear', callBack: any): void
}
const searchParams: searchModel = reactive({
  type: undefined,
  business_ids: undefined,
  status: undefined,
  page: undefined,
  page_size: undefined
})
const onReset = () => {
  searchParams.id = undefined
  searchParams.type = undefined
  searchParams.business_ids = undefined
  searchParams.status = undefined
  searchLoading.value = true
  emits('clear', endLoading)
}
const emits = defineEmits<Emits>()
const searchLoading = ref(false)
const onSubmit = () => {
  const params: searchModel = {}
  const { type, business_ids, status, id } = searchParams
  if (type && type.length) params.type = type
  if (business_ids && business_ids.length) params.business_ids = business_ids
  if (status && status.length) params.status = status
  if (id) params.id = parseInt(id) || undefined
  searchLoading.value = true
  emits('search', params, endLoading)
}
const endLoading = () => {
  searchLoading.value = false
}
</script>

<script lang="ts">
export default defineComponent({ name: 'WorkOrderCommonSearchForm' })
</script>
