import 'reflect-metadata'
import {get, set} from 'lodash'

export function injectMeta(path: string, value: unknown, ctor: Function, scope: string) {
  const meta = Reflect.getOwnMetadata(scope, ctor) || {}
  const prev = get(meta, path)
  set(meta, path, Array.isArray(prev) ? prev.concat(value) : value)
  Reflect.defineMetadata(scope, meta, ctor)
}
