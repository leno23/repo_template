<template>
  <Card class="async-export-container">
    <div style="margin: 0 0 10px auto">
      <t-button
        theme="default"
        style="margin-right: 10px;"
        :loading="status.listLoading"
        @click="getList"
      >
        <template #icon><t-icon name="refresh" /></template>
      </t-button>

      <t-button
        content="新建导出"
        @click="status.visible = true"
      >
        <template #icon><t-icon name="download" /></template>
      </t-button>
    </div>

    <t-loading
      :loading="status.listLoading"
      style="flex: 1; height: 0;"
    >
      <vxe-table
        height="auto"
        :data="status.list"
        show-overflow="tooltip"
        align="center"
      >
        <vxe-column
          field="id"
          width="60"
          title="id"
        />

        <vxe-column
          field="created_by"
          title="创建人"
        />

        <vxe-column
          field="created_at"
          title="创建时间"
          :formatter="({ cellValue }) => formatDate(cellValue)"
        />

        <vxe-column title="资产类型">
          <template #default="{row}">
            <t-tag
              v-for="val in row.assets"
              :key="val"
              style="margin-right: 5px;"
              variant="light"
              theme="primary"
              :content="val"
            />
          </template>
        </vxe-column>

        <vxe-column title="云账号id">
          <template #default="{row}">
            <t-tag
              v-for="id in row.account_ids"
              :key="id"
              style="margin-right: 5px;"
              variant="light"
              theme="primary"
              :content="id + ''"
            />
          </template>
        </vxe-column>

        <vxe-column
          field="keywords"
          title="关键词"
        >
          <template #default="{row}">
            <t-tag
              v-for="str,index in row.keywords"
              :key="index"
              style="margin-right: 5px;"
              variant="light"
              theme="primary"
              :content="str"
            />
          </template>
        </vxe-column>

        <vxe-column
          title="导出状态"
          width="100"
        >
          <template #default="{row}">
            <t-popup
              :disabled="row.status !== 'fail'"
              :content="row.description"
              :show-arrow="false"
            >
              <t-tag
                style="margin-right: 5px;"
                variant="light"
                :theme="getStatusTheme(row.status)"
                :content="row.status"
              />
            </t-popup>
          </template>
        </vxe-column>

        <vxe-column
          width="200"
          title="操作"
        >
          <template #default="{row}">
            <t-popconfirm
              v-if="row.status === 'success'"
              content="如下载地址已过期，请点击本项的刷新按钮获取最新下载地址"
              :cancel-btn="{ theme: 'primary', content: '复制下载地址', onClick: () => getDownLoadPath(row, 'copy') }"
              :confirm-btn="{ theme: 'primary', content: '直接下载', onClick: () => getDownLoadPath(row, 'download') }"
            >
              <t-button
                theme="primary"
                variant="text"
                :loading="row.refreshLoading"
              >
                <template #icon><t-icon name="download" /></template>
              </t-button>
            </t-popconfirm>

            <t-popup
              v-else-if="row.status === 'fail'"
              :content="row.description"
              :show-arrow="false"
            >
              <t-icon
                name="help-circle"
                style="cursor: help; color: var(--td-error-color);"
                size="17px"
              />
            </t-popup>
          </template>
        </vxe-column>
      </vxe-table>
    </t-loading>

    <t-dialog
      v-model:visible="status.visible"
      :close-on-esc-keydown="false"
      :close-on-overlay-click="false"
      width="700"
      header="新建异步导出"
      :confirm-btn="{ loading: status.confirmLoading, onClick: confirm }"
    >
      <t-form style="padding-right: 30px; max-height: 400px;">
        <t-form-item label="文件名">
          <t-input v-model="form.file_name" />
        </t-form-item>

        <t-form-item label="资产类型">
          <t-cascader
            v-model="form.assets"
            :options="assetOptions"
            :min-collapsed-num="4"
            multiple
            clearable
            :show-all-levels="false"
          />
        </t-form-item>

        <t-form-item label="云账号">
          <t-select
            v-model="form.account_ids"
            :options="accountOptions"
            :min-collapsed-num="1"
            :loading="status.accountLoading"
            multiple
            filterable
            clearable
            :scroll="{ type: 'virtual' }"
            :tag-props="{ maxWidth: 350 }"
          />
        </t-form-item>

        <t-form-item label="关键词">
          <t-tag-input
            v-model="form.keywords"
            :options="accountOptions"
            :loading="status.accountLoading"
            clearable
            :tag-props="{ maxWidth: 200 }"
          />
        </t-form-item>
      </t-form>
    </t-dialog>
  </Card>
