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

export const enum MethodsCollection {
  GET = 'get',
  POST = 'post',
  DELETE = 'delete',
  PUT = 'put',
  HEAD = 'head',
  OPTIONS = 'options',
  PATCH = 'patch'
}

interface RequestCommon {
  method?: Method
  params?: any
  data?: any
  headers?: any
  responseType?: XMLHttpRequestResponseType
  timeout?: number
  transformRequest?: TransformFnType[] | TransformFnType
  transformResponse?: TransformFnType[] | TransformFnType
  cancelToken?: CancelToken
  withCredentials?: boolean
  xsrfHeaderName?: string
  xsrfCookieName?: string
  onDownloadProgress?: (e: ProgressEvent) => void
  onUploadProgress?: (e: ProgressEvent) => void
  auth?: AuthorizationType
  validateStatus?: (status: number) => boolean
  paramsSerializer?: (params: any) => string
  baseURL?: string
  [other: string]: any
}

export interface RequestOptionsConf extends RequestCommon {
  url: string
}

export interface RequestURLOptional extends RequestCommon {
  url?: string
}

export interface ResponseConf<T = any> {
  config: RequestOptionsConf
  data?: T
  headers?: any
  request: XMLHttpRequest
  status: number
  statusText: string
}

export interface TransformFnType {
  (data: any, headers?: any): any
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

interface InterceptorsType {
  request: InterceptorManagerType<RequestURLOptional>
  response: InterceptorManagerType<ResponseConf>
}

export interface AxiosMethodSConf {
  defaults: RequestURLOptional

  interceptors: InterceptorsType

  getUri: (config: RequestURLOptional) => string

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

export interface AxiosStatic extends AxiosConf {
  create: (config?: RequestURLOptional) => AxiosConf
  Cancel: CancelStatic
  CancelToken: CancelTokenStatic
  isCancel: (info: any) => boolean
  Axios: AxiosClass
  all: <T>(arr: Array<T | Promise<T>>) => Promise<T[]>
  spread<T, R>(callback: (...args: T[]) => R): (arr: T[]) => R
}

interface AxiosClass {
  new (defaultsSet: RequestURLOptional): AxiosMethodSConf
}

export interface InterceptorManagerType<T> {
  use(resolve: ResolveType<T>, reject?: RejectType): number
  eject(id: number): void
}

export interface ResolveType<T> {
  (val: T): T | Promise<T>
}

export interface RejectType {
  (error: any): void
}

export interface CancelToken {
  promise: Promise<Cancel>
  reason?: Cancel
  throwIfRequested(): void
}

export interface Canceler {
  (message?: string): void
}

export interface CancelTokenSource {
  token: CancelToken
  cancel: Canceler
}

export interface CancelTokenStatic {
  new (executor: CancelExecutor): CancelToken

  source(): CancelTokenSource
}

export interface CancelExecutor {
  (cancel: Canceler): void
}

interface Cancel {
  message?: string
}

interface CancelStatic {
  new (message?: string): Cancel
}

interface AuthorizationType {
  username: string
  password: string
}
