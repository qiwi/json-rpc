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
  RpcId, Req, Res, Headers,
  JsonRpcParams,
} from '../../main/ts/'
import {IRequest} from '@qiwi/substrate'

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

      @JsonRpcMethod('test3')
      baz(@Req() req: IRequest, @Res() res: IRequest, @Headers() headers: any) {
        return {
          req: Object.keys(req),
          res: Object.keys(res),
          headers: Object.keys(headers),
        }
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
        .expect({
          jsonrpc: '2.0',
          id: '123',
          result: {foo: 'quxr', id: '123', a: 'a', b: 2},
        })
    })

    it('finds proper method', () => {
      return request(app.getHttpServer())
        .post('/rpc')
        .send({
          jsonrpc: '2.0',
          method: 'test1',
          id: '123',
          params: {},
        })
        .expect(HttpStatus.OK)
        .expect({
          jsonrpc: '2.0',
          id: '123',
          result: {foo: 'bar', id: '123'},
        })
    })

    it('works correctly with @req', () => {
      return request(app.getHttpServer())
        .post('/rpc')
        .send({
          jsonrpc: '2.0',
          method: 'test3',
          id: '123',
          params: {},
        })
        .expect(HttpStatus.OK)
        .expect(({body}) => {
          const {result: {req}} = body
          expect(req).toEqual(expect.arrayContaining(['url', 'route', 'baseUrl', 'body', 'headers', 'length', 'method']))
        })
    })
    it('works correctly with @res', () => {
      return request(app.getHttpServer())
        .post('/rpc')
        .send({
          jsonrpc: '2.0',
          method: 'test3',
          id: '123',
          params: {},
        })
        .expect(HttpStatus.OK)
        .expect(({body}) => {
          const {result: {res}} = body
          expect(res).toEqual(expect.arrayContaining(['locals', 'statusCode', 'req']))
        })
    })
    it('works correctly with @headers', () => {
      return request(app.getHttpServer())
        .post('/rpc')
        .send({
          jsonrpc: '2.0',
          method: 'test3',
          id: '123',
          params: {},
        })
        .expect(HttpStatus.OK)
        .expect(({body}) => {
          const {result: {headers}} = body
          expect(headers).toEqual(expect.arrayContaining(['host', 'accept-encoding', 'content-type', 'content-length', 'connection']))
        })
    })
  })
})
