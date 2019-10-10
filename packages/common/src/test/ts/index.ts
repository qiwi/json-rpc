import {JSON_RPC_METADATA} from '../../main/ts'

describe('index', () => {
  it('exports JSON_RPC_METADATA const', () => {
    expect(JSON_RPC_METADATA).toEqual(expect.any(String))
  })
})
