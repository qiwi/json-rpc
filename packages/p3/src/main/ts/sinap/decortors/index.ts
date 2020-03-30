import {constructDecorator, METHOD, PARAM} from '@qiwi/decorator-utils'
import {JsonRpcMethod} from 'nestjs-json-rpc'
import {JsonRpcData} from 'expressjs-json-rpc'

export type TSinapSuggest = {
  query: string
  fields?: Record<string, any>
  locale: string
}

export type TSinapContext = {
  fields?: Record<string, any>
  locale: string
}

export const SinapSuggest = (arg?: any) => {
  return constructDecorator(({targetType, proto, propName, paramIndex}) => {
    if (targetType === METHOD) {
      JsonRpcMethod(`suggest.${arg}`)(proto, propName!)
    }

    if (targetType === PARAM) {
      // @ts-ignore
      JsonRpcData('params')(proto, propName, paramIndex)
    }
  })()
}

export const SinapContext = (arg?: any) => {
  return constructDecorator(({targetType, proto, propName, paramIndex}) => {
    if (targetType === METHOD) {
      JsonRpcMethod(`context.${arg}`)(proto, propName!)
    }

    if (targetType === PARAM) {
      // @ts-ignore
      JsonRpcData('params')(proto, propName, paramIndex)
    }
  })()
}
