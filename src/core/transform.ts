import { TransformFnType } from '../conf'

export default function transform(
  data: any,
  headers: any,
  fns: TransformFnType[] | TransformFnType
) {
  if (!data) {
    return
  }
  if (!Array.isArray(fns)) {
    fns = [fns]
  }

  fns.forEach(fn => {
    data = fn(data, headers)
  })

  return data
}
