// axios.get / delete / head / options(url, config?)
// axios.post / put / patch(url, data?, config?)
import {
  AxiosPromise,
  Method,
  RequestOptionsConf,
  RequestURLOptional,
  AxiosMethodSConf,
  ResolveType,
  RejectType,
  ResponseConf
} from '../conf'

import dispatchRequest, { transformURL } from './dispatchRequest'
import InterceptorManager from './interceptorManager'
import mergeConfig from './mergeConfig'

interface InterceptorsType {
  request: InterceptorManager<RequestURLOptional>
  response: InterceptorManager<ResponseConf>
}
interface PromiseChain<T> {
  resolved: ResolveType<T> | ((config: RequestOptionsConf) => AxiosPromise)
  rejected?: RejectType
}

export default class Axios {
  interceptors: InterceptorsType
  defaults: RequestURLOptional

  constructor(defaultsSet: RequestURLOptional) {
    this.interceptors = {
      request: new InterceptorManager(),
      response: new InterceptorManager()
    }
    this.defaults = defaultsSet
  }

  request(configOrURL: RequestOptionsConf | string, conf?: RequestURLOptional): AxiosPromise {
    let config
    if (typeof configOrURL === 'string') {
      config = (conf as RequestOptionsConf) || {}
      config.url = configOrURL
    } else {
      config = configOrURL
    }
    // 自定义的config和默认config进行合并处理
    config = mergeConfig(this.defaults, config)

    config.method = config.method!.toLowerCase() as Method

    // 拦截器实现
    const chain: PromiseChain<any>[] = [
      {
        resolved: dispatchRequest,
        rejected: undefined
      }
    ]

    this.interceptors.request.__forEach__(interceptor => {
      chain.unshift(interceptor)
    })

    this.interceptors.response.__forEach__(interceptor => {
      chain.push(interceptor)
    })

    let promise = Promise.resolve(config)

    while (chain.length) {
      const { resolved, rejected } = chain.shift()!
      promise = promise.then(resolved, rejected)
    }

    return (promise as unknown) as AxiosPromise
  }

  get(url: string, conf?: RequestURLOptional): AxiosPromise {
    const config = __mixinConfig(url, 'get', conf)
    return this.request(config)
  }

  delete(url: string, conf?: RequestURLOptional): AxiosPromise {
    const config = __mixinConfig(url, 'delete', conf)
    return this.request(config)
  }

  head(url: string, conf?: RequestURLOptional): AxiosPromise {
    const config = __mixinConfig(url, 'head', conf)
    return this.request(config)
  }

  options(url: string, conf?: RequestURLOptional): AxiosPromise {
    const config = __mixinConfig(url, 'options', conf)
    return this.request(config)
  }

  post(url: string, data?: any, conf?: RequestURLOptional): AxiosPromise {
    const config = __mixinConfig(url, 'post', conf, data)
    return this.request(config)
  }

  put(url: string, data?: any, conf?: RequestURLOptional): AxiosPromise {
    const config = __mixinConfig(url, 'put', conf, data)
    return this.request(config)
  }

  patch(url: string, data?: any, conf?: RequestURLOptional): AxiosPromise {
    const config = __mixinConfig(url, 'patch', conf, data)
    return this.request(config)
  }

  getUri(config?: RequestURLOptional): string {
    config = mergeConfig(this.defaults, config)
    return transformURL(config as RequestOptionsConf)
  }
}

function __mixinConfig(
  url: string,
  method: Method,
  conf?: RequestURLOptional,
  data?: any
): RequestOptionsConf {
  if (data !== null && data !== undefined) {
    return Object.assign(conf || {}, {
      url,
      data,
      method
    })
  }
  return Object.assign(conf || {}, {
    url,
    method
  })
}
