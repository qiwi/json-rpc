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
  JsonRpcController,
  JsonRpcMethod,
  IJsonRpcId,
  IJsonRpcParams
} from 'p3-json-rpc'

@JsonRpcController('/jsonrpc/endpoint')
export class SomeJsonRpcController {
  @JsonRpcMethod('some-method')
  doSomething(@JsonRpcId() id: IJsonRpcId, @JsonRpcParams() params: IJsonRpcParams) {
    const {foo} = params
    
    if (foo === 'bar') {
      return new JsonRpcError(-100, '"foo" param should not be equal "bar"')
    }
    
    return 'ok'
  }
} 
```

## Specification
[https://www.jsonrpc.org/specification](https://www.jsonrpc.org/specification)
