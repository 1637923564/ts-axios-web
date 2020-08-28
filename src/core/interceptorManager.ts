import { ResolveType, RejectType } from '../conf'

interface interceptorType<T> {
  resolved: ResolveType<T>
  rejected?: RejectType
}

export default class InterceptorManager<T> {
  private interceptors: Array<interceptorType<T> | null>

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

  __forEach__(fn: (interceptor: interceptorType<T>) => void) {
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
