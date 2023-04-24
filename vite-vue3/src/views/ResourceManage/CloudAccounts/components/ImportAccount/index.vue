<template>
  <t-dialog
    header="导入云账号"
    :close-on-esc-keydown="false"
    :close-on-overlay-click="false"
    destroy-on-close
    top="15vh"
    width="800px"
    :confirm-btn="{ loading: status.loading, onClick: confirm }"
    v-bind="$attrs"
    @close="close"
  >
    <t-form
      ref="formRef"
      label-width="110px"
      :data="form"
      class="import-account-form-warpper"
      :rules="rules"
    >
      <t-form-item
        label="账号名称"
        name="name"
      >
        <t-input
          v-model="form.name"
          placeholder="请输入账号名称"
        />
      </t-form-item>

      <t-form-item
        label="关联业务"
        name="is_relation"
      >
        <t-switch v-model="form.is_relation" />
      </t-form-item>

      <t-form-item
        label="云厂商"
        name="provider_key"
      >
        <t-select
          v-model="form.provider_key"
          :options="objectKeys(cloudProviderMap).map(value => ({ value, label: cloudProviderMap[value][lang] }))"
        />
      </t-form-item>

      <t-form-item
        label="认证秘钥"
        name="credentials"
      >
        <!-- <div
          ref="monacoCredentialsDOM"
          style="height: 200px; width: 100%;"
        /> -->
        <t-textarea
          v-model="form.credentials"
          :disabled="!form.provider_key"
          class="credentials-textarea"
        />
      </t-form-item>

      <t-form-item
        label="UIN"
        name="uin"
      >
        <t-input
          v-model="form.uin"
          placeholder="请输入UIN"
        />
      </t-form-item>

      <t-form-item
        label="需求描述"
        name="description"
      >
        <t-textarea
          v-model="form.description"
          placeholder="请输入需求描述"
        />
      </t-form-item>
    </t-form>
  </t-dialog>
</template>

<script lang="ts" setup>
import { reqCreateWorkOrder } from '@/api/workOrder'
import { objectKeys, requestErrorMsg, JSONFormat } from '@/common/utils'
import { lang } from '@/common/utils/i18n'
import { cloudProviderMap } from '@/const/cloudAccount'
import { useBusinessStore } from '@/store/modules/business'
import { useCloudProviderStore } from '@/store/modules/cloudProvider'
import { FormRule, FormInstanceFunctions, DialogPlugin } from 'tdesign-vue-next'
// import { monaco, initEditor, getCredentialsTemplate } from './config'
import { useRouter } from 'vue-router'

const emit = defineEmits(['update:visible'])
const router = useRouter()

const CloudProviderStore = useCloudProviderStore()

const status = reactive({ loading: false })

const form = reactive({
  name: '',
  is_relation: true,
  provider_key: '' as ProviderTypeEnum,
  credentials: '',
  uin: '',
  description: ''
})

// const monacoCredentialsDOM = ref<HTMLDivElement>()
// let credentialsEditor: monaco.editor.IStandaloneCodeEditor

// const onDialogOpened = () => { credentialsEditor = initEditor(monacoCredentialsDOM.value!) }

// watch(() => form.provider_key, val => credentialsEditor.setValue(val ? getCredentialsTemplate(val) : ''))

watch(() => form.provider_key, val => {
  if (!val) form.credentials = ''
  else form.credentials = JSONFormat(JSON.stringify(CloudProviderStore.regionAndZone.find(({ key }) => key === val)?.config))
})

const rules: Partial<Record<keyof typeof form, FormRule[]>> = {
  name: [
    { required: true, message: '请输入账号名称' },
    { whitespace: true, message: '请输入账号名称', trigger: 'blur' }
  ],
  provider_key: [{ required: true, message: '请选择云厂商' }],
  credentials: [
    { required: true, message: '请输入认证秘钥' },
    {
      trigger: 'blur',
      validator: (val: string) => {
        if (!val.trim()) return { result: false, type: 'error', message: '请输入认证秘钥' }
        try {
          JSON.parse(val)
          return true
        } catch (err: any) {
          return { result: false, type: 'error', message: '请输入正确的JSON格式' + ': ' + err.message }
        }
      }
    }
  ],
  uin: [
    { required: true, message: '请输入UIN' },
    { whitespace: true, message: '请输入UIN', trigger: 'blur' }
  ]
}

const formRef = ref<FormInstanceFunctions>()

const confirm = async () => {
  const pass = await formRef.value?.validate()
  if (pass !== true) return

  let { name, is_relation, provider_key, credentials, uin, description } = form
  name = name.trim()
  credentials = credentials.trim()
  uin = uin.trim()
  description = description.trim()

  status.loading = true
  try {
    const { ticket_id } = await reqCreateWorkOrder({
      ticket_template_type: 'request_export_cloud_account',
      business_id: useBusinessStore().currentBusinessId,
      notes: '导入云账号',
      params: { name, is_relation, provider_key, uin, description, credentials: JSON.parse(credentials) },
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
  status.loading = false
}

const close = () => {
  formRef.value?.reset()
  emit('update:visible', false)
}

</script>

<script lang="ts">
export default defineComponent({ name: 'ImportAccountDialog' })
</script>

<style lang="scss" scoped>
.import-account-form-warpper {
  width: 96%;
  padding: 0 40px 0 10px;
  margin: 0 auto;
  max-height: 600px;
  .credentials-textarea :deep(.t-textarea__inner) {
    height: 120px;
  }
}
</style>
