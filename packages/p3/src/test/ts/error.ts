import {SinapError} from '../../main/ts/sinap/error'

describe('SinapError', () => {

  describe('constructor', () => {
    it('return proper instance', () => {
      const error = new SinapError(0, 'foo', 'bar')
      expect(error).toBeInstanceOf(SinapError)
      expect(error).toBeInstanceOf(Error)
    })

    it('instance contains the correct field with all args', () => {
      const error = new SinapError(-75, 'test', 'data', {foo: 'bar'})
      expect(error.code).toBe(-75)
      expect(error.message).toBe('test')
      expect(error.data).toBe('data')
      expect(error.localizedMessages).toMatchObject({foo: 'bar'})
    })

    it('instance contains the correct field without localizedMessages', () => {
      const error = new SinapError(-75, 'test', 'data')
      expect(error.code).toBe(-75)
      expect(error.message).toBe('test')
      expect(error.data).toBe('data')
      expect(error.localizedMessages).toMatchObject({})
    })

    it('instance contains the correct field without localizedMessages and data', () => {
      const error = new SinapError(-75, 'test')
      expect(error.code).toBe(-75)
      expect(error.message).toBe('test')
      expect(error.data).toBe(undefined)
      expect(error.localizedMessages).toMatchObject({})
    })

    it('instance contains the correct field without localizedMessages, data , message', () => {
      const error = new SinapError(-75)
      expect(error.code).toBe(-75)
      expect(error.message).toBe('')
      expect(error.data).toBe(undefined)
      expect(error.localizedMessages).toMatchObject({})
    })

    it('instance contains the correct field without all args', () => {
      const error = new SinapError()
      expect(error.code).toBe(-300)
      expect(error.message).toBe('')
      expect(error.data).toBe(undefined)
      expect(error.localizedMessages).toMatchObject({})
    })
  })

  describe('static', () => {
    it('class contains correct error codes', () => {
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
})