</template>

<script lang="ts" setup>
import { AccountModal, reqCloudAllAccount } from '@/api/cloudAccount'
import { reqAsyncExportList, reqCreateAsyncExport, reqFlushDownloadUrl } from '@/api/AsyncExport'
import type { AsyncExportItem, AsyncExportPayload } from '@/api/AsyncExport'
import { requestErrorMsg, copyText, getDownLoad } from '@/common/utils'
import { assetCategoryList } from '@/const/assetConfig'
import type { TdCascaderProps, SelectOption } from 'tdesign-vue-next'
import { formatDate } from '@/common/plugins/Tool'

const status = reactive({
  visible: false,

  listLoading: false,
  list: [] as AsyncExportItem[],

  accountLoading: false,
  accounts: [] as AccountModal[],

  confirmLoading: false
})

const getList = async () => {
  status.listLoading = true
  try {
    status.list = (await reqAsyncExportList()).results
  } catch (err: any) {
    requestErrorMsg(err.message)
  }
  status.listLoading = false
}

onMounted(getList)

const getStatusTheme = (status: AsyncExportItem['status']) => {
  if (status === 'pending') return 'default'
  if (status === 'fail') return 'danger'
  if (status === 'success') return 'primary'
}

// * --------------- 资产类型级联选项 -------------------
const assetOptions: TdCascaderProps['options'] = assetCategoryList.map(item => ({
  label: item.name,
  value: item.value,
  children: item.assets.map(asset => ({ label: asset.label, value: asset.value }))
}))

// * --------------- 云账号选项 -------------------
watch(() => status.visible, async (bool) => {
  if (!bool || status.accountLoading || status.accounts.length) return
  status.accountLoading = true
  try {
    status.accounts = await reqCloudAllAccount()
  } catch (err:any) {
    requestErrorMsg(err.message)
  }
  status.accountLoading = false
})
const accountOptions = computed(() => [{ label: '全选', checkAll: true } as SelectOption].concat(status.accounts.map(item => ({ label: item.name, value: item.id }))))

const form = ref<AsyncExportPayload>({
  file_name: '',
  assets: [],
  account_ids: [],
  keywords: []
})

const confirm = async () => {
  status.confirmLoading = true
  try {
    await reqCreateAsyncExport(form.value)
    getList()
    form.value = {
      file_name: '',
      assets: [],
      account_ids: [],
      keywords: []
    }
    status.visible = false
  } catch (err: any) {
    requestErrorMsg(err.message)
  }
  status.confirmLoading = false
}

// * --------- 操作 ------------
const getDownLoadPath = async (row: AsyncExportItem & { refreshLoading?: boolean }, mode: 'copy' | 'download') => {
  row.refreshLoading = true
  try {
    let url = await reqFlushDownloadUrl(row.id)
    url += '&response-content-disposition=attachment' // 指定cos文件为下载而不是预览
    if (mode === 'copy') copyText(url)
    else if (mode === 'download') getDownLoad(url)
  } catch (err: any) {
    requestErrorMsg(err.message)
  }
  delete row.refreshLoading
}
</script>

<script lang="ts">
export default defineComponent({ name: 'AsyncExport' })
</script>

<style lang="scss" scoped>
.async-export-container {
  height: calc(#{$contentHeight} - 20px);

  display: flex;
  flex-direction: column;
}
</style>
