import { RequestOptionsConf } from './conf'
import { buildURL } from './helpers/buildURL'
import xhr from './adapters/xhr'
import { normalizeRequest } from './helpers/requestData'
import { normalizeHeaders } from './helpers/processHeaders'

function axios(config: RequestOptionsConf) {
  processConfig(config)
  xhr(config)
}

// 修改 config 的数据
function processConfig(config: RequestOptionsConf): void {
  config.url = transformUrl(config)
  config.headers = transformHeaders(config)
  config.data = transformRequestData(config)
}

// 处理传入的 url 和 params 选项
function transformUrl(config: RequestOptionsConf): string {
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

export default axios