import {SinapError} from '../../main/ts/sinap/error'

describe('Error', () => {
  it('correct chain of inheritance', () => {
    const error = new SinapError(0, 'foo', 'bar', 'baz')
    expect(error).toBeInstanceOf(SinapError)
    expect(error).toBeInstanceOf(Error)
  })

  it('correct work with 4 args', () => {
    const error = new SinapError(SinapError.ACCESS, 'test', 'data', 'localmessage')
    expect(error.code).toBe(-75)
    expect(error.message).toBe('test')
    expect(error.data).toBe('data')
    expect(error.localizedMessages).toBe('localmessage')
  })

  it('correct work with 3 args', () => {
    const error = new SinapError('test', 'code', 'message')
    expect(error.code).toBe(0)
    expect(error.message).toBe('test')
    expect(error.data).toBe('code')
    expect(error.localizedMessages).toBe('message')
  })

  it('static fields', () => {
    expect(SinapError.OK).toBe(0)
    expect(SinapError.SUCCESS).toBe(0)
    expect(SinapError.TIMEOUT).toBe(-1)
    expect(SinapError.PROBLEM).toBe(-3)
    expect(SinapError.ACCOUNT).toBe(-4)
    expect(SinapError.NOT_FOUND).toBe(-5)
    expect(SinapError.FORBIDDEN).toBe(-7)
    expect(SinapError.REQUEST).toBe(-8)
    expect(SinapError.OVERLOAD).toBe(-13)
    expect(SinapError.ACCESS).toBe(-75)
    expect(SinapError.NOT_COMPLETE).toBe(-90)
    expect(SinapError.NOT_IMPLEMENTED).toBe(-130)
    expect(SinapError.FORBIDDEN_COUNTRY).toBe(-131)
    expect(SinapError.CONFIGURATION).toBe(-157)
    expect(SinapError.TOO_LATE).toBe(-171)
    expect(SinapError.NOT_ENOUGH).toBe(-241)
    expect(SinapError.TOO_MUCH).toBe(-242)
    expect(SinapError.REMOTE_DENIAL).toBe(-270)
    expect(SinapError.RESPONSE).toBe(-271)
    expect(SinapError.COMMUNICATION).toBe(-272)
    expect(SinapError.AMOUNT).toBe(-275)
    expect(SinapError.OTHER).toBe(-300)
    expect(SinapError.DEFAULT_CODE).toBe(SinapError.OTHER)
    expect(SinapError.SINAP_UNKNOWN).toBe(-32090)
    expect(SinapError.SINAP_ILLEGAL_ERROR_PARAMS).toBe(-32091)
    expect(SinapError.ERROR_PARAMS_MESSAGE).toBe('Illegal error params')
  })
})
