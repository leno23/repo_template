<template>
  <t-dialog
    :close-on-overlay-click="false"
    :destroy-on-close="false"
    attach="body"
    top="10vh"
    width="900px"
    :visible="visible"
    :header="isEdit? $t('编辑角色'):$t('创建角色')"
    @close="handleCancel"
  >
    <t-form
      ref="roleFormRef"
      :label-width="120"
      :data="roleForm"
      :rules="roleFormRule"
      style="padding: 0 30px 0 0"
    >
      <t-form-item
        :label="$t('角色code')"
        name="role_code"
      >
        <t-input
          v-model="roleForm.role_code"
          :placeholder="$t('角色code')"
        />
      </t-form-item>
      <t-form-item
        :label="$t('角色名称')"
        name="role_name"
      >
        <t-input
          v-model="roleForm.role_name"
          :placeholder="$t('角色名称')"
        />
      </t-form-item>
      <t-form-item
        :label="$t('云厂商')"
        name="provider_key"
      >
        <t-select
          v-model="roleForm.provider_key"
          :placeholder="$t('云厂商')"
        >
          <t-option
            v-for="(val, key) of cloudProviders"
            :key="key"
            :label="$t(val)"
            :value="key"
          />
        </t-select>
      </t-form-item>
      <t-form-item
        :label="$t('角色类型')"
        name="role_type"
      >
        <t-select
          v-model="roleForm.role_type"
          :placeholder="$t('角色类型')"
        >
          <t-option
            v-for="item of enumRoleType"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          />
        </t-select>
      </t-form-item>
      <t-form-item
        :label="$t('策略JSON')"
        name="policy"
      >
        <!-- <codemirror
          v-model:value="roleForm.policy"
          :options="cmOptions"
          class="code-editor"
        /> -->
        <t-textarea
          v-model="roleForm.policy"
          :autosize="{ minRows: 6, maxRows: 6 }"
          :placeholder="$t('请输入内容')"
        />
      </t-form-item>
      <t-form-item
        :label="$t('描述')"
        name="description"
      >
        <t-textarea
          v-model="roleForm.description"
          :autosize="{ minRows: 4, maxRows: 4 }"
          :placeholder="$t('请输入内容')"
        />
      </t-form-item>
    </t-form>
    <template #footer>
      <t-button
        theme="default"
        @click="handleCancel"
      >
        {{ $t('取消') }}
      </t-button>
      <t-button
        theme="primary"
        :loading="btnLoading"
        @click="handleSubmit"
      >
        {{ $t('确认') }}
      </t-button>
    </template>
  </t-dialog>
</template>
<script lang="ts">
import { $t } from '@/common/utils/i18n'
// import { useRoute } from 'vue-router'
import { requestErrorMsg } from '@/common/utils'
// import { reqCloudBusinessAccount, AccountModal } from '@/api/resourceManage/cloudAccount'
import { EditFormModal, createCloudResourceRole, updateCloudResourceRole } from '@/api/OperationalData/subAccountRoleConfig'
import { enumRoleType } from '../config'
// import Codemirror from 'codemirror-editor-vue3'
// 编辑器代码格式
import 'codemirror/mode/javascript/javascript.js'
// 自动刷新(防止codemirror需要手动刷新才出数据)
import 'codemirror/addon/display/autorefresh'
// 主题
import 'codemirror/theme/ayu-mirage.css'
import type{ FormInstanceFunctions, FormRule } from 'tdesign-vue-next'
import { cloudProviders } from '@/const/assetConfig'

export default defineComponent({ name: 'SubAccountRoleFormDialog' })
</script>

<script lang="ts" setup>

interface Props {
  visible: boolean,
  isEdit: boolean,
  roleId: number,
  editForm: any
}
interface Emits {
  (e: 'update:visible', val: boolean): void;
  (e: 'reload'): void
  (e: 'close'): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

// const route = useRoute()

const roleFormRef = ref<FormInstanceFunctions>()
const btnLoading = ref(false)
const roleForm = ref<EditFormModal>({
  role_code: '',
  role_name: '',
  provider_key: '',
  role_type: '',
  policy: '',
  description: ''
})
// const cmOptions = reactive({
//   autorefresh: true,
//   tabSize: 4,
//   mode: 'application/json',
//   theme: 'ayu-mirage',
//   line: true,
//   viewportMargin: Infinity, // 处理高度自适应时搭配使用
//   highlightDifferences: true,
//   autofocus: false,
//   indentUnit: 2,
//   smartIndent: true,
//   showCursorWhenSelecting: true,
//   lineWrapping: true,
//   firstLineNumber: 1
// })

const roleFormRule: {[k:string]:FormRule[]} = {
  role_code: [
    { required: true, message: $t('请输入角色code'), trigger: 'blur' },
    { whitespace: true, message: $t('请输入角色code'), trigger: 'blur' }
  ],
  role_name: [
    { required: true, message: $t('请输入角色名称'), trigger: 'blur' },
    { whitespace: true, message: $t('请输入角色名称'), trigger: 'blur' }
  ],
  provider_key: [{ required: true, message: $t('请选择云厂商') }],
  role_type: [{ required: true, message: $t('请选择角色类型') }],
  policy: [
    { required: true, message: '请输入策略JSON', trigger: 'blur' },
    {
      trigger: 'blur',
      validator: (val: string) => {
        if (!val.trim()) return { result: false, type: 'error', message: '请输入策略JSON' }
        try {
          JSON.parse(val)
          return true
        } catch (err: any) {
          return { result: false, type: 'error', message: '请输入正确的JSON格式' + ': ' + err.message }
        }
      }
    }
    // {
    //   validator (value) {
    //     try {
    //       JSON.parse(value)
    //       return { result: true, message: '', type: 'success' }
    //     } catch (error) {
    //       return { result: false, message: '必须为JSON格式', type: 'error' }
    //     }
    //   }
    // }
  ]
}

// 获取云账号数据
// const allCloudAccountList = ref<AccountModal[]>([])
// const getCloudAccount = async () => {
//   try {
//     allCloudAccountList.value = await reqCloudBusinessAccount(Number(route.params.business_id))
//   } catch (error:any) {
//     requestErrorMsg(error.message)
//   }
// }

watch(() => props.visible, () => {
  roleFormRef.value?.reset()
  if (props.isEdit) {
    roleForm.value = {
      ...props.editForm,
      policy: props.editForm?.policy ? JSON.stringify(props.editForm?.policy, null, '\t') : ''
    }
  } else {
    roleForm.value = {
      role_code: '',
      role_name: '',
      provider_key: '',
      role_type: '',
      policy: '',
      description: ''
    }
  }
})

const handleSubmit = async () => {
  const valid = await roleFormRef.value?.validate()
  if (valid !== true) return

  btnLoading.value = true
  try {
    if (props.isEdit) {
      await updateCloudResourceRole(props.roleId, {
        ...roleForm.value,
        policy: JSON.parse(roleForm.value.policy)
      } as any)
    } else {
      await createCloudResourceRole({
        ...roleForm.value,
        policy: JSON.parse(roleForm.value.policy)
      } as any)
    }
    emits('reload')
    emits('close')
  } catch (error:any) {
    requestErrorMsg(error.message)
  }
  btnLoading.value = false
}

const handleCancel = () => {
  roleFormRef.value?.reset()
  emits('close')
}

// onMounted(() => {
//   getCloudAccount()
// })

</script>

<style lang="scss" scoped>
.cloud-provider-options {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
