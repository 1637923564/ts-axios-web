import { RequestURLOptional, MethodsCollection } from '../conf'

const defaultsSet: RequestURLOptional = {
  method: 'get',
  timeout: 0,
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
