// axios.get / delete / head / options(url, config?)
// axios.post / put / patch(url, data?, config?)
import {
  AxiosPromise,
  Method,
  RequestOptionsConf,
  RequestURLOptional,
  AxiosMethodSConf
} from '../conf'

import dispatchRequest from './dispatchRequest'

export default class Axios implements AxiosMethodSConf {
  request(configOrURL: RequestOptionsConf | string, conf?: RequestURLOptional): AxiosPromise {
    let config
    if (typeof configOrURL === 'string') {
      config = (conf as RequestOptionsConf) || {}
      config.url = configOrURL
    } else {
      config = configOrURL
    }

    return dispatchRequest(config)
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
