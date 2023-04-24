<template>
  <Card class="risk-issues">
    <div class="header">
      <t-radio-group
        v-model:value="currentStatus"
        default-value="Unprocessed"
      >
        <t-radio-button value="Unprocessed">{{ $t('未处理') }}</t-radio-button>
        <t-radio-button value="Fixed">{{ $t('已处理') }}</t-radio-button>
        <t-radio-button value="Ignored">{{ $t('已忽略') }}</t-radio-button>
      </t-radio-group>
      <t-button
        class="operation-btn distribution"
        @click="batchAssign"
      >
        {{ $t('批量分配') }}
      </t-button>
      <t-button
        v-if="currentStatus!=='Fixed'"
        class="operation-btn ignore"
        @click="handleIgnore"
      >
        {{ $t(ignoreBtnText) }}
      </t-button>
    </div>
    <div class="search-tab">
      <BusinessSelect
        v-model="BusinessStore.selected"
        multiple
        :style="{marginRight: '10px',width: '30%'}"
        :placeholder="$t('若不指定业务则查询所有业务下的数据')"
      />
      <t-select
        v-model="formState.selectedInspection"
        clearable
        :style="{marginRight: '10px',width: '200px'}"
        :placeholder="$t('请选择巡检项')"
        filterable
        :loading="inspectionList.length===0"
        :options="inspectionList"
      />
      <t-cascader
        v-model="formState.selectedAsset"
        :show-all-levels="false"
        :options="assetOptions"
        style="width:200px;"
        :min-collapsed-num="1"
        multiple
        clearable
      />
      <t-input
        v-model="formState.searchWord"
        :placeholder="$t('搜索（支持搜索语法，如问题、实例、等级、处理人等）')"
        style="width: 400px;"
        class="inline-block marginleft10"
      />
      <t-button
        theme="primary"
        style="width:80px;margin-left:10px;"
        shape="square"
        class="marginLeft10"
        @click="getListData"
      >
        <template #icon>
          <SearchIcon />
        </template>
        {{ $t('搜索') }}
      </t-button>
    </div>
    <div style="flex: 1">
      <t-loading
        :loading="isLoading"
        style="height: calc(100% - 34px)"
      >
        <vxe-table
          ref="xTable1"
          height="auto"
          border
          show-overflow
          :column-config="{ resizable: true }"
          :data="tableData"
          :sort-config="{defaultSort:[],trigger:'cell',multiple:true}"
          @sort-change="sortChange"
          @checkbox-change="checkChange"
          @checkbox-all="checkChange"
        >
          <vxe-column
            type="checkbox"
            width="60"
          />
          <vxe-column
            v-for="{field,title,sortable},ind in columns"
            :key="ind"
            :sortable="!!sortable"
            :field="field"
            :title="title"
          >
            <template #default="{row}">
              <CellContent
                :row="row"
                :field="field"
              />
            </template>
          </vxe-column>
        </vxe-table>
        <t-pagination
          :current="pager.page"
          :page-size="pager.page_size"
          :total="pager.count"
          show-jumper
          :page-size-options="[15, 25, 35, 50, 100]"
          size="small"
          style="margin-top: 10px;"
          @current-change="
            (v) => {
              pager.page = v;
            }
          "
          @page-size-change="
            (v) => {
              pager.page_size = v;
            }
          "
        />
      </t-loading>
    </div>
    <t-dialog
      v-model:visible="userChooseVis"
      attach="body"
      width="60%"

      :header="$t('选择处理人')"
      :on-confirm="confirmUserChoose"
      :on-cancel="() => userChooseVis == false"
    >
      <template #body>
        <TSelect
          v-model="selectedUser"
          :scroll="{ type: 'virtual' }"
          multiple
          :min-collapsed-num="60"
          :loading="userDataLoading"
          :options="userOptions"
          style="width: 90%; margin: 10px"
          :placeholder="$t('请选择人员')"
          clearable
          filterable
        />
      </template>
    </t-dialog>
    <IgnoreForm
      v-model:visible="ignoreSettingVis"
      :rows="selectedRows"
      @confirm="()=>getListData()"
    />
  </Card>
</template>

