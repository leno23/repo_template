<template>
  <div class="bill-list">
    <Card class="container-card">
      <div class="search-box">
        <t-select
          v-model="searchParams.type"
          filterable
          clearable
          multiple
          :min-collapsed-num="1"
          style="width: 200px;margin-right: 20px; display: inline-block;float: left;"
          placeholder="请输入"
          :tag-props="{ maxWidth: 90 }"
        >
          <t-option
            v-for="val of [{ value: 'CEP', label: 'CEP' }, { value: 'PUBGM', label: 'PUBGM' }]"
            :key="val.value"
            :label="val.label"
            :value="val.value"
          />
        </t-select>
        <t-date-range-picker
          style="float: left;"
          mode="month"
          clearable
          allow-input
        />
      </div>
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
          >
            <template
              #default="{ row }"
            >
              <t-link
                v-if="col.field === 'id'"
                theme="primary"
                @click="toDetail(row)"
              >
                {{ row[col.field] }}
              </t-link>
              <span v-else>{{ row[col.field] }}</span>
            </template>
          </vxe-column>
          <vxe-column
            :title="$t('操作')"
            fixed="right"
          >
            <template #default="{ row }">
              <div class="order-table-operate-column">
                <t-button
                  size="small"
                  theme="default"
                  variant="outline"
                  @click="view(row)"
                >
                  {{ $t('查看详情') }}
                </t-button>
                <t-button
                  size="small"
                  theme="primary"
                  style="margin:0 10px;"
                  @click="view(row)"
                >
                  {{ $t('确认') }}
                </t-button>
                <t-button
                  size="small"
                  theme="warning"
                  @click="view(row)"
                >
                  {{ $t('驳回') }}
                </t-button>
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
  { field: 'id', title: 'ID' },
  { field: 'aa', title: '所属业务' },
  { field: 'ss', title: '汇总金额' },
  { field: 'dd', title: '当前状态' },
  { field: 'ff', title: '确认人' }
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
// search
const searchParams = reactive({
  type: undefined
})
// page
const pageInfo = reactive({
  page: 1,
  pageSize: 15,
  count: 0
})
// operate
const view = (row: any) => {
  console.log(row)
}
// toDetail
const router = useRouter()
const toDetail = (row:any) => {
  router.push({ path: `bill/${row.id}` })
}
</script>

<script lang="ts">
export default defineComponent({
  name: 'Name'
})
</script>

<style lang="scss" scoped>
.bill-list {
  height: $contentHeight;
  overflow: hidden;

  .container-card {
    height: calc(100% - 20px);

    .search-box {
      margin-bottom: 10px;
      overflow: hidden;
    }

    .table-container {
      height: calc(100% - 72px);
    }
  }
}
</style>
