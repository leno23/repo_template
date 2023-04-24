<template>
  <div>
    <div style="font-size: 15px; text-align: center; height: 25px;">{{ title }}</div>
    <vxe-grid
      v-bind="tableProps"
      :columns="columns"
      :data="data"
      class="operator-distribution-table"
    />
  </div>
</template>

<script lang="ts" setup>
import type { VxeGridProps } from 'vxe-table'
defineProps<{
  title: string
  data: Record<string, any>[]
  columns: VxeGridProps['columns']
}>()

// const data: any[] = [
//   { name: 'WI-FI/LAN', value: 26738 },
//   { name: 'CELLULAR+WIFI', value: 16625 },
//   { name: '4G', value: 16487 },
//   { name: '5G', value: 2061 },
//   { name: '3G', value: 1194 },
//   { name: 'Others', value: 60 },
//   { name: '2G', value: 12 }
// ]

const tableProps: VxeGridProps = {
  height: 355,
  // data: props.data,
  border: true
  // columns: props.columns
}

</script>
<script lang="ts">
export default defineComponent({ name: 'OperatorDistributionTable' })
</script>

<style lang="scss" scoped>
.operator-distribution-table {
  :deep(.vxe-header--column) {
    padding: 8px 0 !important;
    color: var(--td-brand-color);
  }
  :deep(.vxe-body--column) {
    padding: 8px 0 !important;
  }
}
</style>
