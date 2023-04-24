<template>
  <t-dialog
    :visible="visible"
    header="申请创建云账号"
    :close-on-esc-keydown="false"
    :close-on-overlay-click="false"
    destroy-on-close
    top="8vh"
    width="1000px"
    :confirm-btn="{ loading: status.confirmLoading, onClick: submitSubAccounts }"
    @close="close"
  >
    <t-form
      ref="formRef"
      label-width="170px"
      :data="form"
      class="create-account-form-warpper"
      :rules="rules"
    >
      <t-form-item :label="$t('当前业务')">{{ currentBusinessLabel }}</t-form-item>

      <t-form-item
        :label="$t('云厂商')"
        name="provider_key"
      >
        <t-select
          v-model="form.provider_key"
          :options="CloudProviderStore.regionAndZone.map(item => ({ value: item.key, label: item[`name_${lang}`] }))"
        />
      </t-form-item>

      <t-form-item
        :label="$t('账号类型')"
        name="genre"
      >
        <t-select
          v-model="form.genre"
          :options="status.businessFilterTypeList"
        />
      </t-form-item>

      <t-form-item
        :label="$t('运营产品')"
        name="product_id"
      >
        <t-select
          v-model="form.product_id"
          :options="status.productList"
          :scroll="{ type: 'virtual' }"
          :loading="status.productLoading"
          :popup-props="{ overlayInnerStyle: { height: '300px' } }"
          filterable
        />
      </t-form-item>

      <t-form-item
        :label="$t('账号名称')"
        name="cloud_account_name"
      >
        <t-input v-model="form.cloud_account_name" />
      </t-form-item>

      <t-form-item
        :label="$t('账号维护人')"
        name="maintainer"
      >
        <t-select
          v-model="form.maintainer"
          :options="UserStore.yufuUsers"
          :scroll="{ type: 'virtual' }"
          :loading="UserStore.yufuLoading"
          :popup-props="{ overlayInnerStyle: { height: '300px' } }"
          filterable
          clearable
          multiple
          :min-collapsed-num="1"
        />
      </t-form-item>

      <t-form-item name="cost_estimate">
        <template #label>
          {{ $t('预估每月成本') }}({{ $t('美元') }})
          <t-tooltip
            :content="$t('单位：美元；如预估每月成本 >= 5万美元，需先经evankkwang(王珂珂) 审批。')"
            placement="top"
          >
            <t-icon
              size="large"
              name="help-circle-filled"
              style="margin: 0 0 1px 3px; color: var(--td-brand-color);"
            />
          </t-tooltip>
        </template>
        <t-input v-model="form.cost_estimate" />
      </t-form-item>

      <t-form-item name="statement_needs">
        <template #label>
          {{ $t('需求背景说明') }}
          <t-tooltip
            :content="$t('填写所申请云账号的用途，如选择第三方云必须说明不能使用腾讯云的原因。')"
            placement="top"
          >
            <t-icon
              size="large"
              name="help-circle-filled"
              style="margin: 0 0 1px 3px; color: var(--td-brand-color);"
            />
          </t-tooltip>
        </template>
        <t-textarea
          v-model="form.statement_needs"
          :maxcharacter="50"
        />
      </t-form-item>

      <h3
        v-show="form.provider_key && !['zenlayer', 'ibm'].includes(form.provider_key)"
        class="flex-y-center"
        style="margin: 10px 0 0 0;"
      >
        {{ $t('初始子账号') }}
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
      </h3>

      <div v-show="form.provider_key && !['zenlayer', 'ibm'].includes(form.provider_key)">
        <SubAccountForm
          ref="SubAccountRef"
          :provider="form.provider_key"
          :disabled="['zenlayer', 'ibm'].includes(form.provider_key)"
          label-width="110px"
          allow-clean-all
        />
      </div>
    </t-form>
  </t-dialog>
</template>

<script lang="ts" setup>
import { reqCreateWorkOrder } from '@/api/workOrder'
import { requestErrorMsg } from '@/common/utils'
import { $t, lang } from '@/common/utils/i18n'
import { enumBusinessType } from '@/const/business'
import { useBusinessStore } from '@/store/modules/business'
// import { useCloudAccountStore } from '@/store/modules/cloudAccount'
import { useCloudProviderStore } from '@/store/modules/cloudProvider'
import SubAccountForm from '@/views/ResourceManage/components/SubAccountForm.vue'
import type { FormInstanceFunctions, FormRule } from 'tdesign-vue-next'
import { DialogPlugin } from 'tdesign-vue-next'
import { reqProductAndObs } from '@/api/cloudAccount'
import { useUserStore } from '@/store/modules/user'
import { useRouter } from 'vue-router'

const props = defineProps<{ visible: boolean }>()
interface Emits{
  (e:'update:visible', val: boolean):void
}
const emits = defineEmits<Emits>()

const router = useRouter()

