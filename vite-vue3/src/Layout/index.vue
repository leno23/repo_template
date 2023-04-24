<template>
  <div class="layout-container">
    <div class="layout-nav">
      <div class="nav-left">
        <div
          class="logo"
          @click="$router.push({ name: HOME_PAGE_NAME })"
        >
          <img src="@/assets/logo.png" />
        </div>
        <!-- 醉了，在菜单项少的情况下，如果t-head-menu宽度小的话，会自动在外面包一层submenu, 要保证初始渲染的宽度自动被撑开 -->
        <t-head-menu
          v-if="busNavBarMenu.length"
          expand-type="popup"
          :value="(navBarMenuDefault as string)"
        >
          <MenuItem
            :menu-list="busNavBarMenu"
            mode="top"
          />
        </t-head-menu>
      </div>
      <div class="nav-right">
        <NavRight />
      </div>
    </div>
    <div class="layout-main-warpper">
      <div
        v-if="!hideAside"
        class="layout-aside"
        :class="collapsed && 'collapsed'"
      >
        <t-menu
          v-model:expanded="asideExpanded"
          :value="(asideMenuDefault as string)"
          :collapsed="collapsed"
        >
          <t-select
            v-if="showBusinessSelect && !collapsed"
            :value="BusinessStore.currentBusinessId"
            :options="businessOptions"
            filterable
            @change="(selectBusiness as any)"
          />
          <!-- <t-select
            v-if="showMultipleBusinessSelect && !collapsed"
            v-model="BusinessStore.selected"
            :tag-props="{ maxWidth: 100 }"
            multiple
            filterable
            :min-collapsed-num="1"
            clearable
            :options="[{ label: '全选', checkAll: true } as SelectOption].concat(businessOptions)"
          /> -->
          <MenuItem
            :menu-list="asideMenuList"
            mode="aside"
          />
          <template #operations>
            <t-icon
              class="t-menu__operations-icon"
              name="view-list"
              @click="SettingStore.changeCollapsed"
            />
          </template>
        </t-menu>
      </div>
      <div
        class="layout-main"
        :class="noScroll && 'no-scroll'"
      >
        <div class="layout-main-inner">
          <router-view v-slot="{ Component }">
            <transition
              mode="out-in"
              enter-active-class="layout-animate layout-animate-in"
              leave-active-class="layout-animate layout-animate-out"
              appear
              @before-enter="noScroll = true"
              @after-enter="noScroll = false"
            >
              <Component
                :is="Component"
                v-model:noScroll="noScroll"
              />
            </transition>
          </router-view>
          <DpCopyright bottom-position />

          <!-- <transition
            mode="out-in"
            enter-active-class="layout-animate layout-animate-in"
            leave-active-class="layout-animate layout-animate-out"
            appear
          > -->
          <!-- 由noScroll控制的渲染，会比路由过渡慢一个tick -->
          <!-- <DpCopyright
              v-show="!noScroll"
              bottom-position
            />
          </transition> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import NavRight from './NavRight/index.vue'
import MenuItem from './MenuItem/index.vue'
import { storeToRefs } from 'pinia'
import { ProjectSetting } from '@/setting'
import { useSettingStore } from '@/store/modules/setting'
import { useRoute, useRouter } from 'vue-router'
import { useBusinessStore } from '@/store/modules/business'
import { HOME_PAGE_NAME } from '@/router/config'
import { cloneDeep, set } from 'lodash'
import type { RouteRecordName } from 'vue-router'
import { $t } from '@/common/utils/i18n'
// import type { SelectOption } from 'tdesign-vue-next'
import { /* reqPostUserBusiness, */ reqPostUserBusinessMultiple } from '@/api/user'

const BusinessStore = useBusinessStore()
const SettingStore = useSettingStore()
const { layout, splitMenu } = ProjectSetting
const { navBarMenu, asideMenu } = storeToRefs(SettingStore)
const route = useRoute()
const router = useRouter()

const hiddenHeadMenuItemName = ['WorkOrder'] // 这路由按钮单独在别的地方渲染, 因为需要hideTab的同时渲染asideMenu（store的asyncRoute计算逻辑不支持），所以在Layout进行渲染过滤

// * -------------------- params逻辑 ------------------------

