import { encode, isDate, isPlainObject } from './util'

export function buildURL(url: string, params?: any): string {
  // 删除hash
  let hashIndex = url.indexOf('#')
  url = hashIndex === -1 ? url : url.slice(0, hashIndex)

  if (!params) {
    return url
  }

  let ports: string[] = []
  const keys = Object.keys(params)
  keys.forEach(key => {
    let k = key, val = params[key]
    
    if (val === null || val === undefined) {
      return
    }

    let values: string[]

    if (Array.isArray(val)) {
      // 如果 params 的某个属性的值是数组，如：foo: ['老李', '老刘']，将它转换成：foo[]=老李&&foo[]=老刘
      k += '[]'
      values = val
    } else {
      values = [val]
    }

    values.forEach(val => {
      if (isDate(val)) {
        // params 的某个属性是Date的实例，如：date: new Date()，将它转换成一个ISO的时间格式： YYYY-MM-DDTHH:mm:ss.sssZ
        val = val.toISOString()
      } else if (isPlainObject(val)) {
        // encodeURIComponent 不会转化单引号，所以需要转换成双引号
        val = JSON.stringify(val)
      }
      // 将 params 转换成URLEncode编码，这些字符不需要转换：@ : $ , [ ]，空格字符转换成 + 
      ports.push(`${encode(k)}=${encode(val)}`)
    })
  })
  

  let urlSearchParams = ports.join('&')

  if (urlSearchParams) {
    // 将拼接url与处理过的params进行拼接
    url += url.indexOf('?') === -1 ? `?${urlSearchParams}` : `&${urlSearchParams}`
  }
  return url
}