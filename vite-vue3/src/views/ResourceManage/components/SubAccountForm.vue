<template>
  <template v-if="!disabled">
    <t-form
      ref="formRef"
      :data="controller.list"
      layout="inline"
      class="sub-account-form"
      :label-width="labelWidth"
    >
      <template
        v-for="item, index in controller.list"
        :key="index + item.key"
      >
        <div class="sub-account-form-item-warpper">
          <div class="sub-row">
            <t-form-item
              :name="`${index}.access`"
              label="访问方式"
              :rules="rules[index].access"
            >
              <t-select
                v-model="item.access"
                :options="objectKeys(enumSubAccountAccessMode).map(value => ({ value, label: enumSubAccountAccessMode[value][`label_${lang}`] }))"
              />
            </t-form-item>

            <t-form-item
              :name="`${index}.role`"
              label="角色"
              :rules="rules[index].role"
            >
              <t-select
                v-model="item.role"
                :options="getSortRoleOptions(['admin'])"
                :loading="controller.roleLoading"
              />
            </t-form-item>
          </div>

          <div class="sub-row">
            <t-form-item
              v-if="!(provider === 'gcp' && item.access !== 'programmatic')"
              :name="`${index}.name`"
              label="子账号名"
              :rules="rules[index].name"
            >
              <t-input v-model="item.name" />
            </t-form-item>

            <t-form-item
              v-if="!(provider === 'aws' || ((provider === 'gcp' || provider === 'azure') && item.access === 'programmatic'))"
              :name="`${index}.email`"
              label="邮箱"
              :rules="rules[index].email"
            >
              <t-input v-model="item.email" />
            </t-form-item>
          </div>

          <t-icon
            v-if="allowCleanAll || controller.list.length > 1"
            name="close"
            size="large"
            class="del-item-btn"
            @click="deleteSubAccount(index)"
          />
        </div>
      </template>
    </t-form>

    <t-button
      theme="primary"
      variant="text"
      content="新增子账号"
      size="small"
      :style="`margin: ${controller.list.length ? '0' : '24px'} 0 24px 0;`"
      @click="addSubAccount"
    >
      <template #icon>
        <t-icon name="add" />
      </template>
    </t-button>
  </template>
</template>

<script lang="ts" setup>
/* eslint-disable no-useless-escape */
import type { SubAccountAccessModeEnum } from '@/const/cloudAccount'
import { reqSubAccountRole } from '@/api/ResourceManage/CloudAccount'
import type { SubAccountRoleModel } from '@/api/ResourceManage/CloudAccount'
import { requestErrorMsg, objectKeys } from '@/common/utils'
import { enumSubAccountAccessMode } from '@/const/cloudAccount'
import { lang } from '@/common/utils/i18n'
import type { FormRule, FormInstanceFunctions } from 'tdesign-vue-next'

// const props =
const props = withDefaults(
  defineProps<{ provider: ProviderTypeEnum, disabled?: boolean, allowCleanAll?: boolean, labelWidth?: string }>(),
  { labelWidth: '80px' }
)

interface SubAccountModel {
  access: SubAccountAccessModeEnum,

  role: string
  // roleErr: string

  email: string
  // emailErr: string

  name: string
  // nameErr: string

  key: number // 用来做列表渲染的key，便于自动清空和保存当前项的验证状态
}

const controller = reactive({
  list: [] as SubAccountModel[],

  roleList: [] as SubAccountRoleModel[],
  roleLoading: false
})

//* ------------------------------------------
const getRoleList = async () => {
  if (!props.provider) return
  controller.roleLoading = true
  try {
    controller.roleList = await reqSubAccountRole(props.provider)
  } catch (err: any) {
    requestErrorMsg(err.message)
  }
  controller.roleLoading = false
}
watch(() => props.provider, getRoleList, { immediate: true })

// 操作子账号行
// const addSubAccount = () => controller.list.push({ access: 'console', role: '', roleErr: '', email: '', emailErr: '', name: '', nameErr: '' })
const addSubAccount = () => controller.list.push({ access: 'console', role: '', email: '', name: '', key: Date.now() })

const deleteSubAccount = (index: number) => controller.list.splice(index, 1)

const cleanSub = () => {
  controller.list.length = 0
  addSubAccount()
}

// * ----------------------
const formRef = ref<FormInstanceFunctions>()