// @ 给需要路由params加动态的参数，对navBarMenu进行处理，会影响menuitem的行为（优先跳转redirect对象）
// @ 当前逻辑为给资产管理顶层路由ResourceManage加上动态的business_id
const busNavBarMenu = computed(() => {
  const menu = cloneDeep(toRaw(navBarMenu.value)).filter(({ name }) => !hiddenHeadMenuItemName.includes(name as string))

  let business_id = NaN
  const urlBid = Number(route.params.business_id) || NaN

  const currBid = BusinessStore.currentBusinessId

  if (route.matched[0].name === 'ResourceManage' && !currBid) {
    router.push('/error/' + $t('暂无业务'))
    return menu
  }

  // 如果 url指定的bid不是数字，则重定向至有当前业务
  if (route.matched[0].name === 'ResourceManage' && !urlBid) {
    router.replace({ name: route.name!, params: { ...route.params, business_id: currBid } })
    return menu
  }

  if (urlBid === currBid) {
    business_id = currBid
    // url指定的bid优先，如果指定的id没有则跳转无权限
  } else if (urlBid && (urlBid !== currBid)) {
    if (BusinessStore.business.find(({ id }) => id === urlBid)) {
      BusinessStore.setCurrentBusinessId(urlBid)
      BusinessStore.selected = [urlBid]
      business_id = urlBid
    } else {
      router.push(`/error/${$t('无该业务权限')} :  ${urlBid}`)
      return menu
    }
    // 如果url没指定，则取当前store里的bid
  } else if (!urlBid && currBid) {
    business_id = currBid
  }

  menu.forEach(item => {
    // 这个params就挂在这个顶层的路由，只需找这个
    if (item.name === 'ResourceManage') set(item, 'redirect.params.business_id', business_id)
  })

  return menu
})

// * ------------- 菜单业务选择器 ----------------------
const showBusinessSelect = computed(() => (route.matched[0].name === 'ResourceManage')) // 资产管理单选业务
// const showMultipleBusinessSelect = computed(() => (route.matched[0].name === 'ResourceGovernance')) // 资源治理多选业务
const businessOptions = computed(() => BusinessStore.business.map(item => ({
  value: item.id,
  label: `${item.id}-${item.name_zh}(${item.name_en})`
})))

const selectBusiness = (business_id: number) => {
  // reqPostUserBusiness({ business_id }).catch(() => '') // 不阻塞，失败也没关系，重要性不强的请求
  // BusinessStore.selected = [business_id]
  reqPostUserBusinessMultiple([business_id]).catch(() => '') // 不阻塞，失败也没关系，重要性不强的请求
  router.push({ params: { business_id } })
}

// * --------------- 基建逻辑 ----------------

const noScroll = ref(false) // 平移动画时避免滚动条出现

const hideAside = computed(() => {
  if (layout === 'aside' && splitMenu) {
    return route.matched.some((item) => item.meta.hideAside)
  }
  return layout === 'top'
})

const collapsed = computed(() => SettingStore.collapsed)

/**
 * 通过非路由菜单点击跳转路由时或通过url直接访问时计算激活的路由对象name
 */
function defaultActive () {
  /*
    两种情况：
    1.访问非'/'的时候，需要取路由匹配路径中最后的一个hideTab===false的name
    2.访问的是'/'的时候，自动计算asideRoutes对应的首个视图并跳转(方案取消)
    2.访问的是'/'的时候，则为预先设置好的HOME_PAGE_NAME路径
  */
  const pathName = window.location.pathname
  let defaultRoute: RouteRecordName = '/'

  if (pathName === '/') return HOME_PAGE_NAME

  const matched = route.matched

  // !加一个强制指向
  if (matched.find(({ name }) => name === 'RepoDetail')) return 'Repository'

  let i = 1
  while (i !== matched.length) {
    if (matched.at(-i)!.meta.hideTab) {
      i++
    } else {
      defaultRoute = matched.at(-i)!.name!
      break
    }
  }
  return defaultRoute
}

// todo 组件库问题 issues.1810 多层收纳导航head-menu默认未激活父级submenu，0.25.0版本日志指明已修复，但在此处使用没有效果
const navBarMenuDefault = computed(() => {
  if (layout === 'top') return defaultActive()
  else if (layout === 'aside' && splitMenu) return route.matched[0].name!
  return ''
})

// * ------------------------

