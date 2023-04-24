<template>
  <TableRender />
</template>

<script lang="tsx" setup>
import { assetTypeList, assetCategoryList } from '@/const/assetConfig'
import { Table as TTable } from 'tdesign-vue-next'
import type { TableProps } from 'tdesign-vue-next'
import cityMap from './cityPositionMap'
import { lang } from '@/common/utils/i18n'
import { useRouter } from 'vue-router'
import { useBusinessStore } from '@/store/modules/business'

const router = useRouter()
const props = defineProps<{ data: Record<string, Record<string, number>> | null }>()

const BusinessStore = useBusinessStore()

const gotoAsset = (value: string) => {
  let name = ''
  assetCategoryList.find(item => {
    const typeObj = item.assets.find(asset => asset.value === value)
    name = item?.value || ''
    return typeObj
  })
  router.push({ name, params: { assetType: value, business_id: BusinessStore.currentBusinessId } })
}

const getColumns = () => {
  if (!props.data) return []

  const assetValues: string[] = []

  // 取所有有值的资产作为列，若一个资产在所有地域中的值皆为0则不显示
  Object.values(props.data).forEach(obj => Object.keys(obj).forEach(asset => { if (obj[asset]) assetValues.push(asset) }))
  // 要按照这个顺序来渲染资产
  const columns = assetTypeList.filter(({ value }) => assetValues.includes(value)).map(item => ({
    width: 100,
    align: 'center',
    colKey: item.value,
    title: item.label,
    ellipsis: true,
    cell: (h, { row }) => <span class='dashboard-asset-table-cell'>{row[item.value] || 0}</span>
  })) as TableProps['columns']

  columns!.unshift({
    width: 120,
    align: 'center',
    colKey: 'region',
    title: '国家/地区',
    ellipsis: true,
    cell: (h, { row }) => cityMap[row.region]?.[`country_${lang}`] || row.region
  })

  return columns
}

const TableRender = () => {
  const tableProps = {
    rowKey: 'region',
    size: 'small',
    height: '100%',
    // stripe: true,
    onCellClick: ({ col }) => col.colKey !== 'region' && gotoAsset(col.colKey!),
    data: !props.data
      ? []
      : Object.keys(props.data)
        // 地域重新排序，按照该地域所有资产总数量大小降序排列，数量最多的在最上面
        .sort((currKey, nextKey) => Object.values(props.data![nextKey]).reduce((res, curr) => res + curr, 0) - Object.values(props.data![currKey]).reduce((res, curr) => res + curr, 0))
        .map(key => ({ ...props.data![key], region: key })),
    columns: getColumns()
  } as TableProps

  return <TTable {...tableProps} class='dashboard-region-asset-table' />
}
</script>
<script lang="tsx">

export default defineComponent({ name: 'DashboardRegionAsset' })
</script>

<style lang="scss" scoped>
.dashboard-region-asset-table.t-table {
  background-color: unset;

  :deep(.t-table__header th) {
    background-color: #00baff;
    color: #fff;
  }

  :deep(.t-table__body) {
    tr {
      td {
        border-bottom: none;
      }

      &:nth-of-type(odd) {
        background-color: #0a2732;
      }

      &:nth-of-type(even) {
        background-color: #003b51;
      }
    }
  }

  :deep(.dashboard-asset-table-cell) {
    cursor: pointer;
    transition: color 200ms;

    &:hover {
      color: var(--td-brand-color);
    }
  }
}
</style>
