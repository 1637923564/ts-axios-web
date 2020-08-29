import { AxiosPromise, RequestOptionsConf, RequestURLOptional, ResponseConf } from '../conf'
import { buildURL } from '../helpers/buildURL'
import xhr from '../adapters/xhr'
import { normalizeRequest, parseResponse } from '../helpers/processData'
import { mergeHeaders, normalizeHeaders } from '../helpers/processHeaders'
import transform from './transform'

function dispatchRequest(config: RequestOptionsConf): AxiosPromise {
  processConfig(config)
  return xhr(config).then(res => {
    return transformResponseData(res, config)
  })
}

// 修改 config 的数据
function processConfig(config: RequestOptionsConf): void {
  config.url = transformURL(config)
  // config.headers = transformHeaders(config)
  config.data = transform(config.data, config.headers, config.transformRequest!)
  // config.data = transformRequestData(config)
  config.headers = mergeHeaders(config.headers, config.method!)
}

// 处理传入的 url 和 params 选项
function transformURL(config: RequestOptionsConf): string {
  const { url, params } = config
  return buildURL(url, params)
}

// 处理传入的 data 选项
export function transformRequestData(config: RequestOptionsConf): any {
  const { data } = config
  return normalizeRequest(data)
}

export function transformHeaders(config: RequestOptionsConf): any {
  const { headers, data } = config
  return normalizeHeaders(headers, data)
}

function transformResponseData(res: ResponseConf, config: RequestURLOptional): ResponseConf {
  const { data, headers } = res
  const { transformResponse } = config
  res.data = transform(data, headers, transformResponse!)
  return res
}

export default dispatchRequest
