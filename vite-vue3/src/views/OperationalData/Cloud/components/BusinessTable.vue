<template>
  <h4 style="color: #909399; margin: 6px 0">
    {{ $t('关联业务') }}
  </h4>
  <vxe-grid
    v-bind="options"
    ref="BusinessTable"
  />
</template>

<script lang="tsx">
import { enumBusinessType, enumStatus, enumGameType, enumStage, enumReleaseMode, enumLevel } from '../config'
import { VxeGridInstance, VxeGridProps } from 'vxe-table'
import { $t } from '@/common/utils/i18n'

import _ from 'lodash'

export default defineComponent({ name: 'BusinessTable' })
</script>

<script lang="tsx" setup>
interface Props {
  dataSource: any[]
}

const BusinessTable = ref<VxeGridInstance>()

const props = defineProps<Props>()

const options = reactive<VxeGridProps>({
  size: 'mini',
  border: true,
  align: 'center',
  columns: [
    {
      title: 'ID',
      field: 'id',
      minWidth: 80
    },
    {
      title: $t('业务类型'),
      field: 'genre',
      showOverflow: true,
      minWidth: 80,
      formatter: ({ row }) => {
        return _.get(_.find(enumBusinessType, { value: row.genre }), 'label', '')
      }
    },
    {
      title: $t('中文名'),
      showOverflow: true,
      field: 'name_zh',
      minWidth: 80
    },
    {
      title: $t('英文名'),
      showOverflow: true,
      field: 'name_en',
      minWidth: 80
    },
    {
      title: $t('状态'),
      showOverflow: true,
      field: 'status',
      minWidth: 60,
      formatter: ({ row }) => {
        return _.get(_.find(enumStatus, { value: row.status }), 'label', '')
      }
    },
    {
      title: $t('游戏ID'),
      showOverflow: true,
      field: 'game_id',
      minWidth: 80
    },
    {
      title: $t('游戏类型'),
      showOverflow: true,
      field: 'game_type',
      minWidth: 80,
      formatter: ({ row }) => {
        return _.get(_.find(enumGameType, { value: row.game_type }), 'label', '')
      }
    },
    {
      title: $t('发行商'),
      showOverflow: true,
      field: 'publisher',
      minWidth: 80
    },
    {
      title: $t('开发商'),
      showOverflow: true,
      field: 'developer',
      minWidth: 80
    },
    {
      title: $t('运营阶段'),
      showOverflow: true,
      field: 'stage',
      minWidth: 80,
      formatter: ({ row }) => {
        return _.get(_.find(enumStage, { value: row.stage }), 'label', '')
      }
    },
    {
      title: $t('发行模式'),
      showOverflow: true,
      field: 'release_mode',
      minWidth: 80,
      formatter: ({ row }) => {
        return _.get(_.find(enumReleaseMode, { value: row.release_mode }), 'label', '')
      }
    },
    {
      title: $t('等级'),
      showOverflow: true,
      field: 'level',
      minWidth: 80,
      formatter: ({ row }) => {
        return _.get(_.find(enumLevel, { value: row.level }), 'label', '')
      }
    }
  ],
  proxyConfig: {
    ajax: {
      query: async () => {
        return _.get(props, 'dataSource', [])
      }
    }
  }
})
</script>
