import { AxiosConf, RequestOptionsConf } from './conf'
import Axios from './core/Axios'
import { mixin } from './helpers/util'

function __(): AxiosConf {
  const context = new Axios()

  const _ = Axios.prototype.request.bind(context)

  // 这里实现了在一个函数上混入了 context 实例的所有方法和属性
  const ret = mixin(_, context)

  return ret as AxiosConf
}

const axios = __()

export default axios
