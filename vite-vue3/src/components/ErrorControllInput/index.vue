<template>
  <div
    class="form-error-controll-input"
    :class=" errStr && 'is-error'"
  >
    <t-input
      :model-value="modelValue"
      v-bind="$attrs"
    >
      <!-- <template #suffix-icon>
        <span v-else>{{ errStr }}</span>
      </template> -->
      <template
        v-for="s in Object.keys($slots)"
        #[s]
      >
        <slot :name="s" />
      </template>
    </t-input>
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

<script lang="ts" setup>
defineProps<{ errStr?: string; modelValue: any }>()
</script>

<script lang="ts">
export default defineComponent({ name: 'ErrorControllInput' })
</script>

<style lang="scss" scoped>
.form-error-controll-input {
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
