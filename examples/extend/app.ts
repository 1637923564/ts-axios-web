import axios from '../../src/index'

axios({
  url: '/extend/post',
  method: 'post',
  data: {
    msg: 'hi'
  }
}).then(res => {
  console.log(res.data);
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
  console.log(res)
})

axios.get('/extend/get')

axios.options('/extend/options')

axios.delete('/extend/delete')

axios.head('/extend/head')

axios.post('/extend/post', { msg: 'post' })
  .then(res => {
    console.log(res)
  })

axios.put('/extend/put', { msg: 'put' })

axios.patch('/extend/patch', { msg: 'patch' })

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

function getUser<T>() {
  return axios<ResponseData<T>>('/extend/user')
    .then(res => res.data)
    .catch(err => console.error(err))
}


async function test() {
  const user = await getUser<User>()
  if (user) {
    console.log(user.result.age)
  }
}

test()

test()