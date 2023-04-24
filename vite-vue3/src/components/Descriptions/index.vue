<template>
  <div :class="`descriptions-container ${hideTopBorder?'hideTopBorder':''}`">
    <div
      v-for="rowNum in Math.ceil(list.length / column)"
      :key="rowNum"
      class="description-row"
    >
      <div
        v-for="col in column"
        :key="col"
        :class="`row-box ${getItem(rowNum,col)?'':'displayNone'}`"
      >
        <div
          v-if="getItem(rowNum,col)"
          class="description-item"
        >
          <span class="label">
            <t-icon
              v-if="getItem(rowNum,col).icon"
              size="16px"
              style="margin-right: 5px;"
              :name="getItem(rowNum,col).icon"
            />
            {{ list[((rowNum-1)* column) + (col - 1)].label }}
          </span>
          <span :class="`value ${getItem(rowNum,col).class}`">
            <span v-if="getItem(rowNum,col).type === 'tag' && (getItem(rowNum,col).value instanceof Array)">
              <t-tag
                v-for="(tag, tagIndex) in getItem(rowNum,col).value"
                :key="tagIndex"
                variant="light"
                theme="primary"
                style="margin: 3px 5px 3px 0;"
              >{{ tag }}</t-tag>
            </span>
            <span v-else-if="getItem(rowNum,col).type === 'link'">
              <t-link v-bind="getItem(rowNum,col).linkProps" />
            </span>
            <span v-else>
              {{ getItem(rowNum,col).value }}
            </span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
export default defineComponent({
  name: 'Descriptions'
})
</script>
<script lang="ts" setup>

interface IProps {
  data: any
  column: any
  hideTopBorder?: boolean
}
const props = withDefaults(defineProps<IProps>(), {
  column: 2
})
const list = computed(() => {
  return [...props.data]
})

const getItem = (rowNum:number, col:number) => {
  return list.value[((rowNum - 1) * props.column) + (col - 1)]
}

</script>
<style scoped lang="scss">
.descriptions-container{
  border-top: 1px solid #ebeef5;
  border-left: 1px solid #ebeef5;
  .description-row{
    display: flex;
.row-box{
  flex: 1;
  border-bottom: 1px solid #ebeef5;
  border-right: 1px solid #ebeef5;
  .description-item{

    line-height: 22px;
    display: flex;
    height: 100%;
    .label{
      display: flex;
      align-items: center;
      padding: 8px 11px;
      width: 200px;
      height: 100%; // 内容撑开盒子也要撑开
      background-color: #F5F7FA;
      font-weight: bold;
    }
    .value{
      display: flex;
      align-items: center;
      padding: 8px 11px;
      flex: 1;
      width: 0; // 宽度交给flex控制,否则内容过多时导致上下不对其
    }
    // .description-icon{
    //   margin-bottom: 4px;
    // }
  }
}
  }
}
.displayNone{
  display: none;
}
.hideTopBorder{
  border-top: none;
}
</style>
