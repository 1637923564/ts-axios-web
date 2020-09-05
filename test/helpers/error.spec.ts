import { createError } from '../../src/helpers/error'

describe('helper: error', () => {
  test('should create a Error', () => {
    const request = new XMLHttpRequest()
    const config = { url: 'http://baidu.com' }
    const testError = createError({
      name: 'testError',
      message: 'this is a test',
      code: 'ERROR_CODE',
      config,
      request,
      response: {
        status: 200,
        statusText: 'OK',
        headers: null,
        request,
        config,
        data: { foo: 'bar' }
      }
    })

    expect(testError instanceof Error).toBeTruthy()
    expect(testError.name).toBe('testError')
    expect(testError.message).toBe('this is a test')
    expect(testError.code).toBe('ERROR_CODE')
    expect(testError.config).toBe(config)
    expect(testError.request).toBe(request)
    expect(testError.isAxiosError).toBeTruthy()
    expect(testError.response).toEqual({
      status: 200,
      statusText: 'OK',
      headers: null,
      request,
      config,
      data: { foo: 'bar' }
    })
  })
})
