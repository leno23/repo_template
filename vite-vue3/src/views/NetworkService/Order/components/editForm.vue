<template>
  <t-dialog
    header="反向拨测单据"
    :visible="visible"
    width="80vw"
    top="10vh"
    @close="close"
  >
    <t-form
      ref="formRef"
      :label-width="120"
      :data="formData"
      style="max-height: 60vh;overflow: auto;"
    >
      <t-form-item
        :rules="rules.purpose"
        label="目的:"
        name="purpose"
      >
        <t-input
          v-model="formData.purpose"
          style="width: 50%;"
          clearable
        />
      </t-form-item>
      <t-form-item
        :rules="rules.timeRange"
        label="时间:"
        name="timeRange"
      >
        <t-date-range-picker
          v-model="formData.timeRange"
          enable-time-picker
          allow-input
          clearable
          @change="formatTimeKey"
        />
      </t-form-item>
      <h4 class="class-title">测速配置:</h4>
      <div>
        <div
          v-for="(item, index) in configList"
          :key="index"
          class="config-line"
        >
          <div class="config-item">
            <span class="config-label">测速云厂:</span>
            <span class="config-value">
              <t-select
                v-model="item.cloud_net"
                clearable
                filterable
                placeholder="输入搜索"
                :class="{ errorStyle:isValidated&& !item.cloud_net }"
              >
                <t-option
                  v-for="(cloud, cloudIndex) in configOptions.cloudNetList"
                  :key="cloudIndex"
                  :label="cloud"
                  :value="cloud"
                />
              </t-select>
              <div
                v-show="isValidated && !item.cloud_net"
                class="error-text"
              >必填</div>
            </span>
            <span class="config-label">云厂region:</span>
            <span class="config-value">
              <t-input
                v-model="item.server_region"
                clearable
              />
              <div
                v-show="isValidated && !item.server_region"
                class="error-text"
              >必填</div>
            </span>
            <span class="config-label">服务器IP:</span>
            <span class="config-value">
              <t-textarea
                v-model="item.ips"
                :class="{ errorStyle: isValidated && !item.ips }"
                clearable
                placeholder="请输入ip, 多个ip需要用; 或者换行分隔"
                @blur="item.ips = item.ips.trim()"
              />
              <!-- @change="formatIps" -->
              <div
                v-show="isValidated && !item.ips"
                class="error-text"
              >必填</div>
            </span>
            <span class="config-label">覆盖国家:</span>
            <span class="config-value">
              <t-select
                v-model="item.cover_iso"
                clearable
                filterable
                placeholder="输入搜索"
                :class="{ errorStyle: isValidated && !item.cover_iso }"
              >
                <t-option
                  v-for="(iso, isoIndex) in configOptions.isoList"
                  :key="isoIndex"
                  :label="iso"
                  :value="iso"
                /></t-select>
              <div
                v-show="isValidated && !item.cover_iso"
                class="error-text"
              >必填</div>
            </span>
          </div>
          <div class="config-num-btn">
            <AddCircleIcon
              style="margin-right: 10px;"
              @click="addConfig(item, index)"
            />
            <MinusCircleIcon @click="deleteConfig(item, index)" />
          </div>
        </div>
      </div>
      <h4 class="class-title more-config">
        <span
          class="text"
          @click="showMoreConfig = !showMoreConfig"
        >更多配置</span>
        <t-icon
          class="icon"
          :name="`chevron-${showMoreConfig ? 'down' : 'up'}`"
          @click="showMoreConfig = !showMoreConfig"
        />
      </h4>
      <div v-show="showMoreConfig">
        <t-form-item
          :rules="rules.detect_type"
          label="探测类型:"
          name="detect_type"
        >
          <t-select
            v-model="formData.detect_type"
            style="width: 50%;"
          >
            <t-option
              key="TRACEROUTE"
              label="TRACEROUTE"
              value="TRACEROUTE"
            />
            <t-option
              key="ICMP PING"
              label="ICMP PING"
              value="ICMP PING"
            />
          </t-select>
        </t-form-item>
        <t-form-item
          :rules="rules.packet_num"
          label="单次发包个数:"
          name="packet_num"
        >
          <t-input-number
            v-model="formData.packet_num"
            :min="10"
          />
          <span class="danwei-text">个/次</span>
        </t-form-item>
        <t-form-item
          :rules="rules.packet_interval"
          label="发包间隔:"
          name="packet_interval"
        >
          <t-input-number
            v-model="formData.packet_interval"
            :min="1"
          />
          <span class="danwei-text">秒</span>
        </t-form-item>
        <t-form-item
          :rules="rules.packet_size"
          label="包大小:"
          name="packet_size"
        >
          <t-input-number
            v-model="formData.packet_size"
            :min="56"
            :max="65507"
          />
          <span class="danwei-text">字节（最大65507）</span>
        </t-form-item>
      </div>
    </t-form>
    <template #confirmBtn>
      <t-button
        :loading="loading.submitLoading"
        theme="primary"
        @click="confirm"
      >
        确认
      </t-button>
    </template>
  </t-dialog>
</template>

