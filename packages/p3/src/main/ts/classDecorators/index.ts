import 'reflect-metadata'
import {ControllerOptions} from '@nestjs/common'
import {
  Extender,
  TRpcMethodParam,
  IParsedObject,
  parseJsonRpcObject,
  JSON_RPC_METADATA,
  TRpcMethodEntry,
} from '@qiwi/json-rpc-common'
import {get} from 'lodash'
import {JsonRpcController} from 'nestjs-json-rpc'
import {Request} from 'express'
import {SecurityLevel} from '../guards'
import {IMetaTypedValue} from '@qiwi/substrate'

export const P3_METADATA = '__p3Metadata__'
export type TP3Meta = {
  level?: number
  clientType?: Array<string>
}

export type TSinapMeta = {
  auth?: string
  clientAuth?: string | string[]
  client?: {
    clientType: string
    clientId?: string
  }
  security?: {
    level: number
  }
}

type IP3MetaTypedValue = IMetaTypedValue<IParsedObject, 'jsonRpcP3', TSinapMeta>

export const P3Provider = (path: ControllerOptions | string): ClassDecorator => {
  return <TFunction extends Function> (target: TFunction) => {
    const extend: Extender = base => {
      @JsonRpcController(path)
      class JsonRpcBase extends base {}

      class Extended extends JsonRpcBase {

        static resolveParam(boxedP3JsonRpc: IP3MetaTypedValue, Param: any, {type, value}: TRpcMethodParam) {
          let data
          if (boxedP3JsonRpc.value.type !== 'request') {
            return
          }

          if (type === 'id') {
            data = boxedP3JsonRpc.value.payload.id
          }

          if (type === 'sinapContext') {
            data = {
              // @ts-ignore
              fields: boxedP3JsonRpc.value.payload.params?.fields,
              // @ts-ignore
              locale: boxedP3JsonRpc.value.payload.params?.locale,
            }
          }

          if (type === 'sinapSuggest') {
            data = {
              // @ts-ignore
              fields: boxedP3JsonRpc.value.payload.params?.fields,
              // @ts-ignore
              locale: boxedP3JsonRpc.value.payload.params?.locale,
              // @ts-ignore
              query: boxedP3JsonRpc.value.payload.params?.query,
            }
          }

          if (type === 'sinapSuggest') {
            data = boxedP3JsonRpc.value.payload.params
            data = value ? get(data, value) : data
          }

          if (type === 'client') {
            data = boxedP3JsonRpc.meta.client
          }

          if (type === 'security') {
            data = boxedP3JsonRpc.meta.security
          }

          if (type === 'auth') {
            data = boxedP3JsonRpc.meta.auth
          }

          if (type === 'clientAuth') {
            data = boxedP3JsonRpc.meta.clientAuth
          }

          return typeof Param === 'function' ? new Param(data) : data
        }

        static parseRequest(req: Request): IP3MetaTypedValue | undefined {
          // @ts-ignore
          const jsonRpc = parseJsonRpcObject(req.body)

          if (Array.isArray(jsonRpc)) {
            // TODO
            return
          }

          return {
            meta: {
              client: req.body.client,
              security: req.body.security,
              auth: req.headers.authorization,
              clientAuth: req.headers['client-authorization'],
            },
            value: jsonRpc,
            type: 'jsonRpcP3',
          }
        }

        static resolveHandler(instance: Extended, boxedJsonRpc: IP3MetaTypedValue): {handler: Function, params: any[]} | {[key: string]: any} {
          if (Array.isArray(boxedJsonRpc.value)) {
            throw new Error('unexpected error')
          }

          const p3Meta: {
            level: number
            clientType: string | undefined
          } = Reflect.getMetadata(P3_METADATA, this)

          if ((p3Meta?.level ?? SecurityLevel.INSECURE) > (boxedJsonRpc.meta.security?.level ?? SecurityLevel.INSECURE)) {
            return Error('Forbidden')
          }

          if (p3Meta?.clientType !== undefined && !(boxedJsonRpc.meta.client?.clientType && p3Meta?.clientType.includes(boxedJsonRpc.meta.client?.clientType))) {
            return Error('Forbidden')
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

      }

      return Extended
    }

    return extend(target as any)
  }
}
