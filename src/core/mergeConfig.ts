import { RequestURLOptional } from '../conf'
import { deepMerge, isPlainObject } from '../helpers/util'

interface PlainObject {
  [other: string]: any
}
const processFnCollection: PlainObject = {}

export default function mergeConfig(config1: RequestURLOptional, config2: RequestURLOptional = {}) {
  const result = Object.create(null)

  Object.keys(config2).forEach(key => {
    merge(key)
  })

  Object.keys(config1).forEach(key => {
    if (!config2[key]) {
      merge(key)
    }
  })

  // 只接受自定义的
  const onlyCustom = ['url', 'data', 'params']
  onlyCustom.forEach(key => {
    processFnCollection[key] = mergeCustom
  })

  function merge(key: string) {
    let fn = processFnCollection[key] || defaultMerge
    fn = key === 'headers' ? mergeHeaders : fn
    result[key] = fn(config1[key], config2[key])
  }

  return result
}

// 常规的合并
function defaultMerge(val1: any, val2: any): any {
  return val2 !== undefined ? val2 : val1
}

// 不接受默认配置的属性
function mergeCustom(val1: any, val2: any): any {
  if (typeof val2 !== 'undefined') {
    return val2
  }
}

// headers处理
function mergeHeaders(val1: any, val2: any): any {
  if (isPlainObject(val2)) {
    return deepMerge(val1, val2)
  } else if (val2 !== null && val2 !== undefined) {
    return val2
  } else if (isPlainObject(val1)) {
    return JSON.parse(JSON.stringify(val1))
  } else if (val1 !== null && val1 !== undefined) {
    return val1
  }
}
