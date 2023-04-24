<template>
  <div class="list-box">
    <h3 class="list-header">{{ header }}</h3>
    <t-list
      class="list-container"
      split
      size="small"
    >
      <!-- <template #header>
      <span class="list-header">{{ header }}</span>
    </template> -->
      <t-list-item
        v-for="(item, index) in listData"
        :key="index"
      >
        <span>
          <span class="list-item-dot">⬤</span>
          <span
            class="list-item-text"
            @click="viewDetail(item)"
          >{{ item.text }}</span>
        </span>
      </t-list-item>
    </t-list>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
const router = useRouter()
interface IProps {
  listData: any
  header: any
}
defineProps<IProps>()
const viewDetail = (row: any) => {
  router.push({ name: 'RiskIssues', params: { id: row?.id } })
}
</script>

<script lang="ts">
export default defineComponent({
  name: 'List'
})
</script>

<style lang="scss" scoped>
.list-item-dot {
  color: #F7C797;
  margin-right: 10px
}

.list-item-text {
  cursor: pointer;
}

.list-item-text:hover {
  color: #0052D9;
}

.list-box {
  display: flex;
  height: 100%;
  flex-direction: column;

  // :deep(.t-list-item) {
  //   padding: 6px;
  // }

  .list-header {
    font-weight: bolder;
    // padding: 5px;
    color: #333;
    font-family: 'sans-serif';
    font-size: 16px;
    margin-left: 5px;
  }

  .list-container {
    flex: 1;
  }
}
</style>
