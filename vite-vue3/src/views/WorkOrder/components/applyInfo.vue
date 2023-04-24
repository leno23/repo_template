<template>
  <div :class="{'apply-info':true,borderTopNone:deltopBoder}">
    <div
      v-for="(lineArr,lineIndex) in list"
      :key="lineIndex"
      :class="{line:true,displayNone:!lineArr.length}"
    >
      <div
        v-for="(item,itemIndex) in lineArr"
        :key="itemIndex"
        :class="`item ${['TITLE','EMPTY','COLUMNTABLE'].includes(item?.type+'')?item?.type:''}`"
      >
        <!-- 独占一行，展示一个title -->
        <span
          v-if="item?.type==='TITLE'"
          class="item-title"
        >
          {{ $t(item?.value) }}
        </span>
        <!-- 独占一行，当!props.data时，展示props.emptyText -->
        <span
          v-else-if="item?.type==='EMPTY'"
          class="item-empty"
        >
          {{ $t(item?.value) }}
        </span>
        <!-- 展示COLUMNTABLE -->
        <span
          v-else-if="item?.type==='COLUMNTABLE'"
          class="item-column-table"
        >
          <span
            v-if="item?.label"
            :class="`column-table-label label-${lang}`"
          >
            {{ $t(item?.label) }}
          </span>
          <vxe-table
            border
            auto-resize
            :column-config="{ resizable: true }"
            align="center"
            :data="(item?.value?.list&&item?.value?.list.length)?item?.value?.list:[]"
            show-overflow
            size="small"
            width="100%"
            class="column-table"
            max-height="140"
          >
            <vxe-column
              v-for="(title,key) in item?.value?.fields"
              :key="key"
              :title="$t(`${title}`)"
              :field="key+''"
            >
              <template #default="{ row }">
                <t-loading
                  v-if="['request_add_sub_account', 'request_cloud_account'].includes(props.dataType) && `${key}` === 'role'"
                  :loading="controller.roleLoading"
                >
                  <span>
                    {{ formatColumn(row[key]) }}
                  </span>
                </t-loading>
                <span v-else-if="Array.isArray(row[key])">
                  {{ row[key].join('； ') }}
                </span>
                <span v-else>
                  {{ row[key] }}
                </span>
              </template>
            </vxe-column>
          </vxe-table>
        </span>
        <!-- 正常展示label：value -->
        <div
          v-else
          style="display: flex; width: 100%;"
        >
          <span :class="`item-label label-${lang}`">
            {{ $t(item?.label) }}
          </span>
          <span class="item-value">
            <t-tooltip
              class="item"
              theme="default"
              placement="top"
              :disabled="!isShowTooltip"
            >
              <template #content>
                <div style="max-width: 700px;max-height:180px;overflow:auto;">
                  <icon
                    :title="lang==='en'?'copy':'复制'"
                    name="copy-icon"
                    @click="handleCopy(item?.value||'')"
                  >
                    <DocumentCopy />
                  </icon>
                  {{ item?.value }}
                </div>
              </template>
              <div
                class="value-content"
                @mouseenter="visibilityChange"
              >
                {{ item?.value }}
              </div>
            </t-tooltip>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { $t, lang } from '@/common/utils/i18n'
