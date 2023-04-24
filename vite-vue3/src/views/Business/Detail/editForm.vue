<template>
  <div>
    <t-button
      theme="primary"
      style="margin: 0 0 0 auto"
      content="业务编辑"
      @click="state.visible = true"
    />

    <t-dialog
      :visible="state.visible"
      header="编辑业务信息"
      width="800px"
      top="7vh"
      :close-on-esc-keydown="false"
      :close-on-overlay-click="false"
      custom-class="edit-business-form-dialog"
      @close="state.visible = false"
    >
      <div class="edit-business-form-warpper">
        <t-form
          :label-width="100"
          size="large"
        >
          <t-form-item :label="$t('业务类型')">
            <t-select
              v-model="form.genre"
              style="flex: 1"
            >
              <t-option
                v-for="item in enumBusinessType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </t-select>
          </t-form-item>

          <SubFormItem
            v-for="item in formField[form.genre]"
            :key="item.field"
            :ref="(e: any) => subFormItemRef[item.field] = e"
            v-model="form[item.field as keyof typeof form]"
            :option="item.options && item.options(form as BusinessFullModel)"
            :type="item.type"
            :label="item.name"
            :disabled="item.disabled && item.disabled(form as BusinessFullModel)"
            @data-type="form.app_data_type = $event"
          />
        </t-form>
      </div>

      <template #footer>
        <t-button
          theme="default"
          variant="outline"
          @click="state.visible = false"
        >
          {{ $t('取消') }}
        </t-button>
        <t-button
          theme="primary"
          :loading="state.confirmLoading"
          @click="confirm"
        >
          {{ $t('确认') }}
        </t-button>
      </template>
    </t-dialog>
  </div>
</template>

<script lang="ts" setup>
// import { lang } from '@/common/utils/i18n'
import { cloneDeep } from 'lodash'
import { formField } from './config'
import { enumBusinessType } from '@/const/business'
import SubFormItem from './subFormItem.vue'
import { objectKeys, requestErrorMsg } from '@/common/utils'
import { reqUpdateBussinessInfo } from '@/api/businessConfig'
import { useBusinessStore } from '@/store/modules/business'
import { useRoute } from 'vue-router'
const BusinessStore = useBusinessStore()
const route = useRoute()
let business_id: number
if (route.query.business_id) {
  business_id = parseInt(`${route.query.business_id}`)
} else {
  business_id = BusinessStore.currentBusinessId
}
const props = defineProps<{ payload: BusinessFullModel }>()

const emit = defineEmits(['refresh'])

const state = reactive({
  visible: false,
  confirmLoading: false
})

const form = reactive<(
  Pick<BusinessFullModel, 'description' | 'application' | 'developer' | 'game_id' | 'game_type' | 'genre' | 'level' | 'release_mode' | 'stage' | 'status' | 'app_data_type' | 'app_type' | 'app_domains' | 'app_sensitive_level' | 'component_type' | 'obs_id' | 'product_name'>
)>({
    genre: 'game',
    description: '',
    developer: '',
    component_type: null, // 组件类型字段
    game_id: null,
    game_type: '', // 游戏类型字段
    application: '',
    level: 'Regular',
    release_mode: 'SELF',
    stage: null,
    status: 'down',

    // app组件类型字段
    app_type: 'self',
    app_domains: [],
    app_data_type: {},
    app_sensitive_level: '',

    obs_id: null,
    product_name: ''
  })

const initStatus = () => {
  const source = cloneDeep(props.payload)
  objectKeys(form).forEach(k => { (form as any)[k] = source[k] })

  // 业务可能add_data_type是一个空对象，需要给个默认值来控制
  if (!objectKeys(form.app_data_type).length) {
    form.app_data_type = {
      low: { 1: [] },
      middle: { 1: [], 2: [] },
      top: { 1: [], 2: [] },
      high: { 1: [], 2: [] }
    }
  }
}

// * ------------- 每次打开都回填一次数据 --------------------
watch(() => state.visible, bool => bool && initStatus())

// * ----------------- 字段控制 -----------------------
watchEffect(() => {
  if (form.status) form.stage = null
  if (form.release_mode !== 'SELF') form.level = null
})

// app业务类型 根据dataType所选值计算等级
watch(() => form.app_data_type, () => {
  if (form.genre !== 'app') return

  let SensitiveLevel: BusinessFullModel['app_sensitive_level'] = ''

  // 按从高到底顺序排
  const SensitiveLevelValues: BusinessSensitiveLevelEnum[] = ['top', 'high', 'middle', 'low']

  for (let i = 0; i < SensitiveLevelValues.length; i++) {
    const lv = SensitiveLevelValues[i]
    const levelInfo = form.app_data_type[lv]!

    // 所有这个等级所选的value
    const levelChekcer: number[] = []

    Object.values(levelInfo).forEach(item => levelChekcer.push(...item))

    if (levelChekcer.length) {
      SensitiveLevel = lv
      break
    }
  }
  form.app_sensitive_level = SensitiveLevel
})

// const SubAccountRef = ref<InstanceType<typeof SubAccountController>>()
const subFormItemRef = ref<{ [key: string]: InstanceType<typeof SubFormItem> }>({})

const confirm = async () => {
  // 只拿当前业务类型要的字段
  const keys = formField[form.genre].map(item => item.field)
  keys.unshift('genre')

  if (form.genre === 'app') {
    // 拿app类型下的域名列表
    const domainList = subFormItemRef.value!.app_domains.pushDomainList()
    if (!domainList) return
    form.app_domains = domainList
  }

  const payload: Record<string, any> = {}
  keys.forEach(k => {
    let val = form[k as keyof typeof form]

    // obs_id和game_id不能传空串
    if (typeof val === 'string') val = val.trim()
    payload[k] = (k === 'game_id' || k === 'obs_id') && !val
      ? null
      : val
  })

  payload.ct = props.payload.ct

  state.confirmLoading = true

  try {
    await reqUpdateBussinessInfo(business_id, payload)
    state.visible = false
    emit('refresh')
  } catch (err: any) {
    requestErrorMsg(err.message)
  }
  state.confirmLoading = false
}
</script>

<script lang="ts">
export default defineComponent({
  name: 'EditBusinessForm'
})
</script>

<style lang="scss" scoped>
.edit-business-form-warpper {
  padding: 10px 140px 10px 10px;
  max-height: 65vh;
  overflow: auto;
  // width: 80%;
  :deep(.t-form__controls-content){
    display: block;
  }
}
.edit-business-form-dialog .el-dialog__body {
  padding-top: 0;
  padding-bottom: 0;
}
</style>
