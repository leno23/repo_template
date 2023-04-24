<template>
  <t-dialog
    header="申请关联云账号"
    :close-on-esc-keydown="false"
    :close-on-overlay-click="false"
    :visible="visible"
    destroy-on-close
    top="15vh"
    width="900px"
    :confirm-btn="{ loading: status.confirmLoading, onClick: confirm }"
    :z-index="800"
    @close="close"
  >
    <t-form style="padding: 0 30px 0 0">
      <t-form-item label="选择云账号">
        <div style="width: 100%;">
          <t-input
            v-model="status.keyword"
            style="margin-bottom: 24px;"
            @enter="filter"
          >
            <template #suffixIcon>
              <t-icon
                name="search"
                style="cursor: pointer;"
                @click="filter"
              />
            </template>
          </t-input>

          <t-loading :loading=" status.loading || account.loading">
            <vxe-table
              height="300px"
              :data="filterList"
              size="small"
              show-overflow="tooltip"
              border
              @checkbox-change="selectAccount"
              @checkbox-all="selectAll"
            >
              <vxe-column
                type="checkbox"
                width="40"
              />
              <vxe-column
                field="id"
                title="ID"
                width="50"
              />
              <vxe-column
                field="name"
                :title="$t('云账号名称')"
                width="180"
                sortable
              />
              <vxe-column
                field="provider_key"
                :show-overflow="true"
                width="140"
                :title="$t('云厂商')"
                sortable
              >
                <template #default="{ row }">
                  {{ cloudProviderMap[row.provider_key as ProviderTypeEnum][lang] }}
                </template>
              </vxe-column>
              <vxe-column
                field="uin"
                title="UIN"
                width="120"
              />
              <vxe-column
                field="description"
                :title="$t('描述')"
              />
            </vxe-table>
          </t-loading>
        </div>
      </t-form-item>

      <t-form-item label="描述">
        <t-textarea v-model="form.desc" />
      </t-form-item>
    </t-form>
  </t-dialog>
</template>

<script lang="ts" setup>
import { lang } from '@/common/utils/i18n'
import { cloudProviderMap } from '@/const/cloudAccount'
import { useBusinessStore } from '@/store/modules/business'
import { useCloudAccountStore } from '@/store/modules/cloudAccount'
import { useRouter } from 'vue-router'
import type { AccountModal } from '@/api/cloudAccount'
import { reqCloudAllAccount } from '@/api/cloudAccount'
import { DialogPlugin, MessagePlugin } from 'tdesign-vue-next'
import { requestErrorMsg } from '@/common/utils'
import { reqCreateWorkOrder } from '@/api/workOrder'
interface Props {
  visible: boolean
}
const props = defineProps<Props>()
const emit = defineEmits(['update:visible'])

const router = useRouter()
const BusinessStore = useBusinessStore()
const CloudAccountStore = useCloudAccountStore()
const account = computed(() => CloudAccountStore.businessAccounts(BusinessStore.currentBusinessId))
const status = reactive({
  keyword: '',
  loading: false,
  confirmLoading: false
})
const dataSource: any = ref([])
const getAccountList = async () => {
  dataSource.value = []
  filterList.value = []

  status.loading = true
  try {
    const list = await reqCloudAllAccount()
    // 已绑定业务ids
    const targetList = list.filter(item => !account.value.list.find(({ id }) => id === item.id))
    dataSource.value = targetList
    filterList.value = targetList
  } catch (error: any) {
    requestErrorMsg(error.message)
  }
  status.loading = false
}
watch(() => props.visible, () => {
  props.visible && getAccountList()
})
const filterList = ref<AccountModal[]>([])

const filter = () => {
  if (!status.keyword.trim()) {
    filterList.value = dataSource.value
  }
  const reg = new RegExp(status.keyword.trim().toLowerCase().replace(/(^\s*)|(\s*$)/g, ''), 'ig')
  filterList.value = filterList.value.filter(item =>
    reg.test(item.uin) || reg.test(item.name) || reg.test(item.provider_key) || reg.test(cloudProviderMap[item.provider_key][lang])
  )
}

const selectAccount = ({ row, checked }: { row: AccountModal, checked: boolean }) => {
  if (checked) form.accountId.push(row.id)
  else form.accountId = form.accountId.filter((id) => id !== row.id)
}

const selectAll = ({ checked }: { checked: boolean }) => {
  form.accountId = checked ? filterList.value.map(({ id }) => id) : []
}

const form = reactive({
  accountId: [] as number[],
  desc: ''
})

const confirm = async () => {
  if (!form.accountId.length) {
    MessagePlugin.error('请选择要关联的云账号')
    return
  }

  status.confirmLoading = true
  try {
    const { ticket_id } = await reqCreateWorkOrder({
      ticket_template_type: 'request_binding_cloud_account',
      business_id: useBusinessStore().currentBusinessId,
      notes: '导入云账号',
      watchers: [],
      params: {
        business_id: BusinessStore.currentBusinessId,
        business_name: BusinessStore.businessMap[BusinessStore.currentBusinessId].name_zh,
        name_list: form.accountId.map(id => dataSource.value.find((item:any) => item.id === id)?.name),
        description: form.desc.trim(),
        ids: form.accountId
      }
    })

    close()
    const diaIns = DialogPlugin.confirm({
      header: '已成功提交工单， ID: ' + ticket_id,
      body: '是否跳转至查看工单',
      closeOnEscKeydown: false,
      closeOnOverlayClick: false,
      onConfirm: () => {
        router.push({ name: 'MyOrder', params: { ticket_id } })
        diaIns.hide()
      },
      onClosed: () => diaIns.destroy()
    })
  } catch (err: any) {
    requestErrorMsg(err.message)
  }
  status.confirmLoading = false
}

const close = () => {
  form.accountId = []
  form.desc = ''
  status.keyword = ''
  emit('update:visible', false)
}

</script>

<script lang="ts">
export default defineComponent({ name: 'RelationAccount' })
</script>

<style lang="scss" scoped>

</style>
