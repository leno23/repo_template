<template>
  <div class="title">{{ title }}</div>
  <div :style="{height:`calc(100% - ${title ? '32px' : 0})`}">
    <vxe-table
      :data="data"
      height="auto"
    >
      <vxe-column
        v-for="{field,label,width},ind in columns"
        :key="ind"
        :formatter="({row})=>typeof row[field]==='number'? round(row[field],2):row[field]"
        :width="width"
        :field="field"
        :title="label"
      />
    </vxe-table>
  </div>
</template>

<script lang="ts" setup>
import { round } from 'lodash'
withDefaults(defineProps<{
  columns:{field:string, label:string, width?:number}[],
  data:any[],
  title?:string,
}>(), {
  columns: () => [],
  data: () => [],
  title: ''
})
</script>

<script lang="ts">
export default defineComponent({ name: 'TableBlock' })
</script>

<style lang="scss" scope>
  .title {
    font-size:16px;
    line-height: 22px;
    padding-bottom: 10px;
    text-align: center;
  }
</style>
