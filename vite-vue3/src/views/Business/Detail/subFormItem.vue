<template>
  <t-form-item :label="label">
    <t-select
      v-if="type === 'select'"
      :model-value="modelValue"
      style="flex: 1"
      v-bind="$attrs"
    >
      <t-option
        v-for="item in option"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </t-select>

    <t-input
      v-else-if="type === 'input' || type === 'textarea'"
      :model-value="modelValue"
      v-bind="$attrs"
    />

    <!-- ----------------- app类型业务的域名表单项控制 ------------- -->
    <template v-else-if="type === 'app-domain'">
      <div
        v-for="item, index in domainList"
        :key="index"
        class="app-domain-row "
      >
        <ErrorControllSelect
          v-model="item.type"
          :err-str="item.typeErr"
          size="default"
          style="flex: 1; margin-right: 10px"
          placeholder="请选择域名类型"
          @change="validater(item, 'type')"
        >
          <t-option
            v-for="opt in option"
            :key="opt.value"
            :label="opt.label"
            :value="opt.value"
          />
        </ErrorControllSelect>

        <ErrorControllInput
          v-model="item.value"
          :err-str="item.valueErr"
          size="default"
          placeholder="请填写域名"
          style="flex: 1"
          @blur="validater(item, 'value')"
        />

        <t-icon
          class="del-btn-icon"
          name="delete"
          @click="() => domainList.splice(index, 1)"
        />
      </div>
      <t-button
        size="small"
        style="display:block; width: 100%;height: 32px;"
        theme="default"
        text
        @click="domainList.push({ type: '', value: '', valueErr: '', typeErr: '' })"
      >
        + {{ $t('域名') }}
      </t-button>
    </template>

    <!-- ----------------------------- -->

    <!-- ---------------app类型业务的数据类型表单项控制------------------- -->
    <div v-else-if="type === 'app-data-type'">
      <t-button
        theme="default"
        @click="dataTypeState.visible = true"
      >
        <EditIcon style="color:#0052D9" />
      </t-button>
      <t-dialog
        :visible="dataTypeState.visible"
        header="数据类型"
        width="1100px"
        top="12vh"
        @close="dataTypeState.visible = false"
      >
        <div class="data-type-container">
          <div
            v-for="level in appDataTypeList"
            :key="level.type"
            class="data-type-level-item"
          >
            <div class="level-title">
              {{ level[`name_${lang}`] }}
            </div>

            <template
              v-for="levelInfo, key in level.info"
              :key="key"
            >
              <div class="level-sort-name">
                {{ levelInfo![`title_${lang}`] }}
              </div>
              <t-checkbox-group
                v-model="(dataTypeState.data as any)[level.type][key]"
              >
                <t-tooltip
                  v-for="item in levelInfo!.list"
                  :key="item.value"
                  :content="item[`tooltip_${lang}`]"
                  :show-after="200"
                  :offset="5"
                  :enterable="false"
                >
                  <t-checkbox
                    :value="''+item.value"
                    size="default"
                    :style="`color: ${level.color};`"
                  >
                    {{ item[`name_${lang}`] }}
                  </t-checkbox>
                </t-tooltip>
              </t-checkbox-group>
            </template>
          </div>
        </div>

        <template #footer>
          <t-button
            theme="default"
            variant="outline"
            @click="dataTypeState.visible = false"
          >
            {{ $t('取消') }}
          </t-button>
          <t-button
            theme="primary"
            @click="pushDataType"
          >
            {{ $t('确认') }}
          </t-button>
        </template>
      </t-dialog>
    </div>
  </t-form-item>
</template>

<script lang="ts" setup>
import { appDataTypeList } from './config'
import { lang } from '@/common/utils/i18n'
import { cloneDeep } from 'lodash'

const props = defineProps<{ modelValue: any, label: string, type: string, option?: { label: string, value: any }[] }>()
// * ------------------- app类型 域名控制 --------------------------
const domainList = reactive<{ type: string, value: string, valueErr: string, typeErr: string }[]>([])

onBeforeMount(() => {
  if (props.type !== 'app-domain') return
  domainList.length = 0
  domainList.push(...props.modelValue.map((item: BusinessFullModel['app_domains'][0]) => ({
    type: item.type,
    value: item.value,
    valueErr: '',
    typeErr: ''
  })))
})

const validater = (item: typeof domainList[0], mode: 'type' | 'value' | 'all') => {
  let isPass = true

  const checker = {
    type () {
      if (!item.type) { item.typeErr = '请输入选择域名类型'; isPass = false } else item.typeErr = ''
    },
    value () {
      if (!item.value.trim()) { item.valueErr = '请输入域名'; isPass = false } else item.valueErr = ''
    }
  }

  if (mode === 'all') Object.values(checker).forEach(item => item())
  else checker[mode]()

  return isPass
}

const pushDomainList = () => {
  let isPass = true
  domainList.forEach(item => {
    if (!validater(item, 'all') && isPass) isPass = false
  })
  if (!isPass) return false

  return domainList.map(item => ({
    type: item.type as BusinessDomainTypeEnum,
    value: item.value.trim()
  }))
}

defineExpose({ pushDomainList })
// * --------------------- app类型 数据类型选择 ------------------------------

const dataTypeState = reactive({
  visible: false,
  data: {
    low: { 1: [] },
    middle: { 1: [], 2: [] },
    top: { 1: [], 2: [] },
    high: { 1: [], 2: [] }
  } as Required<BusinessFullModel['app_data_type']>
})

watch(() => dataTypeState.visible, bool => {
  if (props.type !== 'app-data-type' || !bool) return
  dataTypeState.data = cloneDeep(props.modelValue)
})

const emit = defineEmits(['dataType'])

const pushDataType = () => {
  emit('dataType', toRaw(dataTypeState.data))
  dataTypeState.visible = false
}
</script>

<script lang="ts">

export default defineComponent({
  name: 'EditBusinessFormItem'
})
</script>

<style lang="scss" scoped>
.app-domain-row {
  width: 100%;
  display: flex;
  align-items: center;
  padding-bottom: 25px;
  position: relative;
  line-height: 20px;

  &:first-child {
    padding-top: 4px;
  }

  .del-btn-icon {
    position: absolute;
    right: -25px;
    top: 20px;
    transform: translateY(-50%);
    font-size: 18px;
    color: var(--el-gray-color);
    cursor: pointer;
    transition: color 300ms;

    &:hover {
      color: var(--el-color-danger);
    }
  }
}

.data-type-container {
  display: flex;
  align-items: center;
  height: 480px;
  line-height: 2;

  .data-type-level-item {
    flex: 1;
    height: 100%;
    border: 1px solid #ccc;
    border-left: none;
    padding: 10px;
    font-weight: normal;

    &:first-child {
      border-left: 1px solid #a8a6a6;
    }

    .level-title {
      font-size: 15px;
      font-weight: bold;
    }
  }

  :deep(.el-checkbox) {
    display: flex;
    height: 25px;
  }
}
</style>
