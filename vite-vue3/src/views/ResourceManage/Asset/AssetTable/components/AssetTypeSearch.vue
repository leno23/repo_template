<template>
  <t-drawer
    :close-on-esc-keydown="false"
    :close-on-overlay-click="false"
    :close-btn="true"
    header="资产搜索"
    :confirm-btn="{ content: '查询', loading, onClick: () => emit('search') }"
    size="461px"
    v-bind="$attrs"
  >
    <t-form
      label-align="top"
      class="asset-type-search-form"
    >
      <t-form-item v-if="assetType === 'vm'">
        <template #label>
          <div class="flex-y-center">
            <span>IP</span>
            <t-popup
              placement="right"
              content="IP搜索支持的资产类型: VM"
              show-arrow
            >
              <t-icon
                name="help-circle-filled"
                size="large"
                style="margin-left: 5px; color: var(--td-brand-color);"
              />
            </t-popup>
          </div>
        </template>
        <div style="flex: 1">
          <t-textarea
            v-model="queryForm.ip"
            placeholder="请输入ip, 多个ip需要用; 或者换行分隔"
          />
          <t-checkbox-group
            v-model="queryForm.ipTypes"
            style="margin-top: 5px;"
            :options="ipTypeOptions"
          />
        </div>
      </t-form-item>

      <t-form-item label="所属云账号">
        <t-select
          v-model="queryForm.created_by__in"
          :options="accountOptions"
          :loading="account.loading"
          filterable
          multiple
          :tag-props="{ maxWidth: 240 }"
          clearable
          :min-collapsed-num="1"
        />
      </t-form-item>

      <t-form-item label="字段排序">
        <t-select
          v-model="queryForm.order_by.order"
          style="width: 60px; margin-right: 10px;"
          placeholder=""
        >
          <t-option value="asc">
            <t-icon name="arrow-up" />
          </t-option>
          <t-option value="desc">
            <t-icon name="arrow-down" />
          </t-option>
          <template #valueDisplay="{ value }">
            <t-icon
              v-if="value === 'asc'"
              name="arrow-up"
              style="color: #191919"
            />
            <t-icon
              v-else-if="value === 'desc'"
              name="arrow-down"
              style="color: #191919"
            />
          </template>
        </t-select>

        <t-select
          v-model="queryForm.order_by.field"
          filterable
          :options="sortOptions"
          clearable
        />
      </t-form-item>

      <template
        v-for="field,index in filterStatus.checkedField"
        :key="field"
      >
        <t-form-item v-if="fieldConfigMap[field]">
          <template #label>
            <div class="async-form-item-label">
              {{ fieldConfigMap[field].name }}
              <t-icon
                name="close"
                size="large"
                class="async-form-item-close-btn"
                @click="deleteFilterItem(field, index)"
              />
            </div>
          </template>

          <t-select
            v-if="field !== 'origin_tags'"
            v-model="fieldConfigMap[field].checkOperation"
            style="width: 60px; margin-right: 10px;"
            placeholder=""
            :options="objectKeys(fieldConfigMap[field].operations).map(k => ({ value: fieldConfigMap[field].operations[k], label: k }))"
          />

          <t-select
            v-if="fieldConfigMap[field].type === 'arr' && ['provider_key', 'region', 'zone'].includes(field)"
            v-model="queryForm[field]"
            :scroll="{ type: 'virtual' }"
            :popup-props="{ overlayInnerStyle: { height: '250px' } }"
            :options="getSpecialFieldOptions(field)"
            multiple
            filterable
            clearable
            :min-collapsed-num="1"
            :tag-props="{ maxWidth: 250 }"
          />

          <template v-else-if="fieldConfigMap[field].type === 'arr'">
            <div
              v-if="field === 'origin_tags'"
              class="key-value-list"
            >
              <div
                v-for="item, i in queryForm.origin_tags"
                :key="i"
                class="row"
              >
                <t-input
                  v-model="item.key"
                  placeholder="Key"
                />
                <div class="middle">=</div>
                <t-input
                  v-model="item.value"
                  placeholder="Value"
                />
                <div
                  v-if="queryForm.origin_tags.length !== 1"
                  class="del"
                  @click="queryForm.origin_tags.splice(i, 1)"
                >
                  <t-icon name="close-circle-filled" />
                </div>
              </div>

              <t-button
                size="small"
                style="margin: 10px 0"
                block
                variant="outline"
                theme="primary"
                @click="queryForm.origin_tags.push({ key: '', value: '' })"
              >
                <template #icon>
                  <t-icon name="add" />
                </template>
                标签
              </t-button>
            </div>

            <t-select
              v-else
              v-model="queryForm[field]"
              filterable
              :min-collapsed-num="1"
              :tag-props="{ maxWidth: 250 }"
              clearable
              multiple
              placeholder="请输入自定义选项值, 并按回车确认"
              :options="fieldConfigMap[field].arrCustomOptions"
              creatable
              @create="value => fieldConfigMap[field].arrCustomOptions.push({ value, label: value })"
            />
          </template>

          <t-input
            v-else-if="fieldConfigMap[field].type === 'int'"
            v-model.number="queryForm[field]"
            clearable
          />

          <t-input
            v-else-if="fieldConfigMap[field].type === 'str'"
            v-model="queryForm[field]"
            clearable
          />

          <t-date-picker
            v-else-if="fieldConfigMap[field].type === 'datetime'"
            v-model="queryForm[field]"
            enable-time-picker
            clearable
            style="flex: 1;"
          />

          <t-radio-group
            v-else-if="fieldConfigMap[field].type === 'bool'"
            v-model="queryForm[field]"
            :options="([{ value: true, label: 'true' }, { value: false, label: 'false' }] as any)"
          />
        </t-form-item>
      </template>
    </t-form>

    <t-button
      theme="primary"
      variant="text"
      content="添加其他条件"
      style="margin-top: 24px;"
      @click="openFilter"
    >
      <template #icon><t-icon name="add" /></template>
    </t-button>
  </t-drawer>

  <t-dialog
    v-model:visible="filterStatus.visible"
    :close-on-esc-keydown="false"
    :close-on-overlay-click="false"
    header="筛选条件"
    top="12vh"
    width="1000px"
    @confirm="confirmFilter"
  >
    <!-- :confirm-btn="{ onClick: conformAction, loading: optStatus.loading }" -->
    <div class="filter-warpper">
      <t-checkbox-group v-model="filterStatus.checkedTemporary">
        <template
          v-for="item in assetConfig"
          :key="item.name"
        >
          <div v-if="item.fields.length">
            <h4>{{ item.name }}</h4>
            <t-checkbox
              v-for="opt in item.fields"
              :key="opt.field"
              :value="opt.field"
              :label="opt.name"
            />
          </div>
        </template>
      </t-checkbox-group>
      <br /><br />
      <div>已选择 {{ filterStatus.checkedTemporary.length }} 个条件</div>
    </div>
  </t-dialog>