<script lang="tsx" setup>
import { VxeTableInstance } from 'vxe-table'
import { useRouter, useRoute } from 'vue-router'
import Card from '@/components/Card/index.vue'
import { reqGetInspectionList, reqRiskIssueList, reqUpdateIssueState } from '@/api/RiskIssue'
import type { RiskIssueStatusEnum, UpdateParamModel } from '@/api/RiskIssue'
import dayjs from 'dayjs'
import { useUserStore } from '@/store/modules/user'
import { MessagePlugin, TdCascaderProps } from 'tdesign-vue-next'
import { debounce, get } from 'lodash'
import { useBusinessStore } from '@/store/modules/business'
import { $t, lang } from '@/common/utils/i18n'
import { ChevronDownIcon, SearchIcon, UserIcon } from 'tdesign-icons-vue-next'
import { assetCategoryList } from '@/const/assetConfig'
import IgnoreForm from './components/IgnoreForm.vue'
import { requestErrorMsg } from '@/common/utils'

const route = useRoute()
const router = useRouter()
const UserStore = useUserStore()
const BusinessStore = useBusinessStore()
interface formModel {
  selectedAsset:string[],
  searchWord:string
  id:number
  selectedInspection:string
}
const formState = reactive<formModel>({
  selectedAsset: [],
  searchWord: '',
  id: -1,
  selectedInspection: `${route.query.inspection_id}` || ''
})

interface ColumnItem{
  field:string
  title:string
  sortable?:number
}
const columns = computed<ColumnItem[]>(() => {
  const active = currentStatus.value
  const rest:ColumnItem[] = []
  if (active === 'Ignored') {
    rest.push({ field: 'ignore_by', title: $t('忽略人') },
      { field: 'ignore_reason', title: $t('忽略原因') },
      { field: 'ignore_destination_date', title: $t('忽略截止时间') }
    )
  } else {
    rest.push({ field: 'handlers', title: $t('负责人') })
    if (active === 'Fixed') {
      rest.push({ field: 'last_handle_by', title: $t('处理人') })
    }
  }
  return [
    { field: 'origin_name', title: $t('关联实例'), sortable: 1 },
    { field: 'name', title: $t('风险问题') },
    { field: 'business', title: $t('所属业务') },
    { field: 'account.name', title: $t('所属账号'), sortable: 1 },
    { field: 'seenTime', title: $t('出现时间'), sortable: 1 },
    { field: 'detail', title: $t('风险描述') },
    { field: 'convert_cost_rmb', title: $t('实例成本'), sortable: 1 },
    { field: 'priority', title: $t('等级'), sortable: 1 },
    ...rest
  ]
})

const isLoading = ref(false)

const inspectionList = ref([])

const assetOptions: TdCascaderProps['options'] = assetCategoryList.map(item => ({
  label: item.name,
  value: item.value,
  children: item.assets.map(({ label, value }) => ({ label, value }))
}))

const getBusinessName = (v: any) => v[`name_${lang}`]

const getBusinessNames = (row: any) => row.businesses.map(getBusinessName) + ''

const currentStatus = ref<RiskIssueStatusEnum>('Unprocessed')

const CellContent = ({ row, field }:any) => {
  let jsx = get(row, field)
  if (field === 'origin_name') {
    jsx = <t-link hover="color" style={{
      maxWidth: '100%',
      display: 'inline-block',
      textOverflow: 'ellipsis',
      overflow: 'hidden'
    }} theme="primary" underline onClick={() => toDetail(row)} >
      { row.origin_name }
    </t-link>
  }
  if (field === 'handlers') {
    jsx = <div
      style="cursor: pointer"
      onClick={() => selectUser(row)}
    >
      {!row.handlers.length && <UserIcon size="25px"/>}
      {row.handlers.slice(0, 2).map((item:string, ind:number) => <t-avatar key={ind}>{ item[0].toUpperCase() }</t-avatar>)}

      <ChevronDownIcon />
    </div>
  }
  if (field === 'priority') {
    const { inspection, priorityText } = row
    jsx = <div class={`level_${inspection.priority}`}>{ priorityText }</div>
  }
  return jsx
}

const toDetail = (row: any): void => {
  const { id } = row
  router.push({
    name: 'RiskIssuesDetail',
    query: { id }
  })
}

const pager = reactive({
  page: 1,
  page_size: 15,
  list: [] as any[],
  count: 0,
  loading: false
})

interface SortItem{
  field:string
  order:'desc'|'asc'
}
const sortConfig = ref<SortItem[]>([])
const priorityMap = new Map<number, string>([
  [0, $t('低')],
  [1, $t('中')],
  [2, $t('高')]
])

watch(
  [
    () => pager.page,
    () => pager.page_size,
    currentStatus
  ],
  debounce(() => {
    getListData()
  }, 500),
  { deep: true }
)

