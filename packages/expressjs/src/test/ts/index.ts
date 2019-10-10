import {
  JsonRpcMethod,
  JsonRpcMiddleware,
  RpcId,
  RpcParams
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
      qux(@RpcId() id: string, @RpcParams() {a, b}: Abc) {
        return {foo: 'quxr', id, a, b}
      }
    }

    const controller = new SomeJsonRpcController()
    const mware = controller.middleware.bind(controller)

    it('properly handles requrest', () => {
      const {req, res} = reqresnext({
        body: {
          method: 'test2',
          id: '123',
          params: {
            a: 'a',
            b: 2,
          },
        }
      })

      mware(req, res)

      expect(res.statusCode).toBe(200)
      expect(res.body).toBe(JSON.stringify({foo: 'quxr', id: '123', a: 'a', b: 2}))
    })

    it('finds proper method', () => {
      const {req, res} = reqresnext({
        body: {
          method: 'test1',
          id: '123',
          params: {
            a: 'a',
            b: 2,
          },
        }
      })

      mware(req, res)

      expect(res.statusCode).toBe(200)
      expect(res.body).toBe(JSON.stringify({foo: 'bar', id: '123'}))
    })
  })
})
