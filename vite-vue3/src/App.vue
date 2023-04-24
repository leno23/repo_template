<template>
  <t-config-provider :global-config="(tdI18n as any)">
    <router-view />
  </t-config-provider>
</template>

<script lang="ts" setup>
import { tdI18n, lang } from './common/utils/i18n'
import { useSettingStore } from '@/store/modules/setting'
import { throttle } from 'lodash'
import { useCloudAccountStore } from '@/store/modules/cloudAccount'
import { useUserStore } from './store/modules/user'
import { useCloudProviderStore } from './store/modules/cloudProvider'
import { useBusinessStore } from './store/modules/business'
import { removeWatermark, setWaterMark } from './hook/watermark'

const SettingStore = useSettingStore()
const UserStore = useUserStore()

const BusinessStore = useBusinessStore()

// 启动yufu用户的同步
UserStore.refreshYufuUsers()

// 启动各业务的云账号列表同步
const CloudAccountStore = useCloudAccountStore()
watch(() => BusinessStore.currentBusinessId, () => CloudAccountStore.polling(), { immediate: true })

// 启动云厂商region、zone的同步
const CloudProviderStore = useCloudProviderStore()
CloudProviderStore.refreshRegionAndZone()
// * ----------------- 挂水印 -------------------------
const doWaterMark = throttle(() => setWaterMark(UserStore.username), 200)
onMounted(() => {
  doWaterMark(); window.addEventListener('resize', doWaterMark)
})

onUnmounted(() => {
  removeWatermark()
  window.removeEventListener('resize', doWaterMark)
})

// * ---------------- 动态权限值 -------------------
watch(
  () => UserStore.is_superuser,
  (isSuper) => {
    SettingStore.setPermissions(isSuper)
  },
  { immediate: true }
)

// * --------------- 语言 ----------------------
// 本来是由本地存储以浏览器为粒度作为语言记录，后续增加了用户语言数据在数据库记录，如果不一致则刷新一下
if (UserStore.profile.language && lang !== UserStore.profile.language) SettingStore.setLang(UserStore.profile.language)

// * ----------------- 全局多选业务 - 设置当前business_id ------------------------
watch(
  () => BusinessStore.selected,
  () => {
    if (BusinessStore.selected.length) {
      const selectValues = [...BusinessStore.selected].sort((curr, next) => curr - next)
      if (selectValues[0] === BusinessStore.currentBusinessId) return
      BusinessStore.setCurrentBusinessId(selectValues[0])
    } else {
      BusinessStore.setCurrentBusinessId(BusinessStore.business[0]?.id || NaN)
    }
  }
)
</script>
<script lang="ts">
export default defineComponent({ name: 'App' })
</script>

<style lang="scss">
@import '@/common/style';
</style>