const selectedUser = ref<string[]>([])
const userChooseVis = ref<boolean>(false)
const ignoreSettingVis = ref<boolean>(false)
const isBatch = ref<boolean>(false)
let currentRow: any = {}
const userDataLoading = ref<boolean>(false)
const userOptions = computed<{ label: string; value: string }[]>(
  () => UserStore.yufuUsers
)
const ignoreBtnText = computed<string>(() => {
  return currentStatus.value === 'Ignored' ? '解除忽略' : '批量忽略'
})

const selectedRows = ref([])
const checkChange = ({ records }:any) => {
  selectedRows.value = records.map(({ id }:any) => id)
}
const sortChange = (param:any) => {
  sortConfig.value = param.sortList
  getListData()
}
const check = (ids:number[]) => {
  if (ids.length === 0) {
    MessagePlugin.warning($t('请至少选择一项后再进行操作'))
    return false
  }
  return true
}

const selectUser = (row: any) => {
  userChooseVis.value = true
  isBatch.value = false
  selectedUser.value = row.handlers
  currentRow = row
}

const handleIgnore = async () => {
  if (!check(selectedRows.value)) return
  const rows = selectedRows.value

  const nextStatus = currentStatus.value === 'Ignored' ? 'Unprocessed' : 'Ignored'
  if (nextStatus === 'Ignored') {
    ignoreSettingVis.value = true
  } else {
    try {
      const res = await reqUpdateIssueState({
        ids: rows,
        action: 'UPDATE_STATUS',
        status: nextStatus
      })
      MessagePlugin.success('操作成功')
      getListData()
    } catch (err: any) {
      requestErrorMsg(err.message)
      MessagePlugin.error('操作失败')
    }
  }
}
const batchAssign = () => {
  if (!check(selectedRows.value)) return
  userChooseVis.value = true
  isBatch.value = true
}

const batchUpdate = async (updateParam: UpdateParamModel) => {
  try {
    const res = await reqUpdateIssueState(updateParam)
    MessagePlugin.success($t('更新成功'))
  } catch {
    MessagePlugin.error($t('更新失败'))
  } finally {
    selectedUser.value = []
  }
}

const confirmUserChoose = async () => {
  //
  if (!selectedUser.value.length) {
    MessagePlugin.error($t('请选择处理人'))
    return
  }
  let ids = [currentRow.id]
  if (isBatch.value) {
    const rows = (xTable1.value as VxeTableInstance).getCheckboxRecords()
    ids = rows.map(({ id }) => id)
  }
  try {
    const res = await batchUpdate({
      ids,
      action: 'UPDATE_HANDLER',
      handlers: selectedUser.value
    })
  } finally {
    getListData()
    userChooseVis.value = false
  }
}

async function getListData () {
  isLoading.value = true
  const order_by = []

  for (const { field, order } of sortConfig.value) {
    order_by.push(`${order === 'desc' ? '-' : ''}${field}`)
  }
  const { page, page_size } = pager
  const {
    searchWord
  } = formState
  try {
    const { count, results } = await reqRiskIssueList({
      page,
      page_size,
      order_by,
      inspection_id: formState.selectedInspection || undefined,
      status: currentStatus.value,
      business_ids: BusinessStore.selected || undefined,
      asset_types: formState.selectedAsset,
      search: searchWord || undefined
    })
    for (const row of results) {
      const { name, detail, priority } = row.inspection
      row.name = name
      row.detail = detail
      row.convert_cost_rmb = row.inspect_result.convert_cost_rmb?.toFixed(2) || '-'
      row.priorityText = priorityMap.get(priority)
      row.seenTime = `${format(row.created_at)} | ${format(row.last_seen_at)}`
      row.ignore_destination_date = format(row.ignore_destination_date || dayjs().add(6, 'month').format('YYYY-MM-DD'))
      row.business = getBusinessNames(row)
    }
    pager.count = count
    tableData.value = results
  } finally {
    isLoading.value = false
  }
}
const tableData: any = ref([])
onMounted(async () => {
  const { id, asset_type, inspection_id }: any = route.query
  formState.id = id
  if (asset_type) {
    formState.selectedAsset = Array.isArray(asset_type) ? asset_type : [asset_type]
  }
  formState.selectedInspection = inspection_id
  getListData()
  const { results } = await reqGetInspectionList({ page_enabled: false })
  inspectionList.value = results.map(({ name, id }:any) => ({ label: name, value: id.toString() }))
})

const format = (time: Date) => {
  return dayjs.utc(time).format('YYYY-MM-DD')
}
const xTable1 = ref<VxeTableInstance>()

</script>

<script lang="tsx">
export default defineComponent({ name: 'RiskIssues', components: { SearchIcon } })
</script>
<style lang="scss">
@import './index.scss';
</style>
