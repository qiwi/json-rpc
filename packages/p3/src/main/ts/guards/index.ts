import {P3_METADATA, TP3Meta} from '../classDecorators'
// import { TRpcMethodEntry } from '@qiwi/json-rpc-common'
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

export const SecurityLevelGuard = (level: number) => {
  return (target: any, _propertyKey: string) => {
    const meta: TP3Meta = Reflect.getOwnMetadata(P3_METADATA, target.constructor) || {}
    meta.level = level
    Reflect.defineMetadata(P3_METADATA, meta, target.constructor)
  }
}

export const ClientTypeGuard = (clientType: string[] | string) => {
  return (target: any, _propertyKey: string) => {
    const meta: TP3Meta = Reflect.getOwnMetadata(P3_METADATA, target.constructor) || {}
    meta.clientType = Array.isArray(clientType) ? clientType : [clientType]
    Reflect.defineMetadata(P3_METADATA, meta, target.constructor)
  }
}
