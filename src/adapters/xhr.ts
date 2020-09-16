import { CONTENT_TYPE, RequestOptionsConf, ResponseConf, AxiosPromise } from '../conf'
import { parseResponseHeaders } from '../helpers/processHeaders'
import { createError } from '../helpers/error'
import { isSameOrigin } from '../helpers/buildURL'
import cookie from '../helpers/cookie'
import { isFormData } from '../helpers/util'

function xhr(config: RequestOptionsConf): AxiosPromise {
  return new Promise((resolve, reject) => {
    const {
      data = null,
      method = 'get',
      url,
      headers = {},
      responseType,
      timeout,
      cancelToken,
      withCredentials,
      xsrfCookieName,
      xsrfHeaderName,
      onDownloadProgress,
      onUploadProgress,
      auth,
      validateStatus
    } = config

    const request = new XMLHttpRequest()

    request.responseType = responseType || ''
    request.timeout = timeout!
    request.withCredentials = withCredentials || false

    request.open(method.toUpperCase(), url, true)

    request.onprogress = onDownloadProgress ? onDownloadProgress : null

    request.upload.onprogress = onUploadProgress ? onUploadProgress : null

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

      // 状态码错误：
      statusCodeResolve(responseInfo)
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

    // 设置xsrf请求头
    if (withCredentials || (isSameOrigin(url) && xsrfCookieName)) {
      // 如果存在一个名为 xsrfCookieName 的 cookie，则返回它的值。
      const xsrfHeaderValue = cookie.read(xsrfCookieName)
      if (xsrfHeaderName && xsrfHeaderValue) {
        headers[xsrfHeaderName] = xsrfHeaderValue
      }
    }

    if (auth) {
      // 添加一个请求头 Authorization（一般用于验证用户代理身份的凭证）
      headers['Authorization'] = 'Basic ' + btoa(`${auth.username}:${auth.password}`)
    }

    const headerKeys = Object.keys(headers)
    // 设置请求头
    headerKeys.forEach(key => {
      const val = headers[key]
      // 不向服务器传输数据时，不需要配置Content-Type;
      // 当传输的数据为FormData类型时，浏览器会默认添加Content-Type：'multipart/form-data'
      if ((data === null || isFormData(data)) && key.toUpperCase() === CONTENT_TYPE.toUpperCase()) {
        delete headers[key]
      } else {
        request.setRequestHeader(key, val)
      }
    })

    // 取消发送请求
    if (cancelToken) {
      cancelToken.promise.then(reason => {
        request.abort()
        reject(reason)
      })
    }

    request.send(data)

    function statusCodeResolve(responseInfo: ResponseConf) {
      if (validateStatus!(request.status)) {
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
