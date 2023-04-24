<template>
  <Card class="cloud-container">
    <div class="account-table">
      <vxe-grid
        ref="accountTable"
        v-bind="cloudOptions"
      >
        <template #toolbar_buttons>
          <t-input
            v-model="search"
            clearable
            :placeholder="$t('支持搜索云账号名;云厂商;账号维护人;UIN')"
            style="width:40%"
            @clear="handleSearchAccount"
            @enter="handleSearchAccount"
          >
            <template #append>
              <t-button @click="handleSearchAccount">
                <template #icon><t-icon name="search" /></template>
              </t-button>
            </template>
          </t-input>
        </template>
        <template #loading>
          <t-loading />
        </template>
      </vxe-grid>
    </div>

    <EditAccountDialog
      v-model:visible="editVisible"
      :content="editForm"
      :account-id="currentId"
      @reload="updateAccountList"
    />
  </Card>
</template>

<script lang="tsx">
/* eslint-disable camelcase */
import { Icon } from '@iconify/vue'
import { $t } from '@/common/utils/i18n'
import { filter, find, get, map, reduce, set } from 'lodash'
import { VxeGridInstance, VxeGridProps } from 'vxe-table'
import { requestErrorMsg } from '@/common/utils'
import { enumSourceType, enumBusinessType, enumCostAttribution, enumStationType } from './config'
import { deleteCloudAccount } from '@/api/OperationalData/cloud'
import BusinessTable from './components/BusinessTable.vue'
import EditAccountDialog from './components/EditAccount.vue'
import { DialogInstance, DialogPlugin, MessagePlugin, Button as TButton } from 'tdesign-vue-next'
import { reqCloudAccountList, reqCloudRelationAccount } from '@/api/cloudAccount'
import type { AccountModal } from '@/api/cloudAccount'

export default defineComponent({
  name: 'Cloud'
})
</script>

<script lang="tsx" setup>
const cloudProviders:any = {
  tencent: '腾讯云',
  aws: '亚马逊云',
  gcp: '谷歌云',
  huawei: '华为云',
  azure: '微软云',
  zenlayer: 'Zenlayer'
}
const editVisible = ref(false)
const currentId = ref(NaN)
const accountTable = ref<VxeGridInstance>()
const search = ref('')
const editForm = ref<any>({
  uin: '',
  name: '',
  genre: '',
  source: '',
  description: '',
  credentials: '',
  maintainer: [],
  cost_belong: '',
  is_safety_control: true,
  is_share_bill: false,
  station_type: ''
})

const accountList = ref<any[]>([])
// 定义vxe-grid 配置项目数据
const cloudOptions = reactive<VxeGridProps>({
  height: 'auto',
  border: true,
  resizable: true,
  showHeaderOverflow: true,
  showOverflow: true,
  rowConfig: {
    keyField: 'id',
    isHover: true
  },
  align: 'center',
  columnConfig: { resizable: true },
  columns: [
    {
      type: 'expand',
      width: 50,
      slots: {
        content: ({ row }) => {
          const width = document.getElementsByClassName('cloud-container')[0].clientWidth - 180
          const { childData = [] } = row
          return <div class="business-table-container" style={`width: ${width}px;`}>
            <BusinessTable dataSource={childData} />
          </div>
        }
      }
    },
    {
      title: 'ID',
      field: 'id',
      minWidth: 50
    },
    {
      title: $t('云账号名称'),
      field: 'name',
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
      title: $t('账号维护人'),
      field: 'maintainer',
      minWidth: 150,
      formatter: ({ row }) => row.maintainer.join('、')
    },
    {
      title: $t('UIN'),
      field: 'uin',
      minWidth: 120
    },
    {
      title: $t('账号来源'),
      field: 'source',
      filters: enumSourceType,
      minWidth: 150,
      formatter: ({ row }) => get(find(enumSourceType, { value: row.source }), 'label', '')
    },
    {
      title: $t('账号类型'),
      field: 'genre',
      filters: enumBusinessType,
      minWidth: 150,
      formatter: ({ row }:any) => get(find(enumBusinessType, { value: row.genre }), 'label', '-')
    },
    {
      title: $t('认证秘钥'),
      field: 'credentials',
      minWidth: 150,
      slots: {
        default: ({ row }) => <span class="credentials">
          { row.visible
            ? <>
              <span>{JSON.stringify(row.credentials) }</span> &nbsp;
              <Icon icon="clarity:eye-hide-line" onClick={() => set(row, 'visible', false)}/> &nbsp;
              <Icon icon="ph:copy-simple" onClick={() => { copyCredentials(JSON.stringify(row.credentials)) }}/>
            </>
            : <>
              <span>********</span> &nbsp;
              <Icon icon="carbon:view" onClick={() => set(row, 'visible', true)}/>
            </>
          }
        </span>
      }
    },
    {
      title: $t('成本归属'),
      field: 'cost_belong',
      minWidth: 150,
      formatter: ({ row }) => get(find(enumCostAttribution, { value: row.cost_belong }), 'label', '')
    },
    {
      title: $t('站点类型'),
      field: 'station_type',
      minWidth: 150,
      formatter: ({ row }) => get(find(enumStationType, { value: row.station_type }), 'label', '')
    },
    {
      title: $t('安全管控'),
      field: 'is_safety_control',
      minWidth: 80,
      formatter: ({ row }) => {
        if (row?.is_safety_control === true) return '是'
        if (row?.is_safety_control === false) return '否'
        else return ''
      }
    },
    {
      title: $t('是否分账'),
      field: 'is_share_bill',
      minWidth: 80,
      formatter: ({ row }) => {
        if (row?.is_share_bill === true) return '是'
        if (row?.is_share_bill === false) return '否'
        else return ''
      }
    },
    {
      title: $t('备注'),
      field: 'description',
      minWidth: 150
    },
    {
      title: $t('操作'),
      field: 'operator',
      fixed: 'right',
      minWidth: 150,
      slots: {
        default: ({ row }) => <>
          <TButton theme='primary' variant='text' size='small' content='编辑' style={{ marginRight: '10px' }} onClick={() => editCloudAccount(row)} />
          <TButton theme='danger' variant='text' size='small' content='删除' onClick={() => HandleDeleteAction(row)} />
        </>
      }
    }
  ],
  toolbarConfig: { slots: { buttons: 'toolbar_buttons' } },
  expandConfig: {
    accordion: true,
    lazy: true,
    loadMethod: async ({ row }) => {
      try {
        const data = await reqCloudRelationAccount(row.id)
        row.childData = data
        accountTable.value?.setRowExpand(row, true)
        return row
      } catch (error:any) {
        requestErrorMsg(error.message)
      }
    }
  },
  proxyConfig: {
    seq: true,
    sort: true,
    filter: true,
    ajax: {
      query: async () => {
        try {
          const data = await reqCloudAccountList()
          accountList.value = map(data, (item: any) => ({ ...item, show: false, provider_name: get(cloudProviders, item.provider_key, '') }))
          return data
        } catch (error:any) {
          requestErrorMsg(error.message)
          return Promise.reject(new Error())
        }
      }
    }
  }
})

