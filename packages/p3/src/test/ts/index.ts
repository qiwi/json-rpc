import {Test, TestingModule} from '@nestjs/testing'
import {HttpStatus} from '@nestjs/common'
import {NestApplication} from '@nestjs/core'
import request from 'supertest'
import {RpcId} from 'nestjs-json-rpc'
import {
  P3Provider,
  Auth,
  ClientAuth,
  SinapValue,
  Client,
  Security,
  SinupContext,
} from '../../main/ts'

describe('P3', () => {
  describe('P3Provider', () => {
    @P3Provider('/p3')
    class CustomController {

      @SinupContext('test2')
      bar(
        @RpcId() id: string,
        @SinapValue() value: Object,
        @Auth() auth: string,
        @ClientAuth() clientAuth: string,
        @Client() client: Object,
        @Security() security: Object,
      ) {
        return {foo: 'bar', id, value, auth, clientAuth, client, security}
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
          method: 'context.test2',
          id: '123',
          params: {
            a: 'a',
            b: 2,
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
            value: {a: 'a', b: 2},
            auth: 'Authorization test2',
            clientAuth: 'Client-Authorization test3344',
            client: {clientId: 'SINAP-CLIENT', clientType: 'SINAP'},
            security: {level: 0},
          },
        })
    })
  })
})
