<template>
  <t-tag
    :class="{ 'statusBtn': true, [status]: true }"
    :theme="getStatusType(status)"
  >
    {{ $t(formatStatus(status)) }}
  </t-tag>
</template>

<script lang="ts" setup>
interface IProps {
  status: any
}
defineProps<IProps>()
const formatStatus = (status: string) => {
  return { Processing: '处理中', Reject: '驳回', Success: '成功', Fail: '失败', PartialFail: '部分失败', Draft: '草稿', Waiting: '待确认' }[status] || status
}
const getStatusType = (status: string) => {
  switch (status) {
  case 'Success':
    return 'success'
  case 'Reject':
    return 'warning'
  case 'Fail':
    return 'danger'
    // case 'PartialFail':
    //   return ''
    // case 'Draft':
    //   return ''
  case 'Processing':
    return 'primary'
  default:
    return 'primary'
  }
}
</script>

<script lang="ts">
export default defineComponent({
  name: 'OrderStatus'
})
</script>

<style lang="scss" scoped>

</style>