</template>

<script lang="ts" setup>
import type { AssetParseConfig, AssetParseConfigField } from '../../Types'
import type { CheckboxOption, SelectOption } from 'tdesign-vue-next'
import { useBusinessStore } from '@/store/modules/business'
import { dayjs } from '@/common/plugins/Tool'
import { useCloudAccountStore } from '@/store/modules/cloudAccount'
import { useCloudProviderStore } from '@/store/modules/cloudProvider'
import { noDisplayAssetField } from '@/const/assetConfig'
import { cloneDeep } from 'lodash'
import { objectKeys } from '@/common/utils'

const props = defineProps<{ loading: boolean, config: AssetParseConfig[], assetType: string }>()
interface Emits {
  (e: 'search'): void
}
const emit = defineEmits<Emits>()

const BusinessStore = useBusinessStore()
const CloudAccountStore = useCloudAccountStore()
const CloudProviderStore = useCloudProviderStore()

// * ------ 当前资产类型的列配置, 过滤部分字段, 用于筛选条件选择 -----
// 字段排序单独渲染的逻辑
const sortOptions = computed(() => {
  return props.config
    .reduce((res, curr) => res.concat(curr.fields), [] as AssetParseConfigField[])
    // 过滤掉hidden列与ip列，并展示余下sortable的列
    .filter((opt) => !noDisplayAssetField.concat(['private_ip_address', 'public_ip_address']).includes(opt.field) && !opt.hidden && opt.sortable)
    .map(({ field, name }) => ({ value: field, label: `${name} (${field})` }))
})