const editCloudAccount = (row: AccountModal) => {
  editForm.value = {
    uin: row.uin,
    name: row.name,
    genre: row.genre,
    source: row.source,
    maintainer: row.maintainer,
    description: row.description,
    is_safety_control: row.is_safety_control,
    is_share_bill: row.is_share_bill,
    credentials: JSON.stringify(row.credentials, null, 4),
    cost_belong: row.cost_belong,
    station_type: row.station_type
  }
  currentId.value = row.id
  editVisible.value = true
}
const HandleDeleteAction = (row:any) => {
  const dialog:DialogInstance = DialogPlugin({
    header: `ID:${row.id}-${$t('删除')}`,
    body: $t('确认删除吗？'),
    confirmBtn: $t('确认'),
    closeOnOverlayClick: false,
    onConfirm: async () => {
      try {
        await deleteCloudAccount(row.id)
        MessagePlugin.success($t('删除成功'))
        updateAccountList()
      } catch (error:any) {
        requestErrorMsg(error.message)
      }
    },
    onCancel: () => dialog.hide(),
    onClosed: () => dialog.destroy()
  })
}
const copyCredentials = async (text:string) => {
  const clipboard = navigator.clipboard
  await clipboard.writeText(text)
  MessagePlugin.success($t('复制成功'))
}

const handleSearchAccount = () => {
  if (search.value) {
    const reg = new RegExp(search.value.replace(/(^\s*)|(\s*$)/g, ''), 'ig')
    const targetAccountList = filter(accountList.value, item => {
      const businessName = map(item.business, config => `${config.name_zh}${config.name_en}${config.business_id}`)
      if (reg.test(item.uin) ||
        reg.test(item.name) ||
        reg.test(item.provider_name) ||
        reg.test(item.provider_key) ||
        reg.test(item.maintainer) ||
        reg.test(item.uin)
      ) {
        return item
      }
    })
    accountTable.value?.reloadData(targetAccountList)
  } else {
    accountTable.value?.commitProxy('reload')
  }
}

const updateAccountList = () => {
  accountTable.value?.commitProxy('reload')
}
</script>

<style lang="scss" scoped>
.cloud-container{
  display: flex;
  flex-direction: column;
  height: calc(#{$contentHeight} - 20px);

  .account-table{
    flex: 1;
    height: 0;
    :deep(.credentials){
      svg {
        width: 16px;
        cursor: pointer;
        color: #8cc5ff;
      }
    }
  }

  :deep(.vxe-toolbar) {
    padding: 0 0 10px 0;
  }

  :deep(.business-table-container){
    padding: 20px;
  }
  :deep(.fixed-right--wrapper){
    .business-table-container{
      opacity: 0;
    }
  }
}
</style>
