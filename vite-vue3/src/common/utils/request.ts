/* eslint-disable camelcase */
/* eslint-disable prefer-promise-reject-errors */
import axios from 'axios'
import { $t } from './i18n'
// import { useBusinessStore } from '@/store/modules/business'
import { requestErrorMsg } from './index'

// const { CancelToken } = axios

//! 原来的axios不能定义返回值类型，拓展moudle，接收类型参数，参数为服务器返回内容的类型
declare module 'axios' {
  export interface AxiosInstance {
    <T>(config: AxiosRequestConfig): Promise<T>
    request<T>(config: AxiosRequestConfig): Promise<T>
    _upload<T>(config: AxiosRequestConfig): Promise<T>
  }
}

const request = axios.create({
  xsrfCookieName: import.meta.env.VITE_CSRF_TOKEN,
  xsrfHeaderName: 'x-csrftoken',
  withCredentials: true,
  headers: { 'x-requested-with': 'XMLHttpRequest' },
  responseType: 'json',
  baseURL: import.meta.env.VITE_API_BASE_URL || '/',
  timeout: 40000
})

request.interceptors.response.use(
  response => {
    const code = response.data.code

    if (code === 401) {
      // requestErrorMsg($t('未登录，正在跳转登录页'))
      window.location.href = import.meta.env.VITE_PROXY_API_HOST + '/accounts/yufu/login/'
      return Promise.reject(response.data)
    }
    // 错误状态：422请求参数传输错误 412请求数据操作错误 403无该操作权限 401未登录

    return code === 200 ? response.data.data : Promise.reject(response.data)
  },
  error => {
    if (axios.isCancel(error)) return Promise.reject({ message: `Cancel Request ${error.message}` })

    if (error.message.startsWith('timeout')) {
      requestErrorMsg($t('请求数据超时'))
    } else if (error.message === 'Network Error') {
      requestErrorMsg($t('网络链接错误'))
    } else if (error.message === 'Request failed with status code 401') {
      // requestErrorMsg($t('未登录，正在跳转登录页'))
      window.location.href = import.meta.env.VITE_PROXY_API_HOST + '/account/yufu/'
    }

    return Promise.reject(error)
  }
)

export { request }
