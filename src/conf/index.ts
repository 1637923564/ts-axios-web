export const CONTENT_TYPE = 'Content-Type'

export type Method =
  | 'GET'
  | 'get'
  | 'POST'
  | 'post'
  | 'DELETE'
  | 'delete'
  | 'PUT'
  | 'put'
  | 'HEAD'
  | 'head'
  | 'OPTIONS'
  | 'options'
  | 'PATCH'
  | 'patch'

export interface RequestOptionsConf {
  url: string
  method?: Method
  params?: any
  data?: any
  headers?: any
  responseType?: XMLHttpRequestResponseType
  timeout?: number
}

export interface ResponseConf {
  config: RequestOptionsConf
  data?: any
  headers?: any
  request: XMLHttpRequest
  status: number
  statusText: string
}

export interface AxiosPromise extends Promise<ResponseConf> {}

export interface AxiosErrorConf extends Error {
  message: string
  code: string | null
  request: XMLHttpRequest
  config: RequestOptionsConf
  response?: ResponseConf
  isAxiosError?: boolean
}