<script lang="ts" setup>
import { MessagePlugin, DialogPlugin } from 'tdesign-vue-next'
import { IsoConfigModel } from '@/api/NetworkService'
import { requestErrorMsg } from '@/common/utils'
import { reqCreateWorkOrder } from '@/api/workOrder'
import type { FormInstanceFunctions } from 'tdesign-vue-next'
// import { useRouter } from 'vue-router'
interface IProps {
  visible: boolean
  configOptions: IsoConfigModel
}
withDefaults(defineProps<IProps>(), {
  visible: false
})
interface Emits {
  (e: 'update:dialogVisible', val: boolean, type:any): void
  (e: 'viewOrder', val: any): void
  (e: 'reload'): void
}
// const router = useRouter()
const formData: any = reactive({
  detect_type: 'ICMP PING',
  packet_num: 10,
  packet_interval: 1,
  packet_size: 56,
  timeRange: []
})
const emits = defineEmits<Emits>()
const close = () => {
  emits('update:dialogVisible', false, 'edit')
}
// 提交
const loading = reactive({
  submitLoading: false
})
const confirm = async () => {
  isValidated.value = true
  await formRef.value?.validate()
  const configPass = checkConfig(configList)
  const { purpose, start_time, end_time, detect_type, packet_num, packet_interval, packet_size } = formData
  if (purpose && start_time && end_time && detect_type && packet_num && packet_interval && packet_size && configPass) {
    try {
      loading.submitLoading = true
      const { ticket_id } = await reqCreateWorkOrder({
        ticket_template_type: 'request_create_reverse_detect',
        params: {
          purpose,
          start_time,
          end_time,
          cloud_nets: [...new Set(configList.map((item: ConfigModel) => {
            return item.cloud_net
          }))],
          config: configList.map((item: ConfigModel) => {
            return {
              cloud_net: item.cloud_net,
              server_region: item.server_region,
              server_ips: splitIps(item.ips),
              cover_iso: item.cover_iso
            }
          }),
          detect_type,
          packet_num,
          packet_interval,
          packet_size
        }
      })
      loading.submitLoading = false
      emits('reload')
      const confirmDia = DialogPlugin.confirm({
        header: '提醒',
        body: '已成功提交工单， ID: ' + ticket_id,
        confirmBtn: '查看工单详情',
        cancelBtn: '取消',
        onConfirm: ({ e }) => {
          // router.push({ name: 'MyOrder', params: { ticket_id } })
          emits('viewOrder', { id: ticket_id })
          emits('update:dialogVisible', false, 'edit')
          // 请求成功后，销毁弹框
          confirmDia.destroy()
        },
        onClose: () => {
          emits('update:dialogVisible', false, 'edit')
          confirmDia.hide()
        },
        onClosed: () => confirmDia.destroy()
      })
    } catch (error: any) {
      requestErrorMsg(error.message as string)
    }
  } else {
    MessagePlugin.error('请先填写完整表单！')
  }
}
const checkConfig = (list:ConfigModel[]) => {
  let isOk = true
  if (list && list.length) {
    for (let i = 0; i < list.length; i++) {
      const { ips, cloud_net, cover_iso } = list[i]
      if (!ips || !cloud_net || !cover_iso) {
        isOk = false
      }
    }
  } else {
    isOk = false
  }
  return isOk
}
const splitIps = (ips:string) => {
  if (ips) {
    return ips.trim().replace(/(\n|\r)/g, ';').split(';').filter((i: string) => i)
  } else {
    return []
  }
}
interface ConfigModel {
  'cloud_net': string,
  'server_region': string,
  'ips': string,
  'server_ips': string[],
  'cover_iso': string
}
const configList: ConfigModel[] = reactive([{ cloud_net: '', server_region: '', server_ips: [], cover_iso: '', ips: '' }])
// const cloud_nets = computed(() => {
//   configList.map((item:ConfigModel) => {
//     return item.cloud_net
//   })
// })
const addConfig = (item: any, index: any) => {
  configList.splice(index + 1, 0, { cloud_net: '', server_region: '', server_ips: [], cover_iso: '', ips: '' })
}
const deleteConfig = (item: any, index: any) => {
  if (configList.length <= 1) {
    MessagePlugin.error('至少保留一个测速配置！')
    return
  }
  configList.splice(index, 1)
}
const showMoreConfig = ref(false)
// 校验表单
const formRef = ref<FormInstanceFunctions>()
const isValidated = ref(false)
const rules = {
  purpose: [{ required: true }],
  timeRange: [{ required: true }],
  detect_type: [{ required: true }],
  packet_num: [{ required: true }],
  packet_interval: [{ required: true }],
  packet_size: [{ required: true }]
}
// 处理时间字段
const formatTimeKey = () => {
  if (formData?.timeRange && formData?.timeRange.length) {
    formData.start_time = formData?.timeRange[0]
    formData.end_time = formData?.timeRange[1]
  } else {
    delete formData.start_time
    delete formData.end_time
  }
}

</script>

<script lang="ts">
export default defineComponent({
  name: 'EditForm'
})
</script>

<style lang="scss" scoped>
.class-title {
  width: 120px;
  text-align: right;
  padding: 10px 20px 10px 0;
}

.config-line {
  display: flex;
  margin-bottom: 10px;

  .config-item {
    flex: 1;
    display: flex;

    .config-label {
      width: 120px;
      text-align: right;
      line-height: 32px;
      padding-right: 20px;
    }

    .config-label::before {
      display: inline-block;
      margin-right: var(--td-comp-margin-xs);
      color: var(--td-error-color);
      line-height: var(--td-line-height-body-medium);
      content: "*";
    }

    .config-value {
      flex: 1;
    }
  }

  .config-num-btn {
    width: 50px;
    margin-left: 10px;
    line-height: 32px;
    cursor: pointer;
  }
}

.more-config {
  color: #0052D9;
  cursor: pointer;
  padding-right: 20px;

  .text {
    margin-right: 4px;
  }

  .icon {
    font-size: 16px;
  }
}

.error-text {
  color: var(--td-error-color);
  font-size: 12px;
}

.errorStyle {
  :deep(.t-input ) {
    border-color: var(--td-error-color) !important;
  }
  :deep(.t-textarea__inner ) {
    border-color: var(--td-error-color) !important;
  }
}
.danwei-text{
  padding-left: 20px;
}
</style>
