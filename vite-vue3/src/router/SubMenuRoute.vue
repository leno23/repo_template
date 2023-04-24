<template>
  <router-view v-slot="{ Component }">
    <transition
      mode="out-in"
      enter-active-class="layout-animate layout-animate-in"
      leave-active-class="layout-animate layout-animate-out"
      appear
      @before-enter="$emit('update:no-scroll', true)"
      @after-enter="$emit('update:no-scroll', false)"
    >
      <!-- <keep-alive :include="['Repository']"> -->
      <Component
        :is="Component"
        :no-scroll="noScroll"
        @update:no-scroll="$emit('update:no-scroll', $event)"
      />
      <!-- </keep-alive> -->
    </transition>
  </router-view>
</template>

<script lang="ts" setup>
defineProps<{
  noScroll: boolean
}>()

defineEmits(['update:no-scroll'])

</script>

<script lang="ts">
export default defineComponent({
  name: 'SubMenuRoute'
})
</script>
