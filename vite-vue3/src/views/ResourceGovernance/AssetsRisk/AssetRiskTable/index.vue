<template>
  <Card class="risk-table">
    <div class="header">
      <BusinessSelect
        v-model="BusinessStore.selected"
        multiple
        :style="{display:'inline-block',marginRight: '10px',width: '30%'}"
        :placeholder="$t('若不指定业务则查询所有业务下的数据')"
      />
      <t-select
        v-model="selectedAccount"
        clearable
        :style="{display:'inline-block',marginRight: '10px',width: '200px'}"
        placeholder="请选择账号"
        filterable
        :options="accountList"
      />
      <t-button
        theme="primary"
        style="width:80px;margin-left:10px;"
        shape="square"
        class="marginLeft10"
        @click="getInspectionList"
      >
        <template #icon>
          <SearchIcon />
        </template>
        搜索
      </t-button>
    </div>
    <div style="flex:1;">
      <t-loading
        :loading="isLoading"
        style="height:100%"
      >
        <vxe-table
          ref="xTable1"
          height="auto"
          border
          show-overflow
          :data="tableData"
        >
          <vxe-column
            v-for="({ prop, title }, ind) of columns"
            :key="ind"
            sortable
            :field="prop"
            :title="title"
          >
            <template #default="{row}">
              <Rate
                v-if="prop==='risk_rate'"
                :value="Number(row.risk_rate)"
              />
              <t-button
                v-else-if="prop==='control'"
                theme="primary"
                variant="text"
                @click="jumpToDetail(row)"
              >
                {{ $t('查看详情') }}
              </t-button>
              <div v-else>
                {{ row[prop] }}
              </div>
            </template>
          </vxe-column>
        </vxe-table>
      </t-loading>
    </div>
  </Card>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { reqInspectionList } from '@/api/RiskIssue'
import { useBusinessStore } from '@/store/modules/business'
import { $t } from '@/common/utils/i18n'
import { useCloudAccountStore } from '@/store/modules/cloudAccount'

const selectedAccount = ref('')
const router = useRouter()
const CloudAccountStore = useCloudAccountStore()
const BusinessStore = useBusinessStore()
const isLoading = ref(false)
const tableData = ref([])
const columns = [
  { title: $t('资产类型'), prop: 'asset_type' },
  { title: $t('性能'), prop: 'performance' },
  { title: $t('成本'), prop: 'cost' },
  { title: $t('可用性'), prop: 'availability' },
  { title: $t('服务限制'), prop: 'service_limit' },
  { title: $t('风险率'), prop: 'risk_rate' },
  { title: $t('资源数'), prop: 'count' },
  { title: $t('操作'), prop: 'control' }
]

const accountList = computed(() => {
  const selected = BusinessStore.selected
  const list = Object.values(CloudAccountStore.controllers).map(v => v.list).flat()

  if (selected.length) {
    list.length = 0
    for (const id of selected) list.push(...CloudAccountStore.controllers[id].list)
  }
  return list.map(({ id, name }) => ({ label: name, value: id }))
})

const jumpToDetail = ({ id, asset_type }:any) => {
  router.push({ name: 'RiskIssues', query: { id, asset_type } })
}

const getInspectionList = async () => {
  isLoading.value = true
  try {
    const res = await reqInspectionList({
      business_ids: BusinessStore.selected || undefined,
      account_id: selectedAccount.value || undefined
    })
    tableData.value = res
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  getInspectionList()
})
</script>

<script lang="ts">
export default defineComponent({ name: 'RiskTable' })
</script>
<style lang="scss" scoped>
.risk-table {
  height:calc(#{$contentHeight} - 20px);
  display:flex;
  flex-direction: column;
  .header{
    margin-bottom: 10px;
  }
}
</style>
