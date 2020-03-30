import {constructDecorator, METHOD, PARAM} from '@qiwi/decorator-utils'
import {JsonRpcData, ParamMetadataKeys} from 'expressjs-json-rpc'
import {JSON_RPC_METADATA} from '@qiwi/json-rpc-common'
import {TP3RpcMethodEntry} from './class'

// @ts-ignore
export const Auth = () => JsonRpcData('auth')
// @ts-ignore
export const ClientAuth = () => JsonRpcData('clientAuth')

export const enum ClientTypes {
  SINAP = 'SINAP',
  QD_PROCESSING = 'QD_PROCESSING',
  QW_PROCESSING = 'QW_PROCESSING',
  SCHEDULER = 'SCHEDULER',
  ONE_C = 'ONE_C',
}

export const enum SecurityLevel {
  INSECURE = 0,
  SECURE = 9,
}

export type TClient = {
  clientId: string,
  clientType: string
}

export type TSecurity = {
  security: { level: number }
}

export const Client = (arg?: any) => {
  return constructDecorator(({targetType, proto, propName, paramIndex}) => {
    if (targetType === METHOD) {
      const meta = Reflect.getOwnMetadata(JSON_RPC_METADATA, proto.constructor) || {}
      const methodMeta: TP3RpcMethodEntry = meta[propName!] || {}
      methodMeta.meta = {
        ...methodMeta.meta,
        clientType: Array.isArray(arg) ? arg : [arg],
      }
      meta[propName!] = methodMeta
      Reflect.defineMetadata(JSON_RPC_METADATA, meta, proto.constructor)
    }

    if (targetType === PARAM) {
      JsonRpcData(ParamMetadataKeys.CLIENT)(proto, propName!, paramIndex!)
    }
  })()
}

export const Security = (arg?: any) => {
  return constructDecorator(({targetType, proto, propName, paramIndex}) => {
    if (targetType === METHOD) {
      const meta = Reflect.getOwnMetadata(JSON_RPC_METADATA, proto.constructor) || {}
      const methodMeta: TP3RpcMethodEntry = meta[propName!] || {}
      methodMeta.meta = {
        ...methodMeta.meta,
        securityLevel: arg,
      }
      meta[propName!] = methodMeta
      Reflect.defineMetadata(JSON_RPC_METADATA, meta, proto.constructor)
    }

    if (targetType === PARAM) {
      JsonRpcData(ParamMetadataKeys.SECURITY)(proto, propName!, paramIndex!)
    }
  })()
}
