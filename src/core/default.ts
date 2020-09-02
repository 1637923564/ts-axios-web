import { RequestURLOptional, MethodsCollection } from '../conf'
import { normalizeHeaders } from '../helpers/processHeaders'
import { normalizeRequest, parseResponse } from '../helpers/processData'

const defaultsSet: RequestURLOptional = {
  method: 'get',
  timeout: 0,
  xsrfHeaderName: 'X-XSRF-TOKEN',
  xsrfCookieName: 'XSRF-TOKEN',
  transformRequest: [
    function(data, headers) {
      normalizeHeaders(headers, data)
      return normalizeRequest(data)
    }
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
