import {
  ControllerOptions,
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus
} from '@nestjs/common'

import {get} from 'lodash'

const JSON_RPC_METADATA = '__rpc-metadata__';

type TRpcMethodEntry = {
  key?: string,
  method?: string,
  args?: string []
}

type TRpcMeta = {
  [key: string]: TRpcMethodEntry
}

export function JsonRpcController(): ClassDecorator

export function JsonRpcController(prefix: string): ClassDecorator;

export function JsonRpcController(options: ControllerOptions): ClassDecorator;

export function JsonRpcController(
  prefixOrOptions?: string | ControllerOptions,
): ClassDecorator {
  return <TFunction extends Function>(target: TFunction) => {

    interface ClassType<InstanceType extends TFunction> extends Function {
      new(...args: any[]): InstanceType
      prototype: InstanceType
    }

    const extend = <BaseClass extends ClassType<any>>(base: BaseClass) => {
      @Controller(prefixOrOptions as any)
      class Extended extends base {
        @Post('/')
        @HttpCode(HttpStatus.OK)
        rpc(@Body() body: any): any {
          const {args, handler} = (this.constructor as any).resolveHandler(body)

          if (!handler) {
            return null
          }

          return handler.apply(this, args)

        }
        static resolveHandler(body: any): {handler: Function, args: any[]} | {[key: string]: any} {
          const _method = body.method

          const meta = Reflect.getMetadata(JSON_RPC_METADATA, this) || {}
          const methodMeta: TRpcMethodEntry | undefined = (Object as any).values(meta)
            .find(({method}: TRpcMethodEntry) => _method === method)

          if (!methodMeta) {
            return {}
          }

          const args = (methodMeta.args || []).map(path => get(body, path))
          const handler = this.prototype[methodMeta.key + '']

          return {
            args,
            handler
          }
        }
      }

      return Extended
    }

    return extend(target as any)
  };
}

export const jsonRpcParams = (valuePath: string = '.') => (target: Object, propertyKey: string, index: number) => {
  const meta: TRpcMeta = Reflect.getOwnMetadata(JSON_RPC_METADATA, target.constructor) || {}
  const methodMeta: TRpcMethodEntry = meta[propertyKey] || {}
  const methodArgs = methodMeta.args || []

  methodArgs[index] = valuePath
  methodMeta.args = methodArgs
  methodMeta.key = propertyKey
  meta[propertyKey] = methodMeta

  Reflect.defineMetadata(JSON_RPC_METADATA, meta, target.constructor)

}

export const RpcId = () => jsonRpcParams('id')

export const JsonRpcMethod = (method: string) => {
  return (target: any, propertyKey: string) => {
    const meta: TRpcMeta = Reflect.getOwnMetadata(JSON_RPC_METADATA, target.constructor) || {}
    const methodMeta: TRpcMethodEntry = meta[propertyKey] || {}

    methodMeta.method = method
    methodMeta.key = propertyKey
    meta[propertyKey] = methodMeta

    Reflect.defineMetadata(JSON_RPC_METADATA, meta, target.constructor)
  }
};

