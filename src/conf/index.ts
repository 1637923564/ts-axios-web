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

export interface ResponseConf<T = any> {
  config: RequestOptionsConf
  data?: T
  headers?: any
  request: XMLHttpRequest
  status: number
  statusText: string
}

export interface AxiosPromise<T = any> extends Promise<ResponseConf<T>> {}

export interface AxiosErrorConf extends Error {
  message: string
  code: string | null
  request: XMLHttpRequest
  config: RequestOptionsConf
  response?: ResponseConf
  isAxiosError?: boolean
}

export interface RequestURLOptional {
  url?: string
  method?: Method
  params?: any
  data?: any
  headers?: any
  responseType?: XMLHttpRequestResponseType
  timeout?: number
}

export interface AxiosMethodSConf {
  request<T = any>(config: RequestOptionsConf): AxiosPromise<T>

  get<T = any>(url: string, conf?: RequestURLOptional): AxiosPromise<T>

  delete<T = any>(url: string, conf?: RequestURLOptional): AxiosPromise<T>

  head<T = any>(url: string, conf?: RequestURLOptional): AxiosPromise<T>

  options<T = any>(url: string, conf?: RequestURLOptional): AxiosPromise<T>

  post<T = any>(url: string, data?: any, conf?: RequestURLOptional): AxiosPromise<T>

  put<T = any>(url: string, data?: any, conf?: RequestURLOptional): AxiosPromise<T>

  patch<T = any>(url: string, data?: any, conf?: RequestURLOptional): AxiosPromise<T>
}

export interface AxiosConf extends AxiosMethodSConf {
  // (config: RequestOptionsConf): AxiosPromise
  <T = any>(configOrURL: RequestOptionsConf | string, conf?: RequestURLOptional): AxiosPromise<T>
}