const rules = computed(() => controller.list.map(item => ({
  access: [{ required: true }],
  role: [{ required: true, message: '请选择角色' }],
  name: [
    { required: !(props.provider === 'gcp' && item.access !== 'programmatic'), message: '请输入子账号名' },
    {
      trigger: 'blur',
      validator: (val: string) => {
        const name = val.trim()
        // gcp 选择API访问时，不进行校验
        if (!name && !(props.provider === 'gcp' && item.access !== 'programmatic')) {
          return { result: false, type: 'error', message: '请输入子账号名' }
        }

        switch (props.provider) {
        case 'gcp':
          if (item.access === 'programmatic' && (name.length > 30 || name.length < 6 || !/[a-z]([-a-z0-9]*[a-z0-9])/.test(name) || name.includes('.'))) {
            return { result: false, type: 'error', message: '长度 6-30 位，不能有小数点' }
          }
          break

        case 'aws':
          if (!/^[a-zA-Z_][\w-]*$/.test(name)) {
            return { result: false, type: 'error', message: '字母或下划线开头，并且只能包含字母、数字、下划线( _ )、中划线( - )' }
          }
          break

        case 'tencent':
          if (/[^a-zA-Z0-9@、,\._\[\]\-:\(\)（）【】\+=，。]/.test(name) || name.length > 64) {
            return { result: false, type: 'error', message: '长度64个字符以内，只允许数字、字母与特殊字符 @ 、 , . _ [ ] - : ( ) （ ） 【 】 + = ， 。' }
          }
          break

        case 'huawei':
          if (/[^a-zA-Z0-9\s\-\._]/.test(name) || !isNaN(+name[0])) {
            return { result: false, type: 'error', message: '不能以数字开头，只允许大小写字母、空格、数字与特殊字符 - _ .' }
          }
          break
            // azure用户名无限制
            // case 'azure':
        }

        return true
      }
    }
  ],
  email: [
    {
      required: !(props.provider === 'aws' || ((props.provider === 'gcp' || props.provider === 'azure') && item.access === 'programmatic')) && ['azure', 'gcp'].includes(props.provider),
      message: '请填写正确的邮箱地址'
    },
    {
      trigger: 'blur',
      validator: (val: string) => {
        const email = val.trim()
        // gcp和azure 选择API访问时不填邮箱，不进行校验；选择控制台访问时邮箱必填
        if ((['azure', 'gcp'].includes(props.provider)) && item.access === 'programmatic') return true
        // 其他情况下邮箱可以不填，如果填了的话也需要验证格式正确
        else if ((['azure', 'gcp'].includes(props.provider) || email) && !/^([A-Za-z0-9_\-\.\u4e00-\u9fa5])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})$/.test(email)) {
          return { result: false, type: 'error', message: '请填写正确的邮箱地址' }
        } else return true
      }
    }
  ]
} as Partial<Record<keyof SubAccountModel, FormRule[]>>)
))

const confirm = async () => {
  if (props.disabled) return []
  const pass = await formRef.value?.validate()

  if (pass !== true) return

  return controller.list.map(item => ({
    access_type: item.access,
    role: item.role,
    email: (['azure', 'gcp'].includes(props.provider)) && item.access === 'programmatic' ? '' : item.email.trim(),
    name: (['gcp'].includes(props.provider)) && item.access !== 'programmatic' ? '' : item.name.trim()
  }))
}

defineExpose({ confirm, cleanSub })
// 角色选项 (sortArr：指定顺序)
const getSortRoleOptions = (sortArr:any) => {
  const reverseArr = sortArr.reverse()
  return controller.roleList.map(role => ({ value: role.role_code, label: `${role.role_name} ( ${role.role_code} )` })).sort(function (a, b) {
    return reverseArr.indexOf(b.value) - reverseArr.indexOf(a.value)
  })
}
</script>

<script lang="ts">
export default defineComponent({ name: 'SubAccountController' })
</script>

<style lang="scss" scoped>
.sub-account-form {
  row-gap: unset;
  .sub-account-form-item-warpper {
    flex: 1;
    position: relative;
    border-bottom: 1px solid #dddddd;
    padding-top: 24px;
    &:last-of-type {
      border: none;
    }

    .sub-row {
      display: flex;
      flex: 1;

      .t-form__item {
        flex: 1;
        margin: 0 0 24px 0;
        // margin-bottom: 24px;
      }

    }
    .del-item-btn {
      position: absolute;
      top: 50%;
      right: -25px;
      transform: translateY(-50%);
      color: #ccc;
      font-size: 18px;
      cursor: pointer;
      transition: color 200ms;
      &:hover {
        color: red;
      }
    }

  }
}
</style>