import { dataInit } from '../utils/formatDetailInfo'
import { requestErrorMsg } from '@/common/utils'
import { MessagePlugin } from 'tdesign-vue-next'
import { reqSubAccountRole, SubAccountRoleModel } from '@/api/workOrder/index'
import _ from 'lodash'
interface IProps {
  data: any,
  dataType?: string
  emptyText?: string
  deltopBoder?: boolean
}
const props = withDefaults(defineProps<IProps>(), {
  emptyText: '暂无数据',
  dataType: ''

})
const list = computed(() => {
  // const arr:{value?:string|number, label?:string, title:string}[][] = []
  if (!props.data) {
    return [[{ type: 'EMPTY', value: props.emptyText }]]
  }
  return dataInit(props.dataType, props.data)
})
// 是否展示tooltip
const isShowTooltip = ref(false)
const visibilityChange = (event: any) => {
  const ev = event.target
  const ev_weight = ev.scrollHeight // 文本的实际宽度   scrollWidth：对象的实际内容的宽度，不包边线宽度，会随对象中内容超过可视区后而变大。
  const content_weight = ev.clientHeight// 文本的可视宽度 clientWidth：对象内容的可视区的宽度，不包滚动条等边线，会随对象显示大小的变化而改变。
  // const content_weight = this.$refs.tlp.$el.parentNode.clientWidth; // 文本容器宽度(父节点)
  if (ev_weight > content_weight) {
    // 实际宽度 > 可视宽度  文字溢出
    isShowTooltip.value = true
  } else {
    // 否则为不溢出
    isShowTooltip.value = false
  }
}
// copy
const handleCopy = (content:any) => {
  try {
    navigator?.clipboard?.writeText && navigator.clipboard.writeText(content)
    MessagePlugin.success({ content: $t('复制成功') })
  } catch (error:any) {
    requestErrorMsg(error)
  }
}
//* --------------------获取子账号角色----------------------
const controller = reactive({
  roleList: [] as SubAccountRoleModel[],
  roleLoading: false
})
const getRoleList = async (data:any) => {
  if (!data.provider_key || !(data.sub_account && data.sub_account.length)) return// 没有参数（provider_key）不能请求，没有子账号不需要请求
  controller.roleLoading = true
  try {
    controller.roleList = await reqSubAccountRole(data.provider_key)
  } catch (err: any) {
    requestErrorMsg(err.message)
  }
  controller.roleLoading = false
}
watch(() => props.data, () => {
  if (['request_add_sub_account', 'request_cloud_account'].includes(props.dataType)) getRoleList(props.data)
}, { immediate: true })
// formatColumn
const formatColumn = (val:any) => {
  if (!val) return ''
  if (controller.roleList && controller.roleList.length) {
    return _.get(_.find(controller.roleList, { role_code: val }), 'role_name', '')
  } else {
    return val
  }
}
</script>

<script lang="ts">
export default defineComponent({
  name: 'ApplyInfo'
})
</script>

<style lang="scss">
.apply-info {
  color: #606266;
  border-top: 1px solid #e8eaec;
  border-left: 1px solid #e8eaec;
  width: 100%;

  .line {
    display: flex;
    border-bottom: 1px solid #e8eaec;

    .item {
      // width: 100%;
      display: flex;
      flex: 1;

      .item-label,
      .item-value {
        overflow: hidden;
        border-right: 1px solid #e8eaec;
        line-height: 24px;
        padding: 0 5px;
        display: flex;
        align-items: center;
      }

      .item-label {
        background-color: #f8f8f9;
        width: 100px;
        font-weight: bold;
        justify-content: center;
        text-align: center;
        word-break: break-word;
      }

      .label-en {
        width: 150px;
      }

      .item-value {
        width: 0;
        flex: 1;
        justify-content: left;

        .value-content {
          // max-height: 72px;
          // overflow: auto;
          display: -webkit-box;
          overflow: hidden;
          text-overflow: ellipsis;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
        }
      }
    }

    .TITLE,
    .EMPTY {
      flex: 1;
      background-color: #f8f8f9;
      text-align: center;
      height: 24px;

      .item-title,
      .item-empty {
        line-height: 24px;
        border-right: 1px solid #e8eaec;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 879px;
        display: inline-block;
      }

      .item-title {
        font-weight: bold;
      }
    }

    .item-column-table {
      width: calc(100% + 1px);
      display: flex;

      .column-table-label {
        width: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #f8f8f9;
        font-weight: bold;
      }

      .label-en {
        width: 150px;
      }

      .column-table {
        flex: 1;
        margin: -1px;
      }

      .vxe-header--column {
        padding: 3px 0;
        font-size: 12px;
      }

      .vxe-body--column {
        height: 24px;
        font-size: 12px;
      }
    }
  }
}

.borderTopNone {
  border-top: none;
}

.displayNone {
  display: none !important;
}

.vxe-table--tooltip-wrapper.is--actived {
  z-index: 9999 !important;
}

.copy-icon:hover {
  color: #0052d9;
}

.copy-icon {
  color: #5daeff;
  font-size: 16px;
  padding-top: 5px;
  margin-right: 5px;
  cursor: pointer;
  float: left;
}
</style>
