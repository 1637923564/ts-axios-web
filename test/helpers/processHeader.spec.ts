import {
  mergeHeaders,
  normalizeHeaders,
  parseResponseHeaders
} from '../../src/helpers/processHeaders'

describe('helper: proccesHeader', () => {
  describe('normalizeHeaders', () => {
    test('should be return a plain object with property `Content-Type` value of `application/json;charset=utf-8` if data is a JSON string', () => {
      const headers = { baz: 123 }
      const data = JSON.stringify({ foo: 'bar' })
      const testHeaders = normalizeHeaders(headers, data)

      expect(testHeaders['Content-Type']).toBe('application/json;charset=utf-8')
      expect(testHeaders.baz).toBe(123)
    })

    test('shouldn`t change if data isn`t a JSON string', () => {
      const headers = { baz: 123 }
      const data = '{foo: bar}'
      const testHeaders = normalizeHeaders(headers, data)

      expect(testHeaders).toEqual({ baz: 123 })
    })

    test('should be standardized Content-Type if data isn`t a JSON string', () => {
      const headers = { 'Content-length': 1024, 'COnTENt-TyPE': 'test content-type' }
      const data = '{foo: bar}'
      const testHeaders = normalizeHeaders(headers, data)

      expect(testHeaders['Content-Type']).toBe('test content-type')
      expect(testHeaders['COnTENt-TyPE']).toBeUndefined()
      expect(testHeaders['Content-length']).toBe(1024)
    })

    test('should be standardized Content-Type if data is a JSON string', () => {
      const headers = { baz: 123, 'COnTENt-TyPE': 'test content-type' }
      const data = JSON.stringify({ foo: 'bar' })
      const testHeaders = normalizeHeaders(headers, data)

      expect(testHeaders['Content-Type']).toBe('test content-type')
    })

    test('should return headers with `Content-Type` if header is null or undefined', () => {
      const data = JSON.stringify({})
      expect(normalizeHeaders(null, data)).toEqual({
        'Content-Type': 'application/json;charset=utf-8'
      })
      expect(normalizeHeaders(undefined, data)).toEqual({
        'Content-Type': 'application/json;charset=utf-8'
      })
    })

    test('should return headers with `Content-Type` if data is a plain Object', () => {
      const headers = { foo: 'bar' }

      const testHeaders = normalizeHeaders(headers, {})

      expect(testHeaders['Content-Type']).toBe('application/json;charset=utf-8')
    })

    test('should only normalize Content-Type if data is a string', () => {
      const headers = { foo: 'bar' }

      const testHeaders = normalizeHeaders(headers, '')

      expect(testHeaders['Content-Type']).toBeUndefined()
    })

    test('should do nothing if data isn`t JSON string and header is null or undefined', () => {
      const data = 'a=b'
      expect(normalizeHeaders(null, data)).toEqual({})
      expect(normalizeHeaders(undefined, data)).toEqual({})
    })
  })

  describe('parseResponseHeaders', () => {
    test('should parse headers', () => {
      const parsed = parseResponseHeaders(
        'Content-Type: application/json\r\n' +
          'Connection: keep-alive\r\n' +
          'Transfer-Encoding: chunked\r\n' +
          'Date: Tue, 21 May 2019 09:23:44 GMT\r\n' +
          ':aa\r\n' +
          'key:'
      )

      expect(parsed['content-type']).toBe('application/json')
      expect(parsed['connection']).toBe('keep-alive')
      expect(parsed['transfer-encoding']).toBe('chunked')
      expect(parsed['date']).toBe('Tue, 21 May 2019 09:23:44 GMT')
      expect(parsed['key']).toBe('')
    })

    test('should return empty object if params is a emty string', () => {
      expect(parseResponseHeaders('')).toEqual({})
    })
  })

  describe('mergeHeaders', () => {
    test('should flatten the headers and include common headers', () => {
      const headers = {
        Accept: 'application/json',
        common: {
          'X-COMMON-HEADER': 'commonHeaderValue'
        },
        get: {
          'X-GET-HEADER': 'getHeaderValue'
        },
        post: {
          'X-POST-HEADER': 'postHeaderValue'
        }
      }

      expect(mergeHeaders(headers, 'GET')).toEqual({
        Accept: 'application/json',
        'X-COMMON-HEADER': 'commonHeaderValue',
        'X-GET-HEADER': 'getHeaderValue'
      })
      expect(mergeHeaders(headers, 'post')).toEqual({
        Accept: 'application/json',
        'X-COMMON-HEADER': 'commonHeaderValue',
        'X-POST-HEADER': 'postHeaderValue'
      })
    })

    test('should do nothing if headers is undefined or null', () => {
      expect(mergeHeaders(null, 'get')).toBe(null)
      expect(mergeHeaders(undefined, 'get')).toBe(undefined)
    })

    test('should flatten the headers without common headers', () => {
      const headers = {
        Accept: 'application/json',
        get: {
          'X-GET-HEADER': 'getHeaderValue'
        }
      }

      expect(mergeHeaders(headers, 'patch')).toEqual({
        Accept: 'application/json'
      })
    })
  })
})
