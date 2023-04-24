<template>
  <div id="idle-assets-container">
    <Card class="unused-title">
      <h3 style="margin: 0 0 5px 0; font-size: 18px;">{{ $t('闲置资产') }}</h3>
      <div class="query-container">
        <div class="params-container">
          <span>{{ $t('所属业务') }}： </span>
          <BusinessSelect
            v-model="BusinessStore.selected"
            multiple
            style="width: 300px;"
            :placeholder="$t('若不指定业务则查询所有业务下的数据')"
          />
          <span style="margin-left: 30px;">{{ $t('资产类型') }}：</span>
          <t-select
            v-model="nowType"
            style="width: 200px;"
            :options="idleAssetTypes"
          />
        </div>
        <t-button @click="clickQuery">{{ $t('查询') }}</t-button>
      </div>
    </Card>
    <div class="asset-wrapper">
      <Card class="left-part">
        <div>
          <h4>{{ $t('闲置定义') }}</h4>
          <div style="margin-top: 10px;">
            {{ inspection.condition }}
          </div>
        </div>
        <t-divider />
        <div>
          <h4>{{ $t('优化建议') }}</h4>
          <div style="margin-top: 10px;">
            {{ inspection.suggestion }}
          </div>
        </div>
        <t-divider />
        <div>
          <h4>{{ $t('预计效果') }}</h4>
          <div style=" margin-top: 10px;">
            预计节省成本：￥{{ cost }}
          </div>
        </div>
      </Card>
      <Card class="right-part">
        <div style="height:calc(100% - 34px)">
          <vxe-grid
            ref="assetTable"
            v-bind="tableData"
          >
            <template #loading>
              <t-loading />
            </template>
          </vxe-grid>
        </div>
        <t-pagination
          :current="pager.page"
          :page-size="pager.page_size"
          :total="pager.count"
          show-jumper
          :page-size-options="[5, 15, 20, 50, 100, 200, 500, 1000]"
          size="small"
          style="margin-top: 10px;"
          @current-change="
            (v) => {
              pager.page = v;
            }
          "
          @page-size-change="
            (v) => {
              pager.page_size = v;
            }
          "
        />
      </Card>
    </div>
  </div>
</template>
<script setup lang="tsx">
import { useBusinessStore } from '@/store/modules/business'
import { LoadingPlugin } from 'tdesign-vue-next'
import { requestIdleAssets, getInspection } from '@/api/ResourceGovernance/Overview'
import { $t } from '@/common/utils/i18n'
import { VxeGridInstance } from 'vxe-table'
import { useRouter } from 'vue-router'
const router = useRouter()
const nowType = ref('vm_idle')
const BusinessStore = useBusinessStore()
const idleAssetTypes = [
  { value: 'vm_idle', label: 'VM' },
  { value: 'cbs_idle', label: $t('磁盘') },
  { value: 'lb_idle', label: $t('负载均衡') },
  { value: 'mysql_idle', label: 'MySql' },
  { value: 'postgresql_idle', label: 'Postgresql' },
  { value: 'redis_idle', label: 'Redis' },
  { value: 'kafka_idle', label: 'Kafka' },
  { value: 'es_idle', label: 'ElasticSearch' },
  { value: 'tcaplus_idle', label: 'Tcaplus' }
]
const inspection = ref({
  detail: '',
  condition: '',
  suggestion: ''
})

const pager = reactive({
  page: 1,
  page_size: 15,
  count: 0
})

watch([() => pager.page, () => pager.page_size], () => {
  assetTable.value?.commitProxy('query')
})

const cost = ref('')

const requestInspection = () => {
  return getInspection({ inspection_type: nowType.value, business_ids: BusinessStore.selected }).then(resp => {
    inspection.value = resp.inspection
    if (resp.cost) {
      cost.value = resp.cost.toFixed(2)
    } else {
      cost.value = '-'
    }
  })
}

