
import {
  reqAssetFieldConfig
} from '@/api/ResourceManage/Asset'
import { requestErrorMsg } from '@/common/utils'
import type {
  AssetParseConfig,
  AssetListItem,
  AssetParseConfigField
} from '@/views/ResourceManage/Asset/Types'
import { parseDescConfig } from '@/views/ResourceManage/Asset/AssetDetail/config'
import { $t } from '@/common/utils/i18n'
import Descriptions from '@/components/Descriptions/index.vue'

export const noDisplayAssetField = [
  'has_topo',
  'topo_names',
  'name',
  'operator',
  'bak_operator',
  'jms_access_users',
  'jms_recent_login',
  'created_at',
  'updated_at',
  'uid',
  'instance_cpu_util',
  'instance_mem_util',
  'instance_disk_util',
  'instance_lanouttraffic_util',
  'instance_lanintraffic_util',
  'instance_wanouttraffic_util',
  'instance_wanintraffic_util'
]

const RiskAssetDetail = () => (
  <>
    <div class="asset-detail-container" style="height:calc(100% - 30px);overflow:auto;">
      <div class="content-warpper">
        {config.list.map(config => (
          <>
            <h3 style="margin: 10px 0; font-size: 14px">{ config.name }</h3>
            <Descriptions
              data={getData(config)}
              column={3}
            />
          </>
        ))}
      </div>
    </div>
  </>
)

const assetId = ref('')
const assetType = ref('')

// url参数是否正确指定, 如果不正确就跳回当前业务资产列表第一页
const isParamsCorrect = computed(() => !!(assetType.value && assetId.value))

// if (!isParamsCorrect) router.replace({ name: 'calculation', params: { business_id: BusinessStore.currentBusinessId } })
const config = reactive({ loading: true, list: [] as AssetParseConfig[] })
const current = ref<AssetListItem>({})

const getAssetConfig = async () => {
  if (!isParamsCorrect) return
  config.loading = true
  try {
    config.list = await reqAssetFieldConfig(assetType.value)
    config.list.unshift({
      name: $t('监控信息'),
      fields: [
        {
          field: 'mem_util',
          name: $t('内存使用率')
        },
        {
          field: 'cpu_util',
          name: $t('CPU使用率')
        },
        {
          field: 'disk_util',
          name: $t('磁盘使用率')
        }
      ]
    } as any)
    config.loading = false
  } catch (err: any) {
    requestErrorMsg(err.message)
  }
}

const filterConfig = (configList: AssetParseConfigField[]) => configList.filter(item =>
  !item.field.startsWith('ct__') &&
  !noDisplayAssetField.includes(item.field) &&
  !item.hidden
)

const getData = (config: AssetParseConfig) => {
  const data = parseDescConfig(filterConfig(config.fields), current.value, {
    asset_type: current.value.asset_type,
    asset_id: current.value.asset_id + ''
  })

  return data
}

watch(
  current,
  async () => {
    const { asset_type, asset_id } = current.value || {}
    assetType.value = asset_type
    assetId.value = asset_id
    if (!asset_type) return
    await getAssetConfig()
  },
  { deep: true }
)

export default function () {
  return {
    RiskAssetDetail,
    instanceData: current,
    loading: computed(() => config.loading)
  }
}
