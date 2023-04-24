/* eslint-disable no-irregular-whitespace */
import { useEmptyChart } from '@/hook/useEmptyChart'
// import type { RegionDistributeModel, ProviderDistributeModel } from '@/api/Dashboard'
import * as echarts from 'echarts'

// const a = echarts.init(document.documentElement)
// a.setOption()
export const getChartOption = (
  payload: { data: {name: string, value: number}[], title: string },
  echartInstance: echarts.ECharts
): echarts.EChartsOption => {
  const titleOption: echarts.EChartsOption['title'] = {
    text: payload.title,
    textStyle: {
      fontWeight: 'normal',
      fontSize: 15
    },
    left: 'center'
  }

  echartInstance.clear()

  if (!payload || !payload.data?.length) return useEmptyChart(echartInstance, 'middle', titleOption)

  return {
    title: titleOption,
    series: [
      {
        type: 'pie',
        // radius: ['50%', '70%'],
        // data: data.regionData.map(item => ({ value: item.count, name: item.region })),
        data: payload.data,
        center: ['50%', '50%'],
        label: {
          show: true,
          formatter: '{b|{b}: }{c}  {per|{d}%}  ',
          backgroundColor: '#F6F8FC',
          borderColor: '#8C8D8E',
          borderWidth: 1,
          borderRadius: 4,
          rich: {
            a: {
              color: '#6E7079',
              lineHeight: 24,
              align: 'center'
            },
            hr: {
              borderColor: '#8C8D8E',
              width: '100%',
              borderWidth: 1,
              height: 0
            },
            b: {
              color: '#4C5058',
              fontSize: 14,
              padding: [3, 4],
              // fontWeight: 'bold',
              lineHeight: 24
            },
            per: {
              color: '#fff',
              backgroundColor: '#666',
              padding: [3, 4],
              borderRadius: 4
            }
          }
        }
        // color: [
        //   '#3fb1e3',
        //   '#6be6c1',
        //   '#626c91',
        //   '#a0a7e6',
        //   '#c4ebad',
        //   '#96dee8'
        // ]
      }
    ],
    // grid: { top: 50, bottom: 10, left: 60, right: 10 },
    legend: {
      orient: 'vertical',
      right: 'right',
      show: false,
      top: '10%',
      type: 'scroll'
      // inactiveColor: '#242424',
      // // tooltip: { show: true, formatter: name => name },
      // textStyle: {
      //   color: 'rgba(255,255,255, 0.9)',
      //   rich: {
      //     label: {
      //       fontSize: 15,
      //       color: 'rgba(255,255,255,0.9)',
      //       padding: [0, 0, 0, 10]
      //       // lineHeight: 50
      //       // padding: [20, 0, 20, 10]
      //     },
      //     value: {
      //       fontSize: 15,
      //       color: 'rgba(255,255,255,0.9)',
      //       padding: [20, 20, 20, 50]
      //     },
      //     lf: {
      //       fontSize: 5
      //     }
      //   }
      // },
      // // formatter: (name) => `{label|${name.padEnd(10, '　')}}{value|7777}`
      // formatter: name => `{lf|\n}{label|${name}}{lf|\n}`
    },
    tooltip: {
      trigger: 'item',
      show: false,
      formatter ({ marker, name, value, percent }:any) {
        return `${marker} ${name} <br/>  ${value} ${percent}%`
      }
    }
  }
}
