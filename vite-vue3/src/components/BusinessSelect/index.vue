<template>
  <t-select
    style="width: 260px;"
    :min-collapsed-num="1"
    :multiple="multiple"
    :reserve-keyword="false"
    filterable
    clearable
    :tag-props="{maxWidth:150}"
    v-bind="$attrs"
    :options="filterBusinessList"
    @change="selectChange"
  />
</template>

<script lang='ts'>
/* eslint-disable camelcase */
import { useBusinessStore } from '@/store/modules/business'
import { useUserStore } from '@/store/modules/user'
import { useSettingStore } from '@/store/modules/setting'

export default defineComponent({
  name: 'BusinessSelect'
})
</script>

<script setup lang='ts'>
interface Props {
  multiple?: boolean
  optionList?:any[]|null
}
const props = withDefaults(defineProps<Props>(), {
  multiple: false,
  optionList: null
})

const SettingStore = useSettingStore()
const UserStore = useUserStore()
watch(() => UserStore.profile.language, (val) => {
  if (!val) return
  SettingStore.setLang(val)
})
const filterBusinessList = computed(() => {
  let list = props.optionList || useBusinessStore().business
  list = list.map((item:any) => {
    return {
      value: item.id,
      label: `${item.id}-${item.name_zh}(${item.name_en})`
    }
  })
  props.multiple && list.unshift({ label: '全选', checkAll: true })
  return list
})
interface Emits {
  (e:'change', val:any):void
}
const emits = defineEmits<Emits>()
const selectChange = (val:any) => {
  emits('change', val)
}
</script>
