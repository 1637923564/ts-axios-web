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
  ResponseConf,
  InterceptorManagerType
} from '../conf'

import dispatchRequest from './dispatchRequest'
import InterceptorManager from './interceptorManager'

interface InterceptorsType {
  request: InterceptorManager<RequestURLOptional>
  response: InterceptorManager<ResponseConf>
}
interface PromiseChain<T> {
  resolved: ResolveType<T> | ((config: RequestOptionsConf) => AxiosPromise)
  rejected?: RejectType
}

export default class Axios implements AxiosMethodSConf {
  interceptors: InterceptorsType

  constructor() {
    this.interceptors = {
      request: new InterceptorManager(),
      response: new InterceptorManager()
    }
  }

  request(configOrURL: RequestOptionsConf | string, conf?: RequestURLOptional): AxiosPromise {
    let config
    if (typeof configOrURL === 'string') {
      config = (conf as RequestOptionsConf) || {}
      config.url = configOrURL
    } else {
      config = configOrURL
    }
    // console.log(config)

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