// 当前资产类型的列配置, 过滤部分字段, 用于筛选条件的动态多选
const assetConfig = computed(() => props.config.map(item => ({
  name: item.name,
  // 过滤不展示的列, ip列也过滤, 因为有单独的ip表单项
  fields: item.fields.filter(opt =>
    !noDisplayAssetField.concat(['private_ip_address', 'public_ip_address']).includes(opt.field) &&
    opt.filterable &&
    !opt.hidden
  )
})))

type FieldConfig = AssetParseConfigField & { checkOperation: string, arrCustomOptions: SelectOption[] }
// 便于动态筛选流程中获取field字段的config对象, 因为需要使用双向绑定, 所以用watch创建新的对象
const fieldConfigMap = ref<Record<string, FieldConfig>>({})
watch(() => assetConfig.value, () => {
  const res: Record<string, FieldConfig> = {}
  cloneDeep(toRaw(assetConfig.value))
    .forEach(({ fields }) => (fields as FieldConfig[]).forEach(item => {
      item.checkOperation = Object.values(item.operations)[0]
      // 用于field的数据类型为arr时需要手动输入任意option时临时保存选项
      item.arrCustomOptions = []
      res[item.field] = item
    }))
  fieldConfigMap.value = res
})

// const fieldConfigMap = computed(() => {
//   const res: Record<string, FieldConfig> = {}
//   cloneDeep(toRaw(assetConfig.value)).forEach(({ fields }) => (fields as FieldConfig[]).forEach(item => {
//     // 有一些operations会是null，为流程方便直接指定默认值
//     if (!item.operations) item.operations = {}
//     item.checkOperation = Object.values(item.operations)[0]
//     // 用于field的数据类型为arr时需要手动输入任意option时临时保存选项
//     item.arrCustomOptions = []
//     res[item.field] = item
//   }))

//   return res
// })

const ipTypeOptions: CheckboxOption[] = [
  { value: 'private_ip_address__icontains', label: '内网IP' },
  { value: 'public_ip_address__icontains', label: '外网IP' },
  { value: 'accurate', label: '精确' }
]
// 所有资产都默认显示的筛选字段
const commonSelectFields = ['origin_uid', 'origin_name', 'provider_key', 'region', 'zone']

const filterStatus = reactive({
  visible: false,
  checkedTemporary: [] as string[], // 在dialog正在选择的字段, 确认后会推到checkedField中
  checkedField: [...commonSelectFields]
})
const openFilter = () => {
  filterStatus.visible = true
  filterStatus.checkedTemporary = [...filterStatus.checkedField]
}

const confirmFilter = () => {
  filterStatus.visible = false
  filterStatus.checkedField = [...filterStatus.checkedTemporary]
  if (filterStatus.checkedField.includes('origin_tags') && !queryForm.origin_tags) queryForm.origin_tags = [{ key: '', value: '' }]
}

const deleteFilterItem = (field: string, index: number) => {
  filterStatus.checkedField.splice(index, 1)
  delete queryForm[field]
}

// * --------------- 云账号选项 -------------------
const account = computed(() => CloudAccountStore.businessAccounts(BusinessStore.currentBusinessId))
const accountOptions = computed<SelectOption[]>(() => account.value.list.map(item => ({ label: item.name, value: item.id })))

// * --------- 类型特殊字段选项: provider_key', 'region', 'zone'的选择器选项 --------------
const getSpecialFieldOptions = (field: string) => {
  // if (field === 'provider_key') return CloudProviderStore.regionAndZone.map(item => ({ value: item.key, label: item[`name_${lang}`] }))
  if (field === 'provider_key') return CloudProviderStore.regionAndZone.map(item => ({ value: item.key, label: item.name_en }))

  const regionList = CloudProviderStore.regionAndZone.reduce((res, item) => res.concat(
    // item.regions.map(region => ({ value: region.region, label: `${item[`name_${lang}`]} / ${region.area}(${region.region})`, zones: region.zones }))
    item.regions.map(region => ({ value: region.region, label: `${item.name_en} / ${region.region}`, zones: region.zones }))
  ), [] as any[])

  if (field === 'region') return regionList
  if (field === 'zone') {
    return regionList.reduce(
      (res, region) => res.concat(
        region.zones.map((zone: any) => ({ value: zone.zone, label: `${region.label} / ${zone.zone}` }))
      ), [] as any[])
  }

  return []
}

