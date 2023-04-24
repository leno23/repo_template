<template>
  <t-dialog
    :visible="visible"
    attach="body"
    width="60%"
    :header="$t('选择处理人')"
    :on-confirm="confirmIgnoreSetting"
    :on-cancel="() => emit('update:visible',false)"
    @close="() => emit('update:visible',false)"
  >
    <t-form
      ref="accountFormRef"
      label-width="120px"
      :data="ignoreForm"
      style="height:200px"
      :rules="ignoreEditRules"
    >
      <t-form-item
        :label="$t('忽略截止日期')"
        name="ignore_destination_date"
      >
        <t-date-picker
          v-model="ignoreForm.ignore_destination_date"
          placeholder="可清除、可输入的日期选择器"
          clearable
          format="YYYY-MM-DD"
          allow-input
        />
      </t-form-item>
      <t-form-item
        :label="$t('忽略原因备注')"
        name="ignore_reason"
      >
        <t-textarea
          v-model="ignoreForm.ignore_reason"
          style="width: 90%"
          :autosize="{
            minRows:4
          }"
          :placeholder="$t('请输入内容')"
        />
      </t-form-item>
    </t-form>
  </t-dialog>
</template>
<script lang='ts'>

import dayjs from 'dayjs'
import { reqUpdateIssueState } from '@/api/RiskIssue'
import { requestErrorMsg } from '@/common/utils'
import { FormInstanceFunctions, FormRule, MessagePlugin } from 'tdesign-vue-next'
import { $t } from '@/common/utils/i18n'
export default defineComponent({ name: 'IgnoreForm' })
</script>

<script setup lang="ts">

interface Props{
  visible: boolean
  rows:number[]
}

const accountFormRef = ref<FormInstanceFunctions>()

const ignoreForm = ref<any>({
  ignore_reason: '',
  ignore_destination_date: dayjs().add(6, 'month').format('YYYY-MM-DD')
})

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  rows: () => []
})

const { visible, rows } = toRefs(props)

interface Emits{
  (e:'update:visible', val:boolean):void
  (e:'confirm'):void
}
const emit = defineEmits<Emits>()

const ignoreEditRules:Record<string, FormRule[]> = {
  ignore_destination_date: [],
  ignore_reason: [{
    required: true,
    message: $t('请输入忽略原因'),
    trigger: 'blur'
  }]
}

const confirmIgnoreSetting = async () => {
  if (!accountFormRef.value) return
  const res = await accountFormRef.value.validate()
  if (res !== true) return

  try {
    const res = await reqUpdateIssueState({
      ids: rows.value,
      action: 'UPDATE_STATUS',
      status: 'Ignored',
      ...ignoreForm.value
    })
    MessagePlugin.success('操作成功')
    emit('confirm')
  } catch (err:any) {
    requestErrorMsg(err.message)
    MessagePlugin.error('操作失败')
  } finally {
    emit('update:visible', false)
  }
}

</script>

<style scoped>

</style>
