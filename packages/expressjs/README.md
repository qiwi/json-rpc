# expressjs-json-rpc
Expressjs JSON RPC 2.0 Controller

## Install
```bash
yarn add expressjs-json-rpc
npm add expressjs-json-rpc
```

## Usage
```typescript
import {
  JsonRpcMiddleware,
  JsonRpcMethod,
  IJsonRpcId,
  IJsonRpcParams
} from 'nestjs-json-rpc'

import {
  RpcId, Req, Res, Headers,
} from 'expressjs-json-rpc'

@JsonRpcMiddleware()
export class SomeJsonRpcMware {
  @JsonRpcMethod('some-method')
  doSomething(
    @JsonRpcId() id: IJsonRpcId,
    @JsonRpcParams() params: IJsonRpcParams,
    @Req() req: IRequest,
    @Res() res: IRequest,
    @Headers() headers: any
  ) {
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

### Decorators
| Param decorator         | Value                           |
|-------------------------|---------------------------------|
| @Req()                  | req                             |
| @Res()                  | res                             |
| @Next()                 | next                            |
| @Body(key?: string)     | req.body / req.body[key]        |
| @Param(key?: string)    | req.params / req.params[key]    |
| @Query(key?: string)    | req.query / req.query[key]      |
| @Headers(name?: string) | req.headers / req.headers[name] |
| @Ip()                   | req.ip                          |

## Specification
[https://www.jsonrpc.org/specification](https://www.jsonrpc.org/specification)