const asideMenuList = computed(() => {
  const res = asideMenu.value(route.matched[0].name as string)
  const setKey = (routes: any[]) => {
    routes.forEach((item) => {
      if (!item.children?.length) return
      item.children.forEach((child: any) => {
        child.$_parent = item
        setKey(item.children)
      })
    })
  }
  setKey(res)
  return res
})

const asideMenuDefault = computed(() => layout === 'aside' ? defaultActive() : '')
const asideExpanded = ref<string[]>([])

watch(
  () => route.matched,
  () => { asideExpanded.value = route.matched.map(({ name }) => name as string) },
  { immediate: true, deep: true }
)

</script>

<script lang="ts">
export default defineComponent({
  name: 'Layout'
})
</script>

<style lang="scss" scoped>
.layout-container {
  width: 100vw;
  height: 100vh;
  min-width: 1280px;

  &::-webkit-scrollbar-thumb {
    border: 2px solid transparent;
  }

  &::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }
}
.layout-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: $navBarHeight;
  background-color: $navBarBg;
  color: #fff;
  padding: 0 20px;

  .nav-left {
    display: flex;
    flex: 1;

    .logo {
      display: flex;
      align-items: center;
      flex-shrink: 0;
      font-weight: bold;
      width: $asideWidth - 20px; // 减去nav左边的padding
      color: #fff;
      cursor: pointer;
      user-select: none;

      img {
        // height: calc(#{$navBarHeight} - 16px);
        height: $navBarHeight;
      }
    }

    :deep(.t-head-menu) {
      background-color: transparent;

      .t-menu {
        margin-left: 0;
      }

      .t-head-menu__inner {
        height: $navBarHeight;
      }

      .t-menu__item {
        min-width: 80px;
        padding: 0 10px;
        color: #fff;
        height: 40px;
        line-height: 40px;

        &.t-is-disabled {
          color: #aaa;
        }

        &:not(.t-is-disabled):not(.t-is-active):hover {
          background-color: var(--td-brand-color-9);
        }
        &.t-is-active {
          background-color: var(--td-brand-color);
        }
      }
    }
  }
}
.layout-main-warpper {
  display: flex;
  // align-items: center;
  height: calc(100vh - #{$navBarHeight});
  width: 100%;

  .layout-aside {
    height: 100%;
    flex-shrink: 0;
    width: $asideWidth;
    overflow-x: hidden;
    border-right: 1px solid var(--td-border-level-1-color);
    // border-top: 1px solid var(--td-border-level-1-color);
    transition: $td-transition;
    &.collapsed {
      width: 65px;
    }

    // :deep(.t-menu__item.t-is-active:not(.t-is-opened)) {
    //   color: #fff;
    //   background-color: var(--td-brand-color);
    // }

    // ::v-deep .t-default-menu:not(.t-is-collapsed) {
    //   width: calc(#{$asideWidth} - 1px) !important;
    // }

    :deep(.t-default-menu:not(.t-is-collapsed)) {
      width: $asideWidth - 1px !important;
    }
    :deep(.t-default-menu .t-menu) {
      padding: 10px;
    }
  }

  .layout-main {
    flex: 1;
    height: 100%;
    background-color: #f9f9f9;
    // overflow-y: scroll; // 固定scroll，避免动画过程中宽度突然改变
    overflow-y: auto; // 固定scroll，避免动画过程中宽度突然改变

    @include big-scroll;

    &.no-scroll {
      overflow-x: hidden;
    }

    .layout-main-inner {
      position: relative;
      padding-bottom: $footerHeight;
      min-height: calc(100vh - #{$navBarHeight});
      overflow: hidden;
    }
  }
}
</style>

<style lang="scss">
.layout-animate {
  animation-fill-mode: forwards;
  animation-iteration-count: 1;

  &.layout-animate-in {
    animation-name: fade-x-in;
    animation-duration: 200ms;

  }

  &.layout-animate-out {
    animation-name: fade-x-out;
    animation-duration: 100ms;
  }
}

@keyframes fade-x-in {
  from {
    opacity: 0;
    transform: translateX(10px);
  }

  to {
    opacity: 1;
    transform: translateX(0px);
  }
}

@keyframes fade-x-out {
  from {
    opacity: 1;
    transform: translateX(0px);
  }

  to {
    opacity: 0;
    transform: translateX(-15px);
  }
}

</style>
