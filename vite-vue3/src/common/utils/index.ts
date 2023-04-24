/* eslint-disable no-useless-escape */
/* eslint-disable no-redeclare */
import { MessagePlugin } from 'tdesign-vue-next'
import { pinyin } from 'pinyin-pro'
import { floor } from 'lodash'

export function randomInt (min: number, max: number) {
  return Math.round(Math.random() * (max - min) + min)
}

export function getType (data: unknown) {
  return Object.prototype.toString.call(data).split(' ')[1].slice(0, -1)
}

export function formatFileSize (fileSize: number) {
  if (!fileSize) return ''
  let temp: string
  if (fileSize < 1024) {
    return fileSize + ' B'
  } else if (fileSize < (1024 * 1024)) {
    temp = (fileSize / 1024).toFixed(2)
    return temp + ' KB'
  } else if (fileSize < (1024 * 1024 * 1024)) {
    temp = (fileSize / (1024 * 1024)).toFixed(2)
    return temp + ' MB'
  } else {
    temp = (fileSize / (1024 * 1024 * 1024)).toFixed(2)
    return temp + ' GB'
  }
}

export function shortString (str: string, maxLength = 20, replaceStr = '...') {
  if (!str) return ''
  if (str.length <= maxLength) return str
  const start = str.slice(0, maxLength / 2)
  const end = str.slice(-maxLength / 2)
  return start + replaceStr + end
}

export const requestErrorMsg = (title: string, message?: string) => {
  if (title.startsWith('Cancel Request')) {
    console.log(title) // 开发便于看取消理由
    return
  }
  if (title.startsWith('timeout') || title.startsWith('Network Error')) return

  // NotifyPlugin.error({ title, content, closeBtn: true, duration: 0 })
  MessagePlugin.error({ content: title + (message ? ` - ${message}` : ''), duration: 6000, closeBtn: true })
}

export const getDownLoad = (url: string) => {
  const link = document.createElement('a')
  const body = document.body

  link.href = url // 创建对象url

  // fix Firefox
  link.style.display = 'none'
  body.appendChild(link)

  link.click()
  body.removeChild(link)
}

type PickStringKey<T> = {
  [U in keyof T]: T[U] extends string ? U : never
}[keyof T]
/**
 * 中英文搜索
 * @param {*} source 数据源
 * @param {*} keyword 搜索关键字
 * @param {*} property 数据源属性
 * @returns 搜索结果
 */
export function chineseAndEnglishFilter<T extends string>(source:T[], keyword: string): T[]
export function chineseAndEnglishFilter<T extends {[key:PropertyKey]: any}>(source:T[], keyword: string, property:PickStringKey<T>): T[]
export function chineseAndEnglishFilter<T extends string | {[key:PropertyKey]: any}> (source:T[], keyword: string, property?:PickStringKey<T>):T[] {
  if (!Array.isArray(source)) return []
  keyword = pinyin(keyword, { toneType: 'none', type: 'array' }).join('').toLowerCase()

  return source.filter(v => {
    let val = ''
    if (typeof v === 'string') {
      val = v
    }
    if (typeof v === 'object' && property) {
      val = v[property] as string
    }

    const word = pinyin(val, { toneType: 'none', type: 'array' }).join('').toLowerCase()
    return word.includes(keyword)
  })
}

/**
 * 用于获取对象的所有属性集合
 * 等同于 Object.keys
 * 可以正确获取key所对应的类型
 * @param data 对象
 * @returns
 */
export const objectKeys = <T extends object>(obj: T) => Object.keys(obj) as (keyof T)[]

export const isEmptyObject = (data: Record<string, unknown>) => objectKeys(data).length === 0

/**
 * @description: 随机密码
 * @param {*} len 密码位数
 * @param {*} mode 密码难度：high(大小写数字特殊字符)、medium(大小写数字)、low(小写数字)
 */
// ()`~!@#$%^&*-+=|{}[]:;',.?/]
export const randomPass = (len = 16, mode = 'high' as 'high' | 'medium' | 'low') => {
  const lowerCaseArr = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
  const blockLetterArr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
  const numberArr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  const specialArr = ['!', '@', '-', '_', '=', '<', '>', '#', '*', '%', '+', '&', '^', '$', '[', ']', '(', ')', '\'', '`', '~', '%', '{', '}', '|', ':', ';', ',', '.', '?', '/']
  const passArr = []
  let password = ''

  // 指定参数随机获取一个字符
  const specifyRandom = function (...arr: any[]) {
    let str = ''
    arr.forEach(item => {
      str += item[Math.floor(Math.random() * item.length)]
    })
    return str
  }

  switch (mode) {
  case 'high':
    // 安全最高的
    password += specifyRandom(lowerCaseArr, blockLetterArr, numberArr, specialArr)
    passArr.push(...lowerCaseArr, ...blockLetterArr, ...numberArr, ...specialArr)
    break
  case 'medium':
    // 中等的
    password += specifyRandom(lowerCaseArr, blockLetterArr, numberArr)
    passArr.push(...lowerCaseArr, ...blockLetterArr, ...numberArr)
    break
    // 低等的
  case 'low':
    password += specifyRandom(lowerCaseArr, numberArr)
    passArr.push(...lowerCaseArr, ...numberArr)
    break
  default:
    password += specifyRandom(lowerCaseArr, numberArr)
    passArr.push(...lowerCaseArr, ...numberArr)
  }

  const forLen = len - password.length
  for (let i = 0; i < forLen; i++) {
    password += specifyRandom(passArr)
  }

  return password
}

