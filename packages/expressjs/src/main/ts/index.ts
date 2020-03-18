import 'reflect-metadata'

import {get} from 'lodash'

import {Request, Response} from 'express'

import {
  JSON_RPC_METADATA,
  TRpcMethodEntry,
  TRpcMethodParam,
  TRpcMeta,
  Extender,
  parseJsonRpcObject,
  IParsedObjectRequest,
  RequestObject,
  error,
  success,
  JsonRpcError,
  OK,
} from '@qiwi/json-rpc-common'

export * from '@qiwi/json-rpc-common'

export const enum JsonRpcDecoratorType {
  REQUEST = 'request',
  ID = 'id',
  PARAMS = 'params',
}

export function JsonRpcMiddleware(): ClassDecorator {
  return <TFunction extends Function>(target: TFunction) => {

    const extend: Extender = (base) => {
      class Extended extends base {

        protected middleware(req: Request, res: Response): any {
          const jsonRpc = parseJsonRpcObject(req.body)
          if (Array.isArray(jsonRpc)) {
            // TODO
            return
          }

          if (jsonRpc.type === 'request') {
            const {params, handler} = (this.constructor as any).resolveHandler(this, jsonRpc)
            // @ts-ignore
            jsonRpc._meta = (this.constructor as any).metaResolver(req)
            const {payload: {id, method}} = jsonRpc

            if (!handler) {
              res.status(OK).send(error(id, JsonRpcError.methodNotFound(method)))

              return
            }

            const result = (this.constructor as any).handleResult(handler.apply(this, params))
            const jsonRpcResponse = result instanceof JsonRpcError
              ? error(id, result)
              : success(id, result)

            res.status(OK).send(jsonRpcResponse)
          }

        }

        static metaResolver(_req: Request): any {
          return {}
        }

        static handleResult(result: any): any {
          if (result instanceof JsonRpcError) {
            return result
          }

          if (result instanceof Error) {
            return new JsonRpcError(result.message || '', 0)
          }

          return result
        }

        static resolveHandler(instance: Extended, jsonRpc: IParsedObjectRequest): {handler: Function, params: any[]} | {[key: string]: any} {

          const _method = jsonRpc.payload.method

          const meta = Reflect.getMetadata(JSON_RPC_METADATA, this) || {}
          const methodMeta: TRpcMethodEntry | undefined = (Object as any).values(meta)
            .find(({method}: TRpcMethodEntry) => _method === method)

          if (!methodMeta) {
            return {}
          }

          const propKey = methodMeta.key + ''
          const handler = this.prototype[propKey]
          const paramTypes = Reflect.getMetadata('design:paramtypes', instance, propKey)
          const params = (methodMeta.params || []).map((param: TRpcMethodParam, index: number) => {
            return this.resolveParam(jsonRpc.payload, paramTypes[index], param)
          })

          return {
            params,
            handler,
          }
        }

        static resolveParam(payload: RequestObject, Param: any, {type, value}: TRpcMethodParam) {
          let data

          if (type === JsonRpcDecoratorType.ID) {
            data = payload.id
          }
          else {
            data = payload.params
            data = value ? get(data, value) : data
          }

          return typeof Param === 'function'
            ? new Param(data)
            : data
        }

      }

      return Extended
    }

    return extend(target as any)
  }
}

export const JsonRpcData = (type: JsonRpcDecoratorType = JsonRpcDecoratorType.REQUEST, value?: any) =>
  (target: Object, propertyKey: string, index: number) => {
    const meta: TRpcMeta = Reflect.getOwnMetadata(JSON_RPC_METADATA, target.constructor) || {}
    const methodMeta: TRpcMethodEntry = meta[propertyKey] || {}
    const methodParams = methodMeta.params || []

    methodParams[index] = {
      index,
      type,
      value,
    }
    methodMeta.params = methodParams
    methodMeta.key = propertyKey
    meta[propertyKey] = methodMeta

    Reflect.defineMetadata(JSON_RPC_METADATA, meta, target.constructor)

  }

export const RpcId = () => JsonRpcData(JsonRpcDecoratorType.ID)

export const JsonRpcId = RpcId

export const JsonRpcParams = (value?: string) => JsonRpcData(JsonRpcDecoratorType.PARAMS, value)

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
