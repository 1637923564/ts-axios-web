import { buildURL, isAbsoluteURL, connectURL, isSameOrigin } from '../../src/helpers/buildURL'

describe('helper: buildURL', () => {
  describe('buildURL', () => {
    test('should support null params', () => {
      expect(buildURL('/foo')).toBe('/foo')
    })

    test('should support params', () => {
      const params = { foo: 'bar' }

      expect(buildURL('/foo', params)).toBe('/foo?foo=bar')
    })

    test('should ignore if some param value is null', () => {
      const params = { foo: 'bar', baz: null }

      expect(buildURL('/foo', params)).toBe('/foo?foo=bar')
    })

    test('should ignore if the only param value is null', () => {
      const params = { foo: null }

      expect(buildURL('/foo', params)).toBe('/foo')
    })

    test('should support the params value with plain object', () => {
      const params = {
        foo: { bar: 'baz' }
      }

      expect(buildURL('/foo', params)).toBe(`/foo?foo=${encodeURI(JSON.stringify(params.foo))}`)
    })

    test('should support date param', () => {
      const params = { date: new Date() }

      expect(buildURL('/foo', params)).toBe(`/foo?date=${params.date.toISOString()}`)
    })

    test('should support array params', () => {
      const params = {
        foo: ['bar', 'baz']
      }

      expect(buildURL('/foo', params)).toBe('/foo?foo[]=bar&foo[]=baz')
    })

    test('should support special char params', () => {
      const params = { foo: '@:$, ' }

      expect(buildURL('/foo', params)).toBe('/foo?foo=@:$,+')
    })

    test('should support existing params', () => {
      const params = { bar: 'baz' }

      expect(buildURL('/foo?foo=bar', params)).toBe('/foo?foo=bar&bar=baz')
    })

    test('should correct discard url hash mark', () => {
      const params = { query: 'baz' }

      expect(buildURL('/foo?foo=bar#hash', params)).toBe('/foo?foo=bar&query=baz')
    })

    test('should use serializer if provided', () => {
      const serializer = jest.fn(() => {
        return 'foo=bar'
      })
      const params = { foo: 'bar' }

      expect(buildURL('/foo', params, serializer)).toBe('/foo?foo=bar')
      expect(serializer).toHaveBeenCalled()
      expect(serializer).toHaveBeenCalledWith(params)
    })

    test('should support URLSearchParams', () => {
      const params = new URLSearchParams('bar=baz')

      expect(buildURL('/foo', params)).toBe('/foo?bar=baz')
    })
  })

  describe('isAbsulteURL', () => {
    test('should return true if the URL starts with a valid protocol name', () => {
      expect(isAbsoluteURL('https://api.github.com/users')).toBeTruthy()
      expect(isAbsoluteURL('custom-scheme-v1.0://example.com/')).toBeTruthy()
      expect(isAbsoluteURL('HTTP://example.com/')).toBeTruthy()
      expect(isAbsoluteURL('file://example/com/')).toBeTruthy()
    })

    test('should return false if the URL starts with invalid protocol name', () => {
      expect(isAbsoluteURL('123://example.com/')).toBeFalsy()
      expect(isAbsoluteURL('!valid://example.com/')).toBeFalsy()
    })

    test('should return true if the URL is protocol-relative', () => {
      expect(isAbsoluteURL('//example.com/')).toBeTruthy()
    })

    test('should return false if the URL is relative', () => {
      expect(isAbsoluteURL('/foo')).toBeFalsy()
      expect(isAbsoluteURL('foo')).toBeFalsy()
    })
  })

  describe('connectURL', () => {
    test('should combine URL', () => {
      const absolute = 'https://api.github.com'
      const relative = '/users'
      const expected = 'https://api.github.com/users'

      expect(connectURL(absolute, relative)).toBe(expected)
    })

    test('should remove duplicate slashes', () => {
      const absolute = 'https://api.github.com/'
      const relative = '/users'
      const expected = 'https://api.github.com/users'

      expect(connectURL(absolute, relative)).toBe(expected)
    })

    test('should insert missing slash', () => {
      const absolute = 'https://api.github.com'
      const relative = 'users'
      const expected = 'https://api.github.com/users'

      expect(connectURL(absolute, relative)).toBe(expected)
    })

    test('should not insert slash when relative url missing/empty', () => {
      const absolute = 'https://api.github.com/users'
      const relative = ''
      const expected = 'https://api.github.com/users/'

      expect(connectURL(absolute, relative)).toBe(expected)
    })

    test('should allow a single slash for relative url', () => {
      const absolute = 'https://api.github.com/users'
      const relative = '/'
      const expected = 'https://api.github.com/users/'

      expect(connectURL(absolute, relative)).toBe(expected)
    })
  })

  describe('isSameOrigin', () => {
    test('should detect same origin', () => {
      expect(isSameOrigin(window.location.href)).toBeTruthy()
    })

    test('should detect different origin', () => {
      expect(isSameOrigin('https://github.com/axios/axios')).toBeFalsy()
    })
  })
})
