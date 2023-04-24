<template>
  <dv-scroll-board
    :config="config"
    @click="handleClick"
  />
</template>

<script lang="ts" setup>
import type { InspectionDistribution } from '@/api/Dashboard'
import { assetCategoryList } from '@/const/assetConfig'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps<{ data: InspectionDistribution[] | null }>()

const tableBtnHtml = '<span class="check" />查看<span>'

const config = computed(() => ({
  header: ['资产类型', '资源数', '风险数', '闲置数', '操作'],
  // data: [
  //   ['计算', 10, 15, tableBtnHtml],
  //   ['存储', 20, 5, tableBtnHtml],
  //   ['数据库', 15, 15, tableBtnHtml],
  //   ['网络', 6, 6, tableBtnHtml],
  //   ['中间件', 6, 6, tableBtnHtml],
  //   ['其他', 6, 6, tableBtnHtml]
  // ],
  data: props.data
    ? props.data.map(item => [
      assetCategoryList.find(({ value }) => value === item.asset_category)?.name || item.asset_category,
      item.resource_count,
      item.risk_count,
      item.idle_count,
      tableBtnHtml
    ])
    : [],
  align: ['center', 'center', 'center', 'center'],
  rowNum: 6
}))

const handleClick = ({ rowIndex, columnIndex }: any) => {
  // 第四列才是操作列
  if (columnIndex !== 4) return
  const assetCategory = props.data![rowIndex].asset_category
  const asset_type = assetCategoryList.find(({ value }) => value === assetCategory)?.assets.map(({ value }) => value) || []
  router.push({ name: 'RiskIssues', query: { asset_type } })
}

</script>

<script lang="ts">
export default defineComponent({ name: 'DashboardCostBlock' })
</script>

<style lang="scss" scoped>
:deep(.check) {
  cursor: pointer;
  transition: color 200ms;
  &:hover {
    color: var(--td-brand-color);
  }
}
</style>
