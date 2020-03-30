import {constructDecorator, METHOD, PARAM} from '@qiwi/decorator-utils'
import {JsonRpcData, ParamMetadataKeys} from 'expressjs-json-rpc'
import {JSON_RPC_METADATA} from '@qiwi/json-rpc-common'
import {TP3RpcMethodEntry} from './class'

// @ts-ignore
export const Auth = () => JsonRpcData('auth')
// @ts-ignore
export const ClientAuth = () => JsonRpcData('clientAuth')

export const enum ClientType {
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

function injectMeta(path: string, value: unknown, propName: string, ctor: Function) {
  const meta = Reflect.getOwnMetadata(JSON_RPC_METADATA, ctor) || {}
  const methodMeta: TP3RpcMethodEntry = meta[propName] || {}
  methodMeta.meta = {
    ...methodMeta.meta,
    [path]: Array.isArray(value) ? value : [value],
  }
  meta[propName] = methodMeta
  Reflect.defineMetadata(JSON_RPC_METADATA, meta, ctor)
}

export const Client = (arg?: any) => {
  return constructDecorator(({targetType, proto, propName, paramIndex,ctor}) => {
    if (targetType === METHOD) {
      injectMeta('clientType', arg, propName!, ctor)
    }

    if (targetType === PARAM) {
      JsonRpcData(ParamMetadataKeys.CLIENT)(proto, propName!, paramIndex!)
    }
  })()
}

export const Security = (arg?: any) => {
  return constructDecorator(({targetType, proto, propName, paramIndex, ctor}) => {
    if (targetType === METHOD) {
      injectMeta('securityLevel', arg, propName!, ctor)
    }

    if (targetType === PARAM) {
      JsonRpcData(ParamMetadataKeys.SECURITY)(proto, propName!, paramIndex!)
    }
  })()
}
