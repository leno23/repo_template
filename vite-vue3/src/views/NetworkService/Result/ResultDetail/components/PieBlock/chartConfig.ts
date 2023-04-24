/* eslint-disable no-irregular-whitespace */
import { useEmptyChart } from '@/hook/useEmptyChart'
import * as echarts from 'echarts'

export const getChartOption = (
  data:any,
  echartInstance: echarts.ECharts
): echarts.EChartsOption => {
  const titleOption: echarts.EChartsOption['title'] = {
    text: '运营商数量分布',
    left: 'center',
    textStyle: {
      color: '#464646',
      fontWeight: 'normal',
      fontSize: 17
    }

  }

  if (!data) return useEmptyChart(echartInstance, 'middle', {})

  echartInstance.clear()

  return {
    darkMode: false,
    title: titleOption,
    series: [
      {
        type: 'pie',
        // radius: ['50%', '70%'],
        data: data.map((item:any) => ({ value: item.ispCount, name: item.isp })),
        center: ['50%', '50%']
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
    label: {
      formatter: '{b|{b}：}{c}  {per|{d}%}  ',
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
    },
    grid: { top: 0, bottom: 0, left: 60, right: 10 },
    legend: {
      show: false,
      type: 'scroll',
      orient: 'horizontal',
      bottom: 0
    },
    tooltip: {
      formatter ({ marker, name, value, percent }:any) {
        return `${marker} ${name} <br/>  ${value} ${percent}%`
      }
    }
  }
}
