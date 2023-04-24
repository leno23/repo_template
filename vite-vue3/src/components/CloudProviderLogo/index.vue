<template>
  <img :src="logo[provider]" />
</template>

<script lang="ts" setup>
import tencent from './tencent.png'
import huawei from './huawei.png'
import gcp from './gcp.png'
import aws from './aws.png'
import azure from './azure.png'
import zenlayer from './zenlayer.png'
const logo: {[key in ProviderTypeEnum]: any} = { tencent, gcp, aws, azure, zenlayer, huawei }

defineProps<{ provider: ProviderTypeEnum }>()
</script>
<script lang="ts">

export default defineComponent({
  name: 'ProviderLogoImage'
})
</script>

<style lang="scss" scoped>

</style>
