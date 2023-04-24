<template>
  <Card class="network-order">
    <t-form
      class="hearder-box"
      layout="inline"
    >
      <t-form-item
        label="ID:"
        name="id"
        label-width="50px"
      >
        <t-input
          v-model="searchParams.id"
          style="width: 200px;"
          placeholder="请输入内容"
          clearable
        />
      </t-form-item>
      <t-form-item
        label="云厂商:"
        name="cloud_nets"
        label-width="80px"
      >
        <t-select
          v-model="searchParams.cloud_nets"
          multiple
          :min-collapsed-num="1"
          clearable
          style="width: 200px;"
        >
          <t-option
            v-for="(cloud, cloudIndex) in configOptions.cloudNetList"
            :key="cloudIndex"
            :label="cloud"
            :value="cloud"
          />
        </t-select>
      </t-form-item>
      <t-form-item
        label="当前状态:"
        name="status"
        label-width="80px"
      >
        <t-select
          v-model="searchParams.status"
          clearable
          multiple
          :min-collapsed-num="1"
          style="width: 200px;"
        >
          <t-option
            v-for="(val, key) of orderTypeMap"
            :key="key"
            :label="val"
            :value="key"
          />
        </t-select>
      </t-form-item>
      <t-button
        theme="primary"
        :loading="loading.tableLoading"
        content="查询"
        @click="searchList"
      />
      <t-button
        style="margin-left:10px"
        theme="default"
        variant="base"
        :loading="loading.tableLoading"
        content="重置"
        @click="resetting"
      />
      <t-button
        class="network-order-submit-btn"
        theme="primary"
        content="提交拨测"
        @click="dialogVisible.editFormVisible = true"
      />
    </t-form>
    <t-loading
      :loading="loading.tableLoading"
      class="network-order-table-container"
    >
      <vxe-table
        border
        auto-resize
        :column-config="{ resizable: true }"
        align="left"
        :data="list"
        show-overflow
        height="auto"
        style="min-height: 100px;"
      >
        <vxe-column
          v-for="(col, index) in columns"
          :key="index"
          :title="$t(col.title)"
          :field="col.field"
          :width="col.width"
          :formatter="col.formatter"
        >
          <template
            v-if="col.field === 'status'"
            #default="{ row }"
          >
            <OrderStatus :status="row.status" />
          </template>
        </vxe-column>
        <vxe-column
          :title="$t('操作')"
          fixed="right"
          :width="150"
        >
          <template #default="{ row }">
            <div class="order-table-operate-column">
              <t-button
                size="small"
                variant="text"
                theme="primary"
                @click="viewOrder(row)"
              >
                {{ $t('查看') }}
              </t-button>
              <t-button
                size="small"
                variant="text"
                theme="primary"
                :disabled="row.status!='Success'"
                @click="viewResult(row)"
              >
                {{ $t('结果') }}
              </t-button>
              <t-popconfirm
                theme="default"
                content="确认删除吗"
                @confirm="deleteOrder(row)"
              >
                <t-button
                  size="small"
                  variant="text"
                  theme="danger"
                  :loading="row.deleteLoading"
                >
                  {{ $t('删除') }}
                </t-button>
              </t-popconfirm>
            </div>
          </template>
        </vxe-column>
      </vxe-table>
    </t-loading>
    <t-pagination
      v-model="pageInfo.page"
      v-model:pageSize="pageInfo.page_size"
      :total="pageInfo.count"
      size="small"
      show-jumper
      show-first-and-last-page-btn
      :page-size-options="[10,15,20,30]"
    />

    <EditForm
      v-if="dialogVisible.editFormVisible"
      :visible="dialogVisible.editFormVisible"
      :config-options="configOptions"
      @reload="getTableList"
      @update:dialog-visible="changeDialogVisible"
      @view-order="viewOrder"
    />
    <DialogDetail
      v-if="dialogVisible.orderVisible&& currentRow"
      :dialog-visible="dialogVisible.orderVisible"
      :current-row="currentRow"
      @update:dialog-visible="changeDialogVisible"
    />
  </Card>
</template>

