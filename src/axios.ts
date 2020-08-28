import { AxiosConf, RequestOptionsConf } from './conf'
import Axios from './core/Axios'
import { mixin } from './helpers/util'

function __(): AxiosConf {
  const context = new Axios()

  const _ = Axios.prototype.request.bind(context)

  // 这里实现了在一个函数上混入了 context 实例的所有方法和属性
  // context 是一个用class关键字声明的类的实例，它原型的方法是不可枚举，这里利用typescript编译成了es5，所以就可以枚举了。
  const ret = mixin(_, context)

  return ret as AxiosConf
}

const axios = __()

export default axios
