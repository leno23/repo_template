<template>
  <div class="worder-approve">
    <Card
      style="min-height: 52px;"
      margin="10px 10px 0"
    >
      <SearchForm
        @clear="clear"
        @search="search"
      />
    </Card>
    <Card class="main-card">
      <OrderTable
        ref="OrderTableRef"
        :req-list-func="reqMyApprovrOrderList"
        :handle-aprove="handleAprove"
      >
        <template #operate="{ row }">
          <t-button
            theme="primary"
            size="small"
            :disabled="!row.components[row.current_component_position].has_permission"
            @click="handleAprove(row, 'Pass')"
          >
            {{ $t('通过') }}
          </t-button>
          <t-button
            theme="danger"
            size="small"
            :disabled="!row.components[row.current_component_position].has_permission || row?.status === 'Reject'"
            @click="handleAprove(row, 'Reject')"
          >
            {{ $t('驳回') }}
          </t-button>
        </template>
      </OrderTable>
    </Card>

    <t-dialog
      :visible="dialogVisible"
      :header="$t(`工单${{ Pass: '通过', Reject: '驳回' }[formData.res]}内容补充`) + `-${dialogTitle}`"
      width="50%"
    >
      <t-form
        ref="formRef"
        :model="formData"
        labt-width="140px"
      >
        <t-form-item
          v-if="currentType === 'request_cloud_account' && formData.res === 'Pass' && currentRow?.status !== 'Waiting'"
          prop="cloud_account_name"
          :rules="[{ required: true, message: $t('该项必填') }]"
          :label="$t('账号名称')"
        >
          <t-input
            v-model="formData.cloud_account_name"
            placeholder="Please input"
          />
        </t-form-item>
        <t-form-item
          v-if="currentType === 'request_cloud_account' && formData.res === 'Pass' && currentRow?.status !== 'Waiting'"
          prop="uin"
          :rules="[{ required: true, message: $t('该项必填') }]"
          label="UIN"
        >
          <t-input v-model="formData.uin" />
        </t-form-item>
        <t-form-item
          v-if="currentType === 'request_cloud_account' && formData.res === 'Pass' && currentRow?.status !== 'Waiting'"
          prop="credentials"
          :rules="[
            { required: true, message: $t('该项必填') },
            {
              validator: (val:any) => {
                try {
                  JSON.parse(val)
                  return true;
                } catch (error) {
                  return { result: false, message: '必须为JSON格式', type: 'error' };
                }
              }
            }
          ]"
          :label="$t('云集子账号ak/sk')"
        >
          <t-input
            v-model="formData.credentials"
            theme="textarea"
            :autosize="{ minRows: 5 }"
            placeholder="Please input"
          />
        </t-form-item>

        <t-form-item :label="$t('理由')">
          <t-input
            v-model="formData.notes"
            :rows="2"
            theme="textarea"
            placeholder="Please input"
          />
        </t-form-item>
      </t-form>
      <template #footer>
        <span class="dialog-footer">
          <t-button
            :loading="loading"
            variant="outline"
            @click="dialogVisible = false"
          >
            {{ $t('取消') }}
          </t-button>
          <t-button
            :loading="loading"
            theme="primary"
            @click="doApprove(formRef)"
          >
            {{ $t('确认') }}
          </t-button>
        </span>
      </template>
    </t-dialog>
  </div>
</template>

<script lang="ts" setup>
import SearchForm from '../components/searchForm.vue'
import OrderTable from '../components/orderTable.vue'
import { reqMyApprovrOrderList, WorkOrderDetail, reqApproveWorkOrder } from '@/api/workOrder/index'
import { useCloudProviderStore } from '@/store/modules/cloudProvider'
import { $t, lang } from '@/common/utils/i18n'
import Card from '@/components/Card/index.vue'
import _ from 'lodash'
import { requestErrorMsg } from '@/common/utils'
const OrderTableRef = ref<InstanceType<typeof OrderTable>>()
/** --筛选-- */
const search = async (val: any, callBack: any) => {
  OrderTableRef?.value?.search(val, callBack)
}
const clear = async (callBack: any) => {
  OrderTableRef?.value?.clear(callBack)
}
/** --列表操作-- */
const currentRow = ref<WorkOrderDetail>()
const dialogVisible = ref<boolean>(false)
const dialogTitle = ref<string>('')
const currentType = ref<string>('')
const formRef = ref()

const formData = reactive({
  notes: '',
  res: '',
  cloud_account_name: '',
  credentials: '',
  uin: undefined
})

const getProviderCredentials = (row: WorkOrderDetail) => {
  const CloudProviderStore = useCloudProviderStore()
  const providerKey = _.get(row, 'params.provider_key', '')
  const provider = _.find(CloudProviderStore.regionAndZone, { key: providerKey })
  formData.credentials = JSON.stringify(_.get(provider, 'config', {}), null, 4)
}
// 审批
const handleAprove = (row: any, res: string) => {
  currentRow.value = row
  formData.cloud_account_name = row?.params?.cloud_account_name || ''
  formData.res = res
  dialogTitle.value = row[`type_${lang}`] || row.type
  dialogVisible.value = true
  currentType.value = row.order_type
  if (row.order_type === 'request_cloud_account' && res === 'Pass' && row.status !== 'Waiting') getProviderCredentials(row)
}

const loading = ref(false)
const doApprove = (form:any) => {
  if (!form) return
  form.validate().then(async (valid:any) => {
    if (valid) {
      loading.value = true
      let cloudAccountParams = {}
      if (currentType.value === 'request_cloud_account' && formData.res === 'Pass' && currentRow.value?.status !== 'Waiting') {
        cloudAccountParams = {
          tk_params: {
            aes_params: {
              uin: formData.uin,
              credentials: JSON.parse(formData.credentials),
              account_name: formData.cloud_account_name
            }
          }
        }
      }
      try {
        await reqApproveWorkOrder({
          id: currentRow.value?.id,
          business_id: currentRow.value?.business_id,
          component_id: currentRow.value?.components[currentRow.value.current_component_position].id,
          res: formData.res,
          notes: formData.notes,
          ...cloudAccountParams
        })
        dialogVisible.value = false
        // getTableList()
        OrderTableRef.value && OrderTableRef.value.getTableList()
        OrderTableRef.value && OrderTableRef.value.changeDialogVisible(false)
        formData.notes = ''
        form.value?.resetFields()
      } catch (error: any) {
        requestErrorMsg(error.message)
      }
      loading.value = false
    }
  })
}
</script>

<script lang="ts" scoped>
export default defineComponent({ name: 'OrderApprove' })
</script>

<style lang="scss" scoped>

.worder-approve {
  height: $contentHeight;
  display: flex;
  flex-direction: column;

  .main-card {
    flex: 1;
    height: 0;
  }
}
</style>
