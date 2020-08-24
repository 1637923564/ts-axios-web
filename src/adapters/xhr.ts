import { CONTENT_TYPE, RequestOptionsConf } from '../conf'

function xhr(config: RequestOptionsConf) {
  const { data = null, method = 'get', url, headers = {}} = config
  const headerKeys = Object.keys(headers)
  const request = new XMLHttpRequest()
  
  request.open(method.toUpperCase(), url)
  
  console.log(data);
  
  headerKeys.forEach(key => {
    const val = headers[key]
    // 不向服务器传输数据时，不需要配置Content-Type
    if (data === null && key.toUpperCase() === CONTENT_TYPE.toUpperCase()) {
      delete headers[key]
    } else {
      request.setRequestHeader(key, val)
    }
  })
  
  request.send(data)
}

export default xhr