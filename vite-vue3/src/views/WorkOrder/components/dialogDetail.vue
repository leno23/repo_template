<template>
  <t-dialog
    :visible="dialogShow"
    :header="`${'ID:'+detailInfo?.id}-${$t('工单详情')}-${dialogTitle}`"
    width="1000px"
    @close="dialogShow=false"
  >
    <t-loading
      :loading="loading.deatailLoading"
      style="height: 500px;overflow: auto;"
    >
      <t-steps
        readonly
        layout="vertical"
      >
        <!-- 1 提交详情 -->
        <t-step-item
          status="finish"
          :title="
            lang==='en'?
              `${detailInfo&&detailInfo[`type_${lang}`]||detailInfo?.type} application submitted by ${detailInfo?.created_by}`
              :`${detailInfo?.created_by} 提交的 ${detailInfo&&detailInfo[`type_${lang}`]||detailInfo?.type} 申请`
          "
        >
          <template #extra>
            <div
              v-if="detailInfo"
              style="width: 880px;"
            >
              <ApplyInfo
                :data-type="detailInfo.type"
                :data="detailInfo.params"
              />
              <t-loading
                v-if="detailInfo.type === 'request_create_host'"
                :loading="loading.templateLoading"
              >
                <ApplyInfo
                  data-type="templateInfo"
                  :data="templateInfo"
                  :deltop-boder="true"
                  :empty-text="$t('未找到模板或模板已被删除')"
                />
              </t-loading>
            </div>
          </template>
        </t-step-item>
        <!-- 2 审批流程 -->
        <t-step-item
          v-for="(item,index) in detailInfo?.components"
          :key="index"
          :status="getStepStatus(currentComponentPosition,index)"
          :title="item[lang==='en'?'title_en':'title']||''"
          :class="`yunji-step step-${detailInfo?.status} ${getStepStatus(currentComponentPosition, index)}`"
        >
          <template
            v-if="!['finish','error'].includes(getStepStatus(currentComponentPosition, index))"
            #icon
          >
            <span class="step-round-boder">
              {{ index+2 }}
            </span>
          </template>
          <template #extra>
            <span
              v-dompurify-html="item[lang==='en'?'mark_en':'mark']||''"
              style="color:#606266"
            />
          </template>
        </t-step-item>
        <!-- 3 完成 -->
        <t-step-item
          :status="getEndStatus(detailInfo?.status)"
          :title="getEndTitle()"
          :class="`yunji-step end-step-${detailInfo?.status}`"
        >
          <template
            v-if="!['finish', 'error'].includes(getEndStatus(detailInfo?.status))"
            #icon
          >
            <span
              v-if="detailInfo?.components&&detailInfo?.components.length"
              class="step-round-boder"
            >
              {{ detailInfo?.components.length+2 }}
            </span>
          </template>
          <template #extra>
            <!-- Fail -->
            <span
              v-if="detailInfo?.status === 'Fail'"
              style="color:#606266"
            >
              {{ detailInfo?.err_msg||'' }}
            </span>
            <!-- Success -->
            <span
              v-else-if="detailInfo?.status === 'Success'"
              style="color:#606266"
            >
              <div
                v-for="(item,index) in detailInfo?.success_infos"
                :key="index"
              >
                <div
                  v-for="(kvObj,i) in sortObject(item,['id','uin','username','password'])"
                  :key="i"
                >
                  <span v-if="['credentials'].includes(`${kvObj.key}`)">
                    <!-- key -->
                    <span class="success-infos-key">
                      {{ formatCn(kvObj.key) }}:
                    </span>
                    <!-- value -->
                    <span
                      v-show="item[`show-${kvObj.key}`]"
                      style="margin-right: 10px;"
                    >
                      {{ kvObj.value }}
                    </span>
                    <!-- 按钮(收起展开)  -->
                    <span
                      style="color:#0052d9;cursor: pointer;"
                      @click="()=>{
                        item[`show-${kvObj.key}`]=!item[`show-${kvObj.key}`]
                      }"
                    >
                      {{ `${item[`show-${kvObj.key}`]?'收起':'展开'}` }}
                    </span>
                  </span>
                  <span v-else-if="`${kvObj.key}`.indexOf('show-') == -1">
                    <!-- key -->
                    <span class="success-infos-key">
                      {{ formatCn(kvObj.key) }}:
                    </span>
                    <!-- value -->
                    {{ kvObj.value }}
                  </span>
                </div>
                <t-divider
                  v-if="index<detailInfo?.success_infos.length-1"
                  dashed
                  style="margin: 5px 0;"
                />
              </div>
            </span>
            <!-- PartialFail -->
            <span
              v-else-if="detailInfo?.status === 'PartialFail'"
              style="color:#606266"
            >
              <div v-if="detailInfo?.success_infos&&detailInfo?.success_infos.length">
                <span style="font-weight: 777;">
                  {{ $t('成功信息') }}：
                </span>
                <div
                  v-for="(item,index) in detailInfo?.success_infos"
                  :key="index"
                >
                  <div
                    v-for="(kvObj,i) in sortObject(item,['id','username','password'])"
                    :key="i"
                  >
                    <span v-if="['credentials'].includes(`${kvObj.key}`)">
                      <!-- key -->
                      <span class="success-infos-key">
                        {{ formatCn(kvObj.key) }}:
                      </span>
                      <!-- value -->
                      <span
                        v-show="item[`show-${kvObj.key}`]"
                        style="margin-right: 10px;"
                      >
                        {{ kvObj.value }}
                      </span>
                      <!-- 按钮(收起展开)  -->
                      <span
                        style="color:#0052d9;cursor: pointer;"
                        @click="()=>{
                          item[`show-${kvObj.key}`]=!item[`show-${kvObj.key}`]
                        }"
                      >
                        {{ `${item[`show-${kvObj.key}`]?'收起':'展开'}` }}
                      </span>
                    </span>
                    <span v-else-if="`${kvObj.key}`.indexOf('show-') == -1">
                      <!-- key -->
                      <span class="success-infos-key">
                        {{ formatCn(kvObj.key) }}:
                      </span>
                      <!-- value -->
                      {{ kvObj.value }}
                    </span>
                  </div>
                  <t-divider
                    v-if="index<detailInfo?.success_infos.length-1"
                    dashed
                    style="margin: 5px 0;"
                  />
                </div>
              </div>

              <div v-if="detailInfo?.err_msg">
                <span style="font-weight: 777;">
                  {{ $t('错误信息') }}：
                </span>
                <p>
                  {{ detailInfo?.err_msg }}
                </p>
              </div>
            </span>
          </template>
        </t-step-item>
      </t-steps>
    </t-loading>
    <template
      v-if="['clone','withdraw','retry'].includes(type)"
      #footer
    >
      <span class="dialog-footer">
        <t-button
          :theme="getHandleBtnType(type)"
          :variant="type==='retry'?'outline':'base'"
          @click="toHandleWorkOrder(type)"
        >
          {{ `${$t('确认')}${lang==='en'?' ':''}${$t(type)}` }}
        </t-button>
        <t-button
          variant="outline"
          @click="dialogShow = false"
        >
          {{ $t('取消') }}
        </t-button>
      </span>
    </template>
    <template
      v-else-if="['approve'].includes(type)"
      #footer
    >
      <span class="dialog-footer">
        <t-button
          theme="primary"
          :disabled="detailInfo&&(!detailInfo.components[detailInfo.current_component_position].has_permission)"
          @click="()=>{handleAprove&&handleAprove(detailInfo,'Pass')}"
        >
          {{ `通过` }}
        </t-button>
        <t-button
          theme="danger"
          :disabled="detailInfo&&(!detailInfo.components[detailInfo.current_component_position].has_permission||detailInfo?.status === 'Reject')"
          @click="()=>{handleAprove&&handleAprove(detailInfo,'Reject')}"
        >
          {{ `驳回` }}
        </t-button>
      </span>
    </template>
    <template
      v-else
      #footer
    />
  </t-dialog>