const queryForm = reactive<Record<string, any>>({
  ip: '',
  ipTypes: ['private_ip_address__icontains'], // 默认选中内网ip类型
  created_by__in: [] as number[],
  order_by: { field: '', order: 'desc' }
})

// 对筛选项进行处理
const parseParams = () => {
  const params: Record<string, any> = {}

  // 处理ip (实际上目前只有vm支持ip搜索, 但需求是顶栏搜索ip的), 每选择一个要搜索的ip类型都对应一个单独的字段
  const { ip, ipTypes, created_by__in, order_by, origin_tags } = queryForm
  if (props.assetType === 'vm' && ip.trim()) {
    const ips = ip.trim().replace(/(\n|\r)/g, ';').split(';').filter((i: string) => i)
    ipTypes.forEach((ipField: string) => { params[ipField] = ips })
  }

  // 处理固定/特殊字段
  if (created_by__in.length) params.created_by__in = created_by__in
  if (order_by.field && order_by.order) params.order_by = [`${order_by.order === 'desc' ? '-' : ''}${order_by.field}`]
  if (origin_tags) {
    const tags = (origin_tags as {key: string, value: string}[])
      .map(({ key, value }: {key: string, value: string}) => (key.trim() && value.trim()) ? { key: key.trim(), value: value.trim() } : undefined)
      .filter(v => v)
    if (tags.length) params.origin_tags__contains = tags
  }

  objectKeys(queryForm).forEach(field => {
    // 过滤掉固定/特殊处理的字段
    if (['ip', 'ipTypes', 'created_by__in', 'origin_tags'].includes(field)) return
    const value = queryForm[field]
    const fieldConfig = fieldConfigMap.value[field]

    if (!fieldConfig) return

    // 直接取所选的operations, 某些config的operations为空, 则字段名不变
    const key = fieldConfig.checkOperation ? fieldConfig.checkOperation : field

    switch (fieldConfig.type) {
    case 'arr':
      if (value.length) params[key] = value
      break
    case 'bool':
      params[key] = value
      break
    case 'datetime':
      if (value) params[key] = dayjs(value).utc().format()
      break
    case 'str':
      if (value.length) params[key] = value.trim()
      break
    case 'int':
      if (typeof value === 'number') params[key] = value // v-model.number也会有字符串的情况
      break
    }
  })

  return params
}

watch(() => props.assetType, () => {
  filterStatus.checkedField.forEach(field => { delete queryForm[field] })
  filterStatus.checkedField = [...commonSelectFields]
  queryForm.order_by = { field: '', order: 'desc' }
})

defineExpose({ parseParams })

</script>

<script lang="ts">
export default defineComponent({ name: 'AssetTypeSearch' })
</script>

<style lang="scss" scoped>
.asset-type-search-form {

  .async-form-item-label {
    position: relative;

    .async-form-item-close-btn {
      position: absolute;
      right: -17px;
      top: 7px;
      cursor: pointer;
      color: #ccc;
      transition: color 200ms;
      &:hover {
        color: #333;
      }
    }
  }

  :deep(.t-form__item) {
    margin-bottom: 12px;
  }

  .key-value-list {
    max-height: 200px;
    overflow-y: auto;
    overflow-x: visible;
    padding-right: 34px;
    width: 100%;
    .row {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 10px;

      .middle {
        text-align: center;
        line-height: 32px;
        height: 32px;
        width: 32px;
        flex-shrink: 0;
        border-top: 1px solid #dcdcdc;
        border-bottom: 1px solid #dcdcdc;
        background-color: #f3f3f3;
      }

      .del {
        position: absolute;
        right: -25px;
        top: 50%;
        transform: translateY(-50%);
        opacity: 0;
        cursor: pointer;
        color: var(--td-error-color);
        transition: opacity 450ms;
      }

      &:hover .del {
        opacity: 1;
      }
    }
  }
}

.filter-warpper {
  max-height: 600px;

  :deep(.t-checkbox-group) {
    flex-direction: column;
    width: 100%;

    .t-checkbox {
      min-width: 18%;
      margin: 10px 10px 0 0;
    }
  }
}
</style>
