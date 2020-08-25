import { AxiosErrorConf, ResponseConf } from '../conf'

// 将 axiosError 与原生Error混合
class AxiosError extends Error {
  code: string | null
  config: any
  request: XMLHttpRequest
  response?: ResponseConf
  name: string

  constructor(errorConfig: AxiosErrorConf) {
    const { message, code, config, request, response, name } = errorConfig
    super(message)
    this.code = code
    this.config = config
    this.request = request
    this.response = response
    this.name = name

    // 解决 TypeScript 继承一些内置对象的时候的坑：https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, Error.prototype)
  }
}

export function createError(errorConfig: AxiosErrorConf): AxiosErrorConf {
  return new AxiosError(errorConfig)
}
