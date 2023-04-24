<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="risk-issus-detail">
    <Card
      class="header flex space-between items-center"
      style="margin-bottom: 0px;"
    >
      <t-skeleton
        :row-col="[[{height:'20px',width:'80px'},{height:'20px',width:'20%'}],{width:'50%'}]"
        :loading="headerLoading"
        style="width:  90%;"
        animation="gradient"
      >
        <div class="top flex">
          <t-tag
            :theme="tag.type"
            style="margin-right: 10px"
          >
            {{ tag.label }}{{ $t('风险') }}
          </t-tag>
          <div class="name">{{ state?.inspection?.name }}</div>
        </div>
        <p class="desc text-ellipsis">
          {{ state?.inspection?.detail }}
        </p>
      </t-skeleton>
      <div>
        <t-skeleton
          :row-col="[{height:'40px',width:'90px'}]"
          :loading="headerLoading"
          style="width:  90%;"
          animation="gradient"
        >
          <t-button
            v-if="state.status==='Fixed'"
            disabled
            theme="default"
          >
            {{ $t('已处理') }}
          </t-button>
          <div v-else>
            <!-- <t-button
                theme="primary"
                @click="handleFixed"
              >
                {{ $t('标记处理') }}
              </t-button> -->
            <t-button
              :theme="state.status==='Ignored'?'primary':'danger'"
              @click="handleIgnored()"
            >
              {{ statusText }}
            </t-button>
          </div>
        </t-skeleton>
      </div>
    </Card>
    <div class="panel flex">
      <div class="panel-left">
        <Card style="height: 80px;">
          <t-skeleton
            :row-col="[{height:'30px',width:'100px'},1]"
            :loading="headerLoading"
            animation="gradient"
            class="panel-item warning"
          >
            <h3>{{ $t('触发条件') }}</h3>
            <div
              class="content"
              style="margin-top: 15px;"
            >
              {{ state.inspection?.condition }}
            </div>
          </t-skeleton>
        </Card>
        <Card style="height:calc((100% - 80px - 20px) * 1/3)">
          <t-skeleton
            :row-col="[{height:'30px',width:'100px'},1,1]"
            :loading="headerLoading"
            class="panel-item optimize"
            animation="gradient"
          >
            <h3>{{ $t('优化建议') }}</h3>
            <div style="margin-top: 15px;">
              <div
                v-for="(suggest, i) of state.suggestion || []"
                :key="suggest.text"
                class="content-item"
              >
                <span>{{ $t('方案') }}{{ i + 1 }}：</span>
                {{ suggest.text }}
              </div>
              <div v-if="!state.suggestion">{{ state.inspection?.suggestion }}</div>
            </div>
          </t-skeleton>
        </Card>
        <Card style="height:calc((100% - 80px - 20px) * 2/3)">
          <t-skeleton
            :row-col="[
              {height:'20px',width:'100px'},
              [1,1,1,1,1].map(()=>({width:'20%',height:'40px'})),
              [1,1,1,1,1].map(()=>({width:'20%',height:'40px'})),
              [1,1,1,1,1].map(()=>({width:'20%',height:'40px'})),
            ]"
            :loading="headerLoading || assetDetailLoading"
            class="panel-item"
            animation="gradient"
          >
            <h3>
              {{ $t('关联实例') }}<t-tag
                v-if="state.is_deleted"
                theme="danger"
                variant="light"
                style="margin-left:5px;"
              >
                {{ $t('资产已删除') }}
              </t-tag>
            </h3>
            <RiskAssetDetail />
          </t-skeleton>
        </Card>
      </div>
      <div class="panel-right">
        <Card style="height:calc((100% - 20px - 80px)/3 + 80px + 10px)">
          <h3>{{ $t('事件追踪') }}</h3>
          <t-skeleton
            :row-col="[
              {height:'20px',width:'100px'},
              1,1,1,1,1,1,1
            ]"
            :loading="headerLoading"
            animation="gradient"
          >
            <t-list
              size="small"
              :split="true"
              stripe
            >
              <t-list-item
                v-for="item of traceList"
                :key="item.label"
                style="padding-left: 0px;"
              >
                <span style="margin-right: 10px;">{{ item.label }}</span>
                <template #action>
                  {{ item.value }}
                </template>
              </t-list-item>
            </t-list>
          </t-skeleton>
        </Card>
        <Card style="height:calc((100% - 20px - 80px)/3*2);position: relative; overflow: hidden;">
          <h3
            class="title"
          >
            {{ $t('监控视图（近30天）') }}
          </h3>
          <t-skeleton
            :row-col="[
              {width:'50%'},
              {height:'200px',width:'90%'},
            ]"
            :loading="inspectLineLoading"
            animation="gradient"
          />
          <div
            class="content"
            style="height: calc(100% - 20px);"
          >
            <MonitorChart
              v-if="!inspectLineLoading"
              :data="lineData"
            />
          </div>
        </Card>
      </div>
    </div>
    <IgnoreForm
      v-model:visible="ignoreSettingVis"
      :rows="[id]"
      @confirm="()=>state.status = 'Ignored'"
    />
  </div>
</template>

