import {
  AxiosErrorConf,
  AxiosPromise,
  RequestOptionsConf,
  RequestURLOptional,
  ResponseConf
} from '../conf'
import { buildURL, connectURL, isAbsoluteURL } from '../helpers/buildURL'
import xhr from '../adapters/xhr'
import { mergeHeaders } from '../helpers/processHeaders'
import transform from './transform'

function dispatchRequest(config: RequestOptionsConf): AxiosPromise {
  // 用于判断请求是否被取消
  throwIfCancellationRequested(config)

  processConfig(config)

  return xhr(config)
    .then(res => {
      return transformResponseData(res, config)
    })
    .catch((e: AxiosErrorConf) => {
      if (!e.response) return Promise.reject(e)
      e.response = transformResponseData(e.response, config)
      return Promise.reject(e)
    })
}

// 修改 config 的数据
function processConfig(config: RequestOptionsConf): void {
  config.url = transformURL(config)

  config.data = transform(config.data, config.headers, config.transformRequest!)

  config.headers = mergeHeaders(config.headers, config.method!)
}

// 处理传入的 url 和 params 选项
export function transformURL(config: RequestOptionsConf): string {
  let { url, params, paramsSerializer, baseURL } = config

  // 拼接baseURL和URL
  if (baseURL) {
    url = isAbsoluteURL(url) ? url : connectURL(baseURL, url)
  }

  return buildURL(url, params, paramsSerializer)
}

function transformResponseData(res: ResponseConf, config: RequestURLOptional): ResponseConf {
  const { data, headers } = res
  const { transformResponse } = config
  res.data = transform(data, headers, transformResponse!)
  return res
}

function throwIfCancellationRequested(config: RequestOptionsConf) {
  config.cancelToken?.throwIfRequested()
}

export default dispatchRequest
