<template>
  <div>
    <div style="font-size: 17px;">重点关注</div>
    <dv-scroll-ranking-board
      :config="config"
      class="ranking-board-custom-class"
    />
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import type { AttentionInfo } from '@/api/Dashboard'

const router = useRouter()

const props = defineProps<{ data: AttentionInfo[] | null }>()

const config = computed(() => ({
  data: props.data
    ? props.data.map(item => ({
      name: `<div data-id='${item.id}' style='cursor: pointer;'>${item.name}</div>`,
      value: item.count
    }))
    : [],
  unit: '个实例'
}))

const handleClick = (e: any) => {
  if (!e.target.dataset.id) return
  router.push({ name: 'RiskIssues', query: { inspection_id: e.target.dataset.id } })
}

onMounted(() => {
  const dom = document.querySelector('.dv-scroll-ranking-board.ranking-board-custom-class')
  dom?.addEventListener('click', handleClick)
})

onBeforeUnmount(() => {
  const dom = document.querySelector('.dv-scroll-ranking-board.ranking-board-custom-class')
  dom?.removeEventListener('click', handleClick)
})

</script>

<script lang="ts">
export default defineComponent({ name: 'DashboardAttentionDistribution' })
</script>
