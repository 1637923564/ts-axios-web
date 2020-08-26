import { AxiosErrorConf, ResponseConf } from '../conf'

// 将 axiosError 与原生Error混合
class AxiosError extends Error {
  name: string
  message: string
  code: string | null
  config: any
  request: XMLHttpRequest
  response?: ResponseConf
  isAxiosError: boolean

  constructor(errorConfig: AxiosErrorConf) {
    const { message, code, config, request, response, name, isAxiosError = true } = errorConfig
    super()
    // 重写Error类的message和name属性
    this.message = message
    this.name = name
    this.code = code
    this.config = config
    this.request = request
    this.response = response
    this.isAxiosError = isAxiosError

    // 解决 TypeScript 继承一些内置对象的时候的坑：https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, Error.prototype)
  }
}

export function createError(errorConfig: AxiosErrorConf): AxiosErrorConf {
  return new AxiosError(errorConfig)
}
