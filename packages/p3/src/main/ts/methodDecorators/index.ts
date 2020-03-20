import {JsonRpcMethod} from 'nestjs-json-rpc'

export const SinapSuggest = (method: string) => JsonRpcMethod(`suggest.${method}`)
export const SinapContext = (method: string) => JsonRpcMethod(`context.${method}`)