</template>

<script lang="ts" setup>
import ApplyInfo from './applyInfo.vue'
import { $t, lang } from '@/common/utils/i18n'
import { requestErrorMsg } from '@/common/utils'
import { reqWorkOrderDetail, commonOrderParams, reqTemplateItem } from '@/api/workOrder/index'
const props = withDefaults(defineProps<{
    dialogVisible: boolean,
    type?:string,
    handleAprove?:any,
    currentRow: any
  }>(), {
  type: 'view',
  handleAprove: null
})
interface Emits {
  (e:'update:dialogVisible', val:boolean):void
  (e:'handleWorkOrder', val:any, type:any):void
}
const emits = defineEmits<Emits>()
const dialogShow = computed({
  get: () => props.dialogVisible,
  set: val => emits('update:dialogVisible', val)
})
const dialogTitle = ref<string>('')
const currentComponentPosition = ref<number>(0)
const detailInfo = ref<commonOrderParams>()
const loading = reactive({
  deatailLoading: false,
  templateLoading: false
})
const getDeatail = async () => {
  loading.deatailLoading = true
  const row = props.currentRow
  try {
    detailInfo.value = await reqWorkOrderDetail(`${row.id}`)
    dialogTitle.value = detailInfo.value[`type_${lang}`] || detailInfo.value.type
    if (detailInfo.value?.params?.template_params) {
      templateInfo.value = detailInfo.value?.params?.template_params
    } else if (detailInfo.value?.params?.template_id) {
      getTemplateItem(detailInfo.value?.params?.template_id)
    }
    currentComponentPosition.value = detailInfo.value.current_component_position
  } catch (error:any) {
    requestErrorMsg(error.message)
  }
  loading.deatailLoading = false
}
onMounted(getDeatail)
/** --获取模板信息-- */
const templateInfo = ref()
const getTemplateItem = async (id:number) => {
  loading.templateLoading = true
  try {
    templateInfo.value = await reqTemplateItem(id)
  } catch (error:any) {
    if (error.code === 404 && error?.data?.detail === '未找到。') {
      templateInfo.value = null
    } else {
      requestErrorMsg(error.message)
    }
  }
  loading.templateLoading = false
}
/** --getEndStatus-- */
const getEndStatus = (type:any) => {
  switch (type) {
  case 'Success':
    return 'finish'
  case 'Fail':
    return 'error'
  default:
    return 'default'
  }
}
/** --getEndTitle-- */
const getEndTitle = () => {
  let str = ''
  if (detailInfo.value) {
    str = `${detailInfo.value[`type_${lang}`] || detailInfo.value?.type}`
  }
  switch (detailInfo.value?.status) {
  case 'Reject':
    str += ` ${$t('被驳回')}`
    break
  case 'Fail':
    str += ` ${$t('失败')}`
    break
  case 'PartialFail':
    str += ` ${$t('部分失败')}`
    break
  default:
    str += ` ${$t('完成')}`
    break
  }
  return str
}
/** --获取审批流程的step状态-- */
const getStepStatus = (current:number, index:number) => {
  if (detailInfo?.value?.status === 'Success') { // 工单状态为成功，所有step为绿色
    return 'finish'
  } else if (detailInfo?.value?.status === 'Fail') { // 工单状态为失败，除了执行step为红色，其他为绿色，灰色兜底
    if (current > index) return 'finish'
    if (current === index) return 'error'
    return 'default'
  } else if (detailInfo?.value?.status === 'PartialFail') { // 工单状态为 部分失败
    return 'finish'
  } else { // 工单未结束，走完的step为成功色，当前的step为蓝色，未达到的为灰色
    if (current > index) return 'finish'
    if (current === index) return 'process'
    return 'default'
  }
}
/** --克隆/重试/撤回工单-- */
const getHandleBtnType = (type:any) => {
  switch (type) {
  case 'clone':
  case 'retry':
    return 'primary'
  case 'withdraw':
    return 'warning'
  default:
    return 'primary'
  }
}
const toHandleWorkOrder = (type:any) => {
  emits('handleWorkOrder', detailInfo?.value, type)
}
/** --对象有序遍历-- */
// arr：需要排序的key，下标代表排序优先级。0 排 第一
// obj：需要遍历的对象
// retrun: [{value:'',key:''}]
const sortObject = (obj:any, arr:string[]) => {
  const kvArr = []
  const reverseArr = arr.reverse()
  for (const keyName in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, keyName)) {
      kvArr.push({ key: keyName, value: obj[keyName] })
    }
  }
  kvArr.sort(function (a, b) {
    return reverseArr.indexOf(b.key) - reverseArr.indexOf(a.key)
  })
  return kvArr
}
// 部分 成功/失败信息 的key 转换为中文
const formatCn = (v:string) => {
  return {
    id: 'ID',
    uin: 'UIN',
    username: '用户名',
    password: '密码',
    credentials: '秘钥',
    login_url: '登录链接',
    is_delete: '是否删除',
    origin_uid: '云厂商ID',
    is_disable: '是否禁用',
    msg: '提示信息',
    activate_url: '激活链接'
  }[v] || v
}
</script>

