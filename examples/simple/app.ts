import axios from '../../src/index'

axios({
  method: 'get',
  url: '/simple/get',
  validateStatus(status) {
    return status === 500
  },
  params: {
    a: 1,
    b: 2
  }
}).then(res => {
  console.log(res.status)
})