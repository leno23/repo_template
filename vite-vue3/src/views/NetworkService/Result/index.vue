<template>
  <Card class="reverse-test-result">
    <div style="display: flex; margin-bottom: 10px;">
      <t-form
        :model="formModel"
        label-with="100px"
        layout="inline"
      >
        <t-form-item :label="$t('云厂商：')">
          <t-select
            v-model="formModel.provider"
            multiple
            :placeholder="$t('请选择云厂商')"
            style="width:200px"
            :tag-props="{ maxWidth: 140 }"
            :min-collapsed-num="1"
            :options="[{label:'全选',checkAll:true},...providerOptions]"
          />
        </t-form-item>
        <t-form-item :label="$t('国家：')">
          <t-select
            v-model="formModel.country"
            :disabled="!formModel.provider?.length"
            multiple
            :tag-props="{ maxWidth: 140 }"
            :min-collapsed-num="1"
            :placeholder="$t('请选择国家')"
            style="width:230px"
            :options="[{label:'全选',checkAll:true},...countryOptions]"
          />
        </t-form-item>
        <t-form-item :label="$t('工单ID：')">
          <t-input
            v-model:modelValue="formModel.ticket_id"
            :placeholder="$t('请输入工单ID')"
            style="width:200px"
            @keyup="(_,{e})=>{if(e.key==='Enter')reload()}"
          />
        </t-form-item>
        <t-button
          theme="primary"
          style="width:80px;margin-left:10px;float:right;"
          shape="square"
          content="搜索"
          @click="reload"
        >
          <template #icon><t-icon name="search" /></template>
        </t-button>
      </t-form>

      <div class="patch-controller-warpper">
        <t-tag
          :content="patchId[0]?.workOrderId || '选择工单ID'"
          size="large"
          variant="outline"
          :max-width="97"
          :theme="patchId[0]?.workOrderId ? 'primary' :'default'"
        />
        <t-tag
          :content="patchId[1]?.workOrderId || '选择工单ID'"
          size="large"
          variant="outline"
          :max-width="97"
          :theme="patchId[1]?.workOrderId ? 'primary' :'default'"
        />
        <t-button
          theme="default"
          @click="cleanPatch"
        >
          <template #icon><t-icon name="clear" /></template>
        </t-button>
        <t-button
          content="前往对比"
          @click="goPatch"
        >
          <template #icon><t-icon name="forward" /></template>
        </t-button>
      </div>
    </div>
    <div style="height: calc(100% - 42px)">
      <vxe-grid
        ref="gridRef"
        v-bind="options"
      >
        <!-- <template #buttons>

        </template> -->
        <template #loading>
          <t-loading />
        </template>
      </vxe-grid>
      <!-- <t-pagination
        v-model="pager.page"
        v-model:pageSize="pager.page_size"
        :total="pager.count"
        show-jumper
        :page-size-options="[100, 200, 500, 1000]"
        size="small"
        style="margin-top: 10px"
      /> -->
    </div>

    <DialogDetail
      v-if="orderVisible && currentRow?.workOrderId"
      v-model:dialog-visible="orderVisible"
      :current-row="{id:currentRow.workOrderId}"
    />
  </Card>
</template>

<script lang="tsx" setup>
import { $t } from '@/common/utils/i18n'
import type { VxeGridInstance, VxeGridProps } from 'vxe-table'
import dayjs from 'dayjs'
import DialogDetail from '@/views/WorkOrder/components/dialogDetail.vue'
import { useRoute, useRouter } from 'vue-router'
import { reqDetectFilterParmas, reqDetectResultList } from '@/api/NetworkService'
import type { DetectResultModel } from '@/api/NetworkService'
import { isEqual, round } from 'lodash'
import { MessagePlugin, Link as TLink, Button as TButton, Checkbox as TCheckbox } from 'tdesign-vue-next'
const route = useRoute()
const router = useRouter()
const gridRef = ref<VxeGridInstance>()

type searchFields = 'provider'|'ticket_id'|'country'
const formModel = reactive<{[k in searchFields]:any}>({
  provider: [],
  ticket_id: '',
  country: []
})
const linkList = ref()
const providerOptions = computed(() => {
  return linkList.value?.map(({ provider }:{provider:string}) => {
    return {
      label: provider,
      value: provider
    }
  }) || []
})
const countryOptions = computed(() => {
  const countryList = linkList.value?.filter(({ provider }:{provider:string}) => formModel.provider.includes(provider))
    ?.map((v:{countryList:any[]}) => v.countryList)
    .flat().map((v:{country:string}) => v.country)
  const uniqCountryLisy = [...new Set(countryList)]
  return uniqCountryLisy.map(v => ({ label: v, value: v }))
})

const orderVisible = ref()
const currentRow = ref<any>()

const reload = () => {
  gridRef.value?.commitProxy('reload')
}

