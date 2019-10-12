import {JSON_RPC_METADATA, parse, parseObject, JsonRpc} from '../../main/ts'

describe('index', () => {
  it('exports JSON_RPC_METADATA const', () => {
    expect(JSON_RPC_METADATA).toEqual(expect.any(String))
  })

  describe('exposes protocol helpers', () => {
    describe('parse / parseObject', () => {
      it('parses regular request', () => {
        const res = parseObject({
          jsonrpc: '2.0',
          id: 123,
          method: 'update',
          params: {foo: 'bar'}
        })

        expect(res).toEqual({
          type: 'request',
          payload: {
            jsonrpc: JsonRpc.VERSION,
            id: 123,
            method: 'update',
            params: {
              foo: 'bar'
            }
          }
        })
        expect((res as any).payload).toBeInstanceOf(JsonRpc)
      })

      it('request with no args', () => {
        const res = parse('{"jsonrpc":"2.0","id":123,"method":"update"}')

        expect(res).toEqual({
          type: 'request',
          payload: {
            jsonrpc: JsonRpc.VERSION,
            id: 123,
            method: 'update'
          }
        })
      })

      it('notification', () => {
        const res = parse('{"jsonrpc":"2.0","method":"update","params":[]}')

        expect(res).toEqual({
          type: 'notification',
          payload: {
            jsonrpc: JsonRpc.VERSION,
            method: 'update',
            params: []
          }
        })
      })
    })
  })
})
