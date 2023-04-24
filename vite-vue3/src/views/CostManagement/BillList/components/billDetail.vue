<template>
  <div class="bill-detail">
    <Card class="container-card">
      <t-breadcrumb>
        <t-breadcrumbItem
          @click="toBill"
        >
          账单
        </t-breadcrumbItem>
        <t-breadcrumbItem>
          页面2
        </t-breadcrumbItem>
      </t-breadcrumb>
      <t-loading
        :loading="loading.tableLoading"
        class="table-container"
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
            :title="$t(col.title)"
            :field="col.field"
            :min-width="col.minWidth"
          >
            <template #default="{ row }">
              <span>{{ row[col.field] }}</span>
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
        :page-size-options="[5, 15, 20, 50]"
        @change="(val) => { getTableList(val) }"
      />
    </Card>
  </div>
</template>

<script lang="ts" setup>
import { requestErrorMsg } from '@/common/utils'
import { useRouter } from 'vue-router'
// table
const columns = ref([
  { field: 'id', title: '资源' },
  { field: 'aa', title: '结算价格' },
  { field: 'ss', title: '用量、时长' },
  { field: 'dd', title: '所属账号' },
  { field: 'ff', title: '所属厂商' },
  { field: 'as', title: '一级产品、二级产品、三级产品、地域、类型', minWidth: 200 }
])
const loading = reactive({
  tableLoading: false
})
const tableData = ref<any[]>([])
const getTableList = async (val?: any) => {
  loading.tableLoading = true
  const { page, pageSize } = pageInfo
  try {
    // const { count, results } = await reqListFunc({ ...qeury.value, page: val?.current || page, page_size: val?.pageSize || pageSize })
    // tableData.value = results
    // pageInfo.count = count
  } catch (error: any) {
    requestErrorMsg(error.message)
  }
  loading.tableLoading = false
}
const list = computed(() => {
  return [{ id: 123 }] || tableData.value
})
onMounted(getTableList)
// page
const pageInfo = reactive({
  page: 1,
  pageSize: 15,
  count: 0
})
// toBill
const router = useRouter()
const toBill = () => {
  router.push({ name: 'Bill' })
}
</script>

<script lang="ts">
export default defineComponent({
  name: 'Name'
})
</script>

<style lang="scss" scoped>
.bill-detail {
  height: $contentHeight;
  overflow: hidden;

  .container-card {
    height: calc(100% - 20px);

    .table-container {
      height: calc(100% - 60px);
    }
  }
}
</style>
