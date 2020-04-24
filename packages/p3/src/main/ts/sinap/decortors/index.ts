import {IProto} from '@qiwi/decorator-utils/target/es5/interface'
import {constructDecorator, METHOD, PARAM} from '@qiwi/decorator-utils'
import {JsonRpcMethod} from 'nestjs-json-rpc'
import {JsonRpcData, ParamMetadataKeys} from 'expressjs-json-rpc'

export type TSinapSuggest = {
  query: string
  fields?: Record<string, any>
  locale: string
}

export class SinapSuggestRequest implements TSinapSuggest {

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

export class SinapContextRequest implements TSinapContext {

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

const returnTypeMap = {
  SinapSuggestResponse: 'SinapSuggest',
  SinapContextResponse: 'SinapContext',
}

const paramTypeMap = {
  SinapSuggestRequest: 'SinapSuggest',
  SinapContextRequest: 'SinapContext',
}

const decoratorCompatibilityCheck = (
  proto: IProto,
  propName: string | undefined,
  method: string,
) => {
  const returnType = Reflect.getMetadata('design:returntype', proto, propName + '')?.name
  // @ts-ignore
  if (returnType && returnTypeMap[returnType] !== method) {
    throw new Error(`Cannot return ${returnType} in ${method}`)
  }

  const sinapParam = Reflect.getMetadata('design:paramtypes', proto, propName + '')
    // @ts-ignore
    .filter((el: any) => paramTypeMap[el.name] !== undefined)

  if (
    sinapParam &&
    sinapParam.length === 1 &&
    // @ts-ignore
    paramTypeMap[sinapParam[0].name] !== method
  ) {
    throw new Error(
      `Class ${sinapParam[0].name} not compatible with ${method} method`,
    )
  }
}

export const SinapSuggest = (arg?: any) => {
  return constructDecorator(({targetType, proto, propName, paramIndex}) => {
    if (targetType === METHOD) {
      decoratorCompatibilityCheck(proto, propName, 'SinapSuggest')
      JsonRpcMethod(`suggest.${arg}`)(proto, propName!)
    }

    if (targetType === PARAM) {
      // @ts-ignore
      JsonRpcData(ParamMetadataKeys.PARAMS)(proto, propName, paramIndex)
    }
  })()
}

export const SinapContext = (arg?: any) => {
  return constructDecorator(({targetType, proto, propName, paramIndex}) => {
    if (targetType === METHOD) {
      decoratorCompatibilityCheck(proto, propName, 'SinapContext')
      JsonRpcMethod(`context.${arg}`)(proto, propName!)
    }

    if (targetType === PARAM) {
      // @ts-ignore
      JsonRpcData(ParamMetadataKeys.PARAMS)(proto, propName, paramIndex)
    }
  })()
}
