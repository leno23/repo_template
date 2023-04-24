<template>
  <Card class="business-table">
    <div class="header">
      <strong class="search-label"> 搜索：</strong>
      <t-input
        v-model="searchWord"
        clearable
        placeholder="全表搜索"
        style="display: inline-block;width: 300px;"
      />
      <t-button
        class="floatRight"
        theme="primary"
        @click="$router.push({ name: 'apply_biz' })"
      >
        权限申请
      </t-button>
    </div>
    <div class="main">
      <vxe-table
        border
        auto-resize
        :column-config="{ resizable: true }"
        align="left"
        :data="list"
        show-overflow
        height="auto"
      >
        <vxe-column
          v-for="(col, index) in columns"
          :key="index"
          :min-width="col.minWidth"
          :title="$t(col.title)"
          :field="col.field"
          type="html"
        />
        <vxe-column
          :title="$t('操作')"
          fixed="right"
          align="center"
          :width="100"
        >
          <template #default="{ row }">
            <div class="order-table-operate-column">
              <t-link
                theme="primary"
                @click="handleManage(row)"
              >
                {{ $t('管理') }}
              </t-link>
            </div>
          </template>
        </vxe-column>
      </vxe-table>
    </div>
  </Card>
</template>

<script lang="ts" setup>
import { useBusinessStore } from '@/store/modules/business'
import { lang, $t } from '@/common/utils/i18n'
import Card from '@/components/Card/index.vue'
import { useRouter } from 'vue-router'
const BusinessStore = useBusinessStore()
const router = useRouter()
const searchWord = ref('')
const list = computed(() => {
  const filterName = searchWord.value.trim().toLowerCase()
  if (filterName) {
    const filterRE = new RegExp(filterName, 'gi')
    const searchProps = ['id', 'name', 'roles', 'obs_id', 'product_name']
    const resArr = []
    for (let i = 0; i < BusinessStore?.business.length; i++) {
      const item = Object.assign({}, BusinessStore?.business[i])
      const tempObj:any = {
        ...item,
        roles: item.roles && item.roles.length && item.roles.map((item: any) => { return item[`name_${lang}`] }).join(','),
        name: `${item?.name_zh}(${item?.name_en})`
      }
      let is_contain = false
      searchProps.forEach(key => {
        if (tempObj[key] && `${tempObj[key]}`.toLowerCase().indexOf(filterName) !== -1) {
          tempObj[key] = `${tempObj[key]}`.replace(filterRE, match => `<span class="keyword-lighten">${match}</span>`)
          is_contain = true
        }
      })
      if (is_contain) {
        resArr.push({
          _id: item.id, // 操作栏 点击管理的时候 要传，不能带富文本
          ...tempObj
        })
      }
    }
    return resArr
  } else {
    return BusinessStore?.business.map((item:any) => {
      return {
        ...item,
        roles: item.roles && item.roles.length && item.roles.map((item: any) => { return item[`name_${lang}`] }).join(','),
        name: `${item?.name_zh}(${item?.name_en})`
      }
    })
  }

  // return [{ id: 10000, name_zh: '配置管理平台', name_en: 'CMDB', product_name: 'i-Gamec', obs_id: 1711 }]
})
const columns = ref([
  { field: 'id', title: $t('业务ID'), minWidth: '120' },
  { field: 'name', title: $t('业务名称'), minWidth: '120' },
  { field: 'roles', title: $t('业务角色'), minWidth: '140' },
  { field: 'obs_id', title: $t('OBSID'), minWidth: '140' },
  { field: 'product_name', title: $t('运营产品'), minWidth: '150' }
])
const handleManage = (row:any) => {
  router.push({ name: 'BussinessStatus', params: { business_id: row._id || row.id } })
}
</script>

<script lang="ts">
export default defineComponent({ name: 'BusinessConfig' })
</script>
<style  lang="scss" scoped>
.business-table{
  height: calc(100vh - 100px)
}
.header{
  height: 38px;
}
.main{
  height: calc(100% - 40px);
}
.floatRight{
  float: right;
}
:deep(.keyword-lighten){
  color: red;
}
.search-label{
  padding: 0 24px 0 10px;
}
</style>
