<template>
  <Card class="cloud-account-scontainer">
    <div class="header-action-warpper">
      <t-button
        content="申请创建云账号"
        @click="createAccountVisible = true"
      />

      <t-button
        style="margin: 0 10px;"
        content="导入云账号"
        @click="importAccountVisible = true"
      />

      <t-button
        content="申请关联云账号"
        @click="relationAccountVisible = true"
      />
    </div>

    <t-loading
      :loading="cloudAccounts.loading"
      style="flex: 1; height: 0;"
    >
      <div class="table-warpper">
        <vxe-table
          height="auto"
          resizable
          :data="cloudAccounts.list"
          border
          show-overflow="tooltip"
          align="center"
          :row-config="{ keyField: 'id' }"
          :expand-config="{ lazy: true, accordion: true, loadMethod: getRelationAccount }"
        >
          <vxe-column
            type="expand"
            width="40"
          >
            <template #content><SubTable /></template>
          </vxe-column>

          <vxe-column
            min-width="50"
            field="id"
            title="ID"
          />

          <vxe-column
            min-width="150"
            field="name"
            title="云账号名称"
          />

          <vxe-column
            min-width="120"
            title="云厂商"
          >
            <template #default="{ row }">{{ cloudProviderMap[row.provider_key as ProviderTypeEnum][lang] }}</template>
          </vxe-column>

          <vxe-column
            min-width="150"
            title="账号维护人"
          >
            <template #default="{ row }">{{ row.maintainer.join(', ') }}</template>
          </vxe-column>

          <vxe-column
            title="UIN"
            min-width="150"
            field="uin"
          />

          <vxe-column
            title="账号来源"
            min-width="150"
          >
            <template #default="{ row }">{{ enumSourceType.find(({value}) => value === row.source)?.label }}</template>
          </vxe-column>

          <vxe-column
            title="账号类型"
            min-width="150"
          >
            <template #default="{ row }">{{ enumBusinessType.find(({value}) => value === row.genre)?.label }}</template>
          </vxe-column>

          <vxe-column
            title="备注"
            min-width="150"
            field="description"
          />

          <vxe-column
            title="操作"
            min-width="60"
          >
            <template #default="{ row }">
              <t-button
                content="删除"
                theme="danger"
                size="small"
                variant="text"
                :loading="row.delLoading"
                @click="deleteAccount(row)"
              />
            </template>
          </vxe-column>
        </vxe-table>
      </div>
    </t-loading>

    <CloudAccountCreater v-model:visible="createAccountVisible" />
    <ImportAccount v-model:visible="importAccountVisible" />
    <RelationAccount v-model:visible="relationAccountVisible" />
  </Card>
</template>

<script lang="tsx" setup>
import type { AccountModal } from '@/api/cloudAccount'
import CloudAccountCreater from './components/CloudAccountCreater.vue'
import ImportAccount from './components/ImportAccount/index.vue'
import RelationAccount from './components/RelationAccount.vue'
import { reqCloudRelationAccount, releaseCloudAccount } from '@/api/cloudAccount'
import { requestErrorMsg } from '@/common/utils'
import { $t, lang } from '@/common/utils/i18n'
import { enumBusinessType, enumGameType, enumLevel, enumReleaseMode, enumStage, enumStatus } from '@/const/business'
import { cloudProviderMap, enumSourceType } from '@/const/cloudAccount'
import { useBusinessStore } from '@/store/modules/business'
import { useCloudAccountStore } from '@/store/modules/cloudAccount'
import { DialogPlugin } from 'tdesign-vue-next'
import { Grid as VxeGrid } from 'vxe-table'
import type { VxeGridProps } from 'vxe-table'

const BusinessStore = useBusinessStore()
const CloudAccountStore = useCloudAccountStore()

const cloudAccounts = computed(() => CloudAccountStore.businessAccounts(BusinessStore.currentBusinessId))

