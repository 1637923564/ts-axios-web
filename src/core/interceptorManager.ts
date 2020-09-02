import { ResolveType, RejectType } from '../conf'

interface InterceptorType<T> {
  resolved: ResolveType<T>
  rejected?: RejectType
}

export default class InterceptorManager<T> {
  private interceptors: Array<InterceptorType<T> | null>

  constructor() {
    this.interceptors = []
  }

  use(resolved: ResolveType<T>, rejected?: RejectType): number {
    const currentLength = this.interceptors.push({
      resolved,
      rejected
    })
    return currentLength - 1
  }

  __forEach__(fn: (interceptor: InterceptorType<T>) => void) {
    this.interceptors.forEach(interceptor => {
      if (interceptor !== null) {
        fn(interceptor)
      }
    })
  }

  eject(id: number) {
    this.interceptors[id] = null
  }
}
