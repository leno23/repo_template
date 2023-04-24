import { randomInt } from '@/common/utils'
import { useEmptyChart } from '@/hook/useEmptyChart'
import * as echarts from 'echarts'

export const getChartOption = (data: any[], echartInstance: echarts.ECharts): echarts.EChartsOption => {
  if (!data.length) return useEmptyChart(echartInstance, 'middle', {}, true)

  echartInstance.clear()

  return {
    darkMode: true,

    radar: {
      indicator: [
        { name: '性能', max: 10000 },
        { name: '成本', max: 10000 },
        { name: '可用性', max: 10000 },
        { name: '服务限制', max: 10000 },
        { name: '安全', max: 10000 }
      ]
    },

    series: [
      {
        type: 'radar',
        data: [
          {
            value: [randomInt(2000, 10000), randomInt(2000, 10000), randomInt(2000, 10000), randomInt(2000, 10000), randomInt(2000, 10000)],
            name: 'DevOps平台账号'
          },
          {
            value: [randomInt(2000, 10000), randomInt(2000, 10000), randomInt(2000, 10000), randomInt(2000, 10000), randomInt(2000, 10000)],
            name: 'DevOps测试账号'
          }
        ]
        // label: { show: false }
      }
    ],
    // grid: { top: 50, bottom: 10, left: 60, right: 10 },
    legend: {
      // orient: 'vertical',
      // right: 'right',
      inactiveColor: '#454545',
      bottom: 'bottom',
      textStyle: {
        color: 'rgba(255,255,255,0.9)'
      }
      // inactiveColor: '#242424',
      // formatter: name => `{lf|\n}{label|${name}}{lf|\n}`
    },
    // tooltip: { trigger: 'item' }
    tooltip: { }
  }
}
