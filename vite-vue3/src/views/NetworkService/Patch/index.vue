<template>
  <div class="network-patch-container">
    <Card class="controller-warpper">
      <div class="form-warpper">
        <t-form
          layout="inline"
          style="margin-bottom: 10px;"
        >
          <t-form-item label="工单1">
            <t-input
              :value="form.first.work_order_id"
              disabled
              style="width: 200px;"
              placeholder="工单ID"
            />
          </t-form-item>
          <t-form-item label="云厂商1">
            <t-select
              v-model="form.first.provider"
              :options="filterStatus.first.provider"
              :loading="filterStatus.first.loading"
              filterable
              clearable
              style="width: 200px;"
            />
          </t-form-item>
          <t-form-item label="覆盖国家1">
            <t-select
              v-model="form.first.country"
              :options="filterStatus.first.country"
              :loading="filterStatus.first.loading"
              filterable
              :disabled="!form.first.provider"
              style="width: 250px;"
              clearable
            />
          </t-form-item>
          <t-form-item label="运营商1">
            <t-select
              v-model="form.first.isp"
              :options="filterStatus.first.isp"
              :loading="filterStatus.first.loading"
              filterable
              :disabled="!form.first.country"
              style="width: 320px;"
            />
          </t-form-item>
        </t-form>

        <t-form layout="inline">
          <t-form-item label="工单2">
            <t-input
              :value="form.second.work_order_id"
              disabled
              style="width: 200px;"
              placeholder="工单ID"
            />
          </t-form-item>
          <t-form-item label="云厂商2">
            <t-select
              v-model="form.second.provider"
              :options="filterStatus.second.provider"
              :loading="filterStatus.second.loading"
              filterable
              clearable
              style="width: 200px;"
            />
          </t-form-item>
          <t-form-item label="覆盖国家2">
            <t-select
              v-model="form.second.country"
              :options="filterStatus.second.country"
              :loading="filterStatus.second.loading"
              filterable
              :disabled="!form.second.provider"
              clearable
              style="width: 250px;"
            />
          </t-form-item>
          <t-form-item label="运营商2">
            <t-select
              v-model="form.second.isp"
              :options="filterStatus.second.isp"
              :loading="filterStatus.second.loading"
              filterable
              :disabled="!form.second.country"
              style="width: 320px;"
            />
          </t-form-item>
        </t-form>
      </div>

      <div class="btn-warpper">
        <t-button
          :loading="serachLoading"
          content="查询"
          @click="dispatch"
        >
          <template #icon><t-icon name="wifi" /></template>
        </t-button>
      </div>
    </Card>

    <Card
      v-if="pageErrorStatus"
      class="error-block"
    >
      {{ pageErrorStatus }}
    </Card>

    <template v-else>
      <Card>
        <t-loading
          v-if="showPatchTable"
          :loading="patchTableLoading"
        >
          <vxe-grid
            v-bind="vxeGridProps"
            :data="patchTableData"
          />
        </t-loading>

        <div
          v-else
          style="color: var(--td-brand-color); font-size: 16px; text-align: center; line-height: 30px;"
        >
          请选择筛选表单至”覆盖国家“选项后, 查询对比表格
        </div>
      </Card>

      <t-loading :loading="ispDistributionData.loading">
        <div
          class="flex-y-center"
          style="margin: 10px;"
        >
          <Card
            margin="0 5px 0 0;"
            style="flex: 1; height: 400px;"
          >
            <IspDistributionChart
              :title="`运营商分布详情(总数:${ispDistributionCount.first})`"
              :data="ispDistributionData.first"
              style="height: 100%; width: 100%;"
            />
          </Card>
          <Card
            margin="0 0 0 5px;"
            style="flex: 1; height: 400px;"
          >
            <IspDistributionChart
              :title="`运营商分布详情(总数:${ispDistributionCount.second})`"
              :data="ispDistributionData.second"
              style="height: 100%; width: 100%;"
            />
          </Card>
        </div>

        <div
          class="flex-y-center"
          style="margin: 10px;"
        >
          <Card
            margin="0 5px 0 0;"
            style="flex: 1; height: 400px;"
          >
            <PrecentTable
              :data="ispDistributionData.first"
              :columns="ispDistributionTableColumns"
              :title="`运营商分布详情(总数${ispDistributionCount.first})`"
              style="height: 100%; width: 100%;"
            />
          </Card>

          <Card
            margin="0 0 0 5px;"
            style="flex: 1; height: 400px;"
          >
            <PrecentTable
              :data="ispDistributionData.second"
              :columns="ispDistributionTableColumns"
              :title="`运营商分布详情(总数${ispDistributionCount.second})`"
              style="height: 100%; width: 100%;"
            />
          </Card>
        </div>
      </t-loading>

      <t-loading :loading="rangeLoading">
        <template
          v-for="rangeType in allRangeType"
          :key="rangeType"
        >
          <Card style="height: 400px;">
            <DatasetChart
              style="width: 100%; height: 100%;"
              :title="rangeTextMap[rangeType].chartTitle"
              :data="formatDatasetChartData(rangeType)"
            />
          </Card>

          <div
            class="flex-y-center"
            style="margin: 10px;"
          >
            <Card
              margin="0 5px 0 0;"
              style="flex: 1; height: 400px;"
            >
              <PrecentTable
                :data="rangeData.first[rangeType].list"
                :columns="getRangeTableColumns(rangeType)"
                :title="`${rangeTextMap[rangeType].tableTitle}${rangeData.first[rangeType].total})`"
                style="height: 100%; width: 100%;"
              />
            </Card>
            <Card
              margin="0 0 0 5px;"
              style="flex: 1; height: 400px;"
            >
              <PrecentTable
                :data="rangeData.second[rangeType].list"
                :columns="getRangeTableColumns(rangeType)"
                :title="`${rangeTextMap[rangeType].tableTitle}${rangeData.second[rangeType].total})`"
                style="height: 100%; width: 100%;"
              />
            </Card>
          </div>
        </template>
      </t-loading>
    </template>
  </div>
