<template>
  <t-dialog
    :visible="visible"
    header="创建子账号"
    :close-on-esc-keydown="false"
    :close-on-overlay-click="false"
    destroy-on-close
    top="8vh"
    width="900px"
    :confirm-btn="{ loading: status.confirmLoading, onClick: submitSubAccounts, disabled: !form.accountId }"
    @close="close"
  >
    <t-form
      ref="formRef"
      label-width="80px"
      :data="form"
      class="create-subaccount-form-warpper"
      :rules="rules"
    >
      <t-form-item
        :label="$t('云账号')"
        name="accountId"
      >
        <t-select
          v-model="form.accountId"
          :loading="cloudAccounts.loading"
          filterable
          :empty="$t('该业务下无云账号')"
        >
          <t-option
            v-for="item in cloudAccounts.list"
            :key="item.id"
            :label="`${item.name} ( ${item.provider_key} )`"
            :value="item.id"
            :disabled="item.provider_key === 'zenlayer'"
          >
            <div class="flex-y-center">
              <CloudProviderLogo
                :provider="item.provider_key"
                style="height: 24px; margin-right: 5px;"
              />
              {{ `${item.name} ( ${item.provider_key} )` }}
            </div>
          </t-option>
        </t-select>
      </t-form-item>

      <template v-if="form.accountId">
        <h4 class="flex-y-center">
          {{ $t('子账号') }}
          <t-link
            style="margin-left: 5px;"
            theme="primary"
            target="_blank"
            href="https://doc.weixin.qq.com/doc/w3_AXIAyQa8APQ2EZmUbXGS7OBmmWgtW?scode=AJEAIQdfAAoLkU0Oj1AD8A4QYkACk"
          >
            <t-icon
              name="help-circle-filled"
              size="large"
            />
          </t-link>
        </h4>
        <div>
          <SubAccountForm
            ref="SubAccountRef"
            :provider="status.provider"
            label-width="80px"
          />
        </div>

        <t-form-item
          :label="$t('理由')"
          name="reason"
        >
          <t-textarea v-model="form.reason" />
        </t-form-item>

        <t-form-item
          :label="$t('备注')"
          name="notes"
        >
          <t-textarea v-model="form.notes" />
        </t-form-item>
      </template>
    </t-form>
  </t-dialog>
</template>

<script lang="ts" setup>
import { reqCreateWorkOrder } from '@/api/workOrder'
import { requestErrorMsg } from '@/common/utils'
import { $t } from '@/common/utils/i18n'
import { useBusinessStore } from '@/store/modules/business'
import { useCloudAccountStore } from '@/store/modules/cloudAccount'
import SubAccountForm from '@/views/ResourceManage/components/SubAccountForm.vue'
import type { FormInstanceFunctions, FormRule } from 'tdesign-vue-next'
import { DialogPlugin } from 'tdesign-vue-next'
import { useRouter } from 'vue-router'

const router = useRouter()
const CloudAccountStore = useCloudAccountStore()
const BusinessStore = useBusinessStore()
defineProps<{ visible: boolean }>()
interface Emits{
  (e:'update:visible', val: boolean):void
  // (e: 'success'):void
}
const emits = defineEmits<Emits>()

const cloudAccounts = computed(() => CloudAccountStore.businessAccounts(BusinessStore.currentBusinessId))

const status = reactive({
  provider: '' as ProviderTypeEnum,
  accountName: '',
  uin: '',
  confirmLoading: false
})

const form = reactive({
  accountId: null as any as number,
  reason: null as any as string,
  notes: null as any as string
})

const SubAccountRef = ref<InstanceType<typeof SubAccountForm>>()

watch(() => form.accountId, id => {
  if (!id) return
  const { provider_key, name, uin } = cloudAccounts.value.list.find(item => item.id === id)!
  status.provider = provider_key
  status.accountName = name
  status.uin = uin
  nextTick(() => SubAccountRef.value?.cleanSub())
})

const rules: Partial<Record<keyof typeof form, FormRule[]>> = {
  reason: [
    { required: true, message: $t('请输入理由'), trigger: 'blur' },
    { whitespace: true, message: $t('请输入理由'), trigger: 'blur' }
  ]
}
const formRef = ref<FormInstanceFunctions>()

const close = () => {
  status.provider = '' as ProviderTypeEnum
  status.accountName = ''
  form.accountId = null as any as number
  emits('update:visible', false)
}

const submitSubAccounts = async () => {
  const sub_account = await SubAccountRef.value?.confirm()
  const pass = await formRef.value?.validate()
  if (pass !== true || !sub_account) return
  status.confirmLoading = true
  try {
    const { ticket_id } = await reqCreateWorkOrder({
      ticket_template_type: 'request_add_sub_account',
      notes: '创建子账号',
      business_id: BusinessStore.currentBusinessId,
      params: {
        business_id: BusinessStore.currentBusinessId,
        provider_key: status.provider,
        name: status.accountName,
        uin: status.uin,
        notes: form.notes || '',
        reason: form.reason,
        id: form.accountId,
        sub_account
      },
      watchers: []
    })

    close()
    const diaIns = DialogPlugin.confirm({
      header: '已成功提交工单， ID: ' + ticket_id,
      body: '是否跳转至查看工单',
      closeOnEscKeydown: false,
      closeOnOverlayClick: false,
      onConfirm: () => { router.push({ name: 'MyOrder', params: { ticket_id } }); diaIns.destroy() },
      onClosed: () => diaIns.destroy()
    })
  } catch (err: any) {
    requestErrorMsg(err.message)
  }
}

</script>

<script lang="ts">
export default defineComponent({ name: 'SubAccountCreater' })
</script>

<style lang="scss" scoped>
.create-subaccount-form-warpper {
  width: 96%;
  padding: 0 40px 0 10px;
  margin: 0 auto;
  max-height: 550px;
  overflow-y: auto;
}
</style>
