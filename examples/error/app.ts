import axios, { AxiosErrorConf } from '../../src/index'

axios({
  method: 'get',
  url: '/error/get1'
}).then((res) => {
  console.log(res)
}).catch((e: AxiosErrorConf) => {
  console.log(e.isAxiosError)
  // throw e
  console.log(e)
})

axios({
  method: 'get',
  url: '/error/get'
}).then((res) => {
  // console.log(res)
}).catch((e: AxiosErrorConf) => {
  // throw e
  console.log(e)
})

setTimeout(() => {
  axios({
    method: 'get',
    url: '/error/get'
  }).then((res) => {
    // console.log(res)
  }).catch((e: AxiosErrorConf) => {
    // throw e
    console.log(e)
  })
}, 5000)

axios({
  method: 'get',
  url: '/error/timeout',
  timeout: 2000
}).then((res) => {
  console.log(res)
}).catch((e: AxiosErrorConf) => {
  // throw e
  console.log(e)
})