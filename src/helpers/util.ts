let oToString = Object.prototype.toString

export function isObject(tar: any) {
  return typeof tar !== null && typeof tar === 'object'
}

export function isPlainObject(tar: any) {
  return oToString.call(tar) === '[object Object]'
}

export function isDate(tar: any): tar is Date {
  return oToString.call(tar) === '[object Date]'
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