<script lang="tsx">
import { reqSameBoatList, reqUpdateIssueState, reqInspectionDetail, reqMonitorMetrics } from '@/api/RiskIssue'
import { requestErrorMsg } from '@/common/utils'
import { $t } from '@/common/utils/i18n'
import { useBusinessStore } from '@/store/modules/business'
import dayjs from 'dayjs'
import { MessagePlugin, Tag as TTag } from 'tdesign-vue-next'
import IgnoreForm from './IgnoreForm.vue'
import { useRoute } from 'vue-router'
import useRiskAssetDetail from './useRiskAssetDetail'
import MonitorChart from './MonitorChart.vue'
export default defineComponent({ name: 'RiskDetail' })
</script>

<script lang="tsx" setup>
const BusinessStore = useBusinessStore()
const route = useRoute()

const id = ref(Number(route.query.id))
interface tagType {
  label: string;
  type: 'default' | 'success' | 'primary' | 'warning' | 'danger';
}

const inspectLineLoading = ref(true)
const lineData = ref([])

const priorityMap: tagType[] = [
  { label: $t('低'), type: 'success' },
  { label: $t('中'), type: 'warning' },
  { label: $t('高'), type: 'danger' }
]

const ignoreSettingVis = ref<boolean>(false)

const tag = computed<tagType>(() => {
  const priority: number = state.value?.inspection?.priority
  return priorityMap[priority] || { label: $t('低'), type: 'success' }
})

const state = ref<any>({})
const headerLoading = ref(true)
const currentInstance = ref<any>({})

const { RiskAssetDetail, instanceData, loading: assetDetailLoading } = useRiskAssetDetail()

interface Item {
  label: string;
  value: string | number;
}

const format = (time:string) => {
  if (!time) return '-'
  return dayjs.utc(time).format('YYYY-MM-DD hh:mm:ss')
}

const traceList = computed<Item[]>(() => [
  {
    label: $t('责任人'),
    value: state.value.handlers + ''
  },
  {
    label: $t('首次出现时间'),
    value: format(state.value.created_at)
  },
  {
    label: $t('最近出现时间'),
    value: format(state.value.last_seen_at)
  },
  {
    label: $t('出现次数'),
    value: state.value.times
  },
  {
    label: $t('处理时间'),
    value: format(state.value.last_handle_at)
  },
  // {
  //   label: $t('处理人'),
  //   value: state.value.last_handle_by + ''
  // },
  {
    label: $t('处理方案'),
    value: ''
  }
])

const statusText = computed(() => {
  const status = state.value.status
  if (status === 'Ignored') return $t('解除忽略')
  else if (status === 'Unprocessed') return $t('忽略问题')
})
const handleIgnored = async () => {
  if (state.value.status !== 'Ignored') {
    ignoreSettingVis.value = true
    return
  }
  try {
    const res = await reqUpdateIssueState({
      ids: [id.value],
      action: 'UPDATE_STATUS',
      status: 'Unprocessed'
    })
    MessagePlugin.success('操作成功')
    state.value.status = 'Unprocessed'
  } catch (err: any) {
    requestErrorMsg(err.message)
    MessagePlugin.error('操作失败')
  }
}

async function getSameBoatList () {
  state.value.isLoading = true
  const res = await reqSameBoatList({ id: id.value, business_ids: BusinessStore.selected, page: 1, page_size: 15 })
  const { current, others } = res

  instanceData.value = current
  currentInstance.value = current
  state.value.isLoading = false
}

const requestAssetMetric = () => {
  inspectLineLoading.value = true
  reqMonitorMetrics({
    asset_type: currentInstance.value.asset_type,
    from_time: dayjs(new Date()).subtract(30, 'day').format('YYYY-MM-DD'),
    to_time: dayjs(new Date()).format('YYYY-MM-DD'),
    instance_id: currentInstance.value.origin_uid,
    provider_key: currentInstance.value.provider_key
  }).then(resp => {
    lineData.value = resp
  }).finally(() => {
    inspectLineLoading.value = false
  })
}

onMounted(async () => {
  const dataObj = await reqInspectionDetail(id.value)
  state.value = dataObj
  headerLoading.value = false
  await getSameBoatList()
  requestAssetMetric()
})
</script>
<style lang="scss">
.risk-issus-detail {
  height: calc(#{$contentHeight} - 120px);
  // overflow: hidden;
  .--card-container{
    overflow: auto;
  }
  .t-list-item__action {
    overflow-x: hidden;
    flex: 1;
    text-align: right;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .flex_1{
    flex:1;
  }
  .flex {
    display: flex;
    &.space-between {
      justify-content: space-between;
    }
    &.items-center{
      align-items:center;
    }
    &.space-around {
      justify-content: space-around;
    }
    &.flex-column{
      flex-direction: column;
    }
  }
  .line-clamp3 {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
  .header {
    height: 80px;
    padding: 10px 30px;
    .text-ellipsis{
      display: block;
      width: 100%;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    .desc {
      font-size: 12px;
      color: #999;
      margin-top: 15px;
    }
    .name {
      font-size: 20px;
      font-weight: bold;
    }
  }
  .panel {
    height: 100%;
    padding: 0;
    .panel-left {
      flex: 1;
      height: 100%;
    }
    .panel-right {
      width: 30%;
      height: 100%;
    }
  }
}
</style>
