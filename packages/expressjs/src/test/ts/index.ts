import {foo} from '../../main/ts'

describe('index', () => {
  it('exports foo', () => {
    expect(foo).toBe('bar')
  })
})
