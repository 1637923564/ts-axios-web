import Cancel, { isCancel } from './cancel/Cancel'
import CancelToken from './cancel/CancelToken'
import { AxiosConf, AxiosStatic, RequestURLOptional } from './conf'
import Axios from './core/Axios'
import defaultsSet from './core/default'
import mergeConfig from './core/mergeConfig'
import { mixin } from './helpers/util'

function __(defaults: RequestURLOptional): AxiosStatic {
  const context = new Axios(defaults)

  const _ = Axios.prototype.request.bind(context)

  // 这里实现了在一个函数上混入了 context 实例的所有方法和属性
  // context 是一个用class关键字声明的类的实例，它原型的方法是不可枚举，这里利用typescript编译成了es5，所以就可以枚举了。
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
axios.spread = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr)
  }
}
axios.Axios = Axios

export default axios