/**
 * @description 检查某一个数是否是二的次方
 * @param num 需要检查的数
 * @returns 检查结果
 */
export const isCheckTwoPower = (num: number) => num > 0 && ((num & (num - 1)) === 0)

const HostModeMap: Record<string, 'test' | 'prod'> = {
  'cmp.devops.intltest11.com': 'test',
  'cmp.devops.intlgame.com': 'prod'
}

export const HostMode: 'test' | 'prod' | 'dev' = HostModeMap[window.location.host] || 'dev'

// * --------------------- 手动格式化JSON字符串 ------------------
export const JSONTrim = (JSONstr: string) => {
  try {
    JSONstr = JSONstr.replace(/'/g, '"')
    JSONstr = JSON.stringify(JSON.parse(JSONstr))
  } catch (error) {
    // 转换失败错误提示
    console.error('json数据格式有误...')
    console.error(error)
    JSONstr = ''
  }
  return JSONstr
}

export function JSONFormat (JSONstr: string) {
  JSONstr = JSONTrim(JSONstr) // 初步格式化json

  // const re = /\\{|\\}|,|:/g // 匹配格式化后的json中的{},:
  // eslint-disable-next-line prefer-regex-literals
  const re = new RegExp('\\{|\\}|,|:', 'g')
  let exec = null
  let InvalidFs = 0
  let InvalidBs = 0
  // eslint-disable-next-line no-cond-assign
  while (exec = re.exec(JSONstr)) { // 找{},:
    const frontToCurrent = exec.input.substr(0, exec.index + 1) // 匹配开头到当前匹配字符之间的字符串
    if (frontToCurrent.replace(/\\"/g, '').replace(/[^"]/g, '').length % 2 !== 0) { // 测试当前字符到开头"的数量，为双数则被判定为目标对象
      if (exec[0] === '{') InvalidFs++
      else if (exec[0] === '}') InvalidBs++
      continue // 不是目标对象，手动跳过
    }
    const keyTimesF = frontToCurrent.replace(/[^\{]/g, '').length - InvalidFs // 找出当前匹配字符之前所有{的个数
    const keyTimesB = frontToCurrent.replace(/[^\}]/g, '').length - InvalidBs // 找出当前匹配字符之前所有}的个数
    const indentationTimes = keyTimesF - keyTimesB // 根据{个数计算缩进

    if (exec[0] === '{') {
      JSONstr = JSONstr.slice(0, exec.index + 1) + '\r\n' + '    '.repeat(indentationTimes) + JSONstr.slice(exec.index + 1) // 将缩进加入字符串
    } else if (exec[0] === '}') {
      JSONstr = JSONstr.slice(0, exec.index) + '\r\n' + '    '.repeat(indentationTimes) + JSONstr.slice(exec.index) // 将缩进加入字符串
      re.exec(JSONstr) // 在查找目标前面插入字符串会回退本次查找，所以手动跳过本次查找
    } else if (exec[0] === ',') {
      JSONstr = JSONstr.slice(0, exec.index + 1) + '\r\n' + '    '.repeat(indentationTimes) + JSONstr.slice(exec.index + 1)
    } else if (exec[0] === ':') {
      JSONstr = JSONstr.slice(0, exec.index + 1) + ' ' + JSONstr.slice(exec.index + 1)
    } else {
      console.log(`匹配到了来路不明的${exec[0]}`)
    }
  }
  return JSONstr === null ? 'Invalid value' : JSONstr
}

export function formatValueSize (value: number, fixed = 2) {
  if (value < 10000) return floor(value, fixed)
  else if (value < 1000000) return floor(value / 10000, fixed) + '万'
  else if (value < 10000000) return floor(value / 1000000, fixed) + '百万'
  else if (value < 100000000) return floor(value / 10000000, fixed) + '千万'
  else if (value < 100000000000) return floor(value / 100000000) + '亿'
  return value
}

export function copyText (str: string) {
  navigator.clipboard.writeText(str).then(() => {
    MessagePlugin.success('复制成功')
  })
}

// export const downLoadBlob = (fileName: string, payload: any) => {
//   const len = payload.length
//   const ab = new ArrayBuffer(len)
//   const ua = new Uint8Array(ab)
//   for (let i = 0; i < len; ++i) {
//     ua[i] = payload[i]
//   }

//   const blob = new Blob([ab], { type: 'application/octet-stream' })

//   if ((window.navigator as any).msSaveOrOpenBlob) {
//     (window.navigator as any).msSaveBlob(blob, fileName)
//   } else {
//     const link = document.createElement('a')
//     const body = document.querySelector('body')!

//     link.href = window.URL.createObjectURL(blob) // 创建对象url
//     link.download = fileName

//     // fix Firefox
//     link.style.display = 'none'
//     body.appendChild(link)

//     link.click()
//     body.removeChild(link)

//     window.URL.revokeObjectURL(link.href) // 通过调用 URL.createObjectURL() 创建的 URL 对象
//   }
// }

export const downLoadBlob = (fileName: string, blob: any) => {
  // const blob = new Blob([payload])
  // if ((window.navigator as any).msSaveOrOpenBlob) {
  //   (window.navigator as any).msSaveBlob(blob, fileName)
  // } else {
  const link = document.createElement('a')
  // const body = document.body

  link.href = window.URL.createObjectURL(blob) // 创建对象url
  link.download = fileName

  // fix Firefox
  // link.style.display = 'none'
  // body.appendChild(link)

  link.click()
  // body.removeChild(link)

  // window.URL.revokeObjectURL(link.href) // 通过调用 URL.createObjectURL() 创建的 URL 对象
  // }
}
