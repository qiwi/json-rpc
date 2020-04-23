import {constructDecorator, METHOD, PARAM} from '@qiwi/decorator-utils'
import {injectMeta, JSON_RPC_METADATA, JsonRpcMethod} from 'nestjs-json-rpc'
import {JsonRpcData, ParamMetadataKeys} from 'expressjs-json-rpc'

export type TSinapSuggest = {
  query: string
  fields?: Record<string, any>
  locale: string
}

export class SinapSuggestRequest {

  query: string
  fields?: Record<string, any>
  locale: string

  constructor(request: TSinapSuggest) {
    this.fields = request.fields
    this.locale = request.locale
    this.query = request.query
  }

}

export type TSinapContext = {
  fields?: Record<string, any>
  locale: string
}

export class SinapContextRequest {

  fields?: Record<string, any>
  locale: string

  constructor(request: TSinapContext) {
    this.fields = request.fields
    this.locale = request.locale
  }

}

export class SinapSuggestResponse<T = object> extends Array<T> {}

export class SinapContextResponse {

  [key: string]: any

}

export const SinapSuggest = (arg?: any) => {
  return constructDecorator(({targetType, proto, propName, paramIndex, ctor}) => {
    if (targetType === METHOD) {
      injectMeta(JSON_RPC_METADATA,`meta.method`, 'SinapSuggest', ctor)
      JsonRpcMethod(`suggest.${arg}`)(proto, propName!)
    }

    if (targetType === PARAM) {
      injectMeta(JSON_RPC_METADATA,`meta.param`, 'SinapSuggest', ctor)
      // @ts-ignore
      JsonRpcData(ParamMetadataKeys.PARAMS)(proto, propName, paramIndex)
    }
  })()
}

export const SinapContext = (arg?: any) => {
  return constructDecorator(({targetType, proto, propName, paramIndex, ctor}) => {
    if (targetType === METHOD) {
      injectMeta(JSON_RPC_METADATA,`meta.method`, 'SinapContext', ctor)
      JsonRpcMethod(`context.${arg}`)(proto, propName!)
    }

    if (targetType === PARAM) {
      injectMeta(JSON_RPC_METADATA,`meta.method`, 'SinapContext', ctor)
      // @ts-ignore
      JsonRpcData(ParamMetadataKeys.PARAMS)(proto, propName, paramIndex)
    }
  })()
}
