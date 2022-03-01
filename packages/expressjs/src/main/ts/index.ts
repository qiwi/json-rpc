import 'reflect-metadata'

import {get} from 'lodash'

import {Request, Response, NextFunction} from 'express'

import {
  JSON_RPC_METADATA,
  TRpcMethodEntry,
  TRpcMethodParam,
  TRpcMeta,
  Extender,
  parseJsonRpcObject,
  IParsedObject,
  error,
  success,
  JsonRpcError,
  OK,
} from '@qiwi/json-rpc-common'
import {IMetaTypedValue, INext, IRequest, IResponse} from '@qiwi/substrate'
import {constructDecorator, METHOD} from '@qiwi/decorator-utils'

export * from '@qiwi/json-rpc-common'

export enum ParamMetadataKeys {
  REQUEST = 'request',
  ID = 'id',
  PARAMS = 'params',
  CLIENT = 'client',
  SECURITY = 'security',
  REQ = 'req',
  RES = 'res',
  NEXT = 'next',
  BODY = 'body',
  QUERY = 'query',
  PARAM = 'param',
  HEADERS = 'headers',
  SESSION = 'session',
  FILE = 'file',
  FILES = 'files',
  HOST = 'host',
  IP = 'ip',
}

const asyncMiddleware = (fn: Function) => function(this: any, req: Request, res: Response, next: NextFunction) {
  return Promise.resolve(fn.call(this, req, res, next)).catch(next)
}

const AsyncMiddleware = constructDecorator(({targetType, target}) => {
  if (targetType === METHOD) {
    return asyncMiddleware(target)
  }
})

type IJsonRpcMetaTypedValue = IMetaTypedValue<IParsedObject, 'jsonRpc', {}> & {reqresnext: {req: IRequest, res: IResponse, next: INext}}

export function JsonRpcMiddleware(): ClassDecorator {
  return <TFunction extends Function>(target: TFunction) => {

    const extend: Extender = (base) => {
      class Extended extends base {

        @AsyncMiddleware
        protected async middleware(req: Request, res: Response, next: NextFunction): Promise<any> {
          const boxedJsonRpc = (this.constructor as any).parseRequest(req, res, next)
          if (!boxedJsonRpc) {
            // TODO
            return
          }

          if (boxedJsonRpc.value.type === 'request') {
            const {value: {payload: {id, method}}} = boxedJsonRpc
            const {params, handler} = (this.constructor as any).resolveHandler(this, boxedJsonRpc)

            // @ts-ignore
            if (!handler) {
              res.status(OK).send(error(id, JsonRpcError.methodNotFound(method)))
              return
            }

            const result = (this.constructor as any).handleResult(await handler.apply(this, params))
            const jsonRpcResponse = result instanceof JsonRpcError
              ? error(id, result)
              : success(id, result)

            res.status(OK).send(jsonRpcResponse)
          }

        }

        static parseRequest(req: Request, res: Response, next: NextFunction): IJsonRpcMetaTypedValue | undefined {
          const jsonRpc = parseJsonRpcObject(req.body)

          if (Array.isArray(jsonRpc)) {
            // TODO
            return
          }

          return {
            reqresnext: {req, res, next},
            meta: {},
            value: jsonRpc,
            type: 'jsonRpc',
          }
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

        static resolveHandler(instance: Extended, boxedJsonRpc: IJsonRpcMetaTypedValue): {handler: Function, params: any[]} | {[key: string]: any} {
          if (Array.isArray(boxedJsonRpc.value)) {
            throw new Error('unexpected error')
          }

          if (boxedJsonRpc.value.type !== 'request') {
            throw new Error('unexpected error')
          }

          const _method = boxedJsonRpc.value.payload.method

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
            return this.resolveParam(boxedJsonRpc, paramTypes[index], param)
          })

          return {
            params,
            handler,
          }
        }

        static resolveParam(boxedJsonRpc: IJsonRpcMetaTypedValue, Param: any, {type, value}: TRpcMethodParam) {
          let data = exchangeCommonKeyMetadataForValue(boxedJsonRpc, {type, value})

          if (data) {
            return data
          }

          if (boxedJsonRpc.value.type !== 'request') {
            return
          }

          if (type === ParamMetadataKeys.ID) {
            data = boxedJsonRpc.value.payload.id
          }
          else {
            data = boxedJsonRpc.value.payload.params
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

export const exchangeCommonKeyMetadataForValue = (boxedJsonRpc: IJsonRpcMetaTypedValue, {type, value}: {type: any, value: any}) => {
  const req = boxedJsonRpc.reqresnext.req
  const metadataMap = {
    [ParamMetadataKeys.RES]: boxedJsonRpc.reqresnext.res,
    [ParamMetadataKeys.NEXT]: boxedJsonRpc.reqresnext.next,
    [ParamMetadataKeys.REQ]: req,
    [ParamMetadataKeys.BODY]: value ? req.body[value] : req.body,
    [ParamMetadataKeys.PARAM]: value ? req.params[value] : req.params,
    [ParamMetadataKeys.QUERY]: value ? req.query[value] : req.value,
    [ParamMetadataKeys.HEADERS]: value ? req.headers[value.toLowerCase()] : req.headers,
    [ParamMetadataKeys.IP]: req.ip,
  }
  // @ts-ignore
  return metadataMap[type]
}

export const JsonRpcData = (type: ParamMetadataKeys = ParamMetadataKeys.REQUEST, value?: any) =>
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

export const RpcId = () => JsonRpcData(ParamMetadataKeys.ID)

export const JsonRpcId = RpcId

export const JsonRpcParams = (value?: string) => JsonRpcData(ParamMetadataKeys.PARAMS, value)

export const Res = () => JsonRpcData(ParamMetadataKeys.RES)
export const Req = () => JsonRpcData(ParamMetadataKeys.REQ)
export const Next = () => JsonRpcData(ParamMetadataKeys.NEXT)
export const Body = (value?: string) => JsonRpcData(ParamMetadataKeys.BODY, value)
export const Param = (value?: string) => JsonRpcData(ParamMetadataKeys.PARAM, value)
export const Query = (value?: string) => JsonRpcData(ParamMetadataKeys.QUERY, value)
export const Headers = (value?: string) => JsonRpcData(ParamMetadataKeys.HEADERS, value)
export const Ip = () => JsonRpcData(ParamMetadataKeys.IP)

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
