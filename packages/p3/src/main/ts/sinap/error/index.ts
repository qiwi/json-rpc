
type ErrorCodes = {
  OK: 0,
  SUCCESS: 0,
  TIMEOUT: -1,
  PROBLEM: -3,
  ACCOUNT: -4,
  NOT_FOUND: -5,
  FORBIDDEN: -7
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
  ERROR_PARAMS_MESSAGE: 'Illegal error params'
}

type SinapErrorConstructor = ErrorCodes & {
  // tslint:disable-next-line:no-misused-new
  new (code: ErrorCodes[keyof ErrorCodes] | string, message: string, data: string, localizedMessages?: Record<string, any> | string): any
}

export const SinapError: SinapErrorConstructor = class extends Error {

  code: number
  message: string
  data: string | undefined
  localizedMessages: Record<string, any> | string

  constructor(code: ErrorCodes[keyof ErrorCodes] | string,
               message: string,
               data: string,
               localizedMessages?: Record<string, any> | string) {
    super()
    Object.setPrototypeOf(this, SinapError.prototype)
    if (typeof code === 'string') {
      localizedMessages = data
      data = message
      message = code
      code = 0
    }

    this.code = Math.trunc(code)
    this.message = message.toString()
    this.data = data
    this.localizedMessages = localizedMessages || {}
  }

  static OK: 0 = 0
  static SUCCESS: 0 = 0
  static TIMEOUT: -1 = -1
  static PROBLEM: -3 = -3
  static ACCOUNT: -4 = -4
  static NOT_FOUND: -5 = -5
  static FORBIDDEN: -7 = -7
  static REQUEST: -8 = -8
  static OVERLOAD: -13 = -13
  static ACCESS: -75 = -75
  static NOT_COMPLETE: -90 = -90
  static NOT_IMPLEMENTED: -130 = -130
  static FORBIDDEN_COUNTRY: -131 = -131
  static CONFIGURATION: -157 = -157
  static TOO_LATE: -171 = -171
  static NOT_ENOUGH: -241 = -241
  static TOO_MUCH: -242 = -242
  static REMOTE_DENIAL: -270 = -270
  static RESPONSE: -271 = -271
  static COMMUNICATION: -272 = -272
  static AMOUNT: -275 = -275
  static OTHER: -300 = -300
  static DEFAULT_CODE: -300 = -300
  static SINAP_UNKNOWN: -32090 = -32090
  static SINAP_ILLEGAL_ERROR_PARAMS: -32091 = -32091
  static ERROR_PARAMS_MESSAGE: 'Illegal error params' = 'Illegal error params'

}
