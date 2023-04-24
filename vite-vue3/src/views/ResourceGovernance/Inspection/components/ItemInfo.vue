<template>
  <div
    class="item-info"
    @click="toDetail"
  >
    <h3 class="name">
      {{ data?.name }}
      <t-button
        class="status"
        :theme="data?.enabled===false? 'danger' : 'success' "
        size="small"
      >
        {{ data?.enabled=== false ? '已禁用' : '已启用' }}
      </t-button>
    </h3>
    <p class="detail">{{ data?.detail }}</p>
    <p class="label">触发条件</p>
    <p class="condition">{{ data?.condition }}</p>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
const router = useRouter()
interface IProps {
  data: any
}
const props = defineProps<IProps>()
const toDetail = () => {
  if (props.data && props.data.id) {
    router.push({ name: 'RiskIssues', query: { inspection_id: props.data.id } })
  }
}
</script>

<script lang="ts">
export default defineComponent({
  name: 'ItemInfo'
})
</script>

<style lang="scss">
.item-info{
  background-color: #fff;
  cursor: pointer;
  .name{
    margin: 10px 0;
    line-height: 24px;
    .status{
      float: right;
    }
  }
  .detail{
    font-size: 12px;
    color: gray;
    height: 50px;
  }
  .label{
    margin-bottom: 10px;
  }
  .condition{
    margin-bottom: 10px;
  }
}
</style>
