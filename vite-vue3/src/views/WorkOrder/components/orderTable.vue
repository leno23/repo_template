<template>
  <div style="height: calc(100% - 34px);">
    <t-loading
      :loading="loading.tableLoading"
      style="height:100%"
    >
      <vxe-table
        border
        auto-resize
        :column-config="{ resizable: true }"
        :row-config="{ isCurrent: true, isHover: true }"
        align="left"
        :data="list"
        show-overflow
        height="auto"
        size="small"
      >
        <vxe-column
          v-for="(col, index) in columns"
          :key="index"
          :min-width="col.minWidth"
          :title="$t(col.title)"
          :field="col.field"
        >
          <template #default="{ row }">
            <span v-if="col.field === 'status'">
              <OrderStatus :status="row.status" /></span>
            <span v-else>{{ row[col.field] }}</span>
          </template>
        </vxe-column>
        <vxe-column
          :title="$t('操作')"
          fixed="right"
          :min-width="lang === 'en' ? 210 : 190"
        >
          <template #default="{ row }">
            <div class="order-table-operate-column">
              <t-button
                size="small"
                theme="default"
                variant="outline"
                @click="view(row, 'view')"
              >
                {{ $t('查看') }}
              </t-button>

              <slot
                name="operate"
                :row="row"
              />
            </div>
          </template>
        </vxe-column>
      </vxe-table>
    </t-loading>
    <t-pagination
      v-model="pageInfo.page"
      v-model:pageSize="pageInfo.pageSize"
      style="margin-top: 10px;"
      size="small"
      :total="pageInfo.count"
      show-jumper
      show-first-and-last-page-btn
      :page-size-options="[5,15,20,50]"
      @change="(val) => { getTableList(val) }"
    />
    <DialogDetail
      v-if="dialogVisible"
      :dialog-visible="dialogVisible"
      :current-row="currentRow"
      :handle-aprove="handleAprove"
      :type="route.name === 'OrderApprove' ? 'approve' : showDetailType"
      @update:dialog-visible="changeDialogVisible"
      @handle-work-order="handleWorkOrder"
    />
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { WorkOrderDetail, reqCloneWorkOrder, reqWithdrawWorkOrder, reqRetryWorkOrder } from '@/api/workOrder/index'
import { requestErrorMsg } from '@/common/utils'
import { lang, $t } from '@/common/utils/i18n'
import { useBusinessStore } from '@/store/modules/business'
import DialogDetail from './dialogDetail.vue'
import OrderStatus from './orderStatus.vue'
import { MessagePlugin } from 'tdesign-vue-next'
import dayjs from 'dayjs'
interface IProps {
  reqListFunc: any
  handleAprove?: any
}
const props = defineProps<IProps>()
const BusinessStore = useBusinessStore()
const columns = ref([
  { field: 'id', title: $t('单据ID'), minWidth: '120' },
  { field: 'business_id', title: $t('所属业务'), minWidth: '120' },
  { field: 'account_name', title: $t('账号名'), minWidth: '140' },
  { field: 'watchers', title: $t('关注人'), minWidth: '140' },
  { field: 'type', title: $t('工单类型'), minWidth: '150' },
  { field: 'created_by', title: $t('提单人'), minWidth: '120' },
  { field: 'created_at', title: $t('创建时间'), minWidth: '180' },
  { field: 'status', title: $t('当前状态'), minWidth: '90' },
  { field: 'handle_users', title: $t('当前处理人'), minWidth: '200', ellipsis: true }
])
/** --获取列表-- */
const route = useRoute()
const tableData = ref<WorkOrderDetail[]>([])
const loading = reactive({
  tableLoading: false
})
const pageInfo = reactive({
  page: 1,
  pageSize: 15,
  count: 0
})
const qeury = ref({})
const getTableList = async (val?:any) => {
  const { ticket_id } = route.params
  loading.tableLoading = true
  const { page, pageSize } = pageInfo
  try {
    const { count, results } = await props.reqListFunc({ ...qeury.value, page: val?.current || page, page_size: val?.pageSize || pageSize })
    // params有参数ticket_id，自动打开对应的详情弹窗
    if (ticket_id) {
      const row = results.find((item: any) => `${item.id}` === `${ticket_id}`)
      row && view(row)
      delete route.params.ticket_id
    }
    tableData.value = results
    pageInfo.count = count
  } catch (error: any) {
    requestErrorMsg(error.message)
  }
  loading.tableLoading = false
}
onMounted(getTableList)
const list = computed(() => {
  return tableData.value.map((item: WorkOrderDetail) => {
    const handleUsers = item.components[item.current_component_position].handle_users
    return {
      ...item,
      watchers: item.watchers ? item.watchers.join('，') : '',
      created_at: item.created_at ? dayjs.utc(item.created_at).format() : '',
      handle_users: handleUsers ? handleUsers.join('，') : '',
      type: item[`type_${lang}`] || item?.type,
      order_type: item.type,
      business_id: (BusinessStore.businessMap[item?.business_id] && BusinessStore.businessMap[item?.business_id][`name_${lang}`]) || item?.business_id
    }
  })
})
/** --筛选-- */
const search = async (val: any, callBack: any) => {
  pageInfo.page = 1// 点击查询了，查询第一页
  qeury.value = checkParams(Object.assign({}, val))// search 同步query
  await getTableList()
  callBack && callBack()
}
const clear = async (callBack: any) => {
  pageInfo.page = 1
  pageInfo.pageSize = 15
  qeury.value = {}// clear 同步query
  await getTableList()
  callBack && callBack()
}
const checkParams = (params: any) => {
  if (!params) return {}
  for (const key in params) {
    if (!params[key]) {
      delete params[key]
    }
  }
  return params
}
/** --查看-- */
const dialogVisible = ref<boolean>(false)
const currentRow = ref()
const showDetailType = ref('view')
const view = (row: any, type?: string) => {
  showDetailType.value = type || 'view'
  currentRow.value = row
  dialogVisible.value = true
}
const changeDialogVisible = (val: boolean) => {
  dialogVisible.value = val
}
/** --克隆/重试/撤回工单-- */
const handleWorkOrder = async (row: any, type: any) => {
  let handleFun = null
  if (type === 'clone') handleFun = reqCloneWorkOrder
  else if (type === 'withdraw') handleFun = reqWithdrawWorkOrder
  else if (type === 'retry') handleFun = reqRetryWorkOrder
  if (!handleFun) return
  try {
    await handleFun(row.id)
    MessagePlugin.success(`${$t(type)}${lang === 'en' ? ' ' : ''}${$t('成功')}`)
    dialogVisible.value = false
    getTableList()
  } catch (error: any) {
    requestErrorMsg(error.message)
  }
}
// 暴露函数
defineExpose({ getTableList, search, view, clear, changeDialogVisible })
</script>

<script lang="ts">
export default defineComponent({
  name: 'OrderTable'
})
</script>

<style lang="scss">
.PartialFail{
  background-color: #909399;
}
.Draft{
  background-color: #fff;
  color: #535353;
  border:1px solid #cfcfcf;
}
.Waiting{
     background-color: #79bbff;
    border-color: #79bbff;
    color: #fff;
}
.order-table-operate-column{
  .t-button{
    margin-left: 5px;
  }
}
</style>
