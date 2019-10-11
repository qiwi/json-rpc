import {JsonRpcController, JSON_RPC_METADATA} from '../../main/ts'

describe('index', () => {
  it('re-exports json-rpc inners', () => {
    expect(JsonRpcController).toEqual(expect.any(Function))
    expect(JSON_RPC_METADATA).toEqual(expect.any(String))
  })
})