</template>

<script lang="tsx" setup>
import { $t } from '@/common/utils/i18n'
import IspDistributionChart from './components/IspDistributionChart/index.vue'
import PrecentTable from './components/PrecentTable/index.vue'
import DatasetChart from './components/DatasetChart/index.vue'
import { pickBy, round } from 'lodash'
import { Progress as TProgress } from 'tdesign-vue-next'
import { reqDetectFilterParmas, reqDetectOrderPatchDetail, reqIspDistribution, reqPatchRange } from '@/api/NetworkService'
import { objectKeys, requestErrorMsg } from '@/common/utils'
import { useRoute } from 'vue-router'
// import type { SelectOption } from 'tdesign-vue-next'
import type { VxeGridProps } from 'vxe-table'
import type{ DetectOrderPatchDetailModel, DetectOrderPatchCommonPayload, RangeCommonModel, DetectFilterParmas } from '@/api/NetworkService'

const route = useRoute()

// * --------------- 顶栏选择 --------------------
const filterStatus = reactive<Record<'first' | 'second', Record<'provider' | 'country' | 'isp', any[]> & {loading: boolean, options: DetectFilterParmas['link']}>>({
  first: {
    options: [],
    provider: [],
    country: [],
    isp: [],
    loading: false
  },
  second: {
    options: [],
    provider: [],
    country: [],
    isp: [],
    loading: false
  }
})

const getOptions = async (mode: 'first' | 'second') => {
  filterStatus[mode].loading = true
  try {
    const { link } = await reqDetectFilterParmas({ work_order_id: form[mode].work_order_id })
    filterStatus[mode].options = link
    filterStatus[mode].provider = link.map(({ provider }) => ({ value: provider, label: provider }))
  } catch (err: any) {
    requestErrorMsg(err.message)
  }
  filterStatus[mode].loading = false
}

const form = reactive<Record<'first'|'second', DetectOrderPatchCommonPayload>>({
  first: {
    work_order_id: '',
    provider: '',
    country: '',
    isp: ''
  },
  second: {
    work_order_id: '',
    provider: '',
    country: '',
    isp: ''
  }
})

// * ------ 页面状态控制 --------
const pageErrorStatus = ref<boolean | string>(true)

// 参数校验
const workOrderDatas = route.query.work_order_id as string[]

