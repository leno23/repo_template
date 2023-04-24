<template>
  <template
    v-for="item in menuList"
    :key="item.name"
  >
    <t-submenu
      v-if="item.children && item.children.length > 1"
      :value="(item.name as string)"
    >
      <template #icon>
        <template v-if="item.meta!.icon">
          <MenuIcon
            :icon="item.meta!.icon!"
            :icon-props="item.meta?.iconProps"
          />
        </template>
      </template>
      <template #title>
        {{ item.meta?.title }}
      </template>
      <MenuItem
        :menu-list="item.children"
        :mode="mode"
      />
    </t-submenu>

    <t-menu-item
      v-else-if="item.children && item.children.length === 1"
      :value="(item.children[0].name as string)"
      :to="{ name: item.children[0].name as string }"
    >
      <template #icon>
        <template v-if="item.children[0].meta!.icon">
          <MenuIcon
            :icon="item.children[0].meta!.icon!"
            :icon-props="item.children[0].meta?.iconProps"
          />
        </template>
      </template>
      {{ item.children[0].meta?.title }}
    </t-menu-item>

    <t-menu-item
      v-else
      :value="(item.name as string)"
      :to="
        mode === 'top'
          ? item.redirect || { name: item.name } as any
          : { name: item.name } as any
      "
    >
      <template #icon>
        <template v-if="item.meta!.icon">
          <MenuIcon
            :icon="item.meta!.icon!"
            :icon-props="item.meta?.iconProps"
          />
        </template>
      </template>
      {{ item.meta?.title }}
    </t-menu-item>
  </template>
</template>

<script lang="ts" setup>
import MenuIcon from './MenuIcon.vue'
import type { RouteRecordRaw } from 'vue-router'

defineProps<{
  menuList: RouteRecordRaw[];
  mode: 'aside' | 'top';
}>()
</script>

<script lang="ts">
export default defineComponent({
  name: 'MenuItem'
})
</script>
