<template>
  <div class="reverse-test-result-detail">
    <Card>
      <!-- <t-button
        style="margin-right:20px"
        theme="primary"
        @click="router.go(-1)"
      >
        返回
        <template #icon><t-icon name="rollback" /></template>
      </t-button> -->
      {{ $t('云厂商') }}：<t-select
        v-model="selectedProvider"
        style="margin-right: 15px;"
        :loading="filterSelectLoading"
        :options="providerOptions"
      />
      {{ $t('覆盖国家') }}：<t-select
        v-model="selectedCountry"
        :loading="filterSelectLoading"
        :options="countryOptions"
      />
    </Card>
    <Card class="desc">
      <t-skeleton
        :row-col="[{width:'50%'},1]"
        :loading="overviewDataLoading"
      >
        <p>
          {{ $t('说明：本测速为云厂服务器向用户出口IP发起探测，探测路径不包括最后一公里，探测信息如下：') }}
        </p>
        <div
          style="display:flex;line-height: 38px;"
        >
          <div
            v-for="({ title, value }, ind) in descList"
            :key="ind"
            style="display:flex;border:1px solid #ebeef5;"
          >
            <div style="display:inline-block;font-weight:bold;padding: 0 10px;background:#f5f7fa;">{{ title }}: </div>
            <div style="width:100px;padding: 0 10px;">{{ value }}</div>
          </div>
        </div>
      </t-skeleton>
    </Card>
    <TextBlock
      :data="textBlockData"
      :loading="overviewDataLoading"
    />
    <div
      class="operator-number-distribution"
    >
      <Card margin="0">
        <PieBlock :data="pieData" />
      </Card>
      <Card
        margin="0"
      >
        <TableBlock
          :title="$t('数量分布')"
          :columns="operatorColumns"
          :data="operatorTableData"
        />
      </Card>
    </div>
    <Card>
      <OperatorDistribution
        :data="operatorData"
        :country="selectedCountry"
      />
    </Card>
    <div
      v-for="({ label, key }, ind) in indexList"
      :key="ind"
    >
      <Card>
        <RatioBar
          :title="$t(`${label}区间统计`)"
          :data="getRangeData(key)"
          style="height: 200px; width: 100%"
        />
      </Card>
    </div>
    <div
      v-for="({ label, key,colLabel }, ind) in indexList"
      :key="ind"
      class="operator-number-distribution"
    >
      <Card margin="0">
        <ProviderStatisticsBar
          :data="getRatioData(key)"
          :title="$t(`${label}统计`)"
          style="height: 380px; width: 100%"
        />
      </Card>
      <Card
        margin="0"
        style="height:400px"
      >
        <TableBlock
          :title="$t(`${label}详细`)"
          :columns="[...detailTableColumns,{field:'count',label:colLabel,width:160}]"
          :data="getDetailTableData(key)"
        />
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import RatioBar from './components/RatioBar/index.vue'
import TextBlock from './components/TextBlock/index.vue'
import PieBlock from './components/PieBlock/index.vue'
import TableBlock from './components/TableBlock/index.vue'
import ProviderStatisticsBar from './components/ProviderStatisticsBar/index.vue'
import OperatorDistribution from './components/OperatorDistribution/index.vue'
import { useRoute, useRouter } from 'vue-router'
import { reqYuntuForward } from '@/api/NetworkService'
import { $t } from '@/common/utils/i18n'
import { round } from 'lodash'
const route = useRoute()
const router = useRouter()
const queryData = ref(route.query)

const operatorColumns = [
  { field: 'isp', label: $t('运营商') },
  { field: 'ispCount', label: $t('ip数量') },
  { field: 'rate', label: $t('占比(%)') }
]
const detailTableColumns = [
  { field: 'serverRegion', label: $t('云厂Region'), width: 160 },
  { field: 'country', label: $t('覆盖国家'), width: 160 },
  { field: 'isp', label: $t('isp'), width: 160 },
  { field: 'destIp', label: $t('ip'), width: 160 },
  { field: 'city', label: $t('城市'), width: 160 }
]

const indexList:{key:indexType, label:string, colLabel:string}[] = [
  { key: 'delay', label: $t('平均延迟'), colLabel: $t('平均延迟(ms)') },
  { key: 'jitter', label: $t('延迟抖动'), colLabel: $t('延迟抖动(ms)') },
  { key: 'median', label: $t('中位数'), colLabel: $t('中位数(ms)') },
  { key: 'loss', label: $t('丢包率'), colLabel: $t('丢包率(%)') }
]

const overviewData = ref()
const statisticsData = ref()
const detailsData = ref()
// 运营商数量分布数据
const rateData = ref()
// 运营商分布地图数据
const mapData = ref()
// 分布区间数据
const rangeData = ref()
const filterparamsData = ref()

const descList = computed(() => {
  if (!overviewData.value) return []
  const { packetInterval, packetNum, packetSize, type, workOrderId, serverRegion } =
    overviewData.value
  return [
    { title: $t('工单ID'), value: workOrderId },
    { title: $t('云厂Region'), value: serverRegion },
    { title: $t('探测类型'), value: type },
    { title: $t('单次发包个数(个/次)'), value: packetNum },
    { title: $t('发包间隔(秒)'), value: packetInterval },
    { title: $t('包大小(字节)'), value: packetSize }
  ]
})

