<template>
  <div class="nav-action-warpper">
    <!-- 资产高级搜索ip输入框 -->
    <t-input
      v-model="ipVal"
      placeholder="请输入ip搜索资产"
      class="asset-search-input"
      :disabled="route.name === 'AssetSearch'"
      @keyup="(_, {e}) => (e.key === 'Enter') && diapatchSearch()"
    >
      <template #suffixIcon>
        <t-icon
          name="search"
          @click="diapatchSearch"
        />
      </template>
    </t-input>
    <!-- <div
      :class="{ active: routeMatchedRoot === '_AsyncExport', 'action-content': true, 'route-item': true }"
      @click="router.push({ name: 'AsyncExport' })"
    >
      {{ $t('异步导出') }}
    </div> -->
    <!-- ----------------- 业务 ------------------ -->
    <div
      :class="{ active: routeMatchedRoot === '_Business', 'action-content': true, 'route-item': true }"
      @click="router.push({ name: 'Business' })"
    >
      {{ $t('业务') }}
    </div>
    <!-- ----------------- 工单 ------------------ -->
    <div
      :class="{ active: routeMatchedRoot === 'WorkOrder', 'action-content': true, 'route-item': true }"
      @click="router.push({ name: 'MyOrder' })"
    >
      {{ $t('工单') }}
    </div>
    <!-- -------------- 语言切换按钮 --------------------->
    <t-dropdown :options="langOption">
      <div class="action-content">
        <Icon
          icon="lucide:languages"
          width="19px"
          color="#fff"
        />
      </div>
    </t-dropdown>

    <!-- -------------- 用户信息 --------------------->
    <t-dropdown
      :options="userOption"
      :min-column-width="lang === 'zh' ? 230 : 340"
    >
      <div class="action-content">
        <img
          src="@/assets/defaultAvatar.webp"
          class="avatar"
        />
      </div>
    </t-dropdown>
  </div>
</template>

<script lang="ts" setup>
/* eslint-disable camelcase */
import { allLang, lang, $t } from '@/common/utils/i18n'
import { useSettingStore } from '@/store/modules/setting'
import { reqPostUserLanguage } from '@/api/user'
import { useUserStore } from '@/store/modules/user'
// import { useBusinessStore } from '@/store/modules/business'
import { useRouter, useRoute } from 'vue-router'
import type { LangEnum } from '@/setting'
import type { DropdownOption } from 'tdesign-vue-next'

const router = useRouter()
const route = useRoute()
const routeMatchedRoot = computed(() => route.matched[0].name)

const SettingStore = useSettingStore()
const UserStore = useUserStore()
// const BusinessStore = useBusinessStore()

// 资产高级搜索
const ipVal = ref('')
const diapatchSearch = () => {
  const ip = ipVal.value.trim()
  // if (!ip) return
  ipVal.value = ''
  router.push({ name: 'AssetSearch', params: { ip } })
}

// * -----------------语言切换----------------------
const setLangClick = async ({ value }: { value: LangEnum}) => {
  await reqPostUserLanguage(value)
  SettingStore.setLang(value)
}

const langOption = allLang.map((item) => ({
  content: item.label,
  value: item.value,
  active: lang === item.value,
  onClick: setLangClick
} as DropdownOption))

// * -----------------头像下拉------------------------

const userOption = computed(() => {
  const opts = [
    { content: UserStore.username + ` ( ${$t(UserStore.is_superuser ? $t('超管') : $t('普通用户'))} )` }
  ] as DropdownOption[]
  // if (UserStore.is_superuser) opts.push({ content: syncLoading.value ? $t('正在同步业务...') : $t('触发业务同步'), onClick: refreshSync, disabled: syncLoading.value })
  return opts
})
</script>

<script lang="ts">
export default defineComponent({ name: 'NavRight' })
</script>

<style lang="scss" scoped>
.nav-action-warpper {
  display: flex;
  align-items: center;
  height: $navBarHeight;

  // 这个input的所有颜色样式指定为theme-mode="dark"时的变量值
  .asset-search-input {
    margin-right: 8px;
    width: 250px;
    :deep(.t-input) {
      border-color: #5e5e5e;
      background-color: transparent;
      color: rgba(255,255,255,0.9);

      &:not(.t-is-disabled):hover {
        border-color: #4582e6;
      }

      &:focus,
      &.t-input--focused {
        border-color: #4582e6;
        box-shadow: 0 0 0 2px  #173463;
      }

      .t-input__inner {
        color: rgba(255,255,255,0.9);
        &::placeholder {
          color: rgba(255,255,255,0.35)
        }
      }
      .t-input__suffix > .t-icon {
        color: rgba(255,255,255,0.35);
        cursor: pointer;
        &:hover {
          color: rgba(255,255,255,0.55);
        }
      }

      &.t-is-disabled {
      background-color: #2c2c2c;
        .t-input__inner {
          color: rgba(255,255,255,0.22);
          &::placeholder {
            color: rgba(255,255,255,0.35)
          }
        }
        .t-input__suffix > .t-icon {
          color: rgba(255,255,255,0.22);
          cursor: not-allowed;
          &:hover {
            color: rgba(255,255,255,0.22);
          }
        }
      }
    }
  }

  .action-content {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 3px;
    min-width: 50px;
    height: $navBarHeight - 10px;
    border-radius: $td-radius;
    transition: $td-transition;
    cursor: pointer;
    user-select: none;

    &:hover {
      background-color: var(--td-brand-color);
      border-color: var(--td-brand-color);
    }

    &.route-item {
      padding: 0 25px;
      &:hover {
        background-color: var(--td-brand-color-9);
      }
      &.active {
        background-color: var(--td-brand-color);
        border-color: var(--td-brand-color);
      }
    }

    .avatar {
      width: 30px;
      // border-radius: 50%;
    }

    // &.business {
    //   min-width: 250px;
    //   max-width: 350px;
    //   justify-content: flex-start;
    //   padding: 0 15px;

    //   .business-name {
    //     margin-right: 8px;
    //     white-space: nowrap;
    //     overflow: hidden;
    //     text-overflow: ellipsis;
    //     min-width: 0;
    //   }
    // }
  }

  // .business-options-list {
  //   width: 320px;
  //   // max-height: 410px;
  //   // padding: 0 6px;
  //   // overflow-y: auto;

  //   :deep(.vxe-body--row .vxe-body--column) {
  //     padding: 0;
  //     // padding-top: 6px;

  //     .vxe-cell {
  //       padding: 6px 6px 0;
  //       width: 100% !important; // 大概因为修改了padding，在有滚动条的情况下自动计算的vxe-cell宽度比预计中要小，强制指定
  //     }
  //   }

  //   .business-options-button {
  //     &.active {
  //       color: var(--td-brand-color);
  //       background-color: var(--td-brand-color-light);
  //     }

  //     :deep(.t-button__text) {
  //       display: block;
  //       width: 100%;
  //       overflow: hidden;
  //       text-overflow: ellipsis;
  //       text-align: left;
  //     }
  //   }
  // }
}
</style>
