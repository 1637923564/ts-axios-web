import axios, { ResponseConf } from '../../src/index'

// axios({
//   method: 'get',
//   url: '/simple/get',
//   validateStatus(status) {
//     return status <= 500
//   },
//   params: {
//     a: 1,
//     b: 2
//   }
// }).then(res => {
//   console.log(res.status)
// })

// axios.post('/base/post', 'fizz=buzz')

const instance = axios.create()

instance.interceptors.response.use(() => {
  return {
    data: 'stuff',
    headers: null,
    status: 500,
    statusText: 'ERR',
    request: null,
    config: {}
  } as ResponseConf
})

instance('/simple/get').then(res => {
  console.log(res)
})