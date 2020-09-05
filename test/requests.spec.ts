import { done } from 'nprogress'
import axios, { AxiosErrorConf, ResponseConf } from '../src/index'
import { getAjaxRequest } from './helper'

describe('requests', () => {
  beforeEach(() => {
    jasmine.Ajax.install()
  })

  afterEach(() => {
    jasmine.Ajax.uninstall()
  })

  test('should treat single string arg as url', () => {
    axios('/foo')

    return getAjaxRequest().then(request => {
      expect(request.url).toBe('/foo')
      expect(request.method).toBe('GET')
    })
  })

  test('should treat method value as lowercase string', done => {
    axios('/foo', {
      method: 'POST'
    }).then(res => {
      expect(res.config.method).toBe('post')
      done()
    })

    getAjaxRequest().then(request => {
      request.respondWith({
        status: 200
      })
    })
  })

  test('should reject on network errors', done => {
    const resolveSpy = jest.fn((res: ResponseConf) => {
      return res
    })

    const rejectSpy = jest.fn((e: AxiosErrorConf) => {
      return e
    })

    jasmine.Ajax.uninstall()

    axios('/foo')
      .then(resolveSpy)
      .catch(rejectSpy)
      .then(next)

    function next(reason: ResponseConf | AxiosErrorConf) {
      expect(resolveSpy).not.toHaveBeenCalled()
      expect(rejectSpy).toHaveBeenCalled()
      expect(reason instanceof Error).toBeTruthy()
      expect((reason as AxiosErrorConf).name).toBe('AxiosError')
      expect((reason as AxiosErrorConf).message).toBe('Network Error')
      expect(reason.request).toEqual(expect.any(XMLHttpRequest))

      jasmine.Ajax.install()

      done()
    }
  })

  test('should reject when timeout', done => {
    const resolveSpy = jest.fn((res: ResponseConf) => {
      return res
    })

    const rejectSpy = jest.fn((e: AxiosErrorConf) => {
      return e
    })

    axios('/foo', {
      timeout: 3000,
      method: 'post'
    })
      .then(resolveSpy)
      .catch(rejectSpy)
      .then(next)

    getAjaxRequest().then(request => {
      // @ts-ignore
      request.eventBus.trigger('timeout')
    })

    function next(reason: AxiosErrorConf | ResponseConf) {
      expect(resolveSpy).not.toHaveBeenCalled()
      expect(rejectSpy).toHaveBeenCalled()
      expect(reason instanceof Error).toBeTruthy()
      expect((reason as AxiosErrorConf).name).toBe('AxiosError')
      expect((reason as AxiosErrorConf).message).toBe('Timeout of 3000 ms exceeded')

      done()
    }
  })

  // test('should reject when `validateStatus` returns false', () => {
  //   const resolveSpy = jest.fn((res: ResponseConf) => {
  //     return res
  //   })

  //   const rejectSpy = jest.fn((e: AxiosErrorConf) => {
  //     return e
  //   })

  //   axios('/foo', {
  //     validateStatus(status) {
  //       return status !== 500
  //     }
  //   })
  //     .then(resolveSpy)
  //     .catch(rejectSpy)
  //     .then(next)

  //   getAjaxRequest().then(request => {
  //     request.respondWith({
  //       status: 500
  //     })
  //   })

  //   function next(reason: AxiosErrorConf | ResponseConf) {
  //     expect(resolveSpy).not.toHaveBeenCalled()
  //     expect(rejectSpy).toHaveBeenCalled()
  //     expect(reason instanceof Error).toBeTruthy()
  //     expect((reason as AxiosErrorConf).message).toBe('Request failed with status code 500')
  //     expect((reason as AxiosErrorConf).response!.status).toBe(500)

  //     done()
  //   }
  // })

  test('should resolve when `validateStatus` returns true', done => {
    const resolveSpy = jest.fn((res: ResponseConf) => {
      return res
    })

    const rejectSpy = jest.fn((e: AxiosErrorConf) => {
      return e
    })

    axios('/foo', {
      validateStatus(status) {
        return status === 500
      }
    })
      .then(resolveSpy)
      .catch(rejectSpy)
      .then(next)

    getAjaxRequest().then(request => {
      request.respondWith({ status: 500 })
    })

    function next(reason: AxiosErrorConf | ResponseConf) {
      expect(resolveSpy).toHaveBeenCalled()
      expect(rejectSpy).not.toHaveBeenCalled()
      expect((reason as ResponseConf).status).toBe(500)
      expect((reason as ResponseConf).config.url).toBe('/foo')

      done()
    }
  })

  test('should return JSON when resolved', done => {
    jasmine.Ajax.uninstall()
    jasmine.Ajax.install()
    let response: ResponseConf

    axios('/api/account/signup', {
      auth: {
        username: '',
        password: ''
      },
      method: 'post',
      headers: {
        Accept: 'application/json'
      }
    }).catch(error => {
      response = error.response
    })

    getAjaxRequest().then(request => {
      request.respondWith({
        status: 400,
        statusText: 'Bad Request',
        responseText: '{"error": "BAD USERNAME", "code": 1}'
      })

      setTimeout(() => {
        expect(response.data).toEqual({ error: 'BAD USERNAME', code: 1 })
        expect(response.data.error).toBe('BAD USERNAME')
        expect(response.data.code).toBe(1)
        done()
      }, 100)
    })
  })
})
