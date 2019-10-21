import {
  JsonRpcMethod,
  JsonRpcMiddleware,
  RpcId,
  JsonRpcParams,
  JsonRpcError,
  OK,
} from '../../main/ts'

import reqresnext from 'reqresnext'

describe('expressjs-json-rpc', () => {
  describe('JsonRpcMiddleware', () => {
    class Abc {

      a?: string
      b?: number

      constructor(raw: any) {
        Object.assign(this, raw)
      }

    }

    @JsonRpcMiddleware()
    class SomeJsonRpcController {

      middleware: any
      @JsonRpcMethod('test1')
      bar(@RpcId() id: string) {
        return {foo: 'bar', id}
      }

      @JsonRpcMethod('test2')
      qux(@RpcId() id: string, @JsonRpcParams() {a, b}: Abc) {
        return {foo: 'quxr', id, a, b}
      }

      @JsonRpcMethod('get-some-error')
      getSomeError() {
        return new JsonRpcError('Some error', -100000)
      }

    }

    const controller = new SomeJsonRpcController()
    const mware = controller.middleware.bind(controller)

    it('properly handles requrest', () => {
      const {req, res} = reqresnext({
        body: {
          jsonrpc: '2.0',
          method: 'test2',
          id: '123',
          params: {
            a: 'a',
            b: 2,
          },
        },
      })

      mware(req, res)

      expect(res.statusCode).toBe(OK)
      expect(res.body).toBe(JSON.stringify({
        jsonrpc: '2.0',
        id: '123',
        result: {foo: 'quxr', id: '123', a: 'a', b: 2},
      }))
    })

    it('finds proper method', () => {
      const {req, res} = reqresnext({
        body: {
          jsonrpc: '2.0',
          method: 'test1',
          id: '123',
          params: {
            a: 'a',
            b: 2,
          },
        },
      })

      mware(req, res)

      expect(res.statusCode).toBe(OK)
      expect(res.body).toBe(JSON.stringify({
        jsonrpc: '2.0',
        id: '123',
        result: {foo: 'bar', id: '123'},
      }))
    })

    it('returns error if method does not exist', () => {
      const {req, res} = reqresnext({
        body: {
          jsonrpc: '2.0',
          method: 'foobar',
          id: '111',
          params: {},
        },
      })

      mware(req, res)

      expect(res.statusCode).toBe(OK)
      expect(res.body).toBe(JSON.stringify({
        jsonrpc: '2.0',
        id: '111',
        error: {
          message: 'Method not found',
          code: -32601,
          data: 'foobar',
        },
      }))
    })

    it('returns error if method returns JsonRpcError', () => {
      const {req, res} = reqresnext({
        body: {
          jsonrpc: '2.0',
          method: 'get-some-error',
          id: '111',
          params: {},
        },
      })

      mware(req, res)

      expect(res.statusCode).toBe(OK)
      expect(res.body).toBe(JSON.stringify({
        jsonrpc: '2.0',
        id: '111',
        error: {
          message: 'Some error',
          code: -100000,
        },
      }))
    })
  })
})
