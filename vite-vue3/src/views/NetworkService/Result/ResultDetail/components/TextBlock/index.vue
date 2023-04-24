<template>
  <div
    v-if="data.length"
    class="text-block"
  >
    <Card
      v-for="{title,value,unit},ind in data"
      :key="ind"
      margin="0"
      class="text-block-item"
    >
      <t-skeleton
        :row-col="[{width:'50%'},{height:'50px'}]"
        :loading="loading"
        animation="flashed"
      >
        <div class="title">{{ title }}</div>
        <div class="value">{{ value }} <span>{{ unit }}</span></div>
      </t-skeleton>
    </Card>
  </div>
</template>

<script lang="ts" setup>

withDefaults(defineProps<{
  data:any[],
  loading:boolean
}>(), {
  data: () => [],
  loading: false
})
</script>

<script lang="ts">
export default defineComponent({ name: 'TextCard' })

</script>
<style lang='scss' scoped>
.text-block{
  padding:0 10px;
  display: grid;
  grid-template-columns: repeat(5,auto);
  grid-gap: 10px;
  &-item{
    text-align:center;
    .value{
      color:#56a64b;
      white-space: nowrap;
      font-size:80px;
      font-weight: 500;
      span{
        font-size:60px;
      }
    }
  }
}
</style>
