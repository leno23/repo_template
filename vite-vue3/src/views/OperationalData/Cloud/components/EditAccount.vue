<template>
  <t-dialog
    :visible="visible"
    :header="$t('编辑云账号')"
    class="cloud-dialog"
    :close-on-overlay-click="false"
    top="10vh"
    width="60%"
    @close="close"
  >
    <t-form
      ref="accountFormRef"
      label-width="120px"
      :data="accountForm"
      :rules="accountRules"
      style="height: 60vh; overflow: auto;"
    >
      <t-form-item
        :label="$t('云账号名称')"
        name="name"
      >
        <t-input
          v-model="accountForm.name"
          :placeholder="$t('请输入账号名称')"
          style="width: 90%"
        />
      </t-form-item>
      <t-form-item
        :label="$t('账号来源')"
      >
        <t-select
          v-model="accountForm.source"
          style="width:90%"
        >
          <t-option
            v-for="item of enumSourceType"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </t-select>
      </t-form-item>
      <t-form-item
        :label="$t('账号类型')"
        name="genre"
      >
        <t-select
          v-model="accountForm.genre"
          style="width:90%"
        >
          <t-option
            v-for="item of BusinessTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </t-select>
      </t-form-item>
      <t-form-item :label="$t('账号维护人')">
        <t-select
          v-model="accountForm.maintainer"
          :loading="UserStore.yufuLoading"
          style="width:90%"
          :options="UserStore.yufuUsers"
          filterable
          :scroll="{ type: 'virtual' }"
          multiple
        />
      </t-form-item>
      <t-form-item
        :label="$t('认证秘钥')"
        name="credentials"
      >
        <t-textarea
          v-model="accountForm.credentials"
          style="width: 90%"
          :autosize="{
            minRows:4
          }"
          :placeholder="$t('请输入内容')"
        />
      </t-form-item>
      <t-form-item
        label="UIN"
        name="uin"
      >
        <t-input
          v-model="accountForm.uin"
          style="width:90%"
          :placeholder="$t('请输入UIN')"
        />
      </t-form-item>
      <t-form-item
        :label="$t('成本归属')"
        name="cost_belong"
      >
        <t-select
          v-model="accountForm.cost_belong"
          style="width:90%"
        >
          <t-option
            v-for="item of enumCostAttribution"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </t-select>
      </t-form-item>
      <t-form-item
        :label="$t('站点类型')"
        name="station_type"
      >
        <t-select
          v-model="accountForm.station_type"
          style="width:90%"
        >
          <t-option
            v-for="item of enumStationType"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </t-select>
      </t-form-item>
      <t-form-item
        :label="$t('安全管控')"
        name="is_safety_control"
      >
        <t-switch
          v-model="accountForm.is_safety_control"
          style="width:20px"
          active-text="是"
          inactive-text="否"
        />
      </t-form-item>
      <t-form-item
        :label="$t('是否分账')"
        name="is_share_bill"
      >
        <t-switch
          v-model="accountForm.is_share_bill"
          style="width:20px"
          active-text="是"
          inactive-text="否"
        />
      </t-form-item>
      <t-form-item
        :label="$t('备注')"
        name="description"
      >
        <t-input
          v-model="accountForm.description"
          style="width: 90%"
          theme="textarea"
          :rows="3"
          :placeholder="$t('请输入内容')"
        />
      </t-form-item>
    </t-form>
    <template #footer>
      <t-button
        theme="default"
        @click="close"
      >
        {{ $t('取消') }}
      </t-button>
      <t-button
        theme="primary"
        :loading="btnLoading"
        @click="editAccount"
      >
        {{ $t('确认') }}
      </t-button>
    </template>
  </t-dialog>
</template>
<script lang="ts">
import _ from 'lodash'
import { requestErrorMsg } from '@/common/utils'
import { enumBusinessType, enumSourceType, enumCostAttribution, enumStationType } from '../config'
import { AccountEditForm, updateCloudAccount } from '@/api/OperationalData/cloud'
import { $t } from '@/common/utils/i18n'
import { MessagePlugin } from 'tdesign-vue-next'
import type { FormInstanceFunctions, FormRule } from 'tdesign-vue-next'
import { useUserStore } from '@/store/modules/user'

export default defineComponent({ name: 'EditAccount' })
</script>

<script lang="ts" setup>

interface Props {
  accountId: number,
  visible: boolean,
  content: AccountEditForm
}

interface Emits {
  (e: 'update:visible', val: boolean): void;
  (e: 'reload'): void
}

const props = withDefaults(defineProps<Props>(), {
  visible: false
})
const emits = defineEmits<Emits>()
const UserStore = useUserStore()
const accountFormRef = ref<FormInstanceFunctions>()
const btnLoading = ref(false)

const BusinessTypeList = _.filter(enumBusinessType, item => item.value !== 'app')

const accountRules: {[k:string]: Array<FormRule>} = {
  name: [
    { required: true, message: $t('请输入账号名称'), trigger: 'blur' },
    { whitespace: true, message: $t('请输入账号名称'), trigger: 'blur' }
  ],
  uin: [
    { required: true, message: $t('请输入UIN'), trigger: 'blur' },
    { whitespace: true, message: $t('请输入UIN'), trigger: 'blur' }
  ],
  credentials: [
    { required: true, message: '请输入认证秘钥', trigger: 'blur' },
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
  ]
}

const accountForm = ref<any>({
  uin: '',
  name: '',
  genre: '',
  description: '',
  credentials: '',
  source: '',
  maintainer: [],
  cost_belong: '',
  station_type: ''
})

watch(() => props.visible, bool => {
  if (!bool) return
  accountForm.value = props.content
})

const editAccount = async () => {
  const valid = await accountFormRef.value?.validate()
  if (valid !== true) return

  btnLoading.value = true

  try {
    await updateCloudAccount(props.accountId, {
      ...accountForm.value,
      credentials: JSON.parse(accountForm.value.credentials)
    })
    MessagePlugin.success($t('修改成功'))
    emits('reload')
    emits('update:visible', false)
  } catch (error:any) {
    requestErrorMsg(error.message)
  }

  btnLoading.value = false
}

const close = () => {
  accountFormRef.value?.reset()
  emits('update:visible', false)
}
</script>
