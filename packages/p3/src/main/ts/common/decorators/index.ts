import {JSON_RPC_METADATA, injectMeta} from '@qiwi/json-rpc-common'
import {constructDecorator, METHOD, PARAM} from '@qiwi/decorator-utils'
import {JsonRpcData, ParamMetadataKeys} from 'expressjs-json-rpc'

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

export const Client = constructDecorator(({targetType, proto, propName, paramIndex, ctor, args}) => {
  if (targetType === METHOD) {
    if (args.length === 0) {
      throw new Error('Client type must be specified')
    }
    injectMeta(JSON_RPC_METADATA, `${propName}.meta.clientType`, args, ctor)
  }

  if (targetType === PARAM) {
    JsonRpcData(ParamMetadataKeys.CLIENT)(proto, propName!, paramIndex!)
  }
})

export const Security = constructDecorator(({targetType, proto, propName, paramIndex, ctor, args}) => {
  if (targetType === METHOD) {
    if (args[0] === undefined) {
      throw new Error('Security level type must be specified')
    }
    injectMeta(JSON_RPC_METADATA,`${propName}.meta.securityLevel`, args[0], ctor)
  }

  if (targetType === PARAM) {
    JsonRpcData(ParamMetadataKeys.SECURITY)(proto, propName!, paramIndex!)
  }
})