const UserStore = useUserStore()
const CloudProviderStore = useCloudProviderStore()
// const CloudAccountStore = useCloudAccountStore()
const BusinessStore = useBusinessStore()

const currentBusinessLabel = computed(() => {
  const currBusiness = BusinessStore.businessMap[BusinessStore.currentBusinessId]
  if (!currBusiness) return ''
  const { name_zh, name_en } = currBusiness
  return `${BusinessStore.currentBusinessId}-${name_zh}(${name_en})`
})

const status = reactive({
  businessFilterTypeList: enumBusinessType.filter(item => item.value !== 'app'),

  productList: [] as { label: string, value: number, product: string, obs_id: null | number }[],
  productLoading: false,

  confirmLoading: false
})

const getProducts = async () => {
  status.productLoading = true
  try {
    status.productList = (await reqProductAndObs()).results.map(item => ({
      label: `${item.name} | OBS ID: ${item.obs_id}`,
      value: item.id,
      product: item.name,
      obs_id: item.obs_id
    }))
  } catch (err: any) {
    requestErrorMsg(err.message)
  }
  status.productLoading = false
}

onMounted(getProducts)

// *-------------------------------
const form = reactive({
  statement_needs: '',
  cost_estimate: '',
  provider_key: '' as ProviderTypeEnum,
  maintainer: [],
  product_id: null as any as number,
  genre: '',
  cloud_account_name: ''
})

watch(() => props.visible, bool => {
  if (!bool) {
    form.product_id = null as any as number
    return
  }

  const currBusiness = BusinessStore.business.find(bus => bus.id === BusinessStore.currentBusinessId)
  if (currBusiness?.obs_id) {
    const defaultProduct = status.productList.find(item => item.obs_id === currBusiness.obs_id)
    if (defaultProduct) form.product_id = defaultProduct.value
  }
})

const formRef = ref<FormInstanceFunctions>()
const SubAccountRef = ref<InstanceType<typeof SubAccountForm>>()
watch(() => form.provider_key, () => nextTick(() => SubAccountRef.value?.cleanSub()))

const rules: Partial<Record<keyof typeof form, FormRule[]>> = {
  provider_key: [{ required: true, message: '请选择云厂商' }],
  genre: [{ required: true, message: '请选择账号类型' }],
  product_id: [{ required: true, message: '请选择运营产品' }],
  cost_estimate: [
    { required: true, message: '请输入数字' },
    {
      trigger: 'blur',
      validator: (val: string) => !!val.trim() && isNaN(Number(val.trim()))
        ? { result: false, type: 'error', message: '请输入数字' }
        : true
    }
  ],
  statement_needs: [
    { required: true, message: '请输入需求背景说明' },
    { whitespace: true, message: '请输入需求背景说明', trigger: 'blur' }
  ]
}

// let diaIns: DialogInstance // 确保只有一个实例，并且在卸载的时候销毁，否则dom会一直存在

const submitSubAccounts = async () => {
  const sub_account = await SubAccountRef.value?.confirm()
  const pass = await formRef.value?.validate()
  if (pass !== true || !sub_account) return

  const { cost_estimate, statement_needs, provider_key, maintainer, product_id, genre, cloud_account_name } = form

  const { product, obs_id } = status.productList.find(item => item.value === product_id)!

  const formatForm = {
    statement_needs: statement_needs.trim(),
    cost_estimate: cost_estimate.trim(),
    cloud_account_name: cloud_account_name.trim(),
    provider_key,
    maintainer,
    genre,
    product,
    obs_id
  }

  // diaIns?.destroy()

  status.confirmLoading = true
  try {
    const { ticket_id } = await reqCreateWorkOrder({
      ticket_template_type: 'request_cloud_account',
      business_id: BusinessStore.currentBusinessId,
      notes: '创建云账号',
      params: {
        ...formatForm,
        sub_account,
        business_id: BusinessStore.currentBusinessId
      },
      watchers: []
    })
    close()
    const diaIns = DialogPlugin.confirm({
      header: '已成功提交云账号申请工单， ID: ' + ticket_id,
      body: '是否跳转至查看工单',
      closeOnEscKeydown: false,
      closeOnOverlayClick: false,
      onConfirm: () => { router.push({ name: 'MyOrder', params: { ticket_id } }); diaIns.destroy() },
      onClosed: () => diaIns.destroy()
    })
  } catch (error:any) {
    requestErrorMsg(error.message)
  }
  status.confirmLoading = false
}
// onBeforeUnmount(() => diaIns?.destroy())

const close = () => {
  formRef.value?.reset()
  emits('update:visible', false)
}

</script>

<script lang="ts">
export default defineComponent({ name: 'CloudAccountCreater' })
</script>

<style lang="scss" scoped>
.create-account-form-warpper {
  width: 96%;
  padding: 0 40px 0 10px;
  margin: 0 auto;
  max-height: 600px;
  overflow-y: auto;
}
</style>
