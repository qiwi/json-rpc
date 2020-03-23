import {JsonRpcData} from 'expressjs-json-rpc'

// @ts-ignore
export const Auth = () => JsonRpcData('auth')
// @ts-ignore
export const ClientAuth = () => JsonRpcData('clientAuth')
// @ts-ignore
export const Query = () => JsonRpcData('query')
// @ts-ignore
export const Locale = () => JsonRpcData('locale')
// @ts-ignore
export const Fields = () => JsonRpcData('fields')
// @ts-ignore
export const Client = () => JsonRpcData('client')
// @ts-ignore
export const Security = () => JsonRpcData('security')

export type TQuery = string
export type TFields = Record<string, any> | undefined
export type TLocale = string

export type TClient = {
  clientId: string,
  clientType: string
}

export type TSecurity = {
  security: { level: number }
}
