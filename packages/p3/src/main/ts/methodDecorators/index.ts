import {JsonRpcMethod} from 'nestjs-json-rpc'

export const SinupSuggest = (method: string) => JsonRpcMethod(`suggest.${method}`)
export const SinupContext = (method: string) => JsonRpcMethod(`context.${method}`)
