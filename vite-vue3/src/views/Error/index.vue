<template>
  <div class="error-container">
    <h2 class="title">
      {{ title }}
    </h2>
    <p class="sub-title">
      {{ subTitle }}
    </p>

    <t-button
      theme="primary"
      @click="$router.replace('/')"
    >
      {{ $t('返回首页') }}
    </t-button>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  name: 'ErrorPage'
})
</script>
<script lang="ts" setup>
defineProps<{
  title: string
  subTitle: string
}>()
</script>

<style lang="scss" scoped>
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 170px;
  height: 100%;
  width: 100%;

  .title {
    font-size: 30px;
  }
  .sub-title {
    margin-top: 20px;
    margin-bottom: 60px;
    font-size: 20px;
  }
}
</style>
