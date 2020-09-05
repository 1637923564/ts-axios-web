import { normalizeRequest, parseResponse } from '../../src/helpers/processData'

describe('helper: processData', () => {
  describe('normalizeRequest', () => {
    test('shouldn`t change if data not plain object', () => {
      const data1 = 'hello'
      const data2 = JSON.stringify({ foo: 123, bar: 456 })
      const data3 = new URLSearchParams()
      data3.append('foo', '123')

      expect(normalizeRequest(data1)).toBe(data1)
      expect(normalizeRequest(data2)).toBe(data2)
      expect(normalizeRequest(data3)).toBe(data3)
    })

    test('should be return JSON string if data is plain object', () => {
      const data = { foo: 123, bar: 456 }

      expect(normalizeRequest(data)).toBe(JSON.stringify(data))
    })
  })

  describe('parseResponse', () => {
    test('should be return plain object if data is JSON string', () => {
      const data = JSON.stringify({ foo: 'bar' })

      expect(parseResponse(data)).toEqual({ foo: 'bar' })
    })

    test('shouldn`t change if data is string but not a JSON string', () => {
      const data = '{foo: bar}'

      expect(parseResponse(data)).toBe('{foo: bar}')
    })

    test('shouldn`t change if data isn`t a string', () => {
      const data = { a: 12 }

      expect(parseResponse(data)).toEqual({ a: 12 })
    })
  })
})
