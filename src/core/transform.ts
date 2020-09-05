import { TransformFnType } from '../conf'

export default function transform(
  data: any,
  headers: any,
  fns?: TransformFnType[] | TransformFnType
) {
  if (!fns) {
    return data
  }
  if (!Array.isArray(fns)) {
    fns = [fns]
  }

  fns.forEach(fn => {
    if (fn(data, headers) !== undefined) {
      data = fn(data, headers)
    }
  })

  return data
}
