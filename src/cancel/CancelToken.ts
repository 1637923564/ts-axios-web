import { Canceler, CancelExecutor, CancelTokenSource } from '../conf'
import Cancel from './Cancel'

export default class CancelToken {
  promise: Promise<Cancel>
  reason: Cancel | null

  constructor(executor: CancelExecutor) {
    this.reason = null

    let newResolve: (message: Cancel) => any
    this.promise = new Promise(resolve => {
      newResolve = resolve
    })
    executor(message => {
      if (this.reason) return

      this.reason = new Cancel(message)
      newResolve(this.reason)
    })
  }

  throwIfRequested() {
    if (this.reason) {
      throw this.reason
    }
  }

  static source(): CancelTokenSource {
    let cancel!: Canceler
    const token = new CancelToken(c => {
      cancel = c
    })

    return {
      cancel,
      token
    }
  }
}
