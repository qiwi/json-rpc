import {SECURITY_LEVEL_METADATA, CLIENT_TYPE_METADATA} from '../classDecorators'
export const enum ClientTypes {
  SINUP = 'SINAP',
  QD_PROCESSING = 'QD_PROCESSING',
  QW_PROCESSING = 'QW_PROCESSING',
  SCHEDULER = 'SCHEDULER',
  ONE_C = 'ONE_C',
}

export const enum SecurityLevel {
  INSECURE = 0,
  SECURE = 9,
}

export const SecurityLevelGuard = (level: number) => {
  return (target: any, _propertyKey: string) => {
    Reflect.defineMetadata(SECURITY_LEVEL_METADATA, level, target.constructor)
  }
}

export const ClientTypeGuard = (client: string) => {
  return (target: any, _propertyKey: string) => {
    Reflect.defineMetadata(CLIENT_TYPE_METADATA, client, target.constructor)
  }
}
