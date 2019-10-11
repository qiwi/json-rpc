import 'reflect-metadata';
export declare function JsonRpcMiddleware(): ClassDecorator;
export declare const jsonRpcReq: (valuePath?: string | undefined) => (target: Object, propertyKey: string, index: number) => void;
export declare const RpcId: () => (target: Object, propertyKey: string, index: number) => void;
export declare const RpcParams: () => (target: Object, propertyKey: string, index: number) => void;
export declare const JsonRpcMethod: (method: string) => (target: any, propertyKey: string) => void;
//# sourceMappingURL=index.d.ts.map