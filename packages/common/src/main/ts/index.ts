export * from './protocol'
export * from './injectMeta'

export const JSON_RPC_METADATA: string = '__json-rpc-metadata__'

export type TRpcMethodParam = {
  index: number,
  type: any,
  value: any
}

export type TRpcMethodEntry = {
  key?: string,
  method?: string,
  params?: Array<TRpcMethodParam>
}

export type TRpcMeta = {
  [key: string]: TRpcMethodEntry
}

export interface ClassType<InstanceType extends Function> extends Function {
  new(...args: any[]): InstanceType
  prototype: InstanceType
}

export type Extender = <BaseClass extends ClassType<any>>(base: BaseClass) => BaseClass
