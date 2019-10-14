import {
  ControllerOptions,
  Controller,
  Post,
  Req,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'

import {Request, Response} from 'express'

import {Extender} from '@qiwi/json-rpc-common'

import {JsonRpcMiddleware} from 'expressjs-json-rpc'

export * from 'expressjs-json-rpc'

export const JsonRpcController = (
  prefixOrOptions?: string | ControllerOptions,
): ClassDecorator => {
  return <TFunction extends Function>(target: TFunction) => {

    const extend: Extender = (base) => {
      @Controller(prefixOrOptions as any)
      @JsonRpcMiddleware()
      class Extended extends base {

        @Post('/')
        @HttpCode(HttpStatus.OK)
        rpc(@Req() req: Request, @Res() res: Response): any {
          return this.middleware(req, res)
        }

      }

      return Extended
    }

    return extend(target as any)
  }
}
