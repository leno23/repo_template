<template>
  <t-loading
    :loading="!pageData|| loading.pageLoading"
    style="height: 100%;"
  >
    <div class="overview">
      <div class="search-container">
        <Card class="overview-card">
          <t-form>
            <t-form-item :label="$t('所属业务')+':'">
              <BusinessSelect
                v-model="BusinessStore.selected"
                multiple
                style="width: 30%;"
                :placeholder="$t('若不指定业务则查询所有业务下的数据')"
              />
              <t-button
                variant="outline"
                theme="primary"
                style="margin-left: 20px;"
                @click="getInfo"
              >
                <template #icon>
                  <SearchIcon />
                </template>
              </t-button>
            </t-form-item>
          </t-form>
        </Card>
      </div>
      <div class="top-container display-flex">
        <Card class="overview-card top-left">
          <Property
            v-if="pageData"
            :data="pageData"
          />
        </Card>
        <Card class="overview-card top-right">
          <Radar
            v-if="pageData"
            :data="pageData"
          />
        </Card>
      </div>
      <div class="middle-container display-flex">
        <Card class="overview-card middle-left">
          <LdAssetsLine
            v-if="pageData"
            :data="pageData"
          />
        </Card>
        <Card class="overview-card middle-right">
          <AnnualRiskLine
            v-if="pageData"
            :data="pageData"
          />
        </Card>
      </div>
      <div class="bottom-container display-flex">
        <Card class="overview-card bottom-left">
          <UseRateLine
            v-if="pageData"
            :data="pageData"
          />
        </Card>
        <Card class="overview-card bottom-center">
          <Bar
            v-if="pageData"
            :data="pageData"
          />
        </Card>
        <Card class="overview-card bottom-right">
          <!-- <List
            header="待办"
            :list-data="todoList"
          /> -->
          <List
            header="重点关注Top5"
            :list-data="top5List"
          />
        </Card>
      </div>
    </div>
  </t-loading>
</template>

<script lang="ts" setup>
import Card from '@/components/Card/index.vue'
import Radar from './components/radar.vue'
import Property from './components/property.vue'
import AnnualRiskLine from './components/annualRiskLine.vue'
import LdAssetsLine from './components/ldAssetsLine1.vue'
import UseRateLine from './components/useRateLine.vue'
import Bar from './components/bar.vue'
import List from './components/list.vue'
import { reqOverviewInfo } from '@/api/ResourceGovernance/Overview'
import { requestErrorMsg } from '@/common/utils'
import { useBusinessStore } from '@/store/modules/business'
const BusinessStore = useBusinessStore()
const pageData = ref<any>(null)
const top5List = computed(() => {
  if (pageData.value) {
    const { inspection_focus_on } = pageData.value
    if (inspection_focus_on && inspection_focus_on.length) {
      return inspection_focus_on.map((item:any) => {
        return {
          ...item,
          text: `【${item.name}】${item.count} 个实例存在隐患`
        }
      })
    }
  }
  return null
})
// const todoList = computed(() => {
//   if (pageData.value) {
//     const { inspection_todo } = pageData.value
//     if (inspection_todo && inspection_todo.length) {
//       return inspection_todo.map((item:any) => {
//         return {
//           ...item,
//           text: `【${item.name}】${item.count} 个实例存在隐患`
//         }
//       })
//     }
//   }
//   return null
// })
const loading = reactive({
  pageLoading: false
})
// const business_id = ref(null)
const getInfo = async () => {
  loading.pageLoading = true
  try {
    const res = await reqOverviewInfo({ business_ids: BusinessStore.selected })
    pageData.value = res
  } catch (error: any) {
    pageData.value = {}
    requestErrorMsg(error.message)
  }
  loading.pageLoading = false
}
onMounted(() => {
  getInfo()
})
</script>

<script lang="ts">
export default defineComponent({ name: 'Overview' })
</script>
<style lang="scss" scoped>
.display-flex{
  display: flex;
}
.overview-card{
  height: 100%;
  margin: 0!important;
  padding: 5px!important;
&.top-left,&.middle-left,&.bottom-left{
  flex: 1;
  min-width: 368px;
  margin-right: 10px!important;
}
&.top-right{
  width: 25%;
}
&.middle-right{
  width: 60%;
}
&.bottom-center{
  margin-right:10px!important;
}
  &.bottom-right{
  width: calc(25% - 5px);
}
  &.bottom-center{
  width: calc(35% - 5px);
}
}

.overview{
  display: flex;
  flex-direction: column;
  height: calc(100vh - 80px);;
  .search-container{
   height: 48px;
   margin: 0 10px;
  }
  .top-container{
    flex:6;
    margin: 10px;
  }
  .middle-container{
    flex: 5;
    margin: 0 10px 10px 10px;
  }
  .bottom-container{
    flex: 5;
    margin:0 10px;
    min-height: 0;
  }
}
</style>
