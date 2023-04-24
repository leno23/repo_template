<template>
  <div
    class="--card-container"
    :style="`border-radius: ${radius}; margin: ${margin}; padding: ${padding};`"
    :class="`${shadow && '--shadow'} ${border && '--border'}`"
  >
    <slot />
  </div>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    /**
     * css的border-radius值字符串，默认为'3px' 和tdesign一致
     */
    radius?: string;
    /**
     * 默认为true
     */
    shadow?: boolean;
    /**
     * 默认为false
     */
    border?: boolean;
    /**
     * css的margin值字符串，默认为'10px'
     */
    margin?: string;
    /**
     * css的padding值字符串，默认为'10px'
     */
    padding?: string;
  }>(),
  {
    radius: '3px',
    shadow: true,
    border: false,
    margin: '10px',
    padding: '10px'
  }
)
</script>

<script lang="ts">
export default defineComponent({
  name: 'Card'
})
</script>

<style lang="scss" scoped>
.--card-container {
  // padding: 10px;
  // box-shadow: 0 2px 4px 0 rgba(0,0,0,.12),0 0 6px 0 rgba(0,0,0,.04);
  transition-property: background-color, color;
  transition-duration: 300ms;
  background-color: var(--td-bg-color-container);

  &.--shadow {
    box-shadow: 0 2px 8px 0 #00000020;
  }

  &.--border {
    border: 1px solid var(--td-border-level-1-color);
  }
}
</style>
