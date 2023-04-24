<template>
  <div class="inspection-container">
    <div class="search-box">
      <t-select
        v-model="category"
        multiple
        clearable
        style="width: 40%;display:inline-block"
      >
        <t-option
          v-for="(item, index) in categoryOps"
          :key="index"
          :label="item.label"
          :value="item.value"
        />
      </t-select>
      <t-button
        variant="outline"
        theme="primary"
        style="margin-left: 20px;"
        @click="getTableList"
      >
        <template #icon>
          <SearchIcon />
        </template>
      </t-button>
    </div>
    <t-loading
      :loading="loading.tableLoading"
      class="inspection-item"
    >
      <Card
        v-for="(item, index) in tableData"
        :key="index"
        class="item-card"
      >
        <ItemInfo
          :data="item"
        />
      </Card>
    </t-loading>
  </div>
</template>

<script lang="ts" setup>
import { reqGetInspectionList } from '@/api/RiskIssue'
import { requestErrorMsg } from '@/common/utils'
import ItemInfo from './components/ItemInfo.vue'
const loading = reactive({
  tableLoading: false
})
const tableData = ref<any[]>([])
const category = ref<string[]>(['availability', 'cost', 'performance', 'security', 'service_limit'])
const getTableList = async () => {
  loading.tableLoading = true
  try {
    const params:any = {
      page_enabled: false
    }
    if (category.value && category.value.length) {
      params.category = category.value.join(',')
    } else {
      delete params.category
    }
    const { count, results } = await reqGetInspectionList(params)
    tableData.value = results
  } catch (error: any) {
    requestErrorMsg(error.message)
  }
  loading.tableLoading = false
}
onMounted(() => {
  getTableList()
})
const categoryOps = [
  { label: '可用性', value: 'availability' },
  { label: '成本', value: 'cost' },
  { label: '性能', value: 'performance' },
  { label: '安全', value: 'security' },
  { label: '服务限制', value: 'service_limit' }
]
</script>

<script lang="ts">
export default defineComponent({
  name: 'Inspection'
})
</script>

<style lang="scss">
.inspection-container{
margin: 10px 0 0 10px!important;
}
.search-box{
  margin:0 10px 10px 0;
}
.inspection-item{
display: flex;
flex-wrap: wrap;
height: 100%;
  .item-card{
    width:calc(33.33% - 10px);
    margin: 0 10px 10px 0!important;
      &:hover{
    scale: 1.01;
  }
  }
}
</style>
