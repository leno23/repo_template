<template>
  <div
    class="form-error-controll-select"
    :class=" errStr && 'is-error'"
  >
    <t-select
      :model-value="modelValue"
      v-bind="$attrs"
      style="width: 100%"
    >
      <template
        v-for="s in Object.keys($slots)"
        #[s]
      >
        <slot :name="s" />
      </template>
    </t-select>
    <div class="test">
      <div style="overflow: hidden;">
        <div
          class="form-err-tips"
          :title="errStr || undefined"
          :class="errStr && 'show-err'"
        >
          {{ errStr }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="tsx" setup>
defineProps<{ errStr?: string; modelValue: any }>()
</script>

<script lang="tsx">
export default defineComponent({ name: 'ErrorControllSelect' })
</script>

<style lang="scss" scoped>
.form-error-controll-select {
  flex: 1;
  position: relative;
  .test {
    position: absolute;
    bottom: -18px;
    width: 100%;
  }
  .form-err-tips {
    color: #D54491;
    font-size: 12px;
    height: 15px;
    margin-top: 1px;
    opacity: 0;
    transition: all 200ms;
    transform: translateY(-17px);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 1;

    &.show-err {
      transform: translateY(0);
      opacity: 1;
    }
  }
}
</style>
