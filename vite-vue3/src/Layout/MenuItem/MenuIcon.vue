<template>
  <Icon
    v-if="icon!.includes(':')"
    :icon="icon"
    v-bind="iconProps"
    class="menu-iconfiy"
  />
  <TIcon
    v-else
    :name="icon"
    v-bind="iconProps"
  />
</template>

<script lang="ts" setup>
defineProps<{
  icon: string;
  iconProps?: { [key: string]: any };
}>()
</script>

<script lang="ts">
export default defineComponent({
  name: 'LayoutMenuIcon'
})
</script>

<style lang="scss" scoped>
.menu-iconfiy {
  margin-right: 8px;
}
</style>
