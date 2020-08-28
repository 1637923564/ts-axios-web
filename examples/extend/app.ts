import axios from '../../src/index'

axios.defaults.headers.post = {
  name: 'laowang',
  lao: 'sdfkjs',
  age: 123
}

axios({
  url: '/extend/post',
  method: 'post',
  data: {
    msg: 'hi'
  }
}).then(res => {
  console.log(res);
})

axios('/extend/post', {
  method: 'post',
  data: {
    msg: 'hi'
  }
}).then(res => {
  console.log(res.data.msg);
})

axios.request({
  url: '/extend/post',
  method: 'post',
  data: {
    msg: 'hello'
  }
}).then(res => {
  console.log(res.data)
})

axios.get('/extend/get')
  .then(res => {
    console.log(res)
  })

axios.options('/extend/options')
  .then(res => {
    console.log(res)
  })

axios.delete('/extend/delete')
  .then(res => {
    console.log(res)
  })

axios.head('/extend/head')
  .then(res => {
    console.log(res)
  })

axios.post('/extend/post', { msg: 'post' })
  .then(res => {
    console.log(res)
  })

axios.put('/extend/put', { msg: 'put' })
  .then(res => {
    console.log(res);
  })

axios.patch('/extend/patch', { msg: 'patch' })
  .then(res => {
    console.log(res)
  })

interface ResponseData<T = any> {
  code: number
  result: T
  message: string
}

interface User {
  name: string
  age: number
}

axios<ResponseData<User>>('/extend/user')
  .then(res => {
    console.log(res.data.result.name)
  })
  .catch(err => console.error(err))

// function getUser<T>() {
//   return axios<ResponseData<T>>('/extend/user')
//     .then(res => res.data)
//     .catch(err => console.error(err))
// }


// async function test() {
//   const user = await getUser<User>()
//   if (user) {
//     console.log(user)
//   }
// }

// test()