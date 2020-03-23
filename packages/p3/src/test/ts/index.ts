import {Test, TestingModule} from '@nestjs/testing'
import {HttpStatus} from '@nestjs/common'
import {NestApplication} from '@nestjs/core'
import request from 'supertest'
import {RpcId} from 'nestjs-json-rpc'
import {
  P3Provider,
  Auth,
  ClientAuth,
  SinapSuggest,
  SinapContext,
  Client,
  Security,
  Fields,
  Locale,
  Query,
  TFields,
  TLocale,
  TQuery,
  TClient,
  TSecurity,
  SecurityLevelGuard,
  ClientTypeGuard,
  ClientTypes,
  SecurityLevel,
} from '../../main/ts'

describe('P3', () => {
  describe('P3Provider', () => {
    @P3Provider('/p3')
    class CustomController {

      @SinapSuggest('test2')
      bar(
        @RpcId() id: string,
        @Fields() fields: TFields,
        @Locale() locale: TLocale,
        @Query() query: TQuery,
        @Auth() auth: string,
        @ClientAuth() clientAuth: string,
        @Client() client: TClient,
        @Security() security: TSecurity,
      ) {
        return {foo: 'bar', id, fields, locale, query, auth, clientAuth, client, security}
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
          result: {
            foo: 'bar',
            id: '123',
            fields: {a: '123', foo: 'bar'},
            locale: 'baz',
            query: 'qwe',
            auth: 'Authorization test2',
            clientAuth: 'Client-Authorization test3344',
            client: {clientId: 'SINAP-CLIENT', clientType: 'SINAP'},
            security: {level: 0},
          },
        })
    })
  })
  describe('guards', () => {
    describe('SecurityLevelGuard', () => {
      @P3Provider('/p3')
      class CustomController {

        @SecurityLevelGuard(SecurityLevel.SECURE)
        @SinapContext('test2')
        bar() {
          return {foo: 'bar'}
        }

        @SinapContext('test1')
        baz() {
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

      it('return "Method not found" on unsupported security level', () => {
        return request(app.getHttpServer())
          .post('/p3')
          .send({
            jsonrpc: '2.0',
            method: 'context.test2',
            id: '123',
            params: {},
            client: {},
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
            client: {},
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
            client: {},
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
    })

    describe('ClientTypeGuard', () => {
      @P3Provider('/p3')
      class CustomController {

        @ClientTypeGuard(ClientTypes.SINAP)
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
            security: {},
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
            security: {},
          })
          .expect(HttpStatus.OK)
          .expect({
            jsonrpc: '2.0',
            id: '123',
            result: {foo: 'bar'},
          })
      })
    })
  })
})