const queryPass = workOrderDatas?.length === 2 && !!workOrderDatas[0] && !!workOrderDatas[1]

pageErrorStatus.value = queryPass ? false : '请指定正确的工单参数进行对比'
if (queryPass) {
  Object.assign(form.first, JSON.parse(workOrderDatas[0]))
  Object.assign(form.second, JSON.parse(workOrderDatas[1]))
  // form.first.work_order_id = workOrderDatas[0]
  // form.second.work_order_id = workOrderDatas[1]
  getOptions('first')
  getOptions('second')
}

objectKeys(filterStatus).forEach(mode => {
  watch(() => form[mode].provider, () => { form[mode].country = '' })

  watch(() => [form[mode].provider, filterStatus[mode].options], () => {
    // form[mode].country = undefined
    filterStatus[mode].country = filterStatus[mode].options
      .find(item => item.provider === form[mode].provider)
      ?.countryList.map(({ country, ispList }) => ({ value: country, label: country, ispList })) || []
  })

  watch(() => [form[mode].country, filterStatus[mode].options], () => {
    form[mode].isp = ''
    filterStatus[mode].isp = filterStatus[mode].country
      .find(item => item.value === form[mode].country)
      ?.ispList.map((value: string) => ({ label: value, value })) || []
    filterStatus[mode].isp.unshift({ value: '', label: 'All' })
  })
})

const getFormParams = (mode: 'first' | 'second') => pickBy(form[mode], Boolean) as any as DetectOrderPatchCommonPayload

// * ------------------------------------------
const serachLoading = computed(() => patchTableLoading.value)

// const disableSearch = computed(() => Object.values(form.first).concat(Object.values(form.second)).filter(v => v).length !== 8)

const dispatch = () => {
  // if (isEqual(form.first, form.second)) {
  //   MessagePlugin.error('请勿选择条件一致的对比项')
  //   return
  // }
  showPatchTable.value && getPatchTableData()
  // getPatchTableData()
  getIspibution()
  getRange()
}

onMounted(dispatch)

// * --------------------- 两行的对比table ---------------
const showPatchTable = computed(() => form.first.country && form.second.country)

const patchTableLoading = ref(false)
const patchTableData = ref<Partial<DetectOrderPatchDetailModel>[]>([])

watch(() => showPatchTable.value, () => { patchTableData.value = [] })

const vxeGridProps: VxeGridProps = {
  border: true,
  height: 144,
  showOverflow: 'tooltip',
  columns: [
    { field: 'provider', title: $t('云厂商'), width: 180 },
    { field: 'country', title: $t('客户国家'), width: 180 },
    { field: 'isp', title: '运营商', width: 220 },
    { field: 'region', title: $t('云厂Region'), width: 120 },
    { field: 'delay', title: $t('平均延迟（ms）'), width: 160, formatter: ({ cellValue }) => round(cellValue, 2) },
    { field: 'loss', title: $t('丢包（%）'), width: 120, formatter: ({ cellValue }) => round(cellValue * 100, 2) },
    { field: 'jitter', title: $t('抖动（ms）'), width: 120, formatter: ({ cellValue }) => round(cellValue, 2) },
    { field: 'median', title: $t('延迟中位数（ms）'), width: 164, formatter: ({ cellValue }) => round(cellValue, 2) },
    { field: 'tag', title: '标签' }
  ]
}

const getPatchTableData = async () => {
  patchTableLoading.value = true
  try {
    const [first, second] = await Promise.all([
      reqDetectOrderPatchDetail(getFormParams('first')),
      reqDetectOrderPatchDetail(getFormParams('second'))
    ])
    // 因为表单筛选后会精切到只剩一条, 但不一定两个都会有数据
    patchTableData.value = [first.list[0] || {}, second.list[0] || {}]
  } catch (err: any) {
    requestErrorMsg(err.message)
  }
  patchTableLoading.value = false
}

// * -------------- 网络分布详情数据 ------------------
const ispDistributionData = reactive({
  loading: false,
  first: [] as { name: string, value: number, percent: number }[],
  second: [] as { name: string, value: number, percent: number }[]
})

