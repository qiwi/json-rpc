import {Test, TestingModule} from '@nestjs/testing'
import {
  HttpStatus,
  // ValidationPipe
} from '@nestjs/common'
import {NestApplication} from '@nestjs/core'
import request from 'supertest'
import {
  JsonRpcController,
  JsonRpcMethod,
  RpcId,
  JsonRpcParams,
} from '../../main/ts/'

describe('decorators', () => {
  describe('JsonRpcController', () => {

    class Abc {

      a?: string
      b?: number

      constructor(raw: any) {
        Object.assign(this, raw)
      }

    }

    @JsonRpcController('/rpc')
    class CustomController {

      @JsonRpcMethod('test1')
      bar(@RpcId() id: string) {
        return {foo: 'bar', id}
      }

      @JsonRpcMethod('test2')
      qux(@RpcId() id: string, @JsonRpcParams() {a, b}: Abc) {
        return {foo: 'quxr', id, a, b}
      }

    }

    let module: TestingModule
    let controller: CustomController
    let app: NestApplication

    beforeAll(async() => {
      module = await Test.createTestingModule({
        providers: [],
        controllers: [CustomController],
      }).compile()
      app = module.createNestApplication()
      // app.useGlobalPipes(new ValidationPipe({ whitelist: true }))

      await app.init()

      controller = module.get(CustomController)
    })

    it('exists', () => {
      expect(controller).toBeDefined()
    })

    it('returns 200 on valid request', () => {
      return request(app.getHttpServer())
        .post('/rpc')
        .send({
          jsonrpc: '2.0',
          method: 'test2',
          id: '123',
          params: {
            a: 'a',
            b: 2,
          },
        })
        .expect(HttpStatus.OK)
        .expect({foo: 'quxr', id: '123', a: 'a', b: 2})
    })

    it('finds proper method', () => {
      return request(app.getHttpServer())
        .post('/rpc')
        .send({
          jsonrpc: '2.0',
          method: 'test1',
          id: '123',
          params: null
        })
        .expect(HttpStatus.OK)
        .expect({foo: 'bar', id: '123'})
    })
  })
})