const filterSelectLoading = ref(true)
const overviewDataLoading = ref(true)

const providerOptions = computed(() => {
  const list = filterparamsData.value?.providerList || []
  return list.map((v:string) => {
    return { label: v, value: v }
  })
})

const countryOptions = computed(() => {
  const list = filterparamsData.value?.countryList || []
  return list.map((v:string) => {
    return { label: v, value: v }
  })
})
const selectedProvider = ref('baishan')
const selectedCountry = ref('Brazil')

const textBlockData = computed(() => {
  const {
    delay = 0,
    jitter = 0,
    loss = 0,
    median = 0,
    ping_count = 0
  } = overviewData.value?.overview ?? {}
  const format = (ping:number) => {
    if (ping > 1000) {
      return ping / 1000
    }
    return ping
  }
  return [
    { title: $t('平均延迟(ms)'), value: round(delay, 2) },
    { title: $t('延时中位数(ms)'), value: round(median, 2) },
    { title: $t('延时抖动(ms)'), value: round(jitter, 2) },
    { title: $t('丢包率'), value: round(loss, 2), unit: '%' },
    {
      title: $t('ping次数'),
      value: round(format(ping_count)),
      ...(ping_count > 1000 ? { unit: 'k' } : {})
    }
  ]
})

const getRatioData = (key: string) => {
  const objData: { [k: string]: number } = {}
  if (!statisticsData.value) return null
  const list: { provider: string; count: number }[] =
    statisticsData.value[`${key}List`]
  for (const { provider, count } of list) {
    objData[provider || 'provider'] = round(count, 2)
  }
  return objData
}
type indexType = 'delay'|'jitter'|'loss'|'median'

const range_50 = { '[50,100)': 0, '[100,150)': 0, '[150,200)': 0, '[200,+lim)': 0 }
const range_5 = { '(0,5)': 0, '[5,10)': 0, '[10,20)': 0, '[20,30)': 0, '[30,+lim)': 0 }
const range_1 = { '[0]': 0, '(0,1)': 0, '[1,3)': 0, '[3,5)': 0, '[5,+lim)': 0 }
const defaultLabel:{[k in indexType]:any} = {
  delay: { '(0,50)': 0, ...range_50 },
  jitter: range_5,
  loss: range_1,
  median: { '[0,50)': 0, ...range_50 }
}
const getRangeData = (key: indexType) => {
  const objData: { [k: string]: number } = defaultLabel[key]
  if (!rangeData.value) return null
  const list: { step: string; count: number }[] =
  rangeData.value[`${key}List`]
  for (const { step, count } of list) {
    const r = /(\[|\()\d+,(\+lim|\d+)(\]|\))/.exec(step)
    let label = r ? r[0] : '--'
    if (step === '[0]') label = step
    objData[label] = round(count, 2)
  }
  return objData
}

const getDetailTableData = (key: string) => {
  if (!detailsData.value) return []
  const list: any[] = detailsData.value[`${key}List`]
  return list
}

const operatorData = computed(() => {
  const listData = mapData.value?.list || []
  const ret:any = {}
  for (const { state, list } of listData) {
    for (const { ipCount, isp } of list) {
      if (ret[isp]) {
        ret[isp].push({ name: state, value: ipCount })
      } else {
        ret[isp] = [{ name: state, value: ipCount }]
      }
    }
  }
  return ret
})

const pieData = computed(() => {
  const list = rateData.value?.list || []
  return list
})

const operatorTableData = computed(() => {
  return rateData.value?.list || []
})

watch([selectedCountry, selectedProvider], () => {
  filterSelectLoading.value = true
  overviewDataLoading.value = true
  init()
})

async function init () {
  const uriList = ['overview', 'statistics', 'details', 'rate', 'map', 'range', 'filterparams']
  const reqList = uriList.map((path) =>
    reqYuntuForward({
      uri: `/network-measure/api/info/reverseDetect/${path}`,
      params: {
        work_order_id: queryData.value.workOrderId,
        country: selectedCountry.value,
        provider: selectedProvider.value
      }
    })
  )
  const resList: any[] = await Promise.allSettled(reqList)
  for (const i in resList) {
    const { status, value } = resList[i]
    const path = uriList[i]
    if (status === 'fulfilled') {
      if (path === 'overview') {
        overviewData.value = value
        overviewDataLoading.value = false
      } else if (path === 'statistics') statisticsData.value = value
      else if (path === 'details') detailsData.value = value
      else if (path === 'rate') rateData.value = value
      else if (path === 'map') mapData.value = value
      else if (path === 'range') rangeData.value = value
      else if (path === 'filterparams') {
        filterparamsData.value = value
        filterSelectLoading.value = false
      }
    }
  }
}
onMounted(() => {
  init()
})
</script>

<script lang="ts">
export default defineComponent({ name: 'ResutltDetail' })
</script>
<style lang="scss" scoped>
.reverse-test-result-detail {
  height: calc(#{$contentHeight} - 20px);
  overflow: auto;
}
.operator-number-distribution {
  display: grid;
  padding: 10px 10px 0;
  grid-template-columns: repeat(2, calc(50% - 5px));
  grid-gap: 10px;
}
.t-select__wrap {
  display: inline-block;
  width: 200px;
}
.desc {
  line-height: 1.5;
  p {
    color: #5bce32;
    font-size: 16px;
  }
}
</style>