<script lang="ts" setup>
import { $t } from '@/common/utils/i18n'
import { useRouter } from 'vue-router'
import EditForm from './components/editForm.vue'
import DialogDetail from '@/views/WorkOrder/components/dialogDetail.vue'
// import { WorkOrderDetail } from '@/api/workOrder/index'
import { reqDetectList, reqDelDetectOrder, reqIsoConfig, IsoConfigModel } from '@/api/NetworkService'
import { orderTypeMap } from '@/api/workOrder'
import { requestErrorMsg } from '@/common/utils'
import OrderStatus from '@/views/WorkOrder/components/orderStatus.vue'
const router = useRouter()
const columns = ref([
  { field: 'id', title: $t('单据ID'), width: 100 },
  { field: 'purpose', title: $t('测速目的') },
  {
    field: 'start_time',
    title: $t('测速时间'),
    width: 320,
    formatter: ({ row }: any) => {
      return `${row.start_time} ~ ${row.end_time}`
    }
  },
  { field: 'cloud_nets', title: $t('测速云厂') },
  { field: 'status', title: $t('当前状态'), width: 120 },
  { field: 'created_by', title: $t('创建人') }
])
const searchParams:any = reactive({
  id: '',
  cloud_nets: '',
  status: ''
})
const dialogVisible = reactive({
  editFormVisible: false,
  orderVisible: false
})
const changeDialogVisible = (val: boolean, type?:any) => {
  if (type === 'edit') {
    dialogVisible.editFormVisible = val
  } else {
    dialogVisible.orderVisible = val
  }
}
const pageInfo = reactive({
  page: 1,
  page_size: 15,
  count: 0
})
// 获取列表数据
const tableData = ref<any[]>([])
const loading = reactive({
  tableLoading: false
})
const getTableList = async () => {
  loading.tableLoading = true
  try {
    !searchParams.id && delete searchParams.id
    !searchParams.cloud_nets && delete searchParams.cloud_nets
    !searchParams.status && delete searchParams.status
    const { count, results } = await reqDetectList({
      page: pageInfo.page,
      page_size: pageInfo.page_size,
      ...searchParams
    })
    pageInfo.count = count
    tableData.value = results
  } catch (error: any) {
    requestErrorMsg(error.message)
  }
  loading.tableLoading = false
}
onMounted(getTableList)
const list = computed(() => {
  return tableData.value
})
watch([() => pageInfo.page, () => pageInfo.page_size], () => {
  getTableList()
})
// 查询列表
const searchList = () => {
  pageInfo.page = 1
  getTableList()
}
// 重置
const resetting = () => {
  pageInfo.page = 1
  searchParams.id = ''
  searchParams.cloud_nets = null
  searchParams.status = null
  getTableList()
}

// 查看单据
const currentRow = ref()
const viewOrder = async (row: any) => {
  currentRow.value = row
  dialogVisible.orderVisible = true
}
const viewResult = async (row: any) => {
  router.push({ name: 'NetworkResult', query: { id: row?.id } })
}
// 删除单据
const deleteOrder = async (row: any) => {
  row.deleteLoading = true
  try {
    await reqDelDetectOrder({ ticket_id: Number(row.id) })
    getTableList()
  } catch (error: any) {
    requestErrorMsg(error.message)
  }
  row.deleteLoading = false
}
// 获取配置选项
const configOptions = ref<IsoConfigModel>({ cloudNetList: [], isoList: [] })
const getConfigOptions = async () => {
  try {
    configOptions.value = await reqIsoConfig()
  } catch (error: any) {
    requestErrorMsg(error.message)
  }
}
onMounted(() => {
  getConfigOptions()
})
</script>

<script lang="ts">
export default defineComponent({
  name: 'NetworkOrder'
})
</script>

<style lang="scss" scoped>
.network-order{
  // min-height: calc(100vh - 90px);
  height: calc(#{$contentHeight} - 20px);
  // height: $contentHeight;
  display: flex;
  flex-direction: column;
  .network-order-table-container{
    height: calc(100% - 42px - 34px);
    // height: 500px;
    margin-bottom: 10px;
  }
  .hearder-box{
    margin-bottom: 10px;
    width: 100%;
    flex-wrap: nowrap;
    .network-order-submit-btn {
      display: inline-block;
      margin: 0 0 0 auto;
    }
  }
}
</style>
