export default class Cancel {
  message?: string

  constructor(message?: string) {
    this.message = message
  }
}

export function isCancel(info: any) {
  return info instanceof Cancel
}
