import { AxiosPromise, RequestOptionsConf, ResponseConf } from '../conf'
import { buildURL } from '../helpers/buildURL'
import xhr from '../adapters/xhr'
import { normalizeRequest, parseResponse } from '../helpers/requestData'
import { normalizeHeaders } from '../helpers/processHeaders'

function dispatchRequest(config: RequestOptionsConf): AxiosPromise {
  processConfig(config)
  return xhr(config).then(res => {
    return transformResponseData(res)
  })
}

// 修改 config 的数据
function processConfig(config: RequestOptionsConf): void {
  config.url = transformURL(config)
  config.headers = transformHeaders(config)
  config.data = transformRequestData(config)
}

// 处理传入的 url 和 params 选项
function transformURL(config: RequestOptionsConf): string {
  const { url, params } = config
  return buildURL(url, params)
}

// 处理传入的 data 选项
function transformRequestData(config: RequestOptionsConf): any {
  const { data } = config
  return normalizeRequest(data)
}

function transformHeaders(config: RequestOptionsConf): any {
  const { headers, data } = config
  return normalizeHeaders(headers, data)
}

function transformResponseData(res: ResponseConf): ResponseConf {
  res.data = parseResponse(res.data)
  return res
}

export default dispatchRequest
