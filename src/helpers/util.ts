let oToString = Object.prototype.toString

export function isPlainObject(tar: any) {
  return oToString.call(tar) === '[object Object]'
}

export function isDate(tar: any): tar is Date {
  return oToString.call(tar) === '[object Date]'
}

export function isFormData(tar: any): tar is FormData {
  return tar instanceof FormData
}

export function isURLSearchParams(tar: any): tar is URLSearchParams {
  return tar instanceof URLSearchParams
}

export function encode(tar: any): string {
  let ret = encodeURIComponent(tar)
    .replace(/%40/g, '@')
    .replace(/%3a/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2c/gi, ',')
    .replace(/%20/g, '+') // 空格字符转换成 +
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')

  return ret
}

export function mixin<T, U>(to: T, from: U): T & U {
  for (const k in from) {
    // 将from的属性及原型链上的所有属性混入to
    ;((to as unknown) as U)[k] = from[k]
  }

  return to as U & T
}

export function deepMerge(...args: any[]) {
  const result = Object.create(null)

  args.forEach(obj => {
    if (!isPlainObject(obj)) return

    Object.keys(obj).forEach(key => {
      const val = obj[key]

      if (isPlainObject(val)) {
        if (result[key]) {
          result[key] = deepMerge(result[key], val)
        } else {
          result[key] = deepMerge(val)
        }
      } else {
        result[key] = val
      }
    })
  })

  return result
}
