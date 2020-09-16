import Cancel, { isCancel } from './cancel/Cancel'
import CancelToken from './cancel/CancelToken'
import { AxiosConf, AxiosStatic, RequestURLOptional } from './conf'
import Axios from './core/Axios'
import defaultsSet from './core/default'
import mergeConfig from './core/mergeConfig'
import { mixin } from './helpers/util'

function __(defaults: RequestURLOptional): AxiosStatic {
  const context = new Axios(defaults)

  // _ 为 Axios 原型上的 request 方法
  // request 方法使用了 this 关键字，所以它的 this 必须指向 Axios 的实例
  const _ = Axios.prototype.request.bind(context)

  // 这里实现了在一个函数 _ 上混入了 context 实例的所有方法和属性
  // typescript 将 es6 编译成了 es5，所以该类(用 class 声明的类)原型上的方法可枚举
  const ret = mixin(_, context)

  return (ret as unknown) as AxiosStatic
}

const axios = __(defaultsSet)

// 为axios添加create方法
axios.create = (config?: RequestURLOptional): AxiosConf => {
  return __(mergeConfig(defaultsSet, config))
}

axios.Cancel = Cancel
axios.isCancel = isCancel
axios.CancelToken = CancelToken
axios.all = arr => {
  return Promise.all(arr)
}
axios.spread = callback => {
  return arr => {
    return callback.apply(null, arr)
  }
}
axios.Axios = Axios

export default axios
