<template>
  <Card class="role-container">
    <div class="role-table">
      <t-button
        style="display: block; margin: auto 0 10px auto;"
        theme="primary"
        @click="openAddDialog"
      >
        {{ $t('创建角色') }}
      </t-button>

      <div class="table-wrapper">
        <vxe-grid
          id="sub-account-role-table"
          ref="subAccountRoleConfigTable"
          v-bind="options"
        >
          <template #loading>
            <t-loading />
          </template>
        </vxe-grid>
      </div>
    </div>

    <RoleFormDialog
      v-model:visible="subAccountRoleDialog"
      :is-edit="isEdit"
      :edit-form="editForm"
      :role-id="roleId"
      @close="onCancel"
      @reload="updateTableList"
    />
  </Card>
</template>

<script lang="tsx">
import { $t } from '@/common/utils/i18n'
import { get, find, reduce } from 'lodash'
import { VxeGridInstance, VxeGridProps } from 'vxe-table'
import { requestErrorMsg } from '@/common/utils'
import { getCloudResourceRolesList, SubAccountRoleConfigModal, EditFormModal, deleteCloudResourceRole, CloudResourceRoleSyncPolicy } from '@/api/OperationalData/subAccountRoleConfig'
import { enumRoleType } from './config'
import RoleFormDialog from './components/RoleFormDialog.vue'
import { DialogPlugin, MessagePlugin, Button as TButton } from 'tdesign-vue-next'
import { cloudProviders } from '@/const/assetConfig'
export default defineComponent({
  name: 'SubAccountRoleConfig'
})
</script>

<script setup lang="tsx">
const subAccountRoleDialog = ref(false)
const isEdit = ref(false)
const roleId = ref(NaN)
const subAccountRoleConfigTable = ref<VxeGridInstance>()
const editForm = ref<EditFormModal>({
  role_code: '',
  role_name: '',
  provider_key: '',
  role_type: '',
  policy: '',
  description: ''
})

const options = reactive<VxeGridProps>({
  height: 'auto',
  border: true,
  resizable: true,
  showHeaderOverflow: true,
  showOverflow: true,
  align: 'center',
  columns: [
    {
      title: $t('角色code'),
      field: 'role_code',
      minWidth: 150
    },
    {
      title: $t('角色名称'),
      field: 'role_name',
      minWidth: 150
    },
    {
      title: $t('云厂商'),
      field: 'provider_key',
      filters: reduce(cloudProviders, (result, value, key) => result.concat({ label: value, value: key }), [] as any),
      minWidth: 120,
      formatter: ({ row }) => get(cloudProviders, row.provider_key, '')
    },
    {
      field: 'role_type',
      title: $t('角色类型'),
      width: 150,
      formatter: ({ row }) => get(find(enumRoleType, { value: row.role_type }), 'label', '')
    },
    {
      field: 'description',
      title: $t('描述'),
      minWidth: 200
    },
    {
      title: $t('操作'),
      fixed: 'right',
      width: 200,
      slots: {
        default: ({ row }) => <>
          <TButton
            variant="text"
            theme='primary'
            content='编辑'
            size='small'
            onClick={() => openEditDialog(row)}
          />
          <TButton
            variant="text"
            theme='danger'
            content='删除'
            size='small'
            style={{ margin: '0 5px' }}
            onClick={() => deleteCloudTask(row.id)}
          />
          <TButton
            variant="text"
            theme='warning'
            content='同步'
            size='small'
            onClick={() => syncTaskImmediately(row.id)}
          />
        </>
      }
    }
  ],
  proxyConfig: {
    ajax: {
      query: async () => {
        try {
          return await getCloudResourceRolesList()
        } catch (error:any) {
          requestErrorMsg(error.message)
        }
      }
    }
  }
})

// 开启创建角色对话框
const openAddDialog = () => {
  isEdit.value = false
  subAccountRoleDialog.value = true
}

// 开启编辑对话框
const openEditDialog = (row: SubAccountRoleConfigModal) => {
  isEdit.value = true
  subAccountRoleDialog.value = true
  roleId.value = row.id
  editForm.value = {
    description: row.description,
    role_code: row.role_code,
    role_name: row.role_name,
    role_type: row.role_type,
    provider_key: row.provider_key,
    policy: row.policy
  }
}

// 删除角色
const deleteCloudTask = (id: number) => {
  const diaIns = DialogPlugin.confirm({
    header: $t('删除子账户角色'),
    body: $t('确认删除此子账户角色？'),
    confirmBtn: $t('确定'),
    cancelBtn: $t('取消'),
    async onConfirm () {
      try {
        await deleteCloudResourceRole(id)
        MessagePlugin.success($t('删除成功'))
        updateTableList()
      } catch (error:any) {
        requestErrorMsg(error.message)
      }
    },
    onClosed: () => diaIns.destroy()
  })
}

// 立即同步
const syncTaskImmediately = async (id: number) => {
  try {
    await CloudResourceRoleSyncPolicy(id)
    MessagePlugin.success($t('立即同步成功'))
    updateTableList()
  } catch (err: any) {
    requestErrorMsg(err.message)
  }
}

const updateTableList = () => {
  subAccountRoleConfigTable.value?.commitProxy('reload')
}

const onCancel = () => {
  isEdit.value = false
  subAccountRoleDialog.value = false
}
</script>

<style lang="scss" scoped>
.role-container {
  margin: 0 0 10px 0;
  height: calc(#{$contentHeight} - 20px);
  display: flex;
  flex-direction: column;

  .role-table{
    flex: 1;
    height: 0;
  }

  .table-wrapper {
    height: calc(100% - 42px);
  }
}
</style>
