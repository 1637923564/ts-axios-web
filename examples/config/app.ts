import axios, { TransformFnType } from '../../src/index'
import qs from 'qs'

// console.log(qs.stringify({a: 1, b: 2}));


// axios.defaults.headers.common['test2'] = 123

// axios({
//   url: '/config/post',
//   method: 'post',
//   data: qs.stringify({
//     a: 1
//   }),
//   headers: {
//     test: '321'
//   }
// }).then((res) => {
//   console.log(res.data)
// })

axios({
  transformRequest: [
    (function(data) {
      return qs.stringify(data)
    }), 
    ...(axios.defaults.transformRequest as TransformFnType[])
  ],
  transformResponse: [
    ...(axios.defaults.transformResponse as TransformFnType[]), 
    function(data) {
      if (typeof data === 'object') {
        data.b = 2
      }
      return data
    }
  ],
  url: '/config/post',
  method: 'post',
  data: {
    a: 1
  }
}).then((res) => {
  console.log(res)
})