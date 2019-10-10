import {
  ControllerOptions,
  Controller,
  Post,
  Req,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'

import {get} from 'lodash'

import {Request, Response} from 'express'

const JSON_RPC_METADATA = '__rpc-metadata__'

type TRpcMethodEntry = {
  key?: string,
  method?: string,
  args?: Array<string | undefined>
}

type TRpcMeta = {
  [key: string]: TRpcMethodEntry
}

interface ClassType<InstanceType extends Function> extends Function {
  new(...args: any[]): InstanceType
  prototype: InstanceType
}

type Extender = <BaseClass extends ClassType<any>>(base: BaseClass) => BaseClass

export function JsonRpcMiddleware(): ClassDecorator {
  return <TFunction extends Function>(target: TFunction) => {

    const extend: Extender = (base) => {
      class Extended extends base {

        protected middleware({body}: Request, res: Response): any {
          const {args, handler} = (this.constructor as any).resolveHandler(body, this)
          const result = handler
            ? handler.apply(this, args)
            : {}

          res.status(HttpStatus.OK).send(result)

        }
        static resolveHandler(body: any, instance: Extended): {handler: Function, args: any[]} | {[key: string]: any} {
          const _method = body.method

          const meta = Reflect.getMetadata(JSON_RPC_METADATA, this) || {}
          const methodMeta: TRpcMethodEntry | undefined = (Object as any).values(meta)
            .find(({method}: TRpcMethodEntry) => _method === method)

          if (!methodMeta) {
            return {}
          }

          const propKey = methodMeta.key + ''
          const handler = this.prototype[propKey]
          const paramTypes = Reflect.getMetadata('design:paramtypes', instance, propKey)
          const args = (methodMeta.args || []).map((path, index) => {
            const data = path ? get(body, path) : body
            const DataConstructor = paramTypes[index]

            return DataConstructor
              ? new DataConstructor(data)
              : data
          })

          return {
            args,
            handler,
          }
        }

      }

      return Extended
    }

    return extend(target as any)
  }
}

export function JsonRpcController(
  prefixOrOptions?: string | ControllerOptions,
): ClassDecorator {
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

export const jsonRpcReq = (valuePath?: string) => (target: Object, propertyKey: string, index: number) => {
  const meta: TRpcMeta = Reflect.getOwnMetadata(JSON_RPC_METADATA, target.constructor) || {}
  const methodMeta: TRpcMethodEntry = meta[propertyKey] || {}
  const methodArgs = methodMeta.args || []

  methodArgs[index] = valuePath
  methodMeta.args = methodArgs
  methodMeta.key = propertyKey
  meta[propertyKey] = methodMeta

  Reflect.defineMetadata(JSON_RPC_METADATA, meta, target.constructor)

}

export const RpcId = () => jsonRpcReq('id')

export const RpcParams = () => jsonRpcReq('params')

export const JsonRpcMethod = (method: string) => {
  return (target: any, propertyKey: string) => {
    const meta: TRpcMeta = Reflect.getOwnMetadata(JSON_RPC_METADATA, target.constructor) || {}
    const methodMeta: TRpcMethodEntry = meta[propertyKey] || {}

    methodMeta.method = method
    methodMeta.key = propertyKey
    meta[propertyKey] = methodMeta

    Reflect.defineMetadata(JSON_RPC_METADATA, meta, target.constructor)
  }
}
