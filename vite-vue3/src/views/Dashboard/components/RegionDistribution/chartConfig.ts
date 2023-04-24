/* eslint-disable no-irregular-whitespace */
import { useEmptyChart } from '@/hook/useEmptyChart'
import type { RegionDistributeModel, ProviderDistributeModel } from '@/api/Dashboard'
import * as echarts from 'echarts'

// const a = echarts.init(document.documentElement)
// a.setOption()
export const getChartOption = (
  data: {regionData: RegionDistributeModel[], providerData: ProviderDistributeModel[]} | null,
  echartInstance: echarts.ECharts
): echarts.EChartsOption => {
  // const titleOption: echarts.EChartsOption['title'] = {
  //   text: '主机地域分布TOP5                                  主机云厂商分布',
  //   textStyle: {
  //     color: 'rgba(255, 255, 255, 0.9)',
  //     fontWeight: 'normal',
  //     fontSize: 17
  //   },
  //   left: '75px'
  // }

  if (!data) return useEmptyChart(echartInstance, 'middle', {}, true)

  echartInstance.clear()

  return {
    darkMode: true,
    // title: titleOption,
    // xAxis: {
    //   // type: 'category',
    //   data: ['云服务器', '数据库', '中间件', '存储', '中台', '短信', '其他'],
    //   nameTextStyle: {
    //     color: '#ababab' // 坐标轴名称的文字样式。
    //   },
    //   axisTick: { show: false }
    // },
    series: [
      {
        type: 'pie',
        radius: ['50%', '70%'],
        data: data.regionData.map(item => ({ value: item.count, name: item.region })),
        center: ['25%', '55%'],
        color: [
          '#3fb1e3',
          '#6be6c1',
          '#626c91',
          '#a0a7e6',
          '#c4ebad',
          '#96dee8'
        ]
      },
      {
        type: 'pie',
        radius: ['50%', '70%'],
        data: data.providerData.map(item => ({ value: item.count, name: item.provider_key })),
        center: ['75%', '55%'],
        color: [
          '#3fb1e3',
          '#6be6c1',
          '#626c91',
          '#a0a7e6',
          '#c4ebad',
          '#96dee8'
        ]
      }
    ],
    // grid: { top: 50, bottom: 10, left: 60, right: 10 },
    // legend: {
    //   orient: 'vertical',
    //   right: 'right',
    //   top: '20%',
    //   inactiveColor: '#242424',
    //   // tooltip: { show: true, formatter: name => name },
    //   textStyle: {
    //     color: 'rgba(255,255,255, 0.9)',
    //     rich: {
    //       label: {
    //         fontSize: 15,
    //         color: 'rgba(255,255,255,0.9)',
    //         padding: [0, 0, 0, 10]
    //         // lineHeight: 50
    //         // padding: [20, 0, 20, 10]
    //       },
    //       value: {
    //         fontSize: 15,
    //         color: 'rgba(255,255,255,0.9)',
    //         padding: [20, 20, 20, 50]
    //       },
    //       lf: {
    //         fontSize: 5
    //       }
    //     }
    //   },
    //   // formatter: (name) => `{label|${name.padEnd(10, '　')}}{value|7777}`
    //   formatter: name => `{lf|\n}{label|${name}}{lf|\n}`
    // },
    // tooltip: { trigger: 'item' }
    tooltip: {
      formatter: (params: any) => `
        <div style='display: flex; align-items: center;'>
        <span>${params.marker}    ${params.name}</span>
        <span style='margin-left: 20px; font-weight: bold;'>${params.value.toLocaleString()}台<span/>
        </div>
      `
    }
  }
}