<script lang="ts">
export default defineComponent({
  name: 'DialogDetail'
})
</script>

<style lang="scss">
.t-steps .t-steps-item--finish .t-steps-item__icon--number {
    border-color: #67c23a;

}
.t-steps .t-steps-item--finish .t-steps-item__icon .t-icon{
color: #67c23a;
}
.t-steps .t-steps-item--finish .t-steps-item__title{
    color: #67c23a;
}
.t-steps--vertical.t-steps--positive .t-steps-item--finish:not(:last-child)::before{
      border-right-color: rgba(0, 0, 0, 0.26);
    color: rgba(0, 0, 0, 0.26);
}
.step-round-boder{
  border: 1px solid;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  text-align: center;
  border-radius: 50%;
}

.t-steps-item--finish{
  .step-round-boder{
    color: #67c23a;
    border-color: #67c23a;
  }
}
.t-steps-item--process{
  .step-round-boder{
    color: #0052d9;
    border-color: #0052d9;
  }
}
.step-Reject.process,.end-step-Reject {
  .step-round-boder{
    color: #E37318;
    border-color: #E37318;
  }
  .t-steps-item__title{
    color: #E37318;
  }
}
.step-Fail.error,.end-step-Fail {
  .step-round-boder{
    color: #D54941;
    border-color: #D54941;
  }
}
.end-step-PartialFail {
    .t-steps-item__title{
    color: rgba(0, 0, 0, 0.26)!important;
  }
    .step-round-boder{
    color: rgba(0, 0, 0, 0.26)!important;
    border-color: rgba(0, 0, 0, 0.26)!important;
  }
}
.success-infos-key{
  margin-right: 10px;
  background-color: #e8eaec;
}
</style>
