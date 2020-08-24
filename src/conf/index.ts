export type Method =
  'GET'     | 'get'     |
  'POST'    | 'post'    |
  'DELETE'  | 'delete'  |
  'PUT'     | 'put'     |
  'HEAD'    | 'head'    |
  'OPTIONS' | 'options' |
  'PATCH'   | 'patch'

export interface RequestOptionsConf {
  url: string
  method?: Method
  params?: any
  data?: any
  headers?: any
}

export const CONTENT_TYPE = 'Content-Type'