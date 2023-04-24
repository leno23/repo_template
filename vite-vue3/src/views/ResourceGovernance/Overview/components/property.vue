<template>
  <div class="property-table">
    <t-loading
      :loading="loading.tableLoading"
      style="height:100%"
    >
      <vxe-table
        border="inner"
        auto-resize
        :column-config="{ resizable: true }"
        :row-config="{ isCurrent: true, isHover: true }"
        align="left"
        :data="list"
        show-overflow
        height="auto"
        size="small"
        style="min-height: 100px;"
      >
        <vxe-column
          v-for="(col, index) in columns"
          :key="index"
          :sortable="col.field!== 'type'"
          :title="$t(col.title)"
          :field="col.field"
        >
          <template #default="{ row }">
            <Rate
              v-if="['risk_rate', 'idle_rate'].includes(col.field)"
              :value="Number(row[col.field])"
            />
            <span
              v-else-if="col.field === 'asset_type'"
            >{{ assetTypeList.find(item => item.value === row[col.field])?.label || row[col.field] }}</span>
            <span
              v-else
              :class="{colorred: col.field === 'idle_count'}"
            >{{ row[col.field] }}</span>
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
                theme="primary"
                variant="outline"
                @click="viewDetail(row)"
              >
                {{ $t('查看详情') }}
              </t-button>
            </div>
          </template>
        </vxe-column>
      </vxe-table>
    </t-loading>
  </div>
</template>

<script lang="ts" setup>
import { $t } from '@/common/utils/i18n'
import { useRouter } from 'vue-router'
import { assetTypeList } from '@/const/assetConfig'
interface IProps {
  data: any
}
const props = withDefaults(defineProps<IProps>(), {
  data: {}
})
const router = useRouter()
const loading = reactive({
  tableLoading: false
})
const columns = ref([
  { field: 'asset_type', title: $t('资产类型') },
  { field: 'count', title: $t('资源数') },
  { field: 'idle_count', title: $t('闲置数') },
  { field: 'performance', title: $t('性能') },
  { field: 'cost', title: $t('成本') },
  { field: 'availability', title: $t('可用性') },
  { field: 'service_limit', title: $t('服务限制') },
  { field: 'risk_rate', title: $t('风险率') },
  { field: 'idle_rate', title: $t('闲置率') }
])
const list = computed(() => {
  const { inspection_distribution } = props.data
  if (inspection_distribution && inspection_distribution.length) {
    return inspection_distribution
  }
  return []
})
const viewDetail = (row:any) => {
  router.push({ name: 'RiskIssues', params: { asset_type: row?.asset_type } })
}
</script>

<script lang="ts">
export default defineComponent({
  name: 'Property'
})
</script>

<style lang="scss" scoped>
.property-table{
  height: 100%;
}
// :deep(.vxe-header--column){
//   background-color: #fff;
// }
.colorred{
  color: #d6372c;
}
</style>