const getIspibution = async () => {
  ispDistributionData.loading = true
  try {
    const [first, second] = await Promise.all([
      reqIspDistribution(getFormParams('first')),
      reqIspDistribution(getFormParams('second'))
    ])
    ispDistributionData.first = first.list.map(item => ({ name: item.isp, value: item.count, percent: round((item.rate * 100), 2) }))
    ispDistributionData.second = second.list.map(item => ({ name: item.isp, value: item.count, percent: round((item.rate * 100), 2) }))
  } catch (err: any) {
    requestErrorMsg(err.message)
  }
  ispDistributionData.loading = false
}

const ispDistributionCount = computed(() => ({
  first: ispDistributionData.first.reduce((res, { value }) => res + value, 0),
  second: ispDistributionData.second.reduce((res, { value }) => res + value, 0)
}))

const ispDistributionTableColumns: VxeGridProps['columns'] = [
  { field: 'name', title: '网络类型', minWidth: 200 },
  { field: 'value', title: '统计次数', width: 200 },
  {
    field: 'percent',
    title: '占比',
    width: 200,
    slots: {
      default: ({ row }: any) => <TProgress
        percentage={row.percent}
        color="#56a64b"
        trackColor="#ededed"
        class="percent-table-progress-bar"
      />
    }
  }
]

// * -------------------------------
const rangeLoading = ref(false)

type RangeDataType = 'delay' | 'loss' | 'jitter' | 'median'
const allRangeType: RangeDataType[] = ['delay', 'loss', 'jitter', 'median']

const getRange = async () => {
  rangeLoading.value = true
  try {
    const [first, second] = await Promise.all([
      reqPatchRange(getFormParams('first')),
      reqPatchRange(getFormParams('second'))
    ])
    allRangeType.forEach(key => handleRangeData(key, { first: first[`${key}List`], second: second[`${key}List`] }))
  } catch (err: any) {
    requestErrorMsg(err.message)
  }
  rangeLoading.value = false
}

const rangeData = reactive<Record<'first'|'second', Record<RangeDataType, { list:(RangeCommonModel & { percent: number })[], total: number }>>>({
  first: {
    delay: { list: [], total: 0 },
    loss: { list: [], total: 0 },
    jitter: { list: [], total: 0 },
    median: { list: [], total: 0 }
  },
  second: {
    delay: { list: [], total: 0 },
    loss: { list: [], total: 0 },
    jitter: { list: [], total: 0 },
    median: { list: [], total: 0 }
  }
})

// 处理列表数据，排序、百分比、去重、补充对其
const handleRangeData = (type: RangeDataType, list: Record<'first'|'second', RangeCommonModel[]>) => {
  const modes = objectKeys(list)

  // 便于step与count对照
  const stepMap: Record<'first'|'second', Record<string, number>> = {
    first: {},
    second: {}
  }

  // step在数据中是可能重复的，需要去除step然后count加到一起
  modes.forEach(mode => list[mode].forEach(({ step, count }) => {
    if (stepMap[mode][step]) stepMap[mode][step] += count
    else stepMap[mode][step] = count
  }))

  // 所有数据列对齐step类型，互相补充互相缺失的step，便于table的对齐与dataset图表数据类型的对齐
  modes.forEach(mode => {
    objectKeys(stepMap[mode]).forEach(step => {
      modes.filter(v => v !== mode).forEach(otherMode => { if (!stepMap[otherMode][step]) stepMap[otherMode][step] = 0 })
    })
  })

  // 处理渲染数据
  modes.forEach(mode => {
    const target = rangeData[mode][type]
    target.total = round(list[mode].reduce((res, { count }) => res + count, 0))

    target.list = objectKeys(stepMap[mode])
      // .map(step => ({ step, count: stepMap[mode][step] })) // 重新把stepMap转换为数组
      // 排序step根据第一个数字从小到大往下排
      .sort((curr, next) => Number(curr.split(',')[0].slice(1)) - Number(next.split(',')[0].slice(1)))
      .map(step => ({
        // step: numberSectionStringTransform(step, rangeTextMap[type].tableLabelSuffix), // 处理区间字符串
        step,
        count: stepMap[mode][step],
        percent: target.total ? round((stepMap[mode][step] / target.total) * 100, 2) : 0 // 可能total是0，除数会变成Nan
      }))
  })
}

