import {Test, TestingModule} from '@nestjs/testing'
import {HttpStatus} from '@nestjs/common'
import {NestApplication} from '@nestjs/core'
import request from 'supertest'
import {RpcId} from 'nestjs-json-rpc'

import {
  P3Provider,
  Auth,
  ClientAuth,
  SinapSuggestRequest,
  SinapSuggest,
  SinapContext,
  Client,
  Security,
  TClient,
  TSecurity,
  ClientType,
  SecurityLevel,
  SinapContextResponse,
  SinapSuggestResponse,
} from '../../main/ts'

describe('P3', () => {
  describe('P3Provider', () => {
    @P3Provider('/p3')
    class CustomController {

      @SinapSuggest('test2')
      bar(
        @RpcId() id: string,
        @SinapSuggest() params: SinapSuggestRequest,
        @Auth() auth: string,
        @ClientAuth() clientAuth: string,
        @Client() client: TClient,
        @Security() security: TSecurity,
      ): SinapSuggestResponse {
        return [{
          foo: 'bar',
          id,
          params,
          auth,
          clientAuth,
          client,
          security,
        }]
      }

    }

    let module: TestingModule
    let app: NestApplication

    beforeAll(async() => {
      module = await Test.createTestingModule({
        providers: [],
        controllers: [CustomController],
      }).compile()
      app = module.createNestApplication()

      await app.init()
    })

    it('returns 200 on valid request', () => {
      return request(app.getHttpServer())
        .post('/p3')
        .set({
          Authorization: 'Authorization test2',
          'Client-Authorization': 'Client-Authorization test3344',
        })
        .send({
          jsonrpc: '2.0',
          method: 'suggest.test2',
          id: '123',
          params: {
            fields: {a: '123', foo: 'bar'},
            locale: 'baz',
            query: 'qwe',
          },
          client: {
            clientId: 'SINAP-CLIENT',
            clientType: 'SINAP',
          },
          security: {
            level: 0,
          },
        })
        .expect(HttpStatus.OK)
        .expect({
          jsonrpc: '2.0',
          id: '123',
          result: [{
            foo: 'bar',
            id: '123',
            params: {fields: {a: '123', foo: 'bar'}, locale: 'baz', query: 'qwe'},
            auth: 'Authorization test2',
            clientAuth: 'Client-Authorization test3344',
            client: {clientId: 'SINAP-CLIENT', clientType: 'SINAP'},
            security: {level: 0},
          }],
        })
    })
  })
  describe('guards', () => {
    describe('SecurityLevelGuard', () => {
      @P3Provider('/p3')
      class CustomController {

        @Security(SecurityLevel.SECURE)
        @SinapContext('test2')
        bar(): SinapContextResponse {
          return {foo: 'bar'}
        }

        @SinapContext('test1')
        baz(): SinapContextResponse {
          return {foo: 'bar'}
        }

      }

      let module: TestingModule
      let app: NestApplication
      // let controller: CustomController
      beforeAll(async() => {
        module = await Test.createTestingModule({
          providers: [],
          controllers: [CustomController],
        }).compile()
        app = module.createNestApplication()
        // controller = module.get(CustomController)
        await app.init()
      })

      it('return "Method not found" on unsupported security level', () => {
        return request(app.getHttpServer())
          .post('/p3')
          .send({
            jsonrpc: '2.0',
            method: 'context.test2',
            id: '123',
            params: {},
            client: {
              clientType: 'foo',
            },
            security: {
              level: '3',
            },
          })
          .expect(HttpStatus.OK)
          .expect({
            jsonrpc: '2.0',
            id: '123',
            error: {message: 'Method not found', code: -32601, data: 'context.test2'},
          })
      })

      it('return data on supported security level', () => {
        return request(app.getHttpServer())
          .post('/p3')
          .send({
            jsonrpc: '2.0',
            method: 'context.test2',
            id: '123',
            params: {},
            client: {
              clientType: 'foo',
            },
            security: {
              level: '9',
            },
          })
          .expect(HttpStatus.OK)
          .expect({
            jsonrpc: '2.0',
            id: '123',
            result: {foo: 'bar'},
          })
      })

      it('return data on method without guard', () => {
        return request(app.getHttpServer())
          .post('/p3')
          .send({
            jsonrpc: '2.0',
            method: 'context.test1',
            id: '123',
            params: {},
            client: {
              clientType: 'foo',
            },
            security: {
              level: '7',
            },
          })
          .expect(HttpStatus.OK)
          .expect({
            jsonrpc: '2.0',
            id: '123',
            result: {foo: 'bar'},
          })
      })

      it('throw error on empty guard', () => {
        expect(() => Security()({constructor: 'constructor'}, 'method', {value: () => {/*noop*/}}))
          .toThrow('Security level type must be specified')
      })
    })

    describe('ClientTypeGuard', () => {
      @P3Provider('/p3')
      class CustomController {

        @Client(ClientType.SINAP)
        @SinapContext('test2')
        bar() {
          return {foo: 'bar'}
        }

      }

      let module: TestingModule
      let app: NestApplication

      beforeAll(async() => {
        module = await Test.createTestingModule({
          providers: [],
          controllers: [CustomController],
        }).compile()
        app = module.createNestApplication()

        await app.init()
      })

      it('return "Method not found" on unsupported client type', () => {
        return request(app.getHttpServer())
          .post('/p3')
          .send({
            jsonrpc: '2.0',
            method: 'context.test2',
            id: '123',
            params: {},
            client: {
              clientType: 'baz',
            },
            security: {
              level: '7',
            },
          })
          .expect(HttpStatus.OK)
          .expect({
            jsonrpc: '2.0',
            id: '123',
            error: {message: 'Method not found', code: -32601, data: 'context.test2'},
          })
      })

      it('return data on supported client type', () => {
        return request(app.getHttpServer())
          .post('/p3')
          .send({
            jsonrpc: '2.0',
            method: 'context.test2',
            id: '123',
            params: {},
            client: {
              clientType: 'SINAP',
            },
            security: {
              level: '7',
            },
          })
          .expect(HttpStatus.OK)
          .expect({
            jsonrpc: '2.0',
            id: '123',
            result: {foo: 'bar'},
          })
      })

      it('throw error on empty guard', () => {
        expect(() => Client()({constructor: 'constructor'}, 'method', {value: () => {/*noop*/}}))
          .toThrow('Client type must be specified')
      })
    })
  })
})
