import {TP3RpcMethodEntry} from '../classDecorators'
import {JSON_RPC_METADATA} from '@qiwi/json-rpc-common'

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

export const SecurityLevelGuard = (securityLevel: number) => {
  return (
    target: any,
    propertyKey: string,
  ) => {
    const meta = Reflect.getOwnMetadata(JSON_RPC_METADATA, target.constructor) || {}
    const methodMeta: TP3RpcMethodEntry = meta[propertyKey] || {}
    methodMeta.meta = {
      ...methodMeta.meta,
      securityLevel,
    }
    meta[propertyKey] = methodMeta
    Reflect.defineMetadata(JSON_RPC_METADATA, meta, target.constructor)
  }
}

export const ClientTypeGuard = (clientType: string[] | string) => {
  return (
    target: any,
    propertyKey: string,
    _descriptor?: TypedPropertyDescriptor<any>,
  ) => {
    const meta = Reflect.getOwnMetadata(JSON_RPC_METADATA, target.constructor) || {}
    const methodMeta: TP3RpcMethodEntry = meta[propertyKey] || {}
    methodMeta.meta = {
      ...methodMeta.meta,
      clientType: Array.isArray(clientType) ? clientType : [clientType],
    }
    meta[propertyKey] = methodMeta
    Reflect.defineMetadata(JSON_RPC_METADATA, meta, target.constructor)
  }
}