const options: VxeGridProps = {
  height: 'auto',
  border: true,
  columns: [
    {
      width: 60,
      title: '对比',
      align: 'center',
      slots: {
        default: ({ row, rowid }) => {
          if (!row.workOrderId) return ''
          const { workOrderId, provider, country, serverRegion } = row
          return <TCheckbox
            key={rowid}
            onChange={checked => checkBoxChange(checked, { workOrderId, provider, country, serverRegion })}
            checked={!!patchId.value.find(obj => isEqual({ workOrderId, provider, country, serverRegion }, obj))}
            disabled={patchId.value.length === 2}
          />
        }
      }
    },
    {
      field: 'workOrderId',
      title: $t('工单ID'),
      minWidth: 150,
      sortable: true,
      slots: {
        default ({ row }) {
          return <TLink
            style={{
              maxWidth: '100%',
              display: 'inline-block',
              textOverflow: 'ellipsis',
              overflow: 'hidden'
            }}
            hover="color"
            theme="primary"
            underline
            content={row.workOrderId}
            onClick={() => {
              currentRow.value = row
              orderVisible.value = true
            }}
          />
        }
      }
    },
    { field: 'provider', title: $t('云厂商'), width: 140 },
    {
      field: 'serverRegion',
      title: $t('云厂Region'),
      width: 130
    },
    { field: 'country', title: $t('客户国家'), width: 120 },
    { field: 'tag', title: '标签', width: 160 },
    { field: 'delay', title: $t('平均延迟（ms）'), width: 160 },
    { field: 'loss', title: $t('丢包（%）'), width: 120, formatter ({ row }) { return row.loss * 100 | 0 } },
    { field: 'jitter', title: $t('抖动（ms）'), width: 120 },
    {
      field: 'median',
      title: $t('延迟中位数（ms）'),
      width: 164
    },
    { field: 'pingCount', title: $t('ping次数'), width: 120 },

    {
      field: 'timeRangeStart',
      title: $t('开始时间'),
      minWidth: 170
    },
    {
      field: 'timeRangeEnd',
      title: $t('结束时间'),
      minWidth: 170,
      sortable: true
    },
    {
      title: $t('操作'),
      fixed: 'right',
      width: 100,
      align: 'center',
      slots: {
        default: ({ row }) => <TButton
          theme="primary"
          variant="text"
          size='small'
          content={$t('查看详情')}
          onClick={() => {
            const { workOrderId } = row
            router.push({
              path: '/network_service/network/network_result_detail',
              query: { workOrderId }
            })
          }}
        />
      }
    }
  ],
  sortConfig: {
    trigger: 'cell',
    remote: true,
    defaultSort: [
      {
        field: 'workOrderId',
        order: 'desc'
      }
    ]
  },
  exportConfig: {
    remote: false,
    type: 'csv',
    types: ['csv', 'html', 'xml', 'txt'],
    modes: ['current', 'all']
  },
  pagerConfig: {
    pageSize: 50,
    pageSizes: [50, 100, 200, 500],
    size: 'mini',
    layouts: ['Total', 'PrevJump', 'PrevPage', 'Jump', 'PageCount', 'NextPage', 'NextJump', 'Sizes']
  },
  proxyConfig: {
    ajax: {
      query: ({ sorts, page }) => {
        return getList(page, sorts[0])
      }
    },
    props: {
      result: 'result', // 配置响应结果列表字段
      total: 'total' // 配置响应结果总页数字段
    },
    sort: true

  }
}

const tableDataCache = ref<any[]>([])

const format = (t: string) => dayjs(t).format('YYYY-MM-DD HH:mm:ss')
const getList = async (pager:any, sort:any) => {
  const { currentPage: page, pageSize: page_size } = pager
  const params:any = { page, page_size, work_order_id_asc: 2, end_time_asc: 0 }
  if (sort) {
    const { field, order } = sort
    if (field === 'workOrderId') params.work_order_id_asc = Number(order === 'desc') + 1
    if (field === 'timeRangeEnd') params.end_time_asc = Number(order === 'desc') + 1
  }
  params.ticket_id = formModel.ticket_id
  params.provider = formModel.provider.join(',')
  params.country = formModel.country.join(',')
  const { total, rows }:any = await reqDetectResultList(params)

  pager.count = total
  for (const row of rows) {
    const timeKeys = ['timeRangeStart', 'timeRangeEnd']
    const numberKeys = ['delay', 'loss', 'jitter', 'median']
    for (const key of timeKeys) row[key] = format(row[key])
    for (const key of numberKeys) row[key] = round(row[key], 2)
  }

  tableDataCache.value = rows
  return {
    result: rows,
    total
  }
}

onMounted(async () => {
  const queryId = route.query.id
  if (queryId) {
    formModel.ticket_id = queryId as string
  }
  router.replace({ name: 'NetworkResult' })
  const { link } = await reqDetectFilterParmas()
  linkList.value = link
})

// * ------------ 对比控制 -----------------
type PatchPayload = Pick<DetectResultModel, 'workOrderId' | 'provider' | 'country' | 'serverRegion'>
const patchId = ref<PatchPayload[]>([])

const checkBoxChange = (checked: boolean, payload: PatchPayload) => {
  if (checked) patchId.value.push(payload)
  else patchId.value = patchId.value.filter(obj => !isEqual(obj, payload))
}

const cleanPatch = () => {
  patchId.value.length = 0
}

const goPatch = () => {
  if (patchId.value.length !== 2) {
    MessagePlugin.error('请勾选2个要对比的工单')
    return
  }
  router.push({
    name: 'NetworkPatch',
    query: {
      // work_order_id: patchId.value.map(item => item.workOrderId)
      work_order_id: patchId.value.map(item => JSON.stringify({
        work_order_id: item.workOrderId,
        provider: item.provider,
        country: item.country
      }))
    }
  })
}
</script>

<script lang="tsx">
export default defineComponent({ name: 'NetworkResult' })
</script>
<style lang="scss" scoped>
.reverse-test-result {
  height: calc(#{$contentHeight} - 20px);
  display: flex;
  padding:10px 10px 0!important;
  flex-direction: column;

  .patch-controller-warpper {
    flex-shrink: 0;
    margin-left: 34px;
    padding-left: 34px;
    border-left: 1px solid #dddddd;
  }

}
</style>
