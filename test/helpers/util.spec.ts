import {
  isPlainObject,
  isDate,
  isFormData,
  isURLSearchParams,
  mixin,
  deepMerge,
  encode
} from '../../src/helpers/util'

describe('helper: util', () => {
  describe('isXXX', () => {
    test('isPlainObject', () => {
      expect(isPlainObject({})).toBeTruthy()
      expect(isPlainObject(Date.now())).toBeFalsy()
    })

    test('idDate', () => {
      expect(isDate(new Date())).toBeTruthy()
      expect(isDate(Date.now())).toBeFalsy()
    })

    test('isFormData', () => {
      expect(isFormData(new FormData())).toBeTruthy()
      expect(isFormData({})).toBeFalsy()
    })

    test('isURLSearchParams', () => {
      expect(isURLSearchParams(new URLSearchParams())).toBeTruthy()
      expect(isURLSearchParams('a=1&b=3')).toBeFalsy()
    })
  })

  describe('mixin', () => {
    test('should be mutable', () => {
      const a = Object.create(null)
      const b = { foo: 123, boo: 'test boo' }

      mixin(a, b)

      expect(a.foo).toBe(123)
      expect(a.boo).toBe('test boo')
    })

    test('should be merge', () => {
      const a = { foo: 123, bar: 456 }
      const b = { bar: 789 }
      const c = mixin(a, b)

      expect(c.foo).toBe(123)
      expect(c.bar).toBe(789)
    })
  })

  describe('deepMerge', () => {
    test('should be immutable', () => {
      const a = Object.create(null)
      const b: any = { foo: 123 }
      const c: any = { bar: 456 }

      deepMerge(a, b, c)

      expect(a.foo).toBe(undefined)
      expect(a.bar).toBe(undefined)
      expect(b.foo).toBe(123)
      expect(b.bar).toBe(undefined)
      expect(c.foo).toBe(undefined)
      expect(c.bar).toBe(456)
    })

    test('should be deep merged', () => {
      const a = { foo: 123 }
      const b = { bar: 456 }
      const c = { foo: 789 }
      const d = deepMerge(a, b, c)

      expect(d.foo).toBe(789)
      expect(d.bar).toBe(456)
    })

    test('should deep merge recursively', () => {
      const a = { foo: { bar: 123 } }
      const b = { foo: { baz: 456 }, bar: { qux: 789 } }
      const c = deepMerge(a, b)

      expect(c).toEqual({
        foo: { bar: 123, baz: 456 },
        bar: { qux: 789 }
      })
    })

    test('should remove all references from nested objects', () => {
      const a = { foo: { bar: 123 } }
      const b = {}
      const c = deepMerge(a, b)

      expect(c).toEqual({ foo: { bar: 123 } })
      expect(c.foo).not.toBe(a.foo)
    })

    test('should handle null and undefined argument', () => {
      expect(deepMerge(undefined, undefined)).toEqual({})
      expect(deepMerge(undefined, { foo: 123 })).toEqual({ foo: 123 })
      expect(deepMerge({ foo: 123 }, undefined)).toEqual({ foo: 123 })
      expect(deepMerge(null, null)).toEqual({})
      expect(deepMerge(null, { foo: 123 })).toEqual({ foo: 123 })
      expect(deepMerge({ foo: 123 }, null)).toEqual({ foo: 123 })
    })
  })

  describe('encode', () => {
    test('should be to URL code', () => {
      expect(encode('您好')).toBe('%E6%82%A8%E5%A5%BD')
    })

    test('should stay the same', () => {
      // @ : , + [ ] ，这些符号不应该被转换成URI编码
      expect(encode('http://@.baidu.com?a=3 2&b=$&c=,&foo[]=12')).toBe(
        'http:%2F%2F@.baidu.com%3Fa%3D3+2%26b%3D$%26c%3D,%26foo[]%3D12'
      )
    })
  })
})
