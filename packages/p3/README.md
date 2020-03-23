# p3-json-rpc
Nestjs JSON RPC 2.0 Controller

## Install
```bash
yarn add p3-json-rpc
npm add p3-json-rpc
```

## Usage
```typescript
import {
  Auth,
  Client,
  ClientAuth,
  P3Provider, Security, SecurityLevelGuard,
  SinapContext,
  SinapContextValue,
  TClient, TSecurity,
  TSinapContext,
  ClientTypeGuard,
} from '@qiwi/p3-json-rpc'
import {RpcId} from 'expressjs-json-rpc'

@P3Provider('/p3-jsonrpc/endpoint')
class CustomController {

  @SecurityLevelGuard(7)
  @ClientTypeGuard('client')
  @SinapContext('method')
  bar(
    @RpcId() id: string,
    @SinapContextValue() value: TSinapContext,
    @Auth() auth: string,
    @ClientAuth() clientAuth: string,
    @Client() client: TClient,
    @Security() security: TSecurity,
  ) {
    return {id, value, auth, clientAuth, client, security}
  }

}
```

## Specification
[https://www.jsonrpc.org/specification](https://www.jsonrpc.org/specification)
