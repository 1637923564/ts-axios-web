import { RequestURLOptional, MethodsCollection } from '../conf'
import { normalizeHeaders } from '../helpers/processHeaders'
import { normalizeRequest, parseResponse } from '../helpers/processData'

// 设定一个默认的配置
const defaultsSet: RequestURLOptional = {
  method: 'get',
  timeout: 0,
  xsrfHeaderName: 'X-XSRF-TOKEN',
  xsrfCookieName: 'XSRF-TOKEN',
  transformRequest: [
    function(data, headers) {
      normalizeHeaders(headers, data)
      data = normalizeRequest(data)
      return data
    },
    function() {}
  ],
  transformResponse: [
    function(data) {
      return parseResponse(data)
    }
  ],
  headers: {
    common: {
      Accept: 'application/json, text/plain, */*'
    }
  },
  validateStatus(status: number) {
    return status >= 200 && status < 300
  }
}

const methodsWithData: string[] = [
  MethodsCollection.POST,
  MethodsCollection.PUT,
  MethodsCollection.PATCH
]

const methodsWithoutData: string[] = [
  MethodsCollection.GET,
  MethodsCollection.DELETE,
  MethodsCollection.OPTIONS,
  MethodsCollection.HEAD
]

methodsWithData.forEach(method => {
  defaultsSet.headers[method] = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

methodsWithoutData.forEach(method => {
  defaultsSet.headers[method] = {}
})

export default defaultsSet
