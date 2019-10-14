import {parse} from 'jsonrpc-lite'

export * from 'jsonrpc-lite'

// TODO refactor after merge https://github.com/teambition/jsonrpc-lite/pull/14
export const parseJsonRpcObject = (body: any) => parse(JSON.stringify(body))
