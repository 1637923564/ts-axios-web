import {
  CONTENT_TYPE,
  RequestOptionsConf,
  ResponseConf,
  AxiosPromise,
  AxiosErrorConf
} from '../conf'
import { parseResponseHeaders } from '../helpers/processHeaders'
import { createError } from '../helpers/error'

function xhr(config: RequestOptionsConf): AxiosPromise {
  return new Promise((resolve, reject) => {
    const { data = null, method = 'get', url, headers = {}, responseType, timeout } = config

    const headerKeys = Object.keys(headers)
    const request = new XMLHttpRequest()

    if (responseType) {
      request.responseType = responseType
    }
    if (timeout) {
      request.timeout = timeout
    }

    request.open(method.toUpperCase(), url, true)

    request.onreadystatechange = () => {
      if (request.readyState !== 4) {
        return
      }

      const responseData = responseType === 'text' ? request.responseText : request.response
      const responseHeaders = parseResponseHeaders(request.getAllResponseHeaders())

      const responseInfo: ResponseConf = {
        config,
        data: responseData,
        headers: responseHeaders,
        request,
        status: request.status,
        statusText: request.statusText
      }

      // 非200状态码异常：
      statusError(responseInfo)
    }

    // 网络错误
    request.onerror = () => {
      reject(
        createError({
          name: 'AxiosError',
          message: 'Network Error',
          code: null,
          request,
          config
        })
      )
    }

    // 超时提示：
    request.ontimeout = () => {
      reject(
        createError({
          name: 'AxiosError',
          message: `Timeout of ${timeout} ms exceeded`,
          code: 'ECONNABORTED',
          request,
          config
        })
      )
    }

    headerKeys.forEach(key => {
      const val = headers[key]
      // 不向服务器传输数据时，不需要配置Content-Type
      if (data === null && key.toUpperCase() === CONTENT_TYPE.toUpperCase()) {
        delete headers[key]
      } else {
        request.setRequestHeader(key, val)
      }
    })

    request.send(data)

    function statusError(responseInfo: ResponseConf) {
      if (request.status >= 200 && request.status < 300) {
        resolve(responseInfo)
      } else {
        // 用setTimeout做异步处理，因为这个是onreadystatechange触发执行的，会先于其他事件，从而导其他reject函数不能执行
        setTimeout(() => {
          reject(
            createError({
              name: 'AxiosError',
              message: `Request failed with status code ${responseInfo.status}`,
              code: null,
              response: responseInfo,
              request,
              config
            })
          )
        })
      }
    }
  })
}

export default xhr