const tableData = reactive({
  height: 'auto',
  border: true,
  showOverflow: true,
  columns: [
    {
      field: 'inspect_result.instance_id',
      title: $t('资源ID'),
      slots: {
        default ({ row }:any) {
          const { asset_type, id } = row
          return <t-link style={{
            maxWidth: '100%',
            display: 'inline-block',
            textOverflow: 'ellipsis',
            overflow: 'hidden'
          }}
          hover="color"
          theme="primary"
          underline
          onClick={() => {
            router.push({ name: 'AssetDetail', params: { assetType: asset_type, assetId: id } })
          }}
          >
            { row.inspect_result.instance_id }
          </t-link>
        }
      }
    },
    { field: 'inspect_result.origin_name', title: $t('资源名称') },
    { field: 'provider_key', title: $t('所属厂商') },
    { field: 'inspect_result.cpu_util', title: $t('CPU利用率(%)') },
    { field: 'asset.cpu_core_num', title: 'CPU核数' },
    { field: 'inspect_result.mem_util', title: $t('内存利用率(%)') },
    { field: 'asset.memory', title: $t('内存') },
    { field: 'inspect_result.convert_cost_rmb', title: $t('价格(人民币)') },
    { field: 'inspect_result.convert_cost_usd', title: $t('价格(美金)') }
  ],
  proxyConfig: {
    ajax: {
      query: ({ page }: any) => {
        return requestIdleAssets({
          business_ids: BusinessStore.selected,
          inspection_type: nowType.value,
          page: page.currentPage,
          page_size: page.pageSize
        }).then(resp => {
          pager.count = resp.count
          resp.results.forEach((item: any) => {
            if (item.inspect_result.cpu_util) {
              item.inspect_result.cpu_util = Number(item.inspect_result.cpu_util).toFixed(2)
            }
            if (item.inspect_result.mem_util) {
              item.inspect_result.mem_util = Number(item.inspect_result.mem_util).toFixed(2)
            }
            if (item.inspect_result.convert_cost_rmb) {
              item.inspect_result.convert_cost_rmb = Number(item.inspect_result.convert_cost_rmb).toFixed(2)
            }
            if (item.inspect_result.convert_cost_usd) {
              item.inspect_result.convert_cost_usd = Number(item.inspect_result.convert_cost_usd).toFixed(2)
            }
          })
          return resp.results
        })
      }
    }
  }
})

const query = () => {
  const loading = LoadingPlugin({ attach: '.left-part' })
  Promise.all([requestInspection()]).then(() => {
    loading.hide()
  }).catch(() => {
    loading.hide()
  })
}

const assetTable = ref<VxeGridInstance>()

const clickQuery = () => {
  let columns = [
    { field: 'inspect_result.instance_id', title: $t('资源ID') },
    { field: 'inspect_result.origin_name', title: $t('资源名称') },
    { field: 'provider_key', title: $t('所属厂商') },
    { field: 'inspect_result.cpu_util', title: $t('CPU利用率(%)') },
    { field: 'asset.cpu_core_num', title: 'CPU核数' },
    { field: 'inspect_result.mem_util', title: $t('内存利用率(%)') },
    { field: 'asset.memory', title: $t('内存') },
    { field: 'inspect_result.convert_cost_rmb', title: $t('价格(人民币)') },
    { field: 'inspect_result.convert_cost_usd', title: $t('价格(美金)') }
  ]
  if (['cbs_idle', 'lb_idle'].includes(nowType.value)) {
    columns = [
      { field: 'inspect_result.instance_id', title: $t('资源ID') },
      { field: 'inspect_result.origin_name', title: $t('资源名称') },
      { field: 'provider_key', title: $t('所属厂商') },
      { field: 'inspect_result.convert_cost_rmb', title: $t('价格(人民币)') },
      { field: 'inspect_result.convert_cost_usd', title: $t('价格(美金)') }
    ]
  }
  tableData.columns = columns
  query()
  assetTable.value?.commitProxy('query')
}

onMounted(() => {
  query()
})

</script>
<script lang="tsx">
export default defineComponent({ name: 'IdleAsset' })
</script>
<style lang="scss" scoped>
.unused-title {
  height: 80px;
  .query-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .params-container {
      display: flex;
      align-items: center;
    }
  }
}
.asset-wrapper {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: calc(#{$contentHeight} - 110px);

  .left-part {
    height: 100%;
    width: 250px;
    margin-right: 0 !important;
  }
  .right-part {
    flex: 1;
    height: 100%;
  }
}
:deep(.click-style):hover {
  color: #0052d9;
  cursor: pointer;
}
</style>
