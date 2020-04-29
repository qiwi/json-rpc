const SinapErrorCodes = {
  OK: 0,
  SUCCESS: 0,
  TIMEOUT: -1,
  PROBLEM: -3,
  ACCOUNT: -4,
  NOT_FOUND: -5,
  FORBIDDEN: -7,
  REQUEST: -8,
  OVERLOAD: -13,
  ACCESS: -75,
  NOT_COMPLETE: -90,
  NOT_IMPLEMENTED: -130,
  FORBIDDEN_COUNTRY: -131,
  CONFIGURATION: -157,
  TOO_LATE: -171,
  NOT_ENOUGH: -241,
  TOO_MUCH: -242,
  REMOTE_DENIAL: -270,
  RESPONSE: -271,
  COMMUNICATION: -272,
  AMOUNT: -275,
  OTHER: -300,
  DEFAULT_CODE: -300,
  SINAP_UNKNOWN: -32090,
  SINAP_ILLEGAL_ERROR_PARAMS: -32091,
  ERROR_PARAMS_MESSAGE: 'Illegal error params',
} as const

type SinapErrorCodes = typeof SinapErrorCodes

type SinapErrorCode = SinapErrorCodes[keyof SinapErrorCodes]

type SinapError = {
  code?: SinapErrorCode
  message?: string
  data?: string
  localizedMessages?: Record<string, any> | string
}

type SinapErrorConstructor = SinapErrorCodes & {
  new (
    code?: SinapErrorCode,
    message?: string,
    data?: any,
    localizedMessages?: Record<string, any>,
  ): SinapError
}

// tslint:disable-next-line
export const SinapError: SinapErrorConstructor = Object.assign(class extends Error implements SinapError {
  code?: SinapErrorCode
  data?: string
  localizedMessages?: Record<string, any>

  constructor(
    code?: SinapErrorCode,
    message?: string,
    data?: any,
    localizedMessages?: Record<string, any>) {
    super(message)
    Object.setPrototypeOf(this, SinapError.prototype)

    this.code = code || SinapError.DEFAULT_CODE
    this.data = data
    this.localizedMessages = localizedMessages || {}
  }

}, SinapErrorCodes)