const formatDatasetChartData = (type: RangeDataType) => [
  { category: form.first.country || `工单1: ${form.first.work_order_id}`, data: rangeData.first[type].list.map(({ step, count, percent }) => ({ name: step, value: count, percent })) },
  { category: form.second.country || `工单2: ${form.second.work_order_id}`, data: rangeData.second[type].list.map(({ step, count, percent }) => ({ name: step, value: count, percent })) }
]

const rangeTextMap: Record<RangeDataType, Record<string, string>> = {
  loss: { chartTitle: '丢包比例分布(IP数量)', tableTitle: '丢包比例分布详情(IP总数', tableStepColumnTitle: '丢包区间', tableLabelSuffix: '%' },
  delay: { chartTitle: '平均延迟分布(探测次数)', tableTitle: '平均延迟分布详情(探测次数', tableStepColumnTitle: '平均延迟区间', tableLabelSuffix: '' },
  jitter: { chartTitle: 'ping抖动分布(探测次数)', tableTitle: 'ping抖动分布详情(探测次数', tableStepColumnTitle: 'ping抖动区间', tableLabelSuffix: '' },
  median: { chartTitle: '延迟中位数分布(IP数量)', tableTitle: '延迟中位数分布详情(IP总数', tableStepColumnTitle: '延迟中位数区间', tableLabelSuffix: '' }
}

const getRangeTableColumns = (type: RangeDataType) => [
  { field: 'step', title: rangeTextMap[type].tableStepColumnTitle, minWidth: 200 },
  { field: 'count', title: '统计次数', width: 200 },
  {
    field: 'percent',
    title: '占比',
    width: 200,
    slots: {
      default: ({ row }: any) => <TProgress
        percentage={row.percent}
        color="#56a64b"
        trackColor="#ededed"
        class="percent-table-progress-bar"
      />
    }
  }
] as VxeGridProps['columns']

// // * --- 区间文本处理
// /**
//  *
//  * @param {string} str 如"[1,2]"  /  "(3,10]"  /  "[20,50)"  / "[60,+lim)" 表示区间的数
//  * @param {string} suffix 加在结果数字后的文本
//  * @returns {sstring} 转换成大于小于号的文本
//  */
// const numberSectionStringTransform = (str: string, suffix?: string) => {
//   const suffixStr = suffix ? suffix + '' : ''
//   const temp = str.split(',')
//   const start = {
//     include: temp[0].slice(0, 1) === '[',
//     num: temp[0] === '(-lim' ? -Infinity : Number(temp[0].slice(1))
//   }
//   const end = {
//     include: temp[1].slice(-1) === ']',
//     num: temp[1] === '+lim)' ? Infinity : Number(temp[1].slice(0, -1))
//   }
//   if (start.num === -Infinity) return `${end.include ? '≤' : '<'} ${end.num}${suffixStr}`
//   if (end.num === Infinity) return `${start.include ? '≥' : '>'} ${start.num}${suffixStr}`
//   if (start.num === end.num) return start.num + suffixStr
//   return `${start.num}${suffixStr} ${start.include ? '≤' : '<'} x ${end.include ? '≤' : '<'} ${end.num}${suffixStr}`
// }
</script>

<script lang="tsx">
export default defineComponent({ name: 'NetworkServicePatch' })
</script>

<style lang="scss" scoped>
.network-patch-container {

  .controller-warpper {
    display: flex;
    align-items: center;

    .form-warpper {
      flex: 1;
    }

    .btn-warpper {
      display: flex;
      justify-content: center;
      align-items: center;

      flex-shrink: 0;

      height: 60px;
      border-left: 1px solid #dddddd;
      width: 150px;
    }
  }

  .error-block {
    display: flex;
    align-items: center;
    justify-content: center;
    height: calc(#{$contentHeight} - 114px - 10px);
    color: var(--td-brand-color);
    font-size: 17px;
    font-weight: bold;
  }

  :deep(.percent-table-progress-bar) {
    .t-progress__bar {
      height: 22px;
      border-radius: 2px;
    }
    .t-progress__inner {
      border-radius: unset;
    }
    .t-progress__info {
      width: 80px;
      color: #65ae5b;
    }
  }
}
</style>
