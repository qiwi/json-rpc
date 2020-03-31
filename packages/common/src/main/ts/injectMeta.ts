import 'reflect-metadata'
import {get, set} from 'lodash'

export function injectMeta(scope: string, path: string, value: unknown, ctor: Function) {
  const meta = Reflect.getOwnMetadata(scope, ctor) || {}
  const prev = get(meta, path)
  set(meta, path, Array.isArray(prev) ? prev.concat(value) : value)
  Reflect.defineMetadata(scope, meta, ctor)
}
