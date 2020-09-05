import { isPlainObject } from './util'

export const normalizeRequest = (data: any): any => {
  // Ajax 的 send()方法只能接收参数的类型：Document, Blob, BufferSource, FormData, URLSearchParams, ReadableStream, USVString。
  if (isPlainObject(data)) {
    return JSON.stringify(data) // 如果选择传入USVString类型，则需要手动更改请求头的Contet-Type
  }

  return data
}

export const parseResponse = (data: any): any => {
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data)
    } catch (e) {
      // ...
    }
  }
  return data
}
