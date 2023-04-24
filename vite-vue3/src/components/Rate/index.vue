<template>
  <div class="rate">
    <t-popup :content="value+'%'">
      <div
        v-for="(_, ind) in 3"
        :key="ind"
        :class="{
          'rate-item': true,
          active: ind < getRiskType(value),
        }"
      />
    </t-popup>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  name: 'Rate'
})
</script>
<script lang="ts" setup>
withDefaults(
  defineProps<{
    value: number;
  }>(),
  {
    value: 0
  }
)

const getRiskType = (per:number):0|1|2|3 => {
  if (per === 0) return 0
  else if (per <= 33) return 1
  else if (per <= 66) return 2
  else return 3
}
</script>

<style lang="scss" scoped>
.rate {
  .rate-item {
    display: inline-block;
    width: 15px;
    height: 5px;
    margin-right: 3px;
    background: #ccc;
    &.active {
      background: #d6372c;
    }
  }
}
</style>