// * -------------- 展开行 ---------------------
const relationBusiness = ref<BusinessFullModel[]>([])
// 展开行查询数据
const getRelationAccount = async ({ row }: { row: AccountModal }) => {
  try {
    relationBusiness.value = await reqCloudRelationAccount(row.id)
  } catch (err: any) {
    requestErrorMsg(err.massage)
  }
}

const SubTable = () => {
  const options:VxeGridProps = {
    size: 'mini',
    border: true,
    align: 'center',
    data: relationBusiness.value,
    columns: [
      {
        title: 'ID',
        field: 'id',
        minWidth: 30
      },
      {
        title: $t('业务类型'),
        field: 'genre',
        showOverflow: true,
        minWidth: 30,
        formatter: ({ row }) => enumBusinessType.find(({ value }) => value === row.genre)?.label || ''
      },
      {
        title: $t('中文名'),
        showOverflow: true,
        field: 'name_zh',
        minWidth: 30
      },
      {
        title: $t('英文名'),
        showOverflow: true,
        field: 'name_en',
        minWidth: 30
      },
      {
        title: $t('状态'),
        showOverflow: true,
        field: 'status',
        minWidth: 40,
        formatter: ({ row }) => enumStatus.find(({ value }) => value === row.status)?.label || ''
      },
      {
        title: $t('游戏ID'),
        showOverflow: true,
        field: 'game_id',
        minWidth: 40
      },
      {
        title: $t('游戏类型'),
        showOverflow: true,
        field: 'game_type',
        minWidth: 40,
        formatter: ({ row }) => enumGameType.find(({ value }) => value === row.game_type)?.label || ''
      },
      {
        title: $t('发行商'),
        showOverflow: true,
        field: 'publisher',
        minWidth: 40
      },
      {
        title: $t('开发商'),
        showOverflow: true,
        field: 'developer',
        minWidth: 40
      },
      {
        title: $t('运营阶段'),
        showOverflow: true,
        field: 'stage',
        minWidth: 40,
        formatter: ({ row }) => enumStage.find(({ value }) => value === row.stage)?.label || ''
      },
      {
        title: $t('发行模式'),
        showOverflow: true,
        field: 'release_mode',
        minWidth: 40,
        formatter: ({ row }) => enumReleaseMode.find(({ value }) => value === row.release_mode)?.label || ''
      },
      {
        title: $t('等级'),
        showOverflow: true,
        field: 'level',
        minWidth: 40,
        formatter: ({ row }) => enumLevel.find(({ value }) => value === row.level)?.label || ''
      }
    ]
  }
  return (
    <>
      <div style='width: 95%; padding: 20px;'>
        <h4>关联业务</h4><br />
        <VxeGrid {...options} />
      </div>
    </>
  )
}

// * ------------------ 删除 -----------------------

const deleteAccount = (item: AccountModal & { delLoading?: boolean }) => {
  const diaIns = DialogPlugin.confirm({
    header: `云账号ID: ${item.id}`,
    body: '确认删除吗? ',
    closeOnEscKeydown: false,
    closeOnOverlayClick: false,
    onClosed: () => diaIns.destroy(),
    confirmBtn: {
      theme: 'danger',
      onClick: async () => {
        item.delLoading = true
        try {
          diaIns.hide()
          await releaseCloudAccount(item.id, BusinessStore.currentBusinessId)
          CloudAccountStore.immediate()
        } catch (err: any) {
          requestErrorMsg(err.message)
        }
        delete item.delLoading
      }
    }
  })
}

// * ---------------- 创建 -----------------
const createAccountVisible = ref(false)
const importAccountVisible = ref(false)
const relationAccountVisible = ref(false)
</script>

<script lang="tsx">
export default defineComponent({ name: 'CloudAccounts' })
</script>

<style lang="scss" scoped>
.cloud-account-scontainer {
  height: calc(#{$contentHeight} - 20px);
  display: flex;
  flex-direction: column;

  .header-action-warpper{
    text-align: right;
    margin-bottom: 10px;
  }

  .table-warpper {
    height: 100%;
  }
}
</style>
