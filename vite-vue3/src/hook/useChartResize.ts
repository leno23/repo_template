import _ from 'lodash'
// import { ResizeObserver } from '@juggle/resize-observer'
import { ECharts } from 'echarts'
// ResizeObserver有原生支持的同名API，这是个polyfill，兼容到IE9

const cb:Map<ECharts, ResizeObserver> = new Map()
// [echart, handler: {observer, trigger}]

const main = document.getElementsByClassName('layout-main') // 直接监听main也就是主内容区，不能监听window，因为左侧滑动无法触发

/**
 * @param {...EChartsInstance} EChart实例，可一次传入多个
 * @description .main的resize事件触发时，所有传入的EChart实例的resize会被调用
 */
export const useChartResize = (...charts: ECharts[]) => {
  charts.forEach((echart) => {
    if (!echart) return
    const trigger = _.throttle(echart.resize, 20)
    const resizeObserver = new ResizeObserver(trigger as any)
    resizeObserver.observe(main[0])
    cb.set(echart, resizeObserver)
  })
}

/**
 *
 * @param {...EChartsInstance} EChart实例，可一次传入多个
 * @description 当组件卸载的时候，调用这个方法，传入echarts实例，移除该实例上的监听器
 */
export const useRemoveResize = (...charts: ECharts[]) => {
  charts.forEach((echart) => {
    const resizeObserver = cb.get(echart)
    if (!resizeObserver) return
    resizeObserver.unobserve(main[0])
    cb.delete(echart)
  })
}
