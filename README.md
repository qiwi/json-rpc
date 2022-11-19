# @qiwi/json-rpc
Tools, utils and helpers for [JSON RPC 2.0](https://www.jsonrpc.org) integration.

* [nestjs-json-rpc](./packages/nestjs/README.md)
* [expressjs-json-rpc](./packages/expressjs/README.md)

## Status
🚧 Work in progress 🚧 / Experimental / Early preview / pre-alpha version / 0.0.0-draft

## Usage
With [Nestjs](https://nestjs.com/):
```typescript
import {
  JsonRpcController,
  JsonRpcMethod,
  IJsonRpcId,
  IJsonRpcParams
} from 'nestjs-json-rpc'

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

// App.ts
@Module({
  imports: [...],
  controllers: [SomeJsonRpcController],
  providers: [...],
})
export class AppModule {}
```

With [Express](https://expressjs.com/):
```typescript
import {
  JsonRpcMiddleware,
  JsonRpcMethod,
  IJsonRpcId,
  IJsonRpcParams
} from 'expressjs-json-rpc'

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

## License
[MIT](./LICENSE)
