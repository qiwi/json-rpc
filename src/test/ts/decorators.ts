import { Test, TestingModule } from '@nestjs/testing'
import {
  HttpStatus,
  // ValidationPipe
} from '@nestjs/common'
import {NestApplication} from '@nestjs/core'
import request from 'supertest'
import {JsonRpcController} from '../../main/ts/decorators'

describe('decorators', () => {
  describe('JsonRpcController', () => {

    @JsonRpcController()
    class CustomController {}

    let module: TestingModule
    let controller: CustomController
    let app: NestApplication

    beforeAll(async () => {
      module = await Test.createTestingModule({
        providers:[],
        controllers: [CustomController],
      }).compile()
      app = module.createNestApplication();
      // app.useGlobalPipes(new ValidationPipe({ whitelist: true }))

      await app.init();

      controller = module.get(CustomController)
    })

    it('exists', () => {
      expect(controller).toBeDefined()
    })

    it('returns 200 on valid request', () => {
      return request(app.getHttpServer())
        .post('/foo')
        .send({
        })
        .expect(HttpStatus.CREATED)
        .expect({foo: 'bar'});
    })
  })
})
