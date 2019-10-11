"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const lodash_1 = require("lodash");
const json_rpc_common_1 = require("@qiwi/json-rpc-common");
function JsonRpcMiddleware() {
    return (target) => {
        const extend = (base) => {
            class Extended extends base {
                middleware({ body }, res) {
                    const { args, handler } = this.constructor.resolveHandler(body, this);
                    const result = handler
                        ? handler.apply(this, args)
                        : {};
                    res.status(200).send(result);
                }
                static resolveHandler(body, instance) {
                    const _method = body.method;
                    const meta = Reflect.getMetadata(json_rpc_common_1.JSON_RPC_METADATA, this) || {};
                    const methodMeta = Object.values(meta)
                        .find(({ method }) => _method === method);
                    if (!methodMeta) {
                        return {};
                    }
                    const propKey = methodMeta.key + '';
                    const handler = this.prototype[propKey];
                    const paramTypes = Reflect.getMetadata('design:paramtypes', instance, propKey);
                    const args = (methodMeta.args || []).map((path, index) => {
                        const data = path ? lodash_1.get(body, path) : body;
                        const DataConstructor = paramTypes[index];
                        return DataConstructor
                            ? new DataConstructor(data)
                            : data;
                    });
                    return {
                        args,
                        handler,
                    };
                }
            }
            return Extended;
        };
        return extend(target);
    };
}
exports.JsonRpcMiddleware = JsonRpcMiddleware;
exports.jsonRpcReq = (valuePath) => (target, propertyKey, index) => {
    const meta = Reflect.getOwnMetadata(json_rpc_common_1.JSON_RPC_METADATA, target.constructor) || {};
    const methodMeta = meta[propertyKey] || {};
    const methodArgs = methodMeta.args || [];
    methodArgs[index] = valuePath;
    methodMeta.args = methodArgs;
    methodMeta.key = propertyKey;
    meta[propertyKey] = methodMeta;
    Reflect.defineMetadata(json_rpc_common_1.JSON_RPC_METADATA, meta, target.constructor);
};
exports.RpcId = () => exports.jsonRpcReq('id');
exports.RpcParams = () => exports.jsonRpcReq('params');
exports.JsonRpcMethod = (method) => {
    return (target, propertyKey) => {
        const meta = Reflect.getOwnMetadata(json_rpc_common_1.JSON_RPC_METADATA, target.constructor) || {};
        const methodMeta = meta[propertyKey] || {};
        methodMeta.method = method;
        methodMeta.key = propertyKey;
        meta[propertyKey] = methodMeta;
        Reflect.defineMetadata(json_rpc_common_1.JSON_RPC_METADATA, meta, target.constructor);
    };
};
//# sourceMappingURL=index.js.map