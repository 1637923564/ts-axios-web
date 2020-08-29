import { CONTENT_TYPE, Method, MethodsCollection } from '../conf'
import { deepMerge, isPlainObject } from './util'

export const normalizeHeaders = (headers: any, data: any) => {
  if (!headers) {
    headers = {}
  }
  // 当传入的headers中存在content-type选项时，将content-type的属性名规范为 Content-Type
  normalizeHeadersKey(headers, CONTENT_TYPE)

  try {
    // JSON.parse可能会报错，需要用try...catch语句
    if (isPlainObject(data) || (typeof data === 'string' && isPlainObject(JSON.parse(data)))) {
      if (headers && !headers[CONTENT_TYPE]) {
        headers[CONTENT_TYPE] = 'application/json;charset=utf-8'
      }
    }
  } catch (e) {
    // ...
  }

  return headers
}

function normalizeHeadersKey(headers: any, disered: string) {
  let keys = Object.keys(headers)

  keys.forEach(key => {
    if (disered !== key && key.toUpperCase() === disered.toUpperCase()) {
      headers[disered] = headers[key]
      delete headers[key]
    }
  })
}

export const parseResponseHeaders = (headers: string): any => {
  if (!headers) {
    return
  }

  const parse = Object.create(null)

  // 将字符串(如："connection: keep-alive\r\ncontent-length: 13\r\ncontent-type: application/json;)转换成一个对象
  headers.split('\r\n').forEach(row => {
    let [key, val] = row.split(':')
    key = key.trim().toLowerCase()
    if (!key) {
      return
    }
    if (val) {
      val = val.trim()
    }
    parse[key] = val
  })

  return parse
}

export function mergeHeaders(headers: any, method: Method) {
  if (!headers) {
    return headers
  }

  headers = deepMerge(headers['common'] || {}, headers[method] || {}, headers)

  const methods = [
    MethodsCollection.GET,
    MethodsCollection.POST,
    MethodsCollection.DELETE,
    MethodsCollection.HEAD,
    MethodsCollection.PATCH,
    MethodsCollection.OPTIONS,
    MethodsCollection.PUT
  ]

  delete headers['common']

  methods.forEach(key => {
    if (headers[key]) {
      delete headers[key]
    }
  })

  return headers
}
