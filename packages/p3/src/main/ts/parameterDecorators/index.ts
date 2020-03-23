import {JsonRpcData} from 'expressjs-json-rpc'

// @ts-ignore
export const Auth = () => JsonRpcData('auth')
// @ts-ignore
export const ClientAuth = () => JsonRpcData('clientAuth')
// @ts-ignore
export const SinapQuery = () => JsonRpcData('query')
// @ts-ignore
export const SinapLocale = () => JsonRpcData('locale')
// @ts-ignore
export const SinapFields = () => JsonRpcData('fields')
// @ts-ignore
export const Client = () => JsonRpcData('client')
// @ts-ignore
export const Security = () => JsonRpcData('security')

export type TSinapQuery = string
export type TSinapFields = Record<string, any> | undefined
export type TSinapLocale = string

export type TClient = {
  clientId: string,
  clientType: string
}

export type TSecurity = {
  security: { level: number }
}
