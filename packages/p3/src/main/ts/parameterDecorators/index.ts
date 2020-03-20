import {JsonRpcData} from 'expressjs-json-rpc'

// @ts-ignore
export const Auth = () => JsonRpcData('auth')
// @ts-ignore
export const ClientAuth = () => JsonRpcData('clientAuth')
// @ts-ignore
export const SinapContextValue = () => JsonRpcData('sinapContext')
// @ts-ignore
export const SinapSuggestValue = () => JsonRpcData('sinapSuggest')
// @ts-ignore
export const Client = () => JsonRpcData('client')
// @ts-ignore
export const Security = () => JsonRpcData('security')

export type TSinapSuggest = {
  query: string
  fields?: Record<string, any>
  locale: string
}

export type TSinapContext = {
  fields?: Record<string, any>
  locale: string
}

export type TClient = {
  clientId: string,
  clientType: string
}

export type TSecurity = {
  security: { level: number }
}
