# @qiwi/json-rpc
JSON RPC 2.0 Controller

## Install
```bash
yarn add @qiwi/json-rpc
npm add @qiwi/json-rpc
```

## Usage
```typescript
import {
  JsonRpcMiddleware,
  JsonRpcMethod,
  IJsonRpcId,
  IJsonRpcParams
} from '@qiwi/json-rpc'

@JsonRpcMiddleware()
export class SomeJsonRpcMware {
  @JsonRpcMethod('some-method')
  doSomething(@JsonRpcId() id: IJsonRpcId, @JsonRpcParams() params: IJsonRpcParams) {
    const {foo} = params
    
    if (foo === 'bar') {
      return new JsonRpcError(-100, '"foo" param should not be equal "bar"')
    }
    
    return 'ok'
  }
} 

const jsonRpcMware = new SomeJsonRpcMware().middleware

app.use('/rpc', jsonRpcMware)
```

## Specification
[https://www.jsonrpc.org/specification](https://www.jsonrpc.org/specification)
