export declare const JSON_RPC_METADATA: string;
export declare type TRpcMethodEntry = {
    key?: string;
    method?: string;
    args?: Array<string | undefined>;
};
export declare type TRpcMeta = {
    [key: string]: TRpcMethodEntry;
};
export interface ClassType<InstanceType extends Function> extends Function {
    new (...args: any[]): InstanceType;
    prototype: InstanceType;
}
export declare type Extender = <BaseClass extends ClassType<any>>(base: BaseClass) => BaseClass;
//# sourceMappingURL=index.d.ts.map